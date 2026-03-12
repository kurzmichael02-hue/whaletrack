import { NextResponse } from "next/server";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const WHALE_WALLETS = [
  { name: "Binance Hot Wallet", address: "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8" },
  { name: "Vitalik Buterin", address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" },
  { name: "Justin Sun", address: "0x3DdfA8eC3052539b6C9549F12cEA2C295cfF5296" },
];

async function fetchWhaleTransactions(address: string) {
  const url = `https://api.etherscan.io/v2/api?chainid=1&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=20&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  const data = await res.json() as {
    result: Array<{
      hash: string;
      from: string;
      to: string;
      value: string;
      timeStamp: string;
    }>;
  };
  if (!Array.isArray(data.result)) return [];
  return data.result
    .filter((tx) => parseFloat(tx.value) > 0)
    .slice(0, 5)
    .map((tx) => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: (parseFloat(tx.value) / 1e18).toFixed(4),
      timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
    }));
}

export async function GET() {
  const whales = await Promise.all(
    WHALE_WALLETS.map(async (wallet) => ({
      name: wallet.name,
      address: wallet.address,
      transactions: await fetchWhaleTransactions(wallet.address),
    }))
  );
  return NextResponse.json(whales);
}