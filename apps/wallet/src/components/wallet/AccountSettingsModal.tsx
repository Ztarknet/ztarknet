'use client';

import { Button } from '@workspace/ui/components/button';
import { AlertTriangle, Check, Copy, Eye, EyeOff, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountAddress: string | null;
  privateKey: string | null;
}

export function AccountSettingsModal({
  isOpen,
  onClose,
  accountAddress,
  privateKey,
}: AccountSettingsModalProps) {
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copiedPrivateKey, setCopiedPrivateKey] = useState(false);

  const handleCopyPrivateKey = async () => {
    if (!privateKey) return;

    try {
      await navigator.clipboard.writeText(privateKey);
      setCopiedPrivateKey(true);
      setTimeout(() => setCopiedPrivateKey(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleClose = () => {
    setShowPrivateKey(false);
    setCopiedPrivateKey(false);
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
          onClick={handleClose}
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
              <h2 className="text-lg font-semibold text-foreground">Account Settings</h2>
              <button
                type="button"
                onClick={handleClose}
                className="p-1 text-muted hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-5">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted/60 mb-1.5">
                  Address
                </p>
                <code className="block text-xs font-mono text-foreground/80 break-all p-2 rounded-lg bg-white/[0.02] border border-white/5">
                  {accountAddress}
                </code>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-3">Export Private Key</p>

                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/5 border border-red-500/20 mb-4">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-400">
                    Never share your private key. Anyone with it can control your account.
                  </p>
                </div>

                <div className="flex gap-2">
                  <code className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 text-xs text-foreground/80 font-mono break-all">
                    {showPrivateKey ? privateKey : '•'.repeat(32)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    className="shrink-0"
                  >
                    {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyPrivateKey}
                    className="shrink-0"
                  >
                    {copiedPrivateKey ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
