/**
 * GPS Lab Platform - AppRouter Component
 * 
 * Main router combining all route groups.
 * Handles route matching, navigation, and 404 handling.
 * 
 * @module routes/AppRouter
 */

import React, { Suspense, useCallback, useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

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
 * NavigationHandler — renders inside BrowserRouter.
 * Consumes pendingNavigate from App.js (which is outside the router)
 * and performs SPA navigation via useNavigate().
 */
const NavigationHandler = ({ pendingNavigate, onNavigateComplete }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (pendingNavigate) {
      navigate(pendingNavigate);
      if (onNavigateComplete) onNavigateComplete();
    }
  }, [pendingNavigate, navigate, onNavigateComplete]);
  
  return null;
};

/**
 * AppRouter Component
 * 
 * Main application router that combines all route groups.
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
  onNotificationClick,
  pendingNavigate = null,
  onNavigateComplete
}) => {
  
  /**
   * Handle successful login - redirect to intended destination.
   * NOTE: window.location.href is intentional here since AppRouter
   * creates <BrowserRouter> — it is not itself inside one, so
   * useNavigate() cannot be called at this scope.
   * TODO: Refactor to pass navigate via NavigationHandler if SPA nav needed.
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
          ResetPasswordPage: () => import('../pages/ResetPasswordPage/ResetPasswordPage'),
          // Add placeholder pages
          AboutPage: () => import('../pages/NotFoundPage/NotFoundPage').then(m => ({ 
            default: () => <div className="placeholder-page"><h1>About GPS Lab</h1><p>Coming soon...</p></div> 
          })),
          FeaturesPage: () => import('../pages/NotFoundPage/NotFoundPage').then(m => ({ 
            default: () => <div className="placeholder-page"><h1>Features</h1><p>Coming soon...</p></div> 
          })),
          PricingPage: () => import('../pages/NotFoundPage/NotFoundPage').then(m => ({ 
            default: () => <div className="placeholder-page"><h1>Pricing</h1><p>Coming soon...</p></div> 
          })),
          ContactPage: () => import('../pages/NotFoundPage/NotFoundPage').then(m => ({ 
            default: () => <div className="placeholder-page"><h1>Contact Us</h1><p>Coming soon...</p></div> 
          })),
          TermsPage: () => import('../pages/NotFoundPage/NotFoundPage').then(m => ({ 
            default: () => <div className="placeholder-page"><h1>Terms of Service</h1><p>Coming soon...</p></div> 
          })),
          PrivacyPage: () => import('../pages/NotFoundPage/NotFoundPage').then(m => ({ 
            default: () => <div className="placeholder-page"><h1>Privacy Policy</h1><p>Coming soon...</p></div> 
          })),
          HelpPage: () => import('../pages/NotFoundPage/NotFoundPage').then(m => ({ 
            default: () => <div className="placeholder-page"><h1>Help Center</h1><p>Coming soon...</p></div> 
          }))
        };
        
        return componentMap[route.element] 
          ? componentMap[route.element]()
          : Promise.resolve({ default: () => <div className="placeholder-page"><h1>{route.title}</h1><p>Coming soon...</p></div> });
      });
      
      // Add props for auth pages
      const getPageProps = () => {
        if (route.element === 'LoginPage') {
          return { onLogin: handleLogin, onOAuthLogin };
        }
        if (route.element === 'RegisterPage') {
          return { onRegister: handleRegister, onOAuthLogin };
        }
        // HomePage now uses useNavigate internally, so no props needed
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
      <NavigationHandler 
        pendingNavigate={pendingNavigate} 
        onNavigateComplete={onNavigateComplete} 
      />
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
                    <div className="placeholder-page onboarding-page">
                      <h1>Welcome to GPS Lab!</h1>
                      <p>Let's get you started on your journey.</p>
                      <a href="/dashboard" className="onboarding-continue-btn">
                        Continue to Dashboard
                      </a>
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