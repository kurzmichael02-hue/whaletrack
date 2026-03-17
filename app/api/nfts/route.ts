import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  if (!address) return NextResponse.json([]);

  try {
    const res = await fetch(
      `https://api.opensea.io/api/v2/chain/ethereum/account/${address}/nfts?limit=20`,
      {
        headers: { "X-API-KEY": "" },
        next: { revalidate: 300 },
      }
    );
    const data = await res.json();
    return NextResponse.json(data.nfts ?? []);
  } catch {
    return NextResponse.json([]);
  }
}