"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Token = { symbol: string; change: number; volume: number };

const TOKENS = ["BTC", "ETH", "SOL", "BNB", "XRP", "DOGE", "ADA", "AVAX", "LINK", "DOT", "MATIC", "UNI", "LTC", "ATOM", "NEAR"];

export default function Heatmap() {
  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    async function load() {
      const results = await Promise.all(
        TOKENS.map((s) =>
          fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${s}USDT`).then((r) => r.json())
        )
      );
      setTokens(results.map((r, i) => ({
        symbol: TOKENS[i]!,
        change: parseFloat(r.priceChangePercent),
        volume: parseFloat(r.quoteVolume),
      })));
    }
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  function getColor(change: number) {
    if (change > 10) return { bg: "rgba(14,203,129,0.3)", border: "rgba(14,203,129,0.5)", text: "#0ecb81" };
    if (change > 5) return { bg: "rgba(14,203,129,0.2)", border: "rgba(14,203,129,0.35)", text: "#0ecb81" };
    if (change > 0) return { bg: "rgba(14,203,129,0.08)", border: "rgba(14,203,129,0.2)", text: "#0ecb81" };
    if (change > -5) return { bg: "rgba(246,70,93,0.08)", border: "rgba(246,70,93,0.2)", text: "#f6465d" };
    if (change > -10) return { bg: "rgba(246,70,93,0.2)", border: "rgba(246,70,93,0.35)", text: "#f6465d" };
    return { bg: "rgba(246,70,93,0.3)", border: "rgba(246,70,93,0.5)", text: "#f6465d" };
  }

  return (
    <div style={{ borderBottom: "1px solid #1a1a1a", padding: "16px 20px" }}>
      <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "11px", color: "#333", textTransform: "uppercase", letterSpacing: "0.08em" }}>Market Heatmap</span>
        <span style={{ fontSize: "10px", color: "#222" }}>24h change</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px" }}>
        {tokens.length === 0
          ? Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "56px", borderRadius: "4px" }} />
            ))
          : tokens.map((t, i) => {
              const c = getColor(t.change);
              return (
                <motion.div
                  key={t.symbol}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  style={{
                    background: c.bg, border: `1px solid ${c.border}`,
                    borderRadius: "4px", padding: "10px 8px",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                    cursor: "default",
                  }}
                  whileHover={{ scale: 1.03 } as any}
                >
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#fff" }}>{t.symbol}</span>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: c.text }}>
                    {t.change >= 0 ? "+" : ""}{t.change.toFixed(2)}%
                  </span>
                </motion.div>
              );
            })}
      </div>
    </div>
  );
}