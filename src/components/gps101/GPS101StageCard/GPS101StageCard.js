/**
 * GPS 101 Stage Card Component
 * 
 * CORRECTED STRUCTURE:
 * - Each stage has 1 mission (not 6)
 * - Each mission has 6 sub-missions
 * - Each sub-mission has 5 checkpoints
 * 
 * Individual stage card with details and progress display.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GPS_101_CONFIG } from '../../../config/gps101.config';
import './GPS101StageCard.css';

const GPS101StageCard = ({ 
  stageNumber, 
  completion, 
  isUnlocked, 
  isCompleted,
  deliverableStatus 
}) => {
  const navigate = useNavigate();

  const stage = GPS_101_CONFIG?.STAGES?.find(s => s.stageNumber === stageNumber);

  const handleClick = () => {
    if (isUnlocked) {
      navigate(`/gps101/stage/${stageNumber}`);
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

  const getStageIcon = (num) => {
    const icons = {
      1: '🪪', // Identity
      2: '🧩', // Problem
      3: '💝', // Story
      4: '✨', // Purpose
      5: '🚀'  // Project
    };
    return icons[num] || '📍';
  };

  if (!stage) return null;

  return (
    <div 
      className={`gps101-stage-card ${getStatusClass()}`}
      onClick={handleClick}
      role="button"
      tabIndex={isUnlocked ? 0 : -1}
      aria-label={`Stage ${stageNumber}: ${stage.question}`}
    >
      {/* Stage Header */}
      <div className="stage-card-header">
        <div className="stage-badge">
          <span className="stage-number">{stageNumber}</span>
          <span className="status-icon">{getStatusIcon()}</span>
        </div>
        <div className="stage-duration">{stage.duration}</div>
      </div>

      {/* Stage Content */}
      <div className="stage-card-content">
        <h3 className="stage-question">{stage.question}</h3>
        
        <div className="stage-outcome">
          <span className="outcome-label">Expected Outcome</span>
          <p className="outcome-text">{stage.expectedOutcome}</p>
        </div>

        {/* Progress Section */}
        {isUnlocked && (
          <div className="stage-progress-section">
            <div className="progress-info">
              <span className="progress-label">Mission Progress</span>
              <span className="progress-value">{completion}%</span>
            </div>
            
            <div className="progress-bar-wrapper">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>

            {/* Stage Stats */}
            <div className="stage-stats">
              <div className="stat-item">
                <span className="stat-icon">🎯</span>
                <span className="stat-text">1 Mission</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">📝</span>
                <span className="stat-text">6 Sub-missions</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">✓</span>
                <span className="stat-text">30 Checkpoints</span>
              </div>
            </div>
          </div>
        )}

        {/* Deliverable Status */}
        {isUnlocked && (
          <div className="deliverable-status">
            <div className="deliverable-icon">
              {getStageIcon(stageNumber)}
            </div>
            <div className="deliverable-info">
              <span className="deliverable-label">Deliverable</span>
              <span className="deliverable-name">{stage.deliverable}</span>
              <span className={`deliverable-state ${deliverableStatus || 'not-started'}`}>
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