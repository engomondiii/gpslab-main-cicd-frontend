/**
 * GPS Lab Platform - Auth Service
 * 
 * Authentication service for login, register, logout, token refresh,
 * and OAuth integration.
 * 
 * @module services/api/auth.service
 * @version 1.0.0
 */

import apiClient, { setTokens, clearTokens, getRefreshToken } from './client';
import { setUser, removeItem, STORAGE_KEYS } from '../storage/localStorage.service';
import { saveOAuthState, validateOAuthState, savePendingAction } from '../storage/sessionStorage.service';
import { logUserAction, authLogger } from '../../utils/error/logger';
import { createError, ERROR_TYPES } from '../../utils/error/error.handler';

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * OAuth providers configuration
 */
const OAUTH_PROVIDERS = {
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    scope: 'openid email profile',
    redirectUri: `${window.location.origin}/auth/callback/google`
  },
  apple: {
    authUrl: 'https://appleid.apple.com/auth/authorize',
    clientId: process.env.REACT_APP_APPLE_CLIENT_ID,
    scope: 'name email',
    redirectUri: `${window.location.origin}/auth/callback/apple`
  }
};

/**
 * API endpoints
 */
const ENDPOINTS = {
  login: '/auth/login',
  register: '/auth/register',
  logout: '/auth/logout',
  refreshToken: '/auth/refresh-token',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  verifyEmail: '/auth/verify-email',
  resendVerification: '/auth/resend-verification',
  changePassword: '/auth/change-password',
  oauthGoogle: '/auth/oauth/google',
  oauthApple: '/auth/oauth/apple',
  me: '/auth/me',
  validateToken: '/auth/validate-token'
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Generates random state for OAuth
 * @returns {string} Random state string
 */
const generateOAuthState = () => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Builds OAuth URL
 * @param {string} provider - OAuth provider
 * @param {Object} additionalParams - Additional URL params
 * @returns {string} OAuth URL
 */
const buildOAuthUrl = (provider, additionalParams = {}) => {
  const config = OAUTH_PROVIDERS[provider];
  
  if (!config) {
    throw createError(ERROR_TYPES.INVALID_INPUT, {
      message: `Unknown OAuth provider: ${provider}`
    });
  }
  
  const state = generateOAuthState();
  
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: config.scope,
    state,
    ...additionalParams
  });
  
  return {
    url: `${config.authUrl}?${params.toString()}`,
    state
  };
};

/**
 * Processes auth response
 * @param {Object} response - API response
 * @returns {Object} Processed user data
 */
const processAuthResponse = (response) => {
  const { data } = response;
  
  // Store tokens
  if (data.accessToken) {
    setTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresAt: data.expiresAt
    });
  }
  
  // Store user data
  if (data.user) {
    setUser(data.user);
  }
  
  return data;
};

// =============================================================================
// LOGIN / REGISTER
// =============================================================================

/**
 * Logs in user with email and password
 * @param {Object} credentials - Login credentials
 * @returns {Promise<Object>} User data
 */
export const login = async ({ email, password, rememberMe = false }) => {
  authLogger.info('Login attempt', { email });
  
  try {
    const response = await apiClient.post(ENDPOINTS.login, {
      email,
      password,
      rememberMe
    });
    
    const data = processAuthResponse(response);
    
    authLogger.info('Login successful', { userId: data.user?.id });
    logUserAction('login', { method: 'email' });
    
    // Dispatch auth event
    window.dispatchEvent(new CustomEvent('auth:login', { detail: data.user }));
    
    return data;
  } catch (error) {
    authLogger.error('Login failed', { email, error: error.message });
    throw error;
  }
};

/**
 * Registers new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} User data
 */
export const register = async ({
  email,
  password,
  firstName,
  lastName,
  username,
  locale = 'en',
  referralCode,
  universityCode,
  acceptedTerms = true
}) => {
  authLogger.info('Registration attempt', { email });
  
  try {
    const response = await apiClient.post(ENDPOINTS.register, {
      email,
      password,
      firstName,
      lastName,
      username,
      locale,
      referralCode,
      universityCode,
      acceptedTerms,
      acceptedAt: new Date().toISOString()
    });
    
    const data = processAuthResponse(response);
    
    authLogger.info('Registration successful', { userId: data.user?.id });
    logUserAction('register', { method: 'email' });
    
    // Dispatch auth event
    window.dispatchEvent(new CustomEvent('auth:register', { detail: data.user }));
    
    return data;
  } catch (error) {
    authLogger.error('Registration failed', { email, error: error.message });
    throw error;
  }
};

// =============================================================================
// LOGOUT
// =============================================================================

/**
 * Logs out current user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  authLogger.info('Logout');
  
  try {
    // Call logout endpoint to invalidate token on server
    await apiClient.post(ENDPOINTS.logout);
  } catch (error) {
    // Log but don't throw - we still want to clear local state
    authLogger.warn('Logout API call failed', { error: error.message });
  }
  
  // Clear local auth state
  clearTokens();
  removeItem(STORAGE_KEYS.user);
  removeItem(STORAGE_KEYS.userProfile);
  
  logUserAction('logout');
  
  // Dispatch auth event
  window.dispatchEvent(new CustomEvent('auth:logout'));
};

// =============================================================================
// TOKEN MANAGEMENT
// =============================================================================

/**
 * Refreshes access token
 * @returns {Promise<Object>} New tokens
 */
export const refreshToken = async () => {
  const currentRefreshToken = getRefreshToken();
  
  if (!currentRefreshToken) {
    throw createError(ERROR_TYPES.UNAUTHORIZED, {
      message: 'No refresh token available'
    });
  }
  
  try {
    const response = await apiClient.post(ENDPOINTS.refreshToken, {
      refreshToken: currentRefreshToken
    });
    
    const { accessToken, refreshToken: newRefreshToken, expiresAt } = response.data;
    
    setTokens({
      accessToken,
      refreshToken: newRefreshToken || currentRefreshToken,
      expiresAt
    });
    
    return response.data;
  } catch (error) {
    authLogger.error('Token refresh failed', { error: error.message });
    
    // Clear tokens on refresh failure
    clearTokens();
    
    throw error;
  }
};

/**
 * Validates current token
 * @returns {Promise<boolean>} True if valid
 */
export const validateToken = async () => {
  try {
    await apiClient.get(ENDPOINTS.validateToken);
    return true;
  } catch (error) {
    return false;
  }
};

// =============================================================================
// PASSWORD MANAGEMENT
// =============================================================================

/**
 * Requests password reset email
 * @param {string} email - User email
 * @returns {Promise<Object>} Response
 */
export const forgotPassword = async (email) => {
  authLogger.info('Password reset requested', { email });
  
  const response = await apiClient.post(ENDPOINTS.forgotPassword, { email });
  
  logUserAction('forgot_password', { email });
  
  return response.data;
};

/**
 * Resets password with token
 * @param {Object} data - Reset data
 * @returns {Promise<Object>} Response
 */
export const resetPassword = async ({ token, password }) => {
  authLogger.info('Password reset attempt');
  
  const response = await apiClient.post(ENDPOINTS.resetPassword, {
    token,
    password
  });
  
  logUserAction('reset_password');
  
  return response.data;
};

/**
 * Changes password for authenticated user
 * @param {Object} data - Password data
 * @returns {Promise<Object>} Response
 */
export const changePassword = async ({ currentPassword, newPassword }) => {
  authLogger.info('Password change attempt');
  
  const response = await apiClient.post(ENDPOINTS.changePassword, {
    currentPassword,
    newPassword
  });
  
  logUserAction('change_password');
  
  return response.data;
};

// =============================================================================
// EMAIL VERIFICATION
// =============================================================================

/**
 * Verifies email with token
 * @param {string} token - Verification token
 * @returns {Promise<Object>} Response
 */
export const verifyEmail = async (token) => {
  authLogger.info('Email verification attempt');
  
  const response = await apiClient.post(ENDPOINTS.verifyEmail, { token });
  
  // Update user data if verified
  if (response.data.user) {
    setUser(response.data.user);
  }
  
  logUserAction('verify_email');
  
  return response.data;
};

/**
 * Resends verification email
 * @param {string} email - User email
 * @returns {Promise<Object>} Response
 */
export const resendVerification = async (email) => {
  authLogger.info('Resend verification requested', { email });
  
  const response = await apiClient.post(ENDPOINTS.resendVerification, { email });
  
  logUserAction('resend_verification', { email });
  
  return response.data;
};

// =============================================================================
// OAUTH
// =============================================================================

/**
 * Initiates Google OAuth flow
 * @param {Object} options - OAuth options
 * @returns {string} OAuth URL
 */
export const initiateGoogleOAuth = ({ returnUrl, pendingAction } = {}) => {
  const { url, state } = buildOAuthUrl('google', {
    access_type: 'offline',
    prompt: 'consent'
  });
  
  // Save state for validation
  saveOAuthState(state, { provider: 'google', returnUrl });
  
  // Save pending action if provided
  if (pendingAction) {
    savePendingAction(pendingAction);
  }
  
  authLogger.info('Google OAuth initiated');
  logUserAction('oauth_initiated', { provider: 'google' });
  
  return url;
};

/**
 * Initiates Apple OAuth flow
 * @param {Object} options - OAuth options
 * @returns {string} OAuth URL
 */
export const initiateAppleOAuth = ({ returnUrl, pendingAction } = {}) => {
  const { url, state } = buildOAuthUrl('apple', {
    response_mode: 'form_post'
  });
  
  // Save state for validation
  saveOAuthState(state, { provider: 'apple', returnUrl });
  
  // Save pending action if provided
  if (pendingAction) {
    savePendingAction(pendingAction);
  }
  
  authLogger.info('Apple OAuth initiated');
  logUserAction('oauth_initiated', { provider: 'apple' });
  
  return url;
};

/**
 * Handles OAuth callback
 * @param {Object} params - Callback params
 * @returns {Promise<Object>} User data
 */
export const handleOAuthCallback = async ({ provider, code, state, error }) => {
  // Check for OAuth error
  if (error) {
    authLogger.error('OAuth error', { provider, error });
    throw createError(ERROR_TYPES.AUTH_ERROR, {
      message: `OAuth error: ${error}`
    });
  }
  
  // Validate state
  const savedData = validateOAuthState(state);
  
  if (!savedData) {
    authLogger.error('OAuth state validation failed', { provider });
    throw createError(ERROR_TYPES.AUTH_ERROR, {
      message: 'Invalid OAuth state'
    });
  }
  
  // Exchange code for tokens
  const endpoint = provider === 'google' ? ENDPOINTS.oauthGoogle : ENDPOINTS.oauthApple;
  
  try {
    const response = await apiClient.post(endpoint, { code });
    const data = processAuthResponse(response);
    
    authLogger.info('OAuth successful', { provider, userId: data.user?.id });
    logUserAction('oauth_login', { provider });
    
    // Dispatch auth event
    window.dispatchEvent(new CustomEvent('auth:login', { 
      detail: { ...data.user, oauthProvider: provider }
    }));
    
    return {
      ...data,
      returnUrl: savedData.returnUrl
    };
  } catch (error) {
    authLogger.error('OAuth callback failed', { provider, error: error.message });
    throw error;
  }
};

// =============================================================================
// CURRENT USER
// =============================================================================

/**
 * Gets current authenticated user
 * @returns {Promise<Object>} User data
 */
export const getCurrentUser = async () => {
  const response = await apiClient.get(ENDPOINTS.me);
  
  // Update stored user data
  if (response.data) {
    setUser(response.data);
  }
  
  return response.data;
};

/**
 * Checks if user is authenticated
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = () => {
  const { getItem } = require('../storage/localStorage.service');
  const token = getItem(STORAGE_KEYS.accessToken);
  return !!token;
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Login/Register
  login,
  register,
  logout,
  
  // Token
  refreshToken,
  validateToken,
  
  // Password
  forgotPassword,
  resetPassword,
  changePassword,
  
  // Email
  verifyEmail,
  resendVerification,
  
  // OAuth
  initiateGoogleOAuth,
  initiateAppleOAuth,
  handleOAuthCallback,
  
  // User
  getCurrentUser,
  isAuthenticated
};