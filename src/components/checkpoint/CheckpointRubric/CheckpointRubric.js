/**
 * GPS Lab Platform - CheckpointRubric Component
 * 
 * Complete rubric display with all criteria for checkpoint evaluation.
 * Manages scoring across all criteria and calculates total score.
 * 
 * @module components/checkpoint/CheckpointRubric/CheckpointRubric
 */

import React, { useState, useCallback, useMemo } from 'react';
import RubricCriteria, { SCORE_LEVELS } from './RubricCriteria';
import './CheckpointRubric.css';

/**
 * CheckpointRubric Component
 */
const CheckpointRubric = ({
  criteria = [],
  scores = {},
  feedback = {},
  onScoreChange,
  onFeedbackChange,
  passingScore = 70,
  disabled = false,
  showSummary = true,
  expandedCriteria,
  onToggleCriteria,
  className = '',
  ...props
}) => {
  // Local state for expanded criteria if not controlled
  const [localExpanded, setLocalExpanded] = useState(new Set([criteria[0]?.id]));
  
  const expanded = expandedCriteria !== undefined ? expandedCriteria : localExpanded;
  
  // Calculate scores
  const scoreStats = useMemo(() => {
    const maxPossible = criteria.length * 4; // 4 is max score per criteria
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const percentage = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;
    const scoredCount = Object.keys(scores).length;
    const isPassing = percentage >= passingScore;
    
    // Calculate weighted score if weights are provided
    const weightedTotal = criteria.reduce((sum, c) => {
      const score = scores[c.id] || 0;
      const weight = c.weight || (100 / criteria.length);
      return sum + (score / 4) * weight;
    }, 0);
    
    return {
      totalScore,
      maxPossible,
      percentage,
      weightedPercentage: Math.round(weightedTotal),
      scoredCount,
      totalCriteria: criteria.length,
      isPassing,
      isComplete: scoredCount === criteria.length
    };
  }, [criteria, scores, passingScore]);
  
  // Handle criteria toggle
  const handleToggleCriteria = useCallback((criteriaId) => {
    if (onToggleCriteria) {
      onToggleCriteria(criteriaId);
    } else {
      setLocalExpanded(prev => {
        const next = new Set(prev);
        if (next.has(criteriaId)) {
          next.delete(criteriaId);
        } else {
          next.add(criteriaId);
        }
        return next;
      });
    }
  }, [onToggleCriteria]);
  
  // Expand all criteria
  const handleExpandAll = useCallback(() => {
    if (onToggleCriteria) {
      criteria.forEach(c => {
        if (!expanded.has?.(c.id)) {
          onToggleCriteria(c.id);
        }
      });
    } else {
      setLocalExpanded(new Set(criteria.map(c => c.id)));
    }
  }, [criteria, expanded, onToggleCriteria]);
  
  // Collapse all criteria
  const handleCollapseAll = useCallback(() => {
    if (onToggleCriteria) {
      criteria.forEach(c => {
        if (expanded.has?.(c.id)) {
          onToggleCriteria(c.id);
        }
      });
    } else {
      setLocalExpanded(new Set());
    }
  }, [criteria, expanded, onToggleCriteria]);
  
  // Get score color
  const getScoreColor = (percentage) => {
    if (percentage >= 90) return 'var(--success, #2a9d8f)';
    if (percentage >= 70) return 'var(--gps-primary, #00d4ff)';
    if (percentage >= 50) return 'var(--warning, #f1c40f)';
    return 'var(--error, #e74c3c)';
  };
  
  const classNames = [
    'checkpoint-rubric',
    disabled && 'checkpoint-rubric--disabled',
    scoreStats.isComplete && 'checkpoint-rubric--complete',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="checkpoint-rubric__header">
        <div className="checkpoint-rubric__header-left">
          <h2 className="checkpoint-rubric__title">Evaluation Rubric</h2>
          <span className="checkpoint-rubric__subtitle">
            Rate each criteria from 1 (Needs Work) to 4 (Exemplary)
          </span>
        </div>
        
        <div className="checkpoint-rubric__header-actions">
          <button
            type="button"
            onClick={handleExpandAll}
            className="checkpoint-rubric__action-btn"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
            Expand All
          </button>
          <button
            type="button"
            onClick={handleCollapseAll}
            className="checkpoint-rubric__action-btn"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
            Collapse All
          </button>
        </div>
      </div>
      
      {/* Criteria List */}
      <div className="checkpoint-rubric__criteria-list">
        {criteria.map((criterion, index) => (
          <RubricCriteria
            key={criterion.id}
            id={criterion.id}
            number={index + 1}
            title={criterion.title}
            description={criterion.description}
            weight={criterion.weight || Math.round(100 / criteria.length)}
            levelDescriptions={criterion.levelDescriptions || {}}
            score={scores[criterion.id]}
            onScoreChange={onScoreChange}
            feedback={feedback[criterion.id]}
            onFeedbackChange={onFeedbackChange}
            isExpanded={expanded instanceof Set ? expanded.has(criterion.id) : expanded?.[criterion.id]}
            onToggleExpand={handleToggleCriteria}
            disabled={disabled}
          />
        ))}
      </div>
      
      {/* Summary */}
      {showSummary && (
        <div className="checkpoint-rubric__summary">
          <div className="checkpoint-rubric__summary-header">
            <h3>Evaluation Summary</h3>
            <span className="checkpoint-rubric__progress-text">
              {scoreStats.scoredCount} of {scoreStats.totalCriteria} criteria evaluated
            </span>
          </div>
          
          <div className="checkpoint-rubric__progress-bar">
            <div 
              className="checkpoint-rubric__progress-fill"
              style={{ 
                width: `${(scoreStats.scoredCount / scoreStats.totalCriteria) * 100}%` 
              }}
            />
          </div>
          
          <div className="checkpoint-rubric__score-display">
            <div className="checkpoint-rubric__score-circle">
              <svg viewBox="0 0 120 120">
                {/* Background circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="8"
                />
                {/* Progress circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke={getScoreColor(scoreStats.percentage)}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(scoreStats.percentage / 100) * 327} 327`}
                  transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dasharray 0.5s ease-out' }}
                />
              </svg>
              <div className="checkpoint-rubric__score-value">
                <span className="checkpoint-rubric__score-number" style={{ color: getScoreColor(scoreStats.percentage) }}>
                  {scoreStats.percentage}
                </span>
                <span className="checkpoint-rubric__score-percent">%</span>
              </div>
            </div>
            
            <div className="checkpoint-rubric__score-details">
              <div className="checkpoint-rubric__score-row">
                <span className="checkpoint-rubric__score-label">Points Earned</span>
                <span className="checkpoint-rubric__score-stat">
                  {scoreStats.totalScore} / {scoreStats.maxPossible}
                </span>
              </div>
              <div className="checkpoint-rubric__score-row">
                <span className="checkpoint-rubric__score-label">Passing Score</span>
                <span className="checkpoint-rubric__score-stat">{passingScore}%</span>
              </div>
              <div className="checkpoint-rubric__score-row">
                <span className="checkpoint-rubric__score-label">Status</span>
                <span 
                  className={`checkpoint-rubric__score-status ${scoreStats.isPassing ? 'checkpoint-rubric__score-status--passing' : 'checkpoint-rubric__score-status--failing'}`}
                >
                  {!scoreStats.isComplete ? 'Incomplete' : scoreStats.isPassing ? 'Passing' : 'Not Passing'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Score Legend */}
          <div className="checkpoint-rubric__legend">
            {SCORE_LEVELS.map((level) => (
              <div key={level.value} className="checkpoint-rubric__legend-item">
                <span 
                  className="checkpoint-rubric__legend-color"
                  style={{ background: level.color }}
                />
                <span className="checkpoint-rubric__legend-value">{level.value}</span>
                <span className="checkpoint-rubric__legend-label">{level.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckpointRubric;