"use client";

import { usePathname } from "next/navigation";
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
  "/news": "News",
  "/settings": "Settings",
};

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header style={{
      height: "48px",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      background: "var(--bg)",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-2)" }}>
        {PAGE_TITLES[pathname] ?? "WhaleTrack"}
      </span>
      <appkit-button />
    </header>
  );
}