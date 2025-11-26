import React, { useState } from 'react';

export function AccountActionButtons({ accountAddress, onDeleteAccount }) {
  const [copied, setCopied] = useState(false);

  const handleViewInExplorer = () => {
    if (accountAddress) {
      window.open(`https://explorer-zstarknet.d.karnot.xyz/contract/${accountAddress}`, '_blank');
    }
  };

  const handleCopyAddress = async () => {
    if (!accountAddress) return;

    try {
      await navigator.clipboard.writeText(accountAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  if (!accountAddress) {
    return null;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:justify-end lg:items-center min-w-0">
      {/* Account Address Display */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1 min-w-0 lg:max-w-xl">
        <span className="text-sm font-semibold text-foreground whitespace-nowrap">Account Address</span>
        <div className="flex items-center gap-2 flex-1 min-w-0 px-3 py-2 rounded-lg bg-[rgba(8,8,12,0.6)] border border-[rgba(255,137,70,0.2)]">
          <code className="flex-1 text-xs sm:text-sm font-mono text-foreground truncate">
            {accountAddress}
          </code>
          <button
            onClick={handleCopyAddress}
            className="flex-shrink-0 p-1 rounded hover:bg-[rgba(255,107,26,0.15)] transition-colors"
            title={copied ? "Copied!" : "Copy address"}
          >
            {copied ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#50C878]"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted hover:text-foreground"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 lg:flex-shrink-0">
        <button
          onClick={handleViewInExplorer}
          className="inline-flex items-center justify-center gap-1.5 lg:gap-2 rounded-full text-sm font-semibold tracking-wide py-2 px-3 xl:px-4 border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:-translate-y-0.5 whitespace-nowrap"
          title="View account in explorer"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          <span className="hidden lg:inline xl:inline">View in Explorer</span>
          <span className="lg:hidden xl:hidden">Explorer</span>
        </button>

        <button
          onClick={onDeleteAccount}
          className="inline-flex items-center justify-center gap-1.5 lg:gap-2 rounded-full text-sm font-semibold tracking-wide py-2 px-3 xl:px-4 border transition-all duration-200 cursor-pointer border-red-500/30 text-red-400 hover:border-red-500 hover:bg-red-500/10 hover:-translate-y-0.5 whitespace-nowrap"
          title="Delete account"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          <span className="hidden lg:inline xl:inline">Delete Account</span>
          <span className="lg:hidden xl:hidden">Delete</span>
        </button>
      </div>
    </div>
  );
}
