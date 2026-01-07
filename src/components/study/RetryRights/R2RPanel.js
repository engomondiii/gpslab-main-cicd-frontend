/**
 * GPS Lab Platform - R2RPanel Component
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
  onUseRetry,
  onEarnMore,
  checkpointName,
  showHistory = true,
  className = '',
  ...props
}) => {
  const classNames = [
    'r2r-panel',
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
          <h3 className="r2r-panel__title">Right to Retry (R2R)</h3>
          <p className="r2r-panel__subtitle">
            Earned through completing study missions
          </p>
        </div>
      </div>
      
      {/* Stats */}
      <div className="r2r-panel__stats">
        <div className="r2r-panel__stat r2r-panel__stat--available">
          <span className="r2r-panel__stat-value">{available}</span>
          <span className="r2r-panel__stat-label">Available</span>
        </div>
        <div className="r2r-panel__stat">
          <span className="r2r-panel__stat-value">{totalEarned}</span>
          <span className="r2r-panel__stat-label">Total Earned</span>
        </div>
        <div className="r2r-panel__stat">
          <span className="r2r-panel__stat-value">{totalUsed}</span>
          <span className="r2r-panel__stat-label">Used</span>
        </div>
      </div>
      
      {/* Use R2R */}
      {checkpointName && available > 0 && (
        <div className="r2r-panel__use-section">
          <p className="r2r-panel__use-context">
            Retry <strong>{checkpointName}</strong>
          </p>
          <RetryButton
            type="r2r"
            available={available}
            onUseRetry={onUseRetry}
            size="large"
          />
        </div>
      )}
      
      {/* How to Earn */}
      <div className="r2r-panel__earn-section">
        <h4 className="r2r-panel__section-title">How to Earn R2R</h4>
        <ul className="r2r-panel__earn-list">
          {earnMethods.length > 0 ? (
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
            View Study Missions
          </button>
        )}
      </div>
      
      {/* History */}
      {showHistory && history.length > 0 && (
        <div className="r2r-panel__history">
          <h4 className="r2r-panel__section-title">Recent Activity</h4>
          <ul className="r2r-panel__history-list">
            {history.slice(0, 5).map((item, index) => (
              <li key={index} className={`r2r-panel__history-item r2r-panel__history-item--${item.type}`}>
                <span className="r2r-panel__history-action">
                  {item.type === 'earned' ? '+' : '-'}
                  {item.amount}
                </span>
                <span className="r2r-panel__history-description">{item.description}</span>
                <span className="r2r-panel__history-date">{formatDate(item.date)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Empty State */}
      {available === 0 && (
        <div className="r2r-panel__empty">
          <p>Complete study missions to earn R2R for checkpoint retries</p>
        </div>
      )}
    </div>
  );
};

export default R2RPanel;