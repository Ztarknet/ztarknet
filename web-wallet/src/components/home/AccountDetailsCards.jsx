import React, { useState, useEffect } from 'react';
import { useZtarknetConnector } from '@/context/ZtarknetConnector';
import { StatCard } from '@/components/common/StatCard';
import { STORAGE_KEYS } from '@/config/ztarknet';

export function AccountDetailsCards({ accountAddress }) {
  const { getBalance, provider } = useZtarknetConnector();
  const [balance, setBalance] = useState(null);
  const [nonce, setNonce] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAccountDetails = async () => {
      if (!accountAddress) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // Get balance
        const accountBalance = await getBalance(accountAddress);
        // Convert from wei to tokens (divide by 10^18)
        const balanceInTokens = Number(accountBalance) / 1e18;
        setBalance(balanceInTokens.toFixed(4));

        // Get nonce (total transactions)
        if (provider) {
          try {
            const accountNonce = await provider.getNonceForAddress(accountAddress);
            // Convert from hex to decimal if needed
            const nonceValue = typeof accountNonce === 'string'
              ? parseInt(accountNonce, 16)
              : Number(accountNonce);
            setNonce(nonceValue);
          } catch (nonceError) {
            // Account might not be deployed yet
            if (nonceError.message && nonceError.message.includes('Contract not found')) {
              console.log('Account not deployed yet, nonce will be 0');
              setNonce(0);
            } else {
              throw nonceError;
            }
          }
        }

        // Get created at from local storage
        const createdAtKey = `${STORAGE_KEYS.ACCOUNT_ADDRESS}_created_at_${accountAddress}`;
        const createdAtTimestamp = localStorage.getItem(createdAtKey);
        if (createdAtTimestamp) {
          const date = new Date(parseInt(createdAtTimestamp));
          setCreatedAt(date.toLocaleDateString());
        } else {
          setCreatedAt('Unknown');
        }
      } catch (error) {
        console.error('Failed to load account details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAccountDetails();
  }, [accountAddress, getBalance, provider]);

  if (!accountAddress) {
    return (
      <div className="text-center text-muted py-8">
        <p>Select an account to view details</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      <StatCard
        label="Account Balance"
        value={balance ? `${balance} STRK` : 'Loading...'}
        description="Fee token balance"
        isLoading={isLoading}
      />
      <StatCard
        label="Total Transactions"
        value={nonce !== null ? nonce : 'Loading...'}
        description="Number of transactions sent"
        isLoading={isLoading}
      />
      <StatCard
        label="Created At"
        value={createdAt || 'Loading...'}
        description="Account creation date"
        isLoading={isLoading}
      />
    </div>
  );
}
