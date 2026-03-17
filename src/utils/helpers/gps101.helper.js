/**
 * GPS 101 Helper Functions
 * CORRECT STRUCTURE: 5 Stages → 1 Mission per Stage → 6 Sub-missions per Mission → 5 Checkpoints per Sub-mission
 * TOTALS: 5 Stages, 5 Missions, 30 Sub-missions, 150 Checkpoints
 */

import { GPS_101_CONFIG } from '../../config/gps101.config';

/**
 * CORRECT GPS 101 STRUCTURE CONSTANTS
 */
export const GPS_101_STRUCTURE = {
  TOTAL_STAGES: 5,
  TOTAL_MISSIONS: 5, // 1 mission per stage
  TOTAL_SUB_MISSIONS: 30, // 6 sub-missions per mission
  TOTAL_CHECKPOINTS: 150, // 5 checkpoints per sub-mission
  TOTAL_BARAKA: 5000, // Orange Beacon target
  DURATION_WEEKS: 15,
  
  SUB_MISSIONS_PER_MISSION: 6,
  CHECKPOINTS_PER_SUB_MISSION: 5,
  CHECKPOINTS_PER_MISSION: 30, // 5 × 6
  
  // Stage Information
  STAGES: {
    1: { 
      question: "Who are you?", 
      outcome: "Identity Statement",
      deliverable: "Identity Statement",
      icon: "🪪",
      duration: "3 weeks"
    },
    2: { 
      question: "What is the meaning of your life?", 
      outcome: "Problem Candidate",
      deliverable: "Problem Candidate List",
      icon: "🧩",
      duration: "3 weeks"
    },
    3: { 
      question: "Whose pain are you called to solve?", 
      outcome: "Problem Owner Story",
      deliverable: "Problem Owner Story",
      icon: "💝",
      duration: "3 weeks"
    },
    4: { 
      question: "What is your life purpose?", 
      outcome: "Life Purpose Statement",
      deliverable: "Life Purpose Statement",
      icon: "✨",
      duration: "3 weeks"
    },
    5: { 
      question: "What is your Purpose-driven Project?", 
      outcome: "Purpose-driven Project",
      deliverable: "Purpose-driven Project Plan",
      icon: "🚀",
      duration: "3 weeks"
    }
  }
};

/**
 * Get stage by number (1-5)
 */
export const getStageByNumber = (stageNumber) => {
  const stageNum = parseInt(stageNumber);
  if (stageNum < 1 || stageNum > 5) return null;
  
  return {
    stageNumber: stageNum,
    ...GPS_101_STRUCTURE.STAGES[stageNum],
    // Each stage has 1 mission
    totalMissions: 1,
    totalSubMissions: GPS_101_STRUCTURE.SUB_MISSIONS_PER_MISSION,
    totalCheckpoints: GPS_101_STRUCTURE.CHECKPOINTS_PER_MISSION
  };
};

/**
 * Get mission by stage number (1 mission per stage)
 */
export const getMissionByStageNumber = (stageNumber) => {
  const stage = getStageByNumber(stageNumber);
  if (!stage) return null;
  
  // Each stage has exactly 1 mission
  return {
    missionId: `gps101-stage-${stageNumber}-mission-1`,
    stageNumber: parseInt(stageNumber),
    missionNumber: 1,
    title: `Stage ${stageNumber} Mission`,
    totalSubMissions: GPS_101_STRUCTURE.SUB_MISSIONS_PER_MISSION,
    totalCheckpoints: GPS_101_STRUCTURE.CHECKPOINTS_PER_MISSION,
    isStageCompleter: true // All missions complete their stage
  };
};

/**
 * Get sub-missions by mission ID (6 sub-missions per mission)
 */
export const getSubMissionsByMissionId = (missionId) => {
  // Extract stage number from mission ID
  const match = missionId.match(/stage-(\d+)/);
  if (!match) return [];
  
  const stageNumber = parseInt(match[1]);
  const subMissions = [];
  
  for (let i = 1; i <= GPS_101_STRUCTURE.SUB_MISSIONS_PER_MISSION; i++) {
    subMissions.push({
      subMissionId: `${missionId}-sub-${i}`,
      missionId,
      stageNumber,
      subMissionNumber: i,
      title: `Sub-mission ${i}`,
      totalCheckpoints: GPS_101_STRUCTURE.CHECKPOINTS_PER_SUB_MISSION,
      status: 'locked' // Default status
    });
  }
  
  return subMissions;
};

/**
 * Get checkpoints by sub-mission ID (5 checkpoints per sub-mission)
 */
export const getCheckpointsBySubMissionId = (subMissionId) => {
  const checkpoints = [];
  
  for (let i = 1; i <= GPS_101_STRUCTURE.CHECKPOINTS_PER_SUB_MISSION; i++) {
    checkpoints.push({
      checkpointId: `${subMissionId}-checkpoint-${i}`,
      subMissionId,
      checkpointNumber: i,
      title: `Checkpoint ${i}`,
      status: 'locked' // Default status
    });
  }
  
  return checkpoints;
};

/**
 * Calculate total Baraka for GPS 101
 * Assumes each checkpoint = 33.33 Baraka (150 checkpoints × 33.33 = ~5000)
 */
export const calculateTotalBaraka = (completedCheckpoints) => {
  const barakaPerCheckpoint = GPS_101_STRUCTURE.TOTAL_BARAKA / GPS_101_STRUCTURE.TOTAL_CHECKPOINTS;
  return Math.round(completedCheckpoints * barakaPerCheckpoint);
};

/**
 * Calculate completion percentage
 */
export const calculateCompletionPercentage = (completed, total) => {
  if (!total || total === 0) return 0;
  return Math.round(((completed || 0) / total) * 100);
};

/**
 * Calculate stage completion percentage
 * Based on completed sub-missions (6 per stage)
 */
export const calculateStageCompletion = (stageNumber, completedSubMissions = []) => {
  const mission = getMissionByStageNumber(stageNumber);
  if (!mission) return 0;
  
  const subMissions = getSubMissionsByMissionId(mission.missionId);
  const completed = subMissions.filter(sm => 
    completedSubMissions.includes(sm.subMissionId)
  ).length;
  
  return calculateCompletionPercentage(completed, GPS_101_STRUCTURE.SUB_MISSIONS_PER_MISSION);
};

/**
 * Calculate mission completion percentage
 * Based on completed checkpoints (30 per mission)
 */
export const calculateMissionCompletion = (missionId, completedCheckpoints = []) => {
  const subMissions = getSubMissionsByMissionId(missionId);
  let totalPassed = 0;
  
  subMissions.forEach(sm => {
    const checkpoints = getCheckpointsBySubMissionId(sm.subMissionId);
    const passed = checkpoints.filter(cp => 
      completedCheckpoints.includes(cp.checkpointId)
    ).length;
    totalPassed += passed;
  });
  
  return calculateCompletionPercentage(totalPassed, GPS_101_STRUCTURE.CHECKPOINTS_PER_MISSION);
};

/**
 * Calculate sub-mission completion percentage
 * Based on completed checkpoints (5 per sub-mission)
 */
export const calculateSubMissionCompletion = (subMissionId, completedCheckpoints = []) => {
  const checkpoints = getCheckpointsBySubMissionId(subMissionId);
  const passed = checkpoints.filter(cp => 
    completedCheckpoints.includes(cp.checkpointId)
  ).length;
  
  return calculateCompletionPercentage(passed, GPS_101_STRUCTURE.CHECKPOINTS_PER_SUB_MISSION);
};

/**
 * Check if stage is completed (all 6 sub-missions done)
 */
export const isStageCompleted = (stageNumber, completedSubMissions = []) => {
  const mission = getMissionByStageNumber(stageNumber);
  if (!mission) return false;
  
  const subMissions = getSubMissionsByMissionId(mission.missionId);
  return subMissions.every(sm => completedSubMissions.includes(sm.subMissionId));
};

/**
 * Check if mission is completed (all 30 checkpoints passed)
 */
export const isMissionCompleted = (missionId, completedCheckpoints = []) => {
  const completion = calculateMissionCompletion(missionId, completedCheckpoints);
  return completion === 100;
};

/**
 * Check if sub-mission is completed (all 5 checkpoints passed)
 */
export const isSubMissionCompleted = (subMissionId, completedCheckpoints = []) => {
  const checkpoints = getCheckpointsBySubMissionId(subMissionId);
  return checkpoints.every(cp => completedCheckpoints.includes(cp.checkpointId));
};

/**
 * Get next uncompleted stage
 */
export const getNextUncompletedStage = (completedStages = []) => {
  for (let i = 1; i <= GPS_101_STRUCTURE.TOTAL_STAGES; i++) {
    if (!completedStages.includes(i)) {
      return getStageByNumber(i);
    }
  }
  return null;
};

/**
 * Get next uncompleted sub-mission in mission
 */
export const getNextUncompletedSubMission = (missionId, completedSubMissions = []) => {
  const subMissions = getSubMissionsByMissionId(missionId);
  return subMissions.find(sm => !completedSubMissions.includes(sm.subMissionId)) || null;
};

/**
 * Get next uncompleted checkpoint in sub-mission
 */
export const getNextUncompletedCheckpoint = (subMissionId, completedCheckpoints = []) => {
  const checkpoints = getCheckpointsBySubMissionId(subMissionId);
  return checkpoints.find(cp => !completedCheckpoints.includes(cp.checkpointId)) || null;
};

/**
 * Check if Orange Beacon is earned (5,000 Baraka)
 */
export const hasEarnedOrangeBeacon = (totalBaraka) => {
  return (totalBaraka || 0) >= GPS_101_STRUCTURE.TOTAL_BARAKA;
};

/**
 * Calculate progress to Orange Beacon
 */
export const calculateOrangeBeaconProgress = (totalBaraka = 0) => {
  const current = totalBaraka || 0;
  const target = GPS_101_STRUCTURE.TOTAL_BARAKA;
  const percentage = calculateCompletionPercentage(current, target);
  
  return {
    current,
    target,
    remaining: Math.max(0, target - current),
    percentage
  };
};

/**
 * Check if GPS 101 is completed (all 5 stages done)
 */
export const isGPS101Completed = (completedStages = []) => {
  return completedStages.length === GPS_101_STRUCTURE.TOTAL_STAGES;
};

/**
 * Calculate weeks elapsed since enrollment
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
 * Calculate weeks remaining (15 weeks total)
 */
export const calculateWeeksRemaining = (enrollmentDate) => {
  const weeksElapsed = calculateWeeksElapsed(enrollmentDate);
  return Math.max(0, GPS_101_STRUCTURE.DURATION_WEEKS - weeksElapsed);
};

/**
 * Check if on track (based on timeline)
 * Expected: ~1 stage every 3 weeks = ~2 sub-missions per week
 */
export const isOnTrack = (completedSubMissions = [], enrollmentDate) => {
  const weeksElapsed = calculateWeeksElapsed(enrollmentDate);
  const expectedSubMissions = Math.floor(weeksElapsed * 2); // 2 per week
  
  return completedSubMissions.length >= expectedSubMissions;
};

/**
 * Get stage deliverable status
 */
export const getStageDeliverableStatus = (stageNumber, deliverables = {}) => {
  const stage = getStageByNumber(stageNumber);
  if (!stage) return null;
  
  const deliverableId = `stage-${stageNumber}-deliverable`;
  const deliverable = deliverables[deliverableId];
  
  return {
    id: deliverableId,
    name: stage.deliverable,
    completed: !!deliverable,
    data: deliverable
  };
};

/**
 * Calculate estimated time remaining
 */
export const calculateEstimatedTimeRemaining = (completedStages = []) => {
  const remainingStages = GPS_101_STRUCTURE.TOTAL_STAGES - completedStages.length;
  const estimatedWeeks = remainingStages * 3; // 3 weeks per stage
  
  return {
    stages: remainingStages,
    weeks: estimatedWeeks,
    days: estimatedWeeks * 7
  };
};

/**
 * Get GPS 101 summary statistics
 * CORRECT STRUCTURE: 5 stages, 5 missions, 30 sub-missions, 150 checkpoints
 */
export const getGPS101Summary = (userData = {}) => {
  const {
    completedStages = [],
    completedSubMissions = [],
    completedCheckpoints = [],
    totalBaraka = 0,
    enrollmentDate = null
  } = userData;
  
  return {
    stages: {
      completed: completedStages.length,
      total: GPS_101_STRUCTURE.TOTAL_STAGES,
      percentage: calculateCompletionPercentage(
        completedStages.length,
        GPS_101_STRUCTURE.TOTAL_STAGES
      )
    },
    missions: {
      completed: completedStages.length, // 1 mission per stage
      total: GPS_101_STRUCTURE.TOTAL_MISSIONS,
      percentage: calculateCompletionPercentage(
        completedStages.length,
        GPS_101_STRUCTURE.TOTAL_MISSIONS
      )
    },
    subMissions: {
      completed: completedSubMissions.length,
      total: GPS_101_STRUCTURE.TOTAL_SUB_MISSIONS,
      percentage: calculateCompletionPercentage(
        completedSubMissions.length,
        GPS_101_STRUCTURE.TOTAL_SUB_MISSIONS
      )
    },
    checkpoints: {
      completed: completedCheckpoints.length,
      total: GPS_101_STRUCTURE.TOTAL_CHECKPOINTS,
      percentage: calculateCompletionPercentage(
        completedCheckpoints.length,
        GPS_101_STRUCTURE.TOTAL_CHECKPOINTS
      )
    },
    rewards: {
      baraka: totalBaraka,
      orangeBeacon: hasEarnedOrangeBeacon(totalBaraka),
      orangeBeaconProgress: calculateOrangeBeaconProgress(totalBaraka)
    },
    timeline: {
      weeksElapsed: calculateWeeksElapsed(enrollmentDate),
      weeksRemaining: calculateWeeksRemaining(enrollmentDate),
      onTrack: isOnTrack(completedSubMissions, enrollmentDate),
      estimatedCompletion: calculateEstimatedTimeRemaining(completedStages)
    },
    isCompleted: isGPS101Completed(completedStages)
  };
};

/**
 * Get all stages with detailed info
 */
export const getAllStages = () => {
  return [1, 2, 3, 4, 5].map(num => getStageByNumber(num));
};

/**
 * Export all helper functions
 */
export default {
  GPS_101_STRUCTURE,
  getStageByNumber,
  getMissionByStageNumber,
  getSubMissionsByMissionId,
  getCheckpointsBySubMissionId,
  calculateTotalBaraka,
  calculateCompletionPercentage,
  calculateStageCompletion,
  calculateMissionCompletion,
  calculateSubMissionCompletion,
  isStageCompleted,
  isMissionCompleted,
  isSubMissionCompleted,
  getNextUncompletedStage,
  getNextUncompletedSubMission,
  getNextUncompletedCheckpoint,
  hasEarnedOrangeBeacon,
  calculateOrangeBeaconProgress,
  isGPS101Completed,
  calculateWeeksElapsed,
  calculateWeeksRemaining,
  isOnTrack,
  getStageDeliverableStatus,
  calculateEstimatedTimeRemaining,
  getGPS101Summary,
  getAllStages
};