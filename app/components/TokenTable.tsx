"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Sparkline from "./Sparkline";

type Token = {
  symbol: string;
  price: number;
  change: number;
  high: number;
  low: number;
  volume: number;
};

const TOKENS = [
  { symbol: "BTC", binance: "BTCUSDT", color: "#F7931A", icon: "₿", name: "Bitcoin" },
  { symbol: "ETH", binance: "ETHUSDT", color: "#627EEA", icon: "Ξ", name: "Ethereum" },
  { symbol: "SOL", binance: "SOLUSDT", color: "#9945FF", icon: "◎", name: "Solana" },
  { symbol: "BNB", binance: "BNBUSDT", color: "#F3BA2F", icon: "⬡", name: "BNB" },
  { symbol: "XRP", binance: "XRPUSDT", color: "#00AAE4", icon: "✕", name: "XRP" },
  { symbol: "DOGE", binance: "DOGEUSDT", color: "#C2A633", icon: "Ð", name: "Dogecoin" },
  { symbol: "ADA", binance: "ADAUSDT", color: "#0033AD", icon: "₳", name: "Cardano" },
  { symbol: "AVAX", binance: "AVAXUSDT", color: "#E84142", icon: "▲", name: "Avalanche" },
  { symbol: "LINK", binance: "LINKUSDT", color: "#2A5ADA", icon: "⬡", name: "Chainlink" },
  { symbol: "DOT", binance: "DOTUSDT", color: "#E6007A", icon: "●", name: "Polkadot" },
  { symbol: "MATIC", binance: "MATICUSDT", color: "#8247E5", icon: "⬟", name: "Polygon" },
  { symbol: "UNI", binance: "UNIUSDT", color: "#FF007A", icon: "🦄", name: "Uniswap" },
  { symbol: "LTC", binance: "LTCUSDT", color: "#BFBBBB", icon: "Ł", name: "Litecoin" },
  { symbol: "ATOM", binance: "ATOMUSDT", color: "#6F7390", icon: "⚛", name: "Cosmos" },
  { symbol: "NEAR", binance: "NEARUSDT", color: "#00C08B", icon: "Ⓝ", name: "NEAR" },
];

function MiniBar({ value }: { value: number }) {
  const positive = value >= 0;
  const width = Math.min(Math.abs(value) * 4, 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ width: "48px", height: "3px", background: "#1a1a1a", borderRadius: "2px", overflow: "hidden", flexShrink: 0 }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          style={{ height: "100%", borderRadius: "2px", background: positive ? "#0ecb81" : "#f6465d" }}
        />
      </div>
      <span style={{ fontSize: "12px", fontWeight: 500, color: positive ? "#0ecb81" : "#f6465d", fontVariantNumeric: "tabular-nums", minWidth: "52px" }}>
        {positive ? "▲" : "▼"} {Math.abs(value).toFixed(2)}%
      </span>
    </div>
  );
}

export default function TokenTable() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [countdown, setCountdown] = useState(15);
  const [flashMap, setFlashMap] = useState<Record<string, "up" | "down">>({});
  const prevRef = useRef<Record<string, number>>({});

  async function fetchPrices() {
    try {
      const results = await Promise.all(
        TOKENS.map((t) =>
          fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${t.binance}`).then((r) => r.json())
        )
      );
      const newFlash: Record<string, "up" | "down"> = {};
      const updated = results.map((r, i) => {
        const sym = TOKENS[i]!.symbol;
        const newPrice = parseFloat(r.lastPrice);
        const prev = prevRef.current[sym];
        if (prev !== undefined && prev !== newPrice) {
          newFlash[sym] = newPrice > prev ? "up" : "down";
        }
        prevRef.current[sym] = newPrice;
        return {
          symbol: sym,
          price: newPrice,
          change: parseFloat(r.priceChangePercent),
          high: parseFloat(r.highPrice),
          low: parseFloat(r.lowPrice),
          volume: parseFloat(r.quoteVolume),
        };
      });
      setTokens(updated);
      setFlashMap(newFlash);
      setLastUpdate(new Date().toLocaleTimeString());
      setCountdown(15);
      setTimeout(() => setFlashMap({}), 700);
    } catch (e) {
      console.error("Binance fetch failed:", e);
    }
  }

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 15000);
    const countInterval = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    return () => { clearInterval(interval); clearInterval(countInterval); };
  }, []);

  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  const fmtVol = (n: number) => {
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    return `$${fmt(n)}`;
  };

  return (
    <div style={{ borderTop: "1px solid #1a1a1a" }}>
      <div style={{ padding: "10px 20px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "11px", color: "#333", textTransform: "uppercase", letterSpacing: "0.08em" }}>Market Overview</span>
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#0ecb81", display: "inline-block", boxShadow: "0 0 6px #0ecb81" }} />
        </div>
        <span style={{ fontSize: "11px", color: "#222", fontVariantNumeric: "tabular-nums" }}>
          Refreshes in {countdown}s · {lastUpdate}
        </span>
      </div>
      <div className="table-scroll">
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
              {["#", "Asset", "Price", "24h", "Last 24h", "High / Low", "Volume"].map((h) => (
                <th key={h} className={["High / Low", "Volume"].includes(h) ? "hide-mobile" : ""} style={{ padding: "10px 20px", textAlign: "left", fontSize: "11px", color: "#333", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tokens.length === 0 ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #1a1a1a" }}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} style={{ padding: "14px 20px" }}>
                      <div className="skeleton" style={{ height: "16px", width: j === 1 ? "120px" : "80px" }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : tokens.map((token, i) => {
              const meta = TOKENS[i]!;
              const flash = flashMap[token.symbol];
              return (
                <motion.tr
                  key={token.symbol}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  style={{
                    borderBottom: "1px solid #1a1a1a",
                    background: flash === "up" ? "rgba(14,203,129,0.06)" : flash === "down" ? "rgba(246,70,93,0.06)" : "transparent",
                    transition: "background 0.1s",
                  }}
                >
                  <td style={{ padding: "14px 20px", fontSize: "12px", color: "#333" }}>{i + 1}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "30px", height: "30px", borderRadius: "8px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "13px", fontWeight: 700,
                        background: `${meta.color}15`, color: meta.color,
                        border: `1px solid ${meta.color}25`,
                      }}>
                        {meta.icon}
                      </div>
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>{token.symbol}</p>
                        <p className="hide-mobile" style={{ fontSize: "11px", color: "#333" }}>{meta.name}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", fontWeight: 600, color: "#fff", fontVariantNumeric: "tabular-nums" }}>
                    {token.price > 0 ? `$${fmt(token.price)}` : "—"}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <MiniBar value={token.change} />
                  </td>
                  <td className="hide-mobile" style={{ padding: "8px 20px" }}>
                    <Sparkline symbol={token.symbol} color={token.change >= 0 ? "#0ecb81" : "#f6465d"} positive={token.change >= 0} />
                  </td>
                  <td className="hide-mobile" style={{ padding: "14px 20px", fontSize: "12px" }}>
                    <span style={{ color: "#0ecb81" }}>${fmt(token.high)}</span>
                    <span style={{ color: "#333", margin: "0 4px" }}>/</span>
                    <span style={{ color: "#f6465d" }}>${fmt(token.low)}</span>
                  </td>
                  <td className="hide-mobile" style={{ padding: "14px 20px", fontSize: "12px", color: "#505050" }}>
                    {fmtVol(token.volume)}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}