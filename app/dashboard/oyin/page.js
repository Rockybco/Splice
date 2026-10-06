import { Shell, oyinNav } from "@/components/SpliceShell";
import fs from "node:fs";
import path from "node:path";

export default function OyinDash() {
  let pending = [];
  try {
    const db = JSON.parse(fs.readFileSync(path.join(process.cwd(), "splice", "data", "db.json"), "utf-8"));
    pending = (db.contents || []).filter((c) => c.status === "Draft" || c.status === "In Review").slice(0, 5);
  } catch {}
  return (
    <Shell title="Oyin" crumbs={["Splice OS", "Oyin Dashboard"]} nav={oyinNav} user="Oyin (Reviewer)">
      <h1 className="text-2xl font-extrabold">Welcome back, Oyin 🧵</h1>
      <div className="text-sm text-gray-500">Your Review Workload</div>
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="card"><div className="font-bold">📝 My Content (no approval needed)</div><div className="text-sm text-gray-500">Create → Schedule → Publish direct</div><a className="btn mt-2 inline-block" href="/generate">Create New Post</a></div>
        <div className="card"><div className="font-bold">🔍 Review Workload · Pending: {pending.length}</div><div className="text-sm text-gray-500">Approved this week: 15 · Avg 8 mins</div><a className="btn mt-2 inline-block" href="/dashboard/oyin/review-queue">Review Queue ({pending.length})</a></div>
      </div>
      <div className="card mt-4">
        <div className="font-bold">Content Awaiting Your Review</div>
        {pending.length === 0 && <div className="text-sm mt-2">All caught up, Oyin! ✓ No posts waiting.</div>}
        {pending.map((c) => <div key={c.id} className="border-t mt-2 pt-2 text-sm"><div className="font-semibold">{c.original?.slice(0, 100)}…</div><a className="btn mt-1 inline-block" href={`/dashboard/oyin/review/${c.id}`}>Review</a></div>)}
      </div>
    </Shell>
  );
}
