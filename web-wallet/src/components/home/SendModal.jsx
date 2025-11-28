import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useZtarknetConnector } from '@/context/ZtarknetConnector';
import { Account, RpcProvider, ec, hash } from 'starknet';
import { getNetworkConfig } from '@/config/ztarknet';

export function SendModal({ isOpen, onClose, toAddress = '', amount = '' }) {
  const { getAvailableKeys, getPrivateKey, getUsernameForAddress } = useZtarknetConnector();
  const [selectedAccountKeyId, setSelectedAccountKeyId] = useState('');
  const [toAddressValue, setToAddressValue] = useState(toAddress);
  const [amountValue, setAmountValue] = useState(amount);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [txHash, setTxHash] = useState('');
  const [accounts, setAccounts] = useState([]);

  // Load available accounts when modal opens
  useEffect(() => {
    if (isOpen) {
      const loadAccounts = async () => {
        const availableKeys = getAvailableKeys();
        if (availableKeys && availableKeys.length > 0) {
          const accountsList = await Promise.all(
            availableKeys.map(async (keyId) => {
              // Extract address from keyId (format: network.appname.classname.address)
              const parts = keyId.split('.');
              const address = parts[parts.length - 1];

              // Fetch username for this address
              const username = await getUsernameForAddress(address);
              const displayName = username || `Account-${address.slice(-8)}`;

              return { keyId, address, username: displayName };
            })
          );
          setAccounts(accountsList);

          // Default to first account
          if (!selectedAccountKeyId) {
            setSelectedAccountKeyId(accountsList[0].keyId);
          }
        }
      };

      loadAccounts();

      // Set initial values from props
      setToAddressValue(toAddress);
      setAmountValue(amount);
    }
  }, [isOpen, getAvailableKeys, getUsernameForAddress, toAddress, amount]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setError('');
      setSuccess('');
      setTxHash('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setTxHash('');

    if (!toAddressValue || !amountValue) {
      setError('Please fill in all fields');
      return;
    }

    if (isNaN(parseFloat(amountValue)) || parseFloat(amountValue) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!selectedAccountKeyId) {
      setError('Please select an account');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the private key for the selected account
      const privateKey = getPrivateKey(selectedAccountKeyId);
      if (!privateKey) {
        throw new Error('Failed to get private key for selected account');
      }

      // Get network config and create provider
      const config = getNetworkConfig();
      const provider = new RpcProvider({
        nodeUrl: config.rpcUrl,
        chainId: config.chainId,
        blockIdentifier: "latest",
      });

      // Calculate account address from private key
      const starkKeyPub = ec.starkCurve.getStarkKey(privateKey);
      const constructorCalldata = [starkKeyPub];
      const accountAddress = hash.calculateContractAddressFromHash(
        starkKeyPub,
        config.accountClassHash,
        constructorCalldata,
        0
      );

      // Create Account instance directly for this transaction
      const accountInstance = new Account({
        provider: provider,
        address: accountAddress,
        signer: privateKey,
        cairoVersion: "1",
        transactionVersion: '0x3'
      });

      // Convert amount to wei (multiply by 10^18)
      const amountInWei = BigInt(Math.floor(parseFloat(amountValue) * 1e18));

      // Get fee token address from env or use default
      const feeToken = import.meta.env.VITE_FEE_TOKEN || "0x1ad102b4c4b3e40a51b6fb8a446275d600555bd63a95cdceed3e5cef8a6bc1d";

      // Create transfer call
      const transferCall = {
        contractAddress: feeToken,
        entrypoint: 'transfer',
        calldata: [toAddressValue, amountInWei.toString(), '0'], // (recipient, amount_low, amount_high)
      };

      // Execute the transaction directly using this account instance
      const nonce = await provider.getNonceForAddress(accountInstance.address, "pre_confirmed");

      const response = await accountInstance.execute(transferCall, {
        nonce: nonce,
        skipValidate: true,
        blockIdentifier: "pre_confirmed",
      });

      // Wait for transaction confirmation
      await provider.waitForTransaction(response.transaction_hash, {
        retryInterval: 100,
      });

      // Show success message with transaction hash
      setSuccess('Confirmed');
      setTxHash(response.transaction_hash);
      setIsSubmitting(false);

      // Wait 3 seconds to show the success message, then navigate and close
      setTimeout(() => {
        // Clear URL parameters
        const url = new URL(window.location);
        url.search = '';
        url.hash = 'top';
        window.history.replaceState({}, '', url);

        onClose();
      }, 3000);
    } catch (err) {
      console.error('Failed to send transaction:', err);
      setError(err.message || 'Failed to send transaction');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      // Clear URL parameters when closing
      const url = new URL(window.location);
      url.search = '';
      window.history.replaceState({}, '', url);

      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={handleCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md border border-[rgba(255,137,70,0.2)] rounded-2xl shadow-[inset_0_0_0_1px_rgba(255,137,70,0.05),0_16px_40px_rgba(0,0,0,0.3)] backdrop-blur-[16px]"
            style={{
              background: 'radial-gradient(circle at top left, rgba(255, 107, 26, 0.08), rgba(8, 8, 12, 0.95) 60%)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[rgba(255,137,70,0.2)]">
              <h2 className="text-2xl font-bold text-foreground">Send STRK</h2>
              <button
                onClick={handleCancel}
                disabled={isSubmitting}
                className="text-muted hover:text-foreground transition-colors disabled:opacity-50"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400">
                  <div className="flex items-center gap-2 mb-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="font-semibold">{success}</span>
                  </div>
                  <div className="text-xs font-mono break-all">
                    {txHash}
                  </div>
                </div>
              )}

              {/* Account Selector */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  From Account
                </label>
                <select
                  value={selectedAccountKeyId}
                  onChange={(e) => setSelectedAccountKeyId(e.target.value)}
                  disabled={isSubmitting || success}
                  className="w-full p-3 rounded-lg bg-[rgba(8,8,12,0.6)] border border-[rgba(255,137,70,0.2)] text-foreground focus:outline-none focus:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {accounts.map((account) => (
                    <option key={account.keyId} value={account.keyId}>
                      {account.username}
                    </option>
                  ))}
                </select>
              </div>

              {/* To Address */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  To Address
                </label>
                <input
                  type="text"
                  value={toAddressValue}
                  onChange={(e) => setToAddressValue(e.target.value)}
                  placeholder="0x..."
                  disabled={isSubmitting || success}
                  className="w-full p-3 rounded-lg bg-[rgba(8,8,12,0.6)] border border-[rgba(255,137,70,0.2)] text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  value={amountValue}
                  onChange={(e) => setAmountValue(e.target.value)}
                  placeholder="0.0"
                  disabled={isSubmitting || success}
                  className="w-full p-3 rounded-lg bg-[rgba(8,8,12,0.6)] border border-[rgba(255,137,70,0.2)] text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || success}
                className="w-full py-3 px-4 rounded-full font-semibold tracking-wide border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:bg-[rgba(255,107,26,0.15)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              >
                {success ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Confirmed
                  </>
                ) : isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
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
                      <line x1="12" y1="19" x2="12" y2="5"></line>
                      <polyline points="5 12 12 5 19 12"></polyline>
                    </svg>
                    Send
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
