"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/whales", label: "🐋 Whales" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/trades", label: "Trades" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col gap-6">
      <h1 className="text-xl font-bold text-green-400">🐋 WhaleTrack</h1>
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-2 rounded-lg transition-colors ${
              pathname === link.href
                ? "bg-green-500 text-black font-semibold"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
