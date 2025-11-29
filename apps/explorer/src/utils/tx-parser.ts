import type { Transaction, TransactionKind, TransactionStats } from '../types/transaction';

// Determine transaction kind
export function getTransactionKind(tx: Transaction): TransactionKind {
  // If using zindex API format (has 'type' field)
  if (tx.type) {
    // Map zindex type to display kind
    if (tx.type === 'coinbase') return 'coinbase';
    if (tx.type === 'tze') return 'tze';
    // For specific types like t2t, t2z, z2t, z2z, show as 'standard'
    return 'standard';
  }

  // Otherwise use RPC format detection
  // Check if coinbase
  const firstVin = tx.vin?.[0];
  if (tx.vin && tx.vin.length > 0 && firstVin?.coinbase) {
    return 'coinbase';
  }

  // Check for TZE transaction (script begins with "ff")
  let isTZE = false;

  // Check inputs
  if (tx.vin) {
    for (const input of tx.vin) {
      if (input.scriptSig?.hex?.toLowerCase().startsWith('ff')) {
        isTZE = true;
        break;
      }
    }
  }

  // Check outputs
  if (!isTZE && tx.vout) {
    for (const output of tx.vout) {
      if (output.scriptPubKey?.hex?.toLowerCase().startsWith('ff')) {
        isTZE = true;
        break;
      }
    }
  }

  if (isTZE) {
    return 'tze';
  }

  return 'standard';
}

// Get transaction input/output counts and total output
export function getTransactionStats(tx: Transaction): TransactionStats {
  // If using zindex API format (has aggregated fields)
  if (tx.total_output !== undefined) {
    // Convert satoshis to ZEC (zindex stores in satoshis)
    const totalOutput = tx.total_output / 100000000;

    // Zindex doesn't provide input/output counts in summary
    // For coinbase transactions, we know there's always 1 input
    let numInputs: number | string = '?';
    let numOutputs: number | string = '?';

    if (tx.type === 'coinbase') {
      numInputs = 1;
      // Coinbase typically has 1 output, but could have more
      numOutputs = '≥1';
    }

    return {
      numInputs: tx.num_inputs || numInputs,
      numOutputs: tx.num_outputs || numOutputs,
      totalOutput,
    };
  }

  // Otherwise use RPC format
  const numInputs = tx.vin ? tx.vin.length : 0;
  const numOutputs = tx.vout ? tx.vout.length : 0;
  const totalOutput = tx.vout ? tx.vout.reduce((sum: number, out) => sum + (out.value || 0), 0) : 0;

  return { numInputs, numOutputs, totalOutput };
}
