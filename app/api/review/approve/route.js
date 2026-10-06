import { NextResponse } from "next/server";
import { loadDb, saveDb, audit, currentUser } from "@/lib/guard";

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
  const me = currentUser();
  if (!me || me.role !== "reviewer") return NextResponse.json({ error: "Reviewer only" }, { status: 403 });
  const { id, edited } = await req.json();
  const db = loadDb();
  const c = db.contents.find((x) => x.id === id);
  if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (c.authorEmail === me.email) return NextResponse.json({ error: "Oyin posts skip approval" }, { status: 400 });
  if (c.status !== "In Review") return NextResponse.json({ error: `Cannot approve from ${c.status}` }, { status: 400 });
  if (edited?.linkedin) c.linkedin = edited.linkedin;
  if (edited?.carousel) c.carousel = edited.carousel;
  if (edited?.thread) c.thread = edited.thread;
  c.status = "Approved";
  c.reviewer = me.email;
  audit(db, me.email, "approved", id);
  saveDb(db);
  await notify(c.authorEmail, `Your content was approved by Oyin (${id})`, `<p>Oyin approved <b>${id}</b>. You can now schedule it.</p>`);
  return NextResponse.json({ ok: true, status: c.status });
}
