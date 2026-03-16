"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type TokenData = {
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  volume: number;
  ath: number;
  athDate: string;
  supply: number;
  change24h: number;
  change7d: number;
  change30d: number;
  description: string;
  rank: number;
};

const COINGECKO_IDS: Record<string, string> = {
  BTC: "bitcoin", ETH: "ethereum", SOL: "solana", BNB: "binancecoin",
  XRP: "ripple", DOGE: "dogecoin", ADA: "cardano", AVAX: "avalanche-2",
  LINK: "chainlink", DOT: "polkadot", MATIC: "matic-network", UNI: "uniswap",
  LTC: "litecoin", ATOM: "cosmos", NEAR: "near",
};

type Props = { symbol: string | null; onClose: () => void };

export default function TokenDetail({ symbol, onClose }: Props) {
  const [data, setData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!symbol) return;
    setLoading(true);
    setData(null);
    const id = COINGECKO_IDS[symbol] ?? symbol.toLowerCase();
    fetch(`/api/token?symbol=${id}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, [symbol]);

  const fmt = (n: number) => n?.toLocaleString(undefined, { maximumFractionDigits: 2 }) ?? "—";
  const fmtLarge = (n: number) => {
    if (!n) return "—";
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    return `$${fmt(n)}`;
  };

  return (
    <AnimatePresence>
      {symbol && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100 }}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: "fixed", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: "480px", maxWidth: "90vw",
              background: "#0a0a0a", border: "1px solid #1a1a1a",
              borderRadius: "8px", zIndex: 101, overflow: "hidden",
            }}
          >
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>{symbol}</span>
                {data && <span style={{ fontSize: "12px", color: "#333" }}>#{data.rank}</span>}
              </div>
              <button onClick={onClose} style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: "16px" }}>✕</button>
            </div>

            {loading ? (
              <div style={{ padding: "20px" }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: "20px", marginBottom: "10px" }} />
                ))}
              </div>
            ) : data ? (
              <div style={{ padding: "20px" }}>
                <div style={{ marginBottom: "20px" }}>
                  <p style={{ fontSize: "32px", fontWeight: 700, color: "#fff", fontFamily: "monospace" }}>${fmt(data.price)}</p>
                  <div style={{ display: "flex", gap: "12px", marginTop: "6px" }}>
                    {[
                      { label: "24h", value: data.change24h },
                      { label: "7d", value: data.change7d },
                      { label: "30d", value: data.change30d },
                    ].map((c) => (
                      <span key={c.label} style={{ fontSize: "12px', color: c.value >= 0 ? '#0ecb81' : '#f6465d'" }}>
                        {c.label}: {c.value >= 0 ? "+" : ""}{c.value?.toFixed(2)}%
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "#1a1a1a", border: "1px solid #1a1a1a", borderRadius: "4px", overflow: "hidden", marginBottom: "16px" }}>
                  {[
                    { label: "Market Cap", value: fmtLarge(data.marketCap) },
                    { label: "24h Volume", value: fmtLarge(data.volume) },
                    { label: "All-Time High", value: `$${fmt(data.ath)}` },
                    { label: "Circulating Supply", value: data.supply ? `${(data.supply / 1_000_000).toFixed(2)}M` : "—" },
                  ].map((item) => (
                    <div key={item.label} style={{ padding: "12px 14px", background: "#0a0a0a" }}>
                      <p style={{ fontSize: "10px", color: "#333", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.label}</p>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: "#fff", fontFamily: "monospace" }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                {data.description && (
                  <p style={{ fontSize: "12px", color: "#505050", lineHeight: 1.6 }}>{data.description}.</p>
                )}
              </div>
            ) : (
              <div style={{ padding: "40px 20px", textAlign: "center" }}>
                <p style={{ fontSize: "13px", color: "#333" }}>No data found for {symbol}</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}