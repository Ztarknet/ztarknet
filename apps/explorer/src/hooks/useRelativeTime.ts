'use client';

import { useEffect, useState } from 'react';

/**
 * Format a timestamp into relative time (e.g., "5s ago", "2m ago", "1h ago")
 */
function formatRelativeTime(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;

  if (diff < 0) {
    return 'just now';
  }

  if (diff < 60) {
    return `${diff}s ago`;
  }

  if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes}m ago`;
  }

  if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours}h ago`;
  }

  const days = Math.floor(diff / 86400);
  return `${days}d ago`;
}

/**
 * Hook that returns a relative time string that updates every second
 */
export function useRelativeTime(timestamp: number | undefined): string {
  const [relativeTime, setRelativeTime] = useState<string>(() =>
    timestamp ? formatRelativeTime(timestamp) : '---'
  );

  useEffect(() => {
    if (!timestamp) {
      setRelativeTime('---');
      return;
    }

    // Update immediately
    setRelativeTime(formatRelativeTime(timestamp));

    // Update every second
    const interval = setInterval(() => {
      setRelativeTime(formatRelativeTime(timestamp));
    }, 1000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return relativeTime;
}
