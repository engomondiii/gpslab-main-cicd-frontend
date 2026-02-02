/**
 * GPS Lab Platform - Navigator Service
 * 
 * AI Navigator service for interacting with GPS Lab's AI characters
 * including Navigator, Companion, Coach, and Mentor.
 * 
 * MOCK MODE: When REACT_APP_USE_MOCK_DATA=true or API is unreachable,
 * all methods return realistic mock data for frontend-only development.
 * 
 * @module services/api/navigator.service
 * @version 1.1.0
 */

import apiClient from './client';
import { getCache, setCache } from '../storage/localStorage.service';
import { logUserAction } from '../../utils/error/logger';
import { on as wsOn, send as wsSend } from '../websocket/websocket.service';

// =============================================================================
// MOCK MODE CONFIGURATION
// =============================================================================

const USE_MOCK = process.env.REACT_APP_USE_MOCK_DATA === 'true' ||
                 process.env.NODE_ENV === 'development';

const mockDelay = (ms = 300) => new Promise(r => setTimeout(r, ms));
const logMock = (method) => console.info(`[NavigatorService:MOCK] ${method}`);

// =============================================================================
// MOCK DATA
// =============================================================================

let mockChatHistory = [
  {
    id: 'msg_001', role: 'user', character: 'navigator',
    content: 'How do I start with systems thinking?',
    type: 'text', createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'msg_002', role: 'assistant', character: 'navigator',
    content: 'Great question! Systems thinking starts with understanding that problems are interconnected. Here are 3 steps to begin:\n\n1. **Identify the system** — What are the key elements involved?\n2. **Map relationships** — How do these elements influence each other?\n3. **Find leverage points** — Where can small changes create big impact?\n\nTry applying this to a challenge in your community. What comes to mind?',
    type: 'guidance', createdAt: new Date(Date.now() - 3500000).toISOString()
  }
];

let mockContext = {
  type: 'general',
  missionId: null,
  biteId: null,
  stageNumber: 2,
  adventureNumber: 1,
  userLevel: 5,
  recentActivity: 'mission_progress'
};

const MOCK_AI_RESPONSES = {
  general: [
    "That's a thoughtful question! Let me help you explore it from the GPS perspective. The key is to connect theory with your local context — what real-world examples come to mind?",
    "Great thinking! You're developing strong problem-solving instincts. Remember the framework from your current mission: observe, analyze, and then design a response.",
    "I like where you're going with this. Consider how different stakeholders might see this issue. That multiplicity of perspectives is what makes GPS thinking powerful."
  ],
  hint: [
    "Here's a nudge: think about the *relationships* between the elements, not just the elements themselves. What happens when one changes?",
    "Try looking at this from the community's perspective. What would they say is the real problem behind the problem?",
    "Remember the root cause analysis technique from Bite 3? Apply that same logic here — keep asking 'why' until you get to the foundation."
  ],
  encouragement: [
    "You're doing amazing work! Your consistency shows real dedication. 7 days in a row — that's GPS solver energy! 🔥",
    "Keep pushing forward! Every mission you complete is building skills that will help you create real change in your community.",
    "I'm impressed by your thoughtfulness. The way you approach problems shows you're becoming a true GPS thinker."
  ],
  feedback: [
    "Your analysis shows good understanding of the core concepts. To strengthen it further, try incorporating more data points and consider the second-order effects of your proposed solution.",
    "Solid work! I especially liked how you connected the theory to your local context. Next time, try exploring counterarguments to make your analysis even stronger.",
    "Good effort! You've identified the key stakeholders well. Consider adding a systems map to visualize the relationships — it will make your argument more compelling."
  ],
  reflection: [
    "Take a moment to consider: how has your understanding of this topic changed since you started the mission? What surprised you most?",
    "Here's a reflection prompt: if you could explain what you've learned to someone in your community, what would you say first? What matters most?",
    "Think about how this connects to your personal GPS compass. How does this learning align with the change you want to create?"
  ]
};

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const MOCK_SUGGESTIONS = [
  { id: 'sug_001', type: 'continue', text: 'Continue with your current mission', icon: '▶️', priority: 1 },
  { id: 'sug_002', type: 'review', text: 'Review Stage 1 key concepts', icon: '📖', priority: 2 },
  { id: 'sug_003', type: 'practice', text: 'Try a practice exercise on systems mapping', icon: '🗺️', priority: 3 },
  { id: 'sug_004', type: 'social', text: 'Connect with your party members', icon: '👥', priority: 4 }
];

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
  characters: 60 * 60 * 1000,
  suggestions: 5 * 60 * 1000
};

// =============================================================================
// AI CHARACTER CONSTANTS
// =============================================================================

export const AI_CHARACTERS = {
  NAVIGATOR: 'navigator',
  COMPANION: 'companion',
  COACH: 'coach',
  MENTOR: 'mentor'
};

export const CHARACTER_INFO = {
  [AI_CHARACTERS.NAVIGATOR]: {
    name: 'Navigator', description: 'Your primary guide through the GPS Lab journey',
    avatar: '🧭', color: 'blue', personality: 'Helpful, knowledgeable, encouraging',
    availability: 'Always available'
  },
  [AI_CHARACTERS.COMPANION]: {
    name: 'Companion', description: 'Your learning buddy for early adventures',
    avatar: '🤝', color: 'green', personality: 'Friendly, patient, supportive',
    availability: 'Stages 1-7 (Adventures 1-2)'
  },
  [AI_CHARACTERS.COACH]: {
    name: 'Coach', description: 'Your performance coach for skill building',
    avatar: '🏆', color: 'orange', personality: 'Motivating, challenging, strategic',
    availability: 'Stages 8-21 (Adventures 3-5)'
  },
  [AI_CHARACTERS.MENTOR]: {
    name: 'Mentor', description: 'Your wisdom advisor for mastery',
    avatar: '🦉', color: 'purple', personality: 'Wise, reflective, insightful',
    availability: 'Stages 22-35 (Adventures 6-7)'
  }
};

export const MESSAGE_TYPES = {
  TEXT: 'text', GUIDANCE: 'guidance', HINT: 'hint', FEEDBACK: 'feedback',
  ENCOURAGEMENT: 'encouragement', CHALLENGE: 'challenge', REFLECTION: 'reflection'
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
  if (USE_MOCK) {
    logMock(`sendMessage (${character}): "${message.substring(0, 50)}..."`);

    // Store user message
    mockChatHistory.push({
      id: 'msg_user_' + Date.now(), role: 'user', character,
      content: message, type: 'text', createdAt: new Date().toISOString()
    });

    if (streamResponse) {
      // Simulate streaming
      const fullResponse = randomFrom(MOCK_AI_RESPONSES.general);
      const chunks = fullResponse.match(/.{1,20}/g) || [fullResponse];

      return new Promise((resolve) => {
        let accumulated = '';
        let i = 0;

        const interval = setInterval(() => {
          if (i >= chunks.length) {
            clearInterval(interval);

            const aiMsg = {
              id: 'msg_ai_' + Date.now(), role: 'assistant', character,
              content: accumulated, type: 'guidance', createdAt: new Date().toISOString()
            };
            mockChatHistory.push(aiMsg);

            resolve({ message: accumulated, character, done: true, messageId: aiMsg.id });
            return;
          }

          accumulated += chunks[i];
          window.dispatchEvent(new CustomEvent('navigator:stream', {
            detail: { chunk: chunks[i], accumulated }
          }));
          i++;
        }, 80);
      });
    }

    await mockDelay(800);
    const responseText = randomFrom(MOCK_AI_RESPONSES.general);

    const aiMsg = {
      id: 'msg_ai_' + Date.now(), role: 'assistant', character,
      content: responseText, type: 'guidance', createdAt: new Date().toISOString()
    };
    mockChatHistory.push(aiMsg);
    logUserAction('navigator_message_sent', { character });

    return { message: responseText, character, messageId: aiMsg.id, type: 'guidance' };
  }

  // --- LIVE API ---
  const payload = {
    message, character,
    context: { ...context, timestamp: new Date().toISOString() }
  };

  if (streamResponse) {
    return new Promise((resolve, reject) => {
      let response = '';
      const unsubscribe = wsOn('navigator:message', (data) => {
        if (data.done) {
          unsubscribe();
          resolve({ message: response, character, ...data });
        } else {
          response += data.chunk;
          window.dispatchEvent(new CustomEvent('navigator:stream', {
            detail: { chunk: data.chunk, accumulated: response }
          }));
        }
      });
      wsSend('navigator:message', payload);
      setTimeout(() => { unsubscribe(); reject(new Error('Navigator response timeout')); }, 60000);
    });
  }

  const response = await apiClient.post(ENDPOINTS.message, payload);
  logUserAction('navigator_message_sent', { character });
  return response.data;
};

/**
 * Gets chat history
 */
export const getChatHistory = async ({ character, limit = 50, before } = {}) => {
  if (USE_MOCK) {
    logMock('getChatHistory');
    await mockDelay(250);
    let msgs = [...mockChatHistory];
    if (character) msgs = msgs.filter(m => m.character === character);
    if (before) msgs = msgs.filter(m => m.createdAt < before);
    return { messages: msgs.slice(-limit), total: msgs.length };
  }

  const params = { limit };
  if (character) params.character = character;
  if (before) params.before = before;
  const response = await apiClient.get(ENDPOINTS.history, { params });
  return response.data;
};

/**
 * Clears chat history
 */
export const clearChatHistory = async (character) => {
  if (USE_MOCK) {
    logMock('clearChatHistory');
    await mockDelay(300);
    if (character) {
      mockChatHistory = mockChatHistory.filter(m => m.character !== character);
    } else {
      mockChatHistory = [];
    }
    logUserAction('navigator_history_cleared', { character });
    return;
  }

  const params = {};
  if (character) params.character = character;
  await apiClient.delete(ENDPOINTS.history, { params });
  logUserAction('navigator_history_cleared', { character });
};

// =============================================================================
// CONTEXT OPERATIONS
// =============================================================================

export const updateContext = async (context) => {
  if (USE_MOCK) {
    logMock('updateContext');
    await mockDelay(200);
    mockContext = { ...mockContext, ...context };
    return { ...mockContext };
  }
  const response = await apiClient.put(ENDPOINTS.context, context);
  return response.data;
};

export const getContext = async () => {
  if (USE_MOCK) {
    logMock('getContext');
    await mockDelay(150);
    return { ...mockContext };
  }
  const response = await apiClient.get(ENDPOINTS.context);
  return response.data;
};

export const setMissionContext = async (missionId, additionalContext = {}) => {
  return updateContext({ type: 'mission', missionId, ...additionalContext });
};

export const setBiteContext = async (biteId, additionalContext = {}) => {
  return updateContext({ type: 'bite', biteId, ...additionalContext });
};

// =============================================================================
// SUGGESTIONS
// =============================================================================

export const getSuggestions = async ({ type, context } = {}) => {
  if (USE_MOCK) {
    logMock('getSuggestions');
    await mockDelay(300);
    let sug = [...MOCK_SUGGESTIONS];
    if (type) sug = sug.filter(s => s.type === type);
    return { suggestions: sug };
  }

  const cacheKey = `navigator_suggestions_${type || 'general'}`;
  const cached = getCache(cacheKey, CACHE_TTL.suggestions);
  if (cached) return cached;

  const params = {};
  if (type) params.type = type;
  if (context) params.context = JSON.stringify(context);
  const response = await apiClient.get(ENDPOINTS.suggestions, { params });
  setCache(cacheKey, response.data);
  return response.data;
};

export const getNextStepSuggestion = async () => {
  if (USE_MOCK) {
    logMock('getNextStepSuggestion');
    await mockDelay(250);
    return { ...MOCK_SUGGESTIONS[0], reason: 'Based on your current progress in Stage 2' };
  }
  const response = await apiClient.get(`${ENDPOINTS.suggestions}/next`);
  return response.data;
};

export const getLearningPathSuggestions = async () => {
  if (USE_MOCK) {
    logMock('getLearningPathSuggestions');
    await mockDelay(350);
    return {
      currentPath: { adventure: 1, stage: 2, mission: 4, progress: 40 },
      recommendations: [
        { action: 'Complete current mission', priority: 'high', estimated: '45 minutes' },
        { action: 'Review Stage 1 checkpoint', priority: 'medium', estimated: '20 minutes' },
        { action: 'Start Stage 3 when ready', priority: 'low', estimated: 'Next week' }
      ]
    };
  }
  const response = await apiClient.get(`${ENDPOINTS.suggestions}/path`);
  return response.data;
};

// =============================================================================
// SPECIALIZED INTERACTIONS
// =============================================================================

export const requestHint = async ({ biteId, checkpointId, question }) => {
  if (USE_MOCK) {
    logMock('requestHint');
    await mockDelay(600);
    logUserAction('navigator_hint_requested', { biteId, checkpointId });
    return { hint: randomFrom(MOCK_AI_RESPONSES.hint), type: 'hint', biteId, checkpointId };
  }
  const response = await apiClient.post(`${ENDPOINTS.message}/hint`, { biteId, checkpointId, question });
  logUserAction('navigator_hint_requested', { biteId, checkpointId });
  return response.data;
};

export const requestFeedback = async ({ content, type, context }) => {
  if (USE_MOCK) {
    logMock('requestFeedback');
    await mockDelay(1000);
    logUserAction('navigator_feedback_requested', { type });
    return { feedback: randomFrom(MOCK_AI_RESPONSES.feedback), type: 'feedback', contentType: type };
  }
  const response = await apiClient.post(`${ENDPOINTS.message}/feedback`, { content, type, context });
  logUserAction('navigator_feedback_requested', { type });
  return response.data;
};

export const requestEncouragement = async (context = {}) => {
  if (USE_MOCK) {
    logMock('requestEncouragement');
    await mockDelay(500);
    return { message: randomFrom(MOCK_AI_RESPONSES.encouragement), type: 'encouragement' };
  }
  const response = await apiClient.post(`${ENDPOINTS.message}/encourage`, context);
  return response.data;
};

export const requestReflection = async (context = {}) => {
  if (USE_MOCK) {
    logMock('requestReflection');
    await mockDelay(500);
    return { prompt: randomFrom(MOCK_AI_RESPONSES.reflection), type: 'reflection' };
  }
  const response = await apiClient.post(`${ENDPOINTS.message}/reflect`, context);
  return response.data;
};

// =============================================================================
// CHARACTER OPERATIONS
// =============================================================================

export const getAvailableCharacters = async () => {
  if (USE_MOCK) {
    logMock('getAvailableCharacters');
    await mockDelay(200);
    return {
      characters: [
        { ...CHARACTER_INFO[AI_CHARACTERS.NAVIGATOR], available: true, unlocked: true },
        { ...CHARACTER_INFO[AI_CHARACTERS.COMPANION], available: true, unlocked: true },
        { ...CHARACTER_INFO[AI_CHARACTERS.COACH], available: false, unlocked: false, unlocksAt: 'Stage 8' },
        { ...CHARACTER_INFO[AI_CHARACTERS.MENTOR], available: false, unlocked: false, unlocksAt: 'Stage 22' }
      ]
    };
  }

  const cached = getCache('navigator_characters', CACHE_TTL.characters);
  if (cached) return cached;
  const response = await apiClient.get(ENDPOINTS.characters);
  setCache('navigator_characters', response.data);
  return response.data;
};

export const getCharacterForStage = (stageNumber) => {
  if (stageNumber <= 7) return AI_CHARACTERS.COMPANION;
  if (stageNumber <= 21) return AI_CHARACTERS.COACH;
  return AI_CHARACTERS.MENTOR;
};

// =============================================================================
// PREFERENCES
// =============================================================================

export const getPreferences = async () => {
  if (USE_MOCK) {
    logMock('getPreferences');
    await mockDelay(200);
    return {
      personality: 'encouraging',
      responseLength: 'medium',
      language: 'en',
      autoSuggestions: true,
      soundEffects: true
    };
  }
  const response = await apiClient.get(ENDPOINTS.preferences);
  return response.data;
};

export const updatePreferences = async (preferences) => {
  if (USE_MOCK) {
    logMock('updatePreferences');
    await mockDelay(300);
    logUserAction('navigator_preferences_updated');
    return { ...preferences };
  }
  const response = await apiClient.patch(ENDPOINTS.preferences, preferences);
  logUserAction('navigator_preferences_updated');
  return response.data;
};

// =============================================================================
// FEEDBACK ON AI
// =============================================================================

export const submitResponseFeedback = async (messageId, { rating, comment }) => {
  if (USE_MOCK) {
    logMock(`submitResponseFeedback: ${messageId} (${rating})`);
    await mockDelay(300);
    logUserAction('navigator_feedback_submitted', { messageId, rating });
    return;
  }
  await apiClient.post(`${ENDPOINTS.feedback}/${messageId}`, { rating, comment });
  logUserAction('navigator_feedback_submitted', { messageId, rating });
};

// =============================================================================
// HELPER FUNCTIONS (no API calls — unchanged)
// =============================================================================

export const getCharacterInfo = (character) => {
  return CHARACTER_INFO[character] || CHARACTER_INFO[AI_CHARACTERS.NAVIGATOR];
};

export const formatMessage = (message) => ({
  id: message.id,
  content: message.content,
  character: message.character,
  characterInfo: getCharacterInfo(message.character),
  type: message.type || MESSAGE_TYPES.TEXT,
  timestamp: message.createdAt,
  isAI: message.role === 'assistant'
});

export const getQuickActions = (context) => {
  const actions = [
    { id: 'hint', label: 'Get a hint', icon: '💡' },
    { id: 'explain', label: 'Explain this', icon: '📖' },
    { id: 'encourage', label: 'Encourage me', icon: '💪' }
  ];
  if (context?.biteId) actions.push({ id: 'feedback', label: 'Review my work', icon: '📝' });
  if (context?.missionId) actions.push({ id: 'next', label: "What's next?", icon: '➡️' });
  return actions;
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  sendMessage, getChatHistory, clearChatHistory,
  updateContext, getContext, setMissionContext, setBiteContext,
  getSuggestions, getNextStepSuggestion, getLearningPathSuggestions,
  requestHint, requestFeedback, requestEncouragement, requestReflection,
  getAvailableCharacters, getCharacterForStage,
  getPreferences, updatePreferences,
  submitResponseFeedback,
  getCharacterInfo, formatMessage, getQuickActions,
  AI_CHARACTERS, CHARACTER_INFO, MESSAGE_TYPES
};