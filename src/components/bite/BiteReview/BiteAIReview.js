/**
 * GPS Lab Platform - BiteAIReview Component
 * 
 * AI-generated review feedback display.
 * 
 * @module components/bite/BiteReview/BiteAIReview
 */

import React from 'react';
import './BiteAIReview.css';

/**
 * Rating level configurations
 */
const RATING_LEVELS = {
  excellent: { label: 'Excellent', color: 'success', icon: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg> },
  good: { label: 'Good', color: 'primary', icon: <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg> },
  satisfactory: { label: 'Satisfactory', color: 'warning', icon: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd"/></svg> },
  needs_improvement: { label: 'Needs Work', color: 'error', icon: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg> }
};

/**
 * BiteAIReview Component
 */
const BiteAIReview = ({
  review,
  isLoading = false,
  error = null,
  onRetry,
  className = '',
  ...props
}) => {
  const ratingConfig = RATING_LEVELS[review?.rating] || RATING_LEVELS.satisfactory;
  
  const classNames = ['bite-ai-review', className].filter(Boolean).join(' ');
  
  if (isLoading) {
    return (
      <div className={classNames} {...props}>
        <div className="bite-ai-review__loading">
          <div className="bite-ai-review__loading-icon">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.414 1.415l.708-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd"/>
            </svg>
          </div>
          <div className="bite-ai-review__loading-text">
            <span className="bite-ai-review__loading-title">AI Review in Progress</span>
            <span className="bite-ai-review__loading-subtitle">Analyzing your submission...</span>
          </div>
          <div className="bite-ai-review__loading-bar">
            <div className="bite-ai-review__loading-progress" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={classNames} {...props}>
        <div className="bite-ai-review__error">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          <span className="bite-ai-review__error-text">{error}</span>
          {onRetry && (
            <button type="button" onClick={onRetry} className="bite-ai-review__retry-btn">
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }
  
  if (!review) {
    return (
      <div className={classNames} {...props}>
        <div className="bite-ai-review__empty">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.414 1.415l.708-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd"/>
          </svg>
          <span>AI review pending</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="bite-ai-review__header">
        <div className="bite-ai-review__title">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.414 1.415l.708-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd"/>
          </svg>
          AI Review
        </div>
        <div className={`bite-ai-review__rating bite-ai-review__rating--${ratingConfig.color}`}>
          {ratingConfig.icon}
          {ratingConfig.label}
        </div>
      </div>
      
      {/* Score */}
      {review.score !== undefined && (
        <div className="bite-ai-review__score">
          <div className="bite-ai-review__score-circle">
            <svg viewBox="0 0 36 36">
              <path
                className="bite-ai-review__score-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`bite-ai-review__score-fill bite-ai-review__score-fill--${ratingConfig.color}`}
                strokeDasharray={`${review.score}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="bite-ai-review__score-value">{review.score}</span>
          </div>
          <span className="bite-ai-review__score-label">Overall Score</span>
        </div>
      )}
      
      {/* Content */}
      <div className="bite-ai-review__content">
        {/* Summary */}
        {review.summary && (
          <div className="bite-ai-review__section">
            <h4 className="bite-ai-review__section-title">Summary</h4>
            <p className="bite-ai-review__section-text">{review.summary}</p>
          </div>
        )}
        
        {/* Strengths */}
        {review.strengths?.length > 0 && (
          <div className="bite-ai-review__section">
            <h4 className="bite-ai-review__section-title bite-ai-review__section-title--success">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              Strengths
            </h4>
            <ul className="bite-ai-review__list">
              {review.strengths.map((strength, index) => (
                <li key={index} className="bite-ai-review__list-item bite-ai-review__list-item--success">
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Areas for Improvement */}
        {review.improvements?.length > 0 && (
          <div className="bite-ai-review__section">
            <h4 className="bite-ai-review__section-title bite-ai-review__section-title--warning">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              Areas for Improvement
            </h4>
            <ul className="bite-ai-review__list">
              {review.improvements.map((improvement, index) => (
                <li key={index} className="bite-ai-review__list-item bite-ai-review__list-item--warning">
                  {improvement}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Suggestions */}
        {review.suggestions?.length > 0 && (
          <div className="bite-ai-review__section">
            <h4 className="bite-ai-review__section-title bite-ai-review__section-title--info">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
              Suggestions
            </h4>
            <ul className="bite-ai-review__list">
              {review.suggestions.map((suggestion, index) => (
                <li key={index} className="bite-ai-review__list-item">
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Footer */}
      {review.reviewedAt && (
        <div className="bite-ai-review__footer">
          <span className="bite-ai-review__timestamp">
            Reviewed {new Date(review.reviewedAt).toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
};

export default BiteAIReview;