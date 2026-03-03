/**
 * Badges Constants
 * 
 * Badge definitions for achievements, character traits, and milestones.
 */

import { GPS_101_BADGES } from './gps101.constants';

// ==================== BADGE CATEGORIES ====================

export const BADGE_CATEGORIES = {
  CHARACTER: 'character',
  ACHIEVEMENT: 'achievement',
  MILESTONE: 'milestone',
  SPECIAL: 'special',
  COURSE: 'course',
  BEACON: 'beacon'
};

// ==================== CHARACTER BADGES (LQ Traits - 35 Total) ====================

export const CHARACTER_BADGES = [
  { id: 'courage', name: 'Courage', category: 'character', icon: '🦁' },
  { id: 'humility', name: 'Humility', category: 'character', icon: '🙏' },
  { id: 'integrity', name: 'Integrity', category: 'character', icon: '⚖️' },
  { id: 'excellence', name: 'Excellence', category: 'character', icon: '⭐' },
  { id: 'compassion', name: 'Compassion', category: 'character', icon: '💝' },
  { id: 'wisdom', name: 'Wisdom', category: 'character', icon: '🦉' },
  { id: 'stewardship', name: 'Stewardship', category: 'character', icon: '🌱' },
  { id: 'resilience', name: 'Resilience', category: 'character', icon: '💪' },
  { id: 'justice', name: 'Justice', category: 'character', icon: '⚖️' },
  { id: 'gratitude', name: 'Gratitude', category: 'character', icon: '🙏' },
  { id: 'patience', name: 'Patience', category: 'character', icon: '⏳' },
  { id: 'generosity', name: 'Generosity', category: 'character', icon: '🎁' },
  { id: 'forgiveness', name: 'Forgiveness', category: 'character', icon: '🕊️' },
  { id: 'faithfulness', name: 'Faithfulness', category: 'character', icon: '🤝' },
  { id: 'hope', name: 'Hope', category: 'character', icon: '🌟' },
  { id: 'love', name: 'Love', category: 'character', icon: '❤️' },
  { id: 'peace', name: 'Peace', category: 'character', icon: '☮️' },
  { id: 'joy', name: 'Joy', category: 'character', icon: '😊' },
  { id: 'kindness', name: 'Kindness', category: 'character', icon: '💕' },
  { id: 'goodness', name: 'Goodness', category: 'character', icon: '✨' },
  { id: 'gentleness', name: 'Gentleness', category: 'character', icon: '🌸' },
  { id: 'self-control', name: 'Self-Control', category: 'character', icon: '🎯' },
  { id: 'perseverance', name: 'Perseverance', category: 'character', icon: '🏔️' },
  { id: 'diligence', name: 'Diligence', category: 'character', icon: '📊' },
  { id: 'authenticity', name: 'Authenticity', category: 'character', icon: '🎭' },
  { id: 'empathy', name: 'Empathy', category: 'character', icon: '🤗' },
  { id: 'accountability', name: 'Accountability', category: 'character', icon: '📋' },
  { id: 'servant-leadership', name: 'Servant Leadership', category: 'character', icon: '👥' },
  { id: 'vision', name: 'Vision', category: 'character', icon: '🔭' },
  { id: 'creativity', name: 'Creativity', category: 'character', icon: '🎨' },
  { id: 'collaboration', name: 'Collaboration', category: 'character', icon: '🤝' },
  { id: 'discernment', name: 'Discernment', category: 'character', icon: '👁️' },
  { id: 'boldness', name: 'Boldness', category: 'character', icon: '🦅' },
  { id: 'trust', name: 'Trust', category: 'character', icon: '🔒' },
  { id: 'sacrifice', name: 'Sacrifice', category: 'character', icon: '🕯️' }
];

// ==================== ACHIEVEMENT BADGES ====================

export const ACHIEVEMENT_BADGES = [
  {
    id: 'pioneer',
    name: 'Pioneer',
    description: 'Early GPS Lab member',
    category: 'achievement',
    icon: '🚀',
    rarity: 'legendary'
  },
  {
    id: 'founding-member',
    name: 'Founding Member',
    description: 'Joined in first 1000 users',
    category: 'achievement',
    icon: '👑',
    rarity: 'legendary'
  },
  {
    id: 'first-project',
    name: 'First Project',
    description: 'Created first purpose-driven project',
    category: 'achievement',
    icon: '🎯',
    rarity: 'common'
  },
  {
    id: 'first-customer',
    name: 'First Customer',
    description: 'Acquired first customer',
    category: 'achievement',
    icon: '🎊',
    rarity: 'uncommon'
  },
  {
    id: '1k-customers',
    name: '1K Customers',
    description: 'Reached 1,000 customers',
    category: 'achievement',
    icon: '📈',
    rarity: 'rare'
  },
  {
    id: '10k-customers',
    name: '10K Customers',
    description: 'Reached 10,000 customers',
    category: 'achievement',
    icon: '🚀',
    rarity: 'epic'
  },
  {
    id: 'funded-founder',
    name: 'Funded Founder',
    description: 'Raised funding for purpose-driven venture',
    category: 'achievement',
    icon: '💰',
    rarity: 'epic'
  },
  {
    id: 'gps-graduate',
    name: 'GPS Graduate',
    description: 'Completed full GPS Program (all 35 stages)',
    category: 'achievement',
    icon: '🎓',
    rarity: 'legendary'
  }
];

// ==================== GPS 101 COURSE BADGES ====================

export const GPS_101_COURSE_BADGES = GPS_101_BADGES.map(badge => ({
  ...badge,
  category: 'course'
}));

// ==================== GPO CALL BADGES ====================

export const GPO_CALL_BADGES = [
  {
    id: 'problem-owner',
    name: 'Problem Owner',
    description: 'Completed GPO Call showcase',
    category: 'course',
    icon: '🎯',
    rarity: 'uncommon'
  }
];

// ==================== BEACON BADGES ====================

export const BEACON_BADGES = [
  {
    id: 'white-beacon',
    name: 'White Beacon',
    description: 'Starting your GPS journey',
    category: 'beacon',
    threshold: 0,
    color: '#FFFFFF',
    icon: '⚪',
    rarity: 'common'
  },
  {
    id: 'orange-beacon',
    name: 'Orange Beacon',
    description: 'Earned 5,000 Baraka - Completed GPS 101',
    category: 'beacon',
    threshold: 5000,
    color: '#FFA500',
    icon: '🟠',
    rarity: 'rare'
  },
  {
    id: 'red-beacon',
    name: 'Red Beacon',
    description: 'Earned 10,000 Baraka - Completed GPS Prep',
    category: 'beacon',
    threshold: 10000,
    color: '#FF0000',
    icon: '🔴',
    rarity: 'epic'
  },
  {
    id: 'purple-beacon',
    name: 'Purple Beacon',
    description: 'Earned 50,000 Baraka - GPS Program mastery',
    category: 'beacon',
    threshold: 50000,
    color: '#9370DB',
    icon: '🟣',
    rarity: 'legendary'
  }
];

// ==================== MILESTONE BADGES ====================

export const MILESTONE_BADGES = [
  {
    id: 'first-mission',
    name: 'First Mission',
    description: 'Completed your first mission',
    category: 'milestone',
    icon: '🎯',
    rarity: 'common'
  },
  {
    id: 'first-stage',
    name: 'First Stage',
    description: 'Completed your first stage',
    category: 'milestone',
    icon: '🏆',
    rarity: 'common'
  },
  {
    id: '10-missions',
    name: '10 Missions',
    description: 'Completed 10 missions',
    category: 'milestone',
    icon: '🎖️',
    rarity: 'uncommon'
  },
  {
    id: '50-missions',
    name: '50 Missions',
    description: 'Completed 50 missions',
    category: 'milestone',
    icon: '🏅',
    rarity: 'rare'
  },
  {
    id: '100-missions',
    name: '100 Missions',
    description: 'Completed 100 missions',
    category: 'milestone',
    icon: '👑',
    rarity: 'epic'
  }
];

// ==================== SPECIAL BADGES ====================

export const SPECIAL_BADGES = [
  {
    id: 'beta-tester',
    name: 'Beta Tester',
    description: 'Participated in GPS Lab beta',
    category: 'special',
    icon: '🧪',
    rarity: 'legendary'
  },
  {
    id: 'community-champion',
    name: 'Community Champion',
    description: 'Outstanding community contributions',
    category: 'special',
    icon: '🌟',
    rarity: 'epic'
  }
];

// ==================== ALL BADGES ====================

export const ALL_BADGES = [
  ...CHARACTER_BADGES,
  ...ACHIEVEMENT_BADGES,
  ...GPS_101_COURSE_BADGES,
  ...GPO_CALL_BADGES,
  ...BEACON_BADGES,
  ...MILESTONE_BADGES,
  ...SPECIAL_BADGES
];

// ==================== BADGE RARITY ====================

export const BADGE_RARITY = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary'
};

export const BADGE_RARITY_COLORS = {
  common: '#9E9E9E',
  uncommon: '#4CAF50',
  rare: '#2196F3',
  epic: '#9C27B0',
  legendary: '#FF9800'
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get badge by ID
 */
export const getBadgeById = (badgeId) => {
  return ALL_BADGES.find(badge => badge.id === badgeId);
};

/**
 * Get badges by category
 */
export const getBadgesByCategory = (category) => {
  return ALL_BADGES.filter(badge => badge.category === category);
};

/**
 * Get GPS 101 badges
 */
export const getGPS101Badges = () => {
  return GPS_101_COURSE_BADGES;
};

/**
 * Get beacon badge by Baraka amount
 */
export const getBeaconByBaraka = (barakaAmount) => {
  const sortedBeacons = [...BEACON_BADGES].sort((a, b) => b.threshold - a.threshold);
  return sortedBeacons.find(beacon => barakaAmount >= beacon.threshold);
};

/**
 * Get badge rarity color
 */
export const getBadgeRarityColor = (rarity) => {
  return BADGE_RARITY_COLORS[rarity] || BADGE_RARITY_COLORS.common;
};

// Export default
export default {
  BADGE_CATEGORIES,
  CHARACTER_BADGES,
  ACHIEVEMENT_BADGES,
  GPS_101_COURSE_BADGES,
  GPO_CALL_BADGES,
  BEACON_BADGES,
  MILESTONE_BADGES,
  SPECIAL_BADGES,
  ALL_BADGES,
  BADGE_RARITY,
  BADGE_RARITY_COLORS,
  getBadgeById,
  getBadgesByCategory,
  getGPS101Badges,
  getBeaconByBaraka,
  getBadgeRarityColor
};