/**
 * GPS Lab Platform - CheckpointFailScreen Component
 * 
 * Encouraging screen shown when user fails a checkpoint.
 * Provides feedback, study recommendations, and retry options.
 * 
 * @module components/checkpoint/CheckpointResults/CheckpointFailScreen
 */

import React, { useEffect, useState } from 'react';
import './CheckpointFailScreen.css';

/**
 * Encouraging messages
 */
const ENCOURAGEMENT_MESSAGES = [
  "Every master was once a disaster. Keep going!",
  "Failure is just feedback in disguise.",
  "You're one step closer to mastery.",
  "The only real failure is not trying again.",
  "Champions are made in the training room."
];

/**
 * CheckpointFailScreen Component
 */
const CheckpointFailScreen = ({
  checkpoint,
  score,
  maxScore,
  percentage,
  passingScore = 70,
  weakAreas = [],
  studyRecommendations = [],
  retryOptions = {},
  onRetry,
  onStudy,
  onViewDetails,
  onExit,
  className = '',
  ...props
}) => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [encouragement] = useState(
    ENCOURAGEMENT_MESSAGES[Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)]
  );
  
  // Trigger animations sequentially
  useEffect(() => {
    const phases = [
      { delay: 100, phase: 1 },
      { delay: 500, phase: 2 },
      { delay: 900, phase: 3 },
      { delay: 1300, phase: 4 },
    ];
    
    phases.forEach(({ delay, phase }) => {
      setTimeout(() => setAnimationPhase(phase), delay);
    });
  }, []);
  
  const pointsNeeded = Math.ceil((passingScore / 100) * maxScore) - score;
  const hasR2R = retryOptions.r2r > 0;
  const hasPR2R = retryOptions.pr2r > 0;
  
  const classNames = [
    'checkpoint-fail-screen',
    `checkpoint-fail-screen--phase-${animationPhase}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      <div className="checkpoint-fail-screen__content">
        {/* Icon */}
        <div className="checkpoint-fail-screen__icon">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        
        {/* Title */}
        <h1 className="checkpoint-fail-screen__title">
          Not Quite Yet
        </h1>
        
        <p className="checkpoint-fail-screen__subtitle">
          {encouragement}
        </p>
        
        {/* Score Display */}
        <div className="checkpoint-fail-screen__score">
          <div className="checkpoint-fail-screen__score-visual">
            <div className="checkpoint-fail-screen__score-bar">
              <div 
                className="checkpoint-fail-screen__score-fill"
                style={{ width: `${percentage}%` }}
              />
              <div 
                className="checkpoint-fail-screen__score-target"
                style={{ left: `${passingScore}%` }}
              >
                <span className="checkpoint-fail-screen__score-target-label">
                  {passingScore}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="checkpoint-fail-screen__score-details">
            <div className="checkpoint-fail-screen__score-item">
              <span className="checkpoint-fail-screen__score-label">Your Score</span>
              <span className="checkpoint-fail-screen__score-value checkpoint-fail-screen__score-value--current">
                {percentage}%
              </span>
            </div>
            <div className="checkpoint-fail-screen__score-item">
              <span className="checkpoint-fail-screen__score-label">Passing Score</span>
              <span className="checkpoint-fail-screen__score-value">
                {passingScore}%
              </span>
            </div>
            <div className="checkpoint-fail-screen__score-item">
              <span className="checkpoint-fail-screen__score-label">Points Needed</span>
              <span className="checkpoint-fail-screen__score-value checkpoint-fail-screen__score-value--needed">
                +{pointsNeeded > 0 ? pointsNeeded : 0}
              </span>
            </div>
          </div>
        </div>
        
        {/* Weak Areas */}
        {weakAreas.length > 0 && (
          <div className="checkpoint-fail-screen__weak-areas">
            <h3 className="checkpoint-fail-screen__section-title">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
              Areas to Improve
            </h3>
            <ul className="checkpoint-fail-screen__weak-list">
              {weakAreas.map((area, index) => (
                <li key={index} className="checkpoint-fail-screen__weak-item">
                  {area.title}
                  {area.score && (
                    <span className="checkpoint-fail-screen__weak-score">
                      {area.score}/4
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Study Recommendations */}
        {studyRecommendations.length > 0 && (
          <div className="checkpoint-fail-screen__recommendations">
            <h3 className="checkpoint-fail-screen__section-title">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
              </svg>
              Recommended Study
            </h3>
            <div className="checkpoint-fail-screen__study-list">
              {studyRecommendations.map((rec, index) => (
                <button
                  key={index}
                  type="button"
                  className="checkpoint-fail-screen__study-item"
                  onClick={() => onStudy && onStudy(rec)}
                >
                  <span className="checkpoint-fail-screen__study-title">{rec.title}</span>
                  <span className="checkpoint-fail-screen__study-type">{rec.type}</span>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Retry Options */}
        <div className="checkpoint-fail-screen__retry-options">
          {hasR2R && (
            <div className="checkpoint-fail-screen__retry-badge">
              <span className="checkpoint-fail-screen__retry-icon">🔄</span>
              <span className="checkpoint-fail-screen__retry-count">{retryOptions.r2r}</span>
              <span className="checkpoint-fail-screen__retry-label">R2R Available</span>
            </div>
          )}
          {hasPR2R && (
            <div className="checkpoint-fail-screen__retry-badge checkpoint-fail-screen__retry-badge--pr2r">
              <span className="checkpoint-fail-screen__retry-icon">🎫</span>
              <span className="checkpoint-fail-screen__retry-count">{retryOptions.pr2r}</span>
              <span className="checkpoint-fail-screen__retry-label">pR2R Available</span>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="checkpoint-fail-screen__actions">
          {(hasR2R || hasPR2R) && (
            <button
              type="button"
              onClick={onRetry}
              className="checkpoint-fail-screen__btn checkpoint-fail-screen__btn--primary"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
              </svg>
              Try Again
            </button>
          )}
          
          {studyRecommendations.length > 0 && (
            <button
              type="button"
              onClick={() => onStudy && onStudy(studyRecommendations[0])}
              className="checkpoint-fail-screen__btn checkpoint-fail-screen__btn--secondary"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
              </svg>
              Study First
            </button>
          )}
          
          <button
            type="button"
            onClick={onViewDetails}
            className="checkpoint-fail-screen__btn checkpoint-fail-screen__btn--tertiary"
          >
            View Detailed Feedback
          </button>
          
          <button
            type="button"
            onClick={onExit}
            className="checkpoint-fail-screen__btn checkpoint-fail-screen__btn--ghost"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckpointFailScreen;