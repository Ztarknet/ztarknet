'use client';

import type { CSSProperties, ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: ReactNode;
  description: string;
  isLoading?: boolean;
  valueStyle?: CSSProperties;
  valueClassName?: string;
  renderAsCode?: boolean;
}

export function StatCard({
  label,
  value,
  description,
  isLoading = false,
  valueStyle,
  valueClassName,
  renderAsCode = false,
}: StatCardProps) {
  const ValueTag = renderAsCode ? 'code' : 'div';

  return (
    <div className="p-4 rounded-xl border border-[rgba(255,137,70,0.12)] bg-black/30 backdrop-blur-sm">
      <span className="text-[10px] font-mono tracking-widest uppercase text-accent/60">
        {label}
      </span>
      {isLoading ? (
        <div className="mt-2">
          <div className="h-7 w-24 rounded bg-white/5 animate-pulse" />
          <div className="h-3 w-32 rounded bg-white/5 animate-pulse mt-2" />
        </div>
      ) : (
        <>
          <ValueTag
            className={`mt-1.5 text-xl font-bold text-foreground font-mono truncate ${valueClassName || ''}`}
            style={valueStyle}
          >
            {value}
          </ValueTag>
          <p className="text-xs text-muted mt-1">{description}</p>
        </>
      )}
    </div>
  );
}
