/**
 * GPS Lab Platform - Checkpoint Service
 * 
 * Checkpoint evaluation service for managing mission checkpoints,
 * assessments, and progression gates.
 * 
 * MOCK MODE: When REACT_APP_USE_MOCK_DATA=true or API is unreachable,
 * all methods return realistic mock data for frontend-only development.
 * 
 * @module services/api/checkpoint.service
 * @version 1.1.0
 */

import apiClient from './client';
import { getCache, setCache } from '../storage/localStorage.service';
import { saveCheckpointAttempt, getCheckpointAttempt } from '../storage/sessionStorage.service';
import { logUserAction } from '../../utils/error/logger';

// =============================================================================
// MOCK MODE CONFIGURATION
// =============================================================================

const USE_MOCK = process.env.REACT_APP_USE_MOCK_DATA === 'true' ||
                 process.env.NODE_ENV === 'development';

const mockDelay = (ms = 300) => new Promise(r => setTimeout(r, ms));
const logMock = (method) => console.info(`[CheckpointService:MOCK] ${method}`);

// =============================================================================
// MOCK DATA
// =============================================================================

/**
 * In-memory mock checkpoint state per mission
 */
const mockCheckpointState = {};

const getMockCheckpoint = (missionId) => {
  if (!mockCheckpointState[missionId]) {
    mockCheckpointState[missionId] = {
      missionId,
      type: 'quiz',
      status: 'available',
      passingScore: 70,
      timeLimit: 30 * 60,
      maxAttempts: 3,
      attempts: 0,
      retryCost: 50,
      bestScore: null,
      questions: [
        {
          id: `${missionId}_q1`, type: 'multiple_choice', answered: false,
          question: 'What is the primary purpose of GPS thinking?',
          options: ['Individual achievement', 'Solving global problems collaboratively', 'Academic research only', 'Technology development'],
          correctIndex: 1, points: 20
        },
        {
          id: `${missionId}_q2`, type: 'multiple_choice', answered: false,
          question: 'Which step comes first in the problem-solving framework?',
          options: ['Implementation', 'Empathy & understanding', 'Scaling', 'Testing'],
          correctIndex: 1, points: 20
        },
        {
          id: `${missionId}_q3`, type: 'short_answer', answered: false,
          question: 'Describe one local challenge in your community and how systems thinking could help address it.',
          rubric: ['Identifies real challenge', 'Applies systems thinking', 'Shows depth of analysis'],
          points: 25
        },
        {
          id: `${missionId}_q4`, type: 'multiple_choice', answered: false,
          question: 'Stakeholder interviews are most valuable for:',
          options: ['Building professional networks', 'Understanding diverse perspectives', 'Collecting quantitative data', 'Satisfying requirements'],
          correctIndex: 1, points: 15
        },
        {
          id: `${missionId}_q5`, type: 'reflection', answered: false,
          question: 'Reflect on how you would apply the concepts from this mission to a real-world problem you care about.',
          rubric: ['Personal connection', 'Conceptual understanding', 'Actionable insights'],
          points: 20
        }
      ],
      hints: [
        { index: 0, text: 'Think about the core values of GPS Lab — collaboration and impact.', cost: 0, revealed: false },
        { index: 1, text: 'Remember the 5-step framework from the mission briefing.', cost: 10, revealed: false },
        { index: 2, text: 'Consider multiple stakeholder perspectives when analyzing systems.', cost: 25, revealed: false }
      ]
    };
  }
  return mockCheckpointState[missionId];
};

const MOCK_HISTORY_ENTRIES = [
  { attemptNumber: 1, score: 65, passed: false, submittedAt: '2025-12-15T10:30:00Z', duration: 1200 },
  { attemptNumber: 2, score: 82, passed: true, submittedAt: '2025-12-16T14:20:00Z', duration: 980 }
];

// =============================================================================
// API ENDPOINTS
// =============================================================================

const ENDPOINTS = {
  checkpoint: (missionId) => `/missions/${missionId}/checkpoint`,
  start: (missionId) => `/missions/${missionId}/checkpoint/start`,
  submit: (missionId) => `/missions/${missionId}/checkpoint/submit`,
  result: (missionId) => `/missions/${missionId}/checkpoint/result`,
  history: (missionId) => `/missions/${missionId}/checkpoint/history`,
  hints: (missionId) => `/missions/${missionId}/checkpoint/hints`,
  review: (missionId) => `/missions/${missionId}/checkpoint/review`
};

// =============================================================================
// CACHE CONFIGURATION
// =============================================================================

const CACHE_TTL = {
  checkpoint: 5 * 60 * 1000,
  hints: 10 * 60 * 1000
};

// =============================================================================
// CHECKPOINT TYPES
// =============================================================================

export const CHECKPOINT_TYPES = {
  QUIZ: 'quiz',
  REFLECTION: 'reflection',
  PRACTICAL: 'practical',
  PEER_REVIEW: 'peer_review',
  AI_ASSESSMENT: 'ai_assessment',
  PORTFOLIO: 'portfolio'
};

export const CHECKPOINT_STATUS = {
  LOCKED: 'locked',
  AVAILABLE: 'available',
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  PASSED: 'passed',
  FAILED: 'failed',
  RETRY_AVAILABLE: 'retry_available'
};

// =============================================================================
// CHECKPOINT OPERATIONS
// =============================================================================

/**
 * Gets checkpoint for a mission
 * @param {string} missionId - Mission ID
 * @param {Object} options - Options
 * @returns {Promise<Object>} Checkpoint data
 */
export const getCheckpoint = async (missionId, { useCache = true } = {}) => {
  if (USE_MOCK) {
    logMock(`getCheckpoint: ${missionId}`);
    await mockDelay(250);
    const cp = getMockCheckpoint(missionId);
    return { ...cp, questions: cp.questions.map(({ correctIndex, rubric, ...q }) => q) };
  }

  const cacheKey = `checkpoint_${missionId}`;
  if (useCache) {
    const cached = getCache(cacheKey, CACHE_TTL.checkpoint);
    if (cached) return cached;
  }

  const response = await apiClient.get(ENDPOINTS.checkpoint(missionId));
  setCache(cacheKey, response.data);
  return response.data;
};

/**
 * Starts a checkpoint session
 * @param {string} missionId - Mission ID
 * @returns {Promise<Object>} Checkpoint session with questions
 */
export const startCheckpoint = async (missionId) => {
  if (USE_MOCK) {
    logMock(`startCheckpoint: ${missionId}`);
    await mockDelay(500);

    const cp = getMockCheckpoint(missionId);
    cp.status = 'in_progress';
    cp.attempts += 1;

    const sessionId = `chk_mock_${Date.now()}`;
    const now = new Date();

    saveCheckpointAttempt(missionId, {
      sessionId,
      startedAt: now.toISOString(),
      questions: cp.questions.length
    });

    logUserAction('checkpoint_started', { missionId });
    window.dispatchEvent(new CustomEvent('checkpoint:started', {
      detail: { missionId, sessionId }
    }));

    return {
      sessionId,
      missionId,
      questions: cp.questions.map(({ correctIndex, rubric, ...q }) => q),
      timeLimit: cp.timeLimit,
      startedAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + cp.timeLimit * 1000).toISOString()
    };
  }

  const response = await apiClient.post(ENDPOINTS.start(missionId));

  saveCheckpointAttempt(missionId, {
    sessionId: response.data.sessionId,
    startedAt: new Date().toISOString(),
    questions: response.data.questions?.length || 0
  });
  logUserAction('checkpoint_started', { missionId });
  window.dispatchEvent(new CustomEvent('checkpoint:started', {
    detail: { missionId, ...response.data }
  }));

  return response.data;
};

/**
 * Submits checkpoint answers
 * @param {string} missionId - Mission ID
 * @param {Object} submission - Answers { answers: [{ questionId, answer }] }
 * @returns {Promise<Object>} Scored result
 */
export const submitCheckpoint = async (missionId, submission) => {
  if (USE_MOCK) {
    logMock(`submitCheckpoint: ${missionId}`);
    await mockDelay(800);

    const cp = getMockCheckpoint(missionId);
    const score = Math.floor(Math.random() * 25) + 75;
    const passed = score >= cp.passingScore;

    cp.status = passed ? 'passed' : 'failed';
    cp.bestScore = Math.max(cp.bestScore || 0, score);

    const result = {
      sessionId: getCheckpointAttempt(missionId)?.sessionId || 'chk_mock',
      missionId, score, passed,
      maxScore: 100,
      passingScore: cp.passingScore,
      attemptNumber: cp.attempts,
      feedback: passed
        ? 'Excellent work! You demonstrated strong understanding of the core concepts.'
        : 'Good effort. Review the mission material and try again — you are close!',
      breakdown: cp.questions.map((q, i) => ({
        questionId: q.id,
        correct: i < 3 || score >= 85,
        score: Math.min(q.points, Math.floor(q.points * (score / 100) + (i < 2 ? 5 : 0))),
        maxScore: q.points
      })),
      rewards: passed ? { xp: 200, baraka: 100 } : null,
      completedAt: new Date().toISOString()
    };

    invalidateCheckpointCache(missionId);
    logUserAction('checkpoint_submitted', { missionId, passed, score });
    window.dispatchEvent(new CustomEvent('checkpoint:submitted', { detail: { missionId, ...result } }));

    return result;
  }

  const attempt = getCheckpointAttempt(missionId);
  const response = await apiClient.post(ENDPOINTS.submit(missionId), {
    ...submission,
    sessionId: attempt?.sessionId,
    submittedAt: new Date().toISOString()
  });

  invalidateCheckpointCache(missionId);
  logUserAction('checkpoint_submitted', {
    missionId, passed: response.data.passed, score: response.data.score
  });
  window.dispatchEvent(new CustomEvent('checkpoint:submitted', {
    detail: { missionId, ...response.data }
  }));

  return response.data;
};

/**
 * Gets checkpoint result
 * @param {string} missionId - Mission ID
 * @returns {Promise<Object>} Latest result
 */
export const getCheckpointResult = async (missionId) => {
  if (USE_MOCK) {
    logMock(`getCheckpointResult: ${missionId}`);
    await mockDelay(200);
    const cp = getMockCheckpoint(missionId);
    return {
      missionId,
      status: cp.status,
      bestScore: cp.bestScore,
      attempts: cp.attempts,
      passed: cp.status === 'passed'
    };
  }

  const response = await apiClient.get(ENDPOINTS.result(missionId));
  return response.data;
};

/**
 * Gets checkpoint attempt history
 * @param {string} missionId - Mission ID
 * @param {Object} params - Query params
 * @returns {Promise<Object>} History
 */
export const getCheckpointHistory = async (missionId, { page = 1, limit = 10 } = {}) => {
  if (USE_MOCK) {
    logMock(`getCheckpointHistory: ${missionId}`);
    await mockDelay(250);
    return {
      missionId,
      attempts: MOCK_HISTORY_ENTRIES.map(e => ({ ...e, missionId })),
      pagination: { page, limit, total: MOCK_HISTORY_ENTRIES.length, totalPages: 1 }
    };
  }

  const response = await apiClient.get(ENDPOINTS.history(missionId), { params: { page, limit } });
  return response.data;
};

// =============================================================================
// HINTS & ASSISTANCE
// =============================================================================

/**
 * Gets available hints for checkpoint
 * @param {string} missionId - Mission ID
 * @returns {Promise<Object>} Hints metadata
 */
export const getCheckpointHints = async (missionId) => {
  if (USE_MOCK) {
    logMock(`getCheckpointHints: ${missionId}`);
    await mockDelay(200);
    const cp = getMockCheckpoint(missionId);
    return {
      missionId,
      hints: cp.hints.map(h => ({
        index: h.index,
        cost: h.cost,
        revealed: h.revealed,
        text: h.revealed ? h.text : null
      })),
      total: cp.hints.length,
      revealed: cp.hints.filter(h => h.revealed).length
    };
  }

  const cacheKey = `checkpoint_hints_${missionId}`;
  const cached = getCache(cacheKey, CACHE_TTL.hints);
  if (cached) return cached;

  const response = await apiClient.get(ENDPOINTS.hints(missionId));
  setCache(cacheKey, response.data);
  return response.data;
};

/**
 * Requests a hint (may cost Baraka)
 * @param {string} missionId - Mission ID
 * @param {number} hintIndex - Hint index
 * @returns {Promise<Object>} Revealed hint
 */
export const requestHint = async (missionId, hintIndex) => {
  if (USE_MOCK) {
    logMock(`requestHint: ${missionId} #${hintIndex}`);
    await mockDelay(400);

    const cp = getMockCheckpoint(missionId);
    const hint = cp.hints.find(h => h.index === hintIndex);
    if (!hint) throw new Error(`Hint ${hintIndex} not found`);

    hint.revealed = true;
    logUserAction('checkpoint_hint_requested', { missionId, hintIndex });

    return { index: hint.index, text: hint.text, cost: hint.cost };
  }

  const response = await apiClient.post(`${ENDPOINTS.hints(missionId)}/${hintIndex}`);
  logUserAction('checkpoint_hint_requested', { missionId, hintIndex });
  return response.data;
};

// =============================================================================
// REVIEW & FEEDBACK
// =============================================================================

/**
 * Gets checkpoint review/feedback
 * @param {string} missionId - Mission ID
 * @returns {Promise<Object>} Review data
 */
export const getCheckpointReview = async (missionId) => {
  if (USE_MOCK) {
    logMock(`getCheckpointReview: ${missionId}`);
    await mockDelay(300);
    const cp = getMockCheckpoint(missionId);
    return {
      missionId,
      score: cp.bestScore || 0,
      status: cp.status,
      feedback: 'You showed good understanding of the core concepts. Consider exploring systems mapping in more depth.',
      strengths: ['Clear problem identification', 'Good use of examples'],
      areasForImprovement: ['Deeper systems analysis', 'More stakeholder perspectives'],
      reviewedAt: new Date().toISOString()
    };
  }

  const response = await apiClient.get(ENDPOINTS.review(missionId));
  return response.data;
};

/**
 * Requests AI review of checkpoint submission
 * @param {string} missionId - Mission ID
 * @returns {Promise<Object>} AI review
 */
export const requestAIReview = async (missionId) => {
  if (USE_MOCK) {
    logMock(`requestAIReview: ${missionId}`);
    await mockDelay(1200);
    logUserAction('checkpoint_ai_review_requested', { missionId });
    return {
      missionId,
      aiScore: Math.floor(Math.random() * 15) + 80,
      summary: 'Your submission demonstrates solid foundational understanding. The reflection section shows genuine personal connection to the material.',
      detailedFeedback: [
        { area: 'Conceptual Understanding', score: 85, comment: 'Strong grasp of core framework.' },
        { area: 'Application', score: 78, comment: 'Good real-world connections. Try to be more specific.' },
        { area: 'Critical Thinking', score: 82, comment: 'Evidence of deeper analysis. Push further.' }
      ],
      recommendations: [
        'Revisit the systems mapping exercise in Bite 3',
        'Try discussing your analysis with a party member for new perspectives'
      ],
      reviewedAt: new Date().toISOString()
    };
  }

  const response = await apiClient.post(`${ENDPOINTS.review(missionId)}/ai`);
  logUserAction('checkpoint_ai_review_requested', { missionId });
  return response.data;
};

// =============================================================================
// RETRY OPERATIONS
// =============================================================================

/**
 * Checks if retry is available
 * @param {string} missionId - Mission ID
 * @returns {Promise<Object>} Retry availability
 */
export const checkRetryAvailability = async (missionId) => {
  if (USE_MOCK) {
    logMock(`checkRetryAvailability: ${missionId}`);
    await mockDelay(200);
    const cp = getMockCheckpoint(missionId);
    const canRetry = cp.attempts < cp.maxAttempts;
    return {
      missionId,
      available: canRetry,
      attemptsUsed: cp.attempts,
      maxAttempts: cp.maxAttempts,
      cost: canRetry ? cp.retryCost * cp.attempts : null,
      pr2rAvailable: true,
      cooldownEnds: null
    };
  }

  const response = await apiClient.get(`${ENDPOINTS.checkpoint(missionId)}/retry`);
  return response.data;
};

/**
 * Initiates checkpoint retry
 * @param {string} missionId - Mission ID
 * @param {Object} options - Retry options
 * @returns {Promise<Object>} New checkpoint session
 */
export const retryCheckpoint = async (missionId, { usePR2R = false } = {}) => {
  if (USE_MOCK) {
    logMock(`retryCheckpoint: ${missionId} (pR2R: ${usePR2R})`);
    await mockDelay(500);

    const cp = getMockCheckpoint(missionId);
    cp.status = 'available';
    cp.questions.forEach(q => { q.answered = false; });

    logUserAction('checkpoint_retry', { missionId, usePR2R });
    window.dispatchEvent(new CustomEvent('checkpoint:retry', { detail: { missionId } }));

    return {
      missionId,
      retryGranted: true,
      usedPR2R: usePR2R,
      attemptsRemaining: cp.maxAttempts - cp.attempts,
      cost: usePR2R ? 0 : cp.retryCost * cp.attempts
    };
  }

  const response = await apiClient.post(`${ENDPOINTS.checkpoint(missionId)}/retry`, { usePR2R });
  logUserAction('checkpoint_retry', { missionId, usePR2R });
  window.dispatchEvent(new CustomEvent('checkpoint:retry', { detail: { missionId, ...response.data } }));
  return response.data;
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Invalidates checkpoint cache
 * @param {string} missionId - Mission ID
 */
const invalidateCheckpointCache = (missionId) => {
  const { removeItem } = require('../storage/localStorage.service');
  removeItem(`cache_checkpoint_${missionId}`);
};

/**
 * Calculates checkpoint progress
 * @param {Object} checkpoint - Checkpoint data
 * @returns {Object} Progress { answered, total, percent }
 */
export const calculateCheckpointProgress = (checkpoint) => {
  if (!checkpoint || !checkpoint.questions) {
    return { answered: 0, total: 0, percent: 0 };
  }
  const answered = checkpoint.questions.filter(q => q.answered).length;
  const total = checkpoint.questions.length;
  return { answered, total, percent: total > 0 ? Math.round((answered / total) * 100) : 0 };
};

/**
 * Gets checkpoint status info
 * @param {string} status - Status code
 * @returns {Object} Status display info
 */
export const getCheckpointStatusInfo = (status) => {
  const statuses = {
    [CHECKPOINT_STATUS.LOCKED]: { label: 'Locked', color: 'gray', icon: '🔒' },
    [CHECKPOINT_STATUS.AVAILABLE]: { label: 'Available', color: 'blue', icon: '📋' },
    [CHECKPOINT_STATUS.IN_PROGRESS]: { label: 'In Progress', color: 'yellow', icon: '✏️' },
    [CHECKPOINT_STATUS.SUBMITTED]: { label: 'Submitted', color: 'purple', icon: '📤' },
    [CHECKPOINT_STATUS.PASSED]: { label: 'Passed', color: 'green', icon: '✅' },
    [CHECKPOINT_STATUS.FAILED]: { label: 'Failed', color: 'red', icon: '❌' },
    [CHECKPOINT_STATUS.RETRY_AVAILABLE]: { label: 'Retry Available', color: 'orange', icon: '🔄' }
  };
  return statuses[status] || { label: status, color: 'gray', icon: '❓' };
};

/**
 * Calculates time remaining for timed checkpoint
 * @param {Object} session - Checkpoint session
 * @returns {number|null} Seconds remaining
 */
export const calculateTimeRemaining = (session) => {
  if (!session || !session.expiresAt) return null;
  const remaining = Math.max(0, Math.floor((new Date(session.expiresAt) - new Date()) / 1000));
  return remaining;
};

/**
 * Formats time remaining for display
 * @param {number} seconds - Seconds remaining
 * @returns {string} Formatted "MM:SS"
 */
export const formatTimeRemaining = (seconds) => {
  if (seconds === null) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Core operations
  getCheckpoint,
  startCheckpoint,
  submitCheckpoint,
  getCheckpointResult,
  getCheckpointHistory,

  // Hints
  getCheckpointHints,
  requestHint,

  // Review
  getCheckpointReview,
  requestAIReview,

  // Retry
  checkRetryAvailability,
  retryCheckpoint,

  // Helpers
  calculateCheckpointProgress,
  getCheckpointStatusInfo,
  calculateTimeRemaining,
  formatTimeRemaining,

  // Constants
  CHECKPOINT_TYPES,
  CHECKPOINT_STATUS
};