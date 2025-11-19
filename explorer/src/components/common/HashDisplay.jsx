import React from 'react';

export function HashDisplay({ hash, isLoading = false }) {
  if (isLoading) {
    return (
      <code className="font-mono text-sm text-foreground mb-8 break-all bg-black/30 py-2.5 px-4 rounded-lg block skeleton-text">
        ----------------------------------------------------------------
      </code>
    );
  }

  return (
    <code className="font-mono text-sm text-foreground mb-8 break-all bg-black/30 py-2.5 px-4 rounded-lg block">{hash}</code>
  );
}
