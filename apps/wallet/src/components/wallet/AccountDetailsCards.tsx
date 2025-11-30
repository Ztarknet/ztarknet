'use client';

import { StatCard } from '@/components/common/StatCard';
import { STORAGE_KEYS } from '@/config/ztarknet';
import { useZtarknet } from '@/providers/ztarknet-provider';
import { useEffect, useState } from 'react';

interface AccountDetailsCardsProps {
  accountAddress: string | null;
  optimisticBalanceOffset?: number;
  optimisticTxCount?: number;
}

export function AccountDetailsCards({
  accountAddress,
  optimisticBalanceOffset = 0,
  optimisticTxCount = 0,
}: AccountDetailsCardsProps) {
  const { getBalance, provider } = useZtarknet();
  const [balance, setBalance] = useState<string | null>(null);
  const [nonce, setNonce] = useState<number | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAccountDetails = async () => {
      if (!accountAddress) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const accountBalance = await getBalance(accountAddress);
        const balanceInTokens = Number(accountBalance) / 1e18;
        setBalance(balanceInTokens.toFixed(4));

        if (provider) {
          try {
            const accountNonce = await provider.getNonceForAddress(accountAddress);
            const nonceValue =
              typeof accountNonce === 'string'
                ? Number.parseInt(accountNonce, 16)
                : Number(accountNonce);
            setNonce(nonceValue);
          } catch (nonceError) {
            if (nonceError instanceof Error && nonceError.message.includes('Contract not found')) {
              setNonce(0);
            } else {
              throw nonceError;
            }
          }
        }

        if (typeof window !== 'undefined') {
          const createdAtKey = `${STORAGE_KEYS.ACCOUNT_ADDRESS}_created_at_${accountAddress}`;
          const createdAtTimestamp = localStorage.getItem(createdAtKey);
          if (createdAtTimestamp) {
            const date = new Date(Number.parseInt(createdAtTimestamp));
            setCreatedAt(date.toLocaleDateString());
          } else {
            setCreatedAt('Unknown');
          }
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

  const displayedBalance =
    balance !== null
      ? Math.max(0, Number.parseFloat(balance) - optimisticBalanceOffset).toFixed(4)
      : null;
  const displayedNonce = nonce !== null ? nonce + optimisticTxCount : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      <StatCard
        label="Account Balance"
        value={displayedBalance ? `${displayedBalance} STRK` : 'Loading...'}
        description="Fee token balance"
        isLoading={isLoading}
      />
      <StatCard
        label="Total Transactions"
        value={displayedNonce !== null ? displayedNonce : 'Loading...'}
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
