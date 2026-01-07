/**
 * GPS Lab Platform - NavigatorChat Component
 * 
 * Complete chat interface for Navigator AI assistant,
 * combining chat window, input, and header components.
 * 
 * @module components/navigator/NavigatorChat/NavigatorChat
 */

import React, { useState, useCallback, useEffect } from 'react';
import NavigatorChatWindow from './NavigatorChatWindow';
import NavigatorInput from './NavigatorInput';
import './NavigatorChat.css';

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
 * NavigatorChat Component
 */
const NavigatorChat = ({
  user = {},
  context = null, // Current mission/bite context
  isOpen = true,
  isMinimized = false,
  onClose,
  onMinimize,
  onMaximize,
  variant = 'panel', // panel, modal, sidebar
  className = '',
  ...props
}) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  
  const {
    id: userId,
    name: userName = 'GPS Student',
    stage: userStage = 1
  } = user;
  
  const beaconColor = getBeaconColor(userStage);
  
  // Simulate initial greeting
  useEffect(() => {
    if (messages.length === 0 && isOpen && !isMinimized) {
      const greeting = {
        id: `nav-${Date.now()}`,
        sender: 'navigator',
        type: 'text',
        content: `Welcome back, ${userName}! 🌟 I see you're at Stage ${userStage}. How can I help you today?`,
        timestamp: new Date().toISOString(),
        suggestions: [
          { icon: '🎯', text: 'Show my current missions' },
          { icon: '📈', text: 'How am I progressing?' },
          { icon: '💡', text: 'What should I focus on?' }
        ]
      };
      
      setTimeout(() => {
        setMessages([greeting]);
      }, 500);
    }
  }, [isOpen, isMinimized, userName, userStage]);
  
  const handleSendMessage = useCallback(async (messageData) => {
    const { content, attachments, context: msgContext, quickAction } = messageData;
    
    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      type: 'text',
      content: content,
      attachments: attachments,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate Navigator response
    setIsTyping(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
    
    setIsTyping(false);
    
    // Generate contextual response
    let response = generateResponse(content, quickAction, msgContext, userStage);
    
    const navigatorMessage = {
      id: `nav-${Date.now()}`,
      sender: 'navigator',
      type: response.type || 'text',
      content: response.content,
      timestamp: new Date().toISOString(),
      suggestions: response.suggestions || [],
      actions: response.actions || [],
      metadata: response.metadata || {}
    };
    
    setMessages(prev => [...prev, navigatorMessage]);
  }, [userStage]);
  
  const handleSuggestionClick = useCallback((suggestion) => {
    const text = typeof suggestion === 'string' ? suggestion : suggestion.text;
    handleSendMessage({ content: text, attachments: [] });
  }, [handleSendMessage]);
  
  const handleActionClick = useCallback((action) => {
    if (action.handler) {
      action.handler();
    } else if (action.navigate) {
      window.location.href = action.navigate;
    }
  }, []);
  
  const handleFeedback = useCallback((messageId, isPositive) => {
    console.log('Feedback:', messageId, isPositive ? 'positive' : 'negative');
    // Would send feedback to API
  }, []);
  
  if (!isOpen) return null;
  
  const classNames = [
    'navigator-chat',
    `navigator-chat--${variant}`,
    isMinimized && 'navigator-chat--minimized',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} style={{ '--beacon-color': beaconColor }} {...props}>
      {/* Header */}
      <header className="navigator-chat__header">
        <div className="navigator-chat__header-left">
          <div className="navigator-chat__avatar">
            <span className="navigator-chat__avatar-icon">🧭</span>
            <span className={`navigator-chat__status ${isConnected ? 'navigator-chat__status--online' : ''}`} />
          </div>
          <div className="navigator-chat__info">
            <h3 className="navigator-chat__title">Navigator</h3>
            <span className="navigator-chat__subtitle">
              {isTyping ? 'Typing...' : isConnected ? 'Your AI Guide' : 'Reconnecting...'}
            </span>
          </div>
        </div>
        
        <div className="navigator-chat__header-actions">
          {onMinimize && (
            <button
              type="button"
              className="navigator-chat__header-btn"
              onClick={isMinimized ? onMaximize : onMinimize}
              title={isMinimized ? 'Maximize' : 'Minimize'}
            >
              {isMinimized ? (
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
              )}
            </button>
          )}
          {onClose && (
            <button
              type="button"
              className="navigator-chat__header-btn"
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
          {/* Chat Window */}
          <NavigatorChatWindow
            messages={messages}
            isTyping={isTyping}
            currentUserId={userId}
            userName={userName}
            userStage={userStage}
            onActionClick={handleActionClick}
            onSuggestionClick={handleSuggestionClick}
            onFeedback={handleFeedback}
          />
          
          {/* Input */}
          <NavigatorInput
            onSend={handleSendMessage}
            context={context}
            placeholder={`Ask Navigator about Stage ${userStage}...`}
          />
        </>
      )}
    </div>
  );
};

/**
 * Generate contextual response based on user input
 */
function generateResponse(content, quickAction, context, userStage) {
  const lowerContent = content.toLowerCase();
  
  // Quick action responses
  if (quickAction === 'help') {
    return {
      content: "I'm here to help! Here are some things I can assist you with:",
      suggestions: [
        { icon: '📋', text: 'Explain my current mission' },
        { icon: '🔧', text: 'Help with a specific bite' },
        { icon: '📈', text: 'Show my progress' },
        { icon: '🎓', text: 'Learning resources' }
      ]
    };
  }
  
  if (quickAction === 'suggest') {
    return {
      content: `Based on your Stage ${userStage} progress, I recommend focusing on completing your active bites first. This will help you maintain momentum and earn more Baraka! 🪙`,
      actions: [
        { label: 'View Active Bites', icon: '🍕', variant: 'primary', navigate: '/bites' },
        { label: 'Check Missions', icon: '🎯', navigate: '/missions' }
      ]
    };
  }
  
  // Mission-related queries
  if (lowerContent.includes('mission')) {
    return {
      content: 'Missions are structured learning experiences that guide you through real-world problem-solving. Each mission has multiple bites (smaller tasks) that build toward a checkpoint evaluation.',
      suggestions: [
        { icon: '📋', text: 'Show active missions' },
        { icon: '🎯', text: 'How to accept a mission?' },
        { icon: '🏁', text: 'What are checkpoints?' }
      ],
      metadata: {
        missionRef: { name: 'Current Mission', stage: userStage }
      }
    };
  }
  
  // Progress queries
  if (lowerContent.includes('progress') || lowerContent.includes('how am i doing')) {
    return {
      content: `You're doing great at Stage ${userStage}! 🌟 You've been making steady progress. Keep up the excellent work and remember - every bite completed brings you closer to your goals!`,
      actions: [
        { label: 'View Dashboard', icon: '📊', variant: 'primary', navigate: '/dashboard' }
      ]
    };
  }
  
  // Baraka queries
  if (lowerContent.includes('baraka') || lowerContent.includes('earn')) {
    return {
      content: 'Baraka is our in-platform currency! You can earn it by: completing bites (10-50 🪙), passing checkpoints (100-500 🪙), giving praise to others (5 🪙), and achieving milestones. Use Baraka to unlock study resources, get retry rights, or save for withdrawal!',
      suggestions: [
        { icon: '💰', text: 'Check my Baraka balance' },
        { icon: '🛒', text: 'Visit the Baraka store' }
      ]
    };
  }
  
  // Stage queries
  if (lowerContent.includes('stage') || lowerContent.includes('explain')) {
    const stageInfo = {
      1: 'Spark - Discover your passion and identify problems worth solving',
      2: 'Explore - Research the problem deeply and understand your target users',
      3: 'Design - Create solutions and prototype your ideas',
      4: 'Build - Develop your minimum viable product',
      5: 'Test - Validate with real users and iterate',
      6: 'Launch - Go to market and acquire customers',
      7: 'Scale - Grow your impact and reach more people'
    };
    
    return {
      content: `You're currently at Stage ${userStage}: ${stageInfo[userStage] || 'Unknown'}. Each stage builds on the previous one, developing your skills as a Global Problem Solver. The beacon colors guide your journey! 🌈`,
      suggestions: [
        { icon: '📚', text: 'Stage learning resources' },
        { icon: '🎯', text: 'Stage missions available' }
      ]
    };
  }
  
  // Bite queries
  if (lowerContent.includes('bite')) {
    return {
      content: 'Bites are small, manageable tasks within a mission. Think of them as "bite-sized" pieces of work. Complete all bites in a mission to unlock the checkpoint! Each bite has clear acceptance criteria and earns you Baraka.',
      actions: [
        { label: 'View My Bites', icon: '🍕', variant: 'primary', navigate: '/bites' }
      ]
    };
  }
  
  // Party/team queries
  if (lowerContent.includes('party') || lowerContent.includes('team')) {
    return {
      content: 'Parties are collaborative teams in GPS Lab! You can form a party with 2-5 members to tackle missions together. Parties share experience, can divide bites, and support each other through challenges. 🎉',
      suggestions: [
        { icon: '👥', text: 'Create a party' },
        { icon: '🔍', text: 'Find a party to join' }
      ]
    };
  }
  
  // Default response
  return {
    content: `Thanks for your message! As your Navigator, I'm here to guide you through the GPS Lab journey. Feel free to ask me about missions, bites, your progress, or any platform features. What would you like to know more about?`,
    suggestions: [
      { icon: '🎯', text: 'Tell me about missions' },
      { icon: '📈', text: 'Show my progress' },
      { icon: '🪙', text: 'How to earn Baraka?' }
    ]
  };
}

export default NavigatorChat;