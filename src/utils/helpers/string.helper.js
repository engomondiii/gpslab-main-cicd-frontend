/**
 * GPS Lab Platform - String Helper Utilities
 * 
 * Comprehensive string manipulation utilities for the GPS Lab MMORPG educational platform.
 * Handles string operations, parsing, and text processing.
 * 
 * @module utils/helpers/string.helper
 * @version 1.0.0
 */

// =============================================================================
// TYPE CHECKING
// =============================================================================

/**
 * Checks if value is a string
 * @param {*} value - Value to check
 * @returns {boolean} True if string
 */
export const isString = (value) => typeof value === 'string';

/**
 * Checks if string is empty or whitespace only
 * @param {string} str - String to check
 * @returns {boolean} True if empty or whitespace
 */
export const isEmpty = (str) => {
  return !isString(str) || str.trim().length === 0;
};

/**
 * Checks if string is not empty
 * @param {string} str - String to check
 * @returns {boolean} True if not empty
 */
export const isNotEmpty = (str) => {
  return isString(str) && str.trim().length > 0;
};

/**
 * Checks if string is blank (null, undefined, or whitespace)
 * @param {*} value - Value to check
 * @returns {boolean} True if blank
 */
export const isBlank = (value) => {
  return value === null || value === undefined || (isString(value) && value.trim() === '');
};

/**
 * Safely converts value to string
 * @param {*} value - Value to convert
 * @param {string} fallback - Fallback value
 * @returns {string} String value
 */
export const toString = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  return String(value);
};

// =============================================================================
// BASIC OPERATIONS
// =============================================================================

/**
 * Trims whitespace from both ends
 * @param {string} str - String to trim
 * @returns {string} Trimmed string
 */
export const trim = (str) => {
  return toString(str).trim();
};

/**
 * Trims whitespace from start
 * @param {string} str - String to trim
 * @returns {string} Trimmed string
 */
export const trimStart = (str) => {
  return toString(str).trimStart();
};

/**
 * Trims whitespace from end
 * @param {string} str - String to trim
 * @returns {string} Trimmed string
 */
export const trimEnd = (str) => {
  return toString(str).trimEnd();
};

/**
 * Pads string at start
 * @param {string} str - String to pad
 * @param {number} length - Target length
 * @param {string} char - Padding character
 * @returns {string} Padded string
 */
export const padStart = (str, length, char = ' ') => {
  return toString(str).padStart(length, char);
};

/**
 * Pads string at end
 * @param {string} str - String to pad
 * @param {number} length - Target length
 * @param {string} char - Padding character
 * @returns {string} Padded string
 */
export const padEnd = (str, length, char = ' ') => {
  return toString(str).padEnd(length, char);
};

/**
 * Repeats string n times
 * @param {string} str - String to repeat
 * @param {number} count - Repeat count
 * @returns {string} Repeated string
 */
export const repeat = (str, count) => {
  return toString(str).repeat(Math.max(0, count));
};

/**
 * Reverses a string
 * @param {string} str - String to reverse
 * @returns {string} Reversed string
 */
export const reverse = (str) => {
  return toString(str).split('').reverse().join('');
};

// =============================================================================
// CASE CONVERSION
// =============================================================================

/**
 * Converts to lowercase
 * @param {string} str - Input string
 * @returns {string} Lowercase string
 */
export const toLowerCase = (str) => {
  return toString(str).toLowerCase();
};

/**
 * Converts to uppercase
 * @param {string} str - Input string
 * @returns {string} Uppercase string
 */
export const toUpperCase = (str) => {
  return toString(str).toUpperCase();
};

/**
 * Capitalizes first character
 * @param {string} str - Input string
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  const s = toString(str);
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

/**
 * Capitalizes first character only (preserves rest)
 * @param {string} str - Input string
 * @returns {string} String with first char uppercase
 */
export const capitalizeFirst = (str) => {
  const s = toString(str);
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * Converts to title case
 * @param {string} str - Input string
 * @returns {string} Title case string
 */
export const toTitleCase = (str) => {
  return toString(str)
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Converts to sentence case
 * @param {string} str - Input string
 * @returns {string} Sentence case string
 */
export const toSentenceCase = (str) => {
  return toString(str)
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
};

/**
 * Converts to camelCase
 * @param {string} str - Input string
 * @returns {string} camelCase string
 */
export const toCamelCase = (str) => {
  return toString(str)
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, c => c.toLowerCase());
};

/**
 * Converts to PascalCase
 * @param {string} str - Input string
 * @returns {string} PascalCase string
 */
export const toPascalCase = (str) => {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
};

/**
 * Converts to snake_case
 * @param {string} str - Input string
 * @returns {string} snake_case string
 */
export const toSnakeCase = (str) => {
  return toString(str)
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
};

/**
 * Converts to kebab-case
 * @param {string} str - Input string
 * @returns {string} kebab-case string
 */
export const toKebabCase = (str) => {
  return toString(str)
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

/**
 * Converts to CONSTANT_CASE
 * @param {string} str - Input string
 * @returns {string} CONSTANT_CASE string
 */
export const toConstantCase = (str) => {
  return toSnakeCase(str).toUpperCase();
};

// =============================================================================
// SEARCHING AND MATCHING
// =============================================================================

/**
 * Checks if string contains substring
 * @param {string} str - String to search in
 * @param {string} search - Substring to find
 * @param {boolean} caseSensitive - Case sensitive search
 * @returns {boolean} True if found
 */
export const contains = (str, search, caseSensitive = true) => {
  const s = toString(str);
  const q = toString(search);
  
  if (caseSensitive) {
    return s.includes(q);
  }
  return s.toLowerCase().includes(q.toLowerCase());
};

/**
 * Checks if string starts with prefix
 * @param {string} str - String to check
 * @param {string} prefix - Prefix to find
 * @param {boolean} caseSensitive - Case sensitive check
 * @returns {boolean} True if starts with
 */
export const startsWith = (str, prefix, caseSensitive = true) => {
  const s = toString(str);
  const p = toString(prefix);
  
  if (caseSensitive) {
    return s.startsWith(p);
  }
  return s.toLowerCase().startsWith(p.toLowerCase());
};

/**
 * Checks if string ends with suffix
 * @param {string} str - String to check
 * @param {string} suffix - Suffix to find
 * @param {boolean} caseSensitive - Case sensitive check
 * @returns {boolean} True if ends with
 */
export const endsWith = (str, suffix, caseSensitive = true) => {
  const s = toString(str);
  const x = toString(suffix);
  
  if (caseSensitive) {
    return s.endsWith(x);
  }
  return s.toLowerCase().endsWith(x.toLowerCase());
};

/**
 * Counts occurrences of substring
 * @param {string} str - String to search in
 * @param {string} search - Substring to count
 * @returns {number} Count of occurrences
 */
export const countOccurrences = (str, search) => {
  const s = toString(str);
  const q = toString(search);
  
  if (!q) return 0;
  
  return (s.match(new RegExp(escapeRegex(q), 'g')) || []).length;
};

/**
 * Finds all indices of substring
 * @param {string} str - String to search in
 * @param {string} search - Substring to find
 * @returns {number[]} Array of indices
 */
export const findAllIndices = (str, search) => {
  const s = toString(str);
  const q = toString(search);
  const indices = [];
  
  if (!q) return indices;
  
  let index = s.indexOf(q);
  while (index !== -1) {
    indices.push(index);
    index = s.indexOf(q, index + 1);
  }
  
  return indices;
};

// =============================================================================
// REPLACEMENT AND SPLITTING
// =============================================================================

/**
 * Replaces all occurrences of search with replacement
 * @param {string} str - Input string
 * @param {string} search - String to find
 * @param {string} replacement - Replacement string
 * @returns {string} Result string
 */
export const replaceAll = (str, search, replacement) => {
  return toString(str).split(search).join(replacement);
};

/**
 * Removes all occurrences of substring
 * @param {string} str - Input string
 * @param {string} remove - String to remove
 * @returns {string} Result string
 */
export const remove = (str, remove) => {
  return replaceAll(str, remove, '');
};

/**
 * Removes prefix from string
 * @param {string} str - Input string
 * @param {string} prefix - Prefix to remove
 * @returns {string} String without prefix
 */
export const removePrefix = (str, prefix) => {
  const s = toString(str);
  const p = toString(prefix);
  
  if (s.startsWith(p)) {
    return s.slice(p.length);
  }
  return s;
};

/**
 * Removes suffix from string
 * @param {string} str - Input string
 * @param {string} suffix - Suffix to remove
 * @returns {string} String without suffix
 */
export const removeSuffix = (str, suffix) => {
  const s = toString(str);
  const x = toString(suffix);
  
  if (s.endsWith(x)) {
    return s.slice(0, -x.length);
  }
  return s;
};

/**
 * Splits string by separator
 * @param {string} str - String to split
 * @param {string|RegExp} separator - Split separator
 * @param {number} limit - Maximum splits
 * @returns {string[]} Split parts
 */
export const split = (str, separator, limit) => {
  return toString(str).split(separator, limit);
};

/**
 * Splits string into words
 * @param {string} str - Input string
 * @returns {string[]} Array of words
 */
export const words = (str) => {
  return toString(str)
    .trim()
    .split(/\s+/)
    .filter(Boolean);
};

/**
 * Splits string into lines
 * @param {string} str - Input string
 * @returns {string[]} Array of lines
 */
export const lines = (str) => {
  return toString(str).split(/\r?\n/);
};

// =============================================================================
// TRUNCATION
// =============================================================================

/**
 * Truncates string to length with ellipsis
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @param {string} ellipsis - Ellipsis string
 * @returns {string} Truncated string
 */
export const truncate = (str, length, ellipsis = '...') => {
  const s = toString(str);
  
  if (s.length <= length) return s;
  
  return s.slice(0, length - ellipsis.length) + ellipsis;
};

/**
 * Truncates string at word boundary
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @param {string} ellipsis - Ellipsis string
 * @returns {string} Truncated string
 */
export const truncateWords = (str, length, ellipsis = '...') => {
  const s = toString(str);
  
  if (s.length <= length) return s;
  
  const truncated = s.slice(0, length - ellipsis.length);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > length * 0.5) {
    return truncated.slice(0, lastSpace) + ellipsis;
  }
  
  return truncated + ellipsis;
};

/**
 * Truncates from middle
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @param {string} separator - Middle separator
 * @returns {string} Truncated string
 */
export const truncateMiddle = (str, length, separator = '...') => {
  const s = toString(str);
  
  if (s.length <= length) return s;
  
  const sepLen = separator.length;
  const charsToShow = length - sepLen;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  
  return s.slice(0, frontChars) + separator + s.slice(-backChars);
};

// =============================================================================
// SANITIZATION
// =============================================================================

/**
 * Escapes HTML special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
export const escapeHtml = (str) => {
  const entities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  
  return toString(str).replace(/[&<>"']/g, char => entities[char]);
};

/**
 * Unescapes HTML entities
 * @param {string} str - String to unescape
 * @returns {string} Unescaped string
 */
export const unescapeHtml = (str) => {
  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
  };
  
  return toString(str).replace(/&(amp|lt|gt|quot|#39);/g, match => entities[match]);
};

/**
 * Escapes regex special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
export const escapeRegex = (str) => {
  return toString(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Strips HTML tags
 * @param {string} str - String with HTML
 * @returns {string} Plain text
 */
export const stripHtml = (str) => {
  return toString(str)
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
};

/**
 * Normalizes whitespace
 * @param {string} str - Input string
 * @returns {string} Normalized string
 */
export const normalizeWhitespace = (str) => {
  return toString(str).replace(/\s+/g, ' ').trim();
};

/**
 * Removes non-printable characters
 * @param {string} str - Input string
 * @returns {string} Cleaned string
 */
export const removeNonPrintable = (str) => {
  return toString(str).replace(/[\x00-\x1F\x7F]/g, '');
};

// =============================================================================
// SLUG AND URL
// =============================================================================

/**
 * Converts string to URL-safe slug
 * @param {string} str - Input string
 * @param {Object} options - Options
 * @returns {string} Slugified string
 */
export const slugify = (str, options = {}) => {
  const { separator = '-', lowercase = true } = options;
  
  let slug = toString(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/[\s_]+/g, separator)
    .replace(new RegExp(`${separator}+`, 'g'), separator)
    .replace(new RegExp(`^${separator}|${separator}$`, 'g'), '');
  
  return lowercase ? slug.toLowerCase() : slug;
};

/**
 * Converts slug back to readable text
 * @param {string} slug - Slug string
 * @param {string} separator - Separator used in slug
 * @returns {string} Readable text
 */
export const unslugify = (slug, separator = '-') => {
  return toTitleCase(toString(slug).replace(new RegExp(separator, 'g'), ' '));
};

/**
 * Generates a unique ID
 * @param {string} prefix - Optional prefix
 * @returns {string} Unique ID
 */
export const generateId = (prefix = '') => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
};

// =============================================================================
// PARSING
// =============================================================================

/**
 * Parses query string to object
 * @param {string} queryString - Query string
 * @returns {Object} Parsed parameters
 */
export const parseQueryString = (queryString) => {
  const str = toString(queryString).replace(/^\?/, '');
  if (!str) return {};
  
  return str.split('&').reduce((params, pair) => {
    const [key, value] = pair.split('=').map(decodeURIComponent);
    if (key) {
      params[key] = value || '';
    }
    return params;
  }, {});
};

/**
 * Builds query string from object
 * @param {Object} params - Parameters object
 * @returns {string} Query string
 */
export const buildQueryString = (params) => {
  if (!params || typeof params !== 'object') return '';
  
  const pairs = Object.entries(params)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  
  return pairs.length > 0 ? `?${pairs.join('&')}` : '';
};

/**
 * Extracts numbers from string
 * @param {string} str - Input string
 * @returns {number[]} Array of numbers
 */
export const extractNumbers = (str) => {
  const matches = toString(str).match(/-?\d+\.?\d*/g);
  return matches ? matches.map(Number) : [];
};

/**
 * Extracts emails from string
 * @param {string} str - Input string
 * @returns {string[]} Array of emails
 */
export const extractEmails = (str) => {
  const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  return toString(str).match(regex) || [];
};

/**
 * Extracts URLs from string
 * @param {string} str - Input string
 * @returns {string[]} Array of URLs
 */
export const extractUrls = (str) => {
  const regex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g;
  return toString(str).match(regex) || [];
};

// =============================================================================
// GPS LAB SPECIFIC HELPERS
// =============================================================================

/**
 * Formats mission ID from components
 * @param {number} stage - Stage number
 * @param {number} mission - Mission number
 * @param {number} bite - Bite number (optional)
 * @returns {string} Mission ID (e.g., "S1M2B3")
 */
export const formatMissionId = (stage, mission, bite = null) => {
  let id = `S${stage}M${mission}`;
  if (bite !== null) {
    id += `B${bite}`;
  }
  return id;
};

/**
 * Parses mission ID into components
 * @param {string} missionId - Mission ID string
 * @returns {Object|null} Parsed components or null
 */
export const parseMissionId = (missionId) => {
  const match = toString(missionId).match(/^S(\d+)M(\d+)(?:B(\d+))?$/i);
  if (!match) return null;
  
  return {
    stage: parseInt(match[1], 10),
    mission: parseInt(match[2], 10),
    bite: match[3] ? parseInt(match[3], 10) : null
  };
};

/**
 * Masks sensitive information
 * @param {string} str - String to mask
 * @param {number} visibleStart - Visible chars at start
 * @param {number} visibleEnd - Visible chars at end
 * @param {string} maskChar - Masking character
 * @returns {string} Masked string
 */
export const mask = (str, visibleStart = 2, visibleEnd = 2, maskChar = '*') => {
  const s = toString(str);
  
  if (s.length <= visibleStart + visibleEnd) {
    return s;
  }
  
  const start = s.slice(0, visibleStart);
  const end = s.slice(-visibleEnd);
  const masked = maskChar.repeat(Math.min(s.length - visibleStart - visibleEnd, 8));
  
  return start + masked + end;
};

/**
 * Formats user mention
 * @param {string} username - Username
 * @returns {string} Formatted mention
 */
export const formatMention = (username) => {
  return `@${toString(username).replace(/^@/, '')}`;
};

/**
 * Extracts mentions from text
 * @param {string} str - Input string
 * @returns {string[]} Array of usernames
 */
export const extractMentions = (str) => {
  const matches = toString(str).match(/@[\w]+/g);
  return matches ? matches.map(m => m.slice(1)) : [];
};

/**
 * Formats hashtag
 * @param {string} tag - Tag text
 * @returns {string} Formatted hashtag
 */
export const formatHashtag = (tag) => {
  return `#${toString(tag).replace(/^#/, '').replace(/\s+/g, '')}`;
};

/**
 * Extracts hashtags from text
 * @param {string} str - Input string
 * @returns {string[]} Array of tags
 */
export const extractHashtags = (str) => {
  const matches = toString(str).match(/#[\w]+/g);
  return matches ? matches.map(m => m.slice(1)) : [];
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Type checking
  isString,
  isEmpty,
  isNotEmpty,
  isBlank,
  toString,
  
  // Basic operations
  trim,
  trimStart,
  trimEnd,
  padStart,
  padEnd,
  repeat,
  reverse,
  
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
  
  // Searching
  contains,
  startsWith,
  endsWith,
  countOccurrences,
  findAllIndices,
  
  // Replacement
  replaceAll,
  remove,
  removePrefix,
  removeSuffix,
  split,
  words,
  lines,
  
  // Truncation
  truncate,
  truncateWords,
  truncateMiddle,
  
  // Sanitization
  escapeHtml,
  unescapeHtml,
  escapeRegex,
  stripHtml,
  normalizeWhitespace,
  removeNonPrintable,
  
  // Slug and URL
  slugify,
  unslugify,
  generateId,
  
  // Parsing
  parseQueryString,
  buildQueryString,
  extractNumbers,
  extractEmails,
  extractUrls,
  
  // GPS Lab specific
  formatMissionId,
  parseMissionId,
  mask,
  formatMention,
  extractMentions,
  formatHashtag,
  extractHashtags
};