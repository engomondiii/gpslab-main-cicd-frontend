/**
 * GPS Lab Platform - AppRouter Component
 * 
 * Main router combining all route groups.
 * Handles route matching, navigation, and 404 handling.
 * 
 * @module routes/AppRouter
 * @version 1.1.0
 * 
 * UPDATED v1.1.0:
 * - Added GPO Call routes
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
 * NavigationHandler – renders inside BrowserRouter
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
  
  const handleLoginSuccess = useCallback(() => {
    const redirectPath = getRedirectAfterLogin('/dashboard');
    window.location.href = redirectPath;
  }, []);
  
  const handleLogin = useCallback(async (credentials) => {
    if (onLogin) {
      const result = await onLogin(credentials);
      if (result?.success) {
        handleLoginSuccess();
      }
      return result;
    }
  }, [onLogin, handleLoginSuccess]);
  
  const handleRegister = useCallback(async (data) => {
    if (onRegister) {
      const result = await onRegister(data);
      if (result?.success) {
        window.location.href = '/onboarding';
      }
      return result;
    }
  }, [onRegister]);
  
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
  
  const publicRouteElements = useMemo(() => {
    return PUBLIC_ROUTES.map(route => {
      const LazyComponent = React.lazy(() => {
        const componentMap = {
          HomePage: () => import('../pages/HomePage/HomePage'),
          LoginPage: () => import('../pages/LoginPage/LoginPage'),
          RegisterPage: () => import('../pages/RegisterPage/RegisterPage'),
          ForgotPasswordPage: () => import('../pages/ForgotPasswordPage/ForgotPasswordPage'),
          ResetPasswordPage: () => import('../pages/ResetPasswordPage/ResetPasswordPage'),
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
      
      const getPageProps = () => {
        if (route.element === 'LoginPage') {
          return { onLogin: handleLogin, onOAuthLogin };
        }
        if (route.element === 'RegisterPage') {
          return { onRegister: handleRegister, onOAuthLogin };
        }
        return {};
      };
      
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
            
            {/* Private Routes */}
            {privateRouteElements}
            
            {/* Admin Routes */}
            {adminRouteElements}
            
            {/* University Routes */}
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
            
            {/* 404 Not Found */}
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

export const getAllRoutes = () => ({
  public: PUBLIC_ROUTES,
  private: PRIVATE_ROUTES,
  admin: ADMIN_ROUTES,
  university: UNIVERSITY_ROUTES
});

export const findRouteByPath = (path) => {
  const allRoutes = [
    ...PUBLIC_ROUTES,
    ...PRIVATE_ROUTES,
    ...ADMIN_ROUTES,
    ...UNIVERSITY_ROUTES
  ];
  
  return allRoutes.find(route => {
    const routePattern = route.path.replace(/:\w+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(path);
  });
};

export const getNavigationItems = (userRole = 'user') => {
  const privateNavItems = PRIVATE_ROUTES
    .filter(route => route.showInNav)
    .map(route => ({
      path: route.path,
      label: route.title,
      icon: route.icon
    }));
  
  if (['admin', 'super_admin'].includes(userRole)) {
    privateNavItems.push({
      path: '/admin',
      label: 'Admin',
      icon: 'admin'
    });
  }
  
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