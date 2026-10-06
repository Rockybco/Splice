import { NextResponse } from "next/server";
import { signSession, COOKIE } from "@/lib/auth";
import { checkOtp, getUserByEmail, setVerified } from "@/lib/store";

export async function POST(req) {
  const { email, code } = await req.json();
  if (!(await checkOtp(email, code, "signup"))) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
  }
  await setVerified(email);
  const u = await getUserByEmail(email);
  if (!u) return NextResponse.json({ error: "Account missing" }, { status: 404 });
  const token = signSession({ id: u.id, email: u.email, role: u.role, name: u.name });
  const res = NextResponse.json({ ok: true, role: u.role });
  res.cookies.set(COOKIE, token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 12 });
  return res;
}
