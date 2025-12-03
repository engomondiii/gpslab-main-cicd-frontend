/**
 * GPS Lab Platform - useAuth Hook
 * 
 * Custom hook for authentication state management including
 * login, logout, registration, and session handling.
 * 
 * @module hooks/useAuth
 * @version 1.0.0
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import authService from '../services/api/auth.service';
import { getItem, setItem, removeItem, STORAGE_KEYS, subscribe } from '../services/storage/localStorage.service';
import { getReturnUrl, clearReturnUrl, getPendingAction } from '../services/storage/sessionStorage.service';

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

/**
 * Authentication hook
 * @returns {Object} Auth state and methods
 */
export const useAuth = () => {
  // State
  const [user, setUser] = useState(() => getItem(STORAGE_KEYS.user));
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  
  // ==========================================================================
  // EFFECTS
  // ==========================================================================
  
  /**
   * Initialize auth state
   */
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      try {
        const storedUser = getItem(STORAGE_KEYS.user);
        const token = getItem(STORAGE_KEYS.accessToken);
        
        if (token && storedUser) {
          // Validate token is still valid
          const isValid = await authService.validateToken();
          
          if (isValid) {
            setUser(storedUser);
            setIsAuthenticated(true);
          } else {
            // Token invalid, try to refresh
            try {
              await authService.refreshToken();
              const freshUser = await authService.getCurrentUser();
              setUser(freshUser);
              setIsAuthenticated(true);
            } catch (refreshError) {
              // Refresh failed, clear auth
              clearAuth();
            }
          }
        } else {
          clearAuth();
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  /**
   * Listen for auth events
   */
  useEffect(() => {
    const handleLogin = (event) => {
      setUser(event.detail);
      setIsAuthenticated(true);
    };
    
    const handleLogout = () => {
      clearAuth();
    };
    
    window.addEventListener('auth:login', handleLogin);
    window.addEventListener('auth:logout', handleLogout);
    
    return () => {
      window.removeEventListener('auth:login', handleLogin);
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);
  
  /**
   * Sync auth state across tabs
   */
  useEffect(() => {
    const unsubscribe = subscribe((event) => {
      if (event.key === STORAGE_KEYS.user) {
        if (event.newValue) {
          setUser(event.newValue);
          setIsAuthenticated(true);
        } else {
          clearAuth();
        }
      }
    });
    
    return unsubscribe;
  }, []);
  
  // ==========================================================================
  // HELPERS
  // ==========================================================================
  
  /**
   * Clears auth state
   */
  const clearAuth = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);
  
  // ==========================================================================
  // AUTH METHODS
  // ==========================================================================
  
  /**
   * Login with credentials
   * @param {Object} credentials - Login credentials
   * @returns {Promise<Object>} User data
   */
  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.login(credentials);
      setUser(result.user);
      setIsAuthenticated(true);
      
      // Get return URL
      const returnUrl = getReturnUrl();
      clearReturnUrl();
      
      // Get pending action
      const pendingAction = getPendingAction();
      
      return {
        user: result.user,
        returnUrl,
        pendingAction
      };
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Register new user
   * @param {Object} userData - Registration data
   * @returns {Promise<Object>} User data
   */
  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.register(userData);
      setUser(result.user);
      setIsAuthenticated(true);
      
      return {
        user: result.user,
        requiresVerification: result.requiresVerification
      };
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Logout
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    
    try {
      await authService.logout();
    } finally {
      clearAuth();
      setIsLoading(false);
    }
  }, [clearAuth]);
  
  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<Object>} Result
   */
  const forgotPassword = useCallback(async (email) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.forgotPassword(email);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Reset password
   * @param {Object} data - Reset data
   * @returns {Promise<Object>} Result
   */
  const resetPassword = useCallback(async (data) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.resetPassword(data);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Change password
   * @param {Object} data - Password data
   * @returns {Promise<Object>} Result
   */
  const changePassword = useCallback(async (data) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.changePassword(data);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Verify email
   * @param {string} token - Verification token
   * @returns {Promise<Object>} Result
   */
  const verifyEmail = useCallback(async (token) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.verifyEmail(token);
      
      if (result.user) {
        setUser(result.user);
      }
      
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Resend verification email
   * @param {string} email - User email
   * @returns {Promise<Object>} Result
   */
  const resendVerification = useCallback(async (email) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.resendVerification(email);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // ==========================================================================
  // OAUTH METHODS
  // ==========================================================================
  
  /**
   * Initiates Google OAuth
   * @param {Object} options - OAuth options
   * @returns {string} OAuth URL
   */
  const loginWithGoogle = useCallback((options = {}) => {
    return authService.initiateGoogleOAuth(options);
  }, []);
  
  /**
   * Initiates Apple OAuth
   * @param {Object} options - OAuth options
   * @returns {string} OAuth URL
   */
  const loginWithApple = useCallback((options = {}) => {
    return authService.initiateAppleOAuth(options);
  }, []);
  
  /**
   * Handles OAuth callback
   * @param {Object} params - Callback params
   * @returns {Promise<Object>} Result
   */
  const handleOAuthCallback = useCallback(async (params) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.handleOAuthCallback(params);
      setUser(result.user);
      setIsAuthenticated(true);
      
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // ==========================================================================
  // UTILITY METHODS
  // ==========================================================================
  
  /**
   * Refreshes user data
   * @returns {Promise<Object>} Updated user
   */
  const refreshUser = useCallback(async () => {
    try {
      const freshUser = await authService.getCurrentUser();
      setUser(freshUser);
      return freshUser;
    } catch (err) {
      console.error('Failed to refresh user:', err);
      throw err;
    }
  }, []);
  
  /**
   * Updates user locally
   * @param {Object} updates - User updates
   */
  const updateUser = useCallback((updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      setItem(STORAGE_KEYS.user, updated);
      return updated;
    });
  }, []);
  
  /**
   * Clears error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  // ==========================================================================
  // COMPUTED VALUES
  // ==========================================================================
  
  const isEmailVerified = useMemo(() => {
    return user?.emailVerified || false;
  }, [user]);
  
  const subscriptionTier = useMemo(() => {
    return user?.subscription?.tier || 'FREE';
  }, [user]);
  
  const hasActiveSubscription = useMemo(() => {
    return subscriptionTier !== 'FREE';
  }, [subscriptionTier]);
  
  // ==========================================================================
  // RETURN
  // ==========================================================================
  
  return {
    // State
    user,
    isLoading,
    isAuthenticated,
    error,
    isEmailVerified,
    subscriptionTier,
    hasActiveSubscription,
    
    // Auth methods
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    verifyEmail,
    resendVerification,
    
    // OAuth
    loginWithGoogle,
    loginWithApple,
    handleOAuthCallback,
    
    // Utilities
    refreshUser,
    updateUser,
    clearError
  };
};

export default useAuth;