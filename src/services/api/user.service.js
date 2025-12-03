/**
 * GPS Lab Platform - User Service
 * 
 * User profile management service for fetching, updating, and managing
 * user data, avatars, and statistics.
 * 
 * @module services/api/user.service
 * @version 1.0.0
 */

import apiClient from './client';
import { setUser, getCache, setCache, STORAGE_KEYS, setItem, getItem } from '../storage/localStorage.service';
import { logUserAction } from '../../utils/error/error.logger';

// =============================================================================
// API ENDPOINTS
// =============================================================================

const ENDPOINTS = {
  profile: '/users/me',
  updateProfile: '/users/me',
  avatar: '/users/me/avatar',
  stats: '/users/me/stats',
  preferences: '/users/me/preferences',
  badges: '/users/me/badges',
  achievements: '/users/me/achievements',
  activity: '/users/me/activity',
  notifications: '/users/me/notifications',
  privacy: '/users/me/privacy',
  connections: '/users/me/connections',
  referrals: '/users/me/referrals',
  subscription: '/users/me/subscription',
  publicProfile: (username) => `/users/${username}`,
  search: '/users/search'
};

// =============================================================================
// CACHE CONFIGURATION
// =============================================================================

const CACHE_TTL = {
  profile: 5 * 60 * 1000,      // 5 minutes
  stats: 2 * 60 * 1000,        // 2 minutes
  badges: 10 * 60 * 1000,      // 10 minutes
  achievements: 10 * 60 * 1000 // 10 minutes
};

// =============================================================================
// PROFILE OPERATIONS
// =============================================================================

/**
 * Gets current user profile
 * @param {Object} options - Options
 * @returns {Promise<Object>} User profile
 */
export const getProfile = async ({ useCache = true } = {}) => {
  // Check cache
  if (useCache) {
    const cached = getCache('user_profile', CACHE_TTL.profile);
    if (cached) {
      return cached;
    }
  }
  
  const response = await apiClient.get(ENDPOINTS.profile);
  
  // Update cache and storage
  setCache('user_profile', response.data);
  setUser(response.data);
  
  return response.data;
};

/**
 * Updates user profile
 * @param {Object} data - Profile data to update
 * @returns {Promise<Object>} Updated profile
 */
export const updateProfile = async (data) => {
  const response = await apiClient.patch(ENDPOINTS.updateProfile, data);
  
  // Update cache and storage
  setCache('user_profile', response.data);
  setUser(response.data);
  
  logUserAction('update_profile', { fields: Object.keys(data) });
  
  return response.data;
};

/**
 * Uploads user avatar
 * @param {File} file - Image file
 * @returns {Promise<Object>} Updated profile with new avatar
 */
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const response = await apiClient.upload(ENDPOINTS.avatar, formData);
  
  // Update cache and storage
  if (response.data.avatarUrl) {
    const profile = getItem(STORAGE_KEYS.user) || {};
    profile.avatarUrl = response.data.avatarUrl;
    setUser(profile);
    setCache('user_profile', profile);
  }
  
  logUserAction('upload_avatar');
  
  return response.data;
};

/**
 * Deletes user avatar
 * @returns {Promise<Object>} Updated profile
 */
export const deleteAvatar = async () => {
  const response = await apiClient.delete(ENDPOINTS.avatar);
  
  // Update cache and storage
  const profile = getItem(STORAGE_KEYS.user) || {};
  profile.avatarUrl = null;
  setUser(profile);
  setCache('user_profile', profile);
  
  logUserAction('delete_avatar');
  
  return response.data;
};

// =============================================================================
// USER STATS
// =============================================================================

/**
 * Gets user statistics
 * @param {Object} options - Options
 * @returns {Promise<Object>} User stats
 */
export const getStats = async ({ useCache = true } = {}) => {
  if (useCache) {
    const cached = getCache('user_stats', CACHE_TTL.stats);
    if (cached) {
      return cached;
    }
  }
  
  const response = await apiClient.get(ENDPOINTS.stats);
  
  setCache('user_stats', response.data);
  
  return response.data;
};

/**
 * Gets detailed user statistics
 * @param {Object} params - Query params
 * @returns {Promise<Object>} Detailed stats
 */
export const getDetailedStats = async ({ period = '30d', groupBy = 'day' } = {}) => {
  const response = await apiClient.get(ENDPOINTS.stats, {
    params: { period, groupBy, detailed: true }
  });
  
  return response.data;
};

// =============================================================================
// PREFERENCES
// =============================================================================

/**
 * Gets user preferences
 * @returns {Promise<Object>} User preferences
 */
export const getPreferences = async () => {
  const response = await apiClient.get(ENDPOINTS.preferences);
  return response.data;
};

/**
 * Updates user preferences
 * @param {Object} preferences - Preferences to update
 * @returns {Promise<Object>} Updated preferences
 */
export const updatePreferences = async (preferences) => {
  const response = await apiClient.patch(ENDPOINTS.preferences, preferences);
  
  // Update local preferences
  const profile = getItem(STORAGE_KEYS.user) || {};
  profile.preferences = { ...profile.preferences, ...preferences };
  setUser(profile);
  
  logUserAction('update_preferences', { keys: Object.keys(preferences) });
  
  return response.data;
};

/**
 * Updates notification preferences
 * @param {Object} notifications - Notification settings
 * @returns {Promise<Object>} Updated preferences
 */
export const updateNotificationPreferences = async (notifications) => {
  const response = await apiClient.patch(ENDPOINTS.notifications, notifications);
  
  logUserAction('update_notifications', { keys: Object.keys(notifications) });
  
  return response.data;
};

/**
 * Updates privacy settings
 * @param {Object} privacy - Privacy settings
 * @returns {Promise<Object>} Updated settings
 */
export const updatePrivacySettings = async (privacy) => {
  const response = await apiClient.patch(ENDPOINTS.privacy, privacy);
  
  logUserAction('update_privacy', { keys: Object.keys(privacy) });
  
  return response.data;
};

// =============================================================================
// BADGES & ACHIEVEMENTS
// =============================================================================

/**
 * Gets user badges
 * @param {Object} options - Options
 * @returns {Promise<Object>} User badges
 */
export const getBadges = async ({ useCache = true } = {}) => {
  if (useCache) {
    const cached = getCache('user_badges', CACHE_TTL.badges);
    if (cached) {
      return cached;
    }
  }
  
  const response = await apiClient.get(ENDPOINTS.badges);
  
  setCache('user_badges', response.data);
  
  return response.data;
};

/**
 * Gets user achievements
 * @param {Object} options - Options
 * @returns {Promise<Object>} User achievements
 */
export const getAchievements = async ({ useCache = true } = {}) => {
  if (useCache) {
    const cached = getCache('user_achievements', CACHE_TTL.achievements);
    if (cached) {
      return cached;
    }
  }
  
  const response = await apiClient.get(ENDPOINTS.achievements);
  
  setCache('user_achievements', response.data);
  
  return response.data;
};

/**
 * Sets featured badges on profile
 * @param {Array<string>} badgeIds - Badge IDs to feature
 * @returns {Promise<Object>} Updated profile
 */
export const setFeaturedBadges = async (badgeIds) => {
  const response = await apiClient.patch(ENDPOINTS.badges, {
    featured: badgeIds
  });
  
  logUserAction('set_featured_badges', { count: badgeIds.length });
  
  return response.data;
};

// =============================================================================
// ACTIVITY
// =============================================================================

/**
 * Gets user activity feed
 * @param {Object} params - Query params
 * @returns {Promise<Object>} Activity feed
 */
export const getActivity = async ({ page = 1, limit = 20, type } = {}) => {
  const params = { page, limit };
  if (type) params.type = type;
  
  const response = await apiClient.get(ENDPOINTS.activity, { params });
  
  return response.data;
};

// =============================================================================
// CONNECTIONS & REFERRALS
// =============================================================================

/**
 * Gets user connections
 * @param {Object} params - Query params
 * @returns {Promise<Object>} Connections list
 */
export const getConnections = async ({ page = 1, limit = 20, type = 'all' } = {}) => {
  const response = await apiClient.get(ENDPOINTS.connections, {
    params: { page, limit, type }
  });
  
  return response.data;
};

/**
 * Gets user referrals
 * @returns {Promise<Object>} Referral data
 */
export const getReferrals = async () => {
  const response = await apiClient.get(ENDPOINTS.referrals);
  return response.data;
};

/**
 * Gets referral code
 * @returns {Promise<Object>} Referral code data
 */
export const getReferralCode = async () => {
  const response = await apiClient.get(`${ENDPOINTS.referrals}/code`);
  return response.data;
};

// =============================================================================
// SUBSCRIPTION
// =============================================================================

/**
 * Gets user subscription
 * @returns {Promise<Object>} Subscription data
 */
export const getSubscription = async () => {
  const response = await apiClient.get(ENDPOINTS.subscription);
  return response.data;
};

// =============================================================================
// PUBLIC PROFILES
// =============================================================================

/**
 * Gets public user profile by username
 * @param {string} username - Username
 * @returns {Promise<Object>} Public profile
 */
export const getPublicProfile = async (username) => {
  const response = await apiClient.get(ENDPOINTS.publicProfile(username));
  return response.data;
};

/**
 * Searches users
 * @param {Object} params - Search params
 * @returns {Promise<Object>} Search results
 */
export const searchUsers = async ({ query, page = 1, limit = 20, filters = {} } = {}) => {
  const response = await apiClient.get(ENDPOINTS.search, {
    params: { q: query, page, limit, ...filters }
  });
  
  return response.data;
};

// =============================================================================
// ACCOUNT MANAGEMENT
// =============================================================================

/**
 * Requests account data export
 * @returns {Promise<Object>} Export request status
 */
export const requestDataExport = async () => {
  const response = await apiClient.post('/users/me/export');
  
  logUserAction('request_data_export');
  
  return response.data;
};

/**
 * Requests account deletion
 * @param {Object} data - Confirmation data
 * @returns {Promise<Object>} Deletion request status
 */
export const requestAccountDeletion = async ({ reason, password }) => {
  const response = await apiClient.post('/users/me/delete', {
    reason,
    password,
    confirmDeletion: true
  });
  
  logUserAction('request_account_deletion');
  
  return response.data;
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Refreshes user profile from server
 * @returns {Promise<Object>} Updated profile
 */
export const refreshProfile = async () => {
  return getProfile({ useCache: false });
};

/**
 * Invalidates user cache
 */
export const invalidateCache = () => {
  const { removeItem: removeCache } = require('../storage/localStorage.service');
  removeCache('cache_user_profile');
  removeCache('cache_user_stats');
  removeCache('cache_user_badges');
  removeCache('cache_user_achievements');
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Profile
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  refreshProfile,
  
  // Stats
  getStats,
  getDetailedStats,
  
  // Preferences
  getPreferences,
  updatePreferences,
  updateNotificationPreferences,
  updatePrivacySettings,
  
  // Badges & Achievements
  getBadges,
  getAchievements,
  setFeaturedBadges,
  
  // Activity
  getActivity,
  
  // Connections
  getConnections,
  getReferrals,
  getReferralCode,
  
  // Subscription
  getSubscription,
  
  // Public
  getPublicProfile,
  searchUsers,
  
  // Account
  requestDataExport,
  requestAccountDeletion,
  
  // Cache
  invalidateCache
};