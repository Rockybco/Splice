import { NextResponse } from "next/server";
import { currentUser } from "@/lib/guard";
import { getContent, updateContent, addAudit } from "@/lib/store";
import { publishToLinkedIn, logPublish } from "@/lib/publish";

// POST { id } — publish approved content (or Oyin's own) to LinkedIn via OAuth v2 Posts API.
export async function POST(req) {
  const me = await currentUser();
  if (!me) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const { id } = await req.json();
  const c = await getContent(id);
  if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const isOwnOyin = me.role === "reviewer" && c.authorEmail === me.email;
  if (!isOwnOyin && c.status !== "Approved") {
    return NextResponse.json({ error: `Needs Oyin approval (now: ${c.status})` }, { status: 400 });
  }
  const out = await publishToLinkedIn({ content: c, author: me });
  if (!out.ok && out.connect) return NextResponse.json(out, { status: 400 });
  if (!out.ok) {
    await logPublish(c.id.startsWith("SP-") ? null : c.id, "linkedin", "Failed", { error: out.error });
    return NextResponse.json({ error: out.error }, { status: 502 });
  }
  await updateContent(id, { status: "Published" });
  await logPublish(c.id.startsWith("SP-") ? null : c.id, "linkedin", "Published", { urn: out.urn });
  await addAudit(me.email, "published-linkedin", `${id} ${out.urn}`);
  return NextResponse.json({ ok: true, urn: out.urn, url: out.url });
}
