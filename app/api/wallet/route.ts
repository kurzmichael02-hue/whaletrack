import { NextResponse } from "next/server";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  if (!address) return NextResponse.json({ tokens: [], transactions: [] });

  try {
    const [tokenRes, txRes] = await Promise.all([
      fetch(`https://api.etherscan.io/v2/api?chainid=1&module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${ETHERSCAN_API_KEY}`, { next: { revalidate: 60 } }),
      fetch(`https://api.etherscan.io/v2/api?chainid=1&module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&page=1&offset=20&sort=desc&apikey=${ETHERSCAN_API_KEY}`, { next: { revalidate: 60 } }),
    ]);

    const [tokenData, txData] = await Promise.all([tokenRes.json(), txRes.json()]) as [any, any];

    // Build token balance map
    const balanceMap: Record<string, { symbol: string; name: string; balance: number; decimals: number }> = {};

    if (Array.isArray(tokenData.result)) {
      for (const tx of tokenData.result) {
        const sym = tx.tokenSymbol;
        const decimals = parseInt(tx.tokenDecimal) || 18;
        const amount = parseFloat(tx.value) / Math.pow(10, decimals);
        if (!balanceMap[sym]) {
          balanceMap[sym] = { symbol: sym, name: tx.tokenName, balance: 0, decimals };
        }
        if (tx.to.toLowerCase() === address.toLowerCase()) {
          balanceMap[sym]!.balance += amount;
        } else {
          balanceMap[sym]!.balance -= amount;
        }
      }
    }

    const tokens = Object.values(balanceMap)
      .filter((t) => t.balance > 0.001)
      .slice(0, 20)
      .map((t) => ({
        symbol: t.symbol,
        name: t.name,
        balance: t.balance > 1000000
          ? `${(t.balance / 1000000).toFixed(2)}M`
          : t.balance > 1000
          ? `${(t.balance / 1000).toFixed(2)}K`
          : t.balance.toFixed(4),
        value: 0,
        price: 0,
      }));

    // Recent transactions
    const transactions = Array.isArray(txData.result)
      ? txData.result.slice(0, 10).map((tx: any) => {
          const decimals = parseInt(tx.tokenDecimal) || 18;
          const amount = parseFloat(tx.value) / Math.pow(10, decimals);
          return {
            hash: tx.hash,
            token: tx.tokenSymbol,
            value: amount > 1000000
              ? `${(amount / 1000000).toFixed(2)}M ${tx.tokenSymbol}`
              : amount > 1000
              ? `${(amount / 1000).toFixed(2)}K ${tx.tokenSymbol}`
              : `${amount.toFixed(4)} ${tx.tokenSymbol}`,
            timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
            type: tx.to.toLowerCase() === address.toLowerCase() ? "in" : "out",
          };
        })
      : [];

    return NextResponse.json({ tokens, transactions });
  } catch (e) {
    return NextResponse.json({ tokens: [], transactions: [] });
  }
}