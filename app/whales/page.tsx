"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Transaction = {
  hash: string;
  token: string;
  value: string;
  timestamp: string;
};

type Whale = {
  name: string;
  address: string;
  transactions: Transaction[];
};

export default function WhalesPage() {
  const [whales, setWhales] = useState<Whale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/whales")
      .then((r) => r.json())
      .then((data) => { setWhales(data); setLoading(false); });
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      {loading ? (
        <div style={{ padding: "40px 20px" }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ marginBottom: "32px" }}>
              <div className="skeleton" style={{ height: "16px", width: "200px", marginBottom: "16px" }} />
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="skeleton" style={{ height: "44px", marginBottom: "2px" }} />
              ))}
            </div>
          ))}
        </div>
      ) : whales.map((whale, wi) => (
        <motion.div key={whale.address} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: wi * 0.1 }}
          style={{ borderBottom: "1px solid #1f1f1f" }}>
          <div style={{ padding: "12px 20px", borderBottom: "1px solid #1f1f1f", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>{whale.name}</span>
              <span style={{ fontSize: "11px", color: "#404040", marginLeft: "12px", fontFamily: "monospace" }}>
                {whale.address.slice(0, 10)}...{whale.address.slice(-6)}
              </span>
            </div>
            <span className="tag-neutral">{whale.transactions.length} txns</span>
          </div>

          {whale.transactions.length === 0 ? (
            <div style={{ padding: "20px", fontSize: "12px", color: "#404040" }}>No significant transactions found</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1f1f1f" }}>
                  {["Hash", "Token", "Amount", "Date"].map((h) => (
                    <th key={h} style={{ padding: "8px 20px", textAlign: "left", fontSize: "11px", color: "#404040", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {whale.transactions.map((tx, i) => (
                  <motion.tr key={tx.hash} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    style={{ borderBottom: "1px solid #1f1f1f" }}>
                    <td style={{ padding: "12px 20px", fontFamily: "monospace", fontSize: "12px", color: "#3b82f6" }}>{tx.hash.slice(0, 16)}...</td>
                    <td style={{ padding: "12px 20px" }}>
                      <span className="tag-neutral">{tx.token}</span>
                    </td>
                    <td style={{ padding: "12px 20px", fontSize: "13px", color: "#0ecb81", fontFamily: "monospace" }}>{tx.value} {tx.token}</td>
                    <td style={{ padding: "12px 20px", fontSize: "12px", color: "#404040" }}>{new Date(tx.timestamp).toLocaleDateString("de-DE")}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      ))}
    </div>
  );
}