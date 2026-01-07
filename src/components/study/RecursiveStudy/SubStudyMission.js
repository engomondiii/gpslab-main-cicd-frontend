/**
 * GPS Lab Platform - SubStudyMission Component
 * 
 * Nested study mission component for recursive study flows.
 * Represents a sub-mission that can be drilled into from a parent mission.
 * 
 * @module components/study/RecursiveStudy/SubStudyMission
 */

import React from 'react';
import './SubStudyMission.css';

/**
 * SubStudyMission Component
 */
const SubStudyMission = ({
  id,
  title,
  description,
  depth = 0,
  progress = 0,
  status = 'not_started',
  moduleCount = 0,
  completedModules = 0,
  duration,
  isExpanded = false,
  children,
  onToggle,
  onSelect,
  onStart,
  className = '',
  ...props
}) => {
  const isCompleted = status === 'completed';
  const isInProgress = status === 'in_progress';
  const hasChildren = React.Children.count(children) > 0;
  
  const classNames = [
    'sub-study-mission',
    `sub-study-mission--depth-${Math.min(depth, 3)}`,
    `sub-study-mission--${status}`,
    isExpanded && 'sub-study-mission--expanded',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Main Card */}
      <div className="sub-study-mission__card">
        {/* Expand Toggle */}
        {hasChildren && (
          <button
            type="button"
            className="sub-study-mission__toggle"
            onClick={() => onToggle && onToggle(id)}
            aria-expanded={isExpanded}
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        )}
        
        {/* Status Indicator */}
        <div className="sub-study-mission__status-indicator">
          {isCompleted ? (
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
          ) : isInProgress ? (
            <div className="sub-study-mission__progress-ring">
              <svg viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3"/>
                <circle 
                  cx="18" cy="18" r="16" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3"
                  strokeDasharray={`${progress} 100`}
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                />
              </svg>
            </div>
          ) : (
            <span className="sub-study-mission__bullet" />
          )}
        </div>
        
        {/* Content */}
        <div 
          className="sub-study-mission__content"
          onClick={() => onSelect && onSelect(id)}
        >
          <h4 className="sub-study-mission__title">{title}</h4>
          {description && (
            <p className="sub-study-mission__description">{description}</p>
          )}
          
          <div className="sub-study-mission__meta">
            <span className="sub-study-mission__modules">
              {completedModules}/{moduleCount} modules
            </span>
            {duration && (
              <span className="sub-study-mission__duration">{duration}</span>
            )}
          </div>
        </div>
        
        {/* Action */}
        <button
          type="button"
          className="sub-study-mission__action"
          onClick={() => onStart && onStart(id)}
        >
          {isCompleted ? (
            <span>Review</span>
          ) : isInProgress ? (
            <span>Continue</span>
          ) : (
            <span>Start</span>
          )}
        </button>
      </div>
      
      {/* Nested Children */}
      {hasChildren && isExpanded && (
        <div className="sub-study-mission__children">
          {children}
        </div>
      )}
    </div>
  );
};

export default SubStudyMission;