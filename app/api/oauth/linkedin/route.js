import { NextResponse } from "next/server";
import { currentUser } from "@/lib/guard";

// Start LinkedIn OAuth v2: openid profile email (identity) + w_member_social (posting).
export async function GET() {
  const me = await currentUser();
  if (!me) return NextResponse.redirect(new URL("/auth/signup", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.LINKEDIN_CLIENT_ID || "",
    redirect_uri: `${appUrl}/api/oauth/linkedin/callback`,
    scope: "openid profile email w_member_social",
    state: me.id,
  });
  return NextResponse.redirect(`https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`);
}
