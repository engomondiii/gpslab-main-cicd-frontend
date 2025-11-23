/* ============================================
   GPS LAB - Error Logger
   Error logging and reporting utility
   ============================================ */

/**
 * Log levels enum
 */
export const LogLevels = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

/**
 * Log entry class
 */
class LogEntry {
  constructor(level, message, data = null, error = null) {
    this.level = level;
    this.message = message;
    this.data = data;
    this.error = error;
    this.timestamp = new Date().toISOString();
    this.userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';
    this.url = typeof window !== 'undefined' ? window.location.href : 'Unknown';
  }

  toJSON() {
    return {
      level: this.level,
      message: this.message,
      data: this.data,
      error: this.error ? {
        name: this.error.name,
        message: this.error.message,
        stack: this.error.stack,
        type: this.error.type,
        statusCode: this.error.statusCode,
      } : null,
      timestamp: this.timestamp,
      userAgent: this.userAgent,
      url: this.url,
    };
  }
}

/**
 * Error Logger class
 */
class ErrorLogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 100;
    this.remoteLoggingEnabled = false;
    this.remoteEndpoint = null;
  }

  /**
   * Configure remote logging
   * @param {string} endpoint - Remote logging endpoint
   */
  configureRemoteLogging(endpoint) {
    this.remoteLoggingEnabled = true;
    this.remoteEndpoint = endpoint;
  }

  /**
   * Disable remote logging
   */
  disableRemoteLogging() {
    this.remoteLoggingEnabled = false;
    this.remoteEndpoint = null;
  }

  /**
   * Add log entry
   * @param {LogEntry} entry - Log entry
   */
  addLog(entry) {
    this.logs.push(entry);

    // Keep only last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Send to remote logging service if enabled
    if (this.remoteLoggingEnabled && this.remoteEndpoint) {
      this.sendToRemote(entry);
    }
  }

  /**
   * Log error
   * @param {string} message - Error message
   * @param {Error} error - Error object
   * @param {Object} data - Additional data
   */
  error(message, error = null, data = null) {
    const entry = new LogEntry(LogLevels.ERROR, message, data, error);
    this.addLog(entry);

    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[GPS Error] ${message}`, { error, data });
    }
  }

  /**
   * Log warning
   * @param {string} message - Warning message
   * @param {Object} data - Additional data
   */
  warn(message, data = null) {
    const entry = new LogEntry(LogLevels.WARN, message, data);
    this.addLog(entry);

    if (process.env.NODE_ENV === 'development') {
      console.warn(`[GPS Warning] ${message}`, data);
    }
  }

  /**
   * Log info
   * @param {string} message - Info message
   * @param {Object} data - Additional data
   */
  info(message, data = null) {
    const entry = new LogEntry(LogLevels.INFO, message, data);
    this.addLog(entry);

    if (process.env.NODE_ENV === 'development') {
      console.info(`[GPS Info] ${message}`, data);
    }
  }

  /**
   * Log debug
   * @param {string} message - Debug message
   * @param {Object} data - Additional data
   */
  debug(message, data = null) {
    const entry = new LogEntry(LogLevels.DEBUG, message, data);
    this.addLog(entry);

    if (process.env.NODE_ENV === 'development') {
      console.debug(`[GPS Debug] ${message}`, data);
    }
  }

  /**
   * Send log entry to remote service
   * @param {LogEntry} entry - Log entry
   */
  async sendToRemote(entry) {
    try {
      await fetch(this.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry.toJSON()),
      });
    } catch (error) {
      // Fail silently - don't want logging errors to break the app
      console.error('Failed to send log to remote service:', error);
    }
  }

  /**
   * Get all logs
   * @returns {Array} All log entries
   */
  getLogs() {
    return this.logs;
  }

  /**
   * Get logs by level
   * @param {string} level - Log level
   * @returns {Array} Filtered log entries
   */
  getLogsByLevel(level) {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Get errors only
   * @returns {Array} Error log entries
   */
  getErrors() {
    return this.getLogsByLevel(LogLevels.ERROR);
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   * @returns {string} JSON string of all logs
   */
  exportLogs() {
    return JSON.stringify(this.logs.map(log => log.toJSON()), null, 2);
  }

  /**
   * Download logs as file
   */
  downloadLogs() {
    const logs = this.exportLogs();
    const blob = new Blob([logs], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gps-lab-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Create singleton instance
const logger = new ErrorLogger();

export default logger;
export { LogLevels, LogEntry, ErrorLogger };