/**
 * GPS Lab Platform - Party Service
 * 
 * Study party/group management service for collaborative learning,
 * party creation, membership, and real-time coordination.
 * 
 * @module services/api/party.service
 * @version 1.0.0
 */

import apiClient from './client';
import { getCache, setCache } from '../storage/localStorage.service';
import { logUserAction } from '../../utils/error/logger';
import { subscribe as wsSubscribe, unsubscribe as wsUnsubscribe, send as wsSend } from '../websocket/websocket.service';

// =============================================================================
// API ENDPOINTS
// =============================================================================

const ENDPOINTS = {
  parties: '/parties',
  party: (id) => `/parties/${id}`,
  create: '/parties/create',
  join: (id) => `/parties/${id}/join`,
  leave: (id) => `/parties/${id}/leave`,
  members: (id) => `/parties/${id}/members`,
  invite: (id) => `/parties/${id}/invite`,
  chat: (id) => `/parties/${id}/chat`,
  tasks: (id) => `/parties/${id}/tasks`,
  progress: (id) => `/parties/${id}/progress`,
  discover: '/parties/discover',
  myParties: '/parties/my'
};

// =============================================================================
// CACHE CONFIGURATION
// =============================================================================

const CACHE_TTL = {
  party: 2 * 60 * 1000,       // 2 minutes
  members: 1 * 60 * 1000,     // 1 minute
  discover: 5 * 60 * 1000     // 5 minutes
};

// =============================================================================
// PARTY CONSTANTS
// =============================================================================

export const PARTY_TYPES = {
  STUDY_GROUP: 'study_group',
  PROJECT_TEAM: 'project_team',
  ACCOUNTABILITY: 'accountability',
  MENTOR_GROUP: 'mentor_group'
};

export const PARTY_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  DISBANDED: 'disbanded'
};

export const MEMBER_ROLES = {
  LEADER: 'leader',
  CO_LEADER: 'co_leader',
  MEMBER: 'member',
  MENTOR: 'mentor'
};

export const PARTY_VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  INVITE_ONLY: 'invite_only'
};

// =============================================================================
// PARTY CRUD OPERATIONS
// =============================================================================

/**
 * Creates a new party
 * @param {Object} data - Party data
 * @returns {Promise<Object>} Created party
 */
export const createParty = async ({
  name,
  description,
  type = PARTY_TYPES.STUDY_GROUP,
  visibility = PARTY_VISIBILITY.PUBLIC,
  maxMembers = 5,
  focusMission,
  focusStage,
  tags = []
}) => {
  const response = await apiClient.post(ENDPOINTS.create, {
    name,
    description,
    type,
    visibility,
    maxMembers,
    focusMission,
    focusStage,
    tags
  });
  
  logUserAction('party_created', { partyId: response.data.id, type });
  
  // Dispatch event
  window.dispatchEvent(new CustomEvent('party:created', { 
    detail: response.data 
  }));
  
  return response.data;
};

/**
 * Gets party by ID
 * @param {string} partyId - Party ID
 * @param {Object} options - Options
 * @returns {Promise<Object>} Party data
 */
export const getParty = async (partyId, { useCache = true } = {}) => {
  const cacheKey = `party_${partyId}`;
  
  if (useCache) {
    const cached = getCache(cacheKey, CACHE_TTL.party);
    if (cached) {
      return cached;
    }
  }
  
  const response = await apiClient.get(ENDPOINTS.party(partyId));
  
  setCache(cacheKey, response.data);
  
  return response.data;
};

/**
 * Updates party
 * @param {string} partyId - Party ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated party
 */
export const updateParty = async (partyId, data) => {
  const response = await apiClient.patch(ENDPOINTS.party(partyId), data);
  
  // Invalidate cache
  invalidatePartyCache(partyId);
  
  logUserAction('party_updated', { partyId });
  
  return response.data;
};

/**
 * Deletes/disbands party
 * @param {string} partyId - Party ID
 * @returns {Promise<void>}
 */
export const disbandParty = async (partyId) => {
  await apiClient.delete(ENDPOINTS.party(partyId));
  
  // Invalidate cache
  invalidatePartyCache(partyId);
  
  logUserAction('party_disbanded', { partyId });
  
  // Dispatch event
  window.dispatchEvent(new CustomEvent('party:disbanded', { 
    detail: { partyId } 
  }));
};

// =============================================================================
// MEMBERSHIP OPERATIONS
// =============================================================================

/**
 * Joins a party
 * @param {string} partyId - Party ID
 * @param {Object} options - Join options
 * @returns {Promise<Object>} Join result
 */
export const joinParty = async (partyId, { inviteCode } = {}) => {
  const response = await apiClient.post(ENDPOINTS.join(partyId), {
    inviteCode
  });
  
  // Subscribe to party WebSocket channel
  wsSubscribe(`party:${partyId}`);
  
  // Invalidate cache
  invalidatePartyCache(partyId);
  
  logUserAction('party_joined', { partyId });
  
  // Dispatch event
  window.dispatchEvent(new CustomEvent('party:joined', { 
    detail: response.data 
  }));
  
  return response.data;
};

/**
 * Leaves a party
 * @param {string} partyId - Party ID
 * @returns {Promise<void>}
 */
export const leaveParty = async (partyId) => {
  await apiClient.post(ENDPOINTS.leave(partyId));
  
  // Unsubscribe from party WebSocket channel
  wsUnsubscribe(`party:${partyId}`);
  
  // Invalidate cache
  invalidatePartyCache(partyId);
  
  logUserAction('party_left', { partyId });
  
  // Dispatch event
  window.dispatchEvent(new CustomEvent('party:left', { 
    detail: { partyId } 
  }));
};

/**
 * Gets party members
 * @param {string} partyId - Party ID
 * @param {Object} options - Options
 * @returns {Promise<Object>} Members list
 */
export const getMembers = async (partyId, { useCache = true } = {}) => {
  const cacheKey = `party_${partyId}_members`;
  
  if (useCache) {
    const cached = getCache(cacheKey, CACHE_TTL.members);
    if (cached) {
      return cached;
    }
  }
  
  const response = await apiClient.get(ENDPOINTS.members(partyId));
  
  setCache(cacheKey, response.data);
  
  return response.data;
};

/**
 * Updates member role
 * @param {string} partyId - Party ID
 * @param {string} userId - User ID
 * @param {string} role - New role
 * @returns {Promise<Object>} Updated member
 */
export const updateMemberRole = async (partyId, userId, role) => {
  const response = await apiClient.patch(`${ENDPOINTS.members(partyId)}/${userId}`, {
    role
  });
  
  // Invalidate cache
  invalidatePartyCache(partyId);
  
  logUserAction('party_member_role_updated', { partyId, userId, role });
  
  return response.data;
};

/**
 * Removes member from party
 * @param {string} partyId - Party ID
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const removeMember = async (partyId, userId) => {
  await apiClient.delete(`${ENDPOINTS.members(partyId)}/${userId}`);
  
  // Invalidate cache
  invalidatePartyCache(partyId);
  
  logUserAction('party_member_removed', { partyId, userId });
};

// =============================================================================
// INVITATION OPERATIONS
// =============================================================================

/**
 * Invites user to party
 * @param {string} partyId - Party ID
 * @param {Object} data - Invite data
 * @returns {Promise<Object>} Invite result
 */
export const inviteToParty = async (partyId, { userId, email, message } = {}) => {
  const response = await apiClient.post(ENDPOINTS.invite(partyId), {
    userId,
    email,
    message
  });
  
  logUserAction('party_invite_sent', { partyId, userId, email });
  
  return response.data;
};

/**
 * Gets party invite link
 * @param {string} partyId - Party ID
 * @returns {Promise<Object>} Invite link data
 */
export const getInviteLink = async (partyId) => {
  const response = await apiClient.get(`${ENDPOINTS.invite(partyId)}/link`);
  return response.data;
};

/**
 * Regenerates invite link
 * @param {string} partyId - Party ID
 * @returns {Promise<Object>} New invite link
 */
export const regenerateInviteLink = async (partyId) => {
  const response = await apiClient.post(`${ENDPOINTS.invite(partyId)}/regenerate`);
  return response.data;
};

// =============================================================================
// CHAT OPERATIONS
// =============================================================================

/**
 * Gets party chat messages
 * @param {string} partyId - Party ID
 * @param {Object} params - Query params
 * @returns {Promise<Object>} Chat messages
 */
export const getChatMessages = async (partyId, { 
  before, 
  limit = 50 
} = {}) => {
  const params = { limit };
  if (before) params.before = before;
  
  const response = await apiClient.get(ENDPOINTS.chat(partyId), { params });
  return response.data;
};

/**
 * Sends chat message via WebSocket
 * @param {string} partyId - Party ID
 * @param {Object} message - Message data
 */
export const sendChatMessage = (partyId, { content, type = 'text', attachments }) => {
  wsSend('party:message', {
    partyId,
    content,
    type,
    attachments
  });
  
  logUserAction('party_message_sent', { partyId, type });
};

/**
 * Sends typing indicator
 * @param {string} partyId - Party ID
 * @param {boolean} isTyping - Typing state
 */
export const sendTypingIndicator = (partyId, isTyping) => {
  wsSend('party:typing', { partyId, isTyping });
};

// =============================================================================
// TASK OPERATIONS
// =============================================================================

/**
 * Gets party tasks
 * @param {string} partyId - Party ID
 * @returns {Promise<Object>} Tasks list
 */
export const getTasks = async (partyId) => {
  const response = await apiClient.get(ENDPOINTS.tasks(partyId));
  return response.data;
};

/**
 * Creates party task
 * @param {string} partyId - Party ID
 * @param {Object} task - Task data
 * @returns {Promise<Object>} Created task
 */
export const createTask = async (partyId, task) => {
  const response = await apiClient.post(ENDPOINTS.tasks(partyId), task);
  
  logUserAction('party_task_created', { partyId, taskId: response.data.id });
  
  return response.data;
};

/**
 * Updates party task
 * @param {string} partyId - Party ID
 * @param {string} taskId - Task ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated task
 */
export const updateTask = async (partyId, taskId, data) => {
  const response = await apiClient.patch(`${ENDPOINTS.tasks(partyId)}/${taskId}`, data);
  
  // Notify via WebSocket
  wsSend('party:task_update', { partyId, taskId, ...data });
  
  return response.data;
};

/**
 * Assigns task to member
 * @param {string} partyId - Party ID
 * @param {string} taskId - Task ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Updated task
 */
export const assignTask = async (partyId, taskId, userId) => {
  const response = await apiClient.post(`${ENDPOINTS.tasks(partyId)}/${taskId}/assign`, {
    userId
  });
  
  return response.data;
};

// =============================================================================
// PROGRESS OPERATIONS
// =============================================================================

/**
 * Gets party progress
 * @param {string} partyId - Party ID
 * @returns {Promise<Object>} Progress data
 */
export const getProgress = async (partyId) => {
  const response = await apiClient.get(ENDPOINTS.progress(partyId));
  return response.data;
};

/**
 * Updates user's progress in party
 * @param {string} partyId - Party ID
 * @param {Object} progress - Progress data
 * @returns {Promise<Object>} Updated progress
 */
export const updateProgress = async (partyId, progress) => {
  const response = await apiClient.patch(ENDPOINTS.progress(partyId), progress);
  
  // Notify via WebSocket
  wsSend('party:progress_update', { partyId, ...progress });
  
  return response.data;
};

// =============================================================================
// DISCOVERY OPERATIONS
// =============================================================================

/**
 * Discovers public parties
 * @param {Object} params - Query params
 * @returns {Promise<Object>} Parties list
 */
export const discoverParties = async ({
  page = 1,
  limit = 20,
  type,
  focusStage,
  search,
  sortBy = 'activity'
} = {}) => {
  const params = { page, limit, sortBy };
  if (type) params.type = type;
  if (focusStage) params.focusStage = focusStage;
  if (search) params.search = search;
  
  const response = await apiClient.get(ENDPOINTS.discover, { params });
  return response.data;
};

/**
 * Gets user's parties
 * @param {Object} params - Query params
 * @returns {Promise<Object>} User's parties
 */
export const getMyParties = async ({ status = 'active' } = {}) => {
  const response = await apiClient.get(ENDPOINTS.myParties, {
    params: { status }
  });
  return response.data;
};

/**
 * Gets recommended parties
 * @returns {Promise<Object>} Recommended parties
 */
export const getRecommendedParties = async () => {
  const response = await apiClient.get(`${ENDPOINTS.discover}/recommended`);
  return response.data;
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Invalidates party cache
 * @param {string} partyId - Party ID
 */
const invalidatePartyCache = (partyId) => {
  const { removeItem } = require('../storage/localStorage.service');
  removeItem(`cache_party_${partyId}`);
  removeItem(`cache_party_${partyId}_members`);
};

/**
 * Gets party type info
 * @param {string} type - Party type
 * @returns {Object} Type info
 */
export const getPartyTypeInfo = (type) => {
  const types = {
    [PARTY_TYPES.STUDY_GROUP]: { 
      label: 'Study Group', 
      icon: '📚', 
      description: 'Learn together with peers' 
    },
    [PARTY_TYPES.PROJECT_TEAM]: { 
      label: 'Project Team', 
      icon: '🚀', 
      description: 'Collaborate on GPO projects' 
    },
    [PARTY_TYPES.ACCOUNTABILITY]: { 
      label: 'Accountability Partners', 
      icon: '🎯', 
      description: 'Stay on track together' 
    },
    [PARTY_TYPES.MENTOR_GROUP]: { 
      label: 'Mentor Group', 
      icon: '🧭', 
      description: 'Learn from experienced GPS' 
    }
  };
  
  return types[type] || { label: type, icon: '👥', description: '' };
};

/**
 * Gets member role info
 * @param {string} role - Member role
 * @returns {Object} Role info
 */
export const getMemberRoleInfo = (role) => {
  const roles = {
    [MEMBER_ROLES.LEADER]: { label: 'Leader', icon: '👑', color: 'yellow' },
    [MEMBER_ROLES.CO_LEADER]: { label: 'Co-Leader', icon: '⭐', color: 'purple' },
    [MEMBER_ROLES.MEMBER]: { label: 'Member', icon: '👤', color: 'blue' },
    [MEMBER_ROLES.MENTOR]: { label: 'Mentor', icon: '🧭', color: 'green' }
  };
  
  return roles[role] || { label: role, icon: '👤', color: 'gray' };
};

/**
 * Checks if user is party leader
 * @param {Object} party - Party data
 * @param {string} userId - User ID
 * @returns {boolean} True if leader
 */
export const isPartyLeader = (party, userId) => {
  const member = party?.members?.find(m => m.userId === userId);
  return member?.role === MEMBER_ROLES.LEADER || member?.role === MEMBER_ROLES.CO_LEADER;
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // CRUD
  createParty,
  getParty,
  updateParty,
  disbandParty,
  
  // Membership
  joinParty,
  leaveParty,
  getMembers,
  updateMemberRole,
  removeMember,
  
  // Invitations
  inviteToParty,
  getInviteLink,
  regenerateInviteLink,
  
  // Chat
  getChatMessages,
  sendChatMessage,
  sendTypingIndicator,
  
  // Tasks
  getTasks,
  createTask,
  updateTask,
  assignTask,
  
  // Progress
  getProgress,
  updateProgress,
  
  // Discovery
  discoverParties,
  getMyParties,
  getRecommendedParties,
  
  // Helpers
  getPartyTypeInfo,
  getMemberRoleInfo,
  isPartyLeader,
  
  // Constants
  PARTY_TYPES,
  PARTY_STATUS,
  MEMBER_ROLES,
  PARTY_VISIBILITY
};