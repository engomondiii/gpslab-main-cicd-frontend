/**
 * GPS Lab Platform - BiteDetail Component
 * 
 * Complete bite task detail view with all sections.
 * 
 * @module components/bite/BiteDetail/BiteDetail
 */

import React, { useState } from 'react';
import BiteDescription from './BiteDescription';
import BiteAcceptanceCriteria from './BiteAcceptanceCriteria';
import BiteDependencies from './BiteDependencies';
import { BITE_STATUS, BITE_TYPE, BITE_PRIORITY } from '../BiteList/BiteListItem';
import './BiteDetail.css';

/**
 * BiteDetail Component
 */
const BiteDetail = ({
  bite,
  onBack,
  onStatusChange,
  onEdit,
  onDelete,
  onCriteriaToggle,
  onCriteriaAdd,
  onCriteriaRemove,
  onCriteriaEdit,
  onDependencyClick,
  onAddDependency,
  onRemoveDependency,
  onStartWork,
  onSubmit,
  isEditable = false,
  isLoading = false,
  className = '',
  ...props
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  if (!bite && !isLoading) return null;
  
  const statusConfig = BITE_STATUS[bite?.status] || BITE_STATUS.backlog;
  const typeConfig = BITE_TYPE[bite?.type] || BITE_TYPE.task;
  const priorityConfig = BITE_PRIORITY[bite?.priority] || BITE_PRIORITY.medium;
  
  const isCompleted = bite?.status === 'completed';
  const isInProgress = bite?.status === 'in_progress';
  const isBlocked = bite?.blockedBy?.length > 0 && bite?.blockedBy.some(b => b.status !== 'completed');
  
  const formatTime = (minutes) => {
    if (!minutes) return '--';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };
  
  const formatDate = (date) => {
    if (!date) return '--';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(bite.id);
    }
    setShowDeleteConfirm(false);
  };
  
  const classNames = [
    'bite-detail',
    isCompleted && 'bite-detail--completed',
    isBlocked && 'bite-detail--blocked',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {isLoading ? (
        <div className="bite-detail__loading">
          <div className="bite-detail__loading-header" />
          <div className="bite-detail__loading-content">
            <div className="bite-detail__loading-block" />
            <div className="bite-detail__loading-block" />
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="bite-detail__header">
            {/* Back Button */}
            {onBack && (
              <button type="button" onClick={onBack} className="bite-detail__back-btn">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                </svg>
                Back
              </button>
            )}
            
            {/* Title Section */}
            <div className="bite-detail__title-section">
              <div className="bite-detail__meta-row">
                <div className={`bite-detail__type bite-detail__type--${typeConfig.color}`}>
                  {typeConfig.icon}
                  <span>{typeConfig.label}</span>
                </div>
                <span className="bite-detail__id">#{bite.id.slice(-6)}</span>
                {bite.missionTitle && (
                  <span className="bite-detail__mission">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd"/>
                    </svg>
                    {bite.stageNumber && `S${bite.stageNumber} • `}{bite.missionTitle}
                  </span>
                )}
              </div>
              
              <h1 className="bite-detail__title">{bite.title}</h1>
              
              <div className="bite-detail__badges">
                <button
                  type="button"
                  onClick={() => onStatusChange?.(bite.id)}
                  className={`bite-detail__status bite-detail__status--${statusConfig.color}`}
                >
                  {statusConfig.icon}
                  <span>{statusConfig.label}</span>
                </button>
                
                <span className={`bite-detail__priority bite-detail__priority--${priorityConfig.color}`}>
                  <span className="bite-detail__priority-dot" />
                  {priorityConfig.label} Priority
                </span>
                
                {isBlocked && (
                  <span className="bite-detail__blocked-badge">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd"/>
                    </svg>
                    Blocked
                  </span>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="bite-detail__actions">
              {isEditable && onEdit && (
                <button type="button" onClick={() => onEdit(bite.id)} className="bite-detail__edit-btn">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"/>
                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"/>
                  </svg>
                  Edit
                </button>
              )}
              
              {isEditable && onDelete && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bite-detail__delete-btn"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {/* Info Bar */}
          <div className="bite-detail__info-bar">
            <div className="bite-detail__info-item">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
              <span className="bite-detail__info-label">Estimate</span>
              <span className="bite-detail__info-value">{formatTime(bite.estimatedTime)}</span>
            </div>
            
            <div className="bite-detail__info-item">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
              </svg>
              <span className="bite-detail__info-label">Due</span>
              <span className="bite-detail__info-value">{formatDate(bite.dueDate)}</span>
            </div>
            
            <div className="bite-detail__info-item">
              <span className="bite-detail__info-label">XP</span>
              <span className="bite-detail__info-value bite-detail__info-value--xp">+{bite.xpReward || 0}</span>
            </div>
            
            <div className="bite-detail__info-item">
              <span className="bite-detail__info-label">Baraka</span>
              <span className="bite-detail__info-value bite-detail__info-value--baraka">+{bite.barakaReward || 0} ƀ</span>
            </div>
            
            {bite.assignee && (
              <div className="bite-detail__info-item">
                <span className="bite-detail__info-label">Assignee</span>
                <div className="bite-detail__assignee">
                  {bite.assignee.avatar ? (
                    <img src={bite.assignee.avatar} alt={bite.assignee.name} />
                  ) : (
                    <span>{bite.assignee.name?.charAt(0)}</span>
                  )}
                  <span className="bite-detail__assignee-name">{bite.assignee.name}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Main Content */}
          <div className="bite-detail__content">
            <div className="bite-detail__main">
              {/* Description */}
              <BiteDescription
                description={bite.description}
                context={bite.context}
                learningObjectives={bite.learningObjectives}
                isEditable={isEditable}
              />
              
              {/* Acceptance Criteria */}
              <BiteAcceptanceCriteria
                criteria={bite.acceptanceCriteria || []}
                onToggle={onCriteriaToggle}
                onAdd={onCriteriaAdd}
                onRemove={onCriteriaRemove}
                onEdit={onCriteriaEdit}
                isEditable={isEditable}
              />
              
              {/* Dependencies */}
              <BiteDependencies
                blockedBy={bite.blockedBy || []}
                blocking={bite.blocking || []}
                relatedBites={bite.relatedBites || []}
                onBiteClick={onDependencyClick}
                onAddDependency={onAddDependency}
                onRemoveDependency={onRemoveDependency}
                isEditable={isEditable}
              />
            </div>
            
            {/* Sidebar */}
            <div className="bite-detail__sidebar">
              {/* Action Card */}
              <div className="bite-detail__action-card">
                {isCompleted ? (
                  <div className="bite-detail__completed-state">
                    <div className="bite-detail__completed-icon">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <h4>Task Completed</h4>
                    <p>Great work! This task has been completed.</p>
                  </div>
                ) : isBlocked ? (
                  <div className="bite-detail__blocked-state">
                    <div className="bite-detail__blocked-icon">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <h4>Task Blocked</h4>
                    <p>Complete blocking dependencies first.</p>
                  </div>
                ) : isInProgress ? (
                  <>
                    <h4>In Progress</h4>
                    <p>Continue working on this task</p>
                    {onSubmit && (
                      <button type="button" onClick={() => onSubmit(bite.id)} className="bite-detail__submit-btn">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        Submit for Review
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <h4>Ready to Start</h4>
                    <p>Begin working on this task</p>
                    {onStartWork && (
                      <button type="button" onClick={() => onStartWork(bite.id)} className="bite-detail__start-btn">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                        </svg>
                        Start Working
                      </button>
                    )}
                  </>
                )}
              </div>
              
              {/* Tags */}
              {bite.tags?.length > 0 && (
                <div className="bite-detail__tags-section">
                  <h4>Tags</h4>
                  <div className="bite-detail__tags">
                    {bite.tags.map(tag => (
                      <span key={tag} className="bite-detail__tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Metadata */}
              <div className="bite-detail__metadata">
                <div className="bite-detail__metadata-item">
                  <span className="bite-detail__metadata-label">Created</span>
                  <span className="bite-detail__metadata-value">{formatDate(bite.createdAt)}</span>
                </div>
                <div className="bite-detail__metadata-item">
                  <span className="bite-detail__metadata-label">Updated</span>
                  <span className="bite-detail__metadata-value">{formatDate(bite.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <div className="bite-detail__confirm-overlay" onClick={() => setShowDeleteConfirm(false)}>
              <div className="bite-detail__confirm-modal" onClick={e => e.stopPropagation()}>
                <h3>Delete Task?</h3>
                <p>Are you sure you want to delete this task? This action cannot be undone.</p>
                <div className="bite-detail__confirm-actions">
                  <button type="button" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                  <button type="button" onClick={handleDelete} className="bite-detail__confirm-delete">Delete</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BiteDetail;