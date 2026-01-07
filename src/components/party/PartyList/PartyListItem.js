/**
 * GPS Lab Platform - PartyListItem Component
 * 
 * Individual party item in the party list showing party info,
 * members, and current activity status.
 * 
 * @module components/party/PartyList/PartyListItem
 */

import React from 'react';
import './PartyListItem.css';

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
 * PartyListItem Component
 */
const PartyListItem = ({
  id,
  name,
  description,
  stage = 1,
  memberCount = 0,
  maxMembers = 5,
  members = [],
  isActive = false,
  isPublic = true,
  currentQuest,
  unreadMessages = 0,
  lastActivity,
  role,
  onSelect,
  onJoin,
  variant = 'default', // default, compact, featured
  className = '',
  ...props
}) => {
  const beaconColor = getBeaconColor(stage);
  const isFull = memberCount >= maxMembers;
  
  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };
  
  const handleClick = () => {
    if (onSelect) {
      onSelect(id);
    }
  };
  
  const handleJoin = (e) => {
    e.stopPropagation();
    if (onJoin && !isFull) {
      onJoin(id);
    }
  };
  
  const classNames = [
    'party-list-item',
    `party-list-item--${variant}`,
    isActive && 'party-list-item--active',
    isFull && 'party-list-item--full',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div
      className={classNames}
      onClick={handleClick}
      style={{ '--beacon-color': beaconColor }}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleClick()}
      {...props}
    >
      {/* Beacon Indicator */}
      <div className="party-list-item__beacon">
        <span className="party-list-item__beacon-dot" />
        {isActive && <span className="party-list-item__beacon-pulse" />}
      </div>
      
      {/* Main Content */}
      <div className="party-list-item__content">
        <div className="party-list-item__header">
          <h3 className="party-list-item__name">{name}</h3>
          
          <div className="party-list-item__badges">
            {!isPublic && (
              <span className="party-list-item__badge party-list-item__badge--private">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                Private
              </span>
            )}
            {role && (
              <span className={`party-list-item__badge party-list-item__badge--role party-list-item__badge--${role.toLowerCase()}`}>
                {role}
              </span>
            )}
            {unreadMessages > 0 && (
              <span className="party-list-item__badge party-list-item__badge--unread">
                {unreadMessages > 99 ? '99+' : unreadMessages}
              </span>
            )}
          </div>
        </div>
        
        {variant !== 'compact' && description && (
          <p className="party-list-item__description">{description}</p>
        )}
        
        {/* Current Quest */}
        {currentQuest && variant !== 'compact' && (
          <div className="party-list-item__quest">
            <span className="party-list-item__quest-icon">🎯</span>
            <span className="party-list-item__quest-text">{currentQuest}</span>
          </div>
        )}
        
        {/* Footer */}
        <div className="party-list-item__footer">
          {/* Member Avatars */}
          <div className="party-list-item__members">
            <div className="party-list-item__avatars">
              {members.slice(0, 4).map((member, index) => (
                <div
                  key={member.id || index}
                  className="party-list-item__avatar"
                  style={{ 
                    backgroundImage: member.avatar ? `url(${member.avatar})` : 'none',
                    zIndex: 4 - index
                  }}
                  title={member.name}
                >
                  {!member.avatar && member.name?.charAt(0).toUpperCase()}
                </div>
              ))}
              {memberCount > 4 && (
                <div className="party-list-item__avatar party-list-item__avatar--more">
                  +{memberCount - 4}
                </div>
              )}
            </div>
            <span className="party-list-item__member-count">
              {memberCount}/{maxMembers}
            </span>
          </div>
          
          {/* Stage & Activity */}
          <div className="party-list-item__meta">
            <span className="party-list-item__stage">Stage {stage}</span>
            {lastActivity && (
              <span className="party-list-item__activity">
                {formatTimeAgo(lastActivity)}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Action */}
      {!role && onJoin && (
        <button
          type="button"
          className="party-list-item__join-btn"
          onClick={handleJoin}
          disabled={isFull}
        >
          {isFull ? 'Full' : 'Join'}
        </button>
      )}
      
      {/* Arrow */}
      {role && (
        <div className="party-list-item__arrow">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
          </svg>
        </div>
      )}
    </div>
  );
};

export default PartyListItem;