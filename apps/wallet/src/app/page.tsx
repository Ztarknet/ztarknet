'use client';

import {
  AccountActionButtons,
  AccountDetailsCards,
  AccountSettingsModal,
  AccountsSection,
  ActionTabs,
  AppsGrid,
  CreateAccountModal,
  DeleteAccountModal,
  ImportAccountModal,
  SendModal,
} from '@/components/wallet';
import { useZtarknet } from '@/providers/ztarknet-provider';
import { useCallback, useEffect, useState } from 'react';

interface Account {
  keyId: string;
  address: string;
  username: string;
}

export default function HomePage() {
  const {
    connectStorageAccount,
    storePrivateKey,
    deployAccount,
    getUsernameForAddress,
    getAvailableKeys,
    getPrivateKey,
  } = useZtarknet();

  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [sendModalParams, setSendModalParams] = useState({ toAddress: '', amount: '' });
  const [settingsAccount, setSettingsAccount] = useState<Account | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [optimisticBalanceOffset, setOptimisticBalanceOffset] = useState(0);
  const [optimisticTxCount, setOptimisticTxCount] = useState(0);

  const handleAccountSelect = useCallback(
    async (privateKey: string, address: string) => {
      setSelectedUsername(null);
      await connectStorageAccount(privateKey);
      setSelectedAddress(address);
      setOptimisticBalanceOffset(0);
      setOptimisticTxCount(0);

      const accountUsername = await getUsernameForAddress(address);
      setSelectedUsername(accountUsername || `Account-${address.slice(-8)}`);
    },
    [connectStorageAccount, getUsernameForAddress]
  );

  // Check URL parameters on mount (for receive form deep links)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    const toAddress = params.get('to');
    const amount = params.get('amount');

    if (action === 'send' && toAddress) {
      setSendModalParams({
        toAddress: toAddress,
        amount: amount || '',
      });
      setIsSendModalOpen(true);
    }
  }, []);

  // Auto-open Create Account modal if user has no accounts, or auto-select first account
  useEffect(() => {
    const availableKeys = getAvailableKeys();
    if (!availableKeys || availableKeys.length === 0) {
      setIsCreateModalOpen(true);
    } else if (!selectedAddress) {
      const firstKeyId = availableKeys[0];
      const privateKey = getPrivateKey(firstKeyId);
      if (privateKey) {
        const parts = firstKeyId.split('.');
        const address = parts[parts.length - 1];
        handleAccountSelect(privateKey, address);
      }
    }
  }, [getAvailableKeys, getPrivateKey, selectedAddress, handleAccountSelect]);

  const handleTransactionSent = (amount: number) => {
    setOptimisticBalanceOffset((prev) => prev + amount);
    setOptimisticTxCount((prev) => prev + 1);
  };

  const handleUsernameChanged = (newUsername: string) => {
    setSelectedUsername(newUsername);
  };

  const handleCreateAccount = () => {
    setIsCreateModalOpen(true);
  };

  const handleAccountCreated = async (privateKey: string, address: string) => {
    try {
      storePrivateKey(privateKey, address);
      console.log('Deploying account...');
      await deployAccount(privateKey, address);
      console.log('Account deployed successfully!');
      await handleAccountSelect(privateKey, address);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error('Failed to create and deploy account:', error);
      alert('Failed to deploy account. Please try again.');
    }
  };

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(true);
  };

  const handleAccountDeleted = () => {
    setSelectedAddress(null);
    setSelectedUsername(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleOpenSettings = (account: Account) => {
    setSettingsAccount(account);
    setIsSettingsModalOpen(true);
  };

  const handleOpenImport = () => {
    setIsImportModalOpen(true);
  };

  const handleAccountImported = async (privateKey: string, address: string) => {
    await handleAccountSelect(privateKey, address);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <main className="container-custom py-6 lg:py-10">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left sidebar: Accounts Section */}
        <aside className="w-full lg:w-80 lg:flex-shrink-0">
          <AccountsSection
            key={refreshKey}
            onAccountSelect={handleAccountSelect}
            selectedAddress={selectedAddress}
            onCreateAccount={handleCreateAccount}
            onOpenSettings={handleOpenSettings}
            onOpenImport={handleOpenImport}
            optimisticUsername={selectedUsername}
          />
        </aside>

        {/* Main content area */}
        <div className="flex-1 min-w-0 space-y-6">
          <AccountActionButtons
            accountAddress={selectedAddress}
            onDeleteAccount={handleDeleteAccount}
          />

          <AccountDetailsCards
            accountAddress={selectedAddress}
            optimisticBalanceOffset={optimisticBalanceOffset}
            optimisticTxCount={optimisticTxCount}
          />

          <ActionTabs
            accountAddress={selectedAddress}
            onTransactionSent={handleTransactionSent}
            onUsernameChanged={handleUsernameChanged}
            optimisticUsername={selectedUsername}
          />

          <AppsGrid selectedAddress={selectedAddress} />
        </div>
      </div>

      {/* Modals */}
      <CreateAccountModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAccountCreated={handleAccountCreated}
      />

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        accountAddress={selectedAddress}
        username={selectedUsername}
        onAccountDeleted={handleAccountDeleted}
      />

      <AccountSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        accountAddress={settingsAccount?.address || null}
        privateKey={settingsAccount ? getPrivateKey(settingsAccount.keyId) : null}
      />

      <ImportAccountModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onAccountImported={handleAccountImported}
      />

      <SendModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        toAddress={sendModalParams.toAddress}
        amount={sendModalParams.amount}
      />
    </main>
  );
}
