import { NextResponse } from "next/server";
import { currentUser } from "@/lib/guard";
import { getContent, updateContent, getSocialAccount, addAudit } from "@/lib/store";
import { supabaseServer } from "@/lib/supabase";

async function logPublish(contentId, platform, status, response) {
  try {
    const sb = supabaseServer();
    if (sb) await sb.from("publish_logs").insert({ content_id: contentId, platform, status, response });
  } catch (e) { console.error("publish log failed:", e?.message); }
}

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
  const acct = await getSocialAccount(me.id, "linkedin");
  if (!acct?.access_token_enc) return NextResponse.json({ error: "LinkedIn not connected", connect: true }, { status: 400 });
  if (acct.expires_at && new Date(acct.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: "LinkedIn token expired — reconnect", connect: true }, { status: 400 });
  }
  const sub = acct.meta?.sub;
  if (!sub) return NextResponse.json({ error: "LinkedIn person id missing — reconnect" }, { status: 400 });

  try {
    const r = await fetch("https://api.linkedin.com/v2/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${acct.access_token_enc}`,
        "Content-Type": "application/json",
        "LinkedIn-Version": "202406",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        author: `urn:li:person:${sub}`,
        commentary: c.linkedin || c.original,
        visibility: "PUBLIC",
        distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
        lifecycleState: "PUBLISHED",
        isReshareDisabledByAuthor: false,
      }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.message || `LinkedIn HTTP ${r.status}`);
    const postUrn = j.id || "";
    await updateContent(id, { status: "Published" });
    await logPublish(c.id.startsWith("SP-") ? null : c.id, "linkedin", "Published", { urn: postUrn });
    await addAudit(me.email, "published-linkedin", `${id} ${postUrn}`);
    return NextResponse.json({ ok: true, urn: postUrn, url: postUrn ? `https://www.linkedin.com/feed/update/${encodeURIComponent(postUrn)}/` : "" });
  } catch (e) {
    console.error("LinkedIn publish failed:", e?.message);
    await logPublish(c.id.startsWith("SP-") ? null : c.id, "linkedin", "Failed", { error: e?.message });
    return NextResponse.json({ error: e?.message || "Publish failed" }, { status: 502 });
  }
}
