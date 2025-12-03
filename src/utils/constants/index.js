/**
 * GPS Lab Platform - Constants Index
 * 
 * Central export file for all application constants.
 * Import constants from this file for convenience.
 * 
 * @module utils/constants
 * @version 1.0.0
 */

// =============================================================================
// GAME CONSTANTS
// =============================================================================
export {
  // Curriculum structure
  CURRICULUM_TOTALS,
  ADVENTURES,
  STAGES,
  
  // Game mechanics
  PROGRESS_STATUS,
  STUDY_LOOP_STATES,
  R2R_TYPES,
  PARTY_CONFIG,
  AI_CHARACTERS,
  
  // Visual
  BEACON_COLORS,
  RAINBOW_BEACON,
  
  // Checkpoints
  CHECKPOINT_TYPES,
  
  // Difficulty
  DIFFICULTY_LEVELS,
  
  // Time
  TIME_CONSTRAINTS
} from './game.constants.js';

// =============================================================================
// BADGES CONSTANTS
// =============================================================================
export {
  // Character badges (35)
  CHARACTER_BADGES,
  
  // Rarity system
  BADGE_RARITY,
  
  // Special badges
  SPECIAL_BADGES,
  
  // Collections
  BADGE_COLLECTIONS
} from './badges.constants.js';

// =============================================================================
// TIERS CONSTANTS
// =============================================================================
export {
  // Subscription
  SUBSCRIPTION_TIERS,
  SUBSCRIPTION_FEATURES_MATRIX,
  
  // Baraka tiers
  BARAKA_TIERS,
  BARAKA_TIER_THRESHOLDS,
  
  // XP level tiers
  XP_LEVEL_TIERS,
  
  // PSB
  PSB_ISSUANCE_CAPS,
  PSB_SELLER_TIERS,
  
  // Pricing
  ADVENTURE_PRICING
} from './tiers.constants.js';

// =============================================================================
// UI CONSTANTS
// =============================================================================
export {
  // Colors
  BRAND_COLORS,
  SEMANTIC_COLORS,
  NEUTRAL_COLORS,
  BEACON_COLORS as UI_BEACON_COLORS,
  BARAKA_TIER_COLORS,
  BADGE_RARITY_COLORS,
  
  // Themes
  LIGHT_THEME,
  DARK_THEME,
  HIGH_CONTRAST_THEME,
  
  // Typography
  FONT_FAMILIES,
  FONT_SIZES,
  FONT_WEIGHTS,
  LINE_HEIGHTS,
  
  // Layout
  SPACING,
  BREAKPOINTS,
  MEDIA_QUERIES,
  BORDER_RADIUS,
  Z_INDEX,
  
  // Effects
  SHADOWS,
  ANIMATION_DURATIONS,
  EASINGS,
  ANIMATION_PRESETS,
  
  // Accessibility
  FOCUS_STYLES,
  REDUCED_MOTION
} from './ui.constants.js';

// =============================================================================
// DEFAULT EXPORTS (Namespaced)
// =============================================================================
import gameConstants from './game.constants.js';
import badgesConstants from './badges.constants.js';
import tiersConstants from './tiers.constants.js';
import uiConstants from './ui.constants.js';

export {
  gameConstants,
  badgesConstants,
  tiersConstants,
  uiConstants
};

/**
 * Combined constants object for convenience
 */
export default {
  game: gameConstants,
  badges: badgesConstants,
  tiers: tiersConstants,
  ui: uiConstants
};