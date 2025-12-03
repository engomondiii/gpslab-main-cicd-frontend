/**
 * GPS Lab Platform - Error Utilities Index
 * 
 * Central export file for error handling and logging utilities.
 * Import error utilities from this file for convenience.
 * 
 * @module utils/error
 * @version 1.0.0
 */

// =============================================================================
// ERROR HANDLER
// =============================================================================
export {
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
} from './error.handler.js';

// =============================================================================
// LOGGER
// =============================================================================
export {
  // Configuration
  configure,
  getConfig,
  setLevel,
  setEnabled,
  addLogHandler,
  removeLogHandler,
  
  // Log levels
  LOG_LEVELS,
  LOG_CATEGORIES,
  
  // Logging methods
  trace,
  debug,
  info,
  warn,
  error,
  fatal,
  log,
  
  // Category loggers
  createCategoryLogger,
  apiLogger,
  authLogger,
  gameLogger,
  barakaLogger,
  missionLogger,
  performanceLogger,
  
  // GPS Lab specific logging
  logMissionEvent,
  logCheckpointEvent,
  logBarakaTransaction,
  logUserAction,
  logApiRequest,
  logApiResponse,
  logPerformance,
  
  // Buffer management
  getBufferedLogs,
  clearBuffer,
  exportLogs
} from './error.logger.js';

// =============================================================================
// DEFAULT EXPORTS (Namespaced)
// =============================================================================
import errorHandler from './error.handler.js';
import logger from './error.logger.js';

export {
  errorHandler,
  logger
};

/**
 * Combined error utilities object for convenience
 */
export default {
  handler: errorHandler,
  logger: logger
};