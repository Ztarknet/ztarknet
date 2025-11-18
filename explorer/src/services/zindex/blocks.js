/**
 * Zindex API - Blocks Module
 *
 * Functions for interacting with block-related endpoints.
 */

import { API_BASE, apiGet, withPaginationDefaults } from './zindex.js';

const BLOCKS_BASE = `${API_BASE}/blocks`;

/**
 * Get all blocks with pagination
 * @param {Object} params - Query parameters
 * @param {number} [params.limit=10] - Maximum number of blocks to return
 * @param {number} [params.offset=0] - Number of blocks to skip
 * @returns {Promise<Object>} Paginated blocks data
 */
export async function getAllBlocks(params = {}) {
  return apiGet(BLOCKS_BASE, withPaginationDefaults(params));
}

/**
 * Get a single block by height
 * @param {number} height - Block height
 * @returns {Promise<Object>} Block data
 */
export async function getBlockByHeight(height) {
  if (height === undefined || height === null) {
    throw new Error('Block height is required');
  }
  return apiGet(`${BLOCKS_BASE}/block`, { height });
}

/**
 * Get a single block by hash
 * @param {string} hash - Block hash
 * @returns {Promise<Object>} Block data
 */
export async function getBlockByHash(hash) {
  if (!hash) {
    throw new Error('Block hash is required');
  }
  return apiGet(`${BLOCKS_BASE}/by-hash`, { hash });
}

/**
 * Get blocks within a height range
 * @param {Object} params - Query parameters
 * @param {number} params.from_height - Starting block height (inclusive)
 * @param {number} params.to_height - Ending block height (inclusive)
 * @param {number} [params.limit=10] - Maximum number of blocks to return
 * @param {number} [params.offset=0] - Number of blocks to skip
 * @returns {Promise<Object>} Blocks in the specified range
 */
export async function getBlocksByHeightRange(params) {
  const { from_height, to_height, ...rest } = params || {};

  if (from_height === undefined || from_height === null) {
    throw new Error('from_height is required');
  }
  if (to_height === undefined || to_height === null) {
    throw new Error('to_height is required');
  }

  return apiGet(`${BLOCKS_BASE}/range`, {
    from_height,
    to_height,
    ...withPaginationDefaults(rest),
  });
}

/**
 * Get blocks within a timestamp range
 * @param {Object} params - Query parameters
 * @param {number} params.from_timestamp - Starting timestamp (Unix epoch)
 * @param {number} params.to_timestamp - Ending timestamp (Unix epoch)
 * @param {number} [params.limit=10] - Maximum number of blocks to return
 * @param {number} [params.offset=0] - Number of blocks to skip
 * @returns {Promise<Object>} Blocks in the specified timeframe
 */
export async function getBlocksByTimestampRange(params) {
  const { from_timestamp, to_timestamp, ...rest } = params || {};

  if (from_timestamp === undefined || from_timestamp === null) {
    throw new Error('from_timestamp is required');
  }
  if (to_timestamp === undefined || to_timestamp === null) {
    throw new Error('to_timestamp is required');
  }

  return apiGet(`${BLOCKS_BASE}/timestamp-range`, {
    from_timestamp,
    to_timestamp,
    ...withPaginationDefaults(rest),
  });
}

/**
 * Get the most recent blocks
 * @param {Object} params - Query parameters
 * @param {number} [params.limit=10] - Maximum number of blocks to return
 * @returns {Promise<Object>} Latest blocks
 */
export async function getRecentBlocks(params = {}) {
  return apiGet(`${BLOCKS_BASE}/recent`, {
    limit: params.limit ?? 10,
  });
}

/**
 * Get the total count of blocks in the chain
 * @returns {Promise<Object>} Total block count
 */
export async function getBlockCount() {
  return apiGet(`${BLOCKS_BASE}/count`);
}

/**
 * Get the latest block
 * @returns {Promise<Object>} Most recent block data
 */
export async function getLatestBlock() {
  return apiGet(`${BLOCKS_BASE}/latest`);
}
