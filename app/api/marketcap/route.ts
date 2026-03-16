import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/global",
    { next: { revalidate: 300 } }
  );
  const data = await res.json();
  return NextResponse.json(data.data ?? null);
}