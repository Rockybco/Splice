import { Shell, adminNav } from "@/components/SpliceShell";
export default function P() { return <Shell title="Settings" crumbs={["Admin", "System Settings"]} nav={adminNav} user="Admin"><div className="card"><div className="font-bold">Maintenance · API keys (Gemini/LinkedIn/Resend) · Rate limits · Feature flags · Danger zone</div></div></Shell>; }
