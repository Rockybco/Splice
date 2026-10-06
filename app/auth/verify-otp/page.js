"use client";
import { useEffect, useState } from "react";

export default function VerifyOtp() {
  const [email, setEmail] = useState("founder@rockybco.com");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get("email");
      const saved = sessionStorage.getItem("splice_signup_email");
      if (q || saved) setEmail(q || saved);
      const dev = sessionStorage.getItem("splice_dev_code");
      if (dev) setMsg(`Code sent — check your inbox (dev fallback: ${dev}). It also works if email is delayed.`);
    } catch {}
  }, []);
  async function verify(e) {
    e.preventDefault();
    setMsg("");
    setBusy(true);
    try {
      const r = await fetch("/api/auth/verify-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, code }) });
      const j = await r.json();
      if (j.ok) {
        try { sessionStorage.removeItem("splice_dev_code"); } catch {}
        window.location.href = "/onboarding/step-1";
      } else setMsg(j.error || "Invalid code");
    } catch {
      setMsg("Network error — is the server running?");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <form onSubmit={verify} className="card w-[450px] fade-up">
        <div className="text-xs font-bold">STEP 2 OF 2: ENTER ACCESS CODE</div>
        <h1 className="text-xl font-extrabold mt-1">Check your inbox, Splicer</h1>
        <label className="label mt-4">Email</label>
        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="label mt-3">6-digit code</label>
        <input className="input tracking-[0.5em] text-center text-xl font-bold" value={code} onChange={(e) => setCode(e.target.value)} maxLength={6} placeholder="••••••" />
        <button className="btn w-full mt-4" disabled={busy}>{busy ? "Verifying…" : "Verify & Enter Workspace"}</button>
        <div className="text-xs mt-2 text-gray-500">Resend: 1 per minute max · 3 attempts · expires 10 min</div>
        {msg && <div className="text-sm mt-2 text-red-600">{msg}</div>}
      </form>
    </div>
  );
}
