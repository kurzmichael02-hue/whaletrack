import StatsCard from "./components/StatsCard";
import TokenTable from "./components/TokenTable";
import PriceChart from "./components/PriceChart";
import FearGreed from "./components/FearGreed";
import MarketStats from "./components/MarketStats";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderBottom: "1px solid #1f1f1f" }}>
        <StatsCard label="Total Value" value="$12,430.00" index={0} />
        <StatsCard label="PnL Today" value="+$340.20" positive index={1} />
        <StatsCard label="Open Positions" value="4" index={2} />
      </div>
      <MarketStats />
      <FearGreed />
      <PriceChart />
      <TokenTable />
    </div>
  );
}
