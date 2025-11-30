'use client';

import { ArrowDown, ArrowUp, Clock, Coins, User } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import { FundInstructions } from './FundInstructions';
import { ReceiveForm } from './ReceiveForm';
import { SendForm } from './SendForm';
import { TransactionHistory } from './TransactionHistory';
import { UsernameForm } from './UsernameForm';

interface Tab {
  id: string;
  label: string;
  icon: ReactNode;
}

const tabs: Tab[] = [
  { id: 'send', label: 'Send', icon: <ArrowUp className="w-4 h-4" /> },
  { id: 'receive', label: 'Receive', icon: <ArrowDown className="w-4 h-4" /> },
  { id: 'fund', label: 'Fund', icon: <Coins className="w-4 h-4" /> },
  { id: 'username', label: 'Username', icon: <User className="w-4 h-4" /> },
  { id: 'history', label: 'History', icon: <Clock className="w-4 h-4" /> },
];

interface ActionTabsProps {
  accountAddress: string | null;
  initialTab?: string;
  initialSendValues?: { to?: string; amount?: string } | null;
  onTransactionSent?: (amount: number) => void;
  onUsernameChanged?: (newUsername: string) => void;
  optimisticUsername?: string | null;
}

export function ActionTabs({
  accountAddress,
  initialTab = 'send',
  initialSendValues = null,
  onTransactionSent,
  onUsernameChanged,
  optimisticUsername,
}: ActionTabsProps) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'send':
        return (
          <SendForm
            accountAddress={accountAddress}
            initialValues={initialSendValues}
            onTransactionSent={onTransactionSent}
          />
        );
      case 'receive':
        return <ReceiveForm accountAddress={accountAddress} />;
      case 'fund':
        return <FundInstructions accountAddress={accountAddress} />;
      case 'username':
        return (
          <UsernameForm
            accountAddress={accountAddress}
            onUsernameChanged={onUsernameChanged}
            optimisticUsername={optimisticUsername}
          />
        );
      case 'history':
        return <TransactionHistory accountAddress={accountAddress} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 rounded-lg bg-black/30 border border-[rgba(255,137,70,0.1)] overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all whitespace-nowrap flex-1 justify-center ${
              activeTab === tab.id
                ? 'bg-[rgba(255,137,70,0.15)] text-accent border border-[rgba(255,137,70,0.3)]'
                : 'text-muted hover:text-foreground hover:bg-white/[0.03] border border-transparent'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-5 rounded-xl border border-[rgba(255,137,70,0.12)] bg-black/30 backdrop-blur-sm">
        {renderTabContent()}
      </div>
    </div>
  );
}
