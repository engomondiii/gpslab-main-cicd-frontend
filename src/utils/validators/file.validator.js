/* ============================================
   GPS LAB - File Validator
   File upload validation utilities
   ============================================ */

/**
 * Allowed file types configuration
 */
export const FileTypes = {
  IMAGES: {
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    maxSize: 5 * 1024 * 1024, // 5MB
  },
  DOCUMENTS: {
    extensions: ['.pdf', '.doc', '.docx', '.txt', '.rtf'],
    mimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/rtf'],
    maxSize: 10 * 1024 * 1024, // 10MB
  },
  SPREADSHEETS: {
    extensions: ['.xls', '.xlsx', '.csv'],
    mimeTypes: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'],
    maxSize: 10 * 1024 * 1024, // 10MB
  },
  PRESENTATIONS: {
    extensions: ['.ppt', '.pptx'],
    mimeTypes: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    maxSize: 20 * 1024 * 1024, // 20MB
  },
  VIDEOS: {
    extensions: ['.mp4', '.mov', '.avi', '.mkv', '.webm'],
    mimeTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm'],
    maxSize: 100 * 1024 * 1024, // 100MB
  },
  AUDIO: {
    extensions: ['.mp3', '.wav', '.ogg', '.m4a'],
    mimeTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'],
    maxSize: 20 * 1024 * 1024, // 20MB
  },
};

/**
 * Validate file type
 * @param {File} file - File to validate
 * @param {Array} allowedExtensions - Allowed file extensions
 * @param {Array} allowedMimeTypes - Allowed MIME types
 * @returns {Object} Validation result
 */
export const validateFileType = (file, allowedExtensions = [], allowedMimeTypes = []) => {
  if (!file) {
    return {
      isValid: false,
      error: 'No file provided',
    };
  }

  const fileName = file.name.toLowerCase();
  const fileExtension = '.' + fileName.split('.').pop();
  const fileMimeType = file.type.toLowerCase();

  // Check extension
  if (allowedExtensions.length > 0) {
    const extensionValid = allowedExtensions.some(ext => 
      fileName.endsWith(ext.toLowerCase())
    );

    if (!extensionValid) {
      return {
        isValid: false,
        error: `File type not allowed. Allowed types: ${allowedExtensions.join(', ')}`,
      };
    }
  }

  // Check MIME type
  if (allowedMimeTypes.length > 0) {
    const mimeTypeValid = allowedMimeTypes.some(mime => 
      fileMimeType === mime.toLowerCase()
    );

    if (!mimeTypeValid) {
      return {
        isValid: false,
        error: 'Invalid file type',
      };
    }
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSize - Maximum file size in bytes
 * @returns {Object} Validation result
 */
export const validateFileSize = (file, maxSize) => {
  if (!file) {
    return {
      isValid: false,
      error: 'No file provided',
    };
  }

  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    
    return {
      isValid: false,
      error: `File is too large (${fileSizeMB}MB). Maximum size is ${maxSizeMB}MB`,
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate file (type and size)
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateFile = (file, options = {}) => {
  const {
    allowedExtensions = [],
    allowedMimeTypes = [],
    maxSize = 10 * 1024 * 1024, // Default 10MB
  } = options;

  if (!file) {
    return {
      isValid: false,
      error: 'No file provided',
    };
  }

  // Validate type
  const typeValidation = validateFileType(file, allowedExtensions, allowedMimeTypes);
  if (!typeValidation.isValid) {
    return typeValidation;
  }

  // Validate size
  const sizeValidation = validateFileSize(file, maxSize);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate multiple files
 * @param {FileList|Array} files - Files to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateFiles = (files, options = {}) => {
  const {
    maxFiles = 10,
    ...fileOptions
  } = options;

  if (!files || files.length === 0) {
    return {
      isValid: false,
      error: 'No files provided',
      results: [],
    };
  }

  if (files.length > maxFiles) {
    return {
      isValid: false,
      error: `Too many files. Maximum is ${maxFiles}`,
      results: [],
    };
  }

  const results = Array.from(files).map(file => ({
    file,
    ...validateFile(file, fileOptions),
  }));

  const allValid = results.every(result => result.isValid);

  return {
    isValid: allValid,
    error: allValid ? null : 'Some files are invalid',
    results,
  };
};

/**
 * Check if file is an image
 * @param {File} file - File to check
 * @returns {boolean}
 */
export const isImageFile = (file) => {
  if (!file) return false;
  return file.type.startsWith('image/');
};

/**
 * Check if file is a video
 * @param {File} file - File to check
 * @returns {boolean}
 */
export const isVideoFile = (file) => {
  if (!file) return false;
  return file.type.startsWith('video/');
};

/**
 * Check if file is a document
 * @param {File} file - File to check
 * @returns {boolean}
 */
export const isDocumentFile = (file) => {
  if (!file) return false;
  const documentTypes = FileTypes.DOCUMENTS.mimeTypes;
  return documentTypes.includes(file.type.toLowerCase());
};

/**
 * Get file extension
 * @param {File|string} file - File or filename
 * @returns {string} File extension
 */
export const getFileExtension = (file) => {
  const fileName = typeof file === 'string' ? file : file.name;
  return fileName.split('.').pop().toLowerCase();
};

/**
 * Get file name without extension
 * @param {File|string} file - File or filename
 * @returns {string} File name without extension
 */
export const getFileNameWithoutExtension = (file) => {
  const fileName = typeof file === 'string' ? file : file.name;
  return fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Read file as data URL (for image preview)
 * @param {File} file - File to read
 * @returns {Promise<string>} Data URL
 */
export const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Read file as text
 * @param {File} file - File to read
 * @returns {Promise<string>} File content as text
 */
export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export default {
  FileTypes,
  validateFileType,
  validateFileSize,
  validateFile,
  validateFiles,
  isImageFile,
  isVideoFile,
  isDocumentFile,
  getFileExtension,
  getFileNameWithoutExtension,
  formatFileSize,
  readFileAsDataURL,
  readFileAsText,
};