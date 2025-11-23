/* ============================================
   GPS LAB - Character Calculator
   Character badge calculations and tracking
   ============================================ */

/**
 * 35 Character badges aligned with stages
 */
export const CharacterBadges = {
  // GPS 101 (Red Beacon) - Stages 1-5
  1: { name: 'Courage', points: 0, description: 'Face challenges with bravery' },
  2: { name: 'Humility', points: 0, description: 'Recognize your limitations and seek help' },
  3: { name: 'Integrity', points: 0, description: 'Do the right thing, even when no one is watching' },
  4: { name: 'Excellence', points: 0, description: 'Pursue quality in all you do' },
  5: { name: 'Compassion', points: 0, description: 'Show empathy and care for others' },

  // GPS Prep (Orange Beacon) - Stages 6-10
  6: { name: 'Wisdom', points: 0, description: 'Apply knowledge with discernment' },
  7: { name: 'Stewardship', points: 0, description: 'Manage resources responsibly' },
  8: { name: 'Resilience', points: 0, description: 'Bounce back from setbacks' },
  9: { name: 'Diligence', points: 0, description: 'Work persistently toward goals' },
  10: { name: 'Generosity', points: 0, description: 'Give freely of your time and talents' },

  // GPS Simulation (Yellow Beacon) - Stages 11-15
  11: { name: 'Innovation', points: 0, description: 'Create novel solutions' },
  12: { name: 'Collaboration', points: 0, description: 'Work effectively with others' },
  13: { name: 'Perseverance', points: 0, description: 'Keep going despite difficulties' },
  14: { name: 'Gratitude', points: 0, description: 'Appreciate what you have' },
  15: { name: 'Accountability', points: 0, description: 'Take ownership of your actions' },

  // GPS Capstone 1 (Green Beacon) - Stages 16-20
  16: { name: 'Leadership', points: 0, description: 'Guide and inspire others' },
  17: { name: 'Service', points: 0, description: 'Put others needs before your own' },
  18: { name: 'Vision', points: 0, description: 'See possibilities others miss' },
  19: { name: 'Justice', points: 0, description: 'Stand up for what is right' },
  20: { name: 'Hope', points: 0, description: 'Maintain optimism in tough times' },

  // GPS Capstone 2 (Blue Beacon) - Stages 21-25
  21: { name: 'Patience', points: 0, description: 'Wait calmly for results' },
  22: { name: 'Faithfulness', points: 0, description: 'Remain loyal and committed' },
  23: { name: 'Courage (Advanced)', points: 0, description: 'Take bigger risks for bigger rewards' },
  24: { name: 'Creativity', points: 0, description: 'Think outside the box' },
  25: { name: 'Adaptability', points: 0, description: 'Adjust to changing circumstances' },

  // Venture Acceleration (Indigo Beacon) - Stages 26-30
  26: { name: 'Strategic Thinking', points: 0, description: 'Plan multiple steps ahead' },
  27: { name: 'Entrepreneurship', points: 0, description: 'Identify and seize opportunities' },
  28: { name: 'Influence', points: 0, description: 'Persuade and motivate others' },
  29: { name: 'Risk Management', points: 0, description: 'Balance opportunity and caution' },
  30: { name: 'Mentorship', points: 0, description: 'Guide the next generation' },

  // Venture Capitalization (Purple Beacon) - Stages 31-35
  31: { name: 'Impact', points: 0, description: 'Create lasting change' },
  32: { name: 'Scale', points: 0, description: 'Grow solutions exponentially' },
  33: { name: 'Sustainability', points: 0, description: 'Build for the long term' },
  34: { name: 'Legacy', points: 0, description: 'Leave something meaningful behind' },
  35: { name: 'Mastery', points: 0, description: 'Achieve expert-level proficiency' },
};

/**
 * Calculate character points earned for an action
 * @param {number} stageNumber - Current stage (1-35)
 * @param {string} actionType - Type of action ('mission', 'checkpoint', 'help', 'praise')
 * @param {Object} actionData - Additional action data
 * @returns {Object} Character points earned
 */
export const calculateCharacterPoints = (stageNumber, actionType, actionData = {}) => {
  const badge = CharacterBadges[stageNumber];
  let points = 0;

  switch (actionType) {
    case 'mission':
      points = 10; // Base points for completing mission
      break;

    case 'checkpoint':
      // Points based on score
      const { score = 0 } = actionData;
      if (score >= 90) {
        points = 20;
      } else if (score >= 80) {
        points = 15;
      } else if (score >= 70) {
        points = 10;
      } else {
        points = 5;
      }
      break;

    case 'help':
      // Points for helping others
      points = 5;
      break;

    case 'praise':
      // Points for giving or receiving praise
      points = 3;
      break;

    case 'perfect_bite':
      // Bonus for perfect bite submission
      points = 5;
      break;

    default:
      points = 0;
  }

  return {
    badge: badge.name,
    stageNumber: stageNumber,
    points: points,
    actionType: actionType,
  };
};

/**
 * Calculate total character badge progress
 * @param {Object} characterProgress - User's character progress (badge name -> points)
 * @returns {Object} Overall character progress
 */
export const calculateCharacterProgress = (characterProgress = {}) => {
  const badges = Object.values(CharacterBadges);
  let totalPoints = 0;
  let earnedBadges = 0;
  const POINTS_PER_BADGE = 100; // Points needed to "earn" a badge

  const badgeProgress = badges.map(badge => {
    const points = characterProgress[badge.name] || 0;
    const isEarned = points >= POINTS_PER_BADGE;
    
    if (isEarned) earnedBadges++;
    totalPoints += points;

    return {
      name: badge.name,
      description: badge.description,
      points: points,
      maxPoints: POINTS_PER_BADGE,
      percentage: Math.min((points / POINTS_PER_BADGE) * 100, 100),
      isEarned: isEarned,
    };
  });

  return {
    badges: badgeProgress,
    totalPoints: totalPoints,
    earnedBadges: earnedBadges,
    totalBadges: badges.length,
    overallPercentage: (earnedBadges / badges.length) * 100,
  };
};

/**
 * Get character badge for current stage
 * @param {number} stageNumber - Current stage (1-35)
 * @returns {Object} Current badge
 */
export const getCurrentStageBadge = (stageNumber) => {
  return CharacterBadges[stageNumber] || null;
};

/**
 * Get badges by beacon phase
 * @param {string} beaconPhase - Beacon phase name
 * @returns {Array} Badges in that phase
 */
export const getBadgesByBeacon = (beaconPhase) => {
  const ranges = {
    'GPS 101': [1, 5],
    'GPS Prep': [6, 10],
    'GPS Simulation': [11, 15],
    'GPS Capstone 1': [16, 20],
    'GPS Capstone 2': [21, 25],
    'Venture Acceleration': [26, 30],
    'Venture Capitalization': [31, 35],
  };

  const [start, end] = ranges[beaconPhase] || [0, 0];
  const badges = [];

  for (let i = start; i <= end; i++) {
    if (CharacterBadges[i]) {
      badges.push({
        stageNumber: i,
        ...CharacterBadges[i],
      });
    }
  }

  return badges;
};

/**
 * Calculate character growth rate
 * @param {Array} pointsHistory - Array of {date, points} objects
 * @returns {Object} Growth rate information
 */
export const calculateCharacterGrowthRate = (pointsHistory) => {
  if (!Array.isArray(pointsHistory) || pointsHistory.length < 2) {
    return {
      daily: 0,
      weekly: 0,
      monthly: 0,
    };
  }

  // Sort by date
  const sorted = pointsHistory.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  const firstEntry = sorted[0];
  const lastEntry = sorted[sorted.length - 1];
  
  const daysDiff = (new Date(lastEntry.date) - new Date(firstEntry.date)) / (1000 * 60 * 60 * 24);
  const pointsDiff = lastEntry.points - firstEntry.points;

  if (daysDiff === 0) {
    return {
      daily: 0,
      weekly: 0,
      monthly: 0,
    };
  }

  const dailyRate = pointsDiff / daysDiff;
  const weeklyRate = dailyRate * 7;
  const monthlyRate = dailyRate * 30;

  return {
    daily: dailyRate.toFixed(2),
    weekly: weeklyRate.toFixed(2),
    monthly: monthlyRate.toFixed(2),
  };
};

/**
 * Get top character strengths
 * @param {Object} characterProgress - User's character progress
 * @param {number} limit - Number of top badges to return
 * @returns {Array} Top character badges
 */
export const getTopCharacterStrengths = (characterProgress = {}, limit = 5) => {
  const entries = Object.entries(characterProgress).map(([name, points]) => {
    const badge = Object.values(CharacterBadges).find(b => b.name === name);
    return {
      name,
      points,
      description: badge ? badge.description : '',
    };
  });

  return entries
    .sort((a, b) => b.points - a.points)
    .slice(0, limit);
};

/**
 * Calculate character completeness
 * @param {Object} characterProgress - User's character progress
 * @returns {Object} Completeness information
 */
export const calculateCharacterCompleteness = (characterProgress = {}) => {
  const totalBadges = Object.keys(CharacterBadges).length;
  const POINTS_PER_BADGE = 100;

  const completedBadges = Object.values(characterProgress).filter(
    points => points >= POINTS_PER_BADGE
  ).length;

  const inProgressBadges = Object.values(characterProgress).filter(
    points => points > 0 && points < POINTS_PER_BADGE
  ).length;

  const notStartedBadges = totalBadges - completedBadges - inProgressBadges;

  return {
    completed: completedBadges,
    inProgress: inProgressBadges,
    notStarted: notStartedBadges,
    total: totalBadges,
    completionPercentage: (completedBadges / totalBadges) * 100,
  };
};

/**
 * Recommend next character focus
 * @param {Object} characterProgress - User's character progress
 * @param {number} currentStage - Current stage number
 * @returns {Object} Recommended badge to focus on
 */
export const recommendNextCharacterFocus = (characterProgress = {}, currentStage) => {
  // Prioritize current stage badge
  const currentBadge = CharacterBadges[currentStage];
  const currentPoints = characterProgress[currentBadge.name] || 0;

  if (currentPoints < 100) {
    return {
      badge: currentBadge,
      reason: 'Current stage focus',
      pointsNeeded: 100 - currentPoints,
    };
  }

  // Find badge with least points that's not maxed
  let minPoints = Infinity;
  let recommendedBadge = null;

  Object.values(CharacterBadges).forEach(badge => {
    const points = characterProgress[badge.name] || 0;
    if (points < 100 && points < minPoints) {
      minPoints = points;
      recommendedBadge = badge;
    }
  });

  return {
    badge: recommendedBadge,
    reason: 'Needs development',
    pointsNeeded: 100 - minPoints,
  };
};

export default {
  CharacterBadges,
  calculateCharacterPoints,
  calculateCharacterProgress,
  getCurrentStageBadge,
  getBadgesByBeacon,
  calculateCharacterGrowthRate,
  getTopCharacterStrengths,
  calculateCharacterCompleteness,
  recommendNextCharacterFocus,
};