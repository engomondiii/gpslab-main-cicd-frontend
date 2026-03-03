/**
 * Baraka Calculator
 * 
 * Calculate Baraka rewards and distributions.
 */

import { GPS_101_REWARDS } from '../constants/gps101.constants';
import { BARAKA_CONFIG } from '../../config/game.config';

/**
 * Calculate checkpoint Baraka
 */
export const calculateCheckpointBaraka = (checkpointScore, isFirstTry = false, isPerfect = false) => {
  let baraka = BARAKA_CONFIG.CHECKPOINT_PASS;

  // Bonus for perfect score
  if (isPerfect) {
    baraka += BARAKA_CONFIG.PERFECT_CHECKPOINT;
  }

  // Bonus for first try
  if (isFirstTry) {
    baraka += BARAKA_CONFIG.FIRST_TRY;
  }

  return baraka;
};

/**
 * Calculate mission Baraka
 */
export const calculateMissionBaraka = (missionType = 'standard', isGPS101 = false) => {
  if (isGPS101) {
    return GPS_101_REWARDS.MISSION_COMPLETE;
  }

  return BARAKA_CONFIG.MISSION_COMPLETE;
};

/**
 * Calculate stage Baraka
 */
export const calculateStageBaraka = (stageNumber, isGPS101 = false) => {
  if (isGPS101) {
    return GPS_101_REWARDS.STAGE_COMPLETE;
  }

  return BARAKA_CONFIG.STAGE_COMPLETE;
};

/**
 * Calculate GPS 101 total Baraka
 */
export const calculateGPS101TotalBaraka = (completedCheckpoints, completedMissions, completedStages) => {
  const checkpointBaraka = completedCheckpoints * GPS_101_REWARDS.CHECKPOINT_PASS;
  const missionBaraka = completedMissions * GPS_101_REWARDS.MISSION_COMPLETE;
  const stageBaraka = completedStages * GPS_101_REWARDS.STAGE_COMPLETE;

  return checkpointBaraka + missionBaraka + stageBaraka;
};

/**
 * Calculate Baraka to next beacon
 */
export const calculateBarakaToNextBeacon = (currentBaraka) => {
  const beacons = Object.values(BARAKA_CONFIG.BEACONS).sort(
    (a, b) => a.threshold - b.threshold
  );

  const nextBeacon = beacons.find(beacon => beacon.threshold > currentBaraka);

  if (!nextBeacon) {
    return {
      nextBeacon: null,
      remaining: 0,
      progress: 100
    };
  }

  const previousBeacon = beacons
    .reverse()
    .find(beacon => beacon.threshold <= currentBaraka);
  const previousThreshold = previousBeacon ? previousBeacon.threshold : 0;

  const totalNeeded = nextBeacon.threshold - previousThreshold;
  const earned = currentBaraka - previousThreshold;

  return {
    nextBeacon: nextBeacon.name,
    remaining: nextBeacon.threshold - currentBaraka,
    progress: Math.round((earned / totalNeeded) * 100),
    threshold: nextBeacon.threshold
  };
};

/**
 * Get current beacon
 */
export const getCurrentBeacon = (totalBaraka) => {
  const beacons = Object.values(BARAKA_CONFIG.BEACONS).sort(
    (a, b) => b.threshold - a.threshold
  );

  return beacons.find(beacon => totalBaraka >= beacon.threshold);
};

/**
 * Calculate daily login streak bonus
 */
export const calculateStreakBonus = (streakDays) => {
  let bonus = 0;

  // Daily login
  bonus += BARAKA_CONFIG.DAILY_LOGIN;

  // Weekly streak
  if (streakDays >= 7) {
    bonus += BARAKA_CONFIG.WEEKLY_STREAK;
  }

  // Monthly streak
  if (streakDays >= 30) {
    bonus += BARAKA_CONFIG.MONTHLY_STREAK;
  }

  return bonus;
};

/**
 * Calculate praise Baraka
 */
export const calculatePraiseBaraka = (isGiving = true) => {
  return isGiving ? BARAKA_CONFIG.GIVE_PRAISE : BARAKA_CONFIG.GIVE_PRAISE * 0.4;
};

/**
 * Calculate party collaboration bonus
 */
export const calculatePartyBonus = (baseBaraka) => {
  return Math.round(baseBaraka * 0.2); // 20% bonus for party missions
};

/**
 * Calculate total Baraka earned
 */
export const calculateTotalBarakaEarned = (userData) => {
  const {
    checkpointsBaraka = 0,
    missionsBaraka = 0,
    stagesBaraka = 0,
    bonusBaraka = 0,
    praiseBaraka = 0,
    streakBaraka = 0
  } = userData;

  return checkpointsBaraka + missionsBaraka + stagesBaraka + bonusBaraka + praiseBaraka + streakBaraka;
};

/**
 * Estimate Baraka earnings
 */
export const estimateBarakaEarnings = (missionsToComplete, avgCheckpointsPerMission = 5) => {
  const checkpoints = missionsToComplete * avgCheckpointsPerMission;
  const checkpointBaraka = checkpoints * BARAKA_CONFIG.CHECKPOINT_PASS;
  const missionBaraka = missionsToComplete * BARAKA_CONFIG.MISSION_COMPLETE;

  return {
    fromCheckpoints: checkpointBaraka,
    fromMissions: missionBaraka,
    total: checkpointBaraka + missionBaraka,
    estimated: true
  };
};

/**
 * Calculate Baraka breakdown
 */
export const calculateBarakaBreakdown = (userData) => {
  return {
    checkpoints: userData.checkpointsBaraka || 0,
    missions: userData.missionsBaraka || 0,
    stages: userData.stagesBaraka || 0,
    bonuses: userData.bonusBaraka || 0,
    praise: userData.praiseBaraka || 0,
    streaks: userData.streakBaraka || 0,
    total: calculateTotalBarakaEarned(userData)
  };
};

/**
 * Export all calculator functions
 */
export default {
  calculateCheckpointBaraka,
  calculateMissionBaraka,
  calculateStageBaraka,
  calculateGPS101TotalBaraka,
  calculateBarakaToNextBeacon,
  getCurrentBeacon,
  calculateStreakBonus,
  calculatePraiseBaraka,
  calculatePartyBonus,
  calculateTotalBarakaEarned,
  estimateBarakaEarnings,
  calculateBarakaBreakdown
};