/**
 * GPS Lab Platform - CheckpointHeader Component
 * 
 * Header for checkpoint arena displaying checkpoint info,
 * timer, stage progress, and action controls.
 * 
 * @module components/checkpoint/CheckpointArena/CheckpointHeader
 */

import React, { useState, useEffect, useCallback } from 'react';
import './CheckpointHeader.css';

/**
 * Checkpoint status configurations
 */
const CHECKPOINT_STATUS = {
  NOT_STARTED: {
    key: 'not_started',
    label: 'Not Started',
    color: 'neutral',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
      </svg>
    )
  },
  IN_PROGRESS: {
    key: 'in_progress',
    label: 'In Progress',
    color: 'primary',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
      </svg>
    )
  },
  SUBMITTED: {
    key: 'submitted',
    label: 'Submitted',
    color: 'info',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
      </svg>
    )
  },
  EVALUATING: {
    key: 'evaluating',
    label: 'Evaluating',
    color: 'warning',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
      </svg>
    )
  },
  PASSED: {
    key: 'passed',
    label: 'Passed',
    color: 'success',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
      </svg>
    )
  },
  FAILED: {
    key: 'failed',
    label: 'Failed',
    color: 'error',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
      </svg>
    )
  }
};

/**
 * Format time in mm:ss format
 */
const formatTime = (seconds) => {
  if (seconds <= 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Get beacon color for stage
 */
const getBeaconColor = (stage) => {
  if (stage <= 5) return '#FF6B6B';
  if (stage <= 10) return '#FF8C42';
  if (stage <= 15) return '#F1C40F';
  if (stage <= 20) return '#2A9D8F';
  if (stage <= 25) return '#00D4FF';
  if (stage <= 30) return '#9B59B6';
  return '#8E44AD';
};

/**
 * CheckpointHeader Component
 */
const CheckpointHeader = ({
  checkpoint,
  mission,
  stage = 1,
  status = 'not_started',
  timeLimit = 0,
  timeRemaining = 0,
  onBack,
  onPause,
  onResume,
  onSubmit,
  isPaused = false,
  canSubmit = false,
  className = '',
  ...props
}) => {
  const [displayTime, setDisplayTime] = useState(timeRemaining);
  const [isTimerWarning, setIsTimerWarning] = useState(false);
  const [isTimerCritical, setIsTimerCritical] = useState(false);
  
  const statusConfig = CHECKPOINT_STATUS[status.toUpperCase()] || CHECKPOINT_STATUS.NOT_STARTED;
  const beaconColor = getBeaconColor(stage);
  
  useEffect(() => {
    setDisplayTime(timeRemaining);
    
    if (timeLimit > 0) {
      const percentRemaining = (timeRemaining / timeLimit) * 100;
      setIsTimerWarning(percentRemaining <= 25 && percentRemaining > 10);
      setIsTimerCritical(percentRemaining <= 10);
    }
  }, [timeRemaining, timeLimit]);
  
  useEffect(() => {
    if (status !== 'in_progress' || isPaused || displayTime <= 0) return;
    
    const interval = setInterval(() => {
      setDisplayTime(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [status, isPaused, displayTime]);
  
  const handleBack = useCallback(() => {
    if (onBack) onBack();
  }, [onBack]);
  
  const handlePauseResume = useCallback(() => {
    if (isPaused && onResume) onResume();
    else if (!isPaused && onPause) onPause();
  }, [isPaused, onPause, onResume]);
  
  const handleSubmit = useCallback(() => {
    if (canSubmit && onSubmit) onSubmit();
  }, [canSubmit, onSubmit]);
  
  const classNames = [
    'checkpoint-header',
    `checkpoint-header--${statusConfig.key}`,
    className
  ].filter(Boolean).join(' ');
  
  const timerClassNames = [
    'checkpoint-header__timer',
    isTimerWarning && 'checkpoint-header__timer--warning',
    isTimerCritical && 'checkpoint-header__timer--critical'
  ].filter(Boolean).join(' ');
  
  return (
    <header className={classNames} {...props}>
      <div className="checkpoint-header__container">
        <div className="checkpoint-header__left">
          <button
            type="button"
            onClick={handleBack}
            className="checkpoint-header__back-btn"
            aria-label="Go back"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
          </button>
          
          <div className="checkpoint-header__info">
            <div className="checkpoint-header__stage-badge" style={{ '--beacon-color': beaconColor }}>
              <span className="checkpoint-header__stage-label">Stage {stage}</span>
            </div>
            
            <div className="checkpoint-header__titles">
              <h1 className="checkpoint-header__title">
                {checkpoint?.title || 'Checkpoint Evaluation'}
              </h1>
              {mission && (
                <span className="checkpoint-header__mission">{mission.title}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="checkpoint-header__center">
          <div className={`checkpoint-header__status checkpoint-header__status--${statusConfig.color}`}>
            <span className="checkpoint-header__status-icon">{statusConfig.icon}</span>
            <span className="checkpoint-header__status-label">{statusConfig.label}</span>
          </div>
          
          {timeLimit > 0 && (
            <div className={timerClassNames}>
              <svg className="checkpoint-header__timer-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
              <span className="checkpoint-header__timer-value">{formatTime(displayTime)}</span>
              {isPaused && <span className="checkpoint-header__timer-paused">PAUSED</span>}
            </div>
          )}
        </div>
        
        <div className="checkpoint-header__right">
          {status === 'in_progress' && (onPause || onResume) && (
            <button
              type="button"
              onClick={handlePauseResume}
              className="checkpoint-header__action-btn checkpoint-header__action-btn--secondary"
              aria-label={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? (
                <>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                  </svg>
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  <span>Pause</span>
                </>
              )}
            </button>
          )}
          
          {status === 'in_progress' && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="checkpoint-header__action-btn checkpoint-header__action-btn--primary"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <span>Submit Evaluation</span>
            </button>
          )}
          
          {(status === 'passed' || status === 'failed') && (
            <div className="checkpoint-header__result-badge">
              {status === 'passed' ? (
                <span className="checkpoint-header__result checkpoint-header__result--passed">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  Checkpoint Passed
                </span>
              ) : (
                <span className="checkpoint-header__result checkpoint-header__result--failed">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                  </svg>
                  Checkpoint Failed
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      {timeLimit > 0 && status === 'in_progress' && (
        <div className="checkpoint-header__progress-bar">
          <div 
            className="checkpoint-header__progress-fill"
            style={{ width: `${(displayTime / timeLimit) * 100}%` }}
          />
        </div>
      )}
    </header>
  );
};

export default CheckpointHeader;