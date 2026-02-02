/**
 * GPS Lab Platform - NavigatorContext
 * 
 * AI Navigator companion state management.
 * Manages the AI assistant persona, conversation state, and guidance hints.
 * 
 * @module context/NavigatorContext
 * @version 1.0.0
 */

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState = {
  navigator: null,
  isActive: false,
  conversation: [],
  hints: [],
  personality: 'default',
  isLoading: false,
  error: null
};

// =============================================================================
// ACTION TYPES
// =============================================================================

const NAVIGATOR_ACTIONS = {
  SET_NAVIGATOR: 'navigator/set',
  ACTIVATE: 'navigator/activate',
  DEACTIVATE: 'navigator/deactivate',
  ADD_MESSAGE: 'navigator/addMessage',
  SET_HINTS: 'navigator/setHints',
  CLEAR_HINTS: 'navigator/clearHints',
  SET_PERSONALITY: 'navigator/setPersonality',
  SET_LOADING: 'navigator/setLoading',
  SET_ERROR: 'navigator/setError',
  CLEAR_CONVERSATION: 'navigator/clearConversation',
  RESET: 'navigator/reset'
};

// =============================================================================
// REDUCER
// =============================================================================

const navigatorReducer = (state, action) => {
  switch (action.type) {
    case NAVIGATOR_ACTIONS.SET_NAVIGATOR:
      return { ...state, navigator: action.payload };
    case NAVIGATOR_ACTIONS.ACTIVATE:
      return { ...state, isActive: true };
    case NAVIGATOR_ACTIONS.DEACTIVATE:
      return { ...state, isActive: false };
    case NAVIGATOR_ACTIONS.ADD_MESSAGE:
      return { ...state, conversation: [...state.conversation, action.payload] };
    case NAVIGATOR_ACTIONS.SET_HINTS:
      return { ...state, hints: action.payload };
    case NAVIGATOR_ACTIONS.CLEAR_HINTS:
      return { ...state, hints: [] };
    case NAVIGATOR_ACTIONS.SET_PERSONALITY:
      return { ...state, personality: action.payload };
    case NAVIGATOR_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case NAVIGATOR_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case NAVIGATOR_ACTIONS.CLEAR_CONVERSATION:
      return { ...state, conversation: [] };
    case NAVIGATOR_ACTIONS.RESET:
      return initialState;
    default:
      return state;
  }
};

// =============================================================================
// CONTEXT & PROVIDER
// =============================================================================

const NavigatorContext = createContext(null);

export const NavigatorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(navigatorReducer, initialState);

  const setNavigator = useCallback((nav) => {
    dispatch({ type: NAVIGATOR_ACTIONS.SET_NAVIGATOR, payload: nav });
  }, []);
  const activate = useCallback(() => {
    dispatch({ type: NAVIGATOR_ACTIONS.ACTIVATE });
  }, []);
  const deactivate = useCallback(() => {
    dispatch({ type: NAVIGATOR_ACTIONS.DEACTIVATE });
  }, []);
  const addMessage = useCallback((message) => {
    dispatch({ type: NAVIGATOR_ACTIONS.ADD_MESSAGE, payload: message });
  }, []);
  const setHints = useCallback((hints) => {
    dispatch({ type: NAVIGATOR_ACTIONS.SET_HINTS, payload: hints });
  }, []);
  const clearHints = useCallback(() => {
    dispatch({ type: NAVIGATOR_ACTIONS.CLEAR_HINTS });
  }, []);
  const setPersonality = useCallback((personality) => {
    dispatch({ type: NAVIGATOR_ACTIONS.SET_PERSONALITY, payload: personality });
  }, []);
  const clearConversation = useCallback(() => {
    dispatch({ type: NAVIGATOR_ACTIONS.CLEAR_CONVERSATION });
  }, []);
  const reset = useCallback(() => {
    dispatch({ type: NAVIGATOR_ACTIONS.RESET });
  }, []);

  const value = useMemo(() => ({
    ...state, setNavigator, activate, deactivate, addMessage,
    setHints, clearHints, setPersonality, clearConversation, reset
  }), [state, setNavigator, activate, deactivate, addMessage, setHints, clearHints, setPersonality, clearConversation, reset]);

  return <NavigatorContext.Provider value={value}>{children}</NavigatorContext.Provider>;
};

export const useNavigatorContext = () => {
  const ctx = useContext(NavigatorContext);
  if (!ctx) throw new Error('useNavigatorContext must be used within a NavigatorProvider');
  return ctx;
};

export { NAVIGATOR_ACTIONS };
export default NavigatorContext;