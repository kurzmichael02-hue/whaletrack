# WhaleTrack 🐋

My first Web3 project — a crypto dashboard I built to track what the biggest players in the market are doing in real-time. Shows live prices for 15 tokens with auto-refresh, monitors on-chain transactions from major Ethereum whale wallets like Binance, Vitalik and market makers like Cumberland and Jump Trading, and includes a portfolio tracker with real PnL based on live market data. Wallet connectivity via WalletConnect built in.

## Architecture
```mermaid
%%{init: {'theme': 'dark', 'themeVariables': {'primaryColor': '#1a1f35', 'primaryTextColor': '#fff', 'primaryBorderColor': '#10b981', 'lineColor': '#10b981', 'secondaryColor': '#0d1529', 'tertiaryColor': '#0a0f1e'}}}%%
flowchart TD
    Browser["Browser — Next.js on Vercel"]

    Browser -->|every 15s| Binance["Binance API — live prices"]
    Browser -->|on load| API["/api/whales — Serverless Route"]
    Browser -->|connect| Wallet["Reown SDK — WalletConnect"]

    API -->|fetch| Etherscan["Etherscan V2 — on-chain data"]
    Wallet -->|sign| UserWallet["User Wallet — MetaMask, Coinbase"]
```

## Stack

- **Frontend:** Next.js, TypeScript, TailwindCSS
- **Data:** Binance API, Etherscan V2 API
- **Wallet:** Reown / WalletConnect
- **Deployment:** Vercel

## Features

- Live prices for 15 tokens with auto-refresh every 15s
- Whale wallet monitoring — Binance, Vitalik, Cumberland, Jump Trading and more
- Portfolio tracker with real PnL based on current market prices
- Transaction history
- Connect your own wallet

## Run locally
```bash
git clone https://github.com/kurzmichael02-hue/whaletrack.git
cd whaletrack && npm install && npm run dev
```

Add `.env.local`:
```
ETHERSCAN_API_KEY=your_key_here
```

Frontend → http://localhost:3000

## Status

Work in progress.
