/**
 * GPS 101 Helper Functions
 * 
 * Utility functions specific to GPS 101 Basic course.
 */

import { GPS_101_CONFIG } from '../../config/gps101.config';
import { GPS_101_ALL_MISSIONS, GPS_101_REWARDS } from '../constants/gps101.constants';

/**
 * Get stage by number
 */
export const getStageByNumber = (stageNumber) => {
  return GPS_101_CONFIG.STAGES.find(stage => stage.stageNumber === stageNumber);
};

/**
 * Get missions by stage number
 */
export const getMissionsByStage = (stageNumber) => {
  return GPS_101_ALL_MISSIONS.filter(mission => mission.stageNumber === stageNumber);
};

/**
 * Get mission by ID
 */
export const getMissionById = (missionId) => {
  return GPS_101_ALL_MISSIONS.find(mission => mission.missionId === missionId);
};

/**
 * Get checkpoint by ID
 */
export const getCheckpointById = (checkpointId) => {
  for (const mission of GPS_101_ALL_MISSIONS) {
    const checkpoint = mission.checkpoints.find(cp => cp.checkpointId === checkpointId);
    if (checkpoint) {
      return { ...checkpoint, missionId: mission.missionId };
    }
  }
  return null;
};

/**
 * Get deliverable configuration by ID
 */
export const getDeliverableById = (deliverableId) => {
  return GPS_101_CONFIG.DELIVERABLES.find(d => d.id === deliverableId);
};

/**
 * Get deliverable by stage number
 */
export const getDeliverableByStage = (stageNumber) => {
  const stage = getStageByNumber(stageNumber);
  if (!stage) return null;
  
  return GPS_101_CONFIG.DELIVERABLES.find(d => d.id === stage.deliverable);
};

/**
 * Calculate total Baraka for GPS 101
 */
export const calculateTotalBaraka = (completedCheckpoints, completedMissions, completedStages) => {
  const checkpointBaraka = completedCheckpoints * GPS_101_REWARDS.CHECKPOINT_PASS;
  const missionBaraka = completedMissions * GPS_101_REWARDS.MISSION_COMPLETE;
  const stageBaraka = completedStages * GPS_101_REWARDS.STAGE_COMPLETE;
  
  return checkpointBaraka + missionBaraka + stageBaraka;
};

/**
 * Calculate total XP for GPS 101
 */
export const calculateTotalXP = (completedCheckpoints, completedMissions, completedStages) => {
  const checkpointXP = completedCheckpoints * GPS_101_REWARDS.XP_PER_CHECKPOINT;
  const missionXP = completedMissions * GPS_101_REWARDS.XP_PER_MISSION;
  const stageXP = completedStages * GPS_101_REWARDS.XP_PER_STAGE;
  
  return checkpointXP + missionXP + stageXP;
};

/**
 * Calculate completion percentage
 */
export const calculateCompletionPercentage = (completed, total) => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

/**
 * Calculate stage completion percentage
 */
export const calculateStageCompletion = (stageNumber, completedMissions) => {
  const stageMissions = getMissionsByStage(stageNumber);
  const totalMissions = stageMissions.length;
  const completed = stageMissions.filter(mission => 
    completedMissions.includes(mission.missionId)
  ).length;
  
  return calculateCompletionPercentage(completed, totalMissions);
};

/**
 * Calculate mission completion percentage
 */
export const calculateMissionCompletion = (missionId, passedCheckpoints) => {
  const mission = getMissionById(missionId);
  if (!mission) return 0;
  
  const totalCheckpoints = mission.checkpoints.length;
  const passed = mission.checkpoints.filter(cp => 
    passedCheckpoints.includes(cp.checkpointId)
  ).length;
  
  return calculateCompletionPercentage(passed, totalCheckpoints);
};

/**
 * Check if stage is completed
 */
export const isStageCompleted = (stageNumber, completedMissions) => {
  const stageMissions = getMissionsByStage(stageNumber);
  return stageMissions.every(mission => 
    completedMissions.includes(mission.missionId)
  );
};

/**
 * Check if mission is completed
 */
export const isMissionCompleted = (missionId, passedCheckpoints) => {
  const mission = getMissionById(missionId);
  if (!mission) return false;
  
  return mission.checkpoints.every(cp => 
    passedCheckpoints.includes(cp.checkpointId)
  );
};

/**
 * Get next uncompleted stage
 */
export const getNextUncompletedStage = (completedStages) => {
  for (let i = 1; i <= GPS_101_CONFIG.TOTAL_STAGES; i++) {
    if (!completedStages.includes(i)) {
      return getStageByNumber(i);
    }
  }
  return null;
};

/**
 * Get next uncompleted mission
 */
export const getNextUncompletedMission = (completedMissions) => {
  for (const mission of GPS_101_ALL_MISSIONS) {
    if (!completedMissions.includes(mission.missionId)) {
      return mission;
    }
  }
  return null;
};

/**
 * Get next uncompleted checkpoint in mission
 */
export const getNextUncompletedCheckpoint = (missionId, passedCheckpoints) => {
  const mission = getMissionById(missionId);
  if (!mission) return null;
  
  for (const checkpoint of mission.checkpoints) {
    if (!passedCheckpoints.includes(checkpoint.checkpointId)) {
      return checkpoint;
    }
  }
  return null;
};

/**
 * Check if Orange Beacon is earned
 */
export const hasEarnedOrangeBeacon = (totalBaraka) => {
  return totalBaraka >= GPS_101_CONFIG.TOTAL_BARAKA;
};

/**
 * Calculate progress to Orange Beacon
 */
export const calculateOrangeBeaconProgress = (totalBaraka) => {
  const percentage = calculateCompletionPercentage(
    totalBaraka, 
    GPS_101_CONFIG.TOTAL_BARAKA
  );
  
  return {
    current: totalBaraka,
    target: GPS_101_CONFIG.TOTAL_BARAKA,
    remaining: Math.max(0, GPS_101_CONFIG.TOTAL_BARAKA - totalBaraka),
    percentage
  };
};

/**
 * Get earned stage badges
 */
export const getEarnedStageBadges = (completedStages) => {
  return completedStages.map(stageNumber => `gps-101-stage-${stageNumber}`);
};

/**
 * Check if GPS 101 is completed
 */
export const isGPS101Completed = (completedMissions) => {
  return completedMissions.length === GPS_101_CONFIG.TOTAL_MISSIONS;
};

/**
 * Calculate weeks elapsed
 */
export const calculateWeeksElapsed = (enrollmentDate) => {
  if (!enrollmentDate) return 0;
  
  const now = new Date();
  const enrolled = new Date(enrollmentDate);
  const diffTime = Math.abs(now - enrolled);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.floor(diffDays / 7);
};

/**
 * Calculate weeks remaining
 */
export const calculateWeeksRemaining = (enrollmentDate) => {
  const weeksElapsed = calculateWeeksElapsed(enrollmentDate);
  return Math.max(0, GPS_101_CONFIG.DURATION_WEEKS - weeksElapsed);
};

/**
 * Check if on track (based on timeline)
 */
export const isOnTrack = (completedMissions, enrollmentDate) => {
  const weeksElapsed = calculateWeeksElapsed(enrollmentDate);
  const expectedMissions = Math.floor(weeksElapsed * 2); // ~2 missions per week
  
  return completedMissions.length >= expectedMissions;
};

/**
 * Get stage deliverable status
 */
export const getStageDeliverableStatus = (stageNumber, deliverables) => {
  const stage = getStageByNumber(stageNumber);
  if (!stage) return null;
  
  const deliverableId = stage.deliverable;
  const deliverable = deliverables[deliverableId];
  
  return {
    id: deliverableId,
    name: stage.deliverable,
    completed: !!deliverable,
    data: deliverable
  };
};

/**
 * Validate deliverable data
 */
export const validateDeliverableData = (deliverableId, data) => {
  const config = getDeliverableById(deliverableId);
  if (!config) return { valid: false, errors: ['Invalid deliverable ID'] };
  
  const errors = [];
  
  switch (config.type) {
    case 'text':
      if (!data || typeof data !== 'string') {
        errors.push('Deliverable must be text');
      } else if (data.length < config.minLength) {
        errors.push(`Minimum length is ${config.minLength} characters`);
      } else if (data.length > config.maxLength) {
        errors.push(`Maximum length is ${config.maxLength} characters`);
      }
      break;
      
    case 'list':
      if (!Array.isArray(data)) {
        errors.push('Deliverable must be a list');
      } else if (data.length < config.minItems) {
        errors.push(`Minimum ${config.minItems} items required`);
      } else if (data.length > config.maxItems) {
        errors.push(`Maximum ${config.maxItems} items allowed`);
      }
      break;
      
    case 'narrative':
      if (!data || typeof data !== 'string') {
        errors.push('Deliverable must be a narrative');
      } else if (data.length < config.minLength) {
        errors.push(`Minimum length is ${config.minLength} characters`);
      } else if (data.length > config.maxLength) {
        errors.push(`Maximum length is ${config.maxLength} characters`);
      }
      break;
      
    case 'project':
      if (!data || typeof data !== 'object') {
        errors.push('Deliverable must be an object');
      } else {
        config.requiredFields.forEach(field => {
          if (!data[field]) {
            errors.push(`Required field missing: ${field}`);
          }
        });
      }
      break;
      
    default:
      errors.push('Unknown deliverable type');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Format checkpoint question for display
 */
export const formatCheckpointQuestion = (checkpoint, language = 'en') => {
  if (language === 'ko' && checkpoint.questionKo) {
    return checkpoint.questionKo;
  }
  return checkpoint.question;
};

/**
 * Get checkpoint submission requirements
 */
export const getCheckpointRequirements = (checkpoint) => {
  return {
    type: checkpoint.type,
    minLength: checkpoint.minLength || 100,
    maxLength: checkpoint.maxLength || 5000,
    requiresUpload: checkpoint.requiresUpload || false,
    requiresVideo: checkpoint.requiresVideo || false
  };
};

/**
 * Calculate estimated time remaining
 */
export const calculateEstimatedTimeRemaining = (completedMissions) => {
  const remainingMissions = GPS_101_CONFIG.TOTAL_MISSIONS - completedMissions.length;
  const estimatedWeeks = Math.ceil(remainingMissions / 2); // ~2 missions per week
  
  return {
    missions: remainingMissions,
    weeks: estimatedWeeks,
    days: estimatedWeeks * 7
  };
};

/**
 * Get GPS 101 summary statistics
 */
export const getGPS101Summary = (userData) => {
  const {
    completedStages = [],
    completedMissions = [],
    passedCheckpoints = [],
    totalBaraka = 0,
    totalXP = 0,
    enrollmentDate = null
  } = userData;
  
  return {
    stages: {
      completed: completedStages.length,
      total: GPS_101_CONFIG.TOTAL_STAGES,
      percentage: calculateCompletionPercentage(
        completedStages.length,
        GPS_101_CONFIG.TOTAL_STAGES
      )
    },
    missions: {
      completed: completedMissions.length,
      total: GPS_101_CONFIG.TOTAL_MISSIONS,
      percentage: calculateCompletionPercentage(
        completedMissions.length,
        GPS_101_CONFIG.TOTAL_MISSIONS
      )
    },
    checkpoints: {
      completed: passedCheckpoints.length,
      total: GPS_101_CONFIG.TOTAL_CHECKPOINTS,
      percentage: calculateCompletionPercentage(
        passedCheckpoints.length,
        GPS_101_CONFIG.TOTAL_CHECKPOINTS
      )
    },
    rewards: {
      baraka: totalBaraka,
      xp: totalXP,
      orangeBeacon: hasEarnedOrangeBeacon(totalBaraka)
    },
    timeline: {
      weeksElapsed: calculateWeeksElapsed(enrollmentDate),
      weeksRemaining: calculateWeeksRemaining(enrollmentDate),
      onTrack: isOnTrack(completedMissions, enrollmentDate)
    },
    isCompleted: isGPS101Completed(completedMissions)
  };
};

/**
 * Export all helper functions
 */
export default {
  getStageByNumber,
  getMissionsByStage,
  getMissionById,
  getCheckpointById,
  getDeliverableById,
  getDeliverableByStage,
  calculateTotalBaraka,
  calculateTotalXP,
  calculateCompletionPercentage,
  calculateStageCompletion,
  calculateMissionCompletion,
  isStageCompleted,
  isMissionCompleted,
  getNextUncompletedStage,
  getNextUncompletedMission,
  getNextUncompletedCheckpoint,
  hasEarnedOrangeBeacon,
  calculateOrangeBeaconProgress,
  getEarnedStageBadges,
  isGPS101Completed,
  calculateWeeksElapsed,
  calculateWeeksRemaining,
  isOnTrack,
  getStageDeliverableStatus,
  validateDeliverableData,
  formatCheckpointQuestion,
  getCheckpointRequirements,
  calculateEstimatedTimeRemaining,
  getGPS101Summary
};