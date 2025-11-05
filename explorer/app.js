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

// Format size helper
function formatSize(bytes) {
  if (!bytes) return 'N/A';
  if (bytes < 10000) {
    return `${bytes} B`;
  }
  const kb = bytes / 1024;
  if (kb < 100) {
    return `${kb.toFixed(2)} KB`;
  } else if (kb < 1000) {
    return `${kb.toFixed(1)} KB`;
  } else {
    return `${Math.round(kb)} KB`;
  }
}

// Format ZEC amount (remove trailing zeros)
function formatZEC(amount) {
  if (amount === null || amount === undefined) return 'N/A';
  return parseFloat(amount.toFixed(8)).toString();
}

// TZE parsing helpers
function parseTZEData(hexString, isInput = false) {
  if (!hexString || !hexString.toLowerCase().startsWith('ff')) {
    return null;
  }

  try {
    // Remove 'ff' prefix and parse
    const data = hexString.slice(2);
    let offset = 0;

    // Parse 4-byte big-endian u32 for tze_id
    const tzeId = parseInt(data.slice(offset, offset + 8), 16);
    offset += 8; // 4 bytes = 8 hex chars

    // The remaining data is the payload (precondition or witness)
    const payload = data.slice(offset);
    const payloadLen = payload.length / 2; // Convert hex chars to bytes

    return {
      tzeId,
      payload,
      payloadLen,
      isInput
    };
  } catch (e) {
    console.error('Error parsing TZE data:', e);
    return null;
  }
}

function parseCompactSize(hexString, offset) {
  const firstByte = parseInt(hexString.slice(offset, offset + 2), 16);

  if (firstByte < 0xfd) {
    return { value: firstByte, offset: offset + 2 };
  } else if (firstByte === 0xfd) {
    const value = parseInt(hexString.slice(offset + 2, offset + 6), 16);
    return { value, offset: offset + 6 };
  } else if (firstByte === 0xfe) {
    const value = parseInt(hexString.slice(offset + 2, offset + 10), 16);
    return { value, offset: offset + 10 };
  } else {
    const value = parseInt(hexString.slice(offset + 2, offset + 18), 16);
    return { value, offset: offset + 18 };
  }
}

function getTZETypeName(tzeId) {
  switch (tzeId) {
    case 0: return 'demo';
    case 1: return 'stark_verify';
    default: return `unknown_${tzeId}`;
  }
}

function getTZEModeName(tzeId, tzeMode) {
  if (tzeId === 1) { // stark_verify
    switch (tzeMode) {
      case 0: return 'Initialize';
      case 1: return 'Verify';
      default: return `Mode ${tzeMode}`;
    }
  }
  return `Mode ${tzeMode}`;
}

function parseStarkVerifyPrecondition(payload) {
  // Skip first 4 bytes (appears to be additional metadata/flags)
  const offset = 8; // 4 bytes = 8 hex chars

  // Check for new format (96 bytes: root + os_program_hash + bootloader_program_hash)
  if (payload.length >= offset + 192) {
    return {
      root: payload.slice(offset, offset + 64),
      osProgramHash: payload.slice(offset + 64, offset + 128),
      bootloaderProgramHash: payload.slice(offset + 128, offset + 192),
      isLegacy: false
    };
  }

  // Check for old format (64 bytes: root + single program_hash)
  if (payload.length >= offset + 128) {
    return {
      root: payload.slice(offset, offset + 64),
      programHash: payload.slice(offset + 64, offset + 128),
      isLegacy: true
    };
  }

  return null;
}

function parseStarkVerifyWitness(payload) {
  // Witness: 1 byte with_pedersen + 1 byte proof_format + variable proof_data
  if (payload.length < 4) return null; // At least 2 bytes

  const withPedersen = parseInt(payload.slice(0, 2), 16) === 1;
  const proofFormat = parseInt(payload.slice(2, 4), 16);
  const proofData = payload.slice(4);

  return {
    withPedersen,
    proofFormat: proofFormat === 0 ? 'JSON' : 'Binary',
    proofData,
    proofSizeMB: (proofData.length / 2 / 1024 / 1024).toFixed(2)
  };
}

function formatHash32(hash) {
  if (!hash || hash.length !== 64) return hash;
  return `${hash.slice(0, 12)}...${hash.slice(-12)}`;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    // Simple feedback - could enhance with a toast notification
    console.log('Copied to clipboard');
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
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
  
  if (route.startsWith('#/tx/')) {
    const txid = route.replace('#/tx/', '');
    return <TransactionPage txid={txid} />;
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
        {loading ? (
          <>
            <div className="stat-card skeleton">
              <span className="stat-label skeleton-text">Chain Height</span>
              <div className="stat-value skeleton-text">Loading...</div>
              <div className="stat-description skeleton-text">Total blocks mined</div>
            </div>
            <div className="stat-card skeleton">
              <span className="stat-label skeleton-text">Network Upgrade</span>
              <div className="stat-value skeleton-text">Loading...</div>
              <div className="stat-description skeleton-text">Latest protocol version</div>
            </div>
            <div className="stat-card skeleton">
              <span className="stat-label skeleton-text">Transaction Version</span>
              <div className="stat-value skeleton-text">Loading...</div>
              <div className="stat-description skeleton-text">Current tx format</div>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>

      <h2 className="section-title">Latest Blocks</h2>
      <div className="blocks-container">
        {loading ? (
          // Show skeleton placeholders during loading
          Array.from({ length: MAX_BLOCKS }).map((_, index) => (
            <div key={index} className="block-card skeleton">
              <div className="block-info">
                <span className="block-height skeleton-text">Block #---</span>
                <span className="block-time skeleton-text">--- ago</span>
              </div>
              
              <code className="block-hash skeleton-text">
                ----------------------------------------------------------------
              </code>
              
              <div className="block-details">
                <div className="block-detail">
                  <span className="block-detail-label">Transactions</span>
                  <span className="block-detail-value skeleton-text">-</span>
                </div>
                
                <div className="block-detail">
                  <span className="block-detail-label">Reward</span>
                  <span className="block-detail-value skeleton-text zec-value">--- ZEC</span>
                </div>
                
                <div className="block-detail">
                  <span className="block-detail-label">Size</span>
                  <span className="block-detail-value skeleton-text size-value">--- B</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          blocks.map((block, index) => {
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
                  <span className="block-detail-value zec-value">
                    {reward !== null ? `${formatZEC(reward)} ZEC` : 'N/A'}
                  </span>
                </div>
                
                <div className="block-detail">
                  <span className="block-detail-label">Size</span>
                  <span className="block-detail-value size-value">
                    {formatSize(block.size)}
                  </span>
                </div>
              </div>
            </a>
          );
        })
        )}
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

// TZE Details Component
function TZEDetailsView({ tx }) {
  const [expandedProof, setExpandedProof] = React.useState(false);
  const [oldStateRoot, setOldStateRoot] = React.useState(null);
  const [loadingOldState, setLoadingOldState] = React.useState(false);

  // Parse TZE data from inputs and outputs
  let tzeInputData = null;
  let tzeOutputData = null;
  let spendingTzeInput = null;

  // Check inputs for TZE data
  if (tx.vin) {
    for (const input of tx.vin) {
      if (input.scriptSig && input.scriptSig.hex && input.scriptSig.hex.toLowerCase().startsWith('ff')) {
        tzeInputData = parseTZEData(input.scriptSig.hex, true);
        spendingTzeInput = input; // Save the input reference
        if (tzeInputData) break;
      }
    }
  }

  // Check outputs for TZE data
  if (tx.vout) {
    for (const output of tx.vout) {
      if (output.scriptPubKey && output.scriptPubKey.hex && output.scriptPubKey.hex.toLowerCase().startsWith('ff')) {
        tzeOutputData = parseTZEData(output.scriptPubKey.hex, false);
        if (tzeOutputData) break;
      }
    }
  }

  // Fetch old state root from previous transaction if this is a STARK Verify
  React.useEffect(() => {
    async function fetchOldState() {
      if (!spendingTzeInput || !spendingTzeInput.txid || spendingTzeInput.vout === undefined) {
        setOldStateRoot(null);
        return;
      }

      try {
        setLoadingOldState(true);

        // Fetch the previous transaction (verbose=1 for decoded JSON)
        const prevTx = await rpcCall('getrawtransaction', [spendingTzeInput.txid, 1]);

        // Get the output being spent
        const prevOutput = prevTx.vout[spendingTzeInput.vout];

        if (prevOutput && prevOutput.scriptPubKey && prevOutput.scriptPubKey.hex) {
          const prevTzeData = parseTZEData(prevOutput.scriptPubKey.hex, false);
          if (prevTzeData) {
            const prevPrecondition = parseStarkVerifyPrecondition(prevTzeData.payload);
            if (prevPrecondition) {
              setOldStateRoot(prevPrecondition.root);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching old state root:', error);
      } finally {
        setLoadingOldState(false);
      }
    }

    fetchOldState();
  }, [tx.txid]);

  if (!tzeOutputData) {
    return <div className="tze-details-error">Unable to parse TZE data</div>;
  }

  const { tzeId, payload } = tzeOutputData;

  // Determine mode based on transaction structure:
  // - If spending a TZE input → STARK Verify mode (1)
  // - If NOT spending a TZE input → Initialize mode (0)
  const tzeMode = tzeInputData ? 1 : 0;

  const typeName = getTZETypeName(tzeId);
  const modeName = getTZEModeName(tzeId, tzeMode);

  // Parse extension-specific data
  let extensionView = null;

  // Determine description based on mode
  let modeDescription = '';
  if (tzeId === 1) { // stark_verify
    if (tzeMode === 0) {
      modeDescription = 'Initialized a new STARK program channel';
    } else if (tzeMode === 1) {
      modeDescription = 'Verified STARK proof, resulting in a new program state';
    }
  }

  if (tzeId === 1) { // stark_verify
    if (tzeMode === 0) { // Initialize
      const precondition = parseStarkVerifyPrecondition(payload);
      if (precondition) {
        if (precondition.isLegacy) {
          // Old format with single program hash
          extensionView = (
            <div className="tze-extension-view">
              <div className="tze-field">
                <span className="tze-field-label">Genesis State</span>
                <code className="tze-field-value" onClick={() => copyToClipboard(precondition.root)} title="Click to copy">
                  {precondition.root}
                </code>
              </div>
              <div className="tze-field">
                <span className="tze-field-label">Program Hash</span>
                <code className="tze-field-value" onClick={() => copyToClipboard(precondition.programHash)} title="Click to copy">
                  {precondition.programHash}
                </code>
              </div>
            </div>
          );
        } else {
          // New format with separate OS and bootloader hashes
          extensionView = (
            <div className="tze-extension-view">
              <div className="tze-field">
                <span className="tze-field-label">Genesis State</span>
                <code className="tze-field-value" onClick={() => copyToClipboard(precondition.root)} title="Click to copy">
                  {precondition.root}
                </code>
              </div>
              <div className="tze-field">
                <span className="tze-field-label">OS Program Hash</span>
                <code className="tze-field-value" onClick={() => copyToClipboard(precondition.osProgramHash)} title="Click to copy">
                  {precondition.osProgramHash}
                </code>
              </div>
              <div className="tze-field">
                <span className="tze-field-label">Bootloader Program Hash</span>
                <code className="tze-field-value" onClick={() => copyToClipboard(precondition.bootloaderProgramHash)} title="Click to copy">
                  {precondition.bootloaderProgramHash}
                </code>
              </div>
            </div>
          );
        }
      }
    } else if (tzeMode === 1) { // STARK Verify
      // Parse precondition from input (old state) - this is in the previous tx output being spent
      // For now, we need to look up the previous transaction to get the old state
      // Since we don't have that readily available, we'll show what we can

      // Parse precondition from output (new state)
      const newStatePrecondition = parseStarkVerifyPrecondition(payload);

      // Parse witness from input (contains the proof)
      let witness = null;
      if (tzeInputData) {
        witness = parseStarkVerifyWitness(tzeInputData.payload);
      }

      if (newStatePrecondition) {
        if (newStatePrecondition.isLegacy) {
          // Old format with single program hash
          extensionView = (
            <div className="tze-extension-view">
              <div className="tze-field">
                <span className="tze-field-label">Old State Root</span>
                {loadingOldState ? (
                  <code className="tze-field-value">Loading...</code>
                ) : oldStateRoot ? (
                  <code className="tze-field-value" onClick={() => copyToClipboard(oldStateRoot)} title="Click to copy">
                    {oldStateRoot}
                  </code>
                ) : (
                  <code className="tze-field-value">Unable to fetch</code>
                )}
              </div>

              <div className="tze-field">
                <span className="tze-field-label">New State Root</span>
                <code className="tze-field-value" onClick={() => copyToClipboard(newStatePrecondition.root)} title="Click to copy">
                  {newStatePrecondition.root}
                </code>
              </div>

              <div className="tze-field">
                <span className="tze-field-label">Program Hash</span>
                <code className="tze-field-value" onClick={() => copyToClipboard(newStatePrecondition.programHash)} title="Click to copy">
                  {newStatePrecondition.programHash}
                </code>
              </div>

              {witness && witness.proofData && (
                <div className="tze-field">
                  <span className="tze-field-label">Proof</span>
                  <div className="tze-proof-container">
                    <code
                      className={`tze-proof-data ${expandedProof ? 'expanded' : ''}`}
                      onClick={() => copyToClipboard(witness.proofData)}
                      title="Click to copy"
                    >
                      {expandedProof
                        ? witness.proofData
                        : `${witness.proofData.slice(0, 120)}...${witness.proofData.slice(-120)}`
                      }
                    </code>
                    <div className="tze-proof-actions">
                      <span className="tze-proof-size">{witness.proofSizeMB} MB</span>
                      <button
                        className="tze-proof-toggle"
                        onClick={() => setExpandedProof(!expandedProof)}
                      >
                        {expandedProof ? 'Collapse' : 'Expand'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        } else {
          // New format with separate OS and bootloader hashes
          extensionView = (
            <div className="tze-extension-view">
              <div className="tze-field">
                <span className="tze-field-label">Old State Root</span>
                {loadingOldState ? (
                  <code className="tze-field-value">Loading...</code>
                ) : oldStateRoot ? (
                  <code className="tze-field-value" onClick={() => copyToClipboard(oldStateRoot)} title="Click to copy">
                    {oldStateRoot}
                  </code>
                ) : (
                  <code className="tze-field-value">Unable to fetch</code>
                )}
              </div>

              <div className="tze-field">
                <span className="tze-field-label">New State Root</span>
                <code className="tze-field-value" onClick={() => copyToClipboard(newStatePrecondition.root)} title="Click to copy">
                  {newStatePrecondition.root}
                </code>
              </div>

              <div className="tze-field">
                <span className="tze-field-label">OS Program Hash</span>
                <code className="tze-field-value" onClick={() => copyToClipboard(newStatePrecondition.osProgramHash)} title="Click to copy">
                  {newStatePrecondition.osProgramHash}
                </code>
              </div>

              <div className="tze-field">
                <span className="tze-field-label">Bootloader Program Hash</span>
                <code className="tze-field-value" onClick={() => copyToClipboard(newStatePrecondition.bootloaderProgramHash)} title="Click to copy">
                  {newStatePrecondition.bootloaderProgramHash}
                </code>
              </div>

              {witness && witness.proofData && (
                <div className="tze-field">
                  <span className="tze-field-label">Proof</span>
                  <div className="tze-proof-container">
                    <code
                      className={`tze-proof-data ${expandedProof ? 'expanded' : ''}`}
                      onClick={() => copyToClipboard(witness.proofData)}
                      title="Click to copy"
                    >
                      {expandedProof
                        ? witness.proofData
                        : `${witness.proofData.slice(0, 120)}...${witness.proofData.slice(-120)}`
                      }
                    </code>
                    <div className="tze-proof-actions">
                      <span className="tze-proof-size">{witness.proofSizeMB} MB</span>
                      <button
                        className="tze-proof-toggle"
                        onClick={() => setExpandedProof(!expandedProof)}
                      >
                        {expandedProof ? 'Collapse' : 'Expand'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        }
      }
    }
  }

  // Fallback for demo or unknown extensions
  if (!extensionView) {
    extensionView = (
      <div className="tze-extension-view">
        <p className="tze-description">Extension details view coming soon</p>
      </div>
    );
  }

  return (
    <div className="tze-details-container">
      <div className="tze-separator"></div>

      <div className="tze-header">
        <h3 className="title">TZE Details</h3>
        <span className={`tze-badge tze-badge-${typeName}`}>{typeName}</span>
      </div>

      <div className="tze-combined-view">
        <div className="tze-mode-field">
          <div>
            <span className="tze-field-label">Mode</span>
            <span className="tze-field-value">{modeName}</span>
          </div>
          {modeDescription && (
            <p className="tze-description">{modeDescription}</p>
          )}
        </div>

        {extensionView}
      </div>
    </div>
  );
}

// Block detail page
function TransactionPage({ txid }) {
  const [tx, setTx] = useState(null);
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTransaction() {
      try {
        setLoading(true);
        setError(null);
        
        // Get transaction details
        const txData = await rpcCall('getrawtransaction', [txid, 1]);
        setTx(txData);
        
        // Get block details if transaction is in a block
        if (txData.blockhash) {
          const blockData = await rpcCall('getblock', [txData.blockhash, 1]);
          setBlock(blockData);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    
    fetchTransaction();
  }, [txid]);
  
  if (loading) {
    return (
      <div className="explorer-container">
        <div style={{ marginBottom: '24px' }}>
          <a href="#/" className="button ghost">← Back to Blocks</a>
        </div>
        
        <h2 className="section-title skeleton-text">Transaction</h2>
        <code className="hash-display skeleton-text">
          ----------------------------------------------------------------
        </code>
        
        {/* Skeleton block info cards */}
        <div className="stats-grid" style={{ marginBottom: '48px' }}>
          <div className="stat-card skeleton">
            <span className="stat-label skeleton-text">Block Height</span>
            <div className="stat-value skeleton-text" style={{ fontSize: '1.8rem' }}>---</div>
            <div className="stat-description skeleton-text">Loading...</div>
          </div>
          
          <div className="stat-card skeleton">
            <span className="stat-label skeleton-text">Block Hash</span>
            <div className="stat-value skeleton-text" style={{ fontSize: '1.2rem' }}>--------------</div>
          </div>
          
          <div className="stat-card skeleton">
            <span className="stat-label skeleton-text">Block Time</span>
            <div className="stat-value skeleton-text" style={{ fontSize: '1.8rem' }}>---</div>
            <div className="stat-description skeleton-text">Loading...</div>
          </div>
        </div>
        
        <h2 className="section-title skeleton-text">Transaction Details</h2>
        <div className="tx-expanded skeleton" style={{ marginTop: '24px' }}>
          <div className="skeleton-text">Loading transaction data...</div>
        </div>
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
  
  if (!tx) {
    return (
      <div className="explorer-container">
        <div className="error">Transaction not found</div>
      </div>
    );
  }
  
  const numInputs = tx.vin ? tx.vin.length : 0;
  const numOutputs = tx.vout ? tx.vout.length : 0;
  const totalOutput = tx.vout ? tx.vout.reduce((sum, out) => sum + (out.value || 0), 0) : 0;
  
  // Determine transaction kind
  let txKind = 'standard';
  
  if (tx.vin && tx.vin.length > 0 && tx.vin[0].coinbase) {
    txKind = 'coinbase';
  } else {
    let isTZE = false;
    
    if (tx.vin) {
      for (const input of tx.vin) {
        if (input.scriptSig && input.scriptSig.hex && input.scriptSig.hex.toLowerCase().startsWith('ff')) {
          isTZE = true;
          break;
        }
      }
    }
    
    if (!isTZE && tx.vout) {
      for (const output of tx.vout) {
        if (output.scriptPubKey && output.scriptPubKey.hex && output.scriptPubKey.hex.toLowerCase().startsWith('ff')) {
          isTZE = true;
          break;
        }
      }
    }
    
    if (isTZE) {
      txKind = 'tze';
    }
  }
  
  return (
    <div className="explorer-container">
      <div style={{ marginBottom: '24px' }}>
        <a href="#/" className="button ghost">← Back to Blocks</a>
        {block && (
          <a href={`#/block/${block.hash}`} className="button ghost" style={{ marginLeft: '12px' }}>
            View Block
          </a>
        )}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <h2 className="section-title" style={{ margin: 0 }}>Transaction</h2>
        <span className="tx-kind" data-kind={txKind}>{txKind}</span>
      </div>
      <code className="hash-display">{tx.txid}</code>
      
      {/* Block info cards */}
      {block && (
        <div className="stats-grid" style={{ marginBottom: '48px' }}>
          <div className="stat-card">
            <span className="stat-label">Block Height</span>
            <div className="stat-value" style={{ fontSize: '1.8rem' }}>{block.height.toLocaleString()}</div>
            <div className="stat-description">{formatTime(block.time)}</div>
          </div>
          
          <div className="stat-card">
            <span className="stat-label">Block Hash</span>
            <code className="stat-value" style={{ fontSize: '1rem', wordBreak: 'break-all' }}>{block.hash}</code>
          </div>
          
          <div className="stat-card">
            <span className="stat-label">Confirmations</span>
            <div className="stat-value" style={{ fontSize: '1.8rem' }}>{tx.confirmations || 0}</div>
            <div className="stat-description">Blocks</div>
          </div>
        </div>
      )}
      
      {/* Transaction Details */}
      <h2 className="section-title">Transaction Details</h2>
      
      <div style={{ 
        padding: '32px',
        background: 'radial-gradient(circle at top left, rgba(255, 107, 26, 0.08), rgba(5, 5, 7, 0.95) 50%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 137, 70, 0.15)',
        borderRadius: '16px',
        marginBottom: '32px'
      }}>
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
                    <span className="tx-io-value highlight zec-value">{formatZEC(output.value || 0)} ZEC</span>
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
        
        {/* Additional Transaction Info */}
        <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <div className="tx-io-label" style={{ marginBottom: '8px' }}>Total Output</div>
            <div className="tx-io-value highlight zec-value" style={{ fontSize: '1.1rem' }}>{formatZEC(totalOutput)} ZEC</div>
          </div>
          <div>
            <div className="tx-io-label" style={{ marginBottom: '8px' }}>Size</div>
            <div className="tx-io-value size-value" style={{ fontSize: '1.1rem' }}>{formatSize(tx.size)}</div>
          </div>
          <div>
            <div className="tx-io-label" style={{ marginBottom: '8px' }}>Version</div>
            <div className="tx-io-value" style={{ fontSize: '1.1rem' }}>{tx.version}</div>
          </div>
          {tx.locktime !== undefined && (
            <div>
              <div className="tx-io-label" style={{ marginBottom: '8px' }}>Locktime</div>
              <div className="tx-io-value" style={{ fontSize: '1.1rem' }}>{tx.locktime}</div>
            </div>
          )}
        </div>

        {/* TZE Details - only show for TZE transactions */}
        {txKind === 'tze' && <TZEDetailsView tx={tx} />}
      </div>
    </div>
  );
}

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
        <div style={{ marginBottom: '24px' }}>
          <a href="#/" className="button ghost">← Back to Blocks</a>
        </div>
        
        <h2 className="section-title skeleton-text">Block #---</h2>
        <code className="hash-display skeleton-text">
          ----------------------------------------------------------------
        </code>
        
        {/* Skeleton stat cards */}
        <div className="stats-grid" style={{ marginBottom: '48px' }}>
          <div className="stat-card skeleton">
            <span className="stat-label skeleton-text">Block Height</span>
            <div className="stat-value skeleton-text" style={{ fontSize: '1.8rem' }}>---</div>
            <div className="stat-description skeleton-text">Loading...</div>
          </div>
          
          <div className="stat-card skeleton">
            <span className="stat-label skeleton-text">Block Reward</span>
            <div className="stat-value skeleton-text zec-value" style={{ fontSize: '1.8rem' }}>---</div>
            <div className="stat-description skeleton-text">ZEC</div>
          </div>
          
          <div className="stat-card skeleton">
            <span className="stat-label skeleton-text">Block Size</span>
            <div className="stat-value skeleton-text size-value" style={{ fontSize: '1.8rem' }}>---</div>
            <div className="stat-description skeleton-text">---</div>
          </div>
        </div>
        
        {/* Skeleton transactions */}
        <h2 className="section-title skeleton-text">- Transactions</h2>
        <div className="transactions-container">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="tx-card skeleton">
              <span className="tx-kind skeleton-text">---</span>
              <code className="tx-hash skeleton-text">
                ----------------------------------------------------------------
              </code>
              <div className="tx-detail">
                <span className="tx-detail-label">Inputs</span>
                <span className="tx-detail-value skeleton-text">-</span>
              </div>
              <div className="tx-detail">
                <span className="tx-detail-label">Outputs</span>
                <span className="tx-detail-value skeleton-text">-</span>
              </div>
              <div className="tx-detail">
                <span className="tx-detail-label">Total Output</span>
                <span className="tx-detail-value skeleton-text zec-value">--- ZEC</span>
              </div>
              <div className="tx-detail">
                <span className="tx-detail-label">Size</span>
                <span className="tx-detail-value skeleton-text size-value">--- B</span>
              </div>
            </div>
          ))}
        </div>
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
          <div className="stat-value zec-value" style={{ fontSize: '1.8rem' }}>{reward !== null ? formatZEC(reward) : 'N/A'}</div>
          <div className="stat-description">ZEC</div>
        </div>
        
        <div className="stat-card">
          <span className="stat-label">Block Size</span>
          <div className="stat-value size-value" style={{ fontSize: '1.8rem' }}>
            {block.size ? formatSize(block.size).split(' ')[0] : 'N/A'}
          </div>
          <div className="stat-description">{block.size ? formatSize(block.size).split(' ')[1] : ''}</div>
        </div>
      </div>
      
      {/* Transactions list */}
      <h2 className="section-title">{totalTx} Transaction{totalTx !== 1 ? 's' : ''}</h2>
      <div className="transactions-container">
        {block.tx && block.tx.map((tx, index) => {
          const numInputs = tx.vin ? tx.vin.length : 0;
          const numOutputs = tx.vout ? tx.vout.length : 0;
          const totalOutput = tx.vout ? tx.vout.reduce((sum, out) => sum + (out.value || 0), 0) : 0;
          
          // Determine transaction kind
          let txKind = 'standard';
          
          // Check if coinbase
          if (tx.vin && tx.vin.length > 0 && tx.vin[0].coinbase) {
            txKind = 'coinbase';
          } else {
            // Check for TZE transaction (script begins with "ff")
            let isTZE = false;
            
            // Check inputs
            if (tx.vin) {
              for (const input of tx.vin) {
                if (input.scriptSig && input.scriptSig.hex && input.scriptSig.hex.toLowerCase().startsWith('ff')) {
                  isTZE = true;
                  break;
                }
              }
            }
            
            // Check outputs
            if (!isTZE && tx.vout) {
              for (const output of tx.vout) {
                if (output.scriptPubKey && output.scriptPubKey.hex && output.scriptPubKey.hex.toLowerCase().startsWith('ff')) {
                  isTZE = true;
                  break;
                }
              }
            }
            
            if (isTZE) {
              txKind = 'tze';
            }
          }
          
          const isExpanded = expandedTx === tx.txid;
          
          return (
            <div key={tx.txid || index} className="tx-card-wrapper">
              <div 
                className="tx-card"
                onClick={() => setExpandedTx(isExpanded ? null : tx.txid)}
                style={{ cursor: 'pointer' }}
              >
                <span className="tx-kind" data-kind={txKind}>{txKind}</span>
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
                  <span className="tx-detail-value zec-value">{formatZEC(totalOutput)} ZEC</span>
                </div>
              <div className="tx-detail">
                <span className="tx-detail-label">Size</span>
                <span className="tx-detail-value size-value">{formatSize(tx.size)}</span>
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
                              <span className="tx-io-value highlight zec-value">{formatZEC(output.value || 0)} ZEC</span>
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

                  {/* TZE Details - only show for TZE transactions */}
                  {txKind === 'tze' && <TZEDetailsView tx={tx} />}
                  
                  {/* View Full Transaction Button */}
                  <div style={{ marginTop: '32px', textAlign: 'right' }}>
                    <a href={`#/tx/${tx.txid}`} className="button" style={{ display: 'inline-flex' }}>
                      View Full Transaction →
                    </a>
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

