/**
 * GPS 101 Progress Calculator
 * Calculate progress metrics for GPS 101 journey
 * CORRECT STRUCTURE: 5 Stages, 5 Missions, 30 Sub-missions, 150 Checkpoints
 */

import { GPS_101_STRUCTURE } from './gps101.helper';

/**
 * Calculate stage progress
 * @param {number} stageNumber - Stage number (1-5)
 * @param {Array} completedSubMissions - Array of completed sub-mission IDs
 * @returns {Object} Stage progress metrics
 */
export const calculateStageProgress = (stageNumber, completedSubMissions = []) => {
  const totalSubMissions = GPS_101_STRUCTURE.SUB_MISSIONS_PER_MISSION;
  
  // Count completed sub-missions for this stage
  const stagePrefix = `gps101-stage-${stageNumber}`;
  const completed = completedSubMissions.filter(id => 
    id.startsWith(stagePrefix)
  ).length;
  
  const percentage = Math.round((completed / totalSubMissions) * 100);
  
  return {
    stageNumber,
    completed,
    total: totalSubMissions,
    remaining: totalSubMissions - completed,
    percentage,
    isComplete: percentage === 100
  };
};

/**
 * Calculate mission progress
 * @param {string} missionId - Mission ID
 * @param {Array} completedCheckpoints - Array of completed checkpoint IDs
 * @returns {Object} Mission progress metrics
 */
export const calculateMissionProgress = (missionId, completedCheckpoints = []) => {
  const totalCheckpoints = GPS_101_STRUCTURE.CHECKPOINTS_PER_MISSION;
  
  // Count completed checkpoints for this mission
  const completed = completedCheckpoints.filter(id => 
    id.startsWith(missionId)
  ).length;
  
  const percentage = Math.round((completed / totalCheckpoints) * 100);
  
  return {
    missionId,
    completed,
    total: totalCheckpoints,
    remaining: totalCheckpoints - completed,
    percentage,
    isComplete: percentage === 100
  };
};

/**
 * Calculate sub-mission progress
 * @param {string} subMissionId - Sub-mission ID
 * @param {Array} completedCheckpoints - Array of completed checkpoint IDs
 * @returns {Object} Sub-mission progress metrics
 */
export const calculateSubMissionProgress = (subMissionId, completedCheckpoints = []) => {
  const totalCheckpoints = GPS_101_STRUCTURE.CHECKPOINTS_PER_SUB_MISSION;
  
  // Count completed checkpoints for this sub-mission
  const completed = completedCheckpoints.filter(id => 
    id.startsWith(subMissionId)
  ).length;
  
  const percentage = Math.round((completed / totalCheckpoints) * 100);
  
  return {
    subMissionId,
    completed,
    total: totalCheckpoints,
    remaining: totalCheckpoints - completed,
    percentage,
    isComplete: percentage === 100
  };
};

/**
 * Calculate overall GPS 101 progress
 * @param {Object} userData - User progress data
 * @returns {Object} Overall progress metrics
 */
export const calculateOverallProgress = (userData = {}) => {
  const {
    completedStages = [],
    completedSubMissions = [],
    completedCheckpoints = [],
    totalBaraka = 0
  } = userData;
  
  // Stage progress
  const stagesCompleted = completedStages.length;
  const stagesTotal = GPS_101_STRUCTURE.TOTAL_STAGES;
  const stagesPercentage = Math.round((stagesCompleted / stagesTotal) * 100);
  
  // Mission progress (1 per stage)
  const missionsCompleted = completedStages.length;
  const missionsTotal = GPS_101_STRUCTURE.TOTAL_MISSIONS;
  const missionsPercentage = Math.round((missionsCompleted / missionsTotal) * 100);
  
  // Sub-mission progress
  const subMissionsCompleted = completedSubMissions.length;
  const subMissionsTotal = GPS_101_STRUCTURE.TOTAL_SUB_MISSIONS;
  const subMissionsPercentage = Math.round((subMissionsCompleted / subMissionsTotal) * 100);
  
  // Checkpoint progress
  const checkpointsCompleted = completedCheckpoints.length;
  const checkpointsTotal = GPS_101_STRUCTURE.TOTAL_CHECKPOINTS;
  const checkpointsPercentage = Math.round((checkpointsCompleted / checkpointsTotal) * 100);
  
  // Orange Beacon progress
  const orangeBeaconPercentage = Math.round((totalBaraka / GPS_101_STRUCTURE.TOTAL_BARAKA) * 100);
  
  // Overall progress (based on checkpoints as the finest granularity)
  const overallPercentage = checkpointsPercentage;
  
  return {
    stages: {
      completed: stagesCompleted,
      total: stagesTotal,
      remaining: stagesTotal - stagesCompleted,
      percentage: stagesPercentage
    },
    missions: {
      completed: missionsCompleted,
      total: missionsTotal,
      remaining: missionsTotal - missionsCompleted,
      percentage: missionsPercentage
    },
    subMissions: {
      completed: subMissionsCompleted,
      total: subMissionsTotal,
      remaining: subMissionsTotal - subMissionsCompleted,
      percentage: subMissionsPercentage
    },
    checkpoints: {
      completed: checkpointsCompleted,
      total: checkpointsTotal,
      remaining: checkpointsTotal - checkpointsCompleted,
      percentage: checkpointsPercentage
    },
    orangeBeacon: {
      baraka: totalBaraka,
      target: GPS_101_STRUCTURE.TOTAL_BARAKA,
      remaining: Math.max(0, GPS_101_STRUCTURE.TOTAL_BARAKA - totalBaraka),
      percentage: orangeBeaconPercentage,
      earned: totalBaraka >= GPS_101_STRUCTURE.TOTAL_BARAKA
    },
    overall: {
      percentage: overallPercentage,
      isComplete: overallPercentage === 100
    }
  };
};

/**
 * Calculate time-based progress
 * @param {Date|string} enrollmentDate - Date of enrollment
 * @param {Object} progressData - Current progress data
 * @returns {Object} Time-based progress metrics
 */
export const calculateTimeProgress = (enrollmentDate, progressData = {}) => {
  if (!enrollmentDate) {
    return {
      weeksElapsed: 0,
      weeksRemaining: GPS_101_STRUCTURE.DURATION_WEEKS,
      expectedProgress: 0,
      actualProgress: 0,
      isOnTrack: false,
      timePercentage: 0
    };
  }
  
  const now = new Date();
  const enrolled = new Date(enrollmentDate);
  const diffTime = Math.abs(now - enrolled);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const weeksElapsed = Math.floor(diffDays / 7);
  const weeksRemaining = Math.max(0, GPS_101_STRUCTURE.DURATION_WEEKS - weeksElapsed);
  
  // Expected progress: ~2 sub-missions per week
  const expectedSubMissions = Math.min(
    Math.floor(weeksElapsed * 2),
    GPS_101_STRUCTURE.TOTAL_SUB_MISSIONS
  );
  
  const actualSubMissions = progressData.completedSubMissions?.length || 0;
  
  // Time percentage
  const timePercentage = Math.min(
    Math.round((weeksElapsed / GPS_101_STRUCTURE.DURATION_WEEKS) * 100),
    100
  );
  
  // Expected overall percentage
  const expectedPercentage = Math.min(
    Math.round((expectedSubMissions / GPS_101_STRUCTURE.TOTAL_SUB_MISSIONS) * 100),
    100
  );
  
  // Actual overall percentage
  const actualPercentage = Math.round(
    (actualSubMissions / GPS_101_STRUCTURE.TOTAL_SUB_MISSIONS) * 100
  );
  
  // On track if actual >= expected
  const isOnTrack = actualSubMissions >= expectedSubMissions;
  
  return {
    weeksElapsed,
    weeksRemaining,
    expectedSubMissions,
    actualSubMissions,
    expectedPercentage,
    actualPercentage,
    isOnTrack,
    timePercentage,
    daysElapsed: diffDays,
    daysRemaining: Math.max(0, (GPS_101_STRUCTURE.DURATION_WEEKS * 7) - diffDays)
  };
};

/**
 * Calculate estimated completion date
 * @param {Date|string} enrollmentDate - Date of enrollment
 * @param {Object} progressData - Current progress data
 * @returns {Object} Estimated completion metrics
 */
export const calculateEstimatedCompletion = (enrollmentDate, progressData = {}) => {
  if (!enrollmentDate) {
    return {
      estimatedDate: null,
      estimatedWeeks: GPS_101_STRUCTURE.DURATION_WEEKS,
      estimatedDays: GPS_101_STRUCTURE.DURATION_WEEKS * 7
    };
  }
  
  const timeProgress = calculateTimeProgress(enrollmentDate, progressData);
  const remainingSubMissions = GPS_101_STRUCTURE.TOTAL_SUB_MISSIONS - 
    (progressData.completedSubMissions?.length || 0);
  
  // Calculate current pace (sub-missions per week)
  const currentPace = timeProgress.weeksElapsed > 0 
    ? timeProgress.actualSubMissions / timeProgress.weeksElapsed 
    : 2; // Default to expected pace
  
  // Estimate weeks to complete remaining sub-missions
  const estimatedWeeks = currentPace > 0 
    ? Math.ceil(remainingSubMissions / currentPace) 
    : timeProgress.weeksRemaining;
  
  // Calculate estimated completion date
  const enrolled = new Date(enrollmentDate);
  const estimatedDate = new Date(enrolled);
  estimatedDate.setDate(estimatedDate.getDate() + ((timeProgress.weeksElapsed + estimatedWeeks) * 7));
  
  return {
    estimatedDate,
    estimatedWeeks,
    estimatedDays: estimatedWeeks * 7,
    currentPace: currentPace.toFixed(2),
    remainingSubMissions
  };
};

/**
 * Calculate stage-by-stage progress breakdown
 * @param {Object} userData - User progress data
 * @returns {Array} Array of stage progress objects
 */
export const calculateStageBreakdown = (userData = {}) => {
  const { completedSubMissions = [] } = userData;
  const breakdown = [];
  
  for (let stageNum = 1; stageNum <= GPS_101_STRUCTURE.TOTAL_STAGES; stageNum++) {
    const stageProgress = calculateStageProgress(stageNum, completedSubMissions);
    const stageInfo = GPS_101_STRUCTURE.STAGES[stageNum];
    
    breakdown.push({
      ...stageProgress,
      ...stageInfo,
      status: stageProgress.isComplete ? 'completed' : 
              stageProgress.completed > 0 ? 'in_progress' : 'locked'
    });
  }
  
  return breakdown;
};

/**
 * Get next milestone
 * @param {Object} progressData - Current progress data
 * @returns {Object} Next milestone information
 */
export const getNextMilestone = (progressData = {}) => {
  const overall = calculateOverallProgress(progressData);
  
  // Check Orange Beacon
  if (!overall.orangeBeacon.earned) {
    return {
      type: 'orange_beacon',
      name: 'Orange Beacon',
      description: 'Complete all 150 checkpoints to earn the Orange Beacon',
      progress: overall.checkpoints.percentage,
      remaining: overall.checkpoints.remaining,
      target: overall.checkpoints.total
    };
  }
  
  // Check next stage
  const nextStage = GPS_101_STRUCTURE.TOTAL_STAGES - overall.stages.completed + 1;
  if (nextStage <= GPS_101_STRUCTURE.TOTAL_STAGES) {
    const stageInfo = GPS_101_STRUCTURE.STAGES[nextStage];
    return {
      type: 'stage',
      name: `Stage ${nextStage}`,
      description: stageInfo.question,
      deliverable: stageInfo.deliverable,
      icon: stageInfo.icon
    };
  }
  
  // All complete
  return {
    type: 'complete',
    name: 'GPS 101 Complete',
    description: 'Congratulations! You have completed GPS 101 Basic'
  };
};

/**
 * Export all calculator functions
 */
export default {
  calculateStageProgress,
  calculateMissionProgress,
  calculateSubMissionProgress,
  calculateOverallProgress,
  calculateTimeProgress,
  calculateEstimatedCompletion,
  calculateStageBreakdown,
  getNextMilestone
};