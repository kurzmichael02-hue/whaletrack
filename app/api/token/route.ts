import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol")?.toLowerCase();
  if (!symbol) return NextResponse.json(null);

  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${symbol}?localization=false&tickers=false&community_data=false&developer_data=false`,
    { next: { revalidate: 300 } }
  );
  const data = await res.json();
  return NextResponse.json({
    name: data.name,
    symbol: data.symbol,
    price: data.market_data?.current_price?.usd,
    marketCap: data.market_data?.market_cap?.usd,
    volume: data.market_data?.total_volume?.usd,
    ath: data.market_data?.ath?.usd,
    athDate: data.market_data?.ath_date?.usd,
    supply: data.market_data?.circulating_supply,
    totalSupply: data.market_data?.total_supply,
    change24h: data.market_data?.price_change_percentage_24h,
    change7d: data.market_data?.price_change_percentage_7d,
    change30d: data.market_data?.price_change_percentage_30d,
    description: data.description?.en?.split(". ")[0],
    rank: data.market_cap_rank,
  });
}