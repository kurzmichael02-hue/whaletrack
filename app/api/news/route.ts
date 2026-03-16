import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    "https://cryptopanic.com/api/free/v1/posts/?auth_token=free&public=true&kind=news",
    { next: { revalidate: 300 } }
  );
  const data = await res.json();
  return NextResponse.json(data.results ?? []);
}