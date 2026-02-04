/**
 * GPS Lab Platform - IntroductionForm Component
 * 
 * Stage -4: Who are you?
 * Collects GPO's name, background, and community introduction.
 * 
 * @module components/gpo/GPOStages/Stage_Negative4/IntroductionForm
 */

import React, { useState, useCallback } from 'react';
import SelfieVideoRecorder from './SelfieVideoRecorder';
import IntroductionPreview from './IntroductionPreview';
import './IntroductionForm.css';

/**
 * IntroductionForm Component
 */
const IntroductionForm = ({
  stageData = {},
  onComplete,
  onBack,
  className = '',
  ...props
}) => {
  const [formData, setFormData] = useState({
    fullName: stageData.fullName || '',
    location: stageData.location || '',
    background: stageData.background || '',
    community: stageData.community || '',
    selfieVideo: stageData.selfieVideo || null,
    ...stageData
  });

  const [showVideoRecorder, setShowVideoRecorder] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});

  /**
   * Handle input change
   */
  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  /**
   * Handle video recorded
   */
  const handleVideoRecorded = useCallback((videoBlob) => {
    setFormData(prev => ({ ...prev, selfieVideo: videoBlob }));
    setShowVideoRecorder(false);
  }, []);

  /**
   * Validate form
   */
  const validate = useCallback(() => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Please enter your location';
    }

    if (!formData.background.trim()) {
      newErrors.background = 'Please share your background';
    } else if (formData.background.trim().length < 50) {
      newErrors.background = 'Background must be at least 50 characters';
    }

    if (!formData.community.trim()) {
      newErrors.community = 'Please describe your community';
    } else if (formData.community.trim().length < 50) {
      newErrors.community = 'Community description must be at least 50 characters';
    }

    if (!formData.selfieVideo) {
      newErrors.selfieVideo = 'Please record a 1-minute selfie video';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  /**
   * Handle preview
   */
  const handlePreview = useCallback(() => {
    if (validate()) {
      setShowPreview(true);
    }
  }, [validate]);

  /**
   * Handle submit
   */
  const handleSubmit = useCallback(() => {
    if (validate()) {
      onComplete?.(formData);
    }
  }, [formData, validate, onComplete]);

  const classNames = ['introduction-form', className].filter(Boolean).join(' ');

  // Show preview
  if (showPreview) {
    return (
      <IntroductionPreview
        formData={formData}
        onEdit={() => setShowPreview(false)}
        onSubmit={handleSubmit}
      />
    );
  }

  // Show video recorder
  if (showVideoRecorder) {
    return (
      <SelfieVideoRecorder
        onVideoRecorded={handleVideoRecorded}
        onCancel={() => setShowVideoRecorder(false)}
        existingVideo={formData.selfieVideo}
      />
    );
  }

  return (
    <div className={classNames} {...props}>
      <div className="introduction-form__container">
        {/* Instructions */}
        <div className="introduction-form__instructions">
          <h3 className="introduction-form__instructions-title">
            Let's get to know you! 👋
          </h3>
          <p className="introduction-form__instructions-text">
            Share your story, your background, and your community. This helps Global Problem Solvers 
            understand who you are and why this problem matters to you.
          </p>
        </div>

        {/* Form Fields */}
        <div className="introduction-form__fields">
          {/* Full Name */}
          <div className="introduction-form__field">
            <label htmlFor="fullName" className="introduction-form__label">
              Full Name <span className="introduction-form__required">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="Enter your full name"
              className={`introduction-form__input ${errors.fullName ? 'introduction-form__input--error' : ''}`}
            />
            {errors.fullName && (
              <span className="introduction-form__error">{errors.fullName}</span>
            )}
          </div>

          {/* Location */}
          <div className="introduction-form__field">
            <label htmlFor="location" className="introduction-form__label">
              Location <span className="introduction-form__required">*</span>
            </label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="City, Country (e.g., Nairobi, Kenya)"
              className={`introduction-form__input ${errors.location ? 'introduction-form__input--error' : ''}`}
            />
            {errors.location && (
              <span className="introduction-form__error">{errors.location}</span>
            )}
          </div>

          {/* Background */}
          <div className="introduction-form__field">
            <label htmlFor="background" className="introduction-form__label">
              Your Background <span className="introduction-form__required">*</span>
            </label>
            <textarea
              id="background"
              value={formData.background}
              onChange={(e) => handleChange('background', e.target.value)}
              placeholder="Tell us about yourself: your education, work, experiences, passions... (minimum 50 characters)"
              rows={5}
              className={`introduction-form__textarea ${errors.background ? 'introduction-form__textarea--error' : ''}`}
            />
            <div className="introduction-form__field-meta">
              <span className={`introduction-form__char-count ${formData.background.length < 50 ? 'introduction-form__char-count--warning' : ''}`}>
                {formData.background.length} / 50 characters minimum
              </span>
            </div>
            {errors.background && (
              <span className="introduction-form__error">{errors.background}</span>
            )}
          </div>

          {/* Community */}
          <div className="introduction-form__field">
            <label htmlFor="community" className="introduction-form__label">
              Your Community <span className="introduction-form__required">*</span>
            </label>
            <textarea
              id="community"
              value={formData.community}
              onChange={(e) => handleChange('community', e.target.value)}
              placeholder="Describe your community: who are the people you serve? What are their hopes and challenges? (minimum 50 characters)"
              rows={5}
              className={`introduction-form__textarea ${errors.community ? 'introduction-form__textarea--error' : ''}`}
            />
            <div className="introduction-form__field-meta">
              <span className={`introduction-form__char-count ${formData.community.length < 50 ? 'introduction-form__char-count--warning' : ''}`}>
                {formData.community.length} / 50 characters minimum
              </span>
            </div>
            {errors.community && (
              <span className="introduction-form__error">{errors.community}</span>
            )}
          </div>

          {/* Selfie Video */}
          <div className="introduction-form__field">
            <label className="introduction-form__label">
              1-Minute Selfie Video <span className="introduction-form__required">*</span>
            </label>
            <p className="introduction-form__field-hint">
              Record a short video introducing yourself. Be authentic and speak from the heart!
            </p>
            
            <button
              type="button"
              onClick={() => setShowVideoRecorder(true)}
              className="introduction-form__video-button"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="introduction-form__video-icon">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
              </svg>
              {formData.selfieVideo ? 'Re-record Video' : 'Record Video'}
            </button>

            {formData.selfieVideo && (
              <div className="introduction-form__video-status">
                <svg viewBox="0 0 20 20" fill="currentColor" className="introduction-form__check-icon">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span>Video recorded successfully!</span>
              </div>
            )}

            {errors.selfieVideo && (
              <span className="introduction-form__error">{errors.selfieVideo}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="introduction-form__actions">
          <button
            type="button"
            onClick={handlePreview}
            className="introduction-form__button introduction-form__button--primary"
          >
            Preview & Continue
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroductionForm;