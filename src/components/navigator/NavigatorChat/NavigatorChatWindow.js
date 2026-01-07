/**
 * GPS Lab Platform - NavigatorChatWindow Component
 * 
 * Scrollable chat window container with message list,
 * auto-scroll, and scroll-to-bottom functionality.
 * 
 * @module components/navigator/NavigatorChat/NavigatorChatWindow
 */

import React, { useRef, useEffect, useCallback, useState } from 'react';
import NavigatorMessage from './NavigatorMessage';
import './NavigatorChatWindow.css';

/**
 * NavigatorChatWindow Component
 */
const NavigatorChatWindow = ({
  messages = [],
  isTyping = false,
  currentUserId,
  userName = 'You',
  navigatorName = 'Navigator',
  userStage = 1,
  onActionClick,
  onSuggestionClick,
  onFeedback,
  onScrollTop,
  hasMoreMessages = false,
  isLoadingMore = false,
  className = '',
  ...props
}) => {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isNearBottom && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isNearBottom]);
  
  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    
    // Check if near bottom
    setIsNearBottom(distanceFromBottom < 100);
    setShowScrollButton(distanceFromBottom > 300);
    
    // Load more messages when scrolled to top
    if (scrollTop < 50 && hasMoreMessages && !isLoadingMore && onScrollTop) {
      onScrollTop();
    }
  }, [hasMoreMessages, isLoadingMore, onScrollTop]);
  
  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  
  const classNames = [
    'navigator-chat-window',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Messages Container */}
      <div
        ref={containerRef}
        className="navigator-chat-window__container"
        onScroll={handleScroll}
      >
        {/* Loading More Indicator */}
        {isLoadingMore && (
          <div className="navigator-chat-window__loading-more">
            <div className="navigator-chat-window__loading-spinner" />
            <span>Loading earlier messages...</span>
          </div>
        )}
        
        {/* Empty State */}
        {messages.length === 0 && !isTyping && (
          <div className="navigator-chat-window__empty">
            <div className="navigator-chat-window__empty-avatar">🧭</div>
            <h3 className="navigator-chat-window__empty-title">
              Hi, I'm Navigator!
            </h3>
            <p className="navigator-chat-window__empty-text">
              I'm your AI guide through the GPS Lab journey. Ask me anything about missions, bites, or your progress. I'm here to help you succeed!
            </p>
            <div className="navigator-chat-window__empty-suggestions">
              <button
                type="button"
                onClick={() => onSuggestionClick && onSuggestionClick({ text: 'What should I do next?' })}
                className="navigator-chat-window__empty-btn"
              >
                What should I do next?
              </button>
              <button
                type="button"
                onClick={() => onSuggestionClick && onSuggestionClick({ text: 'Explain my current stage' })}
                className="navigator-chat-window__empty-btn"
              >
                Explain my current stage
              </button>
              <button
                type="button"
                onClick={() => onSuggestionClick && onSuggestionClick({ text: 'How does GPS Lab work?' })}
                className="navigator-chat-window__empty-btn"
              >
                How does GPS Lab work?
              </button>
            </div>
          </div>
        )}
        
        {/* Messages List */}
        <div className="navigator-chat-window__messages">
          {messages.map((message, index) => (
            <NavigatorMessage
              key={message.id || index}
              message={message}
              isNavigator={message.sender === 'navigator'}
              navigatorName={navigatorName}
              userName={userName}
              userStage={userStage}
              onActionClick={onActionClick}
              onSuggestionClick={onSuggestionClick}
              onFeedback={onFeedback}
            />
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <NavigatorMessage
              message={{ type: 'typing' }}
              isNavigator={true}
              userStage={userStage}
            />
          )}
        </div>
        
        {/* Scroll Anchor */}
        <div ref={bottomRef} className="navigator-chat-window__bottom" />
      </div>
      
      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <button
          type="button"
          className="navigator-chat-window__scroll-btn"
          onClick={scrollToBottom}
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        </button>
      )}
    </div>
  );
};

export default NavigatorChatWindow;