/**
 * GPS Lab Platform - ProjectDetail Component
 * 
 * Main container for project detail view with tabs for
 * overview, metrics, impact, missions, and settings.
 * 
 * @module components/project/ProjectDetail/ProjectDetail
 */

import React, { useState, useCallback } from 'react';
import ProjectOverview from './ProjectOverview';
import ProjectMetrics from './ProjectMetrics';
import ProjectImpact from './ProjectImpact';
import './ProjectDetail.css';

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
 * ProjectDetail Component
 */
const ProjectDetail = ({
  project,
  currentUserId,
  missions = [],
  onBack,
  onEditProject,
  onInviteTeam,
  onDeleteProject,
  onStartMission,
  onViewMission,
  className = '',
  ...props
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!project) {
    return (
      <div className="project-detail project-detail--empty">
        <p>Project not found</p>
      </div>
    );
  }
  
  const {
    id,
    name,
    stage = 1,
    status = 'active',
    team = [],
    metrics = {},
    impact = {}
  } = project;
  
  const beaconColor = getBeaconColor(stage);
  const isOwner = team.some(m => m.id === currentUserId && m.role === 'owner');
  const isMember = team.some(m => m.id === currentUserId);
  
  const handleDeleteProject = useCallback(() => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      if (onDeleteProject) {
        onDeleteProject(id);
      }
    }
  }, [id, onDeleteProject]);
  
  const classNames = [
    'project-detail',
    className
  ].filter(Boolean).join(' ');
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'metrics', label: 'Metrics', icon: '📊' },
    { id: 'impact', label: 'Impact', icon: '❤️' },
    { id: 'missions', label: 'Missions', icon: '🎯' }
  ];
  
  return (
    <div className={classNames} style={{ '--beacon-color': beaconColor }} {...props}>
      {/* Header */}
      <header className="project-detail__header">
        {onBack && (
          <button type="button" onClick={onBack} className="project-detail__back-btn">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
            Back to Projects
          </button>
        )}
        
        {/* Tabs */}
        <nav className="project-detail__tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`project-detail__tab ${activeTab === tab.id ? 'project-detail__tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="project-detail__tab-icon">{tab.icon}</span>
              <span className="project-detail__tab-label">{tab.label}</span>
            </button>
          ))}
        </nav>
        
        {/* Actions */}
        {isOwner && (
          <div className="project-detail__actions">
            <button
              type="button"
              onClick={onEditProject}
              className="project-detail__action-btn"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
              </svg>
            </button>
            <button
              type="button"
              onClick={handleDeleteProject}
              className="project-detail__action-btn project-detail__action-btn--danger"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        )}
      </header>
      
      {/* Content */}
      <div className="project-detail__content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <ProjectOverview
            project={project}
            currentUserId={currentUserId}
            onEditProject={onEditProject}
            onInviteTeam={onInviteTeam}
          />
        )}
        
        {/* Metrics Tab */}
        {activeTab === 'metrics' && (
          <ProjectMetrics
            metrics={metrics}
          />
        )}
        
        {/* Impact Tab */}
        {activeTab === 'impact' && (
          <ProjectImpact
            impact={impact}
            isOwner={isOwner}
          />
        )}
        
        {/* Missions Tab */}
        {activeTab === 'missions' && (
          <div className="project-detail__missions">
            <div className="project-detail__missions-header">
              <h3 className="project-detail__missions-title">
                <span className="project-detail__missions-icon">🎯</span>
                Project Missions
              </h3>
              {isOwner && (
                <button
                  type="button"
                  className="project-detail__start-mission-btn"
                  onClick={onStartMission}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                  </svg>
                  Start New Mission
                </button>
              )}
            </div>
            
            {missions.length > 0 ? (
              <div className="project-detail__missions-list">
                {missions.map(mission => (
                  <div
                    key={mission.id}
                    className={`project-detail__mission-card project-detail__mission-card--${mission.status}`}
                    onClick={() => onViewMission && onViewMission(mission.id)}
                  >
                    <div className="project-detail__mission-status">
                      {mission.status === 'completed' && '✓'}
                      {mission.status === 'in_progress' && '▶'}
                      {mission.status === 'pending' && '○'}
                    </div>
                    <div className="project-detail__mission-info">
                      <span className="project-detail__mission-name">{mission.name}</span>
                      <span className="project-detail__mission-stage">Stage {mission.stage}</span>
                    </div>
                    {mission.progress !== undefined && (
                      <div className="project-detail__mission-progress">
                        <div className="project-detail__mission-progress-bar">
                          <div 
                            className="project-detail__mission-progress-fill"
                            style={{ width: `${mission.progress}%` }}
                          />
                        </div>
                        <span className="project-detail__mission-progress-value">{mission.progress}%</span>
                      </div>
                    )}
                    <svg viewBox="0 0 20 20" fill="currentColor" className="project-detail__mission-arrow">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                ))}
              </div>
            ) : (
              <div className="project-detail__missions-empty">
                <span className="project-detail__missions-empty-icon">🎯</span>
                <h4>No missions yet</h4>
                <p>Start a mission to make progress on your project</p>
                {isOwner && (
                  <button
                    type="button"
                    className="project-detail__start-mission-empty-btn"
                    onClick={onStartMission}
                  >
                    Start Your First Mission
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Quick Stats Footer */}
      <footer className="project-detail__footer">
        <div className="project-detail__quick-stats">
          <div className="project-detail__quick-stat">
            <span className="project-detail__quick-stat-value">{team.length}</span>
            <span className="project-detail__quick-stat-label">Team Members</span>
          </div>
          <div className="project-detail__quick-stat">
            <span className="project-detail__quick-stat-value">{missions.filter(m => m.status === 'completed').length}</span>
            <span className="project-detail__quick-stat-label">Missions Done</span>
          </div>
          <div className="project-detail__quick-stat">
            <span className="project-detail__quick-stat-value">{project.progress || 0}%</span>
            <span className="project-detail__quick-stat-label">Progress</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProjectDetail;