import { redirect } from "next/navigation";
import { Shell, adminNav } from "@/components/SpliceShell";
import { currentUser } from "@/lib/guard";
export default async function P() {
  const me = await currentUser();
  if (!me || me.role !== "admin") redirect("/auth/signup");
  return <Shell title="Publishing" crumbs={["Admin", "Publishing Monitor"]} nav={adminNav} user="Admin"><div className="card"><div className="font-bold">Live (24h) · Scheduled · Failed + Retry</div><div className="text-sm text-gray-500">LinkedIn live · IG Canva-helper · X copy-paste.</div></div></Shell>;
}
