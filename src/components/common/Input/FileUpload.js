/**
 * GPS Lab Platform - FileUpload Component
 * 
 * File upload component with drag & drop support,
 * preview, and validation.
 * 
 * @module components/common/Input/FileUpload
 * @version 1.0.0
 */

import React, { useState, useRef, useCallback, useId } from 'react';
import './FileUpload.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const FILE_UPLOAD_VARIANTS = {
  DEFAULT: 'default',
  COMPACT: 'compact',
  AVATAR: 'avatar'
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * FileUpload component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='default'] - Upload variant
 * @param {boolean} [props.multiple=false] - Allow multiple files
 * @param {string} [props.accept] - Accepted file types
 * @param {number} [props.maxSize] - Max file size in bytes
 * @param {number} [props.maxFiles=10] - Max number of files
 * @param {string} [props.label] - Label text
 * @param {string} [props.helperText] - Helper text
 * @param {string} [props.errorText] - Error message
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {boolean} [props.showPreview=true] - Show file preview
 * @param {Array} [props.value] - Selected files
 * @param {Function} [props.onChange] - Change handler
 * @param {Function} [props.onError] - Error handler
 */
const FileUpload = ({
  variant = FILE_UPLOAD_VARIANTS.DEFAULT,
  multiple = false,
  accept,
  maxSize,
  maxFiles = 10,
  label,
  helperText,
  errorText,
  disabled = false,
  showPreview = true,
  value = [],
  className = '',
  id: providedId,
  onChange,
  onError,
  ...props
}) => {
  
  // State
  const [isDragOver, setIsDragOver] = useState(false);
  const [internalError, setInternalError] = useState(null);
  
  // Refs
  const inputRef = useRef(null);
  
  // IDs
  const generatedId = useId();
  const inputId = providedId || generatedId;
  
  // Display error
  const displayError = errorText || internalError;
  
  // Validate file
  const validateFile = useCallback((file) => {
    // Check file type
    if (accept) {
      const acceptedTypes = accept.split(',').map(t => t.trim());
      const fileType = file.type;
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return type.toLowerCase() === fileExtension;
        }
        if (type.endsWith('/*')) {
          return fileType.startsWith(type.slice(0, -1));
        }
        return type === fileType;
      });
      
      if (!isAccepted) {
        return `File type not accepted: ${file.name}`;
      }
    }
    
    // Check file size
    if (maxSize && file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      return `File too large: ${file.name} (max ${maxSizeMB}MB)`;
    }
    
    return null;
  }, [accept, maxSize]);
  
  // Handle files
  const handleFiles = useCallback((fileList) => {
    if (disabled) return;
    
    const files = Array.from(fileList);
    
    // Check max files
    if (multiple && value.length + files.length > maxFiles) {
      const error = `Maximum ${maxFiles} files allowed`;
      setInternalError(error);
      onError?.(error);
      return;
    }
    
    // Validate each file
    const validFiles = [];
    for (const file of files) {
      const error = validateFile(file);
      if (error) {
        setInternalError(error);
        onError?.(error);
        return;
      }
      validFiles.push(file);
    }
    
    // Clear error
    setInternalError(null);
    
    // Update value
    if (multiple) {
      onChange?.([...value, ...validFiles]);
    } else {
      onChange?.(validFiles);
    }
  }, [disabled, multiple, value, maxFiles, validateFile, onChange, onError]);
  
  // Handle input change
  const handleChange = (e) => {
    handleFiles(e.target.files);
    // Reset input value to allow selecting same file again
    e.target.value = '';
  };
  
  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    if (!disabled && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };
  
  // Handle click
  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };
  
  // Handle remove file
  const handleRemove = (index) => {
    const newFiles = [...value];
    newFiles.splice(index, 1);
    onChange?.(newFiles);
  };
  
  // Format file size
  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  // Build class names
  const containerClassNames = [
    'file-upload',
    `file-upload--${variant}`,
    isDragOver && 'file-upload--drag-over',
    disabled && 'file-upload--disabled',
    displayError && 'file-upload--error',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={containerClassNames}>
      {/* Label */}
      {label && (
        <label className="file-upload__label">
          {label}
        </label>
      )}
      
      {/* Drop zone */}
      <div
        className="file-upload__dropzone"
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        aria-disabled={disabled}
      >
        {/* Hidden input */}
        <input
          ref={inputRef}
          type="file"
          id={inputId}
          className="file-upload__input"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleChange}
          {...props}
        />
        
        {/* Upload icon */}
        <div className="file-upload__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        
        {/* Upload text */}
        <div className="file-upload__text">
          <span className="file-upload__text-main">
            {isDragOver ? 'Drop files here' : 'Drag & drop files here'}
          </span>
          <span className="file-upload__text-or">or</span>
          <span className="file-upload__text-browse">Browse files</span>
        </div>
        
        {/* Accepted types hint */}
        {accept && (
          <span className="file-upload__hint">
            Accepted: {accept}
          </span>
        )}
      </div>
      
      {/* File list / Preview */}
      {showPreview && value.length > 0 && (
        <div className="file-upload__files">
          {value.map((file, index) => (
            <div key={`${file.name}-${index}`} className="file-upload__file">
              {/* File icon */}
              <div className="file-upload__file-icon">
                {file.type?.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="file-upload__file-preview"
                  />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                )}
              </div>
              
              {/* File info */}
              <div className="file-upload__file-info">
                <span className="file-upload__file-name">{file.name}</span>
                <span className="file-upload__file-size">{formatSize(file.size)}</span>
              </div>
              
              {/* Remove button */}
              <button
                type="button"
                className="file-upload__file-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(index);
                }}
                aria-label={`Remove ${file.name}`}
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Helper / Error text */}
      {(helperText || displayError) && (
        <span 
          className={`file-upload__helper ${displayError ? 'file-upload__helper--error' : ''}`}
          role={displayError ? 'alert' : undefined}
        >
          {displayError || helperText}
        </span>
      )}
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default FileUpload;