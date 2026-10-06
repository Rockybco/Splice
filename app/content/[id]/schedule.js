"use client";
import { useState } from "react";

export default function ScheduleForm({ id, status, scheduledFor, canSchedule }) {
  const [when, setWhen] = useState(() => {
    const d = new Date(Date.now() + 24 * 3600 * 1000);
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
  });
  const [msg, setMsg] = useState("");
  if (!canSchedule && status !== "Scheduled") return null;

  async function schedule(e) {
    e.preventDefault();
    setMsg("Scheduling…");
    const r = await fetch("/api/schedule", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, scheduled_for: new Date(when).toISOString() }) });
    const j = await r.json();
    if (j.ok) window.location.reload();
    else setMsg(j.error);
  }
  async function cancel() {
    setMsg("Cancelling…");
    const r = await fetch("/api/schedule", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, cancel: true }) });
    const j = await r.json();
    if (j.ok) window.location.reload();
    else setMsg(j.error);
  }

  return (
    <div className="card mt-4">
      <div className="font-bold text-sm">📅 Schedule LinkedIn auto-post {status === "Scheduled" && <span className="text-green-700">(set: {new Date(scheduledFor).toLocaleString()})</span>}</div>
      {status === "Scheduled" ? (
        <div className="mt-2"><button className="btn2" onClick={cancel}>Cancel schedule</button></div>
      ) : (
        <form onSubmit={schedule} className="flex gap-2 mt-2 items-center flex-wrap">
          <input type="datetime-local" className="input !w-auto" value={when} onChange={(e) => setWhen(e.target.value)} required />
          <button className="btn">Schedule</button>
        </form>
      )}
      {msg && <div className="text-sm mt-1">{msg}</div>}
      <div className="text-xs text-gray-500 mt-1">Cron publishes every 5 min. IG (Canva) + X (copy-paste) stay manual.</div>
    </div>
  );
}
