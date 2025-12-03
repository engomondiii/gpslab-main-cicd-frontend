/**
 * GPS Lab Platform - Form Validator
 * 
 * Comprehensive form validation utilities for the GPS Lab MMORPG educational platform.
 * Handles field validation, form-level validation, and complex validation rules.
 * 
 * @module utils/validators/form.validator
 * @version 1.0.0
 */

import { validateEmail, isValidEmail } from './email.validator.js';
import { validatePassword, isValidPassword, validatePasswordMatch } from './password.validator.js';

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Built-in validation rule types
 */
export const VALIDATION_RULES = {
  REQUIRED: 'required',
  EMAIL: 'email',
  PASSWORD: 'password',
  PASSWORD_MATCH: 'passwordMatch',
  MIN_LENGTH: 'minLength',
  MAX_LENGTH: 'maxLength',
  MIN_VALUE: 'minValue',
  MAX_VALUE: 'maxValue',
  PATTERN: 'pattern',
  CUSTOM: 'custom',
  URL: 'url',
  PHONE: 'phone',
  DATE: 'date',
  NUMBER: 'number',
  INTEGER: 'integer',
  ALPHA: 'alpha',
  ALPHANUMERIC: 'alphanumeric',
  USERNAME: 'username',
  FILE_SIZE: 'fileSize',
  FILE_TYPE: 'fileType',
  BARAKA_AMOUNT: 'barakaAmount',
  STAGE_NUMBER: 'stageNumber',
  MISSION_ID: 'missionId'
};

/**
 * Validation error messages by locale
 */
export const FORM_ERROR_MESSAGES = {
  required: {
    'en-US': 'This field is required',
    'ko-KR': '이 필드는 필수입니다',
    'sw-KE': 'Sehemu hii inahitajika'
  },
  minLength: {
    'en-US': 'Must be at least {min} characters',
    'ko-KR': '최소 {min}자 이상이어야 합니다',
    'sw-KE': 'Lazima iwe na herufi {min} au zaidi'
  },
  maxLength: {
    'en-US': 'Must be no more than {max} characters',
    'ko-KR': '{max}자를 초과할 수 없습니다',
    'sw-KE': 'Lazima isiwe na herufi zaidi ya {max}'
  },
  minValue: {
    'en-US': 'Must be at least {min}',
    'ko-KR': '최소 {min} 이상이어야 합니다',
    'sw-KE': 'Lazima iwe angalau {min}'
  },
  maxValue: {
    'en-US': 'Must be no more than {max}',
    'ko-KR': '{max}를 초과할 수 없습니다',
    'sw-KE': 'Lazima isiwe zaidi ya {max}'
  },
  pattern: {
    'en-US': 'Invalid format',
    'ko-KR': '형식이 올바르지 않습니다',
    'sw-KE': 'Muundo si sahihi'
  },
  url: {
    'en-US': 'Please enter a valid URL',
    'ko-KR': '올바른 URL을 입력해주세요',
    'sw-KE': 'Tafadhali ingiza URL sahihi'
  },
  phone: {
    'en-US': 'Please enter a valid phone number',
    'ko-KR': '올바른 전화번호를 입력해주세요',
    'sw-KE': 'Tafadhali ingiza nambari ya simu sahihi'
  },
  date: {
    'en-US': 'Please enter a valid date',
    'ko-KR': '올바른 날짜를 입력해주세요',
    'sw-KE': 'Tafadhali ingiza tarehe sahihi'
  },
  number: {
    'en-US': 'Please enter a valid number',
    'ko-KR': '올바른 숫자를 입력해주세요',
    'sw-KE': 'Tafadhali ingiza nambari sahihi'
  },
  integer: {
    'en-US': 'Please enter a whole number',
    'ko-KR': '정수를 입력해주세요',
    'sw-KE': 'Tafadhali ingiza nambari kamili'
  },
  alpha: {
    'en-US': 'Only letters are allowed',
    'ko-KR': '문자만 입력할 수 있습니다',
    'sw-KE': 'Herufi tu zinaruhusiwa'
  },
  alphanumeric: {
    'en-US': 'Only letters and numbers are allowed',
    'ko-KR': '문자와 숫자만 입력할 수 있습니다',
    'sw-KE': 'Herufi na nambari tu zinaruhusiwa'
  },
  username: {
    'en-US': 'Username must be 3-20 characters, letters, numbers, and underscores only',
    'ko-KR': '사용자명은 3-20자, 문자, 숫자, 밑줄만 가능합니다',
    'sw-KE': 'Jina la mtumiaji lazima liwe herufi 3-20, herufi, nambari, na mistari chini tu'
  },
  fileSize: {
    'en-US': 'File size must not exceed {max}',
    'ko-KR': '파일 크기는 {max}를 초과할 수 없습니다',
    'sw-KE': 'Ukubwa wa faili haupaswi kuzidi {max}'
  },
  fileType: {
    'en-US': 'File type not allowed. Allowed types: {types}',
    'ko-KR': '허용되지 않는 파일 형식입니다. 허용 형식: {types}',
    'sw-KE': 'Aina ya faili hairuhusiwi. Aina zinazoruhusiwa: {types}'
  },
  barakaAmount: {
    'en-US': 'Baraka amount must be a positive number',
    'ko-KR': '바라카 금액은 양수여야 합니다',
    'sw-KE': 'Kiasi cha Baraka lazima kiwe nambari chanya'
  },
  stageNumber: {
    'en-US': 'Stage number must be between 1 and 35',
    'ko-KR': '스테이지 번호는 1에서 35 사이여야 합니다',
    'sw-KE': 'Nambari ya hatua lazima iwe kati ya 1 na 35'
  },
  missionId: {
    'en-US': 'Invalid mission ID format',
    'ko-KR': '올바르지 않은 미션 ID 형식입니다',
    'sw-KE': 'Muundo wa kitambulisho cha misheni si sahihi'
  }
};

/**
 * Regular expression patterns
 */
export const PATTERNS = {
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  PHONE: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
  ALPHA: /^[a-zA-Z\u3131-\uD79D]*$/, // Includes Korean characters
  ALPHANUMERIC: /^[a-zA-Z0-9\u3131-\uD79D]*$/,
  USERNAME: /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  MISSION_ID: /^S\d{1,2}M\d{1}B\d{1}$/,  // e.g., S1M1B1, S35M5B5
  STAGE_MISSION: /^S(\d{1,2})M(\d{1})$/   // e.g., S1M1, S35M5
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
 * Gets error message with interpolation
 * @param {string} key - Error key
 * @param {string} locale - Locale code
 * @param {Object} params - Interpolation parameters
 * @returns {string} Error message
 */
const getErrorMessage = (key, locale = 'en-US', params = {}) => {
  const messages = FORM_ERROR_MESSAGES[key];
  if (!messages) return 'Invalid value';
  
  const normalizedLocale = normalizeLocale(locale);
  let message = messages[normalizedLocale] || messages['en-US'];
  
  Object.keys(params).forEach(param => {
    message = message.replace(`{${param}}`, params[param]);
  });
  
  return message;
};

/**
 * Checks if value is empty
 * @param {*} value - Value to check
 * @returns {boolean} True if empty
 */
const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Formats file size for display
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size
 */
const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

// =============================================================================
// INDIVIDUAL VALIDATORS
// =============================================================================

/**
 * Validates required field
 * @param {*} value - Value to validate
 * @param {Object} options - Options
 * @returns {Object} Validation result
 */
export const validateRequired = (value, options = {}) => {
  const { locale = 'en-US' } = options;
  const isValid = !isEmpty(value);
  
  return {
    isValid,
    error: isValid ? null : getErrorMessage('required', locale)
  };
};

/**
 * Validates minimum length
 * @param {string} value - Value to validate
 * @param {number} min - Minimum length
 * @param {Object} options - Options
 * @returns {Object} Validation result
 */
export const validateMinLength = (value, min, options = {}) => {
  const { locale = 'en-US' } = options;
  const length = value?.length || 0;
  const isValid = length >= min;
  
  return {
    isValid,
    error: isValid ? null : getErrorMessage('minLength', locale, { min })
  };
};

/**
 * Validates maximum length
 * @param {string} value - Value to validate
 * @param {number} max - Maximum length
 * @param {Object} options - Options
 * @returns {Object} Validation result
 */
export const validateMaxLength = (value, max, options = {}) => {
  const { locale = 'en-US' } = options;
  const length = value?.length || 0;
  const isValid = length <= max;
  
  return {
    isValid,
    error: isValid ? null : getErrorMessage('maxLength', locale, { max })
  };
};

/**
 * Validates minimum numeric value
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {Object} options - Options
 * @returns {Object} Validation result
 */
export const validateMinValue = (value, min, options = {}) => {
  const { locale = 'en-US' } = options;
  const numValue = Number(value);
  const isValid = !isNaN(numValue) && numValue >= min;
  
  return {
    isValid,
    error: isValid ? null : getErrorMessage('minValue', locale, { min })
  };
};

/**
 * Validates maximum numeric value
 * @param {number} value - Value to validate
 * @param {number} max - Maximum value
 * @param {Object} options - Options
 * @returns {Object} Validation result
 */
export const validateMaxValue = (value, max, options = {}) => {
  const { locale = 'en-US' } = options;
  const numValue = Number(value);
  const isValid = !isNaN(numValue) && numValue <= max;
  
  return {
    isValid,
    error: isValid ? null : getErrorMessage('maxValue', locale, { max })
  };
};

/**
 * Validates against a regex pattern
 * @param {string} value - Value to validate
 * @param {RegExp|string} pattern - Regex pattern
 * @param {Object} options - Options
 * @returns {Object} Validation result
 */
export const validatePattern = (value, pattern, options = {}) => {
  const { locale = 'en-US', message } = options;
  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
  const isValid = regex.test(value || '');
  
  return {
    isValid,
    error: isValid ? null : (message || getErrorMessage('pattern', locale))
  };
};

/**
 * Validates URL format
 * @param {string} value - Value to validate
 * @param {Object} options - Options
 * @returns {Object} Validation result
 */
export const validateUrl = (value, options = {}) => {
  const { locale = 'en-US', requireProtocol = false } = options;
  
  if (isEmpty(value)) {
    return { isValid: true, error: null };
  }
  
  let url = value;
  if (!requireProtocol && !url.match(/^https?:\/\//)) {
    url = 'https://' + url;
  }
  
  try {
    new URL(url);
    return { isValid: true, error: null };
  } catch {
    return { isValid: false, error: getErrorMessage('url', locale) };
  }
};

/**
 * Validates phone number
 * @param {string} value - Value to validate
 * @param {Object} options - Options
 * @returns {Object} Validation result
 */
export const validatePhone = (value, options = {}) => {
  const { locale = 'en-US' } = options;
  
  if (isEmpty(value)) {
    return { isValid: true, error: null };
  }
  
  const isValid = PATTERNS.PHONE.test(value);
  
  return {
    isValid,
    error: isValid ? null : getErrorMessage('phone', locale)
  };
};

/**
 * Validates date
 * @param {string|Date} value - Value to validate
 * @param {Object} options - Options
 * @returns {Object} Validation result
 */
export const validateDate = (value, options = {}) => {
  const { locale = 'en-US', minDate, maxDate } = options;
  
  if (isEmpty(value)) {
    return { isValid: true, error: null };
  }
  
  const date = new Date(value);
  
  if (isNaN(date.getTime())) {
    return { isValid: false, error: getErrorMessage('date', locale) };
  }
  
  if (minDate && date < new Date(minDate)) {
    return { isValid: false, error: `Date must be after ${minDate}` };
  }
  
  if (maxDate && date > new Date(maxDate)) {
    return { isValid: false, error: `Date must be before ${maxDate}` };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validates number
 * @param {*} value - Value to validate
 * @param {Object} options - Options
 * @returns {Object} Validation result
 */
export const validateNumber = (value, options = {}) => {
  const { locale = 'en-US', allowDecimal = true } = options;
  
  if (isEmpty(value)) {
    return { isValid: true, error: null };
  }
  
  const num = Number(value);
  let isValid = !isNaN(num) && isFinite(num);
  
  if (!allowDecimal && isValid) {
    isValid = Number.isInteger(num);
    if (!isValid) {
      return { isValid: false, error: getErrorMessage('integer', locale) };
    }
  }
  
  return {
    isValid,
    error: isValid ? null : getErrorMessage('number', locale)
  };
};

/**
 * Validates username format
 * @param {string} value - Value to validate
 * @param {Object} options - Options
 * @returns {Object} Validation result
 */
export const validateUsername = (value, options = {}) => {
  const { locale = 'en-US' } = options;
  
  if (isEmpty(value)) {
    return { isValid: true, error: null };
  }
  
  const isValid = PATTERNS.USERNAME.test(value);
  
  return {
    isValid,
    error: isValid ? null : getErrorMessage('username', locale)
  };
};

/**
 * Validates file size
 * @param {File|number} file - File or size in bytes
 * @param {number} maxSize - Maximum size in bytes
 * @param {Object} options - Options
 * @returns {Object} Validation result
 */
export const validateFileSize = (file, maxSize, options = {}) => {
  const { locale = 'en-US' } = options;
  const size = typeof file === 'number' ? file : file?.size || 0;
  const isValid = size <= maxSize;
  
  return {
    isValid,
    error: isValid ? null : getErrorMessage('fileSize', locale, { max: formatFileSize(maxSize) })
  };
};

/**
 * Validates file type
 * @param {File|string} file - File or filename
 * @param {string[]} allowedTypes - Allowed MIME types or extensions
 * @param {Object} options - Options
 * @returns {Object} Validation result
 */
export const validateFileType = (file, allowedTypes, options = {}) => {
  const { locale = 'en-US' } = options;
  
  const mimeType = typeof file === 'string' ? file : file?.type || '';
  const fileName = typeof file === 'string' ? file : file?.name || '';
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  const isValid = allowedTypes.some(type => {
    if (type.startsWith('.')) {
      return `.${extension}` === type.toLowerCase();
    }
    if (type.endsWith('/*')) {
      return mimeType.startsWith(type.slice(0, -1));
    }
    return mimeType === type;
  });
  
  return {
    isValid,
    error: isValid ? null : getErrorMessage('fileType', locale, { types: allowedTypes.join(', ') })
  };
};

// =============================================================================
// GPS LAB SPECIFIC VALIDATORS
// =============================================================================

/**
 * Validates Baraka amount
 * @param {number} value - Baraka amount
 * @param {Object} options - Options
 * @returns {Object} Validation result
 */
export const validateBarakaAmount = (value, options = {}) => {
  const { locale = 'en-US', min = 0, max = Infinity } = options;
  
  const num = Number(value);
  
  if (isNaN(num) || num < min) {
    return { isValid: false, error: getErrorMessage('barakaAmount', locale) };
  }
  
  if (num > max) {
    return { isValid: false, error: `Baraka amount cannot exceed ${max.toLocaleString()}` };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validates stage number (1-35)
 * @param {number} value - Stage number
 * @param {Object} options - Options
 * @returns {Object} Validation result
 */
export const validateStageNumber = (value, options = {}) => {
  const { locale = 'en-US' } = options;
  const num = Number(value);
  const isValid = Number.isInteger(num) && num >= 1 && num <= 35;
  
  return {
    isValid,
    error: isValid ? null : getErrorMessage('stageNumber', locale)
  };
};

/**
 * Validates mission ID format (e.g., S1M1B1)
 * @param {string} value - Mission ID
 * @param {Object} options - Options
 * @returns {Object} Validation result
 */
export const validateMissionId = (value, options = {}) => {
  const { locale = 'en-US' } = options;
  
  if (isEmpty(value)) {
    return { isValid: true, error: null };
  }
  
  const isValid = PATTERNS.MISSION_ID.test(value.toUpperCase());
  
  return {
    isValid,
    error: isValid ? null : getErrorMessage('missionId', locale)
  };
};

/**
 * Validates problem statement
 * @param {string} value - Problem statement
 * @param {Object} options - Options
 * @returns {Object} Validation result
 */
export const validateProblemStatement = (value, options = {}) => {
  const { locale = 'en-US', minLength = 50, maxLength = 500 } = options;
  
  if (isEmpty(value)) {
    return { isValid: false, error: getErrorMessage('required', locale) };
  }
  
  if (value.length < minLength) {
    return { 
      isValid: false, 
      error: `Problem statement must be at least ${minLength} characters to be meaningful` 
    };
  }
  
  if (value.length > maxLength) {
    return { 
      isValid: false, 
      error: `Problem statement must not exceed ${maxLength} characters` 
    };
  }
  
  return { isValid: true, error: null };
};

// =============================================================================
// FORM-LEVEL VALIDATION
// =============================================================================

/**
 * Field validation configuration
 * @typedef {Object} FieldConfig
 * @property {string} name - Field name
 * @property {Array} rules - Validation rules
 * @property {string} [label] - Field label for error messages
 */

/**
 * Validates a single field against multiple rules
 * @param {*} value - Field value
 * @param {Array} rules - Validation rules
 * @param {Object} options - Options
 * @returns {Object} Validation result
 */
export const validateField = (value, rules, options = {}) => {
  const { locale = 'en-US', formValues = {} } = options;
  const errors = [];
  
  for (const rule of rules) {
    let result;
    
    // Handle rule as object with type and params
    if (typeof rule === 'object' && rule.type) {
      switch (rule.type) {
        case VALIDATION_RULES.REQUIRED:
          result = validateRequired(value, { locale });
          break;
        case VALIDATION_RULES.EMAIL:
          result = validateEmail(value, { locale, ...rule.params });
          break;
        case VALIDATION_RULES.PASSWORD:
          result = validatePassword(value, { locale, ...rule.params });
          if (!result.isValid) {
            result = { isValid: false, error: result.errors[0] };
          }
          break;
        case VALIDATION_RULES.PASSWORD_MATCH:
          const compareValue = formValues[rule.compareField] || '';
          result = validatePasswordMatch(compareValue, value, { locale });
          break;
        case VALIDATION_RULES.MIN_LENGTH:
          result = validateMinLength(value, rule.value, { locale });
          break;
        case VALIDATION_RULES.MAX_LENGTH:
          result = validateMaxLength(value, rule.value, { locale });
          break;
        case VALIDATION_RULES.MIN_VALUE:
          result = validateMinValue(value, rule.value, { locale });
          break;
        case VALIDATION_RULES.MAX_VALUE:
          result = validateMaxValue(value, rule.value, { locale });
          break;
        case VALIDATION_RULES.PATTERN:
          result = validatePattern(value, rule.pattern, { locale, message: rule.message });
          break;
        case VALIDATION_RULES.URL:
          result = validateUrl(value, { locale, ...rule.params });
          break;
        case VALIDATION_RULES.PHONE:
          result = validatePhone(value, { locale });
          break;
        case VALIDATION_RULES.DATE:
          result = validateDate(value, { locale, ...rule.params });
          break;
        case VALIDATION_RULES.NUMBER:
          result = validateNumber(value, { locale, ...rule.params });
          break;
        case VALIDATION_RULES.INTEGER:
          result = validateNumber(value, { locale, allowDecimal: false });
          break;
        case VALIDATION_RULES.USERNAME:
          result = validateUsername(value, { locale });
          break;
        case VALIDATION_RULES.FILE_SIZE:
          result = validateFileSize(value, rule.maxSize, { locale });
          break;
        case VALIDATION_RULES.FILE_TYPE:
          result = validateFileType(value, rule.allowedTypes, { locale });
          break;
        case VALIDATION_RULES.BARAKA_AMOUNT:
          result = validateBarakaAmount(value, { locale, ...rule.params });
          break;
        case VALIDATION_RULES.STAGE_NUMBER:
          result = validateStageNumber(value, { locale });
          break;
        case VALIDATION_RULES.MISSION_ID:
          result = validateMissionId(value, { locale });
          break;
        case VALIDATION_RULES.CUSTOM:
          if (typeof rule.validator === 'function') {
            result = rule.validator(value, formValues, { locale });
          }
          break;
        default:
          result = { isValid: true, error: null };
      }
    }
    // Handle shorthand rules
    else if (typeof rule === 'string') {
      switch (rule) {
        case VALIDATION_RULES.REQUIRED:
          result = validateRequired(value, { locale });
          break;
        case VALIDATION_RULES.EMAIL:
          result = { isValid: isValidEmail(value), error: 'Invalid email' };
          break;
        default:
          result = { isValid: true, error: null };
      }
    }
    // Handle function rules
    else if (typeof rule === 'function') {
      result = rule(value, formValues, { locale });
    }
    
    if (result && !result.isValid) {
      errors.push(result.error);
      if (options.stopOnFirst) break;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    error: errors[0] || null
  };
};

/**
 * Validates an entire form
 * @param {Object} values - Form values
 * @param {Object} schema - Validation schema
 * @param {Object} options - Options
 * @returns {Object} Validation result
 */
export const validateForm = (values, schema, options = {}) => {
  const { locale = 'en-US', stopOnFirst = false } = options;
  const errors = {};
  let isValid = true;
  
  for (const [fieldName, rules] of Object.entries(schema)) {
    const value = values[fieldName];
    const result = validateField(value, rules, { 
      locale, 
      formValues: values,
      stopOnFirst 
    });
    
    if (!result.isValid) {
      isValid = false;
      errors[fieldName] = result.errors;
    }
  }
  
  return {
    isValid,
    errors,
    hasErrors: !isValid,
    errorCount: Object.keys(errors).length
  };
};

/**
 * Creates a form validator with predefined schema
 * @param {Object} schema - Validation schema
 * @param {Object} options - Default options
 * @returns {Function} Validator function
 */
export const createFormValidator = (schema, options = {}) => {
  return (values, overrideOptions = {}) => {
    return validateForm(values, schema, { ...options, ...overrideOptions });
  };
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Constants
  VALIDATION_RULES,
  FORM_ERROR_MESSAGES,
  PATTERNS,
  
  // Individual validators
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateMinValue,
  validateMaxValue,
  validatePattern,
  validateUrl,
  validatePhone,
  validateDate,
  validateNumber,
  validateUsername,
  validateFileSize,
  validateFileType,
  
  // GPS Lab validators
  validateBarakaAmount,
  validateStageNumber,
  validateMissionId,
  validateProblemStatement,
  
  // Form-level validation
  validateField,
  validateForm,
  createFormValidator
};