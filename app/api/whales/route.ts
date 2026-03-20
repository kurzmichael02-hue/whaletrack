import { NextResponse } from "next/server";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const WHALE_WALLETS = [
  { name: "Binance Hot Wallet", address: "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8", category: "Exchange" },
  { name: "Kraken Exchange", address: "0x2910543Af39abA0Cd09dBb2D50200b3E800A63D2", category: "Exchange" },
  { name: "Coinbase Custody", address: "0x503828976D22510aad0201ac7EC88293211D23Da", category: "Exchange" },
  { name: "Wintermute Trading", address: "0xDa9CE944a37d218c3302F6B82a094844C6ECEb17", category: "Market Maker" },
  { name: "Jump Trading", address: "0x6F1cDbBb4d53d226CF4B917bF768B94acbAB6168", category: "Market Maker" },
  { name: "Cumberland DRW", address: "0x756C4628E57F7e7f8a459EC2752968360Cf4D1AA", category: "Market Maker" },
  { name: "Vitalik Buterin", address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", category: "Whale" },
  { name: "Justin Sun", address: "0x3DdfA8eC3052539b6C9549F12cEA2C295cfF5296", category: "Whale" },
  { name: "Uniswap V3", address: "0x1a9C8182C09F50C8318d769245beA52c32BE35BC", category: "DeFi" },
  { name: "Aave Treasury", address: "0x25F2226B597E8F9514B3F68F00f494cF4f286491", category: "DeFi" },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url: string, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { next: { revalidate: 300 } });
      const data = await res.json();
      if (data.status === "0" && data.message === "Max rate limit reached") {
        await sleep(1000 * (i + 1));
        continue;
      }
      return data;
    } catch {
      await sleep(500 * (i + 1));
    }
  }
  return { result: [] };
}

async function fetchWhaleTransactions(address: string, index: number) {
  await sleep(index * 250);
  const data = await fetchWithRetry(
    `https://api.etherscan.io/v2/api?chainid=1&module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${ETHERSCAN_API_KEY}`
  );

  if (!Array.isArray(data.result)) return [];

  return data.result
    .filter((tx: any) => {
      const decimals = parseInt(tx.tokenDecimal) || 18;
      const amount = parseFloat(tx.value) / Math.pow(10, decimals);
      return ["USDT", "USDC", "WETH", "WBTC", "DAI"].includes(tx.tokenSymbol) && amount >= 1000;
    })
    .slice(0, 6)
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
}

export async function GET() {
  const results = await Promise.allSettled(
    WHALE_WALLETS.map((wallet, i) =>
      fetchWhaleTransactions(wallet.address, i).then((transactions) => ({
        name: wallet.name,
        address: wallet.address,
        category: wallet.category,
        transactions,
      }))
    )
  );

  const whales = results.map((r, i) =>
    r.status === "fulfilled"
      ? r.value
      : {
          name: WHALE_WALLETS[i]!.name,
          address: WHALE_WALLETS[i]!.address,
          category: WHALE_WALLETS[i]!.category,
          transactions: [],
        }
  );

  return NextResponse.json(whales);
}