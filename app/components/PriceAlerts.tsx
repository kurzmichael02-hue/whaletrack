"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Alert = {
  id: string;
  symbol: string;
  targetPrice: number;
  direction: "above" | "below";
  triggered: boolean;
};

const SYMBOLS = ["BTC", "ETH", "SOL", "BNB", "XRP"];

export default function PriceAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [symbol, setSymbol] = useState("BTC");
  const [price, setPrice] = useState("");
  const [direction, setDirection] = useState<"above" | "below">("above");
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    const saved = localStorage.getItem("whaletrack_alerts");
    if (saved) setAlerts(JSON.parse(saved));
  }, []);

  useEffect(() => {
    async function checkPrices() {
      try {
        const results = await Promise.all(
          SYMBOLS.map((s) =>
            fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${s}USDT`).then((r) => r.json())
          )
        );
        const prices: Record<string, number> = {};
        results.forEach((r, i) => { prices[SYMBOLS[i]!] = parseFloat(r.price); });
        setCurrentPrices(prices);

        setAlerts((prev) => {
          const updated = prev.map((alert) => {
            if (alert.triggered) return alert;
            const current = prices[alert.symbol];
            if (!current) return alert;
            const triggered =
              (alert.direction === "above" && current >= alert.targetPrice) ||
              (alert.direction === "below" && current <= alert.targetPrice);
            if (triggered) {
              if (Notification.permission === "granted") {
                new Notification(`WhaleTrack Alert`, {
                  body: `${alert.symbol} is ${alert.direction} $${alert.targetPrice.toLocaleString()}`,
                });
              }
              return { ...alert, triggered: true };
            }
            return alert;
          });
          localStorage.setItem("whaletrack_alerts", JSON.stringify(updated));
          return updated;
        });
      } catch (e) { console.error(e); }
    }
    checkPrices();
    const interval = setInterval(checkPrices, 15000);
    return () => clearInterval(interval);
  }, []);

  function addAlert() {
    if (!price || isNaN(parseFloat(price))) return;
    const newAlert: Alert = {
      id: Date.now().toString(),
      symbol,
      targetPrice: parseFloat(price),
      direction,
      triggered: false,
    };
    const updated = [...alerts, newAlert];
    setAlerts(updated);
    localStorage.setItem("whaletrack_alerts", JSON.stringify(updated));
    setPrice("");

    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }

  function removeAlert(id: string) {
    const updated = alerts.filter((a) => a.id !== id);
    setAlerts(updated);
    localStorage.setItem("whaletrack_alerts", JSON.stringify(updated));
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Add alert form */}
      <div style={{ padding: "20px", borderBottom: "1px solid #1f1f1f" }}>
        <p style={{ fontSize: "11px", color: "#404040", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
          New Alert
        </p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <select value={symbol} onChange={(e) => setSymbol(e.target.value)} style={{
            background: "#111", border: "1px solid #1f1f1f", color: "#fff",
            padding: "8px 12px", borderRadius: "4px", fontSize: "13px", cursor: "pointer",
          }}>
            {SYMBOLS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <select value={direction} onChange={(e) => setDirection(e.target.value as "above" | "below")} style={{
            background: "#111", border: "1px solid #1f1f1f", color: "#fff",
            padding: "8px 12px", borderRadius: "4px", fontSize: "13px", cursor: "pointer",
          }}>
            <option value="above">Above</option>
            <option value="below">Below</option>
          </select>

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Target price in USD"
            style={{
              background: "#111", border: "1px solid #1f1f1f", color: "#fff",
              padding: "8px 12px", borderRadius: "4px", fontSize: "13px",
              outline: "none", minWidth: "200px",
            }}
            onKeyDown={(e) => e.key === "Enter" && addAlert()}
          />

          <button onClick={addAlert} style={{
            background: "rgba(14,203,129,0.1)", border: "1px solid rgba(14,203,129,0.3)",
            color: "#0ecb81", padding: "8px 16px", borderRadius: "4px",
            fontSize: "13px", cursor: "pointer", fontWeight: 500,
          }}>
            + Add Alert
          </button>
        </div>

        {currentPrices[symbol] && (
          <p style={{ fontSize: "11px", color: "#404040", marginTop: "8px" }}>
            Current {symbol} price: <span style={{ color: "#808080", fontFamily: "monospace" }}>${currentPrices[symbol]?.toLocaleString()}</span>
          </p>
        )}
      </div>

      {/* Alert list */}
      {alerts.length === 0 ? (
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <p style={{ fontSize: "13px", color: "#404040" }}>No alerts set. Add one above.</p>
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1f1f1f" }}>
              {["Asset", "Condition", "Target", "Current", "Status", ""].map((h) => (
                <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: "11px", color: "#404040", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {alerts.map((alert) => (
                <motion.tr
                  key={alert.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  style={{ borderBottom: "1px solid #1f1f1f", opacity: alert.triggered ? 0.4 : 1 }}
                >
                  <td style={{ padding: "14px 20px", fontSize: "13px", fontWeight: 600, color: "#fff" }}>{alert.symbol}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span className={alert.direction === "above" ? "tag-green" : "tag-red"}>
                      {alert.direction === "above" ? "▲ Above" : "▼ Below"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#fff", fontFamily: "monospace" }}>
                    ${alert.targetPrice.toLocaleString()}
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#808080", fontFamily: "monospace" }}>
                    {currentPrices[alert.symbol] ? `$${currentPrices[alert.symbol]?.toLocaleString()}` : "—"}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    {alert.triggered ? (
                      <span className="tag-green">Triggered</span>
                    ) : (
                      <span className="tag-neutral">Watching</span>
                    )}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <button onClick={() => removeAlert(alert.id)} style={{
                      background: "transparent", border: "none",
                      color: "#404040", cursor: "pointer", fontSize: "13px",
                      padding: "4px 8px", borderRadius: "4px",
                    }}>
                      ✕
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      )}
    </div>
  );
}