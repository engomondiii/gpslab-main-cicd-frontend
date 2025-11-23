/* ============================================
   GPS LAB - String Helper
   String manipulation utilities
   ============================================ */

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Title case string
 */
export const capitalizeWords = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

/**
 * Convert string to camelCase
 * @param {string} str - String to convert
 * @returns {string} camelCase string
 */
export const toCamelCase = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
};

/**
 * Convert string to PascalCase
 * @param {string} str - String to convert
 * @returns {string} PascalCase string
 */
export const toPascalCase = (str) => {
  if (!str || typeof str !== 'string') return '';
  const camelCase = toCamelCase(str);
  return capitalize(camelCase);
};

/**
 * Convert string to snake_case
 * @param {string} str - String to convert
 * @returns {string} snake_case string
 */
export const toSnakeCase = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join('_');
};

/**
 * Convert string to kebab-case
 * @param {string} str - String to convert
 * @returns {string} kebab-case string
 */
export const toKebabCase = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join('-');
};

/**
 * Pluralize word based on count
 * @param {string} word - Word to pluralize
 * @param {number} count - Count to determine plural
 * @param {string} suffix - Plural suffix (default: 's')
 * @returns {string} Pluralized word
 */
export const pluralize = (word, count, suffix = 's') => {
  if (!word) return '';
  return count === 1 ? word : word + suffix;
};

/**
 * Truncate string to specified length
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated string
 */
export const truncate = (str, length = 100, suffix = '...') => {
  if (!str || str.length <= length) return str;
  return str.substring(0, length).trim() + suffix;
};

/**
 * Remove extra whitespace
 * @param {string} str - String to clean
 * @returns {string} Cleaned string
 */
export const removeExtraWhitespace = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/\s+/g, ' ').trim();
};

/**
 * Reverse string
 * @param {string} str - String to reverse
 * @returns {string} Reversed string
 */
export const reverse = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.split('').reverse().join('');
};

/**
 * Check if string is palindrome
 * @param {string} str - String to check
 * @returns {boolean} True if palindrome
 */
export const isPalindrome = (str) => {
  if (!str || typeof str !== 'string') return false;
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === reverse(cleaned);
};

/**
 * Count occurrences of substring
 * @param {string} str - String to search in
 * @param {string} substring - Substring to count
 * @returns {number} Number of occurrences
 */
export const countOccurrences = (str, substring) => {
  if (!str || !substring) return 0;
  return (str.match(new RegExp(substring, 'g')) || []).length;
};

/**
 * Replace all occurrences
 * @param {string} str - String to search in
 * @param {string} search - String to search for
 * @param {string} replace - String to replace with
 * @returns {string} String with replacements
 */
export const replaceAll = (str, search, replace) => {
  if (!str || !search) return str;
  return str.split(search).join(replace);
};

/**
 * Generate random string
 * @param {number} length - Length of string
 * @param {string} charset - Character set to use
 * @returns {string} Random string
 */
export const generateRandomString = (length = 10, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
};

/**
 * Check if string contains only letters
 * @param {string} str - String to check
 * @returns {boolean} True if only letters
 */
export const isAlpha = (str) => {
  if (!str || typeof str !== 'string') return false;
  return /^[a-zA-Z]+$/.test(str);
};

/**
 * Check if string contains only numbers
 * @param {string} str - String to check
 * @returns {boolean} True if only numbers
 */
export const isNumeric = (str) => {
  if (!str || typeof str !== 'string') return false;
  return /^[0-9]+$/.test(str);
};

/**
 * Check if string contains only alphanumeric characters
 * @param {string} str - String to check
 * @returns {boolean} True if only alphanumeric
 */
export const isAlphanumeric = (str) => {
  if (!str || typeof str !== 'string') return false;
  return /^[a-zA-Z0-9]+$/.test(str);
};

/**
 * Pad string to specified length
 * @param {string} str - String to pad
 * @param {number} length - Target length
 * @param {string} char - Character to pad with
 * @param {string} position - 'start' or 'end'
 * @returns {string} Padded string
 */
export const pad = (str, length, char = ' ', position = 'end') => {
  if (!str) str = '';
  const padding = char.repeat(Math.max(0, length - str.length));
  return position === 'start' ? padding + str : str + padding;
};

/**
 * Extract initials from name
 * @param {string} name - Full name
 * @param {number} maxLetters - Maximum number of initials
 * @returns {string} Initials
 */
export const getInitials = (name, maxLetters = 2) => {
  if (!name) return '';
  return name
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, maxLetters)
    .join('');
};

/**
 * Word count
 * @param {string} str - String to count words in
 * @returns {number} Word count
 */
export const wordCount = (str) => {
  if (!str || typeof str !== 'string') return 0;
  return str.trim().split(/\s+/).length;
};

/**
 * Character count (excluding spaces)
 * @param {string} str - String to count characters in
 * @returns {number} Character count
 */
export const charCount = (str) => {
  if (!str || typeof str !== 'string') return 0;
  return str.replace(/\s/g, '').length;
};

export default {
  capitalize,
  capitalizeWords,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  pluralize,
  truncate,
  removeExtraWhitespace,
  reverse,
  isPalindrome,
  countOccurrences,
  replaceAll,
  generateRandomString,
  isAlpha,
  isNumeric,
  isAlphanumeric,
  pad,
  getInitials,
  wordCount,
  charCount,
};