import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useZtarknetConnector } from '@/context/ZtarknetConnector';

export function DeleteAccountModal({ isOpen, onClose, accountAddress, username, onAccountDeleted }) {
  const { clearPrivateKey, getAvailableKeys } = useZtarknetConnector();
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

    // Verify username matches
    if (confirmUsername !== username) {
      setError(`Please enter "${username}" exactly to confirm deletion`);
      return;
    }

    // Find the key ID for this address
    const keyIds = getAvailableKeys();
    const keyId = keyIds.find(id => id.endsWith(accountAddress));

    if (!keyId) {
      setError('Account key not found');
      return;
    }

    // Delete the account
    clearPrivateKey(keyId);

    // Notify parent and close modal
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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md border border-red-500/30 rounded-2xl shadow-[inset_0_0_0_1px_rgba(239,68,68,0.1),0_16px_40px_rgba(0,0,0,0.3)] backdrop-blur-[16px]"
            style={{
              background: 'radial-gradient(circle at top left, rgba(239, 68, 68, 0.08), rgba(8, 8, 12, 0.95) 60%)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-red-500/30">
              <h2 className="text-xl sm:text-2xl font-bold text-red-400">Delete Account</h2>
              <button
                onClick={onClose}
                className="text-muted hover:text-foreground transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4">
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-sm text-red-400">
                  <strong>Warning:</strong> This action cannot be undone. Deleting your account will permanently remove the private key from this device. Make sure you have backed up your private key if you want to access this account later.
                </p>
              </div>

              <div>
                <p className="text-sm text-muted mb-2">
                  Account Address:
                </p>
                <p className="font-mono text-xs text-foreground break-all p-2 rounded bg-[rgba(8,8,12,0.6)] border border-[rgba(255,137,70,0.1)]">
                  {accountAddress}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Type <span className="font-bold">{username}</span> to confirm deletion
                </label>
                <input
                  type="text"
                  value={confirmUsername}
                  onChange={(e) => {
                    setConfirmUsername(e.target.value);
                    setError('');
                  }}
                  placeholder={username}
                  className="w-full p-3 rounded-lg bg-[rgba(8,8,12,0.6)] border border-[rgba(255,137,70,0.2)] text-foreground placeholder:text-muted focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 sm:py-3 px-4 rounded-full text-sm sm:text-base font-semibold tracking-wide border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:bg-[rgba(255,107,26,0.15)]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={confirmUsername !== username}
                  className="flex-1 py-2.5 sm:py-3 px-4 rounded-full text-sm sm:text-base font-semibold tracking-wide border transition-all duration-200 cursor-pointer border-red-500/50 bg-red-500/20 text-red-400 hover:border-red-500 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
