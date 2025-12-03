/**
 * GPS Lab Platform - Email Validator
 * 
 * Comprehensive email validation utilities for the GPS Lab MMORPG educational platform.
 * Handles email format validation, domain checking, and educational institution verification.
 * 
 * @module utils/validators/email.validator
 * @version 1.0.0
 */

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * RFC 5322 compliant email regex pattern
 * This pattern covers most valid email formats while being practical
 */
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Simpler email regex for basic validation
 */
export const EMAIL_REGEX_SIMPLE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Educational domain suffixes (global)
 */
export const EDUCATIONAL_DOMAINS = [
  // Generic educational TLDs
  '.edu',
  '.ac.',
  '.edu.',
  '.school.',
  '.university.',
  
  // Country-specific educational domains
  '.ac.uk',    // UK
  '.ac.kr',    // South Korea
  '.ac.ke',    // Kenya
  '.edu.au',   // Australia
  '.edu.cn',   // China
  '.edu.in',   // India
  '.edu.ng',   // Nigeria
  '.edu.za',   // South Africa
  '.edu.ph',   // Philippines
  '.edu.br',   // Brazil
  '.edu.mx',   // Mexico
  '.edu.co',   // Colombia
  '.edu.pe',   // Peru
  '.edu.ar',   // Argentina
  '.edu.eg',   // Egypt
  '.edu.my',   // Malaysia
  '.edu.sg',   // Singapore
  '.edu.hk',   // Hong Kong
  '.edu.tw',   // Taiwan
  '.edu.vn',   // Vietnam
  '.edu.pk',   // Pakistan
  '.edu.bd',   // Bangladesh
  '.edu.gh',   // Ghana
  '.edu.tz',   // Tanzania
  '.edu.ug',   // Uganda
  '.edu.rw',   // Rwanda
  '.edu.et',   // Ethiopia
  '.go.ke',    // Kenya government (some schools)
  
  // Other educational patterns
  '.k12.',     // US K-12 schools
  '.sch.',     // Schools
];

/**
 * Known free/disposable email domains to flag
 */
export const FREE_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'aol.com',
  'mail.com',
  'protonmail.com',
  'icloud.com',
  'yandex.com',
  'zoho.com',
  'gmx.com',
  'msn.com',
  'qq.com',
  'naver.com',
  'daum.net',
  'hanmail.net'
];

/**
 * Known disposable email domains to reject
 */
export const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com',
  'temp-mail.org',
  'guerrillamail.com',
  'mailinator.com',
  '10minutemail.com',
  'throwaway.email',
  'fakeinbox.com',
  'sharklasers.com',
  'trashmail.com',
  'maildrop.cc',
  'getairmail.com',
  'dispostable.com',
  'yopmail.com',
  'mohmal.com',
  'getnada.com',
  'tempail.com',
  'emailondeck.com',
  'mintemail.com',
  'burnermail.io'
];

/**
 * Validation error messages by locale
 */
export const EMAIL_ERROR_MESSAGES = {
  required: {
    'en-US': 'Email address is required',
    'ko-KR': '이메일 주소를 입력해주세요',
    'sw-KE': 'Barua pepe inahitajika'
  },
  invalid: {
    'en-US': 'Please enter a valid email address',
    'ko-KR': '올바른 이메일 주소를 입력해주세요',
    'sw-KE': 'Tafadhali ingiza barua pepe sahihi'
  },
  tooLong: {
    'en-US': 'Email address is too long',
    'ko-KR': '이메일 주소가 너무 깁니다',
    'sw-KE': 'Barua pepe ni ndefu sana'
  },
  disposable: {
    'en-US': 'Disposable email addresses are not allowed',
    'ko-KR': '일회용 이메일 주소는 사용할 수 없습니다',
    'sw-KE': 'Barua pepe za muda haziruhusiwi'
  },
  invalidDomain: {
    'en-US': 'Email domain is not valid',
    'ko-KR': '이메일 도메인이 유효하지 않습니다',
    'sw-KE': 'Kikoa cha barua pepe si sahihi'
  },
  educationalRequired: {
    'en-US': 'Please use an educational email address (.edu)',
    'ko-KR': '교육기관 이메일 주소를 사용해주세요 (.ac.kr)',
    'sw-KE': 'Tafadhali tumia barua pepe ya elimu'
  }
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Extracts domain from email address
 * @param {string} email - Email address
 * @returns {string|null} Domain or null
 */
export const extractDomain = (email) => {
  if (!email || typeof email !== 'string') return null;
  
  const parts = email.toLowerCase().trim().split('@');
  return parts.length === 2 ? parts[1] : null;
};

/**
 * Extracts local part (before @) from email address
 * @param {string} email - Email address
 * @returns {string|null} Local part or null
 */
export const extractLocalPart = (email) => {
  if (!email || typeof email !== 'string') return null;
  
  const parts = email.toLowerCase().trim().split('@');
  return parts.length >= 1 ? parts[0] : null;
};

/**
 * Normalizes email address (lowercase, trim)
 * @param {string} email - Email address
 * @returns {string} Normalized email
 */
export const normalizeEmail = (email) => {
  if (!email || typeof email !== 'string') return '';
  return email.toLowerCase().trim();
};

/**
 * Gets error message for locale
 * @param {string} errorKey - Error key
 * @param {string} locale - Locale code
 * @returns {string} Error message
 */
const getErrorMessage = (errorKey, locale = 'en-US') => {
  const messages = EMAIL_ERROR_MESSAGES[errorKey];
  if (!messages) return 'Invalid email';
  
  const normalizedLocale = locale.includes('ko') ? 'ko-KR' : 
                           locale.includes('sw') ? 'sw-KE' : 'en-US';
  
  return messages[normalizedLocale] || messages['en-US'];
};

// =============================================================================
// CORE VALIDATION FUNCTIONS
// =============================================================================

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @param {Object} options - Validation options
 * @param {boolean} options.strict - Use strict RFC 5322 validation
 * @returns {boolean} True if valid format
 */
export const isValidEmailFormat = (email, options = {}) => {
  if (!email || typeof email !== 'string') return false;
  
  const normalized = normalizeEmail(email);
  const { strict = false } = options;
  
  // Check length constraints
  if (normalized.length < 5 || normalized.length > 254) return false;
  
  // Check local part length (before @)
  const localPart = extractLocalPart(normalized);
  if (!localPart || localPart.length > 64) return false;
  
  // Use appropriate regex
  const regex = strict ? EMAIL_REGEX : EMAIL_REGEX_SIMPLE;
  return regex.test(normalized);
};

/**
 * Checks if email domain is valid
 * @param {string} email - Email address
 * @returns {boolean} True if domain appears valid
 */
export const hasValidDomain = (email) => {
  const domain = extractDomain(email);
  if (!domain) return false;
  
  // Check domain has at least one dot
  if (!domain.includes('.')) return false;
  
  // Check domain doesn't start or end with dot or hyphen
  if (/^[.-]|[.-]$/.test(domain)) return false;
  
  // Check TLD is at least 2 characters
  const tld = domain.split('.').pop();
  if (!tld || tld.length < 2) return false;
  
  return true;
};

/**
 * Checks if email is from an educational institution
 * @param {string} email - Email address
 * @returns {boolean} True if educational email
 */
export const isEducationalEmail = (email) => {
  const domain = extractDomain(email);
  if (!domain) return false;
  
  return EDUCATIONAL_DOMAINS.some(eduDomain => 
    domain.includes(eduDomain) || domain.endsWith(eduDomain)
  );
};

/**
 * Checks if email is from a free email provider
 * @param {string} email - Email address
 * @returns {boolean} True if free email
 */
export const isFreeEmail = (email) => {
  const domain = extractDomain(email);
  if (!domain) return false;
  
  return FREE_EMAIL_DOMAINS.includes(domain);
};

/**
 * Checks if email is from a disposable email service
 * @param {string} email - Email address
 * @returns {boolean} True if disposable email
 */
export const isDisposableEmail = (email) => {
  const domain = extractDomain(email);
  if (!domain) return false;
  
  return DISPOSABLE_EMAIL_DOMAINS.includes(domain);
};

/**
 * Checks if email is potentially a corporate/organization email
 * @param {string} email - Email address
 * @returns {boolean} True if likely corporate email
 */
export const isCorporateEmail = (email) => {
  const domain = extractDomain(email);
  if (!domain) return false;
  
  // Not a free email provider
  if (isFreeEmail(email)) return false;
  
  // Not disposable
  if (isDisposableEmail(email)) return false;
  
  // Not educational (has its own category)
  if (isEducationalEmail(email)) return false;
  
  return true;
};

// =============================================================================
// COMPREHENSIVE VALIDATION
// =============================================================================

/**
 * Comprehensive email validation result
 * @typedef {Object} EmailValidationResult
 * @property {boolean} isValid - Overall validity
 * @property {string|null} error - Error message if invalid
 * @property {string|null} errorKey - Error key for i18n
 * @property {string} normalized - Normalized email address
 * @property {string|null} domain - Email domain
 * @property {string|null} localPart - Local part of email
 * @property {Object} flags - Additional flags
 */

/**
 * Validates an email address comprehensively
 * @param {string} email - Email address to validate
 * @param {Object} options - Validation options
 * @param {boolean} options.required - Is email required
 * @param {boolean} options.strict - Use strict validation
 * @param {boolean} options.allowDisposable - Allow disposable emails
 * @param {boolean} options.requireEducational - Require educational email
 * @param {string} options.locale - Locale for error messages
 * @returns {EmailValidationResult} Validation result
 */
export const validateEmail = (email, options = {}) => {
  const {
    required = true,
    strict = false,
    allowDisposable = false,
    requireEducational = false,
    locale = 'en-US'
  } = options;
  
  const normalized = normalizeEmail(email);
  
  // Base result structure
  const result = {
    isValid: false,
    error: null,
    errorKey: null,
    normalized,
    domain: extractDomain(normalized),
    localPart: extractLocalPart(normalized),
    flags: {
      isEmpty: !normalized,
      isEducational: false,
      isFree: false,
      isDisposable: false,
      isCorporate: false
    }
  };
  
  // Check if empty
  if (!normalized) {
    if (required) {
      result.error = getErrorMessage('required', locale);
      result.errorKey = 'required';
    } else {
      result.isValid = true;
    }
    return result;
  }
  
  // Check length
  if (normalized.length > 254) {
    result.error = getErrorMessage('tooLong', locale);
    result.errorKey = 'tooLong';
    return result;
  }
  
  // Check format
  if (!isValidEmailFormat(normalized, { strict })) {
    result.error = getErrorMessage('invalid', locale);
    result.errorKey = 'invalid';
    return result;
  }
  
  // Check domain validity
  if (!hasValidDomain(normalized)) {
    result.error = getErrorMessage('invalidDomain', locale);
    result.errorKey = 'invalidDomain';
    return result;
  }
  
  // Set flags
  result.flags.isEducational = isEducationalEmail(normalized);
  result.flags.isFree = isFreeEmail(normalized);
  result.flags.isDisposable = isDisposableEmail(normalized);
  result.flags.isCorporate = isCorporateEmail(normalized);
  
  // Check disposable
  if (!allowDisposable && result.flags.isDisposable) {
    result.error = getErrorMessage('disposable', locale);
    result.errorKey = 'disposable';
    return result;
  }
  
  // Check educational requirement
  if (requireEducational && !result.flags.isEducational) {
    result.error = getErrorMessage('educationalRequired', locale);
    result.errorKey = 'educationalRequired';
    return result;
  }
  
  // All checks passed
  result.isValid = true;
  return result;
};

/**
 * Simple validation - returns boolean only
 * @param {string} email - Email address
 * @param {Object} options - Validation options
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email, options = {}) => {
  return validateEmail(email, options).isValid;
};

/**
 * Validates email and returns error message or null
 * @param {string} email - Email address
 * @param {Object} options - Validation options
 * @returns {string|null} Error message or null if valid
 */
export const getEmailError = (email, options = {}) => {
  return validateEmail(email, options).error;
};

// =============================================================================
// BATCH VALIDATION
// =============================================================================

/**
 * Validates multiple email addresses
 * @param {string[]} emails - Array of email addresses
 * @param {Object} options - Validation options
 * @returns {Object} Validation results
 */
export const validateEmails = (emails, options = {}) => {
  if (!Array.isArray(emails)) {
    return { isValid: false, results: [], validCount: 0, invalidCount: 0 };
  }
  
  const results = emails.map(email => ({
    email,
    ...validateEmail(email, options)
  }));
  
  const validCount = results.filter(r => r.isValid).length;
  const invalidCount = results.length - validCount;
  
  return {
    isValid: invalidCount === 0,
    results,
    validCount,
    invalidCount,
    validEmails: results.filter(r => r.isValid).map(r => r.normalized),
    invalidEmails: results.filter(r => !r.isValid).map(r => r.email)
  };
};

/**
 * Filters array to only valid emails
 * @param {string[]} emails - Array of email addresses
 * @param {Object} options - Validation options
 * @returns {string[]} Valid emails only
 */
export const filterValidEmails = (emails, options = {}) => {
  if (!Array.isArray(emails)) return [];
  
  return emails
    .filter(email => isValidEmail(email, options))
    .map(email => normalizeEmail(email));
};

// =============================================================================
// EMAIL COMPARISON
// =============================================================================

/**
 * Checks if two email addresses are the same (normalized comparison)
 * @param {string} email1 - First email
 * @param {string} email2 - Second email
 * @returns {boolean} True if same email
 */
export const isSameEmail = (email1, email2) => {
  return normalizeEmail(email1) === normalizeEmail(email2);
};

/**
 * Checks if email is in a list (normalized comparison)
 * @param {string} email - Email to check
 * @param {string[]} emailList - List of emails
 * @returns {boolean} True if in list
 */
export const isEmailInList = (email, emailList) => {
  if (!Array.isArray(emailList)) return false;
  
  const normalized = normalizeEmail(email);
  return emailList.some(e => normalizeEmail(e) === normalized);
};

// =============================================================================
// MASKING AND PRIVACY
// =============================================================================

/**
 * Masks email address for privacy display
 * @param {string} email - Email address
 * @param {Object} options - Masking options
 * @param {number} options.showFirst - Characters to show at start of local part
 * @param {number} options.showLast - Characters to show at end of local part
 * @param {string} options.maskChar - Character to use for masking
 * @returns {string} Masked email
 */
export const maskEmail = (email, options = {}) => {
  const normalized = normalizeEmail(email);
  if (!normalized || !normalized.includes('@')) return email;
  
  const { showFirst = 2, showLast = 1, maskChar = '*' } = options;
  
  const [localPart, domain] = normalized.split('@');
  
  if (localPart.length <= showFirst + showLast) {
    // Too short to mask effectively
    return `${localPart[0]}${maskChar.repeat(localPart.length - 1)}@${domain}`;
  }
  
  const start = localPart.slice(0, showFirst);
  const end = localPart.slice(-showLast);
  const middleLength = localPart.length - showFirst - showLast;
  const masked = maskChar.repeat(Math.min(middleLength, 5)); // Limit mask length
  
  return `${start}${masked}${end}@${domain}`;
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Constants
  EMAIL_REGEX,
  EMAIL_REGEX_SIMPLE,
  EDUCATIONAL_DOMAINS,
  FREE_EMAIL_DOMAINS,
  DISPOSABLE_EMAIL_DOMAINS,
  EMAIL_ERROR_MESSAGES,
  
  // Helpers
  extractDomain,
  extractLocalPart,
  normalizeEmail,
  
  // Format validation
  isValidEmailFormat,
  hasValidDomain,
  
  // Type checking
  isEducationalEmail,
  isFreeEmail,
  isDisposableEmail,
  isCorporateEmail,
  
  // Comprehensive validation
  validateEmail,
  isValidEmail,
  getEmailError,
  
  // Batch operations
  validateEmails,
  filterValidEmails,
  
  // Comparison
  isSameEmail,
  isEmailInList,
  
  // Privacy
  maskEmail
};