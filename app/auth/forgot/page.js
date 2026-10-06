"use client";
import { useState } from "react";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState("");
  async function send(e) {
    e.preventDefault();
    const r = await fetch("/api/auth/forgot", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    const j = await r.json();
    if (j.ok) { setStep(2); setMsg(j.devCode ? `Reset code (dev): ${j.devCode}` : "Code sent to your email"); }
    else setMsg(j.error);
  }
  async function reset(e) {
    e.preventDefault();
    const r = await fetch("/api/auth/reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, code, password }) });
    const j = await r.json();
    if (j.ok) window.location.href = "/auth/login";
    else setMsg(j.error);
  }
  return (
    <div className="min-h-screen grid place-items-center px-4">
      {step === 1 ? (
        <form onSubmit={send} className="card w-[400px] fade-up">
          <h1 className="text-2xl font-extrabold">Forgot password</h1>
          <label className="label mt-4">Account email</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button className="btn w-full mt-4">Send reset code</button>
          {msg && <div className="text-sm mt-2">{msg}</div>}
        </form>
      ) : (
        <form onSubmit={reset} className="card w-[400px] fade-up">
          <h1 className="text-2xl font-extrabold">Set new password</h1>
          <label className="label mt-4">Reset code</label>
          <input className="input text-center tracking-[0.4em] font-bold" value={code} onChange={(e) => setCode(e.target.value)} maxLength={6} required />
          <label className="label mt-3">New password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
          <button className="btn w-full mt-4">Reset &amp; log in</button>
          {msg && <div className="text-sm mt-2">{msg}</div>}
        </form>
      )}
    </div>
  );
}
