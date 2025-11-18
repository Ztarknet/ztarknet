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
  return apiGet(`${STARKS_BASE}/verifier-by-name`, { name });
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
  return apiGet(`${STARKS_BASE}/verifiers-by-balance`, withPaginationDefaults(params));
}

// ==================== STARK Proofs ====================

/**
 * Get a specific STARK proof by ID
 * @param {string} proof_id - Proof ID
 * @returns {Promise<Object>} STARK proof data
 */
export async function getStarkProof(proof_id) {
  if (!proof_id) {
    throw new Error('Proof ID is required');
  }
  return apiGet(`${STARKS_BASE}/proof`, { proof_id });
}

/**
 * Get all STARK proofs for a specific verifier
 * @param {string} verifier_id - Verifier ID
 * @returns {Promise<Object>} STARK proofs for the verifier
 */
export async function getStarkProofsByVerifier(verifier_id) {
  if (!verifier_id) {
    throw new Error('Verifier ID is required');
  }
  return apiGet(`${STARKS_BASE}/proofs-by-verifier`, { verifier_id });
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
  return apiGet(`${STARKS_BASE}/proofs-by-block`, { block_height });
}

/**
 * Get recent STARK proofs
 * @param {Object} params - Query parameters
 * @param {number} [params.limit=10] - Maximum number of proofs to return
 * @returns {Promise<Object>} Recent STARK proofs
 */
export async function getRecentStarkProofs(params = {}) {
  return apiGet(`${STARKS_BASE}/proofs-recent`, {
    limit: params.limit ?? 10,
  });
}

/**
 * Get STARK proofs within a size range
 * @param {Object} params - Query parameters
 * @param {number} params.min_size - Minimum proof size
 * @param {number} params.max_size - Maximum proof size
 * @returns {Promise<Object>} STARK proofs in the size range
 */
export async function getStarkProofsBySize(params) {
  const { min_size, max_size } = params || {};

  if (min_size === undefined || min_size === null) {
    throw new Error('min_size is required');
  }
  if (max_size === undefined || max_size === null) {
    throw new Error('max_size is required');
  }

  return apiGet(`${STARKS_BASE}/proofs-by-size`, { min_size, max_size });
}

// ==================== Ztarknet Facts ====================

/**
 * Get all Ztarknet facts with pagination
 * @param {Object} params - Query parameters
 * @param {number} [params.limit=10] - Maximum number of facts to return
 * @param {number} [params.offset=0] - Number of facts to skip
 * @returns {Promise<Object>} Paginated Ztarknet facts
 */
export async function getZtarknetFacts(params = {}) {
  return apiGet(`${STARKS_BASE}/facts`, withPaginationDefaults(params));
}

/**
 * Get facts by verifier
 * @param {string} verifier_id - Verifier ID
 * @returns {Promise<Object>} Facts for the verifier
 */
export async function getFactsByVerifier(verifier_id) {
  if (!verifier_id) {
    throw new Error('Verifier ID is required');
  }
  return apiGet(`${STARKS_BASE}/facts-by-verifier`, { verifier_id });
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
  return apiGet(`${STARKS_BASE}/facts-by-transaction`, { txid });
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
  return apiGet(`${STARKS_BASE}/facts-by-block`, { block_height });
}

/**
 * Get facts by state
 * @param {string} state - State value
 * @returns {Promise<Object>} Facts with the specified state
 */
export async function getFactsByState(state) {
  if (!state) {
    throw new Error('State is required');
  }
  return apiGet(`${STARKS_BASE}/facts-by-state`, { state });
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
  return apiGet(`${STARKS_BASE}/facts-by-program-hash`, { program_hash });
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
  return apiGet(`${STARKS_BASE}/facts-by-inner-program-hash`, { inner_program_hash });
}

/**
 * Get recent facts
 * @param {Object} params - Query parameters
 * @param {number} [params.limit=10] - Maximum number of facts to return
 * @returns {Promise<Object>} Recent facts
 */
export async function getRecentFacts(params = {}) {
  return apiGet(`${STARKS_BASE}/facts-recent`, {
    limit: params.limit ?? 10,
  });
}

/**
 * Get state transition information
 * @param {Object} params - Query parameters
 * @param {string} params.from_state - Starting state
 * @param {string} params.to_state - Ending state
 * @returns {Promise<Object>} State transition data
 */
export async function getStateTransition(params) {
  const { from_state, to_state } = params || {};

  if (!from_state) {
    throw new Error('from_state is required');
  }
  if (!to_state) {
    throw new Error('to_state is required');
  }

  return apiGet(`${STARKS_BASE}/state-transition`, { from_state, to_state });
}
