/**
 * GPS Lab Platform - UserContext
 * 
 * User profile and stats state management.
 * Provides user data, preferences, achievements, and profile operations.
 * 
 * @module context/UserContext
 * @version 1.0.0
 */

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState = {
  profile: null,
  stats: {
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    currentStage: 1,
    missionsCompleted: 0,
    streak: 0
  },
  badges: [],
  achievements: [],
  preferences: {
    theme: 'light',
    locale: 'en',
    soundEnabled: true,
    notificationsEnabled: true
  },
  isLoading: false,
  error: null
};

// =============================================================================
// ACTION TYPES
// =============================================================================

const USER_ACTIONS = {
  SET_PROFILE: 'user/setProfile',
  UPDATE_PROFILE: 'user/updateProfile',
  SET_STATS: 'user/setStats',
  UPDATE_STATS: 'user/updateStats',
  SET_BADGES: 'user/setBadges',
  ADD_BADGE: 'user/addBadge',
  SET_ACHIEVEMENTS: 'user/setAchievements',
  SET_PREFERENCES: 'user/setPreferences',
  UPDATE_PREFERENCES: 'user/updatePreferences',
  SET_LOADING: 'user/setLoading',
  SET_ERROR: 'user/setError',
  CLEAR_ERROR: 'user/clearError',
  RESET: 'user/reset'
};

// =============================================================================
// REDUCER
// =============================================================================

const userReducer = (state, action) => {
  switch (action.type) {
    case USER_ACTIONS.SET_PROFILE:
      return { ...state, profile: action.payload, isLoading: false };
    case USER_ACTIONS.UPDATE_PROFILE:
      return { ...state, profile: { ...state.profile, ...action.payload } };
    case USER_ACTIONS.SET_STATS:
      return { ...state, stats: action.payload };
    case USER_ACTIONS.UPDATE_STATS:
      return { ...state, stats: { ...state.stats, ...action.payload } };
    case USER_ACTIONS.SET_BADGES:
      return { ...state, badges: action.payload };
    case USER_ACTIONS.ADD_BADGE:
      return { ...state, badges: [...state.badges, action.payload] };
    case USER_ACTIONS.SET_ACHIEVEMENTS:
      return { ...state, achievements: action.payload };
    case USER_ACTIONS.SET_PREFERENCES:
      return { ...state, preferences: action.payload };
    case USER_ACTIONS.UPDATE_PREFERENCES:
      return { ...state, preferences: { ...state.preferences, ...action.payload } };
    case USER_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case USER_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case USER_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    case USER_ACTIONS.RESET:
      return initialState;
    default:
      return state;
  }
};

// =============================================================================
// CONTEXT & PROVIDER
// =============================================================================

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const setProfile = useCallback((profile) => {
    dispatch({ type: USER_ACTIONS.SET_PROFILE, payload: profile });
  }, []);
  const updateProfile = useCallback((updates) => {
    dispatch({ type: USER_ACTIONS.UPDATE_PROFILE, payload: updates });
  }, []);
  const setStats = useCallback((stats) => {
    dispatch({ type: USER_ACTIONS.SET_STATS, payload: stats });
  }, []);
  const updateStats = useCallback((updates) => {
    dispatch({ type: USER_ACTIONS.UPDATE_STATS, payload: updates });
  }, []);
  const setBadges = useCallback((badges) => {
    dispatch({ type: USER_ACTIONS.SET_BADGES, payload: badges });
  }, []);
  const addBadge = useCallback((badge) => {
    dispatch({ type: USER_ACTIONS.ADD_BADGE, payload: badge });
  }, []);
  const setPreferences = useCallback((prefs) => {
    dispatch({ type: USER_ACTIONS.SET_PREFERENCES, payload: prefs });
  }, []);
  const updatePreferences = useCallback((updates) => {
    dispatch({ type: USER_ACTIONS.UPDATE_PREFERENCES, payload: updates });
  }, []);
  const clearError = useCallback(() => {
    dispatch({ type: USER_ACTIONS.CLEAR_ERROR });
  }, []);
  const reset = useCallback(() => {
    dispatch({ type: USER_ACTIONS.RESET });
  }, []);

  const value = useMemo(() => ({
    ...state, setProfile, updateProfile, setStats, updateStats,
    setBadges, addBadge, setPreferences, updatePreferences, clearError, reset
  }), [state, setProfile, updateProfile, setStats, updateStats, setBadges, addBadge, setPreferences, updatePreferences, clearError, reset]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUserContext must be used within a UserProvider');
  return ctx;
};

export { USER_ACTIONS };
export default UserContext;