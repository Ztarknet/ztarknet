// Determine transaction kind
export function getTransactionKind(tx) {
  // Check if coinbase
  if (tx.vin && tx.vin.length > 0 && tx.vin[0].coinbase) {
    return 'coinbase';
  }

  // Check for TZE transaction (script begins with "ff")
  let isTZE = false;

  // Check inputs
  if (tx.vin) {
    for (const input of tx.vin) {
      if (input.scriptSig && input.scriptSig.hex && input.scriptSig.hex.toLowerCase().startsWith('ff')) {
        isTZE = true;
        break;
      }
    }
  }

  // Check outputs
  if (!isTZE && tx.vout) {
    for (const output of tx.vout) {
      if (output.scriptPubKey && output.scriptPubKey.hex && output.scriptPubKey.hex.toLowerCase().startsWith('ff')) {
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
export function getTransactionStats(tx) {
  const numInputs = tx.vin ? tx.vin.length : 0;
  const numOutputs = tx.vout ? tx.vout.length : 0;
  const totalOutput = tx.vout ? tx.vout.reduce((sum, out) => sum + (out.value || 0), 0) : 0;

  return { numInputs, numOutputs, totalOutput };
}
