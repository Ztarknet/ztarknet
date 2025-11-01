# Ztarknet Explorer

A simple, backendless block explorer for Zcash testnet (regtest).

## Features

- **Real-time Block Updates**: Automatically polls for new blocks every 10 seconds
- **Latest Blocks**: Displays the 10 most recent blocks with animation for new blocks
- **Network Statistics**: Shows chain height, network upgrade version, and transaction version
- **Developer Information**: RPC endpoint and faucet information for developers

## Block Information

Each block displays:
- Block height and time
- Block hash
- Number of transactions
- Number of TZE transactions
- Block size
- Mining difficulty

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

## RPC Endpoint

The explorer connects to: `https://rpc.regtest.ztarknet.cash`

The following Zcash RPC methods are used:
- `getblockcount` - Get current chain height
- `getblockhash` - Get block hash for a given height
- `getblock` - Get detailed block information

## Architecture

This is a simple React application that:
- Uses React via CDN (no build step required)
- Directly calls the Zcash RPC endpoint
- Polls for new blocks at regular intervals
- Animates incoming blocks with CSS animations
- Matches the styling of the main landing page

## Future Enhancements

- Block detail page
- Transaction detail page
- Search functionality
- Better TZE transaction detection
- Mempool information

