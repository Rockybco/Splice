import { redirect } from "next/navigation";
import { Shell, oyinNav } from "@/components/SpliceShell";
import { currentUser } from "@/lib/guard";
import { listContents } from "@/lib/store";

export default async function Queue() {
  const me = await currentUser();
  if (!me || me.role !== "reviewer") redirect("/auth/signup");
  const items = await listContents({ statuses: ["Draft", "In Review"], limit: 50 });
  return (
    <Shell title="Queue" crumbs={["Splice OS", "Review Queue"]} nav={oyinNav} user="Oyin">
      <div className="card"><div className="font-bold">Content Review Queue · {items.length} waiting</div>
        {items.map((c) => <div key={c.id} className="border-t mt-2 pt-2 text-sm"><div>{c.authorEmail} · {c.original?.slice(0, 200)}…</div><a className="btn mt-1 inline-block" href={`/dashboard/oyin/review/${c.id}`}>Review &amp; Approve</a></div>)}
        {items.length === 0 && <div className="text-sm mt-2">Queue empty ✓</div>}
      </div>
    </Shell>
  );
}
