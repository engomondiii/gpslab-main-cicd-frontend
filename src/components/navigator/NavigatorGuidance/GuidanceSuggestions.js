/**
 * GPS Lab Platform - GuidanceSuggestions Component
 * 
 * Contextual suggestions and recommendations from Navigator
 * based on user's current progress and stage.
 * 
 * @module components/navigator/NavigatorGuidance/GuidanceSuggestions
 */

import React from 'react';
import './GuidanceSuggestions.css';

/**
 * Get beacon color for stage
 */
const getBeaconColor = (stage) => {
  const colors = {
    1: 'var(--beacon-red, #e74c3c)',
    2: 'var(--beacon-orange, #f39c12)',
    3: 'var(--beacon-yellow, #f1c40f)',
    4: 'var(--beacon-green, #2ecc71)',
    5: 'var(--beacon-blue, #3498db)',
    6: 'var(--beacon-indigo, #9b59b6)',
    7: 'var(--beacon-purple, #8e44ad)'
  };
  return colors[stage] || 'var(--gps-primary, #00d4ff)';
};

/**
 * Suggestion types configuration
 */
const SUGGESTION_TYPES = {
  mission: { icon: '🎯', label: 'Mission', color: 'var(--gps-primary)' },
  bite: { icon: '🍕', label: 'Bite', color: 'var(--beacon-orange)' },
  study: { icon: '📚', label: 'Study', color: 'var(--beacon-yellow)' },
  checkpoint: { icon: '🏁', label: 'Checkpoint', color: 'var(--success)' },
  party: { icon: '👥', label: 'Party', color: 'var(--beacon-purple)' },
  praise: { icon: '🎉', label: 'Praise', color: 'var(--beacon-indigo)' },
  baraka: { icon: '🪙', label: 'Baraka', color: 'var(--warning)' },
  tip: { icon: '💡', label: 'Tip', color: 'var(--gps-primary)' }
};

/**
 * Priority indicator
 */
const PRIORITY_CONFIG = {
  high: { icon: '🔴', label: 'High Priority' },
  medium: { icon: '🟡', label: 'Medium Priority' },
  low: { icon: '🟢', label: 'Suggestion' }
};

/**
 * GuidanceSuggestions Component
 */
const GuidanceSuggestions = ({
  suggestions = [],
  userStage = 1,
  onSuggestionClick,
  onDismiss,
  showHeader = true,
  maxVisible = 5,
  variant = 'default', // default, compact, expanded
  className = '',
  ...props
}) => {
  const beaconColor = getBeaconColor(userStage);
  const visibleSuggestions = suggestions.slice(0, maxVisible);
  const hasMore = suggestions.length > maxVisible;
  
  const handleClick = (suggestion) => {
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
  };
  
  const handleDismiss = (e, suggestionId) => {
    e.stopPropagation();
    if (onDismiss) {
      onDismiss(suggestionId);
    }
  };
  
  if (suggestions.length === 0) {
    return null;
  }
  
  const classNames = [
    'guidance-suggestions',
    `guidance-suggestions--${variant}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} style={{ '--beacon-color': beaconColor }} {...props}>
      {/* Header */}
      {showHeader && (
        <header className="guidance-suggestions__header">
          <div className="guidance-suggestions__header-icon">💡</div>
          <div className="guidance-suggestions__header-content">
            <h3 className="guidance-suggestions__title">Navigator Suggestions</h3>
            <p className="guidance-suggestions__subtitle">
              Personalized recommendations for your journey
            </p>
          </div>
        </header>
      )}
      
      {/* Suggestions List */}
      <ul className="guidance-suggestions__list">
        {visibleSuggestions.map((suggestion, index) => {
          const typeConfig = SUGGESTION_TYPES[suggestion.type] || SUGGESTION_TYPES.tip;
          const priorityConfig = PRIORITY_CONFIG[suggestion.priority] || PRIORITY_CONFIG.low;
          
          return (
            <li key={suggestion.id || index} className="guidance-suggestions__item">
              <button
                type="button"
                className={`guidance-suggestions__card guidance-suggestions__card--${suggestion.priority || 'low'}`}
                onClick={() => handleClick(suggestion)}
                style={{ '--type-color': typeConfig.color }}
              >
                {/* Type Icon */}
                <div className="guidance-suggestions__type-icon">
                  {typeConfig.icon}
                </div>
                
                {/* Content */}
                <div className="guidance-suggestions__content">
                  <div className="guidance-suggestions__content-header">
                    <span className="guidance-suggestions__type-label">{typeConfig.label}</span>
                    {suggestion.priority && (
                      <span className="guidance-suggestions__priority">
                        {priorityConfig.icon}
                      </span>
                    )}
                  </div>
                  <h4 className="guidance-suggestions__text">{suggestion.title}</h4>
                  {suggestion.description && variant !== 'compact' && (
                    <p className="guidance-suggestions__description">{suggestion.description}</p>
                  )}
                  
                  {/* Meta Info */}
                  {(suggestion.reward || suggestion.time) && variant !== 'compact' && (
                    <div className="guidance-suggestions__meta">
                      {suggestion.reward && (
                        <span className="guidance-suggestions__reward">
                          🪙 +{suggestion.reward} Baraka
                        </span>
                      )}
                      {suggestion.time && (
                        <span className="guidance-suggestions__time">
                          ⏱️ ~{suggestion.time}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Arrow */}
                <div className="guidance-suggestions__arrow">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                
                {/* Dismiss Button */}
                {onDismiss && (
                  <button
                    type="button"
                    className="guidance-suggestions__dismiss"
                    onClick={(e) => handleDismiss(e, suggestion.id)}
                    title="Dismiss"
                  >
                    ✕
                  </button>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      
      {/* Show More */}
      {hasMore && (
        <div className="guidance-suggestions__more">
          <span className="guidance-suggestions__more-count">
            +{suggestions.length - maxVisible} more suggestions
          </span>
        </div>
      )}
    </div>
  );
};

export default GuidanceSuggestions;