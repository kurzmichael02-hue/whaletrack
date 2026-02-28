"use client";

import { useEffect, useState } from "react";

type Transaction = {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: string;
};

type Whale = {
  name: string;
  address: string;
  transactions: Transaction[];
};

export default function WhalesPage() {
  const [whales, setWhales] = useState<Whale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://whaletrack-backend.onrender.com/whales")
      .then((res) => res.json())
      .then((data) => {
        setWhales(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-white p-8">Loading whale data...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">🐋 Whale Wallets</h2>
      {whales.map((whale) => (
        <div key={whale.address} className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
          <h3 className="text-lg font-semibold text-green-400 mb-1">{whale.name}</h3>
          <p className="text-gray-500 text-xs mb-4">{whale.address}</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800">
                <th className="text-left py-2">Hash</th>
                <th className="text-left py-2">Value (ETH)</th>
                <th className="text-left py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {whale.transactions.map((tx) => (
                <tr key={tx.hash} className="border-b border-gray-800">
                  <td className="py-2 text-blue-400 font-mono text-xs">
                    {tx.hash.slice(0, 12)}...
                  </td>
                  <td className="text-green-400">{tx.value} ETH</td>
                  <td className="text-gray-400 text-xs">
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}