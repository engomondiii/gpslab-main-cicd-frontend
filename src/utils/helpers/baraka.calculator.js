/* ============================================
   GPS LAB - Baraka Calculator
   Baraka earning and distribution calculations
   ============================================ */

/**
 * Baraka earning rates by stage
 */
export const BarakaRates = {
  // GPS 101 (Stages 1-5) - Red Beacon
  STAGE_1_5: 100,
  
  // GPS Prep (Stages 6-10) - Orange Beacon
  STAGE_6_10: 200,
  
  // GPS Simulation (Stages 11-15) - Yellow Beacon
  STAGE_11_15: 300,
  
  // GPS Capstone 1 (Stages 16-20) - Green Beacon
  STAGE_16_20: 500,
  
  // GPS Capstone 2 (Stages 21-25) - Blue Beacon
  STAGE_21_25: 800,
  
  // Venture Acceleration (Stages 26-30) - Indigo Beacon
  STAGE_26_30: 1200,
  
  // Venture Capitalization (Stages 31-35) - Purple Beacon
  STAGE_31_35: 2000,
};

/**
 * Covenant economy return rate (50%)
 */
export const COVENANT_RETURN_RATE = 0.5;

/**
 * Calculate Baraka earned for completing a mission
 * @param {number} stageNumber - Stage number (1-35)
 * @param {number} multiplier - Additional multiplier (default: 1)
 * @returns {number} Baraka earned
 */
export const calculateMissionBaraka = (stageNumber, multiplier = 1) => {
  let baseRate = 0;

  if (stageNumber >= 1 && stageNumber <= 5) {
    baseRate = BarakaRates.STAGE_1_5;
  } else if (stageNumber >= 6 && stageNumber <= 10) {
    baseRate = BarakaRates.STAGE_6_10;
  } else if (stageNumber >= 11 && stageNumber <= 15) {
    baseRate = BarakaRates.STAGE_11_15;
  } else if (stageNumber >= 16 && stageNumber <= 20) {
    baseRate = BarakaRates.STAGE_16_20;
  } else if (stageNumber >= 21 && stageNumber <= 25) {
    baseRate = BarakaRates.STAGE_21_25;
  } else if (stageNumber >= 26 && stageNumber <= 30) {
    baseRate = BarakaRates.STAGE_26_30;
  } else if (stageNumber >= 31 && stageNumber <= 35) {
    baseRate = BarakaRates.STAGE_31_35;
  }

  return Math.floor(baseRate * multiplier);
};

/**
 * Calculate Baraka earned for completing a bite
 * @param {number} stageNumber - Stage number
 * @param {string} difficulty - Bite difficulty ('easy', 'medium', 'hard')
 * @returns {number} Baraka earned
 */
export const calculateBiteBaraka = (stageNumber, difficulty = 'medium') => {
  const missionBase = calculateMissionBaraka(stageNumber);
  
  const difficultyMultipliers = {
    easy: 0.2,
    medium: 0.3,
    hard: 0.5,
  };

  const multiplier = difficultyMultipliers[difficulty] || difficultyMultipliers.medium;
  return Math.floor(missionBase * multiplier);
};

/**
 * Calculate Baraka earned for passing a checkpoint
 * @param {number} stageNumber - Stage number
 * @param {number} score - Checkpoint score (0-100)
 * @returns {number} Baraka earned
 */
export const calculateCheckpointBaraka = (stageNumber, score) => {
  const missionBase = calculateMissionBaraka(stageNumber);
  
  // Bonus based on score
  let bonus = 1.0;
  if (score >= 90) {
    bonus = 2.0; // Perfect performance
  } else if (score >= 80) {
    bonus = 1.5; // Excellent
  } else if (score >= 70) {
    bonus = 1.0; // Good
  } else {
    bonus = 0.5; // Just passed
  }

  return Math.floor(missionBase * bonus);
};

/**
 * Calculate covenant return (50% return on spent Baraka)
 * @param {number} barakaSpent - Amount of Baraka spent
 * @returns {Object} Breakdown of covenant return
 */
export const calculateCovenantReturn = (barakaSpent) => {
  const returned = Math.floor(barakaSpent * COVENANT_RETURN_RATE);
  const total = barakaSpent + returned;

  return {
    spent: barakaSpent,
    returned: returned,
    total: total,
    returnRate: COVENANT_RETURN_RATE,
  };
};

/**
 * Calculate Baraka for helping a party member
 * @param {number} stageNumber - Stage number
 * @param {string} helpType - Type of help ('review', 'mentor', 'collaborate')
 * @returns {number} Baraka earned
 */
export const calculateHelpBaraka = (stageNumber, helpType = 'review') => {
  const missionBase = calculateMissionBaraka(stageNumber);
  
  const helpMultipliers = {
    review: 0.1,      // Quick bite review
    mentor: 0.3,      // Mentoring session
    collaborate: 0.2, // Collaborative work
  };

  const multiplier = helpMultipliers[helpType] || helpMultipliers.review;
  return Math.floor(missionBase * multiplier);
};

/**
 * Calculate Baraka bonus for early completion
 * @param {number} baseBaraka - Base Baraka earned
 * @param {number} daysAhead - Number of days completed ahead of deadline
 * @returns {number} Bonus Baraka
 */
export const calculateEarlyCompletionBonus = (baseBaraka, daysAhead) => {
  if (daysAhead <= 0) return 0;
  
  // 5% bonus per day, max 50%
  const bonusPercentage = Math.min(daysAhead * 0.05, 0.5);
  return Math.floor(baseBaraka * bonusPercentage);
};

/**
 * Calculate Baraka bonus for streak
 * @param {number} baseBaraka - Base Baraka earned
 * @param {number} streakDays - Number of consecutive days
 * @returns {number} Bonus Baraka
 */
export const calculateStreakBonus = (baseBaraka, streakDays) => {
  if (streakDays < 3) return 0;
  
  // 2% bonus per day of streak, max 100%
  const bonusPercentage = Math.min((streakDays - 2) * 0.02, 1.0);
  return Math.floor(baseBaraka * bonusPercentage);
};

/**
 * Calculate total Baraka with all bonuses
 * @param {Object} params - Calculation parameters
 * @returns {Object} Detailed breakdown
 */
export const calculateTotalBaraka = (params) => {
  const {
    stageNumber,
    activityType, // 'mission', 'bite', 'checkpoint', 'help'
    difficulty,
    score,
    helpType,
    daysAhead = 0,
    streakDays = 0,
    multiplier = 1,
  } = params;

  let baseBaraka = 0;

  // Calculate base Baraka based on activity type
  switch (activityType) {
    case 'mission':
      baseBaraka = calculateMissionBaraka(stageNumber, multiplier);
      break;
    case 'bite':
      baseBaraka = calculateBiteBaraka(stageNumber, difficulty);
      break;
    case 'checkpoint':
      baseBaraka = calculateCheckpointBaraka(stageNumber, score);
      break;
    case 'help':
      baseBaraka = calculateHelpBaraka(stageNumber, helpType);
      break;
    default:
      baseBaraka = calculateMissionBaraka(stageNumber, multiplier);
  }

  // Calculate bonuses
  const earlyBonus = calculateEarlyCompletionBonus(baseBaraka, daysAhead);
  const streakBonus = calculateStreakBonus(baseBaraka, streakDays);

  // Total
  const total = baseBaraka + earlyBonus + streakBonus;

  return {
    base: baseBaraka,
    earlyCompletionBonus: earlyBonus,
    streakBonus: streakBonus,
    total: total,
    breakdown: {
      stageNumber,
      activityType,
      daysAhead,
      streakDays,
    },
  };
};

/**
 * Calculate Baraka needed for next milestone
 * @param {number} currentBaraka - Current Baraka balance
 * @param {number} milestone - Milestone amount
 * @returns {Object} Progress to milestone
 */
export const calculateMilestoneProgress = (currentBaraka, milestone) => {
  const needed = Math.max(0, milestone - currentBaraka);
  const progress = milestone > 0 ? (currentBaraka / milestone) * 100 : 0;

  return {
    current: currentBaraka,
    milestone: milestone,
    needed: needed,
    progress: Math.min(progress, 100),
    achieved: currentBaraka >= milestone,
  };
};

/**
 * Calculate Baraka tier based on total earned
 * @param {number} totalBaraka - Total Baraka earned (lifetime)
 * @returns {Object} Baraka tier information
 */
export const calculateBarakaTier = (totalBaraka) => {
  const tiers = [
    { name: 'Base', color: 'baraka-base', min: 0, max: 5000 },
    { name: 'Green', color: 'baraka-green', min: 5000, max: 20000 },
    { name: 'Blue', color: 'baraka-blue', min: 20000, max: 50000 },
    { name: 'Indigo', color: 'baraka-indigo', min: 50000, max: 100000 },
    { name: 'Purple', color: 'baraka-purple', min: 100000, max: 250000 },
    { name: 'Black', color: 'baraka-black', min: 250000, max: Infinity },
  ];

  const currentTier = tiers.find(tier => totalBaraka >= tier.min && totalBaraka < tier.max);
  const nextTierIndex = tiers.findIndex(tier => tier === currentTier) + 1;
  const nextTier = nextTierIndex < tiers.length ? tiers[nextTierIndex] : null;

  return {
    current: currentTier,
    next: nextTier,
    progress: nextTier 
      ? ((totalBaraka - currentTier.min) / (nextTier.min - currentTier.min)) * 100 
      : 100,
  };
};

/**
 * Estimate Baraka needed for withdrawal
 * @param {number} usdAmount - USD amount to withdraw
 * @param {number} conversionRate - Baraka to USD rate
 * @returns {number} Baraka needed
 */
export const calculateWithdrawalAmount = (usdAmount, conversionRate = 100) => {
  // conversionRate: how many Baraka = 1 USD
  return Math.ceil(usdAmount * conversionRate);
};

/**
 * Calculate party Baraka distribution
 * @param {number} totalBaraka - Total Baraka earned by party
 * @param {Array} members - Party members with contribution percentages
 * @returns {Array} Distribution breakdown
 */
export const distributePartyBaraka = (totalBaraka, members) => {
  const totalContribution = members.reduce((sum, member) => sum + member.contribution, 0);

  return members.map(member => {
    const percentage = totalContribution > 0 ? member.contribution / totalContribution : 0;
    const amount = Math.floor(totalBaraka * percentage);

    return {
      memberId: member.id,
      memberName: member.name,
      contribution: member.contribution,
      percentage: percentage * 100,
      barakaEarned: amount,
    };
  });
};

export default {
  BarakaRates,
  COVENANT_RETURN_RATE,
  calculateMissionBaraka,
  calculateBiteBaraka,
  calculateCheckpointBaraka,
  calculateCovenantReturn,
  calculateHelpBaraka,
  calculateEarlyCompletionBonus,
  calculateStreakBonus,
  calculateTotalBaraka,
  calculateMilestoneProgress,
  calculateBarakaTier,
  calculateWithdrawalAmount,
  distributePartyBaraka,
};