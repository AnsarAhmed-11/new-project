import { cookies } from "next/headers";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { db } from "@/app/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { findAdminByEmail } from "@/app/models/adminModel";

const COOKIE = "merciful_admin_session";
const DAYS = 7;

export async function authenticateAdmin(email: string, password: string) {
  const user = await findAdminByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return null;
  const raw = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  await db.execute<ResultSetHeader>("INSERT INTO admin_sessions (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))", [user.id, hash]);
  (await cookies()).set(COOKIE, raw, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: DAYS * 86400 });
  return {
    id: user.id, name: user.name, email: user.email
  };
}

export async function getAdmin() {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  const [rows] = await db.execute<(RowDataPacket & { id: number; name: string; email: string })[]>("SELECT u.id, u.name, u.email FROM admin_sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > NOW() LIMIT 1", [hash]);
  return rows[0] ? { id: rows[0].id, name: rows[0].name, email: rows[0].email } : null;
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) throw new Error("UNAUTHORIZED");
  return admin;
}
export async function clearAdminSession() {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (raw) {
    const hash = crypto.createHash("sha256").update(raw).digest("hex");
    await db.execute("DELETE FROM admin_sessions WHERE token_hash = ?", [hash]);
  } jar.delete(COOKIE);
}
