import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useZtarknetConnector } from '@/context/ZtarknetConnector';
import { ec } from 'starknet';
import { getNetworkConfig } from '@/config/ztarknet';

export function ImportAccountModal({ isOpen, onClose, onAccountImported }) {
  const { getBalance, storePrivateKey, getAvailableKeys } = useZtarknetConnector();
  const [privateKeyInput, setPrivateKeyInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setPrivateKeyInput('');
      setIsValidating(false);
      setError('');
      setIsValid(false);
    }
  }, [isOpen]);

  useEffect(() => {
    // Validate private key format whenever input changes
    const validatePrivateKeyFormat = () => {
      if (!privateKeyInput.trim()) {
        setIsValid(false);
        setError('');
        return;
      }

      try {
        // Check if it's a valid hex string
        const trimmedKey = privateKeyInput.trim();
        if (!/^0x[0-9a-fA-F]+$/.test(trimmedKey)) {
          setIsValid(false);
          setError('Invalid private key format. Must be a hex string starting with 0x');
          return;
        }

        // Check if the key is within valid range (not too long)
        if (trimmedKey.length > 66) {
          setIsValid(false);
          setError('Private key is too long');
          return;
        }

        // Try to generate public key to validate it's a valid curve point
        try {
          ec.starkCurve.getStarkKey(trimmedKey);
          setIsValid(true);
          setError('');
        } catch (err) {
          setIsValid(false);
          setError('Invalid private key. Cannot derive public key.');
        }
      } catch (err) {
        setIsValid(false);
        setError('Invalid private key format');
      }
    };

    validatePrivateKeyFormat();
  }, [privateKeyInput]);

  const handleImport = async () => {
    if (!isValid || !privateKeyInput.trim()) {
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const config = getNetworkConfig();
      const trimmedKey = privateKeyInput.trim();

      // Calculate account address from private key
      const starkKeyPub = ec.starkCurve.getStarkKey(trimmedKey);
      const { hash } = await import('starknet');
      const constructorCalldata = [starkKeyPub];
      const accountAddress = hash.calculateContractAddressFromHash(
        starkKeyPub,
        config.accountClassHash,
        constructorCalldata,
        0
      );

      console.log('Checking if account exists at address:', accountAddress);

      // Check if account already imported
      const availableKeys = getAvailableKeys();
      const existingKey = availableKeys.find(keyId =>
        keyId.toLowerCase().endsWith(accountAddress.toLowerCase())
      );

      if (existingKey) {
        setError('This account is already imported');
        setIsValidating(false);
        return;
      }

      // Check if account exists on the blockchain by checking balance
      // An account that doesn't exist will return 0, but we also need to check
      // if the account contract is actually deployed
      const balance = await getBalance(accountAddress);

      // For now, we'll check if the balance is non-zero OR if we can successfully query it
      // This is a simple check - ideally we'd check if the account contract is deployed
      console.log('Account balance:', balance.toString());

      // Try to get account nonce to verify it's deployed
      const { RpcProvider, constants } = await import('starknet');
      const provider = new RpcProvider({
        nodeUrl: config.rpcUrl,
        chainId: config.chainId,
        blockIdentifier: 'latest',
      });

      let accountExists = false;
      try {
        const nonce = await provider.getNonceForAddress(accountAddress);
        console.log('Account nonce:', nonce);
        // If we can get a nonce, the account is deployed
        accountExists = true;
      } catch (err) {
        console.log('Failed to get nonce, account likely not deployed:', err.message);
        accountExists = false;
      }

      if (!accountExists) {
        setError('No account exists with this private key. Please create an account first or use a private key from an existing deployed account.');
        setIsValidating(false);
        return;
      }

      // Store the private key
      storePrivateKey(trimmedKey, accountAddress);

      console.log('Account imported successfully:', accountAddress);

      // Call the callback and close modal
      onAccountImported(trimmedKey, accountAddress);
      onClose();
    } catch (err) {
      console.error('Failed to import account:', err);
      setError(`Failed to import account: ${err.message}`);
    } finally {
      setIsValidating(false);
    }
  };

  const handleCancel = () => {
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
          onClick={handleCancel}
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
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Import Account</h2>
              <button
                onClick={handleCancel}
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
              <div className="space-y-4">
                {/* Info Message */}
                <div className="p-4 rounded-lg bg-[rgba(255,107,26,0.1)] border border-[rgba(255,137,70,0.2)]">
                  <div className="flex items-start gap-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-accent flex-shrink-0 mt-0.5"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <div className="text-sm text-foreground">
                      <p>Import an existing account by entering its private key. The account must already be deployed on the network.</p>
                    </div>
                  </div>
                </div>

                {/* Private Key Input */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">
                    Private Key
                  </label>
                  <textarea
                    value={privateKeyInput}
                    onChange={(e) => setPrivateKeyInput(e.target.value)}
                    placeholder="0x..."
                    className="w-full p-3 rounded-lg bg-[rgba(8,8,12,0.6)] border border-[rgba(255,137,70,0.2)] text-foreground font-mono text-sm resize-none focus:outline-none focus:border-accent transition-colors"
                    rows={3}
                    disabled={isValidating}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Validation Status */}
                {privateKeyInput.trim() && !error && isValid && (
                  <div className="p-3 rounded-lg bg-[rgba(80,200,120,0.1)] border border-[rgba(80,200,120,0.3)] text-[#50C878] text-sm flex items-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Valid private key format
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-2.5 sm:py-3 px-4 rounded-full text-sm sm:text-base font-semibold tracking-wide border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:bg-[rgba(255,107,26,0.15)]"
                    disabled={isValidating}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={!isValid || isValidating}
                    className={`flex-1 py-2.5 sm:py-3 px-4 rounded-full text-sm sm:text-base font-semibold tracking-wide border transition-all duration-200 ${
                      isValid && !isValidating
                        ? 'cursor-pointer border-accent text-foreground hover:bg-[rgba(255,107,26,0.15)] hover:-translate-y-0.5'
                        : 'cursor-not-allowed border-[rgba(255,107,26,0.1)] text-muted opacity-50'
                    }`}
                  >
                    {isValidating ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Validating...
                      </span>
                    ) : (
                      'Import'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
