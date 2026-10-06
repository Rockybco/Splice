import { redirect } from "next/navigation";
import { Shell, creatorNav } from "@/components/SpliceShell";
import { currentUser } from "@/lib/guard";
import { listContents } from "@/lib/store";

export default async function Dashboard() {
  const me = await currentUser();
  if (!me) redirect("/auth/signup");
  const contents = await listContents({ authorEmail: me.email, limit: 3 });
  return (
    <Shell title="Dashboard" crumbs={["Splice OS", "Dashboard Overview"]} nav={creatorNav} user={me.name} actions={<a className="btn" href="/generate">+ New Splice</a>}>
      <h1 className="text-2xl font-extrabold">Welcome back, Splicer 🧵</h1>
      <div className="text-sm text-gray-500">Workspace V2.4 Active • Batch 16.8/20 Monthly Cap</div>
      <div className="grid md:grid-cols-4 gap-4 mt-4">
        {[["Posts Created", "38 / 50 goal"], ["Posted to LinkedIn", "29 (3 queued)"], ["Time Saved", "12.6 hrs net"], ["Platforms Reached", "3/3"]].map(([t, v]) => (
          <div key={t} className="card"><div className="text-xs text-gray-500">{t}</div><div className="text-xl font-extrabold">{v}</div></div>
        ))}
      </div>
      <div className="card mt-4">
        <div className="font-bold">⚡ Quick Splice Studio</div>
        <div className="text-sm text-gray-500">Tone: {me.brand?.tone}</div>
        <div className="flex gap-2 mt-3">
          <a className="btn" href="/generate">Quick Paste &amp; Splice</a>
          <a className="btn2" href="/generate">Templates (14)</a>
        </div>
      </div>
      <div className="card mt-4">
        <div className="font-bold">Recent Splices · showing {contents.length}</div>
        {contents.length === 0 && <div className="text-sm mt-2">Let&apos;s create your first splice 🎯 — <a className="underline" href="/generate">Generate</a></div>}
        {contents.map((c) => (
          <div key={c.id} className="border-t mt-2 pt-2 text-sm">
            <span className="badge bg-blue-50 border">LinkedIn</span> <span className="text-gray-500">{c.status}</span>
            <div className="font-semibold">{c.original?.slice(0, 90)}…</div>
            <a className="underline" href={`/content/${c.id}`}>View</a>
          </div>
        ))}
      </div>
    </Shell>
  );
}
