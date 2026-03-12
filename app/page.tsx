import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import StatsCard from "./components/StatsCard";
import TokenTable from "./components/TokenTable";

export default function Home() {
  return (
    <div className="min-h-screen text-white flex" style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1529 50%, #0a0f1e 100%)" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8 flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-4">
            <StatsCard label="Total Value" value="$12,430.00" />
            <StatsCard label="PnL Today" value="+$340.20" positive />
            <StatsCard label="Open Positions" value="4" />
          </div>
          <TokenTable />
        </main>
      </div>
    </div>
  );
}
