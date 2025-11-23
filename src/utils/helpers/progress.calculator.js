/* ============================================
   GPS LAB - Progress Calculator
   Progress tracking and calculation utilities
   ============================================ */

/**
 * Calculate percentage progress
 * @param {number} current - Current value
 * @param {number} total - Total value
 * @returns {number} Percentage (0-100)
 */
export const calculatePercentage = (current, total) => {
  if (total === 0) return 0;
  const percentage = (current / total) * 100;
  return Math.min(Math.max(percentage, 0), 100);
};

/**
 * Calculate mission progress
 * @param {number} completedBites - Number of completed bites
 * @param {number} totalBites - Total number of bites
 * @returns {Object} Progress information
 */
export const calculateMissionProgress = (completedBites, totalBites) => {
  const percentage = calculatePercentage(completedBites, totalBites);
  const remaining = Math.max(0, totalBites - completedBites);

  return {
    completed: completedBites,
    total: totalBites,
    remaining: remaining,
    percentage: percentage,
    isComplete: completedBites >= totalBites,
  };
};

/**
 * Calculate stage progress (5 missions per stage)
 * @param {number} completedMissions - Number of completed missions in stage
 * @param {number} totalMissions - Total missions in stage (default: 5)
 * @returns {Object} Stage progress
 */
export const calculateStageProgress = (completedMissions, totalMissions = 5) => {
  const percentage = calculatePercentage(completedMissions, totalMissions);
  const remaining = Math.max(0, totalMissions - completedMissions);

  return {
    completed: completedMissions,
    total: totalMissions,
    remaining: remaining,
    percentage: percentage,
    isComplete: completedMissions >= totalMissions,
  };
};

/**
 * Calculate overall GPS program progress (35 stages)
 * @param {number} completedStages - Number of completed stages
 * @param {number} totalStages - Total stages (default: 35)
 * @returns {Object} Program progress
 */
export const calculateProgramProgress = (completedStages, totalStages = 35) => {
  const percentage = calculatePercentage(completedStages, totalStages);
  const remaining = Math.max(0, totalStages - completedStages);

  // Determine current beacon phase
  let beaconPhase = 'GPS 101';
  let beaconColor = 'Red';

  if (completedStages >= 31) {
    beaconPhase = 'Venture Capitalization';
    beaconColor = 'Purple';
  } else if (completedStages >= 26) {
    beaconPhase = 'Venture Acceleration';
    beaconColor = 'Indigo';
  } else if (completedStages >= 21) {
    beaconPhase = 'GPS Capstone 2';
    beaconColor = 'Blue';
  } else if (completedStages >= 16) {
    beaconPhase = 'GPS Capstone 1';
    beaconColor = 'Green';
  } else if (completedStages >= 11) {
    beaconPhase = 'GPS Simulation';
    beaconColor = 'Yellow';
  } else if (completedStages >= 6) {
    beaconPhase = 'GPS Prep';
    beaconColor = 'Orange';
  }

  return {
    completed: completedStages,
    total: totalStages,
    remaining: remaining,
    percentage: percentage,
    isComplete: completedStages >= totalStages,
    beaconPhase: beaconPhase,
    beaconColor: beaconColor,
  };
};

/**
 * Calculate checkpoint score
 * @param {number} pointsEarned - Points earned
 * @param {number} totalPoints - Total possible points
 * @returns {Object} Score information
 */
export const calculateCheckpointScore = (pointsEarned, totalPoints) => {
  const percentage = calculatePercentage(pointsEarned, totalPoints);
  
  let grade = 'F';
  let status = 'Failed';

  if (percentage >= 90) {
    grade = 'A';
    status = 'Excellent';
  } else if (percentage >= 80) {
    grade = 'B';
    status = 'Very Good';
  } else if (percentage >= 70) {
    grade = 'C';
    status = 'Good';
  } else if (percentage >= 60) {
    grade = 'D';
    status = 'Passed';
  }

  return {
    pointsEarned: pointsEarned,
    totalPoints: totalPoints,
    percentage: percentage,
    grade: grade,
    status: status,
    passed: percentage >= 60,
  };
};

/**
 * Calculate time remaining
 * @param {Date|string} deadline - Deadline date
 * @returns {Object} Time remaining information
 */
export const calculateTimeRemaining = (deadline) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffInMs = deadlineDate - now;

  if (diffInMs <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isOverdue: true,
      formatted: 'Overdue',
    };
  }

  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

  let formatted = '';
  if (days > 0) {
    formatted = `${days}d ${hours}h`;
  } else if (hours > 0) {
    formatted = `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    formatted = `${minutes}m ${seconds}s`;
  } else {
    formatted = `${seconds}s`;
  }

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds: Math.floor(diffInMs / 1000),
    isOverdue: false,
    formatted,
  };
};

/**
 * Calculate completion rate
 * @param {number} completed - Number of completed items
 * @param {number} attempted - Number of attempted items
 * @returns {Object} Completion rate information
 */
export const calculateCompletionRate = (completed, attempted) => {
  if (attempted === 0) {
    return {
      completed: 0,
      attempted: 0,
      rate: 0,
      formatted: '0%',
    };
  }

  const rate = (completed / attempted) * 100;

  return {
    completed: completed,
    attempted: attempted,
    rate: rate,
    formatted: `${rate.toFixed(1)}%`,
  };
};

/**
 * Calculate success rate (passed vs attempted)
 * @param {number} passed - Number of passed items
 * @param {number} attempted - Number of attempted items
 * @returns {Object} Success rate information
 */
export const calculateSuccessRate = (passed, attempted) => {
  if (attempted === 0) {
    return {
      passed: 0,
      failed: 0,
      attempted: 0,
      rate: 0,
      formatted: '0%',
    };
  }

  const failed = attempted - passed;
  const rate = (passed / attempted) * 100;

  return {
    passed: passed,
    failed: failed,
    attempted: attempted,
    rate: rate,
    formatted: `${rate.toFixed(1)}%`,
  };
};

/**
 * Calculate average time to complete
 * @param {Array} completionTimes - Array of completion times in seconds
 * @returns {Object} Average time information
 */
export const calculateAverageTime = (completionTimes) => {
  if (!Array.isArray(completionTimes) || completionTimes.length === 0) {
    return {
      average: 0,
      formatted: '0m',
    };
  }

  const total = completionTimes.reduce((sum, time) => sum + time, 0);
  const average = total / completionTimes.length;

  const hours = Math.floor(average / 3600);
  const minutes = Math.floor((average % 3600) / 60);

  let formatted = '';
  if (hours > 0) {
    formatted = `${hours}h ${minutes}m`;
  } else {
    formatted = `${minutes}m`;
  }

  return {
    average: average,
    formatted: formatted,
  };
};

/**
 * Calculate streak
 * @param {Array} dates - Array of activity dates
 * @returns {Object} Streak information
 */
export const calculateStreak = (dates) => {
  if (!Array.isArray(dates) || dates.length === 0) {
    return {
      current: 0,
      longest: 0,
    };
  }

  // Sort dates in descending order
  const sortedDates = dates
    .map(date => new Date(date).setHours(0, 0, 0, 0))
    .sort((a, b) => b - a);

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = today - (24 * 60 * 60 * 1000);

  // Check if there's activity today or yesterday for current streak
  if (sortedDates[0] === today || sortedDates[0] === yesterday) {
    currentStreak = 1;

    // Calculate current streak
    for (let i = 1; i < sortedDates.length; i++) {
      const diff = sortedDates[i - 1] - sortedDates[i];
      const daysDiff = diff / (24 * 60 * 60 * 1000);

      if (daysDiff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  for (let i = 1; i < sortedDates.length; i++) {
    const diff = sortedDates[i - 1] - sortedDates[i];
    const daysDiff = diff / (24 * 60 * 60 * 1000);

    if (daysDiff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  longestStreak = Math.max(longestStreak, currentStreak, 1);

  return {
    current: currentStreak,
    longest: longestStreak,
  };
};

/**
 * Calculate velocity (items completed per time period)
 * @param {number} itemsCompleted - Number of items completed
 * @param {number} daysElapsed - Number of days elapsed
 * @returns {Object} Velocity information
 */
export const calculateVelocity = (itemsCompleted, daysElapsed) => {
  if (daysElapsed === 0) {
    return {
      daily: 0,
      weekly: 0,
      monthly: 0,
    };
  }

  const dailyVelocity = itemsCompleted / daysElapsed;
  const weeklyVelocity = dailyVelocity * 7;
  const monthlyVelocity = dailyVelocity * 30;

  return {
    daily: dailyVelocity.toFixed(2),
    weekly: weeklyVelocity.toFixed(2),
    monthly: monthlyVelocity.toFixed(2),
  };
};

/**
 * Calculate estimated time to completion
 * @param {number} remainingItems - Number of remaining items
 * @param {number} averageTimePerItem - Average time per item in seconds
 * @returns {Object} Estimated time information
 */
export const calculateEstimatedCompletion = (remainingItems, averageTimePerItem) => {
  const totalSeconds = remainingItems * averageTimePerItem;
  
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);

  let formatted = '';
  if (days > 0) {
    formatted = `${days}d ${hours}h`;
  } else if (hours > 0) {
    formatted = `${hours}h ${minutes}m`;
  } else {
    formatted = `${minutes}m`;
  }

  return {
    days,
    hours,
    minutes,
    totalSeconds,
    formatted,
  };
};

export default {
  calculatePercentage,
  calculateMissionProgress,
  calculateStageProgress,
  calculateProgramProgress,
  calculateCheckpointScore,
  calculateTimeRemaining,
  calculateCompletionRate,
  calculateSuccessRate,
  calculateAverageTime,
  calculateStreak,
  calculateVelocity,
  calculateEstimatedCompletion,
};