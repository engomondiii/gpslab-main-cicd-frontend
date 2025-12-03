/**
 * GPS Lab Platform - LoadingOverlay Component
 * 
 * Full-page or container loading overlay with spinner.
 * 
 * @module components/common/Loading/LoadingOverlay
 * @version 1.0.0
 */

import React from 'react';
import Spinner, { SPINNER_SIZES, SPINNER_VARIANTS } from './Spinner';
import './LoadingOverlay.css';

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * LoadingOverlay component
 * 
 * @param {Object} props - Component props
 * @param {boolean} [props.isLoading=true] - Loading state
 * @param {boolean} [props.fullScreen=false] - Full screen overlay
 * @param {string} [props.message] - Loading message
 * @param {string} [props.spinnerSize='lg'] - Spinner size
 * @param {string} [props.spinnerVariant='primary'] - Spinner variant
 * @param {boolean} [props.blur=false] - Blur background content
 * @param {boolean} [props.transparent=false] - Transparent background
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} [props.children] - Content to overlay
 */
const LoadingOverlay = ({
  isLoading = true,
  fullScreen = false,
  message,
  spinnerSize = SPINNER_SIZES.LG,
  spinnerVariant = SPINNER_VARIANTS.PRIMARY,
  blur = false,
  transparent = false,
  className = '',
  children,
  ...props
}) => {
  
  if (!isLoading && !children) return null;
  
  const overlayClassNames = [
    'loading-overlay',
    fullScreen && 'loading-overlay--fullscreen',
    blur && 'loading-overlay--blur',
    transparent && 'loading-overlay--transparent',
    className
  ].filter(Boolean).join(' ');
  
  const overlay = isLoading ? (
    <div className={overlayClassNames} role="alert" aria-busy="true" {...props}>
      <div className="loading-overlay__content">
        <Spinner 
          size={spinnerSize} 
          variant={spinnerVariant}
          label={message || 'Loading...'}
        />
        {message && (
          <p className="loading-overlay__message">{message}</p>
        )}
      </div>
    </div>
  ) : null;
  
  // If no children, just return the overlay
  if (!children) {
    return overlay;
  }
  
  // Wrap children with relative container
  return (
    <div className="loading-overlay__container">
      {children}
      {overlay}
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default LoadingOverlay;