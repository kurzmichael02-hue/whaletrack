"use client";

import { usePathname } from "next/navigation";
import { useContext } from "react";
import { MenuContext } from "./Sidebar";
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
      height: "48px", borderBottom: "1px solid #1f1f1f",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 16px", background: "#0a0a0a",
      position: "sticky", top: 0, zIndex: 30,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          className="mobile-only"
          onClick={() => setOpen(true)}
          style={{
            display: "flex", flexDirection: "column", gap: "4px",
            background: "none", border: "none", cursor: "pointer", padding: "4px",
          }}
        >
          <span style={{ width: "18px", height: "1.5px", background: "#808080", display: "block" }} />
          <span style={{ width: "18px", height: "1.5px", background: "#808080", display: "block" }} />
          <span style={{ width: "18px", height: "1.5px", background: "#808080", display: "block" }} />
        </button>
        <span style={{ fontSize: "13px", fontWeight: 500, color: "#808080" }}>
          {PAGE_TITLES[pathname] ?? "WhaleTrack"}
        </span>
      </div>
      <appkit-button />
    </header>
  );
}