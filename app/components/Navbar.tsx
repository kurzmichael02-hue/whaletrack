"use client";

import { usePathname } from "next/navigation";
import { useContext } from "react";
import { MenuContext } from "./Sidebar";
import TokenSearch from "./TokenSearch";
import React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "appkit-button": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/whales": "Whales",
  "/portfolio": "Portfolio",
  "/trades": "Trades",
  "/alerts": "Alerts",
  "/news": "News",
  "/settings": "Settings",
};

export default function Navbar() {
  const pathname = usePathname();
  const { setOpen } = useContext(MenuContext);

  return (
    <header style={{
      height: "52px", borderBottom: "1px solid #1a1a1a",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 16px", background: "#080808",
      position: "sticky", top: 0, zIndex: 30, gap: "16px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
        <button
          className="mobile-only"
          onClick={() => setOpen(true)}
          style={{
            display: "flex", flexDirection: "column", gap: "4px",
            background: "none", border: "none", cursor: "pointer", padding: "4px",
          }}
        >
          <span style={{ width: "18px", height: "1.5px", background: "#505050", display: "block" }} />
          <span style={{ width: "18px", height: "1.5px", background: "#505050", display: "block" }} />
          <span style={{ width: "18px", height: "1.5px", background: "#505050", display: "block" }} />
        </button>
        <span style={{ fontSize: "13px", fontWeight: 500, color: "#404040" }}>
          {PAGE_TITLES[pathname] ?? "WhaleTrack"}
        </span>
      </div>

      <div className="hide-mobile" style={{ flex: 1, maxWidth: "400px" }}>
        <TokenSearch />
      </div>

      <appkit-button />
    </header>
  );
}
