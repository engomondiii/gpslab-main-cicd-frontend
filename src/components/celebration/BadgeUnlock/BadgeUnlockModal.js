/**
 * GPS Lab Platform - BadgeUnlockModal Component
 * GPS 101 INTEGRATION: GPS 101 badge displays with stage badges
 * 
 * Modal component for celebrating badge unlocks.
 * Features animated badge reveal, rewards display,
 * and social sharing options.
 * 
 * Integrates with:
 * - Phase 19: Economy (Baraka rewards)
 * - Phase 20: Badge System (badge data)
 * - GPS 101: Stage badges (5 total)
 * 
 * @module components/celebration/BadgeUnlock/BadgeUnlockModal
 */

import React, { useState, useEffect, useCallback } from 'react';
import BadgeAnimation, { BADGE_RARITY } from './BadgeAnimation';
import CelebrationAnimation from '../CelebrationScreen/CelebrationAnimation';
import './BadgeUnlockModal.css';

/**
 * BadgeUnlockModal Component
 */
const BadgeUnlockModal = ({
  isOpen = false,
  badge = {},
  rewards = {},
  // NEW: GPS 101 props
  isGPS101Badge = false,
  gps101StageNumber,
  gps101StageName,
  isOrangeBeacon = false,
  onClose,
  onShare,
  onViewCollection,
  showAnimation = true,
  autoClose = false,
  autoCloseDelay = 8000,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  const {
    id,
    icon = '🏅',
    name = 'Badge Unlocked',
    description = '',
    rarity = 'common',
    xpReward = 0,
    barakaReward = 0,
    earnedDate
  } = badge;
  
  const {
    baraka = barakaReward,
    xp = xpReward
  } = rewards;
  
  const rarityConfig = BADGE_RARITY[rarity] || BADGE_RARITY.common;
  
  // Handle visibility
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setShowDetails(false);
      setAnimationComplete(false);
      
      // Auto close if enabled
      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);
        return () => clearTimeout(timer);
      }
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay]);
  
  // Handle animation complete
  const handleAnimationComplete = useCallback(() => {
    setAnimationComplete(true);
    setTimeout(() => {
      setShowDetails(true);
    }, 300);
  }, []);
  
  // Handle close
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);
  
  // Handle share
  const handleShare = useCallback(() => {
    if (onShare) {
      onShare(badge);
    }
  }, [onShare, badge]);
  
  // Handle view collection
  const handleViewCollection = useCallback(() => {
    if (onViewCollection) {
      onViewCollection();
    }
    handleClose();
  }, [onViewCollection, handleClose]);
  
  if (!isVisible) return null;
  
  const classNames = [
    'badge-unlock-modal',
    isOpen ? 'badge-unlock-modal--open' : 'badge-unlock-modal--closing',
    `badge-unlock-modal--${rarity}`,
    isGPS101Badge && 'badge-unlock-modal--gps101',
    isOrangeBeacon && 'badge-unlock-modal--orange-beacon',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Celebration Animation */}
      {showAnimation && (
        <CelebrationAnimation
          type={isOrangeBeacon ? 'stars' : 'sparkle'}
          intensity={isOrangeBeacon ? 'legendary' : rarity === 'legendary' ? 'legendary' : rarity === 'epic' ? 'epic' : 'normal'}
          isActive={isOpen}
        />
      )}
      
      {/* Overlay */}
      <div className="badge-unlock-modal__overlay" onClick={handleClose} />
      
      {/* Content */}
      <div 
        className="badge-unlock-modal__content"
        style={{ '--rarity-color': isGPS101Badge ? '#667eea' : rarityConfig.color }}
      >
        {/* Close Button */}
        <button
          type="button"
          className="badge-unlock-modal__close"
          onClick={handleClose}
          aria-label="Close"
        >
          ✕
        </button>
        
        {/* Header */}
        <div className="badge-unlock-modal__header">
          <span className="badge-unlock-modal__sparkle badge-unlock-modal__sparkle--1">✨</span>
          <h2 className="badge-unlock-modal__title">
            {isOrangeBeacon ? 'Orange Beacon Unlocked!' : isGPS101Badge ? 'GPS 101 Badge Unlocked!' : 'Badge Unlocked!'}
          </h2>
          <span className="badge-unlock-modal__sparkle badge-unlock-modal__sparkle--2">✨</span>
        </div>
        
        {/* NEW: GPS 101 Context */}
        {isGPS101Badge && !isOrangeBeacon && (
          <div className="badge-unlock-modal__gps101-context">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
            </svg>
            <div>
              <span className="badge-unlock-modal__gps101-label">GPS 101 Basic</span>
              {gps101StageNumber && (
                <span className="badge-unlock-modal__gps101-stage">
                  Stage {gps101StageNumber}: {gps101StageName}
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* NEW: Orange Beacon Special Display */}
        {isOrangeBeacon && (
          <div className="badge-unlock-modal__orange-beacon">
            <div className="badge-unlock-modal__orange-beacon-glow">
              <span className="badge-unlock-modal__orange-beacon-icon">🟠</span>
            </div>
            <div className="badge-unlock-modal__orange-beacon-rays" />
            <p className="badge-unlock-modal__orange-beacon-message">
              GPS 101 Journey Complete • 5,000 Baraka Earned
            </p>
          </div>
        )}
        
        {/* Badge Animation */}
        <BadgeAnimation
          badge={badge}
          isActive={isOpen}
          onAnimationComplete={handleAnimationComplete}
          size="large"
          isGPS101={isGPS101Badge}
        />
        
        {/* Details (shown after animation) */}
        {showDetails && (
          <div className="badge-unlock-modal__details">
            {/* Description */}
            {description && (
              <p className="badge-unlock-modal__description">{description}</p>
            )}
            
            {/* Rewards */}
            {(baraka > 0 || xp > 0) && (
              <div className="badge-unlock-modal__rewards">
                <h3 className="badge-unlock-modal__rewards-title">Rewards</h3>
                <div className="badge-unlock-modal__rewards-list">
                  {baraka > 0 && (
                    <div className="badge-unlock-modal__reward">
                      <span className="badge-unlock-modal__reward-icon">🪙</span>
                      <span className="badge-unlock-modal__reward-value">+{baraka.toLocaleString()}</span>
                      <span className="badge-unlock-modal__reward-label">Baraka</span>
                    </div>
                  )}
                  {xp > 0 && (
                    <div className="badge-unlock-modal__reward">
                      <span className="badge-unlock-modal__reward-icon">⭐</span>
                      <span className="badge-unlock-modal__reward-value">+{xp.toLocaleString()}</span>
                      <span className="badge-unlock-modal__reward-label">XP</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* NEW: GPS 101 Progress (if stage badge) */}
            {isGPS101Badge && !isOrangeBeacon && gps101StageNumber && (
              <div className="badge-unlock-modal__gps101-progress">
                <div className="badge-unlock-modal__gps101-progress-info">
                  <span>Stage {gps101StageNumber} of 5 Complete</span>
                  <span>{5 - gps101StageNumber} stages remaining</span>
                </div>
                <div className="badge-unlock-modal__gps101-progress-bar">
                  <div 
                    className="badge-unlock-modal__gps101-progress-fill"
                    style={{ width: `${(gps101StageNumber / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
            
            {/* Earned Date */}
            {earnedDate && (
              <p className="badge-unlock-modal__earned">
                Earned on {new Date(earnedDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            )}
          </div>
        )}
        
        {/* Actions */}
        <div className="badge-unlock-modal__actions">
          <button
            type="button"
            className="badge-unlock-modal__continue-btn"
            onClick={handleClose}
          >
            {isOrangeBeacon ? 'Begin Your Journey!' : 'Awesome!'}
          </button>
          
          <div className="badge-unlock-modal__secondary-actions">
            <button
              type="button"
              className="badge-unlock-modal__action-btn"
              onClick={handleShare}
            >
              <span>🔗</span> Share
            </button>
            
            {onViewCollection && (
              <button
                type="button"
                className="badge-unlock-modal__action-btn"
                onClick={handleViewCollection}
              >
                <span>🏆</span> View Collection
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeUnlockModal;