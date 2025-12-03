/**
 * GPS Lab Platform - PartyCard Component
 * 
 * Specialized card for displaying study parties/groups
 * with member info and activity status.
 * 
 * @module components/common/Card/PartyCard
 * @version 1.0.0
 */

import React from 'react';
import Card from './Card';
import './PartyCard.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const PARTY_TYPE = {
  STUDY_GROUP: 'study-group',
  PROJECT_TEAM: 'project-team',
  ACCOUNTABILITY: 'accountability',
  MENTOR_GROUP: 'mentor-group'
};

export const PARTY_VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  INVITE_ONLY: 'invite-only'
};

// Type info with icons
const PARTY_TYPE_INFO = {
  [PARTY_TYPE.STUDY_GROUP]: {
    icon: '📖',
    label: 'Study Group',
    color: 'primary'
  },
  [PARTY_TYPE.PROJECT_TEAM]: {
    icon: '🚀',
    label: 'Project Team',
    color: 'success'
  },
  [PARTY_TYPE.ACCOUNTABILITY]: {
    icon: '🎯',
    label: 'Accountability',
    color: 'warning'
  },
  [PARTY_TYPE.MENTOR_GROUP]: {
    icon: '🦉',
    label: 'Mentor Group',
    color: 'purple'
  }
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * PartyCard component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.party - Party data
 * @param {string} props.party.id - Party ID
 * @param {string} props.party.name - Party name
 * @param {string} props.party.description - Party description
 * @param {string} props.party.type - Party type
 * @param {string} props.party.visibility - Party visibility
 * @param {Array} props.party.members - Party members
 * @param {number} props.party.maxMembers - Maximum members
 * @param {string} [props.party.focusStage] - Current focus stage
 * @param {string} [props.party.focusMission] - Current focus mission
 * @param {boolean} [props.party.isActive] - Has active members
 * @param {number} [props.party.activeMembers] - Active members count
 * @param {string} [props.party.lastActivity] - Last activity timestamp
 * @param {string} [props.party.thumbnail] - Party thumbnail
 * @param {boolean} [props.compact=false] - Compact display mode
 * @param {boolean} [props.showJoinButton=false] - Show join button
 * @param {Function} [props.onClick] - Click handler
 * @param {Function} [props.onJoin] - Join handler
 */
const PartyCard = ({
  party,
  compact = false,
  showJoinButton = false,
  className = '',
  onClick,
  onJoin,
  ...props
}) => {
  
  const {
    id,
    name,
    description,
    type = PARTY_TYPE.STUDY_GROUP,
    visibility = PARTY_VISIBILITY.PUBLIC,
    members = [],
    maxMembers = 8,
    focusStage,
    focusMission,
    isActive = false,
    activeMembers = 0,
    lastActivity,
    thumbnail
  } = party;
  
  const typeInfo = PARTY_TYPE_INFO[type];
  const isFull = members.length >= maxMembers;
  const spotsLeft = maxMembers - members.length;
  
  // Format last activity
  const formatLastActivity = (timestamp) => {
    if (!timestamp) return null;
    
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };
  
  // Handle join button click
  const handleJoin = (e) => {
    e.stopPropagation();
    onJoin?.(party);
  };
  
  // Build class names
  const classNames = [
    'party-card',
    `party-card--${type}`,
    isActive && 'party-card--active',
    isFull && 'party-card--full',
    compact && 'party-card--compact',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <Card
      variant="outlined"
      padding={compact ? 'sm' : 'md'}
      clickable={!!onClick}
      className={classNames}
      onClick={() => onClick?.(party)}
      {...props}
    >
      <div className="party-card__content">
        {/* Header */}
        <div className="party-card__header">
          {/* Type badge */}
          <div className={`party-card__type party-card__type--${typeInfo.color}`}>
            <span className="party-card__type-icon">{typeInfo.icon}</span>
            {!compact && (
              <span className="party-card__type-label">{typeInfo.label}</span>
            )}
          </div>
          
          {/* Activity indicator */}
          {isActive && (
            <div className="party-card__activity-indicator">
              <span className="party-card__activity-dot" />
              <span className="party-card__activity-count">
                {activeMembers} active
              </span>
            </div>
          )}
          
          {/* Visibility badge */}
          {visibility !== PARTY_VISIBILITY.PUBLIC && (
            <span className={`party-card__visibility party-card__visibility--${visibility}`}>
              {visibility === PARTY_VISIBILITY.PRIVATE && (
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              )}
              {visibility === PARTY_VISIBILITY.INVITE_ONLY && (
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              )}
            </span>
          )}
        </div>
        
        {/* Name */}
        <h3 className="party-card__name">{name}</h3>
        
        {/* Description */}
        {!compact && description && (
          <p className="party-card__description">{description}</p>
        )}
        
        {/* Focus info */}
        {(focusStage || focusMission) && (
          <div className="party-card__focus">
            {focusStage && (
              <span className="party-card__focus-item">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                </svg>
                Stage {focusStage}
              </span>
            )}
            {focusMission && (
              <span className="party-card__focus-item">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                {focusMission}
              </span>
            )}
          </div>
        )}
        
        {/* Members */}
        <div className="party-card__members">
          <div className="party-card__members-avatars">
            {members.slice(0, 5).map((member, index) => (
              <div 
                key={member.id || index}
                className={`party-card__member-avatar ${
                  member.isOnline ? 'party-card__member-avatar--online' : ''
                }`}
                title={member.name}
              >
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} />
                ) : (
                  <span>{member.name?.charAt(0) || '?'}</span>
                )}
              </div>
            ))}
            {members.length > 5 && (
              <div className="party-card__members-more">
                +{members.length - 5}
              </div>
            )}
          </div>
          
          <div className="party-card__members-info">
            <span className="party-card__members-count">
              {members.length}/{maxMembers} members
            </span>
            {!isFull && spotsLeft <= 3 && (
              <span className="party-card__spots-left">
                {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left
              </span>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="party-card__footer">
          {/* Last activity */}
          {lastActivity && (
            <span className="party-card__last-activity">
              Last active: {formatLastActivity(lastActivity)}
            </span>
          )}
          
          {/* Join button */}
          {showJoinButton && !isFull && visibility === PARTY_VISIBILITY.PUBLIC && (
            <button 
              className="party-card__join-btn"
              onClick={handleJoin}
            >
              Join Party
            </button>
          )}
          
          {/* Full indicator */}
          {isFull && (
            <span className="party-card__full-badge">Full</span>
          )}
        </div>
      </div>
    </Card>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default PartyCard;