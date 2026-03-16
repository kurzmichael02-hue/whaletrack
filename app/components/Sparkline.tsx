"use client";

import { useEffect, useState } from "react";

type Props = {
  symbol: string;
  color: string;
  positive: boolean;
};

export default function Sparkline({ symbol, color, positive }: Props) {
  const [points, setPoints] = useState<number[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=1h&limit=24`
        );
        const data = await res.json();
        const closes = data.map((k: any) => parseFloat(k[4]));
        setPoints(closes);
      } catch (e) { console.error(e); }
    }
    load();
  }, [symbol]);

  if (points.length === 0) return <div style={{ width: "80px", height: "32px" }} />;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const w = 80;
  const h = 32;
  const step = w / (points.length - 1);

  const pathPoints = points.map((p, i) => {
    const x = i * step;
    const y = h - ((p - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");

  const fillPoints = `0,${h} ${pathPoints} ${w},${h}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`grad-${symbol}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPoints} fill={`url(#grad-${symbol})`} />
      <polyline points={pathPoints} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}