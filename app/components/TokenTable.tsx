"use client";

import { useEffect, useState } from "react";

type Token = {
  symbol: string;
  price: number;
  change?: number;
  high?: number;
  low?: number;
  volume?: number;
};

const TOKENS = [
  { symbol: "BTC", binance: "BTCUSDT", color: "#F7931A", icon: "₿" },
  { symbol: "ETH", binance: "ETHUSDT", color: "#627EEA", icon: "Ξ" },
  { symbol: "SOL", binance: "SOLUSDT", color: "#9945FF", icon: "◎" },
];

export default function TokenTable() {
  const [tokens, setTokens] = useState<Token[]>([
    { symbol: "BTC", price: 0 },
    { symbol: "ETH", price: 0 },
    { symbol: "SOL", price: 0 },
  ]);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [pulse, setPulse] = useState(false);

  async function fetchPrices() {
    try {
      const results = await Promise.all(
        TOKENS.map((t) =>
          fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${t.binance}`).then((r) => r.json())
        )
      );
      setTokens(
        results.map((r, i) => ({
          symbol: TOKENS[i]!.symbol,
          price: parseFloat(r.lastPrice),
          change: parseFloat(r.priceChangePercent),
          high: parseFloat(r.highPrice),
          low: parseFloat(r.lowPrice),
          volume: parseFloat(r.quoteVolume),
        }))
      );
      setLastUpdate(new Date().toLocaleTimeString());
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    } catch (e) {
      console.error("Binance fetch failed:", e);
    }
  }

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 15000);
    return () => clearInterval(interval);
  }, []);

  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  const fmtVol = (n: number) => {
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    return `$${fmt(n)}`;
  };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-3">
          <h3 className="text-white font-semibold">Market Overview</h3>
          <span className={`w-1.5 h-1.5 rounded-full inline-block transition-colors duration-300 ${pulse ? "bg-green-300" : "bg-green-500"}`} />
        </div>
        <span className="text-gray-600 text-xs">Updated {lastUpdate || "..."}</span>
      </div>
      <table className="w-full">
        <thead>
          <tr className="text-gray-600 text-xs uppercase tracking-widest">
            <th className="text-left px-6 py-3">Asset</th>
            <th className="text-left px-6 py-3">Price</th>
            <th className="text-left px-6 py-3">24h Change</th>
            <th className="text-left px-6 py-3">24h High</th>
            <th className="text-left px-6 py-3">24h Low</th>
            <th className="text-left px-6 py-3">Volume</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token, i) => (
            <tr key={token.symbol} className="border-t transition-colors hover:bg-white/2" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold" style={{ background: `${TOKENS[i]!.color}20`, color: TOKENS[i]!.color }}>
                    {TOKENS[i]!.icon}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{token.symbol}</p>
                    <p className="text-gray-600 text-xs">{token.symbol === "BTC" ? "Bitcoin" : token.symbol === "ETH" ? "Ethereum" : "Solana"}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-white font-semibold text-base">
                {token.price > 0 ? `$${fmt(token.price)}` : "—"}
              </td>
              <td className="px-6 py-4">
                {token.change !== undefined && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ background: token.change >= 0 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: token.change >= 0 ? "#10b981" : "#ef4444" }}>
                    {token.change >= 0 ? "▲" : "▼"} {Math.abs(token.change).toFixed(2)}%
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-gray-400 text-sm">{token.high ? `$${fmt(token.high)}` : "—"}</td>
              <td className="px-6 py-4 text-gray-400 text-sm">{token.low ? `$${fmt(token.low)}` : "—"}</td>
              <td className="px-6 py-4 text-gray-500 text-sm">{token.volume ? fmtVol(token.volume) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}