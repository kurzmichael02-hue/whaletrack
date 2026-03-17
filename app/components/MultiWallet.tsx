"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatEther } from "viem";

type WalletEntry = {
  id: string;
  address: string;
  label: string;
  ensName?: string;
  ethBalance?: number;
  totalValue?: number;
};

export default function MultiWallet() {
  const [wallets, setWallets] = useState<WalletEntry[]>([]);
  const [input, setInput] = useState("");
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [ethPrice, setEthPrice] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("whaletrack_wallets");
    if (saved) setWallets(JSON.parse(saved));
    fetch("https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT")
      .then((r) => r.json())
      .then((d) => setEthPrice(parseFloat(d.price)));
  }, []);

  async function addWallet() {
    if (!input || input.length < 10) return;
    const address = input.trim();
    const id = Date.now().toString();
    setLoading(id);

    try {
      const [ensRes, balRes] = await Promise.all([
        fetch(`/api/ens?address=${address}`).then((r) => r.json()),
        fetch(`https://cloudflare-eth.com/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jsonrpc: "2.0", method: "eth_getBalance", params: [address, "latest"], id: 1 }),
        }).then((r) => r.json()),
      ]);

      const ethBalance = parseInt(balRes.result, 16) / 1e18;
      const newWallet: WalletEntry = {
        id,
        address,
        label: label || ensRes || `Wallet ${wallets.length + 1}`,
        ensName: ensRes,
        ethBalance,
        totalValue: ethBalance * ethPrice,
      };

      const updated = [...wallets, newWallet];
      setWallets(updated);
      localStorage.setItem("whaletrack_wallets", JSON.stringify(updated));
      setInput(""); setLabel(""); setShowAdd(false);
    } catch (e) {
      console.error(e);
    }
    setLoading(null);
  }

  function removeWallet(id: string) {
    const updated = wallets.filter((w) => w.id !== id);
    setWallets(updated);
    localStorage.setItem("whaletrack_wallets", JSON.stringify(updated));
    if (selected === id) setSelected(null);
  }

  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  const totalAllWallets = wallets.reduce((s, w) => s + (w.totalValue ?? 0), 0);

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Total across all wallets */}
      {wallets.length > 1 && (
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "11px", color: "#333", textTransform: "uppercase", letterSpacing: "0.08em" }}>Total across all wallets</span>
          <span style={{ fontSize: "20px", fontWeight: 700, color: "#fff", fontFamily: "monospace" }}>${fmt(totalAllWallets)}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ padding: "12px 20px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "11px", color: "#333", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Tracked Wallets ({wallets.length})
        </span>
        <button onClick={() => setShowAdd(!showAdd)} style={{
          padding: "5px 14px", borderRadius: "4px", cursor: "pointer",
          fontSize: "12px", fontWeight: 500,
          background: showAdd ? "rgba(246,70,93,0.08)" : "rgba(14,203,129,0.08)",
          border: showAdd ? "1px solid rgba(246,70,93,0.3)" : "1px solid rgba(14,203,129,0.3)",
          color: showAdd ? "#f6465d" : "#0ecb81",
        }}>
          {showAdd ? "✕ Cancel" : "+ Add Wallet"}
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
                <p style={{ fontSize: "11px", color: "#333", marginBottom: "6px" }}>WALLET ADDRESS</p>
                <input value={input} onChange={(e) => setInput(e.target.value)}
                  placeholder="0x... or ENS name"
                  style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", color: "#fff", padding: "7px 10px", borderRadius: "4px", fontSize: "13px", outline: "none", width: "280px" }} />
              </div>
              <div>
                <p style={{ fontSize: "11px", color: "#333", marginBottom: "6px" }}>LABEL (optional)</p>
                <input value={label} onChange={(e) => setLabel(e.target.value)}
                  placeholder="My main wallet"
                  style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", color: "#fff", padding: "7px 10px", borderRadius: "4px", fontSize: "13px", outline: "none", width: "160px" }} />
              </div>
              <button onClick={addWallet} disabled={loading !== null} style={{
                padding: "8px 20px", borderRadius: "4px", cursor: "pointer",
                fontSize: "13px", fontWeight: 500, height: "36px",
                background: "rgba(14,203,129,0.1)", border: "1px solid rgba(14,203,129,0.3)", color: "#0ecb81",
                opacity: loading ? 0.5 : 1,
              }}>
                {loading ? "Adding..." : "Add"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wallet list */}
      {wallets.length === 0 ? (
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <p style={{ fontSize: "13px", color: "#333", marginBottom: "8px" }}>No wallets tracked</p>
          <p style={{ fontSize: "11px", color: "#222" }}>Add any Ethereum wallet address to track it</p>
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
              {["Label", "Address", "ETH Balance", "Est. Value", ""].map((h) => (
                <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: "11px", color: "#333", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {wallets.map((w, i) => (
                <motion.tr key={w.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                  transition={{ delay: i * 0.04 }}
                  style={{ borderBottom: "1px solid #1a1a1a", cursor: "pointer", background: selected === w.id ? "rgba(14,203,129,0.03)" : "transparent" }}
                  onClick={() => setSelected(selected === w.id ? null : w.id)}
                >
                  <td style={{ padding: "14px 20px" }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>{w.label}</p>
                    {w.ensName && w.ensName !== w.label && (
                      <p style={{ fontSize: "11px", color: "#0ecb81" }}>{w.ensName}</p>
                    )}
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "12px", color: "#333", fontFamily: "monospace" }}>
                    {w.address.slice(0, 10)}...{w.address.slice(-6)}
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#fff", fontFamily: "monospace" }}>
                    {w.ethBalance?.toFixed(4) ?? "—"} ETH
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#0ecb81", fontFamily: "monospace" }}>
                    {w.totalValue ? `$${fmt(w.totalValue)}` : "—"}
                  </td>
                  <td style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <a href={`https://etherscan.io/address/${w.address}`} target="_blank" rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{ fontSize: "11px", color: "#3b82f6", textDecoration: "none" }}>
                      ↗
                    </a>
                    <button onClick={(e) => { e.stopPropagation(); removeWallet(w.id); }} style={{
                      background: "none", border: "none", color: "#222", cursor: "pointer", fontSize: "13px",
                    }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#f6465d")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#222")}
                    >✕</button>
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