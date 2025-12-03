/**
 * GPS Lab Platform - Formatters Index
 * 
 * Central export file for all formatting utilities.
 * Import formatters from this file for convenience.
 * 
 * @module utils/formatters
 * @version 1.0.0
 */

// =============================================================================
// DATE FORMATTER
// =============================================================================
export {
  // Constants
  SUPPORTED_LOCALES as DATE_LOCALES,
  DEFAULT_LOCALE as DATE_DEFAULT_LOCALE,
  DATE_FORMATS,
  TIME_FORMATS,
  RELATIVE_TIME_THRESHOLDS,
  
  // Core formatters
  formatDate,
  formatTime,
  formatDateTime,
  formatISO,
  formatDateForURL,
  
  // Relative time
  formatRelativeTime,
  
  // Duration
  formatDuration,
  formatDurationFromSeconds,
  formatTimeSpan,
  
  // GPS Lab specific
  formatDeadline,
  formatStudyTime,
  formatPR2RExpiration,
  formatSubscriptionPeriod,
  formatCompletionDate,
  
  // Calendar utilities
  getStartOfDay,
  getStartOfWeek,
  getStartOfMonth,
  isSameDay,
  addDays,
  getDaysDifference
} from './date.formatter.js';

// =============================================================================
// NUMBER FORMATTER
// =============================================================================
export {
  // Constants
  SUPPORTED_LOCALES as NUMBER_LOCALES,
  DEFAULT_LOCALE as NUMBER_DEFAULT_LOCALE,
  XP_THRESHOLDS,
  BARAKA_TIERS,
  BEACON_COLORS,
  ADVENTURE_STAGES,
  
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
  
  // XP
  formatXP,
  formatXPGain,
  
  // Baraka
  formatBaraka,
  formatBarakaChange,
  formatBarakaBalance,
  getBarakaTier,
  
  // PSB
  formatPSB,
  
  // Progress
  formatCheckpointProgress,
  formatMissionProgress,
  
  // Stage
  formatStageNumber,
  getAdventureForStage,
  getBeaconColor,
  
  // Leaderboard
  formatRank,
  
  // Covenant
  formatCovenantReturn,
  
  // Honor
  formatHonorPoints,
  
  // Statistics
  formatStatistic,
  formatRatio,
  formatAverage,
  
  // Range
  formatRange,
  formatBounded
} from './number.formatter.js';

// =============================================================================
// CURRENCY FORMATTER
// =============================================================================
export {
  // Constants
  CURRENCIES,
  SUBSCRIPTION_TIERS,
  ADVENTURE_PRICING,
  PSB_ISSUANCE_CAPS,
  BARAKA_ISSUANCE,
  COVENANT_RETURN_RATE,
  
  // Fiat currency
  formatFiatCurrency,
  formatUSD,
  formatKRW,
  formatKES,
  
  // Baraka (currency module version)
  formatBaraka as formatBarakaCurrency,
  formatBarakaChange as formatBarakaChangeCurrency,
  formatBarakaBalance as formatBarakaBalanceCurrency,
  getBarakaTier as getBarakaTierCurrency,
  
  // PSB (currency module version)
  formatPSB as formatPSBCurrency,
  formatPSBIssuanceCap,
  
  // Covenant economy
  formatCovenantReturn as formatCovenantReturnCurrency,
  formatSubscriptionTier,
  formatAdventurePricing,
  formatBarakaIssuance,
  
  // Conversion
  convertCurrency,
  
  // Utilities
  parseCurrencyString,
  validateCurrencyAmount
} from './currency.formatter.js';

// =============================================================================
// TEXT FORMATTER
// =============================================================================
export {
  // Constants
  SUPPORTED_LOCALES as TEXT_LOCALES,
  DEFAULT_LOCALE as TEXT_DEFAULT_LOCALE,
  PRESERVED_ABBREVIATIONS,
  LOWERCASE_WORDS_EN,
  PRAISE_TEMPLATES,
  PRAISE_STYLES,
  
  // Helpers
  isValidString,
  toString,
  normalizeLocale,
  
  // Case conversion
  toLowerCase,
  toUpperCase,
  capitalize,
  capitalizeFirst,
  toTitleCase,
  toSentenceCase,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  toConstantCase,
  
  // Truncation
  truncate,
  truncateMiddle,
  truncateWords,
  
  // Slug and URL
  slugify,
  generateSlugId,
  getInitials,
  
  // Cleaning
  normalizeWhitespace,
  stripHtml,
  escapeHtml,
  removeSpecialChars,
  escapeRegex,
  
  // Search
  highlightText,
  containsText,
  
  // GPS Lab specific
  formatMissionTitle,
  formatBiteTitle,
  formatCheckpointText,
  generatePraise,
  formatDisplayName,
  formatAdventureName,
  formatProblemStatement,
  
  // Pluralization
  pluralize,
  pluralizeGPS
} from './text.formatter.js';

// =============================================================================
// DEFAULT EXPORTS (Namespaced)
// =============================================================================
import dateFormatter from './date.formatter.js';
import numberFormatter from './number.formatter.js';
import currencyFormatter from './currency.formatter.js';
import textFormatter from './text.formatter.js';

export {
  dateFormatter,
  numberFormatter,
  currencyFormatter,
  textFormatter
};

/**
 * Combined formatters object for convenience
 */
export default {
  date: dateFormatter,
  number: numberFormatter,
  currency: currencyFormatter,
  text: textFormatter
};