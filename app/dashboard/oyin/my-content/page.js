import { redirect } from "next/navigation";
import { Shell, oyinNav } from "@/components/SpliceShell";
import { currentUser } from "@/lib/guard";
export default function OyinMine() {
  const me = currentUser();
  if (!me || me.role !== "reviewer") redirect("/auth/signup");
  return (
    <Shell title="My Content" crumbs={["Splice OS", "My Content (Oyin)"]} nav={oyinNav} user="Oyin">
      <div className="card"><div className="font-bold">My Content (Oyin) · All · Published · Drafts</div><div className="text-sm text-gray-500 mt-1">Same layout as creator dashboard, filtered to Oyin. Oyin posts skip approval.</div><a className="btn mt-3 inline-block" href="/generate">Create New Post</a></div>
    </Shell>
  );
}
