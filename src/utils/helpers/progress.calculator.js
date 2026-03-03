/**
 * Progress Calculator
 * 
 * Calculate progress across various GPS courses and stages.
 */

import { GPS_101_CONFIG } from '../../config/gps101.config';
import { 
  calculateCompletionPercentage,
  calculateStageCompletion,
  calculateMissionCompletion
} from './gps101.helper';

/**
 * Calculate overall GPS Lab progress
 */
export const calculateOverallProgress = (userData) => {
  const {
    completedStages = [],
    completedMissions = [],
    completedCheckpoints = []
  } = userData;

  const totalStages = 35; // Total GPS program stages
  const totalMissions = totalStages * 5; // Approximate
  const totalCheckpoints = totalMissions * 5; // Approximate

  return {
    stages: calculateCompletionPercentage(completedStages.length, totalStages),
    missions: calculateCompletionPercentage(completedMissions.length, totalMissions),
    checkpoints: calculateCompletionPercentage(completedCheckpoints.length, totalCheckpoints),
    overall: calculateCompletionPercentage(completedStages.length, totalStages)
  };
};

/**
 * Calculate GPS 101 progress
 */
export const calculateGPS101Progress = (userData) => {
  const {
    gps101CompletedMissions = [],
    gps101PassedCheckpoints = [],
    gps101CompletedStages = []
  } = userData;

  return {
    stages: calculateCompletionPercentage(
      gps101CompletedStages.length,
      GPS_101_CONFIG.TOTAL_STAGES
    ),
    missions: calculateCompletionPercentage(
      gps101CompletedMissions.length,
      GPS_101_CONFIG.TOTAL_MISSIONS
    ),
    checkpoints: calculateCompletionPercentage(
      gps101PassedCheckpoints.length,
      GPS_101_CONFIG.TOTAL_CHECKPOINTS
    ),
    overall: calculateCompletionPercentage(
      gps101CompletedMissions.length,
      GPS_101_CONFIG.TOTAL_MISSIONS
    )
  };
};

/**
 * Calculate stage progress for any stage
 */
export const calculateStageProgress = (stageNumber, completedMissions, missionsPerStage = 5) => {
  return calculateStageCompletion(stageNumber, completedMissions);
};

/**
 * Calculate mission progress for any mission
 */
export const calculateMissionProgress = (missionId, passedCheckpoints) => {
  return calculateMissionCompletion(missionId, passedCheckpoints);
};

/**
 * Calculate course completion percentage
 */
export const calculateCourseCompletion = (courseCode, userData) => {
  switch (courseCode) {
    case 'GPS_101_BASIC':
      return calculateGPS101Progress(userData).overall;
    
    case 'GPS_PREP':
    case 'GPS_SIMULATION':
    case 'GPS_CAPSTONE_1':
    case 'GPS_CAPSTONE_2':
      // Similar calculation for other courses
      return 0;
    
    default:
      return 0;
  }
};

/**
 * Calculate weekly progress
 */
export const calculateWeeklyProgress = (userData, startDate) => {
  if (!startDate) return { completed: 0, expected: 0, onTrack: true };

  const now = new Date();
  const start = new Date(startDate);
  const weeksPassed = Math.floor((now - start) / (7 * 24 * 60 * 60 * 1000));

  const expectedMissions = weeksPassed * 2; // ~2 missions per week
  const completedMissions = userData.completedMissions?.length || 0;

  return {
    completed: completedMissions,
    expected: expectedMissions,
    onTrack: completedMissions >= expectedMissions,
    weeksElapsed: weeksPassed
  };
};

/**
 * Calculate progress velocity
 */
export const calculateProgressVelocity = (userData, timeframe = 'week') => {
  const recentActivity = userData.recentActivity || [];
  
  const now = new Date();
  let cutoffDate;

  switch (timeframe) {
    case 'day':
      cutoffDate = new Date(now - 24 * 60 * 60 * 1000);
      break;
    case 'week':
      cutoffDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      cutoffDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      cutoffDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
  }

  const recentCompletions = recentActivity.filter(
    activity => new Date(activity.completedAt) >= cutoffDate
  );

  return {
    missionsCompleted: recentCompletions.filter(a => a.type === 'mission').length,
    checkpointsCompleted: recentCompletions.filter(a => a.type === 'checkpoint').length,
    barakaEarned: recentCompletions.reduce((sum, a) => sum + (a.barakaEarned || 0), 0),
    xpEarned: recentCompletions.reduce((sum, a) => sum + (a.xpEarned || 0), 0)
  };
};

/**
 * Export all calculator functions
 */
export default {
  calculateOverallProgress,
  calculateGPS101Progress,
  calculateStageProgress,
  calculateMissionProgress,
  calculateCourseCompletion,
  calculateWeeklyProgress,
  calculateProgressVelocity
};