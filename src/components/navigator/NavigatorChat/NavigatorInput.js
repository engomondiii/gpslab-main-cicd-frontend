/**
 * GPS Lab Platform - NavigatorInput Component
 * 
 * Chat input field for Navigator conversation with
 * voice input, quick actions, and file attachments.
 * 
 * @module components/navigator/NavigatorChat/NavigatorInput
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import './NavigatorInput.css';

/**
 * Quick action presets
 */
const QUICK_ACTIONS = [
  { id: 'help', icon: '❓', label: 'Help', message: 'I need help with my current mission' },
  { id: 'suggest', icon: '💡', label: 'Suggest', message: 'What should I do next?' },
  { id: 'explain', icon: '📚', label: 'Explain', message: 'Can you explain this concept?' },
  { id: 'review', icon: '✅', label: 'Review', message: 'Can you review my work?' }
];

/**
 * NavigatorInput Component
 */
const NavigatorInput = ({
  onSend,
  onVoiceStart,
  onVoiceEnd,
  onTyping,
  isDisabled = false,
  isVoiceEnabled = true,
  placeholder = 'Ask Navigator anything...',
  maxLength = 2000,
  showQuickActions = true,
  context = null, // Current mission/bite context
  className = '',
  ...props
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [message]);
  
  const handleChange = useCallback((e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setMessage(value);
      
      // Typing indicator
      if (onTyping) {
        onTyping(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          onTyping(false);
        }, 1000);
      }
    }
  }, [maxLength, onTyping]);
  
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, []);
  
  const handleSend = useCallback(() => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage && attachments.length === 0) return;
    
    if (onSend) {
      onSend({
        content: trimmedMessage,
        attachments: attachments,
        context: context
      });
    }
    
    setMessage('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [message, attachments, context, onSend]);
  
  const handleQuickAction = useCallback((action) => {
    if (onSend) {
      onSend({
        content: action.message,
        attachments: [],
        context: context,
        quickAction: action.id
      });
    }
  }, [context, onSend]);
  
  const handleVoiceToggle = useCallback(() => {
    if (isRecording) {
      setIsRecording(false);
      if (onVoiceEnd) {
        onVoiceEnd();
      }
    } else {
      setIsRecording(true);
      if (onVoiceStart) {
        onVoiceStart();
      }
    }
  }, [isRecording, onVoiceStart, onVoiceEnd]);
  
  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: `attach-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      file: file
    }));
    setAttachments(prev => [...prev, ...newAttachments].slice(0, 5));
    setShowAttachMenu(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);
  
  const handleRemoveAttachment = useCallback((attachmentId) => {
    setAttachments(prev => prev.filter(a => a.id !== attachmentId));
  }, []);
  
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  const classNames = [
    'navigator-input',
    isDisabled && 'navigator-input--disabled',
    isRecording && 'navigator-input--recording',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Quick Actions */}
      {showQuickActions && !message && attachments.length === 0 && (
        <div className="navigator-input__quick-actions">
          {QUICK_ACTIONS.map(action => (
            <button
              key={action.id}
              type="button"
              className="navigator-input__quick-btn"
              onClick={() => handleQuickAction(action)}
              disabled={isDisabled}
            >
              <span className="navigator-input__quick-icon">{action.icon}</span>
              <span className="navigator-input__quick-label">{action.label}</span>
            </button>
          ))}
        </div>
      )}
      
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="navigator-input__attachments">
          {attachments.map(attachment => (
            <div key={attachment.id} className="navigator-input__attachment">
              <span className="navigator-input__attachment-icon">
                {attachment.type.startsWith('image/') ? '🖼️' : '📎'}
              </span>
              <div className="navigator-input__attachment-info">
                <span className="navigator-input__attachment-name">{attachment.name}</span>
                <span className="navigator-input__attachment-size">{formatFileSize(attachment.size)}</span>
              </div>
              <button
                type="button"
                className="navigator-input__attachment-remove"
                onClick={() => handleRemoveAttachment(attachment.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Input Area */}
      <div className="navigator-input__container">
        {/* Attach Button */}
        <div className="navigator-input__attach-wrapper">
          <button
            type="button"
            className="navigator-input__attach-btn"
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            disabled={isDisabled}
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd"/>
            </svg>
          </button>
          
          {showAttachMenu && (
            <div className="navigator-input__attach-menu">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="navigator-input__attach-option"
              >
                <span className="navigator-input__attach-option-icon">📄</span>
                File
              </button>
              <button
                type="button"
                onClick={() => {
                  fileInputRef.current?.setAttribute('accept', 'image/*');
                  fileInputRef.current?.click();
                }}
                className="navigator-input__attach-option"
              >
                <span className="navigator-input__attach-option-icon">🖼️</span>
                Image
              </button>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="navigator-input__file-input"
            accept="*/*"
          />
        </div>
        
        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={isRecording ? 'Listening...' : placeholder}
          disabled={isDisabled || isRecording}
          className="navigator-input__textarea"
          rows={1}
        />
        
        {/* Character Count */}
        {message.length > maxLength * 0.8 && (
          <span className="navigator-input__char-count">
            {message.length}/{maxLength}
          </span>
        )}
        
        {/* Voice Button */}
        {isVoiceEnabled && (
          <button
            type="button"
            className={`navigator-input__voice-btn ${isRecording ? 'navigator-input__voice-btn--recording' : ''}`}
            onClick={handleVoiceToggle}
            disabled={isDisabled}
          >
            {isRecording ? (
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd"/>
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd"/>
              </svg>
            )}
          </button>
        )}
        
        {/* Send Button */}
        <button
          type="button"
          className="navigator-input__send-btn"
          onClick={handleSend}
          disabled={isDisabled || (!message.trim() && attachments.length === 0)}
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
          </svg>
        </button>
      </div>
      
      {/* Context Indicator */}
      {context && (
        <div className="navigator-input__context">
          <span className="navigator-input__context-icon">
            {context.type === 'mission' ? '🎯' : '🍕'}
          </span>
          <span className="navigator-input__context-text">
            Discussing: {context.name}
          </span>
        </div>
      )}
    </div>
  );
};

export default NavigatorInput;