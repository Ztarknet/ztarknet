import React, { useState, useEffect } from 'react';
import { SendForm } from './SendForm';
import { ReceiveForm } from './ReceiveForm';
import { FundInstructions } from './FundInstructions';
import { UsernameForm } from './UsernameForm';
import { TransactionHistory } from './TransactionHistory';

const tabs = [
  { id: 'send', label: 'Send', icon: '↑' },
  { id: 'receive', label: 'Receive', icon: '↓' },
  { id: 'fund', label: 'Fund', icon: '💰' },
  { id: 'username', label: 'Username', icon: '👤' },
  { id: 'history', label: 'History', icon: '📜' },
];

export function ActionTabs({ accountAddress, initialTab = 'send', initialSendValues = null }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Update active tab when initialTab prop changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'send':
        return <SendForm accountAddress={accountAddress} initialValues={initialSendValues} />;
      case 'receive':
        return <ReceiveForm accountAddress={accountAddress} />;
      case 'fund':
        return <FundInstructions accountAddress={accountAddress} />;
      case 'username':
        return <UsernameForm accountAddress={accountAddress} />;
      case 'history':
        return <TransactionHistory accountAddress={accountAddress} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 min-w-0">
      {/* Tab Buttons */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[rgba(255,107,26,0.2)] border border-[rgba(255,137,70,0.4)] text-foreground'
                : 'bg-[rgba(255,107,26,0.05)] border border-[rgba(255,137,70,0.1)] text-muted hover:bg-[rgba(255,107,26,0.1)] hover:border-[rgba(255,137,70,0.2)]'
            }`}
          >
            <span className="text-base sm:text-lg">{tab.icon}</span>
            <span className="text-xs sm:text-sm">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        className="p-4 sm:p-6 border border-[rgba(255,137,70,0.2)] rounded-2xl shadow-[inset_0_0_0_1px_rgba(255,137,70,0.05),0_16px_40px_rgba(0,0,0,0.3)] backdrop-blur-[16px]"
        style={{
          background: 'radial-gradient(circle at top left, rgba(255, 107, 26, 0.08), rgba(8, 8, 12, 0.9) 60%)'
        }}
      >
        {renderTabContent()}
      </div>
    </div>
  );
}
