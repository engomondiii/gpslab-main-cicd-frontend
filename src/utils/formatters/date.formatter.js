/**
 * GPS Lab Platform - Date Formatter Utilities
 * 
 * Comprehensive date formatting functions for the GPS Lab MMORPG educational platform.
 * Supports multi-language formatting (EN, KO, SW) and various date/time display patterns.
 * 
 * @module utils/formatters/date.formatter
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
 * Month names by locale
 */
export const MONTH_NAMES = {
  'en-US': [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  'ko-KR': [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ],
  'sw-KE': [
    'Januari', 'Februari', 'Machi', 'Aprili', 'Mei', 'Juni',
    'Julai', 'Agosti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba'
  ]
};

/**
 * Short month names by locale
 */
export const MONTH_NAMES_SHORT = {
  'en-US': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  'ko-KR': ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  'sw-KE': ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ago', 'Sep', 'Okt', 'Nov', 'Des']
};

/**
 * Day names by locale
 */
export const DAY_NAMES = {
  'en-US': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  'ko-KR': ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  'sw-KE': ['Jumapili', 'Jumatatu', 'Jumanne', 'Jumatano', 'Alhamisi', 'Ijumaa', 'Jumamosi']
};

/**
 * Short day names by locale
 */
export const DAY_NAMES_SHORT = {
  'en-US': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  'ko-KR': ['일', '월', '화', '수', '목', '금', '토'],
  'sw-KE': ['Jpi', 'Jtt', 'Jnn', 'Jtn', 'Alh', 'Iju', 'Jms']
};

/**
 * Relative time labels by locale
 */
export const RELATIVE_TIME_LABELS = {
  'en-US': {
    justNow: 'Just now',
    minutesAgo: '{count} minute{plural} ago',
    hoursAgo: '{count} hour{plural} ago',
    daysAgo: '{count} day{plural} ago',
    weeksAgo: '{count} week{plural} ago',
    monthsAgo: '{count} month{plural} ago',
    yearsAgo: '{count} year{plural} ago',
    inMinutes: 'In {count} minute{plural}',
    inHours: 'In {count} hour{plural}',
    inDays: 'In {count} day{plural}',
    inWeeks: 'In {count} week{plural}',
    inMonths: 'In {count} month{plural}',
    inYears: 'In {count} year{plural}',
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow'
  },
  'ko-KR': {
    justNow: '방금 전',
    minutesAgo: '{count}분 전',
    hoursAgo: '{count}시간 전',
    daysAgo: '{count}일 전',
    weeksAgo: '{count}주 전',
    monthsAgo: '{count}개월 전',
    yearsAgo: '{count}년 전',
    inMinutes: '{count}분 후',
    inHours: '{count}시간 후',
    inDays: '{count}일 후',
    inWeeks: '{count}주 후',
    inMonths: '{count}개월 후',
    inYears: '{count}년 후',
    today: '오늘',
    yesterday: '어제',
    tomorrow: '내일'
  },
  'sw-KE': {
    justNow: 'Sasa hivi',
    minutesAgo: 'Dakika {count} zilizopita',
    hoursAgo: 'Saa {count} zilizopita',
    daysAgo: 'Siku {count} zilizopita',
    weeksAgo: 'Wiki {count} zilizopita',
    monthsAgo: 'Miezi {count} iliyopita',
    yearsAgo: 'Miaka {count} iliyopita',
    inMinutes: 'Katika dakika {count}',
    inHours: 'Katika saa {count}',
    inDays: 'Katika siku {count}',
    inWeeks: 'Katika wiki {count}',
    inMonths: 'Katika miezi {count}',
    inYears: 'Katika miaka {count}',
    today: 'Leo',
    yesterday: 'Jana',
    tomorrow: 'Kesho'
  }
};

/**
 * Time duration labels for mission/study tracking
 */
export const DURATION_LABELS = {
  'en-US': {
    seconds: '{count}s',
    minutes: '{count}m',
    hours: '{count}h',
    days: '{count}d',
    weeks: '{count}w',
    full: {
      seconds: '{count} second{plural}',
      minutes: '{count} minute{plural}',
      hours: '{count} hour{plural}',
      days: '{count} day{plural}',
      weeks: '{count} week{plural}'
    }
  },
  'ko-KR': {
    seconds: '{count}초',
    minutes: '{count}분',
    hours: '{count}시간',
    days: '{count}일',
    weeks: '{count}주',
    full: {
      seconds: '{count}초',
      minutes: '{count}분',
      hours: '{count}시간',
      days: '{count}일',
      weeks: '{count}주'
    }
  },
  'sw-KE': {
    seconds: '{count}s',
    minutes: '{count}dk',
    hours: '{count}sa',
    days: '{count}sk',
    weeks: '{count}wk',
    full: {
      seconds: 'Sekunde {count}',
      minutes: 'Dakika {count}',
      hours: 'Saa {count}',
      days: 'Siku {count}',
      weeks: 'Wiki {count}'
    }
  }
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Validates and normalizes a date input
 * @param {Date|string|number} date - Date to validate
 * @returns {Date|null} Valid Date object or null
 */
export const validateDate = (date) => {
  if (!date) return null;
  
  if (date instanceof Date) {
    return isNaN(date.getTime()) ? null : date;
  }
  
  const parsed = new Date(date);
  return isNaN(parsed.getTime()) ? null : parsed;
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
 * Pads a number with leading zeros
 * @param {number} num - Number to pad
 * @param {number} size - Desired string length
 * @returns {string} Padded number string
 */
export const padNumber = (num, size = 2) => {
  return String(num).padStart(size, '0');
};

/**
 * Gets plural suffix for English
 * @param {number} count - Count value
 * @returns {string} Plural suffix
 */
export const getPluralSuffix = (count) => {
  return count === 1 ? '' : 's';
};

// =============================================================================
// CORE FORMATTING FUNCTIONS
// =============================================================================

/**
 * Formats a date to a localized string
 * @param {Date|string|number} date - Date to format
 * @param {Object} options - Formatting options
 * @param {string} options.locale - Locale code (en, ko, sw)
 * @param {string} options.format - Format type: 'short', 'medium', 'long', 'full'
 * @param {boolean} options.includeTime - Include time in output
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  const validDate = validateDate(date);
  if (!validDate) return '';
  
  const {
    locale = DEFAULT_LOCALE,
    format = 'medium',
    includeTime = false
  } = options;
  
  const normalizedLocale = normalizeLocale(locale);
  
  const formatOptions = {
    short: { year: '2-digit', month: 'numeric', day: 'numeric' },
    medium: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  };
  
  const dateOptions = formatOptions[format] || formatOptions.medium;
  
  if (includeTime) {
    dateOptions.hour = '2-digit';
    dateOptions.minute = '2-digit';
  }
  
  try {
    return validDate.toLocaleDateString(normalizedLocale, dateOptions);
  } catch (error) {
    console.error('Date formatting error:', error);
    return validDate.toLocaleDateString(DEFAULT_LOCALE, dateOptions);
  }
};

/**
 * Formats time only
 * @param {Date|string|number} date - Date to format
 * @param {Object} options - Formatting options
 * @param {string} options.locale - Locale code
 * @param {boolean} options.includeSeconds - Include seconds
 * @param {boolean} options.use24Hour - Use 24-hour format
 * @returns {string} Formatted time string
 */
export const formatTime = (date, options = {}) => {
  const validDate = validateDate(date);
  if (!validDate) return '';
  
  const {
    locale = DEFAULT_LOCALE,
    includeSeconds = false,
    use24Hour = false
  } = options;
  
  const normalizedLocale = normalizeLocale(locale);
  
  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !use24Hour
  };
  
  if (includeSeconds) {
    timeOptions.second = '2-digit';
  }
  
  try {
    return validDate.toLocaleTimeString(normalizedLocale, timeOptions);
  } catch (error) {
    console.error('Time formatting error:', error);
    return validDate.toLocaleTimeString(DEFAULT_LOCALE, timeOptions);
  }
};

/**
 * Formats date and time together
 * @param {Date|string|number} date - Date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted datetime string
 */
export const formatDateTime = (date, options = {}) => {
  const validDate = validateDate(date);
  if (!validDate) return '';
  
  const dateStr = formatDate(validDate, { ...options, includeTime: false });
  const timeStr = formatTime(validDate, options);
  
  const locale = normalizeLocale(options.locale);
  
  // Different datetime separators by locale
  const separators = {
    'en-US': ' at ',
    'ko-KR': ' ',
    'sw-KE': ' saa '
  };
  
  return `${dateStr}${separators[locale] || ' '}${timeStr}`;
};

/**
 * Formats a date for ISO standard (API communication)
 * @param {Date|string|number} date - Date to format
 * @returns {string} ISO formatted date string
 */
export const formatISO = (date) => {
  const validDate = validateDate(date);
  if (!validDate) return '';
  
  return validDate.toISOString();
};

/**
 * Formats a date for URL-safe usage
 * @param {Date|string|number} date - Date to format
 * @returns {string} URL-safe date string (YYYY-MM-DD)
 */
export const formatDateForURL = (date) => {
  const validDate = validateDate(date);
  if (!validDate) return '';
  
  const year = validDate.getFullYear();
  const month = padNumber(validDate.getMonth() + 1);
  const day = padNumber(validDate.getDate());
  
  return `${year}-${month}-${day}`;
};

/**
 * Formats a date for database storage
 * @param {Date|string|number} date - Date to format
 * @returns {string} Database-compatible date string
 */
export const formatDateForDB = (date) => {
  return formatISO(date);
};

// =============================================================================
// RELATIVE TIME FORMATTING
// =============================================================================

/**
 * Formats a date as relative time (e.g., "2 hours ago")
 * @param {Date|string|number} date - Date to format
 * @param {Object} options - Formatting options
 * @param {string} options.locale - Locale code
 * @param {Date} options.relativeTo - Reference date (defaults to now)
 * @param {boolean} options.addSuffix - Add "ago" or "in" suffix
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date, options = {}) => {
  const validDate = validateDate(date);
  if (!validDate) return '';
  
  const {
    locale = DEFAULT_LOCALE,
    relativeTo = new Date(),
    addSuffix = true
  } = options;
  
  const normalizedLocale = normalizeLocale(locale);
  const labels = RELATIVE_TIME_LABELS[normalizedLocale] || RELATIVE_TIME_LABELS['en-US'];
  
  const relativeDate = validateDate(relativeTo) || new Date();
  const diffMs = validDate.getTime() - relativeDate.getTime();
  const diffSeconds = Math.floor(Math.abs(diffMs) / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  const isPast = diffMs < 0;
  
  // Format the label with count and plural
  const formatLabel = (template, count) => {
    return template
      .replace('{count}', count)
      .replace('{plural}', getPluralSuffix(count));
  };
  
  // Within 1 minute
  if (diffSeconds < 60) {
    return labels.justNow;
  }
  
  // Within 1 hour
  if (diffMinutes < 60) {
    const label = isPast ? labels.minutesAgo : labels.inMinutes;
    return formatLabel(label, diffMinutes);
  }
  
  // Within 1 day
  if (diffHours < 24) {
    const label = isPast ? labels.hoursAgo : labels.inHours;
    return formatLabel(label, diffHours);
  }
  
  // Check for today, yesterday, tomorrow
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(validDate);
  targetDate.setHours(0, 0, 0, 0);
  
  const dayDiff = Math.floor((targetDate - today) / (1000 * 60 * 60 * 24));
  
  if (dayDiff === 0) return labels.today;
  if (dayDiff === -1) return labels.yesterday;
  if (dayDiff === 1) return labels.tomorrow;
  
  // Within 1 week
  if (diffDays < 7) {
    const label = isPast ? labels.daysAgo : labels.inDays;
    return formatLabel(label, diffDays);
  }
  
  // Within 1 month
  if (diffWeeks < 4) {
    const label = isPast ? labels.weeksAgo : labels.inWeeks;
    return formatLabel(label, diffWeeks);
  }
  
  // Within 1 year
  if (diffMonths < 12) {
    const label = isPast ? labels.monthsAgo : labels.inMonths;
    return formatLabel(label, diffMonths);
  }
  
  // More than 1 year
  const label = isPast ? labels.yearsAgo : labels.inYears;
  return formatLabel(label, diffYears);
};

/**
 * Gets a human-readable date label (Today, Yesterday, or formatted date)
 * @param {Date|string|number} date - Date to format
 * @param {Object} options - Formatting options
 * @returns {string} Human-readable date label
 */
export const formatDateLabel = (date, options = {}) => {
  const validDate = validateDate(date);
  if (!validDate) return '';
  
  const locale = normalizeLocale(options.locale);
  const labels = RELATIVE_TIME_LABELS[locale] || RELATIVE_TIME_LABELS['en-US'];
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(validDate);
  targetDate.setHours(0, 0, 0, 0);
  
  const dayDiff = Math.floor((targetDate - today) / (1000 * 60 * 60 * 24));
  
  if (dayDiff === 0) return labels.today;
  if (dayDiff === -1) return labels.yesterday;
  if (dayDiff === 1) return labels.tomorrow;
  
  return formatDate(validDate, { ...options, format: 'medium' });
};

// =============================================================================
// DURATION FORMATTING (For Missions, Studies, Activities)
// =============================================================================

/**
 * Formats a duration in milliseconds to human-readable string
 * @param {number} milliseconds - Duration in milliseconds
 * @param {Object} options - Formatting options
 * @param {string} options.locale - Locale code
 * @param {boolean} options.verbose - Use full words instead of abbreviations
 * @param {number} options.maxUnits - Maximum number of time units to show
 * @returns {string} Formatted duration string
 */
export const formatDuration = (milliseconds, options = {}) => {
  if (typeof milliseconds !== 'number' || milliseconds < 0) return '';
  
  const {
    locale = DEFAULT_LOCALE,
    verbose = false,
    maxUnits = 2
  } = options;
  
  const normalizedLocale = normalizeLocale(locale);
  const labels = DURATION_LABELS[normalizedLocale] || DURATION_LABELS['en-US'];
  const labelSet = verbose ? labels.full : labels;
  
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  
  const parts = [];
  
  const formatPart = (template, count) => {
    return template
      .replace('{count}', count)
      .replace('{plural}', getPluralSuffix(count));
  };
  
  if (weeks > 0) {
    parts.push(formatPart(labelSet.weeks, weeks));
  }
  if (days % 7 > 0) {
    parts.push(formatPart(labelSet.days, days % 7));
  }
  if (hours % 24 > 0) {
    parts.push(formatPart(labelSet.hours, hours % 24));
  }
  if (minutes % 60 > 0) {
    parts.push(formatPart(labelSet.minutes, minutes % 60));
  }
  if (seconds % 60 > 0 || parts.length === 0) {
    parts.push(formatPart(labelSet.seconds, seconds % 60));
  }
  
  return parts.slice(0, maxUnits).join(' ');
};

/**
 * Formats duration from seconds
 * @param {number} seconds - Duration in seconds
 * @param {Object} options - Formatting options
 * @returns {string} Formatted duration string
 */
export const formatDurationFromSeconds = (seconds, options = {}) => {
  return formatDuration(seconds * 1000, options);
};

/**
 * Formats duration from minutes
 * @param {number} minutes - Duration in minutes
 * @param {Object} options - Formatting options
 * @returns {string} Formatted duration string
 */
export const formatDurationFromMinutes = (minutes, options = {}) => {
  return formatDuration(minutes * 60 * 1000, options);
};

/**
 * Formats a time span for mission/bite tracking (e.g., "10-15 min")
 * @param {number} minMinutes - Minimum minutes
 * @param {number} maxMinutes - Maximum minutes
 * @param {Object} options - Formatting options
 * @returns {string} Formatted time span
 */
export const formatTimeSpan = (minMinutes, maxMinutes, options = {}) => {
  const locale = normalizeLocale(options.locale);
  const labels = DURATION_LABELS[locale] || DURATION_LABELS['en-US'];
  
  const minStr = minMinutes.toString();
  const maxStr = maxMinutes.toString();
  const unit = labels.minutes.replace('{count}', '').trim();
  
  return `${minStr}-${maxStr} ${unit}`;
};

// =============================================================================
// GPS LAB SPECIFIC FORMATTERS
// =============================================================================

/**
 * Formats a deadline for missions/bites with urgency indicator
 * @param {Date|string|number} deadline - Deadline date
 * @param {Object} options - Formatting options
 * @returns {Object} Formatted deadline with urgency info
 */
export const formatDeadline = (deadline, options = {}) => {
  const validDate = validateDate(deadline);
  if (!validDate) {
    return {
      text: '',
      urgency: 'none',
      isOverdue: false,
      isPast: false
    };
  }
  
  const now = new Date();
  const diffMs = validDate.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffHours / 24;
  
  const isOverdue = diffMs < 0;
  const isPast = isOverdue;
  
  let urgency = 'normal';
  if (isOverdue) {
    urgency = 'overdue';
  } else if (diffHours <= 2) {
    urgency = 'critical';
  } else if (diffHours <= 24) {
    urgency = 'urgent';
  } else if (diffDays <= 3) {
    urgency = 'warning';
  }
  
  return {
    text: formatRelativeTime(validDate, options),
    formatted: formatDateTime(validDate, options),
    urgency,
    isOverdue,
    isPast,
    hoursRemaining: Math.max(0, Math.floor(diffHours)),
    daysRemaining: Math.max(0, Math.floor(diffDays))
  };
};

/**
 * Formats study time for study loop tracking
 * @param {number} totalMinutes - Total minutes studied
 * @param {Object} options - Formatting options
 * @returns {string} Formatted study time
 */
export const formatStudyTime = (totalMinutes, options = {}) => {
  if (typeof totalMinutes !== 'number' || totalMinutes < 0) return '';
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  const locale = normalizeLocale(options.locale);
  const labels = DURATION_LABELS[locale] || DURATION_LABELS['en-US'];
  
  if (hours === 0) {
    return labels.minutes.replace('{count}', minutes).replace('{plural}', getPluralSuffix(minutes));
  }
  
  const hourStr = labels.hours.replace('{count}', hours).replace('{plural}', getPluralSuffix(hours));
  
  if (minutes === 0) {
    return hourStr;
  }
  
  const minStr = labels.minutes.replace('{count}', minutes).replace('{plural}', getPluralSuffix(minutes));
  return `${hourStr} ${minStr}`;
};

/**
 * Formats pR2R (Provisional Right to Retry) expiration countdown
 * @param {Date|string|number} expirationDate - pR2R expiration date
 * @param {Object} options - Formatting options
 * @returns {Object} Formatted expiration info
 */
export const formatPR2RExpiration = (expirationDate, options = {}) => {
  const validDate = validateDate(expirationDate);
  if (!validDate) {
    return {
      text: '',
      isExpired: true,
      daysRemaining: 0,
      hoursRemaining: 0
    };
  }
  
  const now = new Date();
  const diffMs = validDate.getTime() - now.getTime();
  const isExpired = diffMs <= 0;
  
  const daysRemaining = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  const hoursRemaining = Math.max(0, Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  
  const locale = normalizeLocale(options.locale);
  const labels = RELATIVE_TIME_LABELS[locale] || RELATIVE_TIME_LABELS['en-US'];
  
  let text;
  if (isExpired) {
    text = locale === 'ko-KR' ? '만료됨' : locale === 'sw-KE' ? 'Imeisha' : 'Expired';
  } else if (daysRemaining > 0) {
    text = labels.inDays.replace('{count}', daysRemaining).replace('{plural}', getPluralSuffix(daysRemaining));
  } else {
    text = labels.inHours.replace('{count}', hoursRemaining).replace('{plural}', getPluralSuffix(hoursRemaining));
  }
  
  return {
    text,
    formatted: formatDateTime(validDate, options),
    isExpired,
    daysRemaining,
    hoursRemaining,
    totalHoursRemaining: Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)))
  };
};

/**
 * Formats a subscription period display
 * @param {Date|string|number} startDate - Subscription start date
 * @param {Date|string|number} endDate - Subscription end date
 * @param {Object} options - Formatting options
 * @returns {string} Formatted subscription period
 */
export const formatSubscriptionPeriod = (startDate, endDate, options = {}) => {
  const start = validateDate(startDate);
  const end = validateDate(endDate);
  
  if (!start || !end) return '';
  
  const startStr = formatDate(start, { ...options, format: 'short' });
  const endStr = formatDate(end, { ...options, format: 'short' });
  
  return `${startStr} - ${endStr}`;
};

/**
 * Formats an adventure/stage completion date for portfolio
 * @param {Date|string|number} completionDate - Completion date
 * @param {Object} options - Formatting options
 * @returns {string} Formatted completion date
 */
export const formatCompletionDate = (completionDate, options = {}) => {
  const validDate = validateDate(completionDate);
  if (!validDate) return '';
  
  return formatDate(validDate, { ...options, format: 'long' });
};

// =============================================================================
// CALENDAR & SCHEDULING UTILITIES
// =============================================================================

/**
 * Gets the start of a day
 * @param {Date|string|number} date - Input date
 * @returns {Date} Start of the day
 */
export const getStartOfDay = (date) => {
  const validDate = validateDate(date);
  if (!validDate) return null;
  
  const result = new Date(validDate);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Gets the end of a day
 * @param {Date|string|number} date - Input date
 * @returns {Date} End of the day
 */
export const getEndOfDay = (date) => {
  const validDate = validateDate(date);
  if (!validDate) return null;
  
  const result = new Date(validDate);
  result.setHours(23, 59, 59, 999);
  return result;
};

/**
 * Gets the start of a week
 * @param {Date|string|number} date - Input date
 * @param {number} weekStartsOn - Day week starts on (0 = Sunday, 1 = Monday)
 * @returns {Date} Start of the week
 */
export const getStartOfWeek = (date, weekStartsOn = 0) => {
  const validDate = validateDate(date);
  if (!validDate) return null;
  
  const result = new Date(validDate);
  const day = result.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  
  result.setDate(result.getDate() - diff);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Gets the start of a month
 * @param {Date|string|number} date - Input date
 * @returns {Date} Start of the month
 */
export const getStartOfMonth = (date) => {
  const validDate = validateDate(date);
  if (!validDate) return null;
  
  return new Date(validDate.getFullYear(), validDate.getMonth(), 1, 0, 0, 0, 0);
};

/**
 * Checks if two dates are the same day
 * @param {Date|string|number} date1 - First date
 * @param {Date|string|number} date2 - Second date
 * @returns {boolean} True if same day
 */
export const isSameDay = (date1, date2) => {
  const d1 = validateDate(date1);
  const d2 = validateDate(date2);
  
  if (!d1 || !d2) return false;
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

/**
 * Adds days to a date
 * @param {Date|string|number} date - Input date
 * @param {number} days - Number of days to add
 * @returns {Date} New date
 */
export const addDays = (date, days) => {
  const validDate = validateDate(date);
  if (!validDate) return null;
  
  const result = new Date(validDate);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Gets the difference between two dates in days
 * @param {Date|string|number} date1 - First date
 * @param {Date|string|number} date2 - Second date
 * @returns {number} Difference in days
 */
export const getDaysDifference = (date1, date2) => {
  const d1 = validateDate(date1);
  const d2 = validateDate(date2);
  
  if (!d1 || !d2) return 0;
  
  const diffMs = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Constants
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  MONTH_NAMES,
  MONTH_NAMES_SHORT,
  DAY_NAMES,
  DAY_NAMES_SHORT,
  RELATIVE_TIME_LABELS,
  DURATION_LABELS,
  
  // Helpers
  validateDate,
  normalizeLocale,
  padNumber,
  getPluralSuffix,
  
  // Core formatters
  formatDate,
  formatTime,
  formatDateTime,
  formatISO,
  formatDateForURL,
  formatDateForDB,
  
  // Relative time
  formatRelativeTime,
  formatDateLabel,
  
  // Duration
  formatDuration,
  formatDurationFromSeconds,
  formatDurationFromMinutes,
  formatTimeSpan,
  
  // GPS Lab specific
  formatDeadline,
  formatStudyTime,
  formatPR2RExpiration,
  formatSubscriptionPeriod,
  formatCompletionDate,
  
  // Calendar utilities
  getStartOfDay,
  getEndOfDay,
  getStartOfWeek,
  getStartOfMonth,
  isSameDay,
  addDays,
  getDaysDifference
};