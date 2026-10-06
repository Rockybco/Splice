import { redirect } from "next/navigation";
import { Shell, adminNav } from "@/components/SpliceShell";
import { currentUser } from "@/lib/guard";
export default function P() {
  const me = currentUser();
  if (!me || me.role !== "admin") redirect("/auth/signup");
  return <Shell title="Social" crumbs={["Admin", "Social Accounts"]} nav={adminNav} user="Admin"><div className="card"><div className="font-bold">LinkedIn OAuth v2 (60d) · Instagram Canva Helper · X copy-paste</div></div></Shell>;
}
