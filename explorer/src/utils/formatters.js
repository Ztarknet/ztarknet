// Format time helper
export function formatTime(timestamp) {
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
export function formatHash(hash) {
  if (!hash) return '';
  return `${hash.slice(0, 16)}...${hash.slice(-16)}`;
}

// Format size helper
export function formatSize(bytes) {
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
export function formatZEC(amount) {
  if (amount === null || amount === undefined) return 'N/A';
  return parseFloat(amount.toFixed(8)).toString();
}

// Format 32-byte hash
export function formatHash32(hash) {
  if (!hash || hash.length !== 64) return hash;
  return `${hash.slice(0, 12)}...${hash.slice(-12)}`;
}

// Copy to clipboard helper
export function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    console.log('Copied to clipboard');
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

// Get block reward from valuePools
export function getBlockReward(block) {
  if (!block.valuePools) return null;

  const transparentPool = block.valuePools.find(pool => pool.id === 'transparent');
  if (!transparentPool || transparentPool.valueDelta === undefined) return null;

  return transparentPool.valueDelta;
}
