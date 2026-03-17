/**
 * GPS 101 Validators
 * Validation functions for GPS 101 submissions and deliverables
 * CORRECT STRUCTURE: 5 Stages with specific deliverables
 */

import { GPS_101_STRUCTURE } from '../helpers/gps101.helper';

/**
 * Validation constants
 */
export const VALIDATION_RULES = {
  CHECKPOINT: {
    MIN_LENGTH: 100,
    MAX_LENGTH: 5000,
    MIN_WORDS: 20
  },
  DELIVERABLES: {
    'Identity Statement': {
      type: 'text',
      minLength: 200,
      maxLength: 2000,
      minWords: 40
    },
    'Problem Candidate List': {
      type: 'list',
      minItems: 5,
      maxItems: 20,
      itemMinLength: 50
    },
    'Problem Owner Story': {
      type: 'narrative',
      minLength: 500,
      maxLength: 3000,
      minParagraphs: 3
    },
    'Life Purpose Statement': {
      type: 'statement',
      minLength: 50,
      maxLength: 500,
      maxSentences: 3
    },
    'Purpose-driven Project Plan': {
      type: 'project',
      requiredFields: ['title', 'description', 'goals', 'timeline', 'impact'],
      minLength: 100
    }
  },
  FILE: {
    MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_VIDEO_SIZE: 100 * 1024 * 1024, // 100MB
    MAX_DOCUMENT_SIZE: 25 * 1024 * 1024, // 25MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
    ALLOWED_DOCUMENT_TYPES: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  }
};

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
  const minLength = checkpoint.minLength || VALIDATION_RULES.CHECKPOINT.MIN_LENGTH;
  if (data.answer.length < minLength) {
    errors.push(`Answer must be at least ${minLength} characters`);
  }
  
  // Check maximum length
  const maxLength = checkpoint.maxLength || VALIDATION_RULES.CHECKPOINT.MAX_LENGTH;
  if (data.answer.length > maxLength) {
    errors.push(`Answer must not exceed ${maxLength} characters`);
  }
  
  // Check word count
  const words = data.answer.trim().split(/\s+/).filter(w => w.length > 0);
  if (words.length < VALIDATION_RULES.CHECKPOINT.MIN_WORDS) {
    errors.push(`Answer must have at least ${VALIDATION_RULES.CHECKPOINT.MIN_WORDS} words`);
  }
  
  // Check upload requirement
  if (checkpoint.requiresUpload && !data.fileUpload) {
    errors.push('File upload is required');
  }
  
  // Check video requirement
  if (checkpoint.requiresVideo && !data.videoUpload) {
    errors.push('Video submission is required');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validate Stage 1 deliverable: Identity Statement
 */
export const validateIdentityStatement = (data) => {
  const errors = [];
  const rules = VALIDATION_RULES.DELIVERABLES['Identity Statement'];
  
  if (!data || typeof data !== 'string') {
    errors.push('Identity statement must be text');
    return { valid: false, errors };
  }
  
  // Length validation
  if (data.length < rules.minLength) {
    errors.push(`Identity statement must be at least ${rules.minLength} characters (currently ${data.length})`);
  }
  
  if (data.length > rules.maxLength) {
    errors.push(`Identity statement must not exceed ${rules.maxLength} characters (currently ${data.length})`);
  }
  
  // Word count validation
  const words = data.trim().split(/\s+/).filter(w => w.length > 0);
  if (words.length < rules.minWords) {
    errors.push(`Identity statement should have at least ${rules.minWords} words (currently ${words.length})`);
  }
  
  // Content validation
  if (data.trim().length < 50) {
    errors.push('Identity statement appears to be too brief');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    wordCount: words.length,
    charCount: data.length
  };
};

/**
 * Validate Stage 2 deliverable: Problem Candidate List
 */
export const validateProblemCandidateList = (data) => {
  const errors = [];
  const rules = VALIDATION_RULES.DELIVERABLES['Problem Candidate List'];
  
  if (!Array.isArray(data)) {
    errors.push('Problem candidate list must be an array');
    return { valid: false, errors };
  }
  
  // Count validation
  if (data.length < rules.minItems) {
    errors.push(`At least ${rules.minItems} problem candidates required (currently ${data.length})`);
  }
  
  if (data.length > rules.maxItems) {
    errors.push(`Maximum ${rules.maxItems} problem candidates allowed (currently ${data.length})`);
  }
  
  // Validate each problem candidate
  data.forEach((problem, index) => {
    if (!problem || typeof problem !== 'object') {
      errors.push(`Problem candidate ${index + 1} must be an object`);
      return;
    }
    
    if (!problem.title || typeof problem.title !== 'string' || problem.title.length < 5) {
      errors.push(`Problem candidate ${index + 1} needs a title (at least 5 characters)`);
    }
    
    if (!problem.description || typeof problem.description !== 'string' || problem.description.length < rules.itemMinLength) {
      errors.push(`Problem candidate ${index + 1} needs a description (at least ${rules.itemMinLength} characters)`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    itemCount: data.length
  };
};

/**
 * Validate Stage 3 deliverable: Problem Owner Story
 */
export const validateProblemOwnerStory = (data) => {
  const errors = [];
  const rules = VALIDATION_RULES.DELIVERABLES['Problem Owner Story'];
  
  if (!data || typeof data !== 'string') {
    errors.push('Problem owner story must be text');
    return { valid: false, errors };
  }
  
  // Length validation
  if (data.length < rules.minLength) {
    errors.push(`Story must be at least ${rules.minLength} characters (currently ${data.length})`);
  }
  
  if (data.length > rules.maxLength) {
    errors.push(`Story must not exceed ${rules.maxLength} characters (currently ${data.length})`);
  }
  
  // Paragraph structure validation
  const paragraphs = data.split('\n\n').filter(p => p.trim().length > 0);
  if (paragraphs.length < rules.minParagraphs) {
    errors.push(`Story should have at least ${rules.minParagraphs} paragraphs for proper narrative structure (currently ${paragraphs.length})`);
  }
  
  // Content validation
  const words = data.trim().split(/\s+/).filter(w => w.length > 0);
  if (words.length < 100) {
    errors.push('Story should be more detailed (at least 100 words)');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    charCount: data.length,
    paragraphCount: paragraphs.length,
    wordCount: words.length
  };
};

/**
 * Validate Stage 4 deliverable: Life Purpose Statement
 */
export const validateLifePurposeStatement = (data) => {
  const errors = [];
  const rules = VALIDATION_RULES.DELIVERABLES['Life Purpose Statement'];
  
  if (!data || typeof data !== 'string') {
    errors.push('Life purpose statement must be text');
    return { valid: false, errors };
  }
  
  // Length validation
  if (data.length < rules.minLength) {
    errors.push(`Purpose statement must be at least ${rules.minLength} characters (currently ${data.length})`);
  }
  
  if (data.length > rules.maxLength) {
    errors.push(`Purpose statement must not exceed ${rules.maxLength} characters (currently ${data.length})`);
  }
  
  // Sentence count validation (should be concise)
  const sentences = data.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length > rules.maxSentences) {
    errors.push(`Purpose statement should be concise (maximum ${rules.maxSentences} sentences, currently ${sentences.length})`);
  }
  
  // Content validation
  if (data.trim().length < 30) {
    errors.push('Purpose statement appears to be too brief');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    charCount: data.length,
    sentenceCount: sentences.length
  };
};

/**
 * Validate Stage 5 deliverable: Purpose-driven Project Plan
 */
export const validatePurposeDrivenProject = (data) => {
  const errors = [];
  const rules = VALIDATION_RULES.DELIVERABLES['Purpose-driven Project Plan'];
  
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    errors.push('Purpose-driven project must be an object');
    return { valid: false, errors };
  }
  
  // Check required fields
  const missingFields = [];
  rules.requiredFields.forEach(field => {
    if (!data[field]) {
      missingFields.push(field);
      errors.push(`Required field missing: ${field}`);
    } else if (typeof data[field] === 'string' && data[field].length < rules.minLength) {
      errors.push(`Field '${field}' needs more detail (at least ${rules.minLength} characters)`);
    }
  });
  
  // Validate specific fields if present
  if (data.title && data.title.length < 5) {
    errors.push('Project title must be at least 5 characters');
  }
  
  if (data.description && data.description.length < 100) {
    errors.push('Project description must be at least 100 characters');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    missingFields
  };
};

/**
 * Validate deliverable by stage number
 */
export const validateDeliverableByStage = (stageNumber, data) => {
  const stage = GPS_101_STRUCTURE.STAGES[stageNumber];
  if (!stage) {
    return {
      valid: false,
      errors: ['Invalid stage number']
    };
  }
  
  const deliverableName = stage.deliverable;
  
  switch (deliverableName) {
    case 'Identity Statement':
      return validateIdentityStatement(data);
    
    case 'Problem Candidate List':
      return validateProblemCandidateList(data);
    
    case 'Problem Owner Story':
      return validateProblemOwnerStory(data);
    
    case 'Life Purpose Statement':
      return validateLifePurposeStatement(data);
    
    case 'Purpose-driven Project Plan':
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
  
  const currentLength = text.length;
  
  if (currentLength < minLength) {
    errors.push(`Text must be at least ${minLength} characters (currently ${currentLength})`);
  }
  
  if (currentLength > maxLength) {
    errors.push(`Text must not exceed ${maxLength} characters (currently ${currentLength})`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    currentLength,
    minLength,
    maxLength
  };
};

/**
 * Validate word count
 */
export const validateWordCount = (text, minWords, maxWords = null) => {
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
    errors,
    fileSize: file.size,
    fileType: file.type
  };
};

/**
 * Validate image upload
 */
export const validateImageUpload = (file) => {
  return validateFileUpload(
    file,
    VALIDATION_RULES.FILE.ALLOWED_IMAGE_TYPES,
    VALIDATION_RULES.FILE.MAX_IMAGE_SIZE
  );
};

/**
 * Validate video upload
 */
export const validateVideoUpload = (file) => {
  return validateFileUpload(
    file,
    VALIDATION_RULES.FILE.ALLOWED_VIDEO_TYPES,
    VALIDATION_RULES.FILE.MAX_VIDEO_SIZE
  );
};

/**
 * Validate document upload
 */
export const validateDocumentUpload = (file) => {
  return validateFileUpload(
    file,
    VALIDATION_RULES.FILE.ALLOWED_DOCUMENT_TYPES,
    VALIDATION_RULES.FILE.MAX_DOCUMENT_SIZE
  );
};

/**
 * Export all validator functions
 */
export default {
  VALIDATION_RULES,
  validateCheckpointSubmission,
  validateIdentityStatement,
  validateProblemCandidateList,
  validateProblemOwnerStory,
  validateLifePurposeStatement,
  validatePurposeDrivenProject,
  validateDeliverableByStage,
  validateTextLength,
  validateWordCount,
  validateFileUpload,
  validateImageUpload,
  validateVideoUpload,
  validateDocumentUpload
};