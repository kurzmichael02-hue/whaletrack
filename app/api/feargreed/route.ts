import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://api.alternative.me/fng/?limit=1", {
    next: { revalidate: 3600 },
  });
  const data = await res.json();
  return NextResponse.json(data.data?.[0] ?? null);
}