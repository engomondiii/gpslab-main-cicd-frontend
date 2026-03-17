/**
 * GPS 101 Stage Map Component
 * 
 * CORRECTED STRUCTURE:
 * - 5 Stages (1 mission per stage)
 * - Each stage displays its single mission with 6 sub-missions
 * - Visual map showing all stages with progress and navigation
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import useGPS101 from '../../../hooks/useGPS101';
import { GPS_101_CONFIG } from '../../../config/gps101.config';
import './GPS101StageMap.css';

const GPS101StageMap = () => {
  const navigate = useNavigate();
  const {
    progressSummary,
    currentStage,
    isStageUnlocked,
    getStageCompletionPercentage,
    loading
  } = useGPS101();

  const handleStageClick = (stageNumber) => {
    if (isStageUnlocked(stageNumber)) {
      navigate(`/gps101/stage/${stageNumber}`);
    }
  };

  if (loading?.stages) {
    return (
      <div className="gps101-stage-map loading">
        <div className="loading-spinner" />
        <p>Loading your journey...</p>
      </div>
    );
  }

  const stages = GPS_101_CONFIG?.STAGES || [];

  const getStageStatus = (stageNumber) => {
    const completion = getStageCompletionPercentage(stageNumber);
    const isUnlocked = isStageUnlocked(stageNumber);
    
    if (completion === 100) return 'completed';
    if (stageNumber === currentStage) return 'current';
    if (isUnlocked) return 'available';
    return 'locked';
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
    <div className="gps101-stage-map">
      {/* Header */}
      <div className="stage-map-header">
        <h2>Your GPS 101 Journey</h2>
        <p className="journey-subtitle">
          Progress through 5 stages to discover your life purpose
        </p>
      </div>

      {/* Stage Map Container */}
      <div className="stage-map-container">
        <div className="journey-path">
          {stages.map((stage, index) => {
            const stageNumber = stage.stageNumber;
            const status = getStageStatus(stageNumber);
            const completion = getStageCompletionPercentage(stageNumber);
            const isUnlocked = isStageUnlocked(stageNumber);
            const isCurrent = stageNumber === currentStage;

            return (
              <React.Fragment key={stage.stageId}>
                {/* Stage Node */}
                <div
                  className={`stage-node ${status} ${isCurrent ? 'active' : ''}`}
                  onClick={() => handleStageClick(stageNumber)}
                  role="button"
                  tabIndex={isUnlocked ? 0 : -1}
                  aria-label={`Stage ${stageNumber}: ${stage.question}`}
                >
                  {/* Stage Icon/Number Wrapper */}
                  <div className="stage-icon-wrapper">
                    <div className="stage-number">
                      {status === 'completed' ? (
                        <span className="completion-badge">✓</span>
                      ) : status === 'locked' ? (
                        <span className="lock-icon">🔒</span>
                      ) : (
                        <span>{stageNumber}</span>
                      )}
                    </div>
                  </div>

                  {/* Stage Info */}
                  <div className="stage-info">
                    <div className="stage-title">Stage {stageNumber}</div>
                    <div className="stage-question">{stage.question}</div>
                    
                    {/* Progress Bar */}
                    {isUnlocked && (
                      <>
                        <div className="stage-progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${completion}%` }}
                          />
                        </div>
                        <div className="stage-completion">{completion}% Complete</div>
                      </>
                    )}

                    {/* Locked Message */}
                    {!isUnlocked && stageNumber > 1 && (
                      <div className="locked-message">
                        Complete Stage {stageNumber - 1}
                      </div>
                    )}
                  </div>

                  {/* Deliverable Icon */}
                  <div className="stage-deliverable-icon">
                    {getStageIcon(stageNumber)}
                  </div>
                </div>

                {/* Stage Connector */}
                {index < stages.length - 1 && (
                  <div className={`stage-connector ${status === 'completed' ? 'completed' : ''}`}>
                    <div className="connector-line" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Journey Summary */}
      <div className="journey-summary">
        <div className="summary-stat">
          <span className="stat-label">Stages Completed</span>
          <span className="stat-value">
            {progressSummary?.stages?.completed || 0}/{progressSummary?.stages?.total || 5}
          </span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Missions Completed</span>
          <span className="stat-value">
            {progressSummary?.missions?.completed || 0}/{progressSummary?.missions?.total || 5}
          </span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Overall Progress</span>
          <span className="stat-value">{progressSummary?.overallProgress || 0}%</span>
        </div>
      </div>
    </div>
  );
};

export default GPS101StageMap;