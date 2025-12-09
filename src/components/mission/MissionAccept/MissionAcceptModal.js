/**
 * GPS Lab Platform - MissionAcceptModal Component
 * 
 * Modal confirmation dialog for accepting a mission.
 * 
 * @module components/mission/MissionAccept/MissionAcceptModal
 */

import React, { useState, useCallback } from 'react';
import './MissionAcceptModal.css';

/**
 * MissionAcceptModal Component
 */
const MissionAcceptModal = ({
  isOpen = false,
  mission = {},
  onAccept,
  onCancel,
  onClose,
  isLoading = false,
  className = '',
  ...props
}) => {
  const [accepted, setAccepted] = useState(false);
  
  const {
    id,
    title,
    description,
    difficulty,
    estimatedTime,
    xpReward = 0,
    barakaReward = 0,
    objectives = []
  } = mission;
  
  const handleAccept = useCallback(async () => {
    try {
      await onAccept?.(id);
      setAccepted(true);
    } catch (error) {
      console.error('Failed to accept mission:', error);
    }
  }, [id, onAccept]);
  
  const handleClose = useCallback(() => {
    setAccepted(false);
    onClose?.();
  }, [onClose]);
  
  if (!isOpen) return null;
  
  const classNames = ['mission-accept-modal', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Backdrop */}
      <div className="mission-accept-modal__backdrop" onClick={handleClose} />
      
      {/* Dialog */}
      <div className="mission-accept-modal__dialog">
        {/* Close Button */}
        <button type="button" onClick={handleClose} className="mission-accept-modal__close">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
        
        {accepted ? (
          /* Success State */
          <div className="mission-accept-modal__success">
            <div className="mission-accept-modal__success-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h2 className="mission-accept-modal__success-title">Mission Accepted!</h2>
            <p className="mission-accept-modal__success-text">You've accepted "{title}". Good luck on your journey!</p>
            <button type="button" onClick={handleClose} className="mission-accept-modal__start-btn">
              Start Mission
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        ) : (
          /* Confirmation State */
          <>
            <div className="mission-accept-modal__header">
              <div className="mission-accept-modal__icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <h2 className="mission-accept-modal__title">Accept Mission?</h2>
              <p className="mission-accept-modal__subtitle">{title}</p>
            </div>
            
            <div className="mission-accept-modal__content">
              <p className="mission-accept-modal__desc">{description}</p>
              
              {/* Quick Info */}
              <div className="mission-accept-modal__info">
                {difficulty && (
                  <div className="mission-accept-modal__info-item">
                    <span className="mission-accept-modal__info-label">Difficulty</span>
                    <span className="mission-accept-modal__info-value">{difficulty}</span>
                  </div>
                )}
                {estimatedTime && (
                  <div className="mission-accept-modal__info-item">
                    <span className="mission-accept-modal__info-label">Duration</span>
                    <span className="mission-accept-modal__info-value">{estimatedTime} min</span>
                  </div>
                )}
                {objectives.length > 0 && (
                  <div className="mission-accept-modal__info-item">
                    <span className="mission-accept-modal__info-label">Objectives</span>
                    <span className="mission-accept-modal__info-value">{objectives.length}</span>
                  </div>
                )}
              </div>
              
              {/* Rewards Preview */}
              <div className="mission-accept-modal__rewards">
                <span className="mission-accept-modal__rewards-label">Rewards:</span>
                {xpReward > 0 && (
                  <span className="mission-accept-modal__reward mission-accept-modal__reward--xp">+{xpReward} XP</span>
                )}
                {barakaReward > 0 && (
                  <span className="mission-accept-modal__reward mission-accept-modal__reward--baraka">+{barakaReward} ƀ</span>
                )}
              </div>
            </div>
            
            <div className="mission-accept-modal__actions">
              <button type="button" onClick={onCancel || handleClose} className="mission-accept-modal__btn mission-accept-modal__btn--cancel">
                Cancel
              </button>
              <button type="button" onClick={handleAccept} disabled={isLoading} className="mission-accept-modal__btn mission-accept-modal__btn--accept">
                {isLoading ? (
                  <>
                    <span className="mission-accept-modal__spinner" />
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

export default MissionAcceptModal;