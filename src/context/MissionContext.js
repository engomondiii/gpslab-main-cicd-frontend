/**
 * GPS Lab Platform - MissionContext
 * 
 * Global mission state management for tracking active missions,
 * progress, and mission-related actions.
 * 
 * @module context/MissionContext
 * @version 1.0.0
 */

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState = {
  missions: [],
  activeMission: null,
  missionProgress: {},
  isLoading: false,
  error: null
};

// =============================================================================
// ACTION TYPES
// =============================================================================

const MISSION_ACTIONS = {
  SET_MISSIONS: 'mission/setMissions',
  SET_ACTIVE_MISSION: 'mission/setActive',
  UPDATE_PROGRESS: 'mission/updateProgress',
  COMPLETE_MISSION: 'mission/complete',
  SET_LOADING: 'mission/setLoading',
  SET_ERROR: 'mission/setError',
  CLEAR_ERROR: 'mission/clearError',
  RESET: 'mission/reset'
};

// =============================================================================
// REDUCER
// =============================================================================

const missionReducer = (state, action) => {
  switch (action.type) {
    case MISSION_ACTIONS.SET_MISSIONS:
      return { ...state, missions: action.payload, isLoading: false };
    case MISSION_ACTIONS.SET_ACTIVE_MISSION:
      return { ...state, activeMission: action.payload };
    case MISSION_ACTIONS.UPDATE_PROGRESS:
      return {
        ...state,
        missionProgress: {
          ...state.missionProgress,
          [action.payload.missionId]: action.payload.progress
        }
      };
    case MISSION_ACTIONS.COMPLETE_MISSION:
      return {
        ...state,
        missions: state.missions.map(m =>
          m.id === action.payload ? { ...m, status: 'completed' } : m
        ),
        activeMission: state.activeMission?.id === action.payload ? null : state.activeMission
      };
    case MISSION_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case MISSION_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case MISSION_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    case MISSION_ACTIONS.RESET:
      return initialState;
    default:
      return state;
  }
};

// =============================================================================
// CONTEXT & PROVIDER
// =============================================================================

const MissionContext = createContext(null);

export const MissionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(missionReducer, initialState);

  const setMissions = useCallback((missions) => {
    dispatch({ type: MISSION_ACTIONS.SET_MISSIONS, payload: missions });
  }, []);
  const setActiveMission = useCallback((mission) => {
    dispatch({ type: MISSION_ACTIONS.SET_ACTIVE_MISSION, payload: mission });
  }, []);
  const updateProgress = useCallback((missionId, progress) => {
    dispatch({ type: MISSION_ACTIONS.UPDATE_PROGRESS, payload: { missionId, progress } });
  }, []);
  const completeMission = useCallback((missionId) => {
    dispatch({ type: MISSION_ACTIONS.COMPLETE_MISSION, payload: missionId });
  }, []);
  const clearError = useCallback(() => {
    dispatch({ type: MISSION_ACTIONS.CLEAR_ERROR });
  }, []);
  const reset = useCallback(() => {
    dispatch({ type: MISSION_ACTIONS.RESET });
  }, []);

  const value = useMemo(() => ({
    ...state, setMissions, setActiveMission, updateProgress,
    completeMission, clearError, reset
  }), [state, setMissions, setActiveMission, updateProgress, completeMission, clearError, reset]);

  return <MissionContext.Provider value={value}>{children}</MissionContext.Provider>;
};

export const useMissionContext = () => {
  const ctx = useContext(MissionContext);
  if (!ctx) throw new Error('useMissionContext must be used within a MissionProvider');
  return ctx;
};

export { MISSION_ACTIONS };
export default MissionContext;