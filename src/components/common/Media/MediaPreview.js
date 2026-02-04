/**
 * GPS Lab Platform - MediaPreview Component
 * 
 * Preview uploaded media files (images/videos).
 * 
 * @module components/common/Media/MediaPreview
 */

import React from 'react';
import './MediaPreview.css';

/**
 * MediaPreview Component
 */
const MediaPreview = ({
  item,
  onRemove,
  onCaptionChange,
  editable = false,
  className = '',
  ...props
}) => {
  const isImage = item.type === 'image';
  const isVideo = item.type === 'video';

  const classNames = ['media-preview', className].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...props}>
      <div className="media-preview__content">
        {isImage && (
          <img
            src={item.url}
            alt={item.caption || 'Preview'}
            className="media-preview__image"
          />
        )}

        {isVideo && (
          <video
            src={item.url}
            controls
            className="media-preview__video"
          >
            Your browser does not support video playback.
          </video>
        )}

        {editable && onRemove && (
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="media-preview__remove"
            aria-label="Remove media"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        )}
      </div>

      {editable && onCaptionChange ? (
        <input
          type="text"
          value={item.caption || ''}
          onChange={(e) => onCaptionChange(item.id, e.target.value)}
          placeholder="Add a caption..."
          className="media-preview__caption-input"
        />
      ) : (
        item.caption && (
          <p className="media-preview__caption">{item.caption}</p>
        )
      )}
    </div>
  );
};

export default MediaPreview;