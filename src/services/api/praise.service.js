/**
 * GPS Lab Platform - Praise Service
 * 
 * Praise and honor system service for giving/receiving praise,
 * tracking recognition, and managing the community honor economy.
 * 
 * @module services/api/praise.service
 * @version 1.0.0
 */

import apiClient from './client';
import { getCache, setCache } from '../storage/localStorage.service';
import { logUserAction, logBarakaTransaction } from '../../utils/error/logger';

// =============================================================================
// API ENDPOINTS
// =============================================================================

const ENDPOINTS = {
  praise: '/praise',
  send: '/praise/send',
  received: '/praise/received',
  given: '/praise/given',
  honor: '/praise/honor',
  stats: '/praise/stats',
  leaderboard: '/praise/leaderboard',
  categories: '/praise/categories'
};

// =============================================================================
// CACHE CONFIGURATION
// =============================================================================

const CACHE_TTL = {
  categories: 30 * 60 * 1000,  // 30 minutes
  stats: 5 * 60 * 1000         // 5 minutes
};

// =============================================================================
// PRAISE CONSTANTS
// =============================================================================

export const PRAISE_CATEGORIES = {
  HELPFUL: 'helpful',
  INSIGHTFUL: 'insightful',
  CREATIVE: 'creative',
  SUPPORTIVE: 'supportive',
  THOROUGH: 'thorough',
  INSPIRING: 'inspiring',
  COLLABORATIVE: 'collaborative',
  PERSEVERANT: 'perseverant'
};

export const PRAISE_CONTEXTS = {
  BITE: 'bite',
  MISSION: 'mission',
  PROJECT: 'project',
  PARTY: 'party',
  REVIEW: 'review',
  GENERAL: 'general'
};

export const HONOR_TIERS = {
  BRONZE: { name: 'Bronze', minHonor: 0, barakaMultiplier: 1.0 },
  SILVER: { name: 'Silver', minHonor: 100, barakaMultiplier: 1.1 },
  GOLD: { name: 'Gold', minHonor: 500, barakaMultiplier: 1.25 },
  PLATINUM: { name: 'Platinum', minHonor: 2000, barakaMultiplier: 1.5 },
  DIAMOND: { name: 'Diamond', minHonor: 10000, barakaMultiplier: 2.0 }
};

// =============================================================================
// PRAISE OPERATIONS
// =============================================================================

/**
 * Sends praise to another user
 * @param {Object} data - Praise data
 * @returns {Promise<Object>} Praise result
 */
export const sendPraise = async ({
  recipientId,
  category,
  message,
  context,
  contextId,
  isPublic = true,
  attachBaraka = 0
}) => {
  const response = await apiClient.post(ENDPOINTS.send, {
    recipientId,
    category,
    message,
    context,
    contextId,
    isPublic,
    attachBaraka
  });
  
  logUserAction('praise_sent', { 
    recipientId, 
    category, 
    context,
    attachBaraka 
  });
  
  if (attachBaraka > 0) {
    logBarakaTransaction('spend', attachBaraka, { 
      purpose: 'praise_attachment',
      recipientId 
    });
  }
  
  // Dispatch event
  window.dispatchEvent(new CustomEvent('praise:sent', { 
    detail: response.data 
  }));
  
  return response.data;
};

/**
 * Gets received praise
 * @param {Object} params - Query params
 * @returns {Promise<Object>} Received praise list
 */
export const getReceivedPraise = async ({ 
  page = 1, 
  limit = 20,
  category,
  startDate,
  endDate
} = {}) => {
  const params = { page, limit };
  if (category) params.category = category;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  
  const response = await apiClient.get(ENDPOINTS.received, { params });
  return response.data;
};

/**
 * Gets given praise
 * @param {Object} params - Query params
 * @returns {Promise<Object>} Given praise list
 */
export const getGivenPraise = async ({ page = 1, limit = 20 } = {}) => {
  const response = await apiClient.get(ENDPOINTS.given, {
    params: { page, limit }
  });
  return response.data;
};

/**
 * Gets praise by ID
 * @param {string} praiseId - Praise ID
 * @returns {Promise<Object>} Praise data
 */
export const getPraise = async (praiseId) => {
  const response = await apiClient.get(`${ENDPOINTS.praise}/${praiseId}`);
  return response.data;
};

/**
 * Acknowledges received praise
 * @param {string} praiseId - Praise ID
 * @param {Object} data - Acknowledgment data
 * @returns {Promise<Object>} Updated praise
 */
export const acknowledgePraise = async (praiseId, { thankYouMessage } = {}) => {
  const response = await apiClient.post(`${ENDPOINTS.praise}/${praiseId}/acknowledge`, {
    thankYouMessage
  });
  
  logUserAction('praise_acknowledged', { praiseId });
  
  return response.data;
};

// =============================================================================
// HONOR OPERATIONS
// =============================================================================

/**
 * Gets user's honor stats
 * @param {Object} options - Options
 * @returns {Promise<Object>} Honor stats
 */
export const getHonorStats = async ({ useCache = true } = {}) => {
  if (useCache) {
    const cached = getCache('praise_honor_stats', CACHE_TTL.stats);
    if (cached) {
      return cached;
    }
  }
  
  const response = await apiClient.get(ENDPOINTS.honor);
  
  // Enrich with tier info
  const enriched = {
    ...response.data,
    tier: getHonorTier(response.data.totalHonor)
  };
  
  setCache('praise_honor_stats', enriched);
  
  return enriched;
};

/**
 * Gets honor history
 * @param {Object} params - Query params
 * @returns {Promise<Object>} Honor history
 */
export const getHonorHistory = async ({ page = 1, limit = 20 } = {}) => {
  const response = await apiClient.get(`${ENDPOINTS.honor}/history`, {
    params: { page, limit }
  });
  return response.data;
};

/**
 * Converts honor to Baraka
 * @param {number} honorAmount - Honor to convert
 * @returns {Promise<Object>} Conversion result
 */
export const convertHonorToBaraka = async (honorAmount) => {
  const response = await apiClient.post(`${ENDPOINTS.honor}/convert`, {
    amount: honorAmount
  });
  
  logUserAction('honor_converted', { 
    honorAmount, 
    barakaReceived: response.data.barakaReceived 
  });
  
  // Invalidate cache
  const { removeItem } = require('../storage/localStorage.service');
  removeItem('cache_praise_honor_stats');
  
  return response.data;
};

// =============================================================================
// STATISTICS
// =============================================================================

/**
 * Gets praise statistics
 * @param {Object} options - Options
 * @returns {Promise<Object>} Stats
 */
export const getStats = async ({ period = '30d', useCache = true } = {}) => {
  const cacheKey = `praise_stats_${period}`;
  
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
 * Gets praise leaderboard
 * @param {Object} params - Query params
 * @returns {Promise<Object>} Leaderboard
 */
export const getLeaderboard = async ({ 
  period = 'weekly', 
  limit = 10,
  category
} = {}) => {
  const params = { period, limit };
  if (category) params.category = category;
  
  const response = await apiClient.get(ENDPOINTS.leaderboard, { params });
  return response.data;
};

// =============================================================================
// CATEGORIES
// =============================================================================

/**
 * Gets available praise categories
 * @returns {Promise<Object>} Categories
 */
export const getCategories = async () => {
  const cached = getCache('praise_categories', CACHE_TTL.categories);
  if (cached) {
    return cached;
  }
  
  const response = await apiClient.get(ENDPOINTS.categories);
  
  setCache('praise_categories', response.data);
  
  return response.data;
};

// =============================================================================
// QUICK PRAISE
// =============================================================================

/**
 * Sends quick praise (predefined message)
 * @param {Object} data - Quick praise data
 * @returns {Promise<Object>} Praise result
 */
export const sendQuickPraise = async ({
  recipientId,
  category,
  context,
  contextId
}) => {
  const messages = {
    [PRAISE_CATEGORIES.HELPFUL]: 'Thank you for being so helpful!',
    [PRAISE_CATEGORIES.INSIGHTFUL]: 'Your insights were really valuable!',
    [PRAISE_CATEGORIES.CREATIVE]: 'Love your creative approach!',
    [PRAISE_CATEGORIES.SUPPORTIVE]: 'Thanks for being supportive!',
    [PRAISE_CATEGORIES.THOROUGH]: 'Appreciate your thoroughness!',
    [PRAISE_CATEGORIES.INSPIRING]: 'You inspired me today!',
    [PRAISE_CATEGORIES.COLLABORATIVE]: 'Great collaboration!',
    [PRAISE_CATEGORIES.PERSEVERANT]: 'Your perseverance is admirable!'
  };
  
  return sendPraise({
    recipientId,
    category,
    message: messages[category] || 'Great work!',
    context,
    contextId,
    isPublic: true
  });
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Gets honor tier based on total honor
 * @param {number} totalHonor - Total honor points
 * @returns {Object} Tier info
 */
export const getHonorTier = (totalHonor) => {
  const tiers = Object.values(HONOR_TIERS).reverse();
  
  for (const tier of tiers) {
    if (totalHonor >= tier.minHonor) {
      return tier;
    }
  }
  
  return HONOR_TIERS.BRONZE;
};

/**
 * Calculates progress to next tier
 * @param {number} totalHonor - Total honor points
 * @returns {Object} Progress info
 */
export const calculateTierProgress = (totalHonor) => {
  const tiers = Object.values(HONOR_TIERS);
  const currentTierIndex = tiers.findIndex(t => t.minHonor > totalHonor) - 1;
  
  if (currentTierIndex === tiers.length - 1) {
    return { 
      currentTier: tiers[currentTierIndex],
      nextTier: null,
      progress: 100,
      honorNeeded: 0
    };
  }
  
  const currentTier = tiers[Math.max(0, currentTierIndex)];
  const nextTier = tiers[currentTierIndex + 1];
  
  const honorInTier = totalHonor - currentTier.minHonor;
  const tierRange = nextTier.minHonor - currentTier.minHonor;
  const progress = Math.round((honorInTier / tierRange) * 100);
  
  return {
    currentTier,
    nextTier,
    progress,
    honorNeeded: nextTier.minHonor - totalHonor
  };
};

/**
 * Gets category info
 * @param {string} category - Category code
 * @returns {Object} Category info
 */
export const getCategoryInfo = (category) => {
  const categories = {
    [PRAISE_CATEGORIES.HELPFUL]: { label: 'Helpful', icon: '🤝', color: 'blue' },
    [PRAISE_CATEGORIES.INSIGHTFUL]: { label: 'Insightful', icon: '💡', color: 'yellow' },
    [PRAISE_CATEGORIES.CREATIVE]: { label: 'Creative', icon: '🎨', color: 'purple' },
    [PRAISE_CATEGORIES.SUPPORTIVE]: { label: 'Supportive', icon: '💪', color: 'green' },
    [PRAISE_CATEGORIES.THOROUGH]: { label: 'Thorough', icon: '🔍', color: 'indigo' },
    [PRAISE_CATEGORIES.INSPIRING]: { label: 'Inspiring', icon: '✨', color: 'pink' },
    [PRAISE_CATEGORIES.COLLABORATIVE]: { label: 'Collaborative', icon: '👥', color: 'teal' },
    [PRAISE_CATEGORIES.PERSEVERANT]: { label: 'Perseverant', icon: '🏆', color: 'orange' }
  };
  
  return categories[category] || { label: category, icon: '👏', color: 'gray' };
};

/**
 * Calculates Baraka reward for honor
 * @param {number} honorAmount - Honor amount
 * @param {Object} tier - User's honor tier
 * @returns {number} Baraka amount
 */
export const calculateBarakaFromHonor = (honorAmount, tier) => {
  const baseRate = 0.1; // 1 Baraka per 10 honor
  const multiplier = tier?.barakaMultiplier || 1;
  
  return Math.floor(honorAmount * baseRate * multiplier);
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Praise operations
  sendPraise,
  getReceivedPraise,
  getGivenPraise,
  getPraise,
  acknowledgePraise,
  sendQuickPraise,
  
  // Honor operations
  getHonorStats,
  getHonorHistory,
  convertHonorToBaraka,
  
  // Statistics
  getStats,
  getLeaderboard,
  
  // Categories
  getCategories,
  
  // Helpers
  getHonorTier,
  calculateTierProgress,
  getCategoryInfo,
  calculateBarakaFromHonor,
  
  // Constants
  PRAISE_CATEGORIES,
  PRAISE_CONTEXTS,
  HONOR_TIERS
};