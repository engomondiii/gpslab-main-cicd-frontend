/**
 * GPS Lab Platform - API Client
 * 
 * Core axios instance configuration with request/response interceptors,
 * error handling, and authentication token management.
 * 
 * @module services/api/client
 * @version 1.0.0
 */

import { createError, createErrorFromResponse, createNetworkError, ERROR_TYPES } from '../../utils/error/error.handler';
import { logApiRequest, logApiResponse, error as logError } from '../../utils/error/error.logger';

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * API configuration
 */
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'https://api.gpslab.io/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-Version': process.env.REACT_APP_VERSION || '1.0.0',
    'X-Platform': 'web'
  }
};

/**
 * Retry configuration
 */
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  retryStatusCodes: [408, 429, 500, 502, 503, 504]
};

/**
 * Endpoints that don't require authentication
 */
const PUBLIC_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/auth/oauth/google',
  '/auth/oauth/apple',
  '/auth/refresh-token',
  '/public/'
];

// =============================================================================
// TOKEN MANAGEMENT
// =============================================================================

/**
 * Token storage keys
 */
const TOKEN_KEYS = {
  accessToken: 'gps_access_token',
  refreshToken: 'gps_refresh_token',
  tokenExpiry: 'gps_token_expiry'
};

/**
 * Gets access token from storage
 * @returns {string|null} Access token
 */
export const getAccessToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEYS.accessToken);
  } catch (e) {
    return null;
  }
};

/**
 * Gets refresh token from storage
 * @returns {string|null} Refresh token
 */
export const getRefreshToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEYS.refreshToken);
  } catch (e) {
    return null;
  }
};

/**
 * Sets tokens in storage
 * @param {Object} tokens - Token data
 */
export const setTokens = (tokens) => {
  try {
    if (tokens.accessToken) {
      localStorage.setItem(TOKEN_KEYS.accessToken, tokens.accessToken);
    }
    if (tokens.refreshToken) {
      localStorage.setItem(TOKEN_KEYS.refreshToken, tokens.refreshToken);
    }
    if (tokens.expiresAt) {
      localStorage.setItem(TOKEN_KEYS.tokenExpiry, tokens.expiresAt);
    }
  } catch (e) {
    console.error('Failed to store tokens:', e);
  }
};

/**
 * Clears tokens from storage
 */
export const clearTokens = () => {
  try {
    localStorage.removeItem(TOKEN_KEYS.accessToken);
    localStorage.removeItem(TOKEN_KEYS.refreshToken);
    localStorage.removeItem(TOKEN_KEYS.tokenExpiry);
  } catch (e) {
    console.error('Failed to clear tokens:', e);
  }
};

/**
 * Checks if token is expired
 * @returns {boolean} True if expired
 */
export const isTokenExpired = () => {
  try {
    const expiry = localStorage.getItem(TOKEN_KEYS.tokenExpiry);
    if (!expiry) return true;
    return new Date(expiry) <= new Date();
  } catch (e) {
    return true;
  }
};

// =============================================================================
// REQUEST QUEUE (for token refresh)
// =============================================================================

let isRefreshing = false;
let refreshSubscribers = [];

/**
 * Adds request to refresh queue
 * @param {Function} callback - Callback to execute after refresh
 */
const subscribeToRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

/**
 * Processes refresh queue
 * @param {string} token - New access token
 */
const onRefreshed = (token) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

/**
 * Clears refresh queue on error
 * @param {Error} error - Refresh error
 */
const onRefreshError = (error) => {
  refreshSubscribers.forEach(callback => callback(null, error));
  refreshSubscribers = [];
};

// =============================================================================
// API CLIENT CLASS
// =============================================================================

/**
 * API Client class
 */
class ApiClient {
  constructor(config = {}) {
    this.config = { ...API_CONFIG, ...config };
    this.requestInterceptors = [];
    this.responseInterceptors = [];
    
    // Initialize with default interceptors
    this.addRequestInterceptor(this.authInterceptor.bind(this));
    this.addRequestInterceptor(this.loggingRequestInterceptor.bind(this));
    this.addResponseInterceptor(this.loggingResponseInterceptor.bind(this));
    this.addResponseInterceptor(this.errorInterceptor.bind(this));
  }
  
  /**
   * Adds request interceptor
   * @param {Function} interceptor - Interceptor function
   */
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }
  
  /**
   * Adds response interceptor
   * @param {Function} interceptor - Interceptor function
   */
  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }
  
  /**
   * Authentication interceptor
   * @param {Object} config - Request config
   * @returns {Object} Modified config
   */
  async authInterceptor(config) {
    // Skip auth for public endpoints
    const isPublic = PUBLIC_ENDPOINTS.some(endpoint => 
      config.url.includes(endpoint)
    );
    
    if (isPublic) {
      return config;
    }
    
    // Check for token
    let token = getAccessToken();
    
    // If token is expired, try to refresh
    if (token && isTokenExpired()) {
      token = await this.refreshAccessToken();
    }
    
    // Add token to headers
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      };
    }
    
    return config;
  }
  
  /**
   * Logging request interceptor
   * @param {Object} config - Request config
   * @returns {Object} Config with timing
   */
  loggingRequestInterceptor(config) {
    config._startTime = Date.now();
    logApiRequest(config.method?.toUpperCase() || 'GET', config.url);
    return config;
  }
  
  /**
   * Logging response interceptor
   * @param {Object} response - Response object
   * @returns {Object} Response
   */
  loggingResponseInterceptor(response) {
    const duration = Date.now() - (response.config?._startTime || Date.now());
    logApiResponse(
      response.config?.method?.toUpperCase() || 'GET',
      response.config?.url || '',
      response.status,
      duration
    );
    return response;
  }
  
  /**
   * Error interceptor
   * @param {Object} response - Response object
   * @returns {Object} Response or throws error
   */
  async errorInterceptor(response) {
    if (response.ok) {
      return response;
    }
    
    // Handle 401 - try to refresh token
    if (response.status === 401 && !response.config?.url?.includes('/auth/')) {
      const newToken = await this.refreshAccessToken();
      
      if (newToken) {
        // Retry the request with new token
        const retryConfig = {
          ...response.config,
          headers: {
            ...response.config.headers,
            'Authorization': `Bearer ${newToken}`
          }
        };
        return this.request(retryConfig);
      }
      
      // Token refresh failed - logout user
      clearTokens();
      window.dispatchEvent(new CustomEvent('auth:logout', { detail: { reason: 'session_expired' } }));
    }
    
    throw response;
  }
  
  /**
   * Refreshes access token
   * @returns {Promise<string|null>} New access token
   */
  async refreshAccessToken() {
    const refreshToken = getRefreshToken();
    
    if (!refreshToken) {
      return null;
    }
    
    // If already refreshing, wait for result
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeToRefresh((token, error) => {
          if (error) reject(error);
          else resolve(token);
        });
      });
    }
    
    isRefreshing = true;
    
    try {
      const response = await this.post('/auth/refresh-token', {
        refreshToken
      });
      
      const { accessToken, refreshToken: newRefreshToken, expiresAt } = response.data;
      
      setTokens({
        accessToken,
        refreshToken: newRefreshToken || refreshToken,
        expiresAt
      });
      
      onRefreshed(accessToken);
      isRefreshing = false;
      
      return accessToken;
    } catch (error) {
      onRefreshError(error);
      isRefreshing = false;
      clearTokens();
      return null;
    }
  }
  
  /**
   * Makes HTTP request
   * @param {Object} config - Request configuration
   * @returns {Promise<Object>} Response data
   */
  async request(config) {
    const startTime = Date.now();
    
    // Build full URL
    const url = config.url.startsWith('http') 
      ? config.url 
      : `${this.config.baseURL}${config.url}`;
    
    // Build request config
    let requestConfig = {
      method: config.method || 'GET',
      url,
      headers: { ...this.config.headers, ...config.headers },
      body: config.data ? JSON.stringify(config.data) : undefined,
      ...config
    };
    
    // Apply request interceptors
    for (const interceptor of this.requestInterceptors) {
      requestConfig = await interceptor(requestConfig);
    }
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeout = config.timeout || this.config.timeout;
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      let response = await fetch(url, {
        method: requestConfig.method,
        headers: requestConfig.headers,
        body: requestConfig.body,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Attach config for interceptors
      response.config = requestConfig;
      
      // Apply response interceptors
      for (const interceptor of this.responseInterceptors) {
        response = await interceptor(response);
      }
      
      // Parse response
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config: requestConfig
      };
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Handle abort (timeout)
      if (error.name === 'AbortError') {
        throw createError(ERROR_TYPES.TIMEOUT_ERROR, {
          details: { url, timeout }
        });
      }
      
      // Handle network errors
      if (error instanceof TypeError) {
        throw createNetworkError(error);
      }
      
      // Handle API errors
      if (error.status) {
        throw createErrorFromResponse(error);
      }
      
      throw error;
    }
  }
  
  /**
   * GET request
   * @param {string} url - Request URL
   * @param {Object} config - Additional config
   * @returns {Promise<Object>} Response data
   */
  async get(url, config = {}) {
    return this.request({ ...config, method: 'GET', url });
  }
  
  /**
   * POST request
   * @param {string} url - Request URL
   * @param {Object} data - Request body
   * @param {Object} config - Additional config
   * @returns {Promise<Object>} Response data
   */
  async post(url, data, config = {}) {
    return this.request({ ...config, method: 'POST', url, data });
  }
  
  /**
   * PUT request
   * @param {string} url - Request URL
   * @param {Object} data - Request body
   * @param {Object} config - Additional config
   * @returns {Promise<Object>} Response data
   */
  async put(url, data, config = {}) {
    return this.request({ ...config, method: 'PUT', url, data });
  }
  
  /**
   * PATCH request
   * @param {string} url - Request URL
   * @param {Object} data - Request body
   * @param {Object} config - Additional config
   * @returns {Promise<Object>} Response data
   */
  async patch(url, data, config = {}) {
    return this.request({ ...config, method: 'PATCH', url, data });
  }
  
  /**
   * DELETE request
   * @param {string} url - Request URL
   * @param {Object} config - Additional config
   * @returns {Promise<Object>} Response data
   */
  async delete(url, config = {}) {
    return this.request({ ...config, method: 'DELETE', url });
  }
  
  /**
   * Upload file
   * @param {string} url - Upload URL
   * @param {FormData} formData - Form data with file
   * @param {Object} config - Additional config
   * @returns {Promise<Object>} Response data
   */
  async upload(url, formData, config = {}) {
    const headers = { ...config.headers };
    // Remove Content-Type to let browser set it with boundary
    delete headers['Content-Type'];
    
    return this.request({
      ...config,
      method: 'POST',
      url,
      headers,
      body: formData
    });
  }
  
  /**
   * Download file
   * @param {string} url - Download URL
   * @param {Object} config - Additional config
   * @returns {Promise<Blob>} File blob
   */
  async download(url, config = {}) {
    const response = await fetch(`${this.config.baseURL}${url}`, {
      method: 'GET',
      headers: {
        ...this.config.headers,
        ...config.headers,
        'Authorization': `Bearer ${getAccessToken()}`
      }
    });
    
    if (!response.ok) {
      throw createErrorFromResponse(response);
    }
    
    return response.blob();
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

/**
 * Default API client instance
 */
const apiClient = new ApiClient();

// =============================================================================
// EXPORTS
// =============================================================================

export {
  ApiClient,
  apiClient as default,
  API_CONFIG,
  TOKEN_KEYS
};