"use client";
import { useEffect, useState } from "react";

export default function InvitePanel() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("creator");
  const [msg, setMsg] = useState("");
  const [invites, setInvites] = useState([]);
  async function load() {
    const r = await fetch("/api/invites");
    const j = await r.json();
    if (j.ok) setInvites(j.invites);
  }
  useEffect(() => { load(); }, []);
  async function invite(e) {
    e.preventDefault();
    setMsg("Sending invite…");
    const r = await fetch("/api/invites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, role }) });
    const j = await r.json();
    if (j.ok) {
      setMsg(`Invite ready — share this link: ${j.link}`);
      setEmail("");
      load();
    } else setMsg(j.error);
  }
  return (
    <div className="card mt-4">
      <div className="font-bold">✉️ Invite people (creator or reviewer — never admin)</div>
      <form onSubmit={invite} className="flex gap-2 mt-2 flex-wrap items-center">
        <input className="input !w-auto" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="person@company.com" required />
        <select className="input !w-auto" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="creator">Creator</option>
          <option value="reviewer">Reviewer</option>
        </select>
        <button className="btn">Send invite</button>
      </form>
      {msg && <div className="text-sm mt-2 break-all">{msg}</div>}
      {invites.length > 0 && (
        <table className="w-full text-sm mt-3">
          <thead><tr className="text-left text-gray-500"><td>Email</td><td>Role</td><td>Status</td></tr></thead>
          <tbody>{invites.map((i) => <tr key={i.id} className="border-t"><td>{i.email}</td><td>{i.role}</td><td>{i.accepted ? "Accepted ✓" : "Pending"}</td></tr>)}</tbody>
        </table>
      )}
    </div>
  );
}
