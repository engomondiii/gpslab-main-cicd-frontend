/**
 * GPS Lab Platform - BiteAIReview Component
 * GPS 101 INTEGRATION: Adjusted AI review criteria for GPS 101 bites
 * 
 * AI-generated review feedback display.
 * 
 * @module components/bite/BiteReview/BiteAIReview
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  // NEW: GPS 101 props
  isGPS101 = false,
  gps101StageNumber,
  gps101CriteriaFocus = [], // e.g., ['self-reflection', 'purpose-alignment', 'depth-of-thought']
  isLoading = false,
  error = null,
  onRetry,
  className = '',
  ...props
}) => {
  const navigate = useNavigate();
  const ratingConfig = RATING_LEVELS[review?.rating] || RATING_LEVELS.satisfactory;
  
  const classNames = [
    'bite-ai-review',
    isGPS101 && 'bite-ai-review--gps101',
    className
  ].filter(Boolean).join(' ');
  
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
            <span className="bite-ai-review__loading-title">
              {isGPS101 ? 'GPS 101 AI Review in Progress' : 'AI Review in Progress'}
            </span>
            <span className="bite-ai-review__loading-subtitle">
              {isGPS101 
                ? 'Analyzing your GPS 101 submission with purpose-discovery focus...'
                : 'Analyzing your submission...'}
            </span>
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
          <span>{isGPS101 ? 'GPS 101 AI review pending' : 'AI review pending'}</span>
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
          {isGPS101 ? 'GPS 101 AI Review' : 'AI Review'}
        </div>
        <div className={`bite-ai-review__rating bite-ai-review__rating--${ratingConfig.color}`}>
          {ratingConfig.icon}
          {ratingConfig.label}
        </div>
      </div>
      
      {/* NEW: GPS 101 Context Banner */}
      {isGPS101 && (
        <div className="bite-ai-review__gps101-context">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
          </svg>
          <div>
            <strong>GPS 101 Stage {gps101StageNumber} Review</strong>
            <p>This review focuses on purpose discovery, self-reflection, and growth mindset.</p>
          </div>
        </div>
      )}
      
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
        
        {/* NEW: GPS 101 Criteria Assessment */}
        {isGPS101 && gps101CriteriaFocus.length > 0 && review.gps101Assessment && (
          <div className="bite-ai-review__section">
            <h4 className="bite-ai-review__section-title bite-ai-review__section-title--info">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
              </svg>
              GPS 101 Assessment
            </h4>
            <ul className="bite-ai-review__list">
              {gps101CriteriaFocus.map((criterion, index) => {
                const assessment = review.gps101Assessment[criterion];
                return assessment ? (
                  <li key={index} className="bite-ai-review__list-item bite-ai-review__list-item--success">
                    <strong>{criterion.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {assessment}
                  </li>
                ) : null;
              })}
            </ul>
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
              {isGPS101 ? 'Growth Opportunities' : 'Areas for Improvement'}
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
              {isGPS101 ? 'Navigator Suggestions' : 'Suggestions'}
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
        
        {/* NEW: GPS 101 Navigator CTA */}
        {isGPS101 && (
          <div className="bite-ai-review__navigator-cta">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd"/>
            </svg>
            <div>
              <h5>Want personalized guidance?</h5>
              <p>Navigator AI can help you deepen your GPS 101 reflections</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/navigator', { state: { context: 'gps101', stage: gps101StageNumber } })}
              className="bite-ai-review__navigator-btn"
            >
              Ask Navigator
            </button>
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