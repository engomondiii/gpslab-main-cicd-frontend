/**
 * GPS Lab Platform - PartyContext
 * 
 * Study party state management for group learning sessions.
 * Manages party membership, active sessions, and real-time collaboration.
 * 
 * @module context/PartyContext
 * @version 1.0.0
 */

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState = {
  parties: [],
  activeParty: null,
  members: [],
  invitations: [],
  isInSession: false,
  isLoading: false,
  error: null
};

// =============================================================================
// ACTION TYPES
// =============================================================================

const PARTY_ACTIONS = {
  SET_PARTIES: 'party/setParties',
  SET_ACTIVE_PARTY: 'party/setActive',
  SET_MEMBERS: 'party/setMembers',
  ADD_MEMBER: 'party/addMember',
  REMOVE_MEMBER: 'party/removeMember',
  SET_INVITATIONS: 'party/setInvitations',
  JOIN_SESSION: 'party/joinSession',
  LEAVE_SESSION: 'party/leaveSession',
  SET_LOADING: 'party/setLoading',
  SET_ERROR: 'party/setError',
  CLEAR_ERROR: 'party/clearError',
  RESET: 'party/reset'
};

// =============================================================================
// REDUCER
// =============================================================================

const partyReducer = (state, action) => {
  switch (action.type) {
    case PARTY_ACTIONS.SET_PARTIES:
      return { ...state, parties: action.payload, isLoading: false };
    case PARTY_ACTIONS.SET_ACTIVE_PARTY:
      return { ...state, activeParty: action.payload };
    case PARTY_ACTIONS.SET_MEMBERS:
      return { ...state, members: action.payload };
    case PARTY_ACTIONS.ADD_MEMBER:
      return { ...state, members: [...state.members, action.payload] };
    case PARTY_ACTIONS.REMOVE_MEMBER:
      return { ...state, members: state.members.filter(m => m.id !== action.payload) };
    case PARTY_ACTIONS.SET_INVITATIONS:
      return { ...state, invitations: action.payload };
    case PARTY_ACTIONS.JOIN_SESSION:
      return { ...state, isInSession: true, activeParty: action.payload };
    case PARTY_ACTIONS.LEAVE_SESSION:
      return { ...state, isInSession: false, activeParty: null };
    case PARTY_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case PARTY_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case PARTY_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    case PARTY_ACTIONS.RESET:
      return initialState;
    default:
      return state;
  }
};

// =============================================================================
// CONTEXT & PROVIDER
// =============================================================================

const PartyContext = createContext(null);

export const PartyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(partyReducer, initialState);

  const setParties = useCallback((parties) => {
    dispatch({ type: PARTY_ACTIONS.SET_PARTIES, payload: parties });
  }, []);
  const setActiveParty = useCallback((party) => {
    dispatch({ type: PARTY_ACTIONS.SET_ACTIVE_PARTY, payload: party });
  }, []);
  const setMembers = useCallback((members) => {
    dispatch({ type: PARTY_ACTIONS.SET_MEMBERS, payload: members });
  }, []);
  const addMember = useCallback((member) => {
    dispatch({ type: PARTY_ACTIONS.ADD_MEMBER, payload: member });
  }, []);
  const removeMember = useCallback((memberId) => {
    dispatch({ type: PARTY_ACTIONS.REMOVE_MEMBER, payload: memberId });
  }, []);
  const joinSession = useCallback((party) => {
    dispatch({ type: PARTY_ACTIONS.JOIN_SESSION, payload: party });
  }, []);
  const leaveSession = useCallback(() => {
    dispatch({ type: PARTY_ACTIONS.LEAVE_SESSION });
  }, []);
  const clearError = useCallback(() => {
    dispatch({ type: PARTY_ACTIONS.CLEAR_ERROR });
  }, []);
  const reset = useCallback(() => {
    dispatch({ type: PARTY_ACTIONS.RESET });
  }, []);

  const value = useMemo(() => ({
    ...state, setParties, setActiveParty, setMembers, addMember,
    removeMember, joinSession, leaveSession, clearError, reset
  }), [state, setParties, setActiveParty, setMembers, addMember, removeMember, joinSession, leaveSession, clearError, reset]);

  return <PartyContext.Provider value={value}>{children}</PartyContext.Provider>;
};

export const usePartyContext = () => {
  const ctx = useContext(PartyContext);
  if (!ctx) throw new Error('usePartyContext must be used within a PartyProvider');
  return ctx;
};

export { PARTY_ACTIONS };
export default PartyContext;