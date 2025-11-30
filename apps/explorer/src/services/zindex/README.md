# Zindex API Services

This directory contains TypeScript/JavaScript service modules for interacting with the [Zindex API](https://github.com/Ztarknet/zindex).

## Structure

```
zindex/
├── index.js       # Main export file with all modules
├── zindex.js      # Common utilities and configuration
├── blocks.js      # Block-related endpoints
├── tx_graph.js    # Transaction graph endpoints
├── accounts.js    # Account-related endpoints
├── tze_graph.js   # TZE (Transparent Zcash Extension) graph endpoints
└── starks.js      # STARK proof and verifier endpoints
```

## Configuration

The API endpoint can be configured via environment variable:

```bash
# Default: https://zindex.ztarknet.cash
VITE_ZINDEX_ENDPOINT=https://your-custom-endpoint.com
```

## Usage

### Import Options

You can import the modules in several ways:

```javascript
// Option 1: Import specific functions
import { getLatestBlock, getBlockByHeight } from './services/zindex';

// Option 2: Import module namespaces
import { blocks, txGraph, accounts } from './services/zindex';

// Option 3: Import from individual modules
import { getLatestBlock } from './services/zindex/blocks';
import { getTransaction } from './services/zindex/tx_graph';
```

### Examples

#### Blocks

```javascript
import { blocks } from './services/zindex';

// Get latest block
const latestBlock = await blocks.getLatestBlock();

// Get block by height
const block = await blocks.getBlockByHeight(12345);

// Get recent blocks with custom limit
const recentBlocks = await blocks.getRecentBlocks({ limit: 20 });

// Get blocks in a height range
const blockRange = await blocks.getBlocksByHeightRange({
  from_height: 1000,
  to_height: 2000,
  limit: 50
});
```

#### Transaction Graph

```javascript
import { txGraph } from './services/zindex';

// Get transaction details
const tx = await txGraph.getTransaction('abc123...');

// Get transactions by type
const tzeTxs = await txGraph.getTransactionsByType({
  type: 'tze',
  limit: 10
});

// Get transaction graph with depth
const graph = await txGraph.getTransactionGraph({
  txid: 'abc123...',
  depth: 3  // default
});

// Get transaction outputs
const outputs = await txGraph.getTransactionOutputs('abc123...');

// Get unspent outputs
const unspent = await txGraph.getUnspentOutputs('abc123...');
```

#### Accounts

```javascript
import { accounts } from './services/zindex';

// Get account details
const account = await accounts.getAccount('t1abc...');

// Get top accounts by balance
const topAccounts = await accounts.getTopAccountsByBalance({ limit: 10 });

// Get account transactions
const accountTxs = await accounts.getAccountTransactions({
  address: 't1abc...',
  limit: 20,
  offset: 0
});

// Get account transaction count
const txCount = await accounts.getAccountTransactionCount('t1abc...');
```

#### TZE Graph

```javascript
import { tzeGraph } from './services/zindex';

// Get all TZE outputs
const tzeOutputs = await tzeGraph.getTzeOutputs({ limit: 10 });

// Get unspent TZE outputs by type
const unspentTze = await tzeGraph.getUnspentTzeOutputsByType('stark-verifier');

// Get TZE inputs by type and mode
const tzeInputs = await tzeGraph.getTzeInputsByTypeAndMode({
  type: 'stark-verifier',
  mode: 'verify'
});

// Get all unspent TZE outputs
const allUnspent = await tzeGraph.getAllUnspentTzeOutputs({ limit: 50 });
```

#### STARKS

```javascript
import { starks } from './services/zindex';

// Get verifier by ID
const verifier = await starks.getVerifier('verifier-id-123');

// Get all verifiers sorted by balance
const topVerifiers = await starks.getVerifiersByBalance({ limit: 10 });

// Get recent STARK proofs
const recentProofs = await starks.getRecentStarkProofs({ limit: 5 });

// Get proofs by transaction
const txProofs = await starks.getStarkProofsByTransaction('abc123...');

// Get Ztarknet facts
const facts = await starks.getZtarknetFacts({ limit: 20 });

// Get state transition
const transition = await starks.getStateTransition({
  from_state: 'state1',
  to_state: 'state2'
});
```

## API Response Format

All API functions return JSON responses in the following format:

**Success:**
```json
{
  "result": "success",
  "data": { ... }
}
```

**Error:**
```json
{
  "result": "error",
  "error": "Error message"
}
```

The service functions automatically extract the `data` field and throw errors for failed requests.

## Common Parameters

### Pagination

Most list endpoints support pagination:

```javascript
{
  limit: 10,   // Maximum number of results (default: 10)
  offset: 0    // Number of results to skip (default: 0)
}
```

### Transaction Types

Valid transaction types:
- `coinbase` - Coinbase transactions
- `tze` - TZE transactions
- `t2t` - Transparent to transparent
- `t2z` - Transparent to shielded
- `z2t` - Shielded to transparent
- `z2z` - Shielded to shielded

## Error Handling

All functions throw errors for:
- Missing required parameters
- Network failures
- API errors

```javascript
try {
  const block = await blocks.getBlockByHeight(12345);
} catch (error) {
  console.error('Failed to fetch block:', error.message);
}
```

## Health Check

Check API availability:

```javascript
import { checkHealth } from './services/zindex';

const health = await checkHealth();
```

## API Documentation

For complete API documentation, see:
- [Zindex API Reference](https://github.com/Ztarknet/zindex/blob/main/docs/api-reference.md)
- [Zindex Repository](https://github.com/Ztarknet/zindex)
