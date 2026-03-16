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
  "/whales": "Whale Tracker",
  "/portfolio": "Portfolio",
  "/trades": "Trades",
  "/news": "News",
  "/settings": "Settings",
};

export default function Navbar() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "WhaleTrack";

  return (
    <header style={{
      height: "60px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      borderBottom: "1px solid var(--border)",
      background: "rgba(8, 12, 20, 0.8)",
      backdropFilter: "blur(20px)",
      position: "sticky",
      top: 0,
      zIndex: 20,
    }}>
      <h2 style={{ color: "var(--text-primary)", fontSize: "16px", fontWeight: 600, letterSpacing: "-0.02em" }}>{title}</h2>
      <appkit-button />
    </header>
  );
}