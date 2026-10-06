import { redirect } from "next/navigation";
import { Shell, adminNav } from "@/components/SpliceShell";
import { currentUser } from "@/lib/guard";
export default async function P() {
  const me = await currentUser();
  if (!me || me.role !== "admin") redirect("/auth/signup");
  return <Shell title="Audit" crumbs={["Admin", "Audit Log"]} nav={adminNav} user="Admin"><div className="card"><div className="font-bold">Audit Log · Export CSV/PDF/JSON</div></div></Shell>;
}
