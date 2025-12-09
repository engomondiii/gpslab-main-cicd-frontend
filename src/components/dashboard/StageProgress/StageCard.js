/**
 * GPS Lab Platform - StageCard Component
 * 
 * Card displaying individual stage information.
 * Used in StageProgressMap and stage listing.
 * 
 * @module components/dashboard/StageProgress/StageCard
 */

import React from 'react';
import './StageCard.css';

/**
 * Stage status configurations
 */
const STAGE_STATUS = {
  locked: {
    label: 'Locked',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
      </svg>
    )
  },
  available: {
    label: 'Available',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd"/>
      </svg>
    )
  },
  in_progress: {
    label: 'In Progress',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
      </svg>
    )
  },
  completed: {
    label: 'Completed',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
      </svg>
    )
  }
};

/**
 * StageCard Component
 */
const StageCard = ({
  stageNumber,
  title,
  description,
  status = 'locked',
  progress = 0,
  missionsTotal = 0,
  missionsCompleted = 0,
  xpReward = 0,
  barakaReward = 0,
  adventureId,
  adventureTitle,
  onClick,
  size = 'medium',
  variant = 'default',
  className = '',
  ...props
}) => {
  const statusConfig = STAGE_STATUS[status] || STAGE_STATUS.locked;
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  
  const classNames = [
    'stage-card',
    `stage-card--${status}`,
    `stage-card--${size}`,
    `stage-card--${variant}`,
    onClick && !isLocked && 'stage-card--clickable',
    className
  ].filter(Boolean).join(' ');
  
  const handleClick = () => {
    if (!isLocked && onClick) {
      onClick(stageNumber);
    }
  };
  
  return (
    <div 
      className={classNames}
      onClick={handleClick}
      role={onClick && !isLocked ? 'button' : undefined}
      tabIndex={onClick && !isLocked ? 0 : undefined}
      aria-disabled={isLocked}
      {...props}
    >
      {/* Stage Number Badge */}
      <div className="stage-card__badge">
        <span className="stage-card__number">{stageNumber}</span>
        {isCompleted && (
          <span className="stage-card__check">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
          </span>
        )}
      </div>
      
      {/* Content */}
      <div className="stage-card__content">
        {/* Adventure Label */}
        {adventureTitle && (
          <span className="stage-card__adventure">
            {adventureTitle}
          </span>
        )}
        
        {/* Title */}
        <h3 className="stage-card__title">{title}</h3>
        
        {/* Description */}
        {description && (
          <p className="stage-card__description">{description}</p>
        )}
        
        {/* Status */}
        <div className="stage-card__status">
          <span className="stage-card__status-icon">
            {statusConfig.icon}
          </span>
          <span className="stage-card__status-label">
            {statusConfig.label}
          </span>
        </div>
        
        {/* Progress (if in progress) */}
        {status === 'in_progress' && (
          <div className="stage-card__progress">
            <div className="stage-card__progress-bar">
              <div 
                className="stage-card__progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="stage-card__progress-text">
              {progress}% complete
            </span>
          </div>
        )}
        
        {/* Missions */}
        {missionsTotal > 0 && (
          <div className="stage-card__missions">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
            </svg>
            <span>{missionsCompleted}/{missionsTotal} missions</span>
          </div>
        )}
        
        {/* Rewards */}
        {(xpReward > 0 || barakaReward > 0) && !isLocked && (
          <div className="stage-card__rewards">
            {xpReward > 0 && (
              <span className="stage-card__reward stage-card__reward--xp">
                +{xpReward} XP
              </span>
            )}
            {barakaReward > 0 && (
              <span className="stage-card__reward stage-card__reward--baraka">
                +{barakaReward} ƀ
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Locked Overlay */}
      {isLocked && (
        <div className="stage-card__locked-overlay">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
        </div>
      )}
    </div>
  );
};

export { STAGE_STATUS };
export default StageCard;