"use client";

import { useAccount, useBalance } from "wagmi";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatEther } from "viem";

type TokenBalance = {
  symbol: string;
  name: string;
  balance: string;
  value: number;
};

type Transaction = {
  hash: string;
  token: string;
  value: string;
  timestamp: string;
  type: "in" | "out";
};

export default function WalletDashboard() {
  const { address, isConnected } = useAccount();
  const { data: ethBalance } = useBalance({ address });
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [ethPrice, setEthPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT")
      .then((r) => r.json())
      .then((d) => setEthPrice(parseFloat(d.price)));
  }, []);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    fetch(`/api/wallet?address=${address}`)
      .then((r) => r.json())
      .then((d) => { setTokens(d.tokens ?? []); setTxs(d.transactions ?? []); })
      .finally(() => setLoading(false));
  }, [address]);

  if (!isConnected) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center", borderBottom: "1px solid #1f1f1f" }}>
        <p style={{ fontSize: "13px", color: "#404040", marginBottom: "8px" }}>Connect your wallet to see your real portfolio</p>
        <p style={{ fontSize: "11px", color: "#2a2a2a" }}>Supports MetaMask, Coinbase, WalletConnect and more</p>
      </div>
    );
  }

  const ethAmt = ethBalance ? parseFloat(formatEther(ethBalance.value)) : 0;
  const ethValue = ethAmt * ethPrice;
  const totalValue = ethValue + tokens.reduce((s, t) => s + t.value, 0);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderBottom: "1px solid #1f1f1f" }}>
        {[
          { label: "Total Value", value: `$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}` },
          { label: "ETH Balance", value: `${ethAmt.toFixed(4)} ETH` },
          { label: "Tokens", value: `${tokens.length}` },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
            style={{ padding: "20px", borderRight: i < 2 ? "1px solid #1f1f1f" : "none" }}>
            <p style={{ fontSize: "11px", color: "#404040", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>{s.label}</p>
            <p style={{ fontSize: "22px", fontWeight: 600, color: "#fff", fontFamily: "monospace", fontVariantNumeric: "tabular-nums" }}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ padding: "10px 20px", borderBottom: "1px solid #1f1f1f", display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0ecb81", display: "inline-block" }} />
        <span style={{ fontSize: "12px", color: "#404040", fontFamily: "monospace" }}>{address}</span>
      </div>

      <div style={{ borderBottom: "1px solid #1f1f1f" }}>
        <div style={{ padding: "10px 20px", borderBottom: "1px solid #1f1f1f" }}>
          <span style={{ fontSize: "11px", color: "#404040", textTransform: "uppercase", letterSpacing: "0.06em" }}>Token Balances</span>
        </div>
        {loading ? (
          <div style={{ padding: "20px" }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "44px", marginBottom: "2px" }} />
            ))}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1f1f1f" }}>
                {["Token", "Balance", "Value"].map((h) => (
                  <th key={h} style={{ padding: "8px 20px", textAlign: "left", fontSize: "11px", color: "#404040", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #1f1f1f" }}>
                <td style={{ padding: "12px 20px", fontSize: "13px", fontWeight: 600, color: "#fff" }}>ETH</td>
                <td style={{ padding: "12px 20px", fontSize: "13px", color: "#808080", fontFamily: "monospace" }}>{ethAmt.toFixed(4)}</td>
                <td style={{ padding: "12px 20px", fontSize: "13px", color: "#fff", fontFamily: "monospace" }}>${ethValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
              </tr>
              {tokens.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ padding: "20px", fontSize: "12px", color: "#404040", textAlign: "center" }}>No ERC-20 tokens found</td>
                </tr>
              ) : tokens.map((t, i) => (
                <motion.tr key={t.symbol} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  style={{ borderBottom: "1px solid #1f1f1f" }}>
                  <td style={{ padding: "12px 20px" }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>{t.symbol}</p>
                    <p style={{ fontSize: "11px", color: "#404040" }}>{t.name}</p>
                  </td>
                  <td style={{ padding: "12px 20px", fontSize: "13px", color: "#808080", fontFamily: "monospace" }}>{t.balance}</td>
                  <td style={{ padding: "12px 20px", fontSize: "13px", color: "#fff", fontFamily: "monospace" }}>
                    {t.value > 0 ? `$${t.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : "—"}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {txs.length > 0 && (
        <div>
          <div style={{ padding: "10px 20px", borderBottom: "1px solid #1f1f1f" }}>
            <span style={{ fontSize: "11px", color: "#404040", textTransform: "uppercase", letterSpacing: "0.06em" }}>Recent Transactions</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1f1f1f" }}>
                {["Hash", "Token", "Amount", "Date"].map((h) => (
                  <th key={h} style={{ padding: "8px 20px", textAlign: "left", fontSize: "11px", color: "#404040", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {txs.map((tx, i) => (
                <motion.tr key={tx.hash} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  style={{ borderBottom: "1px solid #1f1f1f" }}>
                  <td style={{ padding: "12px 20px", fontFamily: "monospace", fontSize: "12px" }}>
                    <a href={`https://etherscan.io/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6", textDecoration: "none" }}>
                      {tx.hash.slice(0, 16)}...
                    </a>
                  </td>
                  <td style={{ padding: "12px 20px" }}>
                    <span className="tag-neutral">{tx.token}</span>
                  </td>
                  <td style={{ padding: "12px 20px", fontSize: "13px", fontFamily: "monospace", color: tx.type === "in" ? "#0ecb81" : "#f6465d" }}>
                    {tx.type === "in" ? "+" : "-"}{tx.value}
                  </td>
                  <td style={{ padding: "12px 20px", fontSize: "12px", color: "#404040" }}>
                    {new Date(tx.timestamp).toLocaleDateString("de-DE")}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}