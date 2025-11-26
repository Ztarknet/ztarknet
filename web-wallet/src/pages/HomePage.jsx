import React, { useState, useEffect } from 'react';
import { useZtarknetConnector } from '@/context/ZtarknetConnector';
import { AccountsSection } from '@/components/home/AccountsSection';
import { AccountDetailsCards } from '@/components/home/AccountDetailsCards';
import { AccountActionButtons } from '@/components/home/AccountActionButtons';
import { ActionTabs } from '@/components/home/ActionTabs';
import { AppsGrid } from '@/components/home/AppsGrid';
import { CreateAccountModal } from '@/components/home/CreateAccountModal';
import { DeleteAccountModal } from '@/components/home/DeleteAccountModal';

export function HomePage() {
  const { connectStorageAccount, storePrivateKey, deployAccount, username, getUsernameForAddress, getAvailableKeys, getPrivateKey } = useZtarknetConnector();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedUsername, setSelectedUsername] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deepLinkParams, setDeepLinkParams] = useState(null);

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

    // Fetch username for this address
    const accountUsername = await getUsernameForAddress(address);
    setSelectedUsername(accountUsername || `Account-${address.slice(-8)}`);
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

  return (
    <main className="px-8 py-8">
      <div className="max-w-[1600px] w-full mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left 1/3: Accounts Section */}
          <div className="w-full lg:w-1/3 lg:min-w-[300px]">
            <AccountsSection
              key={refreshKey}
              onAccountSelect={handleAccountSelect}
              selectedAddress={selectedAddress}
              onCreateAccount={handleCreateAccount}
            />
          </div>

          {/* Right 2/3: Multiple Sections */}
          <div className="flex-1 w-full space-y-6">
            {/* Top Right Action Buttons */}
            <AccountActionButtons
              accountAddress={selectedAddress}
              onDeleteAccount={handleDeleteAccount}
            />

            {/* Account Details Cards */}
            <AccountDetailsCards accountAddress={selectedAddress} />

            {/* Action Tabs (Send, Receive, Fund, Username, History) */}
            <ActionTabs
              accountAddress={selectedAddress}
              initialTab={deepLinkParams?.tab}
              initialSendValues={deepLinkParams?.sendValues}
            />

            {/* Apps Grid */}
            <AppsGrid />
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
    </main>
  );
}
