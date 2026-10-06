// Server-only session helpers. Reads via store (Supabase-first), session via JWT cookie.
import { cookies } from "next/headers";
import { verifySession, COOKIE } from "./auth";
import { getUserById, loadLocal, saveLocal } from "./store";

export { loadLocal as loadDb, saveLocal as saveDb };

export function audit(db, actor, action, detail = "") {
  db.audit.unshift({ at: new Date().toISOString(), actor, action, detail });
}

export async function currentUser() {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  const sess = verifySession(token);
  if (!sess) return null;
  return (await getUserById(sess.id)) || null;
}
