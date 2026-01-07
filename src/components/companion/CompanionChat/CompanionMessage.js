/**
 * GPS Lab Platform - CompanionMessage Component
 * 
 * Individual message bubble for Companion AI chat,
 * supporting code snippets, hints, and contextual help.
 * 
 * @module components/companion/CompanionChat/CompanionMessage
 */

import React, { useState } from 'react';
import './CompanionMessage.css';

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
 * CompanionMessage Component
 */
const CompanionMessage = ({
  message,
  isCompanion = false,
  companionName = 'Companion',
  userName = 'You',
  onActionClick,
  onCopyCode,
  className = '',
  ...props
}) => {
  const [isCodeCopied, setIsCodeCopied] = useState(false);
  
  if (!message) return null;
  
  const {
    id,
    type = 'text', // text, hint, code, resource, typing
    content,
    timestamp,
    codeLanguage,
    resourceLink,
    hintLevel = 1, // 1-3 for hint intensity
    metadata = {}
  } = message;
  
  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCodeCopied(true);
      setTimeout(() => setIsCodeCopied(false), 2000);
      if (onCopyCode) {
        onCopyCode(code);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  const handleActionClick = (action) => {
    if (onActionClick) {
      onActionClick(action);
    }
  };
  
  const classNames = [
    'companion-message',
    isCompanion ? 'companion-message--companion' : 'companion-message--user',
    `companion-message--${type}`,
    className
  ].filter(Boolean).join(' ');
  
  // Typing indicator
  if (type === 'typing') {
    return (
      <div className={classNames}>
        <div className="companion-message__avatar companion-message__avatar--companion">
          <span className="companion-message__avatar-icon">🤖</span>
        </div>
        <div className="companion-message__content">
          <div className="companion-message__typing">
            <span className="companion-message__typing-dot" />
            <span className="companion-message__typing-dot" />
            <span className="companion-message__typing-dot" />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={classNames} {...props}>
      {/* Avatar */}
      <div className={`companion-message__avatar ${isCompanion ? 'companion-message__avatar--companion' : 'companion-message__avatar--user'}`}>
        {isCompanion ? (
          <span className="companion-message__avatar-icon">🤖</span>
        ) : (
          <span className="companion-message__avatar-initial">{userName.charAt(0).toUpperCase()}</span>
        )}
      </div>
      
      {/* Message Content */}
      <div className="companion-message__content">
        {/* Sender Name */}
        <span className="companion-message__sender">
          {isCompanion ? companionName : userName}
          {isCompanion && (
            <span className="companion-message__companion-badge">Bite Assistant</span>
          )}
        </span>
        
        {/* Message Bubble */}
        <div className="companion-message__bubble">
          {/* Hint Type */}
          {type === 'hint' && (
            <div className="companion-message__hint-header">
              <span className="companion-message__hint-icon">
                {hintLevel === 1 && '💡'}
                {hintLevel === 2 && '🔍'}
                {hintLevel === 3 && '🎯'}
              </span>
              <span className="companion-message__hint-label">
                {hintLevel === 1 && 'Gentle Hint'}
                {hintLevel === 2 && 'Helpful Hint'}
                {hintLevel === 3 && 'Direct Guidance'}
              </span>
            </div>
          )}
          
          {/* Text Content */}
          {type !== 'code' && (
            <div className="companion-message__text">
              {content}
            </div>
          )}
          
          {/* Code Block */}
          {type === 'code' && (
            <div className="companion-message__code-block">
              <div className="companion-message__code-header">
                <span className="companion-message__code-language">{codeLanguage || 'code'}</span>
                <button
                  type="button"
                  className="companion-message__code-copy"
                  onClick={() => handleCopyCode(content)}
                >
                  {isCodeCopied ? (
                    <>
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="companion-message__code">
                <code>{content}</code>
              </pre>
            </div>
          )}
          
          {/* Resource Link */}
          {type === 'resource' && resourceLink && (
            <a
              href={resourceLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="companion-message__resource"
            >
              <div className="companion-message__resource-icon">📚</div>
              <div className="companion-message__resource-info">
                <span className="companion-message__resource-title">{resourceLink.title}</span>
                <span className="companion-message__resource-type">{resourceLink.type || 'Resource'}</span>
              </div>
              <svg viewBox="0 0 20 20" fill="currentColor" className="companion-message__resource-arrow">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </a>
          )}
          
          {/* Context Reference */}
          {metadata.biteRef && (
            <div className="companion-message__reference">
              <span className="companion-message__reference-icon">🍕</span>
              <span className="companion-message__reference-text">
                {metadata.biteRef.name}
              </span>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="companion-message__footer">
          {timestamp && (
            <span className="companion-message__time">{formatTime(timestamp)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanionMessage;