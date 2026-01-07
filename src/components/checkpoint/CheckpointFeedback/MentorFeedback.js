/**
 * GPS Lab Platform - MentorFeedback Component
 * 
 * Displays human mentor feedback for checkpoint evaluation.
 * Includes mentor info, written feedback, and follow-up options.
 * 
 * @module components/checkpoint/CheckpointFeedback/MentorFeedback
 */

import React, { useState } from 'react';
import './MentorFeedback.css';

/**
 * MentorFeedback Component
 */
const MentorFeedback = ({
  mentor,
  feedback = {},
  submittedAt,
  onRequestSession,
  onSendMessage,
  onThankMentor,
  isLoading = false,
  hasThanked = false,
  className = '',
  ...props
}) => {
  const [thanksSent, setThanksSent] = useState(hasThanked);
  const [message, setMessage] = useState('');
  const [showMessageForm, setShowMessageForm] = useState(false);
  
  const {
    overallFeedback = '',
    strengths = [],
    improvements = [],
    actionItems = [],
    rating,
    encouragement = ''
  } = feedback;
  
  const handleThank = () => {
    if (onThankMentor && !thanksSent) {
      onThankMentor();
      setThanksSent(true);
    }
  };
  
  const handleSendMessage = () => {
    if (message.trim() && onSendMessage) {
      onSendMessage(message);
      setMessage('');
      setShowMessageForm(false);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const classNames = [
    'mentor-feedback',
    isLoading && 'mentor-feedback--loading',
    !mentor && 'mentor-feedback--no-mentor',
    className
  ].filter(Boolean).join(' ');
  
  // No mentor assigned
  if (!mentor && !isLoading) {
    return (
      <div className={classNames} {...props}>
        <div className="mentor-feedback__empty">
          <div className="mentor-feedback__empty-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3>No Mentor Feedback Yet</h3>
          <p>Mentor feedback will appear here once a mentor reviews your checkpoint submission.</p>
          {onRequestSession && (
            <button
              type="button"
              className="mentor-feedback__request-btn"
              onClick={onRequestSession}
            >
              Request Mentor Review
            </button>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className={classNames} {...props}>
      {/* Loading State */}
      {isLoading && (
        <div className="mentor-feedback__loading">
          <div className="mentor-feedback__loading-spinner" />
          <p>Loading mentor feedback...</p>
        </div>
      )}
      
      {/* Mentor Header */}
      {!isLoading && mentor && (
        <>
          <div className="mentor-feedback__header">
            <div className="mentor-feedback__mentor-info">
              <div className="mentor-feedback__avatar">
                {mentor.avatar ? (
                  <img src={mentor.avatar} alt={mentor.name} />
                ) : (
                  <span>{mentor.name?.charAt(0) || 'M'}</span>
                )}
              </div>
              <div className="mentor-feedback__mentor-details">
                <h3 className="mentor-feedback__mentor-name">{mentor.name}</h3>
                <span className="mentor-feedback__mentor-title">{mentor.title || 'Mentor'}</span>
                {mentor.expertise && (
                  <span className="mentor-feedback__mentor-expertise">{mentor.expertise}</span>
                )}
              </div>
            </div>
            {submittedAt && (
              <span className="mentor-feedback__date">
                Reviewed {formatDate(submittedAt)}
              </span>
            )}
          </div>
          
          {/* Rating */}
          {rating && (
            <div className="mentor-feedback__rating">
              <span className="mentor-feedback__rating-label">Overall Assessment</span>
              <div className="mentor-feedback__rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`mentor-feedback__star ${star <= rating ? 'mentor-feedback__star--filled' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
            </div>
          )}
          
          {/* Overall Feedback */}
          {overallFeedback && (
            <div className="mentor-feedback__main">
              <p>{overallFeedback}</p>
            </div>
          )}
          
          {/* Strengths */}
          {strengths.length > 0 && (
            <div className="mentor-feedback__section mentor-feedback__section--strengths">
              <h4 className="mentor-feedback__section-title">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                What You Did Well
              </h4>
              <ul className="mentor-feedback__list">
                {strengths.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Improvements */}
          {improvements.length > 0 && (
            <div className="mentor-feedback__section mentor-feedback__section--improvements">
              <h4 className="mentor-feedback__section-title">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/>
                </svg>
                Areas for Growth
              </h4>
              <ul className="mentor-feedback__list">
                {improvements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Action Items */}
          {actionItems.length > 0 && (
            <div className="mentor-feedback__section mentor-feedback__section--actions">
              <h4 className="mentor-feedback__section-title">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                </svg>
                Recommended Next Steps
              </h4>
              <ol className="mentor-feedback__action-list">
                {actionItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            </div>
          )}
          
          {/* Encouragement */}
          {encouragement && (
            <div className="mentor-feedback__encouragement">
              <div className="mentor-feedback__encouragement-icon">✨</div>
              <p>{encouragement}</p>
            </div>
          )}
          
          {/* Actions */}
          <div className="mentor-feedback__actions">
            <button
              type="button"
              className={`mentor-feedback__thank-btn ${thanksSent ? 'mentor-feedback__thank-btn--sent' : ''}`}
              onClick={handleThank}
              disabled={thanksSent}
            >
              {thanksSent ? (
                <>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Thanks Sent!
                </>
              ) : (
                <>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                  </svg>
                  Thank Mentor
                </>
              )}
            </button>
            
            {onSendMessage && (
              <button
                type="button"
                className="mentor-feedback__message-btn"
                onClick={() => setShowMessageForm(!showMessageForm)}
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/>
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"/>
                </svg>
                Send Message
              </button>
            )}
            
            {onRequestSession && (
              <button
                type="button"
                className="mentor-feedback__session-btn"
                onClick={onRequestSession}
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                </svg>
                Schedule Session
              </button>
            )}
          </div>
          
          {/* Message Form */}
          {showMessageForm && (
            <div className="mentor-feedback__message-form">
              <textarea
                className="mentor-feedback__message-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a message to your mentor..."
                rows={4}
              />
              <div className="mentor-feedback__message-actions">
                <button
                  type="button"
                  className="mentor-feedback__cancel-btn"
                  onClick={() => setShowMessageForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="mentor-feedback__send-btn"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  Send Message
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MentorFeedback;