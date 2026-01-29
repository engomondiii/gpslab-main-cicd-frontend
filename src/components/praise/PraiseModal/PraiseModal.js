/**
 * GPS Lab Platform - PraiseModal Component
 * 
 * Modal dialog for composing and sending praise messages
 * with templates, custom messages, and recipient selection.
 * 
 * @module components/praise/PraiseModal/PraiseModal
 */

import React, { useState, useCallback, useEffect } from 'react';
import PraiseTemplates from './PraiseTemplates';
import './PraiseModal.css';

/**
 * Character badges for praise
 */
const CHARACTER_BADGES = [
  { id: 'courage', emoji: '🦁', label: 'Courage' },
  { id: 'humility', emoji: '🙏', label: 'Humility' },
  { id: 'integrity', emoji: '💎', label: 'Integrity' },
  { id: 'excellence', emoji: '⭐', label: 'Excellence' },
  { id: 'compassion', emoji: '❤️', label: 'Compassion' },
  { id: 'wisdom', emoji: '🦉', label: 'Wisdom' },
  { id: 'stewardship', emoji: '🌱', label: 'Stewardship' },
  { id: 'resilience', emoji: '💪', label: 'Resilience' }
];

/**
 * PraiseModal Component
 */
const PraiseModal = ({
  isOpen = false,
  recipient = null,
  language = 'en',
  onClose,
  onSend,
  isLoading = false,
  className = '',
  ...props
}) => {
  const [mode, setMode] = useState('template'); // template, custom
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customMessage, setCustomMessage] = useState('');
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [isPublic, setIsPublic] = useState(true);
  
  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode('template');
      setSelectedTemplate(null);
      setCustomMessage('');
      setSelectedBadge(null);
      setIsPublic(true);
    }
  }, [isOpen]);
  
  const handleSend = useCallback(() => {
    const praiseData = {
      recipient: recipient,
      message: mode === 'template' ? selectedTemplate?.text : customMessage,
      emoji: mode === 'template' ? selectedTemplate?.emoji : '🎉',
      badge: selectedBadge,
      isPublic: isPublic,
      language: language
    };
    
    if (onSend) {
      onSend(praiseData);
    }
  }, [mode, selectedTemplate, customMessage, selectedBadge, isPublic, recipient, language, onSend]);
  
  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  }, [onClose]);
  
  const isValidPraise = mode === 'template' 
    ? selectedTemplate !== null 
    : customMessage.trim().length > 0;
  
  if (!isOpen) return null;
  
  const classNames = [
    'praise-modal',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className="praise-modal__overlay" onClick={handleOverlayClick}>
      <div className={classNames} {...props}>
        {/* Header */}
        <header className="praise-modal__header">
          <div className="praise-modal__header-content">
            <span className="praise-modal__header-icon">🎉</span>
            <div className="praise-modal__header-text">
              <h2 className="praise-modal__title">Give Praise</h2>
              {recipient && (
                <p className="praise-modal__recipient">
                  to <strong>{recipient.name || recipient}</strong>
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            className="praise-modal__close-btn"
            onClick={onClose}
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </header>
        
        {/* Content */}
        <div className="praise-modal__content">
          {/* Mode Toggle */}
          <div className="praise-modal__mode-toggle">
            <button
              type="button"
              className={`praise-modal__mode-btn ${mode === 'template' ? 'praise-modal__mode-btn--active' : ''}`}
              onClick={() => setMode('template')}
            >
              <span className="praise-modal__mode-icon">📝</span>
              Templates
            </button>
            <button
              type="button"
              className={`praise-modal__mode-btn ${mode === 'custom' ? 'praise-modal__mode-btn--active' : ''}`}
              onClick={() => setMode('custom')}
            >
              <span className="praise-modal__mode-icon">✏️</span>
              Custom
            </button>
          </div>
          
          {/* Template Mode */}
          {mode === 'template' && (
            <PraiseTemplates
              language={language}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
            />
          )}
          
          {/* Custom Mode */}
          {mode === 'custom' && (
            <div className="praise-modal__custom">
              <div className="praise-modal__custom-header">
                <label className="praise-modal__custom-label">
                  Write your message
                </label>
                <span className="praise-modal__custom-count">
                  {customMessage.length}/500
                </span>
              </div>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value.slice(0, 500))}
                placeholder="Share your encouragement, appreciation, or celebration..."
                className="praise-modal__custom-textarea"
                rows={4}
              />
            </div>
          )}
          
          {/* Character Badge Selection */}
          <div className="praise-modal__badges">
            <label className="praise-modal__badges-label">
              Award a character badge (optional)
            </label>
            <div className="praise-modal__badges-grid">
              {CHARACTER_BADGES.map((badge) => (
                <button
                  key={badge.id}
                  type="button"
                  className={`praise-modal__badge ${selectedBadge?.id === badge.id ? 'praise-modal__badge--selected' : ''}`}
                  onClick={() => setSelectedBadge(selectedBadge?.id === badge.id ? null : badge)}
                  title={badge.label}
                >
                  <span className="praise-modal__badge-emoji">{badge.emoji}</span>
                  <span className="praise-modal__badge-label">{badge.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Visibility Toggle */}
          <div className="praise-modal__visibility">
            <label className="praise-modal__visibility-label">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="praise-modal__visibility-checkbox"
              />
              <span className="praise-modal__visibility-text">
                <span className="praise-modal__visibility-icon">{isPublic ? '🌍' : '🔒'}</span>
                {isPublic ? 'Share on Praise Wall' : 'Send privately'}
              </span>
            </label>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="praise-modal__footer">
          <button
            type="button"
            className="praise-modal__cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="praise-modal__send-btn"
            onClick={handleSend}
            disabled={!isValidPraise || isLoading}
          >
            {isLoading ? (
              <>
                <span className="praise-modal__spinner" />
                Sending...
              </>
            ) : (
              <>
                <span className="praise-modal__send-icon">🎉</span>
                Send Praise
                <span className="praise-modal__baraka">+5 🪙</span>
              </>
            )}
          </button>
        </footer>
        
        {/* Confetti Effect (shown on successful send) */}
      </div>
    </div>
  );
};

export default PraiseModal;