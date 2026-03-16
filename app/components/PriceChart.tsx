"use client";

import { useEffect, useRef, useState } from "react";

const SYMBOLS = [
  { label: "BTC", value: "BINANCE:BTCUSDT" },
  { label: "ETH", value: "BINANCE:ETHUSDT" },
  { label: "SOL", value: "BINANCE:SOLUSDT" },
  { label: "BNB", value: "BINANCE:BNBUSDT" },
  { label: "XRP", value: "BINANCE:XRPUSDT" },
];

const INTERVALS = [
  { label: "1H", value: "60" },
  { label: "4H", value: "240" },
  { label: "1D", value: "D" },
  { label: "1W", value: "W" },
];

export default function PriceChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [symbol, setSymbol] = useState("BINANCE:BTCUSDT");
  const [interval, setInterval] = useState("D");
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval,
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      backgroundColor: "rgba(13, 21, 41, 0)",
      gridColor: "rgba(255, 255, 255, 0.04)",
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      calendar: false,
      support_host: "https://www.tradingview.com",
    });

    containerRef.current.appendChild(script);
  }, [symbol, interval]);

  const chartHeight = fullscreen ? "calc(100vh - 120px)" : "500px";

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        ...(fullscreen ? {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
          borderRadius: 0,
          background: "#0a0f1e",
        } : {}),
      }}
    >
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <h3 className="text-white font-semibold">Price Chart</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex gap-1">
            {INTERVALS.map((i) => (
              <button key={i.value} onClick={() => setInterval(i.value)}
                className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: interval === i.value ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.03)",
                  border: interval === i.value ? "1px solid rgba(16,185,129,0.25)" : "1px solid rgba(255,255,255,0.07)",
                  color: interval === i.value ? "#10b981" : "#6b7280",
                }}>
                {i.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {SYMBOLS.map((s) => (
              <button key={s.value} onClick={() => setSymbol(s.value)}
                className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: symbol === s.value ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.03)",
                  border: symbol === s.value ? "1px solid rgba(16,185,129,0.25)" : "1px solid rgba(255,255,255,0.07)",
                  color: symbol === s.value ? "#10b981" : "#6b7280",
                }}>
                {s.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="px-3 py-1 rounded-lg text-xs font-medium transition-all ml-1"
            style={{
              background: fullscreen ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.03)",
              border: fullscreen ? "1px solid rgba(16,185,129,0.25)" : "1px solid rgba(255,255,255,0.07)",
              color: fullscreen ? "#10b981" : "#6b7280",
            }}>
            {fullscreen ? "✕ Exit" : "⛶ Expand"}
          </button>
        </div>
      </div>
      <div ref={containerRef} style={{ height: chartHeight }} className="tradingview-widget-container" />
    </div>
  );
}
