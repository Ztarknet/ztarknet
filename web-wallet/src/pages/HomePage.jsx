import React, { useState, useEffect } from 'react';
import { useZtarknetConnector } from '@/context/ZtarknetConnector';
import { AccountsSection } from '@/components/home/AccountsSection';
import { AccountDetailsCards } from '@/components/home/AccountDetailsCards';
import { AccountActionButtons } from '@/components/home/AccountActionButtons';
import { ActionTabs } from '@/components/home/ActionTabs';
import { AppsGrid } from '@/components/home/AppsGrid';
import { CreateAccountModal } from '@/components/home/CreateAccountModal';
import { DeleteAccountModal } from '@/components/home/DeleteAccountModal';
import { AccountSettingsModal } from '@/components/home/AccountSettingsModal';
import { ImportAccountModal } from '@/components/home/ImportAccountModal';

export function HomePage() {
  const { connectStorageAccount, storePrivateKey, deployAccount, username, getUsernameForAddress, getAvailableKeys, getPrivateKey } = useZtarknetConnector();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedUsername, setSelectedUsername] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [settingsAccount, setSettingsAccount] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deepLinkParams, setDeepLinkParams] = useState(null);
  const [optimisticBalanceOffset, setOptimisticBalanceOffset] = useState(0);
  const [optimisticTxCount, setOptimisticTxCount] = useState(0);

  // Check URL parameters on mount (for receive form deep links)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    const toAddress = params.get('to');
    const amount = params.get('amount');

    // Store deep link parameters to pass to ActionTabs
    if (action === 'send' && toAddress) {
      setDeepLinkParams({
        tab: 'send',
        sendValues: {
          to: toAddress,
          amount: amount || ''
        }
      });
    }
  }, []);

  // Auto-open Create Account modal if user has no accounts, or auto-select first account
  useEffect(() => {
    const availableKeys = getAvailableKeys();
    if (!availableKeys || availableKeys.length === 0) {
      setIsCreateModalOpen(true);
    } else if (!selectedAddress) {
      // Auto-select the first account on load
      const firstKeyId = availableKeys[0];
      const privateKey = getPrivateKey(firstKeyId);
      if (privateKey) {
        // Extract address from keyId (format: network.appname.classname.address)
        const parts = firstKeyId.split('.');
        const address = parts[parts.length - 1];
        handleAccountSelect(privateKey, address);
      }
    }
  }, [getAvailableKeys, getPrivateKey, selectedAddress]);

  const handleAccountSelect = async (privateKey, address) => {
    await connectStorageAccount(privateKey);
    setSelectedAddress(address);
    // Reset optimistic values when switching accounts
    setOptimisticBalanceOffset(0);
    setOptimisticTxCount(0);

    // Fetch username for this address
    const accountUsername = await getUsernameForAddress(address);
    setSelectedUsername(accountUsername || `Account-${address.slice(-8)}`);
  };

  // Handle optimistic balance and tx count update when transaction is sent
  const handleTransactionSent = (amount) => {
    setOptimisticBalanceOffset(prev => prev + amount);
    setOptimisticTxCount(prev => prev + 1);
  };

  // Handle optimistic username update when username is changed
  const handleUsernameChanged = (newUsername) => {
    setSelectedUsername(newUsername);
    // Don't refresh - let the optimistic username display via the prop
  };

  const handleCreateAccount = () => {
    setIsCreateModalOpen(true);
  };

  const handleAccountCreated = async (privateKey, address) => {
    try {
      // Store the account
      storePrivateKey(privateKey, address);

      // Deploy the account and wait for it to complete
      console.log('Deploying account...');
      await deployAccount(privateKey, address);
      console.log('Account deployed successfully!');

      // Connect to the new account after deployment completes
      await handleAccountSelect(privateKey, address);

      // Refresh the accounts list
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Failed to create and deploy account:', error);
      alert('Failed to deploy account. Please try again.');
    }
  };

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(true);
  };

  const handleAccountDeleted = () => {
    // Clear selection
    setSelectedAddress(null);
    setSelectedUsername(null);

    // Refresh the accounts list
    setRefreshKey(prev => prev + 1);
  };

  const handleOpenSettings = (account) => {
    setSettingsAccount(account);
    setIsSettingsModalOpen(true);
  };

  const handleOpenImport = () => {
    setIsImportModalOpen(true);
  };

  const handleAccountImported = async (privateKey, address) => {
    // Connect to the imported account
    await handleAccountSelect(privateKey, address);

    // Refresh the accounts list
    setRefreshKey(prev => prev + 1);
  };

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="max-w-[1600px] w-full mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Left 1/3: Accounts Section */}
          <div className="w-full lg:w-1/3 lg:min-w-[260px] lg:max-w-[420px]">
            <AccountsSection
              key={refreshKey}
              onAccountSelect={handleAccountSelect}
              selectedAddress={selectedAddress}
              onCreateAccount={handleCreateAccount}
              onOpenSettings={handleOpenSettings}
              onOpenImport={handleOpenImport}
              optimisticUsername={selectedUsername}
            />
          </div>

          {/* Right 2/3: Multiple Sections */}
          <div className="flex-1 w-full min-w-0 space-y-4 sm:space-y-6">
            {/* Top Right Action Buttons */}
            <AccountActionButtons
              accountAddress={selectedAddress}
              onDeleteAccount={handleDeleteAccount}
            />

            {/* Account Details Cards */}
            <AccountDetailsCards
              accountAddress={selectedAddress}
              optimisticBalanceOffset={optimisticBalanceOffset}
              optimisticTxCount={optimisticTxCount}
            />

            {/* Action Tabs (Send, Receive, Fund, Username, History) */}
            <ActionTabs
              accountAddress={selectedAddress}
              initialTab={deepLinkParams?.tab}
              initialSendValues={deepLinkParams?.sendValues}
              onTransactionSent={handleTransactionSent}
              onUsernameChanged={handleUsernameChanged}
              optimisticUsername={selectedUsername}
            />

            {/* Apps Grid */}
            <AppsGrid selectedAddress={selectedAddress} />
          </div>
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
        accountAddress={settingsAccount?.address}
        privateKey={settingsAccount ? getPrivateKey(settingsAccount.keyId) : null}
      />

      <ImportAccountModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onAccountImported={handleAccountImported}
      />
    </main>
  );
}
