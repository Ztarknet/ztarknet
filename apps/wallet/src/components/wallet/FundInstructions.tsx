'use client';

import { Button } from '@workspace/ui/components/button';
import { Check, Copy, ExternalLink, Info } from 'lucide-react';
import { useState } from 'react';

interface FundInstructionsProps {
  accountAddress: string | null;
}

export function FundInstructions({ accountAddress }: FundInstructionsProps) {
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
        <p className="text-sm">Select an account to view funding instructions</p>
      </div>
    );
  }

  const steps = [
    {
      title: 'Copy Your Address',
      content: (
        <div className="flex gap-2">
          <code className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 text-xs text-foreground/80 truncate font-mono">
            {accountAddress}
          </code>
          <Button variant="ghost" size="sm" onClick={handleCopyAddress} className="shrink-0">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      ),
    },
    {
      title: 'Open the Faucet',
      content: (
        <Button variant="primary" size="sm" onClick={handleOpenFaucet}>
          <ExternalLink className="w-4 h-4 mr-2" />
          Open Faucet
        </Button>
      ),
    },
    {
      title: 'Request STRK Tokens',
      content: <p className="text-sm text-muted">Paste your address and request tokens.</p>,
    },
    {
      title: 'Wait for Confirmation',
      content: <p className="text-sm text-muted">Balance updates within a few moments.</p>,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.title} className="flex gap-3">
            <div className="shrink-0 w-6 h-6 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-xs font-semibold text-accent">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <h3 className="text-sm font-medium text-foreground mb-2">{step.title}</h3>
              {step.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/5 border border-accent/10">
        <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <p className="text-xs text-muted">
          The faucet provides testnet STRK tokens for testing purposes only.
        </p>
      </div>
    </div>
  );
}
