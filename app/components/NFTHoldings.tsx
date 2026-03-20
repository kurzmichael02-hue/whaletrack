"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";

type NFT = {
  tokenId: string;
  name: string;
  collection: string;
  imageUrl: string;
  openseaUrl: string;
};

export default function NFTHoldings() {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    setError(false);

    fetch(`/api/nfts?address=${address}`)
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) {
          setNfts(d);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [address]);

  if (!isConnected) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", borderBottom: "1px solid #1a1a1a" }}>
        <p style={{ fontSize: "13px", color: "#333" }}>Connect your wallet to see your NFTs</p>
      </div>
    );
  }

  return (
    <div style={{ borderBottom: "1px solid #1a1a1a" }}>
      <div style={{ padding: "10px 20px", borderBottom: "1px solid #1a1a1a" }}>
        <span style={{ fontSize: "11px", color: "#333", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          NFT Holdings {nfts.length > 0 ? `(${nfts.length})` : ""}
        </span>
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "1px", background: "#1a1a1a", padding: "1px" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: "160px" }} />
          ))}
        </div>
      ) : error ? (
        <div style={{ padding: "30px 20px", textAlign: "center" }}>
          <p style={{ fontSize: "12px", color: "#333", marginBottom: "6px" }}>Unable to load NFT data</p>
          <a href={`https://opensea.io/${address}`} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: "12px", color: "#3b82f6", textDecoration: "none" }}>
            View on OpenSea ↗
          </a>
        </div>
      ) : nfts.length === 0 ? (
        <div style={{ padding: "30px 20px", textAlign: "center" }}>
          <p style={{ fontSize: "12px", color: "#333", marginBottom: "6px" }}>No NFTs found for this wallet</p>
          <a href={`https://opensea.io/${address}`} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: "12px", color: "#3b82f6", textDecoration: "none" }}>
            View on OpenSea ↗
          </a>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "1px", background: "#1a1a1a" }}>
          {nfts.map((nft, i) => (
            <motion.a
              key={`${nft.collection}-${nft.tokenId}`}
              href={nft.openseaUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              style={{ display: "block", background: "#0a0a0a", textDecoration: "none", padding: "12px" }}
              whileHover={{ background: "#111" } as any}
            >
              {nft.imageUrl ? (
                <img src={nft.imageUrl} alt={nft.name} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: "4px", marginBottom: "8px" }} />
              ) : (
                <div style={{ width: "100%", aspectRatio: "1", background: "#1a1a1a", borderRadius: "4px", marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "24px", color: "#333" }}>◈</span>
                </div>
              )}
              <p style={{ fontSize: "11px", fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{nft.name || `#${nft.tokenId}`}</p>
              <p style={{ fontSize: "10px", color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{nft.collection}</p>
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}