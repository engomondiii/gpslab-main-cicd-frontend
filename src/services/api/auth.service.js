/**
 * GPS Lab Platform - Auth Service
 * 
 * Authentication service for login, register, logout, token refresh,
 * and OAuth integration.
 * 
 * MOCK MODE: When REACT_APP_USE_MOCK_DATA=true or API is unreachable,
 * all methods return realistic mock data for frontend-only development.
 * 
 * @module services/api/auth.service
 * @version 1.1.0
 */

import apiClient, { setTokens, clearTokens, getRefreshToken } from './client';
import { setUser, removeItem, STORAGE_KEYS } from '../storage/localStorage.service';
import { saveOAuthState, validateOAuthState, savePendingAction } from '../storage/sessionStorage.service';
import { logUserAction, authLogger } from '../../utils/error/error.logger';
import { createError, ERROR_TYPES } from '../../utils/error/error.handler';

// =============================================================================
// MOCK MODE CONFIGURATION
// =============================================================================

const USE_MOCK = process.env.REACT_APP_USE_MOCK_DATA === 'true' ||
                 process.env.NODE_ENV === 'development';

/**
 * Mock user data for frontend-only development
 */
const MOCK_USER = {
  id: 'usr_mock_001',
  email: 'gps.solver@gpslab.dev',
  username: 'GPSExplorer',
  firstName: 'GPS',
  lastName: 'Explorer',
  displayName: 'GPS Explorer',
  avatarUrl: null,
  locale: 'en',
  role: 'student',
  tier: 'explorer',
  emailVerified: true,
  isActive: true,
  university: {
    id: 'uni_001',
    name: 'Handong Global University',
    code: 'HGU'
  },
  preferences: {
    language: 'en',
    theme: 'light',
    notifications: true
  },
  createdAt: '2025-09-01T08:00:00Z',
  lastLoginAt: new Date().toISOString()
};

/**
 * Mock tokens
 */
const MOCK_TOKENS = {
  accessToken: 'mock_access_token_' + Date.now(),
  refreshToken: 'mock_refresh_token_' + Date.now(),
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
};

/**
 * Simulates API delay for realistic mock responses
 * @param {number} ms - Delay in milliseconds
 * @returns {Promise<void>}
 */
const mockDelay = (ms = 300) => new Promise(r => setTimeout(r, ms));

/**
 * Logs mock mode usage
 * @param {string} method - Method name
 */
const logMock = (method) => {
  console.info(`[AuthService:MOCK] ${method}`);
};

// =============================================================================
// OAUTH CONFIGURATION
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
 * @returns {Object} OAuth URL and state
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
 * Processes auth response - stores tokens and user data
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

/**
 * Processes mock auth response - same side effects as real
 * @param {Object} user - Mock user
 * @param {Object} tokens - Mock tokens
 * @returns {Object} Mock auth response data
 */
const processMockAuthResponse = (user, tokens) => {
  setTokens(tokens);
  setUser(user);
  return { user, ...tokens };
};

// =============================================================================
// LOGIN / REGISTER
// =============================================================================

/**
 * Logs in user with email and password
 * @param {Object} credentials - Login credentials
 * @returns {Promise<Object>} User data with tokens
 */
export const login = async ({ email, password, rememberMe = false }) => {
  authLogger.info('Login attempt', { email });
  
  // --- MOCK MODE ---
  if (USE_MOCK) {
    logMock('login');
    await mockDelay(500);
    
    const mockUser = { ...MOCK_USER, email, lastLoginAt: new Date().toISOString() };
    const data = processMockAuthResponse(mockUser, { ...MOCK_TOKENS });
    
    authLogger.info('Login successful (mock)', { userId: mockUser.id });
    logUserAction('login', { method: 'email', mock: true });
    window.dispatchEvent(new CustomEvent('auth:login', { detail: mockUser }));
    
    return data;
  }
  
  // --- LIVE API ---
  try {
    const response = await apiClient.post(ENDPOINTS.login, {
      email,
      password,
      rememberMe
    });
    
    const data = processAuthResponse(response);
    
    authLogger.info('Login successful', { userId: data.user?.id });
    logUserAction('login', { method: 'email' });
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
 * @returns {Promise<Object>} User data with tokens
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
  
  // --- MOCK MODE ---
  if (USE_MOCK) {
    logMock('register');
    await mockDelay(700);
    
    const mockUser = {
      ...MOCK_USER,
      id: 'usr_mock_' + Date.now(),
      email,
      firstName,
      lastName,
      username: username || MOCK_USER.username,
      displayName: `${firstName} ${lastName}`,
      locale,
      emailVerified: false,
      createdAt: new Date().toISOString()
    };
    const data = processMockAuthResponse(mockUser, { ...MOCK_TOKENS });
    
    authLogger.info('Registration successful (mock)', { userId: mockUser.id });
    logUserAction('register', { method: 'email', mock: true });
    window.dispatchEvent(new CustomEvent('auth:register', { detail: mockUser }));
    
    return data;
  }
  
  // --- LIVE API ---
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
  
  if (!USE_MOCK) {
    try {
      await apiClient.post(ENDPOINTS.logout);
    } catch (error) {
      authLogger.warn('Logout API call failed', { error: error.message });
    }
  } else {
    logMock('logout');
    await mockDelay(200);
  }
  
  // Clear local auth state (always runs)
  clearTokens();
  removeItem(STORAGE_KEYS.user);
  removeItem(STORAGE_KEYS.userProfile);
  
  logUserAction('logout');
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
  // --- MOCK MODE ---
  if (USE_MOCK) {
    logMock('refreshToken');
    await mockDelay(200);
    
    const newTokens = {
      accessToken: 'mock_access_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    setTokens(newTokens);
    return newTokens;
  }
  
  // --- LIVE API ---
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
    clearTokens();
    throw error;
  }
};

/**
 * Validates current token
 * @returns {Promise<boolean>} True if valid
 */
export const validateToken = async () => {
  if (USE_MOCK) {
    logMock('validateToken');
    return true;
  }
  
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
  
  if (USE_MOCK) {
    logMock('forgotPassword');
    await mockDelay(500);
    logUserAction('forgot_password', { email });
    return { success: true, message: 'Password reset email sent (mock)' };
  }
  
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
  
  if (USE_MOCK) {
    logMock('resetPassword');
    await mockDelay(500);
    logUserAction('reset_password');
    return { success: true, message: 'Password reset successful (mock)' };
  }
  
  const response = await apiClient.post(ENDPOINTS.resetPassword, { token, password });
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
  
  if (USE_MOCK) {
    logMock('changePassword');
    await mockDelay(500);
    logUserAction('change_password');
    return { success: true, message: 'Password changed successfully (mock)' };
  }
  
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
  
  if (USE_MOCK) {
    logMock('verifyEmail');
    await mockDelay(500);
    const verifiedUser = { ...MOCK_USER, emailVerified: true };
    setUser(verifiedUser);
    logUserAction('verify_email');
    return { success: true, user: verifiedUser };
  }
  
  const response = await apiClient.post(ENDPOINTS.verifyEmail, { token });
  
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
  
  if (USE_MOCK) {
    logMock('resendVerification');
    await mockDelay(400);
    logUserAction('resend_verification', { email });
    return { success: true, message: 'Verification email resent (mock)' };
  }
  
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
  
  saveOAuthState(state, { provider: 'google', returnUrl });
  
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
  
  saveOAuthState(state, { provider: 'apple', returnUrl });
  
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
  if (error) {
    authLogger.error('OAuth error', { provider, error });
    throw createError(ERROR_TYPES.AUTH_ERROR, {
      message: `OAuth error: ${error}`
    });
  }
  
  // --- MOCK MODE ---
  if (USE_MOCK) {
    logMock('handleOAuthCallback');
    await mockDelay(600);
    
    const mockUser = {
      ...MOCK_USER,
      oauthProvider: provider,
      lastLoginAt: new Date().toISOString()
    };
    const data = processMockAuthResponse(mockUser, { ...MOCK_TOKENS });
    
    authLogger.info('OAuth successful (mock)', { provider });
    logUserAction('oauth_login', { provider, mock: true });
    window.dispatchEvent(new CustomEvent('auth:login', {
      detail: { ...mockUser, oauthProvider: provider }
    }));
    
    return { ...data, returnUrl: '/dashboard' };
  }
  
  // --- LIVE API ---
  const savedData = validateOAuthState(state);
  
  if (!savedData) {
    authLogger.error('OAuth state validation failed', { provider });
    throw createError(ERROR_TYPES.AUTH_ERROR, {
      message: 'Invalid OAuth state'
    });
  }
  
  const endpoint = provider === 'google' ? ENDPOINTS.oauthGoogle : ENDPOINTS.oauthApple;
  
  try {
    const response = await apiClient.post(endpoint, { code });
    const data = processAuthResponse(response);
    
    authLogger.info('OAuth successful', { provider, userId: data.user?.id });
    logUserAction('oauth_login', { provider });
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
  if (USE_MOCK) {
    logMock('getCurrentUser');
    await mockDelay(200);
    setUser(MOCK_USER);
    return { ...MOCK_USER };
  }
  
  const response = await apiClient.get(ENDPOINTS.me);
  
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
  if (USE_MOCK) {
    return true;
  }
  
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