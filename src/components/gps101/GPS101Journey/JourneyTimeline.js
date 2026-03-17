/**
 * Journey Timeline Component
 * 
 * CORRECTED STRUCTURE:
 * - 5 Stages (1 mission per stage)
 * - 30 Sub-missions (6 per mission)
 * - 150 Checkpoints (5 per sub-mission)
 * 
 * Visual timeline of GPS 101 journey with milestones.
 */

import React from 'react';
import { GPS_101_CONFIG } from '../../../config/gps101.config';
import './JourneyTimeline.css';

const JourneyTimeline = ({ 
  completedStages = [],
  completedMissions = [],
  completedSubMissions = [], // NEW
  currentStage = 1,
  enrollmentDate 
}) => {
  const stages = GPS_101_CONFIG?.STAGES || [];

  const getStageStatus = (stageNumber) => {
    if (completedStages.includes(stageNumber)) return 'completed';
    if (stageNumber === currentStage) return 'current';
    if (stageNumber < currentStage) return 'completed';
    return 'upcoming';
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getProjectedDate = (stageNumber) => {
    if (!enrollmentDate) return '';
    
    const weeksPerStage = 3;
    const weeksToStage = (stageNumber - 1) * weeksPerStage;
    const projected = new Date(enrollmentDate);
    projected.setDate(projected.getDate() + (weeksToStage * 7));
    
    return projected;
  };

  const getStageIcon = (stageNumber) => {
    const icons = {
      1: '🪪', // Identity
      2: '🧩', // Problem
      3: '💝', // Story
      4: '✨', // Purpose
      5: '🚀'  // Project
    };
    return icons[stageNumber] || '📍';
  };

  return (
    <div className="journey-timeline">
      {/* Header */}
      <div className="timeline-header">
        <h2>Your GPS 101 Journey</h2>
        <p className="timeline-subtitle">
          {enrollmentDate && `Started ${formatDate(enrollmentDate)}`}
        </p>
      </div>

      {/* Timeline Container */}
      <div className="timeline-container">
        {stages.map((stage, index) => {
          const stageNumber = stage.stageNumber;
          const status = getStageStatus(stageNumber);
          const projectedDate = getProjectedDate(stageNumber);
          
          // CORRECTED: 1 mission per stage
          const isStageCompleted = completedMissions.includes(`GPS101_M${stageNumber}`);

          return (
            <div key={stage.stageId} className={`timeline-stage ${status}`}>
              {/* Timeline Line */}
              {index > 0 && (
                <div className={`timeline-connector ${status === 'completed' ? 'completed' : status === 'current' ? 'current' : ''}`} />
              )}

              {/* Stage Node Wrapper */}
              <div className="stage-node-wrapper">
                <div className={`stage-node ${status}`}>
                  <div className="stage-node-inner">
                    {status === 'completed' ? (
                      <span className="node-icon">✓</span>
                    ) : (
                      <span className="node-icon">{getStageIcon(stageNumber)}</span>
                    )}
                  </div>
                </div>

                {/* Current Indicator */}
                {status === 'current' && (
                  <div className="current-indicator">
                    <div className="indicator-pulse" />
                    <span className="indicator-text">Current</span>
                  </div>
                )}
              </div>

              {/* Stage Content */}
              <div className="stage-timeline-content">
                <div className="stage-timeline-header">
                  <h3 className="stage-timeline-title">
                    Stage {stageNumber} • {stage.title}
                  </h3>
                  {projectedDate && status !== 'completed' && (
                    <span className="projected-date">
                      {formatDate(projectedDate)}
                    </span>
                  )}
                </div>

                <p className="stage-question">"{stage.question}"</p>

                {/* Stage Stats */}
                <div className="stage-stats">
                  <div className="stage-stat">
                    <span className="stat-icon">🎯</span>
                    <span className="stat-text">1 Mission</span>
                  </div>
                  <div className="stage-stat">
                    <span className="stat-icon">📝</span>
                    <span className="stat-text">6 Sub-missions</span>
                  </div>
                  <div className="stage-stat">
                    <span className="stat-icon">✓</span>
                    <span className="stat-text">30 Checkpoints</span>
                  </div>
                </div>

                {/* Expected Outcome */}
                <div className="stage-outcome">
                  <span className="outcome-label">Expected Outcome</span>
                  <p className="outcome-text">{stage.expectedOutcome}</p>
                </div>

                {/* Deliverable */}
                <div className="stage-deliverable-info">
                  <span className="deliverable-icon">{getStageIcon(stageNumber)}</span>
                  <div className="deliverable-content">
                    <span className="deliverable-label">Deliverable</span>
                    <span className="deliverable-text">{stage.deliverable}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Journey Stats */}
      <div className="journey-stats">
        <div className="stat">
          <span className="stat-label">Stages Completed</span>
          <span className="stat-value">{completedStages.length}/5</span>
        </div>
        <div className="stat">
          <span className="stat-label">Missions Completed</span>
          <span className="stat-value">{completedMissions.length}/5</span>
        </div>
        <div className="stat">
          <span className="stat-label">Overall Progress</span>
          <span className="stat-value">
            {Math.round((completedMissions.length / 5) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default JourneyTimeline;