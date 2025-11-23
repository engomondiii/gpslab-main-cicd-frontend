/* ============================================
   GPS LAB - Text Formatter
   Text manipulation and formatting utilities
   ============================================ */

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated text
 */
export const truncate = (text, maxLength = 100, suffix = '...') => {
  if (!text || text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength).trim() + suffix;
};

/**
 * Truncate text by words
 * @param {string} text - Text to truncate
 * @param {number} maxWords - Maximum number of words
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated text
 */
export const truncateWords = (text, maxWords = 20, suffix = '...') => {
  if (!text) {
    return '';
  }

  const words = text.trim().split(/\s+/);

  if (words.length <= maxWords) {
    return text;
  }

  return words.slice(0, maxWords).join(' ') + suffix;
};

/**
 * Convert text to title case
 * @param {string} text - Text to convert
 * @returns {string} Title case text
 */
export const toTitleCase = (text) => {
  if (!text) {
    return '';
  }

  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Convert text to sentence case
 * @param {string} text - Text to convert
 * @returns {string} Sentence case text
 */
export const toSentenceCase = (text) => {
  if (!text) {
    return '';
  }

  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Convert text to slug (URL-friendly)
 * @param {string} text - Text to convert
 * @returns {string} Slug
 */
export const slugify = (text) => {
  if (!text) {
    return '';
  }

  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

/**
 * Convert slug to title
 * @param {string} slug - Slug to convert
 * @returns {string} Title
 */
export const unslugify = (slug) => {
  if (!slug) {
    return '';
  }

  return slug
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Capitalize first letter
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export const capitalize = (text) => {
  if (!text) {
    return '';
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Generate initials from name
 * @param {string} name - Full name
 * @param {number} maxLetters - Maximum number of letters (default: 2)
 * @returns {string} Initials
 */
export const getInitials = (name, maxLetters = 2) => {
  if (!name) {
    return '';
  }

  const words = name.trim().split(/\s+/);
  const initials = words
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, maxLetters)
    .join('');

  return initials;
};

/**
 * Pluralize word
 * @param {string} word - Word to pluralize
 * @param {number} count - Count to determine plural
 * @param {string} suffix - Plural suffix (default: 's')
 * @returns {string} Pluralized word
 */
export const pluralize = (word, count, suffix = 's') => {
  if (!word) {
    return '';
  }

  return count === 1 ? word : word + suffix;
};

/**
 * Strip HTML tags from text
 * @param {string} html - HTML string
 * @returns {string} Plain text
 */
export const stripHtml = (html) => {
  if (!html) {
    return '';
  }

  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export const escapeHtml = (text) => {
  if (!text) {
    return '';
  }

  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return text.replace(/[&<>"']/g, m => map[m]);
};

/**
 * Unescape HTML special characters
 * @param {string} text - Text to unescape
 * @returns {string} Unescaped text
 */
export const unescapeHtml = (text) => {
  if (!text) {
    return '';
  }

  const map = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
  };

  return text.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, m => map[m]);
};

/**
 * Highlight search term in text
 * @param {string} text - Text to search in
 * @param {string} searchTerm - Term to highlight
 * @returns {string} Text with highlighted term
 */
export const highlightText = (text, searchTerm) => {
  if (!text || !searchTerm) {
    return text;
  }

  const regex = new RegExp(`(${escapeRegex(searchTerm)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

/**
 * Escape regex special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export const escapeRegex = (text) => {
  if (!text) {
    return '';
  }

  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Word count
 * @param {string} text - Text to count words in
 * @returns {number} Word count
 */
export const wordCount = (text) => {
  if (!text) {
    return 0;
  }

  return text.trim().split(/\s+/).length;
};

/**
 * Reading time estimate
 * @param {string} text - Text to estimate reading time
 * @param {number} wordsPerMinute - Average reading speed (default: 200)
 * @returns {number} Estimated reading time in minutes
 */
export const readingTime = (text, wordsPerMinute = 200) => {
  const words = wordCount(text);
  return Math.ceil(words / wordsPerMinute);
};

/**
 * Mask sensitive information
 * @param {string} text - Text to mask
 * @param {number} visibleStart - Number of characters visible at start
 * @param {number} visibleEnd - Number of characters visible at end
 * @param {string} maskChar - Character to use for masking (default: '*')
 * @returns {string} Masked text
 */
export const maskText = (text, visibleStart = 4, visibleEnd = 4, maskChar = '*') => {
  if (!text || text.length <= visibleStart + visibleEnd) {
    return text;
  }

  const start = text.substring(0, visibleStart);
  const end = text.substring(text.length - visibleEnd);
  const masked = maskChar.repeat(text.length - visibleStart - visibleEnd);

  return start + masked + end;
};

export default {
  truncate,
  truncateWords,
  toTitleCase,
  toSentenceCase,
  slugify,
  unslugify,
  capitalize,
  getInitials,
  pluralize,
  stripHtml,
  escapeHtml,
  unescapeHtml,
  highlightText,
  escapeRegex,
  wordCount,
  readingTime,
  maskText,
};