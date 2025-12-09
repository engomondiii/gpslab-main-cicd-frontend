/**
 * GPS Lab Platform - BiteDescription Component
 * 
 * Rich text description display with markdown support.
 * 
 * @module components/bite/BiteDetail/BiteDescription
 */

import React, { useState } from 'react';
import './BiteDescription.css';

/**
 * BiteDescription Component
 */
const BiteDescription = ({
  description,
  context,
  learningObjectives = [],
  onEdit,
  isEditable = false,
  isEditing = false,
  onSave,
  onCancel,
  className = '',
  ...props
}) => {
  const [editedDescription, setEditedDescription] = useState(description);
  
  const handleSave = () => {
    onSave?.(editedDescription);
  };
  
  const classNames = ['bite-description', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="bite-description__header">
        <h3 className="bite-description__title">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
          </svg>
          Description
        </h3>
        {isEditable && !isEditing && onEdit && (
          <button type="button" onClick={onEdit} className="bite-description__edit-btn">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"/>
              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"/>
            </svg>
            Edit
          </button>
        )}
      </div>
      
      {/* Content */}
      <div className="bite-description__content">
        {isEditing ? (
          <div className="bite-description__editor">
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="Describe what needs to be done..."
              className="bite-description__textarea"
              rows={6}
            />
            <div className="bite-description__editor-actions">
              <button type="button" onClick={onCancel} className="bite-description__cancel-btn">
                Cancel
              </button>
              <button type="button" onClick={handleSave} className="bite-description__save-btn">
                Save Changes
              </button>
            </div>
          </div>
        ) : description ? (
          <div className="bite-description__text">
            {description.split('\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        ) : (
          <p className="bite-description__empty">No description provided</p>
        )}
      </div>
      
      {/* Context */}
      {context && (
        <div className="bite-description__context">
          <h4 className="bite-description__section-title">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            Context
          </h4>
          <p>{context}</p>
        </div>
      )}
      
      {/* Learning Objectives */}
      {learningObjectives.length > 0 && (
        <div className="bite-description__objectives">
          <h4 className="bite-description__section-title">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0z"/>
            </svg>
            What You'll Learn
          </h4>
          <ul className="bite-description__objectives-list">
            {learningObjectives.map((objective, i) => (
              <li key={i}>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                {objective}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BiteDescription;