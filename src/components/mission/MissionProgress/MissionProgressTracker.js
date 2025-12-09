/**
 * GPS Lab Platform - MissionProgressTracker Component
 * 
 * Comprehensive mission progress tracking with stats and timeline.
 * 
 * @module components/mission/MissionProgress/MissionProgressTracker
 */

import React, { useMemo } from 'react';
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
  const { title, objectives = [], xpReward = 0, barakaReward = 0, estimatedTime } = mission;
  
  const stats = useMemo(() => {
    const completedObjectives = objectives.filter(obj => obj.completed).length;
    const percentage = objectives.length > 0 ? Math.round((completedObjectives / objectives.length) * 100) : 0;
    const stepsCompleted = currentStepIndex;
    const stepsTotal = steps.length;
    return { completedObjectives, totalObjectives: objectives.length, percentage, stepsCompleted, stepsTotal };
  }, [objectives, currentStepIndex, steps.length]);
  
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const classNames = ['mission-progress-tracker', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="mission-progress-tracker__header">
        <div className="mission-progress-tracker__title-section">
          <span className="mission-progress-tracker__label">Current Mission</span>
          <h2 className="mission-progress-tracker__title">{title}</h2>
        </div>
        
        {/* Timer */}
        <div className="mission-progress-tracker__timer">
          <span className="mission-progress-tracker__time">{formatTime(timeSpent)}</span>
          {estimatedTime && <span className="mission-progress-tracker__estimated">/ ~{estimatedTime} min</span>}
          {(onPause || onResume) && (
            <button type="button" onClick={isPaused ? onResume : onPause} className="mission-progress-tracker__pause-btn">
              {isPaused ? (
                <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/></svg>
              ) : (
                <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
              )}
            </button>
          )}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mission-progress-tracker__progress">
        <div className="mission-progress-tracker__progress-bar">
          <div className="mission-progress-tracker__progress-fill" style={{ width: `${stats.percentage}%` }} />
        </div>
        <div className="mission-progress-tracker__progress-info">
          <span className="mission-progress-tracker__progress-percent">{stats.percentage}% Complete</span>
          <span className="mission-progress-tracker__progress-count">{stats.completedObjectives}/{stats.totalObjectives} objectives</span>
        </div>
      </div>
      
      {/* Stats Grid */}
      {showStats && (
        <div className="mission-progress-tracker__stats">
          <div className="mission-progress-tracker__stat">
            <svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            <span className="mission-progress-tracker__stat-value">{stats.stepsCompleted}/{stats.stepsTotal}</span>
            <span className="mission-progress-tracker__stat-label">Steps</span>
          </div>
          <div className="mission-progress-tracker__stat">
            <svg viewBox="0 0 20 20" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            <span className="mission-progress-tracker__stat-value mission-progress-tracker__stat-value--xp">+{xpReward}</span>
            <span className="mission-progress-tracker__stat-label">XP Reward</span>
          </div>
          <div className="mission-progress-tracker__stat">
            <svg viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="8"/></svg>
            <span className="mission-progress-tracker__stat-value mission-progress-tracker__stat-value--baraka">+{barakaReward}</span>
            <span className="mission-progress-tracker__stat-label">Baraka</span>
          </div>
        </div>
      )}
      
      {/* Timeline */}
      {showTimeline && steps.length > 0 && (
        <div className="mission-progress-tracker__timeline">
          <h3 className="mission-progress-tracker__timeline-title">Mission Steps</h3>
          <MissionTimeline steps={steps} currentStepIndex={currentStepIndex} onStepClick={onStepClick} />
        </div>
      )}
    </div>
  );
};

export default MissionProgressTracker;