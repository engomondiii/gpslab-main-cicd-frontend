/**
 * GPS Lab Platform - CallToActionForm Component
 *
 * Stage 0: How can GPS help you?
 * Collaboration needs, invitation video, and skills needed.
 *
 * @module components/gpo/GPOStages/Stage0/CallToActionForm
 */

import React, { useState, useCallback } from 'react';
import InvitationVideoRecorder from './InvitationVideoRecorder';
import SkillsNeededSelector from './SkillsNeededSelector';
import './CallToActionForm.css';

const CallToActionForm = ({
  stageData = {},
  onComplete,
  onBack,
  className = '',
  ...props
}) => {
  const [formData, setFormData] = useState({
    collaborationNeeds: stageData.collaborationNeeds || '',
    whatYouOffer: stageData.whatYouOffer || '',
    invitationVideo: stageData.invitationVideo || null,
    skillsNeeded: stageData.skillsNeeded || [],
    ...stageData
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);

  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
  }, [errors]);

  const validateStep = useCallback(() => {
    const newErrors = {};
    if (currentStep === 0) {
      if (!formData.collaborationNeeds.trim() || formData.collaborationNeeds.trim().length < 50)
        newErrors.collaborationNeeds = 'Please describe your collaboration needs (min 50 chars)';
      if (!formData.whatYouOffer.trim())
        newErrors.whatYouOffer = 'Please describe what you offer to collaborators';
    }
    if (currentStep === 1 && !formData.invitationVideo)
      newErrors.invitationVideo = 'Please record an invitation video';
    if (currentStep === 2 && formData.skillsNeeded.length < 3)
      newErrors.skillsNeeded = 'Please select at least 3 skills you need';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentStep, formData]);

  const handleNext = useCallback(() => {
    if (validateStep()) {
      if (currentStep < 2) setCurrentStep(s => s + 1);
      else onComplete?.(formData);
    }
  }, [currentStep, validateStep, formData, onComplete]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
    else onBack?.();
  }, [currentStep, onBack]);

  const steps = ['Collaboration Needs', 'Invitation Video', 'Skills Needed'];
  const classNames = ['call-to-action-form', className].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...props}>
      <div className="ctaf__container">
        {/* Steps */}
        <div className="ctaf__steps">
          {steps.map((step, i) => (
            <div key={i} className={`ctaf__step ${i === currentStep ? 'ctaf__step--active' : ''} ${i < currentStep ? 'ctaf__step--done' : ''}`}>
              <div className="ctaf__step-num">{i < currentStep ? '✓' : i + 1}</div>
              <span className="ctaf__step-label">{step}</span>
            </div>
          ))}
        </div>

        {/* Step 0 — Collaboration Needs */}
        {currentStep === 0 && (
          <div className="ctaf__content">
            <div className="ctaf__callout">
              <span className="ctaf__callout-icon">🤝</span>
              <div>
                <h3 className="ctaf__callout-title">Invite Global Problem Solvers</h3>
                <p className="ctaf__callout-text">
                  Be specific about what you need and what you offer.
                  GPS are more likely to join when they understand exactly how they can contribute
                  and what they'll gain from the experience.
                </p>
              </div>
            </div>

            <div className="ctaf__fields">
              <div className="ctaf__field">
                <label htmlFor="collabNeeds" className="ctaf__label">
                  <span className="ctaf__icon">🔧</span>
                  What Kind of Help Do You Need?
                  <span className="ctaf__required">*</span>
                </label>
                <p className="ctaf__hint">
                  Be specific: technical expertise, funding, research, project management, training,
                  medical knowledge, legal advice, etc.
                </p>
                <textarea
                  id="collabNeeds"
                  value={formData.collaborationNeeds}
                  onChange={e => handleChange('collaborationNeeds', e.target.value)}
                  placeholder="We need: 1) A water engineer to design a low-cost filtration system, 2) A fundraiser to help us access grants, 3) A project manager to coordinate community installation, 4) A health trainer to teach water hygiene..."
                  rows={7}
                  className={`ctaf__textarea ${errors.collaborationNeeds ? 'ctaf__textarea--error' : ''}`}
                />
                <div className="ctaf__meta">
                  <span className={`ctaf__count ${formData.collaborationNeeds.length < 50 ? 'ctaf__count--warn' : 'ctaf__count--ok'}`}>
                    {formData.collaborationNeeds.length} / 50 min characters
                  </span>
                </div>
                {errors.collaborationNeeds && <span className="ctaf__error">{errors.collaborationNeeds}</span>}
              </div>

              <div className="ctaf__field">
                <label htmlFor="offer" className="ctaf__label">
                  <span className="ctaf__icon">💝</span>
                  What Do You Offer Collaborators?
                  <span className="ctaf__required">*</span>
                </label>
                <p className="ctaf__hint">
                  What can GPS gain from working with you? Local knowledge, community access,
                  meaningful impact, cultural exchange, field experience, recognition?
                </p>
                <textarea
                  id="offer"
                  value={formData.whatYouOffer}
                  onChange={e => handleChange('whatYouOffer', e.target.value)}
                  placeholder="We offer: deep community relationships and local knowledge, real-world impact that you can see and measure, cultural immersion experience, letters of recommendation, co-authorship on any published research..."
                  rows={5}
                  className={`ctaf__textarea ${errors.whatYouOffer ? 'ctaf__textarea--error' : ''}`}
                />
                {errors.whatYouOffer && <span className="ctaf__error">{errors.whatYouOffer}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Step 1 — Invitation Video */}
        {currentStep === 1 && (
          <div className="ctaf__content">
            <InvitationVideoRecorder
              existingVideo={formData.invitationVideo}
              onVideoRecorded={video => handleChange('invitationVideo', video)}
              error={errors.invitationVideo}
            />
          </div>
        )}

        {/* Step 2 — Skills Needed */}
        {currentStep === 2 && (
          <div className="ctaf__content">
            <SkillsNeededSelector
              selected={formData.skillsNeeded}
              onSelectionChange={skills => handleChange('skillsNeeded', skills)}
              error={errors.skillsNeeded}
            />
          </div>
        )}

        {/* Actions */}
        <div className="ctaf__actions">
          <button type="button" onClick={handlePrevious} className="ctaf__btn ctaf__btn--secondary">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
            {currentStep === 0 ? 'Back to Stage -1' : 'Previous'}
          </button>
          <button type="button" onClick={handleNext} className="ctaf__btn ctaf__btn--primary">
            {currentStep === 2 ? '🚀 Complete GPO Call' : 'Next'}
            {currentStep < 2 && (
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallToActionForm;