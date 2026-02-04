/**
 * GPS Lab Platform - Routes Configuration
 * 
 * Central configuration for application routes.
 * 
 * @module config/routes.config
 */

// =============================================================================
// ROUTE PATHS
// =============================================================================

export const ROUTES = {
  // Public Routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  
  // Dashboard
  DASHBOARD: '/dashboard',
  
  // GPO Call Routes (Stages -4 to 0)
  GPO_CALL: '/gpo-call',
  GPO_CALL_STAGE: '/gpo-call/stage/:stageNumber',
  GPO_SHOWCASE: '/gpo-call/showcase',
  GPO_SHOWCASE_VIEW: '/gpo-call/showcase/:showcaseId',
  
  // Training Routes
  MISSIONS: '/missions',
  MISSION_DETAIL: '/missions/:missionId',
  STAGES: '/stages',
  STAGE_DETAIL: '/stages/:stageNumber',
  CHECKPOINTS: '/checkpoints',
  STUDY: '/study',
  STUDY_FORGE: '/study/forge',
  PRACTICE: '/study/practice',
  
  // Projects
  PROJECTS: '/projects',
  PROJECTS_GPO: '/projects/gpo',
  PROJECT_DETAIL: '/projects/:projectId',
  PROJECT_CREATE: '/projects/create',
  PROJECT_EDIT: '/projects/:projectId/edit',
  
  // Community
  PARTIES: '/parties',
  PARTY_DETAIL: '/parties/:partyId',
  MENTORS: '/mentors',
  MENTOR_PROFILE: '/mentors/:mentorId',
  LEADERBOARD: '/leaderboard',
  
  // Marketplace
  MARKETPLACE: '/marketplace',
  MARKETPLACE_ITEM: '/marketplace/:itemId',
  
  // Wallet
  WALLET: '/wallet',
  WALLET_BARAKA: '/wallet/baraka',
  WALLET_TRANSACTIONS: '/wallet/transactions',
  
  // Profile
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
  PROFILE_VIEW: '/profile/:userId',
  SETTINGS: '/settings',
  
  // Admin
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_MISSIONS: '/admin/missions',
  ADMIN_GPO: '/admin/gpo',
  
  // Other
  ABOUT: '/about',
  HELP: '/help',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  NOT_FOUND: '/404'
};

// =============================================================================
// ROUTE GROUPS
// =============================================================================

export const ROUTE_GROUPS = {
  PUBLIC: [
    ROUTES.HOME,
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.FORGOT_PASSWORD,
    ROUTES.RESET_PASSWORD,
    ROUTES.ABOUT,
    ROUTES.HELP,
    ROUTES.PRIVACY,
    ROUTES.TERMS
  ],
  
  AUTHENTICATED: [
    ROUTES.DASHBOARD,
    ROUTES.GPO_CALL,
    ROUTES.MISSIONS,
    ROUTES.STAGES,
    ROUTES.CHECKPOINTS,
    ROUTES.STUDY,
    ROUTES.PROJECTS,
    ROUTES.PARTIES,
    ROUTES.MENTORS,
    ROUTES.MARKETPLACE,
    ROUTES.WALLET,
    ROUTES.PROFILE,
    ROUTES.SETTINGS
  ],
  
  GPO_ONLY: [
    ROUTES.GPO_CALL,
    ROUTES.GPO_CALL_STAGE,
    ROUTES.GPO_SHOWCASE
  ],
  
  ADMIN_ONLY: [
    ROUTES.ADMIN,
    ROUTES.ADMIN_USERS,
    ROUTES.ADMIN_MISSIONS,
    ROUTES.ADMIN_GPO
  ]
};

// =============================================================================
// ROUTE METADATA
// =============================================================================

export const ROUTE_META = {
  [ROUTES.GPO_CALL]: {
    title: 'GPO Call - Problem Showcase',
    description: 'Create your problem showcase to attract Global Problem Solvers',
    requiresAuth: true,
    roles: ['gpo', 'admin']
  },
  [ROUTES.DASHBOARD]: {
    title: 'Dashboard',
    description: 'Your GPS Lab mission control center',
    requiresAuth: true
  },
  [ROUTES.MISSIONS]: {
    title: 'Missions',
    description: 'Browse and manage your missions',
    requiresAuth: true
  },
  [ROUTES.PROJECTS]: {
    title: 'Projects',
    description: 'Manage your GPS Lab projects',
    requiresAuth: true
  }
};

// =============================================================================
// NAVIGATION HELPERS
// =============================================================================

/**
 * Build route with params
 */
export const buildRoute = (route, params = {}) => {
  let path = route;
  Object.keys(params).forEach(key => {
    path = path.replace(`:${key}`, params[key]);
  });
  return path;
};

/**
 * Check if route requires authentication
 */
export const requiresAuth = (route) => {
  return ROUTE_GROUPS.AUTHENTICATED.some(r => route.startsWith(r));
};

/**
 * Check if route is GPO-only
 */
export const isGPORoute = (route) => {
  return ROUTE_GROUPS.GPO_ONLY.some(r => route.startsWith(r));
};

/**
 * Check if route is admin-only
 */
export const isAdminRoute = (route) => {
  return ROUTE_GROUPS.ADMIN_ONLY.some(r => route.startsWith(r));
};

export default {
  ROUTES,
  ROUTE_GROUPS,
  ROUTE_META,
  buildRoute,
  requiresAuth,
  isGPORoute,
  isAdminRoute
};