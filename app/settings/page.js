import { Shell, creatorNav } from "@/components/SpliceShell";

export default function Settings() {
  return (
    <Shell title="Settings" crumbs={["Workspace Settings"]} nav={creatorNav} user="Rocky B.">
      <div className="card"><div className="font-bold">1 · Account &amp; Creator Profile</div><div className="text-sm text-gray-500">founder@rockybco.com · Rocky B. · @rockyb · Unlimited</div></div>
      <div className="card mt-4"><div className="font-bold">2 · Brand Voice &amp; AI Stop Shield™</div><div className="text-sm mt-1">Pillar: AI Automation &amp; Growth · Tone: Direct · Use: practical, direct, authentic · Avoid: corporate, clickbait</div></div>
      <div className="card mt-4"><div className="font-bold">3 · Connected Accounts · OAuth v2</div><div className="text-sm">LinkedIn ✓ Connected · token 69 days · <span className="text-red-600">Disconnect</span></div></div>
      <div className="card mt-4"><div className="font-bold">4 · Notifications</div><div className="text-sm">Post Ready · Auto-Post Confirm · Sunday Digest · Dispatches</div></div>
      <div className="card mt-4"><div className="font-bold">5 · API Credentials</div><div className="text-sm">Gemini 1.5 Pro · Custom AI Studio Key ••••</div></div>
    </Shell>
  );
}
