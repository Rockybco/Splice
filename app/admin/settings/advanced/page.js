import { redirect } from "next/navigation";
import { Shell, adminNav } from "@/components/SpliceShell";
import { currentUser } from "@/lib/guard";
export default function P() {
  const me = currentUser();
  if (!me || me.role !== "admin") redirect("/auth/signup");
  return <Shell title="Advanced" crumbs={["Admin", "Advanced"]} nav={adminNav} user="Admin"><div className="card"><div className="font-bold">DB 485/500MB · Resend 12,400/mo · Gemini 1.5 Pro · 2FA · CORS · Webhooks</div></div></Shell>;
}
