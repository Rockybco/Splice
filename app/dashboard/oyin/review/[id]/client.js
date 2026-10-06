"use client";
import { useState } from "react";

export default function ReviewClient({ item }) {
  const [linkedin, setLinkedin] = useState(item.linkedin || "");
  const [msg, setMsg] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showFb, setShowFb] = useState(false);

  async function approve() {
    setMsg("Approving…");
    const r = await fetch("/api/review/approve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, edited: { linkedin } }) });
    const j = await r.json();
    if (j.ok) window.location.href = "/dashboard/oyin/review-queue?approved=1";
    else setMsg(j.error);
  }
  async function sendChanges(e) {
    e.preventDefault();
    setMsg("Sending…");
    const r = await fetch("/api/review/request-changes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, feedback }) });
    const j = await r.json();
    if (j.ok) window.location.href = "/dashboard/oyin/review-queue?changes=1";
    else setMsg(j.error);
  }

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card"><div className="font-bold text-sm">ORIGINAL (from {item.authorEmail}, read-only)</div><div className="text-sm mt-2 bg-gray-50 p-3 rounded">{item.original}</div></div>
        <div className="card"><div className="font-bold text-sm">YOUR REVIEW &amp; EDITS</div><textarea className="input mt-2" rows={10} value={linkedin} onChange={(e) => setLinkedin(e.target.value)} /></div>
      </div>
      {msg && <div className="card mt-3 text-sm">✓ {msg}</div>}
      <div className="flex gap-2 mt-4">
        <button className="btn" onClick={approve}>✅ Approve</button>
        <button className="btn2" onClick={() => setShowFb(!showFb)}>💬 Request Changes</button>
      </div>
      {showFb && (
        <form onSubmit={sendChanges} className="card mt-3 max-w-[500px]">
          <div className="font-bold">Request changes? (max 500 chars)</div>
          <textarea className="input mt-2" rows={4} value={feedback} onChange={(e) => setFeedback(e.target.value)} maxLength={500} placeholder="Hook needs stronger. Try starting with a contrarian statement." required />
          <div className="text-xs text-gray-500">{feedback.length}/500</div>
          <div className="flex gap-2 mt-2"><button className="btn">Send &amp; Return</button><button type="button" className="btn2" onClick={() => setShowFb(false)}>Cancel</button></div>
        </form>
      )}
    </div>
  );
}
