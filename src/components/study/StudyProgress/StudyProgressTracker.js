/**
 * GPS Lab Platform - StudyProgressTracker Component
 * 
 * Tracks and displays overall study progress across missions,
 * modules, and stages with visual progress indicators.
 * 
 * @module components/study/StudyProgress/StudyProgressTracker
 */

import React from 'react';
import './StudyProgressTracker.css';

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
 * StudyProgressTracker Component
 */
const StudyProgressTracker = ({
  overallProgress = 0,
  stageProgress = [],
  missionsCompleted = 0,
  totalMissions = 0,
  modulesCompleted = 0,
  totalModules = 0,
  studyStreak = 0,
  weeklyGoal = 5,
  weeklyCompleted = 0,
  recentActivity = [],
  onStageClick,
  variant = 'default', // default, compact, detailed
  className = '',
  ...props
}) => {
  const classNames = [
    'study-progress-tracker',
    `study-progress-tracker--${variant}`,
    className
  ].filter(Boolean).join(' ');
  
  const weeklyProgress = weeklyGoal > 0 
    ? Math.min(100, Math.round((weeklyCompleted / weeklyGoal) * 100))
    : 0;
  
  return (
    <div className={classNames} {...props}>
      {/* Overall Progress */}
      <div className="study-progress-tracker__overall">
        <div className="study-progress-tracker__overall-circle">
          <svg viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="12"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${overallProgress * 3.39} 339`}
              transform="rotate(-90 60 60)"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--beacon-purple, #8e44ad)" />
                <stop offset="100%" stopColor="var(--gps-primary, #00d4ff)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="study-progress-tracker__overall-value">
            <span className="study-progress-tracker__percent">{overallProgress}</span>
            <span className="study-progress-tracker__percent-sign">%</span>
          </div>
        </div>
        <div className="study-progress-tracker__overall-info">
          <h3 className="study-progress-tracker__title">Study Progress</h3>
          <p className="study-progress-tracker__subtitle">
            Keep learning to master each stage
          </p>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="study-progress-tracker__stats">
        <div className="study-progress-tracker__stat">
          <span className="study-progress-tracker__stat-icon">📚</span>
          <div className="study-progress-tracker__stat-info">
            <span className="study-progress-tracker__stat-value">
              {missionsCompleted}/{totalMissions}
            </span>
            <span className="study-progress-tracker__stat-label">Missions</span>
          </div>
        </div>
        <div className="study-progress-tracker__stat">
          <span className="study-progress-tracker__stat-icon">📖</span>
          <div className="study-progress-tracker__stat-info">
            <span className="study-progress-tracker__stat-value">
              {modulesCompleted}/{totalModules}
            </span>
            <span className="study-progress-tracker__stat-label">Modules</span>
          </div>
        </div>
        <div className="study-progress-tracker__stat study-progress-tracker__stat--streak">
          <span className="study-progress-tracker__stat-icon">🔥</span>
          <div className="study-progress-tracker__stat-info">
            <span className="study-progress-tracker__stat-value">{studyStreak}</span>
            <span className="study-progress-tracker__stat-label">Day Streak</span>
          </div>
        </div>
      </div>
      
      {/* Weekly Goal */}
      {variant !== 'compact' && (
        <div className="study-progress-tracker__weekly">
          <div className="study-progress-tracker__weekly-header">
            <span className="study-progress-tracker__weekly-title">Weekly Goal</span>
            <span className="study-progress-tracker__weekly-count">
              {weeklyCompleted} / {weeklyGoal} missions
            </span>
          </div>
          <div className="study-progress-tracker__weekly-bar">
            <div 
              className="study-progress-tracker__weekly-fill"
              style={{ width: `${weeklyProgress}%` }}
            />
            {/* Goal markers */}
            {[...Array(weeklyGoal)].map((_, i) => (
              <div
                key={i}
                className={`study-progress-tracker__weekly-marker ${i < weeklyCompleted ? 'study-progress-tracker__weekly-marker--complete' : ''}`}
                style={{ left: `${((i + 1) / weeklyGoal) * 100}%` }}
              />
            ))}
          </div>
          {weeklyCompleted >= weeklyGoal && (
            <div className="study-progress-tracker__weekly-complete">
              🎉 Weekly goal achieved!
            </div>
          )}
        </div>
      )}
      
      {/* Stage Progress */}
      {variant === 'detailed' && stageProgress.length > 0 && (
        <div className="study-progress-tracker__stages">
          <h4 className="study-progress-tracker__section-title">Progress by Stage</h4>
          <div className="study-progress-tracker__stages-grid">
            {stageProgress.map((stage) => (
              <button
                key={stage.number}
                type="button"
                className={`study-progress-tracker__stage ${stage.isActive ? 'study-progress-tracker__stage--active' : ''} ${stage.isComplete ? 'study-progress-tracker__stage--complete' : ''}`}
                style={{ '--beacon-color': getBeaconColor(stage.number) }}
                onClick={() => onStageClick && onStageClick(stage.number)}
              >
                <div className="study-progress-tracker__stage-header">
                  <span className="study-progress-tracker__stage-beacon" />
                  <span className="study-progress-tracker__stage-number">
                    Stage {stage.number}
                  </span>
                  {stage.isComplete && (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="study-progress-tracker__stage-check">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  )}
                </div>
                <div className="study-progress-tracker__stage-progress">
                  <div className="study-progress-tracker__stage-bar">
                    <div 
                      className="study-progress-tracker__stage-fill"
                      style={{ width: `${stage.progress || 0}%` }}
                    />
                  </div>
                  <span className="study-progress-tracker__stage-percent">
                    {stage.progress || 0}%
                  </span>
                </div>
                <span className="study-progress-tracker__stage-count">
                  {stage.completed || 0}/{stage.total || 0} missions
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Recent Activity */}
      {variant === 'detailed' && recentActivity.length > 0 && (
        <div className="study-progress-tracker__activity">
          <h4 className="study-progress-tracker__section-title">Recent Activity</h4>
          <ul className="study-progress-tracker__activity-list">
            {recentActivity.slice(0, 5).map((activity, index) => (
              <li key={index} className="study-progress-tracker__activity-item">
                <span className="study-progress-tracker__activity-icon">
                  {activity.type === 'completed' ? '✅' : activity.type === 'started' ? '▶️' : '📖'}
                </span>
                <span className="study-progress-tracker__activity-text">
                  {activity.description}
                </span>
                <span className="study-progress-tracker__activity-time">
                  {activity.timeAgo}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StudyProgressTracker;