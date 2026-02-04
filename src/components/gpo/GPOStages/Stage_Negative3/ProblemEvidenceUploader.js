/**
 * GPS Lab Platform - ProblemEvidenceUploader Component
 * 
 * Upload photos/videos showing the problem.
 * 
 * @module components/gpo/GPOStages/Stage_Negative3/ProblemEvidenceUploader
 */

import React, { useState, useCallback } from 'react';
import MediaGallery from '../../../common/Media/MediaGallery';
import './ProblemEvidenceUploader.css';

const MAX_FILES = 10;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  video: ['video/mp4', 'video/webm', 'video/quicktime']
};

/**
 * ProblemEvidenceUploader Component
 */
const ProblemEvidenceUploader = ({
  evidence = [],
  onEvidenceUpdate,
  error = null,
  className = '',
  ...props
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  /**
   * Handle file selection
   */
  const handleFileSelect = useCallback((event) => {
    const files = Array.from(event.target.files);
    
    if (evidence.length + files.length > MAX_FILES) {
      setUploadError(`Maximum ${MAX_FILES} files allowed`);
      return;
    }

    const validFiles = [];
    const errors = [];

    files.forEach(file => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name} is too large (max 50MB)`);
        return;
      }

      // Check file type
      const isImage = ACCEPTED_TYPES.image.includes(file.type);
      const isVideo = ACCEPTED_TYPES.video.includes(file.type);

      if (!isImage && !isVideo) {
        errors.push(`${file.name} is not a supported format`);
        return;
      }

      validFiles.push({
        id: Date.now() + Math.random(),
        file,
        type: isImage ? 'image' : 'video',
        url: URL.createObjectURL(file),
        caption: ''
      });
    });

    if (errors.length > 0) {
      setUploadError(errors.join(', '));
    } else {
      setUploadError(null);
    }

    if (validFiles.length > 0) {
      onEvidenceUpdate?.([...evidence, ...validFiles]);
    }

    // Reset input
    event.target.value = '';
  }, [evidence, onEvidenceUpdate]);

  /**
   * Handle remove evidence
   */
  const handleRemove = useCallback((id) => {
    const updated = evidence.filter(e => e.id !== id);
    onEvidenceUpdate?.(updated);
  }, [evidence, onEvidenceUpdate]);

  /**
   * Handle caption update
   */
  const handleCaptionUpdate = useCallback((id, caption) => {
    const updated = evidence.map(e => 
      e.id === id ? { ...e, caption } : e
    );
    onEvidenceUpdate?.(updated);
  }, [evidence, onEvidenceUpdate]);

  const classNames = ['problem-evidence-uploader', className].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...props}>
      <div className="problem-evidence-uploader__container">
        {/* Header */}
        <div className="problem-evidence-uploader__header">
          <h3 className="problem-evidence-uploader__title">
            Upload Evidence 📸
          </h3>
          <p className="problem-evidence-uploader__subtitle">
            Show the problem through photos and videos. Visual evidence helps Global Problem Solvers understand the reality you face.
          </p>
        </div>

        {/* Instructions */}
        <div className="problem-evidence-uploader__instructions">
          <h4 className="problem-evidence-uploader__instructions-title">
            What makes good evidence?
          </h4>
          <ul className="problem-evidence-uploader__tips">
            <li>📷 Clear photos showing the problem from different angles</li>
            <li>🎥 Short videos (30-60 seconds) documenting the situation</li>
            <li>👥 Images showing people affected (with their permission)</li>
            <li>📊 Photos of relevant data, signs, or statistics</li>
            <li>🏘️ Context shots showing the community or environment</li>
          </ul>
          <p className="problem-evidence-uploader__requirements">
            <strong>Requirements:</strong> Upload at least 2 pieces of evidence (max {MAX_FILES}). 
            Accepted formats: JPG, PNG, GIF, WebP, MP4, WebM, MOV. Max size: 50MB per file.
          </p>
        </div>

        {/* Upload Button */}
        <div className="problem-evidence-uploader__upload">
          <input
            type="file"
            id="evidence-upload"
            accept="image/*,video/*"
            multiple
            onChange={handleFileSelect}
            className="problem-evidence-uploader__input"
            disabled={evidence.length >= MAX_FILES}
          />
          <label
            htmlFor="evidence-upload"
            className={`problem-evidence-uploader__label ${
              evidence.length >= MAX_FILES ? 'problem-evidence-uploader__label--disabled' : ''
            }`}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="problem-evidence-uploader__icon">
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span>
              {evidence.length >= MAX_FILES 
                ? 'Maximum files reached' 
                : 'Upload Photos/Videos'}
            </span>
          </label>
        </div>

        {/* Upload Error */}
        {uploadError && (
          <div className="problem-evidence-uploader__error">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            {uploadError}
          </div>
        )}

        {/* Validation Error */}
        {error && (
          <div className="problem-evidence-uploader__error">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            {error}
          </div>
        )}

        {/* Gallery */}
        {evidence.length > 0 && (
          <MediaGallery
            items={evidence}
            onRemove={handleRemove}
            onCaptionUpdate={handleCaptionUpdate}
            editable
          />
        )}

        {/* Counter */}
        <div className="problem-evidence-uploader__counter">
          <span className={evidence.length < 2 ? 'problem-evidence-uploader__counter--warning' : ''}>
            {evidence.length} / {MAX_FILES} files uploaded
          </span>
          {evidence.length < 2 && (
            <span className="problem-evidence-uploader__counter-hint">
              (minimum 2 required)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemEvidenceUploader;