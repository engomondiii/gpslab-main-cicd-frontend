/**
 * GPS Lab Platform - CreatePartyForm Component
 * 
 * Form for creating a new party with name, description,
 * visibility settings, and stage selection.
 * 
 * @module components/party/PartyCreation/CreatePartyForm
 */

import React, { useState, useCallback } from 'react';
import './CreatePartyForm.css';

/**
 * Get beacon color for stage
 */
const getBeaconColor = (stage) => {
  const colors = {
    1: 'var(--beacon-red, #e74c3c)',
    2: 'var(--beacon-orange, #f39c12)',
    3: 'var(--beacon-yellow, #f1c40f)',
    4: 'var(--beacon-green, #2ecc71)',
    5: 'var(--beacon-blue, #3498db)',
    6: 'var(--beacon-indigo, #9b59b6)',
    7: 'var(--beacon-purple, #8e44ad)'
  };
  return colors[stage] || 'var(--gps-primary, #00d4ff)';
};

/**
 * Stage names
 */
const STAGE_NAMES = {
  1: 'Spark',
  2: 'Explore',
  3: 'Design',
  4: 'Build',
  5: 'Test',
  6: 'Launch',
  7: 'Scale'
};

/**
 * CreatePartyForm Component
 */
const CreatePartyForm = ({
  onSubmit,
  onCancel,
  isLoading = false,
  userStage = 1,
  className = '',
  ...props
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: true,
    maxMembers: 5,
    stage: userStage,
    tags: [],
    questId: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  
  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [errors]);
  
  const handleAddTag = useCallback(() => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && formData.tags.length < 5 && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
    }
  }, [tagInput, formData.tags]);
  
  const handleRemoveTag = useCallback((tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  }, []);
  
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const validate = useCallback(() => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Party name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Party name must be at least 3 characters';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Party name must be less than 50 characters';
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    
    if (formData.maxMembers < 2 || formData.maxMembers > 10) {
      newErrors.maxMembers = 'Party size must be between 2 and 10';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    if (onSubmit) {
      await onSubmit(formData);
    }
  };
  
  const classNames = [
    'create-party-form',
    isLoading && 'create-party-form--loading',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="create-party-form__header">
        <div className="create-party-form__icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <h2 className="create-party-form__title">Create New Party</h2>
          <p className="create-party-form__subtitle">
            Assemble your team and tackle challenges together
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="create-party-form__form">
        {/* Party Name */}
        <div className="create-party-form__field">
          <label htmlFor="partyName" className="create-party-form__label">
            Party Name <span className="create-party-form__required">*</span>
          </label>
          <input
            id="partyName"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter a unique party name..."
            className={`create-party-form__input ${errors.name ? 'create-party-form__input--error' : ''}`}
            maxLength={50}
          />
          <div className="create-party-form__field-footer">
            {errors.name ? (
              <span className="create-party-form__error">{errors.name}</span>
            ) : (
              <span className="create-party-form__hint">Choose something memorable</span>
            )}
            <span className="create-party-form__char-count">{formData.name.length}/50</span>
          </div>
        </div>
        
        {/* Description */}
        <div className="create-party-form__field">
          <label htmlFor="partyDescription" className="create-party-form__label">
            Description
          </label>
          <textarea
            id="partyDescription"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="What's your party's mission? What kind of teammates are you looking for?"
            className={`create-party-form__textarea ${errors.description ? 'create-party-form__textarea--error' : ''}`}
            maxLength={500}
          />
          <div className="create-party-form__field-footer">
            {errors.description && (
              <span className="create-party-form__error">{errors.description}</span>
            )}
            <span className="create-party-form__char-count">{formData.description.length}/500</span>
          </div>
        </div>
        
        {/* Stage Selection */}
        <div className="create-party-form__field">
          <label className="create-party-form__label">
            Focus Stage
          </label>
          <p className="create-party-form__field-description">
            Select the GPS stage your party will focus on
          </p>
          <div className="create-party-form__stage-grid">
            {[1, 2, 3, 4, 5, 6, 7].map(stage => (
              <button
                key={stage}
                type="button"
                className={`create-party-form__stage-btn ${formData.stage === stage ? 'create-party-form__stage-btn--selected' : ''}`}
                style={{ '--beacon-color': getBeaconColor(stage) }}
                onClick={() => handleChange('stage', stage)}
              >
                <span className="create-party-form__stage-beacon" />
                <span className="create-party-form__stage-number">{stage}</span>
                <span className="create-party-form__stage-name">{STAGE_NAMES[stage]}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Party Size */}
        <div className="create-party-form__field">
          <label htmlFor="maxMembers" className="create-party-form__label">
            Party Size
          </label>
          <div className="create-party-form__size-control">
            <button
              type="button"
              className="create-party-form__size-btn"
              onClick={() => handleChange('maxMembers', Math.max(2, formData.maxMembers - 1))}
              disabled={formData.maxMembers <= 2}
            >
              −
            </button>
            <span className="create-party-form__size-value">{formData.maxMembers}</span>
            <button
              type="button"
              className="create-party-form__size-btn"
              onClick={() => handleChange('maxMembers', Math.min(10, formData.maxMembers + 1))}
              disabled={formData.maxMembers >= 10}
            >
              +
            </button>
          </div>
          <span className="create-party-form__hint">Maximum members (2-10)</span>
        </div>
        
        {/* Visibility */}
        <div className="create-party-form__field">
          <label className="create-party-form__label">
            Visibility
          </label>
          <div className="create-party-form__visibility-options">
            <button
              type="button"
              className={`create-party-form__visibility-btn ${formData.isPublic ? 'create-party-form__visibility-btn--selected' : ''}`}
              onClick={() => handleChange('isPublic', true)}
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
              </svg>
              <div className="create-party-form__visibility-info">
                <span className="create-party-form__visibility-title">Public</span>
                <span className="create-party-form__visibility-desc">Anyone can find and request to join</span>
              </div>
            </button>
            <button
              type="button"
              className={`create-party-form__visibility-btn ${!formData.isPublic ? 'create-party-form__visibility-btn--selected' : ''}`}
              onClick={() => handleChange('isPublic', false)}
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
              </svg>
              <div className="create-party-form__visibility-info">
                <span className="create-party-form__visibility-title">Private</span>
                <span className="create-party-form__visibility-desc">Invite only, hidden from search</span>
              </div>
            </button>
          </div>
        </div>
        
        {/* Tags */}
        <div className="create-party-form__field">
          <label className="create-party-form__label">
            Tags
          </label>
          <p className="create-party-form__field-description">
            Add tags to help others find your party (max 5)
          </p>
          <div className="create-party-form__tags-input">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Type a tag and press Enter..."
              className="create-party-form__input"
              disabled={formData.tags.length >= 5}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="create-party-form__add-tag-btn"
              disabled={formData.tags.length >= 5 || !tagInput.trim()}
            >
              Add
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="create-party-form__tags-list">
              {formData.tags.map(tag => (
                <span key={tag} className="create-party-form__tag">
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="create-party-form__tag-remove"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="create-party-form__actions">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="create-party-form__cancel-btn"
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="create-party-form__submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="create-party-form__spinner" />
                Creating...
              </>
            ) : (
              <>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                </svg>
                Create Party
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePartyForm;