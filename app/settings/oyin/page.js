import { redirect } from "next/navigation";
import { Shell, oyinNav } from "@/components/SpliceShell";
import { currentUser } from "@/lib/guard";
export default async function OyinSettings() {
  const me = await currentUser();
  if (!me || me.role !== "reviewer") redirect("/auth/signup");
  return (
    <Shell title="Oyin Settings" crumbs={["Splice OS", "Oyin Settings"]} nav={oyinNav} user="Oyin">
      <div className="card"><div className="font-bold">Review Preferences</div><div className="text-sm mt-1">Auto-approve if voice score &gt; 80% · Daily digest · Notify on new submission</div></div>
    </Shell>
  );
}
