/**
 * GPS Lab Platform - ProjectListItem Component
 * 
 * Individual project card displaying project info, stage, progress,
 * impact metrics, and team members.
 * 
 * @module components/project/ProjectList/ProjectListItem
 */

import React from 'react';
import './ProjectListItem.css';

/**
 * Get beacon color for stage
 */
const getBeaconColor = (stage) => {
  const colors = {
    1: 'var(--beacon-red, #e74c3c)',
    2: 'var(--beacon-orange, #f39c12)',
    3: 'var(--beacon-yellow, #f1c40f)',
    4: 'var(--beacon-green, #2ecc71)',
    5: 'var(--beacon-blue, #3498db)',
    6: 'var(--beacon-indigo, #9b59b6)',
    7: 'var(--beacon-purple, #8e44ad)'
  };
  return colors[stage] || 'var(--gps-primary, #00d4ff)';
};

/**
 * Get stage name
 */
const getStageName = (stage) => {
  const names = {
    1: 'Spark',
    2: 'Explore',
    3: 'Design',
    4: 'Build',
    5: 'Test',
    6: 'Launch',
    7: 'Scale'
  };
  return names[stage] || 'Unknown';
};

/**
 * Format number with K/M suffix
 */
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num?.toString() || '0';
};

/**
 * Format date relative
 */
const formatRelativeDate = (dateString) => {
  if (!dateString) return 'Recently';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

/**
 * ProjectListItem Component
 */
const ProjectListItem = ({
  id,
  name,
  description,
  stage = 1,
  status = 'active', // active, paused, completed, archived
  progress = 0,
  category,
  tags = [],
  team = [],
  impact = {},
  metrics = {},
  thumbnail,
  createdAt,
  updatedAt,
  isOwner = false,
  isFeatured = false,
  variant = 'default', // default, compact, featured
  onSelect,
  onEdit,
  className = '',
  ...props
}) => {
  const beaconColor = getBeaconColor(stage);
  const stageName = getStageName(stage);
  
  const handleClick = () => {
    if (onSelect) {
      onSelect(id);
    }
  };
  
  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(id);
    }
  };
  
  const classNames = [
    'project-list-item',
    `project-list-item--${variant}`,
    `project-list-item--${status}`,
    isFeatured && 'project-list-item--featured',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <article
      className={classNames}
      style={{ '--beacon-color': beaconColor }}
      onClick={handleClick}
      {...props}
    >
      {/* Thumbnail / Header */}
      <div className="project-list-item__header">
        {thumbnail ? (
          <div 
            className="project-list-item__thumbnail"
            style={{ backgroundImage: `url(${thumbnail})` }}
          />
        ) : (
          <div className="project-list-item__thumbnail project-list-item__thumbnail--default">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
        
        {/* Status Badge */}
        <span className={`project-list-item__status project-list-item__status--${status}`}>
          {status === 'active' && '● Active'}
          {status === 'paused' && '⏸ Paused'}
          {status === 'completed' && '✓ Completed'}
          {status === 'archived' && '📦 Archived'}
        </span>
        
        {/* Featured Badge */}
        {isFeatured && (
          <span className="project-list-item__featured-badge">
            ⭐ Featured
          </span>
        )}
        
        {/* Stage Beacon */}
        <div className="project-list-item__beacon-wrap">
          <span className="project-list-item__beacon" />
          <span className="project-list-item__stage-label">Stage {stage}</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="project-list-item__content">
        {/* Title & Category */}
        <div className="project-list-item__title-row">
          <h3 className="project-list-item__title">{name}</h3>
          {category && (
            <span className="project-list-item__category">{category}</span>
          )}
        </div>
        
        {/* Description */}
        {description && variant !== 'compact' && (
          <p className="project-list-item__description">{description}</p>
        )}
        
        {/* Progress Bar */}
        <div className="project-list-item__progress">
          <div className="project-list-item__progress-header">
            <span className="project-list-item__progress-label">Progress</span>
            <span className="project-list-item__progress-value">{progress}%</span>
          </div>
          <div className="project-list-item__progress-bar">
            <div 
              className="project-list-item__progress-fill"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        </div>
        
        {/* Impact Metrics */}
        {variant !== 'compact' && (impact.customers || impact.revenue || impact.users) && (
          <div className="project-list-item__impact">
            {impact.customers !== undefined && (
              <div className="project-list-item__impact-item">
                <span className="project-list-item__impact-icon">👥</span>
                <span className="project-list-item__impact-value">{formatNumber(impact.customers)}</span>
                <span className="project-list-item__impact-label">Customers</span>
              </div>
            )}
            {impact.revenue !== undefined && (
              <div className="project-list-item__impact-item">
                <span className="project-list-item__impact-icon">💰</span>
                <span className="project-list-item__impact-value">${formatNumber(impact.revenue)}</span>
                <span className="project-list-item__impact-label">Revenue</span>
              </div>
            )}
            {impact.users !== undefined && (
              <div className="project-list-item__impact-item">
                <span className="project-list-item__impact-icon">🌍</span>
                <span className="project-list-item__impact-value">{formatNumber(impact.users)}</span>
                <span className="project-list-item__impact-label">Users Impacted</span>
              </div>
            )}
          </div>
        )}
        
        {/* Tags */}
        {tags.length > 0 && variant !== 'compact' && (
          <div className="project-list-item__tags">
            {tags.slice(0, 3).map(tag => (
              <span key={tag} className="project-list-item__tag">#{tag}</span>
            ))}
            {tags.length > 3 && (
              <span className="project-list-item__tag project-list-item__tag--more">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="project-list-item__footer">
        {/* Team Avatars */}
        <div className="project-list-item__team">
          {team.slice(0, 4).map((member, index) => (
            <div 
              key={member.id || index}
              className="project-list-item__member"
              style={{
                backgroundImage: member.avatar ? `url(${member.avatar})` : 'none',
                zIndex: team.length - index
              }}
              title={member.name}
            >
              {!member.avatar && member.name?.charAt(0).toUpperCase()}
            </div>
          ))}
          {team.length > 4 && (
            <span className="project-list-item__member-count">
              +{team.length - 4}
            </span>
          )}
        </div>
        
        {/* Meta Info */}
        <div className="project-list-item__meta">
          <span className="project-list-item__stage-name">{stageName}</span>
          <span className="project-list-item__updated">
            Updated {formatRelativeDate(updatedAt)}
          </span>
        </div>
        
        {/* Actions */}
        {isOwner && (
          <button
            type="button"
            className="project-list-item__edit-btn"
            onClick={handleEdit}
            title="Edit Project"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
            </svg>
          </button>
        )}
      </div>
    </article>
  );
};

export default ProjectListItem;