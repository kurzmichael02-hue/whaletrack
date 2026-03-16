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
  category: string;
  transactions: Transaction[];
};

const CATEGORY_COLORS: Record<string, string> = {
  "Exchange": "#f7931a",
  "Market Maker": "#3b82f6",
  "Whale": "#9945ff",
  "DeFi": "#0ecb81",
};

export default function WhalesPage() {
  const [whales, setWhales] = useState<Whale[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch("/api/whales")
      .then((r) => r.json())
      .then((data) => { setWhales(data); setLoading(false); });
  }, []);

  const categories = ["All", "Exchange", "Market Maker", "Whale", "DeFi"];
  const filtered = filter === "All" ? whales : whales.filter((w) => w.category === filter);

  return (
    <div style={{ minHeight: "100vh" }}>
      <div style={{ padding: "12px 20px", borderBottom: "1px solid #1a1a1a", display: "flex", gap: "4px", flexWrap: "wrap" }}>
        {categories.map((c) => (
          <button key={c} onClick={() => setFilter(c)} style={{
            padding: "4px 12px", borderRadius: "4px", border: "1px solid",
            fontSize: "12px", cursor: "pointer", fontWeight: 500,
            background: filter === c ? `${CATEGORY_COLORS[c] ?? "#0ecb81"}15` : "transparent",
            borderColor: filter === c ? `${CATEGORY_COLORS[c] ?? "#0ecb81"}44` : "#1a1a1a",
            color: filter === c ? (CATEGORY_COLORS[c] ?? "#0ecb81") : "#333",
          }}>
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: "20px" }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ marginBottom: "24px" }}>
              <div className="skeleton" style={{ height: "44px", marginBottom: "2px" }} />
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="skeleton" style={{ height: "40px", marginBottom: "1px" }} />
              ))}
            </div>
          ))}
        </div>
      ) : filtered.map((whale, wi) => (
        <motion.div key={whale.address} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: wi * 0.06 }}
          style={{ borderBottom: "1px solid #1a1a1a" }}>
          <div style={{ padding: "12px 20px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "3px", height: "32px", borderRadius: "2px", background: CATEGORY_COLORS[whale.category] ?? "#333" }} />
              <div>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>{whale.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
                  <span style={{ fontSize: "11px", color: "#333", fontFamily: "monospace" }}>
                    {whale.address.slice(0, 10)}...{whale.address.slice(-6)}
                  </span>
                  <span style={{
                    fontSize: "10px", padding: "1px 6px", borderRadius: "3px",
                    background: `${CATEGORY_COLORS[whale.category] ?? "#333"}15`,
                    color: CATEGORY_COLORS[whale.category] ?? "#333",
                    border: `1px solid ${CATEGORY_COLORS[whale.category] ?? "#333"}30`,
                  }}>
                    {whale.category}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span className="tag-neutral">{whale.transactions.length} txns</span>
              <a href={`https://etherscan.io/address/${whale.address}`} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: "11px", color: "#3b82f6", textDecoration: "none" }}>
                Etherscan ↗
              </a>
            </div>
          </div>

          {whale.transactions.length === 0 ? (
            <div style={{ padding: "16px 20px" }}>
              <span style={{ fontSize: "12px", color: "#222" }}>No significant transactions found</span>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
                  {["Hash", "Token", "Amount", "Date"].map((h) => (
                    <th key={h} style={{ padding: "8px 20px", textAlign: "left", fontSize: "11px", color: "#333", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {whale.transactions.map((tx, i) => (
                  <motion.tr key={tx.hash} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    style={{ borderBottom: "1px solid #1a1a1a" }}>
                    <td style={{ padding: "10px 20px" }}>
                      <a href={`https://etherscan.io/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: "12px", color: "#3b82f6", fontFamily: "monospace", textDecoration: "none" }}>
                        {tx.hash.slice(0, 16)}...
                      </a>
                    </td>
                    <td style={{ padding: "10px 20px" }}>
                      <span className="tag-neutral">{tx.token}</span>
                    </td>
                    <td style={{ padding: "10px 20px", fontSize: "13px", color: "#0ecb81", fontFamily: "monospace" }}>
                      {tx.value} {tx.token}
                    </td>
                    <td style={{ padding: "10px 20px", fontSize: "12px", color: "#333" }}>
                      {new Date(tx.timestamp).toLocaleDateString("de-DE")}
                    </td>
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