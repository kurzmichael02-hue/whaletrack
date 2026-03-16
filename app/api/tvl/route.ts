import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    "https://api.llama.fi/v2/chains",
    { next: { revalidate: 300 } }
  );
  const data = await res.json();
  const top = data
    .sort((a: any, b: any) => b.tvl - a.tvl)
    .slice(0, 6)
    .map((c: any) => ({ name: c.name, tvl: c.tvl, change: c.change_1d }));
  return NextResponse.json(top);
}