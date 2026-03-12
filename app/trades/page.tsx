"use client";

import { useState } from "react";

type Trade = {
  id: string;
  pair: string;
  type: "long" | "short";
  entry: number;
  current: number;
  size: number;
  pnl: number;
  pnlPercent: number;
  status: "open" | "closed";
  date: string;
};

const MOCK_TRADES: Trade[] = [
  { id: "1", pair: "BTC/USDT", type: "long", entry: 62000, current: 84000, size: 0.12, pnl: 2640, pnlPercent: 35.5, status: "open", date: "2024-12-01" },
  { id: "2", pair: "ETH/USDT", type: "long", entry: 1800, current: 2100, size: 2.5, pnl: 750, pnlPercent: 16.7, status: "open", date: "2024-11-15" },
  { id: "3", pair: "SOL/USDT", type: "long", entry: 60, current: 87, size: 45, pnl: 1215, pnlPercent: 45.0, status: "open", date: "2024-10-20" },
  { id: "4", pair: "BTC/USDT", type: "short", entry: 70000, current: 84000, size: 0.05, pnl: -700, pnlPercent: -20.0, status: "closed", date: "2024-10-15" },
  { id: "5", pair: "SOL/USDT", type: "short", entry: 120, current: 95, size: 10, pnl: 250, pnlPercent: 20.8, status: "closed", date: "2024-11-01" },
  { id: "6", pair: "ETH/USDT", type: "short", entry: 2400, current: 2100, size: 1.0, pnl: 300, pnlPercent: 12.5, status: "closed", date: "2024-09-10" },
  { id: "7", pair: "BTC/USDT", type: "long", entry: 42000, current: 62000, size: 0.08, pnl: 1600, pnlPercent: 47.6, status: "closed", date: "2024-08-01" },
  { id: "8", pair: "SOL/USDT", type: "long", entry: 30, current: 60, size: 100, pnl: 3000, pnlPercent: 100.0, status: "closed", date: "2024-07-15" },
];

const PAIR_COLORS: Record<string, string> = {
  "BTC/USDT": "#F7931A",
  "ETH/USDT": "#627EEA",
  "SOL/USDT": "#9945FF",
};

export default function TradesPage() {
  const [filter, setFilter] = useState<"all" | "open" | "closed">("all");

  const filtered = MOCK_TRADES.filter((t) => filter === "all" || t.status === filter);
  const openPnl = MOCK_TRADES.filter((t) => t.status === "open").reduce((s, t) => s + t.pnl, 0);
  const totalPnl = MOCK_TRADES.reduce((s, t) => s + t.pnl, 0);
  const wins = MOCK_TRADES.filter((t) => t.pnl > 0).length;
  const winRate = Math.round((wins / MOCK_TRADES.length) * 100);
  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
    <div className="p-8 space-y-8 min-h-screen" style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1529 50%, #0a0f1e 100%)" }}>
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Trades</h2>
        <p className="text-gray-500 text-sm mt-1">Your trading history and open positions</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Open PnL", value: `${openPnl >= 0 ? "+" : ""}$${fmt(openPnl)}`, color: openPnl >= 0 ? "#10b981" : "#ef4444" },
          { label: "Total PnL", value: `${totalPnl >= 0 ? "+" : ""}$${fmt(totalPnl)}`, color: totalPnl >= 0 ? "#10b981" : "#ef4444" },
          { label: "Win Rate", value: `${winRate}%`, color: winRate >= 50 ? "#10b981" : "#ef4444" },
          { label: "Total Trades", value: `${MOCK_TRADES.length}`, color: "#fff" },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl p-5 relative overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="absolute inset-0 opacity-5" style={{ background: "radial-gradient(circle at top right, rgba(16,185,129,0.4), transparent 70%)" }} />
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">{card.label}</p>
            <p className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["all", "open", "closed"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize" style={{ background: filter === f ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.03)", border: filter === f ? "1px solid rgba(16,185,129,0.25)" : "1px solid rgba(255,255,255,0.07)", color: filter === f ? "#10b981" : "#6b7280" }}>
            {f} {f === "all" ? `(${MOCK_TRADES.length})` : f === "open" ? `(${MOCK_TRADES.filter(t => t.status === "open").length})` : `(${MOCK_TRADES.filter(t => t.status === "closed").length})`}
          </button>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <table className="w-full">
          <thead>
            <tr className="text-gray-600 text-xs uppercase tracking-widest">
              <th className="text-left px-6 py-3">Pair</th>
              <th className="text-left px-6 py-3">Type</th>
              <th className="text-left px-6 py-3">Entry</th>
              <th className="text-left px-6 py-3">Current</th>
              <th className="text-left px-6 py-3">Size</th>
              <th className="text-left px-6 py-3">PnL</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-left px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((trade) => (
              <tr key={trade.id} className="border-t transition-colors hover:bg-white/2" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: PAIR_COLORS[trade.pair] ?? "#fff" }} />
                    <span className="text-white font-semibold">{trade.pair}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ background: trade.type === "long" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: trade.type === "long" ? "#10b981" : "#ef4444" }}>
                    {trade.type === "long" ? "▲ LONG" : "▼ SHORT"}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400">${fmt(trade.entry)}</td>
                <td className="px-6 py-4 text-gray-300">${fmt(trade.current)}</td>
                <td className="px-6 py-4 text-gray-400">{trade.size}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ background: trade.pnl >= 0 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: trade.pnl >= 0 ? "#10b981" : "#ef4444" }}>
                    {trade.pnl >= 0 ? "+" : ""}${fmt(trade.pnl)} ({trade.pnlPercent.toFixed(1)}%)
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: trade.status === "open" ? "rgba(59,130,246,0.1)" : "rgba(107,114,128,0.1)", color: trade.status === "open" ? "#60a5fa" : "#6b7280", border: trade.status === "open" ? "1px solid rgba(59,130,246,0.2)" : "1px solid rgba(107,114,128,0.2)" }}>
                    {trade.status === "open" ? "● Open" : "Closed"}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">{trade.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
