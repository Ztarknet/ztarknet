'use client';

import { Button } from '@workspace/ui/components/button';
import { Check, Copy, ExternalLink, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface AccountActionButtonsProps {
  accountAddress: string | null;
  onDeleteAccount: () => void;
}

export function AccountActionButtons({
  accountAddress,
  onDeleteAccount,
}: AccountActionButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleViewInExplorer = () => {
    if (accountAddress) {
      window.open(`https://explorer.ztarknet.cash/account/${accountAddress}`, '_blank');
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-xl border border-[rgba(255,137,70,0.12)] bg-black/30 backdrop-blur-sm">
      {/* Address display */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-[10px] font-mono uppercase tracking-widest text-accent/60 shrink-0">
          Address
        </span>
        <code className="text-xs font-mono text-foreground/80 truncate">
          {accountAddress.slice(0, 10)}...{accountAddress.slice(-8)}
        </code>
        <button
          type="button"
          onClick={handleCopyAddress}
          className="p-1 rounded hover:bg-white/10 transition-colors shrink-0"
          title={copied ? 'Copied!' : 'Copy address'}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-500" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-muted hover:text-foreground" />
          )}
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-2 w-full sm:w-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleViewInExplorer}
          className="flex-1 sm:flex-initial text-muted hover:text-foreground"
        >
          <ExternalLink className="w-4 h-4 mr-1.5" />
          Explorer
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onDeleteAccount}
          className="flex-1 sm:flex-initial text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <Trash2 className="w-4 h-4 mr-1.5" />
          Delete
        </Button>
      </div>
    </div>
  );
}
