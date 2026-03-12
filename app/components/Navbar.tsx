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
  "/settings": "Settings",
};

export default function Navbar() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "WhaleTrack";

  return (
    <header className="h-16 flex items-center justify-between px-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,15,30,0.8)", backdropFilter: "blur(12px)" }}>
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-white tracking-tight">{title}</h2>
      </div>
      <appkit-button />
    </header>
  );
}