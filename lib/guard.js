// Server-only session/role helpers (local JSON store; Supabase mirror is backup).
import { cookies } from "next/headers";
import { verifySession, COOKIE } from "./auth";
import fs from "node:fs";
import path from "node:path";

const DB = path.join(process.cwd(), "splice", "data", "db.json");

export function loadDb() {
  try {
    const db = JSON.parse(fs.readFileSync(DB, "utf-8"));
    if (!db.users) db.users = [];
    if (!db.otps) db.otps = [];
    if (!db.contents) db.contents = [];
    if (!db.audit) db.audit = [];
    return db;
  } catch {
    return { users: [], otps: [], contents: [], audit: [] };
  }
}

export function saveDb(db) {
  fs.mkdirSync(path.dirname(DB), { recursive: true });
  db.audit = (db.audit || []).slice(0, 200);
  fs.writeFileSync(DB + ".tmp", JSON.stringify(db, null, 2));
  fs.renameSync(DB + ".tmp", DB);
}

export function audit(db, actor, action, detail = "") {
  db.audit.unshift({ at: new Date().toISOString(), actor, action, detail });
}

export function currentUser() {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  const sess = verifySession(token);
  if (!sess) return null;
  const db = loadDb();
  return db.users.find((u) => u.id === sess.id) || null;
}
