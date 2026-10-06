import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { checkOtp, getUserByEmail, setPassword, addAudit } from "@/lib/store";

export async function POST(req) {
  const { email, code, password } = await req.json();
  if (!(await checkOtp(email, code, "reset"))) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
  }
  const u = await getUserByEmail(email);
  if (!u) return NextResponse.json({ error: "No account" }, { status: 404 });
  await setPassword(email, await bcrypt.hash(password || "splice-dev", 10));
  await addAudit(email, "password-reset", "via OTP");
  return NextResponse.json({ ok: true });
}
