/**
 * GPS Lab Platform - Game Configuration
 * 
 * Configuration for game mechanics, progression, and rewards.
 * 
 * @module config/game.config
 */

import { GPO_STAGES } from './constants';

// =============================================================================
// GPO MISSION STATES
// =============================================================================

export const GPO_MISSION_STATES = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  REVIEW_PENDING: 'review_pending',
  APPROVED: 'approved',
  REVISION_NEEDED: 'revision_needed',
  COMPLETED: 'completed'
};

// =============================================================================
// GPO STAGE DEFINITIONS
// =============================================================================

export const GPO_STAGE_CONFIG = {
  '-4': {
    ...GPO_STAGES[0],
    requiredFields: ['selfieVideo', 'background', 'community'],
    minVideoLength: 30, // seconds
    maxVideoLength: 90, // seconds
    xpReward: 50,
    barakaReward: 10
  },
  '-3': {
    ...GPO_STAGES[1],
    requiredFields: ['currentReality', 'desiredState', 'theGap', 'evidence'],
    minEvidence: 2, // minimum photos/videos
    xpReward: 50,
    barakaReward: 10
  },
  '-2': {
    ...GPO_STAGES[2],
    requiredFields: ['testimony', 'dailyBurden', 'impactVideo'],
    minTestimonyLength: 100, // characters
    xpReward: 50,
    barakaReward: 10
  },
  '-1': {
    ...GPO_STAGES[3],
    requiredFields: ['visionStatement', 'symbolicImages', 'beforeAfter'],
    minVisionLength: 50, // characters
    xpReward: 50,
    barakaReward: 10
  },
  '0': {
    ...GPO_STAGES[4],
    requiredFields: ['collaborationNeeds', 'invitationVideo', 'neededSkills'],
    minSkills: 3,
    xpReward: 100, // Bonus for completion
    barakaReward: 30
  }
};

// =============================================================================
// GPO COMPLETION REWARDS
// =============================================================================

export const GPO_COMPLETION_REWARDS = {
  xp: 300,
  baraka: 100,
  badge: 'problem_owner',
  title: 'Problem Owner',
  unlocks: ['gps_training', 'problem_marketplace']
};

// =============================================================================
// STAGE PROGRESSION
// =============================================================================

export const STAGE_PROGRESSION = {
  // GPO Call (-4 to 0)
  GPO_CALL: {
    stageRange: [-4, 0],
    totalStages: 5,
    xpPerStage: 50,
    totalXP: 300,
    unlockNext: 'GPS_101'
  },
  
  // GPS Training (1-35)
  GPS_101: {
    stageRange: [1, 5],
    totalStages: 5,
    xpPerStage: 100,
    beaconColor: '#FF6B6B'
  },
  GPS_PREP: {
    stageRange: [6, 10],
    totalStages: 5,
    xpPerStage: 150,
    beaconColor: '#FF8C42'
  },
  GPS_SIMULATION: {
    stageRange: [11, 15],
    totalStages: 5,
    xpPerStage: 200,
    beaconColor: '#F1C40F'
  },
  GPS_CAPSTONE_1: {
    stageRange: [16, 20],
    totalStages: 5,
    xpPerStage: 250,
    beaconColor: '#2A9D8F'
  },
  GPS_CAPSTONE_2: {
    stageRange: [21, 25],
    totalStages: 5,
    xpPerStage: 300,
    beaconColor: '#00D4FF'
  },
  VENTURE_ACCELERATION: {
    stageRange: [26, 30],
    totalStages: 5,
    xpPerStage: 350,
    beaconColor: '#9B59B6'
  },
  VENTURE_CAPITALIZATION: {
    stageRange: [31, 35],
    totalStages: 5,
    xpPerStage: 400,
    beaconColor: '#8E44AD'
  }
};

// =============================================================================
// LEVEL SYSTEM
// =============================================================================

export const LEVEL_SYSTEM = {
  baseXP: 100,
  xpMultiplier: 1.5,
  maxLevel: 50,
  
  /**
   * Calculate XP required for level
   */
  xpForLevel: (level) => {
    return Math.floor(LEVEL_SYSTEM.baseXP * Math.pow(LEVEL_SYSTEM.xpMultiplier, level - 1));
  },
  
  /**
   * Calculate level from XP
   */
  levelFromXP: (xp) => {
    let level = 1;
    let totalXP = 0;
    
    while (totalXP <= xp && level < LEVEL_SYSTEM.maxLevel) {
      totalXP += LEVEL_SYSTEM.xpForLevel(level);
      if (totalXP <= xp) level++;
    }
    
    return level;
  }
};

// =============================================================================
// BARAKA ECONOMY
// =============================================================================

export const BARAKA_ECONOMY = {
  // Earning Baraka
  EARN_RATES: {
    gpo_stage: 10,
    mission_complete: 20,
    stage_complete: 50,
    perfect_checkpoint: 100,
    daily_streak: 25,
    helping_others: 30
  },
  
  // Spending Baraka
  COSTS: {
    unlock_premium_mission: 100,
    boost_xp: 50,
    skip_checkpoint: 200,
    custom_avatar: 150,
    mentor_session: 300
  },
  
  // Covenant Economy (50% return)
  COVENANT_RETURN_RATE: 0.5
};

// =============================================================================
// MISSION SYSTEM
// =============================================================================

export const MISSION_SYSTEM = {
  MISSIONS_PER_STAGE: 5,
  BITES_PER_MISSION: 10,
  MIN_CHECKPOINT_SCORE: 60,
  PERFECT_CHECKPOINT_SCORE: 100,
  RETRY_PENALTY: 0.8, // 20% XP reduction on retry
  PARTY_BONUS: 1.2 // 20% XP bonus in parties
};

// =============================================================================
// ACHIEVEMENT SYSTEM
// =============================================================================

export const ACHIEVEMENTS = {
  GPO_STARTER: {
    id: 'gpo_starter',
    name: 'Problem Owner',
    description: 'Complete your first GPO Call stage',
    icon: '🎯',
    xp: 50
  },
  GPO_COMPLETE: {
    id: 'gpo_complete',
    name: 'Showcase Creator',
    description: 'Complete all GPO Call stages',
    icon: '🏆',
    xp: 300
  },
  FIRST_MISSION: {
    id: 'first_mission',
    name: 'Mission Starter',
    description: 'Complete your first mission',
    icon: '🚀',
    xp: 100
  },
  STAGE_MASTER: {
    id: 'stage_master',
    name: 'Stage Master',
    description: 'Complete all 5 stages of an adventure',
    icon: '⭐',
    xp: 500
  }
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get stage configuration
 */
export const getStageConfig = (stageNumber) => {
  if (stageNumber >= -4 && stageNumber <= 0) {
    return GPO_STAGE_CONFIG[stageNumber.toString()];
  }
  
  for (const [key, config] of Object.entries(STAGE_PROGRESSION)) {
    const [min, max] = config.stageRange;
    if (stageNumber >= min && stageNumber <= max) {
      return config;
    }
  }
  
  return null;
};

/**
 * Check if stage is GPO Call
 */
export const isGPOStage = (stageNumber) => {
  return stageNumber >= -4 && stageNumber <= 0;
};

/**
 * Get GPO stage by number
 */
export const getGPOStage = (stageNumber) => {
  return GPO_STAGE_CONFIG[stageNumber.toString()] || null;
};

/**
 * Calculate total GPO progress
 */
export const calculateGPOProgress = (completedStages = []) => {
  const total = Object.keys(GPO_STAGE_CONFIG).length;
  const completed = completedStages.filter(s => s >= -4 && s <= 0).length;
  return (completed / total) * 100;
};

export default {
  GPO_MISSION_STATES,
  GPO_STAGE_CONFIG,
  GPO_COMPLETION_REWARDS,
  STAGE_PROGRESSION,
  LEVEL_SYSTEM,
  BARAKA_ECONOMY,
  MISSION_SYSTEM,
  ACHIEVEMENTS,
  getStageConfig,
  isGPOStage,
  getGPOStage,
  calculateGPOProgress
};