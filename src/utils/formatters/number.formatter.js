/* ============================================
   GPS LAB - Number Formatter
   Number formatting utilities
   ============================================ */

/**
 * Format number with thousands separator
 * @param {number} value - Number to format
 * @param {string} locale - Locale (default: 'en-US')
 * @returns {string} Formatted number
 */
export const formatNumber = (value, locale = 'en-US') => {
  if (isNaN(value)) {
    return '0';
  }

  return new Intl.NumberFormat(locale).format(value);
};

/**
 * Format number with decimal places
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places
 * @param {string} locale - Locale (default: 'en-US')
 * @returns {string} Formatted number
 */
export const formatDecimal = (value, decimals = 2, locale = 'en-US') => {
  if (isNaN(value)) {
    return '0.00';
  }

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format number as percentage
 * @param {number} value - Number to format (0-1 or 0-100)
 * @param {number} decimals - Number of decimal places
 * @param {boolean} isDecimal - Whether value is decimal (0-1) or percentage (0-100)
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimals = 0, isDecimal = true) => {
  if (isNaN(value)) {
    return '0%';
  }

  const percentage = isDecimal ? value * 100 : value;
  return `${formatDecimal(percentage, decimals)}%`;
};

/**
 * Format large number with abbreviation (K, M, B)
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Abbreviated number
 */
export const formatCompactNumber = (value, decimals = 1) => {
  if (isNaN(value)) {
    return '0';
  }

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue < 1000) {
    return sign + formatDecimal(absValue, 0);
  }

  if (absValue < 1000000) {
    return sign + formatDecimal(absValue / 1000, decimals) + 'K';
  }

  if (absValue < 1000000000) {
    return sign + formatDecimal(absValue / 1000000, decimals) + 'M';
  }

  return sign + formatDecimal(absValue / 1000000000, decimals) + 'B';
};

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  if (isNaN(bytes)) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return formatDecimal(bytes / Math.pow(k, i), decimals) + ' ' + sizes[i];
};

/**
 * Format ordinal number (1st, 2nd, 3rd, etc.)
 * @param {number} value - Number to format
 * @returns {string} Ordinal number
 */
export const formatOrdinal = (value) => {
  if (isNaN(value)) {
    return '0th';
  }

  const num = Math.abs(Math.floor(value));
  const lastDigit = num % 10;
  const lastTwoDigits = num % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return `${num}th`;
  }

  switch (lastDigit) {
    case 1:
      return `${num}st`;
    case 2:
      return `${num}nd`;
    case 3:
      return `${num}rd`;
    default:
      return `${num}th`;
  }
};

/**
 * Format number range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {string} Formatted range
 */
export const formatRange = (min, max) => {
  return `${formatNumber(min)} - ${formatNumber(max)}`;
};

/**
 * Round number to nearest value
 * @param {number} value - Number to round
 * @param {number} nearest - Round to nearest value
 * @returns {number} Rounded number
 */
export const roundToNearest = (value, nearest = 1) => {
  return Math.round(value / nearest) * nearest;
};

/**
 * Clamp number between min and max
 * @param {number} value - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped number
 */
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Calculate average
 * @param {Array<number>} values - Array of numbers
 * @returns {number} Average value
 */
export const average = (values) => {
  if (!Array.isArray(values) || values.length === 0) {
    return 0;
  }

  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
};

/**
 * Format phone number
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }

  return phone;
};

export default {
  formatNumber,
  formatDecimal,
  formatPercentage,
  formatCompactNumber,
  formatFileSize,
  formatOrdinal,
  formatRange,
  roundToNearest,
  clamp,
  average,
  formatPhoneNumber,
};