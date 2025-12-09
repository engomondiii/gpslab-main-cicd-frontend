/**
 * GPS Lab Platform - BiteBoardColumn Component
 * 
 * Kanban column with drag-and-drop support.
 * 
 * @module components/bite/BiteBoard/BiteBoardColumn
 */

import React, { useState, useCallback } from 'react';
import BiteBoardCard from './BiteBoardCard';
import { BITE_STATUS } from '../BiteList/BiteListItem';
import './BiteBoardColumn.css';

/**
 * BiteBoardColumn Component
 */
const BiteBoardColumn = ({
  id,
  status,
  title,
  bites = [],
  wipLimit,
  onBiteClick,
  onBiteDrop,
  onAddBite,
  isCollapsed = false,
  onToggleCollapse,
  showAddButton = true,
  className = '',
  ...props
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggingBiteId, setDraggingBiteId] = useState(null);
  
  const statusConfig = BITE_STATUS[status] || BITE_STATUS.backlog;
  const isOverLimit = wipLimit && bites.length > wipLimit;
  const count = bites.length;
  
  /**
   * Handle drag over
   */
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  }, []);
  
  /**
   * Handle drag leave
   */
  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);
  
  /**
   * Handle drop
   */
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const biteId = e.dataTransfer.getData('text/plain');
    if (biteId && onBiteDrop) {
      onBiteDrop(biteId, status);
    }
  }, [status, onBiteDrop]);
  
  /**
   * Handle card drag start
   */
  const handleCardDragStart = useCallback((biteId) => {
    setDraggingBiteId(biteId);
  }, []);
  
  /**
   * Handle card drag end
   */
  const handleCardDragEnd = useCallback(() => {
    setDraggingBiteId(null);
  }, []);
  
  const classNames = [
    'bite-board-column',
    `bite-board-column--${status}`,
    isCollapsed && 'bite-board-column--collapsed',
    isDragOver && 'bite-board-column--drag-over',
    isOverLimit && 'bite-board-column--over-limit',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="bite-board-column__header">
        <div className="bite-board-column__header-left">
          {/* Status Icon */}
          <div className={`bite-board-column__icon bite-board-column__icon--${statusConfig.color}`}>
            {statusConfig.icon}
          </div>
          
          {/* Title */}
          <h3 className="bite-board-column__title">
            {title || statusConfig.label}
          </h3>
          
          {/* Count */}
          <span className={`bite-board-column__count ${isOverLimit ? 'bite-board-column__count--over' : ''}`}>
            {count}
            {wipLimit && `/${wipLimit}`}
          </span>
        </div>
        
        <div className="bite-board-column__header-right">
          {/* Add Button */}
          {showAddButton && onAddBite && (
            <button
              type="button"
              onClick={() => onAddBite(status)}
              className="bite-board-column__add-btn"
              aria-label={`Add task to ${title || statusConfig.label}`}
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
            </button>
          )}
          
          {/* Collapse Button */}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={() => onToggleCollapse(id || status)}
              className="bite-board-column__collapse-btn"
              aria-label={isCollapsed ? 'Expand column' : 'Collapse column'}
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                {isCollapsed ? (
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                ) : (
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"/>
                )}
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* WIP Limit Warning */}
      {isOverLimit && (
        <div className="bite-board-column__warning">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          <span>WIP limit exceeded</span>
        </div>
      )}
      
      {/* Content */}
      {!isCollapsed && (
        <div
          className="bite-board-column__content"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {bites.length > 0 ? (
            <div className="bite-board-column__cards">
              {bites.map(bite => (
                <BiteBoardCard
                  key={bite.id}
                  {...bite}
                  onClick={onBiteClick}
                  onDragStart={handleCardDragStart}
                  onDragEnd={handleCardDragEnd}
                  isDragging={draggingBiteId === bite.id}
                />
              ))}
            </div>
          ) : (
            <div className="bite-board-column__empty">
              <p>No tasks</p>
              {showAddButton && onAddBite && (
                <button
                  type="button"
                  onClick={() => onAddBite(status)}
                  className="bite-board-column__empty-btn"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                  </svg>
                  Add Task
                </button>
              )}
            </div>
          )}
          
          {/* Drop Zone Indicator */}
          {isDragOver && (
            <div className="bite-board-column__drop-zone">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
              </svg>
              <span>Drop here</span>
            </div>
          )}
        </div>
      )}
      
      {/* Collapsed View */}
      {isCollapsed && (
        <div className="bite-board-column__collapsed-content">
          <span className="bite-board-column__collapsed-count">{count} tasks</span>
        </div>
      )}
    </div>
  );
};

export default BiteBoardColumn;