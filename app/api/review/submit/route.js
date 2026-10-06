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

// Creator submits Draft/Changes Requested → In Review (Oyin notified).
export async function POST(req) {
  const me = currentUser();
  if (!me) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const { id } = await req.json();
  const db = loadDb();
  const c = db.contents.find((x) => x.id === id);
  if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!["Draft", "Changes Requested"].includes(c.status)) return NextResponse.json({ error: `Cannot submit from ${c.status}` }, { status: 400 });
  c.status = "In Review";
  audit(db, me.email, "submitted-for-review", id);
  saveDb(db);
  const oyin = db.users.find((u) => u.role === "reviewer");
  if (oyin) await notify(oyin.email, `New content to review (${id})`, `<p>${me.name || me.email} submitted <b>${id}</b> for review.</p><p>${(c.original || "").slice(0, 200)}…</p>`);
  return NextResponse.json({ ok: true, status: c.status });
}
