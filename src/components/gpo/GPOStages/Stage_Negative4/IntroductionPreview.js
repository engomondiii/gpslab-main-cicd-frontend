/**
 * GPS Lab Platform - IntroductionPreview Component
 * 
 * Preview introduction data before submission.
 * 
 * @module components/gpo/GPOStages/Stage_Negative4/IntroductionPreview
 */

import React from 'react';
import './IntroductionPreview.css';

/**
 * IntroductionPreview Component
 */
const IntroductionPreview = ({
  formData = {},
  onEdit,
  onSubmit,
  className = '',
  ...props
}) => {
  
  const classNames = ['introduction-preview', className].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...props}>
      <div className="introduction-preview__container">
        {/* Header */}
        <div className="introduction-preview__header">
          <h3 className="introduction-preview__title">Preview Your Introduction</h3>
          <p className="introduction-preview__subtitle">
            Review your information before continuing. You can edit if needed.
          </p>
        </div>

        {/* Content */}
        <div className="introduction-preview__content">
          {/* Video Preview */}
          {formData.selfieVideo && (
            <div className="introduction-preview__section introduction-preview__section--video">
              <h4 className="introduction-preview__section-title">Your Selfie Video</h4>
              <div className="introduction-preview__video-container">
                <video
                  controls
                  className="introduction-preview__video"
                  src={URL.createObjectURL(formData.selfieVideo)}
                >
                  Your browser does not support video playback.
                </video>
              </div>
            </div>
          )}

          {/* Personal Information */}
          <div className="introduction-preview__section">
            <h4 className="introduction-preview__section-title">Personal Information</h4>
            <div className="introduction-preview__fields">
              <div className="introduction-preview__field">
                <span className="introduction-preview__field-label">Full Name:</span>
                <span className="introduction-preview__field-value">{formData.fullName}</span>
              </div>
              <div className="introduction-preview__field">
                <span className="introduction-preview__field-label">Location:</span>
                <span className="introduction-preview__field-value">{formData.location}</span>
              </div>
            </div>
          </div>

          {/* Background */}
          <div className="introduction-preview__section">
            <h4 className="introduction-preview__section-title">Your Background</h4>
            <p className="introduction-preview__text">{formData.background}</p>
          </div>

          {/* Community */}
          <div className="introduction-preview__section">
            <h4 className="introduction-preview__section-title">Your Community</h4>
            <p className="introduction-preview__text">{formData.community}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="introduction-preview__actions">
          <button
            type="button"
            onClick={onEdit}
            className="introduction-preview__button introduction-preview__button--secondary"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
            </svg>
            Edit Information
          </button>

          <button
            type="button"
            onClick={onSubmit}
            className="introduction-preview__button introduction-preview__button--primary"
          >
            Looks Good - Continue
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroductionPreview;