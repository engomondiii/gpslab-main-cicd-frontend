/**
 * GPS Lab Platform - Routes Configuration
 * 
 * Defines all application routes and their metadata.
 * 
 * FINAL CORRECTED VERSION - GPS 101 Integration v2.1
 * Matches System A architecture (data-driven routing)
 * 
 * @module config/routes.config
 * @version 2.1.0
 */

// ==================== PUBLIC ROUTES ====================

export const PUBLIC_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  ABOUT: '/about',
  FEATURES: '/features',
  PRICING: '/pricing',
  FAQ: '/faq',
  CONTACT: '/contact',
  PRIVACY: '/privacy',
  TERMS: '/terms'
};

// ==================== AUTHENTICATED ROUTES ====================

export const AUTHENTICATED_ROUTES = {
  // Dashboard
  DASHBOARD: '/dashboard',
  COMMAND_CENTER: '/command-center',
  
  // GPS 101 Routes (UPDATED with /gps101 instead of /gps-101)
  GPS_101: '/gps101',
  GPS_101_ENROLL: '/gps101/enroll',
  GPS_101_STAGE: '/gps101/stage/:stageNumber',
  GPS_101_CHECKPOINTS: '/gps101/checkpoints',
  GPS_101_CHECKPOINT: '/gps101/checkpoint/:checkpointId',
  GPS_101_DELIVERABLES: '/gps101/deliverables',
  GPS_101_DELIVERABLE: '/gps101/deliverable/:stageNumber',
  GPS_101_DASHBOARD: '/gps101/dashboard',
  GPS_101_ORANGE_BEACON: '/gps101/orange-beacon',
  
  // Missions
  MISSIONS: '/missions',
  MISSION_DETAIL: '/missions/:missionId',
  BITE_BOARD: '/missions/:missionId/bites',
  CHECKPOINT: '/checkpoints/:checkpointId',
  CHECKPOINT_ARENA: '/checkpoint-arena/:checkpointId',
  
  // Study
  STUDY_FORGE: '/study',
  STUDY_MISSION: '/study/:studyId',
  
  // GPO Call
  GPO_CALL: '/gpo-call',
  GPO_CALL_STAGE: '/gpo-call/stage/:stageId',
  GPO_CALL_SUCCESS: '/gpo-call/success',
  GPO_SHOWCASE: '/gpo/showcase/:showcaseId',
  GPO_COMMUNITY: '/gpo/community',
  
  // Projects
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:projectId',
  CREATE_PROJECT: '/projects/create',
  PROJECT_GPO: '/projects/gpo',
  
  // Party
  PARTIES: '/parties',
  PARTY_DETAIL: '/parties/:partyId',
  CREATE_PARTY: '/parties/create',
  
  // Portfolio
  PORTFOLIO: '/portfolio',
  PORTFOLIO_EDIT: '/portfolio/edit',
  
  // Profile
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
  PROFILE_USER: '/profile/:userId',
  
  // Settings
  SETTINGS: '/settings',
  SETTINGS_ACCOUNT: '/settings/account',
  SETTINGS_PRIVACY: '/settings/privacy',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',
  SETTINGS_BILLING: '/settings/billing',
  
  // Leaderboard
  LEADERBOARD: '/leaderboard',
  
  // Mentor
  MENTORS: '/mentors',
  MENTOR_PROFILE: '/mentors/:mentorId',
  MENTOR_SESSION: '/mentors/:mentorId/session',
  
  // Subscription
  SUBSCRIPTION: '/subscription',
  SUBSCRIPTION_UPGRADE: '/subscription/upgrade',
  ADVENTURE_MISSIONS: '/adventure-missions',
  
  // Marketplace
  MARKETPLACE: '/marketplace',
  
  // Wallet
  WALLET: '/wallet',
  WALLET_BARAKA: '/wallet/baraka',
  WALLET_PSB: '/wallet/psb',
  
  // Help
  HELP: '/help',
  TUTORIALS: '/tutorials',
  SUPPORT: '/support'
};

// ==================== ADMIN ROUTES ====================

export const ADMIN_ROUTES = {
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_MISSIONS: '/admin/missions',
  ADMIN_CONTENT: '/admin/content',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_SETTINGS: '/admin/settings'
};

// ==================== UNIVERSITY ROUTES ====================

export const UNIVERSITY_ROUTES = {
  UNIVERSITY: '/university',
  UNIVERSITY_DASHBOARD: '/university/dashboard',
  UNIVERSITY_COHORTS: '/university/cohorts',
  UNIVERSITY_STUDENTS: '/university/students',
  UNIVERSITY_REPORTS: '/university/reports'
};

// ==================== ROUTE METADATA ====================

export const ROUTE_METADATA = {
  // GPS 101 Routes Metadata
  [AUTHENTICATED_ROUTES.GPS_101]: {
    title: 'GPS 101 - Purpose Discovery',
    description: 'Discover your life purpose through GPS 101 Basic',
    breadcrumbs: ['Dashboard', 'GPS 101'],
    requiresEnrollment: false,
    course: 'GPS_101_BASIC'
  },
  
  [AUTHENTICATED_ROUTES.GPS_101_ENROLL]: {
    title: 'Enroll in GPS 101',
    description: 'Start your purpose discovery journey',
    breadcrumbs: ['Dashboard', 'GPS 101', 'Enroll'],
    requiresEnrollment: false,
    course: 'GPS_101_BASIC'
  },
  
  [AUTHENTICATED_ROUTES.GPS_101_STAGE]: {
    title: 'GPS 101 - Stage',
    description: 'GPS 101 Stage',
    breadcrumbs: ['Dashboard', 'GPS 101', 'Stage'],
    requiresEnrollment: true,
    course: 'GPS_101_BASIC'
  },
  
  [AUTHENTICATED_ROUTES.GPS_101_CHECKPOINTS]: {
    title: 'GPS 101 - Checkpoints',
    description: 'View checkpoint progress',
    breadcrumbs: ['Dashboard', 'GPS 101', 'Checkpoints'],
    requiresEnrollment: true,
    course: 'GPS_101_BASIC'
  },
  
  [AUTHENTICATED_ROUTES.GPS_101_CHECKPOINT]: {
    title: 'GPS 101 - Checkpoint',
    description: 'Complete checkpoint',
    breadcrumbs: ['Dashboard', 'GPS 101', 'Checkpoint'],
    requiresEnrollment: true,
    course: 'GPS_101_BASIC'
  },
  
  [AUTHENTICATED_ROUTES.GPS_101_DELIVERABLES]: {
    title: 'GPS 101 - Deliverables',
    description: 'Stage deliverables',
    breadcrumbs: ['Dashboard', 'GPS 101', 'Deliverables'],
    requiresEnrollment: true,
    course: 'GPS_101_BASIC'
  },
  
  [AUTHENTICATED_ROUTES.GPS_101_DELIVERABLE]: {
    title: 'Stage Deliverable',
    description: 'Submit deliverable',
    breadcrumbs: ['Dashboard', 'GPS 101', 'Deliverable'],
    requiresEnrollment: true,
    course: 'GPS_101_BASIC'
  },
  
  [AUTHENTICATED_ROUTES.GPS_101_DASHBOARD]: {
    title: 'GPS 101 Dashboard',
    description: 'Track GPS 101 progress',
    breadcrumbs: ['Dashboard', 'GPS 101', 'Dashboard'],
    requiresEnrollment: true,
    course: 'GPS_101_BASIC'
  },
  
  [AUTHENTICATED_ROUTES.GPS_101_ORANGE_BEACON]: {
    title: 'Orange Beacon',
    description: 'Track Orange Beacon progress',
    breadcrumbs: ['Dashboard', 'GPS 101', 'Orange Beacon'],
    requiresEnrollment: true,
    course: 'GPS_101_BASIC'
  },
  
  // Dashboard
  [AUTHENTICATED_ROUTES.DASHBOARD]: {
    title: 'Dashboard',
    description: 'Your GPS Lab Dashboard',
    breadcrumbs: ['Dashboard']
  },
  
  [AUTHENTICATED_ROUTES.COMMAND_CENTER]: {
    title: 'Command Center',
    description: 'Mission Control',
    breadcrumbs: ['Dashboard', 'Command Center']
  },
  
  // Missions
  [AUTHENTICATED_ROUTES.MISSIONS]: {
    title: 'Missions',
    description: 'Available Missions',
    breadcrumbs: ['Dashboard', 'Missions']
  },
  
  // GPO Call
  [AUTHENTICATED_ROUTES.GPO_CALL]: {
    title: 'GPO Call',
    description: 'Create your Problem Owner Showcase',
    breadcrumbs: ['Dashboard', 'GPO Call']
  },
  
  // Portfolio
  [AUTHENTICATED_ROUTES.PORTFOLIO]: {
    title: 'Portfolio',
    description: 'Your GPS Portfolio',
    breadcrumbs: ['Dashboard', 'Portfolio']
  }
};

// ==================== ROUTE PERMISSIONS ====================

export const ROUTE_PERMISSIONS = {
  // Public - no authentication required
  PUBLIC: Object.values(PUBLIC_ROUTES),
  
  // Authenticated - requires login
  AUTHENTICATED: Object.values(AUTHENTICATED_ROUTES),
  
  // Admin - requires admin role
  ADMIN: Object.values(ADMIN_ROUTES),
  
  // University - requires university role
  UNIVERSITY: Object.values(UNIVERSITY_ROUTES),
  
  // GPS 101 - requires GPS 101 enrollment (except main page and enroll)
  GPS_101_ENROLLMENT_REQUIRED: [
    AUTHENTICATED_ROUTES.GPS_101_STAGE,
    AUTHENTICATED_ROUTES.GPS_101_CHECKPOINTS,
    AUTHENTICATED_ROUTES.GPS_101_CHECKPOINT,
    AUTHENTICATED_ROUTES.GPS_101_DELIVERABLES,
    AUTHENTICATED_ROUTES.GPS_101_DELIVERABLE,
    AUTHENTICATED_ROUTES.GPS_101_DASHBOARD,
    AUTHENTICATED_ROUTES.GPS_101_ORANGE_BEACON
  ]
};

// ==================== NAVIGATION STRUCTURE ====================

export const MAIN_NAVIGATION = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: AUTHENTICATED_ROUTES.DASHBOARD,
    icon: 'dashboard',
    order: 1
  },
  {
    id: 'gps-101',
    label: 'GPS 101',
    path: AUTHENTICATED_ROUTES.GPS_101,
    icon: 'gps-101',
    order: 2,
    badge: 'NEW',
    featured: true
  },
  {
    id: 'gpo-call',
    label: 'GPO Call',
    path: AUTHENTICATED_ROUTES.GPO_CALL,
    icon: 'gpo-call',
    order: 3
  },
  {
    id: 'missions',
    label: 'Missions',
    path: AUTHENTICATED_ROUTES.MISSIONS,
    icon: 'missions',
    order: 4
  },
  {
    id: 'projects',
    label: 'Projects',
    path: AUTHENTICATED_ROUTES.PROJECTS,
    icon: 'projects',
    order: 5
  },
  {
    id: 'parties',
    label: 'Parties',
    path: AUTHENTICATED_ROUTES.PARTIES,
    icon: 'parties',
    order: 6
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    path: AUTHENTICATED_ROUTES.PORTFOLIO,
    icon: 'portfolio',
    order: 7
  },
  {
    id: 'leaderboard',
    label: 'Leaderboard',
    path: AUTHENTICATED_ROUTES.LEADERBOARD,
    icon: 'leaderboard',
    order: 8
  }
];

export const SECONDARY_NAVIGATION = [
  {
    id: 'profile',
    label: 'Profile',
    path: AUTHENTICATED_ROUTES.PROFILE,
    icon: 'profile'
  },
  {
    id: 'settings',
    label: 'Settings',
    path: AUTHENTICATED_ROUTES.SETTINGS,
    icon: 'settings'
  },
  {
    id: 'help',
    label: 'Help',
    path: AUTHENTICATED_ROUTES.HELP,
    icon: 'help'
  }
];

// ==================== GPS 101 NAVIGATION ====================

export const GPS_101_NAVIGATION = [
  {
    id: 'gps-101-overview',
    label: 'Overview',
    path: AUTHENTICATED_ROUTES.GPS_101,
    icon: 'overview',
    order: 1
  },
  {
    id: 'gps-101-stage-1',
    label: 'Stage 1: Identity',
    path: '/gps101/stage/1',
    icon: 'stage',
    order: 2,
    stageNumber: 1
  },
  {
    id: 'gps-101-stage-2',
    label: 'Stage 2: Problem',
    path: '/gps101/stage/2',
    icon: 'stage',
    order: 3,
    stageNumber: 2
  },
  {
    id: 'gps-101-stage-3',
    label: 'Stage 3: Owner',
    path: '/gps101/stage/3',
    icon: 'stage',
    order: 4,
    stageNumber: 3
  },
  {
    id: 'gps-101-stage-4',
    label: 'Stage 4: Purpose',
    path: '/gps101/stage/4',
    icon: 'stage',
    order: 5,
    stageNumber: 4
  },
  {
    id: 'gps-101-stage-5',
    label: 'Stage 5: Project',
    path: '/gps101/stage/5',
    icon: 'stage',
    order: 6,
    stageNumber: 5
  }
];

// ==================== HELPER FUNCTIONS ====================

/**
 * Get route metadata
 */
export const getRouteMetadata = (path) => {
  return ROUTE_METADATA[path] || {};
};

/**
 * Check if route requires authentication
 */
export const requiresAuth = (path) => {
  return ROUTE_PERMISSIONS.AUTHENTICATED.includes(path);
};

/**
 * Check if route requires admin
 */
export const requiresAdmin = (path) => {
  return ROUTE_PERMISSIONS.ADMIN.includes(path);
};

/**
 * Check if route requires GPS 101 enrollment
 */
export const requiresGPS101Enrollment = (path) => {
  return ROUTE_PERMISSIONS.GPS_101_ENROLLMENT_REQUIRED.includes(path);
};

/**
 * Build route with params
 */
export const buildRoute = (route, params = {}) => {
  let builtRoute = route;
  Object.keys(params).forEach(key => {
    builtRoute = builtRoute.replace(`:${key}`, params[key]);
  });
  return builtRoute;
};

// Export all routes
export default {
  PUBLIC_ROUTES,
  AUTHENTICATED_ROUTES,
  ADMIN_ROUTES,
  UNIVERSITY_ROUTES,
  ROUTE_METADATA,
  ROUTE_PERMISSIONS,
  MAIN_NAVIGATION,
  SECONDARY_NAVIGATION,
  GPS_101_NAVIGATION,
  getRouteMetadata,
  requiresAuth,
  requiresAdmin,
  requiresGPS101Enrollment,
  buildRoute
};