import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "@/app/lib/db";
import { hashPassword } from "@/app/api/auth/password";

export type UserRecord = {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
};

type UserRow = RowDataPacket & {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  password_salt: string;
};

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function findUserByEmail(email: string) {
  const [rows] = await db.execute<UserRow[]>(
    "SELECT id, name, email, password_hash, password_salt FROM users WHERE email = ? LIMIT 1",
    [normalizeEmail(email)],
  );
  const user = rows[0];

  if (!user) {
    return null;
  }

  return toUserRecord(user);
}

export async function insertUser(name: string, email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  const { passwordHash, salt } = hashPassword(password);
  const [result] = await db.execute<ResultSetHeader>(
    "INSERT INTO users (name, email, password_hash, password_salt) VALUES (?, ?, ?, ?)",
    [name.trim(), normalizedEmail, passwordHash, salt],
  );

  return {
    id: result.insertId,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    passwordSalt: salt,
  } satisfies UserRecord;
}

function toUserRecord(user: UserRow): UserRecord {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    passwordHash: user.password_hash,
    passwordSalt: user.password_salt,
  };
}
