import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    `https://newsdata.io/api/1/news?apikey=${process.env.NEWSDATA_API_KEY}&q=bitcoin+OR+ethereum+OR+crypto&language=en&category=business,technology&prioritydomain=top`,
    { next: { revalidate: 300 } }
  );
  const data = await res.json();

  const results = data.results ?? [];

  // Remove duplicates by title similarity and filter spam
  const seen = new Set<string>();
  const filtered = results.filter((item: any) => {
    const key = item.title?.toLowerCase().slice(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    // Filter out obvious spam/presale articles
    const spamWords = ["pepeto", "presale", "100x", "explode", "best crypto to buy"];
    const titleLower = item.title?.toLowerCase() ?? "";
    if (spamWords.some((w) => titleLower.includes(w))) return false;
    return true;
  }).slice(0, 20);

  return NextResponse.json(filtered);
}