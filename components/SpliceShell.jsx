export function Logo({ small = false }) {
  return (
    <a href="/" className="flex items-center gap-2">
      <span
        aria-hidden
        style={{
          width: small ? 26 : 32, height: small ? 26 : 32, borderRadius: 999,
          border: "3px solid #0D7377", borderTopColor: "#D4A574",
          display: "inline-block",
        }}
      />
      <span className="font-extrabold tracking-tight" style={{ fontSize: small ? 16 : 20 }}>
        SPLICE <span className="font-normal text-xs align-middle ml-1 px-1 rounded" style={{ background: "#F8F6F2" }}>OS</span>
      </span>
    </a>
  );
}

export function Shell({ title, crumbs = [], actions = null, nav = [], user = null, children }) {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-4">
            <Logo small />
            <div className="text-sm text-gray-500">{crumbs.join(" › ") || title}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge bg-green-50 text-green-800 border">● LinkedIn Connected</span>
            {actions}
            {user ? <span className="text-sm font-semibold">{user}</span> : <a className="btn2" href="/auth/signup">Sign In</a>}
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
        {nav.length > 0 && (
          <aside className="w-52 shrink-0">
            <nav className="card !p-3 flex flex-col gap-1 text-sm">
              {nav.map((n) => (
                <a key={n.href} href={n.href} className="rounded-md px-3 py-2 hover:bg-[#F8F6F2]">{n.label}</a>
              ))}
            </nav>
          </aside>
        )}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

export const creatorNav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/generate", label: "Create Splice" },
  { href: "/calendar", label: "Calendar" },
  { href: "/settings", label: "Brand Voice" },
  { href: "/auth/linkedin", label: "LinkedIn Sync" },
  { href: "/history", label: "History & Posts" },
  { href: "/settings", label: "Settings" },
];

export const oyinNav = [
  { href: "/dashboard/oyin", label: "Dashboard" },
  { href: "/dashboard/oyin/my-content", label: "My Content" },
  { href: "/dashboard/oyin/review-queue", label: "Review Queue" },
  { href: "/settings/oyin", label: "Settings" },
];

export const adminNav = [
  { href: "/admin/dashboard", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/team-activity", label: "Team Activity" },
  { href: "/admin/content-activity", label: "Content Activity" },
  { href: "/admin/publishing-monitor", label: "Publishing Monitor" },
  { href: "/admin/social-accounts", label: "Social Accounts" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/audit-log", label: "Audit Log" },
  { href: "/admin/settings", label: "System Settings" },
];
