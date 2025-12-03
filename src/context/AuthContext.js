/**
 * GPS Lab Platform - AuthContext
 * 
 * Global authentication context provider for managing
 * user authentication state across the application.
 * 
 * @module context/AuthContext
 * @version 1.0.0
 */

import React, { createContext, useContext, useEffect, useMemo, useReducer, useCallback } from 'react';
import authService from '../services/api/auth.service';
import { 
  getItem, 
  setItem, 
  removeItem, 
  STORAGE_KEYS,
  subscribe 
} from '../services/storage/localStorage.service';
import { 
  getReturnUrl, 
  clearReturnUrl, 
  setReturnUrl,
  getPendingAction,
  clearPendingAction
} from '../services/storage/sessionStorage.service';

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,
  error: null,
  sessionExpiresAt: null
};

// =============================================================================
// ACTION TYPES
// =============================================================================

const AUTH_ACTIONS = {
  INITIALIZE: 'auth/initialize',
  LOGIN_START: 'auth/loginStart',
  LOGIN_SUCCESS: 'auth/loginSuccess',
  LOGIN_ERROR: 'auth/loginError',
  LOGOUT: 'auth/logout',
  UPDATE_USER: 'auth/updateUser',
  SET_ERROR: 'auth/setError',
  CLEAR_ERROR: 'auth/clearError',
  SET_SESSION_EXPIRY: 'auth/setSessionExpiry',
  REFRESH_TOKEN: 'auth/refreshToken'
};

// =============================================================================
// REDUCER
// =============================================================================

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.INITIALIZE:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: !!action.payload.user,
        isLoading: false,
        isInitialized: true,
        sessionExpiresAt: action.payload.expiresAt
      };
      
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
      
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        sessionExpiresAt: action.payload.expiresAt
      };
      
    case AUTH_ACTIONS.LOGIN_ERROR:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
      
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        sessionExpiresAt: null
      };
      
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
      
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
      
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    case AUTH_ACTIONS.SET_SESSION_EXPIRY:
      return {
        ...state,
        sessionExpiresAt: action.payload
      };
      
    case AUTH_ACTIONS.REFRESH_TOKEN:
      return {
        ...state,
        sessionExpiresAt: action.payload
      };
      
    default:
      return state;
  }
};

// =============================================================================
// CONTEXT
// =============================================================================

const AuthContext = createContext(null);

// =============================================================================
// PROVIDER
// =============================================================================

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  // ===========================================================================
  // INITIALIZATION
  // ===========================================================================
  
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = getItem(STORAGE_KEYS.user);
        const accessToken = getItem(STORAGE_KEYS.accessToken);
        const tokenExpiry = getItem(STORAGE_KEYS.tokenExpiry);
        
        if (!accessToken || !storedUser) {
          dispatch({
            type: AUTH_ACTIONS.INITIALIZE,
            payload: { user: null, expiresAt: null }
          });
          return;
        }
        
        // Check if token is expired
        const isExpired = tokenExpiry && new Date(tokenExpiry) < new Date();
        
        if (isExpired) {
          // Try to refresh
          try {
            const result = await authService.refreshToken();
            dispatch({
              type: AUTH_ACTIONS.INITIALIZE,
              payload: { 
                user: storedUser, 
                expiresAt: result.expiresAt 
              }
            });
          } catch (error) {
            // Refresh failed, log out
            dispatch({
              type: AUTH_ACTIONS.INITIALIZE,
              payload: { user: null, expiresAt: null }
            });
          }
        } else {
          // Token still valid
          dispatch({
            type: AUTH_ACTIONS.INITIALIZE,
            payload: { 
              user: storedUser, 
              expiresAt: tokenExpiry 
            }
          });
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        dispatch({
          type: AUTH_ACTIONS.INITIALIZE,
          payload: { user: null, expiresAt: null }
        });
      }
    };
    
    initializeAuth();
  }, []);
  
  // ===========================================================================
  // CROSS-TAB SYNC
  // ===========================================================================
  
  useEffect(() => {
    const unsubscribe = subscribe((event) => {
      if (event.key === STORAGE_KEYS.user) {
        if (event.newValue) {
          dispatch({
            type: AUTH_ACTIONS.UPDATE_USER,
            payload: event.newValue
          });
        } else {
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      }
    });
    
    return unsubscribe;
  }, []);
  
  // ===========================================================================
  // EVENT LISTENERS
  // ===========================================================================
  
  useEffect(() => {
    const handleLogoutEvent = () => {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    };
    
    window.addEventListener('auth:logout', handleLogoutEvent);
    
    return () => {
      window.removeEventListener('auth:logout', handleLogoutEvent);
    };
  }, []);
  
  // ===========================================================================
  // AUTH METHODS
  // ===========================================================================
  
  const login = useCallback(async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      const result = await authService.login(credentials);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: result.user,
          expiresAt: result.expiresAt
        }
      });
      
      // Get return URL and pending action
      const returnUrl = getReturnUrl();
      clearReturnUrl();
      const pendingAction = getPendingAction();
      clearPendingAction();
      
      return {
        user: result.user,
        returnUrl,
        pendingAction
      };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_ERROR,
        payload: error
      });
      throw error;
    }
  }, []);
  
  const register = useCallback(async (userData) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      const result = await authService.register(userData);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: result.user,
          expiresAt: result.expiresAt
        }
      });
      
      return {
        user: result.user,
        requiresVerification: result.requiresVerification
      };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_ERROR,
        payload: error
      });
      throw error;
    }
  }, []);
  
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  }, []);
  
  const loginWithGoogle = useCallback((options = {}) => {
    if (options.returnUrl) {
      setReturnUrl(options.returnUrl);
    }
    const url = authService.initiateGoogleOAuth(options);
    window.location.href = url;
  }, []);
  
  const loginWithApple = useCallback((options = {}) => {
    if (options.returnUrl) {
      setReturnUrl(options.returnUrl);
    }
    const url = authService.initiateAppleOAuth(options);
    window.location.href = url;
  }, []);
  
  const handleOAuthCallback = useCallback(async (params) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      const result = await authService.handleOAuthCallback(params);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: result.user,
          expiresAt: result.expiresAt
        }
      });
      
      return {
        user: result.user,
        returnUrl: result.returnUrl
      };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_ERROR,
        payload: error
      });
      throw error;
    }
  }, []);
  
  const updateUser = useCallback((updates) => {
    const newUser = { ...state.user, ...updates };
    setItem(STORAGE_KEYS.user, newUser);
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: updates
    });
  }, [state.user]);
  
  const refreshUser = useCallback(async () => {
    try {
      const user = await authService.getCurrentUser();
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: user
      });
      return user;
    } catch (error) {
      console.error('Failed to refresh user:', error);
      throw error;
    }
  }, []);
  
  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);
  
  // ===========================================================================
  // PASSWORD METHODS
  // ===========================================================================
  
  const forgotPassword = useCallback(async (email) => {
    try {
      return await authService.forgotPassword(email);
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: error
      });
      throw error;
    }
  }, []);
  
  const resetPassword = useCallback(async (data) => {
    try {
      return await authService.resetPassword(data);
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: error
      });
      throw error;
    }
  }, []);
  
  const changePassword = useCallback(async (data) => {
    try {
      return await authService.changePassword(data);
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: error
      });
      throw error;
    }
  }, []);
  
  // ===========================================================================
  // EMAIL VERIFICATION
  // ===========================================================================
  
  const verifyEmail = useCallback(async (token) => {
    try {
      const result = await authService.verifyEmail(token);
      if (result.user) {
        updateUser(result.user);
      }
      return result;
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: error
      });
      throw error;
    }
  }, [updateUser]);
  
  const resendVerification = useCallback(async (email) => {
    try {
      return await authService.resendVerification(email);
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: error
      });
      throw error;
    }
  }, []);
  
  // ===========================================================================
  // COMPUTED VALUES
  // ===========================================================================
  
  const contextValue = useMemo(() => ({
    // State
    ...state,
    
    // Auth methods
    login,
    register,
    logout,
    
    // OAuth
    loginWithGoogle,
    loginWithApple,
    handleOAuthCallback,
    
    // User management
    updateUser,
    refreshUser,
    
    // Password
    forgotPassword,
    resetPassword,
    changePassword,
    
    // Email verification
    verifyEmail,
    resendVerification,
    
    // Error handling
    clearError,
    
    // Computed
    isEmailVerified: state.user?.emailVerified || false,
    subscriptionTier: state.user?.subscription?.tier || 'FREE',
    hasActiveSubscription: state.user?.subscription?.tier !== 'FREE'
  }), [
    state,
    login,
    register,
    logout,
    loginWithGoogle,
    loginWithApple,
    handleOAuthCallback,
    updateUser,
    refreshUser,
    forgotPassword,
    resetPassword,
    changePassword,
    verifyEmail,
    resendVerification,
    clearError
  ]);
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// =============================================================================
// HOOK
// =============================================================================

/**
 * Hook to use auth context
 * @returns {Object} Auth context value
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
};

// =============================================================================
// EXPORTS
// =============================================================================

export default AuthContext;