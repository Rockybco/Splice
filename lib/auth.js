import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "splice-dev-secret-change-me";
export const COOKIE = "splice_session";

export async function hashPassword(pw) {
  return bcrypt.hash(pw, 10);
}

export async function checkPassword(pw, hash) {
  return bcrypt.compare(pw, hash);
}

export function signSession(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "12h" });
}

export function verifySession(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
