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

// Oyin approves In Review → Approved (author notified, eligible for scheduling).
export async function POST(req) {
  const me = await currentUser();
  if (!me || me.role !== "reviewer") return NextResponse.json({ error: "Reviewer only" }, { status: 403 });
  const { id, edited } = await req.json();
  const c = await getContent(id);
  if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (c.authorEmail === me.email) return NextResponse.json({ error: "Oyin posts skip approval" }, { status: 400 });
  if (c.status !== "In Review") return NextResponse.json({ error: `Cannot approve from ${c.status}` }, { status: 400 });
  const patch = { status: "Approved" };
  if (edited?.linkedin) patch.linkedin = edited.linkedin;
  if (edited?.carousel) patch.carousel = edited.carousel;
  if (edited?.thread) patch.thread = edited.thread;
  const updated = await updateContent(id, patch, me.email);
  await addAudit(me.email, "approved", id);
  await notify(c.authorEmail, `Your content was approved by Oyin`, `<p>Oyin approved your content. You can now schedule it.</p>`);
  return NextResponse.json({ ok: true, status: updated?.status || "Approved" });
}
