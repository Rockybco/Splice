import { NextResponse } from "next/server";
import { getInviteByToken } from "@/lib/store";

// Public: invite details for the accept page (email + role only).
export async function GET(req, { params }) {
  const inv = await getInviteByToken(params.token);
  if (!inv || inv.accepted) return NextResponse.json({ error: "Invite invalid or already used" }, { status: 404 });
  return NextResponse.json({ ok: true, email: inv.email, role: inv.role });
}
