/**
 * GPS Lab Platform - AppRouter Component
 * 
 * Main router combining all route groups.
 * Handles route matching, navigation, and 404 handling.
 * 
 * @module routes/AppRouter
 */

import React, { Suspense, useCallback, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Route configurations
import PublicRoutes, { PUBLIC_ROUTES, RouteLoadingFallback } from './PublicRoutes';
import PrivateRoutes, { PRIVATE_ROUTES } from './PrivateRoutes';
import AdminRoutes, { ADMIN_ROUTES } from './AdminRoutes';
import UniversityRoutes, { UNIVERSITY_ROUTES } from './UniversityRoutes';

// Pages
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import ErrorPage from '../pages/ErrorPage/ErrorPage';

// Auth components
import { getRedirectAfterLogin } from '../components/auth/ProtectedRoute/ProtectedRoute';

import './AppRouter.css';

/**
 * Scroll to top on route change
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

/**
 * Route transition wrapper for animations
 */
const RouteTransition = ({ children }) => {
  return (
    <div className="route-transition">
      {children}
    </div>
  );
};

/**
 * AppRouter Component
 * 
 * Main application router that combines all route groups.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.auth - Authentication state
 * @param {Object} props.user - Current user
 * @param {boolean} props.isAuthenticated - Authentication status
 * @param {boolean} props.isLoading - Loading state
 * @param {Function} props.onLogin - Login handler
 * @param {Function} props.onRegister - Register handler
 * @param {Function} props.onOAuthLogin - OAuth login handler
 * @param {Function} props.onLogout - Logout handler
 * @param {Array} props.notifications - User notifications
 * @param {Object} props.stats - User stats
 * @param {Object} props.wallets - User wallets
 * @param {string} props.currentLanguage - Current language
 * @param {Function} props.onLanguageChange - Language change handler
 * @param {Function} props.onNotificationClick - Notification click handler
 */
const AppRouter = ({
  user = null,
  isAuthenticated = false,
  isLoading = false,
  onLogin,
  onRegister,
  onOAuthLogin,
  onLogout,
  notifications = [],
  stats = {},
  wallets = {},
  currentLanguage = 'en',
  onLanguageChange,
  onNotificationClick
}) => {
  
  /**
   * Handle successful login - redirect to intended destination
   */
  const handleLoginSuccess = useCallback(() => {
    const redirectPath = getRedirectAfterLogin('/dashboard');
    window.location.href = redirectPath;
  }, []);
  
  /**
   * Handle login with success callback
   */
  const handleLogin = useCallback(async (credentials) => {
    if (onLogin) {
      const result = await onLogin(credentials);
      if (result?.success) {
        handleLoginSuccess();
      }
      return result;
    }
  }, [onLogin, handleLoginSuccess]);
  
  /**
   * Handle registration with success callback
   */
  const handleRegister = useCallback(async (data) => {
    if (onRegister) {
      const result = await onRegister(data);
      if (result?.success) {
        // Redirect to onboarding or dashboard after registration
        window.location.href = '/onboarding';
      }
      return result;
    }
  }, [onRegister]);
  
  /**
   * Common props for route components
   */
  const routeProps = useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
    notifications,
    stats,
    wallets,
    currentLanguage,
    onLanguageChange,
    onLogout,
    onNotificationClick
  }), [user, isAuthenticated, isLoading, notifications, stats, wallets, currentLanguage, onLanguageChange, onLogout, onNotificationClick]);
  
  /**
   * Build public route elements
   */
  const publicRouteElements = useMemo(() => {
    return PUBLIC_ROUTES.map(route => {
      // Lazy load components
      const LazyComponent = React.lazy(() => {
        // Map element names to actual component imports
        const componentMap = {
          HomePage: () => import('../pages/HomePage/HomePage'),
          LoginPage: () => import('../pages/LoginPage/LoginPage'),
          RegisterPage: () => import('../pages/RegisterPage/RegisterPage'),
          ForgotPasswordPage: () => import('../pages/ForgotPasswordPage/ForgotPasswordPage'),
          ResetPasswordPage: () => import('../pages/ResetPasswordPage/ResetPasswordPage')
        };
        
        return componentMap[route.element] 
          ? componentMap[route.element]()
          : Promise.resolve({ default: () => <div>{route.title}</div> });
      });
      
      // Add props for auth pages
      const getPageProps = () => {
        if (route.element === 'LoginPage') {
          return { onLogin: handleLogin, onOAuthLogin };
        }
        if (route.element === 'RegisterPage') {
          return { onRegister: handleRegister, onOAuthLogin };
        }
        return {};
      };
      
      // Redirect authenticated users from auth pages
      if (['LoginPage', 'RegisterPage', 'ForgotPasswordPage', 'ResetPasswordPage'].includes(route.element)) {
        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Suspense fallback={<RouteLoadingFallback />}>
                  <LazyComponent {...getPageProps()} />
                </Suspense>
              )
            }
          />
        );
      }
      
      return (
        <Route
          key={route.path}
          path={route.path}
          element={
            <Suspense fallback={<RouteLoadingFallback />}>
              <LazyComponent {...getPageProps()} />
            </Suspense>
          }
        />
      );
    });
  }, [isAuthenticated, handleLogin, handleRegister, onOAuthLogin]);
  
  /**
   * Build private route elements
   */
  const privateRouteElements = useMemo(() => {
    const { routes } = PrivateRoutes(routeProps);
    return routes.map(route => (
      <Route
        key={route.path}
        path={route.path}
        element={route.component}
      />
    ));
  }, [routeProps]);
  
  /**
   * Build admin route elements
   */
  const adminRouteElements = useMemo(() => {
    const { routes } = AdminRoutes(routeProps);
    return routes.map(route => (
      <Route
        key={route.path}
        path={route.path}
        element={route.component}
      />
    ));
  }, [routeProps]);
  
  /**
   * Build university route elements
   */
  const universityRouteElements = useMemo(() => {
    const { routes } = UniversityRoutes(routeProps);
    return routes.map(route => (
      <Route
        key={route.path}
        path={route.path}
        element={route.component}
      />
    ));
  }, [routeProps]);
  
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app-router">
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            {publicRouteElements}
            
            {/* Private Routes (require authentication) */}
            {privateRouteElements}
            
            {/* Admin Routes (require admin role) */}
            {adminRouteElements}
            
            {/* University Routes (require university role) */}
            {universityRouteElements}
            
            {/* Onboarding Route */}
            <Route
              path="/onboarding"
              element={
                isAuthenticated ? (
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <div className="placeholder-page">
                      <h1>Welcome to GPS Lab!</h1>
                      <p>Let's get you started on your journey.</p>
                    </div>
                  </Suspense>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            
            {/* Error Route */}
            <Route
              path="/error"
              element={<ErrorPage />}
            />
            
            {/* 404 Not Found - must be last */}
            <Route
              path="*"
              element={<NotFoundPage />}
            />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
};

/**
 * Get all registered routes for navigation/sitemap
 */
export const getAllRoutes = () => ({
  public: PUBLIC_ROUTES,
  private: PRIVATE_ROUTES,
  admin: ADMIN_ROUTES,
  university: UNIVERSITY_ROUTES
});

/**
 * Find route by path
 */
export const findRouteByPath = (path) => {
  const allRoutes = [
    ...PUBLIC_ROUTES,
    ...PRIVATE_ROUTES,
    ...ADMIN_ROUTES,
    ...UNIVERSITY_ROUTES
  ];
  
  return allRoutes.find(route => {
    // Handle dynamic segments
    const routePattern = route.path.replace(/:\w+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(path);
  });
};

/**
 * Get navigation items for sidebar/header
 */
export const getNavigationItems = (userRole = 'user') => {
  const privateNavItems = PRIVATE_ROUTES
    .filter(route => route.showInNav)
    .map(route => ({
      path: route.path,
      label: route.title,
      icon: route.icon
    }));
  
  // Add admin nav item if user is admin
  if (['admin', 'super_admin'].includes(userRole)) {
    privateNavItems.push({
      path: '/admin',
      label: 'Admin',
      icon: 'admin'
    });
  }
  
  // Add university nav item if user has university role
  if (['university_admin', 'professor', 'teaching_assistant'].includes(userRole)) {
    privateNavItems.push({
      path: '/university',
      label: 'University',
      icon: 'university'
    });
  }
  
  return privateNavItems;
};

export { ScrollToTop, RouteTransition };
export default AppRouter;