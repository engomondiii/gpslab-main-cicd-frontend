/**
 * GPS Lab Platform - BiteListItem Component
 * 
 * Individual bite task card for list view display.
 * Integrates with mission system and Baraka rewards.
 * 
 * @module components/bite/BiteList/BiteListItem
 */

import React, { useMemo } from 'react';
import './BiteListItem.css';

/**
 * Bite status configuration
 */
export const BITE_STATUS = {
  backlog: { label: 'Backlog', color: 'neutral', icon: <svg viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg> },
  planned: { label: 'Planned', color: 'info', icon: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/></svg> },
  in_progress: { label: 'In Progress', color: 'warning', icon: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/></svg> },
  review: { label: 'In Review', color: 'primary', icon: <svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/></svg> },
  completed: { label: 'Completed', color: 'success', icon: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg> },
  blocked: { label: 'Blocked', color: 'error', icon: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 008.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd"/></svg> }
};

/**
 * Bite type configuration
 */
export const BITE_TYPE = {
  task: { label: 'Task', color: 'primary', icon: <svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg> },
  coding: { label: 'Coding', color: 'accent', icon: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg> },
  research: { label: 'Research', color: 'info', icon: <svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/></svg> },
  design: { label: 'Design', color: 'secondary', icon: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd"/></svg> },
  writing: { label: 'Writing', color: 'warning', icon: <svg viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"/><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"/></svg> },
  quiz: { label: 'Quiz', color: 'accent', icon: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/></svg> }
};

/**
 * Bite priority configuration
 */
export const BITE_PRIORITY = {
  low: { label: 'Low', color: 'success', weight: 1 },
  medium: { label: 'Medium', color: 'warning', weight: 2 },
  high: { label: 'High', color: 'error', weight: 3 },
  critical: { label: 'Critical', color: 'secondary', weight: 4 }
};

/**
 * Format time estimate
 */
const formatEstimate = (minutes) => {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

/**
 * BiteListItem Component
 */
const BiteListItem = ({
  id,
  title,
  description,
  type = 'task',
  status = 'backlog',
  priority = 'medium',
  missionId,
  missionTitle,
  stageNumber,
  estimatedTime,
  actualTime,
  progress = 0,
  xpReward = 0,
  barakaReward = 0,
  dueDate,
  assignee,
  tags = [],
  dependencyCount = 0,
  blockedBy = [],
  onClick,
  onStatusChange,
  onQuickAction,
  size = 'medium',
  variant = 'default',
  showMission = true,
  showRewards = true,
  className = '',
  ...props
}) => {
  const statusConfig = BITE_STATUS[status] || BITE_STATUS.backlog;
  const typeConfig = BITE_TYPE[type] || BITE_TYPE.task;
  const priorityConfig = BITE_PRIORITY[priority] || BITE_PRIORITY.medium;
  
  const isBlocked = status === 'blocked' || blockedBy.length > 0;
  const isCompleted = status === 'completed';
  const isInProgress = status === 'in_progress';
  const isOverdue = dueDate && new Date(dueDate) < new Date() && !isCompleted;
  
  const formattedDueDate = useMemo(() => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, [dueDate]);
  
  const handleClick = () => {
    if (onClick) onClick(id);
  };
  
  const handleStatusClick = (e) => {
    e.stopPropagation();
    if (onStatusChange) onStatusChange(id, status);
  };
  
  const classNames = [
    'bite-list-item',
    `bite-list-item--${status}`,
    `bite-list-item--${size}`,
    `bite-list-item--${variant}`,
    isBlocked && 'bite-list-item--blocked',
    isOverdue && 'bite-list-item--overdue',
    onClick && 'bite-list-item--clickable',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div 
      className={classNames} 
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {/* Left Section - Type & Priority */}
      <div className="bite-list-item__left">
        <div className={`bite-list-item__type bite-list-item__type--${typeConfig.color}`}>
          {typeConfig.icon}
        </div>
        <div className={`bite-list-item__priority bite-list-item__priority--${priorityConfig.color}`}>
          <span className="bite-list-item__priority-dot" />
        </div>
      </div>
      
      {/* Content Section */}
      <div className="bite-list-item__content">
        {/* Header Row */}
        <div className="bite-list-item__header">
          <div className="bite-list-item__title-row">
            <span className="bite-list-item__id">#{id.slice(-6)}</span>
            <h4 className="bite-list-item__title">{title}</h4>
          </div>
          
          {/* Status Badge */}
          <button 
            type="button"
            onClick={handleStatusClick}
            className={`bite-list-item__status bite-list-item__status--${statusConfig.color}`}
          >
            {statusConfig.icon}
            <span>{statusConfig.label}</span>
          </button>
        </div>
        
        {/* Description */}
        {description && (
          <p className="bite-list-item__description">{description}</p>
        )}
        
        {/* Mission Link */}
        {showMission && missionTitle && (
          <div className="bite-list-item__mission">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd"/>
            </svg>
            <span>{stageNumber && `S${stageNumber} • `}{missionTitle}</span>
          </div>
        )}
        
        {/* Progress Bar (when in progress) */}
        {isInProgress && progress > 0 && (
          <div className="bite-list-item__progress">
            <div className="bite-list-item__progress-bar">
              <div 
                className="bite-list-item__progress-fill" 
                style={{ width: `${progress}%` }} 
              />
            </div>
            <span className="bite-list-item__progress-text">{progress}%</span>
          </div>
        )}
        
        {/* Meta Row */}
        <div className="bite-list-item__meta">
          {/* Time Estimate */}
          {estimatedTime && (
            <div className="bite-list-item__meta-item">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
              <span>{formatEstimate(estimatedTime)}</span>
            </div>
          )}
          
          {/* Due Date */}
          {formattedDueDate && (
            <div className={`bite-list-item__meta-item ${isOverdue ? 'bite-list-item__meta-item--overdue' : ''}`}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
              </svg>
              <span>{formattedDueDate}</span>
            </div>
          )}
          
          {/* Dependencies */}
          {dependencyCount > 0 && (
            <div className="bite-list-item__meta-item">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
              </svg>
              <span>{dependencyCount} deps</span>
            </div>
          )}
          
          {/* Blocked Indicator */}
          {isBlocked && blockedBy.length > 0 && (
            <div className="bite-list-item__meta-item bite-list-item__meta-item--blocked">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd"/>
              </svg>
              <span>Blocked by {blockedBy.length}</span>
            </div>
          )}
          
          {/* Tags */}
          {tags.length > 0 && (
            <div className="bite-list-item__tags">
              {tags.slice(0, 3).map(tag => (
                <span key={tag} className="bite-list-item__tag">{tag}</span>
              ))}
              {tags.length > 3 && (
                <span className="bite-list-item__tag bite-list-item__tag--more">+{tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Right Section - Rewards & Assignee */}
      <div className="bite-list-item__right">
        {/* Rewards */}
        {showRewards && (xpReward > 0 || barakaReward > 0) && !isCompleted && (
          <div className="bite-list-item__rewards">
            {xpReward > 0 && (
              <span className="bite-list-item__reward bite-list-item__reward--xp">
                +{xpReward} XP
              </span>
            )}
            {barakaReward > 0 && (
              <span className="bite-list-item__reward bite-list-item__reward--baraka">
                +{barakaReward} ƀ
              </span>
            )}
          </div>
        )}
        
        {/* Completed Badge */}
        {isCompleted && (
          <div className="bite-list-item__completed-badge">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
          </div>
        )}
        
        {/* Assignee */}
        {assignee && (
          <div className="bite-list-item__assignee" title={assignee.name}>
            {assignee.avatar ? (
              <img src={assignee.avatar} alt={assignee.name} />
            ) : (
              <span>{assignee.name?.charAt(0) || '?'}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BiteListItem;