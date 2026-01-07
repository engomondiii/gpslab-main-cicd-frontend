/**
 * GPS Lab Platform - AIFeedback Component
 * 
 * Displays AI-generated feedback for checkpoint evaluation.
 * Shows strengths, areas for improvement, and suggestions.
 * 
 * @module components/checkpoint/CheckpointFeedback/AIFeedback
 */

import React, { useState } from 'react';
import './AIFeedback.css';

/**
 * AIFeedback Component
 */
const AIFeedback = ({
  feedback = {},
  criteriaFeedback = [],
  isLoading = false,
  onRequestMoreDetail,
  onAskQuestion,
  className = '',
  ...props
}) => {
  const [expandedCriteria, setExpandedCriteria] = useState(new Set());
  const [question, setQuestion] = useState('');
  
  const {
    summary = '',
    strengths = [],
    improvements = [],
    suggestions = [],
    encouragement = ''
  } = feedback;
  
  const handleToggleCriteria = (criteriaId) => {
    setExpandedCriteria(prev => {
      const next = new Set(prev);
      if (next.has(criteriaId)) {
        next.delete(criteriaId);
      } else {
        next.add(criteriaId);
      }
      return next;
    });
  };
  
  const handleAskQuestion = () => {
    if (question.trim() && onAskQuestion) {
      onAskQuestion(question);
      setQuestion('');
    }
  };
  
  const classNames = [
    'ai-feedback',
    isLoading && 'ai-feedback--loading',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="ai-feedback__header">
        <div className="ai-feedback__header-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="ai-feedback__header-text">
          <h3 className="ai-feedback__title">AI Navigator Feedback</h3>
          <p className="ai-feedback__subtitle">Personalized insights from your AI guide</p>
        </div>
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="ai-feedback__loading">
          <div className="ai-feedback__loading-spinner" />
          <p>Generating personalized feedback...</p>
        </div>
      )}
      
      {/* Summary */}
      {!isLoading && summary && (
        <div className="ai-feedback__summary">
          <p>{summary}</p>
        </div>
      )}
      
      {/* Strengths */}
      {!isLoading && strengths.length > 0 && (
        <div className="ai-feedback__section ai-feedback__section--strengths">
          <h4 className="ai-feedback__section-title">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            Strengths
          </h4>
          <ul className="ai-feedback__list">
            {strengths.map((strength, index) => (
              <li key={index} className="ai-feedback__list-item">
                {strength}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Improvements */}
      {!isLoading && improvements.length > 0 && (
        <div className="ai-feedback__section ai-feedback__section--improvements">
          <h4 className="ai-feedback__section-title">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/>
            </svg>
            Areas for Growth
          </h4>
          <ul className="ai-feedback__list">
            {improvements.map((improvement, index) => (
              <li key={index} className="ai-feedback__list-item">
                {improvement}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Suggestions */}
      {!isLoading && suggestions.length > 0 && (
        <div className="ai-feedback__section ai-feedback__section--suggestions">
          <h4 className="ai-feedback__section-title">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/>
            </svg>
            Suggestions
          </h4>
          <ul className="ai-feedback__list ai-feedback__list--suggestions">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="ai-feedback__list-item">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Criteria-specific Feedback */}
      {!isLoading && criteriaFeedback.length > 0 && (
        <div className="ai-feedback__criteria">
          <h4 className="ai-feedback__section-title">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
            </svg>
            Detailed Criteria Feedback
          </h4>
          <div className="ai-feedback__criteria-list">
            {criteriaFeedback.map((item) => (
              <div 
                key={item.criteriaId}
                className={`ai-feedback__criteria-item ${expandedCriteria.has(item.criteriaId) ? 'ai-feedback__criteria-item--expanded' : ''}`}
              >
                <button
                  type="button"
                  className="ai-feedback__criteria-header"
                  onClick={() => handleToggleCriteria(item.criteriaId)}
                >
                  <span className="ai-feedback__criteria-title">{item.title}</span>
                  <span 
                    className="ai-feedback__criteria-score"
                    style={{ '--score-color': item.score >= 3 ? 'var(--success)' : item.score === 2 ? 'var(--warning)' : 'var(--error)' }}
                  >
                    {item.score}/4
                  </span>
                  <svg viewBox="0 0 20 20" fill="currentColor" className="ai-feedback__criteria-chevron">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
                <div className="ai-feedback__criteria-content">
                  <p>{item.feedback}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Encouragement */}
      {!isLoading && encouragement && (
        <div className="ai-feedback__encouragement">
          <div className="ai-feedback__encouragement-icon">💡</div>
          <p>{encouragement}</p>
        </div>
      )}
      
      {/* Ask Question */}
      {onAskQuestion && (
        <div className="ai-feedback__ask">
          <h4 className="ai-feedback__ask-title">Have a question about your feedback?</h4>
          <div className="ai-feedback__ask-input-wrapper">
            <input
              type="text"
              className="ai-feedback__ask-input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask the Navigator..."
              onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
            />
            <button
              type="button"
              className="ai-feedback__ask-btn"
              onClick={handleAskQuestion}
              disabled={!question.trim()}
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIFeedback;