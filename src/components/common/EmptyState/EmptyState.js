/**
 * GPS Lab Platform - EmptyState Component
 * 
 * Placeholder for empty lists, search results, or error states.
 * 
 * @module components/common/EmptyState/EmptyState
 * @version 1.0.0
 */

import React from 'react';
import './EmptyState.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const EMPTY_STATE_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg'
};

// Default icons for common states
const DEFAULT_ICONS = {
  empty: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  noAccess: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  )
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * EmptyState component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.title] - Title text
 * @param {string} [props.description] - Description text
 * @param {React.ReactNode} [props.icon] - Custom icon
 * @param {string} [props.iconType] - Default icon type
 * @param {string} [props.size='md'] - Component size
 * @param {React.ReactNode} [props.action] - Action button/content
 * @param {string} [props.className] - Additional CSS classes
 */
const EmptyState = ({
  title,
  description,
  icon,
  iconType = 'empty',
  size = EMPTY_STATE_SIZES.MD,
  action,
  className = '',
  children,
  ...props
}) => {
  
  const displayIcon = icon || DEFAULT_ICONS[iconType] || DEFAULT_ICONS.empty;
  
  const classNames = [
    'empty-state',
    `empty-state--${size}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Icon */}
      <div className="empty-state__icon">
        {displayIcon}
      </div>
      
      {/* Title */}
      {title && (
        <h3 className="empty-state__title">{title}</h3>
      )}
      
      {/* Description */}
      {description && (
        <p className="empty-state__description">{description}</p>
      )}
      
      {/* Custom content */}
      {children}
      
      {/* Action */}
      {action && (
        <div className="empty-state__action">
          {action}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default EmptyState;