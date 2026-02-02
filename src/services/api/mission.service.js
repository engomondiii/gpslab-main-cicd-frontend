/**
 * GPS Lab Platform - Mission Service
 * 
 * Mission management service for fetching, accepting, progressing,
 * and completing missions in the GPS Lab curriculum.
 * 
 * MOCK MODE: When REACT_APP_USE_MOCK_DATA=true or API is unreachable,
 * all methods return realistic curriculum-aligned mock data for
 * frontend-only development.
 * 
 * @module services/api/mission.service
 * @version 1.1.0
 */

import apiClient from './client';
import { getCache, setCache, setCurrentMission, getCurrentMission } from '../storage/localStorage.service';
import { logMissionEvent, missionLogger } from '../../utils/error/error.logger';
import { CURRICULUM_TOTALS, ADVENTURES } from '../../utils/constants/game.constants';

// =============================================================================
// MOCK MODE CONFIGURATION
// =============================================================================

const USE_MOCK = process.env.REACT_APP_USE_MOCK_DATA === 'true' ||
                 process.env.NODE_ENV === 'development';

const mockDelay = (ms = 300) => new Promise(r => setTimeout(r, ms));
const logMock = (method) => console.info(`[MissionService:MOCK] ${method}`);

// =============================================================================
// MOCK DATA — GPS LAB CURRICULUM
// =============================================================================

/**
 * Adventure definitions (7 adventures × 5 stages each = 35 stages)
 */
const MOCK_ADVENTURES = [
  { number: 1, name: 'Foundation',  theme: 'Building Your GPS Identity', stageRange: { start: 1, end: 5 } },
  { number: 2, name: 'Discovery',   theme: 'Understanding Global Challenges', stageRange: { start: 6, end: 10 } },
  { number: 3, name: 'Connection',  theme: 'Building Teams & Networks', stageRange: { start: 11, end: 15 } },
  { number: 4, name: 'Innovation',  theme: 'Design & Solution Crafting', stageRange: { start: 16, end: 20 } },
  { number: 5, name: 'Impact',      theme: 'Implementation & Real-World Testing', stageRange: { start: 21, end: 25 } },
  { number: 6, name: 'Leadership',  theme: 'Scaling & Leading Change', stageRange: { start: 26, end: 30 } },
  { number: 7, name: 'Legacy',      theme: 'Sustainability & Knowledge Transfer', stageRange: { start: 31, end: 35 } }
];

/**
 * Mission titles for stages 1-3 (detailed sample data)
 * Each stage has 5 missions
 */
const STAGE_MISSIONS = {
  1: [
    { number: 1, title: 'Introduction to GPS Thinking', xp: 100, baraka: 150, difficulty: 'beginner', estimatedMinutes: 30 },
    { number: 2, title: 'Understanding Systems', xp: 120, baraka: 175, difficulty: 'beginner', estimatedMinutes: 35 },
    { number: 3, title: 'Your Problem-Solving Identity', xp: 130, baraka: 200, difficulty: 'beginner', estimatedMinutes: 40 },
    { number: 4, title: 'Empathy in Action', xp: 140, baraka: 225, difficulty: 'beginner', estimatedMinutes: 45 },
    { number: 5, title: 'Setting Your GPS Compass', xp: 200, baraka: 300, difficulty: 'intermediate', estimatedMinutes: 60 }
  ],
  2: [
    { number: 1, title: 'Observing Your Community', xp: 150, baraka: 200, difficulty: 'beginner', estimatedMinutes: 35 },
    { number: 2, title: 'Mapping Local Challenges', xp: 160, baraka: 225, difficulty: 'beginner', estimatedMinutes: 40 },
    { number: 3, title: 'Research Methods Basics', xp: 170, baraka: 250, difficulty: 'intermediate', estimatedMinutes: 45 },
    { number: 4, title: 'Interviewing Stakeholders', xp: 180, baraka: 275, difficulty: 'intermediate', estimatedMinutes: 50 },
    { number: 5, title: 'Problem Statement Workshop', xp: 250, baraka: 350, difficulty: 'intermediate', estimatedMinutes: 60 }
  ],
  3: [
    { number: 1, title: 'Data Collection Fundamentals', xp: 175, baraka: 225, difficulty: 'intermediate', estimatedMinutes: 40 },
    { number: 2, title: 'Analyzing Patterns', xp: 185, baraka: 250, difficulty: 'intermediate', estimatedMinutes: 45 },
    { number: 3, title: 'Root Cause Analysis', xp: 200, baraka: 275, difficulty: 'intermediate', estimatedMinutes: 50 },
    { number: 4, title: 'Systems Mapping', xp: 220, baraka: 300, difficulty: 'intermediate', estimatedMinutes: 55 },
    { number: 5, title: 'Insight Synthesis', xp: 300, baraka: 400, difficulty: 'advanced', estimatedMinutes: 70 }
  ]
};

/**
 * Generates a mock mission object
 * @param {number} stageNumber - Stage number
 * @param {number} missionNumber - Mission number within stage
 * @param {string} status - Mission status
 * @returns {Object} Mock mission
 */
const generateMockMission = (stageNumber, missionNumber, status = 'locked') => {
  const id = `S${stageNumber}M${missionNumber}`;
  const adventure = MOCK_ADVENTURES.find(
    a => stageNumber >= a.stageRange.start && stageNumber <= a.stageRange.end
  );
  
  // Use detailed data for stages 1-3, generate for others
  const stageData = STAGE_MISSIONS[stageNumber];
  const missionData = stageData
    ? stageData[missionNumber - 1]
    : {
        title: `Mission ${missionNumber}: Stage ${stageNumber} Challenge`,
        xp: 100 + (stageNumber * 20) + (missionNumber * 10),
        baraka: 150 + (stageNumber * 25) + (missionNumber * 15),
        difficulty: stageNumber <= 10 ? 'beginner' : stageNumber <= 20 ? 'intermediate' : 'advanced',
        estimatedMinutes: 30 + (stageNumber * 2) + (missionNumber * 5)
      };
  
  const mission = {
    id,
    stageNumber,
    missionNumber,
    adventureNumber: adventure?.number || 1,
    adventureName: adventure?.name || 'Unknown',
    title: missionData.title,
    description: `Complete this mission to advance through ${adventure?.name || 'the adventure'}. Focus on ${adventure?.theme || 'core skills'}.`,
    status,
    difficulty: missionData.difficulty,
    estimatedMinutes: missionData.estimatedMinutes,
    rewards: {
      xp: missionData.xp,
      baraka: missionData.baraka,
      badge: missionNumber === 5 ? `stage_${stageNumber}_complete` : null
    },
    bites: Array.from({ length: 5 }, (_, i) => ({
      id: `${id}_bite_${i + 1}`,
      title: `Bite ${i + 1}`,
      type: ['read', 'watch', 'practice', 'reflect', 'apply'][i],
      status: status === 'completed' ? 'completed' : 'pending',
      estimatedMinutes: Math.floor(missionData.estimatedMinutes / 5)
    })),
    prerequisites: missionNumber > 1
      ? [`S${stageNumber}M${missionNumber - 1}`]
      : stageNumber > 1
        ? [`S${stageNumber - 1}M5`]
        : [],
    tags: [adventure?.name?.toLowerCase(), missionData.difficulty, `stage-${stageNumber}`],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  };
  
  // Add progress data for active/in_progress missions
  if (status === 'in_progress' || status === 'active') {
    mission.progress = {
      bitesCompleted: 2,
      bitesTotal: 5,
      percentage: 40,
      lastActivityAt: new Date().toISOString(),
      startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    };
    // Mark first 2 bites as completed
    mission.bites[0].status = 'completed';
    mission.bites[1].status = 'completed';
    mission.bites[2].status = 'in_progress';
  }
  
  if (status === 'completed') {
    mission.completedAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
    mission.score = Math.floor(Math.random() * 20) + 80;
    mission.progress = { bitesCompleted: 5, bitesTotal: 5, percentage: 100 };
  }
  
  return mission;
};

/**
 * Generates full mock mission catalog with realistic progression state
 * Stages 1-2 completed, Stage 3 in-progress, rest locked
 */
const generateMockMissions = () => {
  const missions = [];
  
  for (let stage = 1; stage <= 35; stage++) {
    for (let mission = 1; mission <= 5; mission++) {
      let status;
      
      if (stage <= 1 || (stage === 2 && mission <= 3)) {
        status = 'completed';
      } else if (stage === 2 && mission === 4) {
        status = 'in_progress';
      } else if (stage === 2 && mission === 5) {
        status = 'available';
      } else if (stage === 3 && mission === 1) {
        status = 'available';
      } else {
        status = 'locked';
      }
      
      missions.push(generateMockMission(stage, mission, status));
    }
  }
  
  return missions;
};

/**
 * Lazily initialised mock mission store
 */
let _mockMissions = null;
const getMockMissions = () => {
  if (!_mockMissions) _mockMissions = generateMockMissions();
  return _mockMissions;
};

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
 * @returns {Promise<Object>} Missions list with pagination
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
  // --- MOCK MODE ---
  if (USE_MOCK) {
    logMock('getMissions');
    await mockDelay(350);
    
    let filtered = [...getMockMissions()];
    if (status) filtered = filtered.filter(m => m.status === status);
    if (stage) filtered = filtered.filter(m => m.stageNumber === Number(stage));
    if (adventure) filtered = filtered.filter(m => m.adventureNumber === Number(adventure));
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q)
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      const aVal = a[sortBy] || 0;
      const bVal = b[sortBy] || 0;
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });
    
    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);
    
    return {
      missions: paged,
      pagination: {
        page, limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit)
      }
    };
  }
  
  // --- LIVE API ---
  const cacheKey = `missions_${page}_${limit}_${status}_${stage}_${adventure}_${sortBy}`;
  
  if (useCache && !search) {
    const cached = getCache(cacheKey, CACHE_TTL.missionList);
    if (cached) return cached;
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
  if (USE_MOCK) {
    logMock(`getMissionsByStage: ${stageNumber}`);
    await mockDelay(250);
    
    const missions = getMockMissions().filter(m => m.stageNumber === Number(stageNumber));
    const adventure = MOCK_ADVENTURES.find(
      a => stageNumber >= a.stageRange.start && stageNumber <= a.stageRange.end
    );
    
    return {
      stageNumber: Number(stageNumber),
      adventureName: adventure?.name || 'Unknown',
      adventureNumber: adventure?.number || 0,
      missions,
      completed: missions.filter(m => m.status === 'completed').length,
      total: missions.length
    };
  }
  
  const cacheKey = `stage_${stageNumber}_missions`;
  
  if (useCache) {
    const cached = getCache(cacheKey, CACHE_TTL.stagesMissions);
    if (cached) return cached;
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
  if (USE_MOCK) {
    logMock(`getMissionsByAdventure: ${adventureNumber}`);
    await mockDelay(300);
    
    const adventure = MOCK_ADVENTURES[adventureNumber - 1];
    const missions = getMockMissions().filter(m => m.adventureNumber === Number(adventureNumber));
    
    return {
      adventure: adventure || { number: adventureNumber, name: 'Unknown' },
      missions,
      completed: missions.filter(m => m.status === 'completed').length,
      total: missions.length,
      stages: Array.from({ length: 5 }, (_, i) => {
        const stageNum = (adventureNumber - 1) * 5 + i + 1;
        const stageMissions = missions.filter(m => m.stageNumber === stageNum);
        return {
          stageNumber: stageNum,
          missions: stageMissions,
          completed: stageMissions.filter(m => m.status === 'completed').length,
          total: stageMissions.length
        };
      })
    };
  }
  
  const cacheKey = `adventure_${adventureNumber}_missions`;
  
  if (useCache) {
    const cached = getCache(cacheKey, CACHE_TTL.stagesMissions);
    if (cached) return cached;
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
  if (stored) return stored;
  
  if (USE_MOCK) {
    logMock('getCurrentActiveMission');
    await mockDelay(200);
    
    const active = getMockMissions().find(m => m.status === 'in_progress' || m.status === 'active');
    if (active) setCurrentMission(active);
    return active || null;
  }
  
  try {
    const response = await apiClient.get(ENDPOINTS.current);
    if (response.data) setCurrentMission(response.data);
    return response.data;
  } catch (error) {
    return null;
  }
};

/**
 * Gets available missions (unlocked but not started)
 * @returns {Promise<Object>} Available missions
 */
export const getAvailableMissions = async () => {
  if (USE_MOCK) {
    logMock('getAvailableMissions');
    await mockDelay(250);
    
    const available = getMockMissions().filter(m => m.status === 'available');
    return { missions: available, total: available.length };
  }
  
  const response = await apiClient.get(ENDPOINTS.available);
  return response.data;
};

/**
 * Gets completed missions
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Completed missions
 */
export const getCompletedMissions = async ({ page = 1, limit = 20 } = {}) => {
  if (USE_MOCK) {
    logMock('getCompletedMissions');
    await mockDelay(250);
    
    const completed = getMockMissions().filter(m => m.status === 'completed');
    const start = (page - 1) * limit;
    const paged = completed.slice(start, start + limit);
    
    return {
      missions: paged,
      pagination: {
        page, limit, total: completed.length,
        totalPages: Math.ceil(completed.length / limit)
      }
    };
  }
  
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
  if (USE_MOCK) {
    logMock('getRecommendedMission');
    await mockDelay(200);
    
    // Recommend first available or in-progress mission
    const missions = getMockMissions();
    const recommended = missions.find(m => m.status === 'in_progress') ||
                        missions.find(m => m.status === 'available');
    
    return {
      mission: recommended || null,
      reason: recommended?.status === 'in_progress'
        ? 'Continue where you left off'
        : 'Ready for your next challenge'
    };
  }
  
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
  if (USE_MOCK) {
    logMock(`getMission: ${missionId}`);
    await mockDelay(250);
    
    const mission = getMockMissions().find(m => m.id === missionId);
    if (!mission) throw new Error(`Mission ${missionId} not found`);
    return { ...mission };
  }
  
  const cacheKey = `mission_${missionId}`;
  
  if (useCache) {
    const cached = getCache(cacheKey, CACHE_TTL.missionDetail);
    if (cached) return cached;
  }
  
  const response = await apiClient.get(ENDPOINTS.mission(missionId));
  setCache(cacheKey, response.data);
  return response.data;
};

/**
 * Gets mission briefing
 * @param {string} missionId - Mission ID
 * @returns {Promise<Object>} Mission briefing with learning objectives
 */
export const getMissionBriefing = async (missionId) => {
  if (USE_MOCK) {
    logMock(`getMissionBriefing: ${missionId}`);
    await mockDelay(300);
    
    const mission = getMockMissions().find(m => m.id === missionId);
    if (!mission) throw new Error(`Mission ${missionId} not found`);
    
    return {
      missionId,
      title: mission.title,
      overview: `In this mission, you will explore ${mission.title.toLowerCase()}. This is part of the ${mission.adventureName} adventure, Stage ${mission.stageNumber}.`,
      learningObjectives: [
        'Understand core concepts related to this topic',
        'Apply knowledge through hands-on exercises',
        'Reflect on real-world applications',
        'Demonstrate understanding through checkpoint evaluation'
      ],
      prerequisites: mission.prerequisites,
      estimatedTime: `${mission.estimatedMinutes} minutes`,
      difficulty: mission.difficulty,
      rewards: mission.rewards,
      tips: [
        'Take notes as you progress through each bite',
        'Connect concepts to your own community context',
        'Discuss insights with your party members'
      ]
    };
  }
  
  const cacheKey = `mission_${missionId}_briefing`;
  const cached = getCache(cacheKey, CACHE_TTL.briefing);
  if (cached) return cached;
  
  const response = await apiClient.get(ENDPOINTS.missionBriefing(missionId));
  setCache(cacheKey, response.data);
  return response.data;
};

/**
 * Gets mission progress
 * @param {string} missionId - Mission ID
 * @returns {Promise<Object>} Mission progress data
 */
export const getMissionProgress = async (missionId) => {
  if (USE_MOCK) {
    logMock(`getMissionProgress: ${missionId}`);
    await mockDelay(200);
    
    const mission = getMockMissions().find(m => m.id === missionId);
    if (!mission) throw new Error(`Mission ${missionId} not found`);
    
    return mission.progress || {
      bitesCompleted: 0,
      bitesTotal: 5,
      percentage: 0,
      lastActivityAt: null,
      startedAt: null
    };
  }
  
  const response = await apiClient.get(ENDPOINTS.progress(missionId));
  return response.data;
};

/**
 * Gets mission bites (learning content)
 * @param {string} missionId - Mission ID
 * @returns {Promise<Object>} Mission bites
 */
export const getMissionBites = async (missionId) => {
  if (USE_MOCK) {
    logMock(`getMissionBites: ${missionId}`);
    await mockDelay(250);
    
    const mission = getMockMissions().find(m => m.id === missionId);
    if (!mission) throw new Error(`Mission ${missionId} not found`);
    
    return {
      missionId,
      bites: mission.bites,
      total: mission.bites.length,
      completed: mission.bites.filter(b => b.status === 'completed').length
    };
  }
  
  const response = await apiClient.get(ENDPOINTS.bites(missionId));
  return response.data;
};

// =============================================================================
// MISSION ACTIONS
// =============================================================================

/**
 * Accepts a mission
 * @param {string} missionId - Mission ID
 * @returns {Promise<Object>} Updated mission data
 */
export const acceptMission = async (missionId) => {
  missionLogger.info('Accepting mission', { missionId });
  
  if (USE_MOCK) {
    logMock(`acceptMission: ${missionId}`);
    await mockDelay(500);
    
    const missions = getMockMissions();
    const mission = missions.find(m => m.id === missionId);
    if (!mission) throw new Error(`Mission ${missionId} not found`);
    if (mission.status === 'locked') throw new Error('Mission is locked');
    
    // Update status in mock store
    mission.status = 'in_progress';
    mission.progress = {
      bitesCompleted: 0, bitesTotal: 5, percentage: 0,
      lastActivityAt: new Date().toISOString(),
      startedAt: new Date().toISOString()
    };
    
    setCurrentMission(mission);
    
    logMissionEvent('accepted', {
      missionId, stageNumber: mission.stageNumber, missionNumber: mission.missionNumber
    });
    window.dispatchEvent(new CustomEvent('mission:accepted', { detail: mission }));
    
    return { ...mission };
  }
  
  const response = await apiClient.post(ENDPOINTS.accept(missionId));
  setCurrentMission(response.data);
  invalidateMissionCache(missionId);
  
  logMissionEvent('accepted', {
    missionId,
    stageNumber: response.data.stageNumber,
    missionNumber: response.data.missionNumber
  });
  window.dispatchEvent(new CustomEvent('mission:accepted', { detail: response.data }));
  
  return response.data;
};

/**
 * Abandons a mission
 * @param {string} missionId - Mission ID
 * @param {Object} data - Abandon data
 * @returns {Promise<Object>} Updated mission data
 */
export const abandonMission = async (missionId, { reason } = {}) => {
  missionLogger.info('Abandoning mission', { missionId, reason });
  
  if (USE_MOCK) {
    logMock(`abandonMission: ${missionId}`);
    await mockDelay(400);
    
    const missions = getMockMissions();
    const mission = missions.find(m => m.id === missionId);
    if (!mission) throw new Error(`Mission ${missionId} not found`);
    
    mission.status = 'available';
    mission.progress = { bitesCompleted: 0, bitesTotal: 5, percentage: 0 };
    mission.bites.forEach(b => { b.status = 'pending'; });
    
    const current = getCurrentMission();
    if (current?.id === missionId) setCurrentMission(null);
    
    logMissionEvent('abandoned', { missionId, reason });
    window.dispatchEvent(new CustomEvent('mission:abandoned', { detail: mission }));
    
    return { ...mission };
  }
  
  const response = await apiClient.post(ENDPOINTS.abandon(missionId), { reason });
  
  const current = getCurrentMission();
  if (current?.id === missionId) setCurrentMission(null);
  
  invalidateMissionCache(missionId);
  logMissionEvent('abandoned', { missionId, reason });
  window.dispatchEvent(new CustomEvent('mission:abandoned', { detail: response.data }));
  
  return response.data;
};

/**
 * Completes a mission
 * @param {string} missionId - Mission ID
 * @returns {Promise<Object>} Completion data with rewards
 */
export const completeMission = async (missionId) => {
  missionLogger.info('Completing mission', { missionId });
  
  if (USE_MOCK) {
    logMock(`completeMission: ${missionId}`);
    await mockDelay(600);
    
    const missions = getMockMissions();
    const mission = missions.find(m => m.id === missionId);
    if (!mission) throw new Error(`Mission ${missionId} not found`);
    
    // Update status
    mission.status = 'completed';
    mission.completedAt = new Date().toISOString();
    mission.score = Math.floor(Math.random() * 15) + 85;
    mission.progress = { bitesCompleted: 5, bitesTotal: 5, percentage: 100 };
    mission.bites.forEach(b => { b.status = 'completed'; });
    
    // Unlock next mission
    const nextMission = missions.find(m =>
      m.stageNumber === mission.stageNumber && m.missionNumber === mission.missionNumber + 1
    ) || (mission.missionNumber === 5
      ? missions.find(m => m.stageNumber === mission.stageNumber + 1 && m.missionNumber === 1)
      : null
    );
    
    if (nextMission && nextMission.status === 'locked') {
      nextMission.status = 'available';
    }
    
    setCurrentMission(null);
    
    const completionData = {
      ...mission,
      rewards: mission.rewards,
      newlyUnlocked: nextMission ? nextMission.id : null,
      levelUp: false,
      newBadge: mission.rewards.badge ? {
        id: mission.rewards.badge,
        name: `Stage ${mission.stageNumber} Complete`,
        icon: '🏁'
      } : null
    };
    
    logMissionEvent('completed', {
      missionId,
      barakaEarned: mission.rewards.baraka,
      xpEarned: mission.rewards.xp,
      badgeEarned: mission.rewards.badge
    });
    window.dispatchEvent(new CustomEvent('mission:completed', { detail: completionData }));
    
    return completionData;
  }
  
  const response = await apiClient.post(ENDPOINTS.complete(missionId));
  setCurrentMission(null);
  invalidateMissionCache(missionId);
  
  logMissionEvent('completed', {
    missionId,
    barakaEarned: response.data.rewards?.baraka,
    xpEarned: response.data.rewards?.xp,
    badgeEarned: response.data.rewards?.badge
  });
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
  if (USE_MOCK) {
    logMock(`updateMissionProgress: ${missionId}`);
    await mockDelay(300);
    
    const missions = getMockMissions();
    const mission = missions.find(m => m.id === missionId);
    if (!mission) throw new Error(`Mission ${missionId} not found`);
    
    mission.progress = {
      ...mission.progress,
      ...progressData,
      lastActivityAt: new Date().toISOString()
    };
    
    // Recalculate percentage
    if (progressData.bitesCompleted !== undefined) {
      mission.progress.percentage = Math.round((progressData.bitesCompleted / mission.progress.bitesTotal) * 100);
    }
    
    const current = getCurrentMission();
    if (current?.id === missionId) {
      setCurrentMission({ ...current, progress: mission.progress });
    }
    
    logMissionEvent('progress_updated', { missionId, progress: progressData });
    
    return { ...mission.progress };
  }
  
  const response = await apiClient.patch(ENDPOINTS.progress(missionId), progressData);
  
  const current = getCurrentMission();
  if (current?.id === missionId) {
    setCurrentMission({ ...current, progress: response.data });
  }
  
  logMissionEvent('progress_updated', { missionId, progress: progressData });
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
  if (USE_MOCK) {
    logMock(`getMissionCheckpoint: ${missionId}`);
    await mockDelay(300);
    
    const mission = getMockMissions().find(m => m.id === missionId);
    
    return {
      missionId,
      type: 'quiz',
      questions: 5,
      passingScore: 70,
      timeLimit: 30 * 60, // 30 minutes in seconds
      attempts: 0,
      maxAttempts: 3,
      retryCost: 50,
      status: mission?.status === 'completed' ? 'passed' : 'not_started'
    };
  }
  
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
  
  if (USE_MOCK) {
    logMock(`startCheckpoint: ${missionId}`);
    await mockDelay(500);
    
    logMissionEvent('checkpoint_started', { missionId });
    
    return {
      sessionId: 'chk_mock_' + Date.now(),
      missionId,
      questions: [
        {
          id: 'q1', type: 'multiple_choice',
          question: 'What is the primary goal of GPS thinking?',
          options: ['Making money', 'Solving global problems', 'Getting good grades', 'Building software'],
          timeLimit: 120
        },
        {
          id: 'q2', type: 'multiple_choice',
          question: 'Which step comes first in the problem-solving process?',
          options: ['Implementation', 'Empathy & understanding', 'Testing', 'Scaling'],
          timeLimit: 120
        },
        {
          id: 'q3', type: 'short_answer',
          question: 'Describe one local challenge you have observed in your community.',
          timeLimit: 300
        },
        {
          id: 'q4', type: 'multiple_choice',
          question: 'Stakeholder interviews help with:',
          options: ['Building resumes', 'Understanding perspectives', 'Writing code', 'Fundraising'],
          timeLimit: 120
        },
        {
          id: 'q5', type: 'reflection',
          question: 'How would you apply systems thinking to a challenge you care about?',
          timeLimit: 300
        }
      ],
      startedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
    };
  }
  
  const response = await apiClient.post(`${ENDPOINTS.checkpoint(missionId)}/start`);
  logMissionEvent('checkpoint_started', { missionId });
  return response.data;
};

/**
 * Submits checkpoint evaluation
 * @param {string} missionId - Mission ID
 * @param {Object} submission - Checkpoint answers
 * @returns {Promise<Object>} Evaluation result
 */
export const submitCheckpoint = async (missionId, submission) => {
  missionLogger.info('Submitting checkpoint', { missionId });
  
  if (USE_MOCK) {
    logMock(`submitCheckpoint: ${missionId}`);
    await mockDelay(800);
    
    const score = Math.floor(Math.random() * 25) + 75; // 75-100
    const passed = score >= 70;
    
    const result = {
      sessionId: submission.sessionId || 'chk_mock_result',
      missionId, score, passed,
      maxScore: 100,
      feedback: passed
        ? 'Excellent work! You have demonstrated a strong understanding of the concepts.'
        : 'Good effort! Review the material and try again.',
      breakdown: [
        { questionId: 'q1', correct: true, score: 20, maxScore: 20 },
        { questionId: 'q2', correct: true, score: 20, maxScore: 20 },
        { questionId: 'q3', correct: score >= 80, score: Math.min(score - 40, 20), maxScore: 20 },
        { questionId: 'q4', correct: true, score: 20, maxScore: 20 },
        { questionId: 'q5', correct: score >= 90, score: Math.max(score - 80, 5), maxScore: 20 }
      ],
      completedAt: new Date().toISOString()
    };
    
    logMissionEvent('checkpoint_submitted', { missionId, passed, score });
    window.dispatchEvent(new CustomEvent('checkpoint:completed', { detail: result }));
    
    return result;
  }
  
  const response = await apiClient.post(`${ENDPOINTS.checkpoint(missionId)}/submit`, submission);
  
  logMissionEvent('checkpoint_submitted', {
    missionId,
    passed: response.data.passed,
    score: response.data.score
  });
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
 * @returns {string} Mission ID format (e.g. "S1M1")
 */
export const getMissionId = (stageNumber, missionNumber) => {
  return `S${stageNumber}M${missionNumber}`;
};

/**
 * Parses mission ID to components
 * @param {string} missionId - Mission ID
 * @returns {Object|null} Parsed { stageNumber, missionNumber }
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
 * Gets adventure for mission based on stage number
 * @param {number} stageNumber - Stage number
 * @returns {Object|null} Adventure info
 */
export const getAdventureForMission = (stageNumber) => {
  if (USE_MOCK) {
    return MOCK_ADVENTURES.find(
      a => stageNumber >= a.stageRange.start && stageNumber <= a.stageRange.end
    ) || null;
  }
  
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
 * @returns {number} Completion percentage (0-100)
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
  if (mission.stageNumber === 1 && mission.missionNumber === 1) {
    return true;
  }
  
  const prevMissionNumber = mission.missionNumber > 1
    ? mission.missionNumber - 1
    : CURRICULUM_TOTALS?.missionsPerStage || 5;
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