'use client';

import { STORAGE_KEYS, getNetworkConfig } from '@/config/ztarknet';
import { useZtarknet } from '@/providers/ztarknet-provider';
import { Button } from '@workspace/ui/components/button';
import { AlertCircle, Check, Copy, ExternalLink, Loader2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { ec, hash } from 'starknet';

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountCreated: (privateKey: string, address: string) => void;
}

const MINIMUM_BALANCE = BigInt(10000000000000000);

export function CreateAccountModal({ isOpen, onClose, onAccountCreated }: CreateAccountModalProps) {
  const { getBalance } = useZtarknet();
  const [accountAddress, setAccountAddress] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [currentBalance, setCurrentBalance] = useState<bigint>(BigInt(0));
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentInitiated, setDeploymentInitiated] = useState(false);

  useEffect(() => {
    if (isOpen && !accountAddress) {
      const generateAccount = async () => {
        try {
          const config = getNetworkConfig();
          const randomBytes = new Uint8Array(31);
          crypto.getRandomValues(randomBytes);
          const newPrivateKey = `0x${Array.from(randomBytes)
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('')}`;
          const starkKeyPub = ec.starkCurve.getStarkKey(newPrivateKey);
          const constructorCalldata = [starkKeyPub];
          const newAccountAddress = hash.calculateContractAddressFromHash(
            starkKeyPub,
            config.accountClassHash,
            constructorCalldata,
            0
          );
          setPrivateKey(newPrivateKey);
          setAccountAddress(newAccountAddress);
        } catch (err) {
          console.error('Failed to generate account:', err);
          setError('Failed to generate account');
        }
      };
      generateAccount();
    }
  }, [isOpen, accountAddress]);

  useEffect(() => {
    if (!isOpen) {
      setAccountAddress(null);
      setPrivateKey(null);
      setCurrentBalance(BigInt(0));
      setError('');
      setCopied(false);
      setDeploymentInitiated(false);
      setIsDeploying(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (accountAddress) {
      const pollBalance = async () => {
        try {
          const balance = await getBalance(accountAddress);
          setCurrentBalance(balance);

          if (balance >= MINIMUM_BALANCE && !deploymentInitiated && privateKey) {
            setDeploymentInitiated(true);
            clearInterval(intervalId);
            setIsDeploying(true);

            const createdAtKey = `${STORAGE_KEYS.ACCOUNT_ADDRESS}_created_at_${accountAddress}`;
            localStorage.setItem(createdAtKey, Date.now().toString());

            setTimeout(() => {
              onAccountCreated(privateKey, accountAddress);
              onClose();
            }, 8000);
          }
        } catch (err) {
          console.error('Failed to check balance:', err);
        }
      };

      pollBalance();
      intervalId = setInterval(pollBalance, 3000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [accountAddress, getBalance, onAccountCreated, onClose, privateKey, deploymentInitiated]);

  const handleOpenFaucet = () => window.open('https://faucet.ztarknet.cash', '_blank');

  const handleCopyAddress = async () => {
    if (!accountAddress) return;
    try {
      await navigator.clipboard.writeText(accountAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isOpen) return null;

  const balanceInTokens = Number(currentBalance) / 1e18;
  const isFunded = currentBalance >= MINIMUM_BALANCE;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-[rgba(255,137,70,0.15)] bg-[#0a0a0c] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <h2 className="text-lg font-semibold text-foreground">Create Account</h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-muted hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-5">
              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <p className="text-sm text-muted">
                Fund your new account with STRK tokens to activate it.
              </p>

              {/* Steps */}
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-xs font-semibold text-accent">
                    1
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground mb-2">Copy your address</p>
                    <div className="flex gap-2">
                      <code className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 text-xs text-foreground/80 truncate font-mono">
                        {accountAddress || 'Generating...'}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyAddress}
                        className="shrink-0"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-xs font-semibold text-accent">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground mb-2">Fund with faucet</p>
                    <Button variant="primary" size="sm" onClick={handleOpenFaucet}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Faucet
                    </Button>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-xs font-semibold text-accent">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Wait for confirmation</p>
                    <p className="text-xs text-muted mt-0.5">Takes about 5-10 seconds</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Status</span>
                  {isDeploying ? (
                    <span className="flex items-center gap-1.5 text-xs text-amber-400">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Deploying...
                    </span>
                  ) : isFunded ? (
                    <span className="flex items-center gap-1.5 text-xs text-green-400">
                      <Check className="w-3 h-3" />
                      Funded
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs text-muted">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Waiting...
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted">
                  Balance:{' '}
                  <span className="font-mono text-foreground">
                    {balanceInTokens.toFixed(4)} STRK
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
