/**
 * GPS Lab Platform - SecondaryButton Component
 * 
 * Secondary button with outlined style. Used for secondary actions
 * and less prominent CTAs.
 * 
 * @module components/common/Button/SecondaryButton
 * @version 1.0.0
 */

import React, { forwardRef } from 'react';
import Button, { BUTTON_SIZES } from './Button';
import './SecondaryButton.css';

// =============================================================================
// SECONDARY BUTTON VARIANTS
// =============================================================================

export const SECONDARY_VARIANTS = {
  DEFAULT: 'default',
  SUBTLE: 'subtle',
  CONTRAST: 'contrast'
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Secondary Button component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.size='md'] - Button size
 * @param {string} [props.secondaryVariant='default'] - Secondary style variant
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 */
const SecondaryButton = forwardRef(({
  size = BUTTON_SIZES.MD,
  secondaryVariant = SECONDARY_VARIANTS.DEFAULT,
  className = '',
  children,
  ...props
}, ref) => {
  
  const classNames = [
    'btn-secondary',
    `btn-secondary--${secondaryVariant}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <Button
      ref={ref}
      variant="secondary"
      size={size}
      className={classNames}
      {...props}
    >
      {children}
    </Button>
  );
});

SecondaryButton.displayName = 'SecondaryButton';

// =============================================================================
// EXPORTS
// =============================================================================

export default SecondaryButton;