/**
 * GPS 101 Stage Card Component
 * 
 * Individual stage card with details and progress.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  formatStageTitle, 
  formatStageQuestion, 
  formatStageOutcome,
  formatStageDuration 
} from '../../../utils/formatters/gps101.formatter';
import './GPS101StageCard.css';

const GPS101StageCard = ({ 
  stageNumber, 
  completion, 
  isUnlocked, 
  isCompleted,
  missionsCompleted,
  totalMissions = 6,
  deliverableStatus 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isUnlocked) {
      navigate(`/gps-101/stage/${stageNumber}`);
    }
  };

  const getStatusClass = () => {
    if (isCompleted) return 'completed';
    if (completion > 0) return 'in-progress';
    if (isUnlocked) return 'unlocked';
    return 'locked';
  };

  const getStatusIcon = () => {
    if (isCompleted) return '✓';
    if (!isUnlocked) return '🔒';
    return '→';
  };

  return (
    <div 
      className={`gps101-stage-card ${getStatusClass()}`}
      onClick={handleClick}
      role="button"
      tabIndex={isUnlocked ? 0 : -1}
    >
      {/* Stage Header */}
      <div className="stage-card-header">
        <div className="stage-badge">
          <span className="stage-number">{stageNumber}</span>
          <span className="status-icon">{getStatusIcon()}</span>
        </div>
        <div className="stage-duration">
          {formatStageDuration(stageNumber)}
        </div>
      </div>

      {/* Stage Content */}
      <div className="stage-card-content">
        <h3 className="stage-question">
          {formatStageQuestion(stageNumber)}
        </h3>
        
        <div className="stage-outcome">
          <span className="outcome-label">Expected Outcome:</span>
          <p className="outcome-text">{formatStageOutcome(stageNumber)}</p>
        </div>

        {/* Progress Section */}
        {isUnlocked && (
          <div className="stage-progress-section">
            <div className="progress-info">
              <span className="progress-label">Missions</span>
              <span className="progress-value">{missionsCompleted}/{totalMissions}</span>
            </div>
            
            <div className="progress-bar-wrapper">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${completion}%` }}
                />
              </div>
              <span className="progress-percentage">{completion}%</span>
            </div>
          </div>
        )}

        {/* Deliverable Status */}
        {isUnlocked && (
          <div className="deliverable-status">
            <div className="deliverable-icon">
              {deliverableStatus === 'completed' ? '📄' : '📝'}
            </div>
            <div className="deliverable-info">
              <span className="deliverable-label">Deliverable</span>
              <span className={`deliverable-state ${deliverableStatus}`}>
                {deliverableStatus === 'completed' ? 'Submitted' : 
                 deliverableStatus === 'draft' ? 'Draft Saved' : 
                 'Not Started'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Stage Footer */}
      <div className="stage-card-footer">
        {isCompleted && (
          <div className="completion-badge">
            <span className="badge-icon">🏆</span>
            <span className="badge-text">Stage Completed</span>
          </div>
        )}
        
        {!isUnlocked && (
          <div className="locked-message">
            Complete previous stage to unlock
          </div>
        )}
        
        {isUnlocked && !isCompleted && (
          <button className="continue-button">
            {completion > 0 ? 'Continue Stage' : 'Start Stage'}
          </button>
        )}
      </div>
    </div>
  );
};

export default GPS101StageCard;