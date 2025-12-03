/**
 * GPS Lab Platform - Password Validator
 * 
 * Comprehensive password validation utilities for the GPS Lab MMORPG educational platform.
 * Handles password strength checking, requirement validation, and security best practices.
 * 
 * @module utils/validators/password.validator
 * @version 1.0.0
 */

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Default password requirements
 */
export const DEFAULT_PASSWORD_REQUIREMENTS = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxConsecutiveChars: 3,
  preventCommonPasswords: true,
  preventUserInfo: true
};

/**
 * Password strength levels
 */
export const PASSWORD_STRENGTH = {
  VERY_WEAK: 0,
  WEAK: 1,
  FAIR: 2,
  STRONG: 3,
  VERY_STRONG: 4
};

/**
 * Password strength labels by locale
 */
export const STRENGTH_LABELS = {
  [PASSWORD_STRENGTH.VERY_WEAK]: {
    'en-US': 'Very Weak',
    'ko-KR': '매우 약함',
    'sw-KE': 'Dhaifu Sana'
  },
  [PASSWORD_STRENGTH.WEAK]: {
    'en-US': 'Weak',
    'ko-KR': '약함',
    'sw-KE': 'Dhaifu'
  },
  [PASSWORD_STRENGTH.FAIR]: {
    'en-US': 'Fair',
    'ko-KR': '보통',
    'sw-KE': 'Wastani'
  },
  [PASSWORD_STRENGTH.STRONG]: {
    'en-US': 'Strong',
    'ko-KR': '강함',
    'sw-KE': 'Imara'
  },
  [PASSWORD_STRENGTH.VERY_STRONG]: {
    'en-US': 'Very Strong',
    'ko-KR': '매우 강함',
    'sw-KE': 'Imara Sana'
  }
};

/**
 * Strength colors for UI
 */
export const STRENGTH_COLORS = {
  [PASSWORD_STRENGTH.VERY_WEAK]: '#dc2626', // red
  [PASSWORD_STRENGTH.WEAK]: '#ea580c',      // orange
  [PASSWORD_STRENGTH.FAIR]: '#ca8a04',      // yellow
  [PASSWORD_STRENGTH.STRONG]: '#16a34a',    // green
  [PASSWORD_STRENGTH.VERY_STRONG]: '#059669' // emerald
};

/**
 * Common weak passwords to reject
 */
export const COMMON_PASSWORDS = [
  'password', 'password1', 'password123', '123456', '12345678', '123456789',
  'qwerty', 'qwerty123', 'abc123', 'letmein', 'welcome', 'monkey', 'dragon',
  'master', 'login', 'admin', 'administrator', 'passw0rd', 'iloveyou',
  'sunshine', 'princess', 'football', 'baseball', 'soccer', 'hockey',
  'batman', 'superman', 'trustno1', 'access', 'shadow', 'michael', 'jennifer',
  'jordan', 'harley', 'ranger', 'thomas', 'robert', 'daniel', 'andrew',
  'joshua', 'matthew', 'anthony', 'william', 'mustang', 'corvette',
  'mercedes', 'porsche', 'ferrari', 'pokemon', 'starwars', 'whatever',
  'freedom', 'thunder', 'ginger', 'summer', 'winter', 'spring', 'autumn',
  'november', 'december', 'internet', 'service', 'google', 'facebook',
  // GPS Lab specific to prevent
  'gpslab', 'gpslab123', 'baraka', 'baraka123', 'navigator', 'companion',
  'mission', 'mission123', 'problem', 'solver', 'purpose'
];

/**
 * Keyboard patterns to detect
 */
export const KEYBOARD_PATTERNS = [
  'qwerty', 'qwertz', 'azerty', 'asdfgh', 'zxcvbn',
  '1234567890', '0987654321', '1q2w3e', 'q1w2e3',
  '!@#$%^', '!qaz', 'qazwsx', 'wsxedc'
];

/**
 * Validation error messages by locale
 */
export const PASSWORD_ERROR_MESSAGES = {
  required: {
    'en-US': 'Password is required',
    'ko-KR': '비밀번호를 입력해주세요',
    'sw-KE': 'Neno la siri linahitajika'
  },
  tooShort: {
    'en-US': 'Password must be at least {min} characters',
    'ko-KR': '비밀번호는 최소 {min}자 이상이어야 합니다',
    'sw-KE': 'Neno la siri lazima liwe na herufi {min} au zaidi'
  },
  tooLong: {
    'en-US': 'Password must be no more than {max} characters',
    'ko-KR': '비밀번호는 {max}자를 초과할 수 없습니다',
    'sw-KE': 'Neno la siri lazima lisiwe na herufi zaidi ya {max}'
  },
  requireUppercase: {
    'en-US': 'Password must contain at least one uppercase letter',
    'ko-KR': '비밀번호에 최소 1개의 대문자가 포함되어야 합니다',
    'sw-KE': 'Neno la siri lazima liwe na herufi kubwa moja'
  },
  requireLowercase: {
    'en-US': 'Password must contain at least one lowercase letter',
    'ko-KR': '비밀번호에 최소 1개의 소문자가 포함되어야 합니다',
    'sw-KE': 'Neno la siri lazima liwe na herufi ndogo moja'
  },
  requireNumbers: {
    'en-US': 'Password must contain at least one number',
    'ko-KR': '비밀번호에 최소 1개의 숫자가 포함되어야 합니다',
    'sw-KE': 'Neno la siri lazima liwe na nambari moja'
  },
  requireSpecialChars: {
    'en-US': 'Password must contain at least one special character (!@#$%^&*)',
    'ko-KR': '비밀번호에 최소 1개의 특수문자가 포함되어야 합니다 (!@#$%^&*)',
    'sw-KE': 'Neno la siri lazima liwe na herufi maalum (!@#$%^&*)'
  },
  noConsecutive: {
    'en-US': 'Password cannot contain more than {max} consecutive identical characters',
    'ko-KR': '동일한 문자가 {max}번 이상 연속될 수 없습니다',
    'sw-KE': 'Neno la siri haliwezi kuwa na herufi zinazofanana zaidi ya {max}'
  },
  tooCommon: {
    'en-US': 'This password is too common. Please choose a more secure password',
    'ko-KR': '너무 흔한 비밀번호입니다. 더 안전한 비밀번호를 선택해주세요',
    'sw-KE': 'Neno hili la siri ni la kawaida sana. Tafadhali chagua lingine salama zaidi'
  },
  containsUserInfo: {
    'en-US': 'Password should not contain your personal information',
    'ko-KR': '비밀번호에 개인정보가 포함되면 안 됩니다',
    'sw-KE': 'Neno la siri halipaswi kuwa na taarifa zako binafsi'
  },
  keyboardPattern: {
    'en-US': 'Password contains a keyboard pattern. Please choose a more secure password',
    'ko-KR': '키보드 패턴이 포함되어 있습니다. 더 안전한 비밀번호를 선택해주세요',
    'sw-KE': 'Neno la siri lina muundo wa kibodi. Tafadhali chagua lingine salama zaidi'
  },
  noMatch: {
    'en-US': 'Passwords do not match',
    'ko-KR': '비밀번호가 일치하지 않습니다',
    'sw-KE': 'Maneno ya siri hayalingani'
  }
};

/**
 * Requirement labels for UI display
 */
export const REQUIREMENT_LABELS = {
  minLength: {
    'en-US': 'At least {min} characters',
    'ko-KR': '최소 {min}자 이상',
    'sw-KE': 'Angalau herufi {min}'
  },
  uppercase: {
    'en-US': 'One uppercase letter',
    'ko-KR': '대문자 1개',
    'sw-KE': 'Herufi kubwa moja'
  },
  lowercase: {
    'en-US': 'One lowercase letter',
    'ko-KR': '소문자 1개',
    'sw-KE': 'Herufi ndogo moja'
  },
  number: {
    'en-US': 'One number',
    'ko-KR': '숫자 1개',
    'sw-KE': 'Nambari moja'
  },
  special: {
    'en-US': 'One special character',
    'ko-KR': '특수문자 1개',
    'sw-KE': 'Herufi maalum moja'
  }
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Normalizes locale string
 * @param {string} locale - Locale code
 * @returns {string} Normalized locale
 */
const normalizeLocale = (locale = 'en-US') => {
  if (locale.includes('ko')) return 'ko-KR';
  if (locale.includes('sw')) return 'sw-KE';
  return 'en-US';
};

/**
 * Gets error message for locale with interpolation
 * @param {string} errorKey - Error key
 * @param {string} locale - Locale code
 * @param {Object} params - Interpolation parameters
 * @returns {string} Error message
 */
const getErrorMessage = (errorKey, locale = 'en-US', params = {}) => {
  const messages = PASSWORD_ERROR_MESSAGES[errorKey];
  if (!messages) return 'Invalid password';
  
  const normalizedLocale = normalizeLocale(locale);
  let message = messages[normalizedLocale] || messages['en-US'];
  
  // Interpolate parameters
  Object.keys(params).forEach(key => {
    message = message.replace(`{${key}}`, params[key]);
  });
  
  return message;
};

/**
 * Checks for consecutive identical characters
 * @param {string} password - Password to check
 * @param {number} maxConsecutive - Maximum allowed consecutive chars
 * @returns {boolean} True if exceeds limit
 */
const hasConsecutiveChars = (password, maxConsecutive) => {
  if (maxConsecutive <= 0) return false;
  
  const regex = new RegExp(`(.)\\1{${maxConsecutive},}`);
  return regex.test(password);
};

/**
 * Checks if password contains keyboard patterns
 * @param {string} password - Password to check
 * @returns {boolean} True if contains pattern
 */
const containsKeyboardPattern = (password) => {
  const lowerPassword = password.toLowerCase();
  return KEYBOARD_PATTERNS.some(pattern => lowerPassword.includes(pattern));
};

/**
 * Checks if password contains user info
 * @param {string} password - Password to check
 * @param {Object} userInfo - User information
 * @returns {boolean} True if contains user info
 */
const containsUserInfo = (password, userInfo = {}) => {
  if (!userInfo || Object.keys(userInfo).length === 0) return false;
  
  const lowerPassword = password.toLowerCase();
  const infoValues = [
    userInfo.email?.split('@')[0],
    userInfo.username,
    userInfo.firstName,
    userInfo.lastName,
    userInfo.name
  ].filter(Boolean).map(v => v.toLowerCase());
  
  return infoValues.some(value => 
    value.length >= 3 && lowerPassword.includes(value)
  );
};

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

/**
 * Validates password length
 * @param {string} password - Password to validate
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @returns {Object} Validation result
 */
export const validateLength = (password, minLength = 8, maxLength = 128) => {
  const length = password?.length || 0;
  
  return {
    isValid: length >= minLength && length <= maxLength,
    isTooShort: length < minLength,
    isTooLong: length > maxLength,
    length,
    minLength,
    maxLength
  };
};

/**
 * Checks if password has uppercase letters
 * @param {string} password - Password to check
 * @returns {boolean} True if has uppercase
 */
export const hasUppercase = (password) => {
  return /[A-Z]/.test(password);
};

/**
 * Checks if password has lowercase letters
 * @param {string} password - Password to check
 * @returns {boolean} True if has lowercase
 */
export const hasLowercase = (password) => {
  return /[a-z]/.test(password);
};

/**
 * Checks if password has numbers
 * @param {string} password - Password to check
 * @returns {boolean} True if has numbers
 */
export const hasNumbers = (password) => {
  return /[0-9]/.test(password);
};

/**
 * Checks if password has special characters
 * @param {string} password - Password to check
 * @returns {boolean} True if has special chars
 */
export const hasSpecialChars = (password) => {
  return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password);
};

/**
 * Checks if password is in common passwords list
 * @param {string} password - Password to check
 * @returns {boolean} True if common password
 */
export const isCommonPassword = (password) => {
  return COMMON_PASSWORDS.includes(password.toLowerCase());
};

// =============================================================================
// PASSWORD STRENGTH CALCULATION
// =============================================================================

/**
 * Calculates password entropy (bits)
 * @param {string} password - Password to analyze
 * @returns {number} Entropy in bits
 */
export const calculateEntropy = (password) => {
  if (!password) return 0;
  
  let charsetSize = 0;
  
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) charsetSize += 32;
  if (/[^\x00-\x7F]/.test(password)) charsetSize += 100; // Unicode chars
  
  if (charsetSize === 0) return 0;
  
  return Math.floor(password.length * Math.log2(charsetSize));
};

/**
 * Calculates password strength score (0-4)
 * @param {string} password - Password to analyze
 * @param {Object} options - Strength calculation options
 * @returns {Object} Strength analysis
 */
export const calculateStrength = (password, options = {}) => {
  if (!password) {
    return {
      score: PASSWORD_STRENGTH.VERY_WEAK,
      entropy: 0,
      crackTime: 'instant',
      feedback: []
    };
  }
  
  const { userInfo = {} } = options;
  
  let score = 0;
  const feedback = [];
  const entropy = calculateEntropy(password);
  
  // Length scoring
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 0.5;
  
  // Character variety
  if (hasLowercase(password)) score += 0.5;
  if (hasUppercase(password)) score += 0.5;
  if (hasNumbers(password)) score += 0.5;
  if (hasSpecialChars(password)) score += 0.5;
  
  // Penalties
  if (isCommonPassword(password)) {
    score = Math.max(0, score - 3);
    feedback.push('This is a commonly used password');
  }
  
  if (containsKeyboardPattern(password)) {
    score = Math.max(0, score - 1);
    feedback.push('Contains a keyboard pattern');
  }
  
  if (containsUserInfo(password, userInfo)) {
    score = Math.max(0, score - 1);
    feedback.push('Contains personal information');
  }
  
  if (hasConsecutiveChars(password, 3)) {
    score = Math.max(0, score - 0.5);
    feedback.push('Has too many consecutive identical characters');
  }
  
  // Entropy bonus
  if (entropy >= 60) score += 0.5;
  if (entropy >= 80) score += 0.5;
  
  // Normalize score to 0-4 range
  const normalizedScore = Math.min(4, Math.max(0, Math.floor(score)));
  
  // Estimate crack time (simplified)
  let crackTime;
  if (entropy < 30) crackTime = 'instant';
  else if (entropy < 40) crackTime = 'minutes';
  else if (entropy < 50) crackTime = 'hours';
  else if (entropy < 60) crackTime = 'days';
  else if (entropy < 70) crackTime = 'months';
  else if (entropy < 80) crackTime = 'years';
  else crackTime = 'centuries';
  
  return {
    score: normalizedScore,
    entropy,
    crackTime,
    feedback,
    checks: {
      length: password.length,
      hasUppercase: hasUppercase(password),
      hasLowercase: hasLowercase(password),
      hasNumbers: hasNumbers(password),
      hasSpecialChars: hasSpecialChars(password),
      isCommon: isCommonPassword(password),
      hasPattern: containsKeyboardPattern(password),
      hasUserInfo: containsUserInfo(password, userInfo)
    }
  };
};

/**
 * Gets strength label for display
 * @param {number} score - Strength score (0-4)
 * @param {string} locale - Locale code
 * @returns {string} Strength label
 */
export const getStrengthLabel = (score, locale = 'en-US') => {
  const normalizedLocale = normalizeLocale(locale);
  const labels = STRENGTH_LABELS[score];
  return labels?.[normalizedLocale] || labels?.['en-US'] || 'Unknown';
};

/**
 * Gets strength color for UI
 * @param {number} score - Strength score (0-4)
 * @returns {string} Color hex code
 */
export const getStrengthColor = (score) => {
  return STRENGTH_COLORS[score] || STRENGTH_COLORS[PASSWORD_STRENGTH.VERY_WEAK];
};

// =============================================================================
// COMPREHENSIVE VALIDATION
// =============================================================================

/**
 * Password validation result type
 * @typedef {Object} PasswordValidationResult
 * @property {boolean} isValid - Overall validity
 * @property {string[]} errors - Array of error messages
 * @property {Object} requirements - Requirement check results
 * @property {Object} strength - Strength analysis
 */

/**
 * Validates a password comprehensively
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @returns {PasswordValidationResult} Validation result
 */
export const validatePassword = (password, options = {}) => {
  const {
    requirements = DEFAULT_PASSWORD_REQUIREMENTS,
    userInfo = {},
    locale = 'en-US'
  } = options;
  
  const errors = [];
  const requirementResults = {
    length: false,
    uppercase: false,
    lowercase: false,
    numbers: false,
    specialChars: false,
    noConsecutive: true,
    notCommon: true,
    noUserInfo: true,
    noPattern: true
  };
  
  // Empty check
  if (!password) {
    return {
      isValid: false,
      errors: [getErrorMessage('required', locale)],
      requirements: requirementResults,
      strength: calculateStrength('', { userInfo })
    };
  }
  
  // Length validation
  const lengthResult = validateLength(
    password, 
    requirements.minLength, 
    requirements.maxLength
  );
  
  requirementResults.length = lengthResult.isValid;
  
  if (lengthResult.isTooShort) {
    errors.push(getErrorMessage('tooShort', locale, { min: requirements.minLength }));
  }
  if (lengthResult.isTooLong) {
    errors.push(getErrorMessage('tooLong', locale, { max: requirements.maxLength }));
  }
  
  // Character type requirements
  if (requirements.requireUppercase) {
    requirementResults.uppercase = hasUppercase(password);
    if (!requirementResults.uppercase) {
      errors.push(getErrorMessage('requireUppercase', locale));
    }
  } else {
    requirementResults.uppercase = true;
  }
  
  if (requirements.requireLowercase) {
    requirementResults.lowercase = hasLowercase(password);
    if (!requirementResults.lowercase) {
      errors.push(getErrorMessage('requireLowercase', locale));
    }
  } else {
    requirementResults.lowercase = true;
  }
  
  if (requirements.requireNumbers) {
    requirementResults.numbers = hasNumbers(password);
    if (!requirementResults.numbers) {
      errors.push(getErrorMessage('requireNumbers', locale));
    }
  } else {
    requirementResults.numbers = true;
  }
  
  if (requirements.requireSpecialChars) {
    requirementResults.specialChars = hasSpecialChars(password);
    if (!requirementResults.specialChars) {
      errors.push(getErrorMessage('requireSpecialChars', locale));
    }
  } else {
    requirementResults.specialChars = true;
  }
  
  // Consecutive characters
  if (requirements.maxConsecutiveChars > 0) {
    requirementResults.noConsecutive = !hasConsecutiveChars(password, requirements.maxConsecutiveChars);
    if (!requirementResults.noConsecutive) {
      errors.push(getErrorMessage('noConsecutive', locale, { max: requirements.maxConsecutiveChars }));
    }
  }
  
  // Common password check
  if (requirements.preventCommonPasswords) {
    requirementResults.notCommon = !isCommonPassword(password);
    if (!requirementResults.notCommon) {
      errors.push(getErrorMessage('tooCommon', locale));
    }
  }
  
  // User info check
  if (requirements.preventUserInfo && userInfo) {
    requirementResults.noUserInfo = !containsUserInfo(password, userInfo);
    if (!requirementResults.noUserInfo) {
      errors.push(getErrorMessage('containsUserInfo', locale));
    }
  }
  
  // Keyboard pattern check
  requirementResults.noPattern = !containsKeyboardPattern(password);
  if (!requirementResults.noPattern && requirements.preventCommonPasswords) {
    errors.push(getErrorMessage('keyboardPattern', locale));
  }
  
  const strength = calculateStrength(password, { userInfo });
  
  return {
    isValid: errors.length === 0,
    errors,
    requirements: requirementResults,
    strength
  };
};

/**
 * Simple validation - returns boolean only
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @returns {boolean} True if valid
 */
export const isValidPassword = (password, options = {}) => {
  return validatePassword(password, options).isValid;
};

/**
 * Gets first error message for password
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @returns {string|null} Error message or null
 */
export const getPasswordError = (password, options = {}) => {
  const result = validatePassword(password, options);
  return result.errors[0] || null;
};

// =============================================================================
// PASSWORD COMPARISON
// =============================================================================

/**
 * Validates password confirmation match
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @param {Object} options - Options
 * @returns {Object} Match validation result
 */
export const validatePasswordMatch = (password, confirmPassword, options = {}) => {
  const { locale = 'en-US' } = options;
  
  const matches = password === confirmPassword;
  
  return {
    isValid: matches,
    error: matches ? null : getErrorMessage('noMatch', locale)
  };
};

// =============================================================================
// REQUIREMENT LIST GENERATOR
// =============================================================================

/**
 * Generates requirement list for UI display
 * @param {Object} requirements - Password requirements
 * @param {string} locale - Locale code
 * @returns {Array} Requirement items for display
 */
export const getRequirementsList = (requirements = DEFAULT_PASSWORD_REQUIREMENTS, locale = 'en-US') => {
  const normalizedLocale = normalizeLocale(locale);
  const list = [];
  
  list.push({
    id: 'length',
    label: REQUIREMENT_LABELS.minLength[normalizedLocale].replace('{min}', requirements.minLength),
    required: true
  });
  
  if (requirements.requireUppercase) {
    list.push({
      id: 'uppercase',
      label: REQUIREMENT_LABELS.uppercase[normalizedLocale],
      required: true
    });
  }
  
  if (requirements.requireLowercase) {
    list.push({
      id: 'lowercase',
      label: REQUIREMENT_LABELS.lowercase[normalizedLocale],
      required: true
    });
  }
  
  if (requirements.requireNumbers) {
    list.push({
      id: 'number',
      label: REQUIREMENT_LABELS.number[normalizedLocale],
      required: true
    });
  }
  
  if (requirements.requireSpecialChars) {
    list.push({
      id: 'special',
      label: REQUIREMENT_LABELS.special[normalizedLocale],
      required: true
    });
  }
  
  return list;
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Constants
  DEFAULT_PASSWORD_REQUIREMENTS,
  PASSWORD_STRENGTH,
  STRENGTH_LABELS,
  STRENGTH_COLORS,
  COMMON_PASSWORDS,
  KEYBOARD_PATTERNS,
  PASSWORD_ERROR_MESSAGES,
  REQUIREMENT_LABELS,
  
  // Basic validators
  validateLength,
  hasUppercase,
  hasLowercase,
  hasNumbers,
  hasSpecialChars,
  isCommonPassword,
  
  // Strength
  calculateEntropy,
  calculateStrength,
  getStrengthLabel,
  getStrengthColor,
  
  // Comprehensive validation
  validatePassword,
  isValidPassword,
  getPasswordError,
  
  // Comparison
  validatePasswordMatch,
  
  // UI helpers
  getRequirementsList
};