import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  if (!address) return NextResponse.json(null);

  try {
    const res = await fetch(
      `https://api.ensideas.com/ens/resolve/${address}`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return NextResponse.json(data.name ?? null);
  } catch {
    return NextResponse.json(null);
  }
}