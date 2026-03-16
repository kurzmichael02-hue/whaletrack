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
      <LiveStats />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ borderRight: "1px solid #1a1a1a" }}>
          <MarketStats />
        </div>
        <div>
          <FearGreed />
        </div>
      </div>
      <GasAndTVL />
      <Heatmap />
      <Trending />
      <PriceChart />
      <TokenTable />
    </div>
  );
}
