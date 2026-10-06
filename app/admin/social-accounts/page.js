import { redirect } from "next/navigation";
import { Shell, adminNav } from "@/components/SpliceShell";
import { currentUser } from "@/lib/guard";
import { listSocialAccounts } from "@/lib/store";

function daysLeft(exp) {
  if (!exp) return "—";
  const d = Math.ceil((new Date(exp).getTime() - Date.now()) / 86400000);
  return d < 0 ? "expired" : `${d} days`;
}

export default async function P() {
  const me = await currentUser();
  if (!me || me.role !== "admin") redirect("/auth/signup");
  const linked = await listSocialAccounts("linkedin");
  return (
    <Shell title="Social" crumbs={["Admin", "Social Accounts"]} nav={adminNav} user="Admin">
      <div className="card">
        <div className="font-bold">LinkedIn Connections ({linked.length})</div>
        <table className="w-full text-sm mt-3">
          <thead><tr className="text-left text-gray-500"><td>Creator</td><td>Account</td><td>Token</td><td>Expires</td></tr></thead>
          <tbody>
            {linked.map((a) => (
              <tr key={a.id} className="border-t">
                <td>{a.userName} · {a.userEmail}</td>
                <td>{a.handle}</td>
                <td>✓ Valid</td>
                <td>{daysLeft(a.expires_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {linked.length === 0 && <div className="text-sm text-gray-500 mt-2">No LinkedIn connections yet — creators connect at /auth/linkedin.</div>}
      </div>
      <div className="card mt-4"><div className="font-bold">Instagram</div><div className="text-sm text-gray-500">Canva Helper (no OAuth in MVP).</div></div>
      <div className="card mt-4"><div className="font-bold">X / Twitter</div><div className="text-sm text-gray-500">Copy-paste mode (no API in MVP).</div></div>
    </Shell>
  );
}
