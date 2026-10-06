import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signSession, COOKIE } from "@/lib/auth";
import { getUserByEmail, createUser, setVerified, getInviteByToken, acceptInvite } from "@/lib/store";

// No-OTP signup (locked): create account → welcome email → instant session → onboarding.
// Optional invite token grants creator/reviewer role (never admin).
export async function POST(req) {
  const { email, name, password, invite } = await req.json();
  if (!email || !password || password.length < 6) {
    return NextResponse.json({ error: "Name, email and password (min 6 chars) required" }, { status: 400 });
  }
  const existing = await getUserByEmail(email);
  if (existing) return NextResponse.json({ error: "Account exists — log in instead", login: true }, { status: 409 });
  let role = "creator";
  if (invite) {
    const inv = await getInviteByToken(invite);
    if (!inv || inv.accepted || inv.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ error: "Invite invalid, used, or for a different email" }, { status: 400 });
    }
    role = inv.role === "reviewer" ? "reviewer" : "creator";
  }
  // Public signup is creator-only unless a valid invite grants reviewer.
  // Admin accounts are seeded privately (scripts/seed-admins.mjs).
  const u = await createUser({ email, name: name || email.split("@")[0], role, passwordHash: await bcrypt.hash(password, 10) });
  if (invite) await acceptInvite(invite);
  // Verified immediately — no OTP in this flow.
  await setVerified(email);

  // Best-effort welcome email (never blocks signup).
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
        from: "Splice <onboarding@resend.dev>",
        to: email,
        subject: "Welcome to Splice 🧵",
        html: `<h2>Welcome to Splice, ${u.name} 🧵</h2><p>Your workspace is ready. Paste a LinkedIn post and we'll handle the rest.</p><p><a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/onboarding/step-1">Set up your brand voice →</a></p>`,
      });
      if (error) console.error("Welcome mail failed:", error.message || error);
    } catch (e) { console.error("Welcome mail failed:", e?.message); }
  }

  const fresh = (await getUserByEmail(email)) || u;
  const token = signSession({ id: fresh.id, email: fresh.email, role: fresh.role, name: fresh.name });
  const res = NextResponse.json({ ok: true, role: fresh.role });
  res.cookies.set(COOKIE, token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 12 });
  return res;
}
