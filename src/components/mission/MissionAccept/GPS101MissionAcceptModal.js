/**
 * GPS 101 Mission Accept Modal Component
 * CORRECT STRUCTURE: 5 Stages → 5 Missions → 30 Sub-missions → 150 Checkpoints
 * Confirmation modal for accepting GPS 101 missions
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GPS101MissionAcceptModal.css';

/**
 * GPS101MissionAcceptModal Component
 */
const GPS101MissionAcceptModal = ({
  isOpen = false,
  mission = {},
  onAccept,
  onCancel,
  onClose,
  isLoading = false,
  className = '',
  ...props
}) => {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);
  
  const {
    missionId,
    title,
    description,
    difficulty = 'beginner',
    estimatedTime = '20-30 min',
    xpReward = 0,
    barakaReward = 0,
    objectives = [],
    // GPS 101 SPECIFIC
    stageNumber,
    stageQuestion,
    stageIcon,
    deliverableName,
    subMissionsCount = 6,
    checkpointsCount = 30,
    isStageCompleter = false
  } = mission;
  
  /**
   * Handle accept mission
   */
  const handleAccept = useCallback(async () => {
    try {
      await onAccept?.(missionId);
      setAccepted(true);
    } catch (error) {
      console.error('Failed to accept mission:', error);
    }
  }, [missionId, onAccept]);
  
  /**
   * Handle close modal
   */
  const handleClose = useCallback(() => {
    setAccepted(false);
    onClose?.();
  }, [onClose]);
  
  /**
   * Navigate to mission page (after acceptance)
   *
   * FIX: was `/gps101/stage/${stageNumber}/mission/${missionId}` which does not
   * exist in AppRouter.js. The correct route is `/gps101/mission/:missionId`.
   */
  const handleStartMission = useCallback(() => {
    navigate(`/gps101/mission/${missionId}`);
    handleClose();
  }, [navigate, missionId, handleClose]);
  
  /**
   * Handle escape key
   */
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isLoading, handleClose]);
  
  /**
   * Lock body scroll when modal is open
   */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const classNames = [
    'gps101-accept-modal',
    accepted && 'gps101-accept-modal--success',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Backdrop */}
      <div 
        className="gps101-accept-modal__backdrop" 
        onClick={!isLoading ? handleClose : undefined}
      />
      
      {/* Dialog */}
      <div className="gps101-accept-modal__dialog" role="dialog" aria-modal="true">
        {/* Close Button */}
        <button 
          type="button" 
          onClick={handleClose}
          disabled={isLoading}
          className="gps101-accept-modal__close"
          aria-label="Close modal"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
        
        {accepted ? (
          /* SUCCESS STATE */
          <div className="gps101-accept-modal__success">
            <div className="gps101-accept-modal__success-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            
            <h2 className="gps101-accept-modal__success-title">Mission Accepted!</h2>
            
            <p className="gps101-accept-modal__success-text">
              You've accepted <strong>"{title}"</strong> for GPS 101 Stage {stageNumber}.
            </p>
            
            {/* GPS 101 Stage Context */}
            <div className="gps101-accept-modal__gps101-context">
              <div className="gps101-accept-modal__gps101-badge">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
                <div className="gps101-accept-modal__gps101-text">
                  <span className="gps101-accept-modal__gps101-label">GPS 101 Basic</span>
                  <span className="gps101-accept-modal__gps101-stage">Stage {stageNumber} {stageIcon}</span>
                </div>
              </div>
              
              {stageQuestion && (
                <p className="gps101-accept-modal__gps101-question">"{stageQuestion}"</p>
              )}
            </div>
            
            {/* Stage Completer Info */}
            {isStageCompleter && deliverableName && (
              <div className="gps101-accept-modal__deliverable-unlock">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <div className="gps101-accept-modal__deliverable-text">
                  <strong>Stage Completer Mission</strong>
                  <p>Completing this unlocks your <span>{deliverableName}</span></p>
                </div>
              </div>
            )}
            
            <button
              type="button"
              onClick={handleStartMission}
              className="gps101-accept-modal__start-btn"
            >
              Start Mission
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        ) : (
          /* CONFIRMATION STATE */
          <>
            {/* GPS 101 Header Badge */}
            <div className="gps101-accept-modal__gps101-header">
              <div className="gps101-accept-modal__gps101-badge-large">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
                <div className="gps101-accept-modal__gps101-text">
                  <span className="gps101-accept-modal__gps101-label">GPS 101 Basic</span>
                  <span className="gps101-accept-modal__gps101-stage-label">Stage {stageNumber} {stageIcon}</span>
                </div>
              </div>
              
              {stageQuestion && (
                <p className="gps101-accept-modal__gps101-question-small">"{stageQuestion}"</p>
              )}
            </div>
            
            {/* Modal Header */}
            <div className="gps101-accept-modal__header">
              <div className="gps101-accept-modal__icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <h2 className="gps101-accept-modal__title">Accept Mission?</h2>
              <p className="gps101-accept-modal__subtitle">{title}</p>
            </div>
            
            {/* Modal Content */}
            <div className="gps101-accept-modal__content">
              <p className="gps101-accept-modal__desc">{description}</p>
              
              {/* Mission Structure Info */}
              <div className="gps101-accept-modal__info">
                <div className="gps101-accept-modal__info-item">
                  <span className="gps101-accept-modal__info-label">Sub-missions</span>
                  <span className="gps101-accept-modal__info-value">{subMissionsCount}</span>
                </div>
                <div className="gps101-accept-modal__info-item">
                  <span className="gps101-accept-modal__info-label">Checkpoints</span>
                  <span className="gps101-accept-modal__info-value">{checkpointsCount}</span>
                </div>
                <div className="gps101-accept-modal__info-item">
                  <span className="gps101-accept-modal__info-label">Duration</span>
                  <span className="gps101-accept-modal__info-value">{estimatedTime}</span>
                </div>
                <div className="gps101-accept-modal__info-item">
                  <span className="gps101-accept-modal__info-label">Difficulty</span>
                  <span className="gps101-accept-modal__info-value">{difficulty}</span>
                </div>
              </div>
              
              {/* Stage Completer Banner */}
              {isStageCompleter && deliverableName && (
                <div className="gps101-accept-modal__stage-completer-banner">
                  <div className="gps101-accept-modal__stage-completer-icon">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <div className="gps101-accept-modal__stage-completer-text">
                    <h4>Stage Completer Mission</h4>
                    <p>Complete this mission to unlock your <strong>{deliverableName}</strong></p>
                  </div>
                </div>
              )}
              
              {/* Rewards */}
              <div className="gps101-accept-modal__rewards">
                <span className="gps101-accept-modal__rewards-label">Rewards:</span>
                {barakaReward > 0 && (
                  <span className="gps101-accept-modal__reward gps101-accept-modal__reward--baraka">
                    +{barakaReward} ƀ
                  </span>
                )}
                {xpReward > 0 && (
                  <span className="gps101-accept-modal__reward gps101-accept-modal__reward--xp">
                    +{xpReward} XP
                  </span>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="gps101-accept-modal__actions">
              <button
                type="button"
                onClick={onCancel || handleClose}
                disabled={isLoading}
                className="gps101-accept-modal__btn gps101-accept-modal__btn--cancel"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAccept}
                disabled={isLoading}
                className="gps101-accept-modal__btn gps101-accept-modal__btn--accept"
              >
                {isLoading ? (
                  <>
                    <span className="gps101-accept-modal__spinner" />
                    Accepting...
                  </>
                ) : (
                  <>
                    Accept Mission
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GPS101MissionAcceptModal;