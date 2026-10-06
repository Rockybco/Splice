import { redirect } from "next/navigation";
import { Shell, creatorNav } from "@/components/SpliceShell";
import { currentUser } from "@/lib/guard";
import { getSocialAccount } from "@/lib/store";

export default async function Linkedin({ searchParams }) {
  const me = await currentUser();
  if (!me) redirect("/auth/signup");
  const acct = await getSocialAccount(me.id, "linkedin");
  const days = acct?.expires_at ? Math.ceil((new Date(acct.expires_at).getTime() - Date.now()) / 86400000) : 0;
  return (
    <Shell title="LinkedIn" crumbs={["Splice OS", "Connect LinkedIn"]} nav={creatorNav} user={me.name} actions={<a className="btn" href="/dashboard">Jump to Dashboard →</a>}>
      <div className="card max-w-[500px] mx-auto text-center fade-up">
        <h1 className="text-2xl font-extrabold">Connect LinkedIn to auto-post, Splicer</h1>
        {searchParams?.error && <div className="text-sm mt-2 text-red-600">Connection failed: {searchParams.error}</div>}
        {acct ? (
          <div className="mt-3">
            <div className="text-green-700 font-bold">✓ LinkedIn connected ({acct.handle})</div>
            <div className="text-sm text-gray-500">Token valid {days} days · auto-post unlocked</div>
          </div>
        ) : (
          <div className="text-sm text-gray-500 mt-1">OAuth v2 · Token valid 60 days</div>
        )}
        <div className="flex gap-2 justify-center mt-4">
          <a className="btn" href="/api/oauth/linkedin">{acct ? "Reconnect LinkedIn" : "Connect LinkedIn"}</a>
          <a className="btn2" href="/dashboard">Skip for now</a>
        </div>
      </div>
    </Shell>
  );
}
