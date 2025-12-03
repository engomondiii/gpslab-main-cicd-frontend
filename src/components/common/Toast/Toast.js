/**
 * GPS Lab Platform - Toast Component
 * 
 * Toast notification component for feedback messages.
 * 
 * @module components/common/Toast/Toast
 * @version 1.0.0
 */

import React, { useEffect, useState } from 'react';
import './Toast.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

export const TOAST_POSITIONS = {
  TOP_RIGHT: 'top-right',
  TOP_LEFT: 'top-left',
  TOP_CENTER: 'top-center',
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_CENTER: 'bottom-center'
};

// Type icons
const TYPE_ICONS = {
  [TOAST_TYPES.SUCCESS]: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  [TOAST_TYPES.ERROR]: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  ),
  [TOAST_TYPES.WARNING]: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  ),
  [TOAST_TYPES.INFO]: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  )
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Toast component
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Unique toast ID
 * @param {string} [props.type='info'] - Toast type
 * @param {string} [props.title] - Toast title
 * @param {string} props.message - Toast message
 * @param {number} [props.duration=5000] - Auto-dismiss duration (ms)
 * @param {boolean} [props.dismissible=true] - Can be dismissed
 * @param {boolean} [props.showIcon=true] - Show type icon
 * @param {Function} [props.onDismiss] - Dismiss handler
 * @param {Object} [props.action] - Action button config
 */
const Toast = ({
  id,
  type = TOAST_TYPES.INFO,
  title,
  message,
  duration = 5000,
  dismissible = true,
  showIcon = true,
  onDismiss,
  action,
  className = '',
  ...props
}) => {
  
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  
  // Auto-dismiss timer
  useEffect(() => {
    if (duration <= 0) return;
    
    const startTime = Date.now();
    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      
      if (remaining <= 0) {
        handleDismiss();
      }
    }, 50);
    
    return () => clearInterval(intervalId);
  }, [duration]);
  
  // Handle dismiss
  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss?.(id);
    }, 200);
  };
  
  // Handle action click
  const handleAction = () => {
    action?.onClick?.();
    if (action?.dismissOnClick !== false) {
      handleDismiss();
    }
  };
  
  const classNames = [
    'toast',
    `toast--${type}`,
    isExiting && 'toast--exiting',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div 
      className={classNames} 
      role="alert"
      aria-live="polite"
      {...props}
    >
      {/* Icon */}
      {showIcon && (
        <div className="toast__icon">
          {TYPE_ICONS[type]}
        </div>
      )}
      
      {/* Content */}
      <div className="toast__content">
        {title && <h4 className="toast__title">{title}</h4>}
        <p className="toast__message">{message}</p>
        
        {/* Action button */}
        {action && (
          <button 
            className="toast__action"
            onClick={handleAction}
          >
            {action.label}
          </button>
        )}
      </div>
      
      {/* Dismiss button */}
      {dismissible && (
        <button 
          className="toast__dismiss"
          onClick={handleDismiss}
          aria-label="Dismiss notification"
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
      
      {/* Progress bar */}
      {duration > 0 && (
        <div className="toast__progress">
          <div 
            className="toast__progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default Toast;