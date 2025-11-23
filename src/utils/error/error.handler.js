/* ============================================
   GPS LAB - Error Handler
   Centralized error handling and transformation
   ============================================ */

/**
 * Error types enum
 */
export const ErrorTypes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

/**
 * Custom Error class for GPS Lab
 */
export class GPSError extends Error {
  constructor(message, type = ErrorTypes.UNKNOWN_ERROR, statusCode = 500, details = null) {
    super(message);
    this.name = 'GPSError';
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Parse error from API response
 * @param {Error|Object} error - Error object or API error response
 * @returns {GPSError} Formatted GPS error
 */
export const parseApiError = (error) => {
  // Network error (no response)
  if (!error.response) {
    return new GPSError(
      'Network error. Please check your internet connection.',
      ErrorTypes.NETWORK_ERROR,
      0,
      error
    );
  }

  const { status, data } = error.response;

  // Map HTTP status codes to error types
  switch (status) {
    case 400:
      return new GPSError(
        data.message || 'Invalid request. Please check your input.',
        ErrorTypes.VALIDATION_ERROR,
        400,
        data.errors || data
      );

    case 401:
      return new GPSError(
        data.message || 'Authentication required. Please log in.',
        ErrorTypes.AUTHENTICATION_ERROR,
        401,
        data
      );

    case 403:
      return new GPSError(
        data.message || 'You do not have permission to perform this action.',
        ErrorTypes.AUTHORIZATION_ERROR,
        403,
        data
      );

    case 404:
      return new GPSError(
        data.message || 'The requested resource was not found.',
        ErrorTypes.NOT_FOUND_ERROR,
        404,
        data
      );

    case 408:
      return new GPSError(
        data.message || 'Request timeout. Please try again.',
        ErrorTypes.TIMEOUT_ERROR,
        408,
        data
      );

    case 422:
      return new GPSError(
        data.message || 'Validation failed. Please check your input.',
        ErrorTypes.VALIDATION_ERROR,
        422,
        data.errors || data
      );

    case 500:
    case 502:
    case 503:
    case 504:
      return new GPSError(
        data.message || 'Server error. Please try again later.',
        ErrorTypes.SERVER_ERROR,
        status,
        data
      );

    default:
      return new GPSError(
        data.message || 'An unexpected error occurred.',
        ErrorTypes.UNKNOWN_ERROR,
        status,
        data
      );
  }
};

/**
 * Get user-friendly error message
 * @param {Error|GPSError} error - Error object
 * @returns {string} User-friendly error message
 */
export const getUserFriendlyMessage = (error) => {
  if (error instanceof GPSError) {
    return error.message;
  }

  // Handle standard JavaScript errors
  if (error instanceof TypeError) {
    return 'A type error occurred. Please contact support if this persists.';
  }

  if (error instanceof ReferenceError) {
    return 'A reference error occurred. Please refresh the page.';
  }

  if (error instanceof SyntaxError) {
    return 'A syntax error occurred. Please contact support.';
  }

  // Default message
  return error.message || 'An unexpected error occurred. Please try again.';
};

/**
 * Check if error is a specific type
 * @param {Error} error - Error object
 * @param {string} type - Error type to check
 * @returns {boolean}
 */
export const isErrorType = (error, type) => {
  return error instanceof GPSError && error.type === type;
};

/**
 * Check if error is network-related
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export const isNetworkError = (error) => {
  return isErrorType(error, ErrorTypes.NETWORK_ERROR);
};

/**
 * Check if error is authentication-related
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export const isAuthError = (error) => {
  return (
    isErrorType(error, ErrorTypes.AUTHENTICATION_ERROR) ||
    isErrorType(error, ErrorTypes.AUTHORIZATION_ERROR)
  );
};

/**
 * Check if error is validation-related
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export const isValidationError = (error) => {
  return isErrorType(error, ErrorTypes.VALIDATION_ERROR);
};

/**
 * Extract validation errors from error object
 * @param {GPSError} error - Error object
 * @returns {Object} Validation errors by field
 */
export const getValidationErrors = (error) => {
  if (!isValidationError(error)) {
    return {};
  }

  if (error.details && typeof error.details === 'object') {
    return error.details;
  }

  return {};
};

/**
 * Handle error and return appropriate action
 * @param {Error} error - Error object
 * @returns {Object} Action object with type and payload
 */
export const handleError = (error) => {
  const gpsError = error instanceof GPSError ? error : parseApiError(error);

  // Log error for debugging
  console.error('[GPS Error Handler]', {
    type: gpsError.type,
    message: gpsError.message,
    statusCode: gpsError.statusCode,
    details: gpsError.details,
    timestamp: gpsError.timestamp,
  });

  // Return standardized error object
  return {
    type: gpsError.type,
    message: gpsError.message,
    statusCode: gpsError.statusCode,
    details: gpsError.details,
    timestamp: gpsError.timestamp,
  };
};

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Initial delay in ms
 * @returns {Promise}
 */
export const retryWithBackoff = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on auth errors or validation errors
      if (isAuthError(error) || isValidationError(error)) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }

  throw lastError;
};

export default {
  ErrorTypes,
  GPSError,
  parseApiError,
  getUserFriendlyMessage,
  isErrorType,
  isNetworkError,
  isAuthError,
  isValidationError,
  getValidationErrors,
  handleError,
  retryWithBackoff,
};