/**
 * GPS Lab Platform - MissionProgressTracker Component
 * GPS 101 INTEGRATION: Shows GPS 101 stage context, Navigator tips, deliverable progress
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MissionTimeline from './MissionTimeline';
import './MissionProgressTracker.css';

const MissionProgressTracker = ({
  mission = {},
  steps = [],
  currentStepIndex = 0,
  timeSpent = 0,
  onStepClick,
  onPause,
  onResume,
  isPaused = false,
  showTimeline = true,
  showStats = true,
  className = '',
  ...props
}) => {
  const navigate = useNavigate();
  
  const {
    title,
    objectives = [],
    xpReward = 0,
    barakaReward = 0,
    estimatedTime,
    // NEW: GPS 101 fields
    isGPS101 = false,
    gps101StageNumber,
    gps101StageQuestion,
    gps101DeliverableName,
    isStageCompleter = false
  } = mission;
  
  const stats = useMemo(() => {
    const completedObjectives = objectives.filter(obj => obj.completed).length;
    const percentage = objectives.length > 0 ? Math.round((completedObjectives / objectives.length) * 100) : 0;
    const stepsCompleted = currentStepIndex;
    const stepsTotal = steps.length;
    return {
      completedObjectives,
      totalObjectives: objectives.length,
      percentage,
      stepsCompleted,
      stepsTotal
    };
  }, [objectives, currentStepIndex, steps.length]);
  
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const classNames = [
    'mission-progress-tracker',
    isGPS101 && 'mission-progress-tracker--gps101',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* NEW: GPS 101 Context Banner */}
      {isGPS101 && (
        <div className="mission-progress-tracker__gps101-banner">
          <div className="mission-progress-tracker__gps101-badge">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
            </svg>
            <span>GPS 101 • Stage {gps101StageNumber}</span>
          </div>
          {gps101StageQuestion && (
            <p className="mission-progress-tracker__gps101-question">"{gps101StageQuestion}"</p>
          )}
          {isStageCompleter && gps101DeliverableName && (
            <div className="mission-progress-tracker__deliverable-indicator">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span>Complete to unlock: {gps101DeliverableName}</span>
            </div>
          )}
        </div>
      )}
      
      {/* Header */}
      <div className="mission-progress-tracker__header">
        <div className="mission-progress-tracker__title-section">
          <span className="mission-progress-tracker__label">
            {isGPS101 ? 'GPS 101 Mission' : 'Current Mission'}
          </span>
          <h2 className="mission-progress-tracker__title">{title}</h2>
        </div>
        
        {/* Timer */}
        <div className="mission-progress-tracker__timer">
          <span className="mission-progress-tracker__time">{formatTime(timeSpent)}</span>
          {estimatedTime && (
            <span className="mission-progress-tracker__estimated">/ ~{estimatedTime} min</span>
          )}
          {(onPause || onResume) && (
            <button
              type="button"
              onClick={isPaused ? onResume : onPause}
              className="mission-progress-tracker__pause-btn"
            >
              {isPaused ? (
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mission-progress-tracker__progress">
        <div className="mission-progress-tracker__progress-bar">
          <div
            className="mission-progress-tracker__progress-fill"
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
        <div className="mission-progress-tracker__progress-info">
          <span className="mission-progress-tracker__progress-percent">{stats.percentage}% Complete</span>
          <span className="mission-progress-tracker__progress-count">
            {stats.completedObjectives}/{stats.totalObjectives} objectives
          </span>
        </div>
      </div>
      
      {/* Stats Grid */}
      {showStats && (
        <div className="mission-progress-tracker__stats">
          <div className="mission-progress-tracker__stat">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="mission-progress-tracker__stat-value">
              {stats.stepsCompleted}/{stats.stepsTotal}
            </span>
            <span className="mission-progress-tracker__stat-label">Steps</span>
          </div>
          <div className="mission-progress-tracker__stat">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <span className="mission-progress-tracker__stat-value mission-progress-tracker__stat-value--xp">
              +{xpReward}
            </span>
            <span className="mission-progress-tracker__stat-label">XP Reward</span>
          </div>
          <div className="mission-progress-tracker__stat">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="10" r="8"/>
            </svg>
            <span className="mission-progress-tracker__stat-value mission-progress-tracker__stat-value--baraka">
              +{barakaReward}
            </span>
            <span className="mission-progress-tracker__stat-label">Baraka</span>
          </div>
        </div>
      )}
      
      {/* NEW: GPS 101 Navigator Quick Help */}
      {isGPS101 && (
        <div className="mission-progress-tracker__navigator-card">
          <div className="mission-progress-tracker__navigator-icon">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd"/>
            </svg>
          </div>
          <div className="mission-progress-tracker__navigator-content">
            <h4>Need help?</h4>
            <p>Ask Navigator AI for mission guidance</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/navigator', { state: { context: 'gps101' } })}
            className="mission-progress-tracker__navigator-btn"
          >
            Ask Navigator
          </button>
        </div>
      )}
      
      {/* Timeline */}
      {showTimeline && steps.length > 0 && (
        <div className="mission-progress-tracker__timeline">
          <h3 className="mission-progress-tracker__timeline-title">Mission Steps</h3>
          <MissionTimeline
            steps={steps}
            currentStepIndex={currentStepIndex}
            onStepClick={onStepClick}
            isGPS101={isGPS101}
          />
        </div>
      )}
    </div>
  );
};

export default MissionProgressTracker;