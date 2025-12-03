/**
 * GPS Lab Platform - Error Handler
 * 
 * Comprehensive error handling utilities for the GPS Lab MMORPG educational platform.
 * Handles error creation, classification, formatting, and user-friendly messages.
 * 
 * @module utils/error/error.handler
 * @version 1.0.0
 */

// =============================================================================
// ERROR TYPES
// =============================================================================

/**
 * Application error types
 */
export const ERROR_TYPES = {
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  API_ERROR: 'API_ERROR',
  
  // Authentication errors
  AUTH_ERROR: 'AUTH_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  
  // Resource errors
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  
  // Business logic errors
  INSUFFICIENT_BARAKA: 'INSUFFICIENT_BARAKA',
  STAGE_LOCKED: 'STAGE_LOCKED',
  MISSION_LOCKED: 'MISSION_LOCKED',
  R2R_EXPIRED: 'R2R_EXPIRED',
  RETRY_LIMIT_EXCEEDED: 'RETRY_LIMIT_EXCEEDED',
  
  // System errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  RATE_LIMITED: 'RATE_LIMITED',
  
  // Unknown
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

/**
 * Error severity levels
 */
export const ERROR_SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical'
};

/**
 * HTTP status code to error type mapping
 */
export const HTTP_STATUS_TO_ERROR = {
  400: ERROR_TYPES.INVALID_INPUT,
  401: ERROR_TYPES.UNAUTHORIZED,
  403: ERROR_TYPES.FORBIDDEN,
  404: ERROR_TYPES.NOT_FOUND,
  409: ERROR_TYPES.CONFLICT,
  422: ERROR_TYPES.VALIDATION_ERROR,
  429: ERROR_TYPES.RATE_LIMITED,
  500: ERROR_TYPES.INTERNAL_ERROR,
  502: ERROR_TYPES.SERVICE_UNAVAILABLE,
  503: ERROR_TYPES.SERVICE_UNAVAILABLE,
  504: ERROR_TYPES.TIMEOUT_ERROR
};

// =============================================================================
// ERROR MESSAGES (Multi-language)
// =============================================================================

/**
 * User-friendly error messages by locale
 */
export const ERROR_MESSAGES = {
  en: {
    [ERROR_TYPES.NETWORK_ERROR]: 'Unable to connect. Please check your internet connection.',
    [ERROR_TYPES.TIMEOUT_ERROR]: 'The request took too long. Please try again.',
    [ERROR_TYPES.API_ERROR]: 'Something went wrong with the server. Please try again later.',
    
    [ERROR_TYPES.AUTH_ERROR]: 'Authentication failed. Please log in again.',
    [ERROR_TYPES.UNAUTHORIZED]: 'Please log in to continue.',
    [ERROR_TYPES.FORBIDDEN]: "You don't have permission to access this resource.",
    [ERROR_TYPES.SESSION_EXPIRED]: 'Your session has expired. Please log in again.',
    
    [ERROR_TYPES.VALIDATION_ERROR]: 'Please check your input and try again.',
    [ERROR_TYPES.INVALID_INPUT]: 'The provided information is invalid.',
    [ERROR_TYPES.REQUIRED_FIELD]: 'Please fill in all required fields.',
    
    [ERROR_TYPES.NOT_FOUND]: 'The requested resource was not found.',
    [ERROR_TYPES.CONFLICT]: 'This action conflicts with existing data.',
    [ERROR_TYPES.ALREADY_EXISTS]: 'This item already exists.',
    
    [ERROR_TYPES.INSUFFICIENT_BARAKA]: "You don't have enough Baraka for this action.",
    [ERROR_TYPES.STAGE_LOCKED]: 'This stage is locked. Complete previous stages to unlock.',
    [ERROR_TYPES.MISSION_LOCKED]: 'This mission is locked. Complete previous missions to unlock.',
    [ERROR_TYPES.R2R_EXPIRED]: 'Your Right to Retry has expired.',
    [ERROR_TYPES.RETRY_LIMIT_EXCEEDED]: "You've reached the maximum number of retries.",
    
    [ERROR_TYPES.INTERNAL_ERROR]: 'An unexpected error occurred. Please try again.',
    [ERROR_TYPES.SERVICE_UNAVAILABLE]: 'Service is temporarily unavailable. Please try again later.',
    [ERROR_TYPES.RATE_LIMITED]: "You're making too many requests. Please wait a moment.",
    
    [ERROR_TYPES.UNKNOWN_ERROR]: 'Something went wrong. Please try again.'
  },
  
  ko: {
    [ERROR_TYPES.NETWORK_ERROR]: '연결할 수 없습니다. 인터넷 연결을 확인해 주세요.',
    [ERROR_TYPES.TIMEOUT_ERROR]: '요청 시간이 초과되었습니다. 다시 시도해 주세요.',
    [ERROR_TYPES.API_ERROR]: '서버 오류가 발생했습니다. 나중에 다시 시도해 주세요.',
    
    [ERROR_TYPES.AUTH_ERROR]: '인증에 실패했습니다. 다시 로그인해 주세요.',
    [ERROR_TYPES.UNAUTHORIZED]: '계속하려면 로그인해 주세요.',
    [ERROR_TYPES.FORBIDDEN]: '이 리소스에 접근할 권한이 없습니다.',
    [ERROR_TYPES.SESSION_EXPIRED]: '세션이 만료되었습니다. 다시 로그인해 주세요.',
    
    [ERROR_TYPES.VALIDATION_ERROR]: '입력을 확인하고 다시 시도해 주세요.',
    [ERROR_TYPES.INVALID_INPUT]: '제공된 정보가 올바르지 않습니다.',
    [ERROR_TYPES.REQUIRED_FIELD]: '모든 필수 항목을 입력해 주세요.',
    
    [ERROR_TYPES.NOT_FOUND]: '요청한 리소스를 찾을 수 없습니다.',
    [ERROR_TYPES.CONFLICT]: '이 작업이 기존 데이터와 충돌합니다.',
    [ERROR_TYPES.ALREADY_EXISTS]: '이 항목이 이미 존재합니다.',
    
    [ERROR_TYPES.INSUFFICIENT_BARAKA]: '이 작업을 위한 바라카가 부족합니다.',
    [ERROR_TYPES.STAGE_LOCKED]: '이 스테이지는 잠겨 있습니다. 이전 스테이지를 완료해 주세요.',
    [ERROR_TYPES.MISSION_LOCKED]: '이 미션은 잠겨 있습니다. 이전 미션을 완료해 주세요.',
    [ERROR_TYPES.R2R_EXPIRED]: '재시도 권한이 만료되었습니다.',
    [ERROR_TYPES.RETRY_LIMIT_EXCEEDED]: '최대 재시도 횟수에 도달했습니다.',
    
    [ERROR_TYPES.INTERNAL_ERROR]: '예기치 않은 오류가 발생했습니다. 다시 시도해 주세요.',
    [ERROR_TYPES.SERVICE_UNAVAILABLE]: '서비스를 일시적으로 사용할 수 없습니다.',
    [ERROR_TYPES.RATE_LIMITED]: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
    
    [ERROR_TYPES.UNKNOWN_ERROR]: '문제가 발생했습니다. 다시 시도해 주세요.'
  },
  
  sw: {
    [ERROR_TYPES.NETWORK_ERROR]: 'Haiwezi kuunganisha. Tafadhali angalia muunganisho wako wa mtandao.',
    [ERROR_TYPES.TIMEOUT_ERROR]: 'Ombi lilichukua muda mrefu sana. Tafadhali jaribu tena.',
    [ERROR_TYPES.API_ERROR]: 'Kuna tatizo la seva. Tafadhali jaribu tena baadaye.',
    
    [ERROR_TYPES.AUTH_ERROR]: 'Uthibitishaji umeshindwa. Tafadhali ingia tena.',
    [ERROR_TYPES.UNAUTHORIZED]: 'Tafadhali ingia ili kuendelea.',
    [ERROR_TYPES.FORBIDDEN]: 'Huna ruhusa ya kufikia rasilimali hii.',
    [ERROR_TYPES.SESSION_EXPIRED]: 'Kipindi chako kimeisha. Tafadhali ingia tena.',
    
    [ERROR_TYPES.VALIDATION_ERROR]: 'Tafadhali angalia maingizo yako na ujaribu tena.',
    [ERROR_TYPES.INVALID_INPUT]: 'Taarifa iliyotolewa si sahihi.',
    [ERROR_TYPES.REQUIRED_FIELD]: 'Tafadhali jaza sehemu zote zinazohitajika.',
    
    [ERROR_TYPES.NOT_FOUND]: 'Rasilimali iliyoombwa haikupatikana.',
    [ERROR_TYPES.CONFLICT]: 'Kitendo hiki kinagongana na data iliyopo.',
    [ERROR_TYPES.ALREADY_EXISTS]: 'Kipengele hiki tayari kipo.',
    
    [ERROR_TYPES.INSUFFICIENT_BARAKA]: 'Huna Baraka ya kutosha kwa kitendo hiki.',
    [ERROR_TYPES.STAGE_LOCKED]: 'Hatua hii imefungwa. Kamilisha hatua zilizopita kufungua.',
    [ERROR_TYPES.MISSION_LOCKED]: 'Misheni hii imefungwa. Kamilisha misheni zilizopita kufungua.',
    [ERROR_TYPES.R2R_EXPIRED]: 'Haki yako ya Kujaribu Tena imeisha.',
    [ERROR_TYPES.RETRY_LIMIT_EXCEEDED]: 'Umefikia idadi ya juu ya majaribio.',
    
    [ERROR_TYPES.INTERNAL_ERROR]: 'Hitilafu isiyotarajiwa imetokea. Tafadhali jaribu tena.',
    [ERROR_TYPES.SERVICE_UNAVAILABLE]: 'Huduma haipatikani kwa muda. Tafadhali jaribu tena baadaye.',
    [ERROR_TYPES.RATE_LIMITED]: 'Unafanya maombi mengi sana. Tafadhali subiri kidogo.',
    
    [ERROR_TYPES.UNKNOWN_ERROR]: 'Kuna tatizo limetokea. Tafadhali jaribu tena.'
  }
};

// =============================================================================
// CUSTOM ERROR CLASS
// =============================================================================

/**
 * Custom GPS Lab Error class
 */
export class GPSLabError extends Error {
  constructor(type, message, details = {}) {
    super(message);
    this.name = 'GPSLabError';
    this.type = type;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.severity = details.severity || ERROR_SEVERITY.ERROR;
    
    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GPSLabError);
    }
  }
  
  /**
   * Converts error to JSON
   */
  toJSON() {
    return {
      name: this.name,
      type: this.type,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp,
      severity: this.severity,
      stack: this.stack
    };
  }
  
  /**
   * Creates a loggable string
   */
  toLogString() {
    return `[${this.timestamp}] [${this.severity.toUpperCase()}] ${this.type}: ${this.message}`;
  }
}

// =============================================================================
// ERROR CREATION HELPERS
// =============================================================================

/**
 * Creates a GPSLabError from type
 * @param {string} type - Error type
 * @param {Object} options - Options
 * @returns {GPSLabError} Created error
 */
export const createError = (type, options = {}) => {
  const { message, details = {}, locale = 'en' } = options;
  
  const errorMessage = message || 
    ERROR_MESSAGES[locale]?.[type] || 
    ERROR_MESSAGES.en[type] || 
    ERROR_MESSAGES.en[ERROR_TYPES.UNKNOWN_ERROR];
  
  return new GPSLabError(type, errorMessage, details);
};

/**
 * Creates error from HTTP response
 * @param {Response|Object} response - HTTP response
 * @param {Object} options - Options
 * @returns {GPSLabError} Created error
 */
export const createErrorFromResponse = (response, options = {}) => {
  const { locale = 'en', defaultMessage } = options;
  
  const status = response.status || response.statusCode || 500;
  const type = HTTP_STATUS_TO_ERROR[status] || ERROR_TYPES.UNKNOWN_ERROR;
  
  // Try to extract message from response body
  let message = defaultMessage;
  if (response.data?.message) {
    message = response.data.message;
  } else if (response.message) {
    message = response.message;
  }
  
  return createError(type, {
    message,
    locale,
    details: {
      status,
      url: response.url || response.config?.url,
      method: response.config?.method
    }
  });
};

/**
 * Creates network error
 * @param {Error} originalError - Original error
 * @param {Object} options - Options
 * @returns {GPSLabError} Created error
 */
export const createNetworkError = (originalError, options = {}) => {
  const { locale = 'en' } = options;
  
  let type = ERROR_TYPES.NETWORK_ERROR;
  
  // Check for timeout
  if (originalError.code === 'ECONNABORTED' || originalError.message?.includes('timeout')) {
    type = ERROR_TYPES.TIMEOUT_ERROR;
  }
  
  return createError(type, {
    locale,
    details: {
      originalMessage: originalError.message,
      code: originalError.code
    }
  });
};

/**
 * Creates validation error
 * @param {Object} errors - Field errors
 * @param {Object} options - Options
 * @returns {GPSLabError} Created error
 */
export const createValidationError = (errors, options = {}) => {
  const { locale = 'en' } = options;
  
  return createError(ERROR_TYPES.VALIDATION_ERROR, {
    locale,
    details: {
      fieldErrors: errors,
      errorCount: Object.keys(errors).length,
      severity: ERROR_SEVERITY.WARNING
    }
  });
};

// =============================================================================
// GPS LAB SPECIFIC ERRORS
// =============================================================================

/**
 * Creates insufficient Baraka error
 * @param {number} required - Required Baraka
 * @param {number} available - Available Baraka
 * @param {Object} options - Options
 * @returns {GPSLabError} Created error
 */
export const createInsufficientBarakaError = (required, available, options = {}) => {
  const { locale = 'en' } = options;
  
  return createError(ERROR_TYPES.INSUFFICIENT_BARAKA, {
    locale,
    details: {
      required,
      available,
      shortage: required - available,
      severity: ERROR_SEVERITY.WARNING
    }
  });
};

/**
 * Creates locked content error
 * @param {string} contentType - 'stage' or 'mission'
 * @param {number} contentNumber - Stage or mission number
 * @param {Object} options - Options
 * @returns {GPSLabError} Created error
 */
export const createLockedContentError = (contentType, contentNumber, options = {}) => {
  const { locale = 'en', prerequisite } = options;
  
  const type = contentType === 'stage' ? ERROR_TYPES.STAGE_LOCKED : ERROR_TYPES.MISSION_LOCKED;
  
  return createError(type, {
    locale,
    details: {
      contentType,
      contentNumber,
      prerequisite,
      severity: ERROR_SEVERITY.INFO
    }
  });
};

/**
 * Creates R2R expired error
 * @param {Date} expiredAt - Expiration date
 * @param {Object} options - Options
 * @returns {GPSLabError} Created error
 */
export const createR2RExpiredError = (expiredAt, options = {}) => {
  const { locale = 'en' } = options;
  
  return createError(ERROR_TYPES.R2R_EXPIRED, {
    locale,
    details: {
      expiredAt,
      severity: ERROR_SEVERITY.WARNING
    }
  });
};

// =============================================================================
// ERROR CLASSIFICATION
// =============================================================================

/**
 * Checks if error is retryable
 * @param {Error} error - Error to check
 * @returns {boolean} True if retryable
 */
export const isRetryableError = (error) => {
  const retryableTypes = [
    ERROR_TYPES.NETWORK_ERROR,
    ERROR_TYPES.TIMEOUT_ERROR,
    ERROR_TYPES.SERVICE_UNAVAILABLE,
    ERROR_TYPES.RATE_LIMITED
  ];
  
  return error instanceof GPSLabError && retryableTypes.includes(error.type);
};

/**
 * Checks if error requires re-authentication
 * @param {Error} error - Error to check
 * @returns {boolean} True if auth required
 */
export const isAuthError = (error) => {
  const authTypes = [
    ERROR_TYPES.AUTH_ERROR,
    ERROR_TYPES.UNAUTHORIZED,
    ERROR_TYPES.SESSION_EXPIRED
  ];
  
  return error instanceof GPSLabError && authTypes.includes(error.type);
};

/**
 * Checks if error is user-correctable
 * @param {Error} error - Error to check
 * @returns {boolean} True if user can fix
 */
export const isUserCorrectableError = (error) => {
  const correctableTypes = [
    ERROR_TYPES.VALIDATION_ERROR,
    ERROR_TYPES.INVALID_INPUT,
    ERROR_TYPES.REQUIRED_FIELD,
    ERROR_TYPES.INSUFFICIENT_BARAKA
  ];
  
  return error instanceof GPSLabError && correctableTypes.includes(error.type);
};

/**
 * Gets error severity
 * @param {Error} error - Error to check
 * @returns {string} Severity level
 */
export const getErrorSeverity = (error) => {
  if (error instanceof GPSLabError) {
    return error.severity;
  }
  
  return ERROR_SEVERITY.ERROR;
};

// =============================================================================
// ERROR FORMATTING
// =============================================================================

/**
 * Gets user-friendly error message
 * @param {Error} error - Error to format
 * @param {string} locale - Locale code
 * @returns {string} User-friendly message
 */
export const getUserMessage = (error, locale = 'en') => {
  if (error instanceof GPSLabError) {
    return error.message;
  }
  
  // Try to match known error patterns
  const message = error.message || '';
  
  if (message.includes('network') || message.includes('fetch')) {
    return ERROR_MESSAGES[locale]?.[ERROR_TYPES.NETWORK_ERROR] || 
           ERROR_MESSAGES.en[ERROR_TYPES.NETWORK_ERROR];
  }
  
  if (message.includes('timeout')) {
    return ERROR_MESSAGES[locale]?.[ERROR_TYPES.TIMEOUT_ERROR] || 
           ERROR_MESSAGES.en[ERROR_TYPES.TIMEOUT_ERROR];
  }
  
  return ERROR_MESSAGES[locale]?.[ERROR_TYPES.UNKNOWN_ERROR] || 
         ERROR_MESSAGES.en[ERROR_TYPES.UNKNOWN_ERROR];
};

/**
 * Formats error for display
 * @param {Error} error - Error to format
 * @param {Object} options - Options
 * @returns {Object} Formatted error
 */
export const formatErrorForDisplay = (error, options = {}) => {
  const { locale = 'en', includeDetails = false } = options;
  
  const formatted = {
    message: getUserMessage(error, locale),
    type: error instanceof GPSLabError ? error.type : ERROR_TYPES.UNKNOWN_ERROR,
    severity: getErrorSeverity(error),
    isRetryable: isRetryableError(error),
    requiresAuth: isAuthError(error),
    isUserCorrectable: isUserCorrectableError(error)
  };
  
  if (includeDetails && error instanceof GPSLabError) {
    formatted.details = error.details;
  }
  
  return formatted;
};

// =============================================================================
// ERROR HANDLING UTILITIES
// =============================================================================

/**
 * Wraps async function with error handling
 * @param {Function} fn - Async function to wrap
 * @param {Object} options - Options
 * @returns {Function} Wrapped function
 */
export const withErrorHandling = (fn, options = {}) => {
  const { onError, locale = 'en' } = options;
  
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      const gpsError = error instanceof GPSLabError 
        ? error 
        : createError(ERROR_TYPES.UNKNOWN_ERROR, { 
            locale, 
            details: { originalError: error.message } 
          });
      
      if (onError) {
        onError(gpsError);
      }
      
      throw gpsError;
    }
  };
};

/**
 * Safely executes function and returns result or default
 * @param {Function} fn - Function to execute
 * @param {*} defaultValue - Default value on error
 * @returns {*} Result or default
 */
export const safeExecute = async (fn, defaultValue = null) => {
  try {
    return await fn();
  } catch (error) {
    console.error('Safe execute error:', error);
    return defaultValue;
  }
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Types and constants
  ERROR_TYPES,
  ERROR_SEVERITY,
  HTTP_STATUS_TO_ERROR,
  ERROR_MESSAGES,
  
  // Error class
  GPSLabError,
  
  // Creation helpers
  createError,
  createErrorFromResponse,
  createNetworkError,
  createValidationError,
  createInsufficientBarakaError,
  createLockedContentError,
  createR2RExpiredError,
  
  // Classification
  isRetryableError,
  isAuthError,
  isUserCorrectableError,
  getErrorSeverity,
  
  // Formatting
  getUserMessage,
  formatErrorForDisplay,
  
  // Utilities
  withErrorHandling,
  safeExecute
};