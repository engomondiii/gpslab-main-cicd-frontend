/**
 * GPS Lab Platform - ProgressBar Component
 * 
 * Linear progress bar with various styles and animations.
 * 
 * @module components/common/Progress/ProgressBar
 * @version 1.0.0
 */

import React from 'react';
import './ProgressBar.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const PROGRESS_SIZES = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg'
};

export const PROGRESS_VARIANTS = {
  DEFAULT: 'default',
  PRIMARY: 'primary',
  SUCCESS: 'success',
  WARNING: 'warning',
  DANGER: 'danger',
  BARAKA: 'baraka',
  GRADIENT: 'gradient'
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ProgressBar component
 * 
 * @param {Object} props - Component props
 * @param {number} props.value - Progress value (0-100)
 * @param {number} [props.max=100] - Maximum value
 * @param {string} [props.size='md'] - Bar size
 * @param {string} [props.variant='primary'] - Color variant
 * @param {boolean} [props.showLabel=false] - Show percentage label
 * @param {string} [props.label] - Custom label text
 * @param {boolean} [props.animated=false] - Animate fill
 * @param {boolean} [props.striped=false] - Striped pattern
 * @param {boolean} [props.indeterminate=false] - Indeterminate state
 * @param {string} [props.className] - Additional CSS classes
 */
const ProgressBar = ({
  value = 0,
  max = 100,
  size = PROGRESS_SIZES.MD,
  variant = PROGRESS_VARIANTS.PRIMARY,
  showLabel = false,
  label,
  animated = false,
  striped = false,
  indeterminate = false,
  className = '',
  ...props
}) => {
  
  // Calculate percentage
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const displayLabel = label || `${Math.round(percentage)}%`;
  
  const classNames = [
    'progress-bar',
    `progress-bar--${size}`,
    `progress-bar--${variant}`,
    animated && 'progress-bar--animated',
    striped && 'progress-bar--striped',
    indeterminate && 'progress-bar--indeterminate',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      <div 
        className="progress-bar__track"
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={displayLabel}
      >
        <div 
          className="progress-bar__fill"
          style={indeterminate ? undefined : { width: `${percentage}%` }}
        />
      </div>
      
      {showLabel && !indeterminate && (
        <span className="progress-bar__label">{displayLabel}</span>
      )}
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default ProgressBar;