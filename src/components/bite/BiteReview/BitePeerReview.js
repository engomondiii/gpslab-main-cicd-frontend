/**
 * GPS Lab Platform - BitePeerReview Component
 * 
 * Peer review display and feedback form.
 * 
 * @module components/bite/BiteReview/BitePeerReview
 */

import React, { useState } from 'react';
import './BitePeerReview.css';

/**
 * Rating stars helper
 */
const RatingStars = ({ rating, onRate, isInteractive = false, size = 'medium' }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  return (
    <div className={`bite-peer-review__stars bite-peer-review__stars--${size}`}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          className={`bite-peer-review__star ${star <= (hoverRating || rating) ? 'bite-peer-review__star--filled' : ''}`}
          onClick={() => isInteractive && onRate?.(star)}
          onMouseEnter={() => isInteractive && setHoverRating(star)}
          onMouseLeave={() => isInteractive && setHoverRating(0)}
          disabled={!isInteractive}
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        </button>
      ))}
    </div>
  );
};

/**
 * BitePeerReview Component
 */
const BitePeerReview = ({
  reviews = [],
  onSubmitReview,
  canReview = false,
  isSubmitting = false,
  className = '',
  ...props
}) => {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [strengths, setStrengths] = useState('');
  const [suggestions, setSuggestions] = useState('');
  
  const handleSubmit = () => {
    if (rating > 0 && feedback.trim() && onSubmitReview) {
      onSubmitReview({
        rating,
        feedback: feedback.trim(),
        strengths: strengths.trim(),
        suggestions: suggestions.trim()
      });
      // Reset form
      setRating(0);
      setFeedback('');
      setStrengths('');
      setSuggestions('');
      setShowForm(false);
    }
  };
  
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;
  
  const classNames = ['bite-peer-review', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="bite-peer-review__header">
        <div className="bite-peer-review__title">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
          </svg>
          Peer Reviews
        </div>
        
        {averageRating && (
          <div className="bite-peer-review__average">
            <span className="bite-peer-review__average-value">{averageRating}</span>
            <RatingStars rating={Math.round(parseFloat(averageRating))} size="small" />
            <span className="bite-peer-review__average-count">({reviews.length})</span>
          </div>
        )}
      </div>
      
      {/* Add Review Button / Form */}
      {canReview && (
        <div className="bite-peer-review__add-section">
          {!showForm ? (
            <button type="button" onClick={() => setShowForm(true)} className="bite-peer-review__add-btn">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
              Write a Review
            </button>
          ) : (
            <div className="bite-peer-review__form">
              <div className="bite-peer-review__form-header">
                <h4 className="bite-peer-review__form-title">Your Review</h4>
                <button type="button" onClick={() => setShowForm(false)} className="bite-peer-review__form-close">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
              
              <div className="bite-peer-review__form-field">
                <label className="bite-peer-review__form-label">Rating *</label>
                <RatingStars rating={rating} onRate={setRating} isInteractive />
              </div>
              
              <div className="bite-peer-review__form-field">
                <label className="bite-peer-review__form-label">Feedback *</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your overall thoughts..."
                  className="bite-peer-review__form-textarea"
                  rows={3}
                />
              </div>
              
              <div className="bite-peer-review__form-field">
                <label className="bite-peer-review__form-label">Strengths</label>
                <textarea
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  placeholder="What did they do well?"
                  className="bite-peer-review__form-textarea"
                  rows={2}
                />
              </div>
              
              <div className="bite-peer-review__form-field">
                <label className="bite-peer-review__form-label">Suggestions</label>
                <textarea
                  value={suggestions}
                  onChange={(e) => setSuggestions(e.target.value)}
                  placeholder="How could they improve?"
                  className="bite-peer-review__form-textarea"
                  rows={2}
                />
              </div>
              
              <div className="bite-peer-review__form-actions">
                <button type="button" onClick={() => setShowForm(false)} className="bite-peer-review__form-cancel">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={rating === 0 || !feedback.trim() || isSubmitting}
                  className="bite-peer-review__form-submit"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Reviews List */}
      <div className="bite-peer-review__content">
        {reviews.length > 0 ? (
          <div className="bite-peer-review__list">
            {reviews.map((review, index) => (
              <div key={review.id || index} className="bite-peer-review__item">
                <div className="bite-peer-review__item-header">
                  <div className="bite-peer-review__reviewer">
                    {review.reviewer?.avatar ? (
                      <img src={review.reviewer.avatar} alt="" className="bite-peer-review__reviewer-avatar" />
                    ) : (
                      <div className="bite-peer-review__reviewer-avatar bite-peer-review__reviewer-avatar--placeholder">
                        {review.reviewer?.name?.[0] || '?'}
                      </div>
                    )}
                    <div className="bite-peer-review__reviewer-info">
                      <span className="bite-peer-review__reviewer-name">{review.reviewer?.name || 'Anonymous'}</span>
                      <span className="bite-peer-review__reviewer-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <RatingStars rating={review.rating} size="small" />
                </div>
                
                <p className="bite-peer-review__item-feedback">{review.feedback}</p>
                
                {review.strengths && (
                  <div className="bite-peer-review__item-section">
                    <span className="bite-peer-review__item-label">Strengths:</span>
                    <p className="bite-peer-review__item-text">{review.strengths}</p>
                  </div>
                )}
                
                {review.suggestions && (
                  <div className="bite-peer-review__item-section">
                    <span className="bite-peer-review__item-label">Suggestions:</span>
                    <p className="bite-peer-review__item-text">{review.suggestions}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="bite-peer-review__empty">No peer reviews yet</p>
        )}
      </div>
    </div>
  );
};

export default BitePeerReview;