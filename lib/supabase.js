import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function supabaseBrowser() {
  if (!url || !anon) return null;
  return createClient(url, anon);
}

export function supabaseServer() {
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) return null;
  return createClient(url, service, { auth: { persistSession: false } });
}

export const hasSupabase = Boolean(url && (anon || process.env.SUPABASE_SERVICE_ROLE_KEY));
