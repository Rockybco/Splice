"use client";
import { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("founder@rockybco.com");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  async function send(e) {
    e.preventDefault();
    setMsg("");
    const r = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, name }) });
    const j = await r.json();
    if (j.devCode) setMsg(`OTP sent (dev: ${j.devCode}). Continue → /auth/verify-otp`);
    else setMsg(j.error || "Sent");
  }
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <form onSubmit={send} className="card w-[400px] fade-up">
        <div className="text-xs font-bold tracking-wide">STEP 1 OF 2 · No credit card required</div>
        <h1 className="text-2xl font-extrabold mt-1">Create your workspace</h1>
        <label className="label mt-4">Name</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Rocky B." required />
        <label className="label mt-3">Work email</label>
        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="founder@rockybco.com" required />
        <button className="btn w-full mt-4">Send OTP</button>
        <div className="text-sm mt-3">Already have an account? <a className="underline" href="/auth/login">Log in</a></div>
        {msg && <div className="text-sm mt-3 p-2 rounded bg-[#F8F6F2]">{msg}</div>}
      </form>
    </div>
  );
}
