/**
 * GPS Lab Platform - Leaderboard Service
 * 
 * Leaderboard service for global, weekly, stage, and party rankings.
 * 
 * @module services/api/leaderboard.service
 * @version 1.1.0
 */

import apiClient from './client';
import { getCache, setCache } from '../storage/localStorage.service';
import { logUserAction } from '../../utils/error/logger';

const USE_MOCK = process.env.REACT_APP_USE_MOCK_DATA === 'true' ||
                 process.env.NODE_ENV === 'development';
const mockDelay = (ms = 300) => new Promise(r => setTimeout(r, ms));
const logMock = (method) => console.info(`[LeaderboardService:MOCK] ${method}`);

// =============================================================================
// MOCK DATA
// =============================================================================

const generateMockLeaders = (count = 20, startRank = 1) =>
  Array.from({ length: count }, (_, i) => ({
    rank: startRank + i,
    userId: `usr_lb_${startRank + i}`,
    username: `Solver${String(startRank + i).padStart(3, '0')}`,
    displayName: `GPS Solver ${startRank + i}`,
    avatarUrl: null,
    level: Math.max(1, 20 - (startRank + i - 1)),
    xp: Math.max(100, 50000 - (startRank + i - 1) * 2500 + Math.floor(Math.random() * 500)),
    baraka: Math.max(50, 25000 - (startRank + i - 1) * 1200 + Math.floor(Math.random() * 300)),
    missionsCompleted: Math.max(1, 50 - (startRank + i - 1) * 2),
    streak: Math.max(0, 30 - (startRank + i - 1)),
    tier: startRank + i <= 3 ? 'gold' : startRank + i <= 10 ? 'silver' : 'bronze',
    university: ['HGU', 'MIT', 'Stanford', 'Oxford', 'UoN'][Math.floor(Math.random() * 5)]
  }));

const MOCK_USER_RANK = {
  rank: 142, totalUsers: 1200, percentile: 88,
  xp: 6250, baraka: 2450, missionsCompleted: 8, streak: 7
};

// =============================================================================
// ENDPOINTS
// =============================================================================

const ENDPOINTS = {
  global: '/leaderboard/global',
  weekly: '/leaderboard/weekly',
  monthly: '/leaderboard/monthly',
  stage: (n) => `/leaderboard/stage/${n}`,
  party: (id) => `/leaderboard/party/${id}`,
  university: (code) => `/leaderboard/university/${code}`,
  userRank: '/leaderboard/me'
};

const CACHE_TTL = { leaderboard: 2 * 60 * 1000, userRank: 5 * 60 * 1000 };

// =============================================================================
// OPERATIONS
// =============================================================================

export const getGlobalLeaderboard = async ({ page = 1, limit = 20 } = {}) => {
  if (USE_MOCK) {
    logMock('getGlobalLeaderboard');
    await mockDelay(350);
    return {
      leaders: generateMockLeaders(limit, (page - 1) * limit + 1),
      pagination: { page, limit, total: 1200, totalPages: 60 },
      updatedAt: new Date().toISOString()
    };
  }
  const cacheKey = `lb_global_${page}`;
  const cached = getCache(cacheKey, CACHE_TTL.leaderboard);
  if (cached) return cached;
  const response = await apiClient.get(ENDPOINTS.global, { params: { page, limit } });
  setCache(cacheKey, response.data);
  return response.data;
};

export const getWeeklyLeaderboard = async ({ page = 1, limit = 20 } = {}) => {
  if (USE_MOCK) {
    logMock('getWeeklyLeaderboard');
    await mockDelay(300);
    return {
      leaders: generateMockLeaders(Math.min(limit, 10), (page - 1) * limit + 1),
      period: { start: new Date(Date.now() - 7 * 86400000).toISOString(), end: new Date().toISOString() },
      pagination: { page, limit, total: 150, totalPages: 8 }
    };
  }
  const response = await apiClient.get(ENDPOINTS.weekly, { params: { page, limit } });
  return response.data;
};

export const getMonthlyLeaderboard = async ({ page = 1, limit = 20 } = {}) => {
  if (USE_MOCK) {
    logMock('getMonthlyLeaderboard');
    await mockDelay(300);
    return {
      leaders: generateMockLeaders(limit, (page - 1) * limit + 1),
      period: { month: new Date().getMonth() + 1, year: new Date().getFullYear() },
      pagination: { page, limit, total: 500, totalPages: 25 }
    };
  }
  const response = await apiClient.get(ENDPOINTS.monthly, { params: { page, limit } });
  return response.data;
};

export const getStageLeaderboard = async (stageNumber, { page = 1, limit = 20 } = {}) => {
  if (USE_MOCK) {
    logMock(`getStageLeaderboard: S${stageNumber}`);
    await mockDelay(300);
    return {
      stageNumber,
      leaders: generateMockLeaders(Math.min(limit, 8), 1),
      pagination: { page, limit, total: 80, totalPages: 4 }
    };
  }
  const response = await apiClient.get(ENDPOINTS.stage(stageNumber), { params: { page, limit } });
  return response.data;
};

export const getPartyLeaderboard = async (partyId, { page = 1, limit = 20 } = {}) => {
  if (USE_MOCK) {
    logMock(`getPartyLeaderboard: ${partyId}`);
    await mockDelay(250);
    return {
      partyId,
      members: generateMockLeaders(5, 1),
      pagination: { page, limit, total: 5, totalPages: 1 }
    };
  }
  const response = await apiClient.get(ENDPOINTS.party(partyId), { params: { page, limit } });
  return response.data;
};

export const getUniversityLeaderboard = async (universityCode, { page = 1, limit = 20 } = {}) => {
  if (USE_MOCK) {
    logMock(`getUniversityLeaderboard: ${universityCode}`);
    await mockDelay(300);
    return {
      universityCode,
      leaders: generateMockLeaders(limit, 1).map(l => ({ ...l, university: universityCode })),
      pagination: { page, limit, total: 120, totalPages: 6 }
    };
  }
  const response = await apiClient.get(ENDPOINTS.university(universityCode), { params: { page, limit } });
  return response.data;
};

export const getUserRank = async () => {
  if (USE_MOCK) {
    logMock('getUserRank');
    await mockDelay(200);
    return { ...MOCK_USER_RANK };
  }
  const cached = getCache('lb_user_rank', CACHE_TTL.userRank);
  if (cached) return cached;
  const response = await apiClient.get(ENDPOINTS.userRank);
  setCache('lb_user_rank', response.data);
  return response.data;
};

export default {
  getGlobalLeaderboard, getWeeklyLeaderboard, getMonthlyLeaderboard,
  getStageLeaderboard, getPartyLeaderboard, getUniversityLeaderboard,
  getUserRank
};