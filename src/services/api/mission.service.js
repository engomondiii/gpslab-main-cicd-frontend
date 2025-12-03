/**
 * GPS Lab Platform - Mission Service
 * 
 * Mission management service for fetching, accepting, progressing,
 * and completing missions in the GPS Lab curriculum.
 * 
 * @module services/api/mission.service
 * @version 1.0.0
 */

import apiClient from './client';
import { getCache, setCache, setCurrentMission, getCurrentMission } from '../storage/localStorage.service';
import { logMissionEvent, missionLogger } from '../../utils/error/error.logger';
import { CURRICULUM_TOTALS, ADVENTURES } from '../../utils/constants/game.constants';

// =============================================================================
// API ENDPOINTS
// =============================================================================

const ENDPOINTS = {
  missions: '/missions',
  mission: (id) => `/missions/${id}`,
  missionBriefing: (id) => `/missions/${id}/briefing`,
  accept: (id) => `/missions/${id}/accept`,
  abandon: (id) => `/missions/${id}/abandon`,
  complete: (id) => `/missions/${id}/complete`,
  progress: (id) => `/missions/${id}/progress`,
  bites: (id) => `/missions/${id}/bites`,
  checkpoint: (id) => `/missions/${id}/checkpoint`,
  byStage: (stageNumber) => `/stages/${stageNumber}/missions`,
  byAdventure: (adventureNumber) => `/adventures/${adventureNumber}/missions`,
  current: '/missions/current',
  available: '/missions/available',
  completed: '/missions/completed',
  recommended: '/missions/recommended'
};

// =============================================================================
// CACHE CONFIGURATION
// =============================================================================

const CACHE_TTL = {
  missionList: 2 * 60 * 1000,     // 2 minutes
  missionDetail: 5 * 60 * 1000,   // 5 minutes
  briefing: 10 * 60 * 1000,       // 10 minutes
  stagesMissions: 5 * 60 * 1000   // 5 minutes
};

// =============================================================================
// MISSION LISTING
// =============================================================================

/**
 * Gets all missions with optional filtering
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Missions list
 */
export const getMissions = async ({
  page = 1,
  limit = 20,
  status,
  stage,
  adventure,
  search,
  sortBy = 'stageNumber',
  sortOrder = 'asc',
  useCache = true
} = {}) => {
  const cacheKey = `missions_${page}_${limit}_${status}_${stage}_${adventure}_${sortBy}`;
  
  if (useCache && !search) {
    const cached = getCache(cacheKey, CACHE_TTL.missionList);
    if (cached) {
      return cached;
    }
  }
  
  const params = { page, limit, sortBy, sortOrder };
  if (status) params.status = status;
  if (stage) params.stage = stage;
  if (adventure) params.adventure = adventure;
  if (search) params.search = search;
  
  const response = await apiClient.get(ENDPOINTS.missions, { params });
  
  if (!search) {
    setCache(cacheKey, response.data);
  }
  
  return response.data;
};

/**
 * Gets missions for a specific stage
 * @param {number} stageNumber - Stage number
 * @param {Object} options - Options
 * @returns {Promise<Object>} Stage missions
 */
export const getMissionsByStage = async (stageNumber, { useCache = true } = {}) => {
  const cacheKey = `stage_${stageNumber}_missions`;
  
  if (useCache) {
    const cached = getCache(cacheKey, CACHE_TTL.stagesMissions);
    if (cached) {
      return cached;
    }
  }
  
  const response = await apiClient.get(ENDPOINTS.byStage(stageNumber));
  
  setCache(cacheKey, response.data);
  
  return response.data;
};

/**
 * Gets missions for a specific adventure
 * @param {number} adventureNumber - Adventure number
 * @param {Object} options - Options
 * @returns {Promise<Object>} Adventure missions
 */
export const getMissionsByAdventure = async (adventureNumber, { useCache = true } = {}) => {
  const cacheKey = `adventure_${adventureNumber}_missions`;
  
  if (useCache) {
    const cached = getCache(cacheKey, CACHE_TTL.stagesMissions);
    if (cached) {
      return cached;
    }
  }
  
  const response = await apiClient.get(ENDPOINTS.byAdventure(adventureNumber));
  
  setCache(cacheKey, response.data);
  
  return response.data;
};

/**
 * Gets currently active mission
 * @returns {Promise<Object|null>} Current mission or null
 */
export const getCurrentActiveMission = async () => {
  // Check local storage first
  const stored = getCurrentMission();
  if (stored) {
    return stored;
  }
  
  try {
    const response = await apiClient.get(ENDPOINTS.current);
    
    if (response.data) {
      setCurrentMission(response.data);
    }
    
    return response.data;
  } catch (error) {
    // No current mission
    return null;
  }
};

/**
 * Gets available missions (unlocked but not started)
 * @returns {Promise<Object>} Available missions
 */
export const getAvailableMissions = async () => {
  const response = await apiClient.get(ENDPOINTS.available);
  return response.data;
};

/**
 * Gets completed missions
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Completed missions
 */
export const getCompletedMissions = async ({ page = 1, limit = 20 } = {}) => {
  const response = await apiClient.get(ENDPOINTS.completed, {
    params: { page, limit }
  });
  return response.data;
};

/**
 * Gets recommended next mission
 * @returns {Promise<Object>} Recommended mission
 */
export const getRecommendedMission = async () => {
  const response = await apiClient.get(ENDPOINTS.recommended);
  return response.data;
};

// =============================================================================
// MISSION DETAILS
// =============================================================================

/**
 * Gets mission by ID
 * @param {string} missionId - Mission ID
 * @param {Object} options - Options
 * @returns {Promise<Object>} Mission details
 */
export const getMission = async (missionId, { useCache = true } = {}) => {
  const cacheKey = `mission_${missionId}`;
  
  if (useCache) {
    const cached = getCache(cacheKey, CACHE_TTL.missionDetail);
    if (cached) {
      return cached;
    }
  }
  
  const response = await apiClient.get(ENDPOINTS.mission(missionId));
  
  setCache(cacheKey, response.data);
  
  return response.data;
};

/**
 * Gets mission briefing
 * @param {string} missionId - Mission ID
 * @returns {Promise<Object>} Mission briefing
 */
export const getMissionBriefing = async (missionId) => {
  const cacheKey = `mission_${missionId}_briefing`;
  
  const cached = getCache(cacheKey, CACHE_TTL.briefing);
  if (cached) {
    return cached;
  }
  
  const response = await apiClient.get(ENDPOINTS.missionBriefing(missionId));
  
  setCache(cacheKey, response.data);
  
  return response.data;
};

/**
 * Gets mission progress
 * @param {string} missionId - Mission ID
 * @returns {Promise<Object>} Mission progress
 */
export const getMissionProgress = async (missionId) => {
  const response = await apiClient.get(ENDPOINTS.progress(missionId));
  return response.data;
};

/**
 * Gets mission bites
 * @param {string} missionId - Mission ID
 * @returns {Promise<Object>} Mission bites
 */
export const getMissionBites = async (missionId) => {
  const response = await apiClient.get(ENDPOINTS.bites(missionId));
  return response.data;
};

// =============================================================================
// MISSION ACTIONS
// =============================================================================

/**
 * Accepts a mission
 * @param {string} missionId - Mission ID
 * @returns {Promise<Object>} Updated mission
 */
export const acceptMission = async (missionId) => {
  missionLogger.info('Accepting mission', { missionId });
  
  const response = await apiClient.post(ENDPOINTS.accept(missionId));
  
  // Update current mission
  setCurrentMission(response.data);
  
  // Invalidate caches
  invalidateMissionCache(missionId);
  
  logMissionEvent('accepted', {
    missionId,
    stageNumber: response.data.stageNumber,
    missionNumber: response.data.missionNumber
  });
  
  // Dispatch event
  window.dispatchEvent(new CustomEvent('mission:accepted', { detail: response.data }));
  
  return response.data;
};

/**
 * Abandons a mission
 * @param {string} missionId - Mission ID
 * @param {Object} data - Abandon data
 * @returns {Promise<Object>} Updated mission
 */
export const abandonMission = async (missionId, { reason } = {}) => {
  missionLogger.info('Abandoning mission', { missionId, reason });
  
  const response = await apiClient.post(ENDPOINTS.abandon(missionId), { reason });
  
  // Clear current mission if it was the active one
  const current = getCurrentMission();
  if (current?.id === missionId) {
    setCurrentMission(null);
  }
  
  // Invalidate caches
  invalidateMissionCache(missionId);
  
  logMissionEvent('abandoned', { missionId, reason });
  
  // Dispatch event
  window.dispatchEvent(new CustomEvent('mission:abandoned', { detail: response.data }));
  
  return response.data;
};

/**
 * Completes a mission
 * @param {string} missionId - Mission ID
 * @returns {Promise<Object>} Completion data
 */
export const completeMission = async (missionId) => {
  missionLogger.info('Completing mission', { missionId });
  
  const response = await apiClient.post(ENDPOINTS.complete(missionId));
  
  // Clear current mission
  setCurrentMission(null);
  
  // Invalidate caches
  invalidateMissionCache(missionId);
  
  logMissionEvent('completed', {
    missionId,
    barakaEarned: response.data.rewards?.baraka,
    xpEarned: response.data.rewards?.xp,
    badgeEarned: response.data.rewards?.badge
  });
  
  // Dispatch event
  window.dispatchEvent(new CustomEvent('mission:completed', { detail: response.data }));
  
  return response.data;
};

/**
 * Updates mission progress
 * @param {string} missionId - Mission ID
 * @param {Object} progressData - Progress data
 * @returns {Promise<Object>} Updated progress
 */
export const updateMissionProgress = async (missionId, progressData) => {
  const response = await apiClient.patch(ENDPOINTS.progress(missionId), progressData);
  
  // Update current mission if active
  const current = getCurrentMission();
  if (current?.id === missionId) {
    setCurrentMission({ ...current, progress: response.data });
  }
  
  logMissionEvent('progress_updated', {
    missionId,
    progress: progressData
  });
  
  return response.data;
};

// =============================================================================
// CHECKPOINT OPERATIONS
// =============================================================================

/**
 * Gets mission checkpoint
 * @param {string} missionId - Mission ID
 * @returns {Promise<Object>} Checkpoint data
 */
export const getMissionCheckpoint = async (missionId) => {
  const response = await apiClient.get(ENDPOINTS.checkpoint(missionId));
  return response.data;
};

/**
 * Starts checkpoint evaluation
 * @param {string} missionId - Mission ID
 * @returns {Promise<Object>} Checkpoint session
 */
export const startCheckpoint = async (missionId) => {
  missionLogger.info('Starting checkpoint', { missionId });
  
  const response = await apiClient.post(`${ENDPOINTS.checkpoint(missionId)}/start`);
  
  logMissionEvent('checkpoint_started', { missionId });
  
  return response.data;
};

/**
 * Submits checkpoint evaluation
 * @param {string} missionId - Mission ID
 * @param {Object} submission - Checkpoint submission
 * @returns {Promise<Object>} Evaluation result
 */
export const submitCheckpoint = async (missionId, submission) => {
  missionLogger.info('Submitting checkpoint', { missionId });
  
  const response = await apiClient.post(`${ENDPOINTS.checkpoint(missionId)}/submit`, submission);
  
  logMissionEvent('checkpoint_submitted', {
    missionId,
    passed: response.data.passed,
    score: response.data.score
  });
  
  // Dispatch event
  window.dispatchEvent(new CustomEvent('checkpoint:completed', { detail: response.data }));
  
  return response.data;
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Invalidates mission cache
 * @param {string} missionId - Mission ID
 */
const invalidateMissionCache = (missionId) => {
  const { removeItem } = require('../storage/localStorage.service');
  removeItem(`cache_mission_${missionId}`);
  removeItem(`cache_missions_*`);
};

/**
 * Gets mission ID from stage and mission number
 * @param {number} stageNumber - Stage number
 * @param {number} missionNumber - Mission number
 * @returns {string} Mission ID format
 */
export const getMissionId = (stageNumber, missionNumber) => {
  return `S${stageNumber}M${missionNumber}`;
};

/**
 * Parses mission ID to components
 * @param {string} missionId - Mission ID
 * @returns {Object} Parsed components
 */
export const parseMissionId = (missionId) => {
  const match = missionId.match(/S(\d+)M(\d+)/);
  if (!match) return null;
  
  return {
    stageNumber: parseInt(match[1], 10),
    missionNumber: parseInt(match[2], 10)
  };
};

/**
 * Gets adventure for mission
 * @param {number} stageNumber - Stage number
 * @returns {Object} Adventure info
 */
export const getAdventureForMission = (stageNumber) => {
  for (const [key, adventure] of Object.entries(ADVENTURES)) {
    if (stageNumber >= adventure.stageRange.start && 
        stageNumber <= adventure.stageRange.end) {
      return adventure;
    }
  }
  return null;
};

/**
 * Calculates mission completion percentage
 * @param {Object} mission - Mission data
 * @returns {number} Completion percentage
 */
export const calculateMissionCompletion = (mission) => {
  if (!mission || !mission.bites) return 0;
  
  const completedBites = mission.bites.filter(b => b.status === 'completed').length;
  return Math.round((completedBites / mission.bites.length) * 100);
};

/**
 * Checks if mission is unlocked
 * @param {Object} mission - Mission data
 * @param {Object} userProgress - User progress data
 * @returns {boolean} True if unlocked
 */
export const isMissionUnlocked = (mission, userProgress) => {
  // First mission is always unlocked
  if (mission.stageNumber === 1 && mission.missionNumber === 1) {
    return true;
  }
  
  // Check if previous mission is completed
  const prevMissionNumber = mission.missionNumber > 1 
    ? mission.missionNumber - 1 
    : CURRICULUM_TOTALS.missionsPerStage;
  const prevStageNumber = mission.missionNumber > 1 
    ? mission.stageNumber 
    : mission.stageNumber - 1;
  
  const prevMissionId = getMissionId(prevStageNumber, prevMissionNumber);
  
  return userProgress.completedMissions?.includes(prevMissionId);
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Listing
  getMissions,
  getMissionsByStage,
  getMissionsByAdventure,
  getCurrentActiveMission,
  getAvailableMissions,
  getCompletedMissions,
  getRecommendedMission,
  
  // Details
  getMission,
  getMissionBriefing,
  getMissionProgress,
  getMissionBites,
  
  // Actions
  acceptMission,
  abandonMission,
  completeMission,
  updateMissionProgress,
  
  // Checkpoint
  getMissionCheckpoint,
  startCheckpoint,
  submitCheckpoint,
  
  // Helpers
  getMissionId,
  parseMissionId,
  getAdventureForMission,
  calculateMissionCompletion,
  isMissionUnlocked
};