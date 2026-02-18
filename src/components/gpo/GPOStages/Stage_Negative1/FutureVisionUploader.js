/**
 * GPS Lab Platform - FutureVisionUploader Component
 *
 * Upload photos/videos symbolizing hoped-for outcome — Stage -1.
 *
 * @module components/gpo/GPOStages/Stage_Negative1/FutureVisionUploader
 */

import React, { useState, useCallback } from 'react';
import './FutureVisionUploader.css';

const MAX_FILES = 6;
const MAX_SIZE = 50 * 1024 * 1024;
const ACCEPTED = ['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm'];

const VISION_PROMPTS = [
  { icon: '🏘️', text: 'A thriving, transformed community' },
  { icon: '😊', text: 'Happy, healthy people' },
  { icon: '🌱', text: 'A sustainable environment' },
  { icon: '📚', text: 'Children in school, learning' },
  { icon: '💼', text: 'Dignified work and prosperity' },
  { icon: '🌍', text: 'Symbolic images of hope' },
];

const FutureVisionUploader = ({
  media = [],
  onMediaUpdate,
  className = '',
  ...props
}) => {
  const [uploadError, setUploadError] = useState(null);

  const handleFileSelect = useCallback(e => {
    const files = Array.from(e.target.files);
    if (media.length + files.length > MAX_FILES) { setUploadError(`Max ${MAX_FILES} files`); return; }

    const valid = [];
    const errs = [];
    files.forEach(file => {
      if (file.size > MAX_SIZE) { errs.push(`${file.name} too large`); return; }
      if (!ACCEPTED.includes(file.type)) { errs.push(`${file.name} unsupported`); return; }
      valid.push({ id: Date.now() + Math.random(), file, type: file.type.startsWith('image') ? 'image' : 'video', url: URL.createObjectURL(file), caption: '' });
    });

    if (errs.length) setUploadError(errs.join(' • '));
    else setUploadError(null);
    if (valid.length) onMediaUpdate?.([...media, ...valid]);
    e.target.value = '';
  }, [media, onMediaUpdate]);

  const handleRemove = useCallback(id => onMediaUpdate?.(media.filter(m => m.id !== id)), [media, onMediaUpdate]);
  const handleCaption = useCallback((id, caption) => onMediaUpdate?.(media.map(m => m.id === id ? { ...m, caption } : m)), [media, onMediaUpdate]);

  const classNames = ['future-vision-uploader', className].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...props}>
      <div className="fvu__header">
        <h3 className="fvu__title">Show Your Vision 🌅</h3>
        <p className="fvu__subtitle">
          Upload images or short videos that symbolize the future you dream of.
          These don't have to be pictures of your community — they can be symbolic,
          inspirational images that capture your vision.
        </p>
      </div>

      <div className="fvu__prompts">
        <p className="fvu__prompts-title">What to upload:</p>
        <div className="fvu__prompts-grid">
          {VISION_PROMPTS.map(p => (
            <div key={p.text} className="fvu__prompt-item">
              <span className="fvu__prompt-icon">{p.icon}</span>
              <span className="fvu__prompt-text">{p.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="fvu__upload-zone">
        <input type="file" id="fvu-upload" accept="image/*,video/*" multiple onChange={handleFileSelect} className="fvu__input" disabled={media.length >= MAX_FILES} />
        <label htmlFor="fvu-upload" className={`fvu__label ${media.length >= MAX_FILES ? 'fvu__label--disabled' : ''}`}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="fvu__icon">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
          </svg>
          <span className="fvu__label-title">{media.length >= MAX_FILES ? 'Maximum reached' : 'Upload Vision Images/Videos'}</span>
          <span className="fvu__label-sub">JPG, PNG, MP4 up to 50MB</span>
        </label>
      </div>

      {uploadError && <div className="fvu__error">{uploadError}</div>}

      {media.length > 0 && (
        <div className="fvu__gallery">
          {media.map(item => (
            <div key={item.id} className="fvu__item">
              <div className="fvu__item-media">
                {item.type === 'image'
                  ? <img src={item.url} alt={item.caption || ''} className="fvu__media" />
                  : <video src={item.url} controls className="fvu__media" />
                }
                <button type="button" onClick={() => handleRemove(item.id)} className="fvu__remove" aria-label="Remove">
                  <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                </button>
              </div>
              <input type="text" value={item.caption} onChange={e => handleCaption(item.id, e.target.value)} placeholder="Describe this vision..." className="fvu__caption" />
            </div>
          ))}
        </div>
      )}

      <div className="fvu__counter">{media.length} / {MAX_FILES} vision images uploaded</div>
    </div>
  );
};

export default FutureVisionUploader;