import { redirect } from "next/navigation";
import { Shell, adminNav } from "@/components/SpliceShell";
import { currentUser } from "@/lib/guard";
import fs from "node:fs";
import path from "node:path";
export default function AdminUsers() {
  const me = currentUser();
  if (!me || me.role !== "admin") redirect("/auth/signup");
  let users = [];
  try { users = JSON.parse(fs.readFileSync(path.join(process.cwd(), "splice", "data", "db.json"), "utf-8")).users || []; } catch {}
  return (
    <Shell title="Users" crumbs={["Admin", "Users"]} nav={adminNav} user="Rocky B. (Admin)">
      <div className="card"><div className="font-bold">User Directory &amp; Role Governance (4 users: all Creator; Oyin + Reviewer; Owner + Admin)</div>
        <table className="w-full text-sm mt-3"><thead><tr className="text-left text-gray-500"><td>User</td><td>Role</td><td>Status</td></tr></thead>
          <tbody>{users.map((u) => <tr key={u.id} className="border-t"><td>{u.name} · {u.email}</td><td>{u.role}</td><td>Active</td></tr>)}</tbody></table>
        {users.length === 0 && <div className="text-sm text-gray-500">No users yet — sign up to create the first 4.</div>}
      </div>
    </Shell>
  );
}
