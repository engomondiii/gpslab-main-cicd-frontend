/**
 * GPS Lab Platform - GPO Validator Utilities
 *
 * Validation functions for all GPO form inputs.
 *
 * @module utils/validators/gpo.validator
 */

// Validation constants
const LIMITS = {
  MIN_NAME: 3,
  MIN_BACKGROUND: 50,
  MIN_COMMUNITY: 50,
  MIN_CURRENT_REALITY: 100,
  MIN_DESIRED_STATE: 100,
  MIN_THE_GAP: 50,
  MIN_EVIDENCE: 2,
  MIN_TESTIMONY: 100,
  MIN_DAILY_BURDEN: 50,
  MIN_VISION: 50,
  MIN_SKILLS: 3,
  MIN_COLLAB_NEEDS: 50,
  MAX_VIDEO_SIZE: 100 * 1024 * 1024,   // 100MB
  MAX_MEDIA_SIZE: 50 * 1024 * 1024,     // 50MB
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ACCEPTED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/quicktime'],
};

/**
 * Validate Stage -4 (Introduction) data
 * @param {object} data
 * @returns {{ valid: boolean, errors: object }}
 */
export const validateStageNeg4 = (data = {}) => {
  const errors = {};

  if (!data.fullName?.trim()) {
    errors.fullName = 'Full name is required';
  } else if (data.fullName.trim().length < LIMITS.MIN_NAME) {
    errors.fullName = `Name must be at least ${LIMITS.MIN_NAME} characters`;
  }

  if (!data.location?.trim()) {
    errors.location = 'Location is required';
  }

  if (!data.background?.trim()) {
    errors.background = 'Background is required';
  } else if (data.background.trim().length < LIMITS.MIN_BACKGROUND) {
    errors.background = `Background must be at least ${LIMITS.MIN_BACKGROUND} characters`;
  }

  if (!data.community?.trim()) {
    errors.community = 'Community description is required';
  } else if (data.community.trim().length < LIMITS.MIN_COMMUNITY) {
    errors.community = `Community description must be at least ${LIMITS.MIN_COMMUNITY} characters`;
  }

  if (!data.selfieVideo) {
    errors.selfieVideo = 'A selfie video is required';
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

/**
 * Validate Stage -3 (Problem Statement) data
 * @param {object} data
 * @returns {{ valid: boolean, errors: object }}
 */
export const validateStageNeg3 = (data = {}) => {
  const errors = {};

  if (!data.currentReality?.trim()) {
    errors.currentReality = 'Current reality description is required';
  } else if (data.currentReality.trim().length < LIMITS.MIN_CURRENT_REALITY) {
    errors.currentReality = `Must be at least ${LIMITS.MIN_CURRENT_REALITY} characters`;
  }

  if (!data.desiredState?.trim()) {
    errors.desiredState = 'Desired state description is required';
  } else if (data.desiredState.trim().length < LIMITS.MIN_DESIRED_STATE) {
    errors.desiredState = `Must be at least ${LIMITS.MIN_DESIRED_STATE} characters`;
  }

  if (!data.theGap?.trim()) {
    errors.theGap = 'Gap definition is required';
  } else if (data.theGap.trim().length < LIMITS.MIN_THE_GAP) {
    errors.theGap = `Must be at least ${LIMITS.MIN_THE_GAP} characters`;
  }

  if (!data.evidence || data.evidence.length < LIMITS.MIN_EVIDENCE) {
    errors.evidence = `Upload at least ${LIMITS.MIN_EVIDENCE} pieces of evidence`;
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

/**
 * Validate Stage -2 (Pain/Impact) data
 * @param {object} data
 * @returns {{ valid: boolean, errors: object }}
 */
export const validateStageNeg2 = (data = {}) => {
  const errors = {};

  if (!data.testimony?.trim()) {
    errors.testimony = 'Personal testimony is required';
  } else if (data.testimony.trim().length < LIMITS.MIN_TESTIMONY) {
    errors.testimony = `Testimony must be at least ${LIMITS.MIN_TESTIMONY} characters`;
  }

  if (!data.dailyBurden?.trim()) {
    errors.dailyBurden = 'Daily burden description is required';
  } else if (data.dailyBurden.trim().length < LIMITS.MIN_DAILY_BURDEN) {
    errors.dailyBurden = `Must be at least ${LIMITS.MIN_DAILY_BURDEN} characters`;
  }

  if (!data.affectedPeople?.trim()) {
    errors.affectedPeople = 'Please describe who is affected';
  }

  if (!data.testimonyVideo) {
    errors.testimonyVideo = 'A testimony video is required';
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

/**
 * Validate Stage -1 (Vision) data
 * @param {object} data
 * @returns {{ valid: boolean, errors: object }}
 */
export const validateStageNeg1 = (data = {}) => {
  const errors = {};

  if (!data.visionStatement?.trim()) {
    errors.visionStatement = 'Vision statement is required';
  } else if (data.visionStatement.trim().length < LIMITS.MIN_VISION) {
    errors.visionStatement = `Vision must be at least ${LIMITS.MIN_VISION} characters`;
  }

  if (!data.successMetrics?.trim()) {
    errors.successMetrics = 'Success metrics are required';
  }

  if (!data.timeframe?.trim()) {
    errors.timeframe = 'Timeframe is required';
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

/**
 * Validate Stage 0 (Call to Action) data
 * @param {object} data
 * @returns {{ valid: boolean, errors: object }}
 */
export const validateStage0 = (data = {}) => {
  const errors = {};

  if (!data.collaborationNeeds?.trim()) {
    errors.collaborationNeeds = 'Collaboration needs description is required';
  } else if (data.collaborationNeeds.trim().length < LIMITS.MIN_COLLAB_NEEDS) {
    errors.collaborationNeeds = `Must be at least ${LIMITS.MIN_COLLAB_NEEDS} characters`;
  }

  if (!data.whatYouOffer?.trim()) {
    errors.whatYouOffer = 'Please describe what you offer collaborators';
  }

  if (!data.invitationVideo) {
    errors.invitationVideo = 'An invitation video is required';
  }

  if (!data.skillsNeeded || data.skillsNeeded.length < LIMITS.MIN_SKILLS) {
    errors.skillsNeeded = `Select at least ${LIMITS.MIN_SKILLS} skills`;
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

/**
 * Validate a media file
 * @param {File} file
 * @param {'image'|'video'|'any'} type
 * @returns {{ valid: boolean, error: string|null }}
 */
export const validateMediaFile = (file, type = 'any') => {
  if (!file) return { valid: false, error: 'No file provided' };

  const isImage = LIMITS.ACCEPTED_IMAGE_TYPES.includes(file.type);
  const isVideo = LIMITS.ACCEPTED_VIDEO_TYPES.includes(file.type);

  if (type === 'image' && !isImage) {
    return { valid: false, error: `${file.name} must be an image (JPG, PNG, GIF, WebP)` };
  }

  if (type === 'video' && !isVideo) {
    return { valid: false, error: `${file.name} must be a video (MP4, WebM, MOV)` };
  }

  if (type === 'any' && !isImage && !isVideo) {
    return { valid: false, error: `${file.name} is not a supported format` };
  }

  const maxSize = isVideo ? LIMITS.MAX_VIDEO_SIZE : LIMITS.MAX_MEDIA_SIZE;
  if (file.size > maxSize) {
    const limitMB = Math.round(maxSize / (1024 * 1024));
    return { valid: false, error: `${file.name} is too large (max ${limitMB}MB)` };
  }

  return { valid: true, error: null };
};

/**
 * Validate all GPO stages at once
 * @param {object} stageData - All stage data keyed by stage number
 * @returns {{ valid: boolean, stageErrors: object }}
 */
export const validateAllGPOStages = (stageData = {}) => {
  const results = {
    [-4]: validateStageNeg4(stageData[-4] || {}),
    [-3]: validateStageNeg3(stageData[-3] || {}),
    [-2]: validateStageNeg2(stageData[-2] || {}),
    [-1]: validateStageNeg1(stageData[-1] || {}),
    [0]: validateStage0(stageData[0] || {}),
  };

  const stageErrors = {};
  let allValid = true;

  Object.entries(results).forEach(([stage, result]) => {
    if (!result.valid) {
      stageErrors[stage] = result.errors;
      allValid = false;
    }
  });

  return { valid: allValid, stageErrors };
};

export { LIMITS };

export default {
  validateStageNeg4,
  validateStageNeg3,
  validateStageNeg2,
  validateStageNeg1,
  validateStage0,
  validateMediaFile,
  validateAllGPOStages,
  LIMITS,
};