/**
 * GPS Lab Platform - BiteSubmissionForm Component
 * GPS 101 INTEGRATION: Shows GPS 101 context, deliverable connections, Navigator tips
 * 
 * Complete submission form combining deliverables and metadata.
 * 
 * @module components/bite/BiteSubmission/BiteSubmissionForm
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BiteDeliverableUpload from './BiteDeliverableUpload';
import BiteMetadataForm from './BiteMetadataForm';
import './BiteSubmissionForm.css';

/**
 * BiteSubmissionForm Component
 */
const BiteSubmissionForm = ({
  bite,
  onSubmit,
  onCancel,
  onSaveDraft,
  suggestedTags = [],
  // NEW: GPS 101 props
  isGPS101 = false,
  gps101StageNumber,
  gps101StageQuestion,
  gps101DeliverableName,
  gps101NavigatorTips = [],
  isLoading = false,
  className = '',
  ...props
}) => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [summary, setSummary] = useState('');
  const [reflection, setReflection] = useState('');
  const [challenges, setChallenges] = useState('');
  const [learnings, setLearnings] = useState('');
  const [tags, setTags] = useState([]);
  const [step, setStep] = useState(1); // 1: deliverables, 2: metadata, 3: review
  
  const handleFileUpload = useCallback((newFiles) => {
    setFiles(prev => [...prev, ...newFiles]);
  }, []);
  
  const handleFileRemove = useCallback((fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);
  
  const handleTagAdd = useCallback((tag) => {
    setTags(prev => [...prev, tag]);
  }, []);
  
  const handleTagRemove = useCallback((tag) => {
    setTags(prev => prev.filter(t => t !== tag));
  }, []);
  
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        files,
        summary,
        reflection,
        challenges,
        learnings,
        tags,
        // NEW: GPS 101 metadata
        isGPS101,
        gps101StageNumber,
        gps101DeliverableName
      });
    }
  };
  
  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft({
        files,
        summary,
        reflection,
        challenges,
        learnings,
        tags
      });
    }
  };
  
  const canProceedStep1 = files.length > 0 || bite?.type === 'quiz' || (isGPS101 && bite?.type === 'reflection');
  const canProceedStep2 = summary.trim().length > 0;
  const canSubmit = canProceedStep1 && canProceedStep2;
  
  const classNames = [
    'bite-submission-form',
    isGPS101 && 'bite-submission-form--gps101',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="bite-submission-form__header">
        {/* NEW: GPS 101 Badge */}
        {isGPS101 && (
          <div className="bite-submission-form__gps101-badge">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
            </svg>
            <div>
              <span className="bite-submission-form__gps101-label">GPS 101 • Stage {gps101StageNumber}</span>
              {gps101StageQuestion && (
                <span className="bite-submission-form__gps101-question">"{gps101StageQuestion}"</span>
              )}
            </div>
          </div>
        )}
        
        <h2 className="bite-submission-form__title">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
          </svg>
          {isGPS101 ? 'Submit GPS 101 Work' : 'Submit Your Work'}
        </h2>
        
        {/* Bite Context */}
        {bite && (
          <div className="bite-submission-form__context">
            <span className="bite-submission-form__context-id">#{bite.id?.slice(-6)}</span>
            <span className="bite-submission-form__context-title">{bite.title}</span>
          </div>
        )}
        
        {/* NEW: GPS 101 Deliverable Info */}
        {isGPS101 && gps101DeliverableName && (
          <div className="bite-submission-form__gps101-deliverable-info">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
            </svg>
            <span>Contributes to: {gps101DeliverableName}</span>
          </div>
        )}
      </div>
      
      {/* Progress Steps */}
      <div className="bite-submission-form__steps">
        <button
          type="button"
          className={`bite-submission-form__step ${step >= 1 ? 'bite-submission-form__step--active' : ''} ${step > 1 ? 'bite-submission-form__step--completed' : ''}`}
          onClick={() => setStep(1)}
        >
          <span className="bite-submission-form__step-number">1</span>
          <span className="bite-submission-form__step-label">Deliverables</span>
        </button>
        <div className="bite-submission-form__step-line" />
        <button
          type="button"
          className={`bite-submission-form__step ${step >= 2 ? 'bite-submission-form__step--active' : ''} ${step > 2 ? 'bite-submission-form__step--completed' : ''}`}
          onClick={() => canProceedStep1 && setStep(2)}
          disabled={!canProceedStep1}
        >
          <span className="bite-submission-form__step-number">2</span>
          <span className="bite-submission-form__step-label">{isGPS101 ? 'Reflection' : 'Details'}</span>
        </button>
        <div className="bite-submission-form__step-line" />
        <button
          type="button"
          className={`bite-submission-form__step ${step >= 3 ? 'bite-submission-form__step--active' : ''}`}
          onClick={() => canProceedStep2 && setStep(3)}
          disabled={!canProceedStep2}
        >
          <span className="bite-submission-form__step-number">3</span>
          <span className="bite-submission-form__step-label">Review</span>
        </button>
      </div>
      
      {/* Step Content */}
      <div className="bite-submission-form__content">
        {/* Step 1: Deliverables */}
        {step === 1 && (
          <div className="bite-submission-form__step-content">
            <BiteDeliverableUpload
              files={files}
              onUpload={handleFileUpload}
              onRemove={handleFileRemove}
              required={bite?.type !== 'quiz' && bite?.type !== 'reflection'}
            />
            
            {(bite?.type === 'quiz' || (isGPS101 && bite?.type === 'reflection')) && (
              <p className="bite-submission-form__note">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                {isGPS101 && bite?.type === 'reflection'
                  ? 'File upload is optional for GPS 101 reflection tasks'
                  : 'File upload is optional for quiz tasks'}
              </p>
            )}
            
            {/* NEW: GPS 101 Navigator Tips */}
            {isGPS101 && gps101NavigatorTips.length > 0 && (
              <div className="bite-submission-form__navigator-tips">
                <h4 className="bite-submission-form__navigator-tips-title">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/>
                  </svg>
                  Navigator Tips
                </h4>
                <ul className="bite-submission-form__navigator-tips-list">
                  {gps101NavigatorTips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => navigate('/navigator', { state: { context: 'gps101', biteId: bite?.id } })}
                  className="bite-submission-form__navigator-btn"
                >
                  Ask Navigator AI
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Step 2: Metadata */}
        {step === 2 && (
          <div className="bite-submission-form__step-content">
            <BiteMetadataForm
              summary={summary}
              reflection={reflection}
              challenges={challenges}
              learnings={learnings}
              tags={tags}
              suggestedTags={isGPS101 ? [...suggestedTags, 'gps101', `stage-${gps101StageNumber}`, 'purpose-discovery'] : suggestedTags}
              onSummaryChange={setSummary}
              onReflectionChange={setReflection}
              onChallengesChange={setChallenges}
              onLearningsChange={setLearnings}
              onTagAdd={handleTagAdd}
              onTagRemove={handleTagRemove}
              showReflection={true}
              showChallenges={!isGPS101} // GPS 101 focuses on reflection over challenges
              showLearnings={true}
            />
            
            {/* NEW: GPS 101 Reflection Prompt */}
            {isGPS101 && (
              <div className="bite-submission-form__gps101-reflection-prompt">
                <h4>GPS 101 Reflection Focus</h4>
                <p>As you reflect on this task, consider:</p>
                <ul>
                  <li>How does this work connect to your purpose discovery journey?</li>
                  <li>What insights did you gain about yourself?</li>
                  <li>How might this contribute to your {gps101DeliverableName}?</li>
                </ul>
              </div>
            )}
          </div>
        )}
        
        {/* Step 3: Review */}
        {step === 3 && (
          <div className="bite-submission-form__step-content">
            <div className="bite-submission-form__review">
              {/* Files Review */}
              <div className="bite-submission-form__review-section">
                <h4 className="bite-submission-form__review-title">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                  </svg>
                  Deliverables
                </h4>
                <p className="bite-submission-form__review-value">
                  {files.length > 0 ? `${files.length} file(s) uploaded` : 'No files uploaded'}
                </p>
              </div>
              
              {/* Summary Review */}
              <div className="bite-submission-form__review-section">
                <h4 className="bite-submission-form__review-title">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                  </svg>
                  Summary
                </h4>
                <p className="bite-submission-form__review-value">{summary || 'Not provided'}</p>
              </div>
              
              {/* Reflection Review */}
              {reflection && (
                <div className="bite-submission-form__review-section">
                  <h4 className="bite-submission-form__review-title">
                    {isGPS101 ? 'GPS 101 Reflection' : 'Reflection'}
                  </h4>
                  <p className="bite-submission-form__review-value">{reflection}</p>
                </div>
              )}
              
              {/* Learnings Review */}
              {learnings && (
                <div className="bite-submission-form__review-section">
                  <h4 className="bite-submission-form__review-title">Key Learnings</h4>
                  <p className="bite-submission-form__review-value">{learnings}</p>
                </div>
              )}
              
              {/* Tags Review */}
              {tags.length > 0 && (
                <div className="bite-submission-form__review-section">
                  <h4 className="bite-submission-form__review-title">Tags</h4>
                  <div className="bite-submission-form__review-tags">
                    {tags.map(tag => (
                      <span key={tag} className="bite-submission-form__review-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* NEW: GPS 101 Context Review */}
              {isGPS101 && (
                <div className="bite-submission-form__review-section bite-submission-form__review-section--gps101">
                  <h4 className="bite-submission-form__review-title">GPS 101 Context</h4>
                  <div className="bite-submission-form__gps101-context-review">
                    <div className="bite-submission-form__gps101-context-item">
                      <strong>Stage:</strong> {gps101StageNumber}
                    </div>
                    {gps101StageQuestion && (
                      <div className="bite-submission-form__gps101-context-item">
                        <strong>Stage Question:</strong> "{gps101StageQuestion}"
                      </div>
                    )}
                    {gps101DeliverableName && (
                      <div className="bite-submission-form__gps101-context-item">
                        <strong>Contributes to:</strong> {gps101DeliverableName}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Rewards Preview */}
              {bite && (
                <div className="bite-submission-form__rewards">
                  <h4 className="bite-submission-form__rewards-title">
                    {isGPS101 ? 'Rewards Upon Approval (Contributes to Orange Beacon)' : 'Rewards Upon Approval'}
                  </h4>
                  <div className="bite-submission-form__rewards-grid">
                    {bite.xpReward && (
                      <div className="bite-submission-form__reward">
                        <span className="bite-submission-form__reward-value">+{bite.xpReward}</span>
                        <span className="bite-submission-form__reward-label">XP</span>
                      </div>
                    )}
                    {bite.barakaReward && (
                      <div className="bite-submission-form__reward bite-submission-form__reward--baraka">
                        <span className="bite-submission-form__reward-value">+{bite.barakaReward}</span>
                        <span className="bite-submission-form__reward-label">ƀ Baraka</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Actions */}
      <div className="bite-submission-form__actions">
        {onCancel && (
          <button type="button" onClick={onCancel} className="bite-submission-form__cancel-btn" disabled={isLoading}>
            Cancel
          </button>
        )}
        
        {onSaveDraft && (
          <button type="button" onClick={handleSaveDraft} className="bite-submission-form__draft-btn" disabled={isLoading}>
            Save Draft
          </button>
        )}
        
        <div className="bite-submission-form__nav">
          {step > 1 && (
            <button type="button" onClick={() => setStep(step - 1)} className="bite-submission-form__back-btn" disabled={isLoading}>
              Back
            </button>
          )}
          
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="bite-submission-form__next-btn"
              disabled={(step === 1 && !canProceedStep1) || (step === 2 && !canProceedStep2) || isLoading}
            >
              Next
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="bite-submission-form__submit-btn"
              disabled={!canSubmit || isLoading}
            >
              {isLoading ? (
                <>
                  <span className="bite-submission-form__spinner" />
                  Submitting...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  {isGPS101 ? 'Submit GPS 101 Work' : 'Submit for Review'}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BiteSubmissionForm;