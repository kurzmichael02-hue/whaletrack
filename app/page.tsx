import StatsCard from "./components/StatsCard";
import TokenTable from "./components/TokenTable";
import PriceChart from "./components/PriceChart";

export default function Home() {
  return (
    <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px", minHeight: "100vh" }}>
      <div>
        <h2 style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
          Dashboard
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
          Welcome back. Here's what's moving.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        <StatsCard label="Total Value" value="$12,430.00" index={0} />
        <StatsCard label="PnL Today" value="+$340.20" positive index={1} />
        <StatsCard label="Open Positions" value="4" index={2} />
      </div>
      <PriceChart />
      <TokenTable />
    </div>
  );
}
