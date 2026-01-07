/**
 * GPS Lab Platform - RubricCriteria Component
 * 
 * Individual rubric criteria item with scoring interface.
 * Supports 4-level scoring (Needs Work, Developing, Proficient, Exemplary).
 * 
 * @module components/checkpoint/CheckpointRubric/RubricCriteria
 */

import React, { useState, useCallback } from 'react';
import './RubricCriteria.css';

/**
 * Score levels with descriptions
 */
const SCORE_LEVELS = [
  {
    value: 1,
    label: 'Needs Work',
    shortLabel: 'NW',
    description: 'Does not meet expectations',
    color: '#E74C3C'
  },
  {
    value: 2,
    label: 'Developing',
    shortLabel: 'D',
    description: 'Partially meets expectations',
    color: '#F1C40F'
  },
  {
    value: 3,
    label: 'Proficient',
    shortLabel: 'P',
    description: 'Meets expectations',
    color: '#00D4FF'
  },
  {
    value: 4,
    label: 'Exemplary',
    shortLabel: 'E',
    description: 'Exceeds expectations',
    color: '#2A9D8F'
  }
];

/**
 * RubricCriteria Component
 */
const RubricCriteria = ({
  id,
  number,
  title,
  description,
  weight = 25,
  levelDescriptions = {},
  score,
  onScoreChange,
  feedback,
  onFeedbackChange,
  isExpanded = false,
  onToggleExpand,
  disabled = false,
  showFeedback = true,
  className = '',
  ...props
}) => {
  const [isHoveredLevel, setIsHoveredLevel] = useState(null);
  const [localExpanded, setLocalExpanded] = useState(isExpanded);
  
  const expanded = onToggleExpand ? isExpanded : localExpanded;
  
  const handleToggle = useCallback(() => {
    if (onToggleExpand) {
      onToggleExpand(id);
    } else {
      setLocalExpanded(prev => !prev);
    }
  }, [id, onToggleExpand]);
  
  const handleScoreSelect = useCallback((value) => {
    if (!disabled && onScoreChange) {
      onScoreChange(id, value);
    }
  }, [id, disabled, onScoreChange]);
  
  const handleFeedbackChange = useCallback((e) => {
    if (onFeedbackChange) {
      onFeedbackChange(id, e.target.value);
    }
  }, [id, onFeedbackChange]);
  
  const selectedLevel = SCORE_LEVELS.find(level => level.value === score);
  
  const classNames = [
    'rubric-criteria',
    expanded && 'rubric-criteria--expanded',
    score && 'rubric-criteria--scored',
    disabled && 'rubric-criteria--disabled',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      <div className="rubric-criteria__header" onClick={handleToggle}>
        <div className="rubric-criteria__header-left">
          <span 
            className="rubric-criteria__number"
            style={{ '--score-color': selectedLevel?.color || 'var(--neutral-500)' }}
          >
            {number}
          </span>
          <div className="rubric-criteria__title-section">
            <h3 className="rubric-criteria__title">{title}</h3>
            <span className="rubric-criteria__weight">{weight}%</span>
          </div>
        </div>
        
        <div className="rubric-criteria__header-right">
          {score && (
            <span 
              className="rubric-criteria__score-badge"
              style={{ '--score-color': selectedLevel?.color }}
            >
              {selectedLevel?.label}
            </span>
          )}
          <button
            type="button"
            className="rubric-criteria__expand-btn"
            aria-expanded={expanded}
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="rubric-criteria__content">
        <p className="rubric-criteria__description">{description}</p>
        
        <div className="rubric-criteria__scoring">
          <span className="rubric-criteria__scoring-label">Select Score:</span>
          <div className="rubric-criteria__levels">
            {SCORE_LEVELS.map((level) => {
              const levelDescription = levelDescriptions[level.value] || level.description;
              const isSelected = score === level.value;
              const isHovered = isHoveredLevel === level.value;
              
              return (
                <button
                  key={level.value}
                  type="button"
                  className={`rubric-criteria__level ${isSelected ? 'rubric-criteria__level--selected' : ''}`}
                  style={{ '--level-color': level.color }}
                  onClick={() => handleScoreSelect(level.value)}
                  onMouseEnter={() => setIsHoveredLevel(level.value)}
                  onMouseLeave={() => setIsHoveredLevel(null)}
                  disabled={disabled}
                  aria-label={`${level.label}: ${levelDescription}`}
                  title={levelDescription}
                >
                  <span className="rubric-criteria__level-value">{level.value}</span>
                  <span className="rubric-criteria__level-label">{level.label}</span>
                  
                  {(isHovered || isSelected) && (
                    <div className="rubric-criteria__level-tooltip">
                      {levelDescription}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        {Object.keys(levelDescriptions).length > 0 && (
          <div className="rubric-criteria__level-descriptions">
            {SCORE_LEVELS.map((level) => (
              <div 
                key={level.value}
                className={`rubric-criteria__level-desc ${score === level.value ? 'rubric-criteria__level-desc--active' : ''}`}
              >
                <span 
                  className="rubric-criteria__level-desc-label"
                  style={{ '--level-color': level.color }}
                >
                  {level.value}. {level.label}
                </span>
                <p className="rubric-criteria__level-desc-text">
                  {levelDescriptions[level.value] || level.description}
                </p>
              </div>
            ))}
          </div>
        )}
        
        {showFeedback && (
          <div className="rubric-criteria__feedback">
            <label className="rubric-criteria__feedback-label">
              Additional Notes (Optional)
            </label>
            <textarea
              className="rubric-criteria__feedback-input"
              value={feedback || ''}
              onChange={handleFeedbackChange}
              placeholder="Add any specific observations or justifications..."
              disabled={disabled}
              rows={3}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export { SCORE_LEVELS };
export default RubricCriteria;