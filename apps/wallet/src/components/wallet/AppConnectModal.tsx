'use client';

import { Button } from '@workspace/ui/components/button';
import { X } from 'lucide-react';
import Image from 'next/image';

interface App {
  id: string;
  name: string;
  appName: string;
  description: string;
  url: string;
  icon: string;
}

interface AppConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  app: App | null;
  onConnect: () => void;
  onJoinAsGuest: () => void;
}

export function AppConnectModal({
  isOpen,
  onClose,
  app,
  onConnect,
  onJoinAsGuest,
}: AppConnectModalProps) {
  if (!isOpen || !app) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
      />

      <div className="relative w-full max-w-sm rounded-xl border border-[rgba(255,137,70,0.15)] bg-[#0a0a0c] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h2 className="text-lg font-semibold text-foreground">Connect to App</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-muted hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex justify-center mb-4">
            {app.icon.startsWith('/') ? (
              <Image
                src={app.icon}
                alt={app.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-xl object-contain"
              />
            ) : (
              <span className="text-5xl">{app.icon}</span>
            )}
          </div>

          <h3 className="text-base font-semibold text-foreground text-center mb-1">{app.name}</h3>
          <p className="text-xs text-muted text-center mb-5">{app.description}</p>

          <div className="p-3 rounded-lg bg-accent/5 border border-accent/10 mb-5">
            <p className="text-xs text-muted text-center">Connect your account or join as guest?</p>
          </div>

          <div className="space-y-2">
            <Button variant="primary" className="w-full" onClick={onConnect}>
              Connect Account
            </Button>
            <Button variant="ghost" className="w-full text-muted" onClick={onJoinAsGuest}>
              Join as Guest
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
