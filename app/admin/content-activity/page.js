import { Shell, adminNav } from "@/components/SpliceShell";
export default function P() { return <Shell title="Content" crumbs={["Admin", "Content Activity"]} nav={adminNav} user="Admin"><div className="card"><div className="font-bold">All Content + Quality Score (fidelity / hook / CTA / suitability / engagement)</div></div></Shell>; }
