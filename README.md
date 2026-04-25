# Armon - Decentralized Arisan on Monad

<p align="center">
  <img src="public/logo.png" alt="Armon Logo" width="200"/>
</p>

> **Traditional Indonesian Arisan, Executed Trustlessly on Monad Blockchain**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple)](https://vitejs.dev/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.x-gray)](https://soliditylang.org/)

## 🎯 What is Armon?

**Armon** is a decentralized arisan platform that combines traditional Indonesian arisan culture with blockchain technology. With smart contracts and AI-powered yield optimizer, Armon delivers:

- **Trustless Execution** - No intermediary, all rules executed by smart contracts
- **125% Collateral Security** - Deposit 125% collateral for pool safety
- **AI Yield Optimization** - AI automatically finds highest yields in Monad DeFi ecosystem
- **Bilingual Support** - Supports Indonesian & English with toggle

## ✨ Features

### Core Features
| Feature | Description |
|---------|-------------|
| 🏊 **Pool Creation** | Create arisan pool with customizable participants, contribution, and periods |
| 👥 **Participant Management** | Join pool with collateral deposit, track payment status |
| 🎲 **Winner Selection** | Random draw or voting system to select winners |
| 💰 **Prize Distribution** | Winners claim prizes from total pool |
| 🔄 **Collateral Withdrawal** | Collateral + yield returned when pool ends |

### AI Yield Optimizer
- Real-time yield analysis from 6+ Monad DeFi protocols
- Auto recommendation based on risk appetite
- Visual comparison with historical data

### Security
- **125% Collateral** - Each participant deposits 125% of monthly contribution
- **Smart Contract Verified** - All transactions on-chain and transparent
- **No Middleman** - Trustless execution without intermediary

## 🏆 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + Vite + TailwindCSS |
| **Smart Contract** | Solidity (Foundry) |
| **Blockchain** | Monad Testnet (Chain ID: 10159) |
| **Wallet Integration** | WalletConnect, MetaMask, Coinbase Wallet |
| **AI Engine** | Rule-based yield optimizer with mock data |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm
- Wallet (MetaMask / WalletConnect)

### Installation

```bash
# Clone repository
git clone https://github.com/yt2025id-lab/Armon.git
cd Armon

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

### Deploy Smart Contract

```bash
# Compile contracts
forge build

# Deploy to Monad testnet
forge script script/Deploy.s.sol \
  --rpc-url https://testnet-rpc.monad.xyz \
  --private-key YOUR_PRIVATE_KEY
```

## 📁 Project Structure

```
Armon/
├── contracts/                    # Solidity smart contracts
│   └── Armon.sol                # Main arisan contract
├── public/                       # Static assets
│   └── logo.png                  # Armon logo
├── src/
│   ├── assets/                   # Local assets
│   ├── components/               # Reusable React components
│   │   ├── AIChatWidget.tsx      # AI chat assistant
│   │   ├── PoolCard.tsx         # Pool display card
│   │   ├── WalletButton.tsx     # Wallet connection
│   │   └── ui/                  # UI primitives (Button, etc.)
│   ├── config/                   # App configuration
│   │   └── wagmi.ts             # Wallet configuration
│   ├── hooks/                    # Custom React hooks
│   │   ├── useArmon.ts          # Armon blockchain hooks
│   │   ├── useArmonContract.ts  # Contract interaction
│   │   └── useLanguage.ts       # i18n language hook
│   ├── lib/                      # Utilities & config
│   │   ├── abi.ts               # Contract ABI
│   │   ├── armonClient.ts       # Viem client setup
│   │   ├── contracts.ts         # Contract addresses
│   │   ├── i18n.ts              # Translations (ID/EN)
│   │   ├── yieldData.ts         # DeFi yield data
│   │   └── utils.ts             # Helper functions
│   ├── pages/                   # Route pages
│   │   ├── Home.tsx             # Landing page
│   │   ├── CreatePool.tsx       # Create new pool
│   │   ├── PoolDetail.tsx       # Pool details & actions
│   │   ├── Dashboard.tsx        # User dashboard
│   │   └── YieldOptimizer.tsx   # AI yield optimizer
│   ├── App.tsx                  # Main app component
│   └── main.tsx                 # Entry point
├── SPEC.md                      # Full specification
└── README.md                    # This file
```

## 🔧 How It Works

### 1. Create Pool
Pool owner creates arisan with:
- Pool name
- Monthly contribution (in MON)
- Max participants (3-50)
- Total periods (1-12 months)

### 2. Join Pool
Participants deposit 125% of monthly contribution:
```
Collateral Required = Contribution × 1.25
Example: 1 MON contribution → 1.25 MON collateral
```

### 3. Pay Iuran
Participants pay monthly contribution on 1st-10th of each month. Collateral accrues yield from DeFi protocols.

### 4. Draw Winner
At end of each period:
- **Random Draw**: VRF-based random selection, or
- **Voting**: Participants vote to select winner

### 5. Claim Prize
Winner claims prize = Total Pool Contributions:
```
Prize = Monthly Contribution × Number of Participants
Example: 1 MON × 6 participants = 6 MON prize
```

### 6. Withdraw Collateral
After pool ends or participant has won:
```
Withdrawal = Collateral + Accrued Yield
```

## 🤖 AI Yield Optimizer

Armon AI analyzes yields from Monad DeFi protocols:

| Protocol | APY | Risk |
|----------|-----|------|
| MonadFi | 12.5% | Low |
| Behoof | 18.2% | Medium |
| K立 | 24.8% | High |
| Magma | 15.0% | Low |
| Bullish | 20.5% | Medium |
| Defi.ai | 28.0% | High |

AI provides recommendations based on:
- Risk tolerance (Low / Medium / High)
- Yield optimization strategy
- Historical performance

## 🌐 Live Demo

**Contract Address**: `0x7655E71507e8D114d774A236963418959084C8F2`

**Testnet**: Monad Testnet (Chain ID: 10159)
**RPC**: `https://testnet-rpc.monad.xyz`

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📜 License

MIT License - Built for Monad Blitz Jogja 2026

## 👨‍💻 Team

Armon Team - Winners of Monad Blitz Jogja 2026 🏆

---

<p align="center">
  Made with ❤️ on <strong>Monad</strong>
</p>