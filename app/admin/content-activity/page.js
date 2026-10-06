import { redirect } from "next/navigation";
import { Shell, adminNav } from "@/components/SpliceShell";
import { currentUser } from "@/lib/guard";
export default async function P() {
  const me = await currentUser();
  if (!me || me.role !== "admin") redirect("/auth/signup");
  return <Shell title="Content" crumbs={["Admin", "Content Activity"]} nav={adminNav} user="Admin"><div className="card"><div className="font-bold">All Content + Quality Score (fidelity / hook / CTA / suitability / engagement)</div></div></Shell>;
}
