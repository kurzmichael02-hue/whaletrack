"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const HOLDINGS = [
  { symbol: "BTC", amount: 0.12, buyPrice: 62000 },
  { symbol: "ETH", amount: 2.5, buyPrice: 1800 },
  { symbol: "SOL", amount: 45, buyPrice: 60 },
];

export default function LiveStats() {
  const [totalValue, setTotalValue] = useState("—");
  const [pnl, setPnl] = useState("—");
  const [pnlPositive, setPnlPositive] = useState(true);
  const [loaded, setLoaded] = useState(false);

  async function load() {
    try {
      const [btc, eth, sol] = await Promise.all([
        fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT").then((r) => r.json()),
        fetch("https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT").then((r) => r.json()),
        fetch("https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT").then((r) => r.json()),
      ]);

      const prices: Record<string, number> = {
        BTC: parseFloat(btc.price),
        ETH: parseFloat(eth.price),
        SOL: parseFloat(sol.price),
      };

      let total = 0;
      let totalBuy = 0;
      for (const h of HOLDINGS) {
        total += h.amount * (prices[h.symbol] ?? 0);
        totalBuy += h.amount * h.buyPrice;
      }

      const pnlValue = total - totalBuy;
      setPnlPositive(pnlValue >= 0);
      setTotalValue(`$${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
      setPnl(`${pnlValue >= 0 ? "+" : ""}$${pnlValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
      setLoaded(true);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: "Portfolio Value", value: totalValue, green: false },
    { label: "Total PnL", value: pnl, green: pnlPositive },
    { label: "Open Positions", value: "3", green: false },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderBottom: "1px solid #1f1f1f" }}>
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0.5 }}
          transition={{ delay: i * 0.06 }}
          style={{ padding: "20px", borderRight: i < 2 ? "1px solid #1f1f1f" : "none" }}
        >
          <p style={{ fontSize: "11px", color: "#404040", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
            {s.label}
          </p>
          <p style={{
            fontSize: "24px", fontWeight: 600, letterSpacing: "-0.02em",
            color: s.green ? "#0ecb81" : "#ffffff",
            fontFamily: "monospace", fontVariantNumeric: "tabular-nums",
          }}>
            {loaded ? s.value : <span className="skeleton" style={{ display: "inline-block", width: "120px", height: "28px", borderRadius: "4px" }} />}
          </p>
        </motion.div>
      ))}
    </div>
  );
}