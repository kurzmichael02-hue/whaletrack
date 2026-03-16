"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const HOLDINGS = [
  { symbol: "BTC", amount: 0.12, buyPrice: 62000 },
  { symbol: "ETH", amount: 2.5, buyPrice: 1800 },
  { symbol: "SOL", amount: 45, buyPrice: 60 },
];

function CountUp({ value, prefix = "", suffix = "", decimals = 2, color }: {
  value: number; prefix?: string; suffix?: string; decimals?: number; color?: string;
}) {
  const motionVal = useMotionValue(0);
  const [display, setDisplay] = useState("—");

  useEffect(() => {
    if (value === 0) return;
    const controls = animate(motionVal, value, {
      duration: 1.2,
      ease: [0.23, 1, 0.32, 1],
      onUpdate: (v) => {
        setDisplay(`${prefix}${v.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`);
      },
    });
    return controls.stop;
  }, [value]);

  return (
    <span style={{
      fontSize: "28px", fontWeight: 700, letterSpacing: "-0.03em",
      fontFamily: "monospace", fontVariantNumeric: "tabular-nums",
      color: color ?? "#fff",
      textShadow: color ? `0 0 20px ${color}40` : "none",
    }}>
      {display}
    </span>
  );
}

export default function LiveStats() {
  const [totalValue, setTotalValue] = useState(0);
  const [pnl, setPnl] = useState(0);
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
      let total = 0, totalBuy = 0;
      for (const h of HOLDINGS) {
        total += h.amount * (prices[h.symbol] ?? 0);
        totalBuy += h.amount * h.buyPrice;
      }
      setTotalValue(total);
      setPnl(total - totalBuy);
      setLoaded(true);
    } catch (e) { console.error(e); }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderBottom: "1px solid #1a1a1a" }}>
      {[
        {
          label: "Portfolio Value",
          content: loaded ? <CountUp value={totalValue} prefix="$" /> : <span style={{ fontSize: "28px", color: "#222" }}>—</span>,
          delay: 0,
        },
        {
          label: "Total PnL",
          content: loaded ? <CountUp value={pnl} prefix={pnl >= 0 ? "+$" : "-$"} color={pnl >= 0 ? "#0ecb81" : "#f6465d"} /> : <span style={{ fontSize: "28px", color: "#222" }}>—</span>,
          delay: 0.08,
        },
        {
          label: "Open Positions",
          content: loaded ? <CountUp value={3} decimals={0} /> : <span style={{ fontSize: "28px", color: "#222" }}>—</span>,
          delay: 0.16,
        },
      ].map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: s.delay, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          style={{
            padding: "24px 20px",
            borderRight: i < 2 ? "1px solid #1a1a1a" : "none",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute", top: 0, right: 0,
            width: "80px", height: "80px",
            background: i === 1 && pnl >= 0
              ? "radial-gradient(circle at top right, rgba(14,203,129,0.06) 0%, transparent 70%)"
              : "radial-gradient(circle at top right, rgba(255,255,255,0.02) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <p style={{ fontSize: "11px", color: "#333", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
            {s.label}
          </p>
          {s.content}
        </motion.div>
      ))}
    </div>
  );
}
