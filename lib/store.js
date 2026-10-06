// Supabase-first store with local JSON fallback (dev/offline/Vercel cold paths).
// Shapes: user {id,email,name,handle,role,passwordHash,verified,brand{pillar,tone,wordsUse,wordsAvoid,rules}}
// content {id,authorId,authorEmail,original,linkedin,carousel[],thread[],status,feedback,reviewerEmail,createdAt,impressions}
import { supabaseServer } from "./supabase";
import fs from "node:fs";
import path from "node:path";

const DB = path.join(process.cwd(), "splice", "data", "db.json");
const DEFAULT_BRAND = { pillar: "AI Automation & Growth", tone: "Direct, Practical", wordsUse: ["practical", "direct", "authentic"], wordsAvoid: ["corporate", "clickbait"], rules: "" };

export function shortId(id) {
  return "SP-" + String(id || "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase();
}

// ---------- local fallback ----------
export function loadLocal() {
  try {
    const db = JSON.parse(fs.readFileSync(DB, "utf-8"));
    return { users: db.users || [], otps: db.otps || [], contents: db.contents || [], audit: db.audit || [] };
  } catch {
    return { users: [], otps: [], contents: [], audit: [] };
  }
}
export function saveLocal(db) {
  try {
    fs.mkdirSync(path.dirname(DB), { recursive: true });
    fs.writeFileSync(DB + ".tmp", JSON.stringify({ ...db, audit: (db.audit || []).slice(0, 200) }, null, 2));
    fs.renameSync(DB + ".tmp", DB);
  } catch (e) {
    console.error("local save failed (ephemeral fs?):", e?.message);
  }
}

function cloud() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
    return supabaseServer();
  } catch {
    return null;
  }
}

// ---------- users ----------
function toUser(row, brand) {
  if (!row) return null;
  return {
    id: row.id, email: row.email, name: row.display_name || row.email.split("@")[0],
    handle: row.handle, role: row.role, passwordHash: row.password_hash, verified: !!row.verified,
    brand: brand ? { pillar: brand.pillar, tone: brand.tone, wordsUse: brand.words_use || [], wordsAvoid: brand.words_avoid || [], rules: brand.rules || "" } : { ...DEFAULT_BRAND },
  };
}
async function getBrand(sb, uid) {
  const { data } = await sb.from("brand_voices").select("*").eq("user_id", uid).maybeSingle();
  return data;
}

export async function getUserByEmail(email) {
  const sb = cloud();
  if (sb) {
    try {
      const { data, error } = await sb.from("profiles").select("*").eq("email", email).maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return toUser(data, await getBrand(sb, data.id));
    } catch (e) { console.error("getUserByEmail cloud failed, local fallback:", e?.message); }
  }
  const db = loadLocal();
  return db.users.find((u) => u.email === email) || null;
}

export async function getUserById(id) {
  const sb = cloud();
  if (sb) {
    try {
      const { data, error } = await sb.from("profiles").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return toUser(data, await getBrand(sb, data.id));
    } catch (e) { console.error("getUserById cloud failed, local fallback:", e?.message); }
  }
  return loadLocal().users.find((u) => u.id === id) || null;
}

export async function listUsers() {
  const sb = cloud();
  if (sb) {
    try {
      const { data, error } = await sb.from("profiles").select("*").order("created_at", { ascending: true });
      if (error) throw error;
      return (data || []).map((r) => toUser(r));
    } catch (e) { console.error("listUsers cloud failed:", e?.message); }
  }
  return loadLocal().users;
}

export async function createUser({ email, name, role, passwordHash }) {
  const handle = (name || email.split("@")[0]).toLowerCase().replace(/[^a-z0-9_]/g, "") || "splicer";
  const sb = cloud();
  if (sb) {
    try {
      const { data, error } = await sb.from("profiles").insert({ email, display_name: name || email.split("@")[0], handle, role, password_hash: passwordHash, verified: false }).select("*").single();
      if (error) throw error;
      await sb.from("brand_voices").upsert({ user_id: data.id, pillar: DEFAULT_BRAND.pillar, tone: DEFAULT_BRAND.tone, words_use: DEFAULT_BRAND.wordsUse, words_avoid: DEFAULT_BRAND.wordsAvoid, rules: "" });
      return toUser(data, null);
    } catch (e) { console.error("createUser cloud failed, local fallback:", e?.message); }
  }
  const db = loadLocal();
  const u = { id: "u_" + Date.now(), email, name: name || email.split("@")[0], role, passwordHash, verified: false, brand: { ...DEFAULT_BRAND } };
  db.users.push(u);
  saveLocal(db);
  return u;
}

export async function setVerified(email) {
  const sb = cloud();
  if (sb) {
    try {
      const { error } = await sb.from("profiles").update({ verified: true }).eq("email", email);
      if (error) throw error;
      return;
    } catch (e) { console.error("setVerified cloud failed:", e?.message); }
  }
  const db = loadLocal();
  const u = db.users.find((x) => x.email === email);
  if (u) { u.verified = true; saveLocal(db); }
}

export async function setPassword(email, passwordHash) {
  const sb = cloud();
  if (sb) {
    try {
      const { error } = await sb.from("profiles").update({ password_hash: passwordHash, verified: true }).eq("email", email);
      if (error) throw error;
      return;
    } catch (e) { console.error("setPassword cloud failed:", e?.message); }
  }
  const db = loadLocal();
  const u = db.users.find((x) => x.email === email);
  if (u) { u.passwordHash = passwordHash; u.verified = true; saveLocal(db); }
}

// ---------- otps ----------
export async function saveOtp({ email, code, kind = "signup", minutes = 10 }) {
  const exp = new Date(Date.now() + minutes * 60 * 1000).toISOString();
  const sb = cloud();
  if (sb) {
    try {
      await sb.from("otps").delete().eq("email", email);
      const { error } = await sb.from("otps").insert({ email, code, kind, exp });
      if (error) throw error;
      return;
    } catch (e) { console.error("saveOtp cloud failed:", e?.message); }
  }
  const db = loadLocal();
  db.otps = db.otps.filter((o) => o.email !== email);
  db.otps.push({ email, code, kind, exp: Date.now() + minutes * 60 * 1000 });
  saveLocal(db);
}

export async function checkOtp(email, code, kind) {
  const sb = cloud();
  if (sb) {
    try {
      const { data, error } = await sb.from("otps").select("*").eq("email", email).order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (error) throw error;
      if (!data || data.code !== code) return false;
      if (kind && data.kind !== kind) return false;
      if (new Date(data.exp).getTime() < Date.now()) return false;
      await sb.from("otps").delete().eq("email", email);
      return true;
    } catch (e) { console.error("checkOtp cloud failed:", e?.message); }
  }
  const db = loadLocal();
  const o = db.otps.find((x) => x.email === email);
  const ok = o && o.code === code && (!kind || o.kind === kind || (!o.kind && kind === "signup")) && o.exp > Date.now();
  if (ok) { db.otps = db.otps.filter((x) => x.email !== email); saveLocal(db); }
  return !!ok;
}

// ---------- content ----------
function toContent(row, authorEmail, reviewerEmail) {
  return {
    id: row.id, authorId: row.author_id, authorEmail: authorEmail || "",
    original: row.original, linkedin: row.linkedin, carousel: row.carousel_json || [], thread: row.thread_json || [],
    status: row.status, feedback: row.feedback, reviewerEmail: reviewerEmail || "",
    createdAt: row.created_at, impressions: row.impressions || 0,
  };
}
async function emailFor(sb, uid) {
  if (!uid) return "";
  const { data } = await sb.from("profiles").select("email").eq("id", uid).maybeSingle();
  return data?.email || "";
}

export async function createContent({ authorId, authorEmail, original, linkedin, carousel, thread }) {
  const sb = cloud();
  if (sb) {
    try {
      const { data, error } = await sb.from("content_items").insert({ author_id: authorId, original, linkedin, carousel_json: carousel || [], thread_json: thread || [], status: "Draft" }).select("*").single();
      if (error) throw error;
      return toContent(data, authorEmail, "");
    } catch (e) { console.error("createContent cloud failed, local fallback:", e?.message); }
  }
  const db = loadLocal();
  const item = { id: "SP-" + Math.floor(1000 + Math.random() * 9000), authorId, authorEmail, original, linkedin, carousel, thread, status: "Draft", createdAt: new Date().toISOString(), impressions: 0 };
  db.contents.unshift(item);
  saveLocal(db);
  return item;
}

export async function getContent(id) {
  const isLocalId = String(id).startsWith("SP-");
  const sb = cloud();
  if (sb && !isLocalId) {
    try {
      const { data, error } = await sb.from("content_items").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return toContent(data, await emailFor(sb, data.author_id), await emailFor(sb, data.reviewer_id));
    } catch (e) { console.error("getContent cloud failed:", e?.message); }
  }
  const db = loadLocal();
  // local-fallback ids (SP-####)
  return db.contents.find((x) => x.id === id) || null;
}

export async function listContents({ authorEmail, statuses, limit = 50 } = {}) {
  const sb = cloud();
  if (sb) {
    try {
      let q = sb.from("content_items").select("*").order("created_at", { ascending: false }).limit(limit);
      if (statuses?.length) q = q.in("status", statuses);
      if (authorEmail) {
        const { data: prof } = await sb.from("profiles").select("id").eq("email", authorEmail).maybeSingle();
        if (!prof) return [];
        q = q.eq("author_id", prof.id);
      }
      const { data, error } = await q;
      if (error) throw error;
      const out = [];
      for (const row of data || []) out.push(toContent(row, await emailFor(sb, row.author_id), await emailFor(sb, row.reviewer_id)));
      return out;
    } catch (e) { console.error("listContents cloud failed, local fallback:", e?.message); }
  }
  const db = loadLocal();
  let items = db.contents || [];
  if (authorEmail) items = items.filter((c) => c.authorEmail === authorEmail);
  if (statuses?.length) items = items.filter((c) => statuses.includes(c.status));
  return items.slice(0, limit);
}

export async function updateContent(id, patch, reviewerEmail) {
  const isLocalId = String(id).startsWith("SP-");
  const sb = cloud();
  if (sb && !isLocalId) {
    try {
      const row = {};
      if (patch.status) row.status = patch.status;
      if (patch.linkedin !== undefined) row.linkedin = patch.linkedin;
      if (patch.carousel !== undefined) row.carousel_json = patch.carousel;
      if (patch.thread !== undefined) row.thread_json = patch.thread;
      if (patch.feedback !== undefined) row.feedback = patch.feedback;
      if (reviewerEmail !== undefined) {
        if (reviewerEmail) {
          const { data: prof } = await sb.from("profiles").select("id").eq("email", reviewerEmail).maybeSingle();
          row.reviewer_id = prof?.id || null;
        } else row.reviewer_id = null;
      }
      const { data, error } = await sb.from("content_items").update(row).eq("id", id).select("*").single();
      if (error) throw error;
      return toContent(data, await emailFor(sb, data.author_id), await emailFor(sb, data.reviewer_id));
    } catch (e) { console.error("updateContent cloud failed, local fallback:", e?.message); }
  }
  const db = loadLocal();
  const c = db.contents.find((x) => x.id === id);
  if (!c) return null;
  Object.assign(c, patch);
  if (reviewerEmail !== undefined) c.reviewer = reviewerEmail;
  saveLocal(db);
  return c;
}

// ---------- social accounts ----------
export async function getSocialAccount(userId, provider) {
  const sb = cloud();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from("social_accounts").select("*").eq("user_id", userId).eq("provider", provider).maybeSingle();
    if (error) throw error;
    return data;
  } catch (e) { console.error("getSocialAccount failed:", e?.message); return null; }
}

export async function listSocialAccounts(provider) {
  const sb = cloud();
  if (!sb) return [];
  try {
    let q = sb.from("social_accounts").select("*").order("created_at", { ascending: false });
    if (provider) q = q.eq("provider", provider);
    const { data, error } = await q;
    if (error) throw error;
    const out = [];
    for (const row of data || []) {
      let email = "";
      const { data: prof } = await sb.from("profiles").select("email,display_name").eq("id", row.user_id).maybeSingle();
      out.push({ ...row, userEmail: prof?.email || "", userName: prof?.display_name || "" });
    }
    return out;
  } catch (e) { console.error("listSocialAccounts failed:", e?.message); return []; }
}

// ---------- audit ----------
export async function addAudit(actorEmail, action, detail = "") {
  const sb = cloud();
  if (sb) {
    try {
      let actorId = null;
      if (actorEmail) {
        const { data: prof } = await sb.from("profiles").select("id").eq("email", actorEmail).maybeSingle();
        actorId = prof?.id || null;
      }
      await sb.from("audit_logs").insert({ actor_id: actorId, action, target: "", detail: `${action} ${detail}`.slice(0, 500) });
      return;
    } catch (e) { console.error("addAudit cloud failed:", e?.message); }
  }
  const db = loadLocal();
  db.audit.unshift({ at: new Date().toISOString(), actor: actorEmail, action, detail });
  saveLocal(db);
}
