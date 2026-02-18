/**
 * GPS Lab Platform - BeforeAfterComparison Component
 *
 * Visual before/after comparison component — Stage -1.
 *
 * @module components/gpo/GPOStages/Stage_Negative1/BeforeAfterComparison
 */

import React, { useState, useCallback, useRef } from 'react';
import './BeforeAfterComparison.css';

const MAX_PER_SIDE = 4;
const ACCEPTED = ['image/jpeg','image/png','image/webp','image/gif'];

const BeforeAfterComparison = ({
  beforeImages = [],
  afterImages = [],
  onBeforeUpdate,
  onAfterUpdate,
  className = '',
  ...props
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [previewPair, setPreviewPair] = useState({ before: null, after: null });
  const sliderRef = useRef(null);

  const handleUpload = useCallback((side, e) => {
    const files = Array.from(e.target.files);
    const existing = side === 'before' ? beforeImages : afterImages;
    const updater = side === 'before' ? onBeforeUpdate : onAfterUpdate;

    if (existing.length + files.length > MAX_PER_SIDE) return;

    const valid = files
      .filter(f => ACCEPTED.includes(f.type))
      .map(f => ({ id: Date.now() + Math.random(), file: f, url: URL.createObjectURL(f), caption: '' }));

    updater?.([...existing, ...valid]);
    e.target.value = '';
  }, [beforeImages, afterImages, onBeforeUpdate, onAfterUpdate]);

  const handleRemove = useCallback((side, id) => {
    if (side === 'before') onBeforeUpdate?.(beforeImages.filter(i => i.id !== id));
    else onAfterUpdate?.(afterImages.filter(i => i.id !== id));
  }, [beforeImages, afterImages, onBeforeUpdate, onAfterUpdate]);

  const handleSlider = useCallback(e => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPos(Math.round((x / rect.width) * 100));
  }, []);

  const classNames = ['before-after-comparison', className].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...props}>
      <div className="bac__header">
        <h3 className="bac__title">Before vs After Comparison 🔄</h3>
        <p className="bac__subtitle">
          Upload images showing the contrast between current reality (Before) and your vision (After).
          This powerful visual contrast will inspire GPS to take action.
        </p>
      </div>

      {/* Upload Panels */}
      <div className="bac__panels">
        {/* Before Panel */}
        <div className="bac__panel bac__panel--before">
          <div className="bac__panel-header">
            <div className="bac__panel-badge bac__panel-badge--before">😔 BEFORE</div>
            <span className="bac__panel-sub">Current Reality</span>
          </div>

          <div className="bac__thumbs">
            {beforeImages.map(img => (
              <div key={img.id} className="bac__thumb">
                <img src={img.url} alt="" className="bac__thumb-img" />
                <button type="button" onClick={() => handleRemove('before', img.id)} className="bac__thumb-remove" aria-label="Remove">×</button>
              </div>
            ))}
            {beforeImages.length < MAX_PER_SIDE && (
              <>
                <input type="file" id="bac-before" accept="image/*" multiple onChange={e => handleUpload('before', e)} className="bac__input" />
                <label htmlFor="bac-before" className="bac__add-btn">
                  <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/></svg>
                  Add Before
                </label>
              </>
            )}
          </div>
        </div>

        {/* After Panel */}
        <div className="bac__panel bac__panel--after">
          <div className="bac__panel-header">
            <div className="bac__panel-badge bac__panel-badge--after">😊 AFTER</div>
            <span className="bac__panel-sub">Your Vision</span>
          </div>

          <div className="bac__thumbs">
            {afterImages.map(img => (
              <div key={img.id} className="bac__thumb">
                <img src={img.url} alt="" className="bac__thumb-img" />
                <button type="button" onClick={() => handleRemove('after', img.id)} className="bac__thumb-remove" aria-label="Remove">×</button>
              </div>
            ))}
            {afterImages.length < MAX_PER_SIDE && (
              <>
                <input type="file" id="bac-after" accept="image/*" multiple onChange={e => handleUpload('after', e)} className="bac__input" />
                <label htmlFor="bac-after" className="bac__add-btn bac__add-btn--after">
                  <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/></svg>
                  Add After
                </label>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Slider Preview */}
      {beforeImages.length > 0 && afterImages.length > 0 && (
        <div className="bac__preview">
          <h4 className="bac__preview-title">Live Comparison Preview</h4>
          <div
            ref={sliderRef}
            className="bac__slider"
            onMouseMove={e => { if (e.buttons === 1) handleSlider(e); }}
            onClick={handleSlider}
          >
            <div className="bac__slider-before" style={{ backgroundImage: `url(${beforeImages[0].url})` }} />
            <div className="bac__slider-after" style={{ backgroundImage: `url(${afterImages[0].url})`, clipPath: `inset(0 0 0 ${sliderPos}%)` }} />
            <div className="bac__slider-handle" style={{ left: `${sliderPos}%` }}>
              <div className="bac__slider-line" />
              <div className="bac__slider-knob">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5l-5 7 5 7M16 5l5 7-5 7"/></svg>
              </div>
            </div>
            <div className="bac__slider-label bac__slider-label--before">BEFORE</div>
            <div className="bac__slider-label bac__slider-label--after">AFTER</div>
          </div>
          <p className="bac__preview-hint">← Drag to compare →</p>
        </div>
      )}
    </div>
  );
};

export default BeforeAfterComparison;