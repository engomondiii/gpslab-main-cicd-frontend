/* ============================================
   GPS LAB - Form Validator
   Generic form validation utilities
   ============================================ */

import { validateEmail } from './email.validator';
import { validatePassword, validatePasswordMatch } from './password.validator';

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {Object} Validation result
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (value === null || value === undefined || value === '') {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }

  if (typeof value === 'string' && value.trim().length === 0) {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }

  if (Array.isArray(value) && value.length === 0) {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate minimum length
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length
 * @param {string} fieldName - Field name for error message
 * @returns {Object} Validation result
 */
export const validateMinLength = (value, minLength, fieldName = 'This field') => {
  if (!value || value.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters`,
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate maximum length
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum length
 * @param {string} fieldName - Field name for error message
 * @returns {Object} Validation result
 */
export const validateMaxLength = (value, maxLength, fieldName = 'This field') => {
  if (value && value.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} must be less than ${maxLength} characters`,
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate minimum value
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {string} fieldName - Field name for error message
 * @returns {Object} Validation result
 */
export const validateMin = (value, min, fieldName = 'This field') => {
  if (value < min) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${min}`,
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate maximum value
 * @param {number} value - Value to validate
 * @param {number} max - Maximum value
 * @param {string} fieldName - Field name for error message
 * @returns {Object} Validation result
 */
export const validateMax = (value, max, fieldName = 'This field') => {
  if (value > max) {
    return {
      isValid: false,
      error: `${fieldName} must be at most ${max}`,
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate pattern (regex)
 * @param {string} value - Value to validate
 * @param {RegExp} pattern - Regular expression pattern
 * @param {string} errorMessage - Custom error message
 * @returns {Object} Validation result
 */
export const validatePattern = (value, pattern, errorMessage = 'Invalid format') => {
  if (!value || !pattern.test(value)) {
    return {
      isValid: false,
      error: errorMessage,
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {Object} Validation result
 */
export const validateURL = (url) => {
  if (!url) {
    return {
      isValid: false,
      error: 'URL is required',
    };
  }

  try {
    new URL(url);
    return {
      isValid: true,
      error: null,
    };
  } catch (error) {
    return {
      isValid: false,
      error: 'Invalid URL format',
    };
  }
};

/**
 * Validate phone number (basic)
 * @param {string} phone - Phone number to validate
 * @returns {Object} Validation result
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return {
      isValid: false,
      error: 'Phone number is required',
    };
  }

  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  const cleaned = phone.replace(/\D/g, '');

  if (!phoneRegex.test(phone) || cleaned.length < 10) {
    return {
      isValid: false,
      error: 'Invalid phone number',
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate date
 * @param {string|Date} date - Date to validate
 * @returns {Object} Validation result
 */
export const validateDate = (date) => {
  if (!date) {
    return {
      isValid: false,
      error: 'Date is required',
    };
  }

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return {
      isValid: false,
      error: 'Invalid date',
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate form with multiple fields
 * @param {Object} formData - Form data object
 * @param {Object} rules - Validation rules
 * @returns {Object} Validation result
 */
export const validateForm = (formData, rules) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach(fieldName => {
    const fieldRules = rules[fieldName];
    const fieldValue = formData[fieldName];

    // Required validation
    if (fieldRules.required) {
      const result = validateRequired(fieldValue, fieldRules.label || fieldName);
      if (!result.isValid) {
        errors[fieldName] = result.error;
        isValid = false;
        return;
      }
    }

    // Skip other validations if field is empty and not required
    if (!fieldValue && !fieldRules.required) {
      return;
    }

    // Email validation
    if (fieldRules.email) {
      const result = validateEmail(fieldValue);
      if (!result.isValid) {
        errors[fieldName] = result.error;
        isValid = false;
        return;
      }
    }

    // Password validation
    if (fieldRules.password) {
      const result = validatePassword(fieldValue);
      if (!result.isValid) {
        errors[fieldName] = result.errors[0];
        isValid = false;
        return;
      }
    }

    // Password match validation
    if (fieldRules.matchField) {
      const result = validatePasswordMatch(formData[fieldRules.matchField], fieldValue);
      if (!result.isValid) {
        errors[fieldName] = result.error;
        isValid = false;
        return;
      }
    }

    // Min length validation
    if (fieldRules.minLength) {
      const result = validateMinLength(fieldValue, fieldRules.minLength, fieldRules.label || fieldName);
      if (!result.isValid) {
        errors[fieldName] = result.error;
        isValid = false;
        return;
      }
    }

    // Max length validation
    if (fieldRules.maxLength) {
      const result = validateMaxLength(fieldValue, fieldRules.maxLength, fieldRules.label || fieldName);
      if (!result.isValid) {
        errors[fieldName] = result.error;
        isValid = false;
        return;
      }
    }

    // Min value validation
    if (fieldRules.min !== undefined) {
      const result = validateMin(fieldValue, fieldRules.min, fieldRules.label || fieldName);
      if (!result.isValid) {
        errors[fieldName] = result.error;
        isValid = false;
        return;
      }
    }

    // Max value validation
    if (fieldRules.max !== undefined) {
      const result = validateMax(fieldValue, fieldRules.max, fieldRules.label || fieldName);
      if (!result.isValid) {
        errors[fieldName] = result.error;
        isValid = false;
        return;
      }
    }

    // Pattern validation
    if (fieldRules.pattern) {
      const result = validatePattern(fieldValue, fieldRules.pattern, fieldRules.patternError || 'Invalid format');
      if (!result.isValid) {
        errors[fieldName] = result.error;
        isValid = false;
        return;
      }
    }

    // URL validation
    if (fieldRules.url) {
      const result = validateURL(fieldValue);
      if (!result.isValid) {
        errors[fieldName] = result.error;
        isValid = false;
        return;
      }
    }

    // Phone validation
    if (fieldRules.phone) {
      const result = validatePhone(fieldValue);
      if (!result.isValid) {
        errors[fieldName] = result.error;
        isValid = false;
        return;
      }
    }

    // Date validation
    if (fieldRules.date) {
      const result = validateDate(fieldValue);
      if (!result.isValid) {
        errors[fieldName] = result.error;
        isValid = false;
        return;
      }
    }

    // Custom validation
    if (fieldRules.custom) {
      const result = fieldRules.custom(fieldValue, formData);
      if (!result.isValid) {
        errors[fieldName] = result.error;
        isValid = false;
        return;
      }
    }
  });

  return {
    isValid,
    errors,
  };
};

export default {
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateMin,
  validateMax,
  validatePattern,
  validateURL,
  validatePhone,
  validateDate,
  validateForm,
};