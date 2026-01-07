/**
 * GPS Lab Platform - CheckpointScoreCard Component
 * 
 * Displays individual score card for a criteria in the evaluation.
 * Shows score, label, and visual indicator.
 * 
 * @module components/checkpoint/CheckpointEvaluation/CheckpointScoreCard
 */

import React from 'react';
import './CheckpointScoreCard.css';

/**
 * Score level configurations
 */
const SCORE_CONFIGS = {
  1: { label: 'Needs Work', color: '#E74C3C', icon: '⚠️' },
  2: { label: 'Developing', color: '#F1C40F', icon: '📈' },
  3: { label: 'Proficient', color: '#00D4FF', icon: '✓' },
  4: { label: 'Exemplary', color: '#2A9D8F', icon: '★' }
};

/**
 * CheckpointScoreCard Component
 */
const CheckpointScoreCard = ({
  title,
  score,
  maxScore = 4,
  weight,
  description,
  feedback,
  showDetails = true,
  compact = false,
  className = '',
  ...props
}) => {
  const scoreConfig = SCORE_CONFIGS[score] || { label: 'Not Scored', color: 'var(--neutral-500)', icon: '?' };
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  
  const classNames = [
    'checkpoint-score-card',
    compact && 'checkpoint-score-card--compact',
    score && 'checkpoint-score-card--scored',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div 
      className={classNames} 
      style={{ '--score-color': scoreConfig.color }}
      {...props}
    >
      <div className="checkpoint-score-card__header">
        <h4 className="checkpoint-score-card__title">{title}</h4>
        {weight && (
          <span className="checkpoint-score-card__weight">{weight}%</span>
        )}
      </div>
      
      <div className="checkpoint-score-card__score-section">
        <div className="checkpoint-score-card__score-display">
          <span className="checkpoint-score-card__score-value">{score || '-'}</span>
          <span className="checkpoint-score-card__score-max">/ {maxScore}</span>
        </div>
        
        <div className="checkpoint-score-card__score-bar">
          <div 
            className="checkpoint-score-card__score-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <span className="checkpoint-score-card__score-label">
          {scoreConfig.label}
        </span>
      </div>
      
      {showDetails && (description || feedback) && (
        <div className="checkpoint-score-card__details">
          {description && (
            <p className="checkpoint-score-card__description">{description}</p>
          )}
          {feedback && (
            <div className="checkpoint-score-card__feedback">
              <span className="checkpoint-score-card__feedback-label">Feedback:</span>
              <p className="checkpoint-score-card__feedback-text">{feedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckpointScoreCard;