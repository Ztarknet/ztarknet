import React from 'react';

export function StatCard({ label, value, description, isLoading = false, valueStyle, valueClassName, renderAsCode = false }) {
  if (isLoading) {
    return (
      <div className="pt-7 pr-5 pb-5 pl-7 bg-card-bg border border-[rgba(255,137,70,0.2)] rounded-2xl shadow-[inset_0_0_0_1px_rgba(255,137,70,0.05),0_16px_40px_rgba(0,0,0,0.3)] backdrop-blur-[16px] transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(255,137,70,0.5)] skeleton">
        <span className="block text-xs font-mono tracking-widest uppercase text-[rgba(255,137,70,0.64)] mb-3 skeleton-text">{label}</span>
        <div className="text-[2rem] font-bold text-foreground mb-1.5 font-mono skeleton-text">Loading...</div>
        <div className="text-sm text-muted leading-relaxed m-0 skeleton-text">{description}</div>
      </div>
    );
  }

  const ValueTag = renderAsCode ? 'code' : 'div';
  const className = valueClassName
    ? `text-[2rem] font-bold text-foreground mb-1.5 font-mono ${valueClassName}`
    : 'text-[2rem] font-bold text-foreground mb-1.5 font-mono';

  return (
    <div className="pt-7 pr-5 pb-5 pl-7 bg-card-bg border border-[rgba(255,137,70,0.2)] rounded-2xl shadow-[inset_0_0_0_1px_rgba(255,137,70,0.05),0_16px_40px_rgba(0,0,0,0.3)] backdrop-blur-[16px] transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(255,137,70,0.5)]">
      <span className="block text-xs font-mono tracking-widest uppercase text-[rgba(255,137,70,0.64)] mb-3">{label}</span>
      <ValueTag className={className} style={valueStyle}>{value}</ValueTag>
      <div className="text-sm text-muted leading-relaxed m-0">{description}</div>
    </div>
  );
}
