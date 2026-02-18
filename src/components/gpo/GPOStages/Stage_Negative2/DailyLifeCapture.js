/**
 * GPS Lab Platform - DailyLifeCapture Component
 *
 * Record/photograph daily burden for Stage -2.
 * Upload photos/videos showing day-to-day reality.
 *
 * @module components/gpo/GPOStages/Stage_Negative2/DailyLifeCapture
 */

import React, { useState, useCallback } from 'react';
import './DailyLifeCapture.css';

const MAX_FILES = 8;
const MAX_SIZE = 50 * 1024 * 1024;
const ACCEPTED = ['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime'];

const CAPTURE_CATEGORIES = [
  { id: 'morning', label: 'Morning Routine', icon: '🌅', description: 'What does a typical morning look like?' },
  { id: 'work', label: 'Work / Daily Tasks', icon: '⚒️', description: 'How does the problem affect your work?' },
  { id: 'family', label: 'Family Impact', icon: '👨‍👩‍👧', description: 'How does it affect your family?' },
  { id: 'environment', label: 'Your Environment', icon: '🏘️', description: 'Show your surroundings and context' },
  { id: 'burden', label: 'The Burden', icon: '😓', description: 'Capture the difficulty directly' },
];

const DailyLifeCapture = ({
  media = [],
  onMediaUpdate,
  className = '',
  ...props
}) => {
  const [uploadError, setUploadError] = useState(null);

  const handleFileSelect = useCallback((e, category) => {
    const files = Array.from(e.target.files);

    if (media.length + files.length > MAX_FILES) {
      setUploadError(`Maximum ${MAX_FILES} files allowed`);
      return;
    }

    const valid = [];
    const errs = [];

    files.forEach(file => {
      if (file.size > MAX_SIZE) { errs.push(`${file.name} too large`); return; }
      if (!ACCEPTED.includes(file.type)) { errs.push(`${file.name} not supported`); return; }
      valid.push({
        id: Date.now() + Math.random(),
        file,
        type: file.type.startsWith('image') ? 'image' : 'video',
        url: URL.createObjectURL(file),
        caption: '',
        category
      });
    });

    if (errs.length) setUploadError(errs.join(' • '));
    else setUploadError(null);

    if (valid.length) onMediaUpdate?.([...media, ...valid]);
    e.target.value = '';
  }, [media, onMediaUpdate]);

  const handleRemove = useCallback((id) => {
    onMediaUpdate?.(media.filter(m => m.id !== id));
  }, [media, onMediaUpdate]);

  const handleCaption = useCallback((id, caption) => {
    onMediaUpdate?.(media.map(m => m.id === id ? { ...m, caption } : m));
  }, [media, onMediaUpdate]);

  const classNames = ['daily-life-capture', className].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...props}>
      <div className="dlc__header">
        <h3 className="dlc__title">Capture Daily Life 📷</h3>
        <p className="dlc__subtitle">
          Upload photos and short videos that show what daily life looks like because of this problem.
          Help GPS understand the reality, not just the theory.
        </p>
      </div>

      {/* Category Upload Zones */}
      <div className="dlc__categories">
        {CAPTURE_CATEGORIES.map(cat => {
          const catMedia = media.filter(m => m.category === cat.id);
          const inputId = `dlc-upload-${cat.id}`;
          return (
            <div key={cat.id} className="dlc__category">
              <div className="dlc__category-header">
                <span className="dlc__category-icon">{cat.icon}</span>
                <div className="dlc__category-info">
                  <span className="dlc__category-label">{cat.label}</span>
                  <span className="dlc__category-desc">{cat.description}</span>
                </div>
                <input
                  type="file"
                  id={inputId}
                  accept="image/*,video/*"
                  multiple
                  onChange={e => handleFileSelect(e, cat.id)}
                  className="dlc__input"
                  disabled={media.length >= MAX_FILES}
                />
                <label
                  htmlFor={inputId}
                  className={`dlc__upload-btn ${media.length >= MAX_FILES ? 'dlc__upload-btn--disabled' : ''}`}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                  </svg>
                  Upload
                </label>
              </div>

              {/* Category media thumbnails */}
              {catMedia.length > 0 && (
                <div className="dlc__thumbs">
                  {catMedia.map(item => (
                    <div key={item.id} className="dlc__thumb">
                      {item.type === 'image'
                        ? <img src={item.url} alt={item.caption || 'evidence'} className="dlc__thumb-media" />
                        : <video src={item.url} className="dlc__thumb-media" />
                      }
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="dlc__thumb-remove"
                        aria-label="Remove"
                      >×</button>
                      <input
                        type="text"
                        value={item.caption}
                        onChange={e => handleCaption(item.id, e.target.value)}
                        placeholder="Caption..."
                        className="dlc__thumb-caption"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {uploadError && (
        <div className="dlc__error">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          {uploadError}
        </div>
      )}

      <div className="dlc__counter">
        <div className="dlc__counter-bar">
          <div className="dlc__counter-fill" style={{ width: `${(media.length / MAX_FILES) * 100}%` }} />
        </div>
        <span className="dlc__counter-text">{media.length} / {MAX_FILES} files</span>
      </div>
    </div>
  );
};

export default DailyLifeCapture;