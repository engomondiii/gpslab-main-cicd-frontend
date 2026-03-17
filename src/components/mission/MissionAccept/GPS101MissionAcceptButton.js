/**
 * GPS 101 Mission Accept Button Component
 * CORRECT STRUCTURE: 5 Stages → 5 Missions → 30 Sub-missions → 150 Checkpoints
 * Button states: available, in_progress, completed, locked
 */

import React from 'react';
import './GPS101MissionAcceptButton.css';

/**
 * GPS101MissionAcceptButton Component
 */
const GPS101MissionAcceptButton = ({
  missionId,
  status = 'available',
  onClick,
  isLoading = false,
  disabled = false,
  size = 'medium',
  variant = 'default',
  showIcon = true,
  children,
  className = '',
  // GPS 101 SPECIFIC
  isGPS101 = true,
  stageNumber,
  isStageCompleter = false,
  ...props
}) => {
  const isAvailable = status === 'available';
  const isInProgress = status === 'in_progress';
  const isCompleted = status === 'completed';
  const isLocked = status === 'locked';
  
  /**
   * Handle button click
   */
  const handleClick = () => {
    if (!disabled && !isLoading && !isLocked && onClick) {
      onClick(missionId);
    }
  };
  
  /**
   * Get button content based on state
   */
  const getButtonContent = () => {
    // Loading state
    if (isLoading) {
      return (
        <>
          <span className="gps101-accept-btn__spinner" />
          <span>Loading...</span>
        </>
      );
    }
    
    // Custom children
    if (children) return children;
    
    // Completed state
    if (isCompleted) {
      return (
        <>
          {showIcon && (
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
          )}
          <span>Completed</span>
        </>
      );
    }
    
    // In Progress state
    if (isInProgress) {
      return (
        <>
          {showIcon && (
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
            </svg>
          )}
          <span>Continue Mission</span>
        </>
      );
    }
    
    // Locked state
    if (isLocked) {
      return (
        <>
          {showIcon && (
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
            </svg>
          )}
          <span>Locked</span>
        </>
      );
    }
    
    // Available state (default)
    return (
      <>
        {showIcon && (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        )}
        <span>{isGPS101 ? 'Accept Mission' : 'Start Mission'}</span>
        {isStageCompleter && (
          <span className="gps101-accept-btn__badge">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </span>
        )}
      </>
    );
  };
  
  /**
   * Build class names
   */
  const classNames = [
    'gps101-accept-btn',
    `gps101-accept-btn--${status}`,
    `gps101-accept-btn--${size}`,
    variant !== 'default' && `gps101-accept-btn--${variant}`,
    isLoading && 'gps101-accept-btn--loading',
    (disabled || isLocked) && 'gps101-accept-btn--disabled',
    isGPS101 && 'gps101-accept-btn--gps101',
    isStageCompleter && 'gps101-accept-btn--stage-completer',
    className
  ].filter(Boolean).join(' ');
  
  /**
   * Get ARIA label
   */
  const getAriaLabel = () => {
    if (isCompleted) return 'Mission completed';
    if (isInProgress) return 'Continue mission';
    if (isLocked) return 'Mission locked';
    if (isStageCompleter) return 'Accept stage completer mission';
    return 'Accept mission';
  };
  
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isLoading || isLocked}
      className={classNames}
      aria-label={getAriaLabel()}
      title={isStageCompleter ? 'This mission unlocks your stage deliverable' : undefined}
      {...props}
    >
      {getButtonContent()}
    </button>
  );
};

export default GPS101MissionAcceptButton;