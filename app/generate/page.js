"use client";
import { useState } from "react";
import { Shell, creatorNav } from "@/components/SpliceShell";

export default function Generate() {
  const [text, setText] = useState("");
  const [images, setImages] = useState([""]);
  const [msg, setMsg] = useState("");
  async function gen(e) {
    e.preventDefault();
    setMsg("✨ Generating your content...");
    const imageUrls = images.map((u) => u.trim()).filter((u) => /^https?:\/\/.+/i.test(u)).slice(0, 4);
    const r = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ original: text, imageUrls }) });
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
        <div className="font-bold text-sm mt-4">🖼 Add pictures (optional, up to 4 — paste image URLs)</div>
        {images.map((u, i) => (
          <div key={i} className="flex gap-2 mt-2 items-center">
            <input className="input" value={u} onChange={(e) => setImages(images.map((x, k) => k === i ? e.target.value : x))} placeholder="https://… (jpg/png)" />
            {u && /^https?:\/\//i.test(u) && <img src={u} alt="" className="h-12 w-12 rounded object-cover border" />}
            {images.length > 1 && <button type="button" className="btn2" onClick={() => setImages(images.filter((_, k) => k !== i))}>×</button>}
          </div>
        ))}
        {images.length < 4 && <button type="button" className="btn2 mt-2" onClick={() => setImages([...images, ""])}>+ Add picture</button>}
        <button className="btn w-full mt-3">✨ Generate</button>
        <div className="text-xs mt-2 text-gray-500">Pro tip: Longer posts (300+ chars) generate better carousels.</div>
        {msg && <div className="text-sm mt-2">{msg}</div>}
      </form>
    </Shell>
  );
}
