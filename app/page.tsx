import LiveStats from "./components/LiveStats";
import TokenTable from "./components/TokenTable";
import PriceChart from "./components/PriceChart";
import FearGreed from "./components/FearGreed";
import MarketStats from "./components/MarketStats";
import Trending from "./components/Trending";

export default function Home() {
  return (
    <div>
      <LiveStats />
      <MarketStats />
      <FearGreed />
      <Trending />
      <div style={{ height: "1px", background: "#1f1f1f" }} />
      <div style={{ padding: "0" }}>
        <PriceChart />
      </div>
      <div style={{ height: "1px", background: "#1f1f1f" }} />
      <TokenTable />
    </div>
  );
}