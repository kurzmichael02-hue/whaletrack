"use client";

type Holding = {
  symbol: string;
  amount: number;
  buyPrice: number;
  buyDate: string;
  currentPrice?: number;
  value?: number;
  pnl?: number;
  pnlPercent?: number;
};

export default function ExportCSV({ holdings }: { holdings: Holding[] }) {
  function exportCSV() {
    const headers = ["Symbol", "Amount", "Buy Price", "Current Price", "Value", "PnL", "PnL %", "Buy Date"];
    const rows = holdings.map((h) => [
      h.symbol, h.amount, h.buyPrice,
      h.currentPrice ?? 0, h.value ?? 0,
      h.pnl ?? 0, h.pnlPercent?.toFixed(2) ?? 0, h.buyDate,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `whaletrack-portfolio-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (holdings.length === 0) return null;

  return (
    <button onClick={exportCSV} style={{
      padding: "5px 14px", borderRadius: "4px", cursor: "pointer",
      fontSize: "12px", fontWeight: 500,
      background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.25)",
      color: "#3b82f6",
    }}>
      ↓ Export CSV
    </button>
  );
}