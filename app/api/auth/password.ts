import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const passwordHash = scryptSync(password, salt, 64).toString("hex");

  return { passwordHash, salt };
}

export function verifyPassword(password: string, passwordHash: string, salt: string) {
  const calculatedHash = scryptSync(password, salt, 64);
  const storedHash = Buffer.from(passwordHash, "hex");

  return storedHash.length === calculatedHash.length && timingSafeEqual(storedHash, calculatedHash);
}
