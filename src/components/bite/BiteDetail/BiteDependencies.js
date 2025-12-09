/**
 * GPS Lab Platform - BiteDependencies Component
 * 
 * Dependency graph and blocking relationships management.
 * 
 * @module components/bite/BiteDetail/BiteDependencies
 */

import React from 'react';
import { BITE_STATUS } from '../BiteList/BiteListItem';
import './BiteDependencies.css';

/**
 * BiteDependencies Component
 */
const BiteDependencies = ({
  blockedBy = [],
  blocking = [],
  relatedBites = [],
  onBiteClick,
  onAddDependency,
  onRemoveDependency,
  isEditable = false,
  className = '',
  ...props
}) => {
  const totalBlockers = blockedBy.filter(b => b.status !== 'completed').length;
  const isBlocked = totalBlockers > 0;
  
  const classNames = ['bite-dependencies', className].filter(Boolean).join(' ');
  
  const renderBiteItem = (bite, type) => {
    const statusConfig = BITE_STATUS[bite.status] || BITE_STATUS.backlog;
    const isCompleted = bite.status === 'completed';
    
    return (
      <div 
        key={bite.id}
        className={`bite-dependencies__item bite-dependencies__item--${type} ${isCompleted ? 'bite-dependencies__item--completed' : ''}`}
        onClick={() => onBiteClick?.(bite.id)}
        role="button"
        tabIndex={0}
      >
        <div className="bite-dependencies__item-left">
          <div className={`bite-dependencies__status bite-dependencies__status--${statusConfig.color}`}>
            {statusConfig.icon}
          </div>
          <div className="bite-dependencies__item-info">
            <span className="bite-dependencies__item-id">#{bite.id.slice(-6)}</span>
            <span className="bite-dependencies__item-title">{bite.title}</span>
          </div>
        </div>
        
        <div className="bite-dependencies__item-right">
          {isCompleted ? (
            <span className="bite-dependencies__completed-badge">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            </span>
          ) : type === 'blocker' ? (
            <span className="bite-dependencies__blocker-badge">Blocking</span>
          ) : type === 'blocked' ? (
            <span className="bite-dependencies__blocked-badge">Waiting</span>
          ) : null}
          
          {isEditable && onRemoveDependency && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveDependency(bite.id, type);
              }}
              className="bite-dependencies__remove-btn"
              aria-label="Remove dependency"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="bite-dependencies__header">
        <h3 className="bite-dependencies__title">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
          </svg>
          Dependencies
        </h3>
        
        {isBlocked && (
          <span className="bite-dependencies__blocked-indicator">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd"/>
            </svg>
            {totalBlockers} blocker{totalBlockers !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      {/* Content */}
      <div className="bite-dependencies__content">
        {/* Blocked By Section */}
        {(blockedBy.length > 0 || isEditable) && (
          <div className="bite-dependencies__section">
            <h4 className="bite-dependencies__section-title">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
              </svg>
              Blocked By
              <span className="bite-dependencies__count">{blockedBy.length}</span>
            </h4>
            
            {blockedBy.length > 0 ? (
              <div className="bite-dependencies__list">
                {blockedBy.map(bite => renderBiteItem(bite, 'blocker'))}
              </div>
            ) : (
              <p className="bite-dependencies__empty">No blocking dependencies</p>
            )}
          </div>
        )}
        
        {/* Blocking Section */}
        {(blocking.length > 0 || isEditable) && (
          <div className="bite-dependencies__section">
            <h4 className="bite-dependencies__section-title">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              Blocking
              <span className="bite-dependencies__count">{blocking.length}</span>
            </h4>
            
            {blocking.length > 0 ? (
              <div className="bite-dependencies__list">
                {blocking.map(bite => renderBiteItem(bite, 'blocked'))}
              </div>
            ) : (
              <p className="bite-dependencies__empty">Not blocking any tasks</p>
            )}
          </div>
        )}
        
        {/* Related Section */}
        {relatedBites.length > 0 && (
          <div className="bite-dependencies__section">
            <h4 className="bite-dependencies__section-title">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762z"/>
              </svg>
              Related Tasks
              <span className="bite-dependencies__count">{relatedBites.length}</span>
            </h4>
            
            <div className="bite-dependencies__list">
              {relatedBites.map(bite => renderBiteItem(bite, 'related'))}
            </div>
          </div>
        )}
        
        {/* Add Dependency Button */}
        {isEditable && onAddDependency && (
          <button
            type="button"
            onClick={onAddDependency}
            className="bite-dependencies__add-btn"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
            Add Dependency
          </button>
        )}
        
        {/* Empty State */}
        {blockedBy.length === 0 && blocking.length === 0 && relatedBites.length === 0 && !isEditable && (
          <p className="bite-dependencies__empty-all">No dependencies configured</p>
        )}
      </div>
    </div>
  );
};

export default BiteDependencies;