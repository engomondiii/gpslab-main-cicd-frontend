/**
 * GPS Lab Platform - RetryButton Component
 * 
 * Unified retry button for both R2R (Right to Retry) and pR2R (Purchased R2R).
 * Shows available retries and handles retry redemption.
 * 
 * @module components/study/RetryRights/RetryButton
 */

import React, { useState } from 'react';
import './RetryButton.css';

/**
 * RetryButton Component
 */
const RetryButton = ({
  type = 'r2r', // 'r2r' or 'pr2r'
  available = 0,
  onUseRetry,
  disabled = false,
  showCount = true,
  size = 'default', // 'small', 'default', 'large'
  variant = 'default', // 'default', 'outline', 'ghost'
  className = '',
  ...props
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const isR2R = type === 'r2r';
  const hasRetries = available > 0;
  
  const handleClick = async () => {
    if (disabled || !hasRetries || isProcessing) return;
    
    if (!isConfirming) {
      setIsConfirming(true);
      // Auto-reset confirmation after 3 seconds
      setTimeout(() => setIsConfirming(false), 3000);
      return;
    }
    
    // Confirmed - use retry
    setIsProcessing(true);
    try {
      if (onUseRetry) {
        await onUseRetry(type);
      }
    } finally {
      setIsProcessing(false);
      setIsConfirming(false);
    }
  };
  
  const handleCancel = (e) => {
    e.stopPropagation();
    setIsConfirming(false);
  };
  
  const classNames = [
    'retry-button',
    `retry-button--${type}`,
    `retry-button--${size}`,
    `retry-button--${variant}`,
    !hasRetries && 'retry-button--empty',
    isConfirming && 'retry-button--confirming',
    isProcessing && 'retry-button--processing',
    disabled && 'retry-button--disabled',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      type="button"
      className={classNames}
      onClick={handleClick}
      disabled={disabled || !hasRetries || isProcessing}
      {...props}
    >
      {isProcessing ? (
        <span className="retry-button__content">
          <span className="retry-button__spinner" />
          <span className="retry-button__text">Using...</span>
        </span>
      ) : isConfirming ? (
        <span className="retry-button__content retry-button__content--confirm">
          <span className="retry-button__text">Confirm Use?</span>
          <button
            type="button"
            className="retry-button__cancel"
            onClick={handleCancel}
          >
            ✕
          </button>
        </span>
      ) : (
        <span className="retry-button__content">
          <span className="retry-button__icon">
            {isR2R ? (
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4z"/>
                <path fillRule="evenodd" d="M8 10a2 2 0 012-2h6a2 2 0 012 2v4a2 2 0 01-2 2h-6a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
            )}
          </span>
          <span className="retry-button__label">
            {isR2R ? 'R2R' : 'pR2R'}
          </span>
          {showCount && (
            <span className="retry-button__count">{available}</span>
          )}
        </span>
      )}
    </button>
  );
};

export default RetryButton;