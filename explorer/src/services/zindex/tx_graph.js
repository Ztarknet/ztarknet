/**
 * Zindex API - Transaction Graph Module
 *
 * Functions for interacting with transaction graph endpoints.
 * Includes transactions, outputs, inputs, and graph traversal.
 */

import { API_BASE, apiGet, withPaginationDefaults } from './zindex.js';

const TX_GRAPH_BASE = `${API_BASE}/tx-graph`;

// ==================== Transactions ====================

/**
 * Get a single transaction by txid
 * @param {string} txid - Transaction ID
 * @returns {Promise<Object>} Transaction data
 */
export async function getTransaction(txid) {
  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  return apiGet(`${TX_GRAPH_BASE}/transaction`, { txid });
}

/**
 * Get all transactions in a specific block
 * @param {number} block_height - Block height
 * @returns {Promise<Object>} Transactions in the block
 */
export async function getTransactionsByBlock(block_height) {
  if (block_height === undefined || block_height === null) {
    throw new Error('Block height is required');
  }
  return apiGet(`${TX_GRAPH_BASE}/transactions/by-block`, { block_height });
}

/**
 * Get transactions by type
 * @param {Object} params - Query parameters
 * @param {string} params.type - Transaction type (coinbase|tze|t2t|t2z|z2t|z2z)
 * @param {number} [params.limit=10] - Maximum number of transactions to return
 * @param {number} [params.offset=0] - Number of transactions to skip
 * @returns {Promise<Object>} Transactions of the specified type
 */
export async function getTransactionsByType(params) {
  const { type, ...rest } = params || {};

  if (!type) {
    throw new Error('Transaction type is required (coinbase|tze|t2t|t2z|z2t|z2z)');
  }

  return apiGet(`${TX_GRAPH_BASE}/transactions/by-type`, {
    type,
    ...withPaginationDefaults(rest),
  });
}

/**
 * Get recent transactions
 * @param {Object} params - Query parameters
 * @param {number} [params.limit=10] - Maximum number of transactions to return
 * @param {number} [params.offset=0] - Number of transactions to skip
 * @returns {Promise<Object>} Recent transactions
 */
export async function getRecentTransactions(params = {}) {
  return apiGet(`${TX_GRAPH_BASE}/transactions/recent`, withPaginationDefaults(params));
}

// ==================== Outputs ====================

/**
 * Get all outputs for a transaction
 * @param {string} txid - Transaction ID
 * @returns {Promise<Object>} Transaction outputs
 */
export async function getTransactionOutputs(txid) {
  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  return apiGet(`${TX_GRAPH_BASE}/outputs`, { txid });
}

/**
 * Get a specific transaction output
 * @param {Object} params - Query parameters
 * @param {string} params.txid - Transaction ID
 * @param {number} params.vout - Output index
 * @returns {Promise<Object>} Transaction output
 */
export async function getTransactionOutput(params) {
  const { txid, vout } = params || {};

  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  if (vout === undefined || vout === null) {
    throw new Error('Output index (vout) is required');
  }

  return apiGet(`${TX_GRAPH_BASE}/outputs/output`, { txid, vout });
}

/**
 * Get unspent outputs for a transaction
 * @param {string} txid - Transaction ID
 * @returns {Promise<Object>} Unspent transaction outputs
 */
export async function getUnspentOutputs(txid) {
  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  return apiGet(`${TX_GRAPH_BASE}/outputs/unspent`, { txid });
}

/**
 * Get transactions that spent outputs from a given transaction
 * @param {string} txid - Transaction ID
 * @returns {Promise<Object>} Spending transactions
 */
export async function getOutputSpenders(txid) {
  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  return apiGet(`${TX_GRAPH_BASE}/outputs/spenders`, { txid });
}

// ==================== Inputs ====================

/**
 * Get all inputs for a transaction
 * @param {string} txid - Transaction ID
 * @returns {Promise<Object>} Transaction inputs
 */
export async function getTransactionInputs(txid) {
  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  return apiGet(`${TX_GRAPH_BASE}/inputs`, { txid });
}

/**
 * Get a specific transaction input
 * @param {Object} params - Query parameters
 * @param {string} params.txid - Transaction ID
 * @param {number} params.vin - Input index
 * @returns {Promise<Object>} Transaction input
 */
export async function getTransactionInput(params) {
  const { txid, vin } = params || {};

  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  if (vin === undefined || vin === null) {
    throw new Error('Input index (vin) is required');
  }

  return apiGet(`${TX_GRAPH_BASE}/inputs/input`, { txid, vin });
}

/**
 * Get source transactions (where inputs came from)
 * @param {string} txid - Transaction ID
 * @returns {Promise<Object>} Source transactions
 */
export async function getInputSources(txid) {
  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  return apiGet(`${TX_GRAPH_BASE}/inputs/sources`, { txid });
}

// ==================== Graph ====================

/**
 * Get transaction graph (relationships between transactions)
 * @param {Object} params - Query parameters
 * @param {string} params.txid - Transaction ID
 * @param {number} [params.depth=3] - Graph traversal depth
 * @returns {Promise<Object>} Transaction graph data
 */
export async function getTransactionGraph(params) {
  const { txid, depth = 3 } = params || {};

  if (!txid) {
    throw new Error('Transaction ID is required');
  }

  return apiGet(`${TX_GRAPH_BASE}/graph`, { txid, depth });
}
