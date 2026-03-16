"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Gas = { SafeGasPrice: string; ProposeGasPrice: string; FastGasPrice: string };
type Chain = { name: string; tvl: number; change: number };

export default function GasAndTVL() {
  const [gas, setGas] = useState<Gas | null>(null);
  const [chains, setChains] = useState<Chain[]>([]);

  useEffect(() => {
    fetch("/api/gas").then((r) => r.json()).then(setGas);
    fetch("/api/tvl").then((r) => r.json()).then(setChains);
  }, []);

  const fmtTVL = (n: number) => {
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
    return `$${n.toFixed(0)}`;
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid #1a1a1a" }}>
      {/* Gas Tracker */}
      <div style={{ borderRight: "1px solid #1a1a1a", padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <span style={{ fontSize: "11px", color: "#333", textTransform: "uppercase", letterSpacing: "0.08em" }}>ETH Gas</span>
          <span style={{ fontSize: "10px", color: "#0ecb81" }}>Gwei</span>
        </div>
        {!gas ? (
          <div className="skeleton" style={{ height: "32px" }} />
        ) : (
          <div style={{ display: "flex", gap: "20px" }}>
            {[
              { label: "Slow", value: gas.SafeGasPrice, color: "#0ecb81" },
              { label: "Normal", value: gas.ProposeGasPrice, color: "#f7931a" },
              { label: "Fast", value: gas.FastGasPrice, color: "#f6465d" },
            ].map((g, i) => (
              <motion.div key={g.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                <p style={{ fontSize: "10px", color: "#333", marginBottom: "4px" }}>{g.label}</p>
                <p style={{ fontSize: "18px", fontWeight: 600, color: g.color, fontFamily: "monospace" }}>{g.value}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* DeFi TVL */}
      <div style={{ padding: "16px 20px" }}>
        <div style={{ marginBottom: "12px" }}>
          <span style={{ fontSize: "11px", color: "#333", textTransform: "uppercase", letterSpacing: "0.08em" }}>DeFi TVL by Chain</span>
        </div>
        {chains.length === 0 ? (
          <div className="skeleton" style={{ height: "32px" }} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {chains.map((c, i) => (
              <motion.div key={c.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "12px", color: "#505050", width: "80px", flexShrink: 0 }}>{c.name}</span>
                <div style={{ flex: 1, height: "3px", background: "#1a1a1a", borderRadius: "2px", overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(c.tvl / chains[0]!.tvl) * 100}%` }}
                    transition={{ delay: i * 0.04 + 0.3, duration: 0.6 }}
                    style={{ height: "100%", background: "#0ecb81", borderRadius: "2px", opacity: 0.6 }}
                  />
                </div>
                <span style={{ fontSize: "12px", color: "#fff", fontFamily: "monospace", width: "60px", textAlign: "right" }}>{fmtTVL(c.tvl)}</span>
                <span style={{ fontSize: "11px", color: c.change != null && !isNaN(c.change) ? (c.change >= 0 ? "#0ecb81" : "#f6465d") : "#333", width: "48px", textAlign: "right" }}>
  {c.change != null && !isNaN(c.change) ? `${c.change >= 0 ? "▲" : "▼"}${Math.abs(c.change).toFixed(1)}%` : "—"}
</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}