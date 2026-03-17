"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Sentiment = {
  twitter_followers: number;
  reddit_subscribers: number;
  reddit_active_accounts: number;
  sentiment_votes_up: number;
  sentiment_votes_down: number;
};

const COINGECKO_IDS: Record<string, string> = {
  BTC: "bitcoin", ETH: "ethereum", SOL: "solana", BNB: "binancecoin",
  XRP: "ripple", DOGE: "dogecoin", ADA: "cardano", AVAX: "avalanche-2",
};

const TOKENS = ["BTC", "ETH", "SOL", "BNB", "XRP", "DOGE"];

export default function SocialSentiment() {
  const [selected, setSelected] = useState("BTC");
  const [data, setData] = useState<Sentiment | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setData(null);
    const id = COINGECKO_IDS[selected] ?? selected.toLowerCase();
    fetch(`/api/sentiment?symbol=${id}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, [selected]);

  const fmtNum = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
  };

  return (
    <div style={{ borderBottom: "1px solid #1a1a1a" }}>
      <div style={{ padding: "10px 20px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "11px", color: "#333", textTransform: "uppercase", letterSpacing: "0.08em" }}>Social Sentiment</span>
        <div style={{ display: "flex", gap: "4px" }}>
          {TOKENS.map((t) => (
            <button key={t} onClick={() => setSelected(t)} style={{
              padding: "3px 8px", borderRadius: "3px", border: "1px solid",
              fontSize: "11px", cursor: "pointer", fontWeight: 500,
              background: selected === t ? "rgba(14,203,129,0.08)" : "transparent",
              borderColor: selected === t ? "rgba(14,203,129,0.25)" : "#1a1a1a",
              color: selected === t ? "#0ecb81" : "#333",
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 20px" }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "60px", borderRadius: "4px" }} />
            ))}
          </div>
        ) : data ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "#1a1a1a", border: "1px solid #1a1a1a", borderRadius: "4px", overflow: "hidden" }}>
              {[
                { label: "Twitter Followers", value: fmtNum(data.twitter_followers), color: "#1da1f2" },
                { label: "Reddit Subscribers", value: fmtNum(data.reddit_subscribers), color: "#ff4500" },
                { label: "Reddit Active (48h)", value: fmtNum(data.reddit_active_accounts), color: "#ff4500" },
              ].map((s) => (
                <div key={s.label} style={{ padding: "14px 16px", background: "#0a0a0a" }}>
                  <p style={{ fontSize: "10px", color: "#333", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>{s.label}</p>
                  <p style={{ fontSize: "20px", fontWeight: 600, color: s.color, fontFamily: "monospace" }}>{s.value}</p>
                </div>
              ))}
            </div>

            <div>
              <p style={{ fontSize: "11px", color: "#333", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Community Sentiment</p>
              <div style={{ display: "flex", height: "8px", borderRadius: "4px", overflow: "hidden", background: "#1a1a1a" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${data.sentiment_votes_up}%` }}
                  transition={{ duration: 0.8 }}
                  style={{ background: "#0ecb81", height: "100%" }}
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${data.sentiment_votes_down}%` }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  style={{ background: "#f6465d", height: "100%" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                <span style={{ fontSize: "11px", color: "#0ecb81" }}>▲ Bullish {data.sentiment_votes_up.toFixed(1)}%</span>
                <span style={{ fontSize: "11px", color: "#f6465d" }}>▼ Bearish {data.sentiment_votes_down.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: "12px", color: "#333" }}>No sentiment data available</p>
        )}
      </div>
    </div>
  );
}