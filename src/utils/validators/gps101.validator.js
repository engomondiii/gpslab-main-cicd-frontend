/**
 * GPS 101 Validators
 * 
 * Validation functions for GPS 101 submissions and data.
 */

import { GPS_101_CONFIG } from '../../config/gps101.config';
import { GPS_101_VALIDATION } from '../constants/gps101.constants';

/**
 * Validate checkpoint submission
 */
export const validateCheckpointSubmission = (checkpoint, data) => {
  const errors = [];
  
  if (!data || !data.answer) {
    errors.push('Answer is required');
    return { valid: false, errors };
  }
  
  // Check minimum length
  if (checkpoint.minLength && data.answer.length < checkpoint.minLength) {
    errors.push(`Answer must be at least ${checkpoint.minLength} characters`);
  }
  
  // Check maximum length
  if (checkpoint.maxLength && data.answer.length > checkpoint.maxLength) {
    errors.push(`Answer must not exceed ${checkpoint.maxLength} characters`);
  }
  
  // Check upload requirement
  if (checkpoint.requiresUpload && !data.fileUpload) {
    errors.push('File upload is required');
  }
  
  // Check video requirement
  if (checkpoint.requiresVideo && !data.videoUpload) {
    errors.push('Video submission is required');
  }
  
  // Check reflection if required
  if (checkpoint.type === 'reflection' && data.reflection) {
    if (data.reflection.length < 50) {
      errors.push('Reflection must be at least 50 characters');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validate identity statement (Stage 1 deliverable)
 */
export const validateIdentityStatement = (data) => {
  const errors = [];
  
  if (!data || typeof data !== 'string') {
    errors.push('Identity statement must be text');
    return { valid: false, errors };
  }
  
  const deliverable = GPS_101_CONFIG.DELIVERABLES.find(d => d.id === 'identity-statement');
  
  if (data.length < deliverable.minLength) {
    errors.push(`Identity statement must be at least ${deliverable.minLength} characters`);
  }
  
  if (data.length > deliverable.maxLength) {
    errors.push(`Identity statement must not exceed ${deliverable.maxLength} characters`);
  }
  
  // Check for meaningful content
  const words = data.trim().split(/\s+/);
  if (words.length < 20) {
    errors.push('Identity statement should be more detailed (at least 20 words)');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validate problem candidate list (Stage 2 deliverable)
 */
export const validateProblemCandidate = (data) => {
  const errors = [];
  
  if (!Array.isArray(data)) {
    errors.push('Problem candidate must be a list');
    return { valid: false, errors };
  }
  
  const deliverable = GPS_101_CONFIG.DELIVERABLES.find(d => d.id === 'problem-candidate');
  
  if (data.length < deliverable.minItems) {
    errors.push(`At least ${deliverable.minItems} problem candidates required`);
  }
  
  if (data.length > deliverable.maxItems) {
    errors.push(`Maximum ${deliverable.maxItems} problem candidates allowed`);
  }
  
  // Validate each problem candidate
  data.forEach((problem, index) => {
    if (!problem || typeof problem !== 'object') {
      errors.push(`Problem candidate ${index + 1} must be an object`);
      return;
    }
    
    if (!problem.title || problem.title.length < 5) {
      errors.push(`Problem candidate ${index + 1} needs a title (at least 5 characters)`);
    }
    
    if (!problem.description || problem.description.length < 50) {
      errors.push(`Problem candidate ${index + 1} needs a description (at least 50 characters)`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validate problem owner story (Stage 3 deliverable)
 */
export const validateProblemOwnerStory = (data) => {
  const errors = [];
  
  if (!data || typeof data !== 'string') {
    errors.push('Problem owner story must be text');
    return { valid: false, errors };
  }
  
  const deliverable = GPS_101_CONFIG.DELIVERABLES.find(d => d.id === 'problem-owner-story');
  
  if (data.length < deliverable.minLength) {
    errors.push(`Story must be at least ${deliverable.minLength} characters`);
  }
  
  if (data.length > deliverable.maxLength) {
    errors.push(`Story must not exceed ${deliverable.maxLength} characters`);
  }
  
  // Check for narrative structure
  const paragraphs = data.split('\n\n').filter(p => p.trim().length > 0);
  if (paragraphs.length < 3) {
    errors.push('Story should have at least 3 paragraphs for proper narrative structure');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validate life purpose statement (Stage 4 deliverable)
 */
export const validateLifePurposeStatement = (data) => {
  const errors = [];
  
  if (!data || typeof data !== 'string') {
    errors.push('Life purpose statement must be text');
    return { valid: false, errors };
  }
  
  const deliverable = GPS_101_CONFIG.DELIVERABLES.find(d => d.id === 'life-purpose-statement');
  
  if (data.length < deliverable.minLength) {
    errors.push(`Purpose statement must be at least ${deliverable.minLength} characters`);
  }
  
  if (data.length > deliverable.maxLength) {
    errors.push(`Purpose statement must not exceed ${deliverable.maxLength} characters`);
  }
  
  // Check for clarity - should be 1-2 sentences
  const sentences = data.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length > 3) {
    errors.push('Purpose statement should be concise (1-3 sentences)');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validate purpose-driven project (Stage 5 deliverable)
 */
export const validatePurposeDrivenProject = (data) => {
  const errors = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('Purpose-driven project must be an object');
    return { valid: false, errors };
  }
  
  const deliverable = GPS_101_CONFIG.DELIVERABLES.find(d => d.id === 'purpose-driven-project');
  
  // Check required fields
  deliverable.requiredFields.forEach(field => {
    if (!data[field]) {
      errors.push(`Required field missing: ${field}`);
    } else if (typeof data[field] === 'string' && data[field].length < 50) {
      errors.push(`Field '${field}' needs more detail (at least 50 characters)`);
    }
  });
  
  // Validate specific fields
  if (data.title && data.title.length < 5) {
    errors.push('Project title must be at least 5 characters');
  }
  
  if (data.description && data.description.length < 100) {
    errors.push('Project description must be at least 100 characters');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validate deliverable by type
 */
export const validateDeliverable = (deliverableId, data) => {
  switch (deliverableId) {
    case 'identity-statement':
      return validateIdentityStatement(data);
    
    case 'problem-candidate':
      return validateProblemCandidate(data);
    
    case 'problem-owner-story':
      return validateProblemOwnerStory(data);
    
    case 'life-purpose-statement':
      return validateLifePurposeStatement(data);
    
    case 'purpose-driven-project':
      return validatePurposeDrivenProject(data);
    
    default:
      return {
        valid: false,
        errors: ['Unknown deliverable type']
      };
  }
};

/**
 * Validate text length
 */
export const validateTextLength = (text, minLength, maxLength) => {
  const errors = [];
  
  if (!text) {
    errors.push('Text is required');
    return { valid: false, errors };
  }
  
  if (text.length < minLength) {
    errors.push(`Text must be at least ${minLength} characters (currently ${text.length})`);
  }
  
  if (text.length > maxLength) {
    errors.push(`Text must not exceed ${maxLength} characters (currently ${text.length})`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    currentLength: text.length,
    minLength,
    maxLength
  };
};

/**
 * Validate word count
 */
export const validateWordCount = (text, minWords, maxWords) => {
  const errors = [];
  
  if (!text) {
    errors.push('Text is required');
    return { valid: false, errors };
  }
  
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  
  if (wordCount < minWords) {
    errors.push(`Text must have at least ${minWords} words (currently ${wordCount})`);
  }
  
  if (maxWords && wordCount > maxWords) {
    errors.push(`Text must not exceed ${maxWords} words (currently ${wordCount})`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    currentWords: wordCount,
    minWords,
    maxWords
  };
};

/**
 * Validate file upload
 */
export const validateFileUpload = (file, allowedTypes, maxSize) => {
  const errors = [];
  
  if (!file) {
    errors.push('File is required');
    return { valid: false, errors };
  }
  
  // Check file type
  if (allowedTypes && !allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }
  
  // Check file size
  if (maxSize && file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    errors.push(`File size ${fileSizeMB}MB exceeds maximum ${maxSizeMB}MB`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validate video upload
 */
export const validateVideoUpload = (file) => {
  const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  const maxSize = 100 * 1024 * 1024; // 100MB
  
  return validateFileUpload(file, allowedTypes, maxSize);
};

/**
 * Validate image upload
 */
export const validateImageUpload = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  return validateFileUpload(file, allowedTypes, maxSize);
};

/**
 * Validate document upload
 */
export const validateDocumentUpload = (file) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  const maxSize = 25 * 1024 * 1024; // 25MB
  
  return validateFileUpload(file, allowedTypes, maxSize);
};

/**
 * Validate R2R usage
 */
export const validateR2RUsage = (r2rBalance, checkpointStatus) => {
  const errors = [];
  
  if (r2rBalance <= 0) {
    errors.push('No retry rights available');
  }
  
  if (checkpointStatus !== 'failed') {
    errors.push('Can only retry failed checkpoints');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validate pR2R usage
 */
export const validatePR2RUsage = (pr2rBalance, checkpointStatus, failedCount) => {
  const errors = [];
  
  if (pr2rBalance <= 0) {
    errors.push('No provisional retry rights available');
  }
  
  if (checkpointStatus !== 'failed') {
    errors.push('Can only retry failed checkpoints');
  }
  
  if (failedCount < GPS_101_VALIDATION.CHECKPOINT.PR2R_THRESHOLD) {
    errors.push(`Need at least ${GPS_101_VALIDATION.CHECKPOINT.PR2R_THRESHOLD} failed attempts to use pR2R`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Export all validator functions
 */
export default {
  validateCheckpointSubmission,
  validateIdentityStatement,
  validateProblemCandidate,
  validateProblemOwnerStory,
  validateLifePurposeStatement,
  validatePurposeDrivenProject,
  validateDeliverable,
  validateTextLength,
  validateWordCount,
  validateFileUpload,
  validateVideoUpload,
  validateImageUpload,
  validateDocumentUpload,
  validateR2RUsage,
  validatePR2RUsage
};