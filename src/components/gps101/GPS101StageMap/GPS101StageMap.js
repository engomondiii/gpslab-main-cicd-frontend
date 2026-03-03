/**
 * GPS 101 Stage Map Component
 * 
 * Visual map showing all 5 GPS 101 stages with progress.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import useGPS101 from '../../../hooks/useGPS101';
import { formatStageTitle, formatProgressPercentage } from '../../../utils/formatters/gps101.formatter';
import './GPS101StageMap.css';

const GPS101StageMap = () => {
  const navigate = useNavigate();
  const {
    progress,
    isStageUnlocked,
    getStageCompletionPercentage,
    getCurrentStageData
  } = useGPS101();

  const stages = [1, 2, 3, 4, 5];

  const handleStageClick = (stageNumber) => {
    if (isStageUnlocked(stageNumber)) {
      navigate(`/gps-101/stage/${stageNumber}`);
    }
  };

  const getStageStatus = (stageNumber) => {
    const completion = getStageCompletionPercentage(stageNumber);
    
    if (completion === 100) return 'completed';
    if (completion > 0) return 'in-progress';
    if (isStageUnlocked(stageNumber)) return 'unlocked';
    return 'locked';
  };

  return (
    <div className="gps101-stage-map">
      <div className="stage-map-header">
        <h2>GPS 101 Journey Map</h2>
        <p className="journey-subtitle">Your 15-Week Path to Discovering Life Purpose</p>
      </div>

      <div className="stage-map-container">
        <div className="journey-path">
          {stages.map((stageNumber, index) => {
            const stageData = getCurrentStageData();
            const status = getStageStatus(stageNumber);
            const completion = getStageCompletionPercentage(stageNumber);
            const isUnlocked = isStageUnlocked(stageNumber);

            return (
              <React.Fragment key={stageNumber}>
                {/* Stage Node */}
                <div
                  className={`stage-node ${status} ${!isUnlocked ? 'locked' : ''}`}
                  onClick={() => handleStageClick(stageNumber)}
                  role="button"
                  tabIndex={isUnlocked ? 0 : -1}
                  aria-label={`Stage ${stageNumber}: ${formatStageTitle(stageNumber)}`}
                >
                  <div className="stage-icon-wrapper">
                    <div className="stage-number">{stageNumber}</div>
                    {status === 'completed' && (
                      <div className="completion-badge">✓</div>
                    )}
                    {status === 'locked' && (
                      <div className="lock-icon">🔒</div>
                    )}
                  </div>

                  <div className="stage-info">
                    <h3 className="stage-title">
                      Stage {stageNumber}
                    </h3>
                    <p className="stage-question">
                      {stageNumber === 1 && "Who are you?"}
                      {stageNumber === 2 && "What is the meaning of your life?"}
                      {stageNumber === 3 && "Tell a story of problem owners"}
                      {stageNumber === 4 && "What is your life purpose?"}
                      {stageNumber === 5 && "What is your Purpose-driven Major?"}
                    </p>
                    
                    {isUnlocked && (
                      <div className="stage-progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${completion}%` }}
                        />
                      </div>
                    )}
                    
                    <p className="stage-completion">
                      {isUnlocked ? `${completion}% Complete` : 'Locked'}
                    </p>
                  </div>
                </div>

                {/* Connector Line */}
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

      {/* Overall Progress Summary */}
      <div className="journey-summary">
        <div className="summary-stat">
          <span className="stat-label">Stages Completed</span>
          <span className="stat-value">{progress.completedStages}/5</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Missions Completed</span>
          <span className="stat-value">{progress.completedMissions}/30</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Overall Progress</span>
          <span className="stat-value">{progress.overallProgress}%</span>
        </div>
      </div>
    </div>
  );
};

export default GPS101StageMap;