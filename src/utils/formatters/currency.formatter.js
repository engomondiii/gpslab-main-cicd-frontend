/* ============================================
   GPS LAB - Currency Formatter
   Currency and Baraka formatting utilities
   ============================================ */

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @param {string} locale - Locale (default: 'en-US')
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (isNaN(amount)) {
    return '$0.00';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Format Baraka currency
 * @param {number} amount - Baraka amount
 * @param {boolean} showSymbol - Show Baraka symbol
 * @returns {string} Formatted Baraka amount
 */
export const formatBaraka = (amount, showSymbol = true) => {
  if (isNaN(amount)) {
    return showSymbol ? 'Ƀ 0' : '0';
  }

  const formatted = new Intl.NumberFormat('en-US').format(Math.floor(amount));
  return showSymbol ? `Ƀ ${formatted}` : formatted;
};

/**
 * Format PSB (Problem Solving Blocks)
 * @param {number} amount - PSB amount
 * @param {boolean} showSymbol - Show PSB symbol
 * @returns {string} Formatted PSB amount
 */
export const formatPSB = (amount, showSymbol = true) => {
  if (isNaN(amount)) {
    return showSymbol ? '◆ 0' : '0';
  }

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return showSymbol ? `◆ ${formatted}` : formatted;
};

/**
 * Format XP (Experience Points)
 * @param {number} amount - XP amount
 * @param {boolean} showSymbol - Show XP label
 * @returns {string} Formatted XP amount
 */
export const formatXP = (amount, showSymbol = true) => {
  if (isNaN(amount)) {
    return showSymbol ? '0 XP' : '0';
  }

  const formatted = new Intl.NumberFormat('en-US').format(Math.floor(amount));
  return showSymbol ? `${formatted} XP` : formatted;
};

/**
 * Format Baraka with tier color
 * @param {number} amount - Baraka amount
 * @param {string} tier - Tier ('base', 'green', 'blue', 'indigo', 'purple', 'black')
 * @returns {Object} Object with formatted amount and color class
 */
export const formatBarakaWithTier = (amount, tier = 'base') => {
  const tierColors = {
    base: 'baraka-base',
    green: 'baraka-green',
    blue: 'baraka-blue',
    indigo: 'baraka-indigo',
    purple: 'baraka-purple',
    black: 'baraka-black',
  };

  return {
    formatted: formatBaraka(amount),
    colorClass: tierColors[tier] || tierColors.base,
  };
};

/**
 * Calculate Baraka covenant return (50%)
 * @param {number} amount - Original Baraka amount
 * @returns {Object} Object with original and return amounts
 */
export const calculateCovenantReturn = (amount) => {
  if (isNaN(amount)) {
    return {
      original: 0,
      returned: 0,
      total: 0,
    };
  }

  const returned = Math.floor(amount * 0.5);
  const total = amount + returned;

  return {
    original: amount,
    returned: returned,
    total: total,
  };
};

/**
 * Format money amount with compact notation
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} Formatted compact currency
 */
export const formatCompactCurrency = (amount, currency = 'USD') => {
  if (isNaN(amount)) {
    return '$0';
  }

  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (absAmount < 1000) {
    return sign + formatCurrency(absAmount, currency);
  }

  if (absAmount < 1000000) {
    return sign + '$' + (absAmount / 1000).toFixed(1) + 'K';
  }

  if (absAmount < 1000000000) {
    return sign + '$' + (absAmount / 1000000).toFixed(1) + 'M';
  }

  return sign + '$' + (absAmount / 1000000000).toFixed(1) + 'B';
};

/**
 * Parse currency string to number
 * @param {string} currencyString - Currency string to parse
 * @returns {number} Parsed number
 */
export const parseCurrency = (currencyString) => {
  const cleaned = currencyString.replace(/[^0-9.-]+/g, '');
  return parseFloat(cleaned) || 0;
};

/**
 * Parse Baraka string to number
 * @param {string} barakaString - Baraka string to parse
 * @returns {number} Parsed number
 */
export const parseBaraka = (barakaString) => {
  const cleaned = barakaString.replace(/[^0-9.-]+/g, '');
  return parseInt(cleaned, 10) || 0;
};

/**
 * Format price range
 * @param {number} min - Minimum price
 * @param {number} max - Maximum price
 * @param {string} currency - Currency code
 * @returns {string} Formatted price range
 */
export const formatPriceRange = (min, max, currency = 'USD') => {
  return `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)}`;
};

export default {
  formatCurrency,
  formatBaraka,
  formatPSB,
  formatXP,
  formatBarakaWithTier,
  calculateCovenantReturn,
  formatCompactCurrency,
  parseCurrency,
  parseBaraka,
  formatPriceRange,
};