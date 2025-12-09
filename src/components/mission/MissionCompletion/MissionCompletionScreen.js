/**
 * GPS Lab Platform - MissionCompletionScreen Component
 * 
 * Full screen completion summary with rewards and next actions.
 * 
 * @module components/mission/MissionCompletion/MissionCompletionScreen
 */

import React, { useState, useEffect } from 'react';
import MissionCelebration from './MissionCelebration';
import './MissionCompletionScreen.css';

const MissionCompletionScreen = ({
  mission = {},
  timeSpent = 0,
  objectivesCompleted = 0,
  objectivesTotal = 0,
  bonusObjectives = 0,
  xpEarned = 0,
  barakaEarned = 0,
  badgesEarned = [],
  achievementsUnlocked = [],
  nextMission,
  onContinue,
  onViewRewards,
  onShareProgress,
  onReturnToDashboard,
  showCelebration = true,
  className = '',
  ...props
}) => {
  const [celebrationActive, setCelebrationActive] = useState(showCelebration);
  const [showContent, setShowContent] = useState(!showCelebration);
  
  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration]);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  
  const completionRate = objectivesTotal > 0 ? Math.round((objectivesCompleted / objectivesTotal) * 100) : 100;
  const isPerfect = completionRate === 100 && bonusObjectives > 0;
  
  const classNames = ['mission-completion-screen', showContent && 'mission-completion-screen--visible', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      <MissionCelebration isActive={celebrationActive} onComplete={() => setCelebrationActive(false)} />
      
      <div className="mission-completion-screen__bg">
        <div className="mission-completion-screen__bg-gradient" />
        <div className="mission-completion-screen__bg-pattern" />
      </div>
      
      <div className="mission-completion-screen__content">
        {/* Trophy/Badge */}
        <div className={`mission-completion-screen__trophy ${isPerfect ? 'mission-completion-screen__trophy--perfect' : ''}`}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
          </svg>
          {isPerfect && <span className="mission-completion-screen__perfect-badge">PERFECT!</span>}
        </div>
        
        {/* Title */}
        <h1 className="mission-completion-screen__title">Mission Complete!</h1>
        <h2 className="mission-completion-screen__mission-name">{mission.title}</h2>
        
        {/* Stats Grid */}
        <div className="mission-completion-screen__stats">
          <div className="mission-completion-screen__stat">
            <span className="mission-completion-screen__stat-value">{completionRate}%</span>
            <span className="mission-completion-screen__stat-label">Completion</span>
          </div>
          <div className="mission-completion-screen__stat">
            <span className="mission-completion-screen__stat-value">{formatTime(timeSpent)}</span>
            <span className="mission-completion-screen__stat-label">Time</span>
          </div>
          <div className="mission-completion-screen__stat">
            <span className="mission-completion-screen__stat-value">{objectivesCompleted}/{objectivesTotal}</span>
            <span className="mission-completion-screen__stat-label">Objectives</span>
          </div>
        </div>
        
        {/* Rewards */}
        <div className="mission-completion-screen__rewards">
          <h3 className="mission-completion-screen__rewards-title">Rewards Earned</h3>
          <div className="mission-completion-screen__rewards-grid">
            <div className="mission-completion-screen__reward mission-completion-screen__reward--xp">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              <span className="mission-completion-screen__reward-value">+{xpEarned}</span>
              <span className="mission-completion-screen__reward-label">XP</span>
            </div>
            <div className="mission-completion-screen__reward mission-completion-screen__reward--baraka">
              <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
              <span className="mission-completion-screen__reward-value">+{barakaEarned}</span>
              <span className="mission-completion-screen__reward-label">Baraka</span>
            </div>
          </div>
        </div>
        
        {/* Badges */}
        {badgesEarned.length > 0 && (
          <div className="mission-completion-screen__badges">
            <h4 className="mission-completion-screen__badges-title">Badges Unlocked</h4>
            <div className="mission-completion-screen__badges-list">
              {badgesEarned.map((badge, i) => (
                <div key={i} className="mission-completion-screen__badge">
                  {badge.icon ? <img src={badge.icon} alt={badge.name} /> : (
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                  )}
                  <span>{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="mission-completion-screen__actions">
          {nextMission && (
            <button type="button" onClick={onContinue} className="mission-completion-screen__btn mission-completion-screen__btn--primary">
              Next Mission
              <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
            </button>
          )}
          <button type="button" onClick={onReturnToDashboard} className="mission-completion-screen__btn mission-completion-screen__btn--secondary">
            Return to Dashboard
          </button>
        </div>
        
        {/* Share */}
        {onShareProgress && (
          <button type="button" onClick={onShareProgress} className="mission-completion-screen__share">
            <svg viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/></svg>
            Share Progress
          </button>
        )}
      </div>
    </div>
  );
};

export default MissionCompletionScreen;