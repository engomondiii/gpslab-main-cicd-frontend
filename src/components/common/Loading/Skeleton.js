/**
 * GPS Lab Platform - Skeleton Component
 * 
 * Skeleton loading placeholders for content.
 * 
 * @module components/common/Loading/Skeleton
 * @version 1.0.0
 */

import React from 'react';
import './Skeleton.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const SKELETON_VARIANTS = {
  TEXT: 'text',
  CIRCULAR: 'circular',
  RECTANGULAR: 'rectangular',
  ROUNDED: 'rounded'
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Skeleton component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='text'] - Skeleton variant
 * @param {string|number} [props.width] - Width (CSS value)
 * @param {string|number} [props.height] - Height (CSS value)
 * @param {boolean} [props.animation=true] - Enable animation
 * @param {number} [props.lines=1] - Number of text lines
 * @param {string} [props.className] - Additional CSS classes
 */
const Skeleton = ({
  variant = SKELETON_VARIANTS.TEXT,
  width,
  height,
  animation = true,
  lines = 1,
  className = '',
  ...props
}) => {
  
  const classNames = [
    'skeleton',
    `skeleton--${variant}`,
    animation && 'skeleton--animated',
    className
  ].filter(Boolean).join(' ');
  
  // Build inline styles
  const style = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;
  
  // Render multiple lines for text variant
  if (variant === SKELETON_VARIANTS.TEXT && lines > 1) {
    return (
      <div className="skeleton-lines" {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={classNames}
            style={{
              ...style,
              width: index === lines - 1 ? '60%' : style.width
            }}
          />
        ))}
      </div>
    );
  }
  
  return (
    <div className={classNames} style={style} {...props} />
  );
};

// =============================================================================
// PRESET COMPONENTS
// =============================================================================

/**
 * Skeleton for text content
 */
export const SkeletonText = ({ lines = 3, ...props }) => (
  <Skeleton variant={SKELETON_VARIANTS.TEXT} lines={lines} {...props} />
);

/**
 * Skeleton for avatars
 */
export const SkeletonAvatar = ({ size = 40, ...props }) => (
  <Skeleton 
    variant={SKELETON_VARIANTS.CIRCULAR} 
    width={size} 
    height={size} 
    {...props} 
  />
);

/**
 * Skeleton for images/thumbnails
 */
export const SkeletonImage = ({ width = '100%', height = 200, ...props }) => (
  <Skeleton 
    variant={SKELETON_VARIANTS.RECTANGULAR} 
    width={width} 
    height={height} 
    {...props} 
  />
);

/**
 * Skeleton for buttons
 */
export const SkeletonButton = ({ width = 100, height = 40, ...props }) => (
  <Skeleton 
    variant={SKELETON_VARIANTS.ROUNDED} 
    width={width} 
    height={height} 
    {...props} 
  />
);

/**
 * Card skeleton preset
 */
export const SkeletonCard = ({ className = '', ...props }) => (
  <div className={`skeleton-card ${className}`} {...props}>
    <SkeletonImage height={160} />
    <div className="skeleton-card__content">
      <Skeleton variant={SKELETON_VARIANTS.TEXT} width="70%" height={24} />
      <SkeletonText lines={2} />
      <div className="skeleton-card__footer">
        <SkeletonAvatar size={32} />
        <Skeleton variant={SKELETON_VARIANTS.TEXT} width={100} />
      </div>
    </div>
  </div>
);

// =============================================================================
// EXPORTS
// =============================================================================

export default Skeleton;