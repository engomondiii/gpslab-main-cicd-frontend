/**
 * GPS Lab Platform - CreateProjectForm Component
 * 
 * Form for creating a new project with basic information,
 * category, stage selection, and team setup.
 * 
 * @module components/project/ProjectCreation/CreateProjectForm
 */

import React, { useState, useCallback } from 'react';
import './CreateProjectForm.css';

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
 * Stage definitions
 */
const STAGES = [
  { value: 1, name: 'Spark', description: 'Identify and validate the problem' },
  { value: 2, name: 'Explore', description: 'Research and understand the problem space' },
  { value: 3, name: 'Design', description: 'Design your solution approach' },
  { value: 4, name: 'Build', description: 'Build your minimum viable product' },
  { value: 5, name: 'Test', description: 'Test with real users and iterate' },
  { value: 6, name: 'Launch', description: 'Launch and acquire customers' },
  { value: 7, name: 'Scale', description: 'Scale your impact and operations' }
];

/**
 * Project categories
 */
const CATEGORIES = [
  'Healthcare',
  'Education',
  'Environment',
  'Agriculture',
  'Finance',
  'Technology',
  'Social Impact',
  'Transportation',
  'Energy',
  'Other'
];

/**
 * CreateProjectForm Component
 */
const CreateProjectForm = ({
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
    category: '',
    stage: userStage,
    problemStatement: '',
    targetAudience: '',
    tags: [],
    isPublic: true
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1); // 1: Basic, 2: Details, 3: Stage
  
  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
  
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Project name is required';
      } else if (formData.name.length < 3) {
        newErrors.name = 'Project name must be at least 3 characters';
      } else if (formData.name.length > 100) {
        newErrors.name = 'Project name must be less than 100 characters';
      }
      
      if (!formData.category) {
        newErrors.category = 'Please select a category';
      }
    }
    
    if (step === 2) {
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      } else if (formData.description.length < 20) {
        newErrors.description = 'Description must be at least 20 characters';
      }
      
      if (!formData.problemStatement.trim()) {
        newErrors.problemStatement = 'Problem statement is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };
  
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
    if (onSubmit) {
      await onSubmit(formData);
    }
  };
  
  const classNames = [
    'create-project-form',
    isLoading && 'create-project-form--loading',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="create-project-form__header">
        <div className="create-project-form__icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <h2 className="create-project-form__title">Create New Project</h2>
          <p className="create-project-form__subtitle">
            Start your GPS journey with a new venture
          </p>
        </div>
      </div>
      
      {/* Progress Steps */}
      <div className="create-project-form__progress">
        {[1, 2, 3].map(step => (
          <div
            key={step}
            className={`create-project-form__step ${currentStep >= step ? 'create-project-form__step--active' : ''} ${currentStep > step ? 'create-project-form__step--completed' : ''}`}
          >
            <span className="create-project-form__step-number">
              {currentStep > step ? '✓' : step}
            </span>
            <span className="create-project-form__step-label">
              {step === 1 && 'Basic Info'}
              {step === 2 && 'Details'}
              {step === 3 && 'Stage'}
            </span>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="create-project-form__form">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="create-project-form__step-content">
            {/* Project Name */}
            <div className="create-project-form__field">
              <label htmlFor="projectName" className="create-project-form__label">
                Project Name <span className="create-project-form__required">*</span>
              </label>
              <input
                id="projectName"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter your project name..."
                className={`create-project-form__input ${errors.name ? 'create-project-form__input--error' : ''}`}
                maxLength={100}
              />
              <div className="create-project-form__field-footer">
                {errors.name ? (
                  <span className="create-project-form__error">{errors.name}</span>
                ) : (
                  <span className="create-project-form__hint">Choose a clear, memorable name</span>
                )}
                <span className="create-project-form__char-count">{formData.name.length}/100</span>
              </div>
            </div>
            
            {/* Category */}
            <div className="create-project-form__field">
              <label htmlFor="category" className="create-project-form__label">
                Category <span className="create-project-form__required">*</span>
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className={`create-project-form__select ${errors.category ? 'create-project-form__select--error' : ''}`}
              >
                <option value="">Select a category...</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <span className="create-project-form__error">{errors.category}</span>
              )}
            </div>
            
            {/* Tags */}
            <div className="create-project-form__field">
              <label className="create-project-form__label">Tags</label>
              <p className="create-project-form__field-description">
                Add tags to help others find your project (max 5)
              </p>
              <div className="create-project-form__tags-input">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Type a tag and press Enter..."
                  className="create-project-form__input"
                  disabled={formData.tags.length >= 5}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="create-project-form__add-tag-btn"
                  disabled={formData.tags.length >= 5 || !tagInput.trim()}
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="create-project-form__tags-list">
                  {formData.tags.map(tag => (
                    <span key={tag} className="create-project-form__tag">
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="create-project-form__tag-remove"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Step 2: Details */}
        {currentStep === 2 && (
          <div className="create-project-form__step-content">
            {/* Description */}
            <div className="create-project-form__field">
              <label htmlFor="description" className="create-project-form__label">
                Description <span className="create-project-form__required">*</span>
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe your project and its goals..."
                className={`create-project-form__textarea ${errors.description ? 'create-project-form__textarea--error' : ''}`}
                maxLength={1000}
              />
              <div className="create-project-form__field-footer">
                {errors.description && (
                  <span className="create-project-form__error">{errors.description}</span>
                )}
                <span className="create-project-form__char-count">{formData.description.length}/1000</span>
              </div>
            </div>
            
            {/* Problem Statement */}
            <div className="create-project-form__field">
              <label htmlFor="problemStatement" className="create-project-form__label">
                Problem Statement <span className="create-project-form__required">*</span>
              </label>
              <textarea
                id="problemStatement"
                value={formData.problemStatement}
                onChange={(e) => handleChange('problemStatement', e.target.value)}
                placeholder="What problem are you trying to solve?"
                className={`create-project-form__textarea create-project-form__textarea--short ${errors.problemStatement ? 'create-project-form__textarea--error' : ''}`}
                maxLength={500}
              />
              {errors.problemStatement && (
                <span className="create-project-form__error">{errors.problemStatement}</span>
              )}
            </div>
            
            {/* Target Audience */}
            <div className="create-project-form__field">
              <label htmlFor="targetAudience" className="create-project-form__label">
                Target Audience
              </label>
              <input
                id="targetAudience"
                type="text"
                value={formData.targetAudience}
                onChange={(e) => handleChange('targetAudience', e.target.value)}
                placeholder="Who will benefit from your solution?"
                className="create-project-form__input"
              />
            </div>
          </div>
        )}
        
        {/* Step 3: Stage Selection */}
        {currentStep === 3 && (
          <div className="create-project-form__step-content">
            <p className="create-project-form__stage-intro">
              Select the GPS stage where your project currently is. This helps match you with the right missions and resources.
            </p>
            
            <div className="create-project-form__stage-grid">
              {STAGES.map(stage => (
                <button
                  key={stage.value}
                  type="button"
                  className={`create-project-form__stage-card ${formData.stage === stage.value ? 'create-project-form__stage-card--selected' : ''}`}
                  style={{ '--beacon-color': getBeaconColor(stage.value) }}
                  onClick={() => handleChange('stage', stage.value)}
                >
                  <div className="create-project-form__stage-header">
                    <span className="create-project-form__stage-beacon" />
                    <span className="create-project-form__stage-number">Stage {stage.value}</span>
                  </div>
                  <h4 className="create-project-form__stage-name">{stage.name}</h4>
                  <p className="create-project-form__stage-desc">{stage.description}</p>
                </button>
              ))}
            </div>
            
            {/* Visibility */}
            <div className="create-project-form__visibility">
              <label className="create-project-form__label">Visibility</label>
              <div className="create-project-form__visibility-options">
                <button
                  type="button"
                  className={`create-project-form__visibility-btn ${formData.isPublic ? 'create-project-form__visibility-btn--selected' : ''}`}
                  onClick={() => handleChange('isPublic', true)}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Public</span>
                </button>
                <button
                  type="button"
                  className={`create-project-form__visibility-btn ${!formData.isPublic ? 'create-project-form__visibility-btn--selected' : ''}`}
                  onClick={() => handleChange('isPublic', false)}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Private</span>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="create-project-form__actions">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="create-project-form__back-btn"
              disabled={isLoading}
            >
              Back
            </button>
          ) : onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="create-project-form__cancel-btn"
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
          
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="create-project-form__next-btn"
            >
              Continue
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
          ) : (
            <button
              type="submit"
              className="create-project-form__submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="create-project-form__spinner" />
                  Creating...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                  </svg>
                  Create Project
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateProjectForm;