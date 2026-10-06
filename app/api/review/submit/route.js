import { NextResponse } from "next/server";
import { currentUser } from "@/lib/guard";
import { getContent, updateContent, listUsers, addAudit } from "@/lib/store";

async function notify(email, subject, html) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    const { Resend } = await import("resend");
    await new Resend(process.env.RESEND_API_KEY).emails.send({ from: "Splice <onboarding@resend.dev>", to: email, subject, html });
  } catch (e) {
    console.error("Resend notify failed:", e?.message);
  }
}

// Creator submits Draft/Changes Requested → In Review (Oyin notified).
export async function POST(req) {
  const me = await currentUser();
  if (!me) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const { id } = await req.json();
  const c = await getContent(id);
  if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!["Draft", "Changes Requested"].includes(c.status)) return NextResponse.json({ error: `Cannot submit from ${c.status}` }, { status: 400 });
  const updated = await updateContent(id, { status: "In Review" });
  await addAudit(me.email, "submitted-for-review", id);
  const users = await listUsers();
  const oyin = users.find((u) => u.role === "reviewer");
  if (oyin) await notify(oyin.email, `New content to review`, `<p>${me.name || me.email} submitted content for review.</p><p>${(c.original || "").slice(0, 200)}…</p>`);
  return NextResponse.json({ ok: true, status: updated?.status || "In Review" });
}
