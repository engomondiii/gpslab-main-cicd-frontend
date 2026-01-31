/**
 * GPS Lab Platform - UserContext
 * 
 * Provides user profile, preferences, and progress state.
 * Complements AuthContext (which handles auth flow) with user data.
 * 
 * @module context/UserContext
 * @version 1.0.0
 */

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState = {
  profile: {
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    avatar: null,
    bio: '',
    location: '',
    joinedAt: null,
    role: 'user'
  },
  preferences: {
    theme: 'light',
    language: 'en',
    soundEnabled: true,
    notificationsEnabled: true,
    emailDigest: 'weekly',
    showOnlineStatus: true
  },
  progress: {
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    currentStage: 1,
    currentAdventure: 1,
    missionsCompleted: 0,
    bitesCompleted: 0,
    checkpointsPassed: 0,
    streak: 0,
    longestStreak: 0,
    totalStudyTime: 0,
    badges: [],
    achievements: []
  },
  isLoading: false,
  error: null
};

// =============================================================================
// REDUCER
// =============================================================================

const USER_ACTIONS = {
  SET_PROFILE: 'user/setProfile',
  UPDATE_PROFILE: 'user/updateProfile',
  SET_PREFERENCES: 'user/setPreferences',
  UPDATE_PREFERENCE: 'user/updatePreference',
  SET_PROGRESS: 'user/setProgress',
  UPDATE_PROGRESS: 'user/updateProgress',
  ADD_XP: 'user/addXP',
  ADD_BADGE: 'user/addBadge',
  SET_LOADING: 'user/setLoading',
  SET_ERROR: 'user/setError',
  RESET: 'user/reset'
};

const userReducer = (state, action) => {
  switch (action.type) {
    case USER_ACTIONS.SET_PROFILE:
      return { ...state, profile: { ...state.profile, ...action.payload }, isLoading: false };
      
    case USER_ACTIONS.UPDATE_PROFILE:
      return { ...state, profile: { ...state.profile, ...action.payload } };
      
    case USER_ACTIONS.SET_PREFERENCES:
      return { ...state, preferences: { ...state.preferences, ...action.payload } };
      
    case USER_ACTIONS.UPDATE_PREFERENCE:
      return {
        ...state,
        preferences: { ...state.preferences, [action.payload.key]: action.payload.value }
      };
      
    case USER_ACTIONS.SET_PROGRESS:
      return { ...state, progress: { ...state.progress, ...action.payload } };
      
    case USER_ACTIONS.UPDATE_PROGRESS:
      return { ...state, progress: { ...state.progress, ...action.payload } };
      
    case USER_ACTIONS.ADD_XP: {
      const newXP = state.progress.xp + action.payload;
      const xpToNext = state.progress.xpToNextLevel;
      const leveledUp = newXP >= xpToNext;
      return {
        ...state,
        progress: {
          ...state.progress,
          xp: leveledUp ? newXP - xpToNext : newXP,
          level: leveledUp ? state.progress.level + 1 : state.progress.level,
          xpToNextLevel: leveledUp ? Math.round(xpToNext * 1.5) : xpToNext
        }
      };
    }
      
    case USER_ACTIONS.ADD_BADGE:
      return {
        ...state,
        progress: {
          ...state.progress,
          badges: [...state.progress.badges, action.payload]
        }
      };
      
    case USER_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
      
    case USER_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
      
    case USER_ACTIONS.RESET:
      return initialState;
      
    default:
      return state;
  }
};

// =============================================================================
// CONTEXT
// =============================================================================

const UserContext = createContext(null);

// =============================================================================
// PROVIDER
// =============================================================================

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  
  const updateProfile = useCallback((updates) => {
    dispatch({ type: USER_ACTIONS.UPDATE_PROFILE, payload: updates });
  }, []);
  
  const updatePreference = useCallback((key, value) => {
    dispatch({ type: USER_ACTIONS.UPDATE_PREFERENCE, payload: { key, value } });
  }, []);
  
  const addXP = useCallback((amount) => {
    dispatch({ type: USER_ACTIONS.ADD_XP, payload: amount });
  }, []);
  
  const addBadge = useCallback((badge) => {
    dispatch({ type: USER_ACTIONS.ADD_BADGE, payload: badge });
  }, []);
  
  const updateProgress = useCallback((updates) => {
    dispatch({ type: USER_ACTIONS.UPDATE_PROGRESS, payload: updates });
  }, []);
  
  const resetUser = useCallback(() => {
    dispatch({ type: USER_ACTIONS.RESET });
  }, []);
  
  const contextValue = useMemo(() => ({
    ...state,
    updateProfile,
    updatePreference,
    addXP,
    addBadge,
    updateProgress,
    resetUser,
    // Computed
    displayName: state.profile.firstName
      ? `${state.profile.firstName} ${state.profile.lastName}`.trim()
      : state.profile.email || 'User',
    levelProgress: state.progress.xpToNextLevel > 0
      ? Math.round((state.progress.xp / state.progress.xpToNextLevel) * 100)
      : 0,
    badgeCount: state.progress.badges.length
  }), [state, updateProfile, updatePreference, addXP, addBadge, updateProgress, resetUser]);
  
  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// =============================================================================
// HOOK
// =============================================================================

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export default UserContext;