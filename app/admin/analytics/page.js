import { redirect } from "next/navigation";
import { Shell, adminNav } from "@/components/SpliceShell";
import { currentUser } from "@/lib/guard";
export default async function P() {
  const me = await currentUser();
  if (!me || me.role !== "admin") redirect("/auth/signup");
  return <Shell title="Analytics" crumbs={["Admin", "Analytics"]} nav={adminNav} user="Admin"><div className="card"><div className="font-bold">User growth · Posts/day · Success 92/5/2/1 · Engagement · Feature use</div></div></Shell>;
}
