/**
 * Checkpoint Submission Component
 * 
 * Form for submitting checkpoint answers.
 */

import React, { useState } from 'react';
import { validateCheckpointSubmission } from '../../../utils/validators/gps101.validator';
import { formatWordCount, formatCharacterCount } from '../../../utils/formatters/gps101.formatter';
import './CheckpointSubmission.css';

const CheckpointSubmission = ({ 
  checkpoint, 
  onSubmit, 
  onSaveDraft,
  initialData,
  isSubmitting = false 
}) => {
  const [answer, setAnswer] = useState(initialData?.answer || '');
  const [reflection, setReflection] = useState(initialData?.reflection || '');
  const [fileUpload, setFileUpload] = useState(null);
  const [videoUpload, setVideoUpload] = useState(null);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (isDraft = false) => {
    setErrors([]);

    const submissionData = {
      answer,
      reflection: checkpoint.type === 'reflection' ? reflection : null,
      fileUpload,
      videoUpload,
      isDraft
    };

    if (!isDraft) {
      const validation = validateCheckpointSubmission(checkpoint, submissionData);
      if (!validation.valid) {
        setErrors(validation.errors);
        return;
      }
    }

    try {
      if (isDraft) {
        await onSaveDraft(submissionData);
      } else {
        await onSubmit(submissionData);
      }
    } catch (error) {
      setErrors([error.message || 'Submission failed']);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileUpload(file);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoUpload(file);
    }
  };

  return (
    <div className="checkpoint-submission">
      {/* Errors */}
      {errors.length > 0 && (
        <div className="submission-errors">
          <div className="error-header">
            <span className="error-icon">⚠️</span>
            <span>Please fix the following:</span>
          </div>
          <ul className="error-list">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Checkpoint Question */}
      <div className="submission-question">
        <h3>{checkpoint.question}</h3>
        {checkpoint.questionKo && (
          <p className="question-korean">{checkpoint.questionKo}</p>
        )}
      </div>

      {/* Answer Section */}
      <div className="submission-section">
        <div className="section-header">
          <label className="section-label">Your Answer</label>
          <div className="character-count">
            {formatCharacterCount(answer)} • {formatWordCount(answer)}
          </div>
        </div>

        <textarea
          className="answer-textarea"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Write your answer here..."
          rows={12}
        />

        <div className="section-hints">
          <p className="hint-text">
            Minimum: {checkpoint.minLength || 100} characters • 
            Maximum: {checkpoint.maxLength || 5000} characters
          </p>
        </div>
      </div>

      {/* Reflection Section (for reflection type) */}
      {checkpoint.type === 'reflection' && (
        <div className="submission-section">
          <div className="section-header">
            <label className="section-label">Personal Reflection (Optional)</label>
            <div className="character-count">
              {formatCharacterCount(reflection)}
            </div>
          </div>

          <textarea
            className="reflection-textarea"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Reflect on your learning, insights, or feelings..."
            rows={6}
          />
        </div>
      )}

      {/* File Upload */}
      {checkpoint.requiresUpload && (
        <div className="submission-section">
          <label className="section-label">File Upload *</label>
          <div className="file-upload-area">
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              className="file-input"
            />
            <label htmlFor="file-upload" className="file-upload-label">
              <span className="upload-icon">📎</span>
              <span className="upload-text">
                {fileUpload ? fileUpload.name : 'Choose file or drag here'}
              </span>
            </label>
          </div>
          {fileUpload && (
            <div className="file-preview">
              <span className="file-icon">📄</span>
              <span className="file-name">{fileUpload.name}</span>
              <button 
                className="remove-file-button"
                onClick={() => setFileUpload(null)}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      {/* Video Upload */}
      {checkpoint.requiresVideo && (
        <div className="submission-section">
          <label className="section-label">Video Submission *</label>
          <div className="file-upload-area">
            <input
              type="file"
              id="video-upload"
              onChange={handleVideoChange}
              accept="video/*"
              className="file-input"
            />
            <label htmlFor="video-upload" className="file-upload-label">
              <span className="upload-icon">🎥</span>
              <span className="upload-text">
                {videoUpload ? videoUpload.name : 'Choose video or drag here'}
              </span>
            </label>
          </div>
          {videoUpload && (
            <div className="file-preview">
              <span className="file-icon">🎬</span>
              <span className="file-name">{videoUpload.name}</span>
              <button 
                className="remove-file-button"
                onClick={() => setVideoUpload(null)}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      {/* Navigator AI Help */}
      <div className="navigator-help-section">
        <div className="help-header">
          <span className="help-icon">💡</span>
          <span className="help-title">Need help?</span>
        </div>
        <p className="help-text">
          Use ChatGPT or Navigator AI to brainstorm ideas, but make sure your final answer is authentic and in your own words.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="submission-actions">
        <button 
          className="draft-button"
          onClick={() => handleSubmit(true)}
          disabled={isSubmitting || !answer.trim()}
        >
          Save Draft
        </button>

        <button 
          className="submit-button"
          onClick={() => handleSubmit(false)}
          disabled={isSubmitting || !answer.trim()}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Answer'}
        </button>
      </div>
    </div>
  );
};

export default CheckpointSubmission;