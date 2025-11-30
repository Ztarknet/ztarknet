import type { Transaction } from '../types/transaction';

interface RPCResponse<T> {
  jsonrpc: string;
  id: string;
  result?: T;
  error?: {
    code: number;
    message: string;
  };
}

interface ValuePool {
  id: string;
  valueDelta?: number;
}

export interface BlockData {
  hash: string;
  confirmations: number;
  size: number;
  height: number;
  version: number;
  merkleroot: string;
  tx: string[] | Transaction[];
  time: number;
  nonce: string;
  bits: string;
  difficulty: number;
  chainwork: string;
  previousblockhash?: string;
  nextblockhash?: string;
  valuePools?: ValuePool[];
}

// Use local API route to avoid CORS issues
const RPC_ENDPOINT = '/api/rpc';

// Export the actual RPC endpoint for display purposes
export const RPC_ENDPOINT_DISPLAY =
  process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://rpc.regtest.ztarknet.cash';

// Low-level RPC helper function
async function rpcCall<T>(method: string, params: unknown[] = []): Promise<T> {
  try {
    const response = await fetch(RPC_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '1.0',
        id: 'explorer',
        method: method,
        params: params,
      }),
    });

    const data = (await response.json()) as RPCResponse<T>;

    if (data.error) {
      throw new Error(data.error.message);
    }

    if (data.result === undefined) {
      throw new Error('No result in RPC response');
    }

    return data.result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('RPC Error:', error.message);
    } else {
      console.error('RPC Error:', error);
    }
    throw error;
  }
}

// High-level API functions

/**
 * Get the current block count (chain height)
 */
export async function getBlockCount(): Promise<number> {
  return await rpcCall<number>('getblockcount');
}

/**
 * Get block hash for a given height
 */
export async function getBlockHash(height: number | string): Promise<string> {
  const blockHeight = typeof height === 'string' ? Number.parseInt(height, 10) : height;
  return await rpcCall<string>('getblockhash', [blockHeight]);
}

/**
 * Get block data by hash
 */
export async function getBlock(blockHash: string, verbosity = 1): Promise<BlockData> {
  return await rpcCall<BlockData>('getblock', [blockHash, verbosity]);
}

/**
 * Get block data by height
 */
export async function getBlockByHeight(height: number | string, verbosity = 1): Promise<BlockData> {
  const blockHash = await getBlockHash(height);
  return await getBlock(blockHash, verbosity);
}

/**
 * Get raw transaction data
 */
export async function getRawTransaction(txid: string, verbose = 1): Promise<Transaction> {
  return await rpcCall<Transaction>('getrawtransaction', [txid, verbose]);
}

/**
 * Get multiple blocks by heights
 */
export async function getBlocks(heights: number[], verbosity = 1): Promise<BlockData[]> {
  const promises = heights.map((height: number) =>
    getBlockHash(height).then((hash: string) => getBlock(hash, verbosity))
  );
  return await Promise.all(promises);
}

// Export display endpoint for UI
export { RPC_ENDPOINT_DISPLAY as RPC_ENDPOINT };
