const RPC_ENDPOINT = import.meta.env.VITE_RPC_ENDPOINT || 'https://rpc.regtest.ztarknet.cash';

// Low-level RPC helper function
async function rpcCall(method, params = []) {
  try {
    const response = await fetch(RPC_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({
        jsonrpc: '1.0',
        id: 'explorer',
        method: method,
        params: params,
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.result;
  } catch (error) {
    console.error('RPC Error:', error);
    throw error;
  }
}

// High-level API functions

/**
 * Get the current block count (chain height)
 * @returns {Promise<number>} The current block height
 */
export async function getBlockCount() {
  return await rpcCall('getblockcount');
}

/**
 * Get block hash for a given height
 * @param {number} height - The block height
 * @returns {Promise<string>} The block hash
 */
export async function getBlockHash(height) {
  const blockHeight = typeof height === 'string' ? parseInt(height, 10) : height;
  return await rpcCall('getblockhash', [blockHeight]);
}

/**
 * Get block data by hash
 * @param {string} blockHash - The block hash
 * @param {number} verbosity - Verbosity level (0=hex, 1=json, 2=json with tx data)
 * @returns {Promise<object>} The block data
 */
export async function getBlock(blockHash, verbosity = 1) {
  return await rpcCall('getblock', [blockHash, verbosity]);
}

/**
 * Get block data by height
 * @param {number} height - The block height
 * @param {number} verbosity - Verbosity level (0=hex, 1=json, 2=json with tx data)
 * @returns {Promise<object>} The block data
 */
export async function getBlockByHeight(height, verbosity = 1) {
  const blockHash = await getBlockHash(height);
  return await getBlock(blockHash, verbosity);
}

/**
 * Get raw transaction data
 * @param {string} txid - The transaction ID
 * @param {number} verbose - 0 for hex string, 1 for decoded JSON
 * @returns {Promise<object|string>} The transaction data
 */
export async function getRawTransaction(txid, verbose = 1) {
  return await rpcCall('getrawtransaction', [txid, verbose]);
}

/**
 * Get multiple blocks by heights
 * @param {number[]} heights - Array of block heights
 * @param {number} verbosity - Verbosity level
 * @returns {Promise<object[]>} Array of block data
 */
export async function getBlocks(heights, verbosity = 1) {
  const promises = heights.map(height =>
    getBlockHash(height)
      .then(hash => getBlock(hash, verbosity))
  );
  return await Promise.all(promises);
}

export { RPC_ENDPOINT };
