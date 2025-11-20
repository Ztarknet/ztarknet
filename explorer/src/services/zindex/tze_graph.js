/**
 * Zindex API - TZE Graph Module
 *
 * Functions for interacting with Transparent Zcash Extension (TZE) graph endpoints.
 * Includes TZE inputs and outputs.
 */

import { API_BASE, apiGet, withPaginationDefaults } from './zindex.js';

const TZE_GRAPH_BASE = `${API_BASE}/tze-graph`;

// ==================== TZE Inputs ====================

/**
 * Get all TZE inputs for a transaction
 * @param {string} txid - Transaction ID
 * @returns {Promise<Object>} TZE inputs for the transaction
 */
export async function getTzeInputs(txid) {
  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  return apiGet(`${TZE_GRAPH_BASE}/inputs`, { txid });
}

/**
 * Get a specific TZE input
 * @param {Object} params - Query parameters
 * @param {string} params.txid - Transaction ID
 * @param {number} params.vin - Input index
 * @returns {Promise<Object>} TZE input data
 */
export async function getTzeInput(params) {
  const { txid, vin } = params || {};

  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  if (vin === undefined || vin === null) {
    throw new Error('Input index (vin) is required');
  }

  return apiGet(`${TZE_GRAPH_BASE}/inputs/input`, { txid, vin });
}

/**
 * Get TZE inputs by extension type
 * @param {Object} params - Query parameters
 * @param {string} params.type - Extension type (demo|stark_verify)
 * @param {number} [params.limit=10] - Maximum number of inputs to return
 * @param {number} [params.offset=0] - Number of inputs to skip
 * @returns {Promise<Object>} TZE inputs of the specified type
 */
export async function getTzeInputsByType(params) {
  const { type, ...rest } = params || {};

  if (!type) {
    throw new Error('Extension type is required (demo|stark_verify)');
  }

  return apiGet(`${TZE_GRAPH_BASE}/inputs/by-type`, {
    type,
    ...withPaginationDefaults(rest),
  });
}

/**
 * Get TZE inputs by mode
 * @param {Object} params - Query parameters
 * @param {string|number} params.mode - Extension mode (0 or 1)
 * @param {number} [params.limit=10] - Maximum number of inputs to return
 * @param {number} [params.offset=0] - Number of inputs to skip
 * @returns {Promise<Object>} TZE inputs of the specified mode
 */
export async function getTzeInputsByMode(params) {
  const { mode, ...rest } = params || {};

  if (mode === undefined || mode === null) {
    throw new Error('Extension mode is required (0 or 1)');
  }

  return apiGet(`${TZE_GRAPH_BASE}/inputs/by-mode`, {
    mode,
    ...withPaginationDefaults(rest),
  });
}

/**
 * Get TZE inputs by type and mode
 * @param {Object} params - Query parameters
 * @param {string} params.type - Extension type (demo|stark_verify)
 * @param {string} params.mode - Extension mode string (open|close for demo, initialize|verify for stark_verify)
 * @param {number} [params.limit=10] - Maximum number of inputs to return
 * @param {number} [params.offset=0] - Number of inputs to skip
 * @returns {Promise<Object>} TZE inputs matching type and mode
 */
export async function getTzeInputsByTypeAndMode(params) {
  const { type, mode, ...rest } = params || {};

  if (!type) {
    throw new Error('Extension type is required');
  }
  if (!mode) {
    throw new Error('Extension mode is required');
  }

  return apiGet(`${TZE_GRAPH_BASE}/inputs/by-type-mode`, {
    type,
    mode,
    ...withPaginationDefaults(rest),
  });
}

/**
 * Get TZE inputs that spend a specific previous output
 * @param {Object} params - Query parameters
 * @param {string} params.prev_txid - Previous output transaction ID
 * @param {number} params.prev_vout - Previous output index
 * @returns {Promise<Object>} TZE inputs spending the output
 */
export async function getTzeInputsByPrevOutput(params) {
  const { prev_txid, prev_vout } = params || {};

  if (!prev_txid) {
    throw new Error('Previous transaction ID is required');
  }
  if (prev_vout === undefined || prev_vout === null) {
    throw new Error('Previous output index (prev_vout) is required');
  }

  return apiGet(`${TZE_GRAPH_BASE}/inputs/by-prev-output`, { prev_txid, prev_vout });
}

// ==================== TZE Outputs ====================

/**
 * Get all TZE outputs for a transaction
 * @param {string} txid - Transaction ID
 * @returns {Promise<Object>} TZE outputs for the transaction
 */
export async function getTzeOutputs(txid) {
  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  return apiGet(`${TZE_GRAPH_BASE}/outputs`, { txid });
}

/**
 * Get a specific TZE output
 * @param {Object} params - Query parameters
 * @param {string} params.txid - Transaction ID
 * @param {number} params.vout - Output index
 * @returns {Promise<Object>} TZE output data
 */
export async function getTzeOutput(params) {
  const { txid, vout } = params || {};

  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  if (vout === undefined || vout === null) {
    throw new Error('Output index (vout) is required');
  }

  return apiGet(`${TZE_GRAPH_BASE}/outputs/output`, { txid, vout });
}

/**
 * Get unspent TZE outputs for a specific transaction
 * @param {string} txid - Transaction ID
 * @returns {Promise<Object>} Unspent TZE outputs
 */
export async function getUnspentTzeOutputs(txid) {
  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  return apiGet(`${TZE_GRAPH_BASE}/outputs/unspent`, { txid });
}

/**
 * Get all unspent TZE outputs in the system
 * @param {Object} params - Query parameters
 * @param {number} [params.limit=10] - Maximum number of outputs to return
 * @param {number} [params.offset=0] - Number of outputs to skip
 * @returns {Promise<Object>} All unspent TZE outputs
 */
export async function getAllUnspentTzeOutputs(params = {}) {
  return apiGet(`${TZE_GRAPH_BASE}/outputs/all-unspent`, withPaginationDefaults(params));
}

/**
 * Get TZE outputs by extension type
 * @param {Object} params - Query parameters
 * @param {string} params.type - Extension type (demo|stark_verify)
 * @param {number} [params.limit=10] - Maximum number of outputs to return
 * @param {number} [params.offset=0] - Number of outputs to skip
 * @returns {Promise<Object>} TZE outputs of the specified type
 */
export async function getTzeOutputsByType(params) {
  const { type, ...rest } = params || {};

  if (!type) {
    throw new Error('Extension type is required (demo|stark_verify)');
  }

  return apiGet(`${TZE_GRAPH_BASE}/outputs/by-type`, {
    type,
    ...withPaginationDefaults(rest),
  });
}

/**
 * Get TZE outputs by mode
 * @param {Object} params - Query parameters
 * @param {string|number} params.mode - Extension mode (0 or 1)
 * @param {number} [params.limit=10] - Maximum number of outputs to return
 * @param {number} [params.offset=0] - Number of outputs to skip
 * @returns {Promise<Object>} TZE outputs of the specified mode
 */
export async function getTzeOutputsByMode(params) {
  const { mode, ...rest } = params || {};

  if (mode === undefined || mode === null) {
    throw new Error('Extension mode is required (0 or 1)');
  }

  return apiGet(`${TZE_GRAPH_BASE}/outputs/by-mode`, {
    mode,
    ...withPaginationDefaults(rest),
  });
}

/**
 * Get TZE outputs by type and mode
 * @param {Object} params - Query parameters
 * @param {string} params.type - Extension type (demo|stark_verify)
 * @param {string} params.mode - Extension mode string (open|close for demo, initialize|verify for stark_verify)
 * @param {number} [params.limit=10] - Maximum number of outputs to return
 * @param {number} [params.offset=0] - Number of outputs to skip
 * @returns {Promise<Object>} TZE outputs matching type and mode
 */
export async function getTzeOutputsByTypeAndMode(params) {
  const { type, mode, ...rest } = params || {};

  if (!type) {
    throw new Error('Extension type is required');
  }
  if (!mode) {
    throw new Error('Extension mode is required');
  }

  return apiGet(`${TZE_GRAPH_BASE}/outputs/by-type-mode`, {
    type,
    mode,
    ...withPaginationDefaults(rest),
  });
}

/**
 * Get unspent TZE outputs by extension type
 * @param {Object} params - Query parameters
 * @param {string} params.type - Extension type (demo|stark_verify)
 * @param {number} [params.limit=10] - Maximum number of outputs to return
 * @param {number} [params.offset=0] - Number of outputs to skip
 * @returns {Promise<Object>} Unspent TZE outputs of the specified type
 */
export async function getUnspentTzeOutputsByType(params) {
  const { type, ...rest } = params || {};

  if (!type) {
    throw new Error('Extension type is required (demo|stark_verify)');
  }

  return apiGet(`${TZE_GRAPH_BASE}/outputs/unspent-by-type`, {
    type,
    ...withPaginationDefaults(rest),
  });
}

/**
 * Get unspent TZE outputs by type and mode
 * @param {Object} params - Query parameters
 * @param {string} params.type - Extension type (demo|stark_verify)
 * @param {string} params.mode - Extension mode string (open|close for demo, initialize|verify for stark_verify)
 * @param {number} [params.limit=10] - Maximum number of outputs to return
 * @param {number} [params.offset=0] - Number of outputs to skip
 * @returns {Promise<Object>} Unspent TZE outputs matching type and mode
 */
export async function getUnspentTzeOutputsByTypeAndMode(params) {
  const { type, mode, ...rest } = params || {};

  if (!type) {
    throw new Error('Extension type is required');
  }
  if (!mode) {
    throw new Error('Extension mode is required');
  }

  return apiGet(`${TZE_GRAPH_BASE}/outputs/unspent-by-type-mode`, {
    type,
    mode,
    ...withPaginationDefaults(rest),
  });
}

/**
 * Get spent TZE outputs with pagination
 * @param {Object} params - Query parameters
 * @param {number} [params.limit=10] - Maximum number of outputs to return
 * @param {number} [params.offset=0] - Number of outputs to skip
 * @returns {Promise<Object>} Spent TZE outputs
 */
export async function getSpentTzeOutputs(params = {}) {
  return apiGet(`${TZE_GRAPH_BASE}/outputs/spent`, withPaginationDefaults(params));
}

/**
 * Get TZE outputs with value greater than or equal to minimum value
 * @param {Object} params - Query parameters
 * @param {number} [params.min_value=0] - Minimum value (default: 0)
 * @param {number} [params.limit=10] - Maximum number of outputs to return
 * @param {number} [params.offset=0] - Number of outputs to skip
 * @returns {Promise<Object>} TZE outputs matching the value filter
 */
export async function getTzeOutputsByValue(params = {}) {
  const { min_value = 0, ...rest } = params;

  return apiGet(`${TZE_GRAPH_BASE}/outputs/by-value`, {
    min_value,
    ...withPaginationDefaults(rest),
  });
}
