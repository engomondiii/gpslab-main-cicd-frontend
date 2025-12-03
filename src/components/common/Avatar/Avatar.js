/**
 * GPS Lab Platform - Avatar Component
 * 
 * User and character avatar component with various sizes and states.
 * 
 * @module components/common/Avatar/Avatar
 * @version 1.0.0
 */

import React from 'react';
import './Avatar.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const AVATAR_SIZES = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
  XXL: 'xxl'
};

export const AVATAR_SHAPES = {
  CIRCLE: 'circle',
  SQUARE: 'square',
  ROUNDED: 'rounded'
};

export const AVATAR_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  AWAY: 'away',
  BUSY: 'busy'
};

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Generate initials from name
 */
const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Generate color from string
 */
const stringToColor = (str) => {
  if (!str) return '#6b7280';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    '#2563eb', '#16a34a', '#dc2626', '#f59e0b', 
    '#7c3aed', '#ec4899', '#0891b2', '#059669'
  ];
  return colors[Math.abs(hash) % colors.length];
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Avatar component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.src] - Image source URL
 * @param {string} [props.alt] - Alt text
 * @param {string} [props.name] - Name for initials/color
 * @param {string} [props.size='md'] - Avatar size
 * @param {string} [props.shape='circle'] - Avatar shape
 * @param {string} [props.status] - Online status
 * @param {boolean} [props.showStatus=false] - Show status indicator
 * @param {boolean} [props.border=false] - Show border
 * @param {React.ReactNode} [props.badge] - Badge element
 * @param {string} [props.className] - Additional CSS classes
 * @param {Function} [props.onClick] - Click handler
 */
const Avatar = ({
  src,
  alt = '',
  name,
  size = AVATAR_SIZES.MD,
  shape = AVATAR_SHAPES.CIRCLE,
  status,
  showStatus = false,
  border = false,
  badge,
  className = '',
  onClick,
  ...props
}) => {
  
  const [imageError, setImageError] = React.useState(false);
  
  const initials = getInitials(name);
  const bgColor = stringToColor(name);
  const showImage = src && !imageError;
  
  const classNames = [
    'avatar',
    `avatar--${size}`,
    `avatar--${shape}`,
    border && 'avatar--border',
    onClick && 'avatar--clickable',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div 
      className={classNames}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {/* Avatar content */}
      <div 
        className="avatar__inner"
        style={!showImage ? { backgroundColor: bgColor } : undefined}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="avatar__image"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="avatar__initials">{initials}</span>
        )}
      </div>
      
      {/* Status indicator */}
      {showStatus && status && (
        <span className={`avatar__status avatar__status--${status}`} />
      )}
      
      {/* Badge */}
      {badge && (
        <span className="avatar__badge">{badge}</span>
      )}
    </div>
  );
};

// =============================================================================
// AVATAR GROUP
// =============================================================================

/**
 * AvatarGroup component
 * 
 * @param {Object} props - Component props
 * @param {number} [props.max=4] - Maximum avatars to show
 * @param {string} [props.size='md'] - Avatar size
 * @param {React.ReactNode} props.children - Avatar elements
 */
export const AvatarGroup = ({
  max = 4,
  size = AVATAR_SIZES.MD,
  className = '',
  children,
  ...props
}) => {
  
  const avatars = React.Children.toArray(children);
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;
  
  return (
    <div className={`avatar-group avatar-group--${size} ${className}`} {...props}>
      {visible.map((avatar, index) => (
        React.cloneElement(avatar, {
          key: index,
          size,
          border: true
        })
      ))}
      {remaining > 0 && (
        <div className={`avatar avatar--${size} avatar--circle avatar--border avatar--overflow`}>
          <div className="avatar__inner">
            <span className="avatar__initials">+{remaining}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default Avatar;