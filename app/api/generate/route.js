import { NextResponse } from "next/server";
import { repurpose } from "@/lib/gemini";
import { currentUser } from "@/lib/guard";
import { createContent, shortId } from "@/lib/store";

export async function POST(req) {
  const me = await currentUser();
  const { original, authorEmail, imageUrls } = await req.json();
  if (!original || original.length < 50) return NextResponse.json({ error: "Min 50 chars" }, { status: 400 });
  const email = me?.email || authorEmail || "founder@rockybco.com";
  const brand = me?.brand || {};
  const out = await repurpose({
    pillar: brand.pillar || "AI Automation & Growth",
    tone: brand.tone || "Direct, Practical",
    wordsUse: brand.wordsUse || [],
    wordsAvoid: brand.wordsAvoid || [],
    rules: brand.rules || "",
    original,
  });
  const item = await createContent({ authorId: me?.id || null, authorEmail: email, original, linkedin: out.linkedin, carousel: out.carousel, thread: out.thread, images: imageUrls });
  return NextResponse.json({ ok: true, id: item.id, short: shortId(item.id) });
}
