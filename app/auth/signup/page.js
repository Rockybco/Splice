"use client";
import { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  async function send(e) {
    e.preventDefault();
    setMsg("");
    setBusy(true);
    try {
      const r = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, name, password }) });
      const j = await r.json();
      if (j.ok) window.location.href = "/onboarding/step-1";
      else if (j.login) window.location.href = "/auth/login";
      else setMsg(j.error || "Something went wrong");
    } catch {
      setMsg("Network error — is the server running?");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <form onSubmit={send} className="card w-[400px] fade-up">
        <div className="text-xs font-bold tracking-wide">No credit card required</div>
        <h1 className="text-2xl font-extrabold mt-1">Create your workspace</h1>
        <label className="label mt-4">Name</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Rocky B." required />
        <label className="label mt-3">Work email</label>
        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="founder@rockybco.com" required />
        <label className="label mt-3">Password (min 6 chars)</label>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
        <button className="btn w-full mt-4" disabled={busy}>{busy ? "Creating…" : "Create account"}</button>
        <div className="text-sm mt-3">Already have an account? <a className="underline" href="/auth/login">Log in</a></div>
        {msg && <div className="text-sm mt-3 p-2 rounded bg-[#F8F6F2]">{msg}</div>}
      </form>
    </div>
  );
}
