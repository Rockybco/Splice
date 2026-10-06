"use client";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  async function login(e) {
    e.preventDefault();
    setMsg("");
    const r = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    const j = await r.json();
    if (j.ok) window.location.href = j.role === "reviewer" ? "/dashboard/oyin" : j.role === "admin" ? "/admin/dashboard" : "/dashboard";
    else if (j.verify) window.location.href = "/auth/verify-otp";
    else setMsg(j.error);
  }
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <form onSubmit={login} className="card w-[400px] fade-up">
        <h1 className="text-2xl font-extrabold">Welcome back, Splicer</h1>
        <label className="label mt-4">Email</label>
        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label className="label mt-3">Password</label>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn w-full mt-4">Log in</button>
        <div className="text-sm mt-3 flex justify-between">
          <a className="underline" href="/auth/forgot">Forgot password?</a>
          <a className="underline" href="/auth/signup">Create account</a>
        </div>
        {msg && <div className="text-sm mt-2 text-red-600">{msg}</div>}
      </form>
    </div>
  );
}
