# Ztarknet Wallet

Web wallet for the Ztarknet blockchain - deploy accounts, manage funds, and interact with the network.

## Development

```bash
# From monorepo root
bun install
bun run dev:wallet

# Or from this directory
bun dev
```

Runs on **port 3002** by default.

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_ZTARKNET_NETWORK` | Network to connect to | `ZTARKNET_TESTNET` |
| `NEXT_PUBLIC_ZTARKNET_ACCOUNT_CLASS_HASH` | Account class hash | (built-in default) |
| `NEXT_PUBLIC_USERNAME_REGISTRY_CONTRACT_ADDRESS` | Username registry contract | (built-in default) |
| `NEXT_PUBLIC_FEE_TOKEN` | Fee token address | (built-in default) |

## Features

- Create and deploy new accounts
- Import existing accounts
- Send and receive funds
- Username registration
- Transaction history
- Connected apps management

## Tech Stack

- **Next.js 15** with App Router
- **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS**
- **@workspace/ui** shared components
- **starknet.js** for blockchain interactions

