"use client";
import { useState } from "react";

export default function ExportButtons({ id }) {
  const [msg, setMsg] = useState("");
  async function copyBackup() {
    setMsg("Copying…");
    const r = await fetch(`/api/export/${id}`);
    const text = await r.text();
    try {
      await navigator.clipboard.writeText(text);
      setMsg("✓ Copied — paste into Google Docs to back up.");
    } catch {
      setMsg("Copy blocked — use Download .md instead.");
    }
  }
  return (
    <span className="flex gap-2 items-center flex-wrap">
      <a className="btn2" href={`/api/export/${id}`}>⬇ Export .md</a>
      <button className="btn2" onClick={copyBackup}>📋 Copy Docs backup</button>
      {msg && <span className="text-sm">{msg}</span>}
    </span>
  );
}
