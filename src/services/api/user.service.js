/**
 * GPS Lab Platform - User Service
 * 
 * User profile management service for fetching, updating, and managing
 * user data, avatars, and statistics.
 * 
 * MOCK MODE: When REACT_APP_USE_MOCK_DATA=true or API is unreachable,
 * all methods return realistic mock data for frontend-only development.
 * 
 * @module services/api/user.service
 * @version 1.1.0
 */

import apiClient from './client';
import { setUser, getCache, setCache, STORAGE_KEYS, setItem, getItem } from '../storage/localStorage.service';
import { logUserAction } from '../../utils/error/error.logger';

// =============================================================================
// MOCK MODE CONFIGURATION
// =============================================================================

const USE_MOCK = process.env.REACT_APP_USE_MOCK_DATA === 'true' ||
                 process.env.NODE_ENV === 'development';

const mockDelay = (ms = 300) => new Promise(r => setTimeout(r, ms));
const logMock = (method) => console.info(`[UserService:MOCK] ${method}`);

// =============================================================================
// MOCK DATA
// =============================================================================

/**
 * In-memory mock profile (mutable for update simulation)
 */
let mockProfile = {
  id: 'usr_mock_001',
  email: 'gps.solver@gpslab.dev',
  username: 'GPSExplorer',
  firstName: 'GPS',
  lastName: 'Explorer',
  displayName: 'GPS Explorer',
  bio: 'Passionate about solving global problems through technology and collaboration.',
  avatarUrl: null,
  locale: 'en',
  role: 'student',
  tier: 'silver',
  level: 5,
  emailVerified: true,
  isActive: true,
  university: {
    id: 'uni_001',
    name: 'Handong Global University',
    code: 'HGU'
  },
  location: {
    country: 'Kenya',
    city: 'Nairobi',
    timezone: 'Africa/Nairobi'
  },
  socialLinks: {
    github: '',
    linkedin: '',
    twitter: ''
  },
  preferences: {
    language: 'en',
    theme: 'light',
    notifications: true,
    emailDigest: 'weekly',
    soundEffects: true,
    navigatorPersonality: 'encouraging'
  },
  privacy: {
    profileVisible: true,
    showActivity: true,
    showBadges: true,
    showStats: true
  },
  createdAt: '2025-09-01T08:00:00Z',
  lastLoginAt: new Date().toISOString()
};

const MOCK_STATS = {
  level: 5,
  xp: 1250,
  xpToNextLevel: 2000,
  totalXP: 6250,
  streak: 7,
  longestStreak: 14,
  missionsCompleted: 8,
  missionsTotal: 175,
  checkpointsPassed: 2,
  checkpointsTotal: 35,
  bitesCompleted: 42,
  bitesTotal: 875,
  studyHours: 28.5,
  baraka: 2450,
  barakaTier: 'silver',
  rank: 142,
  totalUsers: 1200,
  percentile: 88,
  adventureProgress: {
    1: { completed: 8, total: 25, name: 'Foundation' },
    2: { completed: 0, total: 25, name: 'Discovery' },
    3: { completed: 0, total: 25, name: 'Connection' },
    4: { completed: 0, total: 25, name: 'Innovation' },
    5: { completed: 0, total: 25, name: 'Impact' },
    6: { completed: 0, total: 25, name: 'Leadership' },
    7: { completed: 0, total: 25, name: 'Legacy' }
  },
  weeklyActivity: [
    { day: 'Mon', minutes: 45, bites: 3 },
    { day: 'Tue', minutes: 60, bites: 4 },
    { day: 'Wed', minutes: 30, bites: 2 },
    { day: 'Thu', minutes: 90, bites: 6 },
    { day: 'Fri', minutes: 75, bites: 5 },
    { day: 'Sat', minutes: 45, bites: 3 },
    { day: 'Sun', minutes: 60, bites: 4 }
  ]
};

const MOCK_BADGES = [
  {
    id: 'badge_001', name: 'First Steps', description: 'Completed your first mission',
    icon: '👣', category: 'milestone', rarity: 'common',
    earnedAt: '2025-09-15T10:00:00Z', featured: true
  },
  {
    id: 'badge_002', name: 'Week Warrior', description: 'Maintained a 7-day streak',
    icon: '🔥', category: 'streak', rarity: 'uncommon',
    earnedAt: '2025-10-01T08:00:00Z', featured: true
  },
  {
    id: 'badge_003', name: 'Stage Clear', description: 'Completed all missions in Stage 1',
    icon: '🏁', category: 'completion', rarity: 'rare',
    earnedAt: '2025-11-20T14:30:00Z', featured: false
  },
  {
    id: 'badge_004', name: 'Helpful Hand', description: 'Gave honor to 5 peers',
    icon: '🤝', category: 'community', rarity: 'uncommon',
    earnedAt: '2025-12-05T11:00:00Z', featured: false
  },
  {
    id: 'badge_005', name: 'Explorer', description: 'Completed Adventure 1: Foundation',
    icon: '🗺️', category: 'adventure', rarity: 'rare',
    earnedAt: '2025-12-18T16:45:00Z', featured: true
  }
];

const MOCK_ACHIEVEMENTS = [
  {
    id: 'ach_001', name: 'Mission Master', description: 'Complete 10 missions',
    progress: 8, target: 10, percentage: 80, reward: 500, rewardType: 'baraka',
    category: 'missions'
  },
  {
    id: 'ach_002', name: 'Streak Legend', description: 'Maintain a 30-day streak',
    progress: 7, target: 30, percentage: 23, reward: 1000, rewardType: 'baraka',
    category: 'streaks'
  },
  {
    id: 'ach_003', name: 'Knowledge Seeker', description: 'Complete 100 study bites',
    progress: 42, target: 100, percentage: 42, reward: 750, rewardType: 'baraka',
    category: 'study'
  },
  {
    id: 'ach_004', name: 'Social Solver', description: 'Join 3 different parties',
    progress: 1, target: 3, percentage: 33, reward: 300, rewardType: 'baraka',
    category: 'community'
  },
  {
    id: 'ach_005', name: 'Speed Runner', description: 'Complete a mission in under 1 hour',
    progress: 0, target: 1, percentage: 0, reward: 250, rewardType: 'baraka',
    category: 'special'
  }
];

const MOCK_ACTIVITY = [
  {
    id: 'act_001', type: 'mission_completed', title: 'Completed Mission S1M2',
    description: 'Understanding Systems', xpEarned: 150, barakaEarned: 300,
    timestamp: '2025-12-20T10:30:00Z'
  },
  {
    id: 'act_002', type: 'badge_earned', title: 'Badge Earned: Explorer',
    description: 'Completed Adventure 1: Foundation', xpEarned: 50,
    timestamp: '2025-12-18T16:45:00Z'
  },
  {
    id: 'act_003', type: 'checkpoint_passed', title: 'Stage 1 Checkpoint Passed',
    description: 'Score: 87/100', xpEarned: 200, barakaEarned: 100,
    timestamp: '2025-12-17T14:15:00Z'
  },
  {
    id: 'act_004', type: 'streak_milestone', title: '7-Day Streak!',
    description: 'Keep it going!', barakaEarned: 50,
    timestamp: '2025-12-16T08:00:00Z'
  },
  {
    id: 'act_005', type: 'bite_completed', title: 'Study Bite Completed',
    description: 'Introduction to Design Thinking', xpEarned: 25,
    timestamp: '2025-12-15T11:20:00Z'
  }
];

const MOCK_CONNECTIONS = [
  {
    id: 'usr_002', username: 'SolverAlpha', displayName: 'Solver Alpha',
    avatarUrl: null, level: 7, tier: 'silver', status: 'online',
    connectionType: 'party_member', connectedAt: '2025-10-15T00:00:00Z'
  },
  {
    id: 'usr_003', username: 'InnovatorBeta', displayName: 'Innovator Beta',
    avatarUrl: null, level: 4, tier: 'bronze', status: 'offline',
    connectionType: 'friend', connectedAt: '2025-11-01T00:00:00Z'
  },
  {
    id: 'usr_004', username: 'BuilderGamma', displayName: 'Builder Gamma',
    avatarUrl: null, level: 9, tier: 'gold', status: 'online',
    connectionType: 'mentor', connectedAt: '2025-09-20T00:00:00Z'
  }
];

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
  if (USE_MOCK) {
    logMock('getProfile');
    await mockDelay(250);
    setUser({ ...mockProfile });
    return { ...mockProfile };
  }
  
  if (useCache) {
    const cached = getCache('user_profile', CACHE_TTL.profile);
    if (cached) return cached;
  }
  
  const response = await apiClient.get(ENDPOINTS.profile);
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
  if (USE_MOCK) {
    logMock('updateProfile');
    await mockDelay(400);
    
    mockProfile = { ...mockProfile, ...data };
    setCache('user_profile', mockProfile);
    setUser(mockProfile);
    logUserAction('update_profile', { fields: Object.keys(data) });
    
    return { ...mockProfile };
  }
  
  const response = await apiClient.patch(ENDPOINTS.updateProfile, data);
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
  if (USE_MOCK) {
    logMock('uploadAvatar');
    await mockDelay(800);
    
    // Simulate creating an object URL for the uploaded file
    const avatarUrl = URL.createObjectURL(file);
    mockProfile.avatarUrl = avatarUrl;
    setUser(mockProfile);
    setCache('user_profile', mockProfile);
    logUserAction('upload_avatar');
    
    return { avatarUrl, profile: { ...mockProfile } };
  }
  
  const formData = new FormData();
  formData.append('avatar', file);
  
  const response = await apiClient.upload(ENDPOINTS.avatar, formData);
  
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
  if (USE_MOCK) {
    logMock('deleteAvatar');
    await mockDelay(400);
    
    mockProfile.avatarUrl = null;
    setUser(mockProfile);
    setCache('user_profile', mockProfile);
    logUserAction('delete_avatar');
    
    return { avatarUrl: null, profile: { ...mockProfile } };
  }
  
  const response = await apiClient.delete(ENDPOINTS.avatar);
  
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
  if (USE_MOCK) {
    logMock('getStats');
    await mockDelay(250);
    return { ...MOCK_STATS };
  }
  
  if (useCache) {
    const cached = getCache('user_stats', CACHE_TTL.stats);
    if (cached) return cached;
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
  if (USE_MOCK) {
    logMock('getDetailedStats');
    await mockDelay(350);
    return {
      ...MOCK_STATS,
      period,
      groupBy,
      timeline: Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return {
          date: date.toISOString().split('T')[0],
          xpEarned: Math.floor(Math.random() * 200) + 50,
          bitesCompleted: Math.floor(Math.random() * 5) + 1,
          studyMinutes: Math.floor(Math.random() * 90) + 15
        };
      })
    };
  }
  
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
  if (USE_MOCK) {
    logMock('getPreferences');
    await mockDelay(200);
    return { ...mockProfile.preferences };
  }
  
  const response = await apiClient.get(ENDPOINTS.preferences);
  return response.data;
};

/**
 * Updates user preferences
 * @param {Object} preferences - Preferences to update
 * @returns {Promise<Object>} Updated preferences
 */
export const updatePreferences = async (preferences) => {
  if (USE_MOCK) {
    logMock('updatePreferences');
    await mockDelay(300);
    
    mockProfile.preferences = { ...mockProfile.preferences, ...preferences };
    setUser(mockProfile);
    logUserAction('update_preferences', { keys: Object.keys(preferences) });
    
    return { ...mockProfile.preferences };
  }
  
  const response = await apiClient.patch(ENDPOINTS.preferences, preferences);
  
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
  if (USE_MOCK) {
    logMock('updateNotificationPreferences');
    await mockDelay(300);
    logUserAction('update_notifications', { keys: Object.keys(notifications) });
    return { ...notifications };
  }
  
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
  if (USE_MOCK) {
    logMock('updatePrivacySettings');
    await mockDelay(300);
    
    mockProfile.privacy = { ...mockProfile.privacy, ...privacy };
    logUserAction('update_privacy', { keys: Object.keys(privacy) });
    
    return { ...mockProfile.privacy };
  }
  
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
  if (USE_MOCK) {
    logMock('getBadges');
    await mockDelay(250);
    return {
      badges: [...MOCK_BADGES],
      total: MOCK_BADGES.length,
      featured: MOCK_BADGES.filter(b => b.featured)
    };
  }
  
  if (useCache) {
    const cached = getCache('user_badges', CACHE_TTL.badges);
    if (cached) return cached;
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
  if (USE_MOCK) {
    logMock('getAchievements');
    await mockDelay(250);
    return {
      achievements: [...MOCK_ACHIEVEMENTS],
      completed: MOCK_ACHIEVEMENTS.filter(a => a.percentage >= 100).length,
      inProgress: MOCK_ACHIEVEMENTS.filter(a => a.percentage > 0 && a.percentage < 100).length,
      total: MOCK_ACHIEVEMENTS.length
    };
  }
  
  if (useCache) {
    const cached = getCache('user_achievements', CACHE_TTL.achievements);
    if (cached) return cached;
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
  if (USE_MOCK) {
    logMock('setFeaturedBadges');
    await mockDelay(300);
    logUserAction('set_featured_badges', { count: badgeIds.length });
    return {
      featured: MOCK_BADGES.filter(b => badgeIds.includes(b.id))
    };
  }
  
  const response = await apiClient.patch(ENDPOINTS.badges, { featured: badgeIds });
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
  if (USE_MOCK) {
    logMock('getActivity');
    await mockDelay(300);
    
    let items = [...MOCK_ACTIVITY];
    if (type) items = items.filter(a => a.type === type);
    
    const start = (page - 1) * limit;
    const paged = items.slice(start, start + limit);
    
    return {
      activities: paged,
      pagination: {
        page, limit, total: items.length,
        totalPages: Math.ceil(items.length / limit)
      }
    };
  }
  
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
  if (USE_MOCK) {
    logMock('getConnections');
    await mockDelay(300);
    
    let conns = [...MOCK_CONNECTIONS];
    if (type !== 'all') conns = conns.filter(c => c.connectionType === type);
    
    return {
      connections: conns,
      pagination: { page, limit, total: conns.length, totalPages: 1 }
    };
  }
  
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
  if (USE_MOCK) {
    logMock('getReferrals');
    await mockDelay(250);
    return {
      totalReferred: 2,
      totalEarned: 1000,
      pendingRewards: 0,
      referrals: [
        {
          id: 'ref_001', referredUser: 'InnovatorBeta', status: 'active',
          reward: 500, earnedAt: '2025-11-01T00:00:00Z'
        },
        {
          id: 'ref_002', referredUser: 'NewSolver99', status: 'active',
          reward: 500, earnedAt: '2025-12-10T00:00:00Z'
        }
      ]
    };
  }
  
  const response = await apiClient.get(ENDPOINTS.referrals);
  return response.data;
};

/**
 * Gets referral code
 * @returns {Promise<Object>} Referral code data
 */
export const getReferralCode = async () => {
  if (USE_MOCK) {
    logMock('getReferralCode');
    await mockDelay(200);
    return {
      code: 'GPS-EXPLORER-2025',
      url: `${window.location.origin}/join?ref=GPS-EXPLORER-2025`,
      uses: 2,
      maxUses: null
    };
  }
  
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
  if (USE_MOCK) {
    logMock('getSubscription');
    await mockDelay(200);
    return {
      plan: 'free',
      status: 'active',
      features: ['Basic missions', 'Community access', 'Navigator (limited)'],
      upgrades: [
        { plan: 'pro', price: 9.99, features: ['All missions', 'Unlimited Navigator', 'Priority support'] },
        { plan: 'team', price: 24.99, features: ['Everything in Pro', 'Team management', 'Analytics'] }
      ]
    };
  }
  
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
  if (USE_MOCK) {
    logMock(`getPublicProfile: ${username}`);
    await mockDelay(300);
    
    // Return mock connection if found, else generic
    const conn = MOCK_CONNECTIONS.find(c => c.username === username);
    if (conn) {
      return {
        id: conn.id, username: conn.username, displayName: conn.displayName,
        avatarUrl: conn.avatarUrl, level: conn.level, tier: conn.tier,
        bio: 'Fellow GPS solver exploring global challenges.',
        badges: MOCK_BADGES.slice(0, 2),
        stats: { missionsCompleted: 12, streak: 5, rank: 85 }
      };
    }
    
    return {
      id: 'usr_unknown', username, displayName: username,
      avatarUrl: null, level: 1, tier: 'bronze',
      bio: '', badges: [],
      stats: { missionsCompleted: 0, streak: 0, rank: 999 }
    };
  }
  
  const response = await apiClient.get(ENDPOINTS.publicProfile(username));
  return response.data;
};

/**
 * Searches users
 * @param {Object} params - Search params
 * @returns {Promise<Object>} Search results
 */
export const searchUsers = async ({ query, page = 1, limit = 20, filters = {} } = {}) => {
  if (USE_MOCK) {
    logMock(`searchUsers: ${query}`);
    await mockDelay(400);
    
    const results = MOCK_CONNECTIONS.filter(c =>
      c.username.toLowerCase().includes((query || '').toLowerCase()) ||
      c.displayName.toLowerCase().includes((query || '').toLowerCase())
    );
    
    return {
      users: results,
      pagination: { page, limit, total: results.length, totalPages: 1 }
    };
  }
  
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
  if (USE_MOCK) {
    logMock('requestDataExport');
    await mockDelay(500);
    logUserAction('request_data_export');
    return {
      requestId: 'exp_mock_' + Date.now(),
      status: 'processing',
      estimatedCompletion: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }
  
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
  if (USE_MOCK) {
    logMock('requestAccountDeletion');
    await mockDelay(500);
    logUserAction('request_account_deletion');
    return {
      requestId: 'del_mock_' + Date.now(),
      status: 'pending_confirmation',
      gracePeriodEnds: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  }
  
  const response = await apiClient.post('/users/me/delete', {
    reason, password, confirmDeletion: true
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