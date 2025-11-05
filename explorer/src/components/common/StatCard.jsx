import React from 'react';

export function StatCard({ label, value, description, isLoading = false }) {
  if (isLoading) {
    return (
      <div className="stat-card skeleton">
        <span className="stat-label skeleton-text">{label}</span>
        <div className="stat-value skeleton-text">Loading...</div>
        <div className="stat-description skeleton-text">{description}</div>
      </div>
    );
  }

  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <div className="stat-value">{value}</div>
      <div className="stat-description">{description}</div>
    </div>
  );
}
