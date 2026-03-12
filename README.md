# WhaleTrack 🐋

Track what the big players are doing. WhaleTrack monitors on-chain whale wallet activity
and streams live crypto prices — all in one dashboard.

Built as a side project to get better at Web3 and real-time data.

## What it does

- Streams live BTC, ETH and SOL prices via WebSocket (Binance API)
- Monitors on-chain transactions from major whale wallets (Binance, Vitalik, Justin Sun)
- Shows portfolio value and PnL based on current market prices
- Transaction history per wallet

## Tech

- **Frontend:** Next.js, TypeScript, TailwindCSS → Vercel
- **Backend:** Node.js, Express, WebSocket → Render
- **Data:** Binance API, Etherscan V2 API

## Run locally
```bash
# Frontend
git clone https://github.com/kurzmichael02-hue/whaletrack.git
cd whaletrack && npm install && npm run dev

# Backend
git clone https://github.com/kurzmichael02-hue/whaletrack-backend.git
cd whaletrack-backend && npm install && npm run dev
```

Frontend → http://localhost:3000 | Backend → http://localhost:4000

## Status

Work in progress. More features coming.
```
```
git add README.md
git commit -m "docs: rewrite README"
git push
