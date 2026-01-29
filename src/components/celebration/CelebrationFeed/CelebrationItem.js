/**
 * GPS Lab Platform - CelebrationItem Component
 * 
 * Individual celebration/activity item for the feed.
 * Shows user achievements, completions, and social interactions.
 * 
 * Integrates with:
 * - Phase 18: Praise System (praise celebrations)
 * - Phase 19: Economy (Baraka/PSB earnings)
 * - Phase 20: Badges/Profile
 * 
 * @module components/celebration/CelebrationFeed/CelebrationItem
 */

import React, { useState, useCallback } from 'react';
import './CelebrationItem.css';

/**
 * Celebration item types with their visual configurations
 */
const ITEM_TYPES = {
  stageComplete: {
    icon: '🎯',
    label: 'completed a stage',
    color: '#00d4ff',
    category: 'progress'
  },
  biteComplete: {
    icon: '✅',
    label: 'completed a bite',
    color: '#2ecc71',
    category: 'progress'
  },
  checkpointReached: {
    icon: '🏁',
    label: 'reached a checkpoint',
    color: '#8e44ad',
    category: 'milestone'
  },
  badgeUnlocked: {
    icon: '🏅',
    label: 'unlocked a badge',
    color: '#f1c40f',
    category: 'achievement'
  },
  levelUp: {
    icon: '⬆️',
    label: 'leveled up',
    color: '#00d4ff',
    category: 'progress'
  },
  streakMilestone: {
    icon: '🔥',
    label: 'hit a streak milestone',
    color: '#f39c12',
    category: 'milestone'
  },
  praiseGiven: {
    icon: '👏',
    label: 'praised',
    color: '#e74c3c',
    category: 'social'
  },
  praiseReceived: {
    icon: '💖',
    label: 'received praise from',
    color: '#e74c3c',
    category: 'social'
  },
  projectComplete: {
    icon: '🚀',
    label: 'completed a project',
    color: '#8e44ad',
    category: 'achievement'
  },
  joinedParty: {
    icon: '🎉',
    label: 'joined a party',
    color: '#f1c40f',
    category: 'social'
  },
  portfolioAdded: {
    icon: '📁',
    label: 'added to portfolio',
    color: '#00d4ff',
    category: 'achievement'
  },
  barakaEarned: {
    icon: '🪙',
    label: 'earned Baraka',
    color: '#f1c40f',
    category: 'economy'
  },
  psbEarned: {
    icon: '💎',
    label: 'earned PSB',
    color: '#8e44ad',
    category: 'economy'
  },
  adventureComplete: {
    icon: '🏆',
    label: 'completed an adventure',
    color: '#f1c40f',
    category: 'milestone'
  }
};

/**
 * Format relative time
 */
const formatTimeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  
  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffWeek < 4) return `${diffWeek}w ago`;
  return past.toLocaleDateString();
};

/**
 * CelebrationItem Component
 */
const CelebrationItem = ({
  item = {},
  onUserClick,
  onItemClick,
  onPraise,
  onShare,
  currentUserId,
  variant = 'default', // default, compact, expanded
  showActions = true,
  className = '',
  ...props
}) => {
  const [isPraised, setIsPraised] = useState(item.isPraisedByCurrentUser || false);
  const [praiseCount, setPraiseCount] = useState(item.praiseCount || 0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const {
    id,
    type,
    user = {},
    target = {},
    details = {},
    timestamp,
    message
  } = item;
  
  const typeConfig = ITEM_TYPES[type] || ITEM_TYPES.stageComplete;
  
  // Handle praise
  const handlePraise = useCallback((e) => {
    e.stopPropagation();
    const newPraisedState = !isPraised;
    setIsPraised(newPraisedState);
    setPraiseCount((prev) => newPraisedState ? prev + 1 : prev - 1);
    if (onPraise) {
      onPraise(item, newPraisedState);
    }
  }, [isPraised, item, onPraise]);
  
  // Handle share
  const handleShare = useCallback((e) => {
    e.stopPropagation();
    if (onShare) {
      onShare(item);
    }
  }, [item, onShare]);
  
  // Handle user click
  const handleUserClick = useCallback((e, targetUser) => {
    e.stopPropagation();
    if (onUserClick) {
      onUserClick(targetUser);
    }
  }, [onUserClick]);
  
  // Handle item click
  const handleItemClick = useCallback(() => {
    if (variant === 'default') {
      setIsExpanded(!isExpanded);
    }
    if (onItemClick) {
      onItemClick(item);
    }
  }, [variant, isExpanded, item, onItemClick]);
  
  // Build description based on type
  const buildDescription = () => {
    switch (type) {
      case 'stageComplete':
        return (
          <>
            <span className="celebration-item__action">{typeConfig.label}</span>
            {details.stageName && (
              <span className="celebration-item__detail"> - {details.stageName}</span>
            )}
          </>
        );
        
      case 'badgeUnlocked':
        return (
          <>
            <span className="celebration-item__action">{typeConfig.label}</span>
            {details.badgeName && (
              <span className="celebration-item__badge-name">
                <span className="celebration-item__badge-icon">{details.badgeIcon || '🏅'}</span>
                {details.badgeName}
              </span>
            )}
          </>
        );
        
      case 'praiseGiven':
        return (
          <>
            <span className="celebration-item__action">{typeConfig.label}</span>
            {target.displayName && (
              <button
                className="celebration-item__user-link"
                onClick={(e) => handleUserClick(e, target)}
              >
                @{target.username || target.displayName}
              </button>
            )}
          </>
        );
        
      case 'praiseReceived':
        return (
          <>
            <span className="celebration-item__action">{typeConfig.label}</span>
            {target.displayName && (
              <button
                className="celebration-item__user-link"
                onClick={(e) => handleUserClick(e, target)}
              >
                @{target.username || target.displayName}
              </button>
            )}
          </>
        );
        
      case 'barakaEarned':
      case 'psbEarned':
        return (
          <>
            <span className="celebration-item__action">{typeConfig.label}</span>
            {details.amount && (
              <span className="celebration-item__amount">+{details.amount.toLocaleString()}</span>
            )}
          </>
        );
        
      case 'joinedParty':
        return (
          <>
            <span className="celebration-item__action">{typeConfig.label}</span>
            {details.partyName && (
              <span className="celebration-item__detail"> - {details.partyName}</span>
            )}
          </>
        );
        
      default:
        return <span className="celebration-item__action">{typeConfig.label}</span>;
    }
  };
  
  const classNames = [
    'celebration-item',
    `celebration-item--${variant}`,
    `celebration-item--${typeConfig.category}`,
    isExpanded && 'celebration-item--expanded',
    className
  ].filter(Boolean).join(' ');
  
  // Compact variant
  if (variant === 'compact') {
    return (
      <article 
        className={classNames}
        style={{ '--item-color': typeConfig.color }}
        onClick={handleItemClick}
        {...props}
      >
        <span className="celebration-item__icon">{typeConfig.icon}</span>
        <div className="celebration-item__compact-content">
          <span className="celebration-item__user-name">{user.displayName}</span>
          <span className="celebration-item__text">{typeConfig.label}</span>
        </div>
        <span className="celebration-item__time">{formatTimeAgo(timestamp)}</span>
      </article>
    );
  }
  
  return (
    <article 
      className={classNames}
      style={{ '--item-color': typeConfig.color }}
      onClick={handleItemClick}
      {...props}
    >
      {/* User Avatar */}
      <button
        className="celebration-item__avatar"
        onClick={(e) => handleUserClick(e, user)}
      >
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.displayName} />
        ) : (
          <span className="celebration-item__avatar-placeholder">
            {user.displayName?.charAt(0).toUpperCase() || '?'}
          </span>
        )}
        <span className="celebration-item__type-indicator">
          {typeConfig.icon}
        </span>
      </button>
      
      {/* Content */}
      <div className="celebration-item__content">
        <div className="celebration-item__header">
          <button
            className="celebration-item__user-name"
            onClick={(e) => handleUserClick(e, user)}
          >
            {user.displayName}
          </button>
          <span className="celebration-item__time">
            {formatTimeAgo(timestamp)}
          </span>
        </div>
        
        <p className="celebration-item__description">
          {buildDescription()}
        </p>
        
        {/* Custom message */}
        {message && (
          <p className="celebration-item__message">"{message}"</p>
        )}
        
        {/* Expanded details */}
        {isExpanded && details && (
          <div className="celebration-item__details">
            {details.rewards && (
              <div className="celebration-item__rewards">
                {details.rewards.baraka > 0 && (
                  <span className="celebration-item__reward">
                    🪙 +{details.rewards.baraka}
                  </span>
                )}
                {details.rewards.xp > 0 && (
                  <span className="celebration-item__reward">
                    ⭐ +{details.rewards.xp}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Actions */}
        {showActions && (
          <div className="celebration-item__actions">
            <button
              type="button"
              className={`celebration-item__action-btn ${isPraised ? 'celebration-item__action-btn--active' : ''}`}
              onClick={handlePraise}
              disabled={user.id === currentUserId}
            >
              <span>{isPraised ? '❤️' : '🤍'}</span>
              {praiseCount > 0 && (
                <span className="celebration-item__action-count">{praiseCount}</span>
              )}
            </button>
            
            <button
              type="button"
              className="celebration-item__action-btn"
              onClick={handleShare}
            >
              <span>🔗</span>
              Share
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export { ITEM_TYPES, formatTimeAgo };
export default CelebrationItem;