# Ztarknet Explorer

A simple, backendless block explorer for Zcash testnet (regtest).

## Features

- **Real-time Block Updates**: Automatically polls for new blocks every 1 second
- **Latest Blocks**: Displays the 5 most recent blocks with animation for new blocks
- **Network Statistics**: Shows chain height, network upgrade version, and transaction version
- **Developer Information**: RPC endpoint and faucet information for developers
- **Block Detail Page**: View detailed information about any block by height or hash
- **Transaction Detail Page**: View comprehensive transaction details including inputs, outputs, and TZE extensions
- **Expandable Transactions**: Click to expand transactions on the block page
- **Color-Coded Transaction Types**: Visual distinction between coinbase, TZE, and standard transactions

## Block Information

Each block card displays:
- Block height and time (adaptive formatting)
- Block hash
- Total number of transactions
- Block reward (ZEC)
- Block size (smart formatting: B or KB)

## Transaction Information

The transaction detail page shows:
- Transaction hash and type (coinbase/TZE/standard)
- Block information (height, hash, time, confirmations)
- All inputs with details (coinbase, previous outputs, sequence, script size)
- All outputs with details (value, script, addresses)
- Transaction metadata (total output, size, version, locktime)
- TZE extension details for TZE transactions

## Running Locally

Since this is a static React app using CDN resources, you can run it with any static file server:

### Using Python
```bash
cd explorer
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

### Using Node.js
```bash
cd explorer
npx serve
```

## Deploying to Vercel

### Using Vercel CLI
```bash
# Install Vercel CLI if you haven't already
npm install -g vercel

# Deploy from the explorer directory
cd explorer
vercel

# For production deployment
vercel --prod
```

### Using Git Integration
1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Import your repository
5. Set the "Root Directory" to `explorer`
6. Deploy

The explorer will be automatically deployed and will receive automatic deployments on future commits.

## RPC Endpoint

The explorer connects to: `https://rpc.regtest.ztarknet.cash`

The following Zcash RPC methods are used:
- `getblockcount` - Get current chain height
- `getblockhash` - Get block hash for a given height
- `getblock` - Get detailed block information (with verbosity 1 or 2)
- `getrawtransaction` - Get detailed transaction information

## Architecture

This is a simple React application that:
- Uses React via CDN (no build step required)
- Directly calls the Zcash RPC endpoint
- Polls for new blocks at regular intervals
- Animates incoming blocks with CSS animations
- Matches the styling of the main landing page

## Pages

### Main Page (/)
- Latest 5 blocks with real-time updates
- Network statistics
- Developer information

### Block Page (#/block/{height|hash})
- Detailed block information
- List of all transactions
- Expandable transaction details

### Transaction Page (#/tx/{txid})
- Full transaction details
- Block context information
- Input/output breakdown
- TZE extension data (if applicable)

## Future Enhancements

- Search functionality
- Mempool information
- Transaction history for addresses

