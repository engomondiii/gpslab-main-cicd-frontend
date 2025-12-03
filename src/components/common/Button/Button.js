/**
 * GPS Lab Platform - Button Component
 * 
 * Base button component with multiple variants, sizes, and states.
 * Foundation for all button types in the application.
 * 
 * @module components/common/Button/Button
 * @version 1.0.0
 */

import React, { forwardRef } from 'react';
import './Button.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TERTIARY: 'tertiary',
  GHOST: 'ghost',
  DANGER: 'danger',
  SUCCESS: 'success',
  WARNING: 'warning',
  BARAKA: 'baraka'
};

export const BUTTON_SIZES = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl'
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Base Button component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='primary'] - Button variant
 * @param {string} [props.size='md'] - Button size
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {boolean} [props.loading=false] - Loading state
 * @param {boolean} [props.fullWidth=false] - Full width button
 * @param {string} [props.type='button'] - Button type
 * @param {React.ReactNode} [props.leftIcon] - Icon on left side
 * @param {React.ReactNode} [props.rightIcon] - Icon on right side
 * @param {string} [props.className] - Additional CSS classes
 * @param {Function} [props.onClick] - Click handler
 * @param {React.ReactNode} props.children - Button content
 */
const Button = forwardRef(({
  variant = BUTTON_VARIANTS.PRIMARY,
  size = BUTTON_SIZES.MD,
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  leftIcon,
  rightIcon,
  className = '',
  onClick,
  children,
  ...props
}, ref) => {
  
  // Build class names
  const classNames = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth && 'btn--full-width',
    loading && 'btn--loading',
    disabled && 'btn--disabled',
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
      type={type}
      className={classNames}
      disabled={disabled || loading}
      onClick={handleClick}
      aria-busy={loading}
      aria-disabled={disabled}
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <span className="btn__spinner" aria-hidden="true">
          <svg className="btn__spinner-svg" viewBox="0 0 24 24">
            <circle
              className="btn__spinner-circle"
              cx="12"
              cy="12"
              r="10"
              fill="none"
              strokeWidth="3"
            />
          </svg>
        </span>
      )}
      
      {/* Left icon */}
      {leftIcon && !loading && (
        <span className="btn__icon btn__icon--left" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      
      {/* Button content */}
      <span className="btn__content">
        {children}
      </span>
      
      {/* Right icon */}
      {rightIcon && !loading && (
        <span className="btn__icon btn__icon--right" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

// =============================================================================
// EXPORTS
// =============================================================================

export default Button;