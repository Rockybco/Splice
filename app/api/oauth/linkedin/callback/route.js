import { NextResponse } from "next/server";
import { getUserById, addAudit } from "@/lib/store";
import { supabaseServer } from "@/lib/supabase";

const appUrl = () => (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");

// Exchange code → access_token → userinfo → store in social_accounts (60-day token).
export async function GET(req) {
  const base = appUrl();
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const err = url.searchParams.get("error");
  if (err || !code || !state) return NextResponse.redirect(`${base}/auth/linkedin?error=${err || "missing"}`);
  const me = await getUserById(state);
  if (!me) return NextResponse.redirect(`${base}/auth/signup`);

  try {
    const tok = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: process.env.LINKEDIN_CLIENT_ID || "",
        client_secret: process.env.LINKEDIN_CLIENT_SECRET || "",
        redirect_uri: `${base}/api/oauth/linkedin/callback`,
      }).toString(),
    });
    const tj = await tok.json();
    if (!tok.ok || !tj.access_token) throw new Error(tj.error_description || tj.error || "token exchange failed");

    const ui = await fetch("https://api.linkedin.com/v2/userinfo", { headers: { Authorization: `Bearer ${tj.access_token}` } });
    const profile = await ui.json();
    if (!ui.ok) throw new Error(profile.message || "userinfo failed");

    const sb = supabaseServer();
    if (sb) {
      const expiresAt = new Date(Date.now() + (tj.expires_in || 5184000) * 1000).toISOString();
      const { error } = await sb.from("social_accounts").upsert(
        {
          user_id: me.id,
          provider: "linkedin",
          handle: profile.name || profile.email || "linkedin",
          access_token_enc: tj.access_token,
          expires_at: expiresAt,
          meta: { sub: profile.sub, email: profile.email },
        },
        { onConflict: "user_id,provider" }
      );
      if (error) throw error;
    }
    await addAudit(me.email, "linkedin-connected", profile.email || "");
    return NextResponse.redirect(`${base}/dashboard?linkedin=connected`);
  } catch (e) {
    console.error("LinkedIn callback failed:", e?.message);
    return NextResponse.redirect(`${base}/auth/linkedin?error=${encodeURIComponent(e?.message || "failed")}`);
  }
}
