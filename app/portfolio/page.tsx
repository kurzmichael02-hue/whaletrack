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

const BUY_PRICES: Record<string, number> = {
  BTC: 62000,
  ETH: 1800,
  SOL: 60,
};

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<Token[]>(MOCK_HOLDINGS);
  const [totalValue, setTotalValue] = useState(0);
  const [totalPnl, setTotalPnl] = useState(0);

  useEffect(() => {
    async function loadPrices() {
      const res = await fetch("https://whaletrack-backend.onrender.com/prices");
      const prices = await res.json() as { symbol: string; price: number }[];

      const priceMap: Record<string, number> = {};
      prices.forEach((p) => { priceMap[p.symbol] = p.price; });

      const updated = MOCK_HOLDINGS.map((h) => {
        const currentPrice = priceMap[h.symbol] ?? 0;
        const value = h.amount * currentPrice;
        const buyValue = h.amount * (BUY_PRICES[h.symbol] ?? 0);
        const pnl = value - buyValue;
        const pnlPercent = buyValue > 0 ? (pnl / buyValue) * 100 : 0;
        return { ...h, price: currentPrice, value, pnl, pnlPercent };
      });

      const total = updated.reduce((sum, h) => sum + h.value, 0);
      const totalPnlVal = updated.reduce((sum, h) => sum + h.pnl, 0);
      setHoldings(updated);
      setTotalValue(total);
      setTotalPnl(totalPnlVal);
    }

    loadPrices();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white">Portfolio</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Value</p>
          <p className="text-white text-2xl font-bold">${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total PnL</p>
          <p className={`text-2xl font-bold ${totalPnl >= 0 ? "text-green-400" : "text-red-400"}`}>
            {totalPnl >= 0 ? "+" : ""}${totalPnl.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Assets</p>
          <p className="text-white text-2xl font-bold">{holdings.length}</p>
        </div>
      </div>

      {/* Holdings */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-4">Token Holdings</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-800">
              <th className="text-left py-2">Token</th>
              <th className="text-left py-2">Amount</th>
              <th className="text-left py-2">Price</th>
              <th className="text-left py-2">Value</th>
              <th className="text-left py-2">PnL</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h) => (
              <tr key={h.symbol} className="border-b border-gray-800">
                <td className="py-3 text-white font-semibold">{h.symbol}</td>
                <td className="text-gray-300">{h.amount}</td>
                <td className="text-gray-300">${h.price.toLocaleString()}</td>
                <td className="text-white">${h.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                <td className={h.pnl >= 0 ? "text-green-400" : "text-red-400"}>
                  {h.pnl >= 0 ? "+" : ""}${h.pnl.toLocaleString(undefined, { maximumFractionDigits: 2 })} ({h.pnlPercent.toFixed(1)}%)
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transaction History */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-4">Transaction History</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-800">
              <th className="text-left py-2">Hash</th>
              <th className="text-left py-2">Type</th>
              <th className="text-left py-2">Token</th>
              <th className="text-left py-2">Amount</th>
              <th className="text-left py-2">Price</th>
              <th className="text-left py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_TRANSACTIONS.map((tx) => (
              <tr key={tx.hash} className="border-b border-gray-800">
                <td className="py-3 text-blue-400 font-mono text-xs">{tx.hash.slice(0, 10)}...</td>
                <td className={tx.type === "buy" ? "text-green-400" : "text-red-400"}>{tx.type.toUpperCase()}</td>
                <td className="text-white">{tx.symbol}</td>
                <td className="text-gray-300">{tx.amount}</td>
                <td className="text-gray-300">${tx.price.toLocaleString()}</td>
                <td className="text-gray-400">{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
