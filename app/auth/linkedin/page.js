import { Shell, creatorNav } from "@/components/SpliceShell";

export default function Linkedin() {
  return (
    <Shell title="LinkedIn" crumbs={["Splice OS", "Connect LinkedIn"]} nav={creatorNav} user="Rocky B." actions={<a className="btn" href="/dashboard">Jump to Dashboard →</a>}>
      <div className="card max-w-[500px] mx-auto text-center fade-up">
        <h1 className="text-2xl font-extrabold">Connect LinkedIn to auto-post, Splicer</h1>
        <div className="text-sm text-gray-500 mt-1">OAuth v2 · Token valid 60 days · Rocky B. (@rockyb_pro)</div>
        <div className="flex gap-2 justify-center mt-4">
          <a className="btn" href="/api/oauth/linkedin">Connect LinkedIn</a>
          <a className="btn2" href="/dashboard">Skip for now</a>
        </div>
      </div>
    </Shell>
  );
}
