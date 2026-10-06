import { Shell, oyinNav } from "@/components/SpliceShell";
import fs from "node:fs";
import path from "node:path";
export default function Review({ params }) {
  let c = null;
  try {
    const db = JSON.parse(fs.readFileSync(path.join(process.cwd(), "splice", "data", "db.json"), "utf-8"));
    c = (db.contents || []).find((x) => x.id === params.id);
  } catch {}
  if (!c) return <div className="p-8">Not found</div>;
  return (
    <Shell title="Review" crumbs={[`Review · ${c.id}`, `from ${c.authorEmail}`]} nav={oyinNav} user="Oyin">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card"><div className="font-bold text-sm">ORIGINAL (from creator, read-only)</div><div className="text-sm mt-2 bg-gray-50 p-3 rounded">{c.original}</div></div>
        <div className="card"><div className="font-bold text-sm">YOUR REVIEW &amp; EDITS</div><textarea className="input mt-2" rows={10} defaultValue={c.linkedin} /></div>
      </div>
      <div className="flex gap-2 mt-4">
        <a className="btn" href="/dashboard/oyin/review-queue">✅ Approve</a>
        <a className="btn2" href="/dashboard/oyin/review-queue">💬 Request Changes</a>
        <a className="btn2" href="/dashboard/oyin/review-queue">✏️ Comment</a>
      </div>
    </Shell>
  );
}
