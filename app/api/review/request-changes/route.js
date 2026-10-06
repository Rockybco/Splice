import { NextResponse } from "next/server";
import { currentUser } from "@/lib/guard";
import { getContent, updateContent, addAudit } from "@/lib/store";

async function notify(email, subject, html) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    const { Resend } = await import("resend");
    await new Resend(process.env.RESEND_API_KEY).emails.send({ from: "Splice <onboarding@resend.dev>", to: email, subject, html });
  } catch (e) {
    console.error("Resend notify failed:", e?.message);
  }
}

// Oyin requests changes: In Review → Changes Requested + feedback emailed.
export async function POST(req) {
  const me = await currentUser();
  if (!me || me.role !== "reviewer") return NextResponse.json({ error: "Reviewer only" }, { status: 403 });
  const { id, feedback } = await req.json();
  if (!feedback || feedback.length > 500) return NextResponse.json({ error: "Feedback required (max 500 chars)" }, { status: 400 });
  const c = await getContent(id);
  if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (c.status !== "In Review") return NextResponse.json({ error: `Cannot request changes from ${c.status}` }, { status: 400 });
  const updated = await updateContent(id, { status: "Changes Requested", feedback }, me.email);
  await addAudit(me.email, "requested-changes", `${id}: ${feedback.slice(0, 80)}`);
  await notify(c.authorEmail, `Oyin requested changes`, `<p>Oyin requested changes:</p><blockquote>${feedback}</blockquote>`);
  return NextResponse.json({ ok: true, status: updated?.status || "Changes Requested" });
}
