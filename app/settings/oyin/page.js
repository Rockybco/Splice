import { Shell, oyinNav } from "@/components/SpliceShell";
export default function OyinSettings() {
  return (
    <Shell title="Oyin Settings" crumbs={["Splice OS", "Oyin Settings"]} nav={oyinNav} user="Oyin">
      <div className="card"><div className="font-bold">Review Preferences</div><div className="text-sm mt-1">Auto-approve if voice score &gt; 80% · Daily digest · Notify on new submission</div></div>
    </Shell>
  );
}
