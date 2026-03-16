"use client";

import { useEffect, useState, useRef } from "react";

type TickerItem = {
  symbol: string;
  price: number;
  change: number;
};

const SYMBOLS = [
  { symbol: "BTC", binance: "BTCUSDT" },
  { symbol: "ETH", binance: "ETHUSDT" },
  { symbol: "SOL", binance: "SOLUSDT" },
  { symbol: "BNB", binance: "BNBUSDT" },
  { symbol: "XRP", binance: "XRPUSDT" },
  { symbol: "DOGE", binance: "DOGEUSDT" },
  { symbol: "ADA", binance: "ADAUSDT" },
  { symbol: "AVAX", binance: "AVAXUSDT" },
  { symbol: "LINK", binance: "LINKUSDT" },
  { symbol: "DOT", binance: "DOTUSDT" },
];

export default function Ticker() {
  const [items, setItems] = useState<TickerItem[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const results = await Promise.all(
          SYMBOLS.map((s) =>
            fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${s.binance}`).then((r) => r.json())
          )
        );
        setItems(results.map((r, i) => ({
          symbol: SYMBOLS[i]!.symbol,
          price: parseFloat(r.lastPrice),
          change: parseFloat(r.priceChangePercent),
        })));
      } catch (e) { console.error(e); }
    }
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  if (items.length === 0) return null;

  const doubled = [...items, ...items];

  return (
    <div style={{
      borderBottom: "1px solid #1f1f1f",
      overflow: "hidden",
      height: "32px",
      display: "flex",
      alignItems: "center",
      background: "#0a0a0a",
    }}>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          display: flex;
          animation: ticker 40s linear infinite;
          width: max-content;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="ticker-track">
        {doubled.map((item, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "0 20px", borderRight: "1px solid #1f1f1f",
            whiteSpace: "nowrap", height: "32px",
          }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#808080" }}>{item.symbol}</span>
            <span style={{ fontSize: "11px", color: "#fff", fontFamily: "monospace", fontVariantNumeric: "tabular-nums" }}>
              ${item.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
            <span style={{ fontSize: "10px", fontWeight: 500, color: item.change >= 0 ? "#0ecb81" : "#f6465d" }}>
              {item.change >= 0 ? "▲" : "▼"} {Math.abs(item.change).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}