/**
 * GPS Lab Platform - CheckpointPassScreen Component
 * 
 * Celebratory screen shown when user passes a checkpoint.
 * Includes animations, rewards summary, and next steps.
 * 
 * @module components/checkpoint/CheckpointResults/CheckpointPassScreen
 */

import React, { useEffect, useState } from 'react';
import './CheckpointPassScreen.css';

/**
 * CheckpointPassScreen Component
 */
const CheckpointPassScreen = ({
  checkpoint,
  score,
  maxScore,
  percentage,
  rewards = {},
  nextStage,
  onContinue,
  onViewDetails,
  onRetry,
  className = '',
  ...props
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  
  // Trigger animations sequentially
  useEffect(() => {
    const phases = [
      { delay: 100, phase: 1 },  // Show badge
      { delay: 600, phase: 2 },  // Show score
      { delay: 1100, phase: 3 }, // Show rewards
      { delay: 1600, phase: 4 }, // Show actions
    ];
    
    phases.forEach(({ delay, phase }) => {
      setTimeout(() => setAnimationPhase(phase), delay);
    });
    
    // Trigger confetti
    setTimeout(() => setShowConfetti(true), 300);
  }, []);
  
  const classNames = [
    'checkpoint-pass-screen',
    `checkpoint-pass-screen--phase-${animationPhase}`,
    showConfetti && 'checkpoint-pass-screen--confetti',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="checkpoint-pass-screen__confetti">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i} 
              className="checkpoint-pass-screen__confetti-piece"
              style={{
                '--delay': `${Math.random() * 2}s`,
                '--x': `${Math.random() * 100}%`,
                '--rotation': `${Math.random() * 360}deg`,
                '--color': ['#00D4FF', '#2A9D8F', '#F1C40F', '#FF6B6B', '#9B59B6'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
      )}
      
      <div className="checkpoint-pass-screen__content">
        {/* Success Badge */}
        <div className="checkpoint-pass-screen__badge">
          <div className="checkpoint-pass-screen__badge-glow" />
          <div className="checkpoint-pass-screen__badge-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        {/* Title */}
        <h1 className="checkpoint-pass-screen__title">
          Checkpoint Passed!
        </h1>
        
        <p className="checkpoint-pass-screen__subtitle">
          Congratulations! You've demonstrated mastery of Stage {checkpoint?.stage} skills.
        </p>
        
        {/* Score Display */}
        <div className="checkpoint-pass-screen__score">
          <div className="checkpoint-pass-screen__score-circle">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(42, 157, 143, 0.2)" strokeWidth="8"/>
              <circle 
                cx="60" cy="60" r="52" 
                fill="none" 
                stroke="var(--success, #2a9d8f)" 
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(percentage / 100) * 327} 327`}
                transform="rotate(-90 60 60)"
                className="checkpoint-pass-screen__score-ring"
              />
            </svg>
            <div className="checkpoint-pass-screen__score-value">
              <span className="checkpoint-pass-screen__score-number">{percentage}</span>
              <span className="checkpoint-pass-screen__score-percent">%</span>
            </div>
          </div>
          <div className="checkpoint-pass-screen__score-details">
            <span className="checkpoint-pass-screen__score-label">Your Score</span>
            <span className="checkpoint-pass-screen__score-points">{score} / {maxScore} points</span>
          </div>
        </div>
        
        {/* Rewards */}
        {Object.keys(rewards).length > 0 && (
          <div className="checkpoint-pass-screen__rewards">
            <h3 className="checkpoint-pass-screen__rewards-title">Rewards Earned</h3>
            <div className="checkpoint-pass-screen__rewards-grid">
              {rewards.xp && (
                <div className="checkpoint-pass-screen__reward">
                  <span className="checkpoint-pass-screen__reward-icon">⚡</span>
                  <span className="checkpoint-pass-screen__reward-value">+{rewards.xp}</span>
                  <span className="checkpoint-pass-screen__reward-label">XP</span>
                </div>
              )}
              {rewards.baraka && (
                <div className="checkpoint-pass-screen__reward">
                  <span className="checkpoint-pass-screen__reward-icon">💰</span>
                  <span className="checkpoint-pass-screen__reward-value">+{rewards.baraka}</span>
                  <span className="checkpoint-pass-screen__reward-label">Baraka</span>
                </div>
              )}
              {rewards.badge && (
                <div className="checkpoint-pass-screen__reward checkpoint-pass-screen__reward--badge">
                  <span className="checkpoint-pass-screen__reward-icon">🏆</span>
                  <span className="checkpoint-pass-screen__reward-value">{rewards.badge}</span>
                  <span className="checkpoint-pass-screen__reward-label">Badge Unlocked</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Next Stage Preview */}
        {nextStage && (
          <div className="checkpoint-pass-screen__next-stage">
            <span className="checkpoint-pass-screen__next-label">Next Challenge</span>
            <div className="checkpoint-pass-screen__next-card">
              <span className="checkpoint-pass-screen__next-stage-num">Stage {nextStage.number}</span>
              <span className="checkpoint-pass-screen__next-stage-title">{nextStage.title}</span>
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="checkpoint-pass-screen__actions">
          <button
            type="button"
            onClick={onContinue}
            className="checkpoint-pass-screen__btn checkpoint-pass-screen__btn--primary"
          >
            {nextStage ? 'Continue to Next Stage' : 'Return to Dashboard'}
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
          
          {onViewDetails && (
            <button
              type="button"
              onClick={onViewDetails}
              className="checkpoint-pass-screen__btn checkpoint-pass-screen__btn--secondary"
            >
              View Detailed Feedback
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckpointPassScreen;