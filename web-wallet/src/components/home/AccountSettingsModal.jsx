import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function AccountSettingsModal({ isOpen, onClose, accountAddress, privateKey }) {
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copiedPrivateKey, setCopiedPrivateKey] = useState(false);

  const handleCopyPrivateKey = async () => {
    if (!privateKey) return;

    try {
      await navigator.clipboard.writeText(privateKey);
      setCopiedPrivateKey(true);
      setTimeout(() => setCopiedPrivateKey(false), 2000);
    } catch (err) {
      console.error('Failed to copy private key:', err);
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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[rgba(255,137,70,0.2)] rounded-2xl shadow-[inset_0_0_0_1px_rgba(255,137,70,0.05),0_16px_40px_rgba(0,0,0,0.3)] backdrop-blur-[16px]"
            style={{
              background: 'radial-gradient(circle at top left, rgba(255, 107, 26, 0.08), rgba(8, 8, 12, 0.95) 60%)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[rgba(255,137,70,0.2)]">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Account Settings</h2>
              <button
                onClick={handleClose}
                className="text-muted hover:text-foreground transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              {/* Account Address */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-muted mb-2 block">Account Address</label>
                <div className="p-3 rounded-lg bg-[rgba(8,8,12,0.6)] border border-[rgba(255,137,70,0.2)]">
                  <code className="text-sm font-mono text-foreground break-all">
                    {accountAddress}
                  </code>
                </div>
              </div>

              {/* Export Private Key Section */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Export Private Key</h3>
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 mb-4">
                  <div className="flex items-start gap-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-red-400 flex-shrink-0 mt-0.5"
                    >
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <div className="text-sm text-red-400">
                      <p className="font-semibold mb-1">Warning: Keep your private key secure!</p>
                      <p>Never share your private key with anyone. Anyone with access to your private key can control your account and assets.</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 p-3 rounded-lg bg-[rgba(8,8,12,0.6)] border border-[rgba(255,137,70,0.2)] flex items-center">
                    <code className="flex-1 text-sm font-mono text-foreground break-all">
                      {showPrivateKey ? privateKey : '•'.repeat(66)}
                    </code>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                      className="p-3 rounded-lg border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:bg-[rgba(255,107,26,0.15)]"
                      title={showPrivateKey ? 'Hide private key' : 'Show private key'}
                    >
                      {showPrivateKey ? (
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
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
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
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={handleCopyPrivateKey}
                      className="p-3 rounded-lg border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:bg-[rgba(255,107,26,0.15)]"
                      title={copiedPrivateKey ? 'Copied!' : 'Copy private key'}
                    >
                      {copiedPrivateKey ? (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-[#50C878]"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
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
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
