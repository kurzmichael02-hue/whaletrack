"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [refreshInterval, setRefreshInterval] = useState("15");

  return (
    <div style={{ padding: "32px", maxWidth: "720px", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h2 style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.03em" }}>Settings</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>Manage your preferences</p>
      </div>

      {[
        {
          title: "General",
          items: [
            {
              label: "Currency",
              description: "Display currency for portfolio values",
              control: (
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", padding: "6px 12px", borderRadius: "8px", fontSize: "13px", cursor: "pointer" }}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              ),
            },
            {
              label: "Price refresh interval",
              description: "How often prices update",
              control: (
                <select value={refreshInterval} onChange={(e) => setRefreshInterval(e.target.value)} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", padding: "6px 12px", borderRadius: "8px", fontSize: "13px", cursor: "pointer" }}>
                  <option value="5">5 seconds</option>
                  <option value="15">15 seconds</option>
                  <option value="30">30 seconds</option>
                  <option value="60">60 seconds</option>
                </select>
              ),
            },
          ],
        },
        {
          title: "Notifications",
          items: [
            {
              label: "Push notifications",
              description: "Receive alerts in your browser",
              control: <Toggle value={notifications} onChange={setNotifications} />,
            },
            {
              label: "Price alerts",
              description: "Get notified when tokens hit target price",
              control: <Toggle value={priceAlerts} onChange={setPriceAlerts} />,
            },
          ],
        },
        {
          title: "Account",
          items: [
            {
              label: "Connected wallet",
              description: "Manage your wallet connection",
              control: (
                <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>Use Connect Wallet button</span>
              ),
            },
          ],
        },
      ].map((section, si) => (
        <motion.div
          key={section.title}
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: si * 0.08, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          style={{ padding: 0, overflow: "hidden" }}
        >
          <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)" }}>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{section.title}</p>
          </div>
          {section.items.map((item, ii) => (
            <div key={item.label} style={{ padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: ii < section.items.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>{item.label}</p>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>{item.description}</p>
              </div>
              {item.control}
            </div>
          ))}
        </motion.div>
      ))}

      <div style={{ padding: "16px 0", borderTop: "1px solid var(--border)" }}>
        <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>WhaleTrack v1.0.0 · Built by Michael</p>
      </div>
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: "44px", height: "24px", borderRadius: "12px", border: "none", cursor: "pointer",
        background: value ? "var(--accent)" : "var(--border-hover)",
        position: "relative", transition: "background 0.2s ease", flexShrink: 0,
      }}
    >
      <span style={{
        position: "absolute", top: "3px",
        left: value ? "23px" : "3px",
        width: "18px", height: "18px", borderRadius: "50%",
        background: value ? "#080b14" : "var(--text-secondary)",
        transition: "left 0.2s ease",
      }} />
    </button>
  );
}
