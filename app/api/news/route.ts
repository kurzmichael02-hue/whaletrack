import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    `https://newsdata.io/api/1/news?apikey=${process.env.NEWSDATA_API_KEY}&q=crypto&language=en&category=business,technology`,
    { next: { revalidate: 300 } }
  );
  const data = await res.json();
  return NextResponse.json(data.results ?? []);
}