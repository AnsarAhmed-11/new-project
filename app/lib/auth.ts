import { cookies } from "next/headers";
import { createHash, randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { db } from "@/app/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { findAdminByEmail } from "@/app/models/adminModel";

const COOKIE = "__Host-merciful_admin";
const ISSUER = "merciful-tools";
const AUDIENCE = "merciful-admin";
const SESSION_DAYS = 7;
type AdminClaims = JWTPayload & { email: string; name: string; role: "admin" };

function getSecret() {
  const value = process.env.AUTH_SECRET || process.env.JWT_SECRET_KEY;
  if (!value || value.length < 32)
    throw new Error(
      "AUTH_SECRET or JWT_SECRET_KEY must be at least 32 characters.",
    );
  return new TextEncoder().encode(value);
}
function hashSessionId(id: string) {
  return createHash("sha256").update(id).digest("hex");
}
async function createToken(
  user: {
    id: number;
    name: string;
    email: string;
  },
  sessionId: string,
) {
  return new SignJWT({
    email: user.email,
    name: user.name,
    role: "admin",
  } satisfies AdminClaims)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(String(user.id))
    .setJti(sessionId)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecret());
}
async function readToken(token: string) {
  try {
    return (
      await jwtVerify<AdminClaims>(token, getSecret(), {
        algorithms: ["HS256"],
        issuer: ISSUER,
        audience: AUDIENCE,
      })
    ).payload;
  } catch {
    return null;
  }
}

export async function authenticateAdmin(email: string, password: string) {
  const user = await findAdminByEmail(email.trim().toLowerCase());
  if (!user || !(await bcrypt.compare(password, user.passwordHash)))
    return null;
  const sessionId = randomUUID();
  await db.execute<ResultSetHeader>(
    "INSERT INTO admin_sessions (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))",
    [user.id, hashSessionId(sessionId)],
  );
  const token = await createToken(user, sessionId);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
  return { id: user.id, name: user.name, email: user.email };
}
export async function getAdmin() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const claims = await readToken(token);
  const userId = Number(claims?.sub);
  const sessionId = claims?.jti;
  if (!claims || !sessionId || !Number.isInteger(userId) || userId <= 0)
    return null;
  const [rows] = await db.execute<
    (RowDataPacket & { id: number; name: string; email: string })[]
  >(
    "SELECT u.id, u.name, u.email FROM admin_sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.user_id = ? AND s.expires_at > NOW() LIMIT 1",
    [hashSessionId(sessionId), userId],
  );
  return rows[0]
    ? { id: rows[0].id, name: rows[0].name, email: rows[0].email }
    : null;
}
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) throw new Error("UNAUTHORIZED");
  return admin;
}
export async function clearAdminSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  const claims = token ? await readToken(token) : null;
  if (claims?.jti)
    await db.execute("DELETE FROM admin_sessions WHERE token_hash = ?", [
      hashSessionId(claims.jti),
    ]);
  jar.delete(COOKIE);
}
