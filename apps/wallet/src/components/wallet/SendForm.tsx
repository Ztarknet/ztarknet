'use client';

import { FEE_TOKEN_ADDRESS } from '@/config/ztarknet';
import { useZtarknet } from '@/providers/ztarknet-provider';
import { Button } from '@workspace/ui/components/button';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SendFormProps {
  accountAddress: string | null;
  initialValues?: { to?: string; amount?: string } | null;
  onTransactionSent?: (amount: number) => void;
}

export function SendForm({
  accountAddress,
  initialValues = null,
  onTransactionSent,
}: SendFormProps) {
  const { invokeContract } = useZtarknet();
  const [toAddress, setToAddress] = useState(initialValues?.to || '');
  const [amount, setAmount] = useState(initialValues?.amount || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (initialValues) {
      if (initialValues.to) setToAddress(initialValues.to);
      if (initialValues.amount) setAmount(initialValues.amount);
    }
  }, [initialValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!toAddress || !amount) {
      setError('Please fill in all fields');
      return;
    }

    if (Number.isNaN(Number.parseFloat(amount)) || Number.parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);

    try {
      const amountInWei = BigInt(Math.floor(Number.parseFloat(amount) * 1e18));

      const transferCall = {
        contractAddress: FEE_TOKEN_ADDRESS,
        entrypoint: 'transfer',
        calldata: [toAddress, amountInWei.toString(), '0'],
      };

      const response = await invokeContract(transferCall);
      setSuccess(`Transaction sent! Hash: ${response.transaction_hash}`);

      if (onTransactionSent) {
        onTransactionSent(Number.parseFloat(amount));
      }

      setToAddress('');
      setAmount('');
    } catch (err) {
      console.error('Failed to send transaction:', err);
      setError(err instanceof Error ? err.message : 'Failed to send transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!accountAddress) {
    return (
      <div className="text-center text-muted py-8">
        <p className="text-sm">Select an account to send transactions</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          To Address
        </span>
        <input
          type="text"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
          placeholder="0x..."
          className="w-full px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/10 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all font-mono"
        />
      </div>

      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-accent/60 mb-1.5 block">
          Amount (STRK)
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

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
          <p className="text-sm text-green-400 break-all">{success}</p>
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            'Send Transaction'
          )}
        </Button>
      </div>
    </form>
  );
}
