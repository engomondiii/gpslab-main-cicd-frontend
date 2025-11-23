/* ============================================
   GPS LAB - Date Formatter
   Date formatting and manipulation utilities
   ============================================ */

/**
 * Format date to readable string
 * @param {Date|string|number} date - Date to format
 * @param {string} format - Format type ('short', 'long', 'full', 'time')
 * @param {string} locale - Locale (default: 'en-US')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'short', locale = 'en-US') => {
  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const options = {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
    full: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
    time: {
      hour: '2-digit',
      minute: '2-digit',
    },
    datetime: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  };

  return dateObj.toLocaleDateString(locale, options[format] || options.short);
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param {Date|string|number} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  const dateObj = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);

  if (diffInSeconds < 0) {
    return 'in the future';
  }

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
};

/**
 * Format time duration (e.g., "2h 30m")
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (seconds) => {
  if (seconds < 0) {
    return '0s';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs}s`);
  }

  return parts.join(' ');
};

/**
 * Format time to HH:MM:SS
 * @param {Date|string|number} date - Date to format
 * @returns {string} Time string in HH:MM:SS format
 */
export const formatTime = (date) => {
  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return '00:00:00';
  }

  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  const seconds = dateObj.getSeconds().toString().padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

/**
 * Format date to ISO string
 * @param {Date|string|number} date - Date to format
 * @returns {string} ISO date string
 */
export const formatISO = (date) => {
  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return null;
  }

  return dateObj.toISOString();
};

/**
 * Format date for input fields (YYYY-MM-DD)
 * @param {Date|string|number} date - Date to format
 * @returns {string} Date string in YYYY-MM-DD format
 */
export const formatDateInput = (date) => {
  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return '';
  }

  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Check if date is today
 * @param {Date|string|number} date - Date to check
 * @returns {boolean}
 */
export const isToday = (date) => {
  const dateObj = new Date(date);
  const today = new Date();

  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if date is yesterday
 * @param {Date|string|number} date - Date to check
 * @returns {boolean}
 */
export const isYesterday = (date) => {
  const dateObj = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    dateObj.getDate() === yesterday.getDate() &&
    dateObj.getMonth() === yesterday.getMonth() &&
    dateObj.getFullYear() === yesterday.getFullYear()
  );
};

/**
 * Get start of day
 * @param {Date|string|number} date - Date
 * @returns {Date} Start of day
 */
export const startOfDay = (date) => {
  const dateObj = new Date(date);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj;
};

/**
 * Get end of day
 * @param {Date|string|number} date - Date
 * @returns {Date} End of day
 */
export const endOfDay = (date) => {
  const dateObj = new Date(date);
  dateObj.setHours(23, 59, 59, 999);
  return dateObj;
};

/**
 * Add days to date
 * @param {Date|string|number} date - Date
 * @param {number} days - Number of days to add
 * @returns {Date} New date
 */
export const addDays = (date, days) => {
  const dateObj = new Date(date);
  dateObj.setDate(dateObj.getDate() + days);
  return dateObj;
};

/**
 * Calculate difference in days
 * @param {Date|string|number} date1 - First date
 * @param {Date|string|number} date2 - Second date
 * @returns {number} Difference in days
 */
export const diffInDays = (date1, date2) => {
  const dateObj1 = new Date(date1);
  const dateObj2 = new Date(date2);
  const diffTime = Math.abs(dateObj2 - dateObj1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export default {
  formatDate,
  formatRelativeTime,
  formatDuration,
  formatTime,
  formatISO,
  formatDateInput,
  isToday,
  isYesterday,
  startOfDay,
  endOfDay,
  addDays,
  diffInDays,
};