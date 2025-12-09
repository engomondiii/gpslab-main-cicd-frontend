/**
 * GPS Lab Platform - Routes Index
 * 
 * Central export for all routing components and utilities.
 * 
 * @module routes
 */

// Main Router
export { 
  default as AppRouter,
  getAllRoutes,
  findRouteByPath,
  getNavigationItems,
  ScrollToTop,
  RouteTransition
} from './AppRouter';

// Public Routes
export { 
  default as PublicRoutes,
  PUBLIC_ROUTES,
  RouteLoadingFallback,
  getRouteComponent,
  PlaceholderPage
} from './PublicRoutes';

// Private Routes
export { 
  default as PrivateRoutes,
  PRIVATE_ROUTES,
  getPrivateRouteComponent
} from './PrivateRoutes';

// Admin Routes
export { 
  default as AdminRoutes,
  ADMIN_ROUTES,
  getAdminRouteComponent
} from './AdminRoutes';

// University Routes
export { 
  default as UniversityRoutes,
  UNIVERSITY_ROUTES,
  getUniversityRouteComponent
} from './UniversityRoutes';