/**
 * GPS Lab Platform - StudyProgressTracker Component
 * GPS 101 INTEGRATION: Display GPS 101 progress separately from regular progress
 * 
 * Tracks and displays overall study progress across missions,
 * modules, and stages with visual progress indicators.
 * 
 * @module components/study/StudyProgress/StudyProgressTracker
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  // NEW: GPS 101 props
  isGPS101Enrolled = false,
  gps101Progress = 0,
  gps101CurrentStage = 1,
  gps101MissionsCompleted = 0,
  gps101TotalMissions = 30, // 5 stages × 6 missions
  gps101StudyStreak = 0,
  showGPS101Separately = true,
  onStageClick,
  variant = 'default', // default, compact, detailed
  className = '',
  ...props
}) => {
  const navigate = useNavigate();
  
  const classNames = [
    'study-progress-tracker',
    `study-progress-tracker--${variant}`,
    isGPS101Enrolled && showGPS101Separately && 'study-progress-tracker--with-gps101',
    className
  ].filter(Boolean).join(' ');
  
  const weeklyProgress = weeklyGoal > 0 
    ? Math.min(100, Math.round((weeklyCompleted / weeklyGoal) * 100))
    : 0;
  
  return (
    <div className={classNames} {...props}>
      {/* NEW: GPS 101 Section (if enrolled and showing separately) */}
      {isGPS101Enrolled && showGPS101Separately && (
        <div className="study-progress-tracker__gps101">
          <div className="study-progress-tracker__gps101-header">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0z"/>
            </svg>
            <div>
              <h3 className="study-progress-tracker__gps101-title">GPS 101 Basic</h3>
              <p className="study-progress-tracker__gps101-subtitle">Purpose Discovery Journey</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/gps-101')}
              className="study-progress-tracker__gps101-link"
            >
              View →
            </button>
          </div>
          
          <div className="study-progress-tracker__gps101-progress">
            <div className="study-progress-tracker__gps101-circle">
              <svg viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="rgba(102, 126, 234, 0.2)"
                  strokeWidth="12"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="url(#gps101Gradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${gps101Progress * 3.39} 339`}
                  transform="rotate(-90 60 60)"
                />
                <defs>
                  <linearGradient id="gps101Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="study-progress-tracker__gps101-value">
                <span className="study-progress-tracker__gps101-percent">{gps101Progress}</span>
                <span className="study-progress-tracker__gps101-sign">%</span>
              </div>
            </div>
            
            <div className="study-progress-tracker__gps101-stats">
              <div className="study-progress-tracker__gps101-stat">
                <span className="study-progress-tracker__gps101-stat-value">
                  Stage {gps101CurrentStage}/5
                </span>
                <span className="study-progress-tracker__gps101-stat-label">Current Stage</span>
              </div>
              <div className="study-progress-tracker__gps101-stat">
                <span className="study-progress-tracker__gps101-stat-value">
                  {gps101MissionsCompleted}/{gps101TotalMissions}
                </span>
                <span className="study-progress-tracker__gps101-stat-label">Missions</span>
              </div>
              {gps101StudyStreak > 0 && (
                <div className="study-progress-tracker__gps101-stat">
                  <span className="study-progress-tracker__gps101-stat-icon">🔥</span>
                  <span className="study-progress-tracker__gps101-stat-value">{gps101StudyStreak}</span>
                  <span className="study-progress-tracker__gps101-stat-label">Day Streak</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
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
          <h3 className="study-progress-tracker__title">
            {isGPS101Enrolled && showGPS101Separately ? 'Regular Study Progress' : 'Study Progress'}
          </h3>
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
              <li key={index} className={`study-progress-tracker__activity-item ${activity.isGPS101 ? 'study-progress-tracker__activity-item--gps101' : ''}`}>
                <span className="study-progress-tracker__activity-icon">
                  {activity.isGPS101 ? '🎓' : activity.type === 'completed' ? '✅' : activity.type === 'started' ? '▶️' : '📖'}
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