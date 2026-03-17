"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type StakingToken = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  apy: number;
  image: string;
};

export default function StakingTracker() {
  const [tokens, setTokens] = useState<StakingToken[]>([]);
  const [amount, setAmount] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/staking").then((r) => r.json()).then(setTokens);
  }, []);

  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  function calcRewards(token: StakingToken) {
    const amt = parseFloat(amount[token.id] ?? "0");
    if (!amt) return null;
    const yearly = amt * token.price * (token.apy / 100);
    return { daily: yearly / 365, monthly: yearly / 12, yearly };
  }

  return (
    <div style={{ borderBottom: "1px solid #1a1a1a" }}>
      <div style={{ padding: "10px 20px", borderBottom: "1px solid #1a1a1a" }}>
        <span style={{ fontSize: "11px", color: "#333", textTransform: "uppercase", letterSpacing: "0.08em" }}>Staking Rewards Calculator</span>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
            {["Token", "Price", "APY", "Your Amount", "Daily", "Monthly", "Yearly"].map((h) => (
              <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: "11px", color: "#333", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 400 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tokens.length === 0 ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #1a1a1a" }}>
                {Array.from({ length: 7 }).map((_, j) => (
                  <td key={j} style={{ padding: "14px 20px" }}>
                    <div className="skeleton" style={{ height: "14px", width: "80px" }} />
                  </td>
                ))}
              </tr>
            ))
          ) : tokens.map((t, i) => {
            const rewards = calcRewards(t);
            return (
              <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                style={{ borderBottom: "1px solid #1a1a1a" }}>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <img src={t.image} alt={t.symbol} style={{ width: "24px", height: "24px", borderRadius: "50%" }} />
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>{t.symbol}</span>
                  </div>
                </td>
                <td style={{ padding: "14px 20px", fontSize: "13px", color: "#fff", fontFamily: "monospace" }}>${fmt(t.price)}</td>
                <td style={{ padding: "14px 20px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#0ecb81" }}>{t.apy}%</span>
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <input
                    type="number"
                    value={amount[t.id] ?? ""}
                    onChange={(e) => setAmount((prev) => ({ ...prev, [t.id]: e.target.value }))}
                    placeholder="0"
                    style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", color: "#fff", padding: "5px 8px", borderRadius: "4px", fontSize: "12px", outline: "none", width: "80px", fontFamily: "monospace" }}
                  />
                </td>
                <td style={{ padding: "14px 20px", fontSize: "12px", color: rewards ? "#0ecb81" : "#333", fontFamily: "monospace" }}>
                  {rewards ? `$${fmt(rewards.daily)}` : "—"}
                </td>
                <td style={{ padding: "14px 20px", fontSize: "12px", color: rewards ? "#0ecb81" : "#333", fontFamily: "monospace" }}>
                  {rewards ? `$${fmt(rewards.monthly)}` : "—"}
                </td>
                <td style={{ padding: "14px 20px", fontSize: "13px", fontWeight: 600, color: rewards ? "#0ecb81" : "#333", fontFamily: "monospace" }}>
                  {rewards ? `$${fmt(rewards.yearly)}` : "—"}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}