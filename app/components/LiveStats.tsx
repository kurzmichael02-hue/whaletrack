"use client";

import { useEffect, useState } from "react";
import StatsCard from "./StatsCard";

const HOLDINGS = [
  { symbol: "BTC", amount: 0.12, buyPrice: 62000 },
  { symbol: "ETH", amount: 2.5, buyPrice: 1800 },
  { symbol: "SOL", amount: 45, buyPrice: 60 },
];

export default function LiveStats() {
  const [totalValue, setTotalValue] = useState<string>("—");
  const [pnl, setPnl] = useState<string>("—");
  const [pnlPositive, setPnlPositive] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const results = await Promise.all([
          fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT").then((r) => r.json()),
          fetch("https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT").then((r) => r.json()),
          fetch("https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT").then((r) => r.json()),
        ]);

        const prices: Record<string, number> = {
          BTC: parseFloat(results[0].price),
          ETH: parseFloat(results[1].price),
          SOL: parseFloat(results[2].price),
        };

        let total = 0;
        let totalBuy = 0;

        for (const h of HOLDINGS) {
          const price = prices[h.symbol] ?? 0;
          total += h.amount * price;
          totalBuy += h.amount * h.buyPrice;
        }

        const pnlValue = total - totalBuy;
        setPnlPositive(pnlValue >= 0);
        setTotalValue(`$${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
        setPnl(`${pnlValue >= 0 ? "+" : ""}$${pnlValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
      } catch (e) {
        console.error(e);
      }
    }
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderBottom: "1px solid #1f1f1f" }}>
      <StatsCard label="Portfolio Value" value={totalValue} index={0} />
      <StatsCard label="Total PnL" value={pnl} positive={pnlPositive} index={1} />
      <StatsCard label="Open Positions" value="3" index={2} />
    </div>
  );
}