// Shared LinkedIn publisher (used by manual post + cron). Never throws — returns {ok, urn?, url?, error?}.
import { getSocialAccount } from "./store";
import { supabaseServer } from "./supabase";

export async function logPublish(contentIdOrNull, platform, status, response) {
  try {
    const sb = supabaseServer();
    if (sb) await sb.from("publish_logs").insert({ content_id: contentIdOrNull, platform, status, response });
  } catch (e) { console.error("publish log failed:", e?.message); }
}

export async function publishToLinkedIn({ content, author }) {
  const acct = await getSocialAccount(author.id, "linkedin");
  if (!acct?.access_token_enc) return { ok: false, error: "LinkedIn not connected", connect: true };
  if (acct.expires_at && new Date(acct.expires_at).getTime() < Date.now()) {
    return { ok: false, error: "LinkedIn token expired — reconnect", connect: true };
  }
  const sub = acct.meta?.sub;
  if (!sub) return { ok: false, error: "LinkedIn person id missing — reconnect", connect: true };
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
        commentary: content.linkedin || content.original,
        visibility: "PUBLIC",
        distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
        lifecycleState: "PUBLISHED",
        isReshareDisabledByAuthor: false,
      }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.message || `LinkedIn HTTP ${r.status}`);
    const urn = j.id || "";
    return { ok: true, urn, url: urn ? `https://www.linkedin.com/feed/update/${encodeURIComponent(urn)}/` : "" };
  } catch (e) {
    return { ok: false, error: e?.message || "Publish failed" };
  }
}
