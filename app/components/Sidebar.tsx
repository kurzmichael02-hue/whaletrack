"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard", icon: "⬡" },
  { href: "/whales", label: "Whales", icon: "🐋" },
  { href: "/portfolio", label: "Portfolio", icon: "◈" },
  { href: "/trades", label: "Trades", icon: "⇄" },
  { href: "/news", label: "News", icon: "◉" },
  { href: "/settings", label: "Settings", icon: "⚙" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 flex flex-col py-6 px-4 gap-1" style={{ background: "rgba(10,15,30,0.95)", borderRight: "1px solid rgba(255,255,255,0.06)", minHeight: "100vh" }}>
      <div className="px-3 mb-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐋</span>
          <span className="text-white font-bold text-lg tracking-tight">WhaleTrack</span>
        </div>
        <p className="text-gray-600 text-xs mt-1 ml-9">Crypto Intelligence</p>
      </div>

      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200"
              style={{
                background: active ? "rgba(16,185,129,0.12)" : "transparent",
                color: active ? "#10b981" : "#6b7280",
                border: active ? "1px solid rgba(16,185,129,0.2)" : "1px solid transparent",
              }}
            >
              <span className="text-base">{link.icon}</span>
              <span className="font-medium">{link.label}</span>
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-3">
        <div className="rounded-xl p-3" style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)" }}>
          <p className="text-green-400 text-xs font-medium">● Live</p>
          <p className="text-gray-600 text-xs mt-0.5">Real-time data active</p>
        </div>
      </div>
    </aside>
  );
}
