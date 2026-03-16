"use client";

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WalletDashboard from "../components/WalletDashboard";

type Holding = {
  id: string;
  symbol: string;
  amount: number;
  buyPrice: number;
  buyDate: string;
};

type LivePrice = {
  symbol: string;
  price: number;
};

export default function PortfolioPage() {
  const { isConnected } = useAccount();
  if (isConnected) return <WalletDashboard />;
  return <ManualPortfolio />;
}

function ManualPortfolio() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [buyDate, setBuyDate] = useState(new Date().toISOString().split("T")[0]!);
  const [symbolPrice, setSymbolPrice] = useState<number | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("whaletrack_portfolio");
    if (saved) setHoldings(JSON.parse(saved));
  }, []);

  // Fetch live prices for all holdings
  useEffect(() => {
    if (holdings.length === 0) return;
    const symbols = [...new Set(holdings.map((h) => h.symbol))];
    Promise.all(
      symbols.map((s) =>
        fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${s}USDT`)
          .then((r) => r.json())
          .then((d) => ({ symbol: s, price: parseFloat(d.price) }))
          .catch(() => ({ symbol: s, price: 0 }))
      )
    ).then((results) => {
      const map: Record<string, number> = {};
      results.forEach((r) => { map[r.symbol] = r.price; });
      setPrices(map);
    });
  }, [holdings]);

  // Fetch price when symbol changes
  useEffect(() => {
    if (!symbol || symbol.length < 2) { setSymbolPrice(null); return; }
    const timeout = setTimeout(() => {
      fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol.toUpperCase()}USDT`)
        .then((r) => r.json())
        .then((d) => setSymbolPrice(parseFloat(d.price)))
        .catch(() => setSymbolPrice(null));
    }, 500);
    return () => clearTimeout(timeout);
  }, [symbol]);

  function addHolding() {
    if (!symbol || !amount || !buyPrice) return;
    const newHolding: Holding = {
      id: Date.now().toString(),
      symbol: symbol.toUpperCase(),
      amount: parseFloat(amount),
      buyPrice: parseFloat(buyPrice),
      buyDate,
    };
    const updated = [...holdings, newHolding];
    setHoldings(updated);
    localStorage.setItem("whaletrack_portfolio", JSON.stringify(updated));
    setSymbol(""); setAmount(""); setBuyPrice(""); setShowAdd(false);
  }

  function removeHolding(id: string) {
    const updated = holdings.filter((h) => h.id !== id);
    setHoldings(updated);
    localStorage.setItem("whaletrack_portfolio", JSON.stringify(updated));
  }

  function useCurrentPrice() {
    if (symbolPrice) setBuyPrice(symbolPrice.toString());
  }

  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  const enriched = holdings.map((h) => {
    const currentPrice = prices[h.symbol] ?? 0;
    const value = h.amount * currentPrice;
    const cost = h.amount * h.buyPrice;
    const pnl = value - cost;
    const pnlPercent = cost > 0 ? (pnl / cost) * 100 : 0;
    return { ...h, currentPrice, value, cost, pnl, pnlPercent };
  });

  const totalValue = enriched.reduce((s, h) => s + h.value, 0);
  const totalCost = enriched.reduce((s, h) => s + h.cost, 0);
  const totalPnl = totalValue - totalCost;
  const totalPnlPercent = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: "1px solid #1a1a1a" }}>
        {[
          { label: "Total Value", value: holdings.length > 0 ? `$${fmt(totalValue)}` : "—", green: false },
          { label: "Total Cost", value: holdings.length > 0 ? `$${fmt(totalCost)}` : "—", green: false },
          { label: "Total PnL", value: holdings.length > 0 ? `${totalPnl >= 0 ? "+" : ""}$${fmt(totalPnl)}` : "—", green: totalPnl >= 0 },
          { label: "Return", value: holdings.length > 0 ? `${totalPnlPercent >= 0 ? "+" : ""}${totalPnlPercent.toFixed(2)}%` : "—", green: totalPnlPercent >= 0 },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
            style={{ padding: "20px", borderRight: i < 3 ? "1px solid #1a1a1a" : "none" }}>
            <p style={{ fontSize: "11px", color: "#333", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>{s.label}</p>
            <p style={{ fontSize: "22px", fontWeight: 600, color: s.green ? "#0ecb81" : "#fff", fontFamily: "monospace", fontVariantNumeric: "tabular-nums" }}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <div style={{ padding: "12px 20px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "11px", color: "#333", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Holdings ({holdings.length})
        </span>
        <button onClick={() => setShowAdd(!showAdd)} style={{
          padding: "5px 14px", borderRadius: "4px", cursor: "pointer",
          fontSize: "12px", fontWeight: 500, transition: "all 0.1s",
          background: showAdd ? "rgba(246,70,93,0.08)" : "rgba(14,203,129,0.08)",
          border: showAdd ? "1px solid rgba(246,70,93,0.3)" : "1px solid rgba(14,203,129,0.3)",
          color: showAdd ? "#f6465d" : "#0ecb81",
        }}>
          {showAdd ? "✕ Cancel" : "+ Add Token"}
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden", borderBottom: "1px solid #1a1a1a", background: "#0a0a0a" }}
          >
            <div style={{ padding: "16px 20px", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-end" }}>
              <div>
                <p style={{ fontSize: "11px", color: "#333", marginBottom: "6px" }}>SYMBOL</p>
                <input value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  placeholder="BTC" style={inputStyle} />
                {symbolPrice && (
                  <p style={{ fontSize: "10px", color: "#0ecb81", marginTop: "4px", cursor: "pointer" }}
                    onClick={useCurrentPrice}>
                    Current: ${fmt(symbolPrice)} — click to use
                  </p>
                )}
              </div>
              <div>
                <p style={{ fontSize: "11px", color: "#333", marginBottom: "6px" }}>AMOUNT</p>
                <input value={amount} onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.5" type="number" style={inputStyle} />
              </div>
              <div>
                <p style={{ fontSize: "11px", color: "#333", marginBottom: "6px" }}>BUY PRICE (USD)</p>
                <input value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)}
                  placeholder="62000" type="number" style={inputStyle} />
              </div>
              <div>
                <p style={{ fontSize: "11px", color: "#333", marginBottom: "6px" }}>DATE</p>
                <input value={buyDate} onChange={(e) => setBuyDate(e.target.value)}
                  type="date" style={inputStyle} />
              </div>
              <button onClick={addHolding} style={{
                padding: "8px 20px", borderRadius: "4px", cursor: "pointer",
                fontSize: "13px", fontWeight: 500, background: "rgba(14,203,129,0.1)",
                border: "1px solid rgba(14,203,129,0.3)", color: "#0ecb81",
                height: "36px",
              }}>
                Add
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Holdings table */}
      {holdings.length === 0 ? (
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <p style={{ fontSize: "13px", color: "#333", marginBottom: "8px" }}>No holdings yet</p>
          <p style={{ fontSize: "11px", color: "#222" }}>Click "+ Add Token" to start tracking your portfolio</p>
          <p style={{ fontSize: "11px", color: "#222", marginTop: "4px" }}>Or connect your wallet to see real holdings</p>
        </div>
      ) : (
        <div className="table-scroll">
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "650px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
                {["Token", "Amount", "Buy Price", "Current", "Value", "PnL", ""].map((h) => (
                  <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: "11px", color: "#333", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {enriched.map((h, i) => (
                <motion.tr key={h.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  style={{ borderBottom: "1px solid #1a1a1a" }}>
                  <td style={{ padding: "14px 20px", fontSize: "13px", fontWeight: 600, color: "#fff" }}>{h.symbol}</td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#505050", fontFamily: "monospace" }}>{h.amount}</td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#505050", fontFamily: "monospace" }}>${fmt(h.buyPrice)}</td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#fff", fontFamily: "monospace" }}>
                    {h.currentPrice > 0 ? `$${fmt(h.currentPrice)}` : "—"}
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#fff", fontFamily: "monospace" }}>
                    {h.value > 0 ? `$${fmt(h.value)}` : "—"}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 500, color: h.pnl >= 0 ? "#0ecb81" : "#f6465d", fontFamily: "monospace" }}>
                      {h.pnl >= 0 ? "+" : ""}${fmt(h.pnl)} ({h.pnlPercent.toFixed(1)}%)
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <button onClick={() => removeHolding(h.id)} style={{
                      background: "none", border: "none", color: "#222", cursor: "pointer",
                      fontSize: "13px", padding: "2px 6px", borderRadius: "3px",
                      transition: "color 0.1s",
                    }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#f6465d")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#222")}
                    >✕</button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "#0d0d0d", border: "1px solid #1a1a1a", color: "#fff",
  padding: "7px 10px", borderRadius: "4px", fontSize: "13px",
  outline: "none", width: "140px",
};
