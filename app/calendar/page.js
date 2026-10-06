import { redirect } from "next/navigation";
import { Shell, creatorNav } from "@/components/SpliceShell";
import { currentUser } from "@/lib/guard";
import { listContents } from "@/lib/store";

function dayKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default async function Calendar({ searchParams }) {
  const me = await currentUser();
  if (!me) redirect("/auth/signup");
  const now = new Date();
  const y = parseInt(searchParams?.y || now.getFullYear(), 10);
  const m = parseInt(searchParams?.m || now.getMonth() + 1, 10);
  const items = await listContents({ authorEmail: me.email, limit: 200 });
  const byDay = {};
  for (const c of items) {
    const stamp = c.scheduledFor || c.publishedAt || c.createdAt;
    if (!stamp) continue;
    const d = new Date(stamp);
    if (d.getFullYear() === y && d.getMonth() + 1 === m) {
      const k = dayKey(d);
      (byDay[k] = byDay[k] || []).push(c);
    }
  }
  const first = new Date(y, m - 1, 1);
  const cells = [];
  for (let i = 0; i < first.getDay(); i++) cells.push(null);
  const daysIn = new Date(y, m, 0).getDate();
  for (let d = 1; d <= daysIn; d++) cells.push(d);
  const monthName = first.toLocaleString("en", { month: "long" });
  const prev = m === 1 ? { y: y - 1, m: 12 } : { y, m: m - 1 };
  const next = m === 12 ? { y: y + 1, m: 1 } : { y, m: m + 1 };

  return (
    <Shell title="Calendar" crumbs={["Monthly Content Calendar"]} nav={creatorNav} user={me.name}>
      <div className="card">
        <div className="flex items-center justify-between">
          <a className="btn2" href={`/calendar?y=${prev.y}&m=${prev.m}`}>← Prev</a>
          <div className="font-extrabold text-xl">{monthName} {y}</div>
          <a className="btn2" href={`/calendar?y=${next.y}&m=${next.m}`}>Next →</a>
        </div>
        <div className="grid grid-cols-7 gap-1 mt-4 text-center text-xs text-gray-500">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1 mt-1">
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const k = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            const list = byDay[k] || [];
            return (
              <div key={i} className="border rounded-md p-1 min-h-[70px] text-left bg-white">
                <div className="text-xs font-bold">{d}</div>
                {list.map((c) => (
                  <a key={c.id} href={`/content/${c.id}`} className="block text-[11px] truncate rounded px-1 mt-0.5" style={{ background: c.status === "Published" ? "#2A9D8F22" : c.status === "Scheduled" ? "#D4A57433" : "#F8F6F2" }} title={`${c.status}: ${(c.original || "").slice(0, 80)}`}>
                    {c.status === "Published" ? "✓ " : c.status === "Scheduled" ? "⏳ " : "• "}{(c.original || "").slice(0, 24)}
                  </a>
                ))}
              </div>
            );
          })}
        </div>
        <div className="text-xs text-gray-500 mt-3">✓ Published · ⏳ Scheduled (LinkedIn auto) · • Draft/In Review. Paste Google Doc text straight into <a className="underline" href="/generate">Generate</a> to import.</div>
      </div>
    </Shell>
  );
}
