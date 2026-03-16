"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Result = {
  symbol: string;
  price: number;
  change: number;
  volume: number;
};

export default function TokenSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!query || query.length < 2) { setResults([]); return; }
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${query.toUpperCase()}USDT`);
        if (res.ok) {
          const data = await res.json();
          setResults([{
            symbol: query.toUpperCase(),
            price: parseFloat(data.lastPrice),
            change: parseFloat(data.priceChangePercent),
            volume: parseFloat(data.quoteVolume),
          }]);
          setOpen(true);
        } else {
          // Try searching multiple tokens
          const allRes = await fetch("https://api.binance.com/api/v3/ticker/24hr");
          const all = await allRes.json();
          const filtered = all
            .filter((t: any) => t.symbol.endsWith("USDT") && t.symbol.startsWith(query.toUpperCase()))
            .slice(0, 6)
            .map((t: any) => ({
              symbol: t.symbol.replace("USDT", ""),
              price: parseFloat(t.lastPrice),
              change: parseFloat(t.priceChangePercent),
              volume: parseFloat(t.quoteVolume),
            }));
          setResults(filtered);
          setOpen(filtered.length > 0);
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  const fmtVol = (n: number) => {
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    return `$${fmt(n)}`;
  };

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", maxWidth: "400px" }}>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#333", fontSize: "13px" }}>⌕</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search any token... BTC, PEPE, WIF"
          style={{
            width: "100%", padding: "8px 12px 8px 32px",
            background: "#0d0d0d", border: "1px solid #1a1a1a",
            color: "#fff", borderRadius: "6px", fontSize: "13px",
            outline: "none", transition: "border-color 0.1s",
          }}
          onMouseEnter={(e) => (e.target as HTMLInputElement).style.borderColor = "#333"}
          onMouseLeave={(e) => (e.target as HTMLInputElement).style.borderColor = "#1a1a1a"}
        />
        {loading && (
          <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#333", fontSize: "11px" }}>...</span>
        )}
      </div>

      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100,
              background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: "6px",
              marginTop: "4px", overflow: "hidden",
            }}
          >
            {results.map((r) => (
              <div key={r.symbol} style={{
                padding: "10px 14px", borderBottom: "1px solid #111",
                cursor: "pointer", transition: "background 0.1s",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#111")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>{r.symbol}</span>
                  <span style={{ fontSize: "11px", color: "#333", marginLeft: "8px" }}>/ USDT</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontSize: "13px", color: "#fff", fontFamily: "monospace" }}>${fmt(r.price)}</span>
                  <span style={{ fontSize: "12px", fontWeight: 500, color: r.change >= 0 ? "#0ecb81" : "#f6465d" }}>
                    {r.change >= 0 ? "▲" : "▼"} {Math.abs(r.change).toFixed(2)}%
                  </span>
                  <span style={{ fontSize: "11px", color: "#333" }}>{fmtVol(r.volume)}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}