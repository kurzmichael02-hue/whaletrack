# WhaleTrack 🐋

Real-time crypto dashboard. Tracks live prices and on-chain whale wallet activity.

## Stack

- Next.js + TypeScript
- TailwindCSS
- WebSocket (live price streaming)
- Etherscan V2 API (on-chain data)
- Binance API (market prices)
- Vercel (frontend) + Render (backend)

## Features

- Live BTC, ETH, SOL price feed via WebSocket
- Whale wallet monitoring (Binance, Vitalik, Justin Sun)
- Portfolio tracking with PnL calculation
- Transaction history

## Run locally
```bash
# Frontend
git clone https://github.com/kurzmichael02-hue/whaletrack.git
cd whaletrack
npm install
npm run dev

# Backend
git clone https://github.com/kurzmichael02-hue/whaletrack-backend.git
cd whaletrack-backend
npm install
npm run dev
```

Frontend → http://localhost:3000  
Backend → http://localhost:4000

## Repos

- Frontend: [whaletrack](https://github.com/kurzmichael02-hue/whaletrack)
- Backend: [whaletrack-backend](https://github.com/kurzmichael02-hue/whaletrack-backend)

## Status

Work in progress.
