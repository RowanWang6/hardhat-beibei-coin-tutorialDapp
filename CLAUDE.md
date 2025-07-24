# Claude Memory - Hardhat Web3 Project

## Project Overview
This is a Hardhat-based Ethereum development project with a modern React frontend for interacting with a custom ERC-20 token called "BeiBeiCoin" (BBC).

## Project Structure
```
hardhat-project/
├── contracts/
│   ├── MyToken.sol          # ERC-20 token contract
│   └── Lock.sol             # Sample lock contract
├── frontend-react/          # Modern React Web3 frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── TokenDApp.tsx     # Main DApp interface
│   │   │   └── StatusMessage.tsx # Status notifications
│   │   ├── config/
│   │   │   └── wagmi.ts         # Web3 configuration
│   │   ├── App.tsx              # Root component with providers
│   │   └── index.css            # Tailwind styles
│   ├── package.json
│   └── tailwind.config.js
├── scripts/                 # Deployment scripts
├── test/                    # Contract tests
├── ignition/               # Hardhat Ignition deployment modules
└── hardhat.config.js       # Hardhat configuration
```

## Tech Stack

### Backend (Blockchain)
- **Hardhat** - Ethereum development environment
- **Solidity** - Smart contract language
- **Ethers.js** - Ethereum library for scripts

### Frontend
- **React 19** with TypeScript
- **Vite** - Build tool and dev server
- **RainbowKit** - Wallet connection UI
- **Wagmi v2** - React hooks for Ethereum
- **Viem** - TypeScript Ethereum library
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

## Contract Details
- **Contract Name**: MyToken
- **Symbol**: BBC (BeiBeiCoin)
- **Type**: ERC-20 token with mint/burn functionality
- **Deployed Address**: `0x1aAc96892d60dC46F27a9F5129D4BF0b2e093a67`
- **Network**: Hardhat Local Network (Chain ID: 31337)

## Key Features
- Mint tokens (owner only)
- Transfer tokens between addresses
- Approve spending allowances
- Burn tokens
- Query token balances
- Real-time balance updates
- Modern gradient UI design

## Development Commands

### Blockchain
```bash
# Start local Hardhat network
npx hardhat node

# Deploy contracts
npx hardhat run scripts/deploy.js --network localhost

# Run tests
npx hardhat test
```

### Frontend
```bash
# Navigate to frontend
cd frontend-react

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Important Notes
- Frontend was migrated from Vue 3 to React 19 with modern Web3 stack
- Uses latest Web3 libraries popular in 2025
- Configured for Hardhat local development network
- All Chinese language labels preserved from original Vue version
- Modern card-based UI with gradients and animations

## Network Configuration
- **RPC URL**: http://127.0.0.1:8545
- **Chain ID**: 31337
- **Chain Name**: Hardhat Local

## User Instructions
1. Make sure Hardhat network is running (`npx hardhat node`)
2. Deploy contract if needed
3. Start React frontend (`cd frontend-react && npm run dev`)
4. Connect MetaMask to localhost:8545
5. Use the DApp interface to interact with the token

Last Updated: July 23, 2025