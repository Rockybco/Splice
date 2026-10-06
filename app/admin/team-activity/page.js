import { Shell, adminNav } from "@/components/SpliceShell";
const T = ({ t, children }) => <div className="card mt-4"><div className="font-bold">{t}</div><div className="text-sm text-gray-600 mt-1">{children}</div></div>;
export function TeamActivity() { return <Shell title="Team" crumbs={["Admin", "Team Activity"]} nav={adminNav} user="Admin"><T t="Team Activity">Timeline + table + Export CSV/PDF (monitor only).</T></Shell>; }
export default TeamActivity;
