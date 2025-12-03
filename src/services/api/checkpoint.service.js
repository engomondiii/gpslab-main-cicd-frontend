/**
 * GPS Lab Platform - Checkpoint Service
 * 
 * Checkpoint evaluation service for managing mission checkpoints,
 * assessments, and progression gates.
 * 
 * @module services/api/checkpoint.service
 * @version 1.0.0
 */

import apiClient from './client';
import { getCache, setCache } from '../storage/localStorage.service';
import { saveCheckpointAttempt, getCheckpointAttempt } from '../storage/sessionStorage.service';
import { logUserAction } from '../../utils/error/logger';

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
  checkpoint: 5 * 60 * 1000,  // 5 minutes
  hints: 10 * 60 * 1000       // 10 minutes
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
  const cacheKey = `checkpoint_${missionId}`;
  
  if (useCache) {
    const cached = getCache(cacheKey, CACHE_TTL.checkpoint);
    if (cached) {
      return cached;
    }
  }
  
  const response = await apiClient.get(ENDPOINTS.checkpoint(missionId));
  
  setCache(cacheKey, response.data);
  
  return response.data;
};

/**
 * Starts a checkpoint session
 * @param {string} missionId - Mission ID
 * @returns {Promise<Object>} Checkpoint session
 */
export const startCheckpoint = async (missionId) => {
  const response = await apiClient.post(ENDPOINTS.start(missionId));
  
  // Save attempt to session storage
  saveCheckpointAttempt(missionId, {
    sessionId: response.data.sessionId,
    startedAt: new Date().toISOString(),
    questions: response.data.questions?.length || 0
  });
  
  logUserAction('checkpoint_started', { missionId });
  
  // Dispatch event
  window.dispatchEvent(new CustomEvent('checkpoint:started', { 
    detail: { missionId, ...response.data }
  }));
  
  return response.data;
};

/**
 * Submits checkpoint answers
 * @param {string} missionId - Mission ID
 * @param {Object} submission - Submission data
 * @returns {Promise<Object>} Submission result
 */
export const submitCheckpoint = async (missionId, submission) => {
  const attempt = getCheckpointAttempt(missionId);
  
  const response = await apiClient.post(ENDPOINTS.submit(missionId), {
    ...submission,
    sessionId: attempt?.sessionId,
    submittedAt: new Date().toISOString()
  });
  
  // Invalidate cache
  invalidateCheckpointCache(missionId);
  
  logUserAction('checkpoint_submitted', { 
    missionId, 
    passed: response.data.passed,
    score: response.data.score
  });
  
  // Dispatch event
  window.dispatchEvent(new CustomEvent('checkpoint:submitted', { 
    detail: { missionId, ...response.data }
  }));
  
  return response.data;
};

/**
 * Gets checkpoint result
 * @param {string} missionId - Mission ID
 * @returns {Promise<Object>} Result data
 */
export const getCheckpointResult = async (missionId) => {
  const response = await apiClient.get(ENDPOINTS.result(missionId));
  return response.data;
};

/**
 * Gets checkpoint attempt history
 * @param {string} missionId - Mission ID
 * @param {Object} params - Query params
 * @returns {Promise<Object>} History data
 */
export const getCheckpointHistory = async (missionId, { page = 1, limit = 10 } = {}) => {
  const response = await apiClient.get(ENDPOINTS.history(missionId), {
    params: { page, limit }
  });
  return response.data;
};

// =============================================================================
// HINTS & ASSISTANCE
// =============================================================================

/**
 * Gets available hints for checkpoint
 * @param {string} missionId - Mission ID
 * @returns {Promise<Object>} Hints data
 */
export const getCheckpointHints = async (missionId) => {
  const cacheKey = `checkpoint_hints_${missionId}`;
  
  const cached = getCache(cacheKey, CACHE_TTL.hints);
  if (cached) {
    return cached;
  }
  
  const response = await apiClient.get(ENDPOINTS.hints(missionId));
  
  setCache(cacheKey, response.data);
  
  return response.data;
};

/**
 * Requests a hint (may cost Baraka)
 * @param {string} missionId - Mission ID
 * @param {number} hintIndex - Hint index
 * @returns {Promise<Object>} Hint content
 */
export const requestHint = async (missionId, hintIndex) => {
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
  const response = await apiClient.get(ENDPOINTS.review(missionId));
  return response.data;
};

/**
 * Requests AI review of checkpoint submission
 * @param {string} missionId - Mission ID
 * @returns {Promise<Object>} AI review
 */
export const requestAIReview = async (missionId) => {
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
  const response = await apiClient.post(`${ENDPOINTS.checkpoint(missionId)}/retry`, {
    usePR2R
  });
  
  logUserAction('checkpoint_retry', { missionId, usePR2R });
  
  // Dispatch event
  window.dispatchEvent(new CustomEvent('checkpoint:retry', { 
    detail: { missionId, ...response.data }
  }));
  
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
 * @returns {Object} Progress info
 */
export const calculateCheckpointProgress = (checkpoint) => {
  if (!checkpoint || !checkpoint.questions) {
    return { answered: 0, total: 0, percent: 0 };
  }
  
  const answered = checkpoint.questions.filter(q => q.answered).length;
  const total = checkpoint.questions.length;
  
  return {
    answered,
    total,
    percent: total > 0 ? Math.round((answered / total) * 100) : 0
  };
};

/**
 * Gets checkpoint status info
 * @param {string} status - Status code
 * @returns {Object} Status info
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
 * @returns {number} Seconds remaining
 */
export const calculateTimeRemaining = (session) => {
  if (!session || !session.expiresAt) {
    return null;
  }
  
  const now = new Date();
  const expires = new Date(session.expiresAt);
  const remaining = Math.max(0, Math.floor((expires - now) / 1000));
  
  return remaining;
};

/**
 * Formats time remaining for display
 * @param {number} seconds - Seconds remaining
 * @returns {string} Formatted time
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