import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, subtitle }) => (
  <div className="stat-card">
    <div className="stat-card-content">
      <div className={`stat-icon ${color}`}>
        <Icon className="icon" />
      </div>
      <div className="stat-text">
        <p className="stat-title">{title}</p>
        <p className="stat-value">{value.toLocaleString()}</p>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      </div>
    </div>
  </div>
);

export default StatCard;
