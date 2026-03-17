"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CURRENCIES = ["USD", "EUR", "GBP", "CHF", "JPY", "RUB"];
const TOKENS = ["BTC", "ETH", "SOL", "BNB", "XRP", "DOGE", "ADA", "AVAX"];

export default function TokenConverter() {
  const [fromToken, setFromToken] = useState("BTC");
  const [toCurrency, setToCurrency] = useState("USD");
  const [amount, setAmount] = useState("1");
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [fxRates, setFxRates] = useState<Record<string, number>>({ USD: 1 });
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    // Fetch crypto prices
    Promise.all(
      TOKENS.map((t) =>
        fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${t}USDT`)
          .then((r) => r.json())
          .then((d) => ({ symbol: t, price: parseFloat(d.price) }))
      )
    ).then((results) => {
      const map: Record<string, number> = {};
      results.forEach((r) => { map[r.symbol] = r.price; });
      setPrices(map);
    });

    // Fetch FX rates
    fetch("https://api.exchangerate-api.com/v4/latest/USD")
      .then((r) => r.json())
      .then((d) => setFxRates(d.rates ?? { USD: 1 }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const tokenPrice = prices[fromToken];
    if (!tokenPrice || !amount) { setResult(null); return; }
    const usdValue = parseFloat(amount) * tokenPrice;
    const rate = fxRates[toCurrency] ?? 1;
    setResult(usdValue * rate);
  }, [fromToken, toCurrency, amount, prices, fxRates]);

  const fmt = (n: number) => {
    if (n >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
    if (n >= 1) return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
    return n.toLocaleString(undefined, { maximumFractionDigits: 8 });
  };

  return (
    <div style={{ borderBottom: "1px solid #1a1a1a" }}>
      <div style={{ padding: "10px 20px", borderBottom: "1px solid #1a1a1a" }}>
        <span style={{ fontSize: "11px", color: "#333", textTransform: "uppercase", letterSpacing: "0.08em" }}>Token Converter</span>
      </div>
      <div style={{ padding: "16px 20px", display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", color: "#fff", padding: "8px 12px", borderRadius: "4px", fontSize: "16px", fontWeight: 600, outline: "none", width: "120px", fontFamily: "monospace" }}
        />
        <select value={fromToken} onChange={(e) => setFromToken(e.target.value)} style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", color: "#fff", padding: "8px 12px", borderRadius: "4px", fontSize: "13px", cursor: "pointer", outline: "none" }}>
          {TOKENS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <span style={{ color: "#333", fontSize: "16px" }}>→</span>
        <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", color: "#fff", padding: "8px 12px", borderRadius: "4px", fontSize: "13px", cursor: "pointer", outline: "none" }}>
          {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {result !== null && (
          <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
            <span style={{ fontSize: "24px", fontWeight: 700, color: "#0ecb81", fontFamily: "monospace" }}>
              {toCurrency === "JPY" ? "¥" : toCurrency === "EUR" ? "€" : toCurrency === "GBP" ? "£" : toCurrency === "RUB" ? "₽" : "$"}{fmt(result)}
            </span>
            <span style={{ fontSize: "11px", color: "#333", marginLeft: "8px" }}>{toCurrency}</span>
          </motion.div>
        )}
      </div>
      {prices[fromToken] && (
        <div style={{ padding: "0 20px 12px", fontSize: "11px", color: "#333" }}>
          1 {fromToken} = ${prices[fromToken]?.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
        </div>
      )}
    </div>
  );
}