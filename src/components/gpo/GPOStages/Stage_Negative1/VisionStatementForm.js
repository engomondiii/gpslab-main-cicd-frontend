/**
 * GPS Lab Platform - VisionStatementForm Component
 *
 * Stage -1: What future do you envision?
 * Vision statement + future media + before/after comparison.
 *
 * @module components/gpo/GPOStages/Stage_Negative1/VisionStatementForm
 */

import React, { useState, useCallback } from 'react';
import FutureVisionUploader from './FutureVisionUploader';
import BeforeAfterComparison from './BeforeAfterComparison';
import './VisionStatementForm.css';

const VisionStatementForm = ({
  stageData = {},
  onComplete,
  onBack,
  className = '',
  ...props
}) => {
  const [formData, setFormData] = useState({
    visionStatement: stageData.visionStatement || '',
    successMetrics: stageData.successMetrics || '',
    timeframe: stageData.timeframe || '',
    futureMedia: stageData.futureMedia || [],
    beforeImages: stageData.beforeImages || [],
    afterImages: stageData.afterImages || [],
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
      if (!formData.visionStatement.trim() || formData.visionStatement.trim().length < 50)
        newErrors.visionStatement = 'Vision statement must be at least 50 characters';
      if (!formData.successMetrics.trim())
        newErrors.successMetrics = 'Please describe how you will measure success';
      if (!formData.timeframe.trim())
        newErrors.timeframe = 'Please specify a timeframe';
    }
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

  const steps = ['Vision Statement', 'Future Images', 'Before vs After'];
  const classNames = ['vision-statement-form', className].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...props}>
      <div className="vsf__container">

        {/* Steps */}
        <div className="vsf__steps">
          {steps.map((step, i) => (
            <div key={i} className={`vsf__step ${i === currentStep ? 'vsf__step--active' : ''} ${i < currentStep ? 'vsf__step--done' : ''}`}>
              <div className="vsf__step-num">{i < currentStep ? '✓' : i + 1}</div>
              <span className="vsf__step-label">{step}</span>
            </div>
          ))}
        </div>

        {/* Step 0 — Vision Statement */}
        {currentStep === 0 && (
          <div className="vsf__content">
            <div className="vsf__callout">
              <span className="vsf__callout-icon">🌟</span>
              <div>
                <h3 className="vsf__callout-title">Paint the Future in Detail</h3>
                <p className="vsf__callout-text">
                  When GPS solves your problem, what exactly does success look like?
                  The more vivid and specific your vision, the more motivating it becomes for Problem Solvers.
                </p>
              </div>
            </div>

            <div className="vsf__fields">
              {/* Vision Statement */}
              <div className="vsf__field">
                <label htmlFor="vision" className="vsf__label">
                  <span className="vsf__label-icon">🌅</span>
                  Your Vision Statement
                  <span className="vsf__required">*</span>
                </label>
                <p className="vsf__hint">
                  Complete this sentence: <em>"When this problem is solved, then..."</em> — describe the
                  transformed future for your community in vivid, specific, measurable terms.
                </p>
                <div className="vsf__sentence-starter">
                  <span className="vsf__starter-text">When this problem is solved, then...</span>
                </div>
                <textarea
                  id="vision"
                  value={formData.visionStatement}
                  onChange={e => handleChange('visionStatement', e.target.value)}
                  placeholder="...our children will attend school every day without missing class to fetch water. Our women will have 4 extra hours daily for education, business, and family. Waterborne illnesses will drop by 90%. Our village will become a model for sustainable water management in the region..."
                  rows={7}
                  className={`vsf__textarea ${errors.visionStatement ? 'vsf__textarea--error' : ''}`}
                />
                <div className="vsf__meta">
                  <span className={`vsf__count ${formData.visionStatement.length < 50 ? 'vsf__count--warn' : 'vsf__count--ok'}`}>
                    {formData.visionStatement.length} / 50 min characters
                  </span>
                </div>
                {errors.visionStatement && <span className="vsf__error">{errors.visionStatement}</span>}
              </div>

              {/* Success Metrics */}
              <div className="vsf__field">
                <label htmlFor="metrics" className="vsf__label">
                  <span className="vsf__label-icon">📈</span>
                  How Will You Measure Success?
                  <span className="vsf__required">*</span>
                </label>
                <p className="vsf__hint">
                  List specific, measurable indicators that will confirm the problem is solved.
                </p>
                <textarea
                  id="metrics"
                  value={formData.successMetrics}
                  onChange={e => handleChange('successMetrics', e.target.value)}
                  placeholder="• 100% of families have clean water within 200m of home&#10;• Zero waterborne illness cases per year&#10;• Women save 4+ hours daily&#10;• All children attend school 5 days/week&#10;• Community water committee operational"
                  rows={6}
                  className={`vsf__textarea ${errors.successMetrics ? 'vsf__textarea--error' : ''}`}
                />
                {errors.successMetrics && <span className="vsf__error">{errors.successMetrics}</span>}
              </div>

              {/* Timeframe */}
              <div className="vsf__field vsf__field--inline">
                <label htmlFor="timeframe" className="vsf__label">
                  <span className="vsf__label-icon">🗓️</span>
                  Desired Timeframe
                  <span className="vsf__required">*</span>
                </label>
                <div className="vsf__timeframe-options">
                  {['6 months', '1 year', '2 years', '3-5 years', '5+ years'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleChange('timeframe', t)}
                      className={`vsf__timeframe-btn ${formData.timeframe === t ? 'vsf__timeframe-btn--active' : ''}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {errors.timeframe && <span className="vsf__error">{errors.timeframe}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Step 1 — Future Media */}
        {currentStep === 1 && (
          <div className="vsf__content">
            <FutureVisionUploader
              media={formData.futureMedia}
              onMediaUpdate={media => handleChange('futureMedia', media)}
            />
          </div>
        )}

        {/* Step 2 — Before/After */}
        {currentStep === 2 && (
          <div className="vsf__content">
            <BeforeAfterComparison
              beforeImages={formData.beforeImages}
              afterImages={formData.afterImages}
              onBeforeUpdate={imgs => handleChange('beforeImages', imgs)}
              onAfterUpdate={imgs => handleChange('afterImages', imgs)}
            />
          </div>
        )}

        {/* Actions */}
        <div className="vsf__actions">
          <button type="button" onClick={handlePrevious} className="vsf__btn vsf__btn--secondary">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
            {currentStep === 0 ? 'Back to Stage -2' : 'Previous'}
          </button>
          <button type="button" onClick={handleNext} className="vsf__btn vsf__btn--primary">
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

export default VisionStatementForm;