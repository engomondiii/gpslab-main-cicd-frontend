/**
 * GPS Lab Platform - BiteMetadataForm Component
 * 
 * Form for submission metadata (summary, tags, etc).
 * 
 * @module components/bite/BiteSubmission/BiteMetadataForm
 */

import React, { useState, useCallback } from 'react';
import './BiteMetadataForm.css';

/**
 * BiteMetadataForm Component
 */
const BiteMetadataForm = ({
  summary = '',
  reflection = '',
  challenges = '',
  learnings = '',
  tags = [],
  suggestedTags = [],
  onSummaryChange,
  onReflectionChange,
  onChallengesChange,
  onLearningsChange,
  onTagAdd,
  onTagRemove,
  showReflection = true,
  showChallenges = true,
  showLearnings = true,
  showTags = true,
  className = '',
  ...props
}) => {
  const [newTag, setNewTag] = useState('');
  
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (onTagAdd && !tags.includes(newTag.trim())) {
        onTagAdd(newTag.trim());
      }
      setNewTag('');
    }
  };
  
  const addSuggestedTag = useCallback((tag) => {
    if (onTagAdd && !tags.includes(tag)) {
      onTagAdd(tag);
    }
  }, [tags, onTagAdd]);
  
  const classNames = ['bite-metadata-form', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Summary Section */}
      <div className="bite-metadata-form__section">
        <label className="bite-metadata-form__label">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
          </svg>
          Summary
          <span className="bite-metadata-form__required">*</span>
        </label>
        <p className="bite-metadata-form__hint">Briefly describe what you accomplished</p>
        <textarea
          value={summary}
          onChange={(e) => onSummaryChange?.(e.target.value)}
          placeholder="I completed the task by..."
          className="bite-metadata-form__textarea"
          rows={3}
          required
        />
      </div>
      
      {/* Reflection Section */}
      {showReflection && (
        <div className="bite-metadata-form__section">
          <label className="bite-metadata-form__label">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
            </svg>
            Reflection
          </label>
          <p className="bite-metadata-form__hint">What did you think about this task?</p>
          <textarea
            value={reflection}
            onChange={(e) => onReflectionChange?.(e.target.value)}
            placeholder="This task helped me understand..."
            className="bite-metadata-form__textarea"
            rows={3}
          />
        </div>
      )}
      
      {/* Challenges Section */}
      {showChallenges && (
        <div className="bite-metadata-form__section">
          <label className="bite-metadata-form__label">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            Challenges Faced
          </label>
          <p className="bite-metadata-form__hint">What difficulties did you encounter?</p>
          <textarea
            value={challenges}
            onChange={(e) => onChallengesChange?.(e.target.value)}
            placeholder="The hardest part was..."
            className="bite-metadata-form__textarea"
            rows={2}
          />
        </div>
      )}
      
      {/* Learnings Section */}
      {showLearnings && (
        <div className="bite-metadata-form__section">
          <label className="bite-metadata-form__label">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0z"/>
            </svg>
            Key Learnings
          </label>
          <p className="bite-metadata-form__hint">What new skills or knowledge did you gain?</p>
          <textarea
            value={learnings}
            onChange={(e) => onLearningsChange?.(e.target.value)}
            placeholder="I learned how to..."
            className="bite-metadata-form__textarea"
            rows={2}
          />
        </div>
      )}
      
      {/* Tags Section */}
      {showTags && (
        <div className="bite-metadata-form__section">
          <label className="bite-metadata-form__label">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
            </svg>
            Tags
          </label>
          <p className="bite-metadata-form__hint">Add tags to help categorize your work</p>
          
          {/* Tag Input */}
          <div className="bite-metadata-form__tag-input-wrapper">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Type and press Enter to add"
              className="bite-metadata-form__tag-input"
            />
          </div>
          
          {/* Selected Tags */}
          {tags.length > 0 && (
            <div className="bite-metadata-form__tags">
              {tags.map(tag => (
                <span key={tag} className="bite-metadata-form__tag">
                  {tag}
                  {onTagRemove && (
                    <button type="button" onClick={() => onTagRemove(tag)} className="bite-metadata-form__tag-remove">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}
          
          {/* Suggested Tags */}
          {suggestedTags.length > 0 && (
            <div className="bite-metadata-form__suggested">
              <span className="bite-metadata-form__suggested-label">Suggested:</span>
              <div className="bite-metadata-form__suggested-tags">
                {suggestedTags.filter(t => !tags.includes(t)).map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addSuggestedTag(tag)}
                    className="bite-metadata-form__suggested-tag"
                  >
                    {tag}
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BiteMetadataForm;