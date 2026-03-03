/**
 * Missions Constants
 * 
 * Mission definitions for all GPS courses.
 */

import { GPS_101_ALL_MISSIONS } from './gps101.constants';

// ==================== GPO CALL MISSIONS ====================

// Stage -4 Missions
export const GPO_STAGE_N4_MISSIONS = [
  {
    missionId: 'GPO_N4_M1',
    stageNumber: -4,
    stageName: 'Stage -4',
    missionNumber: 1,
    title: 'Identify the Global Problem',
    description: 'Choose a global problem that resonates with you',
    objectives: ['Research global problems', 'Select your focus problem'],
    courseCode: 'GPO_CALL'
  },
  {
    missionId: 'GPO_N4_M2',
    stageNumber: -4,
    stageName: 'Stage -4',
    missionNumber: 2,
    title: 'Research the Problem',
    description: 'Deep dive into your chosen problem',
    objectives: ['Conduct research', 'Understand scope and impact'],
    courseCode: 'GPO_CALL'
  },
  {
    missionId: 'GPO_N4_M3',
    stageNumber: -4,
    stageName: 'Stage -4',
    missionNumber: 3,
    title: 'Analyze Root Causes',
    description: 'Identify the root causes of the problem',
    objectives: ['Root cause analysis', 'Map cause-effect relationships'],
    courseCode: 'GPO_CALL'
  },
  {
    missionId: 'GPO_N4_M4',
    stageNumber: -4,
    stageName: 'Stage -4',
    missionNumber: 4,
    title: 'Define Problem Statement',
    description: 'Create a clear, concise problem statement',
    objectives: ['Write problem statement', 'Get feedback'],
    courseCode: 'GPO_CALL'
  },
  {
    missionId: 'GPO_N4_M5',
    stageNumber: -4,
    stageName: 'Stage -4',
    missionNumber: 5,
    title: 'Validate Problem Significance',
    description: 'Validate the importance of your problem',
    objectives: ['Gather evidence', 'Confirm significance'],
    courseCode: 'GPO_CALL'
  }
];

// Additional GPO missions for stages -3, -2, -1, 0 would follow similar pattern
// Omitted for brevity, but structure is identical

// ==================== GPS 101 MISSIONS ====================

// Already imported from gps101.constants.js
export const GPS_101_MISSIONS = GPS_101_ALL_MISSIONS;

// ==================== GPS PREP MISSIONS ====================

// Stage 6 Missions (example structure)
export const GPS_PREP_STAGE_6_MISSIONS = [
  {
    missionId: 'GPS_PREP_S6_M1',
    stageNumber: 6,
    stageName: 'Stage 6',
    missionNumber: 1,
    title: 'Problem Definition Workshop',
    description: 'Define your problem with precision',
    objectives: ['Refine problem statement', 'Identify stakeholders'],
    courseCode: 'GPS_PREP'
  },
  // Additional missions...
];

// ==================== MISSION CATEGORIES ====================

export const MISSION_CATEGORIES = {
  STUDY: 'study',
  SOLO: 'solo',
  TEAM: 'team',
  ADVENTURE: 'adventure',
  SPECIAL: 'special'
};

// ==================== MISSION TYPES ====================

export const MISSION_TYPES = {
  LEARNING: 'learning',
  PRACTICE: 'practice',
  PROJECT: 'project',
  REFLECTION: 'reflection',
  RESEARCH: 'research',
  CREATIVE: 'creative',
  PRESENTATION: 'presentation'
};

// ==================== MISSION DIFFICULTY ====================

export const MISSION_DIFFICULTY = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert'
};

// ==================== MISSION STATUS ====================

export const MISSION_STATUS = {
  LOCKED: 'locked',
  UNLOCKED: 'unlocked',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  ARCHIVED: 'archived'
};

// ==================== MISSION ICONS ====================

export const MISSION_ICONS = {
  learning: '📚',
  practice: '🔨',
  project: '🚀',
  reflection: '🤔',
  research: '🔍',
  creative: '🎨',
  presentation: '🎤'
};

// ==================== ALL MISSIONS ====================

export const ALL_MISSIONS = [
  ...GPO_STAGE_N4_MISSIONS,
  ...GPS_101_MISSIONS,
  // Additional mission arrays would be spread here
];

// ==================== HELPER FUNCTIONS ====================

/**
 * Get mission by ID
 */
export const getMissionById = (missionId) => {
  return ALL_MISSIONS.find(mission => mission.missionId === missionId);
};

/**
 * Get missions by stage number
 */
export const getMissionsByStage = (stageNumber) => {
  return ALL_MISSIONS.filter(mission => mission.stageNumber === stageNumber);
};

/**
 * Get missions by course code
 */
export const getMissionsByCourse = (courseCode) => {
  return ALL_MISSIONS.filter(mission => mission.courseCode === courseCode);
};

/**
 * Get GPS 101 missions
 */
export const getGPS101Missions = () => {
  return GPS_101_MISSIONS;
};

/**
 * Get mission count by course
 */
export const getMissionCountByCourse = (courseCode) => {
  return getMissionsByCourse(courseCode).length;
};

/**
 * Check if mission is GPS 101
 */
export const isGPS101Mission = (missionId) => {
  return missionId.startsWith('GPS101_');
};

/**
 * Check if mission is GPO Call
 */
export const isGPOCallMission = (missionId) => {
  return missionId.startsWith('GPO_');
};

/**
 * Get mission icon
 */
export const getMissionIcon = (missionType) => {
  return MISSION_ICONS[missionType] || '📝';
};

// Export default
export default {
  GPO_STAGE_N4_MISSIONS,
  GPS_101_MISSIONS,
  GPS_PREP_STAGE_6_MISSIONS,
  MISSION_CATEGORIES,
  MISSION_TYPES,
  MISSION_DIFFICULTY,
  MISSION_STATUS,
  MISSION_ICONS,
  ALL_MISSIONS,
  getMissionById,
  getMissionsByStage,
  getMissionsByCourse,
  getGPS101Missions,
  getMissionCountByCourse,
  isGPS101Mission,
  isGPOCallMission,
  getMissionIcon
};