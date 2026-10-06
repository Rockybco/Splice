import { NextResponse } from "next/server";
import { checkPassword, signSession, COOKIE } from "@/lib/auth";
import { getUserByEmail } from "@/lib/store";

export async function POST(req) {
  const { email, password } = await req.json();
  const u = await getUserByEmail(email);
  if (!u || !(await checkPassword(password || "", u.passwordHash || ""))) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
  if (!u.verified) return NextResponse.json({ error: "Verify your email OTP first", verify: true }, { status: 403 });
  const token = signSession({ id: u.id, email: u.email, role: u.role, name: u.name });
  const res = NextResponse.json({ ok: true, role: u.role });
  res.cookies.set(COOKIE, token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 12 });
  return res;
}
