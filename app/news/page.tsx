"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type NewsItem = {
  article_id: string;
  title: string;
  link: string;
  source_name: string;
  pubDate: string;
  description?: string;
  image_url?: string;
  keywords?: string[];
};

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "bitcoin" | "ethereum" | "solana">("all");

  useEffect(() => {
    fetch("/api/news").then((r) => r.json()).then((d) => { setNews(d); setLoading(false); });
  }, []);

  const filtered = filter === "all" ? news : news.filter((n) =>
    n.title?.toLowerCase().includes(filter) || n.description?.toLowerCase().includes(filter)
  );

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <div style={{ padding: "12px 20px", borderBottom: "1px solid #1f1f1f", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: "4px" }}>
          {(["all", "bitcoin", "ethereum", "solana"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "4px 12px", borderRadius: "4px", border: "1px solid",
              fontSize: "12px", cursor: "pointer", fontWeight: 500, transition: "all 0.1s",
              background: filter === f ? "rgba(14,203,129,0.08)" : "transparent",
              borderColor: filter === f ? "rgba(14,203,129,0.3)" : "#1f1f1f",
              color: filter === f ? "#0ecb81" : "#808080",
            }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#0ecb81", display: "inline-block" }} />
          <span style={{ fontSize: "11px", color: "#404040" }}>Live</span>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "20px" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ padding: "16px 0", borderBottom: "1px solid #1f1f1f" }}>
              <div className="skeleton" style={{ height: "16px", width: "80%", marginBottom: "8px" }} />
              <div className="skeleton" style={{ height: "12px", width: "40%" }} />
            </div>
          ))}
        </div>
      ) : (
        <div>
          {filtered.map((item, i) => (
            <motion.a key={item.article_id} href={item.link} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              style={{
                display: "flex", alignItems: "flex-start", gap: "16px",
                padding: "16px 20px", borderBottom: "1px solid #1f1f1f",
                textDecoration: "none", transition: "background 0.1s",
              }}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" } as any}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "13px", fontWeight: 500, color: "#fff", lineHeight: 1.5, marginBottom: "6px" }}>{item.title}</p>
                {item.description && (
                  <p style={{ fontSize: "12px", color: "#808080", lineHeight: 1.5, marginBottom: "6px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any }}>
                    {item.description}
                  </p>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "11px", color: "#404040" }}>{item.source_name}</span>
                  <span style={{ color: "#1f1f1f" }}>·</span>
                  <span style={{ fontSize: "11px", color: "#404040" }}>{timeAgo(item.pubDate)}</span>
                  {item.keywords?.slice(0, 2).map((k) => (
                    <span key={k} className="tag-neutral" style={{ fontSize: "10px" }}>{k}</span>
                  ))}
                </div>
              </div>
              {item.image_url && (
                <img src={item.image_url} alt="" style={{ width: "72px", height: "52px", objectFit: "cover", borderRadius: "4px", flexShrink: 0, opacity: 0.8 }} />
              )}
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}
