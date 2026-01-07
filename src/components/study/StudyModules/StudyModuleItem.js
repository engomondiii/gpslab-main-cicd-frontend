/**
 * GPS Lab Platform - StudyModuleItem Component
 * 
 * Individual study module item within a mission.
 * Shows module status, content type, and duration.
 * 
 * @module components/study/StudyModules/StudyModuleItem
 */

import React from 'react';
import './StudyModuleItem.css';

/**
 * Content type icons
 */
const CONTENT_TYPE_ICONS = {
  video: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
    </svg>
  ),
  reading: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
    </svg>
  ),
  interactive: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.321A1 1 0 0113.277 17H6.723a1 1 0 01-.384-1.924l.804-.32.122-.49H5a2 2 0 01-2-2V5zm2 0v8h10V5H5z" clipRule="evenodd"/>
    </svg>
  ),
  quiz: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
    </svg>
  ),
  exercise: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
    </svg>
  ),
  default: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
    </svg>
  )
};

/**
 * StudyModuleItem Component
 */
const StudyModuleItem = ({
  id,
  number,
  title,
  description,
  contentType = 'reading',
  duration,
  status = 'not_started', // not_started, in_progress, completed
  progress = 0,
  isLocked = false,
  isCurrent = false,
  onSelect,
  variant = 'default', // default, compact
  className = '',
  ...props
}) => {
  const isCompleted = status === 'completed';
  const isInProgress = status === 'in_progress';
  
  const handleClick = () => {
    if (!isLocked && onSelect) {
      onSelect(id);
    }
  };
  
  const classNames = [
    'study-module-item',
    `study-module-item--${variant}`,
    `study-module-item--${status}`,
    isLocked && 'study-module-item--locked',
    isCurrent && 'study-module-item--current',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      type="button"
      className={classNames}
      onClick={handleClick}
      disabled={isLocked}
      {...props}
    >
      {/* Number Badge */}
      <div className="study-module-item__number">
        {isCompleted ? (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
          </svg>
        ) : isLocked ? (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
          </svg>
        ) : (
          <span>{number}</span>
        )}
      </div>
      
      {/* Content */}
      <div className="study-module-item__content">
        <div className="study-module-item__header">
          <h4 className="study-module-item__title">{title}</h4>
          
          <div className="study-module-item__badges">
            <span className="study-module-item__type">
              {CONTENT_TYPE_ICONS[contentType] || CONTENT_TYPE_ICONS.default}
              {contentType}
            </span>
            {duration && (
              <span className="study-module-item__duration">{duration}</span>
            )}
          </div>
        </div>
        
        {variant !== 'compact' && description && (
          <p className="study-module-item__description">{description}</p>
        )}
        
        {/* Progress Bar (for in-progress) */}
        {isInProgress && progress > 0 && (
          <div className="study-module-item__progress">
            <div className="study-module-item__progress-bar">
              <div 
                className="study-module-item__progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="study-module-item__progress-text">{progress}%</span>
          </div>
        )}
      </div>
      
      {/* Action Icon */}
      <div className="study-module-item__action">
        {isCompleted ? (
          <span className="study-module-item__status study-module-item__status--completed">
            Done
          </span>
        ) : isCurrent ? (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
          </svg>
        )}
      </div>
    </button>
  );
};

export default StudyModuleItem;