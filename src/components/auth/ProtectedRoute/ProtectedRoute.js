/**
 * GPS Lab Platform - ProtectedRoute Component
 * 
 * Route protection wrapper that checks authentication status
 * and redirects to login if not authenticated.
 * 
 * @module components/auth/ProtectedRoute/ProtectedRoute
 */

import React from 'react';
import './ProtectedRoute.css';

/**
 * Loading screen shown while checking authentication
 */
const AuthLoadingScreen = () => (
  <div className="protected-route__loading">
    <div className="protected-route__loading-content">
      <div className="protected-route__spinner">
        <div className="protected-route__spinner-ring" />
        <div className="protected-route__spinner-ring" />
        <div className="protected-route__spinner-ring" />
      </div>
      <p className="protected-route__loading-text">Verifying access...</p>
    </div>
  </div>
);

/**
 * Access denied screen for unauthorized users
 */
const AccessDeniedScreen = ({ requiredRole, userRole, onGoBack }) => (
  <div className="protected-route__denied">
    <div className="protected-route__denied-content">
      <div className="protected-route__denied-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
        </svg>
      </div>
      <h2 className="protected-route__denied-title">Access Denied</h2>
      <p className="protected-route__denied-text">
        You don't have permission to access this area.
        {requiredRole && (
          <span className="protected-route__denied-requirement">
            Required role: <strong>{requiredRole}</strong>
          </span>
        )}
      </p>
      <div className="protected-route__denied-actions">
        <button 
          className="protected-route__denied-btn protected-route__denied-btn--primary"
          onClick={onGoBack}
        >
          Go Back
        </button>
        <a 
          href="/dashboard" 
          className="protected-route__denied-btn protected-route__denied-btn--secondary"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  </div>
);

/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication and/or specific roles.
 * Handles loading states, redirects, and access denied scenarios.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Protected content to render
 * @param {boolean} props.isAuthenticated - Whether user is authenticated
 * @param {boolean} props.isLoading - Whether auth check is in progress
 * @param {Object} props.user - Current user object
 * @param {string|string[]} props.requiredRoles - Required role(s) to access route
 * @param {string} props.redirectTo - Path to redirect unauthenticated users
 * @param {Function} props.onRedirect - Callback for redirect (e.g., navigate function)
 * @param {React.ReactNode} props.fallback - Custom loading component
 * @param {boolean} props.showAccessDenied - Show access denied instead of redirect
 */
const ProtectedRoute = ({
  children,
  isAuthenticated = false,
  isLoading = false,
  user = null,
  requiredRoles = null,
  redirectTo = '/login',
  onRedirect,
  fallback,
  showAccessDenied = true,
  className = '',
  ...props
}) => {
  
  // Show loading state while checking authentication
  if (isLoading) {
    return fallback || <AuthLoadingScreen />;
  }
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    // Store intended destination for redirect after login
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname + window.location.search;
      sessionStorage.setItem('gps_redirect_after_login', currentPath);
    }
    
    // Use callback if provided, otherwise use href redirect
    if (onRedirect) {
      onRedirect(redirectTo);
      return null;
    }
    
    // Fallback to window.location for redirect
    if (typeof window !== 'undefined') {
      window.location.href = redirectTo;
    }
    
    return <AuthLoadingScreen />;
  }
  
  // Check role-based access if requiredRoles specified
  if (requiredRoles) {
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    const userRole = user?.role || user?.roles?.[0] || 'user';
    const hasRequiredRole = roles.some(role => 
      userRole === role || 
      (Array.isArray(user?.roles) && user.roles.includes(role))
    );
    
    if (!hasRequiredRole) {
      if (showAccessDenied) {
        return (
          <AccessDeniedScreen 
            requiredRole={roles.join(' or ')}
            userRole={userRole}
            onGoBack={() => window.history.back()}
          />
        );
      }
      
      // Redirect to dashboard if access denied and not showing denied screen
      if (onRedirect) {
        onRedirect('/dashboard');
        return null;
      }
      
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard';
      }
      
      return <AuthLoadingScreen />;
    }
  }
  
  // User is authenticated and authorized - render children
  const classNames = ['protected-route', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
};

/**
 * Helper function to get redirect path after login
 */
export const getRedirectAfterLogin = (defaultPath = '/dashboard') => {
  if (typeof window === 'undefined') return defaultPath;
  
  const savedPath = sessionStorage.getItem('gps_redirect_after_login');
  sessionStorage.removeItem('gps_redirect_after_login');
  
  return savedPath || defaultPath;
};

/**
 * Helper function to check if user has specific role
 */
export const hasRole = (user, role) => {
  if (!user) return false;
  if (user.role === role) return true;
  if (Array.isArray(user.roles) && user.roles.includes(role)) return true;
  return false;
};

/**
 * Helper function to check if user has any of the specified roles
 */
export const hasAnyRole = (user, roles) => {
  if (!user || !roles) return false;
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return roleArray.some(role => hasRole(user, role));
};

export default ProtectedRoute;