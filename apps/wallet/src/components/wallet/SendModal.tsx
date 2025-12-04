'use client';

import { FEE_TOKEN_ADDRESS, getNetworkConfig } from '@/config/ztarknet';
import { useZtarknet } from '@/providers/ztarknet-provider';
import { Button } from '@workspace/ui/components/button';
import { AlertCircle, ArrowUp, Check, Loader2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Account, RpcProvider, ec, hash } from 'starknet';

interface AccountOption {
  keyId: string;
  address: string;
  username: string;
}

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  toAddress?: string;
  amount?: string;
}

export function SendModal({ isOpen, onClose, toAddress = '', amount = '' }: SendModalProps) {
  const { getAvailableKeys, getPrivateKey, getUsernameForAddress } = useZtarknet();
  const [selectedAccountKeyId, setSelectedAccountKeyId] = useState('');
  const [toAddressValue, setToAddressValue] = useState(toAddress);
  const [amountValue, setAmountValue] = useState(amount);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [txHash, setTxHash] = useState('');
  const [accounts, setAccounts] = useState<AccountOption[]>([]);

  useEffect(() => {
    if (isOpen) {
      const loadAccounts = async () => {
        const availableKeys = getAvailableKeys();
        if (availableKeys && availableKeys.length > 0) {
          const accountsPromises = availableKeys.map(async (keyId) => {
            const parts = keyId.split('.');
            const address = parts[parts.length - 1];
            if (!address) return null;
            const username = await getUsernameForAddress(address);
            const displayName = username || `Account-${address.slice(-8)}`;
            return { keyId, address, username: displayName };
          });
          const accountsResults = await Promise.all(accountsPromises);
          const accountsList = accountsResults.filter((acc): acc is AccountOption => acc !== null);
          setAccounts(accountsList);

          const firstAccount = accountsList[0];
          if (!selectedAccountKeyId && firstAccount) {
            setSelectedAccountKeyId(firstAccount.keyId);
          }
        }
      };

      loadAccounts();
      setToAddressValue(toAddress);
      setAmountValue(amount);
    }
  }, [isOpen, getAvailableKeys, getUsernameForAddress, toAddress, amount, selectedAccountKeyId]);

  useEffect(() => {
    if (!isOpen) {
      setError('');
      setSuccess('');
      setTxHash('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setTxHash('');

    if (!toAddressValue || !amountValue) {
      setError('Please fill in all fields');
      return;
    }

    if (Number.isNaN(Number.parseFloat(amountValue)) || Number.parseFloat(amountValue) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!selectedAccountKeyId) {
      setError('Please select an account');
      return;
    }

    setIsSubmitting(true);

    try {
      if (!selectedAccountKeyId) {
        throw new Error('No account selected');
      }

      const privateKey = getPrivateKey(selectedAccountKeyId);
      if (!privateKey) {
        throw new Error('Failed to get private key. Please create or import an account first.');
      }

      const config = getNetworkConfig();
      if (!config.accountClassHash) {
        throw new Error('Account class hash not configured');
      }

      const provider = new RpcProvider({
        nodeUrl: config.rpcUrl,
        blockIdentifier: 'latest',
      });

      const starkKeyPub = ec.starkCurve.getStarkKey(privateKey);
      const constructorCalldata = [starkKeyPub];
      const accountAddress = hash.calculateContractAddressFromHash(
        starkKeyPub,
        config.accountClassHash,
        constructorCalldata,
        0
      );

      if (!accountAddress) {
        throw new Error('Failed to calculate account address');
      }

      const accountInstance = new Account({
        provider,
        address: accountAddress,
        signer: privateKey,
        cairoVersion: '1',
        transactionVersion: '0x3',
      });
      const amountInWei = BigInt(Math.floor(Number.parseFloat(amountValue) * 1e18));

      const transferCall = {
        contractAddress: FEE_TOKEN_ADDRESS,
        entrypoint: 'transfer',
        calldata: [toAddressValue, amountInWei.toString(), '0'],
      };

      const nonce = await provider.getNonceForAddress(accountInstance.address, 'pre_confirmed');

      const response = await accountInstance.execute(transferCall, {
        nonce: nonce,
        skipValidate: true,
        blockIdentifier: 'pre_confirmed',
      });

      await provider.waitForTransaction(response.transaction_hash, { retryInterval: 100 });

      setSuccess('Confirmed');
      setTxHash(response.transaction_hash);
      setIsSubmitting(false);

      setTimeout(() => {
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.search = '';
          url.hash = 'top';
          window.history.replaceState({}, '', url.toString());
        }
        onClose();
      }, 3000);
    } catch (err) {
      console.error('Failed to send:', err);
      setError(err instanceof Error ? err.message : 'Failed to send');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.search = '';
        window.history.replaceState({}, '', url.toString());
      }
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
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl border border-[rgba(255,137,70,0.15)] bg-[#0a0a0c] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <h2 className="text-lg font-semibold text-foreground">Send STRK</h2>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="p-1 text-muted hover:text-foreground transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-green-400">{success}</span>
                  </div>
                  <code className="text-xs font-mono text-green-400/80 break-all">{txHash}</code>
                </div>
              )}

              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent/60 mb-1.5 block">
                  From Account
                </span>
                {accounts.length === 0 ? (
                  <div className="px-3 py-2.5 rounded-lg bg-yellow-500/5 border border-yellow-500/20 text-sm text-yellow-400">
                    No accounts found. Please create or import an account first.
                  </div>
                ) : (
                  <select
                    value={selectedAccountKeyId}
                    onChange={(e) => setSelectedAccountKeyId(e.target.value)}
                    disabled={isSubmitting || !!success}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/10 text-sm text-foreground focus:outline-none focus:border-accent/50 transition-all disabled:opacity-50"
                  >
                    {accounts.map((account) => (
                      <option key={account.keyId} value={account.keyId}>
                        {account.username}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent/60 mb-1.5 block">
                  To Address
                </span>
                <input
                  type="text"
                  value={toAddressValue}
                  onChange={(e) => setToAddressValue(e.target.value)}
                  placeholder="0x..."
                  disabled={isSubmitting || !!success}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/10 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-all font-mono disabled:opacity-50"
                />
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent/60 mb-1.5 block">
                  Amount (STRK)
                </span>
                <input
                  type="number"
                  step="0.0001"
                  value={amountValue}
                  onChange={(e) => setAmountValue(e.target.value)}
                  placeholder="0.0"
                  disabled={isSubmitting || !!success}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/10 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-all font-mono disabled:opacity-50"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting || !!success || accounts.length === 0}
                >
                  {success ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Confirmed
                    </>
                  ) : isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <ArrowUp className="w-4 h-4 mr-2" />
                      Send
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
