"use client";
import { useState } from "react";

export default function PublishButton({ id, status, isReviewerOwn }) {
  const [msg, setMsg] = useState("");
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const eligible = isReviewerOwn || status === "Approved";
  async function publish() {
    setBusy(true);
    setMsg("Posting to LinkedIn…");
    const r = await fetch("/api/publish/linkedin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    const j = await r.json();
    setBusy(false);
    if (j.ok) {
      setMsg("✓ Posted to LinkedIn");
      setUrl(j.url || "");
      setTimeout(() => window.location.reload(), 1200);
    } else if (j.connect) {
      window.location.href = "/auth/linkedin";
    } else setMsg(j.error);
  }
  if (status === "Published") return <span className="text-sm text-green-700">✓ Published {url && <a className="underline" href={url} target="_blank">View</a>}</span>;
  if (!eligible) return <span className="text-xs text-gray-400" title="Needs Oyin approval first">Post to LinkedIn (locked — needs approval)</span>;
  return (
    <span>
      <button className="btn" onClick={publish} disabled={busy}>{busy ? "Posting…" : "Post to LinkedIn"}</button>
      {msg && <span className="text-sm ml-2">{msg} {url && <a className="underline" href={url} target="_blank">View on LinkedIn →</a>}</span>}
    </span>
  );
}
