/**
 * GPS Lab Platform - MediaGallery Component
 * 
 * Display multiple media files in a grid.
 * 
 * @module components/common/Media/MediaGallery
 */

import React from 'react';
import MediaPreview from './MediaPreview';
import './MediaGallery.css';

/**
 * MediaGallery Component
 */
const MediaGallery = ({
  items = [],
  onRemove,
  onCaptionUpdate,
  editable = false,
  columns = 3,
  className = '',
  ...props
}) => {
  
  const classNames = ['media-gallery', className].filter(Boolean).join(' ');

  if (items.length === 0) {
    return null;
  }

  return (
    <div 
      className={classNames} 
      style={{ '--gallery-columns': columns }}
      {...props}
    >
      {items.map((item) => (
        <MediaPreview
          key={item.id}
          item={item}
          onRemove={editable ? onRemove : undefined}
          onCaptionChange={editable ? onCaptionUpdate : undefined}
          editable={editable}
        />
      ))}
    </div>
  );
};

export default MediaGallery;