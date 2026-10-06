"use client";
import { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("founder@rockybco.com");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  async function send(e) {
    e.preventDefault();
    setMsg("");
    setBusy(true);
    try {
      const r = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, name }) });
      const j = await r.json();
      if (j.ok || j.devCode) {
        sessionStorage.setItem("splice_signup_email", email);
        if (j.devCode) sessionStorage.setItem("splice_dev_code", j.devCode);
        window.location.href = `/auth/verify-otp?email=${encodeURIComponent(email)}`;
      } else setMsg(j.error || "Something went wrong");
    } catch {
      setMsg("Network error — is the server running?");
    } finally {
      setBusy(false);
    }
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
        <button className="btn w-full mt-4" disabled={busy}>{busy ? "Sending…" : "Send OTP"}</button>
        <div className="text-sm mt-3">Already have an account? <a className="underline" href="/auth/login">Log in</a></div>
        {msg && <div className="text-sm mt-3 p-2 rounded bg-[#F8F6F2]">{msg}</div>}
      </form>
    </div>
  );
}
