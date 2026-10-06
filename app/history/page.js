import { Shell, creatorNav } from "@/components/SpliceShell";
import fs from "node:fs";
import path from "node:path";

export default function History() {
  let contents = [];
  try {
    const db = JSON.parse(fs.readFileSync(path.join(process.cwd(), "splice", "data", "db.json"), "utf-8"));
    contents = db.contents || [];
  } catch {}
  return (
    <Shell title="History" crumbs={["Splice History & Archive"]} nav={creatorNav} user="Rocky B.">
      <div className="card">
        <div className="font-bold">All · Published · Drafts · Archived</div>
        <table className="w-full text-sm mt-3">
          <thead><tr className="text-left text-gray-500"><td>Date</td><td>Content</td><td>Status</td><td>Action</td></tr></thead>
          <tbody>
            {contents.map((c) => (
              <tr key={c.id} className="border-t"><td>{new Date(c.createdAt).toLocaleDateString()}</td><td>{c.original?.slice(0, 60)}…</td><td>{c.status}</td><td><a className="underline" href={`/content/${c.id}`}>View</a></td></tr>
            ))}
          </tbody>
        </table>
        {contents.length === 0 && <div className="text-sm text-gray-500 mt-2">No posts yet — <a className="underline" href="/generate">create one</a>.</div>}
      </div>
    </Shell>
  );
}
