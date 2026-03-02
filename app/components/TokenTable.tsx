"use client";

import { useEffect, useState, useRef } from "react";

type Token = {
  symbol: string;
  price: number;
};

export default function TokenTable() {
  const [tokens, setTokens] = useState<Token[]>([
    { symbol: "BTC", price: 0 },
    { symbol: "ETH", price: 0 },
    { symbol: "SOL", price: 0 },
  ]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Keep-alive: ping backend every 5 minutes
    const keepAlive = setInterval(() => {
      fetch("https://whaletrack-backend.onrender.com/prices").catch(() => {});
    }, 5 * 60 * 1000);

    function connect() {
      const ws = new WebSocket("wss://whaletrack-backend.onrender.com");
      wsRef.current = ws;

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === "prices") {
          setTokens(msg.data);
        }
      };

      ws.onclose = () => {
        // Reconnect after 3 seconds
        setTimeout(connect, 3000);
      };
    }

    connect();

    return () => {
      clearInterval(keepAlive);
      wsRef.current?.close();
    };
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