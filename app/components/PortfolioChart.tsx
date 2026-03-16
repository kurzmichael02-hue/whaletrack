"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Holding = {
  symbol: string;
  amount: number;
  buyPrice: number;
  buyDate: string;
};

type DataPoint = {
  date: string;
  value: number;
};

const COINGECKO_IDS: Record<string, string> = {
  BTC: "bitcoin", ETH: "ethereum", SOL: "solana", BNB: "binancecoin",
  XRP: "ripple", DOGE: "dogecoin", ADA: "cardano", AVAX: "avalanche-2",
  LINK: "chainlink", DOT: "polkadot", MATIC: "matic-network", UNI: "uniswap",
  LTC: "litecoin", ATOM: "cosmos", NEAR: "near",
};

export default function PortfolioChart({ holdings }: { holdings: Holding[] }) {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState("30");

  useEffect(() => {
    if (holdings.length === 0) return;
    setLoading(true);

    async function load() {
      try {
        const results = await Promise.all(
          holdings.map((h) => {
            const id = COINGECKO_IDS[h.symbol] ?? h.symbol.toLowerCase();
            return fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${range}`)
              .then((r) => r.json())
              .then((d) => ({ symbol: h.symbol, amount: h.amount, prices: d.prices ?? [] }));
          })
        );

        if (results[0]?.prices.length === 0) { setLoading(false); return; }

        const points = results[0]!.prices.map(([timestamp]: [number, number], i: number) => {
          const totalValue = results.reduce((sum, r) => {
            const price = r.prices[i]?.[1] ?? 0;
            return sum + (r.amount * price);
          }, 0);
          return {
            date: new Date(timestamp).toLocaleDateString("en", { month: "short", day: "numeric" }),
            value: totalValue,
          };
        });

        setData(points);
      } catch (e) { console.error(e); }
      setLoading(false);
    }

    load();
  }, [holdings, range]);

  if (holdings.length === 0) return null;

  const min = Math.min(...data.map((d) => d.value));
  const max = Math.max(...data.map((d) => d.value));
  const range_val = max - min || 1;
  const w = 800;
  const h = 120;
  const positive = data.length > 1 && data[data.length - 1]!.value >= data[0]!.value;
  const color = positive ? "#0ecb81" : "#f6465d";
  const pnlPercent = data.length > 1
    ? ((data[data.length - 1]!.value - data[0]!.value) / data[0]!.value) * 100
    : 0;

  const pathPoints = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d.value - min) / range_val) * h;
    return `${x},${y}`;
  }).join(" ");

  const fillPoints = `0,${h} ${pathPoints} ${w},${h}`;

  return (
    <div style={{ borderBottom: "1px solid #1a1a1a" }}>
      <div style={{ padding: "12px 20px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "11px", color: "#333", textTransform: "uppercase", letterSpacing: "0.08em" }}>Portfolio Performance</span>
          {data.length > 1 && (
            <span style={{ fontSize: "12px", fontWeight: 600, color }}>
              {pnlPercent >= 0 ? "+" : ""}{pnlPercent.toFixed(2)}%
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          {["7", "30", "90", "365"].map((r) => (
            <button key={r} onClick={() => setRange(r)} style={{
              padding: "3px 8px", borderRadius: "3px", border: "1px solid",
              fontSize: "11px", cursor: "pointer", fontWeight: 500,
              background: range === r ? "rgba(14,203,129,0.08)" : "transparent",
              borderColor: range === r ? "rgba(14,203,129,0.25)" : "#1a1a1a",
              color: range === r ? "#0ecb81" : "#333",
            }}>
              {r}D
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 20px 8px" }}>
        {loading ? (
          <div className="skeleton" style={{ height: "120px", borderRadius: "4px" }} />
        ) : data.length > 1 ? (
          <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="portfolio-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.15" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon points={fillPoints} fill="url(#portfolio-grad)" />
            <polyline points={pathPoints} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <div style={{ height: "120px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "12px", color: "#333" }}>Loading chart data...</span>
          </div>
        )}
      </div>

      {data.length > 1 && (
        <div style={{ padding: "0 20px 12px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "10px", color: "#222" }}>{data[0]?.date}</span>
          <span style={{ fontSize: "10px", color: "#222" }}>{data[data.length - 1]?.date}</span>
        </div>
      )}
    </div>
  );
}