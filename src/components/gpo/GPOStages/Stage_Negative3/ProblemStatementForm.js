/**
 * GPS Lab Platform - ProblemStatementForm Component
 * 
 * Stage -3: What is your problem?
 * Current Reality → Desired State → The Gap structure.
 * 
 * @module components/gpo/GPOStages/Stage_Negative3/ProblemStatementForm
 */

import React, { useState, useCallback } from 'react';
import ProblemEvidenceUploader from './ProblemEvidenceUploader';
import ProblemDataInput from './ProblemDataInput';
import './ProblemStatementForm.css';

/**
 * ProblemStatementForm Component
 */
const ProblemStatementForm = ({
  stageData = {},
  onComplete,
  onBack,
  className = '',
  ...props
}) => {
  const [formData, setFormData] = useState({
    currentReality: stageData.currentReality || '',
    desiredState: stageData.desiredState || '',
    theGap: stageData.theGap || '',
    evidence: stageData.evidence || [],
    statistics: stageData.statistics || [],
    ...stageData
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0); // 0: Statement, 1: Evidence, 2: Data

  /**
   * Handle input change
   */
  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  /**
   * Handle evidence upload
   */
  const handleEvidenceUpdate = useCallback((evidence) => {
    setFormData(prev => ({ ...prev, evidence }));
  }, []);

  /**
   * Handle statistics update
   */
  const handleStatisticsUpdate = useCallback((statistics) => {
    setFormData(prev => ({ ...prev, statistics }));
  }, []);

  /**
   * Validate current step
   */
  const validateStep = useCallback(() => {
    const newErrors = {};

    if (currentStep === 0) {
      if (!formData.currentReality.trim()) {
        newErrors.currentReality = 'Please describe the current reality';
      } else if (formData.currentReality.trim().length < 100) {
        newErrors.currentReality = 'Current reality must be at least 100 characters';
      }

      if (!formData.desiredState.trim()) {
        newErrors.desiredState = 'Please describe the desired state';
      } else if (formData.desiredState.trim().length < 100) {
        newErrors.desiredState = 'Desired state must be at least 100 characters';
      }

      if (!formData.theGap.trim()) {
        newErrors.theGap = 'Please define the gap';
      } else if (formData.theGap.trim().length < 50) {
        newErrors.theGap = 'Gap definition must be at least 50 characters';
      }
    }

    if (currentStep === 1) {
      if (!formData.evidence || formData.evidence.length < 2) {
        newErrors.evidence = 'Please upload at least 2 pieces of evidence (photos/videos)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentStep, formData]);

  /**
   * Handle next step
   */
  const handleNext = useCallback(() => {
    if (validateStep()) {
      if (currentStep < 2) {
        setCurrentStep(currentStep + 1);
      } else {
        onComplete?.(formData);
      }
    }
  }, [currentStep, validateStep, formData, onComplete]);

  /**
   * Handle previous step
   */
  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack?.();
    }
  }, [currentStep, onBack]);

  const classNames = ['problem-statement-form', className].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...props}>
      <div className="problem-statement-form__container">
        {/* Step Indicator */}
        <div className="problem-statement-form__steps">
          {['Problem Statement', 'Evidence', 'Data & Facts'].map((step, index) => (
            <div
              key={index}
              className={`problem-statement-form__step ${
                index === currentStep ? 'problem-statement-form__step--active' : ''
              } ${
                index < currentStep ? 'problem-statement-form__step--completed' : ''
              }`}
            >
              <div className="problem-statement-form__step-number">
                {index < currentStep ? '✓' : index + 1}
              </div>
              <span className="problem-statement-form__step-label">{step}</span>
            </div>
          ))}
        </div>

        {/* Step 0: Problem Statement */}
        {currentStep === 0 && (
          <div className="problem-statement-form__content">
            <div className="problem-statement-form__instructions">
              <h3 className="problem-statement-form__instructions-title">
                Define Your Problem Clearly 🎯
              </h3>
              <p className="problem-statement-form__instructions-text">
                Use the <strong>Current Reality → Desired State → Gap</strong> framework to articulate your problem precisely.
              </p>
            </div>

            <div className="problem-statement-form__fields">
              {/* Current Reality */}
              <div className="problem-statement-form__field">
                <label htmlFor="currentReality" className="problem-statement-form__label">
                  <span className="problem-statement-form__label-icon">📍</span>
                  Current Reality <span className="problem-statement-form__required">*</span>
                </label>
                <p className="problem-statement-form__field-hint">
                  What is the situation right now? Describe the problem as it exists today.
                </p>
                <textarea
                  id="currentReality"
                  value={formData.currentReality}
                  onChange={(e) => handleChange('currentReality', e.target.value)}
                  placeholder="Example: In our village of 500 families, only 3 have access to clean water. People walk 2+ hours daily to fetch water from contaminated sources, leading to frequent waterborne illnesses..."
                  rows={6}
                  className={`problem-statement-form__textarea ${errors.currentReality ? 'problem-statement-form__textarea--error' : ''}`}
                />
                <div className="problem-statement-form__field-meta">
                  <span className={`problem-statement-form__char-count ${formData.currentReality.length < 100 ? 'problem-statement-form__char-count--warning' : ''}`}>
                    {formData.currentReality.length} / 100 characters minimum
                  </span>
                </div>
                {errors.currentReality && (
                  <span className="problem-statement-form__error">{errors.currentReality}</span>
                )}
              </div>

              {/* Desired State */}
              <div className="problem-statement-form__field">
                <label htmlFor="desiredState" className="problem-statement-form__label">
                  <span className="problem-statement-form__label-icon">⭐</span>
                  Desired State <span className="problem-statement-form__required">*</span>
                </label>
                <p className="problem-statement-form__field-hint">
                  What do you want the situation to be? Paint a picture of success.
                </p>
                <textarea
                  id="desiredState"
                  value={formData.desiredState}
                  onChange={(e) => handleChange('desiredState', e.target.value)}
                  placeholder="Example: Every family in our village has access to clean, safe water within 5 minutes of their home. Children are healthy, women have time for education and work, and waterborne diseases are eliminated..."
                  rows={6}
                  className={`problem-statement-form__textarea ${errors.desiredState ? 'problem-statement-form__textarea--error' : ''}`}
                />
                <div className="problem-statement-form__field-meta">
                  <span className={`problem-statement-form__char-count ${formData.desiredState.length < 100 ? 'problem-statement-form__char-count--warning' : ''}`}>
                    {formData.desiredState.length} / 100 characters minimum
                  </span>
                </div>
                {errors.desiredState && (
                  <span className="problem-statement-form__error">{errors.desiredState}</span>
                )}
              </div>

              {/* The Gap */}
              <div className="problem-statement-form__field">
                <label htmlFor="theGap" className="problem-statement-form__label">
                  <span className="problem-statement-form__label-icon">⚡</span>
                  The Gap <span className="problem-statement-form__required">*</span>
                </label>
                <p className="problem-statement-form__field-hint">
                  What's missing? What needs to happen to move from current reality to desired state?
                </p>
                <textarea
                  id="theGap"
                  value={formData.theGap}
                  onChange={(e) => handleChange('theGap', e.target.value)}
                  placeholder="Example: We need water infrastructure (wells, pipes, filters), technical expertise to install and maintain systems, funding for materials, and community training on water management..."
                  rows={5}
                  className={`problem-statement-form__textarea ${errors.theGap ? 'problem-statement-form__textarea--error' : ''}`}
                />
                <div className="problem-statement-form__field-meta">
                  <span className={`problem-statement-form__char-count ${formData.theGap.length < 50 ? 'problem-statement-form__char-count--warning' : ''}`}>
                    {formData.theGap.length} / 50 characters minimum
                  </span>
                </div>
                {errors.theGap && (
                  <span className="problem-statement-form__error">{errors.theGap}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Evidence */}
        {currentStep === 1 && (
          <div className="problem-statement-form__content">
            <ProblemEvidenceUploader
              evidence={formData.evidence}
              onEvidenceUpdate={handleEvidenceUpdate}
              error={errors.evidence}
            />
          </div>
        )}

        {/* Step 2: Data & Statistics */}
        {currentStep === 2 && (
          <div className="problem-statement-form__content">
            <ProblemDataInput
              statistics={formData.statistics}
              onStatisticsUpdate={handleStatisticsUpdate}
            />
          </div>
        )}

        {/* Actions */}
        <div className="problem-statement-form__actions">
          <button
            type="button"
            onClick={handlePrevious}
            className="problem-statement-form__button problem-statement-form__button--secondary"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
            {currentStep === 0 ? 'Back to Stage -4' : 'Previous'}
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="problem-statement-form__button problem-statement-form__button--primary"
          >
            {currentStep === 2 ? 'Complete & Continue' : 'Next'}
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProblemStatementForm;