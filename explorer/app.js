const { useState, useEffect } = React;

const RPC_ENDPOINT = 'https://rpc.regtest.ztarknet.cash';
const POLL_INTERVAL = 1000; // 1 second
const MAX_BLOCKS = 5;

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

// Get block reward from valuePools
function getBlockReward(block) {
  if (!block.valuePools) return null;
  
  const transparentPool = block.valuePools.find(pool => pool.id === 'transparent');
  if (!transparentPool || transparentPool.valueDelta === undefined) return null;
  
  return transparentPool.valueDelta;
}

// Simple router component
function App() {
  const [route, setRoute] = useState(window.location.hash || '#/');
  
  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  // Parse route
  if (route.startsWith('#/block/')) {
    const blockId = route.replace('#/block/', '');
    return <BlockPage blockId={blockId} />;
  }
  
  return <MainPage />;
}

function MainPage() {
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
          const reward = getBlockReward(block);
          
          return (
            <a 
              key={block.hash}
              href={`#/block/${block.hash}`}
              className={`block-card ${block.isNew ? 'new-block' : ''}`}
            >
              <div className="block-info">
                <span className="block-height">Block #{block.height.toLocaleString()}</span>
                <span className="block-time">{formatTime(block.time)}</span>
              </div>
              
              <code className="block-hash" title={block.hash}>
                {block.hash}
              </code>
              
              <div className="block-details">
                <div className="block-detail">
                  <span className="block-detail-label">Transactions</span>
                  <span className="block-detail-value">
                    {totalTx}
                  </span>
                </div>
                
                <div className="block-detail">
                  <span className="block-detail-label">Reward</span>
                  <span className="block-detail-value">
                    {reward !== null ? `${reward} ZEC` : 'N/A'}
                  </span>
                </div>
                
                <div className="block-detail">
                  <span className="block-detail-label">Size</span>
                  <span className="block-detail-value">
                    {block.size ? `${block.size.toLocaleString()} B` : 'N/A'}
                  </span>
                </div>
              </div>
            </a>
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

// Block detail page
function BlockPage({ blockId }) {
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTx, setExpandedTx] = useState(null);
  
  useEffect(() => {
    async function fetchBlock() {
      try {
        setLoading(true);
        let blockHash = blockId;
        
        // If blockId is a number (height), get the hash first
        if (/^\d+$/.test(blockId)) {
          blockHash = await rpcCall('getblockhash', [parseInt(blockId)]);
        }
        
        // Fetch block with verbosity 2 (includes transaction data)
        const blockData = await rpcCall('getblock', [blockHash, 2]);
        setBlock(blockData);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error fetching block:', err);
        setError(err.message);
        setLoading(false);
      }
    }
    
    fetchBlock();
  }, [blockId]);
  
  if (loading) {
    return (
      <div className="explorer-container">
        <div className="loading">Loading block details...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="explorer-container">
        <div className="error">
          Error: {error}
          <br />
          <a href="#/" className="button secondary" style={{ marginTop: '20px', display: 'inline-flex' }}>
            Back to Home
          </a>
        </div>
      </div>
    );
  }
  
  if (!block) {
    return (
      <div className="explorer-container">
        <div className="error">Block not found</div>
      </div>
    );
  }
  
  const totalTx = block.tx ? block.tx.length : 0;
  const reward = getBlockReward(block);
  
  return (
    <div className="explorer-container">
      <div style={{ marginBottom: '24px' }}>
        <a href="#/" className="button ghost">← Back to Blocks</a>
      </div>
      
      <h2 className="section-title">Block #{block.height.toLocaleString()}</h2>
      <code className="hash-display">{block.hash}</code>
      
      {/* Block info cards */}
      <div className="stats-grid" style={{ marginBottom: '48px' }}>
        <div className="stat-card">
          <span className="stat-label">Block Height</span>
          <div className="stat-value" style={{ fontSize: '1.8rem' }}>{block.height.toLocaleString()}</div>
          <div className="stat-description">{formatTime(block.time)}</div>
        </div>
        
        <div className="stat-card">
          <span className="stat-label">Block Reward</span>
          <div className="stat-value" style={{ fontSize: '1.8rem' }}>{reward !== null ? `${reward}` : 'N/A'}</div>
          <div className="stat-description">ZEC</div>
        </div>
        
        <div className="stat-card">
          <span className="stat-label">Block Size</span>
          <div className="stat-value" style={{ fontSize: '1.8rem' }}>{block.size ? `${block.size.toLocaleString()}` : 'N/A'}</div>
          <div className="stat-description">Bytes</div>
        </div>
      </div>
      
      {/* Transactions list */}
      <h2 className="section-title">{totalTx} Transaction{totalTx !== 1 ? 's' : ''}</h2>
      <div className="transactions-container">
        {block.tx && block.tx.map((tx, index) => {
          const numInputs = tx.vin ? tx.vin.length : 0;
          const numOutputs = tx.vout ? tx.vout.length : 0;
          const totalOutput = tx.vout ? tx.vout.reduce((sum, out) => sum + (out.value || 0), 0) : 0;
          
          // Determine transaction kind (will be enhanced later)
          let txKind = 'standard';
          if (tx.vin && tx.vin.length > 0 && tx.vin[0].coinbase) {
            txKind = 'coinbase';
          }
          
          const isExpanded = expandedTx === tx.txid;
          
          return (
            <div key={tx.txid || index} className="tx-card-wrapper">
              <div 
                className="tx-card"
                onClick={() => setExpandedTx(isExpanded ? null : tx.txid)}
                style={{ cursor: 'pointer' }}
              >
                <span className="tx-kind">{txKind}</span>
                <code className="tx-hash" title={tx.txid}>{tx.txid}</code>
                <div className="tx-detail">
                  <span className="tx-detail-label">Inputs</span>
                  <span className="tx-detail-value">{numInputs}</span>
                </div>
                <div className="tx-detail">
                  <span className="tx-detail-label">Outputs</span>
                  <span className="tx-detail-value">{numOutputs}</span>
                </div>
                <div className="tx-detail">
                  <span className="tx-detail-label">Total Output</span>
                  <span className="tx-detail-value">{totalOutput.toFixed(8)} ZEC</span>
                </div>
                <div className="tx-detail">
                  <span className="tx-detail-label">Size</span>
                  <span className="tx-detail-value">{tx.size ? `${tx.size.toLocaleString()} B` : 'N/A'}</span>
                </div>
              </div>
              
              {isExpanded && (
                <div className="tx-expanded">
                  <div className="tx-io-container">
                    {/* Inputs */}
                    <div className="tx-io-column">
                      <h3 className="tx-io-title">Inputs ({numInputs})</h3>
                      <div className="tx-io-list">
                        {tx.vin && tx.vin.map((input, idx) => (
                          <div key={idx} className="tx-io-item">
                            <div className="tx-io-header">
                              <span className="tx-io-index">#{idx}</span>
                            </div>
                            {input.coinbase ? (
                              <div className="tx-io-field">
                                <span className="tx-io-label">Coinbase</span>
                                <code className="tx-io-value">{input.coinbase}</code>
                              </div>
                            ) : (
                              <>
                                <div className="tx-io-field">
                                  <span className="tx-io-label">Previous Output</span>
                                  <code className="tx-io-value">{input.txid}:{input.vout}</code>
                                </div>
                              </>
                            )}
                            <div className="tx-io-field">
                              <span className="tx-io-label">Sequence</span>
                              <span className="tx-io-value">{input.sequence}</span>
                            </div>
                            {input.scriptSig && (
                              <div className="tx-io-field">
                                <span className="tx-io-label">Script Size</span>
                                <span className="tx-io-value">{input.scriptSig.hex ? input.scriptSig.hex.length / 2 : 0} bytes</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Outputs */}
                    <div className="tx-io-column">
                      <h3 className="tx-io-title">Outputs ({numOutputs})</h3>
                      <div className="tx-io-list">
                        {tx.vout && tx.vout.map((output, idx) => (
                          <div key={idx} className="tx-io-item">
                            <div className="tx-io-header">
                              <span className="tx-io-index">#{output.n}</span>
                            </div>
                            <div className="tx-io-field">
                              <span className="tx-io-label">Value</span>
                              <span className="tx-io-value highlight">{output.value ? output.value.toFixed(8) : '0.00000000'} ZEC</span>
                            </div>
                            {output.scriptPubKey && (
                              <>
                                <div className="tx-io-field">
                                  <span className="tx-io-label">Script</span>
                                  <code className="tx-io-value">{output.scriptPubKey.hex}</code>
                                </div>
                                {output.scriptPubKey.addresses && output.scriptPubKey.addresses.length > 0 && (
                                  <div className="tx-io-field">
                                    <span className="tx-io-label">Address{output.scriptPubKey.addresses.length > 1 ? 'es' : ''}</span>
                                    {output.scriptPubKey.addresses.map((addr, addrIdx) => (
                                      <code key={addrIdx} className="tx-io-value">{addr}</code>
                                    ))}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

