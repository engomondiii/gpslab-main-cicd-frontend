/**
 * GPS Lab Platform - R2RPanel Component
 * GPS 101 INTEGRATION: Track R2R usage for GPS 101 checkpoints
 * 
 * Right to Retry (R2R) management panel showing available R2R,
 * how to earn more, and retry history.
 * 
 * @module components/study/RetryRights/R2RPanel
 */

import React from 'react';
import RetryButton from './RetryButton';
import './R2RPanel.css';

/**
 * R2RPanel Component
 */
const R2RPanel = ({
  available = 0,
  totalEarned = 0,
  totalUsed = 0,
  history = [],
  earnMethods = [],
  // NEW: GPS 101 props
  gps101Available = 0,
  gps101TotalEarned = 0,
  isGPS101Checkpoint = false,
  gps101StageNumber,
  onUseRetry,
  onEarnMore,
  checkpointName,
  showHistory = true,
  className = '',
  ...props
}) => {
  const classNames = [
    'r2r-panel',
    isGPS101Checkpoint && 'r2r-panel--gps101',
    className
  ].filter(Boolean).join(' ');
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Determine which R2R to display
  const displayAvailable = isGPS101Checkpoint ? gps101Available : available;
  const displayEarned = isGPS101Checkpoint ? gps101TotalEarned : totalEarned;
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="r2r-panel__header">
        <div className="r2r-panel__icon">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
          </svg>
        </div>
        <div className="r2r-panel__title-section">
          <h3 className="r2r-panel__title">
            {isGPS101Checkpoint ? 'GPS 101 Right to Retry (R2R)' : 'Right to Retry (R2R)'}
          </h3>
          <p className="r2r-panel__subtitle">
            {isGPS101Checkpoint 
              ? 'Earned through GPS 101 study missions'
              : 'Earned through completing study missions'}
          </p>
        </div>
      </div>
      
      {/* NEW: GPS 101 Context Banner */}
      {isGPS101Checkpoint && (
        <div className="r2r-panel__gps101-banner">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
          </svg>
          <div>
            <strong>GPS 101 Stage {gps101StageNumber} Checkpoint</strong>
            <p>R2R earned from GPS 101 study missions can only be used for GPS 101 checkpoints</p>
          </div>
        </div>
      )}
      
      {/* Stats */}
      <div className="r2r-panel__stats">
        <div className="r2r-panel__stat r2r-panel__stat--available">
          <span className="r2r-panel__stat-value">{displayAvailable}</span>
          <span className="r2r-panel__stat-label">
            {isGPS101Checkpoint ? 'GPS 101 Available' : 'Available'}
          </span>
        </div>
        <div className="r2r-panel__stat">
          <span className="r2r-panel__stat-value">{displayEarned}</span>
          <span className="r2r-panel__stat-label">Total Earned</span>
        </div>
        <div className="r2r-panel__stat">
          <span className="r2r-panel__stat-value">{totalUsed}</span>
          <span className="r2r-panel__stat-label">Used</span>
        </div>
      </div>
      
      {/* NEW: Regular R2R Info (if GPS 101 checkpoint but has regular R2R) */}
      {isGPS101Checkpoint && available > 0 && (
        <div className="r2r-panel__regular-info">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
          </svg>
          <p>You have {available} regular R2R available, but they can't be used for GPS 101 checkpoints</p>
        </div>
      )}
      
      {/* Use R2R */}
      {checkpointName && displayAvailable > 0 && (
        <div className="r2r-panel__use-section">
          <p className="r2r-panel__use-context">
            Retry <strong>{checkpointName}</strong>
          </p>
          <RetryButton
            type="r2r"
            available={displayAvailable}
            onUseRetry={onUseRetry}
            size="large"
            isGPS101={isGPS101Checkpoint}
          />
        </div>
      )}
      
      {/* How to Earn */}
      <div className="r2r-panel__earn-section">
        <h4 className="r2r-panel__section-title">
          {isGPS101Checkpoint ? 'How to Earn GPS 101 R2R' : 'How to Earn R2R'}
        </h4>
        <ul className="r2r-panel__earn-list">
          {isGPS101Checkpoint ? (
            <>
              <li className="r2r-panel__earn-item">
                <span className="r2r-panel__earn-icon">🎓</span>
                <span className="r2r-panel__earn-text">Complete GPS 101 study missions</span>
                <span className="r2r-panel__earn-reward">+1 R2R</span>
              </li>
              <li className="r2r-panel__earn-item">
                <span className="r2r-panel__earn-icon">📝</span>
                <span className="r2r-panel__earn-text">Deep reflection exercises</span>
                <span className="r2r-panel__earn-reward">+1 R2R</span>
              </li>
              <li className="r2r-panel__earn-item">
                <span className="r2r-panel__earn-icon">🔥</span>
                <span className="r2r-panel__earn-text">7-day GPS 101 study streak</span>
                <span className="r2r-panel__earn-reward">+2 R2R</span>
              </li>
            </>
          ) : earnMethods.length > 0 ? (
            earnMethods.map((method, index) => (
              <li key={index} className="r2r-panel__earn-item">
                <span className="r2r-panel__earn-icon">{method.icon || '📚'}</span>
                <span className="r2r-panel__earn-text">{method.text}</span>
                {method.reward && (
                  <span className="r2r-panel__earn-reward">+{method.reward} R2R</span>
                )}
              </li>
            ))
          ) : (
            <>
              <li className="r2r-panel__earn-item">
                <span className="r2r-panel__earn-icon">📚</span>
                <span className="r2r-panel__earn-text">Complete study missions</span>
                <span className="r2r-panel__earn-reward">+1 R2R</span>
              </li>
              <li className="r2r-panel__earn-item">
                <span className="r2r-panel__earn-icon">🔥</span>
                <span className="r2r-panel__earn-text">Maintain 7-day study streak</span>
                <span className="r2r-panel__earn-reward">+2 R2R</span>
              </li>
              <li className="r2r-panel__earn-item">
                <span className="r2r-panel__earn-icon">⭐</span>
                <span className="r2r-panel__earn-text">Score 90%+ on checkpoints</span>
                <span className="r2r-panel__earn-reward">+1 R2R</span>
              </li>
            </>
          )}
        </ul>
        {onEarnMore && (
          <button
            type="button"
            className="r2r-panel__earn-btn"
            onClick={onEarnMore}
          >
            {isGPS101Checkpoint ? 'View GPS 101 Study Missions' : 'View Study Missions'}
          </button>
        )}
      </div>
      
      {/* History */}
      {showHistory && history.length > 0 && (
        <div className="r2r-panel__history">
          <h4 className="r2r-panel__section-title">Recent Activity</h4>
          <ul className="r2r-panel__history-list">
            {history.slice(0, 5).map((item, index) => (
              <li key={index} className={`r2r-panel__history-item r2r-panel__history-item--${item.type} ${item.isGPS101 ? 'r2r-panel__history-item--gps101' : ''}`}>
                <span className="r2r-panel__history-action">
                  {item.type === 'earned' ? '+' : '-'}
                  {item.amount}
                  {item.isGPS101 && <span className="r2r-panel__history-gps101-badge">🎓</span>}
                </span>
                <span className="r2r-panel__history-description">{item.description}</span>
                <span className="r2r-panel__history-date">{formatDate(item.date)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Empty State */}
      {displayAvailable === 0 && (
        <div className="r2r-panel__empty">
          <p>
            {isGPS101Checkpoint 
              ? 'Complete GPS 101 study missions to earn R2R for GPS 101 checkpoints'
              : 'Complete study missions to earn R2R for checkpoint retries'}
          </p>
        </div>
      )}
    </div>
  );
};

export default R2RPanel;