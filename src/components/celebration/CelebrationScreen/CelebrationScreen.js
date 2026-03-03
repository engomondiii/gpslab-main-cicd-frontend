/**
 * GPS Lab Platform - CelebrationScreen Component
 * GPS 101 INTEGRATION: GPS 101 stage completions, Orange Beacon unlock
 * 
 * Full-screen celebration overlay for major achievements,
 * stage completions, and milestones. Displays rewards
 * earned including Baraka, PSB, XP, and badges.
 * 
 * Integrates with:
 * - Phase 18: Praise System (social celebrations)
 * - Phase 19: Baraka & PSB Economy (reward displays)
 * - Phase 20: Badge System (badge unlocks)
 * - GPS 101: Stage completions, Orange Beacon unlock
 * 
 * @module components/celebration/CelebrationScreen/CelebrationScreen
 */

import React, { useState, useEffect, useCallback } from 'react';
import CelebrationAnimation, { INTENSITY_PRESETS } from './CelebrationAnimation';
import './CelebrationScreen.css';

/**
 * Celebration types with their configurations
 */
const CELEBRATION_TYPES = {
  stageComplete: {
    title: 'Stage Complete!',
    subtitle: 'Congratulations on your progress',
    icon: '🎯',
    animationType: 'confetti',
    intensity: 'epic',
    accentColor: '#00d4ff'
  },
  // NEW: GPS 101 celebration types
  gps101StageComplete: {
    title: 'GPS 101 Stage Complete!',
    subtitle: 'Purpose discovery journey continues',
    icon: '🎓',
    animationType: 'stars',
    intensity: 'epic',
    accentColor: '#667eea'
  },
  gps101OrangeBeacon: {
    title: 'Orange Beacon Unlocked!',
    subtitle: 'GPS 101 Journey Complete',
    icon: '🟠',
    animationType: 'stars',
    intensity: 'legendary',
    accentColor: '#f39c12'
  },
  gps101CheckpointComplete: {
    title: 'GPS 101 Checkpoint Complete!',
    subtitle: 'Reflection validated',
    icon: '🏁',
    animationType: 'sparkle',
    intensity: 'normal',
    accentColor: '#667eea'
  },
  gps101DeliverableSubmitted: {
    title: 'Deliverable Submitted!',
    subtitle: 'Your work has been recorded',
    icon: '📝',
    animationType: 'sparkle',
    intensity: 'subtle',
    accentColor: '#667eea'
  },
  biteComplete: {
    title: 'Bite Complete!',
    subtitle: 'Keep up the great work',
    icon: '✅',
    animationType: 'sparkle',
    intensity: 'subtle',
    accentColor: '#2ecc71'
  },
  checkpointReached: {
    title: 'Checkpoint Reached!',
    subtitle: 'You\'ve hit a major milestone',
    icon: '🏁',
    animationType: 'confetti',
    intensity: 'normal',
    accentColor: '#8e44ad'
  },
  badgeUnlocked: {
    title: 'Badge Unlocked!',
    subtitle: 'New achievement earned',
    icon: '🏅',
    animationType: 'stars',
    intensity: 'epic',
    accentColor: '#f1c40f'
  },
  levelUp: {
    title: 'Level Up!',
    subtitle: 'You\'ve reached a new level',
    icon: '⬆️',
    animationType: 'confetti',
    intensity: 'epic',
    accentColor: '#00d4ff'
  },
  streakMilestone: {
    title: 'Streak Milestone!',
    subtitle: 'Your dedication is paying off',
    icon: '🔥',
    animationType: 'sparkle',
    intensity: 'normal',
    accentColor: '#f39c12'
  },
  praiseReceived: {
    title: 'Praise Received!',
    subtitle: 'Someone appreciated your work',
    icon: '👏',
    animationType: 'hearts',
    intensity: 'normal',
    accentColor: '#e74c3c'
  },
  projectComplete: {
    title: 'Project Complete!',
    subtitle: 'Amazing work on your project',
    icon: '🚀',
    animationType: 'confetti',
    intensity: 'legendary',
    accentColor: '#8e44ad'
  },
  adventureComplete: {
    title: 'Adventure Complete!',
    subtitle: 'You\'ve conquered this adventure',
    icon: '🏆',
    animationType: 'confetti',
    intensity: 'legendary',
    accentColor: '#f1c40f'
  },
  gpsComplete: {
    title: 'GPS Journey Complete!',
    subtitle: 'You are now a Global Problem Solver',
    icon: '🌍',
    animationType: 'stars',
    intensity: 'legendary',
    accentColor: '#00d4ff'
  }
};

/**
 * CelebrationScreen Component
 */
const CelebrationScreen = ({
  isOpen = false,
  type = 'stageComplete',
  customTitle,
  customSubtitle,
  customIcon,
  rewards = {},
  badge = null,
  // NEW: GPS 101 props
  isGPS101 = false,
  gps101StageNumber,
  gps101StageName,
  gps101DeliverableName,
  orangeBeaconUnlocked = false,
  onClose,
  onContinue,
  onShare,
  autoClose = false,
  autoCloseDelay = 5000,
  showShareButton = true,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [rewardsAnimated, setRewardsAnimated] = useState({});
  
  const config = CELEBRATION_TYPES[type] || CELEBRATION_TYPES.stageComplete;
  
  const title = customTitle || config.title;
  const subtitle = customSubtitle || config.subtitle;
  const icon = customIcon || config.icon;
  
  const {
    baraka = 0,
    psb = 0,
    xp = 0,
    streak = 0
  } = rewards;
  
  // Handle visibility transitions
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Delay rewards animation
      const rewardsTimer = setTimeout(() => {
        setShowRewards(true);
      }, 800);
      
      // Auto close if enabled
      let closeTimer;
      if (autoClose) {
        closeTimer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);
      }
      
      return () => {
        clearTimeout(rewardsTimer);
        if (closeTimer) clearTimeout(closeTimer);
      };
    } else {
      setShowRewards(false);
      setRewardsAnimated({});
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay]);
  
  // Animate reward counters
  useEffect(() => {
    if (showRewards) {
      const animateReward = (key, value, delay) => {
        setTimeout(() => {
          setRewardsAnimated((prev) => ({ ...prev, [key]: true }));
        }, delay);
      };
      
      if (baraka > 0) animateReward('baraka', baraka, 0);
      if (psb > 0) animateReward('psb', psb, 200);
      if (xp > 0) animateReward('xp', xp, 400);
      if (streak > 0) animateReward('streak', streak, 600);
    }
  }, [showRewards, baraka, psb, xp, streak]);
  
  const handleClose = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);
  
  const handleContinue = useCallback(() => {
    if (onContinue) onContinue();
    handleClose();
  }, [onContinue, handleClose]);
  
  const handleShare = useCallback(() => {
    if (onShare) {
      onShare({
        type,
        title,
        rewards,
        badge,
        isGPS101,
        gps101StageNumber,
        orangeBeaconUnlocked
      });
    }
  }, [onShare, type, title, rewards, badge, isGPS101, gps101StageNumber, orangeBeaconUnlocked]);
  
  if (!isVisible) return null;
  
  const classNames = [
    'celebration-screen',
    isOpen ? 'celebration-screen--open' : 'celebration-screen--closing',
    `celebration-screen--${type}`,
    isGPS101 && 'celebration-screen--gps101',
    orangeBeaconUnlocked && 'celebration-screen--orange-beacon',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div 
      className={classNames} 
      style={{ '--accent-color': config.accentColor }}
      {...props}
    >
      {/* Animation Layer */}
      <CelebrationAnimation
        type={config.animationType}
        intensity={config.intensity}
        isActive={isOpen}
        soundEnabled={true}
      />
      
      {/* Overlay */}
      <div className="celebration-screen__overlay" onClick={handleClose} />
      
      {/* Content */}
      <div className="celebration-screen__content">
        {/* Close Button */}
        <button
          type="button"
          className="celebration-screen__close"
          onClick={handleClose}
          aria-label="Close"
        >
          ✕
        </button>
        
        {/* NEW: GPS 101 Badge (if GPS 101 celebration) */}
        {isGPS101 && !orangeBeaconUnlocked && (
          <div className="celebration-screen__gps101-badge">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
            </svg>
            <div>
              <span className="celebration-screen__gps101-title">GPS 101 Basic</span>
              {gps101StageNumber && (
                <span className="celebration-screen__gps101-stage">Stage {gps101StageNumber}</span>
              )}
            </div>
          </div>
        )}
        
        {/* NEW: Orange Beacon Special Display */}
        {orangeBeaconUnlocked && (
          <div className="celebration-screen__orange-beacon">
            <div className="celebration-screen__orange-beacon-glow">
              <span className="celebration-screen__orange-beacon-icon">🟠</span>
            </div>
            <div className="celebration-screen__orange-beacon-rays" />
          </div>
        )}
        
        {/* Icon */}
        <div className="celebration-screen__icon-wrapper">
          <span className="celebration-screen__icon">{icon}</span>
          <div className="celebration-screen__icon-ring" />
          <div className="celebration-screen__icon-glow" />
        </div>
        
        {/* Title */}
        <h1 className="celebration-screen__title">{title}</h1>
        <p className="celebration-screen__subtitle">{subtitle}</p>
        
        {/* NEW: GPS 101 Stage/Deliverable Info */}
        {isGPS101 && (gps101StageName || gps101DeliverableName) && (
          <div className="celebration-screen__gps101-info">
            {gps101StageName && (
              <span className="celebration-screen__gps101-stage-name">{gps101StageName}</span>
            )}
            {gps101DeliverableName && (
              <span className="celebration-screen__gps101-deliverable">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6z" clipRule="evenodd"/>
                </svg>
                {gps101DeliverableName}
              </span>
            )}
          </div>
        )}
        
        {/* Badge Display (if badge unlocked) */}
        {badge && (
          <div className={`celebration-screen__badge celebration-screen__badge--${badge.rarity || 'common'} ${badge.isGPS101 ? 'celebration-screen__badge--gps101' : ''}`}>
            <span className="celebration-screen__badge-icon">{badge.icon || '🏅'}</span>
            <span className="celebration-screen__badge-name">{badge.name}</span>
            <span className="celebration-screen__badge-rarity">{badge.rarity || 'Common'}</span>
          </div>
        )}
        
        {/* Rewards */}
        {showRewards && (baraka > 0 || psb > 0 || xp > 0 || streak > 0) && (
          <div className="celebration-screen__rewards">
            <h3 className="celebration-screen__rewards-title">Rewards Earned</h3>
            <div className="celebration-screen__rewards-grid">
              {baraka > 0 && (
                <div className={`celebration-screen__reward ${rewardsAnimated.baraka ? 'celebration-screen__reward--animated' : ''}`}>
                  <span className="celebration-screen__reward-icon">🪙</span>
                  <span className="celebration-screen__reward-value">+{baraka.toLocaleString()}</span>
                  <span className="celebration-screen__reward-label">Baraka</span>
                </div>
              )}
              
              {psb > 0 && (
                <div className={`celebration-screen__reward ${rewardsAnimated.psb ? 'celebration-screen__reward--animated' : ''}`}>
                  <span className="celebration-screen__reward-icon">💎</span>
                  <span className="celebration-screen__reward-value">+{psb.toLocaleString()}</span>
                  <span className="celebration-screen__reward-label">PSB</span>
                </div>
              )}
              
              {xp > 0 && (
                <div className={`celebration-screen__reward ${rewardsAnimated.xp ? 'celebration-screen__reward--animated' : ''}`}>
                  <span className="celebration-screen__reward-icon">⭐</span>
                  <span className="celebration-screen__reward-value">+{xp.toLocaleString()}</span>
                  <span className="celebration-screen__reward-label">XP</span>
                </div>
              )}
              
              {streak > 0 && (
                <div className={`celebration-screen__reward ${rewardsAnimated.streak ? 'celebration-screen__reward--animated' : ''}`}>
                  <span className="celebration-screen__reward-icon">🔥</span>
                  <span className="celebration-screen__reward-value">{streak} days</span>
                  <span className="celebration-screen__reward-label">Streak</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* NEW: Orange Beacon Message */}
        {orangeBeaconUnlocked && (
          <div className="celebration-screen__orange-beacon-message">
            <p>You've completed all 5 GPS 101 stages and discovered your life purpose!</p>
            <p className="celebration-screen__orange-beacon-quote">
              "The two most important days in your life are the day you are born and the day you find out why."
            </p>
          </div>
        )}
        
        {/* Actions */}
        <div className="celebration-screen__actions">
          <button
            type="button"
            className="celebration-screen__continue-btn"
            onClick={handleContinue}
          >
            {orangeBeaconUnlocked ? 'Begin Your Journey' : 'Continue'}
          </button>
          
          {showShareButton && (
            <button
              type="button"
              className="celebration-screen__share-btn"
              onClick={handleShare}
            >
              <span>🔗</span> Share
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export { CELEBRATION_TYPES };
export default CelebrationScreen;