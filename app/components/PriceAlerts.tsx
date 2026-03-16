"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Alert = {
  id: string;
  symbol: string;
  targetPrice: number;
  direction: "above" | "below";
  triggered: boolean;
  createdAt: string;
  triggeredAt?: string;
};

export default function PriceAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [symbol, setSymbol] = useState("");
  const [price, setPrice] = useState("");
  const [direction, setDirection] = useState<"above" | "below">("above");
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({});
  const [symbolPrice, setSymbolPrice] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "triggered">("all");

  useEffect(() => {
    const saved = localStorage.getItem("whaletrack_alerts");
    if (saved) setAlerts(JSON.parse(saved));
  }, []);

  // Fetch price for symbol being typed
  useEffect(() => {
    if (!symbol || symbol.length < 2) { setSymbolPrice(null); return; }
    const timeout = setTimeout(() => {
      fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol.toUpperCase()}USDT`)
        .then((r) => r.json())
        .then((d) => setSymbolPrice(parseFloat(d.price)))
        .catch(() => setSymbolPrice(null));
    }, 400);
    return () => clearTimeout(timeout);
  }, [symbol]);

  useEffect(() => {
    async function checkPrices() {
      const symbols = [...new Set(alerts.map((a) => a.symbol))];
      if (symbols.length === 0) return;
      try {
        const results = await Promise.all(
          symbols.map((s) =>
            fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${s}USDT`).then((r) => r.json())
          )
        );
        const prices: Record<string, number> = {};
        results.forEach((r, i) => { prices[symbols[i]!] = parseFloat(r.price); });
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
                new Notification("WhaleTrack Alert", {
                  body: `${alert.symbol} is ${alert.direction} $${alert.targetPrice.toLocaleString()}`,
                });
              }
              return { ...alert, triggered: true, triggeredAt: new Date().toISOString() };
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
  }, [alerts.length]);

  function addAlert() {
    if (!symbol || !price || isNaN(parseFloat(price))) return;
    const newAlert: Alert = {
      id: Date.now().toString(),
      symbol: symbol.toUpperCase(),
      targetPrice: parseFloat(price),
      direction,
      triggered: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [...alerts, newAlert];
    setAlerts(updated);
    localStorage.setItem("whaletrack_alerts", JSON.stringify(updated));
    setSymbol(""); setPrice("");
    if (Notification.permission === "default") Notification.requestPermission();
  }

  function removeAlert(id: string) {
    const updated = alerts.filter((a) => a.id !== id);
    setAlerts(updated);
    localStorage.setItem("whaletrack_alerts", JSON.stringify(updated));
  }

  function clearTriggered() {
    const updated = alerts.filter((a) => !a.triggered);
    setAlerts(updated);
    localStorage.setItem("whaletrack_alerts", JSON.stringify(updated));
  }

  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  const filtered = alerts.filter((a) =>
    filter === "all" ? true : filter === "active" ? !a.triggered : a.triggered
  );

  const activeCount = alerts.filter((a) => !a.triggered).length;
  const triggeredCount = alerts.filter((a) => a.triggered).length;

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Add form */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #1a1a1a", background: "#080808" }}>
        <p style={{ fontSize: "11px", color: "#333", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>New Alert</p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div>
            <p style={{ fontSize: "10px", color: "#333", marginBottom: "5px" }}>TOKEN</p>
            <input value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="BTC, ETH, PEPE..." style={inputStyle} />
            {symbolPrice && (
              <p style={{ fontSize: "10px", color: "#0ecb81", marginTop: "3px", cursor: "pointer" }}
                onClick={() => setPrice(symbolPrice.toString())}>
                ${fmt(symbolPrice)} — use current
              </p>
            )}
          </div>

          <div>
            <p style={{ fontSize: "10px", color: "#333", marginBottom: "5px" }}>CONDITION</p>
            <select value={direction} onChange={(e) => setDirection(e.target.value as "above" | "below")} style={inputStyle}>
              <option value="above">▲ Above</option>
              <option value="below">▼ Below</option>
            </select>
          </div>

          <div>
            <p style={{ fontSize: "10px", color: "#333", marginBottom: "5px" }}>TARGET PRICE</p>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00" style={inputStyle}
              onKeyDown={(e) => e.key === "Enter" && addAlert()} />
          </div>

          <button onClick={addAlert} style={{
            padding: "7px 16px", borderRadius: "4px", cursor: "pointer",
            fontSize: "12px", fontWeight: 500, height: "34px",
            background: "rgba(14,203,129,0.08)", border: "1px solid rgba(14,203,129,0.25)", color: "#0ecb81",
          }}>
            + Add
          </button>
        </div>
      </div>

      {/* Filter + stats */}
      <div style={{ padding: "10px 20px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: "4px" }}>
          {([
            { key: "all", label: `All (${alerts.length})` },
            { key: "active", label: `Active (${activeCount})` },
            { key: "triggered", label: `Triggered (${triggeredCount})` },
          ] as const).map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: "3px 10px", borderRadius: "4px", border: "1px solid",
              fontSize: "11px", cursor: "pointer", fontWeight: 500,
              background: filter === f.key ? "rgba(14,203,129,0.08)" : "transparent",
              borderColor: filter === f.key ? "rgba(14,203,129,0.25)" : "#1a1a1a",
              color: filter === f.key ? "#0ecb81" : "#333",
            }}>{f.label}</button>
          ))}
        </div>
        {triggeredCount > 0 && (
          <button onClick={clearTriggered} style={{
            fontSize: "11px", color: "#333", background: "none", border: "none",
            cursor: "pointer", padding: "3px 8px",
          }}>
            Clear triggered
          </button>
        )}
      </div>

      {/* Alert list */}
      {filtered.length === 0 ? (
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <p style={{ fontSize: "13px", color: "#222" }}>
            {filter === "triggered" ? "No triggered alerts" : "No alerts set. Add one above."}
          </p>
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
              {["Asset", "Condition", "Target", "Current", "Progress", "Status", ""].map((h) => (
                <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: "11px", color: "#333", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((alert) => {
                const current = currentPrices[alert.symbol] ?? 0;
                const progress = current > 0 ? (
                  alert.direction === "above"
                    ? Math.min((current / alert.targetPrice) * 100, 100)
                    : Math.min((alert.targetPrice / current) * 100, 100)
                ) : 0;

                return (
                  <motion.tr
                    key={alert.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    style={{ borderBottom: "1px solid #1a1a1a", opacity: alert.triggered ? 0.5 : 1 }}
                  >
                    <td style={{ padding: "14px 20px", fontSize: "13px", fontWeight: 600, color: "#fff" }}>{alert.symbol}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <span className={alert.direction === "above" ? "tag-green" : "tag-red"}>
                        {alert.direction === "above" ? "▲ Above" : "▼ Below"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: "13px", color: "#fff", fontFamily: "monospace" }}>
                      ${fmt(alert.targetPrice)}
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: "13px", color: "#808080", fontFamily: "monospace" }}>
                      {current > 0 ? `$${fmt(current)}` : "—"}
                    </td>
                    <td style={{ padding: "14px 20px", minWidth: "100px" }}>
                      {!alert.triggered && current > 0 && (
                        <div>
                          <div style={{ height: "3px", background: "#1a1a1a", borderRadius: "2px", overflow: "hidden" }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.6 }}
                              style={{
                                height: "100%", borderRadius: "2px",
                                background: progress >= 90 ? "#0ecb81" : progress >= 60 ? "#f7931a" : "#505050",
                              }}
                            />
                          </div>
                          <p style={{ fontSize: "10px", color: "#333", marginTop: "3px" }}>{progress.toFixed(0)}%</p>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      {alert.triggered ? (
                        <span className="tag-green">✓ Triggered</span>
                      ) : (
                        <span className="tag-neutral">Watching</span>
                      )}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <button onClick={() => removeAlert(alert.id)} style={{
                        background: "none", border: "none", color: "#222",
                        cursor: "pointer", fontSize: "13px",
                      }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#f6465d")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#222")}
                      >✕</button>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "#0d0d0d", border: "1px solid #1a1a1a", color: "#fff",
  padding: "7px 10px", borderRadius: "4px", fontSize: "13px",
  outline: "none", width: "150px",
};
