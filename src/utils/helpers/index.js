/**
 * GPS Lab Platform - Helpers Index
 * 
 * Central export file for all helper utilities.
 * Import helpers from this file for convenience.
 * 
 * @module utils/helpers
 * @version 1.0.0
 */

// =============================================================================
// ARRAY HELPER
// =============================================================================
export {
  // Type checking
  isArray,
  isEmpty as isArrayEmpty,
  isNotEmpty as isArrayNotEmpty,
  ensureArray,
  
  // Access
  first,
  last,
  at,
  random,
  sample,
  
  // Transformation
  shuffle,
  reverse as reverseArray,
  flatten,
  flattenDeep,
  unique,
  compact,
  removeNulls,
  
  // Sorting
  sortBy,
  sortByDesc,
  sortByMultiple,
  sortNumbers,
  sortStrings,
  
  // Filtering
  partition,
  where,
  findWhere,
  reject,
  
  // Grouping
  groupBy,
  countBy,
  keyBy,
  toMap,
  
  // Set operations
  intersection,
  difference,
  symmetricDifference,
  union,
  
  // Chunking
  chunk,
  take,
  takeLast,
  drop,
  dropLast,
  
  // Aggregation
  sum,
  sumBy,
  average,
  min,
  max,
  minBy,
  maxBy,
  
  // GPS Lab specific
  sortMissions,
  groupCheckpointsByMission,
  filterCompleted,
  filterIncomplete,
  calculateCompletionRate,
  sortLeaderboard,
  getPartyMembers,
  groupStagesByAdventure
} from './array.helper.js';

// =============================================================================
// OBJECT HELPER
// =============================================================================
export {
  // Type checking
  isObject,
  isPlainObject,
  isEmpty as isObjectEmpty,
  isNotEmpty as isObjectNotEmpty,
  hasKey,
  hasKeys,
  
  // Deep operations
  deepClone,
  deepMerge,
  merge,
  deepEqual,
  deepFreeze,
  
  // Nested access
  get,
  set,
  has,
  unset,
  
  // Picking and omitting
  pick,
  pickBy,
  omit,
  omitBy,
  omitNulls,
  omitFalsy,
  
  // Transformation
  mapValues,
  mapKeys,
  invert,
  renameKeys,
  toArray,
  fromEntries,
  
  // Defaults
  defaults,
  defaultsDeep,
  
  // GPS Lab specific
  createUserProfile,
  createMissionProgress,
  toPublicUser,
  toEditableUser,
  flattenPreferences,
  unflattenPreferences
} from './object.helper.js';

// =============================================================================
// STRING HELPER
// =============================================================================
export {
  // Type checking
  isString,
  isEmpty as isStringEmpty,
  isNotEmpty as isStringNotEmpty,
  isBlank,
  toString,
  
  // Basic operations
  trim,
  trimStart,
  trimEnd,
  padStart,
  padEnd,
  repeat,
  reverse as reverseString,
  
  // Case conversion
  toLowerCase,
  toUpperCase,
  capitalize,
  capitalizeFirst,
  toTitleCase,
  toSentenceCase,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  toConstantCase,
  
  // Searching
  contains,
  startsWith,
  endsWith,
  countOccurrences,
  findAllIndices,
  
  // Replacement
  replaceAll,
  remove,
  removePrefix,
  removeSuffix,
  split,
  words,
  lines,
  
  // Truncation
  truncate,
  truncateWords,
  truncateMiddle,
  
  // Sanitization
  escapeHtml,
  unescapeHtml,
  escapeRegex,
  stripHtml,
  normalizeWhitespace,
  removeNonPrintable,
  
  // Slug and URL
  slugify,
  unslugify,
  generateId,
  
  // Parsing
  parseQueryString,
  buildQueryString,
  extractNumbers,
  extractEmails,
  extractUrls,
  
  // GPS Lab specific
  formatMissionId,
  parseMissionId,
  mask,
  formatMention,
  extractMentions,
  formatHashtag,
  extractHashtags
} from './string.helper.js';

// =============================================================================
// BARAKA CALCULATOR
// =============================================================================
export {
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
  calculateReward as calculateBarakaReward,
  calculateCheckpointReward as calculateCheckpointBaraka,
  calculateMissionReward as calculateMissionBaraka,
  calculateStageReward as calculateStageBaraka,
  calculateStreakBonus as calculateBarakaStreakBonus,
  
  // Spending calculations
  canAfford,
  calculateRetryCost,
  calculatePR2RCost,
  
  // Covenant economy
  calculateCovenantReturn,
  calculateSubscriptionCovenant,
  
  // Issuance
  getBarakaIssuanceCap,
  calculatePotentialEarnings as calculatePotentialBaraka
} from './baraka.calculator.js';

// =============================================================================
// XP CALCULATOR
// =============================================================================
export {
  // Constants
  XP_VALUES,
  LEVEL_CONFIG,
  LEVEL_TITLES,
  XP_MULTIPLIERS,
  XP_ACHIEVEMENTS,
  
  // Level calculations
  getXPForLevel,
  getTotalXPForLevel,
  getLevelFromXP,
  getLevelTitle,
  getLevelCapForAdventure,
  
  // XP reward calculations
  calculateXPReward,
  calculateCheckpointXP,
  calculateMissionXP,
  calculateStageXP,
  calculateAdventureXP,
  
  // Streak and achievements
  calculateStreakXP,
  getAchievementXP,
  calculateAchievementsXP,
  
  // Projections
  projectTimeToLevel,
  estimateRemainingXP
} from './xp.calculator.js';

// =============================================================================
// PROGRESS CALCULATOR
// =============================================================================
export {
  // Constants
  CURRICULUM_STRUCTURE,
  ADVENTURES,
  PROGRESS_STATUS,
  STUDY_LOOP_STATES,
  
  // Mapping
  getAdventureForStage,
  getAdventureInfo,
  getBeaconColor,
  getStagesForAdventure,
  
  // Progress calculations
  calculateBiteProgress,
  calculateMissionProgress,
  calculateMissionWithR2R,
  calculateStageProgress,
  calculateAdventureProgress,
  calculateOverallProgress,
  
  // Projections
  estimateTimeToCompletion,
  getNextMilestone
} from './progress.calculator.js';

// =============================================================================
// DEFAULT EXPORTS (Namespaced)
// =============================================================================
import arrayHelper from './array.helper.js';
import objectHelper from './object.helper.js';
import stringHelper from './string.helper.js';
import barakaCalculator from './baraka.calculator.js';
import xpCalculator from './xp.calculator.js';
import progressCalculator from './progress.calculator.js';

export {
  arrayHelper,
  objectHelper,
  stringHelper,
  barakaCalculator,
  xpCalculator,
  progressCalculator
};

/**
 * Combined helpers object for convenience
 */
export default {
  array: arrayHelper,
  object: objectHelper,
  string: stringHelper,
  baraka: barakaCalculator,
  xp: xpCalculator,
  progress: progressCalculator
};