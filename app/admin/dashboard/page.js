import { redirect } from "next/navigation";
import { Shell, adminNav } from "@/components/SpliceShell";
import { currentUser } from "@/lib/guard";
export default async function AdminDash() {
  const me = await currentUser();
  if (!me || me.role !== "admin") redirect("/auth/signup");
  return (
    <Shell title="Admin" crumbs={["Admin Dashboard", "Overview"]} nav={adminNav} user="Rocky B. (Admin)">
      <div className="grid md:grid-cols-4 gap-4">
        {[["Total Users", "2,847 +18%"], ["Posts Generated", "45,293 +42%"], ["Uptime", "99.97%"], ["API Health", "All nominal"]].map(([t, v]) => <div key={t} className="card"><div className="text-xs text-gray-500">{t}</div><div className="text-xl font-extrabold">{v}</div></div>)}
      </div>
      <div className="card mt-4"><div className="font-bold">Workspace Activity — Last 24h (monitor only, no approval here)</div><div className="text-sm text-gray-600 mt-1">10:42 Rocky generated SP-9921 ✓ · 10:45 Oyin approved ✓ · 2:00 LinkedIn published (1,840 impr.) ✓</div></div>
      <div className="card mt-4"><div className="font-bold">System Health</div><div className="text-sm">✓ Supabase · ✓ Resend · ✓ Gemini · ✓ LinkedIn API · ✓ Vercel</div></div>
    </Shell>
  );
}
