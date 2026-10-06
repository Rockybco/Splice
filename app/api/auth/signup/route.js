import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import { mirrorProfile } from "@/lib/supabase-mirror";

const DB = path.join(process.cwd(), "splice", "data", "db.json");
function load() {
  try { return JSON.parse(fs.readFileSync(DB, "utf-8")); }
  catch { return { users: [], otps: [], contents: [] }; }
}
function save(db) {
  fs.mkdirSync(path.dirname(DB), { recursive: true });
  fs.writeFileSync(DB + ".tmp", JSON.stringify(db, null, 2));
  fs.renameSync(DB + ".tmp", DB);
}
export async function POST(req) {
  const { email, name, password = "splice-dev" } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
  const db = load();
  let u = db.users.find((x) => x.email === email);
  if (!u) {
    u = { id: "u_" + Date.now(), email, name: name || email.split("@")[0], role: email.includes("oyin") ? "reviewer" : email.includes("rockyb") ? "admin" : "creator", passwordHash: await bcrypt.hash(password, 10), verified: false, brand: { pillar: "AI Automation & Growth", tone: "Direct, Practical", wordsUse: ["practical", "direct", "authentic"], wordsAvoid: ["corporate", "clickbait"], rules: "" } };
    db.users.push(u);
  }
  const code = String(Math.floor(100000 + Math.random() * 900000));
  db.otps = db.otps.filter((o) => o.email !== email);
  db.otps.push({ email, code, exp: Date.now() + 10 * 60 * 1000 });
  save(db);
  mirrorProfile(u);
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: "Splice <onboarding@resend.dev>",
        to: email,
        subject: "Your Splice access code",
        html: `<h2>Welcome to Splice 🧵</h2><p>Your 6-digit access code is:</p><h1>${code}</h1><p>Expires in 10 minutes. 3 attempts max.</p>`,
      });
      if (error) throw new Error(typeof error === "object" ? error.message || JSON.stringify(error) : error);
      return NextResponse.json({ ok: true });
    } catch (e) {
      console.error("Resend failed, falling back to devCode:", e?.message);
      return NextResponse.json({ ok: true, devCode: code, emailWarning: `Email send failed (${e?.message}). Use dev code.` });
    }
  }
  return NextResponse.json({ ok: true, devCode: code });
}
