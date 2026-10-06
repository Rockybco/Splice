// Best-effort mirror: local JSON stays primary (instant, offline-safe),
// Supabase gets a copy for oversight/analytics. Never throws.
import { supabaseServer } from "./supabase";

async function profileId(sb, email, name, role) {
  const { data: ex } = await sb.from("profiles").select("id").eq("email", email).maybeSingle();
  if (ex?.id) return ex.id;
  const { data, error } = await sb
    .from("profiles")
    .insert({ email, display_name: name || email.split("@")[0], handle: (name || email.split("@")[0]).toLowerCase().replace(/[^a-z0-9_]/g, ""), role: ["creator", "reviewer", "admin"].includes(role) ? role : "creator" })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export function mirrorProfile(u) {
  (async () => {
    const sb = supabaseServer();
    if (!sb) return;
    const pid = await profileId(sb, u.email, u.name, u.role);
    await sb.from("brand_voices").upsert({
      user_id: pid,
      pillar: u.brand?.pillar || "AI Automation & Growth",
      tone: u.brand?.tone || "Direct, Practical",
      words_use: u.brand?.wordsUse || ["practical", "direct", "authentic"],
      words_avoid: u.brand?.wordsAvoid || ["corporate", "clickbait"],
      rules: u.brand?.rules || "",
    });
  })().catch((e) => console.error("Supabase mirrorProfile failed:", e?.message));
}

export function mirrorContent(c) {
  (async () => {
    const sb = supabaseServer();
    if (!sb) return;
    const { data: prof } = await sb.from("profiles").select("id").eq("email", c.authorEmail).maybeSingle();
    if (!prof?.id) return;
    await sb.from("content_items").insert({
      author_id: prof.id,
      original: c.original,
      linkedin: c.linkedin,
      carousel_json: c.carousel || [],
      thread_json: c.thread || [],
      status: "Draft",
    });
  })().catch((e) => console.error("Supabase mirrorContent failed:", e?.message));
}
