import StatsCard from "./components/StatsCard";
import TokenTable from "./components/TokenTable";
import PriceChart from "./components/PriceChart";

export default function Home() {
  return (
    <div className="p-8 space-y-8 min-h-screen" style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1529 50%, #0a0f1e 100%)" }}>
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Welcome back. Here's what's moving.</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <StatsCard label="Total Value" value="$12,430.00" />
        <StatsCard label="PnL Today" value="+$340.20" positive />
        <StatsCard label="Open Positions" value="4" />
      </div>
      <PriceChart />
      <TokenTable />
    </div>
  );
}
