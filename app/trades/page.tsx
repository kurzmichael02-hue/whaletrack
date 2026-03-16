"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";

type Trade = {
  id: string;
  pair: string;
  type: "long" | "short";
  entry: number;
  current: number;
  size: number;
  pnl: number;
  pnlPercent: number;
  status: "open" | "closed";
  date: string;
};

type OnChainTx = {
  hash: string;
  token: string;
  value: string;
  timestamp: string;
  type: "in" | "out";
};

const MOCK_TRADES: Trade[] = [
  { id: "1", pair: "BTC/USDT", type: "long", entry: 62000, current: 84000, size: 0.12, pnl: 2640, pnlPercent: 35.5, status: "open", date: "2024-12-01" },
  { id: "2", pair: "ETH/USDT", type: "long", entry: 1800, current: 2100, size: 2.5, pnl: 750, pnlPercent: 16.7, status: "open", date: "2024-11-15" },
  { id: "3", pair: "SOL/USDT", type: "long", entry: 60, current: 87, size: 45, pnl: 1215, pnlPercent: 45.0, status: "open", date: "2024-10-20" },
  { id: "4", pair: "BTC/USDT", type: "short", entry: 70000, current: 84000, size: 0.05, pnl: -700, pnlPercent: -20.0, status: "closed", date: "2024-10-15" },
  { id: "5", pair: "SOL/USDT", type: "short", entry: 120, current: 95, size: 10, pnl: 250, pnlPercent: 20.8, status: "closed", date: "2024-11-01" },
  { id: "6", pair: "ETH/USDT", type: "short", entry: 2400, current: 2100, size: 1.0, pnl: 300, pnlPercent: 12.5, status: "closed", date: "2024-09-10" },
  { id: "7", pair: "BTC/USDT", type: "long", entry: 42000, current: 62000, size: 0.08, pnl: 1600, pnlPercent: 47.6, status: "closed", date: "2024-08-01" },
  { id: "8", pair: "SOL/USDT", type: "long", entry: 30, current: 60, size: 100, pnl: 3000, pnlPercent: 100.0, status: "closed", date: "2024-07-15" },
];

export default function TradesPage() {
  const { isConnected, address } = useAccount();

  if (isConnected && address) return <WalletTrades address={address} />;
  return <MockTrades />;
}

function MockTrades() {
  const [filter, setFilter] = useState<"all" | "open" | "closed">("all");
  const filtered = MOCK_TRADES.filter((t) => filter === "all" || t.status === filter);
  const openPnl = MOCK_TRADES.filter((t) => t.status === "open").reduce((s, t) => s + t.pnl, 0);
  const totalPnl = MOCK_TRADES.reduce((s, t) => s + t.pnl, 0);
  const winRate = Math.round((MOCK_TRADES.filter((t) => t.pnl > 0).length / MOCK_TRADES.length) * 100);
  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
    <div style={{ minHeight: "100vh" }}>
      <div style={{ padding: "10px 20px", borderBottom: "1px solid #1f1f1f", background: "rgba(255,255,255,0.01)" }}>
        <p style={{ fontSize: "11px", color: "#808080" }}>Connect your wallet to see real transaction history. Showing demo trades.</p>
      </div>
      <StatsRow items={[
        { label: "Open PnL", value: `${openPnl >= 0 ? "+" : ""}$${fmt(openPnl)}`, green: openPnl >= 0 },
        { label: "Total PnL", value: `${totalPnl >= 0 ? "+" : ""}$${fmt(totalPnl)}`, green: totalPnl >= 0 },
        { label: "Win Rate", value: `${winRate}%`, green: winRate >= 50 },
        { label: "Total Trades", value: `${MOCK_TRADES.length}`, green: false },
      ]} />
      <FilterRow filter={filter} setFilter={setFilter} trades={MOCK_TRADES} />
      <TradeTable trades={filtered} />
    </div>
  );
}

function WalletTrades({ address }: { address: string }) {
  const [txs, setTxs] = useState<OnChainTx[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/wallet?address=${address}`)
      .then((r) => r.json())
      .then((d) => { setTxs(d.transactions ?? []); setLoading(false); });
  }, [address]);

  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
    <div style={{ minHeight: "100vh" }}>
      <div style={{ padding: "10px 20px", borderBottom: "1px solid #1f1f1f", display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#0ecb81", display: "inline-block" }} />
        <span style={{ fontSize: "11px", color: "#808080", fontFamily: "monospace" }}>{address.slice(0, 10)}...{address.slice(-6)}</span>
      </div>

      <StatsRow items={[
        { label: "Transactions", value: `${txs.length}`, green: false },
        { label: "Incoming", value: `${txs.filter((t) => t.type === "in").length}`, green: true },
        { label: "Outgoing", value: `${txs.filter((t) => t.type === "out").length}`, green: false },
        { label: "Status", value: "Live", green: true },
      ]} />

      {loading ? (
        <div style={{ padding: "20px" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: "44px", marginBottom: "2px" }} />
          ))}
        </div>
      ) : (
        <div className="table-scroll">
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1f1f1f" }}>
                {["Hash", "Token", "Amount", "Type", "Date"].map((h) => (
                  <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: "11px", color: "#404040", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {txs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "40px 20px", textAlign: "center", fontSize: "13px", color: "#404040" }}>
                    No token transactions found for this wallet
                  </td>
                </tr>
              ) : txs.map((tx, i) => (
                <motion.tr key={tx.hash} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  style={{ borderBottom: "1px solid #1f1f1f" }}>
                  <td style={{ padding: "12px 20px" }}>
                    <a href={`https://etherscan.io/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: "12px", color: "#3b82f6", fontFamily: "monospace", textDecoration: "none" }}>
                      {tx.hash.slice(0, 16)}...
                    </a>
                  </td>
                  <td style={{ padding: "12px 20px" }}>
                    <span className="tag-neutral">{tx.token}</span>
                  </td>
                  <td style={{ padding: "12px 20px", fontSize: "13px", fontFamily: "monospace", color: tx.type === "in" ? "#0ecb81" : "#f6465d" }}>
                    {tx.type === "in" ? "+" : "-"}{tx.value}
                  </td>
                  <td style={{ padding: "12px 20px" }}>
                    <span className={tx.type === "in" ? "tag-green" : "tag-red"}>
                      {tx.type === "in" ? "▲ IN" : "▼ OUT"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 20px", fontSize: "12px", color: "#404040" }}>
                    {new Date(tx.timestamp).toLocaleDateString("de-DE")}
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

function StatsRow({ items }: { items: { label: string; value: string; green: boolean }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, borderBottom: "1px solid #1f1f1f" }}>
      {items.map((s, i) => (
        <motion.div key={s.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
          style={{ padding: "20px", borderRight: i < items.length - 1 ? "1px solid #1f1f1f" : "none" }}>
          <p style={{ fontSize: "11px", color: "#404040", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>{s.label}</p>
          <p style={{ fontSize: "22px", fontWeight: 600, color: s.green ? "#0ecb81" : "#fff", fontFamily: "monospace", fontVariantNumeric: "tabular-nums" }}>{s.value}</p>
        </motion.div>
      ))}
    </div>
  );
}

function FilterRow({ filter, setFilter, trades }: { filter: string; setFilter: (f: any) => void; trades: Trade[] }) {
  return (
    <div style={{ padding: "12px 20px", borderBottom: "1px solid #1f1f1f", display: "flex", gap: "4px" }}>
      {(["all", "open", "closed"] as const).map((f) => (
        <button key={f} onClick={() => setFilter(f)} style={{
          padding: "4px 12px", borderRadius: "4px", border: "1px solid",
          fontSize: "12px", cursor: "pointer", transition: "all 0.1s", fontWeight: 500,
          background: filter === f ? "rgba(14,203,129,0.08)" : "transparent",
          borderColor: filter === f ? "rgba(14,203,129,0.3)" : "#1f1f1f",
          color: filter === f ? "#0ecb81" : "#808080",
        }}>
          {f.charAt(0).toUpperCase() + f.slice(1)} ({f === "all" ? trades.length : trades.filter((t) => t.status === f).length})
        </button>
      ))}
    </div>
  );
}

function TradeTable({ trades }: { trades: Trade[] }) {
  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return (
    <div className="table-scroll">
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #1f1f1f" }}>
            {["Pair", "Type", "Entry", "Current", "Size", "PnL", "Status", "Date"].map((h) => (
              <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: "11px", color: "#404040", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 400 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {trades.map((t, i) => (
            <motion.tr key={t.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              style={{ borderBottom: "1px solid #1f1f1f" }}>
              <td style={{ padding: "14px 20px", fontSize: "13px", fontWeight: 600, color: "#fff" }}>{t.pair}</td>
              <td style={{ padding: "14px 20px" }}>
                <span className={t.type === "long" ? "tag-green" : "tag-red"}>{t.type === "long" ? "▲ LONG" : "▼ SHORT"}</span>
              </td>
              <td style={{ padding: "14px 20px", fontSize: "13px", color: "#808080", fontFamily: "monospace" }}>${fmt(t.entry)}</td>
              <td style={{ padding: "14px 20px", fontSize: "13px", color: "#fff", fontFamily: "monospace" }}>${fmt(t.current)}</td>
              <td style={{ padding: "14px 20px", fontSize: "13px", color: "#808080", fontFamily: "monospace" }}>{t.size}</td>
              <td style={{ padding: "14px 20px" }}>
                <span style={{ fontSize: "13px", fontWeight: 500, color: t.pnl >= 0 ? "#0ecb81" : "#f6465d", fontFamily: "monospace" }}>
                  {t.pnl >= 0 ? "+" : ""}${fmt(t.pnl)} ({t.pnlPercent.toFixed(1)}%)
                </span>
              </td>
              <td style={{ padding: "14px 20px" }}>
                <span className={t.status === "open" ? "tag-green" : "tag-neutral"}>
                  {t.status === "open" ? "● Open" : "Closed"}
                </span>
              </td>
              <td style={{ padding: "14px 20px", fontSize: "12px", color: "#404040" }}>{t.date}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
