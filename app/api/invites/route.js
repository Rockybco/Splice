import { NextResponse } from "next/server";
import { currentUser } from "@/lib/guard";
import { createInvite, listInvites } from "@/lib/store";

const appUrl = () => (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");

// GET — admin lists invites.
export async function GET() {
  const me = await currentUser();
  if (!me || me.role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });
  return NextResponse.json({ ok: true, invites: await listInvites() });
}

// POST { email, role } — admin invites someone (creator/reviewer). Returns shareable link.
export async function POST(req) {
  const me = await currentUser();
  if (!me || me.role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });
  const { email, role } = await req.json();
  if (!email || !email.includes("@")) return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  const inv = await createInvite({ email: email.toLowerCase().trim(), role, invitedBy: me.email });
  const link = `${appUrl()}/auth/invite/${inv.token}`;
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      await new Resend(process.env.RESEND_API_KEY).emails.send({
        from: "Splice <onboarding@resend.dev>",
        to: inv.email,
        subject: `You're invited to Splice 🧵`,
        html: `<p>${me.name || me.email} invited you to join Splice as <b>${inv.role}</b>.</p><p><a href="${link}">Accept invite →</a></p><p>Or paste this link: ${link}</p>`,
      });
    } catch (e) { console.error("Invite mail failed:", e?.message); }
  }
  return NextResponse.json({ ok: true, link, role: inv.role, mailed: !!process.env.RESEND_API_KEY });
}
