import React from 'react';

export function TransactionHistory({ accountAddress }) {
  if (!accountAddress) {
    return (
      <div className="text-center text-muted py-8">
        <p>Select an account to view transaction history</p>
      </div>
    );
  }

  const handleViewInExplorer = () => {
    if (accountAddress) {
      window.open(`https://explorer-zstarknet.d.karnot.xyz/contract/${accountAddress}`, '_blank');
    }
  };

  return (
    <div className="text-center py-12">
      <svg
        className="mx-auto mb-4 text-muted opacity-50"
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Transaction History Coming Soon...
      </h3>
      <p className="text-muted mb-3">
        We're working on bringing you a detailed transaction history view.
      </p>
      <p className="text-muted">
        In the meantime, you can{' '}
        <button
          onClick={handleViewInExplorer}
          className="text-accent hover:underline cursor-pointer"
        >
          view transactions on the explorer
        </button>
        .
      </p>
    </div>
  );
}
