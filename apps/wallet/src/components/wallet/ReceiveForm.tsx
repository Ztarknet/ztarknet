'use client';

import { Button } from '@workspace/ui/components/button';
import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ReceiveFormProps {
  accountAddress: string | null;
}

export function ReceiveForm({ accountAddress }: ReceiveFormProps) {
  const [amount, setAmount] = useState('');
  const [shareableLink, setShareableLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (accountAddress && amount) {
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
        <p className="text-sm">Select an account to receive funds</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-accent/60 mb-1.5 block">
          Token
        </span>
        <div className="px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/10 text-sm text-muted">
          STRK (Fee Token)
        </div>
      </div>

      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-accent/60 mb-1.5 block">
          Amount (Optional)
        </span>
        <input
          type="number"
          step="0.0001"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0"
          className="w-full px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/10 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all font-mono"
        />
      </div>

      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-accent/60 mb-1.5 block">
          Shareable Link
        </span>
        <div className="flex gap-2">
          <input
            type="text"
            value={shareableLink}
            readOnly
            className="flex-1 min-w-0 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/10 text-sm text-muted truncate font-mono"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyLink}
            disabled={!shareableLink}
            className="shrink-0"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-xs text-muted/70 mt-2">
          Share this link to request funds with a pre-filled amount.
        </p>
      </div>
    </div>
  );
}
