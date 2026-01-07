/**
 * GPS Lab Platform - CheckpointEvaluationPanel Component
 * 
 * Main evaluation panel that combines rubric, scoring, and submission.
 * Used within CheckpointArena during the evaluation phase.
 * 
 * @module components/checkpoint/CheckpointEvaluation/CheckpointEvaluationPanel
 */

import React, { useState, useCallback, useMemo } from 'react';
import CheckpointRubric from '../CheckpointRubric/CheckpointRubric';
import CheckpointScoreCard from './CheckpointScoreCard';
import './CheckpointEvaluationPanel.css';

/**
 * CheckpointEvaluationPanel Component
 */
const CheckpointEvaluationPanel = ({
  checkpoint,
  scores = {},
  feedback = {},
  onScoreChange,
  onFeedbackChange,
  onSubmit,
  isPaused = false,
  disabled = false,
  viewMode = 'rubric', // 'rubric' | 'summary' | 'split'
  className = '',
  ...props
}) => {
  const [activeView, setActiveView] = useState(viewMode);
  const [expandedCriteria, setExpandedCriteria] = useState(new Set());
  
  const criteria = checkpoint?.rubric || [];
  
  // Calculate evaluation stats
  const evaluationStats = useMemo(() => {
    const totalCriteria = criteria.length;
    const scoredCount = Object.keys(scores).length;
    const totalScore = Object.values(scores).reduce((sum, s) => sum + s, 0);
    const maxScore = totalCriteria * 4;
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const isComplete = scoredCount === totalCriteria;
    const isPassing = percentage >= (checkpoint?.passingScore || 70);
    
    return {
      totalCriteria,
      scoredCount,
      totalScore,
      maxScore,
      percentage,
      isComplete,
      isPassing
    };
  }, [criteria, scores, checkpoint?.passingScore]);
  
  // Handle score change
  const handleScoreChange = useCallback((criteriaId, score) => {
    if (!disabled && onScoreChange) {
      onScoreChange(criteriaId, score);
    }
  }, [disabled, onScoreChange]);
  
  // Handle feedback change
  const handleFeedbackChange = useCallback((criteriaId, text) => {
    if (!disabled && onFeedbackChange) {
      onFeedbackChange(criteriaId, text);
    }
  }, [disabled, onFeedbackChange]);
  
  // Toggle criteria expansion
  const handleToggleCriteria = useCallback((criteriaId) => {
    setExpandedCriteria(prev => {
      const next = new Set(prev);
      if (next.has(criteriaId)) {
        next.delete(criteriaId);
      } else {
        next.add(criteriaId);
      }
      return next;
    });
  }, []);
  
  // Handle view toggle
  const handleViewChange = useCallback((view) => {
    setActiveView(view);
  }, []);
  
  const classNames = [
    'checkpoint-evaluation-panel',
    `checkpoint-evaluation-panel--${activeView}`,
    isPaused && 'checkpoint-evaluation-panel--paused',
    disabled && 'checkpoint-evaluation-panel--disabled',
    evaluationStats.isComplete && 'checkpoint-evaluation-panel--complete',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Panel Header */}
      <div className="checkpoint-evaluation-panel__header">
        <div className="checkpoint-evaluation-panel__header-info">
          <h2 className="checkpoint-evaluation-panel__title">
            {checkpoint?.title || 'Checkpoint Evaluation'}
          </h2>
          <div className="checkpoint-evaluation-panel__progress">
            <span className="checkpoint-evaluation-panel__progress-text">
              {evaluationStats.scoredCount} / {evaluationStats.totalCriteria} criteria
            </span>
            <div className="checkpoint-evaluation-panel__progress-bar">
              <div 
                className="checkpoint-evaluation-panel__progress-fill"
                style={{ 
                  width: `${(evaluationStats.scoredCount / evaluationStats.totalCriteria) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>
        
        {/* View Toggle */}
        <div className="checkpoint-evaluation-panel__view-toggle">
          <button
            type="button"
            className={`checkpoint-evaluation-panel__view-btn ${activeView === 'rubric' ? 'checkpoint-evaluation-panel__view-btn--active' : ''}`}
            onClick={() => handleViewChange('rubric')}
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
            </svg>
            Rubric
          </button>
          <button
            type="button"
            className={`checkpoint-evaluation-panel__view-btn ${activeView === 'summary' ? 'checkpoint-evaluation-panel__view-btn--active' : ''}`}
            onClick={() => handleViewChange('summary')}
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
            </svg>
            Summary
          </button>
          <button
            type="button"
            className={`checkpoint-evaluation-panel__view-btn ${activeView === 'split' ? 'checkpoint-evaluation-panel__view-btn--active' : ''}`}
            onClick={() => handleViewChange('split')}
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
            Split
          </button>
        </div>
      </div>
      
      {/* Panel Content */}
      <div className="checkpoint-evaluation-panel__content">
        {/* Rubric View */}
        {(activeView === 'rubric' || activeView === 'split') && (
          <div className="checkpoint-evaluation-panel__rubric">
            <CheckpointRubric
              criteria={criteria}
              scores={scores}
              feedback={feedback}
              onScoreChange={handleScoreChange}
              onFeedbackChange={handleFeedbackChange}
              passingScore={checkpoint?.passingScore || 70}
              disabled={disabled || isPaused}
              showSummary={activeView === 'rubric'}
              expandedCriteria={expandedCriteria}
              onToggleCriteria={handleToggleCriteria}
            />
          </div>
        )}
        
        {/* Summary View */}
        {(activeView === 'summary' || activeView === 'split') && (
          <div className="checkpoint-evaluation-panel__summary">
            <div className="checkpoint-evaluation-panel__score-overview">
              <div className="checkpoint-evaluation-panel__score-main">
                <div className="checkpoint-evaluation-panel__score-circle">
                  <svg viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke={evaluationStats.isPassing ? 'var(--success)' : 'var(--warning)'}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(evaluationStats.percentage / 100) * 264} 264`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="checkpoint-evaluation-panel__score-text">
                    <span className="checkpoint-evaluation-panel__score-value">
                      {evaluationStats.percentage}
                    </span>
                    <span className="checkpoint-evaluation-panel__score-label">%</span>
                  </div>
                </div>
                
                <div className="checkpoint-evaluation-panel__score-info">
                  <div className="checkpoint-evaluation-panel__score-row">
                    <span>Total Points</span>
                    <strong>{evaluationStats.totalScore} / {evaluationStats.maxScore}</strong>
                  </div>
                  <div className="checkpoint-evaluation-panel__score-row">
                    <span>Passing Score</span>
                    <strong>{checkpoint?.passingScore || 70}%</strong>
                  </div>
                  <div className="checkpoint-evaluation-panel__score-row">
                    <span>Status</span>
                    <strong className={evaluationStats.isPassing ? 'text-success' : 'text-warning'}>
                      {!evaluationStats.isComplete ? 'Incomplete' : evaluationStats.isPassing ? 'Passing' : 'Not Passing'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Score Cards Grid */}
            <div className="checkpoint-evaluation-panel__score-grid">
              {criteria.map((criterion, index) => (
                <CheckpointScoreCard
                  key={criterion.id}
                  title={`${index + 1}. ${criterion.title}`}
                  score={scores[criterion.id]}
                  weight={criterion.weight}
                  description={criterion.description}
                  feedback={feedback[criterion.id]}
                  showDetails={false}
                  compact
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Paused Overlay */}
      {isPaused && (
        <div className="checkpoint-evaluation-panel__paused-overlay">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          <span>Evaluation Paused</span>
        </div>
      )}
    </div>
  );
};

export default CheckpointEvaluationPanel;