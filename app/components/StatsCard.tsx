type Props = {
  label: string;
  value: string;
  positive?: boolean;
  sub?: string;
};

export default function StatsCard({ label, value, positive, sub }: Props) {
  return (
    <div className="card" style={{ padding: "20px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: "80px", height: "80px",
        background: positive ? "radial-gradient(circle, rgba(0,255,135,0.06) 0%, transparent 70%)" : "radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <p style={{ color: "var(--text-secondary)", fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>{label}</p>
      <p style={{ fontSize: "26px", fontWeight: 700, letterSpacing: "-0.03em", color: positive ? "var(--accent)" : "var(--text-primary)" }}>{value}</p>
      {sub && <p style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "4px" }}>{sub}</p>}
    </div>
  );
}
