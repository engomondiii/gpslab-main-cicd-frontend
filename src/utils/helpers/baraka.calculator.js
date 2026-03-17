/**
 * GPS 101 Baraka Calculator
 * Calculate Baraka earnings and Orange Beacon progress
 * CORRECT STRUCTURE: 150 Checkpoints → 5,000 Baraka (Orange Beacon)
 */

import { GPS_101_STRUCTURE } from './gps101.helper';

/**
 * Baraka Distribution Constants
 * Total: 5,000 Baraka for Orange Beacon
 * 150 checkpoints × 33.33 ƀ = ~5,000 ƀ
 */
export const BARAKA_CONSTANTS = {
  TOTAL_TARGET: GPS_101_STRUCTURE.TOTAL_BARAKA, // 5,000
  TOTAL_CHECKPOINTS: GPS_101_STRUCTURE.TOTAL_CHECKPOINTS, // 150
  
  // Per checkpoint: 5000 / 150 = 33.33 (rounded to 33)
  BARAKA_PER_CHECKPOINT: 33,
  
  // Bonus Baraka
  BONUS_STAGE_COMPLETE: 100, // Bonus for completing a stage
  BONUS_MISSION_COMPLETE: 50, // Bonus for completing a mission
  BONUS_PERFECT_SUBMISSION: 10, // Bonus for perfect checkpoint submission
  BONUS_EARLY_COMPLETION: 25, // Bonus for completing ahead of schedule
  
  // Milestones
  MILESTONES: {
    25: { baraka: 1250, name: '25% Progress', bonus: 50 },
    50: { baraka: 2500, name: '50% Progress', bonus: 100 },
    75: { baraka: 3750, name: '75% Progress', bonus: 150 },
    100: { baraka: 5000, name: 'Orange Beacon', bonus: 500 }
  }
};

/**
 * Calculate Baraka for completing a checkpoint
 * @param {Object} checkpoint - Checkpoint data
 * @param {Object} options - Additional options
 * @returns {number} Baraka amount
 */
export const calculateCheckpointBaraka = (checkpoint = {}, options = {}) => {
  let baraka = BARAKA_CONSTANTS.BARAKA_PER_CHECKPOINT;
  
  // Perfect submission bonus
  if (options.isPerfect || checkpoint.score === 100) {
    baraka += BARAKA_CONSTANTS.BONUS_PERFECT_SUBMISSION;
  }
  
  // Early completion bonus
  if (options.isEarly) {
    baraka += BARAKA_CONSTANTS.BONUS_EARLY_COMPLETION;
  }
  
  return baraka;
};

/**
 * Calculate Baraka for completing a sub-mission
 * @param {Object} subMission - Sub-mission data
 * @param {Array} checkpoints - Completed checkpoints in sub-mission
 * @returns {number} Total Baraka
 */
export const calculateSubMissionBaraka = (subMission = {}, checkpoints = []) => {
  // Base Baraka from checkpoints (5 × 33 = 165)
  const checkpointBaraka = checkpoints.reduce((total, cp) => {
    return total + calculateCheckpointBaraka(cp);
  }, 0);
  
  return checkpointBaraka;
};

/**
 * Calculate Baraka for completing a mission
 * @param {Object} mission - Mission data
 * @param {Array} subMissions - Completed sub-missions
 * @returns {Object} Baraka breakdown
 */
export const calculateMissionBaraka = (mission = {}, subMissions = []) => {
  // Base Baraka from all checkpoints in mission (30 × 33 = 990)
  const baseBaraka = GPS_101_STRUCTURE.CHECKPOINTS_PER_MISSION * 
    BARAKA_CONSTANTS.BARAKA_PER_CHECKPOINT;
  
  // Mission completion bonus
  const completionBonus = BARAKA_CONSTANTS.BONUS_MISSION_COMPLETE;
  
  const total = baseBaraka + completionBonus;
  
  return {
    base: baseBaraka,
    bonus: completionBonus,
    total
  };
};

/**
 * Calculate Baraka for completing a stage
 * @param {number} stageNumber - Stage number
 * @param {Object} stageData - Stage completion data
 * @returns {Object} Baraka breakdown
 */
export const calculateStageBaraka = (stageNumber, stageData = {}) => {
  // Base Baraka from mission (30 checkpoints × 33 = 990)
  const missionBaraka = GPS_101_STRUCTURE.CHECKPOINTS_PER_MISSION * 
    BARAKA_CONSTANTS.BARAKA_PER_CHECKPOINT;
  
  // Mission completion bonus
  const missionBonus = BARAKA_CONSTANTS.BONUS_MISSION_COMPLETE;
  
  // Stage completion bonus
  const stageBonus = BARAKA_CONSTANTS.BONUS_STAGE_COMPLETE;
  
  const total = missionBaraka + missionBonus + stageBonus;
  
  return {
    mission: missionBaraka,
    missionBonus,
    stageBonus,
    total
  };
};

/**
 * Calculate total Baraka earned
 * @param {Object} progressData - User progress data
 * @returns {Object} Total Baraka breakdown
 */
export const calculateTotalBaraka = (progressData = {}) => {
  const {
    completedCheckpoints = [],
    completedSubMissions = [],
    completedStages = [],
    bonusBaraka = 0
  } = progressData;
  
  // Base Baraka from checkpoints
  const checkpointBaraka = completedCheckpoints.length * 
    BARAKA_CONSTANTS.BARAKA_PER_CHECKPOINT;
  
  // Mission completion bonuses (1 per stage)
  const missionBonuses = completedStages.length * 
    BARAKA_CONSTANTS.BONUS_MISSION_COMPLETE;
  
  // Stage completion bonuses
  const stageBonuses = completedStages.length * 
    BARAKA_CONSTANTS.BONUS_STAGE_COMPLETE;
  
  // Total
  const total = checkpointBaraka + missionBonuses + stageBonuses + bonusBaraka;
  
  return {
    checkpoints: checkpointBaraka,
    missionBonuses,
    stageBonuses,
    bonus: bonusBaraka,
    total
  };
};

/**
 * Calculate Orange Beacon progress
 * @param {number} currentBaraka - Current Baraka amount
 * @returns {Object} Orange Beacon progress
 */
export const calculateOrangeBeaconProgress = (currentBaraka = 0) => {
  const target = BARAKA_CONSTANTS.TOTAL_TARGET;
  const current = Math.min(currentBaraka, target);
  const percentage = Math.round((current / target) * 100);
  const remaining = Math.max(0, target - current);
  const earned = current >= target;
  
  return {
    current,
    target,
    remaining,
    percentage,
    earned
  };
};

/**
 * Check if milestone reached
 * @param {number} previousBaraka - Previous Baraka amount
 * @param {number} currentBaraka - Current Baraka amount
 * @returns {Object|null} Milestone info if reached
 */
export const checkMilestoneReached = (previousBaraka, currentBaraka) => {
  const previousPercentage = Math.floor((previousBaraka / BARAKA_CONSTANTS.TOTAL_TARGET) * 100);
  const currentPercentage = Math.floor((currentBaraka / BARAKA_CONSTANTS.TOTAL_TARGET) * 100);
  
  for (const [threshold, milestone] of Object.entries(BARAKA_CONSTANTS.MILESTONES)) {
    const thresholdNum = parseInt(threshold);
    if (previousPercentage < thresholdNum && currentPercentage >= thresholdNum) {
      return {
        threshold: thresholdNum,
        ...milestone,
        reached: true
      };
    }
  }
  
  return null;
};

/**
 * Get next milestone
 * @param {number} currentBaraka - Current Baraka amount
 * @returns {Object} Next milestone info
 */
export const getNextMilestone = (currentBaraka = 0) => {
  const currentPercentage = Math.floor((currentBaraka / BARAKA_CONSTANTS.TOTAL_TARGET) * 100);
  
  for (const [threshold, milestone] of Object.entries(BARAKA_CONSTANTS.MILESTONES)) {
    const thresholdNum = parseInt(threshold);
    if (currentPercentage < thresholdNum) {
      const barakaNeeded = milestone.baraka - currentBaraka;
      const checkpointsNeeded = Math.ceil(barakaNeeded / BARAKA_CONSTANTS.BARAKA_PER_CHECKPOINT);
      
      return {
        threshold: thresholdNum,
        ...milestone,
        barakaNeeded: Math.max(0, barakaNeeded),
        checkpointsNeeded: Math.max(0, checkpointsNeeded)
      };
    }
  }
  
  return {
    threshold: 100,
    name: 'All Milestones Complete',
    baraka: BARAKA_CONSTANTS.TOTAL_TARGET,
    complete: true
  };
};

/**
 * Estimate Baraka from remaining work
 * @param {Object} progressData - Current progress data
 * @returns {Object} Estimated Baraka
 */
export const estimateRemainingBaraka = (progressData = {}) => {
  const {
    completedCheckpoints = [],
    completedStages = []
  } = progressData;
  
  // Remaining checkpoints
  const remainingCheckpoints = BARAKA_CONSTANTS.TOTAL_CHECKPOINTS - 
    completedCheckpoints.length;
  const checkpointBaraka = remainingCheckpoints * 
    BARAKA_CONSTANTS.BARAKA_PER_CHECKPOINT;
  
  // Remaining stages
  const remainingStages = GPS_101_STRUCTURE.TOTAL_STAGES - completedStages.length;
  
  // Remaining mission bonuses (1 per stage)
  const missionBonuses = remainingStages * BARAKA_CONSTANTS.BONUS_MISSION_COMPLETE;
  
  // Remaining stage bonuses
  const stageBonuses = remainingStages * BARAKA_CONSTANTS.BONUS_STAGE_COMPLETE;
  
  const total = checkpointBaraka + missionBonuses + stageBonuses;
  
  return {
    checkpoints: checkpointBaraka,
    missionBonuses,
    stageBonuses,
    total,
    remainingCheckpoints,
    remainingStages
  };
};

/**
 * Calculate Baraka earning rate
 * @param {Object} progressData - Progress data with timestamps
 * @returns {Object} Earning rate metrics
 */
export const calculateBarakaRate = (progressData = {}) => {
  const {
    totalBaraka = 0,
    enrollmentDate,
    checkpointsPerWeek = 0
  } = progressData;
  
  if (!enrollmentDate) {
    return {
      barakaPerWeek: 0,
      barakaPerDay: 0,
      projectedCompletion: null
    };
  }
  
  const now = new Date();
  const enrolled = new Date(enrollmentDate);
  const weeksElapsed = Math.max(
    Math.floor((now - enrolled) / (1000 * 60 * 60 * 24 * 7)),
    1
  );
  
  // Baraka per week
  const barakaPerWeek = totalBaraka / weeksElapsed;
  const barakaPerDay = barakaPerWeek / 7;
  
  // Projected weeks to Orange Beacon
  const remaining = BARAKA_CONSTANTS.TOTAL_TARGET - totalBaraka;
  const projectedWeeks = barakaPerWeek > 0 ? Math.ceil(remaining / barakaPerWeek) : null;
  const projectedCompletion = projectedWeeks ? 
    new Date(now.getTime() + (projectedWeeks * 7 * 24 * 60 * 60 * 1000)) : null;
  
  return {
    barakaPerWeek: Math.round(barakaPerWeek),
    barakaPerDay: Math.round(barakaPerDay),
    projectedWeeks,
    projectedCompletion
  };
};

/**
 * Export all calculator functions
 */
export default {
  BARAKA_CONSTANTS,
  calculateCheckpointBaraka,
  calculateSubMissionBaraka,
  calculateMissionBaraka,
  calculateStageBaraka,
  calculateTotalBaraka,
  calculateOrangeBeaconProgress,
  checkMilestoneReached,
  getNextMilestone,
  estimateRemainingBaraka,
  calculateBarakaRate
};