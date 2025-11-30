'use client';

import { useZtarknet } from '@/providers/ztarknet-provider';
import { Button } from '@workspace/ui/components/button';
import { Check, Copy, Download, Plus, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Account {
  keyId: string;
  address: string;
  username: string;
}

interface AccountsSectionProps {
  onAccountSelect: (privateKey: string, address: string) => void;
  selectedAddress: string | null;
  onCreateAccount: () => void;
  onOpenSettings: (account: Account) => void;
  onOpenImport: () => void;
  optimisticUsername?: string | null;
}

const extractAddressFromKeyId = (keyId: string): string => {
  const parts = keyId.split('.');
  return parts[parts.length - 1];
};

const generatePreseededUsername = (address: string): string => {
  if (!address) return 'Account';
  const shortAddr = address.slice(-8);
  return `Account-${shortAddr}`;
};

export function AccountsSection({
  onAccountSelect,
  selectedAddress,
  onCreateAccount,
  onOpenSettings,
  onOpenImport,
  optimisticUsername,
}: AccountsSectionProps) {
  const { getAvailableKeys, getPrivateKey, getUsernamesForAddresses } = useZtarknet();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  useEffect(() => {
    const loadAccounts = async () => {
      setLoading(true);
      const keyIds = getAvailableKeys();
      if (!keyIds || keyIds.length === 0) {
        setAccounts([]);
        setLoading(false);
        return;
      }

      const addresses = keyIds.map(extractAddressFromKeyId);
      const usernameMap = await getUsernamesForAddresses(addresses);

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

  const handleAccountClick = async (account: Account) => {
    const privateKey = getPrivateKey(account.keyId);
    if (privateKey) {
      onAccountSelect(privateKey, account.address);
    }
  };

  const handleSettingsClick = (e: React.MouseEvent, account: Account) => {
    e.stopPropagation();
    onOpenSettings(account);
  };

  const handleCopyAddress = async (e: React.MouseEvent, address: string) => {
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
    <div className="flex flex-col h-fit rounded-xl border border-[rgba(255,137,70,0.15)] bg-black/40 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[rgba(255,137,70,0.1)]">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Accounts</h2>
      </div>

      {/* Account List */}
      <div className="flex-1 overflow-y-auto max-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-muted mt-3">Loading...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center text-muted py-8 px-4">
            <p className="text-sm">No accounts yet</p>
            <p className="text-xs mt-1 opacity-70">Create your first account</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {accounts.map((account) => (
              <div
                key={account.keyId}
                className={`group relative rounded-lg transition-colors ${
                  selectedAddress === account.address
                    ? 'bg-accent/10 border border-[rgba(255,137,70,0.4)]'
                    : 'hover:bg-white/[0.02] border border-transparent hover:border-[rgba(255,137,70,0.15)]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleAccountClick(account)}
                  className="w-full text-left p-3 pr-16"
                >
                  <div className="text-sm font-medium text-foreground truncate">
                    {selectedAddress === account.address && optimisticUsername
                      ? optimisticUsername
                      : account.username}
                  </div>
                  <div className="text-[10px] text-muted mt-0.5 font-mono truncate opacity-70">
                    {account.address.slice(0, 10)}...{account.address.slice(-8)}
                  </div>
                </button>
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => handleCopyAddress(e, account.address)}
                    className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
                    title="Copy address"
                  >
                    {copiedAddress === account.address ? (
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-muted" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleSettingsClick(e, account)}
                    className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
                    title="Settings"
                  >
                    <Settings className="w-3.5 h-3.5 text-muted" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-3 border-t border-[rgba(255,137,70,0.1)] flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 text-muted hover:text-foreground"
          onClick={onOpenImport}
        >
          <Download className="w-4 h-4 mr-1.5" />
          Import
        </Button>
        <Button variant="primary" size="sm" className="flex-1" onClick={onCreateAccount}>
          <Plus className="w-4 h-4 mr-1.5" />
          Create
        </Button>
      </div>
    </div>
  );
}
