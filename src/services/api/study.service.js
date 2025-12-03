/**
 * GPS Lab Platform - Study Service
 * 
 * Study loop management service for recursive learning,
 * R2R (Right to Retry) mechanics, and progress tracking.
 * 
 * @module services/api/study.service
 * @version 1.0.0
 */

import apiClient from './client';
import { getCache, setCache, setItem, getItem, STORAGE_KEYS } from '../storage/localStorage.service';
import { logUserAction } from '../../utils/error/logger';

// =============================================================================
// API ENDPOINTS
// =============================================================================

const ENDPOINTS = {
  progress: '/study/progress',
  session: '/study/session',
  startSession: '/study/session/start',
  endSession: '/study/session/end',
  r2r: '/study/r2r',
  activateR2R: '/study/r2r/activate',
  streak: '/study/streak',
  stats: '/study/stats',
  goals: '/study/goals',
  schedule: '/study/schedule',
  recommendations: '/study/recommendations'
};

// =============================================================================
// CACHE CONFIGURATION
// =============================================================================

const CACHE_TTL = {
  progress: 2 * 60 * 1000,    // 2 minutes
  streak: 5 * 60 * 1000,      // 5 minutes
  stats: 5 * 60 * 1000        // 5 minutes
};

// =============================================================================
// STUDY CONSTANTS
// =============================================================================

export const STUDY_PHASES = {
  LEARN: 'learn',
  PRACTICE: 'practice',
  APPLY: 'apply',
  REVIEW: 'review',
  CHECKPOINT: 'checkpoint'
};

export const R2R_TYPES = {
  FREE: 'free',           // Earned through streak or achievement
  PAID: 'paid',           // Purchased with Baraka (pR2R)
  GRACE: 'grace'          // One-time grace period
};

export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 90, 180, 365];

// =============================================================================
// PROGRESS OPERATIONS
// =============================================================================

/**
 * Gets overall study progress
 * @param {Object} options - Options
 * @returns {Promise<Object>} Progress data
 */
export const getProgress = async ({ useCache = true } = {}) => {
  if (useCache) {
    const cached = getCache('study_progress', CACHE_TTL.progress);
    if (cached) {
      return cached;
    }
  }
  
  const response = await apiClient.get(ENDPOINTS.progress);
  
  setCache('study_progress', response.data);
  setItem(STORAGE_KEYS.studyProgress, response.data);
  
  return response.data;
};

/**
 * Gets progress for specific stage
 * @param {number} stageNumber - Stage number
 * @returns {Promise<Object>} Stage progress
 */
export const getStageProgress = async (stageNumber) => {
  const response = await apiClient.get(`${ENDPOINTS.progress}/stage/${stageNumber}`);
  return response.data;
};

/**
 * Gets progress for specific mission
 * @param {string} missionId - Mission ID
 * @returns {Promise<Object>} Mission progress
 */
export const getMissionProgress = async (missionId) => {
  const response = await apiClient.get(`${ENDPOINTS.progress}/mission/${missionId}`);
  return response.data;
};

// =============================================================================
// SESSION OPERATIONS
// =============================================================================

/**
 * Gets current study session
 * @returns {Promise<Object|null>} Current session or null
 */
export const getCurrentSession = async () => {
  try {
    const response = await apiClient.get(ENDPOINTS.session);
    return response.data;
  } catch (error) {
    if (error.status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Starts a study session
 * @param {Object} options - Session options
 * @returns {Promise<Object>} Session data
 */
export const startStudySession = async ({ 
  missionId, 
  biteId, 
  plannedDuration,
  goals = []
} = {}) => {
  const response = await apiClient.post(ENDPOINTS.startSession, {
    missionId,
    biteId,
    plannedDuration,
    goals,
    startedAt: new Date().toISOString()
  });
  
  logUserAction('study_session_started', { missionId, biteId });
  
  // Dispatch event
  window.dispatchEvent(new CustomEvent('study:session_started', { 
    detail: response.data 
  }));
  
  return response.data;
};

/**
 * Ends current study session
 * @param {Object} summary - Session summary
 * @returns {Promise<Object>} Session result
 */
export const endStudySession = async ({ 
  completed = false,
  notes,
  rating
} = {}) => {
  const response = await apiClient.post(ENDPOINTS.endSession, {
    completed,
    notes,
    rating,
    endedAt: new Date().toISOString()
  });
  
  // Invalidate progress cache
  invalidateStudyCache();
  
  logUserAction('study_session_ended', { 
    completed, 
    duration: response.data.duration 
  });
  
  // Dispatch event
  window.dispatchEvent(new CustomEvent('study:session_ended', { 
    detail: response.data 
  }));
  
  return response.data;
};

/**
 * Updates session progress
 * @param {Object} update - Progress update
 * @returns {Promise<Object>} Updated session
 */
export const updateSessionProgress = async (update) => {
  const response = await apiClient.patch(ENDPOINTS.session, update);
  return response.data;
};

// =============================================================================
// R2R (RIGHT TO RETRY) OPERATIONS
// =============================================================================

/**
 * Gets R2R status and availability
 * @returns {Promise<Object>} R2R data
 */
export const getR2RStatus = async () => {
  const response = await apiClient.get(ENDPOINTS.r2r);
  return response.data;
};

/**
 * Gets R2R history
 * @param {Object} params - Query params
 * @returns {Promise<Object>} R2R history
 */
export const getR2RHistory = async ({ page = 1, limit = 20 } = {}) => {
  const response = await apiClient.get(`${ENDPOINTS.r2r}/history`, {
    params: { page, limit }
  });
  return response.data;
};

/**
 * Activates R2R for a checkpoint
 * @param {string} missionId - Mission ID
 * @param {Object} options - Activation options
 * @returns {Promise<Object>} Activation result
 */
export const activateR2R = async (missionId, { type = R2R_TYPES.FREE } = {}) => {
  const response = await apiClient.post(ENDPOINTS.activateR2R, {
    missionId,
    type
  });
  
  logUserAction('r2r_activated', { missionId, type });
  
  // Dispatch event
  window.dispatchEvent(new CustomEvent('study:r2r_activated', { 
    detail: { missionId, ...response.data }
  }));
  
  return response.data;
};

/**
 * Purchases paid R2R (pR2R) with Baraka
 * @param {number} quantity - Number of pR2R to purchase
 * @returns {Promise<Object>} Purchase result
 */
export const purchasePR2R = async (quantity = 1) => {
  const response = await apiClient.post(`${ENDPOINTS.r2r}/purchase`, {
    quantity
  });
  
  logUserAction('pr2r_purchased', { quantity });
  
  return response.data;
};

// =============================================================================
// STREAK OPERATIONS
// =============================================================================

/**
 * Gets current streak data
 * @param {Object} options - Options
 * @returns {Promise<Object>} Streak data
 */
export const getStreak = async ({ useCache = true } = {}) => {
  if (useCache) {
    const cached = getCache('study_streak', CACHE_TTL.streak);
    if (cached) {
      return cached;
    }
  }
  
  const response = await apiClient.get(ENDPOINTS.streak);
  
  setCache('study_streak', response.data);
  
  return response.data;
};

/**
 * Claims streak reward
 * @param {number} milestone - Milestone day
 * @returns {Promise<Object>} Reward data
 */
export const claimStreakReward = async (milestone) => {
  const response = await apiClient.post(`${ENDPOINTS.streak}/claim`, {
    milestone
  });
  
  logUserAction('streak_reward_claimed', { milestone });
  
  // Invalidate streak cache
  const { removeItem } = require('../storage/localStorage.service');
  removeItem('cache_study_streak');
  
  return response.data;
};

/**
 * Gets streak calendar
 * @param {Object} params - Query params
 * @returns {Promise<Object>} Calendar data
 */
export const getStreakCalendar = async ({ month, year } = {}) => {
  const now = new Date();
  const params = {
    month: month || now.getMonth() + 1,
    year: year || now.getFullYear()
  };
  
  const response = await apiClient.get(`${ENDPOINTS.streak}/calendar`, { params });
  return response.data;
};

// =============================================================================
// STATISTICS
// =============================================================================

/**
 * Gets study statistics
 * @param {Object} options - Options
 * @returns {Promise<Object>} Stats data
 */
export const getStats = async ({ period = '30d', useCache = true } = {}) => {
  const cacheKey = `study_stats_${period}`;
  
  if (useCache) {
    const cached = getCache(cacheKey, CACHE_TTL.stats);
    if (cached) {
      return cached;
    }
  }
  
  const response = await apiClient.get(ENDPOINTS.stats, {
    params: { period }
  });
  
  setCache(cacheKey, response.data);
  
  return response.data;
};

/**
 * Gets detailed analytics
 * @param {Object} params - Query params
 * @returns {Promise<Object>} Analytics data
 */
export const getAnalytics = async ({ 
  startDate, 
  endDate, 
  groupBy = 'day' 
} = {}) => {
  const response = await apiClient.get(`${ENDPOINTS.stats}/analytics`, {
    params: { startDate, endDate, groupBy }
  });
  return response.data;
};

// =============================================================================
// GOALS & SCHEDULE
// =============================================================================

/**
 * Gets study goals
 * @returns {Promise<Object>} Goals data
 */
export const getGoals = async () => {
  const response = await apiClient.get(ENDPOINTS.goals);
  return response.data;
};

/**
 * Sets study goals
 * @param {Object} goals - Goals to set
 * @returns {Promise<Object>} Updated goals
 */
export const setGoals = async (goals) => {
  const response = await apiClient.put(ENDPOINTS.goals, goals);
  
  logUserAction('study_goals_updated', { goals });
  
  return response.data;
};

/**
 * Gets study schedule
 * @returns {Promise<Object>} Schedule data
 */
export const getSchedule = async () => {
  const response = await apiClient.get(ENDPOINTS.schedule);
  return response.data;
};

/**
 * Updates study schedule
 * @param {Object} schedule - Schedule to set
 * @returns {Promise<Object>} Updated schedule
 */
export const updateSchedule = async (schedule) => {
  const response = await apiClient.put(ENDPOINTS.schedule, schedule);
  
  logUserAction('study_schedule_updated');
  
  return response.data;
};

// =============================================================================
// RECOMMENDATIONS
// =============================================================================

/**
 * Gets personalized study recommendations
 * @returns {Promise<Object>} Recommendations
 */
export const getRecommendations = async () => {
  const response = await apiClient.get(ENDPOINTS.recommendations);
  return response.data;
};

/**
 * Gets next recommended action
 * @returns {Promise<Object>} Next action
 */
export const getNextAction = async () => {
  const response = await apiClient.get(`${ENDPOINTS.recommendations}/next`);
  return response.data;
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Invalidates study cache
 */
const invalidateStudyCache = () => {
  const { removeItem } = require('../storage/localStorage.service');
  removeItem('cache_study_progress');
  removeItem('cache_study_streak');
};

/**
 * Calculates overall completion percentage
 * @param {Object} progress - Progress data
 * @returns {number} Completion percentage
 */
export const calculateOverallCompletion = (progress) => {
  if (!progress) return 0;
  
  const { completedMissions = 0, totalMissions = 175 } = progress;
  return Math.round((completedMissions / totalMissions) * 100);
};

/**
 * Calculates stage completion
 * @param {Object} stageProgress - Stage progress data
 * @returns {number} Completion percentage
 */
export const calculateStageCompletion = (stageProgress) => {
  if (!stageProgress || !stageProgress.missions) return 0;
  
  const completed = stageProgress.missions.filter(m => m.status === 'completed').length;
  return Math.round((completed / stageProgress.missions.length) * 100);
};

/**
 * Gets next streak milestone
 * @param {number} currentStreak - Current streak days
 * @returns {Object} Next milestone info
 */
export const getNextStreakMilestone = (currentStreak) => {
  const next = STREAK_MILESTONES.find(m => m > currentStreak);
  
  if (!next) {
    return { milestone: null, daysRemaining: 0 };
  }
  
  return {
    milestone: next,
    daysRemaining: next - currentStreak
  };
};

/**
 * Checks if streak is at risk (studied yesterday but not today)
 * @param {Object} streak - Streak data
 * @returns {boolean} True if at risk
 */
export const isStreakAtRisk = (streak) => {
  if (!streak || !streak.lastStudyDate) return false;
  
  const lastStudy = new Date(streak.lastStudyDate);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Check if last study was yesterday and today hasn't been logged
  return (
    lastStudy.toDateString() === yesterday.toDateString() &&
    !streak.studiedToday
  );
};

/**
 * Formats study duration
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration
 */
export const formatStudyDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (mins === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${mins}m`;
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Progress
  getProgress,
  getStageProgress,
  getMissionProgress,
  
  // Session
  getCurrentSession,
  startStudySession,
  endStudySession,
  updateSessionProgress,
  
  // R2R
  getR2RStatus,
  getR2RHistory,
  activateR2R,
  purchasePR2R,
  
  // Streak
  getStreak,
  claimStreakReward,
  getStreakCalendar,
  
  // Stats
  getStats,
  getAnalytics,
  
  // Goals & Schedule
  getGoals,
  setGoals,
  getSchedule,
  updateSchedule,
  
  // Recommendations
  getRecommendations,
  getNextAction,
  
  // Helpers
  calculateOverallCompletion,
  calculateStageCompletion,
  getNextStreakMilestone,
  isStreakAtRisk,
  formatStudyDuration,
  
  // Constants
  STUDY_PHASES,
  R2R_TYPES,
  STREAK_MILESTONES
};