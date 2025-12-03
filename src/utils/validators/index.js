/**
 * GPS Lab Platform - Validators Index
 * 
 * Central export file for all validation utilities.
 * Import validators from this file for convenience.
 * 
 * @module utils/validators
 * @version 1.0.0
 */

// =============================================================================
// EMAIL VALIDATOR
// =============================================================================
export {
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
} from './email.validator.js';

// =============================================================================
// PASSWORD VALIDATOR
// =============================================================================
export {
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
} from './password.validator.js';

// =============================================================================
// FORM VALIDATOR
// =============================================================================
export {
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
  validateFileSize as validateFormFileSize,
  validateFileType as validateFormFileType,
  
  // GPS Lab validators
  validateBarakaAmount,
  validateStageNumber,
  validateMissionId,
  validateProblemStatement,
  
  // Form-level validation
  validateField,
  validateForm,
  createFormValidator
} from './form.validator.js';

// =============================================================================
// FILE VALIDATOR
// =============================================================================
export {
  // Constants
  MAX_FILE_SIZES,
  ALLOWED_MIME_TYPES,
  ALLOWED_EXTENSIONS,
  IMAGE_DIMENSIONS,
  FILE_ERROR_MESSAGES,
  
  // Utilities
  formatFileSize,
  parseFileSize,
  getFileExtension,
  getMimeTypeFromExtension,
  getImageDimensions,
  
  // Individual validators
  validateFileRequired,
  validateFileSize,
  validateFileType,
  validateFileExtension,
  validateImageDimensions,
  
  // Comprehensive validation
  validateFile,
  validateFiles,
  
  // GPS Lab specific
  validateAvatar,
  validateMissionAsset,
  validateEvidenceFile,
  validateBadgeImage
} from './file.validator.js';

// =============================================================================
// DEFAULT EXPORTS (Namespaced)
// =============================================================================
import emailValidator from './email.validator.js';
import passwordValidator from './password.validator.js';
import formValidator from './form.validator.js';
import fileValidator from './file.validator.js';

export {
  emailValidator,
  passwordValidator,
  formValidator,
  fileValidator
};

/**
 * Combined validators object for convenience
 */
export default {
  email: emailValidator,
  password: passwordValidator,
  form: formValidator,
  file: fileValidator
};