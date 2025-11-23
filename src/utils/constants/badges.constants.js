/* ============================================
   GPS LAB - Badges Constants
   Achievement and tier badges configuration
   ============================================ */

/**
 * Achievement badge types
 */
export const AchievementBadgeTypes = {
  MILESTONE: 'milestone',
  SPECIAL: 'special',
  COMMUNITY: 'community',
  MASTERY: 'mastery',
};

/**
 * Achievement badges
 */
export const AchievementBadges = {
  // Milestone Badges
  PIONEER: {
    id: 'pioneer',
    name: 'Pioneer',
    type: AchievementBadgeTypes.MILESTONE,
    description: 'Among the first 1000 GPS Lab members',
    icon: 'pioneer.svg',
    color: '#FFD700',
    requirement: 'Join GPS Lab in its first year',
    rarity: 'legendary',
  },
  FOUNDING_MEMBER: {
    id: 'founding-member',
    name: 'Founding Member',
    type: AchievementBadgeTypes.MILESTONE,
    description: 'Among the first 100 GPS Lab members',
    icon: 'founding-member.svg',
    color: '#FFD700',
    requirement: 'Join GPS Lab in its first month',
    rarity: 'legendary',
  },
  GPS_101_GRADUATE: {
    id: 'gps-101-graduate',
    name: 'GPS 101 Graduate',
    type: AchievementBadgeTypes.MILESTONE,
    description: 'Completed all GPS 101 stages',
    icon: 'gps-101-graduate.svg',
    color: '#FF6B6B',
    requirement: 'Complete stages 1-5',
    rarity: 'common',
  },
  FIRST_PROJECT: {
    id: 'first-project',
    name: 'First Project',
    type: AchievementBadgeTypes.MILESTONE,
    description: 'Completed your first real-world project',
    icon: 'first-project.svg',
    color: '#2A9D8F',
    requirement: 'Complete one project',
    rarity: 'common',
  },
  FIRST_CUSTOMER: {
    id: 'first-customer',
    name: 'First Customer',
    type: AchievementBadgeTypes.MILESTONE,
    description: 'Acquired your first paying customer',
    icon: 'first-customer.svg',
    color: '#F1C40F',
    requirement: 'Get first paying customer',
    rarity: 'rare',
  },
  CUSTOMERS_1K: {
    id: '1k-customers',
    name: '1K Customers',
    type: AchievementBadgeTypes.MILESTONE,
    description: 'Reached 1,000 customers',
    icon: '1k-customers.svg',
    color: '#00D4FF',
    requirement: 'Acquire 1,000 customers',
    rarity: 'epic',
  },
  CUSTOMERS_10K: {
    id: '10k-customers',
    name: '10K Customers',
    type: AchievementBadgeTypes.MILESTONE,
    description: 'Reached 10,000 customers',
    icon: '10k-customers.svg',
    color: '#9B59B6',
    requirement: 'Acquire 10,000 customers',
    rarity: 'legendary',
  },
  FUNDED_FOUNDER: {
    id: 'funded-founder',
    name: 'Funded Founder',
    type: AchievementBadgeTypes.MILESTONE,
    description: 'Secured external funding for your venture',
    icon: 'funded-founder.svg',
    color: '#8E44AD',
    requirement: 'Raise external capital',
    rarity: 'epic',
  },
  GPS_GRADUATE: {
    id: 'gps-graduate',
    name: 'GPS Graduate',
    type: AchievementBadgeTypes.MILESTONE,
    description: 'Completed all 35 stages of GPS',
    icon: 'gps-graduate.svg',
    color: '#8E44AD',
    requirement: 'Complete all 35 stages',
    rarity: 'legendary',
  },

  // Special Badges
  PERFECT_CHECKPOINT: {
    id: 'perfect-checkpoint',
    name: 'Perfect Score',
    type: AchievementBadgeTypes.SPECIAL,
    description: 'Achieved 100% on a checkpoint',
    icon: 'perfect-checkpoint.svg',
    color: '#FFD700',
    requirement: 'Score 100% on checkpoint',
    rarity: 'rare',
  },
  SPEED_DEMON: {
    id: 'speed-demon',
    name: 'Speed Demon',
    type: AchievementBadgeTypes.SPECIAL,
    description: 'Completed a mission in record time',
    icon: 'speed-demon.svg',
    color: '#FF8C42',
    requirement: 'Complete mission 50% faster than average',
    rarity: 'rare',
  },
  COMEBACK_KID: {
    id: 'comeback-kid',
    name: 'Comeback Kid',
    type: AchievementBadgeTypes.SPECIAL,
    description: 'Passed checkpoint after failing',
    icon: 'comeback-kid.svg',
    color: '#2ECC71',
    requirement: 'Pass checkpoint after previous failure',
    rarity: 'uncommon',
  },
  STREAK_MASTER: {
    id: 'streak-master',
    name: 'Streak Master',
    type: AchievementBadgeTypes.SPECIAL,
    description: 'Maintained a 30-day activity streak',
    icon: 'streak-master.svg',
    color: '#F1C40F',
    requirement: 'Activity for 30 consecutive days',
    rarity: 'rare',
  },

  // Community Badges
  HELPER: {
    id: 'helper',
    name: 'Helper',
    type: AchievementBadgeTypes.COMMUNITY,
    description: 'Helped 10 fellow GPS members',
    icon: 'helper.svg',
    color: '#3498DB',
    requirement: 'Help 10 members',
    rarity: 'common',
  },
  MENTOR: {
    id: 'mentor',
    name: 'Mentor',
    type: AchievementBadgeTypes.COMMUNITY,
    description: 'Mentored 5 GPS members',
    icon: 'mentor.svg',
    color: '#9B59B6',
    requirement: 'Mentor 5 members',
    rarity: 'rare',
  },
  PRAISE_GIVER: {
    id: 'praise-giver',
    name: 'Praise Giver',
    type: AchievementBadgeTypes.COMMUNITY,
    description: 'Gave 100 praises to others',
    icon: 'praise-giver.svg',
    color: '#E74C3C',
    requirement: 'Give 100 praises',
    rarity: 'uncommon',
  },
  PRAISE_RECEIVER: {
    id: 'praise-receiver',
    name: 'Praise Receiver',
    type: AchievementBadgeTypes.COMMUNITY,
    description: 'Received 100 praises',
    icon: 'praise-receiver.svg',
    color: '#E74C3C',
    requirement: 'Receive 100 praises',
    rarity: 'uncommon',
  },
  PARTY_LEADER: {
    id: 'party-leader',
    name: 'Party Leader',
    type: AchievementBadgeTypes.COMMUNITY,
    description: 'Led a successful party mission',
    icon: 'party-leader.svg',
    color: '#00D4FF',
    requirement: 'Lead party to mission completion',
    rarity: 'uncommon',
  },

  // Mastery Badges
  BARAKA_MILLIONAIRE: {
    id: 'baraka-millionaire',
    name: 'Baraka Millionaire',
    type: AchievementBadgeTypes.MASTERY,
    description: 'Earned 1 million Baraka',
    icon: 'baraka-millionaire.svg',
    color: '#F1C40F',
    requirement: 'Earn 1,000,000 Baraka',
    rarity: 'legendary',
  },
  CHARACTER_COMPLETE: {
    id: 'character-complete',
    name: 'Character Complete',
    type: AchievementBadgeTypes.MASTERY,
    description: 'Earned all 35 character badges',
    icon: 'character-complete.svg',
    color: '#8E44AD',
    requirement: 'Earn all character badges',
    rarity: 'legendary',
  },
  IMPACT_MAKER: {
    id: 'impact-maker',
    name: 'Impact Maker',
    type: AchievementBadgeTypes.MASTERY,
    description: 'Positively impacted 10,000 lives',
    icon: 'impact-maker.svg',
    color: '#2ECC71',
    requirement: 'Document 10,000 lives impacted',
    rarity: 'legendary',
  },
};

/**
 * Badge rarity levels
 */
export const BadgeRarity = {
  COMMON: {
    level: 'common',
    label: 'Common',
    color: '#95A5A6',
    percentage: 60,
  },
  UNCOMMON: {
    level: 'uncommon',
    label: 'Uncommon',
    color: '#2ECC71',
    percentage: 25,
  },
  RARE: {
    level: 'rare',
    label: 'Rare',
    color: '#3498DB',
    percentage: 10,
  },
  EPIC: {
    level: 'epic',
    label: 'Epic',
    color: '#9B59B6',
    percentage: 4,
  },
  LEGENDARY: {
    level: 'legendary',
    label: 'Legendary',
    color: '#FFD700',
    percentage: 1,
  },
};

/**
 * Get achievement badge by ID
 * @param {string} badgeId - Badge ID
 * @returns {Object|null} Badge configuration
 */
export const getAchievementBadge = (badgeId) => {
  return Object.values(AchievementBadges).find(badge => badge.id === badgeId) || null;
};

/**
 * Get achievement badges by type
 * @param {string} type - Badge type
 * @returns {Array} Array of badges
 */
export const getAchievementBadgesByType = (type) => {
  return Object.values(AchievementBadges).filter(badge => badge.type === type);
};

/**
 * Get achievement badges by rarity
 * @param {string} rarity - Badge rarity
 * @returns {Array} Array of badges
 */
export const getAchievementBadgesByRarity = (rarity) => {
  return Object.values(AchievementBadges).filter(badge => badge.rarity === rarity);
};

/**
 * Get all achievement badges as array
 * @returns {Array} Array of all badges
 */
export const getAllAchievementBadges = () => {
  return Object.values(AchievementBadges);
};

/**
 * Total achievement badges
 */
export const TOTAL_ACHIEVEMENT_BADGES = Object.keys(AchievementBadges).length;

export default {
  AchievementBadgeTypes,
  AchievementBadges,
  BadgeRarity,
  TOTAL_ACHIEVEMENT_BADGES,
  getAchievementBadge,
  getAchievementBadgesByType,
  getAchievementBadgesByRarity,
  getAllAchievementBadges,
};