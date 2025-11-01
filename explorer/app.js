const { useState, useEffect } = React;

const RPC_ENDPOINT = 'https://rpc.regtest.ztarknet.cash';
const POLL_INTERVAL = 10000; // 10 seconds
const MAX_BLOCKS = 10;

// RPC helper function
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

// Format time helper
function formatTime(timestamp) {
  // Zcash timestamps are in seconds (Unix epoch)
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  
  // Handle future blocks (clock skew)
  if (diffSec < 0) {
    return 'just now';
  }
  
  // Use relative time for recent blocks
  if (diffSec < 60) return `${diffSec} sec ago`;
  if (diffSec < 120) return `1 min ago`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} mins ago`;
  if (diffSec < 7200) return `1 hour ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hours ago`;
  if (diffSec < 172800) return `1 day ago`;
  if (diffSec < 2592000) return `${Math.floor(diffSec / 86400)} days ago`;
  
  // For very old blocks (> 30 days), show full date and time
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Format hash helper
function formatHash(hash) {
  if (!hash) return '';
  return `${hash.slice(0, 16)}...${hash.slice(-16)}`;
}

// Count TZE transactions in a block
function countTZETransactions(block) {
  // TZE transactions will have specific markers
  // For now, we'll look for transactions with "tze" field
  // This will be expanded when we know the exact format
  if (!block.tx) return 0;
  
  let count = 0;
  for (const tx of block.tx) {
    // If tx is a string (just txid), we can't determine TZE status without full tx data
    // If tx is an object with tze field, count it
    if (typeof tx === 'object' && tx.tze) {
      count++;
    }
  }
  return count;
}

function App() {
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
      const startHeight = Math.max(0, blockCount - MAX_BLOCKS);
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
    const interval = setInterval(fetchBlocks, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [lastBlockHeight]);

  if (loading) {
    return (
      <div className="explorer-container">
        <div className="loading">Loading blocks from the network...</div>
      </div>
    );
  }

  return (
    <div className="explorer-container">
      {error && (
        <div className="error">
          Error: {error}
          <br />
          Make sure the RPC endpoint is accessible.
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Chain Height</span>
          <div className="stat-value">{chainHeight.toLocaleString()}</div>
          <div className="stat-description">Total blocks mined</div>
        </div>
        
        <div className="stat-card">
          <span className="stat-label">Network Upgrade</span>
          <div className="stat-value">ZFuture</div>
          <div className="stat-description">Latest protocol version</div>
        </div>
        
        <div className="stat-card">
          <span className="stat-label">Transaction Version</span>
          <div className="stat-value">V6</div>
          <div className="stat-description">Current tx format</div>
        </div>
      </div>

      <h2 className="section-title">Latest Blocks</h2>
      <div className="blocks-container">
        {blocks.map((block, index) => {
          const totalTx = block.tx ? block.tx.length : 0;
          const tzeTx = countTZETransactions(block);
          
          return (
            <div 
              key={block.hash} 
              className={`block-card ${block.isNew ? 'new-block' : ''}`}
            >
              <div className="block-info">
                <span className="block-height">Block #{block.height.toLocaleString()}</span>
                <span className="block-time">{formatTime(block.time)}</span>
              </div>
              
              <div className="block-detail">
                <span className="block-detail-label">Hash</span>
                <span className="block-hash" title={block.hash}>
                  {block.hash}
                </span>
              </div>
              
              <div className="block-details">
                <div className="block-detail">
                  <span className="block-detail-label">Transactions</span>
                  <span className="block-detail-value">
                    {totalTx} total / {tzeTx} TZE
                  </span>
                </div>
                
                <div className="block-detail">
                  <span className="block-detail-label">Size</span>
                  <span className="block-detail-value">
                    {block.size ? `${block.size.toLocaleString()} B` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="developer-info">
        <h2>Developer Information</h2>
        
        <div className="info-item">
          <span className="info-label">RPC Endpoint</span>
          <div className="info-value">
            <code>{RPC_ENDPOINT}</code>
          </div>
        </div>
        
        <div className="info-item">
          <span className="info-label">Default Miner Address</span>
          <div className="info-value">
            Use the default mnemonic to claim coinbase rewards. This serves as a faucet for developers 
            testing on the network. All miners use the same coinbase address by default, allowing you 
            to claim rewards using the shared mnemonic phrase.
          </div>
        </div>
        
        <div className="info-item">
          <span className="info-label">Network Type</span>
          <div className="info-value">
            <code>regtest</code> - Regression test network for development
          </div>
        </div>
      </div>
    </div>
  );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

