import React, { useState } from 'react';

export function FundInstructions({ accountAddress }) {
  const [copied, setCopied] = useState(false);

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

  const handleOpenFaucet = () => {
    window.open('https://faucet.ztarknet.cash', '_blank');
  };

  if (!accountAddress) {
    return (
      <div className="text-center text-muted py-8">
        <p>Select an account to view funding instructions</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Step 1 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[rgba(255,107,26,0.2)] border border-[rgba(255,137,70,0.4)] flex items-center justify-center font-bold text-foreground">
            1
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">Copy Your Account Address</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={accountAddress}
                readOnly
                className="flex-1 p-3 rounded-lg bg-[rgba(8,8,12,0.6)] border border-[rgba(255,137,70,0.2)] text-foreground font-mono text-sm truncate focus:outline-none"
              />
              <button
                onClick={handleCopyAddress}
                className="px-4 rounded-lg font-semibold border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:bg-[rgba(255,107,26,0.15)]"
              >
                {copied ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[rgba(255,107,26,0.2)] border border-[rgba(255,137,70,0.4)] flex items-center justify-center font-bold text-foreground">
            2
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">Open the Ztarknet Faucet</h3>
            <button
              onClick={handleOpenFaucet}
              className="w-full py-3 px-4 rounded-full font-semibold tracking-wide border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:bg-[rgba(255,107,26,0.15)] hover:-translate-y-0.5"
            >
              Open Faucet
            </button>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[rgba(255,107,26,0.2)] border border-[rgba(255,137,70,0.4)] flex items-center justify-center font-bold text-foreground">
            3
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">Request STRK Tokens</h3>
            <p className="text-muted">
              Paste your account address into the faucet and request STRK tokens. The tokens should arrive in your account within a few moments.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[rgba(255,107,26,0.2)] border border-[rgba(255,137,70,0.4)] flex items-center justify-center font-bold text-foreground">
            4
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">Wait for Confirmation</h3>
            <p className="text-muted">
              Once the transaction is confirmed, your account balance will be updated and you'll be able to send transactions.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-[rgba(255,107,26,0.1)] border border-[rgba(255,137,70,0.2)]">
        <p className="text-sm text-muted">
          <strong className="text-foreground">Note:</strong> The faucet provides testnet STRK tokens for testing purposes only. These tokens have no real-world value.
        </p>
      </div>
    </div>
  );
}
