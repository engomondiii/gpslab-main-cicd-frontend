/**
 * GPS Lab Platform - StudyMissionDetail Component
 * 
 * Detailed view of a study mission including modules list,
 * learning objectives, and progress tracking.
 * 
 * @module components/study/StudyMission/StudyMissionDetail
 */

import React, { useState, useCallback } from 'react';
import './StudyMissionDetail.css';

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
 * StudyMissionDetail Component
 */
const StudyMissionDetail = ({
  mission,
  modules = [],
  currentModuleId,
  onBack,
  onStartMission,
  onContinueMission,
  onModuleSelect,
  onMarkComplete,
  className = '',
  ...props
}) => {
  const [expandedSections, setExpandedSections] = useState(new Set(['modules', 'objectives']));
  
  const {
    id,
    title,
    description,
    stage = 1,
    duration,
    difficulty,
    progress = 0,
    status = 'not_started',
    objectives = [],
    prerequisites = [],
    rewards = {},
    lastAccessedAt,
    completedAt
  } = mission || {};
  
  const beaconColor = getBeaconColor(stage);
  const isCompleted = status === 'completed';
  const isInProgress = status === 'in_progress';
  
  const completedModules = modules.filter(m => m.status === 'completed').length;
  const totalModules = modules.length;
  
  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  }, []);
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const classNames = [
    'study-mission-detail',
    `study-mission-detail--${status}`,
    className
  ].filter(Boolean).join(' ');
  
  if (!mission) {
    return (
      <div className="study-mission-detail study-mission-detail--empty">
        <p>Select a study mission to view details</p>
      </div>
    );
  }
  
  return (
    <div className={classNames} style={{ '--beacon-color': beaconColor }} {...props}>
      {/* Header */}
      <header className="study-mission-detail__header">
        {onBack && (
          <button type="button" onClick={onBack} className="study-mission-detail__back-btn">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
            Back
          </button>
        )}
        
        <div className="study-mission-detail__beacon-wrap">
          <span className="study-mission-detail__beacon" />
          <span className="study-mission-detail__stage">Stage {stage}</span>
        </div>
        
        {isCompleted && (
          <div className="study-mission-detail__completed-badge">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            Completed
          </div>
        )}
      </header>
      
      {/* Title Section */}
      <div className="study-mission-detail__title-section">
        <h1 className="study-mission-detail__title">{title}</h1>
        <p className="study-mission-detail__description">{description}</p>
        
        <div className="study-mission-detail__meta">
          {duration && (
            <div className="study-mission-detail__meta-item">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
              {duration}
            </div>
          )}
          {difficulty && (
            <div className={`study-mission-detail__meta-item study-mission-detail__difficulty study-mission-detail__difficulty--${difficulty.toLowerCase()}`}>
              {difficulty}
            </div>
          )}
          <div className="study-mission-detail__meta-item">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
            </svg>
            {totalModules} modules
          </div>
        </div>
      </div>
      
      {/* Progress Section */}
      <div className="study-mission-detail__progress-section">
        <div className="study-mission-detail__progress-header">
          <span className="study-mission-detail__progress-label">Progress</span>
          <span className="study-mission-detail__progress-value">{completedModules}/{totalModules} modules</span>
        </div>
        <div className="study-mission-detail__progress-bar">
          <div className="study-mission-detail__progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="study-mission-detail__progress-percent">{progress}% complete</div>
      </div>
      
      {/* Action Button */}
      <div className="study-mission-detail__actions">
        {isCompleted ? (
          <button type="button" className="study-mission-detail__btn study-mission-detail__btn--secondary" onClick={() => onStartMission && onStartMission(id)}>
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
            Review Mission
          </button>
        ) : isInProgress ? (
          <button type="button" className="study-mission-detail__btn study-mission-detail__btn--primary" onClick={() => onContinueMission && onContinueMission(id)}>
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
            </svg>
            Continue Learning
          </button>
        ) : (
          <button type="button" className="study-mission-detail__btn study-mission-detail__btn--primary" onClick={() => onStartMission && onStartMission(id)}>
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
            </svg>
            Start Mission
          </button>
        )}
      </div>
      
      {/* Rewards Section */}
      {(rewards.xp || rewards.r2r || rewards.baraka) && (
        <div className="study-mission-detail__rewards">
          <h3 className="study-mission-detail__section-title">Rewards</h3>
          <div className="study-mission-detail__rewards-grid">
            {rewards.xp && (
              <div className="study-mission-detail__reward">
                <span className="study-mission-detail__reward-icon">⚡</span>
                <span className="study-mission-detail__reward-value">+{rewards.xp}</span>
                <span className="study-mission-detail__reward-label">XP</span>
              </div>
            )}
            {rewards.r2r && (
              <div className="study-mission-detail__reward">
                <span className="study-mission-detail__reward-icon">🔄</span>
                <span className="study-mission-detail__reward-value">+{rewards.r2r}</span>
                <span className="study-mission-detail__reward-label">R2R</span>
              </div>
            )}
            {rewards.baraka && (
              <div className="study-mission-detail__reward">
                <span className="study-mission-detail__reward-icon">💰</span>
                <span className="study-mission-detail__reward-value">+{rewards.baraka}</span>
                <span className="study-mission-detail__reward-label">Baraka</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Learning Objectives */}
      {objectives.length > 0 && (
        <div className="study-mission-detail__section">
          <button type="button" className="study-mission-detail__section-header" onClick={() => toggleSection('objectives')}>
            <h3 className="study-mission-detail__section-title">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd"/>
              </svg>
              Learning Objectives
            </h3>
            <svg viewBox="0 0 20 20" fill="currentColor" className={`study-mission-detail__section-chevron ${expandedSections.has('objectives') ? 'study-mission-detail__section-chevron--open' : ''}`}>
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
          {expandedSections.has('objectives') && (
            <ul className="study-mission-detail__objectives">
              {objectives.map((objective, index) => (
                <li key={index} className="study-mission-detail__objective">
                  <span className="study-mission-detail__objective-check">
                    {objective.completed ? (
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    ) : (
                      <span className="study-mission-detail__objective-bullet" />
                    )}
                  </span>
                  <span className={`study-mission-detail__objective-text ${objective.completed ? 'study-mission-detail__objective-text--completed' : ''}`}>
                    {objective.text || objective}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      
      {/* Modules List */}
      <div className="study-mission-detail__section">
        <button type="button" className="study-mission-detail__section-header" onClick={() => toggleSection('modules')}>
          <h3 className="study-mission-detail__section-title">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
            </svg>
            Modules ({completedModules}/{totalModules})
          </h3>
          <svg viewBox="0 0 20 20" fill="currentColor" className={`study-mission-detail__section-chevron ${expandedSections.has('modules') ? 'study-mission-detail__section-chevron--open' : ''}`}>
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        </button>
        {expandedSections.has('modules') && (
          <div className="study-mission-detail__modules">
            {modules.map((module, index) => (
              <button
                key={module.id}
                type="button"
                className={`study-mission-detail__module ${module.status === 'completed' ? 'study-mission-detail__module--completed' : ''} ${currentModuleId === module.id ? 'study-mission-detail__module--current' : ''} ${module.isLocked ? 'study-mission-detail__module--locked' : ''}`}
                onClick={() => !module.isLocked && onModuleSelect && onModuleSelect(module.id)}
                disabled={module.isLocked}
              >
                <span className="study-mission-detail__module-number">{index + 1}</span>
                <div className="study-mission-detail__module-info">
                  <span className="study-mission-detail__module-title">{module.title}</span>
                  <span className="study-mission-detail__module-duration">{module.duration || '5 min'}</span>
                </div>
                <span className="study-mission-detail__module-status">
                  {module.isLocked ? (
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                    </svg>
                  ) : module.status === 'completed' ? (
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  ) : currentModuleId === module.id ? (
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                  )}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Timestamps */}
      <div className="study-mission-detail__timestamps">
        {lastAccessedAt && (
          <span className="study-mission-detail__timestamp">
            Last accessed: {formatDate(lastAccessedAt)}
          </span>
        )}
        {completedAt && (
          <span className="study-mission-detail__timestamp">
            Completed: {formatDate(completedAt)}
          </span>
        )}
      </div>
    </div>
  );
};

export default StudyMissionDetail;