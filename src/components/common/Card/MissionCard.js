/**
 * GPS Lab Platform - MissionCard Component
 * 
 * Specialized card for displaying missions with
 * progress, rewards, and status information.
 * 
 * @module components/common/Card/MissionCard
 * @version 1.0.0
 */

import React from 'react';
import Card from './Card';
import './MissionCard.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const MISSION_STATUS = {
  LOCKED: 'locked',
  AVAILABLE: 'available',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

export const MISSION_DIFFICULTY = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert'
};

// Status icons
const STATUS_ICONS = {
  [MISSION_STATUS.LOCKED]: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
  ),
  [MISSION_STATUS.AVAILABLE]: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
    </svg>
  ),
  [MISSION_STATUS.IN_PROGRESS]: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
    </svg>
  ),
  [MISSION_STATUS.COMPLETED]: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  [MISSION_STATUS.FAILED]: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  )
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * MissionCard component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.mission - Mission data
 * @param {string} props.mission.id - Mission ID
 * @param {string} props.mission.title - Mission title
 * @param {string} props.mission.description - Mission description
 * @param {number} props.mission.stageNumber - Stage number (1-35)
 * @param {string} props.mission.status - Mission status
 * @param {string} props.mission.difficulty - Mission difficulty
 * @param {number} [props.mission.progress=0] - Progress percentage
 * @param {number} [props.mission.barakaReward] - Baraka reward amount
 * @param {number} [props.mission.xpReward] - XP reward amount
 * @param {number} [props.mission.bitesCount] - Total bites count
 * @param {number} [props.mission.completedBites] - Completed bites count
 * @param {string} [props.mission.estimatedTime] - Estimated time
 * @param {string} [props.mission.thumbnail] - Thumbnail image URL
 * @param {boolean} [props.compact=false] - Compact display mode
 * @param {boolean} [props.showProgress=true] - Show progress bar
 * @param {Function} [props.onClick] - Click handler
 * @param {Function} [props.onAccept] - Accept mission handler
 */
const MissionCard = ({
  mission,
  compact = false,
  showProgress = true,
  className = '',
  onClick,
  onAccept,
  ...props
}) => {
  
  const {
    id,
    title,
    description,
    stageNumber,
    status = MISSION_STATUS.AVAILABLE,
    difficulty = MISSION_DIFFICULTY.BEGINNER,
    progress = 0,
    barakaReward,
    xpReward,
    bitesCount,
    completedBites,
    estimatedTime,
    thumbnail
  } = mission;
  
  // Determine if card is interactive
  const isClickable = status !== MISSION_STATUS.LOCKED && onClick;
  const isDisabled = status === MISSION_STATUS.LOCKED;
  
  // Build class names
  const classNames = [
    'mission-card',
    `mission-card--${status}`,
    `mission-card--${difficulty}`,
    compact && 'mission-card--compact',
    className
  ].filter(Boolean).join(' ');
  
  // Handle accept button click
  const handleAccept = (e) => {
    e.stopPropagation();
    onAccept?.(mission);
  };
  
  return (
    <Card
      variant="outlined"
      padding={compact ? 'sm' : 'md'}
      clickable={isClickable}
      disabled={isDisabled}
      className={classNames}
      onClick={() => isClickable && onClick?.(mission)}
      {...props}
    >
      {/* Thumbnail */}
      {thumbnail && !compact && (
        <div className="mission-card__thumbnail">
          <img src={thumbnail} alt={title} />
          <div className="mission-card__stage-badge">
            Stage {stageNumber}
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="mission-card__content">
        {/* Header */}
        <div className="mission-card__header">
          <div className="mission-card__title-row">
            {compact && (
              <span className="mission-card__stage-number">
                S{stageNumber}
              </span>
            )}
            <h3 className="mission-card__title">{title}</h3>
          </div>
          
          {/* Status badge */}
          <div className={`mission-card__status mission-card__status--${status}`}>
            <span className="mission-card__status-icon">
              {STATUS_ICONS[status]}
            </span>
            <span className="mission-card__status-text">
              {status.replace('-', ' ')}
            </span>
          </div>
        </div>
        
        {/* Description */}
        {!compact && description && (
          <p className="mission-card__description">{description}</p>
        )}
        
        {/* Meta info */}
        <div className="mission-card__meta">
          {/* Difficulty */}
          <span className={`mission-card__difficulty mission-card__difficulty--${difficulty}`}>
            {difficulty}
          </span>
          
          {/* Estimated time */}
          {estimatedTime && (
            <span className="mission-card__time">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {estimatedTime}
            </span>
          )}
          
          {/* Bites count */}
          {bitesCount !== undefined && (
            <span className="mission-card__bites">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              {completedBites !== undefined ? `${completedBites}/${bitesCount}` : bitesCount} bites
            </span>
          )}
        </div>
        
        {/* Progress bar */}
        {showProgress && status === MISSION_STATUS.IN_PROGRESS && (
          <div className="mission-card__progress">
            <div className="mission-card__progress-bar">
              <div 
                className="mission-card__progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="mission-card__progress-text">{progress}%</span>
          </div>
        )}
        
        {/* Rewards */}
        {(barakaReward || xpReward) && (
          <div className="mission-card__rewards">
            {barakaReward && (
              <span className="mission-card__reward mission-card__reward--baraka">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                {barakaReward} Baraka
              </span>
            )}
            {xpReward && (
              <span className="mission-card__reward mission-card__reward--xp">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
                {xpReward} XP
              </span>
            )}
          </div>
        )}
        
        {/* Accept button */}
        {status === MISSION_STATUS.AVAILABLE && onAccept && (
          <button 
            className="mission-card__accept-btn"
            onClick={handleAccept}
          >
            Accept Mission
          </button>
        )}
      </div>
    </Card>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default MissionCard;