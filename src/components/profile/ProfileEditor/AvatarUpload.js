/**
 * GPS Lab Platform - AvatarUpload Component
 * 
 * Avatar upload and cropping interface for profile editing.
 * Supports drag-and-drop, file selection, and image preview.
 * 
 * @module components/profile/ProfileEditor/AvatarUpload
 */

import React, { useState, useCallback, useRef } from 'react';
import './AvatarUpload.css';

/**
 * Allowed image types
 */
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * AvatarUpload Component
 */
const AvatarUpload = ({
  currentAvatarUrl,
  displayName = 'User',
  onUpload,
  onRemove,
  isUploading = false,
  error = null,
  className = '',
  ...props
}) => {
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState(error);
  const fileInputRef = useRef(null);
  
  // Validate file
  const validateFile = useCallback((file) => {
    if (!file) return 'No file selected';
    
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Please upload a valid image (JPEG, PNG, GIF, or WebP)';
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }
    
    return null;
  }, []);
  
  // Handle file selection
  const handleFileSelect = useCallback((file) => {
    const validationError = validateFile(file);
    
    if (validationError) {
      setUploadError(validationError);
      return;
    }
    
    setUploadError(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Notify parent
    if (onUpload) {
      onUpload(file);
    }
  }, [validateFile, onUpload]);
  
  // Handle input change
  const handleInputChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);
  
  // Handle drag events
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);
  
  // Trigger file input
  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);
  
  // Remove avatar
  const handleRemove = useCallback(() => {
    setPreview(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onRemove) {
      onRemove();
    }
  }, [onRemove]);
  
  // Cancel preview
  const handleCancelPreview = useCallback(() => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);
  
  const displayUrl = preview || currentAvatarUrl;
  
  const classNames = [
    'avatar-upload',
    isDragging && 'avatar-upload--dragging',
    isUploading && 'avatar-upload--uploading',
    uploadError && 'avatar-upload--error',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      <label className="avatar-upload__label">Profile Picture</label>
      
      <div className="avatar-upload__container">
        {/* Current Avatar / Preview */}
        <div className="avatar-upload__preview-wrapper">
          {displayUrl ? (
            <img 
              src={displayUrl}
              alt="Avatar preview"
              className="avatar-upload__preview-image"
            />
          ) : (
            <div className="avatar-upload__preview-placeholder">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          
          {isUploading && (
            <div className="avatar-upload__loading-overlay">
              <div className="avatar-upload__spinner" />
            </div>
          )}
        </div>
        
        {/* Upload Zone */}
        <div
          className="avatar-upload__dropzone"
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_TYPES.join(',')}
            onChange={handleInputChange}
            className="avatar-upload__input"
          />
          
          <div className="avatar-upload__dropzone-content">
            <span className="avatar-upload__dropzone-icon">📷</span>
            <span className="avatar-upload__dropzone-text">
              {isDragging 
                ? 'Drop image here...'
                : 'Click to upload or drag and drop'}
            </span>
            <span className="avatar-upload__dropzone-hint">
              JPEG, PNG, GIF or WebP (max 5MB)
            </span>
          </div>
        </div>
      </div>
      
      {/* Preview Actions */}
      {preview && !isUploading && (
        <div className="avatar-upload__preview-actions">
          <button
            type="button"
            className="avatar-upload__btn avatar-upload__btn--confirm"
            onClick={() => {/* Already uploaded */}}
          >
            ✓ Keep
          </button>
          <button
            type="button"
            className="avatar-upload__btn avatar-upload__btn--cancel"
            onClick={handleCancelPreview}
          >
            ✕ Cancel
          </button>
        </div>
      )}
      
      {/* Remove Button */}
      {currentAvatarUrl && !preview && (
        <button
          type="button"
          className="avatar-upload__remove-btn"
          onClick={handleRemove}
          disabled={isUploading}
        >
          🗑️ Remove current picture
        </button>
      )}
      
      {/* Error Message */}
      {uploadError && (
        <p className="avatar-upload__error">{uploadError}</p>
      )}
    </div>
  );
};

export default AvatarUpload;