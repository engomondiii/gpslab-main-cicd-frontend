/* ============================================
   GPS LAB - Email Validator
   Email validation utilities
   ============================================ */

/**
 * Email regex pattern (RFC 5322 compliant)
 */
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  return EMAIL_REGEX.test(email.trim());
};

/**
 * Validate email with detailed error message
 * @param {string} email - Email to validate
 * @returns {Object} Validation result with isValid and error message
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      error: 'Email is required',
    };
  }

  const trimmedEmail = email.trim();

  if (trimmedEmail.length === 0) {
    return {
      isValid: false,
      error: 'Email is required',
    };
  }

  if (!trimmedEmail.includes('@')) {
    return {
      isValid: false,
      error: 'Email must contain @ symbol',
    };
  }

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return {
      isValid: false,
      error: 'Invalid email format',
    };
  }

  if (trimmedEmail.length > 254) {
    return {
      isValid: false,
      error: 'Email is too long (max 254 characters)',
    };
  }

  const [localPart, domain] = trimmedEmail.split('@');

  if (localPart.length > 64) {
    return {
      isValid: false,
      error: 'Email local part is too long (max 64 characters)',
    };
  }

  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return {
      isValid: false,
      error: 'Email cannot start or end with a period',
    };
  }

  if (localPart.includes('..')) {
    return {
      isValid: false,
      error: 'Email cannot contain consecutive periods',
    };
  }

  if (!domain || domain.length === 0) {
    return {
      isValid: false,
      error: 'Email must have a domain',
    };
  }

  if (!domain.includes('.')) {
    return {
      isValid: false,
      error: 'Email domain must contain at least one period',
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Check if email domain is common/popular
 * @param {string} email - Email to check
 * @returns {boolean} True if domain is common
 */
export const isCommonEmailDomain = (email) => {
  if (!isValidEmail(email)) {
    return false;
  }

  const commonDomains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'icloud.com',
    'aol.com',
    'mail.com',
    'protonmail.com',
    'zoho.com',
  ];

  const domain = email.split('@')[1].toLowerCase();
  return commonDomains.includes(domain);
};

/**
 * Suggest email corrections for common typos
 * @param {string} email - Email to check
 * @returns {string|null} Suggested correction or null
 */
export const suggestEmailCorrection = (email) => {
  if (!email || !email.includes('@')) {
    return null;
  }

  const [localPart, domain] = email.split('@');
  
  const commonTypos = {
    'gmial.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gmil.com': 'gmail.com',
    'yahooo.com': 'yahoo.com',
    'yaho.com': 'yahoo.com',
    'hotmial.com': 'hotmail.com',
    'hotmai.com': 'hotmail.com',
    'outlok.com': 'outlook.com',
    'outloo.com': 'outlook.com',
  };

  const lowerDomain = domain.toLowerCase();
  
  if (commonTypos[lowerDomain]) {
    return `${localPart}@${commonTypos[lowerDomain]}`;
  }

  return null;
};

/**
 * Extract domain from email
 * @param {string} email - Email address
 * @returns {string|null} Domain or null
 */
export const extractEmailDomain = (email) => {
  if (!isValidEmail(email)) {
    return null;
  }

  return email.split('@')[1].toLowerCase();
};

/**
 * Normalize email (lowercase and trim)
 * @param {string} email - Email to normalize
 * @returns {string} Normalized email
 */
export const normalizeEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return '';
  }

  return email.trim().toLowerCase();
};

/**
 * Check if email is disposable (temporary email service)
 * @param {string} email - Email to check
 * @returns {boolean} True if disposable
 */
export const isDisposableEmail = (email) => {
  if (!isValidEmail(email)) {
    return false;
  }

  const disposableDomains = [
    'tempmail.com',
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'throwaway.email',
    'temp-mail.org',
    'fakeinbox.com',
  ];

  const domain = extractEmailDomain(email);
  return disposableDomains.includes(domain);
};

/**
 * Mask email for display (privacy)
 * @param {string} email - Email to mask
 * @returns {string} Masked email
 */
export const maskEmail = (email) => {
  if (!isValidEmail(email)) {
    return email;
  }

  const [localPart, domain] = email.split('@');
  
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }

  const visibleChars = Math.min(3, Math.floor(localPart.length / 2));
  const maskedPart = localPart.substring(0, visibleChars) + '***';
  
  return `${maskedPart}@${domain}`;
};

export default {
  isValidEmail,
  validateEmail,
  isCommonEmailDomain,
  suggestEmailCorrection,
  extractEmailDomain,
  normalizeEmail,
  isDisposableEmail,
  maskEmail,
};