/**
 * GPS Lab Platform - PraiseItem Component
 * 
 * Individual praise card showing sender, recipient,
 * message, and any awarded badges.
 * 
 * @module components/praise/PraiseFeed/PraiseItem
 */

import React, { useState, useCallback } from 'react';
import './PraiseItem.css';

/**
 * Format relative time
 */
const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

/**
 * Get beacon color for stage
 */
const getBeaconColor = (stage) => {
  const colors = {
    1: 'var(--beacon-red, #e74c3c)',
    2: 'var(--beacon-orange, #f39c12)',
    3: 'var(--beacon-yellow, #f1c40f)',
    4: 'var(--beacon-green, #2ecc71)',
    5: 'var(--beacon-blue, #3498db)',
    6: 'var(--beacon-indigo, #9b59b6)',
    7: 'var(--beacon-purple, #8e44ad)'
  };
  return colors[stage] || 'var(--gps-primary, #00d4ff)';
};

/**
 * PraiseItem Component
 */
const PraiseItem = ({
  praise,
  currentUserId,
  onReact,
  onShare,
  onUserClick,
  variant = 'default', // default, compact, featured
  className = '',
  ...props
}) => {
  const [hasReacted, setHasReacted] = useState(praise?.hasReacted || false);
  const [reactCount, setReactCount] = useState(praise?.reactions || 0);
  const [showFullMessage, setShowFullMessage] = useState(false);
  
  if (!praise) return null;
  
  const {
    id,
    sender = {},
    recipient = {},
    message,
    emoji = '🎉',
    badge = null,
    timestamp,
    isPublic = true
  } = praise;
  
  const senderBeaconColor = getBeaconColor(sender.stage);
  const recipientBeaconColor = getBeaconColor(recipient.stage);
  const isOwnPraise = currentUserId === sender.id || currentUserId === recipient.id;
  
  const handleReact = useCallback(() => {
    if (hasReacted) {
      setReactCount(prev => Math.max(0, prev - 1));
    } else {
      setReactCount(prev => prev + 1);
    }
    setHasReacted(!hasReacted);
    
    if (onReact) {
      onReact(id, !hasReacted);
    }
  }, [id, hasReacted, onReact]);
  
  const handleUserClick = useCallback((user, e) => {
    e.stopPropagation();
    if (onUserClick) {
      onUserClick(user);
    }
  }, [onUserClick]);
  
  const handleShare = useCallback(() => {
    if (onShare) {
      onShare(praise);
    }
  }, [praise, onShare]);
  
  const isLongMessage = message && message.length > 150;
  const displayMessage = isLongMessage && !showFullMessage 
    ? message.slice(0, 150) + '...' 
    : message;
  
  const classNames = [
    'praise-item',
    `praise-item--${variant}`,
    isOwnPraise && 'praise-item--own',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <article className={classNames} {...props}>
      {/* Emoji Header */}
      <div className="praise-item__emoji-header">
        <span className="praise-item__main-emoji">{emoji}</span>
      </div>
      
      {/* Users */}
      <div className="praise-item__users">
        {/* Sender */}
        <button
          type="button"
          className="praise-item__user praise-item__user--sender"
          onClick={(e) => handleUserClick(sender, e)}
          style={{ '--user-color': senderBeaconColor }}
        >
          <div className="praise-item__avatar">
            {sender.avatar ? (
              <img src={sender.avatar} alt={sender.name} />
            ) : (
              <span className="praise-item__avatar-initial">
                {sender.name?.charAt(0) || '?'}
              </span>
            )}
          </div>
          <span className="praise-item__user-name">{sender.name || 'Anonymous'}</span>
        </button>
        
        {/* Arrow */}
        <span className="praise-item__arrow">→</span>
        
        {/* Recipient */}
        <button
          type="button"
          className="praise-item__user praise-item__user--recipient"
          onClick={(e) => handleUserClick(recipient, e)}
          style={{ '--user-color': recipientBeaconColor }}
        >
          <div className="praise-item__avatar">
            {recipient.avatar ? (
              <img src={recipient.avatar} alt={recipient.name} />
            ) : (
              <span className="praise-item__avatar-initial">
                {recipient.name?.charAt(0) || '?'}
              </span>
            )}
          </div>
          <span className="praise-item__user-name">{recipient.name || 'Anonymous'}</span>
        </button>
      </div>
      
      {/* Message */}
      <div className="praise-item__message">
        <p className="praise-item__message-text">{displayMessage}</p>
        {isLongMessage && (
          <button
            type="button"
            className="praise-item__read-more"
            onClick={() => setShowFullMessage(!showFullMessage)}
          >
            {showFullMessage ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
      
      {/* Badge */}
      {badge && (
        <div className="praise-item__badge">
          <span className="praise-item__badge-emoji">{badge.emoji}</span>
          <span className="praise-item__badge-label">{badge.label}</span>
        </div>
      )}
      
      {/* Footer */}
      <footer className="praise-item__footer">
        <span className="praise-item__time">{formatRelativeTime(timestamp)}</span>
        
        <div className="praise-item__actions">
          {/* React */}
          <button
            type="button"
            className={`praise-item__action ${hasReacted ? 'praise-item__action--active' : ''}`}
            onClick={handleReact}
          >
            <span className="praise-item__action-icon">{hasReacted ? '❤️' : '🤍'}</span>
            {reactCount > 0 && (
              <span className="praise-item__action-count">{reactCount}</span>
            )}
          </button>
          
          {/* Share */}
          <button
            type="button"
            className="praise-item__action"
            onClick={handleShare}
            title="Share"
          >
            <span className="praise-item__action-icon">🔗</span>
          </button>
        </div>
      </footer>
      
      {/* Private Indicator */}
      {!isPublic && (
        <div className="praise-item__private">
          <span className="praise-item__private-icon">🔒</span>
          <span className="praise-item__private-text">Private</span>
        </div>
      )}
    </article>
  );
};

export default PraiseItem;