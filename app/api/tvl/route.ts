import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    "https://api.llama.fi/v2/chains",
    { next: { revalidate: 300 } }
  );
  const data = await res.json();
  const top = data
    .filter((c: any) => c.tvl > 0)
    .sort((a: any, b: any) => b.tvl - a.tvl)
    .slice(0, 6)
    .map((c: any) => ({
      name: c.name,
      tvl: c.tvl,
      change: typeof c.change_1d === "number" && !isNaN(c.change_1d) ? c.change_1d : null,
    }));
  return NextResponse.json(top);
}