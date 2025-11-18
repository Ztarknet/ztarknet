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
 * Get all TZE inputs with pagination
 * @param {Object} params - Query parameters
 * @param {number} [params.limit=10] - Maximum number of inputs to return
 * @param {number} [params.offset=0] - Number of inputs to skip
 * @returns {Promise<Object>} Paginated TZE inputs
 */
export async function getTzeInputs(params = {}) {
  return apiGet(`${TZE_GRAPH_BASE}/inputs`, withPaginationDefaults(params));
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
 * @param {string} type - Extension type
 * @returns {Promise<Object>} TZE inputs of the specified type
 */
export async function getTzeInputsByType(type) {
  if (!type) {
    throw new Error('Extension type is required');
  }
  return apiGet(`${TZE_GRAPH_BASE}/inputs/by-type`, { type });
}

/**
 * Get TZE inputs by mode
 * @param {string} mode - Extension mode
 * @returns {Promise<Object>} TZE inputs of the specified mode
 */
export async function getTzeInputsByMode(mode) {
  if (!mode) {
    throw new Error('Extension mode is required');
  }
  return apiGet(`${TZE_GRAPH_BASE}/inputs/by-mode`, { mode });
}

/**
 * Get TZE inputs by type and mode
 * @param {Object} params - Query parameters
 * @param {string} params.type - Extension type
 * @param {string} params.mode - Extension mode
 * @returns {Promise<Object>} TZE inputs matching type and mode
 */
export async function getTzeInputsByTypeAndMode(params) {
  const { type, mode } = params || {};

  if (!type) {
    throw new Error('Extension type is required');
  }
  if (!mode) {
    throw new Error('Extension mode is required');
  }

  return apiGet(`${TZE_GRAPH_BASE}/inputs/by-type-mode`, { type, mode });
}

/**
 * Get TZE inputs that spend a specific previous output
 * @param {Object} params - Query parameters
 * @param {string} params.txid - Previous output transaction ID
 * @param {number} params.vout - Previous output index
 * @returns {Promise<Object>} TZE inputs spending the output
 */
export async function getTzeInputsByPrevOutput(params) {
  const { txid, vout } = params || {};

  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  if (vout === undefined || vout === null) {
    throw new Error('Output index (vout) is required');
  }

  return apiGet(`${TZE_GRAPH_BASE}/inputs/by-prev-output`, { prev_txid: txid, prev_vout: vout });
}

// ==================== TZE Outputs ====================

/**
 * Get all TZE outputs with pagination
 * @param {Object} params - Query parameters
 * @param {number} [params.limit=10] - Maximum number of outputs to return
 * @param {number} [params.offset=0] - Number of outputs to skip
 * @returns {Promise<Object>} Paginated TZE outputs
 */
export async function getTzeOutputs(params = {}) {
  return apiGet(`${TZE_GRAPH_BASE}/outputs`, withPaginationDefaults(params));
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
 * @param {string} type - Extension type
 * @returns {Promise<Object>} TZE outputs of the specified type
 */
export async function getTzeOutputsByType(type) {
  if (!type) {
    throw new Error('Extension type is required');
  }
  return apiGet(`${TZE_GRAPH_BASE}/outputs/by-type`, { type });
}

/**
 * Get TZE outputs by mode
 * @param {string} mode - Extension mode
 * @returns {Promise<Object>} TZE outputs of the specified mode
 */
export async function getTzeOutputsByMode(mode) {
  if (!mode) {
    throw new Error('Extension mode is required');
  }
  return apiGet(`${TZE_GRAPH_BASE}/outputs/by-mode`, { mode });
}

/**
 * Get TZE outputs by type and mode
 * @param {Object} params - Query parameters
 * @param {string} params.type - Extension type
 * @param {string} params.mode - Extension mode
 * @returns {Promise<Object>} TZE outputs matching type and mode
 */
export async function getTzeOutputsByTypeAndMode(params) {
  const { type, mode } = params || {};

  if (!type) {
    throw new Error('Extension type is required');
  }
  if (!mode) {
    throw new Error('Extension mode is required');
  }

  return apiGet(`${TZE_GRAPH_BASE}/outputs/by-type-mode`, { type, mode });
}

/**
 * Get unspent TZE outputs by extension type
 * @param {string} type - Extension type
 * @returns {Promise<Object>} Unspent TZE outputs of the specified type
 */
export async function getUnspentTzeOutputsByType(type) {
  if (!type) {
    throw new Error('Extension type is required');
  }
  return apiGet(`${TZE_GRAPH_BASE}/outputs/unspent-by-type`, { type });
}

/**
 * Get unspent TZE outputs by type and mode
 * @param {Object} params - Query parameters
 * @param {string} params.type - Extension type
 * @param {string} params.mode - Extension mode
 * @returns {Promise<Object>} Unspent TZE outputs matching type and mode
 */
export async function getUnspentTzeOutputsByTypeAndMode(params) {
  const { type, mode } = params || {};

  if (!type) {
    throw new Error('Extension type is required');
  }
  if (!mode) {
    throw new Error('Extension mode is required');
  }

  return apiGet(`${TZE_GRAPH_BASE}/outputs/unspent-by-type-mode`, { type, mode });
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
 * Get TZE outputs within a value range
 * @param {Object} params - Query parameters
 * @param {number} params.min_value - Minimum value
 * @param {number} params.max_value - Maximum value
 * @returns {Promise<Object>} TZE outputs in the value range
 */
export async function getTzeOutputsByValue(params) {
  const { min_value, max_value } = params || {};

  if (min_value === undefined || min_value === null) {
    throw new Error('min_value is required');
  }
  if (max_value === undefined || max_value === null) {
    throw new Error('max_value is required');
  }

  return apiGet(`${TZE_GRAPH_BASE}/outputs/by-value`, { min_value, max_value });
}
