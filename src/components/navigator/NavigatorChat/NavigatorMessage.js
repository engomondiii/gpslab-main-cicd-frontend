/**
 * GPS Lab Platform - NavigatorMessage Component
 * 
 * Individual message bubble in Navigator chat, supporting
 * different message types (text, suggestion, action, system).
 * 
 * @module components/navigator/NavigatorChat/NavigatorMessage
 */

import React, { useState } from 'react';
import './NavigatorMessage.css';

/**
 * Format timestamp
 */
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

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
 * NavigatorMessage Component
 */
const NavigatorMessage = ({
  message,
  isNavigator = false,
  navigatorExpression = 'default',
  navigatorName = 'Navigator',
  userName = 'You',
  userStage = 1,
  onActionClick,
  onSuggestionClick,
  onFeedback,
  className = '',
  ...props
}) => {
  const [feedbackGiven, setFeedbackGiven] = useState(null);
  
  if (!message) return null;
  
  const {
    id,
    type = 'text', // text, suggestion, action, system, typing
    content,
    timestamp,
    suggestions = [],
    actions = [],
    metadata = {}
  } = message;
  
  const beaconColor = getBeaconColor(userStage);
  
  const handleFeedback = (isPositive) => {
    setFeedbackGiven(isPositive);
    if (onFeedback) {
      onFeedback(id, isPositive);
    }
  };
  
  const handleActionClick = (action) => {
    if (onActionClick) {
      onActionClick(action);
    }
  };
  
  const handleSuggestionClick = (suggestion) => {
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
  };
  
  const classNames = [
    'navigator-message',
    isNavigator ? 'navigator-message--navigator' : 'navigator-message--user',
    `navigator-message--${type}`,
    className
  ].filter(Boolean).join(' ');
  
  // Typing indicator
  if (type === 'typing') {
    return (
      <div className={classNames} style={{ '--beacon-color': beaconColor }}>
        <div className="navigator-message__avatar navigator-message__avatar--navigator">
          <span className="navigator-message__avatar-icon">🧭</span>
        </div>
        <div className="navigator-message__content">
          <div className="navigator-message__typing">
            <span className="navigator-message__typing-dot" />
            <span className="navigator-message__typing-dot" />
            <span className="navigator-message__typing-dot" />
          </div>
        </div>
      </div>
    );
  }
  
  // System message
  if (type === 'system') {
    return (
      <div className="navigator-message navigator-message--system">
        <div className="navigator-message__system-content">
          <span className="navigator-message__system-icon">ℹ️</span>
          <span className="navigator-message__system-text">{content}</span>
        </div>
        {timestamp && (
          <span className="navigator-message__system-time">{formatTime(timestamp)}</span>
        )}
      </div>
    );
  }
  
  return (
    <div className={classNames} style={{ '--beacon-color': beaconColor }} {...props}>
      {/* Avatar */}
      <div className={`navigator-message__avatar ${isNavigator ? 'navigator-message__avatar--navigator' : 'navigator-message__avatar--user'}`}>
        {isNavigator ? (
          <span className="navigator-message__avatar-icon">🧭</span>
        ) : (
          <span className="navigator-message__avatar-initial">{userName.charAt(0).toUpperCase()}</span>
        )}
      </div>
      
      {/* Message Content */}
      <div className="navigator-message__content">
        {/* Sender Name */}
        <span className="navigator-message__sender">
          {isNavigator ? navigatorName : userName}
          {isNavigator && (
            <span className="navigator-message__navigator-badge">AI Guide</span>
          )}
        </span>
        
        {/* Message Bubble */}
        <div className="navigator-message__bubble">
          {/* Text Content */}
          <div className="navigator-message__text">
            {content}
          </div>
          
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="navigator-message__suggestions">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  className="navigator-message__suggestion-btn"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.icon && (
                    <span className="navigator-message__suggestion-icon">{suggestion.icon}</span>
                  )}
                  {suggestion.text || suggestion}
                </button>
              ))}
            </div>
          )}
          
          {/* Actions */}
          {actions.length > 0 && (
            <div className="navigator-message__actions">
              {actions.map((action, index) => (
                <button
                  key={index}
                  type="button"
                  className={`navigator-message__action-btn navigator-message__action-btn--${action.variant || 'default'}`}
                  onClick={() => handleActionClick(action)}
                >
                  {action.icon && (
                    <span className="navigator-message__action-icon">{action.icon}</span>
                  )}
                  {action.label}
                </button>
              ))}
            </div>
          )}
          
          {/* Mission/Bite Reference */}
          {metadata.missionRef && (
            <div className="navigator-message__reference">
              <span className="navigator-message__reference-icon">🎯</span>
              <span className="navigator-message__reference-text">
                {metadata.missionRef.name}
              </span>
              <span className="navigator-message__reference-stage">
                Stage {metadata.missionRef.stage}
              </span>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="navigator-message__footer">
          {timestamp && (
            <span className="navigator-message__time">{formatTime(timestamp)}</span>
          )}
          
          {/* Feedback for Navigator messages */}
          {isNavigator && type !== 'system' && (
            <div className="navigator-message__feedback">
              {feedbackGiven === null ? (
                <>
                  <button
                    type="button"
                    className="navigator-message__feedback-btn"
                    onClick={() => handleFeedback(true)}
                    title="Helpful"
                  >
                    👍
                  </button>
                  <button
                    type="button"
                    className="navigator-message__feedback-btn"
                    onClick={() => handleFeedback(false)}
                    title="Not helpful"
                  >
                    👎
                  </button>
                </>
              ) : (
                <span className="navigator-message__feedback-given">
                  {feedbackGiven ? '✓ Thanks!' : '✓ Noted'}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavigatorMessage;