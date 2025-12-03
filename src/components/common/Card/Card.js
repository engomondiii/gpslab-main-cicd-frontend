/**
 * GPS Lab Platform - Card Component
 * 
 * Flexible card container for content grouping.
 * Base component for specialized cards.
 * 
 * @module components/common/Card/Card
 * @version 1.0.0
 */

import React, { forwardRef } from 'react';
import './Card.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const CARD_VARIANTS = {
  DEFAULT: 'default',
  OUTLINED: 'outlined',
  ELEVATED: 'elevated',
  FILLED: 'filled',
  INTERACTIVE: 'interactive'
};

export const CARD_PADDING = {
  NONE: 'none',
  SM: 'sm',
  MD: 'md',
  LG: 'lg'
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Card component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='default'] - Card variant
 * @param {string} [props.padding='md'] - Card padding
 * @param {boolean} [props.hoverable=false] - Add hover effect
 * @param {boolean} [props.clickable=false] - Make card clickable
 * @param {boolean} [props.selected=false] - Selected state
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {string} [props.className] - Additional CSS classes
 * @param {Function} [props.onClick] - Click handler
 * @param {React.ReactNode} [props.header] - Card header content
 * @param {React.ReactNode} [props.footer] - Card footer content
 * @param {React.ReactNode} [props.media] - Card media (image/video)
 * @param {React.ReactNode} props.children - Card body content
 */
const Card = forwardRef(({
  variant = CARD_VARIANTS.DEFAULT,
  padding = CARD_PADDING.MD,
  hoverable = false,
  clickable = false,
  selected = false,
  disabled = false,
  className = '',
  onClick,
  header,
  footer,
  media,
  children,
  ...props
}, ref) => {
  
  // Determine if card should be interactive
  const isInteractive = clickable || onClick || variant === CARD_VARIANTS.INTERACTIVE;
  
  // Build class names
  const classNames = [
    'card',
    `card--${variant}`,
    `card--padding-${padding}`,
    hoverable && 'card--hoverable',
    isInteractive && 'card--clickable',
    selected && 'card--selected',
    disabled && 'card--disabled',
    className
  ].filter(Boolean).join(' ');
  
  // Handle click
  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };
  
  // Handle keyboard interaction
  const handleKeyDown = (e) => {
    if (isInteractive && !disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.(e);
    }
  };
  
  // Determine element and role
  const Element = isInteractive ? 'div' : 'article';
  const role = isInteractive ? 'button' : undefined;
  const tabIndex = isInteractive && !disabled ? 0 : undefined;
  
  return (
    <Element
      ref={ref}
      className={classNames}
      role={role}
      tabIndex={tabIndex}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      aria-disabled={disabled}
      aria-selected={selected}
      {...props}
    >
      {/* Media */}
      {media && (
        <div className="card__media">
          {media}
        </div>
      )}
      
      {/* Header */}
      {header && (
        <div className="card__header">
          {header}
        </div>
      )}
      
      {/* Body */}
      <div className="card__body">
        {children}
      </div>
      
      {/* Footer */}
      {footer && (
        <div className="card__footer">
          {footer}
        </div>
      )}
    </Element>
  );
});

Card.displayName = 'Card';

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Card Header component
 */
export const CardHeader = ({ 
  title, 
  subtitle, 
  action, 
  avatar,
  className = '',
  children 
}) => (
  <div className={`card-header ${className}`}>
    {avatar && <div className="card-header__avatar">{avatar}</div>}
    <div className="card-header__content">
      {title && <h3 className="card-header__title">{title}</h3>}
      {subtitle && <p className="card-header__subtitle">{subtitle}</p>}
      {children}
    </div>
    {action && <div className="card-header__action">{action}</div>}
  </div>
);

/**
 * Card Footer component
 */
export const CardFooter = ({ 
  className = '', 
  align = 'right',
  children 
}) => (
  <div className={`card-footer card-footer--${align} ${className}`}>
    {children}
  </div>
);

/**
 * Card Media component
 */
export const CardMedia = ({ 
  src, 
  alt = '', 
  aspectRatio = '16/9',
  className = '' 
}) => (
  <div 
    className={`card-media ${className}`}
    style={{ aspectRatio }}
  >
    <img src={src} alt={alt} className="card-media__image" />
  </div>
);

// =============================================================================
// EXPORTS
// =============================================================================

export default Card;