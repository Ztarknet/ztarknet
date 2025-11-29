'use client';

import { useZtarknet } from '@/providers/ztarknet-provider';
import { Button } from '@workspace/ui/components/button';
import { AlertTriangle, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountAddress: string | null;
  username: string | null;
  onAccountDeleted: () => void;
}

export function DeleteAccountModal({
  isOpen,
  onClose,
  accountAddress,
  username,
  onAccountDeleted,
}: DeleteAccountModalProps) {
  const { clearPrivateKey, getAvailableKeys } = useZtarknet();
  const [confirmUsername, setConfirmUsername] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setConfirmUsername('');
      setError('');
    }
  }, [isOpen]);

  const handleDelete = () => {
    if (!accountAddress) {
      setError('No account selected');
      return;
    }

    if (confirmUsername !== username) {
      setError(`Type "${username}" to confirm`);
      return;
    }

    const keyIds = getAvailableKeys();
    const keyId = keyIds.find((id) => id.endsWith(accountAddress));

    if (!keyId) {
      setError('Account key not found');
      return;
    }

    clearPrivateKey(keyId);
    onAccountDeleted();
    onClose();
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
            className="w-full max-w-md rounded-xl border border-red-500/20 bg-[#0a0a0c] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-red-500/10">
              <h2 className="text-lg font-semibold text-red-400">Delete Account</h2>
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
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">
                  This action cannot be undone. Back up your private key first.
                </p>
              </div>

              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted/60 mb-1.5">
                  Address
                </p>
                <code className="block text-xs font-mono text-foreground/80 break-all p-2 rounded-lg bg-white/[0.02] border border-white/5">
                  {accountAddress}
                </code>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted/60 mb-1.5 block">
                  Type <span className="text-foreground font-semibold">{username}</span> to confirm
                </span>
                <input
                  type="text"
                  value={confirmUsername}
                  onChange={(e) => {
                    setConfirmUsername(e.target.value);
                    setError('');
                  }}
                  placeholder={username || ''}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/10 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
                />
              </div>

              {error && <p className="text-xs text-red-400">{error}</p>}

              <div className="flex gap-3 pt-2">
                <Button variant="ghost" className="flex-1" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                  onClick={handleDelete}
                  disabled={confirmUsername !== username}
                >
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
