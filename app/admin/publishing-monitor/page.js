import { redirect } from "next/navigation";
import { Shell, adminNav } from "@/components/SpliceShell";
import { currentUser } from "@/lib/guard";
import { listContents, listPublishLogs } from "@/lib/store";

export default async function P() {
  const me = await currentUser();
  if (!me || me.role !== "admin") redirect("/auth/signup");
  const [scheduled, published, failed, logs] = await Promise.all([
    listContents({ statuses: ["Scheduled"], limit: 25 }),
    listContents({ statuses: ["Published"], limit: 25 }),
    listContents({ statuses: ["Failed"], limit: 25 }),
    listPublishLogs(25),
  ]);
  return (
    <Shell title="Publishing" crumbs={["Admin", "Publishing Monitor"]} nav={adminNav} user="Admin">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card"><div className="text-xs text-gray-500">SCHEDULED</div><div className="text-xl font-extrabold">{scheduled.length}</div></div>
        <div className="card"><div className="text-xs text-gray-500">PUBLISHED</div><div className="text-xl font-extrabold">{published.length}</div></div>
        <div className="card"><div className="text-xs text-gray-500">FAILED</div><div className="text-xl font-extrabold">{failed.length}</div></div>
      </div>
      <div className="card mt-4">
        <div className="font-bold">⏳ Scheduled (cron publishes every 5 min)</div>
        {scheduled.map((c) => <div key={c.id} className="border-t mt-2 pt-2 text-sm">{c.authorEmail} · {(c.original || "").slice(0, 60)}… · <b>{c.scheduledFor ? new Date(c.scheduledFor).toLocaleString() : "—"}</b></div>)}
        {scheduled.length === 0 && <div className="text-sm text-gray-500">Nothing scheduled.</div>}
      </div>
      <div className="card mt-4">
        <div className="font-bold">🔴 Live — recent publishes</div>
        {logs.map((l) => <div key={l.id} className="border-t mt-2 pt-2 text-sm">{l.platform} · <b>{l.status}</b> · {new Date(l.created_at).toLocaleString()}</div>)}
        {logs.length === 0 && <div className="text-sm text-gray-500">No publishes yet.</div>}
      </div>
      <div className="card mt-4">
        <div className="font-bold">✗ Failed (retry from content page)</div>
        {failed.map((c) => <div key={c.id} className="border-t mt-2 pt-2 text-sm"><a className="underline" href={`/content/${c.id}`}>{c.authorEmail} · {(c.original || "").slice(0, 60)}…</a></div>)}
        {failed.length === 0 && <div className="text-sm text-gray-500">No failures.</div>}
      </div>
    </Shell>
  );
}
