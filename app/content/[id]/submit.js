"use client";
import { useState } from "react";

export default function SubmitButton({ id, status }) {
  const [msg, setMsg] = useState("");
  if (!["Draft", "Changes Requested"].includes(status)) return null;
  async function submit() {
    setMsg("Submitting…");
    const r = await fetch("/api/review/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    const j = await r.json();
    if (j.ok) window.location.reload();
    else setMsg(j.error);
  }
  return (
    <span>
      <button className="btn2" onClick={submit}>Submit to Oyin →</button>
      {msg && <span className="text-sm ml-2">{msg}</span>}
    </span>
  );
}
