/**
 * GPS Lab Platform - Tiers Constants
 * 
 * Subscription tiers, Baraka value tiers, and pricing information
 * for the GPS Lab MMORPG educational platform.
 * 
 * @module utils/constants/tiers.constants
 * @version 1.0.0
 */

// =============================================================================
// SUBSCRIPTION TIERS
// =============================================================================

/**
 * Subscription tier definitions
 */
export const SUBSCRIPTION_TIERS = {
  FREE: {
    id: 'free',
    name: 'Free',
    displayName: 'Explorer',
    description: 'Start your GPS journey',
    monthlyPrice: 0,
    annualPrice: 0,
    currency: 'USD',
    color: '#9ca3af',
    icon: '🌱',
    
    features: {
      // Access
      stageAccess: 'Stage 1 only',
      maxStage: 1,
      missionAccess: 'GPO Call missions',
      
      // Support
      aiNavigator: true,
      aiCompanion: false,
      aiCoach: false,
      aiMentor: false,
      
      // Community
      communityAccess: 'Basic forums',
      partyFormation: false,
      
      // Rewards
      xpMultiplier: 1.0,
      barakaMultiplier: 1.0,
      
      // Limits
      monthlyRetries: 3,
      storageGB: 1
    },
    
    limitations: [
      'Limited to Stage 1',
      'No AI Companion or Coach',
      'No party formation',
      'Basic community access only'
    ],
    
    highlights: [
      'Access to GPO Call',
      'AI Navigator guidance',
      'Basic community forums',
      'Earn your first badge'
    ]
  },
  
  CONTENDER: {
    id: 'contender',
    name: 'Contender',
    displayName: 'Contender',
    description: 'Unlock the GPS foundation',
    monthlyPrice: 19,
    annualPrice: 190,  // ~$15.83/month - 2 months free
    currency: 'USD',
    color: '#f97316',
    icon: '🔥',
    
    features: {
      // Access
      stageAccess: 'Stages 1-11',
      maxStage: 11,
      missionAccess: 'GPS 101 + GPS Prep',
      
      // Support
      aiNavigator: true,
      aiCompanion: true,
      aiCoach: false,
      aiMentor: false,
      
      // Community
      communityAccess: 'Full forums + chat',
      partyFormation: false,
      
      // Rewards
      xpMultiplier: 1.1,
      barakaMultiplier: 1.1,
      
      // Limits
      monthlyRetries: 10,
      storageGB: 5
    },
    
    limitations: [
      'Limited to Stage 11',
      'No AI Coach or Mentor',
      'No party formation'
    ],
    
    highlights: [
      'Access to GPS 101 + GPS Prep',
      'AI Navigator + Companion',
      '10% XP & Baraka bonus',
      '10 monthly retries',
      '5GB storage'
    ],
    
    covenantReturn: {
      totalReturn: 9.50,  // 50% of $19
      taSupport: 2.85,    // 30%
      dataSubsidy: 1.90,  // 20%
      deviceSubsidy: 1.90,// 20%
      missionCredits: 2.85// 30%
    }
  },
  
  PATHFINDER: {
    id: 'pathfinder',
    name: 'Pathfinder',
    displayName: 'Pathfinder',
    description: 'Master the GPS methodology',
    monthlyPrice: 49,
    annualPrice: 490,  // ~$40.83/month - 2 months free
    currency: 'USD',
    color: '#22c55e',
    icon: '🧭',
    popular: true,
    
    features: {
      // Access
      stageAccess: 'Stages 1-25',
      maxStage: 25,
      missionAccess: 'Through GPS Capstone 2',
      
      // Support
      aiNavigator: true,
      aiCompanion: true,
      aiCoach: true,
      aiMentor: false,
      
      // Community
      communityAccess: 'Full access + mentorship matching',
      partyFormation: true,
      
      // Rewards
      xpMultiplier: 1.2,
      barakaMultiplier: 1.2,
      
      // Limits
      monthlyRetries: 25,
      storageGB: 25
    },
    
    limitations: [
      'Limited to Stage 25',
      'No AI Mentor access'
    ],
    
    highlights: [
      'Access through Capstone 2',
      'AI Navigator + Companion + Coach',
      'Party formation enabled',
      '20% XP & Baraka bonus',
      '25 monthly retries',
      '25GB storage'
    ],
    
    covenantReturn: {
      totalReturn: 24.50,
      taSupport: 7.35,
      dataSubsidy: 4.90,
      deviceSubsidy: 4.90,
      missionCredits: 7.35
    }
  },
  
  NAVIGATORS_CIRCLE: {
    id: 'navigators_circle',
    name: "Navigator's Circle",
    displayName: "Navigator's Circle",
    description: 'Full GPS journey + venture support',
    monthlyPrice: 149,
    annualPrice: 1490,  // ~$124.17/month - 2 months free
    currency: 'USD',
    color: '#8b5cf6',
    icon: '👑',
    
    features: {
      // Access
      stageAccess: 'All 35 stages',
      maxStage: 35,
      missionAccess: 'Complete curriculum',
      
      // Support
      aiNavigator: true,
      aiCompanion: true,
      aiCoach: true,
      aiMentor: true,
      
      // Community
      communityAccess: 'VIP access + exclusive events',
      partyFormation: true,
      
      // Rewards
      xpMultiplier: 1.3,
      barakaMultiplier: 1.3,
      
      // Limits
      monthlyRetries: 'Unlimited',
      storageGB: 100
    },
    
    limitations: [],
    
    highlights: [
      'Full 35-stage curriculum',
      'All AI characters unlocked',
      'Venture support & mentorship',
      '30% XP & Baraka bonus',
      'Unlimited retries',
      '100GB storage',
      'VIP community access'
    ],
    
    covenantReturn: {
      totalReturn: 74.50,
      taSupport: 22.35,
      dataSubsidy: 14.90,
      deviceSubsidy: 14.90,
      missionCredits: 22.35
    },
    
    bonuses: [
      'Priority support',
      'Investor network access',
      'Revenue share eligibility'
    ]
  }
};

/**
 * Subscription comparison matrix
 */
export const SUBSCRIPTION_FEATURES_MATRIX = {
  features: [
    { name: 'Max Stage Access', key: 'maxStage' },
    { name: 'AI Navigator', key: 'aiNavigator' },
    { name: 'AI Companion', key: 'aiCompanion' },
    { name: 'AI Coach', key: 'aiCoach' },
    { name: 'AI Mentor', key: 'aiMentor' },
    { name: 'Party Formation', key: 'partyFormation' },
    { name: 'XP Multiplier', key: 'xpMultiplier' },
    { name: 'Baraka Multiplier', key: 'barakaMultiplier' },
    { name: 'Monthly Retries', key: 'monthlyRetries' },
    { name: 'Storage', key: 'storageGB' }
  ],
  
  tiers: ['FREE', 'CONTENDER', 'PATHFINDER', 'NAVIGATORS_CIRCLE']
};

// =============================================================================
// BARAKA VALUE TIERS
// =============================================================================

/**
 * Baraka tier definitions (based on total Baraka earned)
 */
export const BARAKA_TIERS = {
  STARTER: {
    id: 'starter',
    name: 'Starter',
    displayName: 'Starter',
    threshold: 0,
    color: '#9ca3af',
    bgColor: '#f3f4f6',
    icon: '🌱',
    
    multiplier: 1.0,
    benefits: [
      'Basic platform access',
      'Standard mission rewards'
    ]
  },
  
  BEGINNER: {
    id: 'beginner',
    name: 'Beginner',
    displayName: 'Beginner Solver',
    threshold: 1000,
    color: '#f97316',
    bgColor: '#fff7ed',
    icon: '🔸',
    
    multiplier: 1.05,
    benefits: [
      '5% bonus on mission rewards',
      'Beginner profile badge',
      'Access to beginner workshops'
    ]
  },
  
  INTERMEDIATE: {
    id: 'intermediate',
    name: 'Intermediate',
    displayName: 'Growing Solver',
    threshold: 10000,
    color: '#eab308',
    bgColor: '#fefce8',
    icon: '🔶',
    
    multiplier: 1.10,
    benefits: [
      '10% bonus on mission rewards',
      'Intermediate profile badge',
      'Priority support access',
      'Extended retry allowance'
    ]
  },
  
  ADVANCED: {
    id: 'advanced',
    name: 'Advanced',
    displayName: 'Advanced Solver',
    threshold: 50000,
    color: '#22c55e',
    bgColor: '#f0fdf4',
    icon: '💚',
    
    multiplier: 1.15,
    benefits: [
      '15% bonus on mission rewards',
      'Advanced profile badge',
      'Mentor matching priority',
      'Early feature access'
    ]
  },
  
  EXPERT: {
    id: 'expert',
    name: 'Expert',
    displayName: 'Expert Solver',
    threshold: 100000,
    color: '#3b82f6',
    bgColor: '#eff6ff',
    icon: '💎',
    
    multiplier: 1.20,
    benefits: [
      '20% bonus on mission rewards',
      'Expert profile badge',
      'Exclusive workshops access',
      'TA program consideration'
    ]
  },
  
  MASTER: {
    id: 'master',
    name: 'Master',
    displayName: 'Master Solver',
    threshold: 500000,
    color: '#8b5cf6',
    bgColor: '#faf5ff',
    icon: '👑',
    
    multiplier: 1.25,
    benefits: [
      '25% bonus on mission rewards',
      'Master profile badge',
      'TA program eligibility',
      'Investor introductions',
      'Advisory opportunities'
    ]
  },
  
  LEGENDARY: {
    id: 'legendary',
    name: 'Legendary',
    displayName: 'Legendary Solver',
    threshold: 1000000,
    color: '#f59e0b',
    bgColor: '#fffbeb',
    icon: '✨',
    
    multiplier: 1.30,
    benefits: [
      '30% bonus on mission rewards',
      'Legendary profile badge',
      'GPS Ambassador status',
      'Revenue sharing eligibility',
      'Board advisory consideration',
      'Lifetime VIP access'
    ]
  }
};

/**
 * Baraka tier thresholds as array for easy iteration
 */
export const BARAKA_TIER_THRESHOLDS = [
  { tier: 'STARTER', threshold: 0 },
  { tier: 'BEGINNER', threshold: 1000 },
  { tier: 'INTERMEDIATE', threshold: 10000 },
  { tier: 'ADVANCED', threshold: 50000 },
  { tier: 'EXPERT', threshold: 100000 },
  { tier: 'MASTER', threshold: 500000 },
  { tier: 'LEGENDARY', threshold: 1000000 }
];

// =============================================================================
// XP LEVEL TIERS
// =============================================================================

/**
 * XP level tier definitions
 */
export const XP_LEVEL_TIERS = {
  NEWCOMER: {
    id: 'newcomer',
    name: 'Newcomer',
    levelRange: { min: 1, max: 4 },
    color: '#9ca3af',
    icon: '🌱'
  },
  
  EXPLORER: {
    id: 'explorer',
    name: 'Explorer',
    levelRange: { min: 5, max: 9 },
    color: '#f97316',
    icon: '🔍'
  },
  
  APPRENTICE: {
    id: 'apprentice',
    name: 'Apprentice',
    levelRange: { min: 10, max: 19 },
    color: '#eab308',
    icon: '📚'
  },
  
  ACHIEVER: {
    id: 'achiever',
    name: 'Achiever',
    levelRange: { min: 20, max: 34 },
    color: '#22c55e',
    icon: '🏆'
  },
  
  LEADER: {
    id: 'leader',
    name: 'Leader',
    levelRange: { min: 35, max: 49 },
    color: '#3b82f6',
    icon: '👑'
  },
  
  MASTER: {
    id: 'master',
    name: 'Master',
    levelRange: { min: 50, max: 69 },
    color: '#6366f1',
    icon: '💎'
  },
  
  CHAMPION: {
    id: 'champion',
    name: 'Champion',
    levelRange: { min: 70, max: 89 },
    color: '#8b5cf6',
    icon: '⚡'
  },
  
  LEGEND: {
    id: 'legend',
    name: 'Legend',
    levelRange: { min: 90, max: 100 },
    color: '#f59e0b',
    icon: '✨'
  }
};

// =============================================================================
// PSB (Problem Solver Bucks) TIERS
// =============================================================================

/**
 * PSB issuance caps by adventure
 */
export const PSB_ISSUANCE_CAPS = {
  adventure0: { cap: 0, name: 'GPO Call' },
  adventure1: { cap: 5000, name: 'GPS 101' },
  adventure2: { cap: 15000, name: 'GPS Prep' },
  adventure3: { cap: 80000, name: 'GPS Simulation' },
  adventure4: { cap: 250000, name: 'GPS Capstone 1' },
  adventure5: { cap: 250000, name: 'GPS Capstone 2' },
  adventure6: { cap: 200000, name: 'Venture Acceleration' },
  adventure7: { cap: 200000, name: 'Venture Capitalization' }
};

/**
 * PSB marketplace seller tiers
 */
export const PSB_SELLER_TIERS = {
  NEW_SELLER: {
    id: 'new_seller',
    name: 'New Seller',
    minSales: 0,
    maxListings: 5,
    commission: 0.15,  // 15%
    color: '#9ca3af'
  },
  
  ESTABLISHED: {
    id: 'established',
    name: 'Established Seller',
    minSales: 10,
    maxListings: 20,
    commission: 0.12,  // 12%
    color: '#22c55e'
  },
  
  TRUSTED: {
    id: 'trusted',
    name: 'Trusted Seller',
    minSales: 50,
    maxListings: 50,
    commission: 0.10,  // 10%
    color: '#3b82f6'
  },
  
  PREFERRED: {
    id: 'preferred',
    name: 'Preferred Seller',
    minSales: 100,
    maxListings: 'Unlimited',
    commission: 0.08,  // 8%
    color: '#8b5cf6'
  }
};

// =============================================================================
// ADVENTURE PRICING
// =============================================================================

/**
 * Individual adventure pricing (à la carte)
 */
export const ADVENTURE_PRICING = {
  0: { price: 0, name: 'GPO Call', included: ['FREE'] },
  1: { price: 49, name: 'GPS 101', included: ['CONTENDER', 'PATHFINDER', 'NAVIGATORS_CIRCLE'] },
  2: { price: 49, name: 'GPS Prep', included: ['CONTENDER', 'PATHFINDER', 'NAVIGATORS_CIRCLE'] },
  3: { price: 79, name: 'GPS Simulation', included: ['PATHFINDER', 'NAVIGATORS_CIRCLE'] },
  4: { price: 99, name: 'GPS Capstone 1', included: ['PATHFINDER', 'NAVIGATORS_CIRCLE'] },
  5: { price: 99, name: 'GPS Capstone 2', included: ['PATHFINDER', 'NAVIGATORS_CIRCLE'] },
  6: { price: 149, name: 'Venture Acceleration', included: ['NAVIGATORS_CIRCLE'] },
  7: { price: 199, name: 'Venture Capitalization', included: ['NAVIGATORS_CIRCLE'] }
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  SUBSCRIPTION_TIERS,
  SUBSCRIPTION_FEATURES_MATRIX,
  BARAKA_TIERS,
  BARAKA_TIER_THRESHOLDS,
  XP_LEVEL_TIERS,
  PSB_ISSUANCE_CAPS,
  PSB_SELLER_TIERS,
  ADVENTURE_PRICING
};