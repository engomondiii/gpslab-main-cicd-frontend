/* ============================================
   GPS LAB - Password Validator
   Password strength and validation utilities
   ============================================ */

/**
 * Password strength levels
 */
export const PasswordStrength = {
  VERY_WEAK: 'very-weak',
  WEAK: 'weak',
  MEDIUM: 'medium',
  STRONG: 'strong',
  VERY_STRONG: 'very-strong',
};

/**
 * Password requirements configuration
 */
export const PasswordRequirements = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

/**
 * Validate password against requirements
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
export const validatePassword = (password) => {
  const errors = [];

  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      errors: ['Password is required'],
      requirements: {},
    };
  }

  const requirements = {
    minLength: password.length >= PasswordRequirements.minLength,
    maxLength: password.length <= PasswordRequirements.maxLength,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /[0-9]/.test(password),
    hasSpecialChars: new RegExp(`[${PasswordRequirements.specialChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`).test(password),
  };

  if (!requirements.minLength) {
    errors.push(`Password must be at least ${PasswordRequirements.minLength} characters`);
  }

  if (!requirements.maxLength) {
    errors.push(`Password must be less than ${PasswordRequirements.maxLength} characters`);
  }

  if (PasswordRequirements.requireUppercase && !requirements.hasUppercase) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (PasswordRequirements.requireLowercase && !requirements.hasLowercase) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (PasswordRequirements.requireNumbers && !requirements.hasNumbers) {
    errors.push('Password must contain at least one number');
  }

  if (PasswordRequirements.requireSpecialChars && !requirements.hasSpecialChars) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
    requirements,
  };
};

/**
 * Calculate password strength
 * @param {string} password - Password to evaluate
 * @returns {Object} Strength result
 */
export const calculatePasswordStrength = (password) => {
  if (!password) {
    return {
      strength: PasswordStrength.VERY_WEAK,
      score: 0,
      feedback: 'Password is required',
    };
  }

  let score = 0;
  const feedback = [];

  // Length scoring
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Character variety scoring
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (new RegExp(`[${PasswordRequirements.specialChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`).test(password)) score += 1;

  // Penalize common patterns
  if (/^[0-9]+$/.test(password)) {
    score -= 2;
    feedback.push('Avoid using only numbers');
  }

  if (/^[a-zA-Z]+$/.test(password)) {
    score -= 1;
    feedback.push('Add numbers or special characters');
  }

  // Check for sequential characters
  if (/(?:abc|bcd|cde|def|123|234|345|456|567|678|789)/i.test(password)) {
    score -= 1;
    feedback.push('Avoid sequential characters');
  }

  // Check for repeated characters
  if (/(.)\1{2,}/.test(password)) {
    score -= 1;
    feedback.push('Avoid repeated characters');
  }

  // Common weak passwords
  const commonPasswords = ['password', '12345678', 'qwerty', 'abc123', 'letmein'];
  if (commonPasswords.some(weak => password.toLowerCase().includes(weak))) {
    score -= 3;
    feedback.push('This password is too common');
  }

  // Determine strength level
  let strength;
  if (score < 2) {
    strength = PasswordStrength.VERY_WEAK;
    feedback.push('Use a longer password with mixed characters');
  } else if (score < 4) {
    strength = PasswordStrength.WEAK;
    feedback.push('Add more character variety');
  } else if (score < 6) {
    strength = PasswordStrength.MEDIUM;
    feedback.push('Consider making it longer');
  } else if (score < 8) {
    strength = PasswordStrength.STRONG;
  } else {
    strength = PasswordStrength.VERY_STRONG;
  }

  return {
    strength,
    score: Math.max(0, Math.min(10, score)),
    feedback: feedback.length > 0 ? feedback[0] : 'Strong password',
  };
};

/**
 * Check if password matches confirmation
 * @param {string} password - Password
 * @param {string} confirmPassword - Confirmation password
 * @returns {Object} Match result
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) {
    return {
      isValid: false,
      error: 'Please confirm your password',
    };
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Passwords do not match',
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Generate random password
 * @param {number} length - Password length
 * @param {Object} options - Generation options
 * @returns {string} Generated password
 */
export const generatePassword = (
  length = 16,
  options = {
    uppercase: true,
    lowercase: true,
    numbers: true,
    specialChars: true,
  }
) => {
  let charset = '';

  if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (options.numbers) charset += '0123456789';
  if (options.specialChars) charset += PasswordRequirements.specialChars;

  if (charset.length === 0) {
    charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  }

  let password = '';
  const randomValues = new Uint32Array(length);
  window.crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charset.length];
  }

  return password;
};

/**
 * Check if password has been compromised (basic check)
 * @param {string} password - Password to check
 * @returns {boolean} True if potentially compromised
 */
export const isCommonPassword = (password) => {
  const commonPasswords = [
    'password', '123456', '12345678', 'qwerty', 'abc123',
    'monkey', '1234567', 'letmein', 'trustno1', 'dragon',
    'baseball', 'iloveyou', 'master', 'sunshine', 'ashley',
    'bailey', 'passw0rd', 'shadow', '123123', '654321',
  ];

  return commonPasswords.includes(password.toLowerCase());
};

/**
 * Get password strength color
 * @param {string} strength - Strength level
 * @returns {string} Color code
 */
export const getPasswordStrengthColor = (strength) => {
  const colors = {
    [PasswordStrength.VERY_WEAK]: '#E74C3C',
    [PasswordStrength.WEAK]: '#FF8C42',
    [PasswordStrength.MEDIUM]: '#F1C40F',
    [PasswordStrength.STRONG]: '#2A9D8F',
    [PasswordStrength.VERY_STRONG]: '#2ECC71',
  };

  return colors[strength] || colors[PasswordStrength.VERY_WEAK];
};

export default {
  PasswordStrength,
  PasswordRequirements,
  validatePassword,
  calculatePasswordStrength,
  validatePasswordMatch,
  generatePassword,
  isCommonPassword,
  getPasswordStrengthColor,
};