/**
 * GPS Lab Platform - NavigatorChat Component
 * GPS 101 INTEGRATION: GPS 101-aware conversation context, stage guidance, prompts
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
 * NEW: GPS 101 stage information
 */
const GPS101_STAGES = {
  1: { name: 'Identity', question: 'Who am I at my core?', deliverable: 'Identity Statement' },
  2: { name: 'Problem', question: 'What problem breaks my heart?', deliverable: 'Life Problem Candidate' },
  3: { name: 'Owner', question: 'Who is the problem owner?', deliverable: 'Problem Owner Story' },
  4: { name: 'Purpose', question: 'What is my life purpose?', deliverable: 'Life Purpose Statement' },
  5: { name: 'Project', question: 'What will I create?', deliverable: 'Purpose-Driven Project' }
};

/**
 * NavigatorChat Component
 */
const NavigatorChat = ({
  user = {},
  context = null, // Current mission/bite context
  // NEW: GPS 101 props
  isGPS101Context = false,
  gps101Stage = null,
  gps101Checkpoint = null,
  gps101Mission = null,
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
      let greeting;
      
      // NEW: GPS 101 specific greeting
      if (isGPS101Context && gps101Stage) {
        const stageInfo = GPS101_STAGES[gps101Stage];
        greeting = {
          id: `nav-${Date.now()}`,
          sender: 'navigator',
          type: 'text',
          content: `Welcome to GPS 101 Stage ${gps101Stage}: ${stageInfo.name}! 🎓\n\n"${stageInfo.question}"\n\nI'm here to guide you through your purpose discovery journey. How can I help you today?`,
          timestamp: new Date().toISOString(),
          suggestions: [
            { icon: '💡', text: 'Explain this stage' },
            { icon: '📝', text: 'Help with my deliverable' },
            { icon: '🎯', text: 'Show reflection prompts' },
            { icon: '🧭', text: 'Purpose discovery tips' }
          ],
          metadata: { isGPS101: true, stage: gps101Stage }
        };
      } else {
        greeting = {
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
      }
      
      setTimeout(() => {
        setMessages([greeting]);
      }, 500);
    }
  }, [isOpen, isMinimized, userName, userStage, isGPS101Context, gps101Stage]);
  
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
    let response = generateResponse(
      content, 
      quickAction, 
      msgContext, 
      userStage,
      // NEW: GPS 101 context
      isGPS101Context,
      gps101Stage,
      gps101Checkpoint,
      gps101Mission
    );
    
    const navigatorMessage = {
      id: `nav-${Date.now()}`,
      sender: 'navigator',
      type: response.type || 'text',
      content: response.content,
      timestamp: new Date().toISOString(),
      suggestions: response.suggestions || [],
      actions: response.actions || [],
      metadata: { 
        ...response.metadata,
        isGPS101: isGPS101Context,
        gps101Stage
      }
    };
    
    setMessages(prev => [...prev, navigatorMessage]);
  }, [userStage, isGPS101Context, gps101Stage, gps101Checkpoint, gps101Mission]);
  
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
    isGPS101Context && 'navigator-chat--gps101',
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
            <h3 className="navigator-chat__title">
              Navigator
              {/* NEW: GPS 101 indicator */}
              {isGPS101Context && (
                <span className="navigator-chat__gps101-badge">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                  </svg>
                  GPS 101
                </span>
              )}
            </h3>
            <span className="navigator-chat__subtitle">
              {isTyping ? 'Typing...' : isConnected ? (
                isGPS101Context && gps101Stage 
                  ? `Purpose Discovery Guide • Stage ${gps101Stage}`
                  : 'Your AI Guide'
              ) : 'Reconnecting...'}
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
            isGPS101Context={isGPS101Context}
            gps101Stage={gps101Stage}
            onActionClick={handleActionClick}
            onSuggestionClick={handleSuggestionClick}
            onFeedback={handleFeedback}
          />
          
          {/* Input */}
          <NavigatorInput
            onSend={handleSendMessage}
            context={context}
            placeholder={
              isGPS101Context && gps101Stage
                ? `Ask about GPS 101 Stage ${gps101Stage}...`
                : `Ask Navigator about Stage ${userStage}...`
            }
            isGPS101Context={isGPS101Context}
          />
        </>
      )}
    </div>
  );
};

/**
 * Generate contextual response based on user input
 * NEW: Enhanced with GPS 101 context awareness
 */
function generateResponse(content, quickAction, context, userStage, isGPS101Context, gps101Stage, gps101Checkpoint, gps101Mission) {
  const lowerContent = content.toLowerCase();
  
  // NEW: GPS 101 specific responses
  if (isGPS101Context && gps101Stage) {
    const stageInfo = GPS101_STAGES[gps101Stage];
    
    // Explain current stage
    if (lowerContent.includes('explain') || lowerContent.includes('what is') || lowerContent.includes('this stage')) {
      const stageGuidance = {
        1: 'Stage 1 is about deep self-reflection. You\'ll explore your core values, strengths, and passions to create an authentic Identity Statement. This foundation is crucial for everything that follows in your purpose discovery journey.',
        2: 'Stage 2 focuses on identifying a problem that genuinely resonates with who you are. Not just any problem, but one that "breaks your heart" - something you feel compelled to address because of who you are at your core.',
        3: 'Stage 3 is about empathy and understanding. You\'ll research and tell the story of someone (the "problem owner") who experiences the problem you identified. This humanizes the problem and deepens your connection to it.',
        4: 'Stage 4 synthesizes everything you\'ve learned. You\'ll craft your Life Purpose Statement - a declaration of how your unique identity intersects with your chosen problem to create meaningful impact in the world.',
        5: 'Stage 5 is where purpose becomes action. You\'ll design a concrete, purpose-driven project that addresses your problem and embodies your life purpose. This is your first step toward making your purpose real.'
      };
      
      return {
        content: `Great question! ${stageGuidance[gps101Stage]}\n\n**Current Focus:** "${stageInfo.question}"\n**Deliverable:** ${stageInfo.deliverable}\n\nRemember, there are no right or wrong answers - only authentic ones. Take your time with reflection.`,
        suggestions: [
          { icon: '📝', text: 'Help with my deliverable' },
          { icon: '💭', text: 'Reflection prompts' },
          { icon: '✅', text: 'What makes a good submission?' }
        ],
        metadata: { isGPS101: true, stage: gps101Stage }
      };
    }
    
    // Help with deliverable
    if (lowerContent.includes('deliverable') || lowerContent.includes('help') || lowerContent.includes('write')) {
      const deliverableGuidance = {
        1: 'Your Identity Statement should be deeply personal and authentic. Start with "I am someone who..." and include:\n• Your core values (what matters most to you)\n• Your unique strengths and gifts\n• What energizes and drives you\n• What you stand for\n\nAvoid job titles or roles - focus on who you are at your essence.',
        2: 'Your Life Problem Candidate should:\n• Be something that genuinely moves you emotionally\n• Connect to your identity (why does THIS problem matter to YOU?)\n• Be specific enough to work on, but significant in scope\n• Affect real people in meaningful ways\n\nDescribe the problem, its impact, and why it breaks your heart.',
        3: 'Your Problem Owner Story should:\n• Tell a specific, real story about someone experiencing your problem\n• Include concrete details and emotions\n• Show (not just tell) the human impact\n• Help readers understand what it\'s like to live with this problem\n\nYou can anonymize details, but keep it authentic and compassionate.',
        4: 'Your Life Purpose Statement should:\n• Connect your identity to your problem\n• Be specific about your intended impact\n• Feel authentic and personally meaningful\n• Inspire you to action\n\nFormat: "My purpose is to [action] for [who] so that [impact]" - but make it your own!',
        5: 'Your Purpose-Driven Project should:\n• Be concrete and actionable (something you can actually build/launch)\n• Address your identified problem\n• Align with your purpose statement\n• Include your vision for impact\n\nDescribe what you\'ll create, who it serves, and how it embodies your purpose.'
      };
      
      return {
        content: deliverableGuidance[gps101Stage],
        suggestions: [
          { icon: '💭', text: 'Give me reflection prompts' },
          { icon: '📋', text: 'Show examples' },
          { icon: '✓', text: 'Review criteria' }
        ],
        actions: [
          { label: 'Start Writing', icon: '✏️', variant: 'primary', navigate: `/gps-101/stages/${gps101Stage}/deliverable` }
        ],
        metadata: { isGPS101: true, stage: gps101Stage }
      };
    }
    
    // Reflection prompts
    if (lowerContent.includes('prompt') || lowerContent.includes('reflection') || lowerContent.includes('question')) {
      const reflectionPrompts = {
        1: [
          'What do people come to you for help with?',
          'What activities make you lose track of time?',
          'What injustices or problems make you angry or sad?',
          'If you could change one thing about the world, what would it be?',
          'What would you do if you knew you couldn\'t fail?'
        ],
        2: [
          'What problems do you see that others seem to ignore?',
          'What suffering have you witnessed that stays with you?',
          'What problem, if solved, would make you feel like your life had meaning?',
          'What issue do you find yourself talking about even when no one asks?',
          'What problem connects to a personal experience or story in your life?'
        ],
        3: [
          'Who is most affected by this problem?',
          'What does a typical day look like for someone experiencing this?',
          'What barriers do they face? What have they already tried?',
          'How does this problem make them feel?',
          'What do they dream of that this problem prevents?'
        ],
        4: [
          'How does your identity uniquely position you to address this problem?',
          'What impact do you want to have in 10 years?',
          'What legacy do you want to leave?',
          'What would success look like for your purpose?',
          'How will you know you\'re living your purpose?'
        ],
        5: [
          'What concrete solution could you create in the next 6-12 months?',
          'Who would be your first users/beneficiaries?',
          'What resources do you already have to start?',
          'What would version 1.0 of your project look like?',
          'How will you measure your project\'s impact?'
        ]
      };
      
      const prompts = reflectionPrompts[gps101Stage];
      return {
        content: `Here are some powerful reflection questions for Stage ${gps101Stage}:\n\n${prompts.map((p, i) => `${i + 1}. ${p}`).join('\n\n')}\n\nTake time with these. Write freely without judgment. Your authentic answers will guide you to your purpose.`,
        suggestions: [
          { icon: '📝', text: 'Help with my deliverable' },
          { icon: '🎯', text: 'What\'s next after this stage?' }
        ],
        metadata: { isGPS101: true, stage: gps101Stage }
      };
    }
    
    // Progress/completion
    if (lowerContent.includes('progress') || lowerContent.includes('complete') || lowerContent.includes('done')) {
      return {
        content: `You\'re making great progress in GPS 101! 🎓\n\n**Current Stage:** ${gps101Stage}/5 - ${stageInfo.name}\n**Focus Question:** "${stageInfo.question}"\n\nOnce you complete your ${stageInfo.deliverable}, you\'ll move to the next stage of your purpose discovery journey. Take your time - authentic reflection is more important than speed.`,
        suggestions: [
          { icon: '📊', text: 'View my GPS 101 dashboard' },
          { icon: '📝', text: 'Work on my deliverable' }
        ],
        actions: [
          { label: 'GPS 101 Dashboard', icon: '🎓', variant: 'primary', navigate: '/gps-101' }
        ],
        metadata: { isGPS101: true, stage: gps101Stage }
      };
    }
    
    // Orange Beacon
    if (lowerContent.includes('beacon') || lowerContent.includes('reward') || lowerContent.includes('complete all')) {
      return {
        content: 'The Orange Beacon is your reward for completing all 5 GPS 101 stages! 🟠\n\nWhen you finish your purpose discovery journey, you\'ll unlock:\n• The Orange Beacon (displayed on your profile)\n• 5,000 Baraka\n• GPS 101 Completion Badge\n• Your complete Purpose Portfolio\n\nBut the real reward is discovering your life purpose and taking the first step toward living it!',
        suggestions: [
          { icon: '📈', text: 'How close am I?' },
          { icon: '💡', text: 'Tips for success' }
        ],
        metadata: { isGPS101: true, stage: gps101Stage }
      };
    }
  }
  
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
  
  // GPS 101 queries (when not in GPS 101 context)
  if (lowerContent.includes('gps 101') || lowerContent.includes('purpose')) {
    return {
      content: 'GPS 101 Basic is a 15-week purpose discovery journey! 🎓\n\nThrough 5 stages, you\'ll discover:\n• Who you are at your core (Identity)\n• What problem breaks your heart\n• Who the problem affects\n• Your life purpose\n• A purpose-driven project to launch\n\nComplete all 5 stages to unlock the Orange Beacon and 5,000 Baraka!',
      suggestions: [
        { icon: '🎓', text: 'How do I enroll?' },
        { icon: '📊', text: 'View GPS 101 dashboard' }
      ],
      actions: [
        { label: 'Explore GPS 101', icon: '🎓', variant: 'primary', navigate: '/gps-101' }
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
    content: `Thanks for your message! As your Navigator, I'm here to guide you through the GPS Lab journey${isGPS101Context ? ' and your GPS 101 purpose discovery' : ''}. Feel free to ask me about missions, bites, your progress, or any platform features. What would you like to know more about?`,
    suggestions: [
      { icon: '🎯', text: 'Tell me about missions' },
      { icon: '📈', text: 'Show my progress' },
      { icon: '🪙', text: 'How to earn Baraka?' }
    ]
  };
}

export default NavigatorChat;