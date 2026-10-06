import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { signSession, COOKIE } from "@/lib/auth";

const DB = path.join(process.cwd(), "splice", "data", "db.json");
function load() {
  try { return JSON.parse(fs.readFileSync(DB, "utf-8")); }
  catch { return { users: [], otps: [], contents: [] }; }
}
function save(db) {
  fs.mkdirSync(path.dirname(DB), { recursive: true });
  fs.writeFileSync(DB + ".tmp", JSON.stringify(db, null, 2));
  fs.renameSync(DB + ".tmp", DB);
}
export async function POST(req) {
  const { email, code } = await req.json();
  const db = load();
  const o = db.otps.find((x) => x.email === email);
  if (!o || o.code !== code || o.exp < Date.now()) return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
  const u = db.users.find((x) => x.email === email);
  if (u) u.verified = true;
  db.otps = db.otps.filter((x) => x.email !== email);
  save(db);
  const token = signSession({ id: u.id, email: u.email, role: u.role, name: u.name });
  const res = NextResponse.json({ ok: true, role: u.role });
  res.cookies.set(COOKIE, token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 12 });
  return res;
}
