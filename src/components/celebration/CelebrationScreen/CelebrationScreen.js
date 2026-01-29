/**
 * GPS Lab Platform - CelebrationScreen Component
 * 
 * Full-screen celebration overlay for major achievements,
 * stage completions, and milestones. Displays rewards
 * earned including Baraka, PSB, XP, and badges.
 * 
 * Integrates with:
 * - Phase 18: Praise System (social celebrations)
 * - Phase 19: Baraka & PSB Economy (reward displays)
 * - Phase 20: Badge System (badge unlocks)
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
        badge
      });
    }
  }, [onShare, type, title, rewards, badge]);
  
  if (!isVisible) return null;
  
  const classNames = [
    'celebration-screen',
    isOpen ? 'celebration-screen--open' : 'celebration-screen--closing',
    `celebration-screen--${type}`,
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
        
        {/* Icon */}
        <div className="celebration-screen__icon-wrapper">
          <span className="celebration-screen__icon">{icon}</span>
          <div className="celebration-screen__icon-ring" />
          <div className="celebration-screen__icon-glow" />
        </div>
        
        {/* Title */}
        <h1 className="celebration-screen__title">{title}</h1>
        <p className="celebration-screen__subtitle">{subtitle}</p>
        
        {/* Badge Display (if badge unlocked) */}
        {badge && (
          <div className={`celebration-screen__badge celebration-screen__badge--${badge.rarity || 'common'}`}>
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
        
        {/* Actions */}
        <div className="celebration-screen__actions">
          <button
            type="button"
            className="celebration-screen__continue-btn"
            onClick={handleContinue}
          >
            Continue
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