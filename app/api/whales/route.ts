import { NextResponse } from "next/server";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const WHALE_WALLETS = [
  { name: "Binance Hot Wallet", address: "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8" },
  { name: "Vitalik Buterin", address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" },
  { name: "Cumberland (Market Maker)", address: "0x756C4628E57F7e7f8a459EC2752968360Cf4D1AA" },
];

async function fetchETHTransactions(address: string) {
  const url = `https://api.etherscan.io/v2/api?chainid=1&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  const data = await res.json() as {
    result: Array<{ hash: string; from: string; to: string; value: string; timeStamp: string }>;
  };
  if (!Array.isArray(data.result)) return [];
  return data.result
    .filter((tx) => parseFloat(tx.value) / 1e18 >= 0.01)
    .slice(0, 5)
    .map((tx) => ({
      hash: tx.hash,
      type: "ETH",
      token: "ETH",
      value: (parseFloat(tx.value) / 1e18).toFixed(4),
      valueUSD: null,
      timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
    }));
}

async function fetchTokenTransactions(address: string) {
  const url = `https://api.etherscan.io/v2/api?chainid=1&module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  const data = await res.json() as {
    result: Array<{
      hash: string;
      from: string;
      to: string;
      value: string;
      tokenSymbol: string;
      tokenDecimal: string;
      timeStamp: string;
    }>;
  };
  if (!Array.isArray(data.result)) return [];
  return data.result
    .filter((tx) => {
      const decimals = parseInt(tx.tokenDecimal);
      const amount = parseFloat(tx.value) / Math.pow(10, decimals);
      return ["USDT", "USDC", "WETH", "WBTC", "DAI"].includes(tx.tokenSymbol) && amount >= 1000;
    })
    .slice(0, 5)
    .map((tx) => {
      const decimals = parseInt(tx.tokenDecimal);
      const amount = parseFloat(tx.value) / Math.pow(10, decimals);
      return {
        hash: tx.hash,
        type: "TOKEN",
        token: tx.tokenSymbol,
        value: amount.toLocaleString(undefined, { maximumFractionDigits: 2 }),
        valueUSD: null,
        timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
      };
    });
}

export async function GET() {
  const whales = await Promise.all(
    WHALE_WALLETS.map(async (wallet) => {
      const [ethTxs, tokenTxs] = await Promise.all([
        fetchETHTransactions(wallet.address),
        fetchTokenTransactions(wallet.address),
      ]);
      const allTxs = [...ethTxs, ...tokenTxs]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 8);
      return {
        name: wallet.name,
        address: wallet.address,
        transactions: allTxs,
      };
    })
  );
  return NextResponse.json(whales);
}