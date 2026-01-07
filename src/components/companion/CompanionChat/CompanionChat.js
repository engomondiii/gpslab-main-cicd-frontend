/**
 * GPS Lab Platform - CompanionChat Component
 * 
 * Complete chat interface for Companion AI assistant
 * that provides bite-level guidance and support.
 * 
 * @module components/companion/CompanionChat/CompanionChat
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import CompanionMessage from './CompanionMessage';
import './CompanionChat.css';

/**
 * CompanionChat Component
 */
const CompanionChat = ({
  bite = null, // Current bite context
  user = {},
  isOpen = true,
  isMinimized = false,
  onClose,
  onMinimize,
  onMaximize,
  className = '',
  ...props
}) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hintLevel, setHintLevel] = useState(1);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const {
    name: userName = 'GPS Student'
  } = user;
  
  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);
  
  // Initial greeting when bite context changes
  useEffect(() => {
    if (bite && isOpen && !isMinimized) {
      const greeting = {
        id: `comp-${Date.now()}`,
        sender: 'companion',
        type: 'text',
        content: `Hi! I'm here to help you with "${bite.name}". What would you like to work on? I can provide hints, explain concepts, or help you debug issues.`,
        timestamp: new Date().toISOString(),
        metadata: { biteRef: { name: bite.name } }
      };
      
      setMessages([greeting]);
      setHintLevel(1);
    }
  }, [bite?.id, isOpen, isMinimized]);
  
  const handleSend = useCallback(async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    
    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      type: 'text',
      content: trimmed,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simulate companion response
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));
    setIsTyping(false);
    
    const response = generateCompanionResponse(trimmed, bite, hintLevel);
    
    const companionMessage = {
      id: `comp-${Date.now()}`,
      sender: 'companion',
      ...response,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, companionMessage]);
  }, [inputValue, bite, hintLevel]);
  
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);
  
  const handleQuickAction = useCallback(async (action) => {
    // Add user action as message
    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      type: 'text',
      content: action.label,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate response
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800));
    setIsTyping(false);
    
    let response;
    
    if (action.id === 'hint') {
      response = {
        type: 'hint',
        hintLevel: hintLevel,
        content: getHint(bite, hintLevel)
      };
      setHintLevel(prev => Math.min(prev + 1, 3));
    } else if (action.id === 'explain') {
      response = {
        type: 'text',
        content: `Let me explain the concept behind this bite. ${bite?.description || 'This task involves breaking down a larger problem into smaller, manageable pieces.'}`
      };
    } else if (action.id === 'example') {
      response = {
        type: 'code',
        codeLanguage: 'javascript',
        content: `// Example code for ${bite?.name || 'this task'}\nfunction example() {\n  // Step 1: Define the problem\n  const problem = "...";\n  \n  // Step 2: Break it down\n  const steps = problem.split(",");\n  \n  // Step 3: Solve each step\n  return steps.map(step => solve(step));\n}`
      };
    } else if (action.id === 'resources') {
      response = {
        type: 'resource',
        content: 'Here\'s a helpful resource for this topic:',
        resourceLink: {
          title: 'GPS Lab Learning Guide',
          type: 'Documentation',
          url: '#'
        }
      };
    }
    
    const companionMessage = {
      id: `comp-${Date.now()}`,
      sender: 'companion',
      ...response,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, companionMessage]);
  }, [bite, hintLevel]);
  
  if (!isOpen) return null;
  
  const classNames = [
    'companion-chat',
    isMinimized && 'companion-chat--minimized',
    className
  ].filter(Boolean).join(' ');
  
  const quickActions = [
    { id: 'hint', icon: '💡', label: 'Get a hint' },
    { id: 'explain', icon: '📖', label: 'Explain concept' },
    { id: 'example', icon: '💻', label: 'Show example' },
    { id: 'resources', icon: '📚', label: 'Resources' }
  ];
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <header className="companion-chat__header">
        <div className="companion-chat__header-left">
          <div className="companion-chat__avatar">
            <span className="companion-chat__avatar-icon">🤖</span>
            <span className="companion-chat__status" />
          </div>
          <div className="companion-chat__info">
            <h3 className="companion-chat__title">Companion</h3>
            <span className="companion-chat__subtitle">
              {isTyping ? 'Typing...' : 'Bite Assistant'}
            </span>
          </div>
        </div>
        
        <div className="companion-chat__header-actions">
          {onMinimize && (
            <button
              type="button"
              className="companion-chat__header-btn"
              onClick={isMinimized ? onMaximize : onMinimize}
              title={isMinimized ? 'Maximize' : 'Minimize'}
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
            </button>
          )}
          {onClose && (
            <button
              type="button"
              className="companion-chat__header-btn"
              onClick={onClose}
              title="Close"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
          )}
        </div>
      </header>
      
      {/* Content */}
      {!isMinimized && (
        <>
          {/* Bite Context */}
          {bite && (
            <div className="companion-chat__context">
              <span className="companion-chat__context-icon">🍕</span>
              <span className="companion-chat__context-name">{bite.name}</span>
              <span className="companion-chat__context-status">{bite.status || 'In Progress'}</span>
            </div>
          )}
          
          {/* Messages */}
          <div className="companion-chat__messages">
            {messages.map((message, index) => (
              <CompanionMessage
                key={message.id || index}
                message={message}
                isCompanion={message.sender === 'companion'}
                userName={userName}
              />
            ))}
            
            {isTyping && (
              <CompanionMessage
                message={{ type: 'typing' }}
                isCompanion={true}
              />
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Quick Actions */}
          <div className="companion-chat__quick-actions">
            {quickActions.map(action => (
              <button
                key={action.id}
                type="button"
                className="companion-chat__quick-btn"
                onClick={() => handleQuickAction(action)}
              >
                <span className="companion-chat__quick-icon">{action.icon}</span>
                <span className="companion-chat__quick-label">{action.label}</span>
              </button>
            ))}
          </div>
          
          {/* Input */}
          <div className="companion-chat__input-container">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Companion for help..."
              className="companion-chat__input"
              rows={1}
            />
            <button
              type="button"
              className="companion-chat__send-btn"
              onClick={handleSend}
              disabled={!inputValue.trim()}
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

/**
 * Generate contextual companion response
 */
function generateCompanionResponse(input, bite, hintLevel) {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('stuck') || lowerInput.includes('help')) {
    return {
      type: 'hint',
      hintLevel: hintLevel,
      content: getHint(bite, hintLevel)
    };
  }
  
  if (lowerInput.includes('code') || lowerInput.includes('example')) {
    return {
      type: 'code',
      codeLanguage: 'javascript',
      content: '// Here\'s a starting point\nfunction solution() {\n  // Your code here\n  return result;\n}'
    };
  }
  
  if (lowerInput.includes('why') || lowerInput.includes('explain')) {
    return {
      type: 'text',
      content: `Great question! Understanding the "why" is crucial. ${bite?.description || 'This concept helps you build a foundation for solving complex problems by breaking them into smaller, testable pieces.'}`
    };
  }
  
  return {
    type: 'text',
    content: 'I\'m here to help! You can ask me for hints, request code examples, or get explanations of concepts. What would be most helpful right now?'
  };
}

/**
 * Get hint based on level
 */
function getHint(bite, level) {
  const hints = {
    1: `Think about the core problem you're trying to solve. What's the main input and expected output?`,
    2: `Try breaking down the problem into smaller steps. What's the first thing that needs to happen?`,
    3: `Here's a direct approach: Start by ${bite?.name ? `focusing on the key requirement of ${bite.name}` : 'identifying the simplest possible solution, then iterate from there'}.`
  };
  
  return hints[level] || hints[1];
}

export default CompanionChat;