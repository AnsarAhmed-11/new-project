import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

type User = {
  name: string;
  email: string;
  salt: string;
  passwordHash: string;
};

const users = new Map<string, User>();

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function createUser(name: string, email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  const salt = randomBytes(16).toString("hex");
  const passwordHash = scryptSync(password, salt, 64).toString("hex");

  const user = { name: name.trim(), email: normalizedEmail, salt, passwordHash };
  users.set(normalizedEmail, user);
  return user;
}

export function findUser(email: string) {
  return users.get(normalizeEmail(email));
}

export function verifyPassword(password: string, user: User) {
  const passwordHash = scryptSync(password, user.salt, 64);
  const storedHash = Buffer.from(user.passwordHash, "hex");

  return storedHash.length === passwordHash.length && timingSafeEqual(storedHash, passwordHash);
}
