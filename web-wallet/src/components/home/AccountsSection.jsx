import React, { useState, useEffect } from 'react';
import { useZtarknetConnector } from '@/context/ZtarknetConnector';

export function AccountsSection({ onAccountSelect, selectedAddress, onCreateAccount }) {
  const { getAvailableKeys, getPrivateKey, getUsernamesForAddresses } = useZtarknetConnector();
  const [accounts, setAccounts] = useState([]);

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
      const keyIds = getAvailableKeys();
      if (!keyIds || keyIds.length === 0) {
        setAccounts([]);
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
    };

    loadAccounts();
  }, [getAvailableKeys, getUsernamesForAddresses]);

  const handleAccountClick = async (account) => {
    const privateKey = getPrivateKey(account.keyId);
    if (privateKey) {
      onAccountSelect(privateKey, account.address);
    }
  };

  return (
    <div
      className="flex flex-col max-h-[800px] border border-[rgba(255,137,70,0.2)] rounded-2xl shadow-[inset_0_0_0_1px_rgba(255,137,70,0.05),0_16px_40px_rgba(0,0,0,0.3)] backdrop-blur-[16px] overflow-hidden"
      style={{
        background: 'radial-gradient(circle at top left, rgba(255, 107, 26, 0.08), rgba(8, 8, 12, 0.9) 60%)'
      }}
    >
      {/* Header */}
      <div className="p-6 border-b border-[rgba(255,137,70,0.2)]">
        <h2 className="text-2xl font-bold text-foreground">Accounts</h2>
      </div>

      {/* Account List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {accounts.length === 0 ? (
          <div className="text-center text-muted py-8">
            <p>No accounts yet</p>
            <p className="text-sm mt-2">Create your first account below</p>
          </div>
        ) : (
          accounts.map((account) => (
            <button
              key={account.keyId}
              onClick={() => handleAccountClick(account)}
              className={`w-full text-left p-4 rounded-lg transition-all duration-200 border ${
                selectedAddress === account.address
                  ? 'bg-[rgba(255,107,26,0.2)] border-[rgba(255,137,70,0.4)]'
                  : 'bg-[rgba(255,107,26,0.05)] border-[rgba(255,137,70,0.1)] hover:bg-[rgba(255,107,26,0.1)] hover:border-[rgba(255,137,70,0.2)]'
              }`}
            >
              <div className="font-medium text-foreground">{account.username}</div>
              <div className="text-xs text-muted mt-1 font-mono truncate">
                {account.address}
              </div>
            </button>
          ))
        )}
      </div>

      {/* Create Account Button */}
      <div className="p-4 border-t border-[rgba(255,137,70,0.2)]">
        <button
          onClick={onCreateAccount}
          className="w-full py-3 px-4 rounded-full font-semibold tracking-wide border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:bg-[rgba(255,107,26,0.15)] hover:-translate-y-0.5"
        >
          + Create Account
        </button>
      </div>
    </div>
  );
}
