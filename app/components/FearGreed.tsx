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
  const [history, setHistory] = useState<FGData[]>([]);

  useEffect(() => {
    fetch("https://api.alternative.me/fng/?limit=7")
      .then((r) => r.json())
      .then((d) => {
        setData(d.data?.[0] ?? null);
        setHistory(d.data ?? []);
      });
  }, []);

  if (!data) return (
    <div style={{ padding: "20px", borderBottom: "1px solid #1f1f1f" }}>
      <div className="skeleton" style={{ height: "80px" }} />
    </div>
  );

  const value = parseInt(data.value);
  const getColor = (v: number) =>
    v <= 25 ? "#f6465d" : v <= 45 ? "#f7931a" : v <= 55 ? "#f3ba2f" : v <= 75 ? "#0ecb81" : "#00ff87";

  const color = getColor(value);

  return (
    <div style={{ borderBottom: "1px solid #1f1f1f", display: "flex", alignItems: "stretch" }}>
      {/* Main value */}
      <div style={{ padding: "20px 24px", borderRight: "1px solid #1f1f1f", minWidth: "200px" }}>
        <p style={{ fontSize: "11px", color: "#404040", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
          Fear & Greed Index
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "12px" }}>
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: "42px", fontWeight: 700, color, fontFamily: "monospace", lineHeight: 1 }}
          >
            {value}
          </motion.span>
          <span style={{ fontSize: "13px", color, fontWeight: 500 }}>{data.value_classification}</span>
        </div>

        {/* Gauge */}
        <div style={{ height: "4px", background: "#1f1f1f", borderRadius: "2px", overflow: "hidden", marginBottom: "4px" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #f6465d 0%, #f7931a 30%, #f3ba2f 50%, #0ecb81 70%, #00ff87 100%)",
              borderRadius: "2px",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "10px", color: "#404040" }}>Fear</span>
          <span style={{ fontSize: "10px", color: "#404040" }}>Greed</span>
        </div>
      </div>

      {/* 7 day history */}
      <div style={{ padding: "20px 24px", flex: 1 }}>
        <p style={{ fontSize: "11px", color: "#404040", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
          Last 7 Days
        </p>
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
          {[...history].reverse().map((d, i) => {
            const v = parseInt(d.value);
            const c = getColor(v);
            const date = new Date(parseInt(d.timestamp) * 1000);
            const dayLabel = date.toLocaleDateString("en", { weekday: "short" });
            return (
              <motion.div
                key={d.timestamp}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flex: 1 }}
              >
                <span style={{ fontSize: "11px", fontWeight: 600, color: c, fontFamily: "monospace" }}>{v}</span>
                <div style={{ width: "100%", height: "32px", background: "#1f1f1f", borderRadius: "3px", overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${v}%` }}
                    transition={{ delay: i * 0.06 + 0.3, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                    style={{ width: "100%", background: c, opacity: 0.7, borderRadius: "2px" }}
                  />
                </div>
                <span style={{ fontSize: "10px", color: "#404040" }}>{dayLabel}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
