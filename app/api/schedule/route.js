import { NextResponse } from "next/server";
import { currentUser } from "@/lib/guard";
import { getContent, updateContent, addAudit } from "@/lib/store";

// POST { id, scheduled_for } — schedule Approved (or Oyin-own) content for LinkedIn auto-publish.
// POST { id, cancel: true } — back to Approved.
export async function POST(req) {
  const me = await currentUser();
  if (!me) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const { id, scheduled_for, cancel } = await req.json();
  const c = await getContent(id);
  if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const isOwnOyin = me.role === "reviewer" && c.authorEmail === me.email;
  if (cancel) {
    if (c.status !== "Scheduled") return NextResponse.json({ error: `Nothing to cancel (now: ${c.status})` }, { status: 400 });
    await updateContent(id, { status: "Approved", scheduled_for: null });
    await addAudit(me.email, "schedule-cancelled", id);
    return NextResponse.json({ ok: true, status: "Approved" });
  }
  if (!isOwnOyin && c.status !== "Approved") {
    return NextResponse.json({ error: `Only Approved content can be scheduled (now: ${c.status})` }, { status: 400 });
  }
  const when = new Date(scheduled_for);
  if (isNaN(when.getTime()) || when.getTime() < Date.now() - 60000) {
    return NextResponse.json({ error: "Pick a future date/time" }, { status: 400 });
  }
  await updateContent(id, { status: "Scheduled", scheduled_for: when.toISOString() });
  await addAudit(me.email, "scheduled", `${id} for ${when.toISOString()}`);
  return NextResponse.json({ ok: true, status: "Scheduled", scheduled_for: when.toISOString() });
}
