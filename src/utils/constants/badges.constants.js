/**
 * GPS Lab Platform - Badges Constants
 * 
 * Character badges, achievements, and recognition system for the 
 * GPS Lab MMORPG educational platform.
 * 
 * Includes all 35 character badges (one per stage) plus special badges.
 * 
 * @module utils/constants/badges.constants
 * @version 1.0.0
 */

// =============================================================================
// CHARACTER BADGES (35 Stages)
// =============================================================================

/**
 * Character badge definitions - one badge per stage
 * Each badge represents a character trait developed in that stage
 */
export const CHARACTER_BADGES = {
  // Stage 1 - GPO Call
  1: {
    id: 'badge-seeker',
    stageNumber: 1,
    name: 'Seeker',
    title: 'The Seeker',
    description: 'One who answers the call to solve global problems',
    trait: 'Curiosity',
    icon: '🔍',
    rarity: 'common',
    color: '#ef4444'
  },
  
  // Stage 2 - GPS 101 begins
  2: {
    id: 'badge-observer',
    stageNumber: 2,
    name: 'Observer',
    title: 'The Observer',
    description: 'One who sees problems others overlook',
    trait: 'Awareness',
    icon: '👁️',
    rarity: 'common',
    color: '#f97316'
  },
  
  3: {
    id: 'badge-selector',
    stageNumber: 3,
    name: 'Selector',
    title: 'The Selector',
    description: 'One who chooses problems with wisdom',
    trait: 'Discernment',
    icon: '🎯',
    rarity: 'common',
    color: '#f97316'
  },
  
  4: {
    id: 'badge-researcher',
    stageNumber: 4,
    name: 'Researcher',
    title: 'The Researcher',
    description: 'One who seeks truth through inquiry',
    trait: 'Thoroughness',
    icon: '📚',
    rarity: 'common',
    color: '#f97316'
  },
  
  5: {
    id: 'badge-ideator',
    stageNumber: 5,
    name: 'Ideator',
    title: 'The Ideator',
    description: 'One who generates creative solutions',
    trait: 'Creativity',
    icon: '💡',
    rarity: 'common',
    color: '#f97316'
  },
  
  6: {
    id: 'badge-builder',
    stageNumber: 6,
    name: 'Builder',
    title: 'The Builder',
    description: 'One who transforms ideas into reality',
    trait: 'Action',
    icon: '🔨',
    rarity: 'common',
    color: '#f97316'
  },
  
  // Stage 7-11 - GPS Prep
  7: {
    id: 'badge-strategist',
    stageNumber: 7,
    name: 'Strategist',
    title: 'The Strategist',
    description: 'One who plans with foresight',
    trait: 'Planning',
    icon: '♟️',
    rarity: 'uncommon',
    color: '#eab308'
  },
  
  8: {
    id: 'badge-communicator',
    stageNumber: 8,
    name: 'Communicator',
    title: 'The Communicator',
    description: 'One who shares ideas with clarity',
    trait: 'Expression',
    icon: '🗣️',
    rarity: 'uncommon',
    color: '#eab308'
  },
  
  9: {
    id: 'badge-analyzer',
    stageNumber: 9,
    name: 'Analyzer',
    title: 'The Analyzer',
    description: 'One who breaks down complexity',
    trait: 'Analysis',
    icon: '📊',
    rarity: 'uncommon',
    color: '#eab308'
  },
  
  10: {
    id: 'badge-validator',
    stageNumber: 10,
    name: 'Validator',
    title: 'The Validator',
    description: 'One who tests assumptions rigorously',
    trait: 'Verification',
    icon: '✅',
    rarity: 'uncommon',
    color: '#eab308'
  },
  
  11: {
    id: 'badge-preparer',
    stageNumber: 11,
    name: 'Preparer',
    title: 'The Preparer',
    description: 'One who is ready for challenges',
    trait: 'Readiness',
    icon: '🎒',
    rarity: 'uncommon',
    color: '#eab308'
  },
  
  // Stage 12-15 - GPS Simulation
  12: {
    id: 'badge-simulator',
    stageNumber: 12,
    name: 'Simulator',
    title: 'The Simulator',
    description: 'One who tests in controlled environments',
    trait: 'Experimentation',
    icon: '🧪',
    rarity: 'rare',
    color: '#22c55e'
  },
  
  13: {
    id: 'badge-adaptor',
    stageNumber: 13,
    name: 'Adaptor',
    title: 'The Adaptor',
    description: 'One who adjusts to changing conditions',
    trait: 'Flexibility',
    icon: '🔄',
    rarity: 'rare',
    color: '#22c55e'
  },
  
  14: {
    id: 'badge-iterator',
    stageNumber: 14,
    name: 'Iterator',
    title: 'The Iterator',
    description: 'One who improves through repetition',
    trait: 'Persistence',
    icon: '🔁',
    rarity: 'rare',
    color: '#22c55e'
  },
  
  15: {
    id: 'badge-optimizer',
    stageNumber: 15,
    name: 'Optimizer',
    title: 'The Optimizer',
    description: 'One who refines for excellence',
    trait: 'Refinement',
    icon: '⚡',
    rarity: 'rare',
    color: '#22c55e'
  },
  
  // Stage 16-20 - GPS Capstone 1
  16: {
    id: 'badge-founder',
    stageNumber: 16,
    name: 'Founder',
    title: 'The Founder',
    description: 'One who establishes new ventures',
    trait: 'Initiative',
    icon: '🏛️',
    rarity: 'epic',
    color: '#3b82f6'
  },
  
  17: {
    id: 'badge-leader',
    stageNumber: 17,
    name: 'Leader',
    title: 'The Leader',
    description: 'One who guides others forward',
    trait: 'Leadership',
    icon: '👑',
    rarity: 'epic',
    color: '#3b82f6'
  },
  
  18: {
    id: 'badge-presenter',
    stageNumber: 18,
    name: 'Presenter',
    title: 'The Presenter',
    description: 'One who inspires through storytelling',
    trait: 'Persuasion',
    icon: '🎤',
    rarity: 'epic',
    color: '#3b82f6'
  },
  
  19: {
    id: 'badge-networker',
    stageNumber: 19,
    name: 'Networker',
    title: 'The Networker',
    description: 'One who builds valuable connections',
    trait: 'Connection',
    icon: '🌐',
    rarity: 'epic',
    color: '#3b82f6'
  },
  
  20: {
    id: 'badge-achiever',
    stageNumber: 20,
    name: 'Achiever',
    title: 'The Achiever',
    description: 'One who delivers on commitments',
    trait: 'Delivery',
    icon: '🏆',
    rarity: 'epic',
    color: '#3b82f6'
  },
  
  // Stage 21-25 - GPS Capstone 2
  21: {
    id: 'badge-collaborator',
    stageNumber: 21,
    name: 'Collaborator',
    title: 'The Collaborator',
    description: 'One who multiplies through teamwork',
    trait: 'Collaboration',
    icon: '🤝',
    rarity: 'epic',
    color: '#6366f1'
  },
  
  22: {
    id: 'badge-mentor',
    stageNumber: 22,
    name: 'Mentor',
    title: 'The Mentor',
    description: 'One who develops others',
    trait: 'Teaching',
    icon: '🎓',
    rarity: 'epic',
    color: '#6366f1'
  },
  
  23: {
    id: 'badge-innovator',
    stageNumber: 23,
    name: 'Innovator',
    title: 'The Innovator',
    description: 'One who creates breakthrough solutions',
    trait: 'Innovation',
    icon: '🚀',
    rarity: 'epic',
    color: '#6366f1'
  },
  
  24: {
    id: 'badge-integrator',
    stageNumber: 24,
    name: 'Integrator',
    title: 'The Integrator',
    description: 'One who combines diverse elements',
    trait: 'Synthesis',
    icon: '🧩',
    rarity: 'epic',
    color: '#6366f1'
  },
  
  25: {
    id: 'badge-transformer',
    stageNumber: 25,
    name: 'Transformer',
    title: 'The Transformer',
    description: 'One who creates lasting change',
    trait: 'Transformation',
    icon: '🦋',
    rarity: 'epic',
    color: '#6366f1'
  },
  
  // Stage 26-30 - Venture Acceleration
  26: {
    id: 'badge-launcher',
    stageNumber: 26,
    name: 'Launcher',
    title: 'The Launcher',
    description: 'One who brings solutions to market',
    trait: 'Execution',
    icon: '🎯',
    rarity: 'legendary',
    color: '#8b5cf6'
  },
  
  27: {
    id: 'badge-scaler',
    stageNumber: 27,
    name: 'Scaler',
    title: 'The Scaler',
    description: 'One who grows impact exponentially',
    trait: 'Growth',
    icon: '📈',
    rarity: 'legendary',
    color: '#8b5cf6'
  },
  
  28: {
    id: 'badge-steward',
    stageNumber: 28,
    name: 'Steward',
    title: 'The Steward',
    description: 'One who manages resources wisely',
    trait: 'Stewardship',
    icon: '🌱',
    rarity: 'legendary',
    color: '#8b5cf6'
  },
  
  29: {
    id: 'badge-negotiator',
    stageNumber: 29,
    name: 'Negotiator',
    title: 'The Negotiator',
    description: 'One who creates win-win outcomes',
    trait: 'Negotiation',
    icon: '⚖️',
    rarity: 'legendary',
    color: '#8b5cf6'
  },
  
  30: {
    id: 'badge-accelerator',
    stageNumber: 30,
    name: 'Accelerator',
    title: 'The Accelerator',
    description: 'One who speeds progress forward',
    trait: 'Momentum',
    icon: '⚡',
    rarity: 'legendary',
    color: '#8b5cf6'
  },
  
  // Stage 31-35 - Venture Capitalization
  31: {
    id: 'badge-financier',
    stageNumber: 31,
    name: 'Financier',
    title: 'The Financier',
    description: 'One who secures resources for impact',
    trait: 'Funding',
    icon: '💰',
    rarity: 'mythic',
    color: '#f59e0b'
  },
  
  32: {
    id: 'badge-visionary',
    stageNumber: 32,
    name: 'Visionary',
    title: 'The Visionary',
    description: 'One who sees the future clearly',
    trait: 'Vision',
    icon: '🔮',
    rarity: 'mythic',
    color: '#f59e0b'
  },
  
  33: {
    id: 'badge-architect',
    stageNumber: 33,
    name: 'Architect',
    title: 'The Architect',
    description: 'One who designs lasting structures',
    trait: 'Design',
    icon: '🏗️',
    rarity: 'mythic',
    color: '#f59e0b'
  },
  
  34: {
    id: 'badge-ambassador',
    stageNumber: 34,
    name: 'Ambassador',
    title: 'The Ambassador',
    description: 'One who represents the mission globally',
    trait: 'Representation',
    icon: '🌍',
    rarity: 'mythic',
    color: '#f59e0b'
  },
  
  35: {
    id: 'badge-luminary',
    stageNumber: 35,
    name: 'Luminary',
    title: 'The GPS Luminary',
    description: 'One who illuminates the path for all',
    trait: 'Wisdom',
    icon: '✨',
    rarity: 'mythic',
    color: '#f59e0b'
  }
};

// =============================================================================
// BADGE RARITY SYSTEM
// =============================================================================

/**
 * Badge rarity definitions
 */
export const BADGE_RARITY = {
  common: {
    name: 'Common',
    color: '#9ca3af',
    borderColor: '#6b7280',
    stages: [1, 2, 3, 4, 5, 6],
    dropRate: 1.0
  },
  uncommon: {
    name: 'Uncommon',
    color: '#eab308',
    borderColor: '#ca8a04',
    stages: [7, 8, 9, 10, 11],
    dropRate: 1.0
  },
  rare: {
    name: 'Rare',
    color: '#22c55e',
    borderColor: '#16a34a',
    stages: [12, 13, 14, 15],
    dropRate: 1.0
  },
  epic: {
    name: 'Epic',
    color: '#3b82f6',
    borderColor: '#2563eb',
    stages: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
    dropRate: 1.0
  },
  legendary: {
    name: 'Legendary',
    color: '#8b5cf6',
    borderColor: '#7c3aed',
    stages: [26, 27, 28, 29, 30],
    dropRate: 1.0
  },
  mythic: {
    name: 'Mythic',
    color: '#f59e0b',
    borderColor: '#d97706',
    stages: [31, 32, 33, 34, 35],
    dropRate: 1.0
  }
};

// =============================================================================
// SPECIAL BADGES
// =============================================================================

/**
 * Special achievement badges (not tied to stages)
 */
export const SPECIAL_BADGES = {
  // Completion badges
  adventureCompleter: {
    id: 'badge-adventure-completer',
    name: 'Adventure Completer',
    description: 'Complete any adventure',
    icon: '🏅',
    rarity: 'rare',
    repeatable: true
  },
  
  allAdventures: {
    id: 'badge-all-adventures',
    name: 'Grand Explorer',
    description: 'Complete all adventures',
    icon: '🌟',
    rarity: 'mythic',
    repeatable: false
  },
  
  // Streak badges
  weekStreak: {
    id: 'badge-week-streak',
    name: 'Week Warrior',
    description: '7-day activity streak',
    icon: '🔥',
    rarity: 'common',
    repeatable: true
  },
  
  monthStreak: {
    id: 'badge-month-streak',
    name: 'Monthly Marvel',
    description: '30-day activity streak',
    icon: '🔥',
    rarity: 'uncommon',
    repeatable: true
  },
  
  quarterStreak: {
    id: 'badge-quarter-streak',
    name: 'Quarterly Champion',
    description: '90-day activity streak',
    icon: '🔥',
    rarity: 'epic',
    repeatable: true
  },
  
  // Social badges
  firstHonor: {
    id: 'badge-first-honor',
    name: 'First Honor',
    description: 'Receive your first honor',
    icon: '🙏',
    rarity: 'common',
    repeatable: false
  },
  
  honoredMany: {
    id: 'badge-honored-many',
    name: 'Beloved',
    description: 'Receive 100 honors',
    icon: '💝',
    rarity: 'epic',
    repeatable: false
  },
  
  generousHonorer: {
    id: 'badge-generous-honorer',
    name: 'Generous Spirit',
    description: 'Give 100 honors to others',
    icon: '🌟',
    rarity: 'rare',
    repeatable: false
  },
  
  // Party badges
  partyFounder: {
    id: 'badge-party-founder',
    name: 'Party Founder',
    description: 'Create your first party',
    icon: '👥',
    rarity: 'uncommon',
    repeatable: false
  },
  
  partySuccess: {
    id: 'badge-party-success',
    name: 'Party Champion',
    description: 'Complete a stage with party',
    icon: '🎉',
    rarity: 'rare',
    repeatable: true
  },
  
  // Speed badges
  speedRunner: {
    id: 'badge-speed-runner',
    name: 'Speed Runner',
    description: 'Complete mission 50% faster than average',
    icon: '⚡',
    rarity: 'rare',
    repeatable: true
  },
  
  // Quality badges
  perfectionist: {
    id: 'badge-perfectionist',
    name: 'Perfectionist',
    description: 'Perfect score on all checkpoints in a mission',
    icon: '💯',
    rarity: 'rare',
    repeatable: true
  },
  
  // Baraka badges
  barakaBeginner: {
    id: 'badge-baraka-beginner',
    name: 'Baraka Beginner',
    description: 'Earn 1,000 Baraka',
    icon: '🪙',
    rarity: 'common',
    repeatable: false
  },
  
  barakaAdvanced: {
    id: 'badge-baraka-advanced',
    name: 'Baraka Advanced',
    description: 'Earn 100,000 Baraka',
    icon: '💎',
    rarity: 'epic',
    repeatable: false
  },
  
  barakaMaster: {
    id: 'badge-baraka-master',
    name: 'Baraka Master',
    description: 'Earn 1,000,000 Baraka',
    icon: '👑',
    rarity: 'mythic',
    repeatable: false
  }
};

// =============================================================================
// BADGE COLLECTIONS
// =============================================================================

/**
 * Badge collection definitions (sets of related badges)
 */
export const BADGE_COLLECTIONS = {
  foundation: {
    id: 'collection-foundation',
    name: 'Foundation Collection',
    description: 'Complete GPS 101',
    badges: [1, 2, 3, 4, 5, 6],
    reward: 500
  },
  
  preparation: {
    id: 'collection-preparation',
    name: 'Preparation Collection',
    description: 'Complete GPS Prep',
    badges: [7, 8, 9, 10, 11],
    reward: 750
  },
  
  simulation: {
    id: 'collection-simulation',
    name: 'Simulation Collection',
    description: 'Complete GPS Simulation',
    badges: [12, 13, 14, 15],
    reward: 1000
  },
  
  capstone: {
    id: 'collection-capstone',
    name: 'Capstone Collection',
    description: 'Complete both Capstones',
    badges: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
    reward: 2500
  },
  
  venture: {
    id: 'collection-venture',
    name: 'Venture Collection',
    description: 'Complete Venture stages',
    badges: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
    reward: 5000
  },
  
  complete: {
    id: 'collection-complete',
    name: 'Complete GPS Collection',
    description: 'Earn all 35 character badges',
    badges: Array.from({ length: 35 }, (_, i) => i + 1),
    reward: 10000
  }
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  CHARACTER_BADGES,
  BADGE_RARITY,
  SPECIAL_BADGES,
  BADGE_COLLECTIONS
};