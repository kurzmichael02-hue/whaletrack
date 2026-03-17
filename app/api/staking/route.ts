import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum,solana,cardano,polkadot,cosmos&order=market_cap_desc&sparkline=false",
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();

    const stakingRates: Record<string, number> = {
      ethereum: 3.8,
      solana: 6.5,
      cardano: 3.2,
      polkadot: 14.0,
      cosmos: 19.0,
    };

    return NextResponse.json(data.map((c: any) => ({
      id: c.id,
      symbol: c.symbol.toUpperCase(),
      name: c.name,
      price: c.current_price,
      apy: stakingRates[c.id] ?? 0,
      image: c.image,
    })));
  } catch {
    return NextResponse.json([]);
  }
}