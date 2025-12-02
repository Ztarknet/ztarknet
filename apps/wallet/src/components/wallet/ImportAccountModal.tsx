'use client';

import { getNetworkConfig } from '@/config/ztarknet';
import { useZtarknet } from '@/providers/ztarknet-provider';
import { Button } from '@workspace/ui/components/button';
import { AlertCircle, Check, Info, Loader2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { RpcProvider, ec, hash } from 'starknet';

interface ImportAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountImported: (privateKey: string, address: string) => void;
}

export function ImportAccountModal({
  isOpen,
  onClose,
  onAccountImported,
}: ImportAccountModalProps) {
  const { storePrivateKey, getAvailableKeys } = useZtarknet();
  const [privateKeyInput, setPrivateKeyInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPrivateKeyInput('');
      setIsValidating(false);
      setError('');
      setIsValid(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const validatePrivateKeyFormat = () => {
      if (!privateKeyInput.trim()) {
        setIsValid(false);
        setError('');
        return;
      }

      try {
        const trimmedKey = privateKeyInput.trim();
        if (!/^0x[0-9a-fA-F]+$/.test(trimmedKey)) {
          setIsValid(false);
          setError('Invalid format. Must start with 0x');
          return;
        }

        if (trimmedKey.length > 66) {
          setIsValid(false);
          setError('Private key is too long');
          return;
        }

        try {
          ec.starkCurve.getStarkKey(trimmedKey);
          setIsValid(true);
          setError('');
        } catch {
          setIsValid(false);
          setError('Invalid private key');
        }
      } catch {
        setIsValid(false);
        setError('Invalid format');
      }
    };

    validatePrivateKeyFormat();
  }, [privateKeyInput]);

  const handleImport = async () => {
    if (!isValid || !privateKeyInput.trim()) return;

    setIsValidating(true);
    setError('');

    try {
      const config = getNetworkConfig();
      const trimmedKey = privateKeyInput.trim();

      const starkKeyPub = ec.starkCurve.getStarkKey(trimmedKey);
      const constructorCalldata = [starkKeyPub];
      const accountAddress = hash.calculateContractAddressFromHash(
        starkKeyPub,
        config.accountClassHash,
        constructorCalldata,
        0
      );

      const availableKeys = getAvailableKeys();
      const existingKey = availableKeys.find(
        (keyId) =>
          keyId &&
          accountAddress &&
          keyId.toLowerCase().endsWith(accountAddress?.toLowerCase() ?? '')
      );

      if (existingKey) {
        setError('Account already imported');
        setIsValidating(false);
        return;
      }

      const provider = new RpcProvider({
        nodeUrl: config.rpcUrl,
        blockIdentifier: 'latest',
      });

      let accountExists = false;
      try {
        await provider.getNonceForAddress(accountAddress);
        accountExists = true;
      } catch {
        accountExists = false;
      }

      if (!accountExists) {
        setError('No deployed account found with this key');
        setIsValidating(false);
        return;
      }

      storePrivateKey(trimmedKey, accountAddress);
      onAccountImported(trimmedKey, accountAddress);
      onClose();
    } catch (err) {
      console.error('Failed to import:', err);
      setError(err instanceof Error ? err.message : 'Failed to import');
    } finally {
      setIsValidating(false);
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
          onClick={onClose}
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
              <h2 className="text-lg font-semibold text-foreground">Import Account</h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-muted hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/5 border border-accent/10">
                <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <p className="text-xs text-muted">
                  Import an existing deployed account with its private key.
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent/60 mb-1.5 block">
                  Private Key
                </span>
                <textarea
                  value={privateKeyInput}
                  onChange={(e) => setPrivateKeyInput(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/10 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all font-mono resize-none"
                  rows={3}
                  disabled={isValidating}
                />
              </div>

              {error && (
                <div className="flex items-center gap-1.5 text-xs text-red-400">
                  <AlertCircle className="w-3 h-3" />
                  {error}
                </div>
              )}

              {privateKeyInput.trim() && !error && isValid && (
                <div className="flex items-center gap-1.5 text-xs text-green-400">
                  <Check className="w-3 h-3" />
                  Valid format
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={onClose}
                  disabled={isValidating}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleImport}
                  disabled={!isValid || isValidating}
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    'Import'
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
