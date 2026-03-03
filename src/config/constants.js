/**
 * Application Constants
 * 
 * Global constants used throughout the application.
 */

// ==================== API CONFIGURATION ====================

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
export const API_TIMEOUT = 30000; // 30 seconds

// ==================== AUTHENTICATION ====================

export const TOKEN_KEY = 'gps_lab_auth_token';
export const REFRESH_TOKEN_KEY = 'gps_lab_refresh_token';
export const USER_KEY = 'gps_lab_user';

// ==================== PAGINATION ====================

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// ==================== FILE UPLOAD ====================

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// ==================== GPS LAB STRUCTURE ====================

export const TOTAL_GPS_STAGES = 35; // Total GPS program stages
export const MISSIONS_PER_STAGE = 5; // Default missions per stage
export const BITES_PER_MISSION = 5; // Default bites per mission

// ==================== GPS 101 BASIC ====================

export const GPS_101_STAGES = 5;
export const GPS_101_MISSIONS_PER_STAGE = 6;
export const GPS_101_CHECKPOINTS_PER_MISSION = 5;
export const GPS_101_TOTAL_MISSIONS = 30;
export const GPS_101_TOTAL_CHECKPOINTS = 150;
export const GPS_101_DURATION_WEEKS = 15;
export const GPS_101_TOTAL_BARAKA = 5000;
export const GPS_101_MODE = 'SOLO';

// ==================== BARAKA ECONOMY ====================

export const BARAKA_COLORS = {
  tier1: '#FFD700', // Gold
  tier2: '#FFA500', // Orange
  tier3: '#FF6347', // Tomato
  tier4: '#9370DB'  // Purple
};

export const BARAKA_BEACONS = {
  WHITE: { threshold: 0, color: '#FFFFFF', name: 'White Beacon' },
  ORANGE: { threshold: 5000, color: '#FFA500', name: 'Orange Beacon' },
  RED: { threshold: 10000, color: '#FF0000', name: 'Red Beacon' },
  PURPLE: { threshold: 50000, color: '#9370DB', name: 'Purple Beacon' }
};

// ==================== PSB (Purpose-Secured Baraka) ====================

export const PSB_COVENANT_RETURN = 0.5; // 50% return to covenant economy
export const PSB_WITHDRAWAL_FEE = 0.05; // 5% fee

// ==================== XP SYSTEM ====================

export const XP_PER_CHECKPOINT = 5;
export const XP_PER_MISSION = 25;
export const XP_PER_STAGE = 100;

// GPS 101 XP
export const GPS_101_XP_PER_CHECKPOINT = 5;
export const GPS_101_XP_PER_MISSION = 30;
export const GPS_101_XP_PER_STAGE = 180;

// ==================== STUDY SYSTEM (R2R/pR2R) ====================

export const R2R_INITIAL = 3; // Initial Retry Rights
export const PR2R_THRESHOLD = 2; // Provisional Retry Rights threshold
export const STUDY_MISSION_DURATION = 30; // minutes

// ==================== SUBSCRIPTION TIERS ====================

export const SUBSCRIPTION_TIERS = {
  FREE: {
    id: 'free',
    name: 'Free Tier',
    price: 0,
    features: {
      basicMissions: true,
      navigatorAI: false,
      partySize: 0,
      adventureMissions: 0
    }
  },
  CONTENDER: {
    id: 'contender',
    name: 'Contender',
    price: 9.99,
    features: {
      basicMissions: true,
      navigatorAI: true,
      partySize: 5,
      adventureMissions: 3
    }
  },
  PATHFINDER: {
    id: 'pathfinder',
    name: 'Pathfinder',
    price: 29.99,
    features: {
      basicMissions: true,
      navigatorAI: true,
      partySize: 10,
      adventureMissions: 10
    }
  },
  NAVIGATORS_CIRCLE: {
    id: 'navigators_circle',
    name: "Navigator's Circle",
    price: 99.99,
    features: {
      basicMissions: true,
      navigatorAI: true,
      partySize: 'unlimited',
      adventureMissions: 'unlimited'
    }
  }
};

// ==================== COURSE CODES ====================

export const COURSE_CODES = {
  GPO_CALL: 'GPO_CALL',
  GPS_101_BASIC: 'GPS_101_BASIC',
  GPS_PREP: 'GPS_PREP',
  GPS_SIMULATION: 'GPS_SIMULATION',
  GPS_CAPSTONE_1: 'GPS_CAPSTONE_1',
  GPS_CAPSTONE_2: 'GPS_CAPSTONE_2',
  VENTURE_ACCELERATION: 'VENTURE_ACCELERATION',
  VENTURE_CAPITALIZATION: 'VENTURE_CAPITALIZATION'
};

// ==================== MISSION STATUS ====================

export const MISSION_STATUS = {
  LOCKED: 'locked',
  AVAILABLE: 'available',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  ARCHIVED: 'archived'
};

// ==================== CHECKPOINT STATUS ====================

export const CHECKPOINT_STATUS = {
  LOCKED: 'locked',
  AVAILABLE: 'available',
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  PASSED: 'passed',
  FAILED: 'failed',
  RETRYING: 'retrying'
};

// ==================== STAGE STATUS ====================

export const STAGE_STATUS = {
  LOCKED: 'locked',
  UNLOCKED: 'unlocked',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

// ==================== PARTY ROLES ====================

export const PARTY_ROLES = {
  LEADER: 'leader',
  CO_LEADER: 'co-leader',
  MEMBER: 'member'
};

// ==================== PRAISE CATEGORIES ====================

export const PRAISE_CATEGORIES = {
  ENCOURAGEMENT: 'encouragement',
  CELEBRATION: 'celebration',
  SUPPORT: 'support',
  RECOGNITION: 'recognition'
};

// ==================== NOTIFICATION TYPES ====================

export const NOTIFICATION_TYPES = {
  MISSION_UNLOCKED: 'mission_unlocked',
  CHECKPOINT_PASSED: 'checkpoint_passed',
  MISSION_COMPLETED: 'mission_completed',
  STAGE_COMPLETED: 'stage_completed',
  BADGE_EARNED: 'badge_earned',
  BARAKA_EARNED: 'baraka_earned',
  PRAISE_RECEIVED: 'praise_received',
  PARTY_INVITE: 'party_invite',
  PARTY_MESSAGE: 'party_message',
  NAVIGATOR_MESSAGE: 'navigator_message'
};

// ==================== LANGUAGE CODES ====================

export const SUPPORTED_LANGUAGES = {
  EN: 'en',
  KO: 'ko',
  SW: 'sw'
};

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.EN;

// ==================== THEME ====================

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  HIGH_CONTRAST: 'high-contrast'
};

export const DEFAULT_THEME = THEMES.LIGHT;

// ==================== CHARACTER BADGES ====================

export const CHARACTER_BADGES = [
  'courage',
  'humility',
  'integrity',
  'excellence',
  'compassion',
  'wisdom',
  'stewardship',
  'resilience',
  'justice',
  'gratitude',
  'patience',
  'generosity',
  'forgiveness',
  'faithfulness',
  'hope',
  'love',
  'peace',
  'joy',
  'kindness',
  'goodness',
  'gentleness',
  'self-control',
  'perseverance',
  'diligence',
  'humility',
  'authenticity',
  'empathy',
  'accountability',
  'servant-leadership',
  'vision',
  'creativity',
  'collaboration',
  'discernment',
  'boldness',
  'trust'
];

// ==================== ACHIEVEMENT BADGES ====================

export const ACHIEVEMENT_BADGES = {
  PIONEER: 'pioneer',
  FOUNDING_MEMBER: 'founding-member',
  GPS_101_GRADUATE: 'gps-101-graduate',
  FIRST_PROJECT: 'first-project',
  FIRST_CUSTOMER: 'first-customer',
  CUSTOMER_1K: '1k-customers',
  CUSTOMER_10K: '10k-customers',
  FUNDED_FOUNDER: 'funded-founder',
  GPS_GRADUATE: 'gps-graduate',
  PROBLEM_OWNER: 'problem-owner',
  PURPOSE_PATHFINDER: 'purpose-pathfinder', // GPS 101 completion
  ORANGE_BEACON: 'orange-beacon' // 5,000 Baraka
};

// ==================== DATE FORMATS ====================

export const DATE_FORMATS = {
  SHORT: 'MMM D, YYYY',
  LONG: 'MMMM D, YYYY',
  WITH_TIME: 'MMM D, YYYY h:mm A',
  TIME_ONLY: 'h:mm A',
  ISO: 'YYYY-MM-DD'
};

// ==================== VALIDATION ====================

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 30,
  MIN_BIO_LENGTH: 0,
  MAX_BIO_LENGTH: 500,
  MIN_MESSAGE_LENGTH: 1,
  MAX_MESSAGE_LENGTH: 2000
};

// ==================== ANIMATION DURATIONS ====================

export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500
};

// ==================== BREAKPOINTS ====================

export const BREAKPOINTS = {
  XS: 320,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1400
};

// ==================== Z-INDEX ====================

export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  NOTIFICATION: 1080
};

// Export all constants as default
export default {
  API_BASE_URL,
  API_TIMEOUT,
  TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_KEY,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  ALLOWED_DOCUMENT_TYPES,
  TOTAL_GPS_STAGES,
  MISSIONS_PER_STAGE,
  BITES_PER_MISSION,
  GPS_101_STAGES,
  GPS_101_MISSIONS_PER_STAGE,
  GPS_101_CHECKPOINTS_PER_MISSION,
  GPS_101_TOTAL_MISSIONS,
  GPS_101_TOTAL_CHECKPOINTS,
  GPS_101_DURATION_WEEKS,
  GPS_101_TOTAL_BARAKA,
  GPS_101_MODE,
  BARAKA_COLORS,
  BARAKA_BEACONS,
  PSB_COVENANT_RETURN,
  PSB_WITHDRAWAL_FEE,
  XP_PER_CHECKPOINT,
  XP_PER_MISSION,
  XP_PER_STAGE,
  GPS_101_XP_PER_CHECKPOINT,
  GPS_101_XP_PER_MISSION,
  GPS_101_XP_PER_STAGE,
  R2R_INITIAL,
  PR2R_THRESHOLD,
  STUDY_MISSION_DURATION,
  SUBSCRIPTION_TIERS,
  COURSE_CODES,
  MISSION_STATUS,
  CHECKPOINT_STATUS,
  STAGE_STATUS,
  PARTY_ROLES,
  PRAISE_CATEGORIES,
  NOTIFICATION_TYPES,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  THEMES,
  DEFAULT_THEME,
  CHARACTER_BADGES,
  ACHIEVEMENT_BADGES,
  DATE_FORMATS,
  VALIDATION,
  ANIMATION_DURATION,
  BREAKPOINTS,
  Z_INDEX
};