import React, { useState, useEffect } from 'react';

export function ReceiveForm({ accountAddress }) {
  const [amount, setAmount] = useState('');
  const [shareableLink, setShareableLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (accountAddress && amount) {
      // Create a shareable link with URL parameters
      const baseUrl = window.location.origin + window.location.pathname;
      const params = new URLSearchParams({
        action: 'send',
        to: accountAddress,
        amount: amount,
      });
      setShareableLink(`${baseUrl}?${params.toString()}`);
    } else if (accountAddress) {
      const baseUrl = window.location.origin + window.location.pathname;
      const params = new URLSearchParams({
        action: 'send',
        to: accountAddress,
      });
      setShareableLink(`${baseUrl}?${params.toString()}`);
    } else {
      setShareableLink('');
    }
  }, [accountAddress, amount]);

  const handleCopyLink = async () => {
    if (!shareableLink) return;

    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  if (!accountAddress) {
    return (
      <div className="text-center text-muted py-8">
        <p>Select an account to receive funds</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Token Selector (placeholder for now) */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Token
        </label>
        <div className="w-full p-3 rounded-lg bg-[rgba(255,107,26,0.05)] border border-[rgba(255,137,70,0.2)] text-muted">
          STRK (Fee Token)
        </div>
      </div>

      {/* Amount (Optional) */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Amount (Optional)
        </label>
        <input
          type="number"
          step="0.0001"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0"
          className="w-full p-3 rounded-lg bg-[rgba(8,8,12,0.6)] border border-[rgba(255,137,70,0.2)] text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* Shareable Link */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Shareable Link
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={shareableLink}
            readOnly
            className="flex-1 p-3 rounded-lg bg-[rgba(8,8,12,0.6)] border border-[rgba(255,137,70,0.2)] text-muted font-mono text-sm truncate focus:outline-none"
          />
          <button
            onClick={handleCopyLink}
            disabled={!shareableLink}
            className="px-4 rounded-lg font-semibold border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:bg-[rgba(255,107,26,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
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
        <p className="text-xs text-muted mt-2">
          Share this link with someone to request funds. They'll be redirected to the wallet with the send form pre-filled.
        </p>
      </div>
    </div>
  );
}
