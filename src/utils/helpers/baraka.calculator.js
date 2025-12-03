/**
 * GPS Lab Platform - Baraka Calculator
 * 
 * Comprehensive Baraka value calculations for the GPS Lab MMORPG educational platform.
 * Handles Baraka earning, spending, covenant returns, and tier calculations.
 * 
 * Based on the Baraka book documentation and covenant economy principles.
 * 
 * @module utils/helpers/baraka.calculator
 * @version 1.0.0
 */

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Baraka tiers with thresholds and multipliers
 */
export const BARAKA_TIERS = {
  STARTER: {
    name: 'Starter',
    threshold: 0,
    color: '#9ca3af',      // gray
    multiplier: 1.0,
    benefits: ['Basic platform access', 'Standard mission rewards']
  },
  BEGINNER: {
    name: 'Beginner',
    threshold: 1000,
    color: '#f97316',      // orange
    multiplier: 1.05,
    benefits: ['5% bonus on mission rewards', 'Profile badge']
  },
  INTERMEDIATE: {
    name: 'Intermediate',
    threshold: 10000,
    color: '#eab308',      // yellow
    multiplier: 1.10,
    benefits: ['10% bonus on mission rewards', 'Priority support access']
  },
  ADVANCED: {
    name: 'Advanced',
    threshold: 50000,
    color: '#22c55e',      // green
    multiplier: 1.15,
    benefits: ['15% bonus on mission rewards', 'Mentor matching priority']
  },
  EXPERT: {
    name: 'Expert',
    threshold: 100000,
    color: '#3b82f6',      // blue
    multiplier: 1.20,
    benefits: ['20% bonus on mission rewards', 'Exclusive workshops access']
  },
  MASTER: {
    name: 'Master',
    threshold: 500000,
    color: '#8b5cf6',      // purple
    multiplier: 1.25,
    benefits: ['25% bonus on mission rewards', 'TA program eligibility']
  },
  LEGENDARY: {
    name: 'Legendary',
    threshold: 1000000,
    color: '#f59e0b',      // gold
    multiplier: 1.30,
    benefits: ['30% bonus on mission rewards', 'GPS Ambassador status', 'Revenue sharing eligibility']
  }
};

/**
 * XP to Baraka conversion rates by action type
 */
export const XP_TO_BARAKA_RATES = {
  checkpoint: 5,       // 5 XP per checkpoint = 1 Baraka
  mission: 25,         // 25 XP per mission = 5 Baraka
  stage: 100,          // 100 XP per stage = 25 Baraka
  bonus: 50            // 50 XP bonus = 10 Baraka
};

/**
 * Baraka rewards by activity type
 */
export const BARAKA_REWARDS = {
  // Mission completion
  checkpointComplete: 1,
  missionComplete: 5,
  stageComplete: 25,
  adventureComplete: 100,
  
  // Quality bonuses
  perfectCheckpoint: 2,        // All criteria exceeded
  speedBonus: 1,               // Completed ahead of schedule
  consistencyBonus: 3,         // 7-day streak
  
  // Social rewards
  helpingOthers: 2,
  receivingHonor: 1,           // Per "Honor the One and Only" received
  givingHonor: 0.5,            // Per honor given (encourages recognition)
  partyContribution: 5,        // For party mission success
  
  // Content creation
  submittingEvidence: 1,
  qualityEvidence: 3,          // High-quality submission bonus
  
  // Milestones
  firstMission: 10,
  firstStage: 50,
  tenMissions: 25,
  hundredCheckpoints: 100
};

/**
 * Baraka spending costs
 */
export const BARAKA_COSTS = {
  // Retry rights
  standardRetry: 50,           // Standard mission retry
  pr2rActivation: 100,         // Provisional R2R activation
  r2rConversion: 200,          // Convert pR2R to full R2R
  
  // Marketplace
  minPSBPurchase: 100,         // Minimum for PSB purchase
  featuredListingFee: 50,      // To feature listing
  
  // Premium features
  extraMentorSession: 500,
  customBadgeRequest: 1000,
  priorityReview: 250
};

/**
 * Covenant return rate (50% of all payments)
 */
export const COVENANT_RETURN_RATE = 0.50;

/**
 * Covenant return distribution
 */
export const COVENANT_DISTRIBUTION = {
  taSupport: 0.30,       // 30% for TA support
  dataSubsidy: 0.20,     // 20% for data/internet subsidy
  deviceSubsidy: 0.20,   // 20% for device subsidy
  missionCredits: 0.30   // 30% for mission credits
};

/**
 * Baraka issuance schedule by stage
 */
export const BARAKA_ISSUANCE_SCHEDULE = {
  // Stage ranges and cumulative issuance caps
  1: { cap: 0, cumulative: 0 },           // GPO Call - no issuance
  2: { cap: 5000, cumulative: 5000 },     // GPS 101
  6: { cap: 15000, cumulative: 20000 },   // GPS Prep
  11: { cap: 80000, cumulative: 100000 }, // GPS Simulation
  16: { cap: 250000, cumulative: 350000 },// GPS Capstone 1
  21: { cap: 250000, cumulative: 600000 },// GPS Capstone 2
  26: { cap: 200000, cumulative: 800000 },// Venture Acceleration
  31: { cap: 200000, cumulative: 1000000 }// Venture Capitalization
};

// =============================================================================
// TIER CALCULATIONS
// =============================================================================

/**
 * Gets Baraka tier for a balance
 * @param {number} balance - Baraka balance
 * @returns {Object} Tier information
 */
export const getBarakaTier = (balance) => {
  const amount = Number(balance) || 0;
  
  // Check tiers in descending order
  const tiers = Object.entries(BARAKA_TIERS)
    .sort((a, b) => b[1].threshold - a[1].threshold);
  
  for (const [key, tier] of tiers) {
    if (amount >= tier.threshold) {
      return {
        key,
        ...tier,
        balance: amount
      };
    }
  }
  
  return { key: 'STARTER', ...BARAKA_TIERS.STARTER, balance: amount };
};

/**
 * Gets next tier information
 * @param {number} balance - Current balance
 * @returns {Object|null} Next tier info or null if at max
 */
export const getNextTier = (balance) => {
  const amount = Number(balance) || 0;
  const currentTier = getBarakaTier(amount);
  
  const tiers = Object.entries(BARAKA_TIERS)
    .sort((a, b) => a[1].threshold - b[1].threshold);
  
  for (const [key, tier] of tiers) {
    if (tier.threshold > amount) {
      return {
        key,
        ...tier,
        needed: tier.threshold - amount,
        progress: (amount / tier.threshold) * 100
      };
    }
  }
  
  return null; // Already at max tier
};

/**
 * Calculates progress to next tier
 * @param {number} balance - Current balance
 * @returns {Object} Progress information
 */
export const calculateTierProgress = (balance) => {
  const amount = Number(balance) || 0;
  const currentTier = getBarakaTier(amount);
  const nextTier = getNextTier(amount);
  
  if (!nextTier) {
    return {
      currentTier,
      nextTier: null,
      progress: 100,
      needed: 0,
      isMaxTier: true
    };
  }
  
  const rangeStart = currentTier.threshold;
  const rangeEnd = nextTier.threshold;
  const progressInRange = amount - rangeStart;
  const rangeSize = rangeEnd - rangeStart;
  const progress = (progressInRange / rangeSize) * 100;
  
  return {
    currentTier,
    nextTier,
    progress: Math.min(100, Math.max(0, progress)),
    needed: nextTier.needed,
    isMaxTier: false
  };
};

// =============================================================================
// REWARD CALCULATIONS
// =============================================================================

/**
 * Calculates Baraka reward with tier multiplier
 * @param {number} baseReward - Base reward amount
 * @param {number} balance - User's Baraka balance
 * @returns {Object} Reward calculation
 */
export const calculateReward = (baseReward, balance) => {
  const tier = getBarakaTier(balance);
  const multiplier = tier.multiplier;
  const finalReward = Math.floor(baseReward * multiplier);
  const bonusAmount = finalReward - baseReward;
  
  return {
    baseReward,
    multiplier,
    bonusAmount,
    finalReward,
    tier: tier.name
  };
};

/**
 * Calculates checkpoint completion reward
 * @param {Object} options - Options
 * @param {number} options.balance - User's Baraka balance
 * @param {boolean} options.isPerfect - Perfect completion
 * @param {boolean} options.isAheadOfSchedule - Completed early
 * @returns {Object} Reward breakdown
 */
export const calculateCheckpointReward = (options = {}) => {
  const { balance = 0, isPerfect = false, isAheadOfSchedule = false } = options;
  
  let baseReward = BARAKA_REWARDS.checkpointComplete;
  const bonuses = [];
  
  if (isPerfect) {
    baseReward += BARAKA_REWARDS.perfectCheckpoint;
    bonuses.push({ type: 'Perfect Completion', amount: BARAKA_REWARDS.perfectCheckpoint });
  }
  
  if (isAheadOfSchedule) {
    baseReward += BARAKA_REWARDS.speedBonus;
    bonuses.push({ type: 'Speed Bonus', amount: BARAKA_REWARDS.speedBonus });
  }
  
  const reward = calculateReward(baseReward, balance);
  
  return {
    ...reward,
    bonuses,
    xpEquivalent: baseReward * XP_TO_BARAKA_RATES.checkpoint
  };
};

/**
 * Calculates mission completion reward
 * @param {Object} options - Options
 * @param {number} options.balance - User's Baraka balance
 * @param {number} options.checkpointsCompleted - Number of checkpoints
 * @param {number} options.perfectCheckpoints - Number of perfect checkpoints
 * @param {boolean} options.isPartyMission - Party mission
 * @returns {Object} Reward breakdown
 */
export const calculateMissionReward = (options = {}) => {
  const { 
    balance = 0, 
    checkpointsCompleted = 5, 
    perfectCheckpoints = 0,
    isPartyMission = false 
  } = options;
  
  let baseReward = BARAKA_REWARDS.missionComplete;
  const bonuses = [];
  
  // Checkpoint rewards accumulated
  const checkpointRewards = checkpointsCompleted * BARAKA_REWARDS.checkpointComplete;
  const perfectBonus = perfectCheckpoints * BARAKA_REWARDS.perfectCheckpoint;
  
  if (perfectBonus > 0) {
    bonuses.push({ type: 'Perfect Checkpoints', amount: perfectBonus });
  }
  
  if (isPartyMission) {
    baseReward += BARAKA_REWARDS.partyContribution;
    bonuses.push({ type: 'Party Contribution', amount: BARAKA_REWARDS.partyContribution });
  }
  
  const totalBase = baseReward + checkpointRewards + perfectBonus;
  const reward = calculateReward(totalBase, balance);
  
  return {
    ...reward,
    bonuses,
    breakdown: {
      missionBonus: baseReward,
      checkpointRewards,
      perfectBonus
    }
  };
};

/**
 * Calculates stage completion reward
 * @param {Object} options - Options
 * @param {number} options.balance - User's Baraka balance
 * @param {number} options.stageNumber - Stage number
 * @param {number} options.missionsCompleted - Missions completed
 * @returns {Object} Reward breakdown
 */
export const calculateStageReward = (options = {}) => {
  const { balance = 0, stageNumber = 1, missionsCompleted = 5 } = options;
  
  let baseReward = BARAKA_REWARDS.stageComplete;
  const bonuses = [];
  
  // Stage difficulty scaling (later stages worth more)
  const difficultyMultiplier = 1 + (stageNumber - 1) * 0.05;
  baseReward = Math.floor(baseReward * difficultyMultiplier);
  
  bonuses.push({ 
    type: 'Stage Difficulty', 
    amount: baseReward - BARAKA_REWARDS.stageComplete,
    multiplier: difficultyMultiplier
  });
  
  const reward = calculateReward(baseReward, balance);
  
  return {
    ...reward,
    bonuses,
    stageNumber,
    difficultyMultiplier
  };
};

/**
 * Calculates streak bonus
 * @param {number} streakDays - Consecutive days
 * @param {number} balance - User's Baraka balance
 * @returns {Object} Streak bonus
 */
export const calculateStreakBonus = (streakDays, balance = 0) => {
  // Bonus every 7 days
  const bonusCount = Math.floor(streakDays / 7);
  const baseBonus = bonusCount * BARAKA_REWARDS.consistencyBonus;
  
  // Milestone bonuses
  let milestoneBonus = 0;
  if (streakDays >= 30) milestoneBonus += 10;
  if (streakDays >= 60) milestoneBonus += 20;
  if (streakDays >= 90) milestoneBonus += 30;
  
  const totalBase = baseBonus + milestoneBonus;
  const reward = calculateReward(totalBase, balance);
  
  return {
    ...reward,
    streakDays,
    weeklyBonuses: bonusCount,
    milestoneBonus,
    nextBonusAt: (bonusCount + 1) * 7 - streakDays
  };
};

// =============================================================================
// SPENDING CALCULATIONS
// =============================================================================

/**
 * Checks if user can afford a purchase
 * @param {number} balance - User's Baraka balance
 * @param {number} cost - Cost of item
 * @returns {Object} Affordability check
 */
export const canAfford = (balance, cost) => {
  const amount = Number(balance) || 0;
  const price = Number(cost) || 0;
  
  return {
    canAfford: amount >= price,
    balance: amount,
    cost: price,
    remaining: amount - price,
    shortfall: Math.max(0, price - amount)
  };
};

/**
 * Calculates retry cost
 * @param {number} attemptNumber - Which attempt (1 = first retry)
 * @returns {Object} Retry cost info
 */
export const calculateRetryCost = (attemptNumber) => {
  // Cost increases with attempts
  const baseMultiplier = Math.pow(1.5, attemptNumber - 1);
  const cost = Math.floor(BARAKA_COSTS.standardRetry * baseMultiplier);
  
  return {
    attemptNumber,
    cost,
    multiplier: baseMultiplier,
    isFreeFirst: attemptNumber === 0
  };
};

/**
 * Calculates pR2R activation cost
 * @param {number} missionsRemaining - Missions left in stage
 * @returns {Object} pR2R cost info
 */
export const calculatePR2RCost = (missionsRemaining = 5) => {
  // Cost scales with missions remaining (more missions = more value)
  const scaleFactor = missionsRemaining / 5;
  const cost = Math.floor(BARAKA_COSTS.pr2rActivation * scaleFactor);
  
  return {
    cost,
    missionsRemaining,
    scaleFactor,
    conversionCost: BARAKA_COSTS.r2rConversion,
    totalToR2R: cost + BARAKA_COSTS.r2rConversion
  };
};

// =============================================================================
// COVENANT ECONOMY CALCULATIONS
// =============================================================================

/**
 * Calculates covenant return from payment
 * @param {number} paymentAmount - Total payment in USD
 * @returns {Object} Covenant return breakdown
 */
export const calculateCovenantReturn = (paymentAmount) => {
  const amount = Number(paymentAmount) || 0;
  const returnAmount = amount * COVENANT_RETURN_RATE;
  
  const distribution = {
    taSupport: returnAmount * COVENANT_DISTRIBUTION.taSupport,
    dataSubsidy: returnAmount * COVENANT_DISTRIBUTION.dataSubsidy,
    deviceSubsidy: returnAmount * COVENANT_DISTRIBUTION.deviceSubsidy,
    missionCredits: returnAmount * COVENANT_DISTRIBUTION.missionCredits
  };
  
  return {
    paymentAmount: amount,
    returnRate: COVENANT_RETURN_RATE,
    returnAmount,
    netPayment: amount - returnAmount,
    distribution,
    distributionPercentages: COVENANT_DISTRIBUTION
  };
};

/**
 * Calculates subscription covenant value
 * @param {string} tier - Subscription tier
 * @param {boolean} isAnnual - Annual billing
 * @returns {Object} Subscription covenant breakdown
 */
export const calculateSubscriptionCovenant = (tier, isAnnual = false) => {
  const pricing = {
    FREE: 0,
    CONTENDER: 19,
    PATHFINDER: 49,
    NAVIGATORS_CIRCLE: 149
  };
  
  const monthlyPrice = pricing[tier] || 0;
  const annualDiscount = 0.17; // ~2 months free
  
  const effectiveMonthly = isAnnual ? monthlyPrice * (1 - annualDiscount) : monthlyPrice;
  const annualTotal = isAnnual ? effectiveMonthly * 12 : monthlyPrice * 12;
  
  const monthlyReturn = calculateCovenantReturn(effectiveMonthly);
  const annualReturn = calculateCovenantReturn(annualTotal);
  
  return {
    tier,
    isAnnual,
    monthlyPrice,
    effectiveMonthly,
    annualTotal,
    monthlyReturn,
    annualReturn,
    savings: isAnnual ? monthlyPrice * 12 * annualDiscount : 0
  };
};

// =============================================================================
// BARAKA ISSUANCE CALCULATIONS
// =============================================================================

/**
 * Gets Baraka issuance cap for a stage
 * @param {number} stageNumber - Stage number (1-35)
 * @returns {Object} Issuance info
 */
export const getBarakaIssuanceCap = (stageNumber) => {
  const stage = Number(stageNumber) || 1;
  
  // Find applicable issuance schedule entry
  const stageKeys = Object.keys(BARAKA_ISSUANCE_SCHEDULE)
    .map(Number)
    .sort((a, b) => b - a);
  
  for (const key of stageKeys) {
    if (stage >= key) {
      const schedule = BARAKA_ISSUANCE_SCHEDULE[key];
      return {
        stageNumber: stage,
        adventureStart: key,
        cap: schedule.cap,
        cumulative: schedule.cumulative
      };
    }
  }
  
  return {
    stageNumber: stage,
    adventureStart: 1,
    cap: 0,
    cumulative: 0
  };
};

/**
 * Calculates total potential Baraka earnings
 * @param {number} currentStage - Current stage
 * @param {number} targetStage - Target stage
 * @returns {Object} Potential earnings
 */
export const calculatePotentialEarnings = (currentStage, targetStage = 35) => {
  const current = Number(currentStage) || 1;
  const target = Number(targetStage) || 35;
  
  let totalPotential = 0;
  const breakdown = [];
  
  for (let stage = current; stage <= target; stage++) {
    const stageReward = BARAKA_REWARDS.stageComplete * (1 + (stage - 1) * 0.05);
    const missionRewards = 5 * BARAKA_REWARDS.missionComplete;
    const checkpointRewards = 25 * BARAKA_REWARDS.checkpointComplete;
    
    const stageTotal = Math.floor(stageReward + missionRewards + checkpointRewards);
    totalPotential += stageTotal;
    
    breakdown.push({
      stage,
      stageReward: Math.floor(stageReward),
      missionRewards,
      checkpointRewards,
      total: stageTotal
    });
  }
  
  return {
    currentStage: current,
    targetStage: target,
    stagesRemaining: target - current + 1,
    totalPotential,
    breakdown
  };
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Constants
  BARAKA_TIERS,
  XP_TO_BARAKA_RATES,
  BARAKA_REWARDS,
  BARAKA_COSTS,
  COVENANT_RETURN_RATE,
  COVENANT_DISTRIBUTION,
  BARAKA_ISSUANCE_SCHEDULE,
  
  // Tier calculations
  getBarakaTier,
  getNextTier,
  calculateTierProgress,
  
  // Reward calculations
  calculateReward,
  calculateCheckpointReward,
  calculateMissionReward,
  calculateStageReward,
  calculateStreakBonus,
  
  // Spending calculations
  canAfford,
  calculateRetryCost,
  calculatePR2RCost,
  
  // Covenant economy
  calculateCovenantReturn,
  calculateSubscriptionCovenant,
  
  // Issuance
  getBarakaIssuanceCap,
  calculatePotentialEarnings
};