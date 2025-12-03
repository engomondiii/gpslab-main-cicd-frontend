/**
 * GPS Lab Platform - AchievementBadge Component
 * 
 * Badge for displaying achievements, milestones, and rewards.
 * 
 * @module components/common/Badge/AchievementBadge
 * @version 1.0.0
 */

import React from 'react';
import './AchievementBadge.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const ACHIEVEMENT_TIERS = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
  DIAMOND: 'diamond'
};

export const ACHIEVEMENT_CATEGORIES = {
  LEARNING: 'learning',
  COMMUNITY: 'community',
  PROJECT: 'project',
  STREAK: 'streak',
  MILESTONE: 'milestone',
  SPECIAL: 'special'
};

// Tier colors
const TIER_COLORS = {
  [ACHIEVEMENT_TIERS.BRONZE]: { primary: '#cd7f32', secondary: '#b87333' },
  [ACHIEVEMENT_TIERS.SILVER]: { primary: '#c0c0c0', secondary: '#a8a8a8' },
  [ACHIEVEMENT_TIERS.GOLD]: { primary: '#ffd700', secondary: '#ffcc00' },
  [ACHIEVEMENT_TIERS.PLATINUM]: { primary: '#e5e4e2', secondary: '#b4b4b4' },
  [ACHIEVEMENT_TIERS.DIAMOND]: { primary: '#b9f2ff', secondary: '#7df9ff' }
};

// Category icons
const CATEGORY_ICONS = {
  [ACHIEVEMENT_CATEGORIES.LEARNING]: '📚',
  [ACHIEVEMENT_CATEGORIES.COMMUNITY]: '🤝',
  [ACHIEVEMENT_CATEGORIES.PROJECT]: '🚀',
  [ACHIEVEMENT_CATEGORIES.STREAK]: '🔥',
  [ACHIEVEMENT_CATEGORIES.MILESTONE]: '🏆',
  [ACHIEVEMENT_CATEGORIES.SPECIAL]: '⭐'
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * AchievementBadge component
 * 
 * @param {Object} props - Component props
 * @param {string} props.name - Achievement name
 * @param {string} [props.description] - Achievement description
 * @param {string} [props.icon] - Custom icon (emoji or URL)
 * @param {string} [props.tier='bronze'] - Achievement tier
 * @param {string} [props.category='milestone'] - Achievement category
 * @param {boolean} [props.unlocked=true] - Unlocked state
 * @param {number} [props.progress] - Progress percentage (for locked)
 * @param {string} [props.unlockedAt] - Unlock date
 * @param {boolean} [props.compact=false] - Compact display mode
 * @param {boolean} [props.showTier=true] - Show tier indicator
 * @param {Function} [props.onClick] - Click handler
 * @param {string} [props.className] - Additional CSS classes
 */
const AchievementBadge = ({
  name,
  description,
  icon,
  tier = ACHIEVEMENT_TIERS.BRONZE,
  category = ACHIEVEMENT_CATEGORIES.MILESTONE,
  unlocked = true,
  progress,
  unlockedAt,
  compact = false,
  showTier = true,
  onClick,
  className = '',
  ...props
}) => {
  
  const tierColor = TIER_COLORS[tier] || TIER_COLORS[ACHIEVEMENT_TIERS.BRONZE];
  const categoryIcon = CATEGORY_ICONS[category] || '🏆';
  const displayIcon = icon || categoryIcon;
  
  const classNames = [
    'achievement-badge',
    `achievement-badge--${tier}`,
    `achievement-badge--${category}`,
    !unlocked && 'achievement-badge--locked',
    compact && 'achievement-badge--compact',
    onClick && 'achievement-badge--clickable',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div
      className={classNames}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{
        '--tier-primary': tierColor.primary,
        '--tier-secondary': tierColor.secondary
      }}
      {...props}
    >
      {/* Badge icon */}
      <div className="achievement-badge__icon-wrapper">
        <div className="achievement-badge__icon">
          {typeof displayIcon === 'string' && displayIcon.length <= 2 ? (
            <span className="achievement-badge__emoji">{displayIcon}</span>
          ) : (
            <img src={displayIcon} alt="" className="achievement-badge__image" />
          )}
        </div>
        
        {/* Tier ring */}
        {showTier && (
          <svg className="achievement-badge__ring" viewBox="0 0 100 100">
            <circle
              className="achievement-badge__ring-bg"
              cx="50"
              cy="50"
              r="46"
              fill="none"
              strokeWidth="4"
            />
            <circle
              className="achievement-badge__ring-fill"
              cx="50"
              cy="50"
              r="46"
              fill="none"
              strokeWidth="4"
              strokeDasharray={`${(progress || 100) * 2.89} 289`}
              transform="rotate(-90 50 50)"
            />
          </svg>
        )}
        
        {/* Lock overlay */}
        {!unlocked && (
          <div className="achievement-badge__lock">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Content */}
      {!compact && (
        <div className="achievement-badge__content">
          <h4 className="achievement-badge__name">{name}</h4>
          {description && (
            <p className="achievement-badge__description">{description}</p>
          )}
          {unlockedAt && unlocked && (
            <span className="achievement-badge__date">
              Unlocked {new Date(unlockedAt).toLocaleDateString()}
            </span>
          )}
          {!unlocked && progress !== undefined && (
            <span className="achievement-badge__progress">
              {Math.round(progress)}% complete
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default AchievementBadge;