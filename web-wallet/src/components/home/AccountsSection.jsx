import React, { useState, useEffect } from 'react';
import { useZtarknetConnector } from '@/context/ZtarknetConnector';

export function AccountsSection({ onAccountSelect, selectedAddress, onCreateAccount, onOpenSettings, onOpenImport, optimisticUsername }) {
  const { getAvailableKeys, getPrivateKey, getUsernamesForAddresses } = useZtarknetConnector();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState(null);

  // Helper to extract address from keyId (format: network.appname.classname.address)
  const extractAddressFromKeyId = (keyId) => {
    const parts = keyId.split('.');
    return parts[parts.length - 1];
  };

  // Generate a pre-seeded username based on account address
  const generatePreseededUsername = (address) => {
    if (!address) return 'Account';
    // Take last 8 characters of address
    const shortAddr = address.slice(-8);
    return `Account-${shortAddr}`;
  };

  useEffect(() => {
    const loadAccounts = async () => {
      setLoading(true);
      const keyIds = getAvailableKeys();
      if (!keyIds || keyIds.length === 0) {
        setAccounts([]);
        setLoading(false);
        return;
      }

      // Extract addresses from keyIds
      const addresses = keyIds.map(extractAddressFromKeyId);

      // Fetch usernames for all addresses
      const usernameMap = await getUsernamesForAddresses(addresses);

      // Create account objects with username or pre-seeded username
      const accountList = addresses.map((address, index) => ({
        keyId: keyIds[index],
        address,
        username: usernameMap.get(address) || generatePreseededUsername(address),
      }));

      setAccounts(accountList);
      setLoading(false);
    };

    loadAccounts();
  }, [getAvailableKeys, getUsernamesForAddresses]);

  const handleAccountClick = async (account) => {
    const privateKey = getPrivateKey(account.keyId);
    if (privateKey) {
      onAccountSelect(privateKey, account.address);
    }
  };

  const handleSettingsClick = (e, account) => {
    e.stopPropagation();
    if (onOpenSettings) {
      onOpenSettings(account);
    }
  };

  const handleImportAccount = () => {
    if (onOpenImport) {
      onOpenImport();
    }
  };

  const handleCopyAddress = async (e, address) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  return (
    <div
      className="flex flex-col max-h-[600px] sm:max-h-[800px] border border-[rgba(255,137,70,0.2)] rounded-2xl shadow-[inset_0_0_0_1px_rgba(255,137,70,0.05),0_16px_40px_rgba(0,0,0,0.3)] backdrop-blur-[16px] overflow-hidden"
      style={{
        background: 'radial-gradient(circle at top left, rgba(255, 107, 26, 0.08), rgba(8, 8, 12, 0.9) 60%)'
      }}
    >
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-[rgba(255,137,70,0.2)]">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Accounts</h2>
      </div>

      {/* Account List */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12">
            <svg
              className="animate-spin text-accent"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <p className="text-sm text-muted mt-3">Loading accounts...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center text-muted py-6 sm:py-8">
            <p className="text-sm sm:text-base">No accounts yet</p>
            <p className="text-xs sm:text-sm mt-2">Create your first account below</p>
          </div>
        ) : (
          accounts.map((account) => (
            <div
              key={account.keyId}
              className={`relative w-full rounded-lg transition-all duration-200 border ${
                selectedAddress === account.address
                  ? 'bg-[rgba(255,107,26,0.2)] border-[rgba(255,137,70,0.4)]'
                  : 'bg-[rgba(255,107,26,0.05)] border-[rgba(255,137,70,0.1)] hover:bg-[rgba(255,107,26,0.1)] hover:border-[rgba(255,137,70,0.2)]'
              }`}
            >
              <button
                onClick={() => handleAccountClick(account)}
                className="w-full text-left p-3 sm:p-4 pr-20"
              >
                <div className="text-sm sm:text-base font-medium text-foreground">
                  {/* Use optimistic username for selected account if provided */}
                  {selectedAddress === account.address && optimisticUsername
                    ? optimisticUsername
                    : account.username}
                </div>
                <div className="text-xs text-muted mt-1 font-mono truncate">
                  {account.address}
                </div>
              </button>
              <button
                onClick={(e) => handleCopyAddress(e, account.address)}
                className="absolute right-10 top-2 p-1.5 rounded hover:bg-[rgba(255,107,26,0.15)] transition-colors"
                title={copiedAddress === account.address ? "Copied!" : "Copy address"}
              >
                {copiedAddress === account.address ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-500"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted hover:text-foreground"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                )}
              </button>
              <button
                onClick={(e) => handleSettingsClick(e, account)}
                className="absolute right-2 top-2 p-1.5 rounded hover:bg-[rgba(255,107,26,0.15)] transition-colors"
                title="Account settings"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted hover:text-foreground"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Create Account Button */}
      <div className="p-3 sm:p-4 border-t border-[rgba(255,137,70,0.2)] space-y-2">
        <button
          onClick={onCreateAccount}
          className="w-full py-2.5 sm:py-3 px-4 rounded-full text-sm sm:text-base font-semibold tracking-wide border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:bg-[rgba(255,107,26,0.15)] hover:-translate-y-0.5"
        >
          + Create Account
        </button>
        <button
          onClick={handleImportAccount}
          className="w-full py-2.5 sm:py-3 px-4 rounded-full text-sm sm:text-base font-semibold tracking-wide border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:bg-[rgba(255,107,26,0.15)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Import Account
        </button>
      </div>
    </div>
  );
}
