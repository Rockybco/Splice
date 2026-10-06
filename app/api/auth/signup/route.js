import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByEmail, createUser, saveOtp } from "@/lib/store";

export async function POST(req) {
  const { email, name, password = "splice-dev" } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
  let u = await getUserByEmail(email);
  if (!u) {
    const role = email.includes("oyin") ? "reviewer" : email.includes("rockyb") ? "admin" : "creator";
    u = await createUser({ email, name: name || email.split("@")[0], role, passwordHash: await bcrypt.hash(password, 10) });
  }
  const code = String(Math.floor(100000 + Math.random() * 900000));
  await saveOtp({ email, code, kind: "signup" });
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: "Splice <onboarding@resend.dev>",
        to: email,
        subject: "Your Splice access code",
        html: `<h2>Welcome to Splice 🧵</h2><p>Your 6-digit access code is:</p><h1>${code}</h1><p>Expires in 10 minutes. 3 attempts max.</p>`,
      });
      if (error) throw new Error(typeof error === "object" ? error.message || JSON.stringify(error) : error);
      return NextResponse.json({ ok: true });
    } catch (e) {
      console.error("Resend failed, falling back to devCode:", e?.message);
      return NextResponse.json({ ok: true, devCode: code, emailWarning: `Email send failed (${e?.message}). Use dev code.` });
    }
  }
  return NextResponse.json({ ok: true, devCode: code });
}
