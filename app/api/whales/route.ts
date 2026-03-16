import { NextResponse } from "next/server";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const WHALE_WALLETS = [
  { name: "Binance Hot Wallet", address: "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8" },
  { name: "Vitalik Buterin", address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" },
  { name: "Cumberland", address: "0x756C4628E57F7e7f8a459EC2752968360Cf4D1AA" },
  { name: "Wintermute", address: "0xDa9CE944a37d218c3302F6B82a094844C6ECEb17" },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchWhaleTransactions(address: string) {
  try {
    await sleep(300);
    const [ethRes, tokenRes] = await Promise.all([
      fetch(`https://api.etherscan.io/v2/api?chainid=1&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc&apikey=${ETHERSCAN_API_KEY}`, { next: { revalidate: 300 } }),
      fetch(`https://api.etherscan.io/v2/api?chainid=1&module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc&apikey=${ETHERSCAN_API_KEY}`, { next: { revalidate: 300 } }),
    ]);

    const [ethData, tokenData] = await Promise.all([ethRes.json(), tokenRes.json()]) as [any, any];

    const ethTxs = Array.isArray(ethData.result)
      ? ethData.result
          .filter((tx: any) => parseFloat(tx.value) / 1e18 >= 0.5)
          .slice(0, 4)
          .map((tx: any) => ({
            hash: tx.hash,
            token: "ETH",
            value: (parseFloat(tx.value) / 1e18).toFixed(4),
            timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
          }))
      : [];

    const tokenTxs = Array.isArray(tokenData.result)
      ? tokenData.result
          .filter((tx: any) => {
            const decimals = parseInt(tx.tokenDecimal);
            const amount = parseFloat(tx.value) / Math.pow(10, decimals);
            return ["USDT", "USDC", "WETH", "WBTC", "DAI"].includes(tx.tokenSymbol) && amount >= 10000;
          })
          .slice(0, 4)
          .map((tx: any) => {
            const decimals = parseInt(tx.tokenDecimal);
            const amount = parseFloat(tx.value) / Math.pow(10, decimals);
            return {
              hash: tx.hash,
              token: tx.tokenSymbol,
              value: amount.toLocaleString(undefined, { maximumFractionDigits: 2 }),
              timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
            };
          })
      : [];

    return [...ethTxs, ...tokenTxs]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 6);
  } catch {
    return [];
  }
}

export async function GET() {
  const whales = [];
  for (const wallet of WHALE_WALLETS) {
    const transactions = await fetchWhaleTransactions(wallet.address);
    whales.push({ name: wallet.name, address: wallet.address, transactions });
  }
  return NextResponse.json(whales);
}
