import React from 'react';

export function StatCard({ label, value, description, isLoading = false, valueStyle, valueClassName, renderAsCode = false }) {
  if (isLoading) {
    return (
      <div className="stat-card skeleton">
        <span className="stat-label skeleton-text">{label}</span>
        <div className="stat-value skeleton-text">Loading...</div>
        <div className="stat-description skeleton-text">{description}</div>
      </div>
    );
  }

  const ValueTag = renderAsCode ? 'code' : 'div';
  const className = valueClassName ? `stat-value ${valueClassName}` : 'stat-value';

  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <ValueTag className={className} style={valueStyle}>{value}</ValueTag>
      <div className="stat-description">{description}</div>
    </div>
  );
}
