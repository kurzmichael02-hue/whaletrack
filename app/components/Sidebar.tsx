"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

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
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  const navContent = (
    <>
      <nav style={{ padding: "8px 0", flex: 1 }}>
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} style={{
              display: "block",
              padding: "10px 16px",
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
    </>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile overlay */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.7)",
              zIndex: 40,
            }}
          />
        )}

        {/* Mobile drawer */}
        <aside style={{
          position: "fixed",
          top: 0, left: 0, bottom: 0,
          width: "220px",
          background: "#0a0a0a",
          borderRight: "1px solid #1f1f1f",
          display: "flex",
          flexDirection: "column",
          zIndex: 50,
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.2s ease",
        }}>
          <div style={{ padding: "16px", borderBottom: "1px solid #1f1f1f", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.08em", color: "#ffffff" }}>WHALETRACK</span>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "#808080", cursor: "pointer", fontSize: "18px", padding: "0 4px" }}>✕</button>
          </div>
          {navContent}
        </aside>

        {/* Hamburger button — shown in Navbar on mobile */}
        <button
          id="hamburger-btn"
          onClick={() => setOpen(true)}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
          }}
        >
          <span style={{ width: "18px", height: "1.5px", background: "#808080", display: "block" }} />
          <span style={{ width: "18px", height: "1.5px", background: "#808080", display: "block" }} />
          <span style={{ width: "18px", height: "1.5px", background: "#808080", display: "block" }} />
        </button>
      </>
    );
  }

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
        <span style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.08em", color: "#ffffff" }}>WHALETRACK</span>
      </div>
      {navContent}
    </aside>
  );
}