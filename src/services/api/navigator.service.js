/**
 * GPS Lab Platform - Navigator Service
 * 
 * AI Navigator service for interacting with GPS Lab's AI characters
 * including Navigator, Companion, Coach, and Mentor.
 * 
 * @module services/api/navigator.service
 * @version 1.0.0
 */

import apiClient from './client';
import { getCache, setCache } from '../storage/localStorage.service';
import { logUserAction } from '../../utils/error/logger';
import { on as wsOn, send as wsSend } from '../websocket/websocket.service';

// =============================================================================
// API ENDPOINTS
// =============================================================================

const ENDPOINTS = {
  chat: '/navigator/chat',
  message: '/navigator/message',
  history: '/navigator/history',
  context: '/navigator/context',
  suggestions: '/navigator/suggestions',
  feedback: '/navigator/feedback',
  characters: '/navigator/characters',
  preferences: '/navigator/preferences'
};

// =============================================================================
// CACHE CONFIGURATION
// =============================================================================

const CACHE_TTL = {
  characters: 60 * 60 * 1000,    // 1 hour
  suggestions: 5 * 60 * 1000     // 5 minutes
};

// =============================================================================
// AI CHARACTER CONSTANTS
// =============================================================================

export const AI_CHARACTERS = {
  NAVIGATOR: 'navigator',     // Primary guide - always available
  COMPANION: 'companion',     // Learning buddy - Stage 1-7
  COACH: 'coach',            // Performance coach - Stage 8-21
  MENTOR: 'mentor'           // Wisdom advisor - Stage 22-35
};

export const CHARACTER_INFO = {
  [AI_CHARACTERS.NAVIGATOR]: {
    name: 'Navigator',
    description: 'Your primary guide through the GPS Lab journey',
    avatar: '🧭',
    color: 'blue',
    personality: 'Helpful, knowledgeable, encouraging',
    availability: 'Always available'
  },
  [AI_CHARACTERS.COMPANION]: {
    name: 'Companion',
    description: 'Your learning buddy for early adventures',
    avatar: '🤝',
    color: 'green',
    personality: 'Friendly, patient, supportive',
    availability: 'Stages 1-7 (Adventures 1-2)'
  },
  [AI_CHARACTERS.COACH]: {
    name: 'Coach',
    description: 'Your performance coach for skill building',
    avatar: '🏆',
    color: 'orange',
    personality: 'Motivating, challenging, strategic',
    availability: 'Stages 8-21 (Adventures 3-5)'
  },
  [AI_CHARACTERS.MENTOR]: {
    name: 'Mentor',
    description: 'Your wisdom advisor for mastery',
    avatar: '🦉',
    color: 'purple',
    personality: 'Wise, reflective, insightful',
    availability: 'Stages 22-35 (Adventures 6-7)'
  }
};

export const MESSAGE_TYPES = {
  TEXT: 'text',
  GUIDANCE: 'guidance',
  HINT: 'hint',
  FEEDBACK: 'feedback',
  ENCOURAGEMENT: 'encouragement',
  CHALLENGE: 'challenge',
  REFLECTION: 'reflection'
};

// =============================================================================
// CHAT OPERATIONS
// =============================================================================

/**
 * Sends message to AI character
 * @param {Object} data - Message data
 * @returns {Promise<Object>} AI response
 */
export const sendMessage = async ({
  message,
  character = AI_CHARACTERS.NAVIGATOR,
  context = {},
  streamResponse = false
}) => {
  const payload = {
    message,
    character,
    context: {
      ...context,
      timestamp: new Date().toISOString()
    }
  };
  
  if (streamResponse) {
    // Use WebSocket for streaming
    return new Promise((resolve, reject) => {
      let response = '';
      
      const unsubscribe = wsOn('navigator:message', (data) => {
        if (data.done) {
          unsubscribe();
          resolve({
            message: response,
            character,
            ...data
          });
        } else {
          response += data.chunk;
          // Dispatch streaming event
          window.dispatchEvent(new CustomEvent('navigator:stream', {
            detail: { chunk: data.chunk, accumulated: response }
          }));
        }
      });
      
      wsSend('navigator:message', payload);
      
      // Timeout
      setTimeout(() => {
        unsubscribe();
        reject(new Error('Navigator response timeout'));
      }, 60000);
    });
  }
  
  const response = await apiClient.post(ENDPOINTS.message, payload);
  
  logUserAction('navigator_message_sent', { character });
  
  return response.data;
};

/**
 * Gets chat history
 * @param {Object} params - Query params
 * @returns {Promise<Object>} Chat history
 */
export const getChatHistory = async ({
  character,
  limit = 50,
  before
} = {}) => {
  const params = { limit };
  if (character) params.character = character;
  if (before) params.before = before;
  
  const response = await apiClient.get(ENDPOINTS.history, { params });
  return response.data;
};

/**
 * Clears chat history
 * @param {string} character - Optional character filter
 * @returns {Promise<void>}
 */
export const clearChatHistory = async (character) => {
  const params = {};
  if (character) params.character = character;
  
  await apiClient.delete(ENDPOINTS.history, { params });
  
  logUserAction('navigator_history_cleared', { character });
};

// =============================================================================
// CONTEXT OPERATIONS
// =============================================================================

/**
 * Updates Navigator context
 * @param {Object} context - Context data
 * @returns {Promise<Object>} Updated context
 */
export const updateContext = async (context) => {
  const response = await apiClient.put(ENDPOINTS.context, context);
  return response.data;
};

/**
 * Gets current Navigator context
 * @returns {Promise<Object>} Current context
 */
export const getContext = async () => {
  const response = await apiClient.get(ENDPOINTS.context);
  return response.data;
};

/**
 * Sets mission context for Navigator
 * @param {string} missionId - Mission ID
 * @param {Object} additionalContext - Additional context
 * @returns {Promise<Object>} Updated context
 */
export const setMissionContext = async (missionId, additionalContext = {}) => {
  return updateContext({
    type: 'mission',
    missionId,
    ...additionalContext
  });
};

/**
 * Sets bite context for Navigator
 * @param {string} biteId - Bite ID
 * @param {Object} additionalContext - Additional context
 * @returns {Promise<Object>} Updated context
 */
export const setBiteContext = async (biteId, additionalContext = {}) => {
  return updateContext({
    type: 'bite',
    biteId,
    ...additionalContext
  });
};

// =============================================================================
// SUGGESTIONS
// =============================================================================

/**
 * Gets AI suggestions based on current state
 * @param {Object} options - Options
 * @returns {Promise<Object>} Suggestions
 */
export const getSuggestions = async ({ type, context } = {}) => {
  const cacheKey = `navigator_suggestions_${type || 'general'}`;
  
  const cached = getCache(cacheKey, CACHE_TTL.suggestions);
  if (cached) {
    return cached;
  }
  
  const params = {};
  if (type) params.type = type;
  if (context) params.context = JSON.stringify(context);
  
  const response = await apiClient.get(ENDPOINTS.suggestions, { params });
  
  setCache(cacheKey, response.data);
  
  return response.data;
};

/**
 * Gets next step suggestion
 * @returns {Promise<Object>} Next step
 */
export const getNextStepSuggestion = async () => {
  const response = await apiClient.get(`${ENDPOINTS.suggestions}/next`);
  return response.data;
};

/**
 * Gets learning path suggestions
 * @returns {Promise<Object>} Learning path
 */
export const getLearningPathSuggestions = async () => {
  const response = await apiClient.get(`${ENDPOINTS.suggestions}/path`);
  return response.data;
};

// =============================================================================
// SPECIALIZED INTERACTIONS
// =============================================================================

/**
 * Requests hint from Navigator
 * @param {Object} context - Context for hint
 * @returns {Promise<Object>} Hint response
 */
export const requestHint = async ({ biteId, checkpointId, question }) => {
  const response = await apiClient.post(`${ENDPOINTS.message}/hint`, {
    biteId,
    checkpointId,
    question
  });
  
  logUserAction('navigator_hint_requested', { biteId, checkpointId });
  
  return response.data;
};

/**
 * Requests feedback from Navigator
 * @param {Object} data - Work to get feedback on
 * @returns {Promise<Object>} Feedback response
 */
export const requestFeedback = async ({ content, type, context }) => {
  const response = await apiClient.post(`${ENDPOINTS.message}/feedback`, {
    content,
    type,
    context
  });
  
  logUserAction('navigator_feedback_requested', { type });
  
  return response.data;
};

/**
 * Requests encouragement from Navigator
 * @param {Object} context - Context
 * @returns {Promise<Object>} Encouragement
 */
export const requestEncouragement = async (context = {}) => {
  const response = await apiClient.post(`${ENDPOINTS.message}/encourage`, context);
  return response.data;
};

/**
 * Requests reflection prompt
 * @param {Object} context - Context
 * @returns {Promise<Object>} Reflection prompt
 */
export const requestReflection = async (context = {}) => {
  const response = await apiClient.post(`${ENDPOINTS.message}/reflect`, context);
  return response.data;
};

// =============================================================================
// CHARACTER OPERATIONS
// =============================================================================

/**
 * Gets available characters based on user progress
 * @returns {Promise<Object>} Available characters
 */
export const getAvailableCharacters = async () => {
  const cached = getCache('navigator_characters', CACHE_TTL.characters);
  if (cached) {
    return cached;
  }
  
  const response = await apiClient.get(ENDPOINTS.characters);
  
  setCache('navigator_characters', response.data);
  
  return response.data;
};

/**
 * Gets character for current stage
 * @param {number} stageNumber - Stage number
 * @returns {string} Character type
 */
export const getCharacterForStage = (stageNumber) => {
  if (stageNumber <= 7) {
    return AI_CHARACTERS.COMPANION;
  } else if (stageNumber <= 21) {
    return AI_CHARACTERS.COACH;
  } else {
    return AI_CHARACTERS.MENTOR;
  }
};

// =============================================================================
// PREFERENCES
// =============================================================================

/**
 * Gets Navigator preferences
 * @returns {Promise<Object>} Preferences
 */
export const getPreferences = async () => {
  const response = await apiClient.get(ENDPOINTS.preferences);
  return response.data;
};

/**
 * Updates Navigator preferences
 * @param {Object} preferences - Preferences to update
 * @returns {Promise<Object>} Updated preferences
 */
export const updatePreferences = async (preferences) => {
  const response = await apiClient.patch(ENDPOINTS.preferences, preferences);
  
  logUserAction('navigator_preferences_updated');
  
  return response.data;
};

// =============================================================================
// FEEDBACK ON AI
// =============================================================================

/**
 * Submits feedback on AI response
 * @param {string} messageId - Message ID
 * @param {Object} feedback - Feedback data
 * @returns {Promise<void>}
 */
export const submitResponseFeedback = async (messageId, { rating, comment }) => {
  await apiClient.post(`${ENDPOINTS.feedback}/${messageId}`, {
    rating,
    comment
  });
  
  logUserAction('navigator_feedback_submitted', { messageId, rating });
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Gets character info
 * @param {string} character - Character type
 * @returns {Object} Character info
 */
export const getCharacterInfo = (character) => {
  return CHARACTER_INFO[character] || CHARACTER_INFO[AI_CHARACTERS.NAVIGATOR];
};

/**
 * Formats AI message for display
 * @param {Object} message - Message object
 * @returns {Object} Formatted message
 */
export const formatMessage = (message) => {
  return {
    id: message.id,
    content: message.content,
    character: message.character,
    characterInfo: getCharacterInfo(message.character),
    type: message.type || MESSAGE_TYPES.TEXT,
    timestamp: message.createdAt,
    isAI: true
  };
};

/**
 * Creates quick action buttons based on context
 * @param {Object} context - Current context
 * @returns {Array} Quick actions
 */
export const getQuickActions = (context) => {
  const actions = [
    { id: 'hint', label: 'Get a hint', icon: '💡' },
    { id: 'explain', label: 'Explain this', icon: '📖' },
    { id: 'encourage', label: 'Encourage me', icon: '💪' }
  ];
  
  if (context?.biteId) {
    actions.push({ id: 'feedback', label: 'Review my work', icon: '📝' });
  }
  
  if (context?.missionId) {
    actions.push({ id: 'next', label: "What's next?", icon: '➡️' });
  }
  
  return actions;
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Chat
  sendMessage,
  getChatHistory,
  clearChatHistory,
  
  // Context
  updateContext,
  getContext,
  setMissionContext,
  setBiteContext,
  
  // Suggestions
  getSuggestions,
  getNextStepSuggestion,
  getLearningPathSuggestions,
  
  // Specialized
  requestHint,
  requestFeedback,
  requestEncouragement,
  requestReflection,
  
  // Characters
  getAvailableCharacters,
  getCharacterForStage,
  
  // Preferences
  getPreferences,
  updatePreferences,
  
  // Feedback
  submitResponseFeedback,
  
  // Helpers
  getCharacterInfo,
  formatMessage,
  getQuickActions,
  
  // Constants
  AI_CHARACTERS,
  CHARACTER_INFO,
  MESSAGE_TYPES
};