import { redirect } from "next/navigation";
import { Shell, adminNav } from "@/components/SpliceShell";
import { currentUser } from "@/lib/guard";
export default async function P() {
  const me = await currentUser();
  if (!me || me.role !== "admin") redirect("/auth/signup");
  return <Shell title="Settings" crumbs={["Admin", "System Settings"]} nav={adminNav} user="Admin"><div className="card"><div className="font-bold">Maintenance · API keys (Gemini/LinkedIn/Resend) · Rate limits · Feature flags · Danger zone</div></div></Shell>;
}
