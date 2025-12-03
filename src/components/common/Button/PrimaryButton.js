/**
 * GPS Lab Platform - PrimaryButton Component
 * 
 * Primary button with GPS branding. Used for main CTAs
 * and primary actions throughout the application.
 * 
 * @module components/common/Button/PrimaryButton
 * @version 1.0.0
 */

import React, { forwardRef } from 'react';
import Button, { BUTTON_SIZES } from './Button';
import './PrimaryButton.css';

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Primary Button component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.size='md'] - Button size
 * @param {boolean} [props.elevated=false] - Add elevation/shadow
 * @param {boolean} [props.pulse=false] - Add pulsing animation (for CTAs)
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 */
const PrimaryButton = forwardRef(({
  size = BUTTON_SIZES.MD,
  elevated = false,
  pulse = false,
  className = '',
  children,
  ...props
}, ref) => {
  
  const classNames = [
    'btn-primary',
    elevated && 'btn-primary--elevated',
    pulse && 'btn-primary--pulse',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <Button
      ref={ref}
      variant="primary"
      size={size}
      className={classNames}
      {...props}
    >
      {children}
    </Button>
  );
});

PrimaryButton.displayName = 'PrimaryButton';

// =============================================================================
// EXPORTS
// =============================================================================

export default PrimaryButton;