/**
 * GPS 101 Checkpoint Card Component
 * 
 * Individual checkpoint card with question and status.
 * 
 * FIXED: Navigation path now uses /gps101 (no dash)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  formatCheckpointType,
  formatCheckpointRequirements 
} from '../../../utils/formatters/gps101.formatter';
import './GPS101CheckpointCard.css';

const GPS101CheckpointCard = ({ 
  checkpoint, 
  status = 'locked',
  score,
  isUnlocked = false,
  order 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isUnlocked) {
      // FIXED: Navigate to /gps101 (no dash)
      navigate(`/gps101/checkpoint/${checkpoint.checkpointId}`);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'passed':
        return '✓';
      case 'failed':
        return '✗';
      case 'submitted':
        return '⏳';
      case 'in-progress':
        return '✏️';
      case 'available':
        return '→';
      default:
        return '🔒';
    }
  };

  const getStatusClass = () => {
    switch (status) {
      case 'passed':
        return 'status-passed';
      case 'failed':
        return 'status-failed';
      case 'submitted':
        return 'status-submitted';
      case 'in-progress':
        return 'status-progress';
      case 'available':
        return 'status-available';
      default:
        return 'status-locked';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'passed':
        return `Passed (${score}%)`;
      case 'failed':
        return `Failed (${score}%)`;
      case 'submitted':
        return 'Under Review';
      case 'in-progress':
        return 'In Progress';
      case 'available':
        return 'Ready to Start';
      default:
        return 'Locked';
    }
  };

  return (
    <div 
      className={`gps101-checkpoint-card ${getStatusClass()} ${!isUnlocked ? 'locked' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={isUnlocked ? 0 : -1}
    >
      {/* Checkpoint Number Badge */}
      <div className="checkpoint-number-badge">
        <span className="checkpoint-number">{order}</span>
      </div>

      {/* Status Badge */}
      <div className={`checkpoint-status ${getStatusClass()}`}>
        <span className="status-icon">{getStatusIcon()}</span>
        <span className="status-text">{getStatusText()}</span>
      </div>

      {/* Content */}
      <div className="checkpoint-card-content">
        <div className="checkpoint-type-badge">
          {formatCheckpointType(checkpoint.type)}
        </div>

        <h4 className="checkpoint-question">
          {checkpoint.question}
        </h4>

        {/* Requirements */}
        {isUnlocked && (
          <div className="checkpoint-requirements">
            <div className="requirements-icon">ℹ️</div>
            <p className="requirements-text">
              {formatCheckpointRequirements(checkpoint)}
            </p>
          </div>
        )}

        {/* Special indicators */}
        <div className="checkpoint-indicators">
          {checkpoint.requiresUpload && (
            <div className="indicator-badge" title="File upload required">
              <span className="indicator-icon">📎</span>
              <span className="indicator-text">Upload</span>
            </div>
          )}
          {checkpoint.requiresVideo && (
            <div className="indicator-badge" title="Video submission required">
              <span className="indicator-icon">🎥</span>
              <span className="indicator-text">Video</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      {isUnlocked && (
        <div className="checkpoint-card-footer">
          <button className="checkpoint-action-button">
            {status === 'passed' ? 'Review' : 
             status === 'failed' ? 'Retry' : 
             status === 'in-progress' ? 'Continue' : 
             'Start'}
          </button>
        </div>
      )}

      {!isUnlocked && (
        <div className="locked-overlay">
          <span className="lock-icon">🔒</span>
          <span className="lock-text">Complete previous checkpoint</span>
        </div>
      )}
    </div>
  );
};

export default GPS101CheckpointCard;