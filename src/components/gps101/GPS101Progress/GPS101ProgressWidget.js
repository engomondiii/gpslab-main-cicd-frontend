/**
 * GPS 101 Progress Widget Component
 * * Compact progress overview for quick reference.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import useGPS101 from '../../../hooks/useGPS101';
import { 
  formatBaraka, 
  formatWeeks 
} from '../../../utils/formatters/gps101.formatter';
import './GPS101ProgressWidget.css';

const GPS101ProgressWidget = ({ variant = 'default' }) => {
  const navigate = useNavigate();
  
  // FIXED: Provide an empty fallback object {} so destructing doesn't fail
  const {
    progressSummary,
    currentStage = 1,
    barakaProgress,
    getWeeksRemaining,
    isCompleted = false
  } = useGPS101() || {};

  // FIXED: Provide strict fallback data structures for nested objects
  const safeProgress = progressSummary || {
    overallProgress: 0,
    stages: { completed: 0, total: 5 },
    missions: { completed: 0, total: 30 },
    checkpoints: { completed: 0, total: 150 }
  };

  const safeBaraka = barakaProgress || {
    current: 0,
    percentage: 0,
    remaining: 5000
  };

  // Safe caller for functions that might be undefined while hooks initialize
  const weeksRemaining = typeof getWeeksRemaining === 'function' ? getWeeksRemaining() : 15;

  if (variant === 'compact') {
    return (
      <div className="gps101-progress-widget compact">
        <div className="widget-compact-content">
          <div className="compact-stat">
            <span className="compact-label">Stage</span>
            <span className="compact-value">{currentStage}/5</span>
          </div>
          <div className="compact-stat">
            <span className="compact-label">Progress</span>
            <span className="compact-value">{safeProgress.overallProgress}%</span>
          </div>
          <div className="compact-stat">
            <span className="compact-label">Baraka</span>
            <span className="compact-value">{formatBaraka(safeBaraka.current)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gps101-progress-widget">
      {/* Header */}
      <div className="progress-widget-header">
        <h3 className="widget-title">GPS 101 Progress</h3>
        {!isCompleted && (
          <span className="weeks-remaining">
            {formatWeeks(weeksRemaining)} left
          </span>
        )}
      </div>

      {/* Overall Progress Circle */}
      <div className="progress-circle-container">
        <svg className="progress-circle" viewBox="0 0 120 120">
          <circle
            className="progress-circle-bg"
            cx="60"
            cy="60"
            r="54"
            fill="none"
            strokeWidth="8"
          />
          <circle
            className="progress-circle-fill"
            cx="60"
            cy="60"
            r="54"
            fill="none"
            strokeWidth="8"
            strokeDasharray={`${(safeProgress.overallProgress / 100) * 339.292} 339.292`}
            transform="rotate(-90 60 60)"
          />
          <text
            x="60"
            y="55"
            textAnchor="middle"
            className="progress-percentage-text"
          >
            {safeProgress.overallProgress}%
          </text>
          <text
            x="60"
            y="70"
            textAnchor="middle"
            className="progress-label-text"
          >
            Complete
          </text>
        </svg>
      </div>

      {/* Stats Grid */}
      <div className="progress-stats-grid">
        <div className="stat-item">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <span className="stat-label">Stages</span>
            <span className="stat-value">
              {safeProgress.stages.completed}/{safeProgress.stages.total}
            </span>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <span className="stat-label">Missions</span>
            <span className="stat-value">
              {safeProgress.missions.completed}/{safeProgress.missions.total}
            </span>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">✓</div>
          <div className="stat-info">
            <span className="stat-label">Checkpoints</span>
            <span className="stat-value">
              {safeProgress.checkpoints.completed}/{safeProgress.checkpoints.total}
            </span>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">🟠</div>
          <div className="stat-info">
            <span className="stat-label">Baraka</span>
            <span className="stat-value">
              {formatBaraka(safeBaraka.current)}
            </span>
          </div>
        </div>
      </div>

      {/* Orange Beacon Progress */}
      <div className="beacon-progress-section">
        <div className="beacon-header">
          <span className="beacon-label">Orange Beacon</span>
          <span className="beacon-percentage">{safeBaraka.percentage}%</span>
        </div>
        <div className="beacon-progress-bar">
          <div 
            className="beacon-progress-fill"
            style={{ width: `${safeBaraka.percentage}%` }}
          />
        </div>
        <div className="beacon-info">
          <span className="beacon-remaining">
            {formatBaraka(safeBaraka.remaining)} to go
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button 
        className="view-details-button"
        onClick={() => navigate('/gps101')}
      >
        View Full Journey
      </button>
    </div>
  );
};

export default GPS101ProgressWidget;