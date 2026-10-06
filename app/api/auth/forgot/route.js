import { NextResponse } from "next/server";
import { getUserByEmail, saveOtp } from "@/lib/store";

export async function POST(req) {
  const { email } = await req.json();
  const u = await getUserByEmail(email);
  if (!u) return NextResponse.json({ error: "No account with that email" }, { status: 404 });
  const code = String(Math.floor(100000 + Math.random() * 900000));
  await saveOtp({ email, code, kind: "reset" });
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
        from: "Splice <onboarding@resend.dev>",
        to: email,
        subject: "Reset your Splice password",
        html: `<p>Your reset code:</p><h1>${code}</h1><p>Expires in 10 minutes.</p>`,
      });
      if (error) throw new Error(typeof error === "object" ? error.message || JSON.stringify(error) : error);
      return NextResponse.json({ ok: true });
    } catch (e) {
      console.error("Resend forgot failed:", e?.message);
      return NextResponse.json({ ok: true, devCode: code, emailWarning: `Email send failed (${e?.message}). Use dev code.` });
    }
  }
  return NextResponse.json({ ok: true, devCode: code });
}
