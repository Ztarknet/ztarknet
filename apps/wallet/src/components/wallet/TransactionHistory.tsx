'use client';

import { Button } from '@workspace/ui/components/button';
import { Clock, ExternalLink } from 'lucide-react';

interface TransactionHistoryProps {
  accountAddress: string | null;
}

export function TransactionHistory({ accountAddress }: TransactionHistoryProps) {
  if (!accountAddress) {
    return (
      <div className="text-center text-muted py-8">
        <p className="text-sm">Select an account to view history</p>
      </div>
    );
  }

  const handleViewInExplorer = () => {
    if (accountAddress) {
      window.open(`https://explorer.ztarknet.cash/account/${accountAddress}`, '_blank');
    }
  };

  return (
    <div className="text-center py-8">
      <Clock className="w-10 h-10 mx-auto mb-3 text-muted/50" strokeWidth={1.5} />
      <h3 className="text-sm font-medium text-foreground mb-1">Coming Soon</h3>
      <p className="text-xs text-muted mb-4">Transaction history is being built.</p>
      <Button variant="ghost" size="sm" onClick={handleViewInExplorer}>
        <ExternalLink className="w-4 h-4 mr-1.5" />
        View on Explorer
      </Button>
    </div>
  );
}
