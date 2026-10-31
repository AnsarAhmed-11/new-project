import bcrypt from "bcryptjs";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "@/app/lib/db";

export type AdminRecord = { id: number; name: string; email: string; passwordHash: string };
type AdminRow = RowDataPacket & { id: number; name: string; email: string; password_hash: string };

export async function findAdminByEmail(email: string): Promise<AdminRecord | null> {
  const [rows] = await db.execute<AdminRow[]>("SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1", [email.trim().toLowerCase()]);
  const admin = rows[0];
  return admin ? {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    passwordHash: admin.password_hash
  } : null;
}

export async function createInitialAdmin(name: string, email: string, password: string) {
  const hash = await bcrypt.hash(password, 12);
  const [result] = await db.execute<ResultSetHeader>("INSERT INTO users (name, email, password_hash, password_salt) VALUES (?, ?, ?, ?)", [name.trim(), email.trim().toLowerCase(), hash, ""]);
  return result.insertId;
}
