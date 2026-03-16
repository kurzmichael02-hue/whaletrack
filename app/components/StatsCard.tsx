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
      transition={{ delay: index * 0.06 }}
      style={{
        padding: "20px",
        borderRight: index < 2 ? "1px solid #1f1f1f" : "none",
      }}
    >
      <p style={{ fontSize: "11px", color: "#404040", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
        {label}
      </p>
      <p style={{
        fontSize: "24px", fontWeight: 600, letterSpacing: "-0.02em",
        color: positive ? "#0ecb81" : "#ffffff",
        fontFamily: "monospace", fontVariantNumeric: "tabular-nums",
      }}>
        {value}
      </p>
    </motion.div>
  );
}