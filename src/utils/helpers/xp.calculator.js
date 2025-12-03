/**
 * GPS Lab Platform - XP Calculator
 * 
 * Comprehensive XP (Experience Points) calculations for the GPS Lab MMORPG educational platform.
 * Handles XP earning, level progression, and achievement tracking.
 * 
 * @module utils/helpers/xp.calculator
 * @version 1.0.0
 */

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Base XP values for different activities
 */
export const XP_VALUES = {
  // Core progression
  checkpoint: 5,           // Per checkpoint completed
  mission: 25,             // Per mission completed (5 checkpoints)
  bite: 5,                 // Per bite (sub-mission) completed
  stage: 100,              // Per stage completed (5 missions)
  adventure: 500,          // Per adventure completed
  
  // Quality bonuses
  perfectCheckpoint: 10,   // Perfect score on checkpoint
  speedBonus: 5,           // Completing ahead of schedule
  firstTryBonus: 15,       // Completing without retries
  
  // Social activities
  givingHonor: 2,          // Honoring another GPS
  receivingHonor: 5,       // Being honored
  partyContribution: 10,   // Contributing to party success
  helpingNewbie: 20,       // Helping new members
  
  // Content creation
  qualityEvidence: 10,     // High-quality evidence submission
  resourceContribution: 25,// Contributing learning resources
  feedbackProvided: 5,     // Providing peer feedback
  
  // Daily activities
  dailyLogin: 5,           // Daily login bonus
  dailyMission: 10,        // Completing daily mission
  
  // Milestones
  firstMission: 50,        // First mission ever
  firstStage: 100,         // First stage completion
  firstAdventure: 500,     // First adventure completion
  
  // Streak bonuses
  streak7Days: 50,         // 7-day streak
  streak30Days: 200,       // 30-day streak
  streak90Days: 500        // 90-day streak
};

/**
 * Level thresholds and requirements
 * Level progression follows a curved formula
 */
export const LEVEL_CONFIG = {
  baseXP: 100,             // XP needed for level 2
  growthRate: 1.5,         // Exponential growth rate
  maxLevel: 100,           // Maximum level
  levelCap: {
    adventure1: 10,        // Max level in GPS 101
    adventure2: 20,        // Max level in GPS Prep
    adventure3: 35,        // Max level in GPS Simulation
    adventure4: 50,        // Max level in GPS Capstone 1
    adventure5: 65,        // Max level in GPS Capstone 2
    adventure6: 80,        // Max level in Venture Acceleration
    adventure7: 100        // Max level in Venture Capitalization
  }
};

/**
 * Level titles by range
 */
export const LEVEL_TITLES = {
  1: 'Newcomer',
  5: 'Explorer',
  10: 'Apprentice',
  15: 'Learner',
  20: 'Achiever',
  25: 'Solver',
  30: 'Contributor',
  35: 'Leader',
  40: 'Mentor',
  45: 'Expert',
  50: 'Master',
  60: 'Champion',
  70: 'Legend',
  80: 'Visionary',
  90: 'Pioneer',
  100: 'GPS Luminary'
};

/**
 * XP multipliers by context
 */
export const XP_MULTIPLIERS = {
  // Event multipliers
  doubleXPEvent: 2.0,
  weekendBonus: 1.25,
  holidayBonus: 1.5,
  
  // Subscription multipliers
  FREE: 1.0,
  CONTENDER: 1.1,
  PATHFINDER: 1.2,
  NAVIGATORS_CIRCLE: 1.3,
  
  // Adventure difficulty multipliers
  adventure1: 1.0,
  adventure2: 1.1,
  adventure3: 1.2,
  adventure4: 1.3,
  adventure5: 1.4,
  adventure6: 1.5,
  adventure7: 1.6
};

/**
 * Achievements that grant XP
 */
export const XP_ACHIEVEMENTS = {
  // Completion achievements
  complete10Missions: { xp: 100, name: '10 Missions Complete' },
  complete50Missions: { xp: 500, name: '50 Missions Complete' },
  complete100Missions: { xp: 1000, name: '100 Missions Complete' },
  completeAllMissions: { xp: 5000, name: 'Mission Master' },
  
  // Streak achievements
  streak7: { xp: 50, name: 'Week Warrior' },
  streak30: { xp: 200, name: 'Monthly Marvel' },
  streak90: { xp: 500, name: 'Quarterly Champion' },
  streak365: { xp: 2000, name: 'Year-Round Solver' },
  
  // Quality achievements
  perfect10Checkpoints: { xp: 100, name: 'Perfectionist' },
  perfect100Checkpoints: { xp: 1000, name: 'Excellence Expert' },
  noRetryStage: { xp: 250, name: 'First Try Wonder' },
  
  // Social achievements
  honor10Others: { xp: 50, name: 'Encourager' },
  honor100Others: { xp: 500, name: 'Community Champion' },
  receive10Honors: { xp: 100, name: 'Respected' },
  receive100Honors: { xp: 1000, name: 'Beloved' },
  
  // Special achievements
  firstToComplete: { xp: 500, name: 'Trailblazer' },
  helpNewMember: { xp: 100, name: 'Welcome Guide' },
  topOfLeaderboard: { xp: 1000, name: 'Leaderboard Legend' }
};

// =============================================================================
// LEVEL CALCULATIONS
// =============================================================================

/**
 * Calculates XP required for a specific level
 * @param {number} level - Target level
 * @returns {number} XP required
 */
export const getXPForLevel = (level) => {
  if (level <= 1) return 0;
  if (level > LEVEL_CONFIG.maxLevel) return getXPForLevel(LEVEL_CONFIG.maxLevel);
  
  // Exponential formula: baseXP * growthRate^(level-2)
  return Math.floor(
    LEVEL_CONFIG.baseXP * Math.pow(LEVEL_CONFIG.growthRate, level - 2)
  );
};

/**
 * Calculates cumulative XP required to reach a level
 * @param {number} level - Target level
 * @returns {number} Total XP required
 */
export const getTotalXPForLevel = (level) => {
  let total = 0;
  for (let i = 2; i <= level; i++) {
    total += getXPForLevel(i);
  }
  return total;
};

/**
 * Calculates level from total XP
 * @param {number} totalXP - Total XP earned
 * @returns {Object} Level information
 */
export const getLevelFromXP = (totalXP) => {
  const xp = Number(totalXP) || 0;
  
  let level = 1;
  let xpAccumulated = 0;
  
  while (level < LEVEL_CONFIG.maxLevel) {
    const xpForNext = getXPForLevel(level + 1);
    if (xpAccumulated + xpForNext > xp) {
      break;
    }
    xpAccumulated += xpForNext;
    level++;
  }
  
  const xpForCurrentLevel = getXPForLevel(level);
  const xpForNextLevel = getXPForLevel(level + 1);
  const xpIntoLevel = xp - xpAccumulated;
  const progressPercent = level >= LEVEL_CONFIG.maxLevel 
    ? 100 
    : (xpIntoLevel / xpForNextLevel) * 100;
  
  return {
    level,
    totalXP: xp,
    xpForNextLevel,
    xpIntoLevel,
    xpNeeded: xpForNextLevel - xpIntoLevel,
    progressPercent: Math.min(100, Math.max(0, progressPercent)),
    isMaxLevel: level >= LEVEL_CONFIG.maxLevel
  };
};

/**
 * Gets level title
 * @param {number} level - Current level
 * @returns {string} Title
 */
export const getLevelTitle = (level) => {
  const lvl = Number(level) || 1;
  
  const thresholds = Object.keys(LEVEL_TITLES)
    .map(Number)
    .sort((a, b) => b - a);
  
  for (const threshold of thresholds) {
    if (lvl >= threshold) {
      return LEVEL_TITLES[threshold];
    }
  }
  
  return LEVEL_TITLES[1];
};

/**
 * Calculates level cap for current adventure
 * @param {number} adventureNumber - Current adventure (1-7)
 * @returns {number} Level cap
 */
export const getLevelCapForAdventure = (adventureNumber) => {
  const adventure = Number(adventureNumber) || 1;
  const key = `adventure${Math.min(7, Math.max(1, adventure))}`;
  return LEVEL_CONFIG.levelCap[key] || LEVEL_CONFIG.maxLevel;
};

// =============================================================================
// XP REWARD CALCULATIONS
// =============================================================================

/**
 * Calculates XP reward with multipliers
 * @param {number} baseXP - Base XP value
 * @param {Object} options - Multiplier options
 * @returns {Object} XP calculation result
 */
export const calculateXPReward = (baseXP, options = {}) => {
  const {
    subscriptionTier = 'FREE',
    adventureNumber = 1,
    isDoubleXP = false,
    isWeekend = false,
    isHoliday = false
  } = options;
  
  let multiplier = 1.0;
  const appliedMultipliers = [];
  
  // Subscription multiplier
  const subMultiplier = XP_MULTIPLIERS[subscriptionTier] || 1.0;
  if (subMultiplier > 1.0) {
    multiplier *= subMultiplier;
    appliedMultipliers.push({ name: subscriptionTier, value: subMultiplier });
  }
  
  // Adventure difficulty
  const advKey = `adventure${adventureNumber}`;
  const advMultiplier = XP_MULTIPLIERS[advKey] || 1.0;
  if (advMultiplier > 1.0) {
    multiplier *= advMultiplier;
    appliedMultipliers.push({ name: `Adventure ${adventureNumber}`, value: advMultiplier });
  }
  
  // Event multipliers
  if (isDoubleXP) {
    multiplier *= XP_MULTIPLIERS.doubleXPEvent;
    appliedMultipliers.push({ name: 'Double XP Event', value: XP_MULTIPLIERS.doubleXPEvent });
  }
  
  if (isWeekend && !isDoubleXP) {
    multiplier *= XP_MULTIPLIERS.weekendBonus;
    appliedMultipliers.push({ name: 'Weekend Bonus', value: XP_MULTIPLIERS.weekendBonus });
  }
  
  if (isHoliday) {
    multiplier *= XP_MULTIPLIERS.holidayBonus;
    appliedMultipliers.push({ name: 'Holiday Bonus', value: XP_MULTIPLIERS.holidayBonus });
  }
  
  const finalXP = Math.floor(baseXP * multiplier);
  const bonusXP = finalXP - baseXP;
  
  return {
    baseXP,
    multiplier,
    bonusXP,
    finalXP,
    appliedMultipliers
  };
};

/**
 * Calculates checkpoint XP
 * @param {Object} options - Checkpoint options
 * @returns {Object} XP breakdown
 */
export const calculateCheckpointXP = (options = {}) => {
  const {
    isPerfect = false,
    isFirstTry = true,
    isAheadOfSchedule = false,
    ...multiplierOptions
  } = options;
  
  let baseXP = XP_VALUES.checkpoint;
  const bonuses = [];
  
  if (isPerfect) {
    baseXP += XP_VALUES.perfectCheckpoint;
    bonuses.push({ type: 'Perfect Score', xp: XP_VALUES.perfectCheckpoint });
  }
  
  if (isFirstTry) {
    baseXP += XP_VALUES.firstTryBonus;
    bonuses.push({ type: 'First Try', xp: XP_VALUES.firstTryBonus });
  }
  
  if (isAheadOfSchedule) {
    baseXP += XP_VALUES.speedBonus;
    bonuses.push({ type: 'Speed Bonus', xp: XP_VALUES.speedBonus });
  }
  
  const reward = calculateXPReward(baseXP, multiplierOptions);
  
  return {
    ...reward,
    bonuses,
    activity: 'checkpoint'
  };
};

/**
 * Calculates mission XP
 * @param {Object} options - Mission options
 * @returns {Object} XP breakdown
 */
export const calculateMissionXP = (options = {}) => {
  const {
    checkpointsCompleted = 5,
    perfectCheckpoints = 0,
    isFirstTry = false,
    isPartyMission = false,
    ...multiplierOptions
  } = options;
  
  // Base mission XP
  let baseXP = XP_VALUES.mission;
  const bonuses = [];
  
  // Checkpoint XP (already earned, but summarized)
  const checkpointXP = checkpointsCompleted * XP_VALUES.checkpoint;
  
  // Perfect checkpoint bonuses
  if (perfectCheckpoints > 0) {
    const perfectXP = perfectCheckpoints * XP_VALUES.perfectCheckpoint;
    bonuses.push({ type: 'Perfect Checkpoints', xp: perfectXP, count: perfectCheckpoints });
    baseXP += perfectXP;
  }
  
  if (isFirstTry) {
    baseXP += XP_VALUES.firstTryBonus;
    bonuses.push({ type: 'First Try', xp: XP_VALUES.firstTryBonus });
  }
  
  if (isPartyMission) {
    baseXP += XP_VALUES.partyContribution;
    bonuses.push({ type: 'Party Contribution', xp: XP_VALUES.partyContribution });
  }
  
  const reward = calculateXPReward(baseXP, multiplierOptions);
  
  return {
    ...reward,
    bonuses,
    checkpointXP,
    totalWithCheckpoints: reward.finalXP + checkpointXP,
    activity: 'mission'
  };
};

/**
 * Calculates stage XP
 * @param {Object} options - Stage options
 * @returns {Object} XP breakdown
 */
export const calculateStageXP = (options = {}) => {
  const {
    stageNumber = 1,
    missionsCompleted = 5,
    perfectMissions = 0,
    ...multiplierOptions
  } = options;
  
  let baseXP = XP_VALUES.stage;
  const bonuses = [];
  
  // Stage difficulty bonus (later stages worth more)
  const difficultyBonus = Math.floor((stageNumber - 1) * 10);
  if (difficultyBonus > 0) {
    baseXP += difficultyBonus;
    bonuses.push({ type: 'Stage Difficulty', xp: difficultyBonus });
  }
  
  // Perfect missions bonus
  if (perfectMissions > 0) {
    const perfectBonus = perfectMissions * 20;
    baseXP += perfectBonus;
    bonuses.push({ type: 'Perfect Missions', xp: perfectBonus, count: perfectMissions });
  }
  
  const reward = calculateXPReward(baseXP, multiplierOptions);
  
  return {
    ...reward,
    bonuses,
    stageNumber,
    activity: 'stage'
  };
};

/**
 * Calculates adventure XP
 * @param {Object} options - Adventure options
 * @returns {Object} XP breakdown
 */
export const calculateAdventureXP = (options = {}) => {
  const {
    adventureNumber = 1,
    stagesCompleted = 5,
    ...multiplierOptions
  } = options;
  
  let baseXP = XP_VALUES.adventure;
  const bonuses = [];
  
  // Adventure completion bonus scales with adventure number
  const adventureBonus = (adventureNumber - 1) * 100;
  if (adventureBonus > 0) {
    baseXP += adventureBonus;
    bonuses.push({ type: 'Adventure Level', xp: adventureBonus });
  }
  
  const reward = calculateXPReward(baseXP, { ...multiplierOptions, adventureNumber });
  
  return {
    ...reward,
    bonuses,
    adventureNumber,
    activity: 'adventure'
  };
};

// =============================================================================
// STREAK AND ACHIEVEMENT CALCULATIONS
// =============================================================================

/**
 * Calculates streak XP bonus
 * @param {number} streakDays - Consecutive days
 * @param {Object} options - Multiplier options
 * @returns {Object} Streak XP
 */
export const calculateStreakXP = (streakDays, options = {}) => {
  const days = Number(streakDays) || 0;
  let baseXP = 0;
  const milestones = [];
  
  // Check streak milestones
  if (days >= 7) {
    baseXP += XP_VALUES.streak7Days;
    milestones.push({ days: 7, xp: XP_VALUES.streak7Days, name: 'Week Streak' });
  }
  
  if (days >= 30) {
    baseXP += XP_VALUES.streak30Days;
    milestones.push({ days: 30, xp: XP_VALUES.streak30Days, name: 'Month Streak' });
  }
  
  if (days >= 90) {
    baseXP += XP_VALUES.streak90Days;
    milestones.push({ days: 90, xp: XP_VALUES.streak90Days, name: 'Quarter Streak' });
  }
  
  const reward = calculateXPReward(baseXP, options);
  
  // Next milestone
  let nextMilestone = null;
  if (days < 7) nextMilestone = { days: 7, daysLeft: 7 - days };
  else if (days < 30) nextMilestone = { days: 30, daysLeft: 30 - days };
  else if (days < 90) nextMilestone = { days: 90, daysLeft: 90 - days };
  
  return {
    ...reward,
    streakDays: days,
    milestones,
    nextMilestone
  };
};

/**
 * Gets XP for unlocking an achievement
 * @param {string} achievementId - Achievement ID
 * @returns {Object} Achievement XP info
 */
export const getAchievementXP = (achievementId) => {
  const achievement = XP_ACHIEVEMENTS[achievementId];
  
  if (!achievement) {
    return { xp: 0, name: 'Unknown Achievement', exists: false };
  }
  
  return {
    xp: achievement.xp,
    name: achievement.name,
    exists: true,
    achievementId
  };
};

/**
 * Calculates total XP from multiple achievements
 * @param {string[]} achievementIds - Array of achievement IDs
 * @returns {Object} Total achievement XP
 */
export const calculateAchievementsXP = (achievementIds) => {
  if (!Array.isArray(achievementIds)) return { totalXP: 0, achievements: [] };
  
  const achievements = achievementIds
    .map(id => getAchievementXP(id))
    .filter(a => a.exists);
  
  const totalXP = achievements.reduce((sum, a) => sum + a.xp, 0);
  
  return {
    totalXP,
    achievementCount: achievements.length,
    achievements
  };
};

// =============================================================================
// PROGRESS PROJECTIONS
// =============================================================================

/**
 * Projects time to reach target level
 * @param {number} currentXP - Current total XP
 * @param {number} targetLevel - Target level
 * @param {number} dailyXP - Estimated daily XP gain
 * @returns {Object} Projection
 */
export const projectTimeToLevel = (currentXP, targetLevel, dailyXP = 100) => {
  const xp = Number(currentXP) || 0;
  const target = Number(targetLevel) || 1;
  const daily = Number(dailyXP) || 100;
  
  const currentLevel = getLevelFromXP(xp);
  
  if (currentLevel.level >= target) {
    return {
      currentLevel: currentLevel.level,
      targetLevel: target,
      alreadyReached: true,
      daysNeeded: 0,
      xpNeeded: 0
    };
  }
  
  const targetXP = getTotalXPForLevel(target);
  const xpNeeded = targetXP - xp;
  const daysNeeded = Math.ceil(xpNeeded / daily);
  
  return {
    currentLevel: currentLevel.level,
    currentXP: xp,
    targetLevel: target,
    targetXP,
    xpNeeded,
    dailyXP: daily,
    daysNeeded,
    weeksNeeded: Math.ceil(daysNeeded / 7),
    estimatedDate: new Date(Date.now() + daysNeeded * 24 * 60 * 60 * 1000),
    alreadyReached: false
  };
};

/**
 * Estimates XP gain from completing remaining content
 * @param {number} currentStage - Current stage
 * @param {number} currentMission - Current mission
 * @param {Object} options - Options
 * @returns {Object} XP estimate
 */
export const estimateRemainingXP = (currentStage, currentMission, options = {}) => {
  const { targetStage = 35 } = options;
  const stage = Number(currentStage) || 1;
  const mission = Number(currentMission) || 1;
  const target = Number(targetStage) || 35;
  
  let totalXP = 0;
  const breakdown = [];
  
  // Remaining missions in current stage
  const missionsLeftInStage = 5 - mission;
  if (missionsLeftInStage > 0) {
    const xp = missionsLeftInStage * (XP_VALUES.mission + 5 * XP_VALUES.checkpoint);
    totalXP += xp;
    breakdown.push({ 
      type: 'Remaining missions (Stage ' + stage + ')', 
      count: missionsLeftInStage,
      xp 
    });
  }
  
  // Complete stages remaining
  for (let s = stage + 1; s <= target; s++) {
    const stageXP = XP_VALUES.stage + (s - 1) * 10; // Stage difficulty bonus
    const missionXP = 5 * (XP_VALUES.mission + 5 * XP_VALUES.checkpoint);
    const stageTotal = stageXP + missionXP;
    
    totalXP += stageTotal;
    breakdown.push({
      type: `Stage ${s}`,
      stageXP,
      missionXP,
      xp: stageTotal
    });
  }
  
  return {
    currentStage: stage,
    currentMission: mission,
    targetStage: target,
    totalXP,
    breakdown
  };
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Constants
  XP_VALUES,
  LEVEL_CONFIG,
  LEVEL_TITLES,
  XP_MULTIPLIERS,
  XP_ACHIEVEMENTS,
  
  // Level calculations
  getXPForLevel,
  getTotalXPForLevel,
  getLevelFromXP,
  getLevelTitle,
  getLevelCapForAdventure,
  
  // XP reward calculations
  calculateXPReward,
  calculateCheckpointXP,
  calculateMissionXP,
  calculateStageXP,
  calculateAdventureXP,
  
  // Streak and achievements
  calculateStreakXP,
  getAchievementXP,
  calculateAchievementsXP,
  
  // Projections
  projectTimeToLevel,
  estimateRemainingXP
};