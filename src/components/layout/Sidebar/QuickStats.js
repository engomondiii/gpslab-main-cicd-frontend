/**
 * GPS Lab Platform - QuickStats Component
 * @module components/layout/Sidebar/QuickStats
 */

import React from 'react';
import './QuickStats.css';

const QuickStats = ({ level = 1, xp = 0, xpToNextLevel = 100, currentStage = 1, missionsCompleted = 0, streak = 0, className = '' }) => {
  const xpProgress = xpToNextLevel > 0 ? (xp / xpToNextLevel) * 100 : 0;
  
  return (
    <div className={`quick-stats ${className}`}>
      <div className="quick-stats__level">
        <div className="quick-stats__level-badge">
          <span className="quick-stats__level-number">{level}</span>
        </div>
        <div className="quick-stats__level-info">
          <span className="quick-stats__level-label">Level {level}</span>
          <div className="quick-stats__xp-bar">
            <div className="quick-stats__xp-fill" style={{ width: `${xpProgress}%` }} />
          </div>
          <span className="quick-stats__xp-text">{xp} / {xpToNextLevel} XP</span>
        </div>
      </div>
      <div className="quick-stats__grid">
        <div className="quick-stats__stat">
          <span className="quick-stats__stat-value">{currentStage}</span>
          <span className="quick-stats__stat-label">Stage</span>
        </div>
        <div className="quick-stats__stat">
          <span className="quick-stats__stat-value">{missionsCompleted}</span>
          <span className="quick-stats__stat-label">Missions</span>
        </div>
        <div className="quick-stats__stat quick-stats__stat--streak">
          <span className="quick-stats__stat-value">🔥 {streak}</span>
          <span className="quick-stats__stat-label">Streak</span>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;