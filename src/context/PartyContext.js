/**
 * GPS Lab Platform - PartyContext
 * 
 * Provides study party state and operations.
 * 
 * @module context/PartyContext
 * @version 1.0.0
 */

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_PARTIES = [
  {
    id: 'party-001',
    name: 'GPS Pioneers',
    description: 'A group focused on Stage 1 fundamentals.',
    members: [
      { id: 'u1', name: 'Alice K.', avatar: null, role: 'leader', online: true },
      { id: 'u2', name: 'Bob M.', avatar: null, role: 'member', online: false },
      { id: 'u3', name: 'Carol N.', avatar: null, role: 'member', online: true }
    ],
    maxMembers: 5,
    stage: 1,
    currentMission: 'mission-001',
    status: 'active',
    createdAt: '2025-12-01T10:00:00Z',
    tags: ['beginner', 'fundamentals']
  },
  {
    id: 'party-002',
    name: 'Venture Builders',
    description: 'Advanced problem solvers working on capstone projects.',
    members: [
      { id: 'u4', name: 'David O.', avatar: null, role: 'leader', online: true },
      { id: 'u5', name: 'Eve P.', avatar: null, role: 'member', online: true }
    ],
    maxMembers: 4,
    stage: 5,
    currentMission: null,
    status: 'recruiting',
    createdAt: '2025-11-15T14:00:00Z',
    tags: ['advanced', 'capstone']
  }
];

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState = {
  parties: MOCK_PARTIES,
  myParty: null,
  invitations: [],
  isLoading: false,
  error: null
};

// =============================================================================
// REDUCER
// =============================================================================

const PARTY_ACTIONS = {
  SET_PARTIES: 'party/setParties',
  SET_MY_PARTY: 'party/setMyParty',
  JOIN_PARTY: 'party/join',
  LEAVE_PARTY: 'party/leave',
  ADD_INVITATION: 'party/addInvitation',
  SET_LOADING: 'party/setLoading',
  SET_ERROR: 'party/setError'
};

const partyReducer = (state, action) => {
  switch (action.type) {
    case PARTY_ACTIONS.SET_PARTIES:
      return { ...state, parties: action.payload, isLoading: false };
      
    case PARTY_ACTIONS.SET_MY_PARTY:
      return { ...state, myParty: action.payload };
      
    case PARTY_ACTIONS.JOIN_PARTY:
      return {
        ...state,
        myParty: action.payload,
        parties: state.parties.map(p =>
          p.id === action.payload.id ? action.payload : p
        )
      };
      
    case PARTY_ACTIONS.LEAVE_PARTY:
      return { ...state, myParty: null };
      
    case PARTY_ACTIONS.ADD_INVITATION:
      return { ...state, invitations: [...state.invitations, action.payload] };
      
    case PARTY_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
      
    case PARTY_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
      
    default:
      return state;
  }
};

// =============================================================================
// CONTEXT
// =============================================================================

const PartyContext = createContext(null);

// =============================================================================
// PROVIDER
// =============================================================================

export const PartyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(partyReducer, initialState);
  
  const joinParty = useCallback((partyId, user) => {
    const party = state.parties.find(p => p.id === partyId);
    if (!party) return;
    
    const updatedParty = {
      ...party,
      members: [...party.members, { ...user, role: 'member', online: true }]
    };
    
    dispatch({ type: PARTY_ACTIONS.JOIN_PARTY, payload: updatedParty });
  }, [state.parties]);
  
  const leaveParty = useCallback(() => {
    dispatch({ type: PARTY_ACTIONS.LEAVE_PARTY });
  }, []);
  
  const getAvailableParties = useCallback(() => {
    return state.parties.filter(p =>
      p.status === 'recruiting' && p.members.length < p.maxMembers
    );
  }, [state.parties]);
  
  const contextValue = useMemo(() => ({
    ...state,
    joinParty,
    leaveParty,
    getAvailableParties,
    totalParties: state.parties.length,
    onlineMembers: state.myParty
      ? state.myParty.members.filter(m => m.online).length
      : 0
  }), [state, joinParty, leaveParty, getAvailableParties]);
  
  return (
    <PartyContext.Provider value={contextValue}>
      {children}
    </PartyContext.Provider>
  );
};

// =============================================================================
// HOOK
// =============================================================================

export const usePartyContext = () => {
  const context = useContext(PartyContext);
  if (!context) {
    throw new Error('usePartyContext must be used within a PartyProvider');
  }
  return context;
};

export default PartyContext;