"use client";

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Trade = {
  hash: string;
  type: "buy" | "sell";
  token: string;
  amount: string;
  date: string;
};

export default function TradesPage() {
  const { address, isConnected } = useAccount();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    fetch(`/api/wallet?address=${address}`)
      .then((r) => r.json())
      .then((d) => {
        const txs = d.transactions ?? [];
        const mapped: Trade[] = txs.map((tx: any) => ({
          hash: tx.hash,
          type: tx.type === "in" ? "buy" : "sell",
          token: tx.token,
          amount: tx.value,
          date: tx.timestamp,
        }));
        setTrades(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [address]);

  if (!isConnected) {
    return (
      <div style={{ minHeight: "100vh" }}>
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <p style={{ fontSize: "18px", fontWeight: 600, color: "#fff", marginBottom: "8px" }}>Connect your wallet</p>
          <p style={{ fontSize: "13px", color: "#333" }}>Connect your wallet to see your real transaction history</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <div style={{ padding: "10px 20px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "11px", color: "#333", textTransform: "uppercase", letterSpacing: "0.08em" }}>Transaction History</span>
        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#0ecb81", display: "inline-block", boxShadow: "0 0 6px #0ecb81" }} />
      </div>

      {loading ? (
        <div style={{ padding: "20px" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: "44px", marginBottom: "2px" }} />
          ))}
        </div>
      ) : trades.length === 0 ? (
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <p style={{ fontSize: "13px", color: "#333", marginBottom: "8px" }}>No transactions found</p>
          <p style={{ fontSize: "11px", color: "#222" }}>Only USDT, USDC, WETH and WBTC transfers above $1,000 are shown</p>
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
              {["Type", "Token", "Amount", "Date", "Tx Hash"].map((h) => (
                <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: "11px", color: "#333", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, i) => (
              <motion.tr key={trade.hash} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }} style={{ borderBottom: "1px solid #1a1a1a" }}>
                <td style={{ padding: "12px 20px" }}>
                  <span style={{
                    fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "3px",
                    background: trade.type === "buy" ? "rgba(14,203,129,0.1)" : "rgba(246,70,93,0.1)",
                    color: trade.type === "buy" ? "#0ecb81" : "#f6465d",
                    border: `1px solid ${trade.type === "buy" ? "rgba(14,203,129,0.3)" : "rgba(246,70,93,0.3)"}`,
                  }}>
                    {trade.type === "buy" ? "▲ IN" : "▼ OUT"}
                  </span>
                </td>
                <td style={{ padding: "12px 20px" }}>
                  <span className="tag-neutral">{trade.token}</span>
                </td>
                <td style={{ padding: "12px 20px", fontSize: "13px", color: trade.type === "buy" ? "#0ecb81" : "#f6465d", fontFamily: "monospace" }}>
                  {trade.type === "buy" ? "+" : "-"}{trade.amount}
                </td>
                <td style={{ padding: "12px 20px", fontSize: "12px", color: "#505050" }}>
                  {new Date(trade.date).toLocaleDateString("de-DE")}
                </td>
                <td style={{ padding: "12px 20px" }}>
                  <a href={`https://etherscan.io/tx/${trade.hash}`} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: "12px", color: "#3b82f6", fontFamily: "monospace", textDecoration: "none" }}>
                    {trade.hash.slice(0, 14)}...
                  </a>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}