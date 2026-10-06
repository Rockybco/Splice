import { Shell, adminNav } from "@/components/SpliceShell";
export default function P() { return <Shell title="Audit" crumbs={["Admin", "Audit Log"]} nav={adminNav} user="Admin"><div className="card"><div className="font-bold">Audit Log · Export CSV/PDF/JSON</div></div></Shell>; }
