# WhaleTrack – Architecture

## Overview

WhaleTrack is a Next.js fullstack app deployed entirely on Vercel.
No separate backend — all server logic runs as Next.js API Routes (serverless functions).

## System Architecture

![Architecture](./architecture.png)

## Data Flow

### Live Prices (Dashboard)
Browser → Binance REST API (every 15s) → rendered in TokenTable

### Whale Tracker
Browser → /api/whales (Next.js API Route on Vercel) → Etherscan V2 API → response cached 60s

### Wallet Connect
Browser → Reown/WalletConnect SDK → user's wallet (MetaMask etc.)

## Folder Structure

\`\`\`
whaletrack/
├── app/
│   ├── api/
│   │   └── whales/        # Serverless API route (Etherscan)
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── StatsCard.tsx
│   │   └── TokenTable.tsx  # Fetches live prices from Binance
│   ├── portfolio/          # Portfolio page with PnL
│   ├── trades/             # Trade history
│   ├── whales/             # Whale wallet tracker
│   ├── context/            # WalletConnect provider
│   ├── layout.tsx          # Root layout (sidebar + navbar)
│   └── page.tsx            # Dashboard
├── public/
│   └── docs/
└── .env.local              # ETHERSCAN_API_KEY
\`\`\`

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS |
| Wallet | Reown / WalletConnect |
| Market Data | Binance REST API |
| On-chain Data | Etherscan V2 API |
| Deployment | Vercel |

## Environment Variables

\`\`\`
ETHERSCAN_API_KEY=your_key_here
\`\`\`

## Architecture
```mermaid
flowchart TD
    Browser["Browser — Next.js on Vercel"]

    Browser --> Binance["Binance API — prices every 15s"]
    Browser --> API["/api/whales — Serverless Route"]
    Browser --> Wallet["Reown SDK — WalletConnect"]

    API --> Etherscan["Etherscan V2 — on-chain data"]
    Wallet --> UserWallet["User Wallet — MetaMask, Coinbase"]
