# Ztarknet Web Wallet

Website to deploy Ztarknet accounts/wallets, manage and send funds, and interact with Ztarknet.

## Features

- **Account Management**: Create and manage Ztarknet accounts
- **Username System**: Claim and manage usernames
- **Secure Storage**: Private keys stored securely in browser local storage
- **Starknet Integration**: Full integration with Starknet.js

## Tech Stack

- **Framework**: Vite + React
- **Styling**: Tailwind CSS
- **Blockchain**: Starknet.js
- **Animations**: Motion (Framer Motion)

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
web-wallet/
├── public/
│   └── ztarknet-logo.png
├── src/
│   ├── components/
│   │   └── common/
│   │       ├── Header.jsx
│   │       ├── FlickeringGrid.jsx
│   │       ├── GlowingEffect.jsx
│   │       └── StatCard.jsx
│   ├── context/
│   │   └── ZtarknetConnector.tsx
│   ├── config/
│   │   └── ztarknet.ts
│   ├── hooks/
│   │   └── useRevealOnScroll.js
│   ├── pages/
│   │   └── HomePage.jsx
│   ├── utils/
│   │   └── cn.js
│   └── main.jsx
├── index.html
├── styles.css
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Adding New Pages

The app uses a simple hash-based routing system. To add a new page:

1. Create your page component in `src/pages/`, e.g., `WalletPage.jsx`
2. Import it in `src/main.jsx`
3. Add a route case in the App component's route parsing logic

Example:

```jsx
import { WalletPage } from '@pages/WalletPage';

// In the App component:
let content;
if (route === '#/' || route === '') {
  content = <HomePage />;
} else if (route === '#/wallet') {
  content = <WalletPage />;
} else {
  content = <HomePage />;
}
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Network configuration
VITE_ZTARKNET_NETWORK=ZTARKNET_TESTNET

# Account class hash (optional, defaults to testnet value)
VITE_ZTARKNET_ACCOUNT_CLASS_HASH=0x01484c93b9d6cf61614d698ed069b3c6992c32549194fc3465258c2194734189

# Fee token address (optional)
VITE_FEE_TOKEN=0x1ad102b4c4b3e40a51b6fb8a446275d600555bd63a95cdceed3e5cef8a6bc1d

# Username registry contract (optional)
VITE_USERNAME_REGISTRY_CONTRACT_ADDRESS=0x011195b78f3765b1b8cfe841363e60f2335adf67af2443364d4b15cf8dff60ac
```

**Note**: Vite uses `VITE_` prefix for environment variables (not `NEXT_PUBLIC_`), and they are accessed via `import.meta.env` instead of `process.env`.

## Design

The app follows the same design language as the Ztarknet Explorer:

- **Color Palette**: Orange accent (#ff6b1a) on dark background
- **Typography**: Space Grotesk for UI, JetBrains Mono for code
- **Animations**: Smooth transitions and reveal-on-scroll effects
- **Background**: Flickering grid effect with gradient overlays

## ZtarknetConnector Context

The app uses the `ZtarknetConnectorProvider` context to manage Starknet accounts. Available methods:

### Account Management
- `createAccount()`: Create a new Ztarknet account
- `connectStorageAccount(privateKey)`: Connect to an existing account
- `disconnectAccount()`: Disconnect current account
- `deployAccount(privateKey, address)`: Deploy account on-chain

### Username Management
- `claimUsername(username)`: Claim a username for the connected account
- `getUsernameForAddress(address)`: Get username for a given address
- `isUsernameClaimed(username)`: Check if a username is already claimed

### Contract Interaction
- `invokeContract(call)`: Execute a single contract call
- `invokeContractCalls(calls)`: Execute multiple contract calls

### Storage Management
- `getAvailableKeys()`: Get list of stored account key IDs
- `storePrivateKey(privateKey, address)`: Store a private key
- `clearPrivateKey(keyId)`: Remove a specific private key

## License

See the root LICENSE file.
