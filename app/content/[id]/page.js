import { redirect } from "next/navigation";
import { Shell, creatorNav } from "@/components/SpliceShell";
import { currentUser } from "@/lib/guard";
import { getContent, shortId } from "@/lib/store";
import SubmitButton from "./submit";
import PublishButton from "./publish";

export default async function ContentPage({ params }) {
  const me = await currentUser();
  if (!me) redirect("/auth/signup");
  const c = await getContent(params.id);
  if (!c) return <div className="p-8">Not found. <a className="underline" href="/dashboard">Back</a></div>;
  return (
    <Shell title="Review" crumbs={["Content Splicing Studio", "STEP 2 OF 4: Review & Customize"]} nav={creatorNav} user={me.name}>
      <div className="flex gap-2 text-sm mb-3">
        <span className="tab-active font-bold px-2">LinkedIn</span><span className="px-2 text-gray-500">Instagram</span><span className="px-2 text-gray-500">X</span>
        <span className="ml-auto text-gray-400">{shortId(c.id)}</span>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card"><div className="font-bold text-sm">ORIGINAL (read-only)</div><div className="text-sm mt-2 bg-gray-50 p-3 rounded">{c.original}</div></div>
        <div className="card"><div className="font-bold text-sm">GENERATED (editable)</div><textarea className="input mt-2" rows={10} defaultValue={c.linkedin} /></div>
      </div>
      <div className="card mt-4">
        <div className="font-bold text-sm">📸 Instagram Carousel — 6-slide blueprint (add images in Canva 1080×1350)</div>
        {(c.carousel || []).map((s, i) => <textarea key={i} className="input mt-2" rows={2} defaultValue={s} />)}
        <button className="btn mt-3">📋 Copy Carousel</button>
      </div>
      <div className="card mt-4">
        <div className="font-bold text-sm">𝕏 X Thread — 5 tweets</div>
        {(c.thread || []).map((t, i) => <div key={i}><div className="text-xs mt-2">{i + 1}/5 · {t.length}/280</div><textarea className="input" rows={2} defaultValue={t} /></div>)}
        <div className="flex gap-2 mt-3"><span className="btn">📋 Copy Thread</span><span className="btn2">Send to Typefully</span><span className="btn2">Open in X</span></div>
      </div>
      <div className="flex gap-2 mt-4 items-center">
        <span className="text-sm text-gray-500">Status: <b>{c.status}</b></span>
        <SubmitButton id={c.id} status={c.status} />
        <PublishButton id={c.id} status={c.status} isReviewerOwn={me.role === "reviewer" && c.authorEmail === me.email} />
        <a className="btn2" href="/history">Share to LinkedIn Composer</a>
      </div>
      {c.feedback && <div className="card mt-3 text-sm"><b>Oyin&apos;s feedback:</b> {c.feedback}</div>}
    </Shell>
  );
}
