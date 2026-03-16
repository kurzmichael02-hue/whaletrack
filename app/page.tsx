import LiveStats from "./components/LiveStats";
import TokenTable from "./components/TokenTable";
import PriceChart from "./components/PriceChart";
import FearGreed from "./components/FearGreed";
import MarketStats from "./components/MarketStats";
import Trending from "./components/Trending";
import GasAndTVL from "./components/GasAndTVL";
import Heatmap from "./components/Heatmap";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Row 1: Portfolio Stats */}
      <LiveStats />

      {/* Row 2: Market Stats — eigene Zeile */}
      <MarketStats />

      {/* Row 3: Fear & Greed + Gas nebeneinander */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ borderRight: "1px solid #1a1a1a" }}>
          <FearGreed />
        </div>
        <GasAndTVL />
      </div>

      {/* Row 4: Heatmap — eigene Zeile */}
      <Heatmap />

      {/* Row 5: Trending */}
      <Trending />

      {/* Row 6: Chart */}
      <PriceChart />

      {/* Row 7: Token Table */}
      <TokenTable />
    </div>
  );
}