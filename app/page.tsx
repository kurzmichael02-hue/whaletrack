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
      <MarketStats />
      <FearGreed />
      <Trending />
      <PriceChart />
      <TokenTable />
    </div>
  );
}
