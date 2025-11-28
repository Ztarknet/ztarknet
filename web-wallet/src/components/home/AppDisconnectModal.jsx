import React from 'react';

export function AppDisconnectModal({ isOpen, onClose, app, onDisconnect }) {
  if (!isOpen || !app) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md p-6 sm:p-8 border border-[rgba(255,137,70,0.2)] rounded-2xl shadow-[inset_0_0_0_1px_rgba(255,137,70,0.05),0_16px_40px_rgba(0,0,0,0.3)] backdrop-blur-[16px]"
        style={{
          background: 'radial-gradient(circle at top left, rgba(255, 107, 26, 0.12), rgba(8, 8, 12, 0.95) 60%)'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-foreground transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* App Icon */}
        <div className="flex justify-center mb-4">
          {app.icon.startsWith('/') ? (
            <img src={app.icon} alt={app.name} className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
          ) : (
            <div className="text-5xl sm:text-6xl">{app.icon}</div>
          )}
        </div>

        {/* App Name */}
        <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center mb-2">
          Disconnect from {app.name}?
        </h2>

        {/* Warning Message */}
        <div className="mb-6 p-4 border border-[rgba(200,80,80,0.3)] rounded-lg bg-[rgba(200,80,80,0.1)]">
          <p className="text-sm text-foreground text-center">
            This will remove your account connection from this app. You can reconnect at any time.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onDisconnect}
            className="w-full py-3 px-4 rounded-full text-base font-semibold tracking-wide border transition-all duration-200 cursor-pointer border-[rgba(200,80,80,0.4)] bg-[rgba(200,80,80,0.15)] text-[#C85050] hover:border-[rgba(200,80,80,0.6)] hover:bg-[rgba(200,80,80,0.25)] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(200,80,80,0.3)]"
          >
            Disconnect
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-full text-base font-semibold tracking-wide border transition-all duration-200 cursor-pointer border-[rgba(255,137,70,0.2)] text-muted hover:border-[rgba(255,137,70,0.3)] hover:text-foreground hover:bg-[rgba(255,107,26,0.05)]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
