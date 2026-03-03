/**
 * Game Configuration
 * 
 * Configuration for gamification mechanics, rewards, and progression systems.
 */

import { GPS_101_CONFIG } from './gps101.config';

// ==================== XP SYSTEM ====================

export const XP_CONFIG = {
  // General XP
  CHECKPOINT_PASS: 5,
  MISSION_COMPLETE: 25,
  STAGE_COMPLETE: 100,
  
  // GPS 101 XP
  GPS_101_CHECKPOINT_PASS: 5,
  GPS_101_MISSION_COMPLETE: 30,
  GPS_101_STAGE_COMPLETE: 180,
  GPS_101_COURSE_COMPLETE: 1500,
  
  // Bonus XP
  PERFECT_CHECKPOINT: 2, // Bonus for perfect score
  FIRST_TRY: 5, // Bonus for passing on first try
  HELP_PARTY_MEMBER: 3,
  GIVE_PRAISE: 1,
  RECEIVE_PRAISE: 2,
  
  // Level thresholds (XP needed for each level)
  LEVEL_THRESHOLDS: [
    0,      // Level 1
    100,    // Level 2
    250,    // Level 3
    500,    // Level 4
    1000,   // Level 5
    2000,   // Level 6
    3500,   // Level 7
    5500,   // Level 8
    8000,   // Level 9
    11000,  // Level 10
    15000,  // Level 11
    20000,  // Level 12
    26000,  // Level 13
    33000,  // Level 14
    41000,  // Level 15
    50000   // Level 16+
  ]
};

// ==================== BARAKA ECONOMY ====================

export const BARAKA_CONFIG = {
  // Earning Baraka
  CHECKPOINT_PASS: 25,
  MISSION_COMPLETE: 150,
  STAGE_COMPLETE: 1000,
  
  // GPS 101 Baraka
  GPS_101_CHECKPOINT_PASS: 25,
  GPS_101_MISSION_COMPLETE: 150,
  GPS_101_STAGE_COMPLETE: 1000,
  GPS_101_COURSE_COMPLETE: 5000,
  
  // Bonus Baraka
  PERFECT_CHECKPOINT: 10,
  FIRST_TRY: 25,
  HELP_PARTY_MEMBER: 15,
  GIVE_PRAISE: 5,
  DAILY_LOGIN: 10,
  WEEKLY_STREAK: 50,
  MONTHLY_STREAK: 200,
  
  // Spending Baraka (Baraka Store)
  RETRY_RIGHT: 100,
  PROVISIONAL_RETRY_RIGHT: 50,
  UNLOCK_ADVENTURE_MISSION: 500,
  NAVIGATOR_HINT: 25,
  SKIP_STUDY_MISSION: 200,
  UNLOCK_SPECIAL_BADGE: 1000,
  
  // Beacons (Baraka milestones)
  BEACONS: {
    WHITE: {
      threshold: 0,
      name: 'White Beacon',
      color: '#FFFFFF',
      badge: 'white-beacon',
      description: 'Starting your GPS journey'
    },
    ORANGE: {
      threshold: 5000,
      name: 'Orange Beacon',
      color: '#FFA500',
      badge: 'orange-beacon',
      description: 'Completed GPS 101 Basic',
      unlocks: ['GPS Prep enrollment']
    },
    RED: {
      threshold: 10000,
      name: 'Red Beacon',
      color: '#FF0000',
      badge: 'red-beacon',
      description: 'Completed GPS Prep',
      unlocks: ['GPS Simulation enrollment']
    },
    PURPLE: {
      threshold: 50000,
      name: 'Purple Beacon',
      color: '#9370DB',
      badge: 'purple-beacon',
      description: 'GPS Program mastery',
      unlocks: ['Exclusive mentorship', 'Venture funding opportunities']
    }
  }
};

// ==================== PSB (Purpose-Secured Baraka) ====================

export const PSB_CONFIG = {
  COVENANT_RETURN: 0.5, // 50% returned to covenant economy
  WITHDRAWAL_FEE: 0.05, // 5% fee on withdrawal
  MINIMUM_WITHDRAWAL: 1000, // Minimum PSB to withdraw
  CONVERSION_RATE: 1, // 1 Baraka = 1 PSB
  
  // Lockup periods (in days)
  LOCKUP_PERIODS: {
    SHORT: 30,
    MEDIUM: 90,
    LONG: 180
  },
  
  // Interest rates based on lockup
  INTEREST_RATES: {
    SHORT: 0.05,   // 5% APY
    MEDIUM: 0.10,  // 10% APY
    LONG: 0.15     // 15% APY
  }
};

// ==================== BADGE SYSTEM ====================

export const BADGE_CONFIG = {
  // Character Badges (35 total - LQ traits)
  CHARACTER_BADGES: [
    { id: 'courage', name: 'Courage', category: 'character' },
    { id: 'humility', name: 'Humility', category: 'character' },
    { id: 'integrity', name: 'Integrity', category: 'character' },
    { id: 'excellence', name: 'Excellence', category: 'character' },
    { id: 'compassion', name: 'Compassion', category: 'character' },
    { id: 'wisdom', name: 'Wisdom', category: 'character' },
    { id: 'stewardship', name: 'Stewardship', category: 'character' },
    { id: 'resilience', name: 'Resilience', category: 'character' },
    { id: 'justice', name: 'Justice', category: 'character' },
    { id: 'gratitude', name: 'Gratitude', category: 'character' },
    { id: 'patience', name: 'Patience', category: 'character' },
    { id: 'generosity', name: 'Generosity', category: 'character' },
    { id: 'forgiveness', name: 'Forgiveness', category: 'character' },
    { id: 'faithfulness', name: 'Faithfulness', category: 'character' },
    { id: 'hope', name: 'Hope', category: 'character' },
    { id: 'love', name: 'Love', category: 'character' },
    { id: 'peace', name: 'Peace', category: 'character' },
    { id: 'joy', name: 'Joy', category: 'character' },
    { id: 'kindness', name: 'Kindness', category: 'character' },
    { id: 'goodness', name: 'Goodness', category: 'character' },
    { id: 'gentleness', name: 'Gentleness', category: 'character' },
    { id: 'self-control', name: 'Self-Control', category: 'character' },
    { id: 'perseverance', name: 'Perseverance', category: 'character' },
    { id: 'diligence', name: 'Diligence', category: 'character' },
    { id: 'authenticity', name: 'Authenticity', category: 'character' },
    { id: 'empathy', name: 'Empathy', category: 'character' },
    { id: 'accountability', name: 'Accountability', category: 'character' },
    { id: 'servant-leadership', name: 'Servant Leadership', category: 'character' },
    { id: 'vision', name: 'Vision', category: 'character' },
    { id: 'creativity', name: 'Creativity', category: 'character' },
    { id: 'collaboration', name: 'Collaboration', category: 'character' },
    { id: 'discernment', name: 'Discernment', category: 'character' },
    { id: 'boldness', name: 'Boldness', category: 'character' },
    { id: 'trust', name: 'Trust', category: 'character' },
    { id: 'sacrifice', name: 'Sacrifice', category: 'character' }
  ],
  
  // Achievement Badges
  ACHIEVEMENT_BADGES: [
    { id: 'pioneer', name: 'Pioneer', description: 'Early GPS Lab member' },
    { id: 'founding-member', name: 'Founding Member', description: 'Joined in first 1000 users' },
    { id: 'first-project', name: 'First Project', description: 'Created first purpose-driven project' },
    { id: 'first-customer', name: 'First Customer', description: 'Acquired first customer' },
    { id: '1k-customers', name: '1K Customers', description: 'Reached 1,000 customers' },
    { id: '10k-customers', name: '10K Customers', description: 'Reached 10,000 customers' },
    { id: 'funded-founder', name: 'Funded Founder', description: 'Raised funding for purpose-driven venture' },
    { id: 'gps-graduate', name: 'GPS Graduate', description: 'Completed full GPS Program' },
    { id: 'problem-owner', name: 'Problem Owner', description: 'Completed GPO Call showcase' }
  ],
  
  // GPS 101 Badges
  GPS_101_BADGES: [
    { 
      id: 'gps-101-stage-1', 
      name: 'Identity Seeker', 
      description: 'Completed Stage 1: Who are you?',
      stage: 1
    },
    { 
      id: 'gps-101-stage-2', 
      name: 'Problem Explorer', 
      description: 'Completed Stage 2: What is the meaning of your life?',
      stage: 2
    },
    { 
      id: 'gps-101-stage-3', 
      name: 'Story Weaver', 
      description: 'Completed Stage 3: Tell a story of problem owners',
      stage: 3
    },
    { 
      id: 'gps-101-stage-4', 
      name: 'Purpose Definer', 
      description: 'Completed Stage 4: What is your life purpose?',
      stage: 4
    },
    { 
      id: 'gps-101-stage-5', 
      name: 'Project Builder', 
      description: 'Completed Stage 5: What is your Purpose-driven Major?',
      stage: 5
    },
    { 
      id: 'purpose-pathfinder', 
      name: 'Purpose Pathfinder', 
      description: 'Completed GPS 101 Basic: Discovered Life Purpose',
      isCompletion: true
    },
    { 
      id: 'orange-beacon', 
      name: 'Orange Beacon', 
      description: 'Earned 5,000 Baraka in GPS 101',
      isBarakaMilestone: true,
      barakaThreshold: 5000
    }
  ],
  
  // Tier Badges
  TIER_BADGES: [
    { id: 'free-tier', name: 'Free Explorer', tier: 'FREE' },
    { id: 'contender', name: 'Contender', tier: 'CONTENDER' },
    { id: 'pathfinder', name: 'Pathfinder', tier: 'PATHFINDER' },
    { id: 'navigators-circle', name: "Navigator's Circle", tier: 'NAVIGATORS_CIRCLE' }
  ]
};

// ==================== STUDY SYSTEM (R2R/pR2R) ====================

export const STUDY_CONFIG = {
  // Retry Rights (R2R)
  R2R_INITIAL: 3, // Initial R2R per mission
  R2R_MAX: 5, // Maximum R2R that can be accumulated
  R2R_EARN_PER_STUDY: 1, // R2R earned per completed study mission
  
  // Provisional Retry Rights (pR2R)
  PR2R_THRESHOLD: 2, // Checkpoints failed to qualify for pR2R
  PR2R_MAX: 3, // Maximum pR2R
  PR2R_EARN_CONDITION: 'complete_study', // How to earn pR2R
  
  // Study Mission
  STUDY_MISSION_DURATION: 30, // minutes
  STUDY_MISSION_MIN_SCORE: 80, // percentage to pass
  
  // GPS 101 Study Config
  GPS_101: {
    R2R_INITIAL: 3,
    PR2R_THRESHOLD: 2,
    STUDY_REQUIRED_FOR_R2R: true,
    STUDY_DURATION: 30
  }
};

// ==================== PROGRESSION SYSTEM ====================

export const PROGRESSION_CONFIG = {
  // GPS 101 Progression
  GPS_101: {
    STAGES: GPS_101_CONFIG.TOTAL_STAGES,
    MISSIONS_PER_STAGE: GPS_101_CONFIG.MISSIONS_PER_STAGE,
    CHECKPOINTS_PER_MISSION: GPS_101_CONFIG.CHECKPOINTS_PER_MISSION,
    UNLOCK_PATTERN: 'sequential', // Stages unlock sequentially
    MISSION_UNLOCK_PATTERN: 'sequential', // Missions unlock sequentially within stage
    CHECKPOINT_UNLOCK_PATTERN: 'sequential', // Checkpoints unlock sequentially within mission
    
    // Passing criteria
    CHECKPOINT_PASSING_SCORE: 70, // percentage
    MISSION_PASSING_CRITERIA: 'all_checkpoints', // Must pass all checkpoints
    STAGE_PASSING_CRITERIA: 'all_missions', // Must complete all missions
    
    // Completion rewards
    STAGE_COMPLETION_REWARDS: {
      1: { baraka: 1000, xp: 180, badge: 'gps-101-stage-1' },
      2: { baraka: 1000, xp: 180, badge: 'gps-101-stage-2' },
      3: { baraka: 1000, xp: 180, badge: 'gps-101-stage-3' },
      4: { baraka: 1000, xp: 180, badge: 'gps-101-stage-4' },
      5: { baraka: 1000, xp: 180, badge: 'gps-101-stage-5' }
    },
    
    COURSE_COMPLETION_REWARDS: {
      baraka: 5000,
      xp: 1500,
      badges: ['purpose-pathfinder', 'orange-beacon'],
      unlocks: ['GPS Prep enrollment']
    }
  },
  
  // General GPS Program
  GENERAL: {
    STAGES: 35,
    MISSIONS_PER_STAGE: 5,
    BITES_PER_MISSION: 5
  }
};

// ==================== CELEBRATION CONFIG ====================

export const CELEBRATION_CONFIG = {
  // Checkpoint celebrations
  CHECKPOINT_PASS: {
    animation: 'success-checkmark',
    sound: 'checkpoint-pass.mp3',
    duration: 2000
  },
  
  // Mission celebrations
  MISSION_COMPLETE: {
    animation: 'confetti',
    sound: 'mission-complete.mp3',
    duration: 3000,
    showRewards: true
  },
  
  // Stage celebrations
  STAGE_COMPLETE: {
    animation: 'fireworks',
    sound: 'stage-complete.mp3',
    duration: 5000,
    showRewards: true,
    showBadge: true
  },
  
  // GPS 101 specific
  GPS_101_COMPLETE: {
    animation: 'epic-celebration',
    sound: 'course-complete.mp3',
    duration: 8000,
    showRewards: true,
    showBadges: true,
    showStats: true
  },
  
  // Badge unlock
  BADGE_UNLOCK: {
    animation: 'badge-reveal',
    sound: 'badge-unlock.mp3',
    duration: 3000
  },
  
  // Beacon unlock
  BEACON_UNLOCK: {
    animation: 'beacon-ignite',
    sound: 'beacon-unlock.mp3',
    duration: 5000
  }
};

// ==================== LEADERBOARD CONFIG ====================

export const LEADERBOARD_CONFIG = {
  TYPES: ['global', 'regional', 'university', 'cohort'],
  TIMEFRAMES: ['daily', 'weekly', 'monthly', 'all-time'],
  METRICS: ['baraka', 'xp', 'missions-completed', 'stages-completed'],
  PAGE_SIZE: 50,
  UPDATE_INTERVAL: 300000 // 5 minutes
};

// ==================== PRAISE ENGINE CONFIG ====================

export const PRAISE_CONFIG = {
  MAX_DAILY_PRAISE_SENT: 10,
  MAX_DAILY_PRAISE_RECEIVED: 50,
  BARAKA_FOR_GIVING: 5,
  BARAKA_FOR_RECEIVING: 2,
  XP_FOR_GIVING: 1,
  XP_FOR_RECEIVING: 2,
  
  CATEGORIES: [
    { id: 'encouragement', name: 'Encouragement', icon: '💪' },
    { id: 'celebration', name: 'Celebration', icon: '🎉' },
    { id: 'support', name: 'Support', icon: '🤝' },
    { id: 'recognition', name: 'Recognition', icon: '⭐' }
  ],
  
  TEMPLATES: {
    en: [
      "Great work on completing {achievement}!",
      "Your dedication is inspiring!",
      "Keep up the amazing progress!",
      "You're making a real difference!"
    ],
    ko: [
      "{achievement} 완료 축하합니다!",
      "당신의 헌신은 영감을 줍니다!",
      "계속 멋진 진전을 이루세요!",
      "당신은 진정한 변화를 만들고 있습니다!"
    ],
    sw: [
      "Kazi nzuri kukamilisha {achievement}!",
      "Kujitolea kwako ni wa kuvutia!",
      "Endelea na maendeleo ya ajabu!",
      "Unafanya tofauti halisi!"
    ]
  }
};

// ==================== PARTY SYSTEM CONFIG ====================

export const PARTY_CONFIG = {
  MIN_MEMBERS: 2,
  MAX_MEMBERS: {
    FREE: 0,
    CONTENDER: 5,
    PATHFINDER: 10,
    NAVIGATORS_CIRCLE: 999
  },
  
  ROLES: ['leader', 'co-leader', 'member'],
  
  REWARDS: {
    COLLABORATIVE_BONUS: 1.2, // 20% bonus Baraka/XP for party missions
    HELPING_BONUS: 15 // Baraka for helping party member
  }
};

// ==================== NAVIGATOR AI CONFIG ====================

export const NAVIGATOR_CONFIG = {
  ENABLED_TIERS: ['CONTENDER', 'PATHFINDER', 'NAVIGATORS_CIRCLE'],
  
  FEATURES: {
    CONTEXT_AWARE: true,
    STAGE_GUIDANCE: true,
    MISSION_GUIDANCE: true,
    CHECKPOINT_ASSISTANCE: true,
    CHATGPT_PROMPTS: true,
    PERSONALIZED_TIPS: true
  },
  
  GPS_101_FEATURES: {
    STAGE_SPECIFIC_GUIDANCE: true,
    DELIVERABLE_ASSISTANCE: true,
    CHECKPOINT_PREPARATION: true,
    CHATGPT_PROMPT_SUGGESTIONS: true,
    PROGRESS_TRACKING: true,
    ENCOURAGEMENT_MESSAGES: true
  }
};

// Export all game configurations
export default {
  XP_CONFIG,
  BARAKA_CONFIG,
  PSB_CONFIG,
  BADGE_CONFIG,
  STUDY_CONFIG,
  PROGRESSION_CONFIG,
  CELEBRATION_CONFIG,
  LEADERBOARD_CONFIG,
  PRAISE_CONFIG,
  PARTY_CONFIG,
  NAVIGATOR_CONFIG
};