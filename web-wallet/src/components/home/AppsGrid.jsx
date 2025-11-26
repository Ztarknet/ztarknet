import React, { useState } from 'react';
import { GlowingEffect } from '@/components/common/GlowingEffect';
import { AppConnectModal } from '@/components/home/AppConnectModal';
import { AppDisconnectModal } from '@/components/home/AppDisconnectModal';
import { isAccountConnectedToApp, storeAppPrivateKey, disconnectFromApp } from '@/utils/appConnection';
import { useZtarknetConnector } from '@/context/ZtarknetConnector';

const apps = [
  {
    id: 'art-peace',
    name: 'zart/peace',
    appName: 'artpeace',
    description: 'Collaborative pixel art on Ztarknet. Privacy meets art!',
    url: 'https://ztarknet.art-peace.net',
    icon: '/zart-peace-logo.png',
  },
  // Add more apps here as they become available
];

export function AppsGrid({ selectedAddress }) {
  const { getPrivateKey, getAvailableKeys } = useZtarknetConnector();
  const [modalApp, setModalApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);
  const [disconnectApp, setDisconnectApp] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAppClick = (e, app) => {
    e.preventDefault();

    // For now, always just open the app directly (connect feature temporarily disabled)
    window.open(app.url, '_blank', 'noreferrer');

    // TODO: Re-enable connection modal when feature is ready
    // if (!selectedAddress) {
    //   // No account selected, just open the app
    //   window.open(app.url, '_blank', 'noreferrer');
    //   return;
    // }

    // const isConnected = isAccountConnectedToApp(app.appName, selectedAddress);

    // if (isConnected) {
    //   // Already connected, open the app
    //   window.open(app.url, '_blank', 'noreferrer');
    // } else {
    //   // Not connected, show modal
    //   setModalApp(app);
    //   setIsModalOpen(true);
    // }
  };

  const handleConnect = () => {
    if (!selectedAddress || !modalApp) return;

    try {
      // Get the private key from web-wallet storage
      const availableKeys = getAvailableKeys();
      const currentKeyId = availableKeys.find(keyId =>
        keyId.toLowerCase().endsWith(selectedAddress.toLowerCase())
      );

      if (!currentKeyId) {
        alert('Could not find private key for the current account');
        return;
      }

      const privateKey = getPrivateKey(currentKeyId);
      if (!privateKey) {
        alert('Could not retrieve private key for the current account');
        return;
      }

      // Store locally for the badge to show "connected"
      const storedAddress = storeAppPrivateKey(modalApp.appName, privateKey);
      console.log(`Connected account ${storedAddress} to ${modalApp.appName}`);

      // Close modal
      setIsModalOpen(false);
      setModalApp(null);

      // Open app with private key in URL so the app can store it in its own localStorage
      // The app needs to handle this URL parameter and store the key
      const appUrl = new URL(modalApp.url);
      appUrl.searchParams.set('privateKey', privateKey);
      appUrl.searchParams.set('action', 'connect');

      console.log(`Opening ${modalApp.name} with connection parameters`);
      window.open(appUrl.toString(), '_blank', 'noreferrer');
    } catch (error) {
      console.error('Failed to connect account to app:', error);
      alert('Failed to connect account. Please try again.');
    }
  };

  const handleJoinAsGuest = () => {
    if (!modalApp) return;

    // Just open the app without connecting
    window.open(modalApp.url, '_blank', 'noreferrer');
    setIsModalOpen(false);
    setModalApp(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalApp(null);
  };

  const handleBadgeClick = (e, app, isConnected) => {
    e.preventDefault();
    e.stopPropagation();

    if (isConnected) {
      // Show disconnect modal
      setDisconnectApp(app);
      setIsDisconnectModalOpen(true);
    }
  };

  const handleDisconnect = () => {
    if (!selectedAddress || !disconnectApp) return;

    try {
      disconnectFromApp(disconnectApp.appName, selectedAddress);
      console.log(`Disconnected from ${disconnectApp.appName}`);

      // Close modal
      setIsDisconnectModalOpen(false);
      setDisconnectApp(null);

      // Force re-render to update badge
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Failed to disconnect from app:', error);
      alert('Failed to disconnect. Please try again.');
    }
  };

  const handleCloseDisconnectModal = () => {
    setIsDisconnectModalOpen(false);
    setDisconnectApp(null);
  };

  return (
    <div className="min-w-0">
      <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">Ztarknet Apps</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {apps.map((app) => {
          const isConnected = selectedAddress ? isAccountConnectedToApp(app.appName, selectedAddress) : false;

          return (
            <a
              key={`${app.id}-${refreshKey}`}
              href={app.url}
              onClick={(e) => handleAppClick(e, app)}
              className="relative group block p-5 sm:p-6 border border-[rgba(255,137,70,0.2)] rounded-2xl shadow-[inset_0_0_0_1px_rgba(255,137,70,0.05),0_16px_40px_rgba(0,0,0,0.3)] backdrop-blur-[16px] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,107,26,0.3),inset_0_0_0_1px_rgba(255,137,70,0.1)] cursor-pointer text-center"
              style={{
                background: 'radial-gradient(circle at top left, rgba(255, 107, 26, 0.08), rgba(8, 8, 12, 0.9) 60%)'
              }}
            >
              <GlowingEffect proximity={64} spread={30} />

              {/* Connection Status Badge - TEMPORARILY HIDDEN */}
              {/* {selectedAddress && (
                <div className="absolute top-4 left-4">
                  {isConnected ? (
                    <button
                      onClick={(e) => handleBadgeClick(e, app, true)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[rgba(80,200,120,0.2)] border border-[rgba(80,200,120,0.4)] text-[#50C878] hover:bg-[rgba(80,200,120,0.3)] hover:border-[rgba(80,200,120,0.6)] transition-all cursor-pointer"
                      title="Click to disconnect"
                    >
                      Connected
                    </button>
                  ) : (
                    <div className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[rgba(200,80,80,0.2)] border border-[rgba(200,80,80,0.4)] text-[#C85050]">
                      Not Connected
                    </div>
                  )}
                </div>
              )} */}

              {/* App Icon */}
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 flex justify-center">
                {app.icon.startsWith('/') ? (
                  <img src={app.icon} alt={app.name} className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />
                ) : (
                  app.icon
                )}
              </div>

              {/* App Name */}
              <h4 className="text-base sm:text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                {app.name}
              </h4>

              {/* App Description */}
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                {app.description}
              </p>

              {/* External Link Icon */}
              <div className="absolute top-4 right-4 text-muted group-hover:text-accent transition-colors">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </div>
            </a>
          );
        })}
      </div>

      {/* Connection Modal */}
      <AppConnectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        app={modalApp}
        onConnect={handleConnect}
        onJoinAsGuest={handleJoinAsGuest}
      />

      {/* Disconnect Modal */}
      <AppDisconnectModal
        isOpen={isDisconnectModalOpen}
        onClose={handleCloseDisconnectModal}
        app={disconnectApp}
        onDisconnect={handleDisconnect}
      />
    </div>
  );
}
