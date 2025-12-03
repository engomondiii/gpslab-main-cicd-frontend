/**
 * GPS Lab Platform - ProjectCard Component
 * 
 * Specialized card for displaying GPO projects
 * with impact metrics and team info.
 * 
 * @module components/common/Card/ProjectCard
 * @version 1.0.0
 */

import React from 'react';
import Card from './Card';
import './ProjectCard.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const PROJECT_STATUS = {
  DRAFT: 'draft',
  PLANNING: 'planning',
  ACTIVE: 'active',
  ON_HOLD: 'on-hold',
  COMPLETED: 'completed',
  ARCHIVED: 'archived'
};

export const PROJECT_CATEGORY = {
  EDUCATION: 'education',
  ENVIRONMENT: 'environment',
  HEALTH: 'health',
  TECHNOLOGY: 'technology',
  COMMUNITY: 'community',
  ECONOMIC: 'economic',
  GOVERNANCE: 'governance'
};

// Category icons
const CATEGORY_ICONS = {
  [PROJECT_CATEGORY.EDUCATION]: '📚',
  [PROJECT_CATEGORY.ENVIRONMENT]: '🌱',
  [PROJECT_CATEGORY.HEALTH]: '💊',
  [PROJECT_CATEGORY.TECHNOLOGY]: '💻',
  [PROJECT_CATEGORY.COMMUNITY]: '🤝',
  [PROJECT_CATEGORY.ECONOMIC]: '💰',
  [PROJECT_CATEGORY.GOVERNANCE]: '⚖️'
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ProjectCard component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.project - Project data
 * @param {string} props.project.id - Project ID
 * @param {string} props.project.name - Project name
 * @param {string} props.project.description - Project description
 * @param {string} props.project.category - Project category
 * @param {string} props.project.status - Project status
 * @param {string} [props.project.thumbnail] - Thumbnail image URL
 * @param {number} [props.project.progress] - Progress percentage
 * @param {Object} [props.project.impact] - Impact metrics
 * @param {Array} [props.project.team] - Team members
 * @param {number} [props.project.barakaRaised] - Baraka raised
 * @param {number} [props.project.barakaGoal] - Baraka goal
 * @param {string} [props.project.location] - Project location
 * @param {boolean} [props.compact=false] - Compact display mode
 * @param {boolean} [props.showImpact=true] - Show impact metrics
 * @param {Function} [props.onClick] - Click handler
 */
const ProjectCard = ({
  project,
  compact = false,
  showImpact = true,
  className = '',
  onClick,
  ...props
}) => {
  
  const {
    id,
    name,
    description,
    category = PROJECT_CATEGORY.COMMUNITY,
    status = PROJECT_STATUS.ACTIVE,
    thumbnail,
    progress = 0,
    impact,
    team = [],
    barakaRaised = 0,
    barakaGoal,
    location
  } = project;
  
  // Calculate funding percentage
  const fundingPercent = barakaGoal 
    ? Math.min(100, Math.round((barakaRaised / barakaGoal) * 100))
    : 0;
  
  // Build class names
  const classNames = [
    'project-card',
    `project-card--${status}`,
    `project-card--${category}`,
    compact && 'project-card--compact',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <Card
      variant="outlined"
      padding={compact ? 'sm' : 'md'}
      clickable={!!onClick}
      className={classNames}
      onClick={() => onClick?.(project)}
      {...props}
    >
      {/* Thumbnail */}
      {thumbnail && !compact && (
        <div className="project-card__thumbnail">
          <img src={thumbnail} alt={name} />
          <div className="project-card__category-badge">
            <span className="project-card__category-icon">
              {CATEGORY_ICONS[category]}
            </span>
            <span className="project-card__category-text">
              {category}
            </span>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="project-card__content">
        {/* Header */}
        <div className="project-card__header">
          {compact && (
            <span className="project-card__category-emoji">
              {CATEGORY_ICONS[category]}
            </span>
          )}
          <div className="project-card__title-group">
            <h3 className="project-card__name">{name}</h3>
            {location && (
              <span className="project-card__location">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {location}
              </span>
            )}
          </div>
          
          {/* Status */}
          <span className={`project-card__status project-card__status--${status}`}>
            {status.replace('-', ' ')}
          </span>
        </div>
        
        {/* Description */}
        {!compact && description && (
          <p className="project-card__description">{description}</p>
        )}
        
        {/* Progress */}
        {status === PROJECT_STATUS.ACTIVE && progress > 0 && (
          <div className="project-card__progress">
            <div className="project-card__progress-header">
              <span>Project Progress</span>
              <span className="project-card__progress-value">{progress}%</span>
            </div>
            <div className="project-card__progress-bar">
              <div 
                className="project-card__progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Funding */}
        {barakaGoal && (
          <div className="project-card__funding">
            <div className="project-card__funding-header">
              <span className="project-card__funding-label">
                <svg viewBox="0 0 20 20" fill="currentColor" className="project-card__baraka-icon">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
                </svg>
                Baraka Raised
              </span>
              <span className="project-card__funding-amount">
                {barakaRaised.toLocaleString()} / {barakaGoal.toLocaleString()}
              </span>
            </div>
            <div className="project-card__funding-bar">
              <div 
                className="project-card__funding-fill"
                style={{ width: `${fundingPercent}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Impact metrics */}
        {showImpact && impact && !compact && (
          <div className="project-card__impact">
            {impact.beneficiaries && (
              <div className="project-card__impact-item">
                <span className="project-card__impact-value">
                  {impact.beneficiaries.toLocaleString()}
                </span>
                <span className="project-card__impact-label">Beneficiaries</span>
              </div>
            )}
            {impact.volunteers && (
              <div className="project-card__impact-item">
                <span className="project-card__impact-value">
                  {impact.volunteers.toLocaleString()}
                </span>
                <span className="project-card__impact-label">Volunteers</span>
              </div>
            )}
            {impact.customMetric && (
              <div className="project-card__impact-item">
                <span className="project-card__impact-value">
                  {impact.customMetric.value}
                </span>
                <span className="project-card__impact-label">
                  {impact.customMetric.label}
                </span>
              </div>
            )}
          </div>
        )}
        
        {/* Team avatars */}
        {team.length > 0 && (
          <div className="project-card__team">
            <div className="project-card__team-avatars">
              {team.slice(0, 4).map((member, index) => (
                <div 
                  key={member.id || index}
                  className="project-card__team-avatar"
                  title={member.name}
                >
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} />
                  ) : (
                    <span>{member.name?.charAt(0) || '?'}</span>
                  )}
                </div>
              ))}
              {team.length > 4 && (
                <div className="project-card__team-more">
                  +{team.length - 4}
                </div>
              )}
            </div>
            <span className="project-card__team-count">
              {team.length} team member{team.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default ProjectCard;