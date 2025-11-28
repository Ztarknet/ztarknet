/**
 * Zindex API - STARKS Module
 *
 * Functions for interacting with STARK-related endpoints.
 * Includes verifiers, STARK proofs, and Ztarknet facts.
 */

import { API_BASE, apiGet, withPaginationDefaults } from './zindex.js';

const STARKS_BASE = `${API_BASE}/starks`;

// ==================== Verifiers ====================

/**
 * Get a specific verifier by ID
 * @param {string} verifier_id - Verifier ID
 * @returns {Promise<Object>} Verifier data
 */
export async function getVerifier(verifier_id) {
  if (!verifier_id) {
    throw new Error('Verifier ID is required');
  }
  return apiGet(`${STARKS_BASE}/verifiers/verifier`, { verifier_id });
}

/**
 * Get a verifier by name
 * @param {string} name - Verifier name
 * @returns {Promise<Object>} Verifier data
 */
export async function getVerifierByName(name) {
  if (!name) {
    throw new Error('Verifier name is required');
  }
  return apiGet(`${STARKS_BASE}/verifiers/by-name`, { verifier_name: name });
}

/**
 * Get all verifiers with pagination
 * @param {Object} params - Query parameters
 * @param {number} [params.limit=10] - Maximum number of verifiers to return
 * @param {number} [params.offset=0] - Number of verifiers to skip
 * @returns {Promise<Object>} Paginated verifiers
 */
export async function getAllVerifiers(params = {}) {
  return apiGet(`${STARKS_BASE}/verifiers`, withPaginationDefaults(params));
}

/**
 * Get verifiers sorted by balance
 * @param {Object} params - Query parameters
 * @param {number} [params.limit=10] - Maximum number of verifiers to return
 * @param {number} [params.offset=0] - Number of verifiers to skip
 * @returns {Promise<Object>} Verifiers sorted by balance
 */
export async function getVerifiersByBalance(params = {}) {
  return apiGet(`${STARKS_BASE}/verifiers/by-balance`, withPaginationDefaults(params));
}

// ==================== STARK Proofs ====================

/**
 * Get a specific STARK proof by verifier ID and transaction ID
 * @param {Object} params - Query parameters
 * @param {string} params.verifier_id - Verifier ID
 * @param {string} params.txid - Transaction ID
 * @returns {Promise<Object>} STARK proof data
 */
export async function getStarkProof(params) {
  const { verifier_id, txid } = params || {};
  if (!verifier_id) {
    throw new Error('Verifier ID is required');
  }
  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  return apiGet(`${STARKS_BASE}/proofs/proof`, { verifier_id, txid });
}

/**
 * Get all STARK proofs for a specific verifier
 * @param {string} verifier_id - Verifier ID
 * @param {Object} params - Optional pagination parameters
 * @param {number} [params.limit] - Maximum number of proofs to return
 * @param {number} [params.offset] - Number of proofs to skip
 * @returns {Promise<Object>} STARK proofs for the verifier
 */
export async function getStarkProofsByVerifier(verifier_id, params = {}) {
  if (!verifier_id) {
    throw new Error('Verifier ID is required');
  }
  return apiGet(`${STARKS_BASE}/proofs/by-verifier`, { verifier_id, ...params });
}

/**
 * Get all STARK proofs in a specific transaction
 * @param {string} txid - Transaction ID
 * @returns {Promise<Object>} STARK proofs in the transaction
 */
export async function getStarkProofsByTransaction(txid) {
  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  return apiGet(`${STARKS_BASE}/proofs/by-transaction`, { txid });
}

/**
 * Get all STARK proofs in a specific block
 * @param {number} block_height - Block height
 * @returns {Promise<Object>} STARK proofs in the block
 */
export async function getStarkProofsByBlock(block_height) {
  if (block_height === undefined || block_height === null) {
    throw new Error('Block height is required');
  }
  return apiGet(`${STARKS_BASE}/proofs/by-block`, { block_height });
}

/**
 * Get recent STARK proofs
 * @param {Object} params - Query parameters
 * @param {number} [params.limit] - Maximum number of proofs to return
 * @param {number} [params.offset] - Number of proofs to skip
 * @returns {Promise<Object>} Recent STARK proofs
 */
export async function getRecentStarkProofs(params = {}) {
  return apiGet(`${STARKS_BASE}/proofs/recent`, withPaginationDefaults(params));
}

/**
 * Get STARK proofs within a size range
 * @param {Object} params - Query parameters
 * @param {number} [params.min_size] - Minimum proof size (default: 0)
 * @param {number} params.max_size - Maximum proof size
 * @param {number} [params.limit] - Maximum number of proofs to return
 * @param {number} [params.offset] - Number of proofs to skip
 * @returns {Promise<Object>} STARK proofs in the size range
 */
export async function getStarkProofsBySize(params) {
  const { min_size, max_size, ...rest } = params || {};

  if (max_size === undefined || max_size === null) {
    throw new Error('max_size is required');
  }

  return apiGet(`${STARKS_BASE}/proofs/by-size`, {
    min_size: min_size ?? 0,
    max_size,
    ...withPaginationDefaults(rest)
  });
}

// ==================== Ztarknet Facts ====================

/**
 * Get Ztarknet facts by verifier ID and transaction ID
 * @param {Object} params - Query parameters
 * @param {string} params.verifier_id - Verifier ID
 * @param {string} params.txid - Transaction ID
 * @returns {Promise<Object>} Ztarknet facts
 */
export async function getZtarknetFacts(params) {
  const { verifier_id, txid } = params || {};
  if (!verifier_id) {
    throw new Error('Verifier ID is required');
  }
  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  return apiGet(`${STARKS_BASE}/facts/facts`, { verifier_id, txid });
}

/**
 * Get facts by verifier
 * @param {string} verifier_id - Verifier ID
 * @param {Object} params - Optional pagination parameters
 * @param {number} [params.limit] - Maximum number of facts to return
 * @param {number} [params.offset] - Number of facts to skip
 * @returns {Promise<Object>} Facts for the verifier
 */
export async function getFactsByVerifier(verifier_id, params = {}) {
  if (!verifier_id) {
    throw new Error('Verifier ID is required');
  }
  return apiGet(`${STARKS_BASE}/facts/by-verifier`, { verifier_id, ...params });
}

/**
 * Get facts by transaction
 * @param {string} txid - Transaction ID
 * @returns {Promise<Object>} Facts in the transaction
 */
export async function getFactsByTransaction(txid) {
  if (!txid) {
    throw new Error('Transaction ID is required');
  }
  return apiGet(`${STARKS_BASE}/facts/by-transaction`, { txid });
}

/**
 * Get facts by block
 * @param {number} block_height - Block height
 * @returns {Promise<Object>} Facts in the block
 */
export async function getFactsByBlock(block_height) {
  if (block_height === undefined || block_height === null) {
    throw new Error('Block height is required');
  }
  return apiGet(`${STARKS_BASE}/facts/by-block`, { block_height });
}

/**
 * Get facts by state
 * @param {string} state_hash - State hash
 * @returns {Promise<Object>} Facts with the specified state
 */
export async function getFactsByState(state_hash) {
  if (!state_hash) {
    throw new Error('State hash is required');
  }
  return apiGet(`${STARKS_BASE}/facts/by-state`, { state_hash });
}

/**
 * Get facts by program hash
 * @param {string} program_hash - Program hash
 * @returns {Promise<Object>} Facts with the specified program hash
 */
export async function getFactsByProgramHash(program_hash) {
  if (!program_hash) {
    throw new Error('Program hash is required');
  }
  return apiGet(`${STARKS_BASE}/facts/by-program-hash`, { program_hash });
}

/**
 * Get facts by inner program hash
 * @param {string} inner_program_hash - Inner program hash
 * @returns {Promise<Object>} Facts with the specified inner program hash
 */
export async function getFactsByInnerProgramHash(inner_program_hash) {
  if (!inner_program_hash) {
    throw new Error('Inner program hash is required');
  }
  return apiGet(`${STARKS_BASE}/facts/by-inner-program-hash`, { inner_program_hash });
}

/**
 * Get recent facts
 * @param {Object} params - Query parameters
 * @param {number} [params.limit] - Maximum number of facts to return
 * @param {number} [params.offset] - Number of facts to skip
 * @returns {Promise<Object>} Recent facts
 */
export async function getRecentFacts(params = {}) {
  return apiGet(`${STARKS_BASE}/facts/recent`, withPaginationDefaults(params));
}

/**
 * Get state transition information
 * @param {Object} params - Query parameters
 * @param {string} params.old_state - Old state hash
 * @param {string} params.new_state - New state hash
 * @returns {Promise<Object>} State transition data
 */
export async function getStateTransition(params) {
  const { old_state, new_state } = params || {};

  if (!old_state) {
    throw new Error('old_state is required');
  }
  if (!new_state) {
    throw new Error('new_state is required');
  }

  return apiGet(`${STARKS_BASE}/facts/state-transition`, { old_state, new_state });
}

// ==================== Count ====================

/**
 * Count total verifiers
 * @returns {Promise<Object>} Verifier count
 */
export async function countVerifiers() {
  return apiGet(`${STARKS_BASE}/verifiers/count`);
}

/**
 * Count STARK proofs with optional filters
 * @param {Object} params - Query parameters
 * @param {string} [params.verifier_id] - Filter by verifier ID
 * @param {number} [params.block_height] - Filter by block height
 * @returns {Promise<Object>} STARK proof count
 */
export async function countStarkProofs(params = {}) {
  return apiGet(`${STARKS_BASE}/proofs/count`, params);
}

/**
 * Count Ztarknet facts with optional filters
 * @param {Object} params - Query parameters
 * @param {string} [params.verifier_id] - Filter by verifier ID
 * @param {number} [params.block_height] - Filter by block height
 * @returns {Promise<Object>} Ztarknet facts count
 */
export async function countFacts(params = {}) {
  return apiGet(`${STARKS_BASE}/facts/count`, params);
}

// ==================== Aggregations ====================

/**
 * Get sum of all proof sizes for a verifier
 * @param {string} verifier_id - Verifier ID
 * @returns {Promise<Object>} Total proof size data
 */
export async function getSumProofSizesByVerifier(verifier_id) {
  if (!verifier_id) {
    throw new Error('Verifier ID is required');
  }
  return apiGet(`${STARKS_BASE}/verifier/sum-proof-sizes`, { verifier_id });
}
