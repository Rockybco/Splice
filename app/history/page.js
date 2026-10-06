import { redirect } from "next/navigation";
import { Shell, creatorNav } from "@/components/SpliceShell";
import { currentUser } from "@/lib/guard";
import { listContents } from "@/lib/store";

export default async function History() {
  const me = await currentUser();
  if (!me) redirect("/auth/signup");
  const contents = await listContents({ authorEmail: me.email, limit: 100 });
  return (
    <Shell title="History" crumbs={["Splice History & Archive"]} nav={creatorNav} user={me.name}>
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
