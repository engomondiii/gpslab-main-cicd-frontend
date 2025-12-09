/**
 * GPS Lab Platform - BiteWorkBreakdown Component
 * 
 * Work breakdown structure for planning task subtasks.
 * 
 * @module components/bite/BitePlanning/BiteWorkBreakdown
 */

import React, { useState, useCallback } from 'react';
import './BiteWorkBreakdown.css';

/**
 * BiteWorkBreakdown Component
 */
const BiteWorkBreakdown = ({
  subtasks = [],
  onAdd,
  onRemove,
  onToggle,
  onUpdate,
  onReorder,
  isEditable = true,
  showEstimates = true,
  className = '',
  ...props
}) => {
  const [newSubtask, setNewSubtask] = useState('');
  const [newEstimate, setNewEstimate] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editEstimate, setEditEstimate] = useState('');
  const [draggedId, setDraggedId] = useState(null);
  
  const completedCount = subtasks.filter(s => s.completed).length;
  const totalEstimate = subtasks.reduce((sum, s) => sum + (s.estimatedTime || 0), 0);
  const completedEstimate = subtasks.filter(s => s.completed).reduce((sum, s) => sum + (s.estimatedTime || 0), 0);
  const progress = subtasks.length > 0 ? Math.round((completedCount / subtasks.length) * 100) : 0;
  
  const formatTime = (minutes) => {
    if (!minutes) return '--';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };
  
  const handleAdd = useCallback(() => {
    if (newSubtask.trim() && onAdd) {
      onAdd({
        text: newSubtask.trim(),
        estimatedTime: parseInt(newEstimate) || null
      });
      setNewSubtask('');
      setNewEstimate('');
    }
  }, [newSubtask, newEstimate, onAdd]);
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };
  
  const startEditing = (subtask) => {
    setEditingId(subtask.id);
    setEditText(subtask.text);
    setEditEstimate(subtask.estimatedTime?.toString() || '');
  };
  
  const saveEdit = (id) => {
    if (editText.trim() && onUpdate) {
      onUpdate(id, {
        text: editText.trim(),
        estimatedTime: parseInt(editEstimate) || null
      });
    }
    setEditingId(null);
  };
  
  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
    setEditEstimate('');
  };
  
  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e, id) => {
    e.preventDefault();
    if (draggedId && draggedId !== id && onReorder) {
      const fromIndex = subtasks.findIndex(s => s.id === draggedId);
      const toIndex = subtasks.findIndex(s => s.id === id);
      if (fromIndex !== -1 && toIndex !== -1) {
        onReorder(fromIndex, toIndex);
      }
    }
  };
  
  const handleDragEnd = () => {
    setDraggedId(null);
  };
  
  const classNames = ['bite-work-breakdown', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="bite-work-breakdown__header">
        <h3 className="bite-work-breakdown__title">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
          </svg>
          Work Breakdown
        </h3>
        
        <div className="bite-work-breakdown__stats">
          <span className="bite-work-breakdown__progress-text">
            {completedCount}/{subtasks.length}
          </span>
          {showEstimates && totalEstimate > 0 && (
            <span className="bite-work-breakdown__time">
              {formatTime(completedEstimate)} / {formatTime(totalEstimate)}
            </span>
          )}
        </div>
      </div>
      
      {/* Progress Bar */}
      {subtasks.length > 0 && (
        <div className="bite-work-breakdown__progress">
          <div className="bite-work-breakdown__progress-bar">
            <div 
              className="bite-work-breakdown__progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="bite-work-breakdown__content">
        {subtasks.length > 0 ? (
          <ul className="bite-work-breakdown__list">
            {subtasks.map((subtask, index) => (
              <li
                key={subtask.id}
                className={`bite-work-breakdown__item ${subtask.completed ? 'bite-work-breakdown__item--completed' : ''} ${draggedId === subtask.id ? 'bite-work-breakdown__item--dragging' : ''}`}
                draggable={isEditable && onReorder}
                onDragStart={(e) => handleDragStart(e, subtask.id)}
                onDragOver={(e) => handleDragOver(e, subtask.id)}
                onDragEnd={handleDragEnd}
              >
                {editingId === subtask.id ? (
                  <div className="bite-work-breakdown__edit-row">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="bite-work-breakdown__edit-input"
                      placeholder="Subtask description"
                      autoFocus
                    />
                    {showEstimates && (
                      <input
                        type="number"
                        value={editEstimate}
                        onChange={(e) => setEditEstimate(e.target.value)}
                        className="bite-work-breakdown__edit-time"
                        placeholder="min"
                        min="1"
                      />
                    )}
                    <button type="button" onClick={() => saveEdit(subtask.id)} className="bite-work-breakdown__save-btn">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </button>
                    <button type="button" onClick={cancelEdit} className="bite-work-breakdown__cancel-btn">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Drag Handle */}
                    {isEditable && onReorder && (
                      <div className="bite-work-breakdown__drag-handle">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"/>
                        </svg>
                      </div>
                    )}
                    
                    {/* Number */}
                    <span className="bite-work-breakdown__number">{index + 1}</span>
                    
                    {/* Checkbox */}
                    <label className="bite-work-breakdown__checkbox">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => onToggle?.(subtask.id)}
                        disabled={!onToggle}
                      />
                      <span className="bite-work-breakdown__checkmark">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </span>
                    </label>
                    
                    {/* Text */}
                    <span className="bite-work-breakdown__text">{subtask.text}</span>
                    
                    {/* Time Estimate */}
                    {showEstimates && subtask.estimatedTime && (
                      <span className="bite-work-breakdown__time-badge">
                        {formatTime(subtask.estimatedTime)}
                      </span>
                    )}
                    
                    {/* Actions */}
                    {isEditable && (
                      <div className="bite-work-breakdown__actions">
                        <button
                          type="button"
                          onClick={() => startEditing(subtask)}
                          className="bite-work-breakdown__action-btn"
                          aria-label="Edit"
                        >
                          <svg viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"/>
                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"/>
                          </svg>
                        </button>
                        {onRemove && (
                          <button
                            type="button"
                            onClick={() => onRemove(subtask.id)}
                            className="bite-work-breakdown__action-btn bite-work-breakdown__action-btn--delete"
                            aria-label="Remove"
                          >
                            <svg viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="bite-work-breakdown__empty">
            Break down your work into smaller, manageable steps
          </p>
        )}
        
        {/* Add New */}
        {isEditable && onAdd && (
          <div className="bite-work-breakdown__add">
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a subtask..."
              className="bite-work-breakdown__add-input"
            />
            {showEstimates && (
              <input
                type="number"
                value={newEstimate}
                onChange={(e) => setNewEstimate(e.target.value)}
                placeholder="min"
                className="bite-work-breakdown__add-time"
                min="1"
              />
            )}
            <button
              type="button"
              onClick={handleAdd}
              disabled={!newSubtask.trim()}
              className="bite-work-breakdown__add-btn"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiteWorkBreakdown;