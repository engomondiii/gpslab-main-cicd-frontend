/**
 * GPS Lab Platform - UserAvatar Component
 * 
 * User-specific avatar with level, XP, and role indicators.
 * 
 * @module components/common/Avatar/UserAvatar
 * @version 1.0.0
 */

import React from 'react';
import Avatar, { AVATAR_SIZES, AVATAR_STATUS } from './Avatar';
import './UserAvatar.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const USER_ROLES = {
  LEARNER: 'learner',
  CONTRIBUTOR: 'contributor',
  LEADER: 'leader',
  MENTOR: 'mentor',
  ADMIN: 'admin'
};

// Role colors
const ROLE_COLORS = {
  [USER_ROLES.LEARNER]: '#6b7280',
  [USER_ROLES.CONTRIBUTOR]: '#2563eb',
  [USER_ROLES.LEADER]: '#16a34a',
  [USER_ROLES.MENTOR]: '#7c3aed',
  [USER_ROLES.ADMIN]: '#dc2626'
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * UserAvatar component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.user - User data
 * @param {string} [props.user.avatar] - Avatar image URL
 * @param {string} props.user.name - User name
 * @param {number} [props.user.level] - User level
 * @param {number} [props.user.xp] - Current XP
 * @param {number} [props.user.xpToNextLevel] - XP needed for next level
 * @param {string} [props.user.role] - User role
 * @param {string} [props.user.status] - Online status
 * @param {string} [props.size='md'] - Avatar size
 * @param {boolean} [props.showLevel=false] - Show level badge
 * @param {boolean} [props.showXP=false] - Show XP progress
 * @param {boolean} [props.showStatus=false] - Show online status
 * @param {boolean} [props.showRole=false] - Show role indicator
 * @param {Function} [props.onClick] - Click handler
 * @param {string} [props.className] - Additional CSS classes
 */
const UserAvatar = ({
  user,
  size = AVATAR_SIZES.MD,
  showLevel = false,
  showXP = false,
  showStatus = false,
  showRole = false,
  onClick,
  className = '',
  ...props
}) => {
  
  const {
    avatar,
    name,
    level = 1,
    xp = 0,
    xpToNextLevel = 100,
    role = USER_ROLES.LEARNER,
    status
  } = user || {};
  
  const xpProgress = xpToNextLevel > 0 ? (xp / xpToNextLevel) * 100 : 0;
  const roleColor = ROLE_COLORS[role] || ROLE_COLORS[USER_ROLES.LEARNER];
  
  const classNames = [
    'user-avatar',
    `user-avatar--${size}`,
    showXP && 'user-avatar--with-xp',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* XP ring (behind avatar) */}
      {showXP && (
        <svg className="user-avatar__xp-ring" viewBox="0 0 100 100">
          <circle
            className="user-avatar__xp-track"
            cx="50"
            cy="50"
            r="46"
            fill="none"
            strokeWidth="4"
          />
          <circle
            className="user-avatar__xp-progress"
            cx="50"
            cy="50"
            r="46"
            fill="none"
            strokeWidth="4"
            strokeDasharray={`${xpProgress * 2.89} 289`}
            transform="rotate(-90 50 50)"
          />
        </svg>
      )}
      
      {/* Avatar */}
      <Avatar
        src={avatar}
        name={name}
        size={size}
        status={status}
        showStatus={showStatus}
        onClick={onClick}
      />
      
      {/* Level badge */}
      {showLevel && (
        <span className="user-avatar__level">
          {level}
        </span>
      )}
      
      {/* Role indicator */}
      {showRole && (
        <span 
          className="user-avatar__role"
          style={{ backgroundColor: roleColor }}
          title={role}
        />
      )}
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default UserAvatar;