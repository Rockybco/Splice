import { NextResponse } from "next/server";
import { currentUser } from "@/lib/guard";
import { getContent, shortId } from "@/lib/store";

export function docsBackupText(c) {
  const lines = [
    `# Splice backup ${shortId(c.id)}`,
    ``,
    `- Status: ${c.status}`,
    `- Author: ${c.authorEmail}`,
    `- Reviewer: ${c.reviewerEmail || "—"}`,
    `- Feedback: ${c.feedback || "—"}`,
    `- Scheduled: ${c.scheduledFor || "—"}`,
    `- Created: ${c.createdAt}`,
    ``,
    `## Original (LinkedIn source)`,
    c.original || "",
    ``,
    `## LinkedIn (enhanced)`,
    c.linkedin || "",
    ``,
    `## Instagram carousel (6 slides, 1080x1350 in Canva)`,
    ...((c.carousel || []).map((s, i) => `### Slide ${i + 1}\n${s}\n`)),
    `## X thread (5 tweets)`,
    ...((c.thread || []).map((t, i) => `${i + 1}/5 ${t}\n`)),
  ];
  return lines.join("\n");
}

// GET — download finalized content as Markdown (paste into Google Docs to back up).
export async function GET(req, { params }) {
  const me = await currentUser();
  if (!me) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const c = await getContent(params.id);
  if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (me.role !== "reviewer" && me.role !== "admin" && c.authorEmail !== me.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return new NextResponse(docsBackupText(c), {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "Content-Disposition": `attachment; filename="splice-${shortId(c.id)}.md"` },
  });
}
