/**
 * GPS Lab Platform - CircularProgress Component
 * 
 * Circular progress indicator with percentage display.
 * 
 * @module components/common/Progress/CircularProgress
 * @version 1.0.0
 */

import React from 'react';
import './CircularProgress.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const CIRCULAR_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl'
};

export const CIRCULAR_VARIANTS = {
  DEFAULT: 'default',
  PRIMARY: 'primary',
  SUCCESS: 'success',
  WARNING: 'warning',
  DANGER: 'danger',
  BARAKA: 'baraka'
};

// Size to pixel mapping
const SIZE_MAP = {
  [CIRCULAR_SIZES.SM]: 48,
  [CIRCULAR_SIZES.MD]: 64,
  [CIRCULAR_SIZES.LG]: 96,
  [CIRCULAR_SIZES.XL]: 128
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * CircularProgress component
 * 
 * @param {Object} props - Component props
 * @param {number} props.value - Progress value (0-100)
 * @param {number} [props.max=100] - Maximum value
 * @param {string} [props.size='md'] - Circle size
 * @param {string} [props.variant='primary'] - Color variant
 * @param {number} [props.strokeWidth] - Stroke width (auto by size)
 * @param {boolean} [props.showValue=true] - Show percentage in center
 * @param {string} [props.label] - Custom center label
 * @param {React.ReactNode} [props.children] - Custom center content
 * @param {boolean} [props.indeterminate=false] - Indeterminate state
 * @param {string} [props.className] - Additional CSS classes
 */
const CircularProgress = ({
  value = 0,
  max = 100,
  size = CIRCULAR_SIZES.MD,
  variant = CIRCULAR_VARIANTS.PRIMARY,
  strokeWidth,
  showValue = true,
  label,
  children,
  indeterminate = false,
  className = '',
  ...props
}) => {
  
  // Calculate dimensions
  const pixelSize = SIZE_MAP[size] || SIZE_MAP[CIRCULAR_SIZES.MD];
  const calculatedStrokeWidth = strokeWidth || Math.max(4, pixelSize / 12);
  const radius = (pixelSize - calculatedStrokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate percentage
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const offset = circumference - (percentage / 100) * circumference;
  
  const classNames = [
    'circular-progress',
    `circular-progress--${size}`,
    `circular-progress--${variant}`,
    indeterminate && 'circular-progress--indeterminate',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div 
      className={classNames}
      style={{ width: pixelSize, height: pixelSize }}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : value}
      aria-valuemin={0}
      aria-valuemax={max}
      {...props}
    >
      <svg 
        className="circular-progress__svg"
        viewBox={`0 0 ${pixelSize} ${pixelSize}`}
      >
        {/* Track */}
        <circle
          className="circular-progress__track"
          cx={pixelSize / 2}
          cy={pixelSize / 2}
          r={radius}
          fill="none"
          strokeWidth={calculatedStrokeWidth}
        />
        
        {/* Progress */}
        <circle
          className="circular-progress__circle"
          cx={pixelSize / 2}
          cy={pixelSize / 2}
          r={radius}
          fill="none"
          strokeWidth={calculatedStrokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={indeterminate ? circumference * 0.75 : offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${pixelSize / 2} ${pixelSize / 2})`}
        />
      </svg>
      
      {/* Center content */}
      {!indeterminate && (showValue || label || children) && (
        <div className="circular-progress__content">
          {children || (
            <span className="circular-progress__value">
              {label || `${Math.round(percentage)}%`}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default CircularProgress;