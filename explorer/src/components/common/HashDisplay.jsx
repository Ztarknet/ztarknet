import React from 'react';

export function HashDisplay({ hash, isLoading = false }) {
  if (isLoading) {
    return (
      <code className="hash-display skeleton-text">
        ----------------------------------------------------------------
      </code>
    );
  }

  return (
    <code className="hash-display">{hash}</code>
  );
}
