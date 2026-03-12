"use client";

import { useEffect, useState } from "react";

type Transaction = {
  hash: string;
  type: "ETH" | "TOKEN";
  token: string;
  value: string;
  timestamp: string;
};

type Whale = {
  name: string;
  address: string;
  transactions: Transaction[];
};

const WHALE_COLORS = ["#F7931A", "#627EEA", "#9945FF"];

const TOKEN_COLORS: Record<string, string> = {
  ETH: "#627EEA",
  USDT: "#26A17B",
  USDC: "#2775CA",
  WETH: "#627EEA",
  WBTC: "#F7931A",
  DAI: "#F5AC37",
};

export default function WhalesPage() {
  const [whales, setWhales] = useState<Whale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/whales")
      .then((res) => res.json())
      .then((data) => {
        setWhales(data);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center gap-3 text-gray-500">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
        Loading whale data...
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-6 min-h-screen" style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1529 50%, #0a0f1e 100%)" }}>
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Whale Tracker</h2>
        <p className="text-gray-500 text-sm mt-1">Monitoring top Ethereum wallets in real-time</p>
      </div>

      <div className="grid gap-6">
        {whales.map((whale, i) => (
          <div key={whale.address} className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg" style={{ background: `${WHALE_COLORS[i]}20`, color: WHALE_COLORS[i] }}>
                  🐋
                </div>
                <div>
                  <h3 className="text-white font-semibold">{whale.name}</h3>
                  <p className="text-gray-600 text-xs font-mono">{whale.address.slice(0, 18)}...{whale.address.slice(-6)}</p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }}>
                {whale.transactions.length} txns
              </span>
            </div>

            <table className="w-full">
              <thead>
                <tr className="text-gray-600 text-xs uppercase tracking-widest">
                  <th className="text-left px-6 py-3">Hash</th>
                  <th className="text-left px-6 py-3">Token</th>
                  <th className="text-left px-6 py-3">Amount</th>
                  <th className="text-left px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {whale.transactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-6 text-gray-600 text-sm text-center">No significant transactions found</td>
                  </tr>
                ) : (
                  whale.transactions.map((tx) => (
                    <tr key={tx.hash} className="border-t transition-colors hover:bg-white/2" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                      <td className="px-6 py-3 font-mono text-xs text-blue-400">{tx.hash.slice(0, 16)}...</td>
                      <td className="px-6 py-3">
                        <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: `${TOKEN_COLORS[tx.token] ?? "#6b7280"}20`, color: TOKEN_COLORS[tx.token] ?? "#6b7280" }}>
                          {tx.token}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-green-400 font-medium">{tx.value} {tx.token}</td>
                      <td className="px-6 py-3 text-gray-500 text-xs">{new Date(tx.timestamp).toLocaleDateString("de-DE")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
