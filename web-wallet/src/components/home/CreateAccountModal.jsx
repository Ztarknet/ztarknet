import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useZtarknetConnector } from '@/context/ZtarknetConnector';
import { STORAGE_KEYS } from '@/config/ztarknet';

export function CreateAccountModal({ isOpen, onClose, onAccountCreated }) {
  const { createAccount, getBalance, storePrivateKey } = useZtarknetConnector();
  const [accountAddress, setAccountAddress] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(BigInt(0));
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentInitiated, setDeploymentInitiated] = useState(false);

  const MINIMUM_BALANCE = BigInt(10000000000000000); // 0.01 STRK

  // Generate account address immediately when modal opens
  useEffect(() => {
    if (isOpen && !accountAddress) {
      const generateAccount = async () => {
        try {
          const config = await import('@/config/ztarknet').then(m => m.getNetworkConfig());
          const ec = await import('starknet').then(m => m.ec);
          const hash = await import('starknet').then(m => m.hash);

          // Generate private key
          const randomBytes = new Uint8Array(31);
          crypto.getRandomValues(randomBytes);
          const newPrivateKey = '0x' + Array.from(randomBytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

          // Calculate account address
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
          setError('Failed to generate account. Please try again.');
        }
      };

      generateAccount();
    }
  }, [isOpen, accountAddress]);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setAccountAddress(null);
      setPrivateKey(null);
      setIsChecking(false);
      setCurrentBalance(BigInt(0));
      setError('');
      setCopied(false);
      setDeploymentInitiated(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let intervalId;

    if (accountAddress) {
      console.log('Starting balance polling for address:', accountAddress);
      // Start polling balance
      const pollBalance = async () => {
        setIsChecking(true);
        try {
          console.log('Checking balance for:', accountAddress);
          const balance = await getBalance(accountAddress);
          console.log('Balance received:', balance.toString(), 'Minimum required:', MINIMUM_BALANCE.toString());
          setCurrentBalance(balance);

          // If funded, deploy and close modal
          if (balance >= MINIMUM_BALANCE && !deploymentInitiated) {
            console.log('Account funded! Deploying...');
            setDeploymentInitiated(true);
            clearInterval(intervalId);
            setIsChecking(false);
            setIsDeploying(true);

            // Store the creation timestamp
            const createdAtKey = `${STORAGE_KEYS.ACCOUNT_ADDRESS}_created_at_${accountAddress}`;
            localStorage.setItem(createdAtKey, Date.now().toString());

            // Wait a bit to show the deploying message, then proceed
            setTimeout(() => {
              onAccountCreated(privateKey, accountAddress);
              onClose();
            }, 500);
          }
        } catch (err) {
          console.error('Failed to check balance:', err);
          setError(`Failed to check balance: ${err.message}`);
        }
      };

      // Poll immediately and then every 3 seconds
      pollBalance();
      intervalId = setInterval(pollBalance, 3000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [accountAddress, getBalance, onAccountCreated, onClose, privateKey, deploymentInitiated]);

  const handleOpenFaucet = () => {
    window.open('https://faucet.ztarknet.cash', '_blank');
  };

  const handleCopyAddress = async () => {
    if (!accountAddress) return;

    try {
      await navigator.clipboard.writeText(accountAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const handleCancel = () => {
    onClose();
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
            <div className="flex items-center justify-between p-6 border-b border-[rgba(255,137,70,0.2)]">
              <h2 className="text-2xl font-bold text-foreground">Create New Account</h2>
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
            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                <p className="text-muted">
                  New accounts need gas tokens to setup. Please follow these steps to get your FREE gas!
                </p>

                {/* Step 1: Copy Address */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[rgba(255,107,26,0.2)] border border-[rgba(255,137,70,0.4)] flex items-center justify-center font-bold text-foreground">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-2">Copy your account address</h4>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={accountAddress || ''}
                        readOnly
                        className="flex-1 p-2 rounded-lg bg-[rgba(8,8,12,0.6)] border border-[rgba(255,137,70,0.2)] text-foreground font-mono text-sm truncate"
                      />
                      <button
                        onClick={handleCopyAddress}
                        className="px-4 rounded-lg font-semibold border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:bg-[rgba(255,107,26,0.15)]"
                      >
                        {copied ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 2: Fund Account */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[rgba(255,107,26,0.2)] border border-[rgba(255,137,70,0.4)] flex items-center justify-center font-bold text-foreground">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-2">Fund Account</h4>
                    <p className="text-sm text-muted mb-3">
                      Open{' '}
                      <a
                        href="https://faucet.ztarknet.cash"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        faucet.ztarknet.cash
                      </a>
                      , paste your address, and press "Request STRK"
                    </p>
                    <button
                      onClick={handleOpenFaucet}
                      className="w-full py-3 px-4 rounded-full font-semibold tracking-wide border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:bg-[rgba(255,107,26,0.15)] hover:-translate-y-0.5"
                    >
                      Open Faucet
                    </button>
                  </div>
                </div>

                {/* Step 3: Wait for Funds */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[rgba(255,107,26,0.2)] border border-[rgba(255,137,70,0.4)] flex items-center justify-center font-bold text-foreground">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">Wait for funds</h4>
                    <p className="text-sm text-muted">
                      Wait a few seconds for the funds to be sent from the faucet
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="p-4 rounded-lg bg-[rgba(255,107,26,0.1)] border border-[rgba(255,137,70,0.2)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">Status</span>
                    {isDeploying ? (
                      <span className="text-[#F4B728] flex items-center gap-2">
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
                        Deploying account...
                      </span>
                    ) : isFunded ? (
                      <span className="text-[#50C878] flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Funded!
                      </span>
                    ) : (
                      <span className="text-muted flex items-center gap-2">
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
                        Waiting for funds...
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted">
                    Current Balance: <span className="font-mono">{balanceInTokens.toFixed(4)} STRK</span>
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
