/**
 * GPS Lab Platform - IconButton Component
 * 
 * Icon-only button for compact actions. Circular shape
 * with various size and style options.
 * 
 * @module components/common/Button/IconButton
 * @version 1.0.0
 */

import React, { forwardRef } from 'react';
import './IconButton.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const ICON_BUTTON_SIZES = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl'
};

export const ICON_BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  GHOST: 'ghost',
  DANGER: 'danger',
  SUCCESS: 'success',
  BARAKA: 'baraka'
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Icon Button component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.icon - Icon element
 * @param {string} [props.variant='ghost'] - Button variant
 * @param {string} [props.size='md'] - Button size
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {boolean} [props.loading=false] - Loading state
 * @param {boolean} [props.rounded=true] - Fully rounded (circle)
 * @param {string} [props.label] - Accessible label (required for a11y)
 * @param {string} [props.className] - Additional CSS classes
 * @param {Function} [props.onClick] - Click handler
 */
const IconButton = forwardRef(({
  icon,
  variant = ICON_BUTTON_VARIANTS.GHOST,
  size = ICON_BUTTON_SIZES.MD,
  disabled = false,
  loading = false,
  rounded = true,
  label,
  className = '',
  onClick,
  ...props
}, ref) => {
  
  // Build class names
  const classNames = [
    'icon-btn',
    `icon-btn--${variant}`,
    `icon-btn--${size}`,
    rounded && 'icon-btn--rounded',
    loading && 'icon-btn--loading',
    disabled && 'icon-btn--disabled',
    className
  ].filter(Boolean).join(' ');
  
  // Handle click
  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };
  
  return (
    <button
      ref={ref}
      type="button"
      className={classNames}
      disabled={disabled || loading}
      onClick={handleClick}
      aria-label={label}
      aria-busy={loading}
      aria-disabled={disabled}
      {...props}
    >
      {loading ? (
        <span className="icon-btn__spinner" aria-hidden="true">
          <svg className="icon-btn__spinner-svg" viewBox="0 0 24 24">
            <circle
              className="icon-btn__spinner-circle"
              cx="12"
              cy="12"
              r="10"
              fill="none"
              strokeWidth="3"
            />
          </svg>
        </span>
      ) : (
        <span className="icon-btn__icon" aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  );
});

IconButton.displayName = 'IconButton';

// =============================================================================
// EXPORTS
// =============================================================================

export default IconButton;