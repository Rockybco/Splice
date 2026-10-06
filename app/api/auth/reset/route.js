import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { loadDb, saveDb, audit } from "@/lib/guard";

export async function POST(req) {
  const { email, code, password } = await req.json();
  const db = loadDb();
  const o = db.otps.find((x) => x.email === email && x.kind === "reset");
  if (!o || o.code !== code || o.exp < Date.now()) return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
  const u = db.users.find((x) => x.email === email);
  if (!u) return NextResponse.json({ error: "No account" }, { status: 404 });
  u.passwordHash = await bcrypt.hash(password || "splice-dev", 10);
  u.verified = true;
  db.otps = db.otps.filter((x) => x.email !== email);
  audit(db, email, "password-reset", "via OTP");
  saveDb(db);
  return NextResponse.json({ ok: true });
}
