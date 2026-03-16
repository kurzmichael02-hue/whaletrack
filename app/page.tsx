import StatsCard from "./components/StatsCard";
import TokenTable from "./components/TokenTable";
import PriceChart from "./components/PriceChart";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderBottom: "1px solid var(--border)" }}>
        <StatsCard label="Total Value" value="$12,430.00" index={0} />
        <StatsCard label="PnL Today" value="+$340.20" positive index={1} />
        <StatsCard label="Open Positions" value="4" index={2} />
      </div>
      <div style={{ padding: "0" }}>
        <PriceChart />
        <TokenTable />
      </div>
    </div>
  );
}