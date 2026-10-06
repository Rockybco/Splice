import { NextResponse } from "next/server";
import { repurpose } from "@/lib/gemini";
import fs from "node:fs";
import path from "node:path";

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
  const { original, authorEmail = "founder@rockybco.com" } = await req.json();
  if (!original || original.length < 50) return NextResponse.json({ error: "Min 50 chars" }, { status: 400 });
  const out = await repurpose({ pillar: "AI Automation & Growth", tone: "Direct, Practical", original });
  const db = load();
  const item = { id: "SP-" + Math.floor(1000 + Math.random() * 9000), authorEmail, original, linkedin: out.linkedin, carousel: out.carousel, thread: out.thread, status: "Draft", createdAt: new Date().toISOString(), impressions: 0 };
  db.contents.unshift(item);
  save(db);
  return NextResponse.json({ ok: true, id: item.id });
}
