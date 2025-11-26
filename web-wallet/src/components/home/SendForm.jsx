import React, { useState, useEffect } from 'react';
import { useZtarknetConnector } from '@/context/ZtarknetConnector';

export function SendForm({ accountAddress, initialValues = null }) {
  const { invokeContract } = useZtarknetConnector();
  const [toAddress, setToAddress] = useState(initialValues?.to || '');
  const [amount, setAmount] = useState(initialValues?.amount || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Update form values when initialValues prop changes
  useEffect(() => {
    if (initialValues) {
      if (initialValues.to) setToAddress(initialValues.to);
      if (initialValues.amount) setAmount(initialValues.amount);
    }
  }, [initialValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!toAddress || !amount) {
      setError('Please fill in all fields');
      return;
    }

    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert amount to wei (multiply by 10^18)
      const amountInWei = BigInt(Math.floor(parseFloat(amount) * 1e18));

      // Get fee token address from env or use default
      const feeToken = import.meta.env.VITE_FEE_TOKEN || "0x1ad102b4c4b3e40a51b6fb8a446275d600555bd63a95cdceed3e5cef8a6bc1d";

      // Create transfer call
      const transferCall = {
        contractAddress: feeToken,
        entrypoint: 'transfer',
        calldata: [toAddress, amountInWei.toString(), '0'], // (recipient, amount_low, amount_high)
      };

      const response = await invokeContract(transferCall);
      setSuccess(`Transaction sent! Hash: ${response.transaction_hash}`);

      // Reset form
      setToAddress('');
      setAmount('');
    } catch (err) {
      console.error('Failed to send transaction:', err);
      setError(err.message || 'Failed to send transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!accountAddress) {
    return (
      <div className="text-center text-muted py-8">
        <p>Select an account to send transactions</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Token Selector (placeholder for now) */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Token
        </label>
        <div className="w-full p-3 rounded-lg bg-[rgba(255,107,26,0.05)] border border-[rgba(255,137,70,0.2)] text-muted">
          STRK (Fee Token)
        </div>
      </div>

      {/* To Address */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          To Address
        </label>
        <input
          type="text"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
          placeholder="0x..."
          className="w-full p-3 rounded-lg bg-[rgba(8,8,12,0.6)] border border-[rgba(255,137,70,0.2)] text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Amount (STRK)
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

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm break-all">
          {success}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 rounded-full font-semibold tracking-wide border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:bg-[rgba(255,107,26,0.15)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {isSubmitting ? 'Sending...' : 'Send Transaction'}
      </button>
    </form>
  );
}
