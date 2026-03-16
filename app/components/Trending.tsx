"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Coin = {
  item: {
    id: string;
    name: string;
    symbol: string;
    thumb: string;
    data: {
      price: string;
      price_change_percentage_24h: { usd: number };
    };
  };
};

export default function Trending() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/trending")
      .then((r) => r.json())
      .then((d) => { setCoins(d); setLoading(false); });
  }, []);

  return (
    <div style={{ borderBottom: "1px solid #1f1f1f" }}>
      <div style={{ padding: "10px 20px", borderBottom: "1px solid #1f1f1f", display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "11px", color: "#404040", textTransform: "uppercase", letterSpacing: "0.08em" }}>Trending</span>
        <span style={{ fontSize: "10px", color: "#2a2a2a" }}>past 24h</span>
      </div>

      {loading ? (
        <div style={{ display: "flex", gap: "1px" }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} style={{ flex: 1, padding: "14px 16px" }}>
              <div className="skeleton" style={{ height: "12px", marginBottom: "6px" }} />
              <div className="skeleton" style={{ height: "16px" }} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "flex" }}>
          {coins.map((c, i) => {
            const change = c.item.data?.price_change_percentage_24h?.usd ?? 0;
            const positive = change >= 0;
            return (
              <motion.div
                key={c.item.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  flex: 1, padding: "14px 16px",
                  borderRight: i < coins.length - 1 ? "1px solid #1f1f1f" : "none",
                  cursor: "default",
                  transition: "background 0.1s",
                }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" } as any}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                  <img src={c.item.thumb} alt="" style={{ width: "16px", height: "16px", borderRadius: "50%" }} />
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#fff" }}>{c.item.symbol.toUpperCase()}</span>
                </div>
                <p style={{ fontSize: "11px", color: "#404040", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.item.name}</p>
                <span style={{ fontSize: "11px", fontWeight: 500, color: positive ? "#0ecb81" : "#f6465d" }}>
                  {positive ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
                </span>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}