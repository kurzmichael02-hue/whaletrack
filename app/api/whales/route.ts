import { NextResponse } from "next/server";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const WHALE_WALLETS = [
  { name: "Binance Hot Wallet", address: "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8" },
  { name: "Vitalik Buterin", address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" },
  { name: "Wintermute Trading", address: "0xDa9CE944a37d218c3302F6B82a094844C6ECEb17" },
  { name: "Jump Trading", address: "0x6F1cDbBb4d53d226CF4B917bF768B94acbAB6168" },
  { name: "Justin Sun", address: "0x3DdfA8eC3052539b6C9549F12cEA2C295cfF5296" },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchWhaleTransactions(address: string) {
  try {
    await sleep(400);
    const res = await fetch(
      `https://api.etherscan.io/v2/api?chainid=1&module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${ETHERSCAN_API_KEY}`,
      { next: { revalidate: 300 } }
    );
    const data = await res.json() as any;
    if (!Array.isArray(data.result)) return [];

    return data.result
      .filter((tx: any) => {
        const decimals = parseInt(tx.tokenDecimal) || 18;
        const amount = parseFloat(tx.value) / Math.pow(10, decimals);
        return ["USDT", "USDC", "WETH", "WBTC", "DAI", "ETH"].includes(tx.tokenSymbol) && amount >= 1000;
      })
      .slice(0, 8)
      .map((tx: any) => {
        const decimals = parseInt(tx.tokenDecimal) || 18;
        const amount = parseFloat(tx.value) / Math.pow(10, decimals);
        return {
          hash: tx.hash,
          token: tx.tokenSymbol,
          value: amount >= 1_000_000
            ? `${(amount / 1_000_000).toFixed(2)}M`
            : amount >= 1_000
            ? `${(amount / 1_000).toFixed(1)}K`
            : amount.toFixed(2),
          timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
        };
      });
  } catch { return []; }
}

export async function GET() {
  const whales = [];
  for (const wallet of WHALE_WALLETS) {
    const transactions = await fetchWhaleTransactions(wallet.address);
    whales.push({ name: wallet.name, address: wallet.address, transactions });
    await sleep(200);
  }
  return NextResponse.json(whales);
}
