// One-time seed for the two private admin logins. NOT reachable from the site.
// Public signup is creator-only, so these can only be created here.
// Usage (PowerShell):
//   node scripts/seed-admins.mjs 'Admin01|admin01@splice.app|Admin@Rockyb|admin' 'Admin02|admin02@splice.app|Admin@Oyin|reviewer'
import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

function loadEnv() {
  for (const f of [".env.local", ".env"]) {
    try {
      const txt = fs.readFileSync(path.join(process.cwd(), f), "utf-8");
      for (const line of txt.split(/\r?\n/)) {
        const m = line.match(/^([A-Z_]+)=(.*)$/);
        if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
      }
      break;
    } catch {}
  }
}
loadEnv();

const { createClient } = await import("@supabase/supabase-js");
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const specs = process.argv.slice(2);
if (!specs.length) {
  console.error("Usage: node scripts/seed-admins.mjs 'Name|email|password|role' ...");
  process.exit(1);
}

for (const spec of specs) {
  const [name, email, password, role] = spec.split("|");
  if (!name || !email || !password || !["admin", "reviewer", "creator"].includes(role)) {
    console.error("Bad spec (need Name|email|password|admin|reviewer|creator):", name);
    continue;
  }
  const hash = await bcrypt.hash(password, 10);
  const { data: existing } = await sb.from("profiles").select("id").eq("email", email).maybeSingle();
  let id = existing?.id;
  if (id) {
    const { error } = await sb.from("profiles").update({ display_name: name, role, password_hash: hash, verified: true }).eq("id", id);
    if (error) throw error;
    console.log(`updated ${email} → ${role}`);
  } else {
    const handle = name.toLowerCase().replace(/[^a-z0-9_]/g, "");
    const { data, error } = await sb.from("profiles").insert({ id: crypto.randomUUID(), email, display_name: name, handle, role, password_hash: hash, verified: true }).select("id").single();
    if (error) throw error;
    id = data.id;
    console.log(`created ${email} → ${role}`);
  }
  await sb.from("brand_voices").upsert({ user_id: id, pillar: "AI Automation & Growth", tone: "Direct, Practical", words_use: ["practical", "direct", "authentic"], words_avoid: ["corporate", "clickbait"], rules: "" });
}
console.log("done");
