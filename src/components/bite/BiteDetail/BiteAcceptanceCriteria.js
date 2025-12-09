/**
 * GPS Lab Platform - BiteAcceptanceCriteria Component
 * 
 * Checklist of acceptance criteria with completion tracking.
 * 
 * @module components/bite/BiteDetail/BiteAcceptanceCriteria
 */

import React, { useState, useCallback } from 'react';
import './BiteAcceptanceCriteria.css';

/**
 * BiteAcceptanceCriteria Component
 */
const BiteAcceptanceCriteria = ({
  criteria = [],
  onToggle,
  onAdd,
  onRemove,
  onEdit,
  isEditable = false,
  showProgress = true,
  className = '',
  ...props
}) => {
  const [newCriterion, setNewCriterion] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  
  const completedCount = criteria.filter(c => c.completed).length;
  const totalCount = criteria.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  const handleAdd = useCallback(() => {
    if (newCriterion.trim() && onAdd) {
      onAdd(newCriterion.trim());
      setNewCriterion('');
    }
  }, [newCriterion, onAdd]);
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };
  
  const startEditing = (criterion) => {
    setEditingId(criterion.id);
    setEditText(criterion.text);
  };
  
  const saveEdit = (id) => {
    if (editText.trim() && onEdit) {
      onEdit(id, editText.trim());
    }
    setEditingId(null);
    setEditText('');
  };
  
  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };
  
  const classNames = ['bite-acceptance-criteria', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="bite-acceptance-criteria__header">
        <h3 className="bite-acceptance-criteria__title">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          Acceptance Criteria
        </h3>
        
        {showProgress && totalCount > 0 && (
          <div className="bite-acceptance-criteria__progress">
            <span className="bite-acceptance-criteria__progress-text">
              {completedCount}/{totalCount}
            </span>
            <div className="bite-acceptance-criteria__progress-bar">
              <div 
                className="bite-acceptance-criteria__progress-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* List */}
      <div className="bite-acceptance-criteria__content">
        {criteria.length > 0 ? (
          <ul className="bite-acceptance-criteria__list">
            {criteria.map((criterion) => (
              <li 
                key={criterion.id}
                className={`bite-acceptance-criteria__item ${criterion.completed ? 'bite-acceptance-criteria__item--completed' : ''}`}
              >
                {editingId === criterion.id ? (
                  <div className="bite-acceptance-criteria__edit-row">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="bite-acceptance-criteria__edit-input"
                      autoFocus
                    />
                    <button 
                      type="button" 
                      onClick={() => saveEdit(criterion.id)}
                      className="bite-acceptance-criteria__save-btn"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </button>
                    <button 
                      type="button" 
                      onClick={cancelEdit}
                      className="bite-acceptance-criteria__cancel-btn"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <label className="bite-acceptance-criteria__checkbox">
                      <input
                        type="checkbox"
                        checked={criterion.completed}
                        onChange={() => onToggle?.(criterion.id)}
                        disabled={!onToggle}
                      />
                      <span className="bite-acceptance-criteria__checkmark">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </span>
                      <span className="bite-acceptance-criteria__text">{criterion.text}</span>
                    </label>
                    
                    {isEditable && (
                      <div className="bite-acceptance-criteria__actions">
                        <button
                          type="button"
                          onClick={() => startEditing(criterion)}
                          className="bite-acceptance-criteria__action-btn"
                          aria-label="Edit"
                        >
                          <svg viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"/>
                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"/>
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemove?.(criterion.id)}
                          className="bite-acceptance-criteria__action-btn bite-acceptance-criteria__action-btn--delete"
                          aria-label="Remove"
                        >
                          <svg viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                          </svg>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="bite-acceptance-criteria__empty">
            No acceptance criteria defined
          </p>
        )}
        
        {/* Add New */}
        {isEditable && onAdd && (
          <div className="bite-acceptance-criteria__add">
            <input
              type="text"
              value={newCriterion}
              onChange={(e) => setNewCriterion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new criterion..."
              className="bite-acceptance-criteria__add-input"
            />
            <button
              type="button"
              onClick={handleAdd}
              disabled={!newCriterion.trim()}
              className="bite-acceptance-criteria__add-btn"
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

export default BiteAcceptanceCriteria;