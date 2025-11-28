/**
 * Zindex API - Blocks Module
 *
 * Functions for interacting with block-related endpoints.
 */

import type { BlockSummary, PaginationParams } from '../../types/zindex';
import { API_BASE, apiGet, withPaginationDefaults } from './zindex';

const BLOCKS_BASE = `${API_BASE}/blocks`;

/**
 * Get all blocks with pagination
 */
export async function getAllBlocks(params: PaginationParams = {}): Promise<BlockSummary[]> {
  return apiGet<BlockSummary[]>(BLOCKS_BASE, withPaginationDefaults(params));
}

/**
 * Get a single block by height
 */
export async function getBlockByHeight(height: number): Promise<BlockSummary> {
  if (height === undefined || height === null) {
    throw new Error('Block height is required');
  }
  return apiGet<BlockSummary>(`${BLOCKS_BASE}/block`, { height });
}

/**
 * Get a single block by hash
 */
export async function getBlockByHash(hash: string): Promise<BlockSummary> {
  if (!hash) {
    throw new Error('Block hash is required');
  }
  return apiGet<BlockSummary>(`${BLOCKS_BASE}/by-hash`, { hash });
}

interface HeightRangeParams extends PaginationParams {
  from_height: number;
  to_height: number;
}

/**
 * Get blocks within a height range
 */
export async function getBlocksByHeightRange(params: HeightRangeParams): Promise<BlockSummary[]> {
  const { from_height, to_height, ...rest } = params;

  if (from_height === undefined || from_height === null) {
    throw new Error('from_height is required');
  }
  if (to_height === undefined || to_height === null) {
    throw new Error('to_height is required');
  }

  return apiGet<BlockSummary[]>(`${BLOCKS_BASE}/range`, {
    from_height,
    to_height,
    ...withPaginationDefaults(rest),
  });
}

interface TimestampRangeParams extends PaginationParams {
  from_timestamp: number;
  to_timestamp: number;
}

/**
 * Get blocks within a timestamp range
 */
export async function getBlocksByTimestampRange(
  params: TimestampRangeParams
): Promise<BlockSummary[]> {
  const { from_timestamp, to_timestamp, ...rest } = params;

  if (from_timestamp === undefined || from_timestamp === null) {
    throw new Error('from_timestamp is required');
  }
  if (to_timestamp === undefined || to_timestamp === null) {
    throw new Error('to_timestamp is required');
  }

  return apiGet<BlockSummary[]>(`${BLOCKS_BASE}/timestamp-range`, {
    from_timestamp,
    to_timestamp,
    ...withPaginationDefaults(rest),
  });
}

/**
 * Get the most recent blocks
 */
export async function getRecentBlocks(params: PaginationParams = {}): Promise<BlockSummary[]> {
  return apiGet<BlockSummary[]>(`${BLOCKS_BASE}/recent`, {
    limit: params.limit ?? 10,
  });
}

interface BlockCount {
  count: number;
}

/**
 * Get the total count of blocks in the chain
 */
export async function getBlockCount(): Promise<BlockCount> {
  return apiGet<BlockCount>(`${BLOCKS_BASE}/count`);
}

/**
 * Get the latest block
 */
export async function getLatestBlock(): Promise<BlockSummary> {
  return apiGet<BlockSummary>(`${BLOCKS_BASE}/latest`);
}
