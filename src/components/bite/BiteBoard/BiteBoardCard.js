/**
 * GPS Lab Platform - BiteBoardCard Component
 * 
 * Draggable card for Kanban board display.
 * 
 * @module components/bite/BiteBoard/BiteBoardCard
 */

import React, { useRef } from 'react';
import { BITE_TYPE, BITE_PRIORITY } from '../BiteList/BiteListItem';
import './BiteBoardCard.css';

/**
 * BiteBoardCard Component
 */
const BiteBoardCard = ({
  id,
  title,
  description,
  type = 'task',
  priority = 'medium',
  estimatedTime,
  progress = 0,
  xpReward = 0,
  barakaReward = 0,
  dueDate,
  assignee,
  tags = [],
  blockedBy = [],
  missionTitle,
  stageNumber,
  onClick,
  onDragStart,
  onDragEnd,
  isDragging = false,
  isDropTarget = false,
  className = '',
  ...props
}) => {
  const cardRef = useRef(null);
  
  const typeConfig = BITE_TYPE[type] || BITE_TYPE.task;
  const priorityConfig = BITE_PRIORITY[priority] || BITE_PRIORITY.medium;
  
  const isBlocked = blockedBy.length > 0;
  const isOverdue = dueDate && new Date(dueDate) < new Date();
  
  const formatTime = (minutes) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h`;
  };
  
  const formatDueDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Today';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    if (cardRef.current) {
      e.dataTransfer.setDragImage(cardRef.current, 20, 20);
    }
    onDragStart?.(id);
  };
  
  const handleDragEnd = () => {
    onDragEnd?.(id);
  };
  
  const handleClick = () => {
    onClick?.(id);
  };
  
  const classNames = [
    'bite-board-card',
    `bite-board-card--priority-${priority}`,
    isDragging && 'bite-board-card--dragging',
    isDropTarget && 'bite-board-card--drop-target',
    isBlocked && 'bite-board-card--blocked',
    isOverdue && 'bite-board-card--overdue',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div
      ref={cardRef}
      className={classNames}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      {...props}
    >
      {/* Priority Indicator */}
      <div className={`bite-board-card__priority bite-board-card__priority--${priorityConfig.color}`} />
      
      {/* Header */}
      <div className="bite-board-card__header">
        <div className={`bite-board-card__type bite-board-card__type--${typeConfig.color}`}>
          {typeConfig.icon}
        </div>
        <span className="bite-board-card__id">#{id.slice(-6)}</span>
      </div>
      
      {/* Title */}
      <h4 className="bite-board-card__title">{title}</h4>
      
      {/* Description */}
      {description && (
        <p className="bite-board-card__description">{description}</p>
      )}
      
      {/* Mission Badge */}
      {missionTitle && (
        <div className="bite-board-card__mission">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd"/>
          </svg>
          <span>{stageNumber && `S${stageNumber} • `}{missionTitle}</span>
        </div>
      )}
      
      {/* Progress */}
      {progress > 0 && progress < 100 && (
        <div className="bite-board-card__progress">
          <div className="bite-board-card__progress-bar">
            <div className="bite-board-card__progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="bite-board-card__progress-text">{progress}%</span>
        </div>
      )}
      
      {/* Tags */}
      {tags.length > 0 && (
        <div className="bite-board-card__tags">
          {tags.slice(0, 2).map(tag => (
            <span key={tag} className="bite-board-card__tag">{tag}</span>
          ))}
          {tags.length > 2 && (
            <span className="bite-board-card__tag bite-board-card__tag--more">+{tags.length - 2}</span>
          )}
        </div>
      )}
      
      {/* Footer */}
      <div className="bite-board-card__footer">
        <div className="bite-board-card__meta">
          {/* Time Estimate */}
          {estimatedTime && (
            <span className="bite-board-card__meta-item">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
              {formatTime(estimatedTime)}
            </span>
          )}
          
          {/* Due Date */}
          {dueDate && (
            <span className={`bite-board-card__meta-item ${isOverdue ? 'bite-board-card__meta-item--overdue' : ''}`}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
              </svg>
              {formatDueDate(dueDate)}
            </span>
          )}
          
          {/* Blocked */}
          {isBlocked && (
            <span className="bite-board-card__meta-item bite-board-card__meta-item--blocked">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd"/>
              </svg>
            </span>
          )}
        </div>
        
        {/* Rewards & Assignee */}
        <div className="bite-board-card__actions">
          {/* XP */}
          {xpReward > 0 && (
            <span className="bite-board-card__reward bite-board-card__reward--xp">
              +{xpReward}
            </span>
          )}
          
          {/* Assignee */}
          {assignee && (
            <div className="bite-board-card__assignee" title={assignee.name}>
              {assignee.avatar ? (
                <img src={assignee.avatar} alt={assignee.name} />
              ) : (
                <span>{assignee.name?.charAt(0) || '?'}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BiteBoardCard;