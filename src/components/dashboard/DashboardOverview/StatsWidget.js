/**
 * GPS Lab Platform - StatsWidget Component
 * 
 * Displays a single statistic with icon and trend.
 * Used in dashboard overview and various summary sections.
 * 
 * @module components/dashboard/DashboardOverview/StatsWidget
 */

import React from 'react';
import './StatsWidget.css';

/**
 * Stat icon components
 */
const StatIcons = {
  missions: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
    </svg>
  ),
  xp: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
  ),
  streak: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
    </svg>
  ),
  baraka: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10"/>
      <text x="12" y="16" textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="bold" className="stats-widget__baraka-symbol">B</text>
    </svg>
  ),
  level: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
  ),
  stage: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
    </svg>
  ),
  party: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
  ),
  time: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
    </svg>
  )
};

/**
 * StatsWidget Component
 */
const StatsWidget = ({
  icon = 'missions',
  label,
  value,
  suffix = '',
  prefix = '',
  trend,
  trendLabel,
  color = 'primary',
  size = 'medium',
  variant = 'default',
  onClick,
  className = '',
  ...props
}) => {
  const IconComponent = StatIcons[icon] || StatIcons.missions;
  
  // Determine trend direction
  const trendDirection = trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral';
  
  const classNames = [
    'stats-widget',
    `stats-widget--${color}`,
    `stats-widget--${size}`,
    `stats-widget--${variant}`,
    onClick && 'stats-widget--clickable',
    className
  ].filter(Boolean).join(' ');
  
  const handleClick = () => {
    if (onClick) onClick();
  };
  
  const handleKeyDown = (e) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };
  
  return (
    <div 
      className={classNames}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {/* Icon */}
      <div className="stats-widget__icon">
        {IconComponent}
      </div>
      
      {/* Content */}
      <div className="stats-widget__content">
        <span className="stats-widget__label">{label}</span>
        <div className="stats-widget__value-row">
          <span className="stats-widget__value">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </span>
          
          {/* Trend Indicator */}
          {trend !== undefined && (
            <span className={`stats-widget__trend stats-widget__trend--${trendDirection}`}>
              {trendDirection === 'up' && (
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                </svg>
              )}
              {trendDirection === 'down' && (
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              )}
              <span>{Math.abs(trend)}%</span>
            </span>
          )}
        </div>
        
        {/* Trend Label */}
        {trendLabel && (
          <span className="stats-widget__trend-label">{trendLabel}</span>
        )}
      </div>
    </div>
  );
};

export { StatIcons };
export default StatsWidget;