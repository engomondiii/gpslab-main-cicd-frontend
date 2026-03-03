/**
 * GPS Lab Platform - MissionCompletionScreen Component
 * GPS 101 INTEGRATION: GPS 101 celebration, deliverable unlock, stage completion
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [celebrationActive, setCelebrationActive] = useState(showCelebration);
  const [showContent, setShowContent] = useState(!showCelebration);
  
  // NEW: GPS 101 fields
  const {
    isGPS101 = false,
    gps101StageNumber,
    gps101StageQuestion,
    gps101DeliverableName,
    isStageCompleter = false,
    completedStage = false, // NEW: Did this complete the entire stage?
    unlockedOrangeBeacon = false // NEW: Did this unlock Orange Beacon?
  } = mission;
  
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
  
  const classNames = [
    'mission-completion-screen',
    showContent && 'mission-completion-screen--visible',
    isGPS101 && 'mission-completion-screen--gps101',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      <MissionCelebration
        isActive={celebrationActive}
        onComplete={() => setCelebrationActive(false)}
        isGPS101={isGPS101}
      />
      
      <div className="mission-completion-screen__bg">
        <div className="mission-completion-screen__bg-gradient" />
        <div className="mission-completion-screen__bg-pattern" />
      </div>
      
      <div className="mission-completion-screen__content">
        {/* NEW: GPS 101 Header */}
        {isGPS101 && (
          <div className="mission-completion-screen__gps101-header">
            <div className="mission-completion-screen__gps101-badge">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
              </svg>
              <span>GPS 101 • Stage {gps101StageNumber}</span>
            </div>
            {gps101StageQuestion && (
              <p className="mission-completion-screen__gps101-question">"{gps101StageQuestion}"</p>
            )}
          </div>
        )}
        
        {/* Trophy/Badge */}
        <div className={`mission-completion-screen__trophy ${isPerfect ? 'mission-completion-screen__trophy--perfect' : ''} ${isGPS101 ? 'mission-completion-screen__trophy--gps101' : ''}`}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
          </svg>
          {isPerfect && <span className="mission-completion-screen__perfect-badge">PERFECT!</span>}
          {completedStage && (
            <span className="mission-completion-screen__stage-complete-badge">STAGE COMPLETE!</span>
          )}
        </div>
        
        {/* Title */}
        <h1 className="mission-completion-screen__title">
          {isGPS101 ? 'GPS 101 Mission Complete!' : 'Mission Complete!'}
        </h1>
        <h2 className="mission-completion-screen__mission-name">{mission.title}</h2>
        
        {/* NEW: GPS 101 Deliverable Unlocked */}
        {isGPS101 && isStageCompleter && gps101DeliverableName && (
          <div className="mission-completion-screen__deliverable-unlock">
            <div className="mission-completion-screen__deliverable-icon">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
              </svg>
            </div>
            <div className="mission-completion-screen__deliverable-content">
              <h3>Deliverable Unlocked!</h3>
              <p>You can now work on your <strong>{gps101DeliverableName}</strong></p>
              <button
                type="button"
                onClick={() => navigate('/gps-101/deliverables')}
                className="mission-completion-screen__deliverable-btn"
              >
                View Deliverables
              </button>
            </div>
          </div>
        )}
        
        {/* NEW: Orange Beacon Unlocked */}
        {unlockedOrangeBeacon && (
          <div className="mission-completion-screen__orange-beacon">
            <div className="mission-completion-screen__beacon-icon">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/>
              </svg>
            </div>
            <h3>🎊 Orange Beacon Unlocked!</h3>
            <p>Congratulations! You've earned 5,000 Baraka and the Orange Beacon badge!</p>
          </div>
        )}
        
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
            <span className="mission-completion-screen__stat-value">
              {objectivesCompleted}/{objectivesTotal}
            </span>
            <span className="mission-completion-screen__stat-label">Objectives</span>
          </div>
        </div>
        
        {/* Rewards */}
        <div className="mission-completion-screen__rewards">
          <h3 className="mission-completion-screen__rewards-title">Rewards Earned</h3>
          <div className="mission-completion-screen__rewards-grid">
            <div className="mission-completion-screen__reward mission-completion-screen__reward--xp">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span className="mission-completion-screen__reward-value">+{xpEarned}</span>
              <span className="mission-completion-screen__reward-label">XP</span>
            </div>
            <div className="mission-completion-screen__reward mission-completion-screen__reward--baraka">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10"/>
              </svg>
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
                  {badge.icon ? (
                    <img src={badge.icon} alt={badge.name} />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                    </svg>
                  )}
                  <span>{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="mission-completion-screen__actions">
          {/* NEW: GPS 101-specific navigation */}
          {isGPS101 ? (
            <>
              {completedStage ? (
                <button
                  type="button"
                  onClick={() => navigate(`/gps-101/stage/${gps101StageNumber + 1}`)}
                  className="mission-completion-screen__btn mission-completion-screen__btn--primary"
                >
                  Next Stage
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              ) : nextMission ? (
                <button
                  type="button"
                  onClick={() => navigate(`/gps-101/stage/${gps101StageNumber}/mission/${nextMission.id}`)}
                  className="mission-completion-screen__btn mission-completion-screen__btn--primary"
                >
                  Next Mission
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate(`/gps-101/stage/${gps101StageNumber}`)}
                  className="mission-completion-screen__btn mission-completion-screen__btn--primary"
                >
                  Back to Stage {gps101StageNumber}
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate('/gps-101')}
                className="mission-completion-screen__btn mission-completion-screen__btn--secondary"
              >
                GPS 101 Overview
              </button>
            </>
          ) : (
            <>
              {nextMission && (
                <button
                  type="button"
                  onClick={onContinue}
                  className="mission-completion-screen__btn mission-completion-screen__btn--primary"
                >
                  Next Mission
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              )}
              <button
                type="button"
                onClick={onReturnToDashboard}
                className="mission-completion-screen__btn mission-completion-screen__btn--secondary"
              >
                Return to Dashboard
              </button>
            </>
          )}
        </div>
        
        {/* Share */}
        {onShareProgress && (
          <button
            type="button"
            onClick={onShareProgress}
            className="mission-completion-screen__share"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
            </svg>
            Share Progress
          </button>
        )}
      </div>
    </div>
  );
};

export default MissionCompletionScreen;