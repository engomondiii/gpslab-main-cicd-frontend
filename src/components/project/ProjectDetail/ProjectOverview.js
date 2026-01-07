/**
 * GPS Lab Platform - ProjectOverview Component
 * 
 * Overview section of project detail showing key info,
 * description, team, and current status.
 * 
 * @module components/project/ProjectDetail/ProjectOverview
 */

import React from 'react';
import './ProjectOverview.css';

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
 * Format date
 */
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * ProjectOverview Component
 */
const ProjectOverview = ({
  project,
  currentUserId,
  onEditProject,
  onInviteTeam,
  className = '',
  ...props
}) => {
  if (!project) return null;
  
  const {
    name,
    description,
    stage = 1,
    status = 'active',
    progress = 0,
    category,
    tags = [],
    team = [],
    problemStatement,
    targetAudience,
    createdAt,
    updatedAt
  } = project;
  
  const beaconColor = getBeaconColor(stage);
  const stageName = getStageName(stage);
  const isOwner = team.some(m => m.id === currentUserId && m.role === 'owner');
  
  const classNames = [
    'project-overview',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} style={{ '--beacon-color': beaconColor }} {...props}>
      {/* Header */}
      <div className="project-overview__header">
        <div className="project-overview__title-section">
          <div className="project-overview__beacon-row">
            <span className="project-overview__beacon" />
            <span className="project-overview__stage">Stage {stage} · {stageName}</span>
          </div>
          <h2 className="project-overview__title">{name}</h2>
          
          <div className="project-overview__meta">
            {category && (
              <span className="project-overview__category">{category}</span>
            )}
            <span className={`project-overview__status project-overview__status--${status}`}>
              {status === 'active' && '● Active'}
              {status === 'paused' && '⏸ Paused'}
              {status === 'completed' && '✓ Completed'}
              {status === 'archived' && '📦 Archived'}
            </span>
          </div>
        </div>
        
        {isOwner && (
          <button
            type="button"
            onClick={onEditProject}
            className="project-overview__edit-btn"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
            </svg>
            Edit Project
          </button>
        )}
      </div>
      
      {/* Progress */}
      <div className="project-overview__progress-section">
        <div className="project-overview__progress-header">
          <span className="project-overview__progress-label">Overall Progress</span>
          <span className="project-overview__progress-value">{progress}%</span>
        </div>
        <div className="project-overview__progress-bar">
          <div 
            className="project-overview__progress-fill"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      </div>
      
      {/* Description */}
      <div className="project-overview__section">
        <h3 className="project-overview__section-title">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
          </svg>
          About
        </h3>
        <p className="project-overview__description">{description || 'No description provided.'}</p>
      </div>
      
      {/* Problem Statement */}
      {problemStatement && (
        <div className="project-overview__section">
          <h3 className="project-overview__section-title">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
            </svg>
            Problem Statement
          </h3>
          <p className="project-overview__problem">{problemStatement}</p>
        </div>
      )}
      
      {/* Target Audience */}
      {targetAudience && (
        <div className="project-overview__section">
          <h3 className="project-overview__section-title">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
            </svg>
            Target Audience
          </h3>
          <p className="project-overview__audience">{targetAudience}</p>
        </div>
      )}
      
      {/* Team */}
      <div className="project-overview__section">
        <div className="project-overview__section-header">
          <h3 className="project-overview__section-title">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
            </svg>
            Team ({team.length})
          </h3>
          {isOwner && onInviteTeam && (
            <button
              type="button"
              onClick={onInviteTeam}
              className="project-overview__invite-btn"
            >
              + Invite
            </button>
          )}
        </div>
        
        <div className="project-overview__team">
          {team.length > 0 ? (
            team.map(member => (
              <div key={member.id} className="project-overview__team-member">
                <div 
                  className="project-overview__member-avatar"
                  style={{
                    backgroundImage: member.avatar ? `url(${member.avatar})` : 'none'
                  }}
                >
                  {!member.avatar && member.name?.charAt(0).toUpperCase()}
                </div>
                <div className="project-overview__member-info">
                  <span className="project-overview__member-name">{member.name}</span>
                  <span className="project-overview__member-role">{member.role}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="project-overview__team-empty">No team members yet.</p>
          )}
        </div>
      </div>
      
      {/* Tags */}
      {tags.length > 0 && (
        <div className="project-overview__tags">
          {tags.map(tag => (
            <span key={tag} className="project-overview__tag">#{tag}</span>
          ))}
        </div>
      )}
      
      {/* Dates */}
      <div className="project-overview__dates">
        <div className="project-overview__date">
          <span className="project-overview__date-label">Created</span>
          <span className="project-overview__date-value">{formatDate(createdAt)}</span>
        </div>
        <div className="project-overview__date">
          <span className="project-overview__date-label">Last Updated</span>
          <span className="project-overview__date-value">{formatDate(updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;