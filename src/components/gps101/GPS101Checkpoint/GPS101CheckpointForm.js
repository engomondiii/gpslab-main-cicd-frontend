/**
 * GPS101 Checkpoint Form Component
 * 
 * Wrapper component for checkpoint question forms with validation.
 * Handles different checkpoint types (reflection, quiz, short answer, etc.)
 */

import React, { useState, useEffect } from 'react';
import CheckpointQuestions from './CheckpointQuestions';
import { validateCheckpointSubmission } from '../../../utils/validators/gps101.validator';
import './GPS101CheckpointForm.css';

const GPS101CheckpointForm = ({
  checkpoint,
  onSubmit,
  onSaveDraft,
  initialData = null,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState({
    answers: initialData?.answers || {},
    reflection: initialData?.reflection || '',
    fileUpload: null,
    videoUpload: null
  });
  
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Load saved draft from localStorage
  useEffect(() => {
    if (!initialData) {
      const savedDrafts = localStorage.getItem('gps101_checkpoint_drafts');
      if (savedDrafts) {
        try {
          const drafts = JSON.parse(savedDrafts);
          const draft = drafts[checkpoint.checkpointId];
          if (draft) {
            setFormData({
              answers: draft.answers || {},
              reflection: draft.reflection || '',
              fileUpload: null,
              videoUpload: null
            });
          }
        } catch (err) {
          console.error('Error loading draft:', err);
        }
      }
    }
  }, [checkpoint.checkpointId, initialData]);

  const handleAnswerChange = (questionId, value) => {
    setFormData(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: value
      }
    }));
    
    // Clear error for this question
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const handleReflectionChange = (value) => {
    setFormData(prev => ({
      ...prev,
      reflection: value
    }));
  };

  const handleFileChange = (file) => {
    setFormData(prev => ({
      ...prev,
      fileUpload: file
    }));
  };

  const handleVideoChange = (file) => {
    setFormData(prev => ({
      ...prev,
      videoUpload: file
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // FIX: GPS 101 checkpoints use a single-question format: checkpoint.question
    // (string) with no checkpoint.questions array. The old code only looped over
    // checkpoint.questions, so single-question answers were never validated and
    // an empty textarea could be submitted without any error shown.
    if (checkpoint.question && !checkpoint.questions) {
      const mainKey = checkpoint.checkpointId || 'main';
      const mainAnswer = formData.answers[mainKey] || '';

      if (!mainAnswer.trim()) {
        newErrors[mainKey] = 'Please write your answer before submitting.';
      } else if (checkpoint.minLength && mainAnswer.length < checkpoint.minLength) {
        newErrors[mainKey] = `Minimum ${checkpoint.minLength} characters required (currently ${mainAnswer.length})`;
      } else if (checkpoint.maxLength && mainAnswer.length > checkpoint.maxLength) {
        newErrors[mainKey] = `Maximum ${checkpoint.maxLength} characters exceeded`;
      }
    }

    // Validate multi-question checkpoints
    if (checkpoint.questions) {
      checkpoint.questions.forEach(q => {
        if (q.required && !formData.answers[q.id]) {
          newErrors[q.id] = 'This question is required';
        }
        
        // Validate minimum length for text answers
        if (q.minLength && formData.answers[q.id]) {
          if (formData.answers[q.id].length < q.minLength) {
            newErrors[q.id] = `Minimum ${q.minLength} characters required`;
          }
        }
        
        // Validate maximum length
        if (q.maxLength && formData.answers[q.id]) {
          if (formData.answers[q.id].length > q.maxLength) {
            newErrors[q.id] = `Maximum ${q.maxLength} characters exceeded`;
          }
        }
      });
    }
    
    // Validate file upload if required
    if (checkpoint.requiresUpload && !formData.fileUpload) {
      newErrors.file = 'File upload is required';
    }
    
    // Validate video upload if required
    if (checkpoint.requiresVideo && !formData.videoUpload) {
      newErrors.video = 'Video upload is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: error.message || 'Submission failed' });
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    
    try {
      // Save to localStorage
      const drafts = JSON.parse(localStorage.getItem('gps101_checkpoint_drafts') || '{}');
      drafts[checkpoint.checkpointId] = {
        ...formData,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('gps101_checkpoint_drafts', JSON.stringify(drafts));
      
      // Also call parent's onSaveDraft
      if (onSaveDraft) {
        await onSaveDraft(formData);
      }
      
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Save draft error:', error);
      alert('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const getAnsweredCount = () => {
    // FIX: Single-question checkpoints have no checkpoint.questions array.
    // Return 1 if the main textarea has content, otherwise 0.
    if (checkpoint.question && !checkpoint.questions) {
      const mainKey = checkpoint.checkpointId || 'main';
      const val = formData.answers[mainKey];
      return val && val.toString().trim() !== '' ? 1 : 0;
    }
    if (!checkpoint.questions) return 0;
    return Object.keys(formData.answers).filter(
      key => formData.answers[key] && formData.answers[key].toString().trim() !== ''
    ).length;
  };

  const getTotalQuestions = () => {
    // FIX: Single-question checkpoints count as 1 total question.
    if (checkpoint.question && !checkpoint.questions) return 1;
    return checkpoint.questions ? checkpoint.questions.length : 0;
  };

  return (
    <div className="gps101-checkpoint-form">
      {/* Progress Indicator */}
      {/* FIX: Show progress bar for both single-question and multi-question
          checkpoints. Previously only rendered when checkpoint.questions existed,
          so it was always hidden for GPS 101 checkpoints. */}
      {getTotalQuestions() > 0 && (
        <div className="form-progress">
          <div className="progress-text">
            Question Progress: {getAnsweredCount()} / {getTotalQuestions()}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(getAnsweredCount() / getTotalQuestions()) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="form-errors">
          <div className="error-header">
            <span className="error-icon">⚠️</span>
            <span>Please fix the following errors:</span>
          </div>
          <ul className="error-list">
            {Object.entries(errors).map(([key, message]) => (
              <li key={key}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="checkpoint-form">
        {/* Questions */}
        <CheckpointQuestions
          checkpoint={checkpoint}
          answers={formData.answers}
          onAnswerChange={handleAnswerChange}
          errors={errors}
        />

        {/* Reflection Section (if checkpoint type is reflection) */}
        {checkpoint.type === 'reflection' && (
          <div className="reflection-section">
            <label className="section-label">
              Personal Reflection (Optional)
            </label>
            <textarea
              className="reflection-textarea"
              value={formData.reflection}
              onChange={(e) => handleReflectionChange(e.target.value)}
              placeholder="Reflect on your learning, insights, or feelings..."
              rows={6}
            />
            <div className="character-count">
              {formData.reflection.length} characters
            </div>
          </div>
        )}

        {/* File Upload */}
        {checkpoint.requiresUpload && (
          <div className="file-upload-section">
            <label className="section-label">
              File Upload {checkpoint.requiresUpload && '*'}
            </label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e.target.files[0])}
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            />
            {formData.fileUpload && (
              <div className="file-preview">
                📄 {formData.fileUpload.name}
              </div>
            )}
            {errors.file && (
              <div className="field-error">{errors.file}</div>
            )}
          </div>
        )}

        {/* Video Upload */}
        {checkpoint.requiresVideo && (
          <div className="video-upload-section">
            <label className="section-label">
              Video Upload {checkpoint.requiresVideo && '*'}
            </label>
            <input
              type="file"
              onChange={(e) => handleVideoChange(e.target.files[0])}
              accept="video/*"
            />
            {formData.videoUpload && (
              <div className="file-preview">
                🎬 {formData.videoUpload.name}
              </div>
            )}
            {errors.video && (
              <div className="field-error">{errors.video}</div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="form-actions">
          <button
            type="button"
            className="draft-button"
            onClick={handleSaveDraft}
            disabled={isSaving || isSubmitting}
          >
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
          
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting || isSaving}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GPS101CheckpointForm;