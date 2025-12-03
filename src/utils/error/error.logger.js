/**
 * GPS Lab Platform - Logger
 * 
 * Comprehensive logging utilities for the GPS Lab MMORPG educational platform.
 * Handles structured logging, log levels, formatting, and log transport.
 * 
 * @module utils/error/logger
 * @version 1.0.0
 */

// =============================================================================
// LOG LEVELS
// =============================================================================

/**
 * Log level definitions with numeric priorities
 */
export const LOG_LEVELS = {
  TRACE: { name: 'trace', priority: 0, color: '#9ca3af', emoji: '🔬' },
  DEBUG: { name: 'debug', priority: 1, color: '#6366f1', emoji: '🐛' },
  INFO: { name: 'info', priority: 2, color: '#3b82f6', emoji: 'ℹ️' },
  WARN: { name: 'warn', priority: 3, color: '#f59e0b', emoji: '⚠️' },
  ERROR: { name: 'error', priority: 4, color: '#ef4444', emoji: '❌' },
  FATAL: { name: 'fatal', priority: 5, color: '#dc2626', emoji: '💀' }
};

/**
 * Log categories for filtering
 */
export const LOG_CATEGORIES = {
  API: 'api',
  AUTH: 'auth',
  NAVIGATION: 'navigation',
  USER_ACTION: 'user_action',
  GAME: 'game',
  BARAKA: 'baraka',
  MISSION: 'mission',
  CHECKPOINT: 'checkpoint',
  PARTY: 'party',
  PERFORMANCE: 'performance',
  ERROR: 'error',
  SYSTEM: 'system'
};

// =============================================================================
// LOGGER CONFIGURATION
// =============================================================================

/**
 * Default logger configuration
 */
const DEFAULT_CONFIG = {
  level: 'info',
  enabled: true,
  console: true,
  timestamps: true,
  colors: true,
  emoji: true,
  includeStackTrace: false,
  maxLogLength: 10000,
  categories: Object.values(LOG_CATEGORIES)
};

/**
 * Current logger configuration
 */
let config = { ...DEFAULT_CONFIG };

/**
 * Log buffer for batched sending
 */
let logBuffer = [];
const MAX_BUFFER_SIZE = 100;

/**
 * External log handlers
 */
const logHandlers = [];

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Configures the logger
 * @param {Object} options - Configuration options
 */
export const configure = (options = {}) => {
  config = {
    ...config,
    ...options
  };
};

/**
 * Gets current configuration
 * @returns {Object} Current config
 */
export const getConfig = () => ({ ...config });

/**
 * Sets log level
 * @param {string} level - Log level name
 */
export const setLevel = (level) => {
  if (LOG_LEVELS[level.toUpperCase()]) {
    config.level = level.toLowerCase();
  }
};

/**
 * Enables/disables logging
 * @param {boolean} enabled - Enable state
 */
export const setEnabled = (enabled) => {
  config.enabled = enabled;
};

/**
 * Registers external log handler
 * @param {Function} handler - Handler function (log) => void
 */
export const addLogHandler = (handler) => {
  if (typeof handler === 'function') {
    logHandlers.push(handler);
  }
};

/**
 * Removes log handler
 * @param {Function} handler - Handler to remove
 */
export const removeLogHandler = (handler) => {
  const index = logHandlers.indexOf(handler);
  if (index > -1) {
    logHandlers.splice(index, 1);
  }
};

// =============================================================================
// LOG ENTRY CREATION
// =============================================================================

/**
 * Creates a log entry
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} data - Additional data
 * @returns {Object} Log entry
 */
const createLogEntry = (level, message, data = {}) => {
  const levelConfig = LOG_LEVELS[level.toUpperCase()];
  
  const entry = {
    timestamp: new Date().toISOString(),
    level: levelConfig.name,
    priority: levelConfig.priority,
    message: String(message).slice(0, config.maxLogLength),
    category: data.category || LOG_CATEGORIES.SYSTEM,
    data: { ...data }
  };
  
  // Remove category from data to avoid duplication
  delete entry.data.category;
  
  // Add context if available
  if (typeof window !== 'undefined') {
    entry.context = {
      url: window.location?.href,
      userAgent: navigator?.userAgent?.slice(0, 200)
    };
  }
  
  // Add stack trace for errors if configured
  if (config.includeStackTrace && (level === 'ERROR' || level === 'FATAL')) {
    entry.stack = new Error().stack;
  }
  
  return entry;
};

// =============================================================================
// CONSOLE OUTPUT
// =============================================================================

/**
 * Formats log entry for console
 * @param {Object} entry - Log entry
 * @returns {Array} Console arguments
 */
const formatForConsole = (entry) => {
  const levelConfig = LOG_LEVELS[entry.level.toUpperCase()];
  const parts = [];
  
  // Emoji prefix
  if (config.emoji) {
    parts.push(levelConfig.emoji);
  }
  
  // Timestamp
  if (config.timestamps) {
    const time = new Date(entry.timestamp).toLocaleTimeString();
    parts.push(`[${time}]`);
  }
  
  // Level
  parts.push(`[${entry.level.toUpperCase()}]`);
  
  // Category
  if (entry.category) {
    parts.push(`[${entry.category}]`);
  }
  
  // Message
  parts.push(entry.message);
  
  const message = parts.join(' ');
  const args = [message];
  
  // Add data if present
  if (Object.keys(entry.data).length > 0) {
    args.push(entry.data);
  }
  
  // Add styling for browsers
  if (config.colors && typeof window !== 'undefined') {
    const style = `color: ${levelConfig.color}; font-weight: bold;`;
    return [`%c${message}`, style, ...args.slice(1)];
  }
  
  return args;
};

/**
 * Outputs log to console
 * @param {Object} entry - Log entry
 */
const outputToConsole = (entry) => {
  if (!config.console) return;
  
  const args = formatForConsole(entry);
  const consoleFn = console[entry.level] || console.log;
  
  consoleFn.apply(console, args);
};

// =============================================================================
// LOG PROCESSING
// =============================================================================

/**
 * Checks if log level should be output
 * @param {string} level - Log level to check
 * @returns {boolean} True if should output
 */
const shouldLog = (level) => {
  if (!config.enabled) return false;
  
  const levelConfig = LOG_LEVELS[level.toUpperCase()];
  const configLevel = LOG_LEVELS[config.level.toUpperCase()];
  
  return levelConfig.priority >= configLevel.priority;
};

/**
 * Checks if category should be logged
 * @param {string} category - Category to check
 * @returns {boolean} True if should log
 */
const shouldLogCategory = (category) => {
  if (!config.categories || config.categories.length === 0) return true;
  return config.categories.includes(category);
};

/**
 * Processes a log entry
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} data - Additional data
 */
const processLog = (level, message, data = {}) => {
  if (!shouldLog(level)) return;
  if (!shouldLogCategory(data.category)) return;
  
  const entry = createLogEntry(level, message, data);
  
  // Output to console
  outputToConsole(entry);
  
  // Add to buffer
  logBuffer.push(entry);
  if (logBuffer.length > MAX_BUFFER_SIZE) {
    logBuffer.shift();
  }
  
  // Call external handlers
  logHandlers.forEach(handler => {
    try {
      handler(entry);
    } catch (e) {
      console.error('Log handler error:', e);
    }
  });
};

// =============================================================================
// PUBLIC LOGGING METHODS
// =============================================================================

/**
 * Logs trace message
 * @param {string} message - Message
 * @param {Object} data - Additional data
 */
export const trace = (message, data) => processLog('TRACE', message, data);

/**
 * Logs debug message
 * @param {string} message - Message
 * @param {Object} data - Additional data
 */
export const debug = (message, data) => processLog('DEBUG', message, data);

/**
 * Logs info message
 * @param {string} message - Message
 * @param {Object} data - Additional data
 */
export const info = (message, data) => processLog('INFO', message, data);

/**
 * Logs warning message
 * @param {string} message - Message
 * @param {Object} data - Additional data
 */
export const warn = (message, data) => processLog('WARN', message, data);

/**
 * Logs error message
 * @param {string} message - Message
 * @param {Object} data - Additional data
 */
export const error = (message, data) => processLog('ERROR', message, data);

/**
 * Logs fatal message
 * @param {string} message - Message
 * @param {Object} data - Additional data
 */
export const fatal = (message, data) => processLog('FATAL', message, data);

/**
 * Generic log method
 * @param {string} level - Log level
 * @param {string} message - Message
 * @param {Object} data - Additional data
 */
export const log = (level, message, data) => processLog(level.toUpperCase(), message, data);

// =============================================================================
// CATEGORY-SPECIFIC LOGGERS
// =============================================================================

/**
 * Creates a category-specific logger
 * @param {string} category - Category name
 * @returns {Object} Logger with category pre-set
 */
export const createCategoryLogger = (category) => ({
  trace: (message, data = {}) => trace(message, { ...data, category }),
  debug: (message, data = {}) => debug(message, { ...data, category }),
  info: (message, data = {}) => info(message, { ...data, category }),
  warn: (message, data = {}) => warn(message, { ...data, category }),
  error: (message, data = {}) => error(message, { ...data, category }),
  fatal: (message, data = {}) => fatal(message, { ...data, category })
});

/**
 * Pre-built category loggers
 */
export const apiLogger = createCategoryLogger(LOG_CATEGORIES.API);
export const authLogger = createCategoryLogger(LOG_CATEGORIES.AUTH);
export const gameLogger = createCategoryLogger(LOG_CATEGORIES.GAME);
export const barakaLogger = createCategoryLogger(LOG_CATEGORIES.BARAKA);
export const missionLogger = createCategoryLogger(LOG_CATEGORIES.MISSION);
export const performanceLogger = createCategoryLogger(LOG_CATEGORIES.PERFORMANCE);

// =============================================================================
// GPS LAB SPECIFIC LOGGING
// =============================================================================

/**
 * Logs mission event
 * @param {string} action - Action type
 * @param {Object} missionData - Mission data
 */
export const logMissionEvent = (action, missionData) => {
  info(`Mission ${action}`, {
    category: LOG_CATEGORIES.MISSION,
    action,
    ...missionData
  });
};

/**
 * Logs checkpoint event
 * @param {string} action - Action type
 * @param {Object} checkpointData - Checkpoint data
 */
export const logCheckpointEvent = (action, checkpointData) => {
  info(`Checkpoint ${action}`, {
    category: LOG_CATEGORIES.CHECKPOINT,
    action,
    ...checkpointData
  });
};

/**
 * Logs Baraka transaction
 * @param {string} type - Transaction type (earn, spend)
 * @param {number} amount - Amount
 * @param {Object} details - Transaction details
 */
export const logBarakaTransaction = (type, amount, details = {}) => {
  info(`Baraka ${type}: ${amount}`, {
    category: LOG_CATEGORIES.BARAKA,
    transactionType: type,
    amount,
    ...details
  });
};

/**
 * Logs user action
 * @param {string} action - Action name
 * @param {Object} details - Action details
 */
export const logUserAction = (action, details = {}) => {
  debug(`User action: ${action}`, {
    category: LOG_CATEGORIES.USER_ACTION,
    action,
    ...details
  });
};

/**
 * Logs API request
 * @param {string} method - HTTP method
 * @param {string} url - Request URL
 * @param {Object} options - Request options
 */
export const logApiRequest = (method, url, options = {}) => {
  debug(`API ${method} ${url}`, {
    category: LOG_CATEGORIES.API,
    method,
    url,
    ...options
  });
};

/**
 * Logs API response
 * @param {string} method - HTTP method
 * @param {string} url - Request URL
 * @param {number} status - Response status
 * @param {number} duration - Request duration (ms)
 */
export const logApiResponse = (method, url, status, duration) => {
  const level = status >= 400 ? 'WARN' : 'DEBUG';
  processLog(level, `API ${method} ${url} - ${status} (${duration}ms)`, {
    category: LOG_CATEGORIES.API,
    method,
    url,
    status,
    duration
  });
};

/**
 * Logs performance metric
 * @param {string} metric - Metric name
 * @param {number} value - Metric value
 * @param {string} unit - Unit of measurement
 */
export const logPerformance = (metric, value, unit = 'ms') => {
  debug(`Performance: ${metric} = ${value}${unit}`, {
    category: LOG_CATEGORIES.PERFORMANCE,
    metric,
    value,
    unit
  });
};

// =============================================================================
// LOG BUFFER MANAGEMENT
// =============================================================================

/**
 * Gets buffered logs
 * @param {Object} filters - Filter options
 * @returns {Array} Filtered logs
 */
export const getBufferedLogs = (filters = {}) => {
  let logs = [...logBuffer];
  
  if (filters.level) {
    const minPriority = LOG_LEVELS[filters.level.toUpperCase()]?.priority || 0;
    logs = logs.filter(log => log.priority >= minPriority);
  }
  
  if (filters.category) {
    logs = logs.filter(log => log.category === filters.category);
  }
  
  if (filters.since) {
    const sinceDate = new Date(filters.since);
    logs = logs.filter(log => new Date(log.timestamp) >= sinceDate);
  }
  
  return logs;
};

/**
 * Clears log buffer
 */
export const clearBuffer = () => {
  logBuffer = [];
};

/**
 * Exports logs as JSON
 * @param {Object} filters - Filter options
 * @returns {string} JSON string
 */
export const exportLogs = (filters = {}) => {
  const logs = getBufferedLogs(filters);
  return JSON.stringify(logs, null, 2);
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
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
  
  // GPS Lab specific
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
};