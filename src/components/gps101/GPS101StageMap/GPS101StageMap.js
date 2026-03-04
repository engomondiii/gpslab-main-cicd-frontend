/**
 * GPS 101 Stage Map Component
 * 
 * Visual map showing all 5 stages with progress and navigation
 * 
 * FIXED: All navigation paths now use /gps101 (no dash)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import useGPS101 from '../../../hooks/useGPS101';
import './GPS101StageMap.css';

const GPS101StageMap = () => {
  const navigate = useNavigate();
  const {
    stages,
    currentStage,
    isStageUnlocked,
    getStageCompletionPercentage,
    loading
  } = useGPS101();

  const handleStageClick = (stageNumber) => {
    if (isStageUnlocked(stageNumber)) {
      // FIXED: Navigate to /gps101 (no dash)
      navigate(`/gps101/stage/${stageNumber}`);
    }
  };

  if (loading?.stages || !stages || stages.length === 0) {
    return (
      <div className="gps101-stage-map loading">
        <div className="loading-spinner" />
        <p>Loading stages...</p>
      </div>
    );
  }

  const getStageStatus = (stageNumber) => {
    const completion = getStageCompletionPercentage(stageNumber);
    const isUnlocked = isStageUnlocked(stageNumber);
    
    if (completion === 100) return 'completed';
    if (stageNumber === currentStage) return 'current';
    if (isUnlocked) return 'available';
    return 'locked';
  };

  return (
    <div className="gps101-stage-map">
      <div className="stage-map-header">
        <h2>Your GPS 101 Journey</h2>
        <p className="stage-map-subtitle">
          Progress through 5 stages to discover your life purpose
        </p>
      </div>

      <div className="stages-container">
        {stages.map((stage, index) => {
          const stageNumber = index + 1;
          const status = getStageStatus(stageNumber);
          const completion = getStageCompletionPercentage(stageNumber);
          const isUnlocked = isStageUnlocked(stageNumber);
          const isCurrent = stageNumber === currentStage;

          return (
            <React.Fragment key={stage.stageId}>
              {/* Stage Card */}
              <div
                className={`stage-card ${status} ${isCurrent ? 'current' : ''} ${!isUnlocked ? 'locked' : ''}`}
                onClick={() => handleStageClick(stageNumber)}
                role="button"
                tabIndex={isUnlocked ? 0 : -1}
                aria-label={`Stage ${stageNumber}: ${stage.title}`}
              >
                {/* Stage Number Badge */}
                <div className="stage-number-badge">
                  <span className="stage-number">{stageNumber}</span>
                </div>

                {/* Stage Status Icon */}
                <div className={`stage-status-icon ${status}`}>
                  {status === 'completed' && <span className="status-icon">✓</span>}
                  {status === 'current' && <span className="status-icon">→</span>}
                  {status === 'available' && <span className="status-icon">○</span>}
                  {status === 'locked' && <span className="status-icon">🔒</span>}
                </div>

                {/* Stage Content */}
                <div className="stage-content">
                  <h3 className="stage-title">{stage.title}</h3>
                  <p className="stage-question">{stage.question}</p>
                  
                  {/* Progress Bar */}
                  {isUnlocked && (
                    <div className="stage-progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${completion}%` }}
                      />
                      <span className="progress-text">{completion}%</span>
                    </div>
                  )}

                  {/* Stage Info */}
                  <div className="stage-info">
                    <span className="info-item">
                      <span className="info-icon">🎯</span>
                      <span className="info-text">{stage.missions?.length || 6} missions</span>
                    </span>
                    <span className="info-item">
                      <span className="info-icon">⏱️</span>
                      <span className="info-text">3 weeks</span>
                    </span>
                  </div>

                  {/* Current Stage Badge */}
                  {isCurrent && (
                    <div className="current-stage-badge">
                      Current Stage
                    </div>
                  )}

                  {/* Locked Message */}
                  {!isUnlocked && (
                    <div className="locked-message">
                      Complete Stage {stageNumber - 1}
                    </div>
                  )}
                </div>

                {/* Deliverable Icon */}
                <div className="stage-deliverable-icon">
                  {stageNumber === 1 && '🪪'}
                  {stageNumber === 2 && '🧩'}
                  {stageNumber === 3 && '💝'}
                  {stageNumber === 4 && '✨'}
                  {stageNumber === 5 && '🚀'}
                </div>
              </div>

              {/* Connector Line */}
              {index < stages.length - 1 && (
                <div className={`stage-connector ${status === 'completed' ? 'completed' : ''}`}>
                  <div className="connector-line" />
                  <div className="connector-arrow">→</div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Legend */}
      <div className="stage-map-legend">
        <div className="legend-item">
          <span className="legend-icon completed">✓</span>
          <span className="legend-text">Completed</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon current">→</span>
          <span className="legend-text">Current</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon available">○</span>
          <span className="legend-text">Available</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon locked">🔒</span>
          <span className="legend-text">Locked</span>
        </div>
      </div>
    </div>
  );
};

export default GPS101StageMap;