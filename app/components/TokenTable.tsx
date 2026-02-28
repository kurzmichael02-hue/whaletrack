"use client";

import { useEffect, useState } from "react";

type Token = {
  symbol: string;
  price: number;
};

export default function TokenTable() {
  const [tokens, setTokens] = useState<Token[]>([
    { symbol: "BTC", price: 67200 },
    { symbol: "ETH", price: 3480 },
    { symbol: "SOL", price: 172 },
  ]);

  useEffect(() => {
    const ws = new WebSocket("wss://whaletrack-backend.onrender.com");

    ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.type === "prices") {
    setTokens(msg.data);
  }
};

    return () => ws.close();
  }, []);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <h3 className="text-md font-semibold mb-4 text-white">Token Prices</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-400 border-b border-gray-800">
            <th className="text-left py-2">Token</th>
            <th className="text-left py-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr key={token.symbol} className="border-b border-gray-800">
              <td className="py-3 text-white">{token.symbol}</td>
              <td className="text-green-400">${token.price.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}