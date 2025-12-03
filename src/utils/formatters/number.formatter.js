/**
 * GPS Lab Platform - Number Formatter Utilities
 * 
 * Comprehensive number formatting functions for the GPS Lab MMORPG educational platform.
 * Handles XP, Baraka amounts, percentages, statistics, and various numeric displays.
 * Supports multi-language formatting (EN, KO, SW).
 * 
 * @module utils/formatters/number.formatter
 * @version 1.0.0
 */

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Supported locales for the GPS Lab Platform
 */
export const SUPPORTED_LOCALES = {
  EN: 'en-US',
  KO: 'ko-KR',
  SW: 'sw-KE'
};

/**
 * Default locale fallback
 */
export const DEFAULT_LOCALE = SUPPORTED_LOCALES.EN;

/**
 * Number format patterns by locale
 */
export const NUMBER_PATTERNS = {
  'en-US': {
    decimal: '.',
    thousands: ',',
    grouping: 3
  },
  'ko-KR': {
    decimal: '.',
    thousands: ',',
    grouping: 4 // Korean uses 만 (10,000) grouping
  },
  'sw-KE': {
    decimal: '.',
    thousands: ',',
    grouping: 3
  }
};

/**
 * Magnitude suffixes by locale
 */
export const MAGNITUDE_SUFFIXES = {
  'en-US': {
    thousand: 'K',
    million: 'M',
    billion: 'B',
    trillion: 'T'
  },
  'ko-KR': {
    thousand: '천',
    tenThousand: '만',
    hundredMillion: '억',
    trillion: '조'
  },
  'sw-KE': {
    thousand: 'K',
    million: 'M',
    billion: 'B',
    trillion: 'T'
  }
};

/**
 * Ordinal suffixes by locale
 */
export const ORDINAL_SUFFIXES = {
  'en-US': {
    1: 'st',
    2: 'nd',
    3: 'rd',
    default: 'th'
  },
  'ko-KR': {
    default: '번째'
  },
  'sw-KE': {
    default: ''
  }
};

/**
 * XP (Experience Points) formatting thresholds
 */
export const XP_THRESHOLDS = {
  CHECKPOINT: 5,
  MISSION: 25,
  STAGE_BONUS: 100,
  LEVEL_UP: 1000
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Validates if a value is a valid number
 * @param {*} value - Value to validate
 * @returns {boolean} True if valid number
 */
export const isValidNumber = (value) => {
  if (value === null || value === undefined || value === '') return false;
  const num = Number(value);
  return !isNaN(num) && isFinite(num);
};

/**
 * Converts value to number safely
 * @param {*} value - Value to convert
 * @param {number} fallback - Fallback value if conversion fails
 * @returns {number} Converted number or fallback
 */
export const toNumber = (value, fallback = 0) => {
  if (!isValidNumber(value)) return fallback;
  return Number(value);
};

/**
 * Gets the normalized locale string
 * @param {string} locale - Locale code
 * @returns {string} Normalized locale
 */
export const normalizeLocale = (locale) => {
  if (!locale) return DEFAULT_LOCALE;
  
  const localeMap = {
    'en': SUPPORTED_LOCALES.EN,
    'ko': SUPPORTED_LOCALES.KO,
    'sw': SUPPORTED_LOCALES.SW
  };
  
  const shortCode = locale.split('-')[0].toLowerCase();
  return localeMap[shortCode] || locale || DEFAULT_LOCALE;
};

/**
 * Clamps a number between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export const clamp = (value, min, max) => {
  return Math.min(Math.max(toNumber(value), min), max);
};

// =============================================================================
// CORE FORMATTING FUNCTIONS
// =============================================================================

/**
 * Formats a number with locale-specific separators
 * @param {number|string} value - Number to format
 * @param {Object} options - Formatting options
 * @param {string} options.locale - Locale code
 * @param {number} options.minimumFractionDigits - Minimum decimal places
 * @param {number} options.maximumFractionDigits - Maximum decimal places
 * @returns {string} Formatted number string
 */
export const formatNumber = (value, options = {}) => {
  const num = toNumber(value);
  
  const {
    locale = DEFAULT_LOCALE,
    minimumFractionDigits = 0,
    maximumFractionDigits = 2
  } = options;
  
  const normalizedLocale = normalizeLocale(locale);
  
  try {
    return num.toLocaleString(normalizedLocale, {
      minimumFractionDigits,
      maximumFractionDigits
    });
  } catch (error) {
    console.error('Number formatting error:', error);
    return num.toString();
  }
};

/**
 * Formats a number as an integer (no decimals)
 * @param {number|string} value - Number to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted integer string
 */
export const formatInteger = (value, options = {}) => {
  return formatNumber(Math.round(toNumber(value)), {
    ...options,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

/**
 * Formats a decimal number with specified precision
 * @param {number|string} value - Number to format
 * @param {number} decimals - Number of decimal places
 * @param {Object} options - Formatting options
 * @returns {string} Formatted decimal string
 */
export const formatDecimal = (value, decimals = 2, options = {}) => {
  return formatNumber(value, {
    ...options,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Formats a number with compact notation (K, M, B)
 * @param {number|string} value - Number to format
 * @param {Object} options - Formatting options
 * @param {string} options.locale - Locale code
 * @param {number} options.decimals - Decimal places for compact numbers
 * @param {number} options.threshold - Minimum value for compact notation
 * @returns {string} Compact formatted number
 */
export const formatCompact = (value, options = {}) => {
  const num = toNumber(value);
  
  const {
    locale = DEFAULT_LOCALE,
    decimals = 1,
    threshold = 1000
  } = options;
  
  const normalizedLocale = normalizeLocale(locale);
  const suffixes = MAGNITUDE_SUFFIXES[normalizedLocale] || MAGNITUDE_SUFFIXES['en-US'];
  
  // For Korean, use different magnitude system
  if (normalizedLocale === 'ko-KR') {
    return formatCompactKorean(num, decimals, suffixes);
  }
  
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  if (absNum < threshold) {
    return formatNumber(num, { locale, maximumFractionDigits: 0 });
  }
  
  if (absNum >= 1e12) {
    return `${sign}${(absNum / 1e12).toFixed(decimals)}${suffixes.trillion}`;
  }
  if (absNum >= 1e9) {
    return `${sign}${(absNum / 1e9).toFixed(decimals)}${suffixes.billion}`;
  }
  if (absNum >= 1e6) {
    return `${sign}${(absNum / 1e6).toFixed(decimals)}${suffixes.million}`;
  }
  if (absNum >= 1e3) {
    return `${sign}${(absNum / 1e3).toFixed(decimals)}${suffixes.thousand}`;
  }
  
  return formatNumber(num, { locale });
};

/**
 * Formats a number with Korean magnitude system (만, 억, 조)
 * @param {number} num - Number to format
 * @param {number} decimals - Decimal places
 * @param {Object} suffixes - Magnitude suffixes
 * @returns {string} Korean compact formatted number
 */
const formatCompactKorean = (num, decimals, suffixes) => {
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  if (absNum >= 1e12) {
    return `${sign}${(absNum / 1e12).toFixed(decimals)}${suffixes.trillion}`;
  }
  if (absNum >= 1e8) {
    return `${sign}${(absNum / 1e8).toFixed(decimals)}${suffixes.hundredMillion}`;
  }
  if (absNum >= 1e4) {
    return `${sign}${(absNum / 1e4).toFixed(decimals)}${suffixes.tenThousand}`;
  }
  if (absNum >= 1e3) {
    return `${sign}${(absNum / 1e3).toFixed(decimals)}${suffixes.thousand}`;
  }
  
  return formatNumber(num, { locale: 'ko-KR' });
};

// =============================================================================
// PERCENTAGE FORMATTING
// =============================================================================

/**
 * Formats a decimal value as a percentage
 * @param {number|string} value - Decimal value (0.5 = 50%)
 * @param {Object} options - Formatting options
 * @param {string} options.locale - Locale code
 * @param {number} options.decimals - Decimal places
 * @param {boolean} options.includeSymbol - Include % symbol
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, options = {}) => {
  const num = toNumber(value);
  
  const {
    locale = DEFAULT_LOCALE,
    decimals = 0,
    includeSymbol = true
  } = options;
  
  const percentage = num * 100;
  const formatted = formatDecimal(percentage, decimals, { locale });
  
  return includeSymbol ? `${formatted}%` : formatted;
};

/**
 * Formats a percentage from a raw percentage value (50 = 50%)
 * @param {number|string} value - Raw percentage value
 * @param {Object} options - Formatting options
 * @returns {string} Formatted percentage string
 */
export const formatPercentageRaw = (value, options = {}) => {
  const num = toNumber(value);
  
  const {
    locale = DEFAULT_LOCALE,
    decimals = 0,
    includeSymbol = true
  } = options;
  
  const formatted = formatDecimal(num, decimals, { locale });
  
  return includeSymbol ? `${formatted}%` : formatted;
};

/**
 * Formats a progress percentage (clamped between 0-100)
 * @param {number|string} current - Current value
 * @param {number|string} total - Total value
 * @param {Object} options - Formatting options
 * @returns {string} Formatted progress percentage
 */
export const formatProgress = (current, total, options = {}) => {
  const currentNum = toNumber(current);
  const totalNum = toNumber(total, 1); // Avoid division by zero
  
  const percentage = totalNum > 0 ? (currentNum / totalNum) : 0;
  const clampedPercentage = clamp(percentage, 0, 1);
  
  return formatPercentage(clampedPercentage, options);
};

// =============================================================================
// ORDINAL FORMATTING
// =============================================================================

/**
 * Formats a number as an ordinal (1st, 2nd, 3rd, etc.)
 * @param {number|string} value - Number to format
 * @param {Object} options - Formatting options
 * @param {string} options.locale - Locale code
 * @returns {string} Ordinal string
 */
export const formatOrdinal = (value, options = {}) => {
  const num = Math.round(toNumber(value));
  const { locale = DEFAULT_LOCALE } = options;
  const normalizedLocale = normalizeLocale(locale);
  
  // Korean ordinal
  if (normalizedLocale === 'ko-KR') {
    return `${num}${ORDINAL_SUFFIXES['ko-KR'].default}`;
  }
  
  // Swahili ordinal (uses "ya" prefix)
  if (normalizedLocale === 'sw-KE') {
    return `ya ${num}`;
  }
  
  // English ordinal
  const suffixes = ORDINAL_SUFFIXES['en-US'];
  const absNum = Math.abs(num);
  const lastTwo = absNum % 100;
  
  // Special case for 11, 12, 13
  if (lastTwo >= 11 && lastTwo <= 13) {
    return `${num}${suffixes.default}`;
  }
  
  const lastOne = absNum % 10;
  const suffix = suffixes[lastOne] || suffixes.default;
  
  return `${num}${suffix}`;
};

// =============================================================================
// GPS LAB SPECIFIC FORMATTERS
// =============================================================================

/**
 * Formats XP (Experience Points) with appropriate suffix
 * @param {number|string} value - XP amount
 * @param {Object} options - Formatting options
 * @returns {string} Formatted XP string
 */
export const formatXP = (value, options = {}) => {
  const num = toNumber(value);
  const { locale = DEFAULT_LOCALE, showLabel = true } = options;
  
  const formatted = num >= 10000 
    ? formatCompact(num, { locale, decimals: 1 })
    : formatInteger(num, { locale });
  
  if (!showLabel) return formatted;
  
  const labels = {
    'en-US': 'XP',
    'ko-KR': '경험치',
    'sw-KE': 'XP'
  };
  
  const normalizedLocale = normalizeLocale(locale);
  const label = labels[normalizedLocale] || 'XP';
  
  return `${formatted} ${label}`;
};

/**
 * Formats XP gain/change with + prefix
 * @param {number|string} value - XP change amount
 * @param {Object} options - Formatting options
 * @returns {string} Formatted XP change string
 */
export const formatXPGain = (value, options = {}) => {
  const num = toNumber(value);
  const prefix = num >= 0 ? '+' : '';
  return `${prefix}${formatXP(num, options)}`;
};

/**
 * Formats Baraka currency amount
 * @param {number|string} value - Baraka amount
 * @param {Object} options - Formatting options
 * @returns {string} Formatted Baraka string
 */
export const formatBaraka = (value, options = {}) => {
  const num = toNumber(value);
  const { 
    locale = DEFAULT_LOCALE, 
    showSymbol = true,
    compact = false 
  } = options;
  
  const formatted = compact 
    ? formatCompact(num, { locale, decimals: 1 })
    : formatInteger(num, { locale });
  
  if (!showSymbol) return formatted;
  
  // Baraka symbol: ₿ or custom icon representation
  return `₿${formatted}`;
};

/**
 * Formats Baraka change with +/- prefix and color indicator
 * @param {number|string} value - Baraka change amount
 * @param {Object} options - Formatting options
 * @returns {Object} Formatted Baraka change with metadata
 */
export const formatBarakaChange = (value, options = {}) => {
  const num = toNumber(value);
  const isPositive = num >= 0;
  const prefix = isPositive ? '+' : '';
  
  return {
    text: `${prefix}${formatBaraka(num, options)}`,
    isPositive,
    isNegative: num < 0,
    amount: num,
    cssClass: isPositive ? 'baraka-gain' : 'baraka-loss'
  };
};

/**
 * Formats PSB (Project-Specific Baraka) amount
 * @param {number|string} value - PSB amount
 * @param {string} projectCode - Project identifier code
 * @param {Object} options - Formatting options
 * @returns {string} Formatted PSB string
 */
export const formatPSB = (value, projectCode = '', options = {}) => {
  const num = toNumber(value);
  const { 
    locale = DEFAULT_LOCALE,
    compact = false 
  } = options;
  
  const formatted = compact 
    ? formatCompact(num, { locale, decimals: 1 })
    : formatInteger(num, { locale });
  
  // PSB format: [ProjectCode]PSB or just PSB
  const suffix = projectCode ? `[${projectCode}]PSB` : 'PSB';
  return `${formatted} ${suffix}`;
};

/**
 * Formats checkpoint completion count
 * @param {number|string} completed - Completed checkpoints
 * @param {number|string} total - Total checkpoints
 * @param {Object} options - Formatting options
 * @returns {string} Formatted checkpoint progress
 */
export const formatCheckpointProgress = (completed, total, options = {}) => {
  const completedNum = toNumber(completed);
  const totalNum = toNumber(total);
  const { locale = DEFAULT_LOCALE } = options;
  
  const completedStr = formatInteger(completedNum, { locale });
  const totalStr = formatInteger(totalNum, { locale });
  
  return `${completedStr}/${totalStr}`;
};

/**
 * Formats mission/bite progress with percentage
 * @param {number|string} completed - Completed items
 * @param {number|string} total - Total items
 * @param {Object} options - Formatting options
 * @returns {Object} Progress data with multiple format options
 */
export const formatMissionProgress = (completed, total, options = {}) => {
  const completedNum = toNumber(completed);
  const totalNum = toNumber(total);
  const { locale = DEFAULT_LOCALE } = options;
  
  const percentage = totalNum > 0 ? (completedNum / totalNum) : 0;
  const clampedPercentage = clamp(percentage, 0, 1);
  
  return {
    fraction: formatCheckpointProgress(completedNum, totalNum, { locale }),
    percentage: formatPercentage(clampedPercentage, { locale, decimals: 0 }),
    percentageValue: Math.round(clampedPercentage * 100),
    decimal: clampedPercentage,
    completed: completedNum,
    total: totalNum,
    remaining: Math.max(0, totalNum - completedNum)
  };
};

/**
 * Formats stage number with beacon color
 * @param {number|string} stageNumber - Stage number (1-35)
 * @param {Object} options - Formatting options
 * @returns {Object} Formatted stage with metadata
 */
export const formatStageNumber = (stageNumber, options = {}) => {
  const num = toNumber(stageNumber);
  const { locale = DEFAULT_LOCALE, includeAdventure = false } = options;
  
  // Determine adventure based on stage number
  let adventure = 1;
  let beaconColor = 'orange';
  
  if (num <= 0) {
    adventure = 0;
    beaconColor = 'red';
  } else if (num <= 5) {
    adventure = 1;
    beaconColor = 'orange';
  } else if (num <= 10) {
    adventure = 2;
    beaconColor = 'yellow';
  } else if (num <= 15) {
    adventure = 3;
    beaconColor = 'green';
  } else if (num <= 20) {
    adventure = 4;
    beaconColor = 'blue';
  } else if (num <= 25) {
    adventure = 5;
    beaconColor = 'indigo';
  } else if (num <= 30) {
    adventure = 6;
    beaconColor = 'purple';
  } else {
    adventure = 7;
    beaconColor = 'light';
  }
  
  const labels = {
    'en-US': `Stage ${num}`,
    'ko-KR': `${num}단계`,
    'sw-KE': `Hatua ya ${num}`
  };
  
  const normalizedLocale = normalizeLocale(locale);
  
  return {
    text: labels[normalizedLocale] || labels['en-US'],
    number: num,
    adventure,
    beaconColor,
    cssClass: `beacon-${beaconColor}`
  };
};

/**
 * Formats leaderboard rank with ordinal
 * @param {number|string} rank - Leaderboard position
 * @param {Object} options - Formatting options
 * @returns {Object} Formatted rank with metadata
 */
export const formatRank = (rank, options = {}) => {
  const num = toNumber(rank);
  const { locale = DEFAULT_LOCALE } = options;
  
  const ordinal = formatOrdinal(num, { locale });
  
  // Determine rank tier
  let tier = 'standard';
  let icon = null;
  
  if (num === 1) {
    tier = 'gold';
    icon = '🥇';
  } else if (num === 2) {
    tier = 'silver';
    icon = '🥈';
  } else if (num === 3) {
    tier = 'bronze';
    icon = '🥉';
  } else if (num <= 10) {
    tier = 'top10';
  } else if (num <= 100) {
    tier = 'top100';
  }
  
  return {
    text: ordinal,
    number: num,
    tier,
    icon,
    cssClass: `rank-${tier}`
  };
};

/**
 * Formats covenant return amount (50% return policy)
 * @param {number|string} totalAmount - Total payment amount
 * @param {number} returnPercentage - Return percentage (default 50%)
 * @param {Object} options - Formatting options
 * @returns {Object} Covenant return breakdown
 */
export const formatCovenantReturn = (totalAmount, returnPercentage = 50, options = {}) => {
  const total = toNumber(totalAmount);
  const returnRate = returnPercentage / 100;
  const returnAmount = total * returnRate;
  const netPayment = total - returnAmount;
  
  const { locale = DEFAULT_LOCALE } = options;
  
  return {
    total: formatNumber(total, { locale, minimumFractionDigits: 2 }),
    returnAmount: formatNumber(returnAmount, { locale, minimumFractionDigits: 2 }),
    netPayment: formatNumber(netPayment, { locale, minimumFractionDigits: 2 }),
    returnPercentage: formatPercentageRaw(returnPercentage, { locale, decimals: 0 }),
    values: {
      total,
      returnAmount,
      netPayment
    }
  };
};

/**
 * Formats honor points for praise system
 * @param {number|string} points - Honor points amount
 * @param {Object} options - Formatting options
 * @returns {string} Formatted honor points
 */
export const formatHonorPoints = (points, options = {}) => {
  const num = toNumber(points);
  const { locale = DEFAULT_LOCALE, showLabel = true } = options;
  
  const formatted = num >= 10000 
    ? formatCompact(num, { locale, decimals: 1 })
    : formatInteger(num, { locale });
  
  if (!showLabel) return formatted;
  
  const labels = {
    'en-US': 'Honor',
    'ko-KR': '명예',
    'sw-KE': 'Heshima'
  };
  
  const normalizedLocale = normalizeLocale(locale);
  return `${formatted} ${labels[normalizedLocale] || 'Honor'}`;
};

// =============================================================================
// STATISTICAL FORMATTERS
// =============================================================================

/**
 * Formats a large number for statistics display
 * @param {number|string} value - Number to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted statistic
 */
export const formatStatistic = (value, options = {}) => {
  const num = toNumber(value);
  const { 
    locale = DEFAULT_LOCALE,
    alwaysCompact = false,
    threshold = 10000 
  } = options;
  
  if (alwaysCompact || num >= threshold) {
    return formatCompact(num, { locale, decimals: 1 });
  }
  
  return formatNumber(num, { locale });
};

/**
 * Formats a ratio (e.g., success rate)
 * @param {number|string} numerator - Top of ratio
 * @param {number|string} denominator - Bottom of ratio
 * @param {Object} options - Formatting options
 * @returns {Object} Formatted ratio data
 */
export const formatRatio = (numerator, denominator, options = {}) => {
  const num = toNumber(numerator);
  const denom = toNumber(denominator, 1);
  const { locale = DEFAULT_LOCALE, decimals = 1 } = options;
  
  const ratio = denom > 0 ? num / denom : 0;
  
  return {
    fraction: `${formatInteger(num, { locale })}:${formatInteger(denom, { locale })}`,
    decimal: formatDecimal(ratio, decimals, { locale }),
    percentage: formatPercentage(ratio / 100, { locale, decimals }),
    value: ratio
  };
};

/**
 * Formats an average value
 * @param {number|string} total - Total sum
 * @param {number|string} count - Number of items
 * @param {Object} options - Formatting options
 * @returns {string} Formatted average
 */
export const formatAverage = (total, count, options = {}) => {
  const totalNum = toNumber(total);
  const countNum = toNumber(count, 1);
  const { locale = DEFAULT_LOCALE, decimals = 1 } = options;
  
  const average = countNum > 0 ? totalNum / countNum : 0;
  return formatDecimal(average, decimals, { locale });
};

// =============================================================================
// RANGE AND BOUNDS
// =============================================================================

/**
 * Formats a number range
 * @param {number|string} min - Minimum value
 * @param {number|string} max - Maximum value
 * @param {Object} options - Formatting options
 * @returns {string} Formatted range
 */
export const formatRange = (min, max, options = {}) => {
  const minNum = toNumber(min);
  const maxNum = toNumber(max);
  const { locale = DEFAULT_LOCALE, separator = '–' } = options;
  
  const minStr = formatNumber(minNum, { locale });
  const maxStr = formatNumber(maxNum, { locale });
  
  return `${minStr}${separator}${maxStr}`;
};

/**
 * Formats a number with bounds indicator
 * @param {number|string} value - Current value
 * @param {number|string} min - Minimum bound
 * @param {number|string} max - Maximum bound
 * @param {Object} options - Formatting options
 * @returns {Object} Bounded value with metadata
 */
export const formatBounded = (value, min, max, options = {}) => {
  const num = toNumber(value);
  const minNum = toNumber(min);
  const maxNum = toNumber(max);
  const { locale = DEFAULT_LOCALE } = options;
  
  const clamped = clamp(num, minNum, maxNum);
  const percentage = maxNum > minNum 
    ? (clamped - minNum) / (maxNum - minNum) 
    : 0;
  
  return {
    value: formatNumber(num, { locale }),
    clamped: formatNumber(clamped, { locale }),
    min: formatNumber(minNum, { locale }),
    max: formatNumber(maxNum, { locale }),
    percentage: formatPercentage(percentage, { locale, decimals: 0 }),
    isAtMin: num <= minNum,
    isAtMax: num >= maxNum,
    isOverMin: num < minNum,
    isOverMax: num > maxNum
  };
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Constants
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  NUMBER_PATTERNS,
  MAGNITUDE_SUFFIXES,
  ORDINAL_SUFFIXES,
  XP_THRESHOLDS,
  
  // Helpers
  isValidNumber,
  toNumber,
  normalizeLocale,
  clamp,
  
  // Core formatters
  formatNumber,
  formatInteger,
  formatDecimal,
  formatCompact,
  
  // Percentage
  formatPercentage,
  formatPercentageRaw,
  formatProgress,
  
  // Ordinal
  formatOrdinal,
  
  // GPS Lab specific
  formatXP,
  formatXPGain,
  formatBaraka,
  formatBarakaChange,
  formatPSB,
  formatCheckpointProgress,
  formatMissionProgress,
  formatStageNumber,
  formatRank,
  formatCovenantReturn,
  formatHonorPoints,
  
  // Statistics
  formatStatistic,
  formatRatio,
  formatAverage,
  
  // Range and bounds
  formatRange,
  formatBounded
};