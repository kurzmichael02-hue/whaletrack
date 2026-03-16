import LiveStats from "./components/LiveStats";
import TokenTable from "./components/TokenTable";
import PriceChart from "./components/PriceChart";
import FearGreed from "./components/FearGreed";
import MarketStats from "./components/MarketStats";
import Trending from "./components/Trending";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <LiveStats />

      {/* Bento Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        borderBottom: "1px solid #1a1a1a",
      }}>
        <div style={{ borderRight: "1px solid #1a1a1a" }}>
          <MarketStats />
        </div>
        <div>
          <FearGreed />
        </div>
      </div>

      <Trending />
      <PriceChart />
      <TokenTable />
    </div>
  );
}
