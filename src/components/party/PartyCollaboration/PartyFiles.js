/**
 * GPS Lab Platform - PartyFiles Component
 * 
 * File sharing and management for party collaboration.
 * Supports uploads, downloads, and file organization.
 * 
 * @module components/party/PartyCollaboration/PartyFiles
 */

import React, { useState, useCallback, useRef } from 'react';
import './PartyFiles.css';

/**
 * File type icons
 */
const FILE_ICONS = {
  pdf: '📄',
  doc: '📝',
  docx: '📝',
  xls: '📊',
  xlsx: '📊',
  ppt: '📽️',
  pptx: '📽️',
  jpg: '🖼️',
  jpeg: '🖼️',
  png: '🖼️',
  gif: '🖼️',
  svg: '🖼️',
  mp4: '🎬',
  mp3: '🎵',
  zip: '📦',
  rar: '📦',
  txt: '📃',
  md: '📃',
  js: '💻',
  jsx: '💻',
  ts: '💻',
  tsx: '💻',
  css: '🎨',
  html: '🌐',
  json: '📋',
  default: '📁'
};

/**
 * Get file icon based on extension
 */
const getFileIcon = (filename) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  return FILE_ICONS[ext] || FILE_ICONS.default;
};

/**
 * Format file size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * Format date
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * PartyFiles Component
 */
const PartyFiles = ({
  files = [],
  canUpload = true,
  canDelete = true,
  onUpload,
  onDownload,
  onDelete,
  onPreview,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  allowedTypes = ['*'],
  className = '',
  ...props
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date'); // date, name, size
  const [viewMode, setViewMode] = useState('list'); // list, grid
  const fileInputRef = useRef(null);
  
  // Filter and sort files
  const filteredFiles = files
    .filter(file => 
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return b.size - a.size;
        case 'date':
        default:
          return new Date(b.uploadedAt) - new Date(a.uploadedAt);
      }
    });
  
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    await handleUpload(droppedFiles);
  }, []);
  
  const handleUpload = async (uploadFiles) => {
    if (!onUpload || !canUpload) return;
    
    setUploading(true);
    
    try {
      for (const file of uploadFiles) {
        if (file.size > maxFileSize) {
          alert(`File "${file.name}" exceeds maximum size of ${formatFileSize(maxFileSize)}`);
          continue;
        }
        await onUpload(file);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };
  
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleUpload(selectedFiles);
    e.target.value = '';
  };
  
  const handleDelete = useCallback((fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      if (onDelete) {
        onDelete(fileId);
      }
    }
  }, [onDelete]);
  
  const classNames = [
    'party-files',
    isDragging && 'party-files--dragging',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div 
      className={classNames}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      {...props}
    >
      {/* Header */}
      <div className="party-files__header">
        <h3 className="party-files__title">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"/>
          </svg>
          Party Files
        </h3>
        
        {canUpload && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="party-files__input"
              accept={allowedTypes.join(',')}
            />
            <button
              type="button"
              className="party-files__upload-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <span className="party-files__spinner" />
                  Uploading...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                  </svg>
                  Upload
                </>
              )}
            </button>
          </>
        )}
      </div>
      
      {/* Controls */}
      <div className="party-files__controls">
        <div className="party-files__search">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
          </svg>
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="party-files__search-input"
          />
        </div>
        
        <div className="party-files__view-controls">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="party-files__sort-select"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
          </select>
          
          <div className="party-files__view-toggle">
            <button
              type="button"
              className={`party-files__view-btn ${viewMode === 'list' ? 'party-files__view-btn--active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
            </button>
            <button
              type="button"
              className={`party-files__view-btn ${viewMode === 'grid' ? 'party-files__view-btn--active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Drop Zone */}
      {isDragging && (
        <div className="party-files__drop-zone">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
          </svg>
          <p>Drop files here to upload</p>
        </div>
      )}
      
      {/* Files */}
      <div className={`party-files__content party-files__content--${viewMode}`}>
        {filteredFiles.length > 0 ? (
          filteredFiles.map(file => (
            <div key={file.id} className="party-files__file">
              <span className="party-files__file-icon">{getFileIcon(file.name)}</span>
              
              <div className="party-files__file-info">
                <span className="party-files__file-name">{file.name}</span>
                <div className="party-files__file-meta">
                  <span className="party-files__file-size">{formatFileSize(file.size)}</span>
                  <span className="party-files__file-date">{formatDate(file.uploadedAt)}</span>
                  {file.uploadedBy && (
                    <span className="party-files__file-uploader">by {file.uploadedBy.name}</span>
                  )}
                </div>
              </div>
              
              <div className="party-files__file-actions">
                {onPreview && (
                  <button
                    type="button"
                    className="party-files__file-action"
                    onClick={() => onPreview(file)}
                    title="Preview"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                  </button>
                )}
                {onDownload && (
                  <button
                    type="button"
                    className="party-files__file-action"
                    onClick={() => onDownload(file)}
                    title="Download"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </button>
                )}
                {canDelete && (
                  <button
                    type="button"
                    className="party-files__file-action party-files__file-action--danger"
                    onClick={() => handleDelete(file.id)}
                    title="Delete"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9z" clipRule="evenodd"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="party-files__empty">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"/>
            </svg>
            <h4>No files yet</h4>
            <p>Upload files to share with your party</p>
          </div>
        )}
      </div>
      
      {/* Storage Info */}
      <div className="party-files__storage">
        <span className="party-files__storage-text">
          {files.length} files • {formatFileSize(files.reduce((acc, f) => acc + f.size, 0))} used
        </span>
      </div>
    </div>
  );
};

export default PartyFiles;