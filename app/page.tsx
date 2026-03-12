import StatsCard from "./components/StatsCard";
import TokenTable from "./components/TokenTable";

export default function Home() {
  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        <StatsCard label="Total Value" value="$12,430.00" />
        <StatsCard label="PnL Today" value="+$340.20" positive />
        <StatsCard label="Open Positions" value="4" />
      </div>
      <TokenTable />
    </div>
  );
}
