"use client";
import { useState } from "react";
import { Shell, creatorNav } from "@/components/SpliceShell";

export default function Generate() {
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");
  async function gen(e) {
    e.preventDefault();
    setMsg("✨ Generating your content...");
    const r = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ original: text }) });
    const j = await r.json();
    if (j.ok) window.location.href = `/content/${j.id}`;
    else setMsg(j.error);
  }
  return (
    <Shell title="Generate" crumbs={["Content Splicing Studio", "STEP 1 OF 4"]} nav={creatorNav} user="Rocky B.">
      <form onSubmit={gen} className="card max-w-[800px] mx-auto fade-up">
        <h1 className="text-2xl font-extrabold">Create your content, Splicer</h1>
        <textarea className="input mt-3" rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste raw LinkedIn post (min 50, max 5000 chars)..." minLength={50} maxLength={5000} required />
        <div className="text-xs text-gray-500 mt-1">{text.length}/5000 · Min 50 chars met: {text.length >= 50 ? "yes" : "no"}</div>
        <button className="btn w-full mt-3">✨ Generate</button>
        <div className="text-xs mt-2 text-gray-500">Pro tip: Longer posts (300+ chars) generate better carousels.</div>
        {msg && <div className="text-sm mt-2">{msg}</div>}
      </form>
    </Shell>
  );
}
