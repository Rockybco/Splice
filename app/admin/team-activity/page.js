import { redirect } from "next/navigation";
import { Shell, adminNav } from "@/components/SpliceShell";
import { currentUser } from "@/lib/guard";
export default async function TeamActivity() {
  const me = await currentUser();
  if (!me || me.role !== "admin") redirect("/auth/signup");
  return <Shell title="Team" crumbs={["Admin", "Team Activity"]} nav={adminNav} user="Admin"><div className="card mt-4"><div className="font-bold">Team Activity</div><div className="text-sm text-gray-600 mt-1">Timeline + table + Export CSV/PDF (monitor only).</div></div></Shell>;
}
