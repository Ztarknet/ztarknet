'use client';

import { useZtarknet } from '@/providers/ztarknet-provider';
import {
  disconnectFromApp,
  isAccountConnectedToApp,
  storeAppPrivateKey,
} from '@/utils/appConnection';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { AppConnectModal } from './AppConnectModal';
import { AppDisconnectModal } from './AppDisconnectModal';

interface App {
  id: string;
  name: string;
  appName: string;
  description: string;
  url: string;
  icon: string;
}

const apps: App[] = [
  {
    id: 'art-peace',
    name: 'zart/peace',
    appName: 'artpeace',
    description: 'Collaborative pixel art on Ztarknet',
    url: 'https://ztarknet.art-peace.net',
    icon: '/zart-peace-logo.png',
  },
];

interface AppsGridProps {
  selectedAddress: string | null;
}

export function AppsGrid({ selectedAddress }: AppsGridProps) {
  const { getPrivateKey, getAvailableKeys } = useZtarknet();
  const [modalApp, setModalApp] = useState<App | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);
  const [disconnectApp, setDisconnectApp] = useState<App | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAppClick = (e: React.MouseEvent, app: App) => {
    e.preventDefault();
    window.open(app.url, '_blank', 'noreferrer');
  };

  const handleConnect = () => {
    if (!selectedAddress || !modalApp) return;

    try {
      const availableKeys = getAvailableKeys();
      const currentKeyId = availableKeys.find((keyId) =>
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

      const storedAddress = storeAppPrivateKey(modalApp.appName, privateKey);
      console.log(`Connected account ${storedAddress} to ${modalApp.appName}`);

      setIsModalOpen(false);
      setModalApp(null);

      const appUrl = new URL(modalApp.url);
      appUrl.searchParams.set('privateKey', privateKey);
      appUrl.searchParams.set('action', 'connect');

      window.open(appUrl.toString(), '_blank', 'noreferrer');
    } catch (error) {
      console.error('Failed to connect account to app:', error);
      alert('Failed to connect account. Please try again.');
    }
  };

  const handleJoinAsGuest = () => {
    if (!modalApp) return;
    window.open(modalApp.url, '_blank', 'noreferrer');
    setIsModalOpen(false);
    setModalApp(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalApp(null);
  };

  const handleDisconnect = () => {
    if (!selectedAddress || !disconnectApp) return;

    try {
      disconnectFromApp(disconnectApp.appName, selectedAddress);
      setIsDisconnectModalOpen(false);
      setDisconnectApp(null);
      setRefreshKey((prev) => prev + 1);
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
    <div>
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
        Ztarknet Apps
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {apps.map((app) => {
          const isConnected = selectedAddress
            ? isAccountConnectedToApp(app.appName, selectedAddress)
            : false;

          return (
            <a
              key={`${app.id}-${refreshKey}`}
              href={app.url}
              onClick={(e) => handleAppClick(e, app)}
              className="group relative flex items-center gap-4 p-4 rounded-xl border border-[rgba(255,137,70,0.12)] bg-black/30 backdrop-blur-sm hover:border-accent/30 hover:bg-accent/5 transition-all"
            >
              {/* App Icon */}
              <div className="shrink-0">
                {app.icon.startsWith('/') ? (
                  <Image
                    src={app.icon}
                    alt={app.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-lg object-contain"
                  />
                ) : (
                  <span className="text-3xl">{app.icon}</span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                  {app.name}
                </h4>
                <p className="text-xs text-muted mt-0.5 line-clamp-2">{app.description}</p>
                {isConnected && (
                  <span className="inline-block mt-1.5 text-[10px] text-green-500 font-medium">
                    Connected
                  </span>
                )}
              </div>

              {/* External Link */}
              <ExternalLink className="w-4 h-4 text-muted group-hover:text-accent transition-colors shrink-0" />
            </a>
          );
        })}
      </div>

      <AppConnectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        app={modalApp}
        onConnect={handleConnect}
        onJoinAsGuest={handleJoinAsGuest}
      />

      <AppDisconnectModal
        isOpen={isDisconnectModalOpen}
        onClose={handleCloseDisconnectModal}
        app={disconnectApp}
        onDisconnect={handleDisconnect}
      />
    </div>
  );
}
