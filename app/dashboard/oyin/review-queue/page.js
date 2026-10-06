import { redirect } from "next/navigation";
import { Shell, oyinNav } from "@/components/SpliceShell";
import { currentUser } from "@/lib/guard";
import fs from "node:fs";
import path from "node:path";
export default function Queue() {
  const me = currentUser();
  if (!me || me.role !== "reviewer") redirect("/auth/signup");
  let items = [];
  try {
    const db = JSON.parse(fs.readFileSync(path.join(process.cwd(), "splice", "data", "db.json"), "utf-8"));
    items = (db.contents || []).filter((c) => ["Draft", "In Review"].includes(c.status));
  } catch {}
  return (
    <Shell title="Queue" crumbs={["Splice OS", "Review Queue"]} nav={oyinNav} user="Oyin">
      <div className="card"><div className="font-bold">Content Review Queue · {items.length} waiting</div>
        {items.map((c) => <div key={c.id} className="border-t mt-2 pt-2 text-sm"><div>{c.authorEmail} · {c.original?.slice(0, 200)}…</div><a className="btn mt-1 inline-block" href={`/dashboard/oyin/review/${c.id}`}>Review &amp; Approve</a></div>)}
        {items.length === 0 && <div className="text-sm mt-2">Queue empty ✓</div>}
      </div>
    </Shell>
  );
}
