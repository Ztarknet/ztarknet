# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Ztarknet** is a Starknet-style L2 rollup that settles to Zcash L1 using Transparent Zcash Extensions (TZE) to verify Circle STARK proofs. This is a proof-of-concept exploring how to add programmability and scale to Zcash via an L2 that executes Cairo programs.

**Status:** Concept + references for a proof-of-concept. This repo documents the idea, constraints, and minimum components.

### Key Components

1. **Sequencer/Execution:** Reuses Madara (Starknet client, Rust) for L2 networking, JSON-RPC, execution, and state management
2. **Prover:** Uses Stwo/Cairo to produce Circle-STARK proofs of Cairo programs
3. **L1 Settlement:** Zcash L1 verification via TZE (Transparent Zcash Extension) - draft ZIP introduces Circle-STARK verifier as a TZE type
4. **Explorer:** Static React-based block explorer for Zcash regtest
5. **Landing:** Static marketing/info website

## Architecture

### Settlement Pattern (Anchor UTXO)
L2 progression is represented as a chain of TZE outputs:
- Genesis creates `Anchor_0` with `root_0`
- Each step k→k+1 spends `Anchor_k` and creates `Anchor_{k+1}`
- TZE witness carries proof that executing Cairo L2 program from `root_k` with block k+1 txs yields `root_{k+1}`
- Zcash nodes verify the proof using TZE verifier; if valid, `Anchor_{k+1}` becomes the new on-chain commitment

### Data Flow
1. Users send L2 transactions to Sequencer (Madara) via JSON-RPC
2. Sequencer batches txs, executes Cairo contracts, computes next state root
3. Prover consumes execution trace and generates Circle-STARK proof
4. Submitter builds Zcash TZE transaction that spends previous anchor and creates next anchor with new root and proof
5. Zcash nodes run TZE verifier as part of tx validation; if valid, anchor updates on L1

## Development Commands

### Running Madara Devnet
Start the Starknet-compatible devnet (Madara) for local development:
```bash
docker compose -f docker-compose.devnet.yml up
```
This starts Madara on port 9944 with devnet mode and external RPC enabled.

### Explorer Development

The explorer is a static React app (no build step required - uses CDN resources).

Run locally with Python:
```bash
cd explorer
python -m http.server 8000
# Open http://localhost:8000
```

Or with Node.js:
```bash
cd explorer
npx serve
```

The explorer connects to `https://rpc.regtest.ztarknet.cash` and uses these Zcash RPC methods:
- `getblockcount` - Get current chain height
- `getblockhash` - Get block hash for a given height
- `getblock` - Get detailed block information

Features:
- Real-time block updates (polls every 1 second)
- Displays latest 5 blocks with animations
- Shows network statistics, TZE transactions, block details
- Backendless architecture (direct RPC calls from browser)

### Landing Page

Static HTML/CSS/JS marketing site. Run with any static file server:
```bash
cd landing
python -m http.server 8000
# Or: npx serve
```

## Repository Structure

```
ztarknet/
├── docker-compose.devnet.yml  # Madara devnet configuration
├── explorer/                  # Zcash regtest block explorer (static React)
│   ├── app.js                # Main React application logic
│   ├── index.html            # Explorer entry point
│   └── styles.css            # Matching landing page styles
├── landing/                   # Static marketing website
│   ├── index.html
│   ├── script.js
│   └── styles.css
└── misc/                      # Assets and images
```

## Important Technical Details

### TZE (Transparent Zcash Extension)
- Uses ZIP-222 model (precondition/witness per extension type)
- Integrates with ZIP-245/244 digests for proper commitment in txid/signature trees
- Single TZE type for Circle-STARK verification
- Draft ZIP: https://github.com/zcash/zips/pull/1107

### Zcash Integration
- Target implementation: Zebra (Rust Zcash client)
- Fork with draft TZE plumbing: https://github.com/AbdelStark/zebra
- Forum discussion: https://forum.zcashcommunity.com/t/stark-verification-as-a-transparent-zcash-extension-tze-i-e-enabler-for-a-starknet-style-l2-on-zcash/52486/15

### Prover & Verification
- Prover: Stwo/Cairo (generates Circle-STARK proofs)
- For PoC: consume JSON from `cairo-prove` directly
- Start with simple Cairo programs (hashing/merkle updates), progress to minimal L2 state transitions
- L1 verification: TZE verifier invokes Stwo verifier on witness bytes and checks claimed public inputs/commitments

### Data Availability
PoC starts minimal - publishes L2 state roots only. DA must be evaluated separately. Main focus is proof verification.

## Related Resources

- [Madara - Starknet client](https://github.com/madara-alliance/madara)
- [Stwo/Cairo - Cairo proof generation](https://github.com/starkware-libs/stwo-cairo)
- [Starknet protocol docs](https://docs.starknet.io/learn/protocol/intro)
- [Zebra fork with TZE](https://github.com/AbdelStark/zebra)

## Development Philosophy

This is a research/PoC project exploring:
- Separation of concerns: keep Zcash L1 minimal, push execution to L2 VM (Cairo)
- Clean L1 integration: use TZE rather than Script changes
- Rust-native path: Madara (Rust) and Stwo/Cairo (Rust verifier) within Zebra's Rust ecosystem

When working on this codebase, prioritize simplicity and clarity for the PoC phase. The goal is to demonstrate feasibility, not production-readiness.
