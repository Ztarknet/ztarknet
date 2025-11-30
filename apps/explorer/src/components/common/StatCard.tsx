import { GlowingEffect } from '@workspace/ui/components/glowing-effect';
import type { CSSProperties } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
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
  if (isLoading) {
    return (
      <div className="group relative w-full h-full rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgba(8,8,12,0.8)] p-2 md:rounded-3xl md:p-3 transition-all duration-300">
        <div className="relative flex w-full h-full flex-col gap-3 overflow-hidden rounded-xl bg-gradient-to-br from-[rgba(12,12,18,0.9)] to-[rgba(6,6,9,0.8)] p-6 shadow-[0_18px_36px_rgba(0,0,0,0.35)]">
          {/* Placeholder for gradient overlay - same structure as loaded */}
          <div className="absolute inset-0 bg-transparent rounded-xl pointer-events-none" />

          <div className="relative flex flex-1 flex-col gap-3 z-10">
            <span className="eyebrow">{label}</span>
            <div className="stat-value skeleton-text">Loading...</div>
            <div className="text-sm text-[rgba(255,255,255,0.7)] leading-relaxed skeleton-text">
              {description}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const ValueTag = renderAsCode ? 'code' : 'div';
  const baseValueClass = 'stat-value';
  const finalValueClass = valueClassName ? `${baseValueClass} ${valueClassName}` : baseValueClass;

  return (
    <div className="group relative w-full h-full rounded-2xl border border-[rgba(255,137,70,0.25)] bg-[rgba(8,8,12,0.8)] p-2 md:rounded-3xl md:p-3 transition-all duration-300">
      <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
      <div className="relative flex w-full h-full flex-col gap-3 overflow-hidden rounded-xl bg-gradient-to-br from-[rgba(12,12,18,0.9)] to-[rgba(6,6,9,0.8)] p-6 shadow-[0_18px_36px_rgba(0,0,0,0.35)] transition-all duration-300 group-hover:shadow-[0_18px_36px_rgba(255,137,70,0.15)]">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,137,70,0.08)] via-[rgba(255,255,255,0.03)] to-[rgba(255,167,70,0.05)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />

        <div className="relative flex flex-1 flex-col gap-3 z-10">
          <span className="eyebrow">{label}</span>
          <ValueTag className={finalValueClass} style={valueStyle}>
            {value}
          </ValueTag>
          <div className="text-sm text-[rgba(255,255,255,0.7)] leading-relaxed">{description}</div>
        </div>
      </div>
    </div>
  );
}
