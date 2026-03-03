/**
 * GPS Lab Platform - QuickStats Component
 * * UPDATED: GPS 101 Integration - Shows GPS 101 stage and Orange Beacon progress
 * ALWAYS visible to tease the user, clickable to enroll if unenrolled.
 * * @module components/layout/Sidebar/QuickStats
 * @version 2.0.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './QuickStats.css';

const QuickStats = ({ 
  level = 1, 
  xp = 0, 
  xpToNextLevel = 100, 
  currentStage = 1, 
  missionsCompleted = 0, 
  streak = 0,
  // GPS 101 Props
  gps101Enrolled = false,
  gps101CurrentStage = 1,
  gps101OrangeBeaconProgress = 0,
  gpoCallCompleted = false,
  className = '' 
}) => {
  const navigate = useNavigate();
  const xpProgress = xpToNextLevel > 0 ? (xp / xpToNextLevel) * 100 : 0;
  
  // Determine level badge gradient based on GPS 101
  const badgeGradient = gps101Enrolled
    ? 'linear-gradient(135deg, #667eea, #764ba2)' // GPS 101 purple
    : 'linear-gradient(135deg, var(--gps-primary, #00d4ff), var(--gps-accent, #2a9d8f))'; // Default
  
  // Handler to catch clicks on GPS 101 stats for unenrolled users
  const handleGps101Click = () => {
    if (!gps101Enrolled) {
      navigate('/gps101'); // Routes directly to the Enrollment Landing Page
    }
  };

  return (
    <div className={`quick-stats ${gps101Enrolled ? 'quick-stats--gps101' : ''} ${className}`}>
      <div className="quick-stats__level">
        <div className="quick-stats__level-badge" style={{ background: badgeGradient }}>
          <span className="quick-stats__level-number">{level}</span>
        </div>
        <div className="quick-stats__level-info">
          <span className="quick-stats__level-label">
            Level {level}
            {gps101Enrolled && <span className="quick-stats__gps101-badge">GPS 101</span>}
          </span>
          <div className="quick-stats__xp-bar">
            <div 
              className="quick-stats__xp-fill" 
              style={{ 
                width: `${xpProgress}%`,
                background: gps101Enrolled ? 'linear-gradient(90deg, #667eea, #764ba2)' : undefined
              }} 
            />
          </div>
          <span className="quick-stats__xp-text">{xp} / {xpToNextLevel} XP</span>
        </div>
      </div>
      
      <div className="quick-stats__grid">
        {/* 1. Stage/GPO Call Display (KEPT INTACT AS REQUESTED) */}
        <div className="quick-stats__stat">
          {gpoCallCompleted ? (
            <>
              <span className="quick-stats__stat-value">✓</span>
              <span className="quick-stats__stat-label">GPO Done</span>
            </>
          ) : currentStage < 1 ? (
            <>
              <span className="quick-stats__stat-value">GPO</span>
              <span className="quick-stats__stat-label">Call</span>
            </>
          ) : (
            <>
              <span className="quick-stats__stat-value">{currentStage}</span>
              <span className="quick-stats__stat-label">Stage</span>
            </>
          )}
        </div>
        
        {/* 2. Missions Display (KEPT INTACT AS REQUESTED) */}
        <div className="quick-stats__stat">
          <span className="quick-stats__stat-value">{missionsCompleted}</span>
          <span className="quick-stats__stat-label">Missions</span>
        </div>
        
        {/* 3. Streak (Always shown) */}
        <div className="quick-stats__stat quick-stats__stat--streak">
          <span className="quick-stats__stat-value">🔥 {streak}</span>
          <span className="quick-stats__stat-label">Streak</span>
        </div>

        {/* 4. GPS 101 Stage Display (Always visible, acts as CTA if not enrolled) */}
        <div 
          className="quick-stats__stat quick-stats__stat--gps101"
          onClick={handleGps101Click}
          style={{ cursor: !gps101Enrolled ? 'pointer' : 'default' }}
        >
          <span className="quick-stats__stat-value">{gps101Enrolled ? gps101CurrentStage : 0}/5</span>
          <span className="quick-stats__stat-label">GPS 101</span>
        </div>
        
        {/* 5. Orange Beacon Display (Always visible, acts as CTA if not enrolled) */}
        <div 
          className="quick-stats__stat quick-stats__stat--orange-beacon"
          onClick={handleGps101Click}
          style={{ cursor: !gps101Enrolled ? 'pointer' : 'default' }}
        >
          <span className="quick-stats__stat-value">🟠 {gps101Enrolled ? Math.floor(gps101OrangeBeaconProgress) : 0}%</span>
          <span className="quick-stats__stat-label">Beacon</span>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;