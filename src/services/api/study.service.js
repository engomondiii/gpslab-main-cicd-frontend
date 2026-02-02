/**
 * GPS Lab Platform - Study Service
 * 
 * Study loop management service for recursive learning,
 * R2R (Right to Retry) mechanics, and progress tracking.
 * 
 * MOCK MODE: When REACT_APP_USE_MOCK_DATA=true or API is unreachable,
 * all methods return realistic mock data for frontend-only development.
 * 
 * @module services/api/study.service
 * @version 1.1.0
 */

import apiClient from './client';
import { getCache, setCache, setItem, getItem, STORAGE_KEYS } from '../storage/localStorage.service';
import { logUserAction } from '../../utils/error/logger';

// =============================================================================
// MOCK MODE CONFIGURATION
// =============================================================================

const USE_MOCK = process.env.REACT_APP_USE_MOCK_DATA === 'true' ||
                 process.env.NODE_ENV === 'development';

const mockDelay = (ms = 300) => new Promise(r => setTimeout(r, ms));
const logMock = (method) => console.info(`[StudyService:MOCK] ${method}`);

// =============================================================================
// MOCK DATA
// =============================================================================

let mockProgress = {
  completedMissions: 8,
  totalMissions: 175,
  completedCheckpoints: 2,
  totalCheckpoints: 35,
  completedBites: 42,
  totalBites: 875,
  currentStage: 2,
  currentAdventure: 1,
  studyHoursTotal: 28.5,
  lastStudyDate: new Date().toISOString().split('T')[0],
  studiedToday: true
};

let mockSession = null;

const MOCK_STREAK = {
  current: 7,
  longest: 14,
  lastStudyDate: new Date().toISOString().split('T')[0],
  studiedToday: true,
  milestones: [
    { day: 3, claimed: true, reward: 25 },
    { day: 7, claimed: false, reward: 50 },
    { day: 14, claimed: false, reward: 100 },
    { day: 30, claimed: false, reward: 250 }
  ]
};

const MOCK_R2R = {
  freeRetries: 2,
  paidRetries: 0,
  graceUsed: false,
  totalUsed: 1,
  history: [
    { missionId: 'S1M5', type: 'free', usedAt: '2025-12-10T14:00:00Z', result: 'passed' }
  ]
};

const MOCK_STATS = {
  period: '30d',
  totalStudyMinutes: 1710,
  avgDailyMinutes: 57,
  sessionsCount: 28,
  avgSessionMinutes: 61,
  bitesCompleted: 42,
  missionsCompleted: 8,
  checkpointsPassed: 2,
  streakDays: 7,
  xpEarned: 6250,
  barakaEarned: 2450,
  mostProductiveDay: 'Thursday',
  mostProductiveHour: 14,
  byWeek: [
    { week: 'W1', minutes: 380, bites: 9 },
    { week: 'W2', minutes: 450, bites: 12 },
    { week: 'W3', minutes: 420, bites: 10 },
    { week: 'W4', minutes: 460, bites: 11 }
  ]
};

const MOCK_GOALS = {
  daily: { target: 60, unit: 'minutes', current: 45, type: 'study_time' },
  weekly: { target: 5, unit: 'bites', current: 3, type: 'bites_completed' },
  monthly: { target: 2, unit: 'missions', current: 1, type: 'missions_completed' }
};

const MOCK_SCHEDULE = {
  preferredDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  preferredTime: '14:00',
  sessionDuration: 60,
  reminderEnabled: true,
  reminderMinutesBefore: 15
};

const MOCK_RECOMMENDATIONS = [
  { type: 'continue', title: 'Continue Mission S2M4', description: 'You are 40% through — keep going!', priority: 'high', missionId: 'S2M4' },
  { type: 'review', title: 'Review Stage 1 Concepts', description: 'Strengthen your foundation before advancing.', priority: 'medium' },
  { type: 'practice', title: 'Practice Systems Mapping', description: 'Extra practice available for Stage 2 skills.', priority: 'medium' },
  { type: 'streak', title: 'Maintain Your Streak', description: '7-day streak — keep it alive!', priority: 'high' }
];

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
  progress: 2 * 60 * 1000,
  streak: 5 * 60 * 1000,
  stats: 5 * 60 * 1000
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
  FREE: 'free',
  PAID: 'paid',
  GRACE: 'grace'
};

export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 90, 180, 365];

// =============================================================================
// PROGRESS OPERATIONS
// =============================================================================

export const getProgress = async ({ useCache = true } = {}) => {
  if (USE_MOCK) {
    logMock('getProgress');
    await mockDelay(250);
    setItem(STORAGE_KEYS.studyProgress, mockProgress);
    return { ...mockProgress };
  }

  if (useCache) {
    const cached = getCache('study_progress', CACHE_TTL.progress);
    if (cached) return cached;
  }
  const response = await apiClient.get(ENDPOINTS.progress);
  setCache('study_progress', response.data);
  setItem(STORAGE_KEYS.studyProgress, response.data);
  return response.data;
};

export const getStageProgress = async (stageNumber) => {
  if (USE_MOCK) {
    logMock(`getStageProgress: ${stageNumber}`);
    await mockDelay(200);
    const completed = stageNumber < 2 ? 5 : stageNumber === 2 ? 3 : 0;
    return {
      stageNumber, completed, total: 5,
      percentage: (completed / 5) * 100,
      missions: Array.from({ length: 5 }, (_, i) => ({
        id: `S${stageNumber}M${i + 1}`,
        status: i < completed ? 'completed' : i === completed && stageNumber === 2 ? 'in_progress' : 'locked'
      }))
    };
  }
  const response = await apiClient.get(`${ENDPOINTS.progress}/stage/${stageNumber}`);
  return response.data;
};

export const getMissionProgress = async (missionId) => {
  if (USE_MOCK) {
    logMock(`getMissionProgress: ${missionId}`);
    await mockDelay(200);
    return {
      missionId,
      bitesCompleted: 2, bitesTotal: 5, percentage: 40,
      checkpointStatus: 'not_started',
      lastActivityAt: new Date().toISOString()
    };
  }
  const response = await apiClient.get(`${ENDPOINTS.progress}/mission/${missionId}`);
  return response.data;
};

// =============================================================================
// SESSION OPERATIONS
// =============================================================================

export const getCurrentSession = async () => {
  if (USE_MOCK) {
    logMock('getCurrentSession');
    await mockDelay(150);
    return mockSession;
  }
  try {
    const response = await apiClient.get(ENDPOINTS.session);
    return response.data;
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
};

export const startStudySession = async ({ missionId, biteId, plannedDuration, goals = [] } = {}) => {
  if (USE_MOCK) {
    logMock(`startStudySession: ${missionId}`);
    await mockDelay(400);

    mockSession = {
      sessionId: 'sess_mock_' + Date.now(),
      missionId, biteId, goals,
      plannedDuration: plannedDuration || 60,
      startedAt: new Date().toISOString(),
      status: 'active',
      minutesElapsed: 0
    };

    logUserAction('study_session_started', { missionId, biteId });
    window.dispatchEvent(new CustomEvent('study:session_started', { detail: mockSession }));
    return { ...mockSession };
  }

  const response = await apiClient.post(ENDPOINTS.startSession, {
    missionId, biteId, plannedDuration, goals, startedAt: new Date().toISOString()
  });
  logUserAction('study_session_started', { missionId, biteId });
  window.dispatchEvent(new CustomEvent('study:session_started', { detail: response.data }));
  return response.data;
};

export const endStudySession = async ({ completed = false, notes, rating } = {}) => {
  if (USE_MOCK) {
    logMock('endStudySession');
    await mockDelay(400);

    const duration = mockSession
      ? Math.floor((Date.now() - new Date(mockSession.startedAt).getTime()) / 60000) || 45
      : 45;
    const result = {
      sessionId: mockSession?.sessionId || 'sess_mock',
      duration,
      completed,
      xpEarned: completed ? 150 : 50,
      barakaEarned: completed ? 75 : 25,
      bitesCompleted: completed ? 3 : 1,
      endedAt: new Date().toISOString()
    };

    mockSession = null;
    invalidateStudyCache();
    logUserAction('study_session_ended', { completed, duration });
    window.dispatchEvent(new CustomEvent('study:session_ended', { detail: result }));
    return result;
  }

  const response = await apiClient.post(ENDPOINTS.endSession, {
    completed, notes, rating, endedAt: new Date().toISOString()
  });
  invalidateStudyCache();
  logUserAction('study_session_ended', { completed, duration: response.data.duration });
  window.dispatchEvent(new CustomEvent('study:session_ended', { detail: response.data }));
  return response.data;
};

export const updateSessionProgress = async (update) => {
  if (USE_MOCK) {
    logMock('updateSessionProgress');
    await mockDelay(200);
    if (mockSession) mockSession = { ...mockSession, ...update };
    return mockSession ? { ...mockSession } : {};
  }
  const response = await apiClient.patch(ENDPOINTS.session, update);
  return response.data;
};

// =============================================================================
// R2R (RIGHT TO RETRY) OPERATIONS
// =============================================================================

export const getR2RStatus = async () => {
  if (USE_MOCK) {
    logMock('getR2RStatus');
    await mockDelay(200);
    return { ...MOCK_R2R };
  }
  const response = await apiClient.get(ENDPOINTS.r2r);
  return response.data;
};

export const getR2RHistory = async ({ page = 1, limit = 20 } = {}) => {
  if (USE_MOCK) {
    logMock('getR2RHistory');
    await mockDelay(250);
    return {
      history: MOCK_R2R.history,
      pagination: { page, limit, total: MOCK_R2R.history.length, totalPages: 1 }
    };
  }
  const response = await apiClient.get(`${ENDPOINTS.r2r}/history`, { params: { page, limit } });
  return response.data;
};

export const activateR2R = async (missionId, { type = R2R_TYPES.FREE } = {}) => {
  if (USE_MOCK) {
    logMock(`activateR2R: ${missionId} (${type})`);
    await mockDelay(500);
    logUserAction('r2r_activated', { missionId, type });
    window.dispatchEvent(new CustomEvent('study:r2r_activated', { detail: { missionId, type } }));
    return { missionId, type, activated: true, remainingFree: Math.max(0, MOCK_R2R.freeRetries - 1) };
  }

  const response = await apiClient.post(ENDPOINTS.activateR2R, { missionId, type });
  logUserAction('r2r_activated', { missionId, type });
  window.dispatchEvent(new CustomEvent('study:r2r_activated', { detail: { missionId, ...response.data } }));
  return response.data;
};

export const purchasePR2R = async (quantity = 1) => {
  if (USE_MOCK) {
    logMock(`purchasePR2R: ${quantity}`);
    await mockDelay(400);
    logUserAction('pr2r_purchased', { quantity });
    return { quantity, totalCost: quantity * 100, newPR2RBalance: MOCK_R2R.paidRetries + quantity };
  }
  const response = await apiClient.post(`${ENDPOINTS.r2r}/purchase`, { quantity });
  logUserAction('pr2r_purchased', { quantity });
  return response.data;
};

// =============================================================================
// STREAK OPERATIONS
// =============================================================================

export const getStreak = async ({ useCache = true } = {}) => {
  if (USE_MOCK) {
    logMock('getStreak');
    await mockDelay(200);
    return { ...MOCK_STREAK };
  }
  if (useCache) {
    const cached = getCache('study_streak', CACHE_TTL.streak);
    if (cached) return cached;
  }
  const response = await apiClient.get(ENDPOINTS.streak);
  setCache('study_streak', response.data);
  return response.data;
};

export const claimStreakReward = async (milestone) => {
  if (USE_MOCK) {
    logMock(`claimStreakReward: ${milestone}`);
    await mockDelay(400);
    const ms = MOCK_STREAK.milestones.find(m => m.day === milestone);
    if (ms) ms.claimed = true;
    logUserAction('streak_reward_claimed', { milestone });
    const { removeItem } = require('../storage/localStorage.service');
    removeItem('cache_study_streak');
    return { milestone, reward: ms?.reward || 0, claimed: true };
  }

  const response = await apiClient.post(`${ENDPOINTS.streak}/claim`, { milestone });
  logUserAction('streak_reward_claimed', { milestone });
  const { removeItem } = require('../storage/localStorage.service');
  removeItem('cache_study_streak');
  return response.data;
};

export const getStreakCalendar = async ({ month, year } = {}) => {
  if (USE_MOCK) {
    logMock('getStreakCalendar');
    await mockDelay(300);

    const now = new Date();
    const m = month || now.getMonth() + 1;
    const y = year || now.getFullYear();
    const daysInMonth = new Date(y, m, 0).getDate();

    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const date = new Date(y, m - 1, day);
      const isPast = date <= now;
      return {
        date: `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        studied: isPast && day <= now.getDate() && Math.random() > 0.2,
        minutes: isPast ? Math.floor(Math.random() * 90) + 15 : 0
      };
    });

    return { month: m, year: y, days, streakDays: MOCK_STREAK.current };
  }

  const now = new Date();
  const params = { month: month || now.getMonth() + 1, year: year || now.getFullYear() };
  const response = await apiClient.get(`${ENDPOINTS.streak}/calendar`, { params });
  return response.data;
};

// =============================================================================
// STATISTICS
// =============================================================================

export const getStats = async ({ period = '30d', useCache = true } = {}) => {
  if (USE_MOCK) {
    logMock(`getStats: ${period}`);
    await mockDelay(300);
    return { ...MOCK_STATS, period };
  }

  const cacheKey = `study_stats_${period}`;
  if (useCache) {
    const cached = getCache(cacheKey, CACHE_TTL.stats);
    if (cached) return cached;
  }
  const response = await apiClient.get(ENDPOINTS.stats, { params: { period } });
  setCache(cacheKey, response.data);
  return response.data;
};

export const getAnalytics = async ({ startDate, endDate, groupBy = 'day' } = {}) => {
  if (USE_MOCK) {
    logMock('getAnalytics');
    await mockDelay(350);
    return {
      startDate, endDate, groupBy,
      dataPoints: Array.from({ length: 30 }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (29 - i));
        return {
          date: d.toISOString().split('T')[0],
          studyMinutes: Math.floor(Math.random() * 90) + 15,
          bitesCompleted: Math.floor(Math.random() * 5) + 1,
          xpEarned: Math.floor(Math.random() * 200) + 50
        };
      })
    };
  }
  const response = await apiClient.get(`${ENDPOINTS.stats}/analytics`, {
    params: { startDate, endDate, groupBy }
  });
  return response.data;
};

// =============================================================================
// GOALS & SCHEDULE
// =============================================================================

export const getGoals = async () => {
  if (USE_MOCK) {
    logMock('getGoals');
    await mockDelay(200);
    return { ...MOCK_GOALS };
  }
  const response = await apiClient.get(ENDPOINTS.goals);
  return response.data;
};

export const setGoals = async (goals) => {
  if (USE_MOCK) {
    logMock('setGoals');
    await mockDelay(300);
    Object.assign(MOCK_GOALS, goals);
    logUserAction('study_goals_updated', { goals });
    return { ...MOCK_GOALS };
  }
  const response = await apiClient.put(ENDPOINTS.goals, goals);
  logUserAction('study_goals_updated', { goals });
  return response.data;
};

export const getSchedule = async () => {
  if (USE_MOCK) {
    logMock('getSchedule');
    await mockDelay(200);
    return { ...MOCK_SCHEDULE };
  }
  const response = await apiClient.get(ENDPOINTS.schedule);
  return response.data;
};

export const updateSchedule = async (schedule) => {
  if (USE_MOCK) {
    logMock('updateSchedule');
    await mockDelay(300);
    Object.assign(MOCK_SCHEDULE, schedule);
    logUserAction('study_schedule_updated');
    return { ...MOCK_SCHEDULE };
  }
  const response = await apiClient.put(ENDPOINTS.schedule, schedule);
  logUserAction('study_schedule_updated');
  return response.data;
};

// =============================================================================
// RECOMMENDATIONS
// =============================================================================

export const getRecommendations = async () => {
  if (USE_MOCK) {
    logMock('getRecommendations');
    await mockDelay(300);
    return { recommendations: [...MOCK_RECOMMENDATIONS] };
  }
  const response = await apiClient.get(ENDPOINTS.recommendations);
  return response.data;
};

export const getNextAction = async () => {
  if (USE_MOCK) {
    logMock('getNextAction');
    await mockDelay(200);
    return MOCK_RECOMMENDATIONS[0];
  }
  const response = await apiClient.get(`${ENDPOINTS.recommendations}/next`);
  return response.data;
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const invalidateStudyCache = () => {
  const { removeItem } = require('../storage/localStorage.service');
  removeItem('cache_study_progress');
  removeItem('cache_study_streak');
};

export const calculateOverallCompletion = (progress) => {
  if (!progress) return 0;
  const { completedMissions = 0, totalMissions = 175 } = progress;
  return Math.round((completedMissions / totalMissions) * 100);
};

export const calculateStageCompletion = (stageProgress) => {
  if (!stageProgress || !stageProgress.missions) return 0;
  const completed = stageProgress.missions.filter(m => m.status === 'completed').length;
  return Math.round((completed / stageProgress.missions.length) * 100);
};

export const getNextStreakMilestone = (currentStreak) => {
  const next = STREAK_MILESTONES.find(m => m > currentStreak);
  if (!next) return { milestone: null, daysRemaining: 0 };
  return { milestone: next, daysRemaining: next - currentStreak };
};

export const isStreakAtRisk = (streak) => {
  if (!streak || !streak.lastStudyDate) return false;
  const lastStudy = new Date(streak.lastStudyDate);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return lastStudy.toDateString() === yesterday.toDateString() && !streak.studiedToday;
};

export const formatStudyDuration = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  getProgress, getStageProgress, getMissionProgress,
  getCurrentSession, startStudySession, endStudySession, updateSessionProgress,
  getR2RStatus, getR2RHistory, activateR2R, purchasePR2R,
  getStreak, claimStreakReward, getStreakCalendar,
  getStats, getAnalytics,
  getGoals, setGoals, getSchedule, updateSchedule,
  getRecommendations, getNextAction,
  calculateOverallCompletion, calculateStageCompletion,
  getNextStreakMilestone, isStreakAtRisk, formatStudyDuration,
  STUDY_PHASES, R2R_TYPES, STREAK_MILESTONES
};