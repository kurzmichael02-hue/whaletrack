"use client";

import { useEffect, useState } from "react";

type NewsItem = {
  id: number;
  title: string;
  url: string;
  source: { title: string };
  published_at: string;
  currencies?: { code: string }[];
  votes: { positive: number; negative: number };
};

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "BTC" | "ETH" | "SOL">("all");

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => { setNews(data); setLoading(false); });
  }, []);

  const filtered = filter === "all"
    ? news
    : news.filter((n) => n.currencies?.some((c) => c.code === filter));

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="p-8 space-y-6 min-h-screen" style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1529 50%, #0a0f1e 100%)" }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">News</h2>
          <p className="text-gray-500 text-sm mt-1">Latest crypto news from CryptoPanic</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
          Live Feed
        </div>
      </div>

      <div className="flex gap-2">
        {(["all", "BTC", "ETH", "SOL"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize" style={{ background: filter === f ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.03)", border: filter === f ? "1px solid rgba(16,185,129,0.25)" : "1px solid rgba(255,255,255,0.07)", color: filter === f ? "#10b981" : "#6b7280" }}>
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-gray-500 py-20 justify-center">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
          Loading news...
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((item) => (
            <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer"
              className="block rounded-2xl p-5 transition-all hover:bg-white/5"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium leading-snug">{item.title}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-gray-500 text-xs">{item.source.title}</span>
                    <span className="text-gray-700 text-xs">·</span>
                    <span className="text-gray-500 text-xs">{timeAgo(item.published_at)}</span>
                    {item.currencies && item.currencies.length > 0 && (
                      <>
                        <span className="text-gray-700 text-xs">·</span>
                        <div className="flex gap-1">
                          {item.currencies.slice(0, 3).map((c) => (
                            <span key={c.code} className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ background: "rgba(255,255,255,0.06)", color: "#9ca3af" }}>
                              {c.code}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {item.votes.positive > 0 && (
                    <span className="text-xs text-green-400">▲ {item.votes.positive}</span>
                  )}
                  {item.votes.negative > 0 && (
                    <span className="text-xs text-red-400">▼ {item.votes.negative}</span>
                  )}
                  <span className="text-gray-700 text-lg">→</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}