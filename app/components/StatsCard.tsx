"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Props = {
  label: string;
  value: string;
  positive?: boolean;
  index?: number;
};

export default function StatsCard({ label, value, positive, index = 0 }: Props) {
  return (
    <motion.div
      className="card-glow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}
      style={{ padding: "20px 24px", background: "var(--bg-card)", cursor: "default" }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      <div style={{
        position: "absolute", top: 0, right: 0, width: "100px", height: "100px",
        background: positive
          ? "radial-gradient(circle, rgba(0,255,135,0.07) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)",
        pointerEvents: "none",
        borderRadius: "16px",
      }} />
      <p style={{ color: "var(--text-secondary)", fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
        {label}
      </p>
      <p style={{
        fontSize: "28px", fontWeight: 700, letterSpacing: "-0.03em",
        fontFamily: "var(--font-display), sans-serif",
        color: positive ? "var(--accent)" : "var(--text-primary)",
      }}>
        {value}
      </p>
    </motion.div>
  );
}