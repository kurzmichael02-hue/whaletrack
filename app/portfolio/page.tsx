"use client";

import { useEffect, useState } from "react";

type Token = {
  symbol: string;
  amount: number;
  price: number;
  value: number;
  pnl: number;
  pnlPercent: number;
};

type Transaction = {
  hash: string;
  type: "buy" | "sell";
  symbol: string;
  amount: number;
  price: number;
  date: string;
};

const MOCK_HOLDINGS: Token[] = [
  { symbol: "BTC", amount: 0.12, price: 0, value: 0, pnl: 0, pnlPercent: 0 },
  { symbol: "ETH", amount: 2.5, price: 0, value: 0, pnl: 0, pnlPercent: 0 },
  { symbol: "SOL", amount: 45, price: 0, value: 0, pnl: 0, pnlPercent: 0 },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  { hash: "0xabc123", type: "buy", symbol: "BTC", amount: 0.12, price: 62000, date: "2024-12-01" },
  { hash: "0xdef456", type: "buy", symbol: "ETH", amount: 2.5, price: 1800, date: "2024-11-15" },
  { hash: "0xghi789", type: "buy", symbol: "SOL", amount: 45, price: 60, date: "2024-10-20" },
];

const BUY_PRICES: Record<string, number> = { BTC: 62000, ETH: 1800, SOL: 60 };

const TOKEN_COLORS: Record<string, string> = {
  BTC: "#F7931A",
  ETH: "#627EEA",
  SOL: "#9945FF",
};

const TOKEN_ICONS: Record<string, string> = {
  BTC: "₿",
  ETH: "Ξ",
  SOL: "◎",
};

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<Token[]>(MOCK_HOLDINGS);
  const [totalValue, setTotalValue] = useState(0);
  const [totalPnl, setTotalPnl] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadPrices() {
  try {
    const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];
    const results = await Promise.all(
      symbols.map((s) =>
        fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${s}`)
          .then((r) => r.json())
      )
    );
    const priceMap: Record<string, number> = {
      BTC: parseFloat(results[0].price),
      ETH: parseFloat(results[1].price),
      SOL: parseFloat(results[2].price),
    };

    const updated = MOCK_HOLDINGS.map((h) => {
      const currentPrice = priceMap[h.symbol] ?? 0;
      const value = h.amount * currentPrice;
      const buyValue = h.amount * (BUY_PRICES[h.symbol] ?? 0);
      const pnl = value - buyValue;
      const pnlPercent = buyValue > 0 ? (pnl / buyValue) * 100 : 0;
      return { ...h, price: currentPrice, value, pnl, pnlPercent };
    });

    setHoldings(updated);
    setTotalValue(updated.reduce((s, h) => s + h.value, 0));
    setTotalPnl(updated.reduce((s, h) => s + h.pnl, 0));
  } catch (e) {
    console.error(e);
  }
  setLoaded(true);
}


    loadPrices();
  }, []);

  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
    <div className="p-8 space-y-8 min-h-screen" style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1529 50%, #0a0f1e 100%)" }}>
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Portfolio</h2>
          <p className="text-gray-500 text-sm mt-1">Your crypto holdings overview</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", color: "#10b981" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
          Live Prices
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Value", value: `$${fmt(totalValue)}`, color: "#fff" },
          { label: "Total PnL", value: `${totalPnl >= 0 ? "+" : ""}$${fmt(totalPnl)}`, color: totalPnl >= 0 ? "#10b981" : "#ef4444" },
          { label: "Assets", value: `${holdings.length}`, color: "#fff" },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(10px)" }}>
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">{card.label}</p>
            <p className="text-2xl font-bold" style={{ color: card.color }}>{loaded ? card.value : "—"}</p>
          </div>
        ))}
      </div>

      {/* Holdings */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="text-white font-semibold">Token Holdings</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-gray-500 text-xs uppercase tracking-widest">
              <th className="text-left px-6 py-3">Asset</th>
              <th className="text-left px-6 py-3">Amount</th>
              <th className="text-left px-6 py-3">Price</th>
              <th className="text-left px-6 py-3">Value</th>
              <th className="text-left px-6 py-3">PnL</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h, i) => (
              <tr key={h.symbol} className="border-t border-white/5 hover:bg-white/2 transition-colors" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold" style={{ background: `${TOKEN_COLORS[h.symbol]}20`, color: TOKEN_COLORS[h.symbol] }}>
                      {TOKEN_ICONS[h.symbol]}
                    </div>
                    <span className="text-white font-semibold">{h.symbol}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400">{h.amount}</td>
                <td className="px-6 py-4 text-gray-300">{loaded ? `$${fmt(h.price)}` : "—"}</td>
                <td className="px-6 py-4 text-white font-medium">{loaded ? `$${fmt(h.value)}` : "—"}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${h.pnl >= 0 ? "text-green-400" : "text-red-400"}`} style={{ background: h.pnl >= 0 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)" }}>
                    {loaded ? `${h.pnl >= 0 ? "+" : ""}$${fmt(h.pnl)} (${h.pnlPercent.toFixed(1)}%)` : "—"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transaction History */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="text-white font-semibold">Transaction History</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-gray-500 text-xs uppercase tracking-widest">
              <th className="text-left px-6 py-3">Hash</th>
              <th className="text-left px-6 py-3">Type</th>
              <th className="text-left px-6 py-3">Asset</th>
              <th className="text-left px-6 py-3">Amount</th>
              <th className="text-left px-6 py-3">Price</th>
              <th className="text-left px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_TRANSACTIONS.map((tx) => (
              <tr key={tx.hash} className="border-t transition-colors" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                <td className="px-6 py-4 font-mono text-xs text-blue-400">{tx.hash.slice(0, 14)}...</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${tx.type === "buy" ? "text-green-400" : "text-red-400"}`} style={{ background: tx.type === "buy" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)" }}>
                    {tx.type.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span style={{ color: TOKEN_COLORS[tx.symbol] }}>{TOKEN_ICONS[tx.symbol]}</span>
                    <span className="text-white">{tx.symbol}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400">{tx.amount}</td>
                <td className="px-6 py-4 text-gray-300">${tx.price.toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
