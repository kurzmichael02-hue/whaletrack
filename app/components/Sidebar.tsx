"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, createContext, useContext } from "react";

export const MenuContext = createContext<{ open: boolean; setOpen: (v: boolean) => void }>({
  open: false,
  setOpen: () => {},
});

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <MenuContext.Provider value={{ open, setOpen }}>{children}</MenuContext.Provider>;
}

const links = [
  { href: "/", label: "Dashboard", icon: "▪" },
  { href: "/whales", label: "Whales", icon: "◈" },
  { href: "/portfolio", label: "Portfolio", icon: "◎" },
  { href: "/wallets", label: "Wallets", icon: "⬡" },
  { href: "/trades", label: "Trades", icon: "⇅" },
  { href: "/alerts", label: "Alerts", icon: "◉" },
  { href: "/news", label: "News", icon: "≡" },
  { href: "/converter", label: "Tools", icon: "⊕" },
  { href: "/settings", label: "Settings", icon: "⊙" },
];

function NavLinks({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  return (
    <nav style={{ padding: "8px 0", flex: 1 }}>
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link key={link.href} href={link.href} onClick={onClose} style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "9px 16px", fontSize: "13px",
            fontWeight: active ? 500 : 400,
            color: active ? "#ffffff" : "#505050",
            textDecoration: "none",
            borderLeft: active ? "2px solid #0ecb81" : "2px solid transparent",
            background: active ? "rgba(14,203,129,0.05)" : "transparent",
            transition: "all 0.1s",
          }}>
            <span style={{ fontSize: "14px", color: active ? "#0ecb81" : "#333", width: "16px", textAlign: "center" }}>{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Logo() {
  return (
    <div style={{ padding: "18px 16px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", gap: "10px" }}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="9" stroke="#0ecb81" strokeWidth="1.5" />
        <path d="M5 10 Q10 4 15 10 Q10 16 5 10Z" fill="#0ecb81" fillOpacity="0.3" stroke="#0ecb81" strokeWidth="1" />
        <circle cx="10" cy="10" r="2" fill="#0ecb81" />
      </svg>
      <span style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.1em", color: "#ffffff" }}>WHALETRACK</span>
    </div>
  );
}

function LiveBadge() {
  return (
    <div style={{ padding: "12px 16px", borderTop: "1px solid #1a1a1a" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{
          width: "5px", height: "5px", borderRadius: "50%",
          background: "#0ecb81", display: "inline-block",
          boxShadow: "0 0 6px #0ecb81",
        }} />
        <span style={{ fontSize: "11px", color: "#333" }}>Live</span>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { open, setOpen } = useContext(MenuContext);
  const pathname = usePathname();
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      {open && (
        <div onClick={() => setOpen(false)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 40,
        }} />
      )}
      <aside style={{
        position: "fixed", top: 0, left: 0, bottom: 0, width: "220px",
        background: "#080808", borderRight: "1px solid #1a1a1a",
        display: "flex", flexDirection: "column", zIndex: 50,
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.2s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 16px", borderBottom: "1px solid #1a1a1a" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="#0ecb81" strokeWidth="1.5" />
              <path d="M5 10 Q10 4 15 10 Q10 16 5 10Z" fill="#0ecb81" fillOpacity="0.3" stroke="#0ecb81" strokeWidth="1" />
              <circle cx="10" cy="10" r="2" fill="#0ecb81" />
            </svg>
            <span style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.1em", color: "#fff" }}>WHALETRACK</span>
          </div>
          <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "#404040", cursor: "pointer", fontSize: "16px" }}>✕</button>
        </div>
        <NavLinks onClose={() => setOpen(false)} />
        <LiveBadge />
      </aside>
    </>
  );
}

export function DesktopSidebar() {
  return (
    <aside style={{
      width: "200px", minHeight: "100vh", background: "#080808",
      borderRight: "1px solid #1a1a1a", display: "flex", flexDirection: "column", flexShrink: 0,
    }}>
      <Logo />
      <NavLinks />
      <LiveBadge />
    </aside>
  );
}