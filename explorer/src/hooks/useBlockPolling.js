import { useState, useEffect } from 'react';
import { rpcCall } from '@services/rpc';

export function useBlockPolling(maxBlocks = 5, pollInterval = 1000) {
  const [blocks, setBlocks] = useState([]);
  const [chainHeight, setChainHeight] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastBlockHeight, setLastBlockHeight] = useState(0);

  // Fetch blocks function
  async function fetchBlocks() {
    try {
      // Get current block count
      const blockCount = await rpcCall('getblockcount');
      setChainHeight(blockCount);

      // Fetch the latest MAX_BLOCKS blocks
      const startHeight = Math.max(0, blockCount - maxBlocks);
      const blockPromises = [];

      for (let i = blockCount; i > startHeight; i--) {
        blockPromises.push(
          rpcCall('getblockhash', [i])
            .then(hash => rpcCall('getblock', [hash, 1]))
        );
      }

      const fetchedBlocks = await Promise.all(blockPromises);

      // Check if there are new blocks
      if (lastBlockHeight > 0 && blockCount > lastBlockHeight) {
        // Mark new blocks
        const newBlocksCount = blockCount - lastBlockHeight;
        fetchedBlocks.slice(0, newBlocksCount).forEach(block => {
          block.isNew = true;
        });
      }

      setBlocks(fetchedBlocks);
      setLastBlockHeight(blockCount);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching blocks:', err);
      setError(err.message);
      setLoading(false);
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchBlocks();
  }, []);

  // Polling
  useEffect(() => {
    const interval = setInterval(fetchBlocks, pollInterval);
    return () => clearInterval(interval);
  }, [lastBlockHeight]);

  return { blocks, chainHeight, loading, error };
}
