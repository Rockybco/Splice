"use client";
import { useEffect, useState } from "react";

export default function InviteAccept({ params }) {
  const [inv, setInv] = useState(null);
  const [err, setErr] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    (async () => {
      const r = await fetch(`/api/invites/${params.token}`);
      const j = await r.json();
      if (j.ok) setInv(j);
      else setErr(j.error);
    })();
  }, [params.token]);

  async function accept(e) {
    e.preventDefault();
    setBusy(true);
    const r = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: inv.email, name, password, invite: params.token }) });
    const j = await r.json();
    setBusy(false);
    if (j.ok) window.location.href = "/onboarding/step-1";
    else setErr(j.error);
  }

  if (err) return <div className="min-h-screen grid place-items-center px-4"><div className="card w-[400px] text-center"><h1 className="font-extrabold">Invite unavailable</h1><p className="text-sm text-gray-500 mt-1">{err}</p></div></div>;
  if (!inv) return <div className="min-h-screen grid place-items-center"><div className="text-sm">Loading invite…</div></div>;
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <form onSubmit={accept} className="card w-[400px] fade-up">
        <div className="text-xs font-bold">YOU&apos;RE INVITED · {inv.role.toUpperCase()}</div>
        <h1 className="text-2xl font-extrabold mt-1">Join Splice 🧵</h1>
        <label className="label mt-4">Email (invited address)</label>
        <input className="input bg-gray-50" value={inv.email} disabled />
        <label className="label mt-3">Name</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
        <label className="label mt-3">Password (min 6 chars)</label>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
        <button className="btn w-full mt-4" disabled={busy}>{busy ? "Joining…" : `Accept & join as ${inv.role}`}</button>
      </form>
    </div>
  );
}
