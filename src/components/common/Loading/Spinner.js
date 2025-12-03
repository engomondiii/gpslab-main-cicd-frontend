/**
 * GPS Lab Platform - Spinner Component
 * 
 * Spinning loader indicator with multiple sizes and styles.
 * 
 * @module components/common/Loading/Spinner
 * @version 1.0.0
 */

import React from 'react';
import './Spinner.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const SPINNER_SIZES = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl'
};

export const SPINNER_VARIANTS = {
  DEFAULT: 'default',
  PRIMARY: 'primary',
  WHITE: 'white',
  BARAKA: 'baraka'
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Spinner component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.size='md'] - Spinner size
 * @param {string} [props.variant='default'] - Spinner variant
 * @param {string} [props.label] - Accessible label
 * @param {boolean} [props.centered=false] - Center in container
 * @param {string} [props.className] - Additional CSS classes
 */
const Spinner = ({
  size = SPINNER_SIZES.MD,
  variant = SPINNER_VARIANTS.DEFAULT,
  label = 'Loading...',
  centered = false,
  className = '',
  ...props
}) => {
  
  const classNames = [
    'spinner',
    `spinner--${size}`,
    `spinner--${variant}`,
    centered && 'spinner--centered',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} role="status" aria-label={label} {...props}>
      <svg className="spinner__svg" viewBox="0 0 50 50">
        <circle
          className="spinner__track"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="4"
        />
        <circle
          className="spinner__circle"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default Spinner;