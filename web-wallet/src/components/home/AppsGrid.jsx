import React from 'react';
import { GlowingEffect } from '@/components/common/GlowingEffect';

const apps = [
  {
    id: 'art-peace',
    name: 'Art/Peace',
    description: 'Collaborative pixel art canvas on Ztarknet',
    url: 'https://ztarknet.art-peace.net',
    icon: '🎨',
  },
  // Add more apps here as they become available
];

export function AppsGrid() {
  return (
    <div>
      <h3 className="text-xl font-semibold text-foreground mb-4">Ztarknet Apps</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apps.map((app) => (
          <a
            key={app.id}
            href={app.url}
            target="_blank"
            rel="noreferrer"
            className="relative group block p-6 border border-[rgba(255,137,70,0.2)] rounded-2xl shadow-[inset_0_0_0_1px_rgba(255,137,70,0.05),0_16px_40px_rgba(0,0,0,0.3)] backdrop-blur-[16px] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,107,26,0.3),inset_0_0_0_1px_rgba(255,137,70,0.1)] cursor-pointer"
            style={{
              background: 'radial-gradient(circle at top left, rgba(255, 107, 26, 0.08), rgba(8, 8, 12, 0.9) 60%)'
            }}
          >
            <GlowingEffect proximity={64} spread={30} />

            {/* App Icon */}
            <div className="text-5xl mb-4">{app.icon}</div>

            {/* App Name */}
            <h4 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
              {app.name}
            </h4>

            {/* App Description */}
            <p className="text-sm text-muted leading-relaxed">
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
        ))}
      </div>
    </div>
  );
}
