/**
 * GPS Lab Platform - Badge Component
 * 
 * Versatile badge component for labels, counts, and status indicators.
 * 
 * @module components/common/Badge/Badge
 * @version 1.0.0
 */

import React from 'react';
import './Badge.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const BADGE_VARIANTS = {
  DEFAULT: 'default',
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  WARNING: 'warning',
  DANGER: 'danger',
  INFO: 'info',
  BARAKA: 'baraka'
};

export const BADGE_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg'
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Badge component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='default'] - Badge variant
 * @param {string} [props.size='md'] - Badge size
 * @param {boolean} [props.outlined=false] - Outlined style
 * @param {boolean} [props.rounded=false] - Fully rounded (pill)
 * @param {boolean} [props.dot=false] - Show as dot only
 * @param {React.ReactNode} [props.icon] - Icon element
 * @param {boolean} [props.removable=false] - Show remove button
 * @param {Function} [props.onRemove] - Remove handler
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Badge content
 */
const Badge = ({
  variant = BADGE_VARIANTS.DEFAULT,
  size = BADGE_SIZES.MD,
  outlined = false,
  rounded = false,
  dot = false,
  icon,
  removable = false,
  onRemove,
  className = '',
  children,
  ...props
}) => {
  
  const classNames = [
    'badge',
    `badge--${variant}`,
    `badge--${size}`,
    outlined && 'badge--outlined',
    rounded && 'badge--rounded',
    dot && 'badge--dot',
    className
  ].filter(Boolean).join(' ');
  
  // Dot variant - no content
  if (dot) {
    return <span className={classNames} {...props} />;
  }
  
  return (
    <span className={classNames} {...props}>
      {icon && <span className="badge__icon">{icon}</span>}
      <span className="badge__content">{children}</span>
      {removable && (
        <button 
          type="button"
          className="badge__remove"
          onClick={onRemove}
          aria-label="Remove"
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </span>
  );
};

// =============================================================================
// NOTIFICATION BADGE (attached to elements)
// =============================================================================

/**
 * NotificationBadge component - attaches to other elements
 * 
 * @param {Object} props - Component props
 * @param {number|string} [props.count] - Notification count
 * @param {number} [props.max=99] - Maximum count to show
 * @param {boolean} [props.showZero=false] - Show when count is 0
 * @param {string} [props.variant='danger'] - Badge variant
 * @param {string} [props.position='top-right'] - Badge position
 * @param {React.ReactNode} props.children - Element to attach badge to
 */
export const NotificationBadge = ({
  count,
  max = 99,
  showZero = false,
  variant = BADGE_VARIANTS.DANGER,
  position = 'top-right',
  className = '',
  children,
  ...props
}) => {
  
  // Determine what to display
  const shouldShow = count > 0 || (count === 0 && showZero) || count === undefined;
  const displayCount = count !== undefined 
    ? (count > max ? `${max}+` : count)
    : null;
  
  if (!shouldShow) {
    return children;
  }
  
  const badgeClassNames = [
    'notification-badge',
    `notification-badge--${variant}`,
    `notification-badge--${position}`,
    !displayCount && 'notification-badge--dot',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <span className="notification-badge__wrapper" {...props}>
      {children}
      <span className={badgeClassNames}>
        {displayCount}
      </span>
    </span>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default Badge;