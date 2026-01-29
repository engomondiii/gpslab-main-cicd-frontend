/**
 * GPS Lab Platform - MilestoneModal Component
 * 
 * Modal for celebrating milestones such as stage completions,
 * checkpoint achievements, adventure completions, and more.
 * 
 * Integrates with:
 * - Phase 15: Party System (party milestone sharing)
 * - Phase 19: Economy (Baraka/PSB/XP rewards)
 * - Phase 20: Badge System (milestone badges)
 * 
 * @module components/celebration/MilestoneReached/MilestoneModal
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import CelebrationAnimation from '../CelebrationScreen/CelebrationAnimation';
import './MilestoneModal.css';

/**
 * Milestone types with their configurations
 */
const MILESTONE_TYPES = {
  stageComplete: {
    icon: '🎯',
    title: 'Stage Complete!',
    animationType: 'confetti',
    intensity: 'epic',
    color: '#00d4ff'
  },
  checkpointReached: {
    icon: '🏁',
    title: 'Checkpoint Reached!',
    animationType: 'confetti',
    intensity: 'normal',
    color: '#8e44ad'
  },
  adventureComplete: {
    icon: '🏆',
    title: 'Adventure Complete!',
    animationType: 'stars',
    intensity: 'legendary',
    color: '#f1c40f'
  },
  streakMilestone: {
    icon: '🔥',
    title: 'Streak Milestone!',
    animationType: 'sparkle',
    intensity: 'normal',
    color: '#f39c12'
  },
  levelUp: {
    icon: '⬆️',
    title: 'Level Up!',
    animationType: 'confetti',
    intensity: 'epic',
    color: '#00d4ff'
  },
  projectComplete: {
    icon: '🚀',
    title: 'Project Complete!',
    animationType: 'stars',
    intensity: 'epic',
    color: '#8e44ad'
  },
  gpsComplete: {
    icon: '🌍',
    title: 'GPS Journey Complete!',
    subtitle: 'You are now a Global Problem Solver',
    animationType: 'stars',
    intensity: 'legendary',
    color: '#00d4ff'
  },
  firstBite: {
    icon: '🍎',
    title: 'First Bite Complete!',
    animationType: 'sparkle',
    intensity: 'subtle',
    color: '#2ecc71'
  },
  perfectScore: {
    icon: '💯',
    title: 'Perfect Score!',
    animationType: 'sparkle',
    intensity: 'normal',
    color: '#2ecc71'
  }
};

/**
 * Stage titles matching Phase 20 ProfileHeader
 */
const STAGE_TITLES = {
  1: 'Novice', 5: 'Novice',
  6: 'Apprentice', 10: 'Apprentice',
  11: 'Rising Analyst', 15: 'Rising Analyst',
  16: 'Skilled Strategist', 20: 'Skilled Strategist',
  21: 'Expert Navigator', 25: 'Expert Navigator',
  26: 'Master Innovator', 30: 'Master Innovator',
  31: 'Global Problem Solver', 35: 'Global Problem Solver'
};

/**
 * Get stage title based on stage number
 */
const getStageTitle = (stage) => {
  const ranges = [
    [1, 5, 'Novice'],
    [6, 10, 'Apprentice'],
    [11, 15, 'Rising Analyst'],
    [16, 20, 'Skilled Strategist'],
    [21, 25, 'Expert Navigator'],
    [26, 30, 'Master Innovator'],
    [31, 35, 'Global Problem Solver']
  ];
  
  for (const [min, max, title] of ranges) {
    if (stage >= min && stage <= max) return title;
  }
  return 'Explorer';
};

/**
 * Adventure names for GPS curriculum
 */
const ADVENTURE_NAMES = {
  1: 'The Foundation',
  2: 'Problem Discovery',
  3: 'Research & Analysis',
  4: 'Solution Design',
  5: 'Implementation',
  6: 'Impact Measurement',
  7: 'Global Scale'
};

/**
 * MilestoneModal Component
 */
const MilestoneModal = ({
  isOpen = false,
  type = 'stageComplete',
  milestone = {},
  rewards = {},
  unlockedBadges = [],
  nextMilestone = null,
  onClose,
  onContinue,
  onShare,
  onViewBadges,
  showAnimation = true,
  autoClose = false,
  autoCloseDelay = 10000,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  
  const {
    stage,
    checkpoint,
    adventure,
    streakDays,
    level,
    projectName,
    customTitle,
    customSubtitle
  } = milestone;
  
  const {
    baraka = 0,
    psb = 0,
    xp = 0
  } = rewards;
  
  const config = MILESTONE_TYPES[type] || MILESTONE_TYPES.stageComplete;
  
  // Determine title and subtitle
  const milestoneTitle = useMemo(() => {
    if (customTitle) return customTitle;
    if (type === 'stageComplete' && stage) return `Stage ${stage} Complete!`;
    if (type === 'checkpointReached' && checkpoint) return `Checkpoint ${checkpoint} Reached!`;
    if (type === 'adventureComplete' && adventure) return `${ADVENTURE_NAMES[adventure] || `Adventure ${adventure}`} Complete!`;
    if (type === 'streakMilestone' && streakDays) return `${streakDays} Day Streak!`;
    if (type === 'levelUp' && level) return `Level ${level} Reached!`;
    if (type === 'projectComplete' && projectName) return 'Project Complete!';
    return config.title;
  }, [type, stage, checkpoint, adventure, streakDays, level, projectName, customTitle, config]);
  
  const milestoneSubtitle = useMemo(() => {
    if (customSubtitle) return customSubtitle;
    if (type === 'stageComplete' && stage) return `You are now a ${getStageTitle(stage)}`;
    if (type === 'adventureComplete' && adventure) return config.subtitle || 'You\'ve conquered this adventure';
    if (type === 'projectComplete' && projectName) return projectName;
    if (type === 'gpsComplete') return config.subtitle;
    return '';
  }, [type, stage, adventure, projectName, customSubtitle, config]);
  
  // Handle visibility
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setShowRewards(false);
      setShowProgress(false);
      
      // Delayed rewards reveal
      const rewardsTimer = setTimeout(() => setShowRewards(true), 1000);
      const progressTimer = setTimeout(() => setShowProgress(true), 1500);
      
      // Auto close
      let closeTimer;
      if (autoClose) {
        closeTimer = setTimeout(() => handleClose(), autoCloseDelay);
      }
      
      return () => {
        clearTimeout(rewardsTimer);
        clearTimeout(progressTimer);
        if (closeTimer) clearTimeout(closeTimer);
      };
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay]);
  
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
        milestone,
        rewards,
        title: milestoneTitle
      });
    }
  }, [onShare, type, milestone, rewards, milestoneTitle]);
  
  if (!isVisible) return null;
  
  const classNames = [
    'milestone-modal',
    isOpen ? 'milestone-modal--open' : 'milestone-modal--closing',
    `milestone-modal--${type}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div 
      className={classNames}
      style={{ '--milestone-color': config.color }}
      {...props}
    >
      {/* Celebration Animation */}
      {showAnimation && (
        <CelebrationAnimation
          type={config.animationType}
          intensity={config.intensity}
          isActive={isOpen}
        />
      )}
      
      {/* Overlay */}
      <div className="milestone-modal__overlay" onClick={handleClose} />
      
      {/* Content */}
      <div className="milestone-modal__content">
        {/* Close Button */}
        <button
          type="button"
          className="milestone-modal__close"
          onClick={handleClose}
        >
          ✕
        </button>
        
        {/* Icon */}
        <div className="milestone-modal__icon-wrapper">
          <span className="milestone-modal__icon">{config.icon}</span>
          <div className="milestone-modal__icon-glow" />
          <div className="milestone-modal__icon-ring" />
        </div>
        
        {/* Title */}
        <h1 className="milestone-modal__title">{milestoneTitle}</h1>
        {milestoneSubtitle && (
          <p className="milestone-modal__subtitle">{milestoneSubtitle}</p>
        )}
        
        {/* Rewards */}
        {showRewards && (baraka > 0 || psb > 0 || xp > 0) && (
          <div className="milestone-modal__rewards">
            <h3 className="milestone-modal__rewards-title">Rewards Earned</h3>
            <div className="milestone-modal__rewards-grid">
              {baraka > 0 && (
                <div className="milestone-modal__reward milestone-modal__reward--baraka">
                  <span className="milestone-modal__reward-icon">🪙</span>
                  <span className="milestone-modal__reward-value">+{baraka.toLocaleString()}</span>
                  <span className="milestone-modal__reward-label">Baraka</span>
                </div>
              )}
              {psb > 0 && (
                <div className="milestone-modal__reward milestone-modal__reward--psb">
                  <span className="milestone-modal__reward-icon">💎</span>
                  <span className="milestone-modal__reward-value">+{psb.toLocaleString()}</span>
                  <span className="milestone-modal__reward-label">PSB</span>
                </div>
              )}
              {xp > 0 && (
                <div className="milestone-modal__reward milestone-modal__reward--xp">
                  <span className="milestone-modal__reward-icon">⭐</span>
                  <span className="milestone-modal__reward-value">+{xp.toLocaleString()}</span>
                  <span className="milestone-modal__reward-label">XP</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Unlocked Badges */}
        {unlockedBadges.length > 0 && (
          <div className="milestone-modal__badges">
            <h3 className="milestone-modal__badges-title">Badges Unlocked</h3>
            <div className="milestone-modal__badges-grid">
              {unlockedBadges.slice(0, 3).map((badge, i) => (
                <div 
                  key={badge.id || i}
                  className={`milestone-modal__badge milestone-modal__badge--${badge.rarity || 'common'}`}
                >
                  <span className="milestone-modal__badge-icon">{badge.icon || '🏅'}</span>
                  <span className="milestone-modal__badge-name">{badge.name}</span>
                </div>
              ))}
            </div>
            {unlockedBadges.length > 3 && (
              <button
                type="button"
                className="milestone-modal__view-badges"
                onClick={onViewBadges}
              >
                +{unlockedBadges.length - 3} more badges
              </button>
            )}
          </div>
        )}
        
        {/* Next Milestone Progress */}
        {showProgress && nextMilestone && (
          <div className="milestone-modal__next">
            <h3 className="milestone-modal__next-title">Next Up</h3>
            <div className="milestone-modal__next-content">
              <span className="milestone-modal__next-icon">{nextMilestone.icon || '🎯'}</span>
              <div className="milestone-modal__next-info">
                <span className="milestone-modal__next-name">{nextMilestone.name}</span>
                <div className="milestone-modal__progress-bar">
                  <div 
                    className="milestone-modal__progress-fill"
                    style={{ width: `${nextMilestone.progress || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="milestone-modal__actions">
          <button
            type="button"
            className="milestone-modal__continue-btn"
            onClick={handleContinue}
          >
            {nextMilestone ? 'Continue Journey' : 'Awesome!'}
          </button>
          
          <button
            type="button"
            className="milestone-modal__share-btn"
            onClick={handleShare}
          >
            <span>🔗</span> Share
          </button>
        </div>
      </div>
    </div>
  );
};

export { MILESTONE_TYPES, ADVENTURE_NAMES, getStageTitle };
export default MilestoneModal;