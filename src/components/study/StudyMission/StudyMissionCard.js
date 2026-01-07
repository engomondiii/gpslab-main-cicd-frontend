/**
 * GPS Lab Platform - StudyMissionCard Component
 * 
 * Card component for displaying study mission summary information.
 * Shows mission details, progress, and quick action buttons.
 * 
 * @module components/study/StudyMission/StudyMissionCard
 */

import React from 'react';
import './StudyMissionCard.css';

/**
 * Get beacon color for stage
 */
const getBeaconColor = (stage) => {
  const colors = {
    1: 'var(--beacon-red, #e74c3c)',
    2: 'var(--beacon-orange, #f39c12)',
    3: 'var(--beacon-yellow, #f1c40f)',
    4: 'var(--beacon-green, #2ecc71)',
    5: 'var(--beacon-blue, #3498db)',
    6: 'var(--beacon-indigo, #9b59b6)',
    7: 'var(--beacon-purple, #8e44ad)'
  };
  return colors[stage] || 'var(--gps-primary, #00d4ff)';
};

/**
 * StudyMissionCard Component
 */
const StudyMissionCard = ({
  id,
  title,
  description,
  stage = 1,
  moduleCount = 0,
  completedModules = 0,
  duration,
  difficulty,
  progress = 0,
  status = 'not_started', // not_started, in_progress, completed
  tags = [],
  r2rReward = 0,
  xpReward = 0,
  isNew = false,
  isRequired = false,
  isRecommended = false,
  isLocked = false,
  lockedReason,
  onStart,
  onContinue,
  onView,
  variant = 'default', // default, compact, featured
  className = '',
  ...props
}) => {
  const beaconColor = getBeaconColor(stage);
  const isCompleted = status === 'completed';
  const isInProgress = status === 'in_progress';
  
  const handleClick = () => {
    if (isLocked) return;
    if (isCompleted || isInProgress) {
      onView && onView(id);
    } else {
      onStart && onStart(id);
    }
  };
  
  const handleActionClick = (e) => {
    e.stopPropagation();
    if (isLocked) return;
    if (isInProgress) {
      onContinue && onContinue(id);
    } else {
      onStart && onStart(id);
    }
  };
  
  const classNames = [
    'study-mission-card',
    `study-mission-card--${variant}`,
    `study-mission-card--${status}`,
    isLocked && 'study-mission-card--locked',
    isRecommended && 'study-mission-card--recommended',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <article 
      className={classNames}
      style={{ '--beacon-color': beaconColor }}
      onClick={handleClick}
      {...props}
    >
      {/* Lock Overlay */}
      {isLocked && (
        <div className="study-mission-card__locked-overlay">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
          </svg>
          {lockedReason && <span>{lockedReason}</span>}
        </div>
      )}
      
      {/* Header */}
      <div className="study-mission-card__header">
        <div className="study-mission-card__beacon-wrap">
          <span className="study-mission-card__beacon" />
          <span className="study-mission-card__stage">Stage {stage}</span>
        </div>
        
        <div className="study-mission-card__badges">
          {isNew && (
            <span className="study-mission-card__badge study-mission-card__badge--new">New</span>
          )}
          {isRequired && (
            <span className="study-mission-card__badge study-mission-card__badge--required">Required</span>
          )}
          {isRecommended && (
            <span className="study-mission-card__badge study-mission-card__badge--recommended">⭐ For You</span>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="study-mission-card__content">
        <h3 className="study-mission-card__title">{title}</h3>
        
        {variant !== 'compact' && description && (
          <p className="study-mission-card__description">{description}</p>
        )}
        
        {/* Tags */}
        {variant !== 'compact' && tags.length > 0 && (
          <div className="study-mission-card__tags">
            {tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="study-mission-card__tag">{tag}</span>
            ))}
            {tags.length > 3 && (
              <span className="study-mission-card__tag study-mission-card__tag--more">+{tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
      
      {/* Meta Information */}
      <div className="study-mission-card__meta">
        <div className="study-mission-card__meta-item">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
          </svg>
          <span>{duration || '15 min'}</span>
        </div>
        
        <div className="study-mission-card__meta-item">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
          </svg>
          <span>{completedModules}/{moduleCount} modules</span>
        </div>
        
        {difficulty && (
          <div className="study-mission-card__meta-item study-mission-card__difficulty">
            <span className={`study-mission-card__difficulty-badge study-mission-card__difficulty-badge--${difficulty.toLowerCase()}`}>
              {difficulty}
            </span>
          </div>
        )}
      </div>
      
      {/* Rewards */}
      {variant !== 'compact' && (r2rReward > 0 || xpReward > 0) && (
        <div className="study-mission-card__rewards">
          {xpReward > 0 && (
            <span className="study-mission-card__reward study-mission-card__reward--xp">
              <span className="study-mission-card__reward-icon">⚡</span>
              +{xpReward} XP
            </span>
          )}
          {r2rReward > 0 && (
            <span className="study-mission-card__reward study-mission-card__reward--r2r">
              <span className="study-mission-card__reward-icon">🔄</span>
              +{r2rReward} R2R
            </span>
          )}
        </div>
      )}
      
      {/* Progress */}
      {(isInProgress || isCompleted) && progress > 0 && (
        <div className="study-mission-card__progress">
          <div className="study-mission-card__progress-bar">
            <div 
              className="study-mission-card__progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="study-mission-card__progress-text">
            {isCompleted ? (
              <span className="study-mission-card__completed-text">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Completed
              </span>
            ) : (
              `${progress}%`
            )}
          </span>
        </div>
      )}
      
      {/* Action Button */}
      {!isLocked && variant !== 'compact' && (
        <button
          type="button"
          className="study-mission-card__action"
          onClick={handleActionClick}
        >
          {isCompleted ? (
            <>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
              </svg>
              Review
            </>
          ) : isInProgress ? (
            <>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
              </svg>
              Continue
            </>
          ) : (
            <>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
              </svg>
              Start
            </>
          )}
        </button>
      )}
    </article>
  );
};

export default StudyMissionCard;