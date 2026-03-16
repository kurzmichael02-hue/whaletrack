"use client";

import { useState } from "react";
import { motion } from "framer-motion";

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

const TRADES: Trade[] = [
  { id: "1", pair: "BTC/USDT", type: "long", entry: 62000, current: 84000, size: 0.12, pnl: 2640, pnlPercent: 35.5, status: "open", date: "2024-12-01" },
  { id: "2", pair: "ETH/USDT", type: "long", entry: 1800, current: 2100, size: 2.5, pnl: 750, pnlPercent: 16.7, status: "open", date: "2024-11-15" },
  { id: "3", pair: "SOL/USDT", type: "long", entry: 60, current: 87, size: 45, pnl: 1215, pnlPercent: 45.0, status: "open", date: "2024-10-20" },
  { id: "4", pair: "BTC/USDT", type: "short", entry: 70000, current: 84000, size: 0.05, pnl: -700, pnlPercent: -20.0, status: "closed", date: "2024-10-15" },
  { id: "5", pair: "SOL/USDT", type: "short", entry: 120, current: 95, size: 10, pnl: 250, pnlPercent: 20.8, status: "closed", date: "2024-11-01" },
  { id: "6", pair: "ETH/USDT", type: "short", entry: 2400, current: 2100, size: 1.0, pnl: 300, pnlPercent: 12.5, status: "closed", date: "2024-09-10" },
  { id: "7", pair: "BTC/USDT", type: "long", entry: 42000, current: 62000, size: 0.08, pnl: 1600, pnlPercent: 47.6, status: "closed", date: "2024-08-01" },
  { id: "8", pair: "SOL/USDT", type: "long", entry: 30, current: 60, size: 100, pnl: 3000, pnlPercent: 100.0, status: "closed", date: "2024-07-15" },
];

export default function TradesPage() {
  const [filter, setFilter] = useState<"all" | "open" | "closed">("all");
  const filtered = TRADES.filter((t) => filter === "all" || t.status === filter);
  const openPnl = TRADES.filter((t) => t.status === "open").reduce((s, t) => s + t.pnl, 0);
  const totalPnl = TRADES.reduce((s, t) => s + t.pnl, 0);
  const winRate = Math.round((TRADES.filter((t) => t.pnl > 0).length / TRADES.length) * 100);
  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
    <div style={{ minHeight: "100vh" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: "1px solid #1f1f1f" }}>
        {[
          { label: "Open PnL", value: `${openPnl >= 0 ? "+" : ""}$${fmt(openPnl)}`, green: openPnl >= 0 },
          { label: "Total PnL", value: `${totalPnl >= 0 ? "+" : ""}$${fmt(totalPnl)}`, green: totalPnl >= 0 },
          { label: "Win Rate", value: `${winRate}%`, green: winRate >= 50 },
          { label: "Total Trades", value: `${TRADES.length}`, green: false },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
            style={{ padding: "20px", borderRight: i < 3 ? "1px solid #1f1f1f" : "none" }}>
            <p style={{ fontSize: "11px", color: "#404040", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>{s.label}</p>
            <p style={{ fontSize: "24px", fontWeight: 600, color: s.green ? "#0ecb81" : "#ffffff", fontFamily: "monospace", fontVariantNumeric: "tabular-nums" }}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ padding: "12px 20px", borderBottom: "1px solid #1f1f1f", display: "flex", gap: "4px" }}>
        {(["all", "open", "closed"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "4px 12px", borderRadius: "4px", border: "1px solid",
            fontSize: "12px", cursor: "pointer", transition: "all 0.1s", fontWeight: 500,
            background: filter === f ? "rgba(14,203,129,0.08)" : "transparent",
            borderColor: filter === f ? "rgba(14,203,129,0.3)" : "#1f1f1f",
            color: filter === f ? "#0ecb81" : "#808080",
          }}>
            {f.charAt(0).toUpperCase() + f.slice(1)} ({f === "all" ? TRADES.length : TRADES.filter((t) => t.status === f).length})
          </button>
        ))}
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #1f1f1f" }}>
            {["Pair", "Type", "Entry", "Current", "Size", "PnL", "Status", "Date"].map((h) => (
              <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: "11px", color: "#404040", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 400 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((t, i) => (
            <motion.tr key={t.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              style={{ borderBottom: "1px solid #1f1f1f" }}>
              <td style={{ padding: "14px 20px", fontSize: "13px", fontWeight: 600, color: "#fff" }}>{t.pair}</td>
              <td style={{ padding: "14px 20px" }}>
                <span className={t.type === "long" ? "tag-green" : "tag-red"}>{t.type === "long" ? "▲ LONG" : "▼ SHORT"}</span>
              </td>
              <td style={{ padding: "14px 20px", fontSize: "13px", color: "#808080", fontFamily: "monospace" }}>${fmt(t.entry)}</td>
              <td style={{ padding: "14px 20px", fontSize: "13px", color: "#fff", fontFamily: "monospace" }}>${fmt(t.current)}</td>
              <td style={{ padding: "14px 20px", fontSize: "13px", color: "#808080", fontFamily: "monospace" }}>{t.size}</td>
              <td style={{ padding: "14px 20px" }}>
                <span style={{ fontSize: "13px", fontWeight: 500, color: t.pnl >= 0 ? "#0ecb81" : "#f6465d", fontFamily: "monospace" }}>
                  {t.pnl >= 0 ? "+" : ""}${fmt(t.pnl)} ({t.pnlPercent.toFixed(1)}%)
                </span>
              </td>
              <td style={{ padding: "14px 20px" }}>
                <span className={t.status === "open" ? "tag-green" : "tag-neutral"}>
                  {t.status === "open" ? "● Open" : "Closed"}
                </span>
              </td>
              <td style={{ padding: "14px 20px", fontSize: "12px", color: "#404040" }}>{t.date}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}