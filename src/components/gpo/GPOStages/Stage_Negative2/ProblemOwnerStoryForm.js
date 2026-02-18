/**
 * GPS Lab Platform - ProblemOwnerStoryForm Component
 *
 * Stage -2: Whose pain does this problem represent?
 * Captures testimony, lived experience and daily burden.
 *
 * @module components/gpo/GPOStages/Stage_Negative2/ProblemOwnerStoryForm
 */

import React, { useState, useCallback } from 'react';
import TestimonyRecorder from './TestimonyRecorder';
import DailyLifeCapture from './DailyLifeCapture';
import './ProblemOwnerStoryForm.css';

const ProblemOwnerStoryForm = ({
  stageData = {},
  onComplete,
  onBack,
  className = '',
  ...props
}) => {
  const [formData, setFormData] = useState({
    testimony: stageData.testimony || '',
    dailyBurden: stageData.dailyBurden || '',
    affectedPeople: stageData.affectedPeople || '',
    testimonyVideo: stageData.testimonyVideo || null,
    dailyLifeMedia: stageData.dailyLifeMedia || [],
    ...stageData
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);

  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
    }
  }, [errors]);

  const validateStep = useCallback(() => {
    const newErrors = {};
    if (currentStep === 0) {
      if (!formData.testimony.trim() || formData.testimony.trim().length < 100)
        newErrors.testimony = 'Testimony must be at least 100 characters';
      if (!formData.dailyBurden.trim() || formData.dailyBurden.trim().length < 50)
        newErrors.dailyBurden = 'Please describe the daily burden (min 50 characters)';
      if (!formData.affectedPeople.trim())
        newErrors.affectedPeople = 'Please describe who is affected';
    }
    if (currentStep === 1 && !formData.testimonyVideo)
      newErrors.testimonyVideo = 'Please record a testimony video';
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

  const steps = ['Your Story', 'Testimony Video', 'Daily Life'];
  const classNames = ['problem-owner-story-form', className].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...props}>
      <div className="posf__container">

        {/* Step Indicator */}
        <div className="posf__steps">
          {steps.map((step, i) => (
            <div key={i} className={`posf__step ${i === currentStep ? 'posf__step--active' : ''} ${i < currentStep ? 'posf__step--done' : ''}`}>
              <div className="posf__step-num">{i < currentStep ? '✓' : i + 1}</div>
              <span className="posf__step-label">{step}</span>
            </div>
          ))}
        </div>

        {/* Step 0 — Written Story */}
        {currentStep === 0 && (
          <div className="posf__content">
            <div className="posf__callout">
              <span className="posf__callout-icon">💔</span>
              <div>
                <h3 className="posf__callout-title">Give a Face to the Problem</h3>
                <p className="posf__callout-text">
                  Data speaks to the mind, but stories speak to the heart. Share the lived reality
                  so Global Problem Solvers truly feel the weight of what needs solving.
                </p>
              </div>
            </div>

            <div className="posf__fields">
              {/* Testimony */}
              <div className="posf__field">
                <label htmlFor="testimony" className="posf__label">
                  <span className="posf__label-icon">📝</span>
                  Your Personal Testimony
                  <span className="posf__required">*</span>
                </label>
                <p className="posf__hint">
                  Write your story in the first person. How does this problem affect your daily life?
                  What have you lost? What do you fear? Be raw and honest.
                </p>
                <textarea
                  id="testimony"
                  value={formData.testimony}
                  onChange={e => handleChange('testimony', e.target.value)}
                  placeholder="Every morning I wake up at 4am because that is the only time there is enough silence to hear the sound of the river... (write your true story)"
                  rows={8}
                  className={`posf__textarea ${errors.testimony ? 'posf__textarea--error' : ''}`}
                />
                <div className="posf__meta">
                  <span className={`posf__count ${formData.testimony.length < 100 ? 'posf__count--warn' : 'posf__count--ok'}`}>
                    {formData.testimony.length} / 100 min characters
                  </span>
                </div>
                {errors.testimony && <span className="posf__error">{errors.testimony}</span>}
              </div>

              {/* Daily Burden */}
              <div className="posf__field">
                <label htmlFor="dailyBurden" className="posf__label">
                  <span className="posf__label-icon">⏳</span>
                  The Daily Burden
                  <span className="posf__required">*</span>
                </label>
                <p className="posf__hint">
                  Describe specifically what you or your community must do every day because of this problem.
                  Time lost, money spent, physical toll, emotional weight.
                </p>
                <textarea
                  id="dailyBurden"
                  value={formData.dailyBurden}
                  onChange={e => handleChange('dailyBurden', e.target.value)}
                  placeholder="Every day our women spend 6 hours walking to collect water. Children miss school. Elderly cannot work their land..."
                  rows={6}
                  className={`posf__textarea ${errors.dailyBurden ? 'posf__textarea--error' : ''}`}
                />
                <div className="posf__meta">
                  <span className={`posf__count ${formData.dailyBurden.length < 50 ? 'posf__count--warn' : 'posf__count--ok'}`}>
                    {formData.dailyBurden.length} / 50 min characters
                  </span>
                </div>
                {errors.dailyBurden && <span className="posf__error">{errors.dailyBurden}</span>}
              </div>

              {/* Who is Affected */}
              <div className="posf__field">
                <label htmlFor="affectedPeople" className="posf__label">
                  <span className="posf__label-icon">👥</span>
                  Who Is Affected?
                  <span className="posf__required">*</span>
                </label>
                <p className="posf__hint">
                  Describe the specific groups of people this problem impacts — children, women, farmers,
                  elderly, businesses, etc. Give numbers where you can.
                </p>
                <textarea
                  id="affectedPeople"
                  value={formData.affectedPeople}
                  onChange={e => handleChange('affectedPeople', e.target.value)}
                  placeholder="Approximately 2,000 people across 3 villages: 600 children under 12 who face health risks, 400 women who carry the water burden, 300 farmers whose crops fail..."
                  rows={5}
                  className={`posf__textarea ${errors.affectedPeople ? 'posf__textarea--error' : ''}`}
                />
                {errors.affectedPeople && <span className="posf__error">{errors.affectedPeople}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Step 1 — Testimony Video */}
        {currentStep === 1 && (
          <div className="posf__content">
            <TestimonyRecorder
              existingVideo={formData.testimonyVideo}
              onVideoRecorded={video => handleChange('testimonyVideo', video)}
              error={errors.testimonyVideo}
            />
          </div>
        )}

        {/* Step 2 — Daily Life Media */}
        {currentStep === 2 && (
          <div className="posf__content">
            <DailyLifeCapture
              media={formData.dailyLifeMedia}
              onMediaUpdate={media => handleChange('dailyLifeMedia', media)}
            />
          </div>
        )}

        {/* Actions */}
        <div className="posf__actions">
          <button type="button" onClick={handlePrevious} className="posf__btn posf__btn--secondary">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
            {currentStep === 0 ? 'Back to Stage -3' : 'Previous'}
          </button>
          <button type="button" onClick={handleNext} className="posf__btn posf__btn--primary">
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

export default ProblemOwnerStoryForm;