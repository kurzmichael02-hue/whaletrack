"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type MarketData = {
  total_market_cap: { usd: number };
  total_volume: { usd: number };
  market_cap_percentage: { btc: number; eth: number };
  market_cap_change_percentage_24h_usd: number;
};

export default function MarketStats() {
  const [data, setData] = useState<MarketData | null>(null);

  useEffect(() => {
    fetch("/api/marketcap").then((r) => r.json()).then(setData);
  }, []);

  const fmt = (n: number) => {
    if (n >= 1_000_000_000_000) return `$${(n / 1_000_000_000_000).toFixed(2)}T`;
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
    return `$${(n / 1_000_000).toFixed(0)}M`;
  };

  const stats = data ? [
    { label: "Total Market Cap", value: fmt(data.total_market_cap.usd), change: data.market_cap_change_percentage_24h_usd },
    { label: "24h Volume", value: fmt(data.total_volume.usd), change: null },
    { label: "BTC Dominance", value: `${data.market_cap_percentage.btc.toFixed(1)}%`, change: null },
    { label: "ETH Dominance", value: `${data.market_cap_percentage.eth.toFixed(1)}%`, change: null },
  ] : [];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: "1px solid #1f1f1f" }}>
      {!data ? Array.from({ length: 4 }).map((_, i) => (
        <div key={i} style={{ padding: "16px 20px", borderRight: i < 3 ? "1px solid #1f1f1f" : "none" }}>
          <div className="skeleton" style={{ height: "12px", width: "80px", marginBottom: "8px" }} />
          <div className="skeleton" style={{ height: "20px", width: "120px" }} />
        </div>
      )) : stats.map((s, i) => (
        <motion.div key={s.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
          style={{ padding: "16px 20px", borderRight: i < 3 ? "1px solid #1f1f1f" : "none" }}>
          <p style={{ fontSize: "11px", color: "#404040", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>{s.label}</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <span style={{ fontSize: "16px", fontWeight: 600, color: "#fff", fontFamily: "monospace" }}>{s.value}</span>
            {s.change !== null && (
              <span style={{ fontSize: "11px", color: s.change >= 0 ? "#0ecb81" : "#f6465d" }}>
                {s.change >= 0 ? "▲" : "▼"} {Math.abs(s.change).toFixed(2)}%
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}