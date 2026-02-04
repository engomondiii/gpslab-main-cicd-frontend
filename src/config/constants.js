/**
 * GPS Lab Platform - Application Constants
 * 
 * Central configuration for application-wide constants.
 * 
 * @module config/constants
 */

// =============================================================================
// GPO STAGES (-4 to 0)
// =============================================================================

export const GPO_STAGES = [
  {
    number: -4,
    name: 'Who are you?',
    title: 'Introduction',
    description: 'Introduce yourself and your community',
    objectives: [
      'Record 1-minute selfie video',
      'Share your background',
      'Describe your community'
    ]
  },
  {
    number: -3,
    name: 'What is your problem?',
    title: 'Problem Definition',
    description: 'Define the problem clearly',
    objectives: [
      'Describe current reality',
      'Define desired state',
      'Identify the gap',
      'Upload evidence (photos/videos)'
    ]
  },
  {
    number: -2,
    name: 'Whose pain?',
    title: 'Problem Impact',
    description: 'Show who is affected by this problem',
    objectives: [
      'Share personal testimony',
      'Document daily burden',
      'Record impact video'
    ]
  },
  {
    number: -1,
    name: 'What future?',
    title: 'Vision Statement',
    description: 'Paint a picture of the solution',
    objectives: [
      'Write vision statement',
      'Upload symbolic images',
      'Create before/after comparison'
    ]
  },
  {
    number: 0,
    name: 'How can GPS help?',
    title: 'Call to Action',
    description: 'Invite Global Problem Solvers to collaborate',
    objectives: [
      'Define collaboration needs',
      'Record invitation video',
      'Select needed skills'
    ]
  }
];

// =============================================================================
// STAGE RANGES
// =============================================================================

export const STAGE_RANGES = {
  GPO_CALL: { min: -4, max: 0, name: 'GPO Call' },
  GPS_101: { min: 1, max: 5, name: 'GPS 101' },
  GPS_PREP: { min: 6, max: 10, name: 'GPS Prep' },
  GPS_SIMULATION: { min: 11, max: 15, name: 'GPS Simulation' },
  GPS_CAPSTONE_1: { min: 16, max: 20, name: 'GPS Capstone 1' },
  GPS_CAPSTONE_2: { min: 21, max: 25, name: 'GPS Capstone 2' },
  VENTURE_ACCELERATION: { min: 26, max: 30, name: 'Venture Acceleration' },
  VENTURE_CAPITALIZATION: { min: 31, max: 35, name: 'Venture Capitalization' }
};

// =============================================================================
// USER ROLES
// =============================================================================

export const USER_ROLES = {
  GPO: 'gpo',           // Global Problem Owner
  GPS: 'gps',           // Global Problem Solver
  MENTOR: 'mentor',     // Mentor
  ADMIN: 'admin'        // Administrator
};

// =============================================================================
// AUTHENTICATION
// =============================================================================

export const AUTH_TOKEN_KEY = 'gpslab_auth_token';
export const REFRESH_TOKEN_KEY = 'gpslab_refresh_token';
export const TOKEN_EXPIRY_KEY = 'gpslab_token_expiry';

// =============================================================================
// API CONFIGURATION
// =============================================================================

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';
export const API_TIMEOUT = 30000; // 30 seconds

// =============================================================================
// PAGINATION
// =============================================================================

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// =============================================================================
// FILE UPLOAD LIMITS
// =============================================================================

export const FILE_UPLOAD = {
  MAX_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_VIDEO_SIZE: 100 * 1024 * 1024, // 100MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/quicktime'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};

// =============================================================================
// REWARDS
// =============================================================================

export const REWARDS = {
  GPO_STAGE_COMPLETE: 50,  // XP per GPO stage
  GPO_CALL_COMPLETE: 300,  // XP for completing all GPO stages
  MISSION_COMPLETE: 100,   // Base XP per mission
  STAGE_COMPLETE: 200,     // XP per GPS stage
  ACHIEVEMENT: 150         // XP per achievement
};

// =============================================================================
// DATES & TIMES
// =============================================================================

export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const TIME_FORMAT = 'HH:mm';

// =============================================================================
// VALIDATION
// =============================================================================

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 30,
  MIN_TITLE_LENGTH: 10,
  MAX_TITLE_LENGTH: 200,
  MIN_DESCRIPTION_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 5000
};

// =============================================================================
// FEATURE FLAGS
// =============================================================================

export const FEATURES = {
  ENABLE_GPO_CALL: true,
  ENABLE_STUDY_PARTIES: true,
  ENABLE_BARAKA_WALLET: true,
  ENABLE_AI_ASSISTANT: true,
  ENABLE_MENTOR_MATCHING: true
};

export default {
  GPO_STAGES,
  STAGE_RANGES,
  USER_ROLES,
  AUTH_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  TOKEN_EXPIRY_KEY,
  API_BASE_URL,
  API_TIMEOUT,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  FILE_UPLOAD,
  REWARDS,
  DATE_FORMAT,
  DATETIME_FORMAT,
  TIME_FORMAT,
  VALIDATION,
  FEATURES
};