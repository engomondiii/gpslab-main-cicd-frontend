/**
 * GPS Lab Platform - File Validator
 * 
 * Comprehensive file validation utilities for the GPS Lab MMORPG educational platform.
 * Handles file type, size, dimensions, and content validation for uploads.
 * 
 * @module utils/validators/file.validator
 * @version 1.0.0
 */

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Maximum file sizes by category (in bytes)
 */
export const MAX_FILE_SIZES = {
  // Images
  avatar: 2 * 1024 * 1024,           // 2MB
  thumbnail: 1 * 1024 * 1024,        // 1MB
  image: 5 * 1024 * 1024,            // 5MB
  banner: 10 * 1024 * 1024,          // 10MB
  
  // Documents
  document: 10 * 1024 * 1024,        // 10MB
  pdf: 25 * 1024 * 1024,             // 25MB
  presentation: 50 * 1024 * 1024,    // 50MB
  
  // Media
  audio: 50 * 1024 * 1024,           // 50MB
  video: 500 * 1024 * 1024,          // 500MB
  
  // GPS Lab specific
  missionAsset: 10 * 1024 * 1024,    // 10MB
  projectFile: 100 * 1024 * 1024,    // 100MB
  badgeImage: 512 * 1024,            // 512KB
  evidenceFile: 25 * 1024 * 1024     // 25MB for checkpoint evidence
};

/**
 * Allowed MIME types by category
 */
export const ALLOWED_MIME_TYPES = {
  image: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ],
  avatar: [
    'image/jpeg',
    'image/png',
    'image/webp'
  ],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv'
  ],
  pdf: [
    'application/pdf'
  ],
  audio: [
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/webm',
    'audio/mp4'
  ],
  video: [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime'
  ],
  // GPS Lab specific
  missionAsset: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'text/csv'
  ],
  evidenceFile: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'video/mp4',
    'video/webm',
    'audio/mpeg',
    'audio/wav'
  ]
};

/**
 * File extensions by category
 */
export const ALLOWED_EXTENSIONS = {
  image: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
  avatar: ['.jpg', '.jpeg', '.png', '.webp'],
  document: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv'],
  pdf: ['.pdf'],
  audio: ['.mp3', '.wav', '.ogg', '.webm', '.m4a'],
  video: ['.mp4', '.webm', '.ogg', '.mov'],
  missionAsset: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.txt', '.csv'],
  evidenceFile: ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.mp4', '.webm', '.mp3', '.wav']
};

/**
 * Image dimension constraints
 */
export const IMAGE_DIMENSIONS = {
  avatar: {
    minWidth: 100,
    minHeight: 100,
    maxWidth: 2000,
    maxHeight: 2000,
    aspectRatio: 1 // Square
  },
  thumbnail: {
    minWidth: 200,
    minHeight: 150,
    maxWidth: 800,
    maxHeight: 600
  },
  banner: {
    minWidth: 1200,
    minHeight: 300,
    maxWidth: 3840,
    maxHeight: 2160,
    aspectRatioMin: 3,  // 3:1 minimum
    aspectRatioMax: 5   // 5:1 maximum
  },
  badge: {
    minWidth: 64,
    minHeight: 64,
    maxWidth: 512,
    maxHeight: 512,
    aspectRatio: 1 // Square
  }
};

/**
 * Error messages by locale
 */
export const FILE_ERROR_MESSAGES = {
  required: {
    'en-US': 'Please select a file',
    'ko-KR': '파일을 선택해주세요',
    'sw-KE': 'Tafadhali chagua faili'
  },
  invalidType: {
    'en-US': 'Invalid file type. Allowed: {types}',
    'ko-KR': '허용되지 않는 파일 형식입니다. 허용: {types}',
    'sw-KE': 'Aina ya faili si sahihi. Zinaruhusiwa: {types}'
  },
  tooLarge: {
    'en-US': 'File is too large. Maximum size: {max}',
    'ko-KR': '파일이 너무 큽니다. 최대 크기: {max}',
    'sw-KE': 'Faili ni kubwa sana. Ukubwa wa juu: {max}'
  },
  tooSmall: {
    'en-US': 'File is too small. Minimum size: {min}',
    'ko-KR': '파일이 너무 작습니다. 최소 크기: {min}',
    'sw-KE': 'Faili ni ndogo sana. Ukubwa wa chini: {min}'
  },
  dimensionsTooSmall: {
    'en-US': 'Image dimensions too small. Minimum: {width}x{height}',
    'ko-KR': '이미지 크기가 너무 작습니다. 최소: {width}x{height}',
    'sw-KE': 'Vipimo vya picha ni vidogo sana. Vya chini: {width}x{height}'
  },
  dimensionsTooLarge: {
    'en-US': 'Image dimensions too large. Maximum: {width}x{height}',
    'ko-KR': '이미지 크기가 너무 큽니다. 최대: {width}x{height}',
    'sw-KE': 'Vipimo vya picha ni vikubwa sana. Vya juu: {width}x{height}'
  },
  invalidAspectRatio: {
    'en-US': 'Invalid aspect ratio. Expected: {ratio}',
    'ko-KR': '잘못된 종횡비입니다. 필요: {ratio}',
    'sw-KE': 'Uwiano si sahihi. Inahitajika: {ratio}'
  },
  tooManyFiles: {
    'en-US': 'Too many files. Maximum: {max}',
    'ko-KR': '파일이 너무 많습니다. 최대: {max}',
    'sw-KE': 'Faili nyingi sana. Upeo: {max}'
  },
  duplicateFile: {
    'en-US': 'This file has already been added',
    'ko-KR': '이 파일은 이미 추가되었습니다',
    'sw-KE': 'Faili hii tayari imeongezwa'
  },
  corruptedFile: {
    'en-US': 'File appears to be corrupted',
    'ko-KR': '파일이 손상된 것 같습니다',
    'sw-KE': 'Faili inaonekana kuharibika'
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
 * Gets error message with interpolation
 * @param {string} key - Error key
 * @param {string} locale - Locale code
 * @param {Object} params - Interpolation parameters
 * @returns {string} Error message
 */
const getErrorMessage = (key, locale = 'en-US', params = {}) => {
  const messages = FILE_ERROR_MESSAGES[key];
  if (!messages) return 'Invalid file';
  
  const normalizedLocale = normalizeLocale(locale);
  let message = messages[normalizedLocale] || messages['en-US'];
  
  Object.keys(params).forEach(param => {
    message = message.replace(`{${param}}`, params[param]);
  });
  
  return message;
};

/**
 * Formats file size for display
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
};

/**
 * Parses file size string to bytes
 * @param {string} sizeStr - Size string (e.g., "5MB", "1024KB")
 * @returns {number} Size in bytes
 */
export const parseFileSize = (sizeStr) => {
  const match = sizeStr.match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB|TB)?$/i);
  if (!match) return 0;
  
  const value = parseFloat(match[1]);
  const unit = (match[2] || 'B').toUpperCase();
  
  const multipliers = {
    'B': 1,
    'KB': 1024,
    'MB': 1024 * 1024,
    'GB': 1024 * 1024 * 1024,
    'TB': 1024 * 1024 * 1024 * 1024
  };
  
  return Math.floor(value * (multipliers[unit] || 1));
};

/**
 * Gets file extension from filename
 * @param {string} filename - File name
 * @returns {string} Extension (lowercase, with dot)
 */
export const getFileExtension = (filename) => {
  if (!filename) return '';
  const lastDot = filename.lastIndexOf('.');
  return lastDot !== -1 ? filename.slice(lastDot).toLowerCase() : '';
};

/**
 * Gets MIME type from filename (approximation)
 * @param {string} filename - File name
 * @returns {string|null} MIME type or null
 */
export const getMimeTypeFromExtension = (filename) => {
  const ext = getFileExtension(filename);
  
  const mimeMap = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.txt': 'text/plain',
    '.csv': 'text/csv',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime'
  };
  
  return mimeMap[ext] || null;
};

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

/**
 * Validates file existence
 * @param {File|null} file - File to validate
 * @param {Object} options - Options
 * @returns {Object} Validation result
 */
export const validateFileRequired = (file, options = {}) => {
  const { locale = 'en-US' } = options;
  const isValid = file instanceof File || (file && file.name && file.size);
  
  return {
    isValid,
    error: isValid ? null : getErrorMessage('required', locale)
  };
};

/**
 * Validates file size
 * @param {File|number} file - File or size in bytes
 * @param {Object} options - Options
 * @returns {Object} Validation result
 */
export const validateFileSize = (file, options = {}) => {
  const { 
    locale = 'en-US',
    maxSize,
    minSize = 0,
    category
  } = options;
  
  const size = typeof file === 'number' ? file : file?.size || 0;
  const max = maxSize || (category ? MAX_FILE_SIZES[category] : MAX_FILE_SIZES.document);
  
  if (size < minSize) {
    return {
      isValid: false,
      error: getErrorMessage('tooSmall', locale, { min: formatFileSize(minSize) })
    };
  }
  
  if (size > max) {
    return {
      isValid: false,
      error: getErrorMessage('tooLarge', locale, { max: formatFileSize(max) })
    };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validates file type by MIME type
 * @param {File|string} file - File or MIME type
 * @param {Object} options - Options
 * @returns {Object} Validation result
 */
export const validateFileType = (file, options = {}) => {
  const { 
    locale = 'en-US',
    allowedTypes,
    category
  } = options;
  
  const mimeType = typeof file === 'string' ? file : file?.type || '';
  const allowed = allowedTypes || (category ? ALLOWED_MIME_TYPES[category] : ALLOWED_MIME_TYPES.document);
  
  if (!allowed || allowed.length === 0) {
    return { isValid: true, error: null };
  }
  
  const isValid = allowed.some(type => {
    if (type.endsWith('/*')) {
      return mimeType.startsWith(type.slice(0, -1));
    }
    return mimeType === type;
  });
  
  if (!isValid) {
    // Get friendly type names
    const typeNames = allowed.map(type => {
      const parts = type.split('/');
      return parts[1]?.replace('vnd.', '').split('.').pop() || type;
    });
    
    return {
      isValid: false,
      error: getErrorMessage('invalidType', locale, { types: typeNames.join(', ') })
    };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validates file extension
 * @param {File|string} file - File or filename
 * @param {Object} options - Options
 * @returns {Object} Validation result
 */
export const validateFileExtension = (file, options = {}) => {
  const { 
    locale = 'en-US',
    allowedExtensions,
    category
  } = options;
  
  const filename = typeof file === 'string' ? file : file?.name || '';
  const extension = getFileExtension(filename);
  const allowed = allowedExtensions || (category ? ALLOWED_EXTENSIONS[category] : ALLOWED_EXTENSIONS.document);
  
  if (!allowed || allowed.length === 0) {
    return { isValid: true, error: null };
  }
  
  const isValid = allowed.includes(extension);
  
  if (!isValid) {
    return {
      isValid: false,
      error: getErrorMessage('invalidType', locale, { types: allowed.join(', ') })
    };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validates image dimensions
 * @param {Object} dimensions - Image dimensions { width, height }
 * @param {Object} options - Options
 * @returns {Object} Validation result
 */
export const validateImageDimensions = (dimensions, options = {}) => {
  const { 
    locale = 'en-US',
    constraints,
    category
  } = options;
  
  const { width, height } = dimensions;
  const rules = constraints || (category ? IMAGE_DIMENSIONS[category] : {});
  
  if (!rules || Object.keys(rules).length === 0) {
    return { isValid: true, error: null };
  }
  
  // Check minimum dimensions
  if (rules.minWidth && width < rules.minWidth) {
    return {
      isValid: false,
      error: getErrorMessage('dimensionsTooSmall', locale, { 
        width: rules.minWidth, 
        height: rules.minHeight || rules.minWidth 
      })
    };
  }
  
  if (rules.minHeight && height < rules.minHeight) {
    return {
      isValid: false,
      error: getErrorMessage('dimensionsTooSmall', locale, { 
        width: rules.minWidth || rules.minHeight, 
        height: rules.minHeight 
      })
    };
  }
  
  // Check maximum dimensions
  if (rules.maxWidth && width > rules.maxWidth) {
    return {
      isValid: false,
      error: getErrorMessage('dimensionsTooLarge', locale, { 
        width: rules.maxWidth, 
        height: rules.maxHeight || rules.maxWidth 
      })
    };
  }
  
  if (rules.maxHeight && height > rules.maxHeight) {
    return {
      isValid: false,
      error: getErrorMessage('dimensionsTooLarge', locale, { 
        width: rules.maxWidth || rules.maxHeight, 
        height: rules.maxHeight 
      })
    };
  }
  
  // Check aspect ratio
  if (rules.aspectRatio) {
    const actualRatio = width / height;
    const tolerance = 0.01; // 1% tolerance
    
    if (Math.abs(actualRatio - rules.aspectRatio) > tolerance) {
      return {
        isValid: false,
        error: getErrorMessage('invalidAspectRatio', locale, { 
          ratio: rules.aspectRatio === 1 ? '1:1 (square)' : `${rules.aspectRatio}:1` 
        })
      };
    }
  }
  
  // Check aspect ratio range
  if (rules.aspectRatioMin || rules.aspectRatioMax) {
    const actualRatio = width / height;
    
    if (rules.aspectRatioMin && actualRatio < rules.aspectRatioMin) {
      return {
        isValid: false,
        error: getErrorMessage('invalidAspectRatio', locale, { 
          ratio: `at least ${rules.aspectRatioMin}:1` 
        })
      };
    }
    
    if (rules.aspectRatioMax && actualRatio > rules.aspectRatioMax) {
      return {
        isValid: false,
        error: getErrorMessage('invalidAspectRatio', locale, { 
          ratio: `at most ${rules.aspectRatioMax}:1` 
        })
      };
    }
  }
  
  return { isValid: true, error: null };
};

/**
 * Reads image dimensions from file
 * @param {File} file - Image file
 * @returns {Promise<Object>} Promise resolving to { width, height }
 */
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type?.startsWith('image/')) {
      reject(new Error('Not an image file'));
      return;
    }
    
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
};

// =============================================================================
// COMPREHENSIVE VALIDATION
// =============================================================================

/**
 * File validation result type
 * @typedef {Object} FileValidationResult
 * @property {boolean} isValid - Overall validity
 * @property {string[]} errors - Array of error messages
 * @property {Object} details - Detailed validation results
 */

/**
 * Validates a file comprehensively
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Promise<FileValidationResult>} Validation result
 */
export const validateFile = async (file, options = {}) => {
  const { 
    locale = 'en-US',
    required = false,
    category,
    maxSize,
    minSize,
    allowedTypes,
    allowedExtensions,
    checkDimensions = false,
    dimensionConstraints
  } = options;
  
  const errors = [];
  const details = {
    size: null,
    type: null,
    extension: null,
    dimensions: null
  };
  
  // Required check
  if (required && !file) {
    return {
      isValid: false,
      errors: [getErrorMessage('required', locale)],
      details
    };
  }
  
  if (!file) {
    return { isValid: true, errors: [], details };
  }
  
  // Size validation
  const sizeResult = validateFileSize(file, { locale, maxSize, minSize, category });
  details.size = sizeResult;
  if (!sizeResult.isValid) {
    errors.push(sizeResult.error);
  }
  
  // Type validation
  const typeResult = validateFileType(file, { locale, allowedTypes, category });
  details.type = typeResult;
  if (!typeResult.isValid) {
    errors.push(typeResult.error);
  }
  
  // Extension validation
  const extResult = validateFileExtension(file, { locale, allowedExtensions, category });
  details.extension = extResult;
  if (!extResult.isValid && !errors.includes(extResult.error)) {
    errors.push(extResult.error);
  }
  
  // Image dimensions validation
  if (checkDimensions && file.type?.startsWith('image/')) {
    try {
      const dimensions = await getImageDimensions(file);
      const dimResult = validateImageDimensions(dimensions, { 
        locale, 
        constraints: dimensionConstraints,
        category 
      });
      details.dimensions = { ...dimResult, ...dimensions };
      if (!dimResult.isValid) {
        errors.push(dimResult.error);
      }
    } catch (error) {
      errors.push(getErrorMessage('corruptedFile', locale));
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    details
  };
};

/**
 * Validates multiple files
 * @param {File[]} files - Files to validate
 * @param {Object} options - Validation options
 * @returns {Promise<Object>} Validation results
 */
export const validateFiles = async (files, options = {}) => {
  const { 
    locale = 'en-US',
    maxFiles,
    preventDuplicates = true,
    ...fileOptions
  } = options;
  
  const results = [];
  const seenNames = new Set();
  let totalSize = 0;
  
  // Check file count
  if (maxFiles && files.length > maxFiles) {
    return {
      isValid: false,
      error: getErrorMessage('tooManyFiles', locale, { max: maxFiles }),
      results: []
    };
  }
  
  for (const file of files) {
    // Check duplicates
    if (preventDuplicates && seenNames.has(file.name)) {
      results.push({
        file: file.name,
        isValid: false,
        errors: [getErrorMessage('duplicateFile', locale)]
      });
      continue;
    }
    
    seenNames.add(file.name);
    totalSize += file.size;
    
    const result = await validateFile(file, { locale, ...fileOptions });
    results.push({
      file: file.name,
      ...result
    });
  }
  
  const invalidCount = results.filter(r => !r.isValid).length;
  
  return {
    isValid: invalidCount === 0,
    totalSize,
    totalSizeFormatted: formatFileSize(totalSize),
    fileCount: files.length,
    validCount: files.length - invalidCount,
    invalidCount,
    results
  };
};

// =============================================================================
// GPS LAB SPECIFIC VALIDATORS
// =============================================================================

/**
 * Validates avatar upload
 * @param {File} file - Avatar file
 * @param {Object} options - Options
 * @returns {Promise<FileValidationResult>} Validation result
 */
export const validateAvatar = (file, options = {}) => {
  return validateFile(file, {
    ...options,
    category: 'avatar',
    checkDimensions: true
  });
};

/**
 * Validates mission asset upload
 * @param {File} file - Mission asset file
 * @param {Object} options - Options
 * @returns {Promise<FileValidationResult>} Validation result
 */
export const validateMissionAsset = (file, options = {}) => {
  return validateFile(file, {
    ...options,
    category: 'missionAsset'
  });
};

/**
 * Validates checkpoint evidence upload
 * @param {File} file - Evidence file
 * @param {Object} options - Options
 * @returns {Promise<FileValidationResult>} Validation result
 */
export const validateEvidenceFile = (file, options = {}) => {
  return validateFile(file, {
    ...options,
    category: 'evidenceFile'
  });
};

/**
 * Validates badge image upload
 * @param {File} file - Badge image file
 * @param {Object} options - Options
 * @returns {Promise<FileValidationResult>} Validation result
 */
export const validateBadgeImage = (file, options = {}) => {
  return validateFile(file, {
    ...options,
    category: 'avatar', // Uses avatar MIME types
    maxSize: MAX_FILE_SIZES.badgeImage,
    checkDimensions: true,
    dimensionConstraints: IMAGE_DIMENSIONS.badge
  });
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
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
};