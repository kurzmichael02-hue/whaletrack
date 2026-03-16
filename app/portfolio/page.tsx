"use client";

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import WalletDashboard from "../components/WalletDashboard";

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

const MOCK_HOLDINGS = [
  { symbol: "BTC", amount: 0.12 },
  { symbol: "ETH", amount: 2.5 },
  { symbol: "SOL", amount: 45 },
];

const BUY_PRICES: Record<string, number> = { BTC: 62000, ETH: 1800, SOL: 60 };

const MOCK_TRANSACTIONS: Transaction[] = [
  { hash: "0xabc123", type: "buy", symbol: "BTC", amount: 0.12, price: 62000, date: "2024-12-01" },
  { hash: "0xdef456", type: "buy", symbol: "ETH", amount: 2.5, price: 1800, date: "2024-11-15" },
  { hash: "0xghi789", type: "buy", symbol: "SOL", amount: 45, price: 60, date: "2024-10-20" },
];

export default function PortfolioPage() {
  const { isConnected } = useAccount();

  if (isConnected) return <WalletDashboard />;

  return <MockPortfolio />;
}

function MockPortfolio() {
  const [holdings, setHoldings] = useState<Token[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalPnl, setTotalPnl] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const results = await Promise.all(
          ["BTCUSDT", "ETHUSDT", "SOLUSDT"].map((s) =>
            fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${s}`).then((r) => r.json())
          )
        );
        const prices: Record<string, number> = {
          BTC: parseFloat(results[0].price),
          ETH: parseFloat(results[1].price),
          SOL: parseFloat(results[2].price),
        };
        const updated = MOCK_HOLDINGS.map((h) => {
          const price = prices[h.symbol] ?? 0;
          const value = h.amount * price;
          const buyValue = h.amount * (BUY_PRICES[h.symbol] ?? 0);
          const pnl = value - buyValue;
          return { ...h, price, value, pnl, pnlPercent: buyValue > 0 ? (pnl / buyValue) * 100 : 0 };
        });
        setHoldings(updated);
        setTotalValue(updated.reduce((s, h) => s + h.value, 0));
        setTotalPnl(updated.reduce((s, h) => s + h.pnl, 0));
      } catch (e) { console.error(e); }
      setLoaded(true);
    }
    load();
  }, []);

  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
    <div style={{ minHeight: "100vh" }}>
      <div style={{ padding: "10px 20px", borderBottom: "1px solid #1f1f1f", background: "rgba(246,70,93,0.04)" }}>
        <p style={{ fontSize: "11px", color: "#808080" }}>Connect your wallet to see real data. Showing demo portfolio.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderBottom: "1px solid #1f1f1f" }}>
        {[
          { label: "Total Value", value: loaded ? `$${fmt(totalValue)}` : "—", green: false },
          { label: "Total PnL", value: loaded ? `${totalPnl >= 0 ? "+" : ""}$${fmt(totalPnl)}` : "—", green: totalPnl >= 0 },
          { label: "Assets", value: `${holdings.length}`, green: false },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
            style={{ padding: "20px", borderRight: i < 2 ? "1px solid #1f1f1f" : "none" }}>
            <p style={{ fontSize: "11px", color: "#404040", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>{s.label}</p>
            <p style={{ fontSize: "24px", fontWeight: 600, color: s.green ? "#0ecb81" : "#fff", fontFamily: "monospace", fontVariantNumeric: "tabular-nums" }}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ borderBottom: "1px solid #1f1f1f" }}>
        <div style={{ padding: "10px 20px", borderBottom: "1px solid #1f1f1f" }}>
          <span style={{ fontSize: "11px", color: "#404040", textTransform: "uppercase", letterSpacing: "0.06em" }}>Holdings</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1f1f1f" }}>
              {["Asset", "Amount", "Price", "Value", "PnL"].map((h) => (
                <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: "11px", color: "#404040", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!loaded ? Array.from({ length: 3 }).map((_, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #1f1f1f" }}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <td key={j} style={{ padding: "14px 20px" }}>
                    <div className="skeleton" style={{ height: "14px", width: j === 0 ? "60px" : "80px" }} />
                  </td>
                ))}
              </tr>
            )) : holdings.map((h, i) => (
              <motion.tr key={h.symbol} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                style={{ borderBottom: "1px solid #1f1f1f" }}>
                <td style={{ padding: "14px 20px", fontSize: "13px", fontWeight: 600, color: "#fff" }}>{h.symbol}</td>
                <td style={{ padding: "14px 20px", fontSize: "13px", color: "#808080", fontFamily: "monospace" }}>{h.amount}</td>
                <td style={{ padding: "14px 20px", fontSize: "13px", color: "#fff", fontFamily: "monospace" }}>${fmt(h.price)}</td>
                <td style={{ padding: "14px 20px", fontSize: "13px", color: "#fff", fontFamily: "monospace" }}>${fmt(h.value)}</td>
                <td style={{ padding: "14px 20px", fontSize: "13px", fontWeight: 500, fontFamily: "monospace", color: h.pnl >= 0 ? "#0ecb81" : "#f6465d" }}>
                  {h.pnl >= 0 ? "+" : ""}${fmt(h.pnl)} ({h.pnlPercent.toFixed(1)}%)
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <div style={{ padding: "10px 20px", borderBottom: "1px solid #1f1f1f" }}>
          <span style={{ fontSize: "11px", color: "#404040", textTransform: "uppercase", letterSpacing: "0.06em" }}>Transaction History</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1f1f1f" }}>
              {["Hash", "Type", "Asset", "Amount", "Price", "Date"].map((h) => (
                <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: "11px", color: "#404040", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_TRANSACTIONS.map((tx, i) => (
              <motion.tr key={tx.hash} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                style={{ borderBottom: "1px solid #1f1f1f" }}>
                <td style={{ padding: "14px 20px", fontFamily: "monospace", fontSize: "12px", color: "#3b82f6" }}>{tx.hash.slice(0, 14)}...</td>
                <td style={{ padding: "14px 20px" }}>
                  <span className={tx.type === "buy" ? "tag-green" : "tag-red"}>{tx.type.toUpperCase()}</span>
                </td>
                <td style={{ padding: "14px 20px", fontSize: "13px", fontWeight: 600, color: "#fff" }}>{tx.symbol}</td>
                <td style={{ padding: "14px 20px", fontSize: "13px", color: "#808080", fontFamily: "monospace" }}>{tx.amount}</td>
                <td style={{ padding: "14px 20px", fontSize: "13px", color: "#fff", fontFamily: "monospace" }}>${tx.price.toLocaleString()}</td>
                <td style={{ padding: "14px 20px", fontSize: "12px", color: "#404040" }}>{tx.date}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
