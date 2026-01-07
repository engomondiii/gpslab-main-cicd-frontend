/**
 * GPS Lab Platform - ProjectMetrics Component
 * 
 * Display project metrics, KPIs, and performance data
 * with charts and statistics.
 * 
 * @module components/project/ProjectDetail/ProjectMetrics
 */

import React, { useState } from 'react';
import './ProjectMetrics.css';

/**
 * Format number with abbreviation
 */
const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
};

/**
 * Format currency
 */
const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '$0';
  if (amount >= 1000000) return '$' + (amount / 1000000).toFixed(1) + 'M';
  if (amount >= 1000) return '$' + (amount / 1000).toFixed(1) + 'K';
  return '$' + amount.toLocaleString();
};

/**
 * Format percentage change
 */
const formatChange = (change) => {
  if (change === undefined || change === null) return null;
  const sign = change >= 0 ? '+' : '';
  return sign + change.toFixed(1) + '%';
};

/**
 * ProjectMetrics Component
 */
const ProjectMetrics = ({
  metrics = {},
  period = 'month', // week, month, quarter, year
  onPeriodChange,
  className = '',
  ...props
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  
  const {
    // Core metrics
    customers = 0,
    customersChange,
    revenue = 0,
    revenueChange,
    users = 0,
    usersChange,
    retention = 0,
    retentionChange,
    
    // Mission metrics
    missionsCompleted = 0,
    bitesSubmitted = 0,
    checkpointsPassed = 0,
    studyHours = 0,
    
    // Economy metrics
    barakaEarned = 0,
    xpEarned = 0,
    
    // Performance
    weeklyData = [],
    milestones = []
  } = metrics;
  
  const handlePeriodChange = (newPeriod) => {
    setSelectedPeriod(newPeriod);
    if (onPeriodChange) {
      onPeriodChange(newPeriod);
    }
  };
  
  const classNames = [
    'project-metrics',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="project-metrics__header">
        <h3 className="project-metrics__title">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
          </svg>
          Project Metrics
        </h3>
        
        <div className="project-metrics__period-selector">
          {['week', 'month', 'quarter', 'year'].map(p => (
            <button
              key={p}
              type="button"
              className={`project-metrics__period-btn ${selectedPeriod === p ? 'project-metrics__period-btn--active' : ''}`}
              onClick={() => handlePeriodChange(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="project-metrics__key-metrics">
        <div className="project-metrics__metric project-metrics__metric--primary">
          <div className="project-metrics__metric-icon">👥</div>
          <div className="project-metrics__metric-content">
            <span className="project-metrics__metric-value">{formatNumber(customers)}</span>
            <span className="project-metrics__metric-label">Customers</span>
            {customersChange !== undefined && (
              <span className={`project-metrics__metric-change ${customersChange >= 0 ? 'project-metrics__metric-change--positive' : 'project-metrics__metric-change--negative'}`}>
                {formatChange(customersChange)}
              </span>
            )}
          </div>
        </div>
        
        <div className="project-metrics__metric project-metrics__metric--primary">
          <div className="project-metrics__metric-icon">💰</div>
          <div className="project-metrics__metric-content">
            <span className="project-metrics__metric-value">{formatCurrency(revenue)}</span>
            <span className="project-metrics__metric-label">Revenue</span>
            {revenueChange !== undefined && (
              <span className={`project-metrics__metric-change ${revenueChange >= 0 ? 'project-metrics__metric-change--positive' : 'project-metrics__metric-change--negative'}`}>
                {formatChange(revenueChange)}
              </span>
            )}
          </div>
        </div>
        
        <div className="project-metrics__metric project-metrics__metric--primary">
          <div className="project-metrics__metric-icon">🌍</div>
          <div className="project-metrics__metric-content">
            <span className="project-metrics__metric-value">{formatNumber(users)}</span>
            <span className="project-metrics__metric-label">Users Impacted</span>
            {usersChange !== undefined && (
              <span className={`project-metrics__metric-change ${usersChange >= 0 ? 'project-metrics__metric-change--positive' : 'project-metrics__metric-change--negative'}`}>
                {formatChange(usersChange)}
              </span>
            )}
          </div>
        </div>
        
        <div className="project-metrics__metric project-metrics__metric--primary">
          <div className="project-metrics__metric-icon">🔄</div>
          <div className="project-metrics__metric-content">
            <span className="project-metrics__metric-value">{retention}%</span>
            <span className="project-metrics__metric-label">Retention Rate</span>
            {retentionChange !== undefined && (
              <span className={`project-metrics__metric-change ${retentionChange >= 0 ? 'project-metrics__metric-change--positive' : 'project-metrics__metric-change--negative'}`}>
                {formatChange(retentionChange)}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* GPS Metrics */}
      <div className="project-metrics__gps-section">
        <h4 className="project-metrics__section-title">GPS Progress</h4>
        <div className="project-metrics__gps-metrics">
          <div className="project-metrics__gps-metric">
            <span className="project-metrics__gps-icon">🎯</span>
            <span className="project-metrics__gps-value">{missionsCompleted}</span>
            <span className="project-metrics__gps-label">Missions</span>
          </div>
          <div className="project-metrics__gps-metric">
            <span className="project-metrics__gps-icon">🍕</span>
            <span className="project-metrics__gps-value">{bitesSubmitted}</span>
            <span className="project-metrics__gps-label">Bites</span>
          </div>
          <div className="project-metrics__gps-metric">
            <span className="project-metrics__gps-icon">🏁</span>
            <span className="project-metrics__gps-value">{checkpointsPassed}</span>
            <span className="project-metrics__gps-label">Checkpoints</span>
          </div>
          <div className="project-metrics__gps-metric">
            <span className="project-metrics__gps-icon">📚</span>
            <span className="project-metrics__gps-value">{studyHours}h</span>
            <span className="project-metrics__gps-label">Study Time</span>
          </div>
        </div>
      </div>
      
      {/* Economy Metrics */}
      <div className="project-metrics__economy-section">
        <h4 className="project-metrics__section-title">Economy</h4>
        <div className="project-metrics__economy-metrics">
          <div className="project-metrics__economy-metric">
            <div className="project-metrics__economy-header">
              <span className="project-metrics__economy-icon">🪙</span>
              <span className="project-metrics__economy-label">Baraka Earned</span>
            </div>
            <span className="project-metrics__economy-value">{formatNumber(barakaEarned)}</span>
          </div>
          <div className="project-metrics__economy-metric">
            <div className="project-metrics__economy-header">
              <span className="project-metrics__economy-icon">⭐</span>
              <span className="project-metrics__economy-label">XP Earned</span>
            </div>
            <span className="project-metrics__economy-value">{formatNumber(xpEarned)}</span>
          </div>
        </div>
      </div>
      
      {/* Simple Chart */}
      {weeklyData.length > 0 && (
        <div className="project-metrics__chart-section">
          <h4 className="project-metrics__section-title">Weekly Progress</h4>
          <div className="project-metrics__chart">
            <div className="project-metrics__chart-bars">
              {weeklyData.map((value, index) => (
                <div 
                  key={index}
                  className="project-metrics__chart-bar-wrap"
                >
                  <div 
                    className="project-metrics__chart-bar"
                    style={{ 
                      height: `${Math.max(5, (value / Math.max(...weeklyData)) * 100)}%` 
                    }}
                  />
                  <span className="project-metrics__chart-label">W{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Milestones */}
      {milestones.length > 0 && (
        <div className="project-metrics__milestones-section">
          <h4 className="project-metrics__section-title">Milestones</h4>
          <div className="project-metrics__milestones">
            {milestones.map((milestone, index) => (
              <div 
                key={index}
                className={`project-metrics__milestone ${milestone.completed ? 'project-metrics__milestone--completed' : ''}`}
              >
                <div className="project-metrics__milestone-icon">
                  {milestone.completed ? '✓' : (index + 1)}
                </div>
                <div className="project-metrics__milestone-content">
                  <span className="project-metrics__milestone-name">{milestone.name}</span>
                  {milestone.date && (
                    <span className="project-metrics__milestone-date">{milestone.date}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectMetrics;