"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingGate({ children }: { children: React.ReactNode }) {
  const [showLanding, setShowLanding] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("whaletrack_seen");
    if (!seen) setShowLanding(true);
  }, []);

  function enter() {
    localStorage.setItem("whaletrack_seen", "1");
    setShowLanding(false);
  }

  return (
    <>
      <AnimatePresence>
        {showLanding && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "fixed", inset: 0, background: "#080808",
              zIndex: 200, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: "24px",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{ textAlign: "center" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "24px" }}>
                <svg width="32" height="32" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="9" stroke="#0ecb81" strokeWidth="1.5" />
                  <path d="M5 10 Q10 4 15 10 Q10 16 5 10Z" fill="#0ecb81" fillOpacity="0.3" stroke="#0ecb81" strokeWidth="1" />
                  <circle cx="10" cy="10" r="2" fill="#0ecb81" />
                </svg>
                <span style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "0.08em", color: "#fff" }}>WHALETRACK</span>
              </div>
              <p style={{ fontSize: "16px", color: "#505050", maxWidth: "400px", lineHeight: 1.6, marginBottom: "8px" }}>
                Track what the biggest players in crypto are doing in real-time.
              </p>
              <p style={{ fontSize: "13px", color: "#333", marginBottom: "40px" }}>
                Live prices · Whale tracking · On-chain data · Portfolio tracker
              </p>
              <motion.button
                onClick={enter}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: "12px 40px", borderRadius: "6px", cursor: "pointer",
                  fontSize: "14px", fontWeight: 600, border: "none",
                  background: "#0ecb81", color: "#080808",
                  boxShadow: "0 0 30px rgba(14,203,129,0.2)",
                }}
              >
                Enter Dashboard →
              </motion.button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{ display: "flex", gap: "32px", marginTop: "16px" }}
            >
              {["15 Live Tokens", "Whale Tracker", "Portfolio", "Price Alerts"].map((f) => (
                <span key={f} style={{ fontSize: "11px", color: "#222" }}>{f}</span>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}