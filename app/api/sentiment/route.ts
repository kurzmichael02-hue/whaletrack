import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") ?? "BTC";

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${symbol.toLowerCase()}?localization=false&tickers=false&market_data=false&community_data=true&developer_data=false`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return NextResponse.json({
      twitter_followers: data.community_data?.twitter_followers ?? 0,
      reddit_subscribers: data.community_data?.reddit_subscribers ?? 0,
      reddit_active_accounts: data.community_data?.reddit_accounts_active_48h ?? 0,
      sentiment_votes_up: data.sentiment_votes_up_percentage ?? 0,
      sentiment_votes_down: data.sentiment_votes_down_percentage ?? 0,
    });
  } catch {
    return NextResponse.json(null);
  }
}