"use client";

import { motion } from "framer-motion";

type Props = {
  label: string;
  value: string;
  positive?: boolean;
  index?: number;
};

export default function StatsCard({ label, value, positive, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      style={{
        padding: "20px",
        borderRight: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <p style={{ fontSize: "11px", color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
        {label}
      </p>
      <p style={{
        fontSize: "24px",
        fontWeight: 600,
        letterSpacing: "-0.02em",
        color: positive ? "var(--green)" : "var(--text-1)",
        fontFamily: '"JetBrains Mono", monospace',
        fontVariantNumeric: "tabular-nums",
      }}>
        {value}
      </p>
    </motion.div>
  );
}