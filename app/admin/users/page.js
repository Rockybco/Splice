import { redirect } from "next/navigation";
import { Shell, adminNav } from "@/components/SpliceShell";
import { currentUser } from "@/lib/guard";
import { listUsers } from "@/lib/store";
import InvitePanel from "./invite";

export default async function AdminUsers() {
  const me = await currentUser();
  if (!me || me.role !== "admin") redirect("/auth/signup");
  const users = await listUsers();
  return (
    <Shell title="Users" crumbs={["Admin", "Users"]} nav={adminNav} user="Rocky B. (Admin)">
      <div className="card"><div className="font-bold">User Directory &amp; Role Governance (4 users: all Creator; Oyin + Reviewer; Owner + Admin)</div>
        <table className="w-full text-sm mt-3"><thead><tr className="text-left text-gray-500"><td>User</td><td>Role</td><td>Status</td></tr></thead>
          <tbody>{users.map((u) => <tr key={u.id} className="border-t"><td>{u.name} · {u.email}</td><td>{u.role}</td><td>Active</td></tr>)}</tbody></table>
        {users.length === 0 && <div className="text-sm text-gray-500">No users yet — sign up to create the first 4.</div>}
      </div>
      <InvitePanel />
    </Shell>
  );
}
