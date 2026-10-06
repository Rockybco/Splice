import { NextResponse } from "next/server";
import { listDueScheduled, updateContent, getUserByEmail, addAudit } from "@/lib/store";
import { publishToLinkedIn, logPublish } from "@/lib/publish";

// Vercel Cron (every 5 min) — auto-publish due Scheduled items to LinkedIn.
// Auth: Vercel sends x-vercel-cron:1 in prod; manual runs need ?secret=CRON_SECRET.
export async function GET(req) {
  const url = new URL(req.url);
  const cronHeader = req.headers.get("x-vercel-cron");
  const secret = url.searchParams.get("secret");
  if (cronHeader !== "1" && secret !== (process.env.CRON_SECRET || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const due = await listDueScheduled(25);
  const results = [];
  for (const c of due) {
    const author = c.authorEmail ? await getUserByEmail(c.authorEmail) : null;
    if (!author) {
      await updateContent(c.id, { status: "Failed" });
      results.push({ id: c.id, error: "author missing" });
      continue;
    }
    const out = await publishToLinkedIn({ content: c, author });
    if (out.ok) {
      await updateContent(c.id, { status: "Published" });
      await logPublish(c.id.startsWith("SP-") ? null : c.id, "linkedin", "Published", { urn: out.urn, via: "cron" });
      await addAudit("cron", "published-linkedin", `${c.id} ${out.urn}`);
      results.push({ id: c.id, published: true });
    } else {
      await updateContent(c.id, { status: "Failed" });
      await logPublish(c.id.startsWith("SP-") ? null : c.id, "linkedin", "Failed", { error: out.error, via: "cron" });
      results.push({ id: c.id, error: out.error });
    }
  }
  return NextResponse.json({ ok: true, checked: due.length, results });
}
