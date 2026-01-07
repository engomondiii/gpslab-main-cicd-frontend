/**
 * GPS Lab Platform - CheckpointArena Component
 * 
 * Main checkpoint evaluation arena with cinematic presentation.
 * Displays rubric, evaluation panel, and manages the evaluation flow.
 * 
 * @module components/checkpoint/CheckpointArena/CheckpointArena
 */

import React, { useState, useCallback, useEffect } from 'react';
import CheckpointHeader from './CheckpointHeader';
import './CheckpointArena.css';

/**
 * Arena phases
 */
const ARENA_PHASES = {
  INTRO: 'intro',
  RUBRIC_REVIEW: 'rubric_review',
  EVALUATION: 'evaluation',
  SUBMITTING: 'submitting',
  RESULTS: 'results'
};

/**
 * Default checkpoint data
 */
const DEFAULT_CHECKPOINT = {
  id: '',
  title: 'Checkpoint Evaluation',
  description: '',
  stage: 1,
  passingScore: 70,
  timeLimit: 0, // 0 means no time limit
  rubric: [],
  instructions: [],
  tips: []
};

/**
 * CheckpointArena Component
 */
const CheckpointArena = ({
  checkpoint = DEFAULT_CHECKPOINT,
  mission,
  user,
  onBack,
  onSubmit,
  onComplete,
  children,
  className = '',
  ...props
}) => {
  // State management
  const [phase, setPhase] = useState(ARENA_PHASES.INTRO);
  const [status, setStatus] = useState('not_started');
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(checkpoint.timeLimit || 0);
  const [scores, setScores] = useState({});
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showIntroAnimation, setShowIntroAnimation] = useState(true);
  
  // Calculate if user can submit
  const canSubmit = phase === ARENA_PHASES.EVALUATION && 
    Object.keys(scores).length === (checkpoint.rubric?.length || 0);
  
  // Calculate total score
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const maxScore = (checkpoint.rubric?.length || 0) * 4; // Assuming max 4 points per criteria
  const scorePercentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  
  // Initialize timer
  useEffect(() => {
    if (checkpoint.timeLimit > 0) {
      setTimeRemaining(checkpoint.timeLimit);
    }
  }, [checkpoint.timeLimit]);
  
  // Intro animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntroAnimation(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Timer countdown
  useEffect(() => {
    if (status !== 'in_progress' || isPaused || timeRemaining <= 0 || checkpoint.timeLimit === 0) {
      return;
    }
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up - auto submit
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [status, isPaused, timeRemaining, checkpoint.timeLimit]);
  
  // Start evaluation
  const handleStart = useCallback(() => {
    setPhase(ARENA_PHASES.RUBRIC_REVIEW);
    setStatus('in_progress');
  }, []);
  
  // Proceed to evaluation after rubric review
  const handleProceedToEvaluation = useCallback(() => {
    setPhase(ARENA_PHASES.EVALUATION);
  }, []);
  
  // Handle score change
  const handleScoreChange = useCallback((criteriaId, score) => {
    setScores(prev => ({
      ...prev,
      [criteriaId]: score
    }));
  }, []);
  
  // Handle notes change
  const handleNotesChange = useCallback((value) => {
    setNotes(value);
  }, []);
  
  // Pause evaluation
  const handlePause = useCallback(() => {
    setIsPaused(true);
  }, []);
  
  // Resume evaluation
  const handleResume = useCallback(() => {
    setIsPaused(false);
  }, []);
  
  // Submit evaluation
  const handleSubmit = useCallback(async () => {
    if (!canSubmit && phase === ARENA_PHASES.EVALUATION) return;
    
    setIsLoading(true);
    setPhase(ARENA_PHASES.SUBMITTING);
    setStatus('submitted');
    
    const evaluationData = {
      checkpointId: checkpoint.id,
      scores,
      totalScore,
      scorePercentage,
      notes,
      timeSpent: checkpoint.timeLimit - timeRemaining,
      submittedAt: new Date().toISOString()
    };
    
    try {
      if (onSubmit) {
        await onSubmit(evaluationData);
      }
      
      // Simulate evaluation processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Determine pass/fail
      const passed = scorePercentage >= checkpoint.passingScore;
      setStatus(passed ? 'passed' : 'failed');
      setPhase(ARENA_PHASES.RESULTS);
      
      if (onComplete) {
        onComplete({
          ...evaluationData,
          passed,
          passingScore: checkpoint.passingScore
        });
      }
    } catch (error) {
      console.error('Evaluation submission error:', error);
      setStatus('in_progress');
      setPhase(ARENA_PHASES.EVALUATION);
    } finally {
      setIsLoading(false);
    }
  }, [canSubmit, phase, checkpoint, scores, totalScore, scorePercentage, notes, timeRemaining, onSubmit, onComplete]);
  
  // Handle back navigation
  const handleBack = useCallback(() => {
    if (phase === ARENA_PHASES.INTRO && onBack) {
      onBack();
    } else if (phase === ARENA_PHASES.RUBRIC_REVIEW) {
      setPhase(ARENA_PHASES.INTRO);
      setStatus('not_started');
    } else if (phase === ARENA_PHASES.EVALUATION) {
      // Confirm before going back during evaluation
      if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
        if (onBack) onBack();
      }
    } else if (onBack) {
      onBack();
    }
  }, [phase, onBack]);
  
  const classNames = [
    'checkpoint-arena',
    `checkpoint-arena--${phase}`,
    `checkpoint-arena--${status}`,
    showIntroAnimation && 'checkpoint-arena--animating',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <CheckpointHeader
        checkpoint={checkpoint}
        mission={mission}
        stage={checkpoint.stage}
        status={status}
        timeLimit={checkpoint.timeLimit}
        timeRemaining={timeRemaining}
        onBack={handleBack}
        onPause={handlePause}
        onResume={handleResume}
        onSubmit={handleSubmit}
        isPaused={isPaused}
        canSubmit={canSubmit}
      />
      
      {/* Main Content */}
      <main className="checkpoint-arena__main">
        {/* Intro Phase */}
        {phase === ARENA_PHASES.INTRO && (
          <div className="checkpoint-arena__intro">
            <div className="checkpoint-arena__intro-content">
              {/* Cinematic Animation */}
              <div className="checkpoint-arena__intro-visual">
                <div className="checkpoint-arena__intro-icon">
                  <svg viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                    <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
                    <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="2" opacity="0.7"/>
                    <path d="M50 20L50 50L70 70" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    <circle cx="50" cy="50" r="8" fill="currentColor"/>
                  </svg>
                </div>
                <div className="checkpoint-arena__intro-particles">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="checkpoint-arena__particle" style={{ '--delay': `${i * 0.1}s` }}/>
                  ))}
                </div>
              </div>
              
              <h2 className="checkpoint-arena__intro-title">
                Checkpoint Arena
              </h2>
              <p className="checkpoint-arena__intro-subtitle">
                Stage {checkpoint.stage} Evaluation
              </p>
              
              <div className="checkpoint-arena__intro-info">
                <div className="checkpoint-arena__intro-stat">
                  <span className="checkpoint-arena__intro-stat-value">
                    {checkpoint.rubric?.length || 0}
                  </span>
                  <span className="checkpoint-arena__intro-stat-label">Criteria</span>
                </div>
                <div className="checkpoint-arena__intro-stat">
                  <span className="checkpoint-arena__intro-stat-value">
                    {checkpoint.passingScore}%
                  </span>
                  <span className="checkpoint-arena__intro-stat-label">To Pass</span>
                </div>
                {checkpoint.timeLimit > 0 && (
                  <div className="checkpoint-arena__intro-stat">
                    <span className="checkpoint-arena__intro-stat-value">
                      {Math.floor(checkpoint.timeLimit / 60)}min
                    </span>
                    <span className="checkpoint-arena__intro-stat-label">Time Limit</span>
                  </div>
                )}
              </div>
              
              <p className="checkpoint-arena__intro-description">
                {checkpoint.description || 'Demonstrate your mastery of the skills learned in this stage.'}
              </p>
              
              {checkpoint.instructions?.length > 0 && (
                <div className="checkpoint-arena__intro-instructions">
                  <h3>Instructions</h3>
                  <ul>
                    {checkpoint.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <button
                type="button"
                onClick={handleStart}
                className="checkpoint-arena__start-btn"
              >
                <span>Enter Arena</span>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Rubric Review Phase */}
        {phase === ARENA_PHASES.RUBRIC_REVIEW && (
          <div className="checkpoint-arena__rubric-review">
            <div className="checkpoint-arena__rubric-review-content">
              <h2 className="checkpoint-arena__section-title">
                Review Evaluation Criteria
              </h2>
              <p className="checkpoint-arena__section-subtitle">
                Familiarize yourself with how you'll be evaluated before proceeding.
              </p>
              
              <div className="checkpoint-arena__rubric-preview">
                {checkpoint.rubric?.map((criteria, index) => (
                  <div key={criteria.id || index} className="checkpoint-arena__rubric-preview-item">
                    <div className="checkpoint-arena__rubric-preview-header">
                      <span className="checkpoint-arena__rubric-preview-number">{index + 1}</span>
                      <span className="checkpoint-arena__rubric-preview-title">{criteria.title}</span>
                      <span className="checkpoint-arena__rubric-preview-weight">
                        {criteria.weight || 25}%
                      </span>
                    </div>
                    <p className="checkpoint-arena__rubric-preview-description">
                      {criteria.description}
                    </p>
                  </div>
                ))}
              </div>
              
              {checkpoint.tips?.length > 0 && (
                <div className="checkpoint-arena__tips">
                  <h3>
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                    </svg>
                    Tips for Success
                  </h3>
                  <ul>
                    {checkpoint.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <button
                type="button"
                onClick={handleProceedToEvaluation}
                className="checkpoint-arena__proceed-btn"
              >
                <span>Begin Evaluation</span>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Evaluation Phase */}
        {phase === ARENA_PHASES.EVALUATION && (
          <div className="checkpoint-arena__evaluation">
            {/* Pass children for custom evaluation content */}
            {children ? (
              React.Children.map(children, child => 
                React.isValidElement(child) 
                  ? React.cloneElement(child, {
                      checkpoint,
                      scores,
                      onScoreChange: handleScoreChange,
                      notes,
                      onNotesChange: handleNotesChange,
                      isPaused
                    })
                  : child
              )
            ) : (
              <div className="checkpoint-arena__evaluation-placeholder">
                <p>Evaluation content will be rendered here.</p>
              </div>
            )}
            
            {/* Progress Indicator */}
            <div className="checkpoint-arena__evaluation-progress">
              <div className="checkpoint-arena__evaluation-progress-bar">
                <div 
                  className="checkpoint-arena__evaluation-progress-fill"
                  style={{ 
                    width: `${(Object.keys(scores).length / (checkpoint.rubric?.length || 1)) * 100}%` 
                  }}
                />
              </div>
              <span className="checkpoint-arena__evaluation-progress-text">
                {Object.keys(scores).length} of {checkpoint.rubric?.length || 0} criteria evaluated
              </span>
            </div>
          </div>
        )}
        
        {/* Submitting Phase */}
        {phase === ARENA_PHASES.SUBMITTING && (
          <div className="checkpoint-arena__submitting">
            <div className="checkpoint-arena__submitting-content">
              <div className="checkpoint-arena__submitting-spinner">
                <svg viewBox="0 0 50 50">
                  <circle cx="25" cy="25" r="20" fill="none" strokeWidth="4" stroke="currentColor" strokeLinecap="round"/>
                </svg>
              </div>
              <h2>Processing Evaluation</h2>
              <p>Please wait while your submission is being evaluated...</p>
            </div>
          </div>
        )}
        
        {/* Results Phase */}
        {phase === ARENA_PHASES.RESULTS && (
          <div className="checkpoint-arena__results">
            {/* Results content - will be rendered by parent or CheckpointResultsScreen */}
            {children}
          </div>
        )}
      </main>
      
      {/* Overlay when paused */}
      {isPaused && status === 'in_progress' && (
        <div className="checkpoint-arena__pause-overlay">
          <div className="checkpoint-arena__pause-content">
            <div className="checkpoint-arena__pause-icon">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
            </div>
            <h2>Evaluation Paused</h2>
            <p>Your progress has been saved. Resume when you're ready.</p>
            <button
              type="button"
              onClick={handleResume}
              className="checkpoint-arena__resume-btn"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
              </svg>
              Resume Evaluation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export { ARENA_PHASES };
export default CheckpointArena;