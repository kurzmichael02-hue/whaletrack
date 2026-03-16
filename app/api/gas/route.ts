import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    `https://api.etherscan.io/v2/api?chainid=1&module=gastracker&action=gasoracle&apikey=${process.env.ETHERSCAN_API_KEY}`,
    { next: { revalidate: 30 } }
  );
  const data = await res.json();
  return NextResponse.json(data.result ?? null);
}