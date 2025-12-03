/**
 * GPS Lab Platform - Game Constants
 * 
 * Core game constants including curriculum structure, adventures, stages,
 * missions, and game mechanics for the GPS Lab MMORPG educational platform.
 * 
 * @module utils/constants/game.constants
 * @version 1.0.0
 */

// =============================================================================
// CURRICULUM STRUCTURE
// =============================================================================

/**
 * Total curriculum counts
 */
export const CURRICULUM_TOTALS = {
  adventures: 8,           // 0-7 (GPO Call + 7 main adventures)
  stages: 35,
  missionsPerStage: 5,
  bitesPerMission: 5,
  checkpointsPerBite: 1,
  
  // Calculated totals
  totalMissions: 175,      // 35 × 5
  totalBites: 875,         // 175 × 5
  totalCheckpoints: 875    // 1 per bite
};

/**
 * Adventure definitions
 */
export const ADVENTURES = {
  0: {
    id: 'gpo-call',
    number: 0,
    name: 'GPO Call',
    shortName: 'GPO',
    description: 'Answer the call to become a Global Problem Solver',
    stages: [1],
    stageRange: { start: 1, end: 1 },
    beaconColor: '#ef4444',
    icon: '📞',
    estimatedWeeks: 1,
    prerequisites: []
  },
  1: {
    id: 'gps-101',
    number: 1,
    name: 'GPS 101',
    shortName: '101',
    description: 'Master the foundations of problem-solving methodology',
    stages: [2, 3, 4, 5, 6],
    stageRange: { start: 2, end: 6 },
    beaconColor: '#f97316',
    icon: '🎓',
    estimatedWeeks: 5,
    prerequisites: ['gpo-call']
  },
  2: {
    id: 'gps-prep',
    number: 2,
    name: 'GPS Prep',
    shortName: 'Prep',
    description: 'Prepare for advanced problem-solving challenges',
    stages: [7, 8, 9, 10, 11],
    stageRange: { start: 7, end: 11 },
    beaconColor: '#eab308',
    icon: '🔧',
    estimatedWeeks: 5,
    prerequisites: ['gps-101']
  },
  3: {
    id: 'gps-simulation',
    number: 3,
    name: 'GPS Simulation',
    shortName: 'Sim',
    description: 'Practice with realistic problem-solving simulations',
    stages: [12, 13, 14, 15],
    stageRange: { start: 12, end: 15 },
    beaconColor: '#22c55e',
    icon: '🎮',
    estimatedWeeks: 4,
    prerequisites: ['gps-prep']
  },
  4: {
    id: 'gps-capstone-1',
    number: 4,
    name: 'GPS Capstone 1',
    shortName: 'Cap1',
    description: 'Create your first real-world problem solution',
    stages: [16, 17, 18, 19, 20],
    stageRange: { start: 16, end: 20 },
    beaconColor: '#3b82f6',
    icon: '🏆',
    estimatedWeeks: 8,
    prerequisites: ['gps-simulation']
  },
  5: {
    id: 'gps-capstone-2',
    number: 5,
    name: 'GPS Capstone 2',
    shortName: 'Cap2',
    description: 'Collaborate on team-based problem solutions',
    stages: [21, 22, 23, 24, 25],
    stageRange: { start: 21, end: 25 },
    beaconColor: '#6366f1',
    icon: '👥',
    estimatedWeeks: 8,
    prerequisites: ['gps-capstone-1']
  },
  6: {
    id: 'venture-acceleration',
    number: 6,
    name: 'Venture Acceleration',
    shortName: 'Accel',
    description: 'Accelerate your venture from concept to launch',
    stages: [26, 27, 28, 29, 30],
    stageRange: { start: 26, end: 30 },
    beaconColor: '#8b5cf6',
    icon: '🚀',
    estimatedWeeks: 10,
    prerequisites: ['gps-capstone-2']
  },
  7: {
    id: 'venture-capitalization',
    number: 7,
    name: 'Venture Capitalization',
    shortName: 'VenCap',
    description: 'Secure funding and scale your venture',
    stages: [31, 32, 33, 34, 35],
    stageRange: { start: 31, end: 35 },
    beaconColor: '#f8fafc',
    icon: '💰',
    estimatedWeeks: 12,
    prerequisites: ['venture-acceleration']
  }
};

/**
 * Stage definitions (abbreviated - full 35 stages)
 */
export const STAGES = {
  1: {
    id: 'stage-1',
    number: 1,
    adventureNumber: 0,
    name: 'Identity Discovery',
    description: 'Discover your unique identity as a Global Problem Solver',
    theme: 'Who am I?',
    focusAreas: ['Self-assessment', 'Values identification', 'Strengths mapping']
  },
  2: {
    id: 'stage-2',
    number: 2,
    adventureNumber: 1,
    name: 'Problem Awareness',
    description: 'Develop awareness of global and local problems',
    theme: 'What problems exist?',
    focusAreas: ['Problem identification', 'Root cause analysis', 'Stakeholder mapping']
  },
  3: {
    id: 'stage-3',
    number: 3,
    adventureNumber: 1,
    name: 'Problem Selection',
    description: 'Learn to select problems aligned with your identity',
    theme: 'Which problem calls me?',
    focusAreas: ['Passion alignment', 'Impact assessment', 'Feasibility analysis']
  },
  4: {
    id: 'stage-4',
    number: 4,
    adventureNumber: 1,
    name: 'Research Methods',
    description: 'Master research techniques for understanding problems',
    theme: 'How do I learn more?',
    focusAreas: ['Primary research', 'Secondary research', 'Data synthesis']
  },
  5: {
    id: 'stage-5',
    number: 5,
    adventureNumber: 1,
    name: 'Ideation Foundations',
    description: 'Learn foundational ideation and creative thinking',
    theme: 'What could the solution be?',
    focusAreas: ['Brainstorming', 'Design thinking', 'Solution framing']
  },
  6: {
    id: 'stage-6',
    number: 6,
    adventureNumber: 1,
    name: 'Solution Basics',
    description: 'Develop basic solution concepts',
    theme: 'How do I start building?',
    focusAreas: ['MVP concept', 'Resource planning', 'Timeline creation']
  },
  // Stages 7-35 follow similar pattern...
  // Adding representative later stages
  16: {
    id: 'stage-16',
    number: 16,
    adventureNumber: 4,
    name: 'Venture Formation',
    description: 'Form your venture structure and team',
    theme: 'How do I build the organization?',
    focusAreas: ['Team building', 'Legal structure', 'Governance']
  },
  26: {
    id: 'stage-26',
    number: 26,
    adventureNumber: 6,
    name: 'Market Entry',
    description: 'Enter the market with your solution',
    theme: 'How do I reach customers?',
    focusAreas: ['Go-to-market', 'Sales strategy', 'Customer acquisition']
  },
  35: {
    id: 'stage-35',
    number: 35,
    adventureNumber: 7,
    name: 'Venture Launch',
    description: 'Launch your fully funded venture',
    theme: 'How do I scale?',
    focusAreas: ['Funding close', 'Scale operations', 'Impact measurement']
  }
};

// =============================================================================
// GAME MECHANICS
// =============================================================================

/**
 * Progress status states
 */
export const PROGRESS_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  LOCKED: 'locked',
  BLOCKED: 'blocked'
};

/**
 * Recursive study loop states
 */
export const STUDY_LOOP_STATES = {
  INITIAL: 'initial',
  ATTEMPT_1: 'attempt_1',
  ATTEMPT_2: 'attempt_2',
  ATTEMPT_3: 'attempt_3',
  R2R_ACTIVE: 'r2r_active',
  PR2R_ACTIVE: 'pr2r_active',
  PASSED: 'passed',
  FAILED_FINAL: 'failed_final'
};

/**
 * R2R (Right to Retry) types
 */
export const R2R_TYPES = {
  STANDARD: {
    id: 'standard',
    name: 'Standard R2R',
    maxRetries: 3,
    cooldownHours: 24
  },
  PROVISIONAL: {
    id: 'provisional',
    name: 'Provisional R2R',
    maxRetries: 1,
    validDays: 30,
    requiresConversion: true
  }
};

/**
 * Party (team) configuration
 */
export const PARTY_CONFIG = {
  minSize: 2,
  maxSize: 5,
  optimalSize: 4,
  roles: ['leader', 'member', 'mentor'],
  formationStage: 12  // Parties can form starting Stage 12
};

/**
 * AI character types
 */
export const AI_CHARACTERS = {
  NAVIGATOR: {
    id: 'navigator',
    name: 'Navigator',
    role: 'Guide through curriculum',
    avatar: '🧭',
    personality: 'Wise and encouraging',
    availableFrom: 1
  },
  COMPANION: {
    id: 'companion',
    name: 'Companion',
    role: 'Daily check-ins and support',
    avatar: '🤝',
    personality: 'Friendly and supportive',
    availableFrom: 1
  },
  COACH: {
    id: 'coach',
    name: 'Coach',
    role: 'Skill development guidance',
    avatar: '🏋️',
    personality: 'Challenging and motivating',
    availableFrom: 6
  },
  MENTOR: {
    id: 'mentor',
    name: 'Mentor',
    role: 'Strategic advice',
    avatar: '🎯',
    personality: 'Strategic and insightful',
    availableFrom: 16
  }
};

// =============================================================================
// BEACON AND COLOR SYSTEM
// =============================================================================

/**
 * Beacon colors by adventure
 */
export const BEACON_COLORS = {
  0: '#ef4444',  // Red - GPO Call
  1: '#f97316',  // Orange - GPS 101
  2: '#eab308',  // Yellow - GPS Prep
  3: '#22c55e',  // Green - GPS Simulation
  4: '#3b82f6',  // Blue - GPS Capstone 1
  5: '#6366f1',  // Indigo - GPS Capstone 2
  6: '#8b5cf6',  // Purple - Venture Acceleration
  7: '#f8fafc'   // Light/Rainbow - Venture Capitalization
};

/**
 * Rainbow beacon gradient for completion
 */
export const RAINBOW_BEACON = {
  gradient: 'linear-gradient(135deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #6366f1, #8b5cf6)',
  colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#6366f1', '#8b5cf6'],
  animation: 'rainbow-pulse 3s ease-in-out infinite'
};

// =============================================================================
// CHECKPOINT TYPES
// =============================================================================

/**
 * Checkpoint types and their characteristics
 */
export const CHECKPOINT_TYPES = {
  ATTENDANCE: {
    id: 'attendance',
    name: 'Attendance',
    description: 'Show up and engage',
    icon: '✅',
    autoComplete: true
  },
  REFLECTION: {
    id: 'reflection',
    name: 'Reflection',
    description: 'Written self-reflection',
    icon: '📝',
    minWords: 100
  },
  EVIDENCE: {
    id: 'evidence',
    name: 'Evidence Submission',
    description: 'Upload proof of work',
    icon: '📎',
    allowedTypes: ['image', 'pdf', 'video']
  },
  QUIZ: {
    id: 'quiz',
    name: 'Knowledge Check',
    description: 'Answer questions correctly',
    icon: '❓',
    passingScore: 80
  },
  PEER_REVIEW: {
    id: 'peer_review',
    name: 'Peer Review',
    description: 'Review and be reviewed',
    icon: '👥',
    requiredReviews: 2
  },
  DELIVERABLE: {
    id: 'deliverable',
    name: 'Deliverable',
    description: 'Submit a completed work product',
    icon: '📦',
    requiresApproval: true
  },
  PRESENTATION: {
    id: 'presentation',
    name: 'Presentation',
    description: 'Present to audience',
    icon: '🎤',
    requiresScheduling: true
  }
};

// =============================================================================
// DIFFICULTY LEVELS
// =============================================================================

/**
 * Mission difficulty scaling
 */
export const DIFFICULTY_LEVELS = {
  INTRODUCTORY: {
    id: 'introductory',
    name: 'Introductory',
    multiplier: 0.8,
    stages: [1, 2, 3]
  },
  FOUNDATIONAL: {
    id: 'foundational',
    name: 'Foundational',
    multiplier: 1.0,
    stages: [4, 5, 6, 7, 8, 9, 10, 11]
  },
  INTERMEDIATE: {
    id: 'intermediate',
    name: 'Intermediate',
    multiplier: 1.2,
    stages: [12, 13, 14, 15]
  },
  ADVANCED: {
    id: 'advanced',
    name: 'Advanced',
    multiplier: 1.4,
    stages: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
  },
  EXPERT: {
    id: 'expert',
    name: 'Expert',
    multiplier: 1.6,
    stages: [26, 27, 28, 29, 30]
  },
  MASTERY: {
    id: 'mastery',
    name: 'Mastery',
    multiplier: 1.8,
    stages: [31, 32, 33, 34, 35]
  }
};

// =============================================================================
// TIME CONSTRAINTS
// =============================================================================

/**
 * Time limits and schedules
 */
export const TIME_CONSTRAINTS = {
  // Checkpoint time limits (in minutes)
  checkpointTimeLimit: 60,
  reflectionTimeLimit: 30,
  quizTimeLimit: 15,
  
  // Mission time limits (in days)
  missionRecommendedDays: 7,
  missionMaxDays: 14,
  
  // Stage time limits (in weeks)
  stageRecommendedWeeks: 5,
  stageMaxWeeks: 8,
  
  // pR2R expiration
  pr2rValidDays: 30,
  
  // Inactivity thresholds
  inactivityWarningDays: 7,
  inactivityLockDays: 30
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  CURRICULUM_TOTALS,
  ADVENTURES,
  STAGES,
  PROGRESS_STATUS,
  STUDY_LOOP_STATES,
  R2R_TYPES,
  PARTY_CONFIG,
  AI_CHARACTERS,
  BEACON_COLORS,
  RAINBOW_BEACON,
  CHECKPOINT_TYPES,
  DIFFICULTY_LEVELS,
  TIME_CONSTRAINTS
};