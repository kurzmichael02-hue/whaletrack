"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/whales", label: "Whales" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/trades", label: "Trades" },
  { href: "/alerts", label: "Alerts" },
  { href: "/news", label: "News" },
  { href: "/settings", label: "Settings" },
];


export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: "200px",
      minHeight: "100vh",
      background: "#0a0a0a",
      borderRight: "1px solid #1f1f1f",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
    }}>
      <div style={{ padding: "20px 16px", borderBottom: "1px solid #1f1f1f" }}>
        <span style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.08em", color: "#ffffff" }}>
          WHALETRACK
        </span>
      </div>

      <nav style={{ padding: "8px 0", flex: 1 }}>
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} style={{
              display: "block",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: active ? 500 : 400,
              color: active ? "#ffffff" : "#808080",
              textDecoration: "none",
              borderLeft: active ? "2px solid #0ecb81" : "2px solid transparent",
              background: active ? "rgba(255,255,255,0.03)" : "transparent",
              transition: "all 0.1s",
            }}>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: "12px 16px", borderTop: "1px solid #1f1f1f" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#0ecb81", display: "inline-block" }} />
          <span style={{ fontSize: "11px", color: "#404040" }}>Live</span>
        </div>
      </div>
    </aside>
  );
}
