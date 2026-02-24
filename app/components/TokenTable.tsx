const tokens = [
  { name: "Bitcoin (BTC)", price: "$67,200.00", change: "+2.4%", positive: true },
  { name: "Ethereum (ETH)", price: "$3,480.00", change: "-1.1%", positive: false },
  { name: "Solana (SOL)", price: "$172.00", change: "+5.2%", positive: true },
];

export default function TokenTable() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <h3 className="text-md font-semibold mb-4 text-white">Token Prices</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-400 border-b border-gray-800">
            <th className="text-left py-2">Token</th>
            <th className="text-left py-2">Price</th>
            <th className="text-left py-2">24h Change</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr key={token.name} className="border-b border-gray-800">
              <td className="py-3 text-white">{token.name}</td>
              <td className="text-white">{token.price}</td>
              <td className={token.positive ? "text-green-400" : "text-red-400"}>{token.change}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}