/**
 * GPS Lab Platform - Progress Calculator
 * 
 * Comprehensive progress calculations for the GPS Lab MMORPG educational platform.
 * Handles mission, stage, adventure, and overall curriculum progress tracking.
 * 
 * @module utils/helpers/progress.calculator
 * @version 1.0.0
 */

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * GPS Lab curriculum structure
 */
export const CURRICULUM_STRUCTURE = {
  totalAdventures: 7,
  totalStages: 35,
  missionsPerStage: 5,
  bitesPerMission: 5,
  checkpointsPerBite: 1,
  
  // Calculated totals
  totalMissions: 175,      // 35 stages × 5 missions
  totalBites: 875,         // 175 missions × 5 bites
  totalCheckpoints: 875    // 1 checkpoint per bite
};

/**
 * Adventure definitions with stage ranges
 */
export const ADVENTURES = {
  0: {
    name: 'GPO Call',
    stages: [1],
    stageRange: { start: 1, end: 1 },
    description: 'Introduction to Global Problem Solvers',
    beaconColor: '#ef4444'  // red
  },
  1: {
    name: 'GPS 101',
    stages: [2, 3, 4, 5, 6],
    stageRange: { start: 2, end: 6 },
    description: 'Foundation of problem-solving methodology',
    beaconColor: '#f97316'  // orange
  },
  2: {
    name: 'GPS Prep',
    stages: [7, 8, 9, 10, 11],
    stageRange: { start: 7, end: 11 },
    description: 'Preparation for simulation challenges',
    beaconColor: '#eab308'  // yellow
  },
  3: {
    name: 'GPS Simulation',
    stages: [12, 13, 14, 15],
    stageRange: { start: 12, end: 15 },
    description: 'Practice with simulated real-world problems',
    beaconColor: '#22c55e'  // green
  },
  4: {
    name: 'GPS Capstone 1',
    stages: [16, 17, 18, 19, 20],
    stageRange: { start: 16, end: 20 },
    description: 'First capstone project development',
    beaconColor: '#3b82f6'  // blue
  },
  5: {
    name: 'GPS Capstone 2',
    stages: [21, 22, 23, 24, 25],
    stageRange: { start: 21, end: 25 },
    description: 'Second capstone with team collaboration',
    beaconColor: '#6366f1'  // indigo
  },
  6: {
    name: 'Venture Acceleration',
    stages: [26, 27, 28, 29, 30],
    stageRange: { start: 26, end: 30 },
    description: 'Accelerating venture development',
    beaconColor: '#8b5cf6'  // purple
  },
  7: {
    name: 'Venture Capitalization',
    stages: [31, 32, 33, 34, 35],
    stageRange: { start: 31, end: 35 },
    description: 'Final stage: venture launch and funding',
    beaconColor: '#f8fafc'  // light (rainbow)
  }
};

/**
 * Progress status types
 */
export const PROGRESS_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  LOCKED: 'locked'
};

/**
 * Recursive study loop states
 */
export const STUDY_LOOP_STATES = {
  INITIAL: 'initial',
  R2R_ACTIVE: 'r2r_active',       // Right to Retry active
  PR2R_ACTIVE: 'pr2r_active',     // Provisional R2R active
  PASSED: 'passed',
  FAILED_AWAITING_RETRY: 'failed_awaiting_retry'
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Clamps a number between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/**
 * Calculates percentage
 * @param {number} completed - Completed count
 * @param {number} total - Total count
 * @returns {number} Percentage (0-100)
 */
const calculatePercentage = (completed, total) => {
  if (total === 0) return 0;
  return clamp(Math.round((completed / total) * 100), 0, 100);
};

// =============================================================================
// STAGE AND ADVENTURE MAPPING
// =============================================================================

/**
 * Gets adventure number for a stage
 * @param {number} stageNumber - Stage number (1-35)
 * @returns {number} Adventure number (0-7)
 */
export const getAdventureForStage = (stageNumber) => {
  const stage = Number(stageNumber) || 1;
  
  for (const [adventureNum, adventure] of Object.entries(ADVENTURES)) {
    if (stage >= adventure.stageRange.start && stage <= adventure.stageRange.end) {
      return Number(adventureNum);
    }
  }
  
  return 0;
};

/**
 * Gets adventure information
 * @param {number} adventureNumber - Adventure number
 * @returns {Object} Adventure info
 */
export const getAdventureInfo = (adventureNumber) => {
  const adventure = ADVENTURES[adventureNumber];
  if (!adventure) return null;
  
  return {
    number: Number(adventureNumber),
    ...adventure,
    stageCount: adventure.stages.length,
    totalMissions: adventure.stages.length * CURRICULUM_STRUCTURE.missionsPerStage,
    totalBites: adventure.stages.length * CURRICULUM_STRUCTURE.missionsPerStage * CURRICULUM_STRUCTURE.bitesPerMission
  };
};

/**
 * Gets beacon color for a stage
 * @param {number} stageNumber - Stage number
 * @returns {string} Hex color code
 */
export const getBeaconColor = (stageNumber) => {
  const adventure = getAdventureForStage(stageNumber);
  return ADVENTURES[adventure]?.beaconColor || '#9ca3af';
};

/**
 * Gets stages for an adventure
 * @param {number} adventureNumber - Adventure number
 * @returns {number[]} Array of stage numbers
 */
export const getStagesForAdventure = (adventureNumber) => {
  const adventure = ADVENTURES[adventureNumber];
  return adventure?.stages || [];
};

// =============================================================================
// CHECKPOINT PROGRESS
// =============================================================================

/**
 * Calculates bite (sub-mission) progress
 * @param {Object} biteData - Bite completion data
 * @returns {Object} Bite progress
 */
export const calculateBiteProgress = (biteData = {}) => {
  const {
    biteId,
    isCompleted = false,
    checkpointPassed = false,
    attempts = 0,
    startedAt = null,
    completedAt = null
  } = biteData;
  
  const status = isCompleted 
    ? PROGRESS_STATUS.COMPLETED 
    : (startedAt ? PROGRESS_STATUS.IN_PROGRESS : PROGRESS_STATUS.NOT_STARTED);
  
  return {
    biteId,
    status,
    isCompleted,
    checkpointPassed,
    progress: isCompleted ? 100 : (checkpointPassed ? 50 : 0),
    attempts,
    startedAt,
    completedAt,
    duration: startedAt && completedAt 
      ? new Date(completedAt) - new Date(startedAt) 
      : null
  };
};

// =============================================================================
// MISSION PROGRESS
// =============================================================================

/**
 * Calculates mission progress
 * @param {Object} missionData - Mission data with bites
 * @returns {Object} Mission progress
 */
export const calculateMissionProgress = (missionData = {}) => {
  const {
    missionId,
    stageNumber = 1,
    missionNumber = 1,
    bites = [],
    isLocked = false
  } = missionData;
  
  const totalBites = CURRICULUM_STRUCTURE.bitesPerMission;
  const completedBites = bites.filter(b => b.isCompleted).length;
  const passedCheckpoints = bites.filter(b => b.checkpointPassed).length;
  
  let status;
  if (isLocked) {
    status = PROGRESS_STATUS.LOCKED;
  } else if (completedBites === totalBites) {
    status = PROGRESS_STATUS.COMPLETED;
  } else if (completedBites > 0 || bites.some(b => b.startedAt)) {
    status = PROGRESS_STATUS.IN_PROGRESS;
  } else {
    status = PROGRESS_STATUS.NOT_STARTED;
  }
  
  const progress = calculatePercentage(completedBites, totalBites);
  
  return {
    missionId: missionId || `S${stageNumber}M${missionNumber}`,
    stageNumber,
    missionNumber,
    status,
    progress,
    completedBites,
    totalBites,
    passedCheckpoints,
    totalCheckpoints: totalBites,
    remainingBites: totalBites - completedBites,
    isComplete: completedBites === totalBites,
    isLocked
  };
};

/**
 * Calculates mission with R2R status
 * @param {Object} missionData - Mission data
 * @param {Object} r2rData - R2R (Right to Retry) data
 * @returns {Object} Mission progress with R2R
 */
export const calculateMissionWithR2R = (missionData = {}, r2rData = {}) => {
  const mission = calculateMissionProgress(missionData);
  
  const {
    hasR2R = false,
    hasPR2R = false,
    pr2rExpiresAt = null,
    retryAttempts = 0,
    maxRetries = 3
  } = r2rData;
  
  let studyLoopState = STUDY_LOOP_STATES.INITIAL;
  
  if (mission.isComplete) {
    studyLoopState = STUDY_LOOP_STATES.PASSED;
  } else if (hasR2R) {
    studyLoopState = STUDY_LOOP_STATES.R2R_ACTIVE;
  } else if (hasPR2R) {
    studyLoopState = STUDY_LOOP_STATES.PR2R_ACTIVE;
  } else if (retryAttempts > 0) {
    studyLoopState = STUDY_LOOP_STATES.FAILED_AWAITING_RETRY;
  }
  
  const canRetry = retryAttempts < maxRetries && (hasR2R || hasPR2R);
  const pr2rExpired = hasPR2R && pr2rExpiresAt && new Date(pr2rExpiresAt) < new Date();
  
  return {
    ...mission,
    r2r: {
      hasR2R,
      hasPR2R,
      pr2rExpiresAt,
      pr2rExpired,
      retryAttempts,
      maxRetries,
      retriesRemaining: maxRetries - retryAttempts,
      canRetry: canRetry && !pr2rExpired
    },
    studyLoopState
  };
};

// =============================================================================
// STAGE PROGRESS
// =============================================================================

/**
 * Calculates stage progress
 * @param {Object} stageData - Stage data with missions
 * @returns {Object} Stage progress
 */
export const calculateStageProgress = (stageData = {}) => {
  const {
    stageNumber = 1,
    missions = [],
    isLocked = false
  } = stageData;
  
  const totalMissions = CURRICULUM_STRUCTURE.missionsPerStage;
  const missionProgress = missions.map(m => calculateMissionProgress(m));
  
  const completedMissions = missionProgress.filter(m => m.isComplete).length;
  const inProgressMissions = missionProgress.filter(m => m.status === PROGRESS_STATUS.IN_PROGRESS).length;
  
  // Calculate bite-level progress
  const totalBites = totalMissions * CURRICULUM_STRUCTURE.bitesPerMission;
  const completedBites = missionProgress.reduce((sum, m) => sum + m.completedBites, 0);
  
  // Calculate checkpoint-level progress
  const totalCheckpoints = totalBites;
  const passedCheckpoints = missionProgress.reduce((sum, m) => sum + m.passedCheckpoints, 0);
  
  let status;
  if (isLocked) {
    status = PROGRESS_STATUS.LOCKED;
  } else if (completedMissions === totalMissions) {
    status = PROGRESS_STATUS.COMPLETED;
  } else if (completedMissions > 0 || inProgressMissions > 0) {
    status = PROGRESS_STATUS.IN_PROGRESS;
  } else {
    status = PROGRESS_STATUS.NOT_STARTED;
  }
  
  const progress = calculatePercentage(completedBites, totalBites);
  const adventureNumber = getAdventureForStage(stageNumber);
  
  return {
    stageNumber,
    adventureNumber,
    beaconColor: getBeaconColor(stageNumber),
    status,
    progress,
    
    missions: {
      completed: completedMissions,
      inProgress: inProgressMissions,
      total: totalMissions,
      remaining: totalMissions - completedMissions,
      progress: calculatePercentage(completedMissions, totalMissions)
    },
    
    bites: {
      completed: completedBites,
      total: totalBites,
      remaining: totalBites - completedBites,
      progress: calculatePercentage(completedBites, totalBites)
    },
    
    checkpoints: {
      passed: passedCheckpoints,
      total: totalCheckpoints,
      remaining: totalCheckpoints - passedCheckpoints,
      progress: calculatePercentage(passedCheckpoints, totalCheckpoints)
    },
    
    isComplete: completedMissions === totalMissions,
    isLocked,
    missionProgress
  };
};

// =============================================================================
// ADVENTURE PROGRESS
// =============================================================================

/**
 * Calculates adventure progress
 * @param {Object} adventureData - Adventure data with stages
 * @returns {Object} Adventure progress
 */
export const calculateAdventureProgress = (adventureData = {}) => {
  const {
    adventureNumber = 1,
    stages = [],
    isLocked = false
  } = adventureData;
  
  const adventureInfo = getAdventureInfo(adventureNumber);
  if (!adventureInfo) {
    return { error: 'Invalid adventure number' };
  }
  
  const totalStages = adventureInfo.stageCount;
  const stageProgress = stages.map(s => calculateStageProgress(s));
  
  const completedStages = stageProgress.filter(s => s.isComplete).length;
  const inProgressStages = stageProgress.filter(s => s.status === PROGRESS_STATUS.IN_PROGRESS).length;
  
  // Aggregate mission counts
  const totalMissions = adventureInfo.totalMissions;
  const completedMissions = stageProgress.reduce((sum, s) => sum + s.missions.completed, 0);
  
  // Aggregate bite counts
  const totalBites = adventureInfo.totalBites;
  const completedBites = stageProgress.reduce((sum, s) => sum + s.bites.completed, 0);
  
  // Aggregate checkpoint counts
  const totalCheckpoints = totalBites;
  const passedCheckpoints = stageProgress.reduce((sum, s) => sum + s.checkpoints.passed, 0);
  
  let status;
  if (isLocked) {
    status = PROGRESS_STATUS.LOCKED;
  } else if (completedStages === totalStages) {
    status = PROGRESS_STATUS.COMPLETED;
  } else if (completedStages > 0 || inProgressStages > 0) {
    status = PROGRESS_STATUS.IN_PROGRESS;
  } else {
    status = PROGRESS_STATUS.NOT_STARTED;
  }
  
  const progress = calculatePercentage(completedBites, totalBites);
  
  return {
    adventureNumber,
    name: adventureInfo.name,
    description: adventureInfo.description,
    beaconColor: adventureInfo.beaconColor,
    status,
    progress,
    
    stages: {
      completed: completedStages,
      inProgress: inProgressStages,
      total: totalStages,
      remaining: totalStages - completedStages,
      progress: calculatePercentage(completedStages, totalStages)
    },
    
    missions: {
      completed: completedMissions,
      total: totalMissions,
      remaining: totalMissions - completedMissions,
      progress: calculatePercentage(completedMissions, totalMissions)
    },
    
    bites: {
      completed: completedBites,
      total: totalBites,
      remaining: totalBites - completedBites,
      progress: calculatePercentage(completedBites, totalBites)
    },
    
    checkpoints: {
      passed: passedCheckpoints,
      total: totalCheckpoints,
      remaining: totalCheckpoints - passedCheckpoints,
      progress: calculatePercentage(passedCheckpoints, totalCheckpoints)
    },
    
    isComplete: completedStages === totalStages,
    isLocked,
    stageProgress
  };
};

// =============================================================================
// OVERALL CURRICULUM PROGRESS
// =============================================================================

/**
 * Calculates overall curriculum progress
 * @param {Object} userData - User's progress data
 * @returns {Object} Overall progress
 */
export const calculateOverallProgress = (userData = {}) => {
  const { adventures = [] } = userData;
  
  const adventureProgress = [];
  let totalCompletedStages = 0;
  let totalCompletedMissions = 0;
  let totalCompletedBites = 0;
  let totalPassedCheckpoints = 0;
  
  for (let i = 0; i <= 7; i++) {
    const adventureData = adventures.find(a => a.adventureNumber === i) || { adventureNumber: i, stages: [] };
    const progress = calculateAdventureProgress(adventureData);
    adventureProgress.push(progress);
    
    totalCompletedStages += progress.stages?.completed || 0;
    totalCompletedMissions += progress.missions?.completed || 0;
    totalCompletedBites += progress.bites?.completed || 0;
    totalPassedCheckpoints += progress.checkpoints?.passed || 0;
  }
  
  const structure = CURRICULUM_STRUCTURE;
  const overallProgress = calculatePercentage(totalCompletedBites, structure.totalBites);
  
  // Determine current position
  const currentAdventure = adventureProgress.find(a => a.status === PROGRESS_STATUS.IN_PROGRESS) 
    || adventureProgress.find(a => a.status === PROGRESS_STATUS.NOT_STARTED);
  
  const currentStage = currentAdventure?.stageProgress?.find(s => s.status === PROGRESS_STATUS.IN_PROGRESS)
    || currentAdventure?.stageProgress?.find(s => s.status === PROGRESS_STATUS.NOT_STARTED);
  
  return {
    overallProgress,
    
    stages: {
      completed: totalCompletedStages,
      total: structure.totalStages,
      remaining: structure.totalStages - totalCompletedStages,
      progress: calculatePercentage(totalCompletedStages, structure.totalStages)
    },
    
    missions: {
      completed: totalCompletedMissions,
      total: structure.totalMissions,
      remaining: structure.totalMissions - totalCompletedMissions,
      progress: calculatePercentage(totalCompletedMissions, structure.totalMissions)
    },
    
    bites: {
      completed: totalCompletedBites,
      total: structure.totalBites,
      remaining: structure.totalBites - totalCompletedBites,
      progress: calculatePercentage(totalCompletedBites, structure.totalBites)
    },
    
    checkpoints: {
      passed: totalPassedCheckpoints,
      total: structure.totalCheckpoints,
      remaining: structure.totalCheckpoints - totalPassedCheckpoints,
      progress: calculatePercentage(totalPassedCheckpoints, structure.totalCheckpoints)
    },
    
    currentPosition: {
      adventureNumber: currentAdventure?.adventureNumber || 0,
      adventureName: currentAdventure?.name || 'GPO Call',
      stageNumber: currentStage?.stageNumber || 1
    },
    
    adventureProgress,
    isComplete: totalCompletedStages === structure.totalStages
  };
};

// =============================================================================
// PROGRESS PROJECTIONS
// =============================================================================

/**
 * Estimates time to completion
 * @param {Object} progressData - Current progress
 * @param {number} averageDailyProgress - Average bites per day
 * @returns {Object} Time estimation
 */
export const estimateTimeToCompletion = (progressData, averageDailyProgress = 5) => {
  const remaining = progressData?.bites?.remaining || 0;
  const dailyRate = Number(averageDailyProgress) || 5;
  
  const daysNeeded = Math.ceil(remaining / dailyRate);
  const completionDate = new Date(Date.now() + daysNeeded * 24 * 60 * 60 * 1000);
  
  return {
    bitesRemaining: remaining,
    dailyRate,
    daysNeeded,
    weeksNeeded: Math.ceil(daysNeeded / 7),
    monthsNeeded: Math.ceil(daysNeeded / 30),
    estimatedCompletion: completionDate,
    estimatedCompletionISO: completionDate.toISOString()
  };
};

/**
 * Gets next milestone
 * @param {Object} progressData - Current progress
 * @returns {Object} Next milestone info
 */
export const getNextMilestone = (progressData) => {
  const { currentPosition, adventureProgress } = progressData || {};
  
  if (!currentPosition) {
    return { type: 'start', message: 'Begin your GPS journey!' };
  }
  
  const currentAdventure = adventureProgress?.find(a => a.adventureNumber === currentPosition.adventureNumber);
  const currentStage = currentAdventure?.stageProgress?.find(s => s.stageNumber === currentPosition.stageNumber);
  
  // Check for mission completion
  const currentMission = currentStage?.missionProgress?.find(m => m.status === PROGRESS_STATUS.IN_PROGRESS);
  if (currentMission && currentMission.remainingBites <= 2) {
    return {
      type: 'mission',
      message: `Complete Mission ${currentMission.missionNumber}`,
      remaining: currentMission.remainingBites,
      reward: 'Mission completion bonus'
    };
  }
  
  // Check for stage completion
  if (currentStage && currentStage.missions.remaining <= 1) {
    return {
      type: 'stage',
      message: `Complete Stage ${currentStage.stageNumber}`,
      remaining: currentStage.missions.remaining,
      reward: 'Stage completion bonus'
    };
  }
  
  // Check for adventure completion
  if (currentAdventure && currentAdventure.stages.remaining <= 1) {
    return {
      type: 'adventure',
      message: `Complete ${currentAdventure.name}`,
      remaining: currentAdventure.stages.remaining,
      reward: 'Adventure completion bonus'
    };
  }
  
  // Default to next bite
  return {
    type: 'bite',
    message: 'Complete the next checkpoint',
    remaining: 1,
    reward: 'Checkpoint XP'
  };
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Constants
  CURRICULUM_STRUCTURE,
  ADVENTURES,
  PROGRESS_STATUS,
  STUDY_LOOP_STATES,
  
  // Mapping
  getAdventureForStage,
  getAdventureInfo,
  getBeaconColor,
  getStagesForAdventure,
  
  // Progress calculations
  calculateBiteProgress,
  calculateMissionProgress,
  calculateMissionWithR2R,
  calculateStageProgress,
  calculateAdventureProgress,
  calculateOverallProgress,
  
  // Projections
  estimateTimeToCompletion,
  getNextMilestone
};