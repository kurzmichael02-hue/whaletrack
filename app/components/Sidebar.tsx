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
    <aside style={{
      width: "220px",
      minHeight: "100vh",
      background: "rgba(8, 12, 20, 0.95)",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      padding: "24px 12px",
      gap: "4px",
      backdropFilter: "blur(20px)",
      position: "relative",
      zIndex: 10,
    }}>
      <div style={{ padding: "0 12px", marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "22px" }}>🐋</span>
          <span style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "16px", letterSpacing: "-0.02em" }}>WhaleTrack</span>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "11px", marginTop: "4px", marginLeft: "30px" }}>Crypto Intelligence</p>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 500,
              textDecoration: "none",
              transition: "all 0.15s",
              background: active ? "var(--accent-dim)" : "transparent",
              color: active ? "var(--accent)" : "var(--text-secondary)",
              border: active ? "1px solid var(--accent-border)" : "1px solid transparent",
            }}>
              <span style={{ fontSize: "14px" }}>{link.icon}</span>
              <span>{link.label}</span>
              {active && <span style={{ marginLeft: "auto", width: "5px", height: "5px", borderRadius: "50%", background: "var(--accent)" }} />}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: "12px", borderRadius: "12px", background: "var(--accent-dim)", border: "1px solid var(--accent-border)" }}>
        <p style={{ color: "var(--accent)", fontSize: "11px", fontWeight: 600 }}>● Live</p>
        <p style={{ color: "var(--text-muted)", fontSize: "11px", marginTop: "2px" }}>Real-time data active</p>
      </div>
    </aside>
  );
}