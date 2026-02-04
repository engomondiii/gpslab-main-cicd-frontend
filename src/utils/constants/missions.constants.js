/* ============================================
   GPS LAB - Mission Constants
   Mission states, types (including GPO), and configuration
   ============================================ */

/**
 * Mission states (lifecycle)
 */
export const MissionStates = {
  LOCKED: 'locked',                 // Not yet available
  OFFERED: 'offered',               // Available to accept
  ACCEPTED: 'accepted',             // User accepted mission
  IN_PROGRESS: 'in_progress',       // Working on bites
  CHECKPOINT_PENDING: 'checkpoint_pending', // Ready for checkpoint
  CHECKPOINT_SUBMITTED: 'checkpoint_submitted', // Checkpoint submitted
  PASSED: 'passed',                 // Checkpoint passed
  FAILED: 'failed',                 // Checkpoint failed
  STUDY_MODE: 'study_mode',         // In study/retry mode
  COMPLETED: 'completed',           // Fully completed
  ARCHIVED: 'archived',             // Archived mission
};

/**
 * Mission state labels
 */
export const MissionStateLabels = {
  [MissionStates.LOCKED]: 'Locked',
  [MissionStates.OFFERED]: 'Available',
  [MissionStates.ACCEPTED]: 'Accepted',
  [MissionStates.IN_PROGRESS]: 'In Progress',
  [MissionStates.CHECKPOINT_PENDING]: 'Ready for Checkpoint',
  [MissionStates.CHECKPOINT_SUBMITTED]: 'Under Review',
  [MissionStates.PASSED]: 'Passed',
  [MissionStates.FAILED]: 'Failed',
  [MissionStates.STUDY_MODE]: 'Study Mode',
  [MissionStates.COMPLETED]: 'Completed',
  [MissionStates.ARCHIVED]: 'Archived',
};

/**
 * Mission state colors
 */
export const MissionStateColors = {
  [MissionStates.LOCKED]: '#8B949E',
  [MissionStates.OFFERED]: '#00D4FF',
  [MissionStates.ACCEPTED]: '#00D4FF',
  [MissionStates.IN_PROGRESS]: '#F1C40F',
  [MissionStates.CHECKPOINT_PENDING]: '#FF8C42',
  [MissionStates.CHECKPOINT_SUBMITTED]: '#9B59B6',
  [MissionStates.PASSED]: '#2A9D8F',
  [MissionStates.FAILED]: '#E74C3C',
  [MissionStates.STUDY_MODE]: '#3498DB',
  [MissionStates.COMPLETED]: '#2ECC71',
  [MissionStates.ARCHIVED]: '#8B949E',
};

/**
 * Mission types (ADDED GPO)
 */
export const MissionTypes = {
  GPO: 'gpo',                       // GPO Call mission
  STANDARD: 'standard',             // Regular mission
  CAPSTONE: 'capstone',             // Capstone mission
  VENTURE: 'venture',               // Venture mission
  SIMULATION: 'simulation',         // Simulation mission
  SPECIAL: 'special',               // Special event mission
};

/**
 * Mission difficulty levels
 */
export const MissionDifficulty = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert',
};

/**
 * Mission priority levels
 */
export const MissionPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

/**
 * Mission duration in days (typical) - ADDED GPO
 */
export const MissionDurations = {
  [MissionTypes.GPO]: 7,            // 1 week for GPO stages
  [MissionTypes.STANDARD]: 14,      // 2 weeks
  [MissionTypes.CAPSTONE]: 30,      // 1 month
  [MissionTypes.VENTURE]: 90,       // 3 months
  [MissionTypes.SIMULATION]: 21,    // 3 weeks
  [MissionTypes.SPECIAL]: 7,        // 1 week
};

/**
 * Bites per mission (default) - ADDED GPO
 */
export const BITES_PER_MISSION = {
  [MissionTypes.GPO]: 5,            // Simplified for GPO
  [MissionTypes.STANDARD]: 10,
  [MissionTypes.CAPSTONE]: 15,
  [MissionTypes.VENTURE]: 20,
  [MissionTypes.SIMULATION]: 12,
  [MissionTypes.SPECIAL]: 8,
};

/**
 * Minimum checkpoint score to pass
 */
export const MIN_CHECKPOINT_SCORE = 60;

/**
 * Perfect checkpoint score
 */
export const PERFECT_CHECKPOINT_SCORE = 100;

/**
 * Excellent checkpoint score threshold
 */
export const EXCELLENT_CHECKPOINT_SCORE = 90;

/**
 * Mission categories
 */
export const MissionCategories = {
  PROBLEM_SOLVING: 'problem_solving',
  ENTREPRENEURSHIP: 'entrepreneurship',
  TECHNOLOGY: 'technology',
  BUSINESS: 'business',
  DESIGN: 'design',
  LEADERSHIP: 'leadership',
  COMMUNICATION: 'communication',
  RESEARCH: 'research',
};

/**
 * Mission tags
 */
export const MissionTags = {
  SOLO: 'solo',
  PARTY: 'party',
  MENTOR_REQUIRED: 'mentor_required',
  PRACTICAL: 'practical',
  THEORETICAL: 'theoretical',
  FIELD_WORK: 'field_work',
  ONLINE: 'online',
  OFFLINE: 'offline',
};

/**
 * Mission validation rules
 */
export const MissionValidationRules = {
  MIN_TITLE_LENGTH: 10,
  MAX_TITLE_LENGTH: 100,
  MIN_DESCRIPTION_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 5000,
  MIN_BITES: 5,
  MAX_BITES: 30,
  MIN_DURATION_DAYS: 7,
  MAX_DURATION_DAYS: 180,
};

/**
 * Mission objectives configuration
 */
export const MissionObjectivesConfig = {
  MIN_OBJECTIVES: 3,
  MAX_OBJECTIVES: 10,
  MIN_OBJECTIVE_LENGTH: 20,
  MAX_OBJECTIVE_LENGTH: 500,
};

/**
 * Mission rewards configuration
 */
export const MissionRewardsConfig = {
  BASE_XP_MULTIPLIER: 1.0,
  BARAKA_MULTIPLIER: 1.0,
  PERFECT_BONUS: 2.0,
  EXCELLENT_BONUS: 1.5,
};

/**
 * Mission prerequisites
 */
export const MissionPrerequisites = {
  STAGE_COMPLETION: 'stage_completion',
  SPECIFIC_MISSION: 'specific_mission',
  CHARACTER_BADGE: 'character_badge',
  BARAKA_BALANCE: 'baraka_balance',
  TIER_LEVEL: 'tier_level',
};

/**
 * Check if mission state allows editing
 * @param {string} state - Mission state
 * @returns {boolean}
 */
export const isMissionEditable = (state) => {
  return [
    MissionStates.OFFERED,
    MissionStates.ACCEPTED,
    MissionStates.IN_PROGRESS,
  ].includes(state);
};

/**
 * Check if mission state is active
 * @param {string} state - Mission state
 * @returns {boolean}
 */
export const isMissionActive = (state) => {
  return [
    MissionStates.ACCEPTED,
    MissionStates.IN_PROGRESS,
    MissionStates.CHECKPOINT_PENDING,
    MissionStates.CHECKPOINT_SUBMITTED,
    MissionStates.STUDY_MODE,
  ].includes(state);
};

/**
 * Check if mission state is completed
 * @param {string} state - Mission state
 * @returns {boolean}
 */
export const isMissionCompleted = (state) => {
  return [
    MissionStates.PASSED,
    MissionStates.COMPLETED,
  ].includes(state);
};

/**
 * Check if mission state is failed
 * @param {string} state - Mission state
 * @returns {boolean}
 */
export const isMissionFailed = (state) => {
  return state === MissionStates.FAILED;
};

/**
 * Get next mission state
 * @param {string} currentState - Current state
 * @returns {string|null} Next state
 */
export const getNextMissionState = (currentState) => {
  const stateFlow = {
    [MissionStates.LOCKED]: MissionStates.OFFERED,
    [MissionStates.OFFERED]: MissionStates.ACCEPTED,
    [MissionStates.ACCEPTED]: MissionStates.IN_PROGRESS,
    [MissionStates.IN_PROGRESS]: MissionStates.CHECKPOINT_PENDING,
    [MissionStates.CHECKPOINT_PENDING]: MissionStates.CHECKPOINT_SUBMITTED,
    [MissionStates.CHECKPOINT_SUBMITTED]: MissionStates.PASSED, // or FAILED
    [MissionStates.PASSED]: MissionStates.COMPLETED,
    [MissionStates.FAILED]: MissionStates.STUDY_MODE,
    [MissionStates.STUDY_MODE]: MissionStates.CHECKPOINT_PENDING,
  };

  return stateFlow[currentState] || null;
};

export default {
  MissionStates,
  MissionStateLabels,
  MissionStateColors,
  MissionTypes,
  MissionDifficulty,
  MissionPriority,
  MissionDurations,
  BITES_PER_MISSION,
  MIN_CHECKPOINT_SCORE,
  PERFECT_CHECKPOINT_SCORE,
  EXCELLENT_CHECKPOINT_SCORE,
  MissionCategories,
  MissionTags,
  MissionValidationRules,
  MissionObjectivesConfig,
  MissionRewardsConfig,
  MissionPrerequisites,
  isMissionEditable,
  isMissionActive,
  isMissionCompleted,
  isMissionFailed,
  getNextMissionState,
};