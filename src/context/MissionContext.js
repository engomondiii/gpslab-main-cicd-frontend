/**
 * GPS Lab Platform - MissionContext
 * 
 * Provides mission state and operations to the component tree.
 * 
 * @module context/MissionContext
 * @version 1.0.0
 */

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_MISSIONS = [
  {
    id: 'mission-001',
    title: 'GPS 101: Introduction to Problem Solving',
    description: 'Learn the fundamentals of identifying and framing real-world problems.',
    stage: 1,
    adventure: 1,
    status: 'in_progress',
    progress: 45,
    totalBites: 5,
    completedBites: 2,
    xpReward: 150,
    barakaReward: 50,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    difficulty: 'beginner',
    tags: ['fundamentals', 'problem-framing']
  },
  {
    id: 'mission-002',
    title: 'Stakeholder Mapping',
    description: 'Identify and analyze key stakeholders for your chosen problem.',
    stage: 1,
    adventure: 1,
    status: 'available',
    progress: 0,
    totalBites: 4,
    completedBites: 0,
    xpReward: 200,
    barakaReward: 75,
    dueDate: null,
    difficulty: 'beginner',
    tags: ['stakeholders', 'analysis']
  },
  {
    id: 'mission-003',
    title: 'Root Cause Analysis',
    description: 'Apply systematic techniques to uncover root causes.',
    stage: 2,
    adventure: 1,
    status: 'locked',
    progress: 0,
    totalBites: 6,
    completedBites: 0,
    xpReward: 250,
    barakaReward: 100,
    dueDate: null,
    difficulty: 'intermediate',
    tags: ['root-cause', 'analysis', 'tools']
  }
];

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState = {
  missions: MOCK_MISSIONS,
  currentMission: null,
  activeBite: null,
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    stage: null,
    difficulty: null
  }
};

// =============================================================================
// ACTION TYPES
// =============================================================================

const MISSION_ACTIONS = {
  SET_MISSIONS: 'mission/setMissions',
  SET_CURRENT: 'mission/setCurrent',
  SET_ACTIVE_BITE: 'mission/setActiveBite',
  UPDATE_PROGRESS: 'mission/updateProgress',
  SET_LOADING: 'mission/setLoading',
  SET_ERROR: 'mission/setError',
  SET_FILTERS: 'mission/setFilters',
  COMPLETE_BITE: 'mission/completeBite'
};

// =============================================================================
// REDUCER
// =============================================================================

const missionReducer = (state, action) => {
  switch (action.type) {
    case MISSION_ACTIONS.SET_MISSIONS:
      return { ...state, missions: action.payload, isLoading: false };
      
    case MISSION_ACTIONS.SET_CURRENT:
      return { ...state, currentMission: action.payload };
      
    case MISSION_ACTIONS.SET_ACTIVE_BITE:
      return { ...state, activeBite: action.payload };
      
    case MISSION_ACTIONS.UPDATE_PROGRESS:
      return {
        ...state,
        missions: state.missions.map(m =>
          m.id === action.payload.missionId
            ? { ...m, progress: action.payload.progress, completedBites: action.payload.completedBites }
            : m
        )
      };
      
    case MISSION_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
      
    case MISSION_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
      
    case MISSION_ACTIONS.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
      
    case MISSION_ACTIONS.COMPLETE_BITE:
      return {
        ...state,
        missions: state.missions.map(m => {
          if (m.id !== action.payload.missionId) return m;
          const newCompleted = m.completedBites + 1;
          return {
            ...m,
            completedBites: newCompleted,
            progress: Math.round((newCompleted / m.totalBites) * 100),
            status: newCompleted >= m.totalBites ? 'completed' : 'in_progress'
          };
        })
      };
      
    default:
      return state;
  }
};

// =============================================================================
// CONTEXT
// =============================================================================

const MissionContext = createContext(null);

// =============================================================================
// PROVIDER
// =============================================================================

export const MissionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(missionReducer, initialState);
  
  const selectMission = useCallback((missionId) => {
    const mission = state.missions.find(m => m.id === missionId) || null;
    dispatch({ type: MISSION_ACTIONS.SET_CURRENT, payload: mission });
    return mission;
  }, [state.missions]);
  
  const completeBite = useCallback((missionId, biteId) => {
    dispatch({ type: MISSION_ACTIONS.COMPLETE_BITE, payload: { missionId, biteId } });
  }, []);
  
  const setFilters = useCallback((filters) => {
    dispatch({ type: MISSION_ACTIONS.SET_FILTERS, payload: filters });
  }, []);
  
  const getFilteredMissions = useCallback(() => {
    let filtered = [...state.missions];
    if (state.filters.status !== 'all') {
      filtered = filtered.filter(m => m.status === state.filters.status);
    }
    if (state.filters.stage) {
      filtered = filtered.filter(m => m.stage === state.filters.stage);
    }
    if (state.filters.difficulty) {
      filtered = filtered.filter(m => m.difficulty === state.filters.difficulty);
    }
    return filtered;
  }, [state.missions, state.filters]);
  
  const contextValue = useMemo(() => ({
    ...state,
    selectMission,
    completeBite,
    setFilters,
    getFilteredMissions,
    totalMissions: state.missions.length,
    completedMissions: state.missions.filter(m => m.status === 'completed').length,
    activeMissions: state.missions.filter(m => m.status === 'in_progress').length
  }), [state, selectMission, completeBite, setFilters, getFilteredMissions]);
  
  return (
    <MissionContext.Provider value={contextValue}>
      {children}
    </MissionContext.Provider>
  );
};

// =============================================================================
// HOOK
// =============================================================================

export const useMissionContext = () => {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error('useMissionContext must be used within a MissionProvider');
  }
  return context;
};

export default MissionContext;