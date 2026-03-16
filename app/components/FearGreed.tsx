"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type FGData = {
  value: string;
  value_classification: string;
  timestamp: string;
};

export default function FearGreed() {
  const [data, setData] = useState<FGData | null>(null);

  useEffect(() => {
    fetch("/api/feargreed").then((r) => r.json()).then(setData);
  }, []);

  if (!data) return (
    <div style={{ padding: "20px", borderBottom: "1px solid #1f1f1f" }}>
      <div className="skeleton" style={{ height: "60px" }} />
    </div>
  );

  const value = parseInt(data.value);
  const color = value <= 25 ? "#f6465d" : value <= 45 ? "#f7931a" : value <= 55 ? "#f3ba2f" : value <= 75 ? "#0ecb81" : "#00ff87";
  const label = data.value_classification;

  return (
    <div style={{ padding: "20px", borderBottom: "1px solid #1f1f1f", display: "flex", alignItems: "center", gap: "24px" }}>
      <div>
        <p style={{ fontSize: "11px", color: "#404040", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Fear & Greed Index</p>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ fontSize: "36px", fontWeight: 700, color, fontFamily: "monospace", fontVariantNumeric: "tabular-nums" }}
          >
            {value}
          </motion.span>
          <span style={{ fontSize: "13px", color, fontWeight: 500 }}>{label}</span>
        </div>
      </div>

      {/* Gauge bar */}
      <div style={{ flex: 1, maxWidth: "300px" }}>
        <div style={{ height: "6px", background: "#1f1f1f", borderRadius: "3px", overflow: "hidden", marginBottom: "6px" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            style={{ height: "100%", background: `linear-gradient(90deg, #f6465d 0%, #f7931a 25%, #f3ba2f 50%, #0ecb81 75%, #00ff87 100%)`, borderRadius: "3px" }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "10px", color: "#f6465d" }}>Extreme Fear</span>
          <span style={{ fontSize: "10px", color: "#00ff87" }}>Extreme Greed</span>
        </div>
      </div>
    </div>
  );
}