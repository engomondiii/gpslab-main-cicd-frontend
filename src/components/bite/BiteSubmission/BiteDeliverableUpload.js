/**
 * GPS Lab Platform - BiteDeliverableUpload Component
 * 
 * File upload component for task deliverables.
 * 
 * @module components/bite/BiteSubmission/BiteDeliverableUpload
 */

import React, { useState, useCallback, useRef } from 'react';
import './BiteDeliverableUpload.css';

/**
 * File type icons
 */
const FILE_TYPE_ICONS = {
  image: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/></svg>,
  video: <svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/></svg>,
  code: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>,
  document: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/></svg>,
  archive: <svg viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM8 11a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd"/></svg>,
  default: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/></svg>
};

const getFileType = (filename) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
  if (['mp4', 'webm', 'mov', 'avi'].includes(ext)) return 'video';
  if (['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'css', 'html', 'json'].includes(ext)) return 'code';
  if (['pdf', 'doc', 'docx', 'txt', 'md'].includes(ext)) return 'document';
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'archive';
  return 'default';
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * BiteDeliverableUpload Component
 */
const BiteDeliverableUpload = ({
  files = [],
  onUpload,
  onRemove,
  accept = '*',
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  required = false,
  className = '',
  ...props
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);
  
  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
    e.target.value = ''; // Reset input
  };
  
  const handleFiles = (newFiles) => {
    setError(null);
    
    // Check file count
    if (files.length + newFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }
    
    // Validate files
    const validFiles = [];
    for (const file of newFiles) {
      if (file.size > maxSize) {
        setError(`File "${file.name}" exceeds ${formatFileSize(maxSize)} limit`);
        continue;
      }
      validFiles.push({
        id: `file-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      });
    }
    
    if (validFiles.length > 0 && onUpload) {
      onUpload(validFiles);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const classNames = [
    'bite-deliverable-upload',
    isDragging && 'bite-deliverable-upload--dragging',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="bite-deliverable-upload__header">
        <h3 className="bite-deliverable-upload__title">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
          </svg>
          Deliverables
          {required && <span className="bite-deliverable-upload__required">*</span>}
        </h3>
        <span className="bite-deliverable-upload__count">{files.length}/{maxFiles}</span>
      </div>
      
      {/* Drop Zone */}
      <div
        className="bite-deliverable-upload__dropzone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={handleFileInput}
          className="bite-deliverable-upload__input"
        />
        
        <div className="bite-deliverable-upload__dropzone-icon">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"/>
            <path d="M9 13h2v5a1 1 0 11-2 0v-5z"/>
          </svg>
        </div>
        
        <p className="bite-deliverable-upload__dropzone-text">
          <span className="bite-deliverable-upload__dropzone-primary">
            Drop files here or click to upload
          </span>
          <span className="bite-deliverable-upload__dropzone-secondary">
            Max {formatFileSize(maxSize)} per file
          </span>
        </p>
      </div>
      
      {/* Error */}
      {error && (
        <div className="bite-deliverable-upload__error">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          {error}
        </div>
      )}
      
      {/* Files List */}
      {files.length > 0 && (
        <div className="bite-deliverable-upload__files">
          {files.map(file => {
            const fileType = getFileType(file.name);
            return (
              <div key={file.id} className="bite-deliverable-upload__file">
                <div className={`bite-deliverable-upload__file-icon bite-deliverable-upload__file-icon--${fileType}`}>
                  {FILE_TYPE_ICONS[fileType]}
                </div>
                <div className="bite-deliverable-upload__file-info">
                  <span className="bite-deliverable-upload__file-name">{file.name}</span>
                  <span className="bite-deliverable-upload__file-size">{formatFileSize(file.size)}</span>
                </div>
                {onRemove && (
                  <button
                    type="button"
                    onClick={() => onRemove(file.id)}
                    className="bite-deliverable-upload__file-remove"
                    aria-label="Remove file"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BiteDeliverableUpload;