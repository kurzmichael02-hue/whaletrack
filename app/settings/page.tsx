"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";

export default function SettingsPage() {
  const { address, isConnected } = useAccount();
  const [currency, setCurrency] = useState("USD");
  const [refreshInterval, setRefreshInterval] = useState("15");
  const [notifications, setNotifications] = useState(false);
  const [priceAlerts, setPriceAlerts] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load saved settings
  useEffect(() => {
    const s = localStorage.getItem("whaletrack_settings");
    if (s) {
      const parsed = JSON.parse(s);
      setCurrency(parsed.currency ?? "USD");
      setRefreshInterval(parsed.refreshInterval ?? "15");
      setNotifications(parsed.notifications ?? false);
      setPriceAlerts(parsed.priceAlerts ?? false);
    }
  }, []);

  function save() {
    localStorage.setItem("whaletrack_settings", JSON.stringify({
      currency, refreshInterval, notifications, priceAlerts,
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function requestNotifications() {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((perm) => {
        setNotifications(perm === "granted");
      });
    } else {
      setNotifications(!notifications);
    }
  }

  return (
    <div style={{ maxWidth: "640px" }}>
      {/* General */}
      <Section title="General">
        <Row label="Currency" description="Display currency for portfolio values">
          <Select value={currency} onChange={setCurrency} options={[
            { value: "USD", label: "USD — US Dollar" },
            { value: "EUR", label: "EUR — Euro" },
            { value: "GBP", label: "GBP — British Pound" },
          ]} />
        </Row>
        <Row label="Price refresh interval" description="How often market data updates" last>
          <Select value={refreshInterval} onChange={setRefreshInterval} options={[
            { value: "5", label: "5 seconds" },
            { value: "15", label: "15 seconds" },
            { value: "30", label: "30 seconds" },
            { value: "60", label: "60 seconds" },
          ]} />
        </Row>
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        <Row label="Push notifications" description="Browser notifications for price alerts">
          <Toggle value={notifications} onChange={requestNotifications} />
        </Row>
        <Row label="Price alerts" description="Notify when token hits target price" last>
          <Toggle value={priceAlerts} onChange={setPriceAlerts} />
        </Row>
      </Section>

      {/* Wallet */}
      <Section title="Wallet">
        <Row label="Connected wallet" description="Your currently connected wallet" last>
          {isConnected ? (
            <span style={{ fontSize: "12px", color: "#0ecb81", fontFamily: "monospace" }}>
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          ) : (
            <span style={{ fontSize: "12px", color: "#404040" }}>Not connected</span>
          )}
        </Row>
      </Section>

      {/* About */}
      <Section title="About">
        <Row label="Version" description="Current app version">
          <span style={{ fontSize: "12px", color: "#404040", fontFamily: "monospace" }}>v1.0.0</span>
        </Row>
        <Row label="Built by" description="Developer" last>
          <span style={{ fontSize: "12px", color: "#808080" }}>Michael</span>
        </Row>
      </Section>

      {/* Save button */}
      <div style={{ padding: "20px", borderTop: "1px solid #1f1f1f" }}>
        <button onClick={save} style={{
          padding: "8px 24px", borderRadius: "4px", cursor: "pointer",
          fontSize: "13px", fontWeight: 500, transition: "all 0.1s",
          background: saved ? "rgba(14,203,129,0.15)" : "rgba(14,203,129,0.1)",
          border: saved ? "1px solid rgba(14,203,129,0.5)" : "1px solid rgba(14,203,129,0.3)",
          color: "#0ecb81",
        }}>
          {saved ? "✓ Saved" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ borderBottom: "1px solid #1f1f1f" }}
    >
      <div style={{ padding: "10px 20px", borderBottom: "1px solid #1f1f1f" }}>
        <span style={{ fontSize: "11px", color: "#404040", textTransform: "uppercase", letterSpacing: "0.08em" }}>{title}</span>
      </div>
      {children}
    </motion.div>
  );
}

function Row({ label, description, children, last }: { label: string; description: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{
      padding: "14px 20px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      borderBottom: last ? "none" : "1px solid #1f1f1f",
    }}>
      <div>
        <p style={{ fontSize: "13px", fontWeight: 500, color: "#fff" }}>{label}</p>
        <p style={{ fontSize: "11px", color: "#404040", marginTop: "2px" }}>{description}</p>
      </div>
      {children}
    </div>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{
      background: "#111", border: "1px solid #1f1f1f", color: "#fff",
      padding: "6px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer",
      outline: "none",
    }}>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} style={{
      width: "40px", height: "22px", borderRadius: "11px", border: "none",
      cursor: "pointer", position: "relative", transition: "background 0.15s",
      background: value ? "#0ecb81" : "#1f1f1f", flexShrink: 0,
    }}>
      <span style={{
        position: "absolute", top: "3px",
        left: value ? "21px" : "3px",
        width: "16px", height: "16px", borderRadius: "50%",
        background: value ? "#0a0a0a" : "#404040",
        transition: "left 0.15s",
      }} />
    </button>
  );
}
