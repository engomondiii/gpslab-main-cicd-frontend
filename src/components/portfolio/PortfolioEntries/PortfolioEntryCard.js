/**
 * GPS Lab Platform - PortfolioEntryCard Component
 * GPS 101 INTEGRATION: GPS 101 deliverable cards with special styling
 * 
 * Individual portfolio entry card with thumbnail,
 * title, description, and stats.
 * 
 * @module components/portfolio/PortfolioEntries/PortfolioEntryCard
 */

import React from 'react';
import './PortfolioEntryCard.css';

/**
 * Entry types with icons
 */
const ENTRY_TYPES = {
  project: { icon: '📁', label: 'Project' },
  article: { icon: '📝', label: 'Article' },
  design: { icon: '🎨', label: 'Design' },
  code: { icon: '💻', label: 'Code' },
  presentation: { icon: '📊', label: 'Presentation' },
  video: { icon: '🎬', label: 'Video' },
  achievement: { icon: '🏆', label: 'Achievement' },
  certificate: { icon: '📜', label: 'Certificate' },
  // NEW: GPS 101 type
  gps101_deliverable: { icon: '🎓', label: 'GPS 101 Deliverable' },
  other: { icon: '📌', label: 'Other' }
};

/**
 * NEW: GPS 101 deliverable names
 */
const GPS101_DELIVERABLE_NAMES = {
  1: 'Identity Statement',
  2: 'Life Problem Candidate',
  3: 'Problem Owner Story',
  4: 'Life Purpose Statement',
  5: 'Purpose-Driven Project'
};

/**
 * PortfolioEntryCard Component
 */
const PortfolioEntryCard = ({
  entry = {},
  onClick,
  onEdit,
  onDelete,
  onLike,
  showActions = false,
  isLiked = false,
  variant = 'default', // default, compact, featured
  className = '',
  ...props
}) => {
  const {
    id,
    title = 'Untitled Entry',
    description,
    thumbnailUrl,
    type = 'project',
    tags = [],
    views = 0,
    likes = 0,
    isFeatured = false,
    createdAt,
    stageCompleted,
    externalUrl,
    // NEW: GPS 101 props
    isGPS101Deliverable = false,
    gps101StageNumber,
    gps101StageName
  } = entry;
  
  const typeConfig = ENTRY_TYPES[isGPS101Deliverable ? 'gps101_deliverable' : type] || ENTRY_TYPES.other;
  
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const handleClick = () => {
    if (onClick) onClick(entry);
  };
  
  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(entry);
  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(entry);
  };
  
  const handleLike = (e) => {
    e.stopPropagation();
    if (onLike) onLike(entry);
  };
  
  const classNames = [
    'portfolio-entry-card',
    `portfolio-entry-card--${variant}`,
    isFeatured && 'portfolio-entry-card--featured',
    isGPS101Deliverable && 'portfolio-entry-card--gps101',
    className
  ].filter(Boolean).join(' ');
  
  // Compact variant
  if (variant === 'compact') {
    return (
      <article className={classNames} onClick={handleClick} {...props}>
        {isGPS101Deliverable && (
          <div className="portfolio-entry-card__gps101-indicator">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
            </svg>
          </div>
        )}
        <div className="portfolio-entry-card__type-icon">
          {typeConfig.icon}
        </div>
        <div className="portfolio-entry-card__compact-content">
          <h4 className="portfolio-entry-card__compact-title">{title}</h4>
          <span className="portfolio-entry-card__compact-type">{typeConfig.label}</span>
        </div>
        <div className="portfolio-entry-card__compact-stats">
          <span>👁 {views}</span>
          <span>❤️ {likes}</span>
        </div>
      </article>
    );
  }
  
  return (
    <article className={classNames} onClick={handleClick} {...props}>
      {/* Thumbnail */}
      <div className="portfolio-entry-card__thumbnail">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={title} />
        ) : (
          <div className="portfolio-entry-card__thumbnail-placeholder">
            <span className="portfolio-entry-card__placeholder-icon">
              {typeConfig.icon}
            </span>
          </div>
        )}
        
        {/* Badges */}
        <div className="portfolio-entry-card__badges">
          {/* NEW: GPS 101 Badge */}
          {isGPS101Deliverable && (
            <span className="portfolio-entry-card__badge portfolio-entry-card__badge--gps101">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
              </svg>
              GPS 101
            </span>
          )}
          {isFeatured && (
            <span className="portfolio-entry-card__badge portfolio-entry-card__badge--featured">
              ⭐ Featured
            </span>
          )}
          {!isGPS101Deliverable && (
            <span className="portfolio-entry-card__badge portfolio-entry-card__badge--type">
              {typeConfig.icon} {typeConfig.label}
            </span>
          )}
        </div>
        
        {/* External link indicator */}
        {externalUrl && (
          <span className="portfolio-entry-card__external">
            🔗
          </span>
        )}
      </div>
      
      {/* Content */}
      <div className="portfolio-entry-card__content">
        {/* NEW: GPS 101 Stage Header */}
        {isGPS101Deliverable && gps101StageNumber && (
          <div className="portfolio-entry-card__gps101-header">
            <span className="portfolio-entry-card__gps101-stage">
              Stage {gps101StageNumber}
            </span>
            {gps101StageName && (
              <span className="portfolio-entry-card__gps101-stage-name">
                {gps101StageName}
              </span>
            )}
          </div>
        )}
        
        <h3 className="portfolio-entry-card__title">
          {isGPS101Deliverable && gps101StageNumber 
            ? GPS101_DELIVERABLE_NAMES[gps101StageNumber] || title
            : title}
        </h3>
        
        {description && (
          <p className="portfolio-entry-card__description">{description}</p>
        )}
        
        {/* Stage Badge (for non-GPS101 entries) */}
        {!isGPS101Deliverable && stageCompleted && (
          <div className="portfolio-entry-card__stage">
            <span className="portfolio-entry-card__stage-badge">
              Stage {stageCompleted}
            </span>
          </div>
        )}
        
        {/* Tags */}
        {tags.length > 0 && (
          <div className="portfolio-entry-card__tags">
            {tags.slice(0, 4).map((tag, i) => (
              <span key={i} className="portfolio-entry-card__tag">
                {tag}
              </span>
            ))}
            {tags.length > 4 && (
              <span className="portfolio-entry-card__tag portfolio-entry-card__tag--more">
                +{tags.length - 4}
              </span>
            )}
          </div>
        )}
        
        {/* Footer */}
        <div className="portfolio-entry-card__footer">
          <span className="portfolio-entry-card__date">
            {formatDate(createdAt)}
          </span>
          
          <div className="portfolio-entry-card__stats">
            <span className="portfolio-entry-card__stat">
              <span className="portfolio-entry-card__stat-icon">👁</span>
              {views}
            </span>
            <button
              type="button"
              className={`portfolio-entry-card__stat portfolio-entry-card__stat--like ${isLiked ? 'portfolio-entry-card__stat--liked' : ''}`}
              onClick={handleLike}
            >
              <span className="portfolio-entry-card__stat-icon">
                {isLiked ? '❤️' : '🤍'}
              </span>
              {likes}
            </button>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      {showActions && (
        <div className="portfolio-entry-card__actions">
          <button
            type="button"
            className="portfolio-entry-card__action"
            onClick={handleEdit}
            title="Edit"
          >
            ✏️
          </button>
          <button
            type="button"
            className="portfolio-entry-card__action portfolio-entry-card__action--danger"
            onClick={handleDelete}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      )}
    </article>
  );
};

export { ENTRY_TYPES, GPS101_DELIVERABLE_NAMES };
export default PortfolioEntryCard;