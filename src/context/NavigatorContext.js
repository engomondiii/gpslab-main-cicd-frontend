/**
 * GPS Lab Platform - NavigatorContext
 * 
 * Provides AI Navigator (guide character) state and interactions.
 * 
 * @module context/NavigatorContext
 * @version 1.0.0
 */

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState = {
  isActive: false,
  currentCharacter: {
    id: 'mama-amani',
    name: 'Mama Amani',
    role: 'Primary Guide',
    avatar: null,
    personality: 'warm',
    greeting: 'Karibu! Welcome to GPS Lab. I am Mama Amani, your guide on this journey.'
  },
  messages: [],
  suggestions: [
    { id: 'sug-1', text: 'What should I work on next?', type: 'guidance' },
    { id: 'sug-2', text: 'Explain my current mission', type: 'mission' },
    { id: 'sug-3', text: 'Show my progress', type: 'stats' }
  ],
  isTyping: false,
  isMinimized: true,
  error: null
};

// =============================================================================
// REDUCER
// =============================================================================

const NAV_ACTIONS = {
  TOGGLE: 'navigator/toggle',
  MINIMIZE: 'navigator/minimize',
  ADD_MESSAGE: 'navigator/addMessage',
  SET_TYPING: 'navigator/setTyping',
  SET_CHARACTER: 'navigator/setCharacter',
  SET_ERROR: 'navigator/setError',
  CLEAR_MESSAGES: 'navigator/clearMessages'
};

const navigatorReducer = (state, action) => {
  switch (action.type) {
    case NAV_ACTIONS.TOGGLE:
      return { ...state, isActive: !state.isActive, isMinimized: false };
      
    case NAV_ACTIONS.MINIMIZE:
      return { ...state, isMinimized: action.payload ?? !state.isMinimized };
      
    case NAV_ACTIONS.ADD_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload], isTyping: false };
      
    case NAV_ACTIONS.SET_TYPING:
      return { ...state, isTyping: action.payload };
      
    case NAV_ACTIONS.SET_CHARACTER:
      return { ...state, currentCharacter: action.payload };
      
    case NAV_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isTyping: false };
      
    case NAV_ACTIONS.CLEAR_MESSAGES:
      return { ...state, messages: [] };
      
    default:
      return state;
  }
};

// =============================================================================
// CONTEXT
// =============================================================================

const NavigatorContext = createContext(null);

// =============================================================================
// PROVIDER
// =============================================================================

export const NavigatorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(navigatorReducer, initialState);
  
  const toggle = useCallback(() => {
    dispatch({ type: NAV_ACTIONS.TOGGLE });
  }, []);
  
  const minimize = useCallback((value) => {
    dispatch({ type: NAV_ACTIONS.MINIMIZE, payload: value });
  }, []);
  
  const sendMessage = useCallback(async (text) => {
    // Add user message
    dispatch({
      type: NAV_ACTIONS.ADD_MESSAGE,
      payload: { id: Date.now().toString(), role: 'user', text, timestamp: new Date().toISOString() }
    });
    
    // Simulate AI response
    dispatch({ type: NAV_ACTIONS.SET_TYPING, payload: true });
    
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    const responses = [
      "That's a great question! Let me help you with that.",
      "You're making excellent progress. Keep going!",
      "I'd recommend focusing on your current mission first.",
      "Remember, every problem solver starts where you are now.",
      "Let me guide you through the next steps."
    ];
    
    dispatch({
      type: NAV_ACTIONS.ADD_MESSAGE,
      payload: {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: responses[Math.floor(Math.random() * responses.length)],
        character: state.currentCharacter.name,
        timestamp: new Date().toISOString()
      }
    });
  }, [state.currentCharacter]);
  
  const clearMessages = useCallback(() => {
    dispatch({ type: NAV_ACTIONS.CLEAR_MESSAGES });
  }, []);
  
  const contextValue = useMemo(() => ({
    ...state,
    toggle,
    minimize,
    sendMessage,
    clearMessages
  }), [state, toggle, minimize, sendMessage, clearMessages]);
  
  return (
    <NavigatorContext.Provider value={contextValue}>
      {children}
    </NavigatorContext.Provider>
  );
};

// =============================================================================
// HOOK
// =============================================================================

export const useNavigatorContext = () => {
  const context = useContext(NavigatorContext);
  if (!context) {
    throw new Error('useNavigatorContext must be used within a NavigatorProvider');
  }
  return context;
};

export default NavigatorContext;