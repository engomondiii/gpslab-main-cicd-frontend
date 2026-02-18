/**
 * GPS Lab Platform - GPO Helper Utilities
 *
 * Helper functions for GPO Call operations.
 *
 * @module utils/helpers/gpo.helper
 */

/**
 * Calculate GPO Call completion percentage
 * @param {number[]} completedStages - Array of completed stage numbers (-4 to 0)
 * @returns {number} Percentage complete (0-100)
 */
export const calculateGPOProgress = (completedStages = []) => {
  const totalStages = 5; // Stages -4, -3, -2, -1, 0
  return Math.round((completedStages.length / totalStages) * 100);
};

/**
 * Get next incomplete GPO stage
 * @param {number[]} completedStages
 * @returns {number} Next stage number
 */
export const getNextGPOStage = (completedStages = []) => {
  const allStages = [-4, -3, -2, -1, 0];
  return allStages.find(s => !completedStages.includes(s)) ?? null;
};

/**
 * Get GPO stage label
 * @param {number} stageNumber
 * @returns {string} Human-readable stage label
 */
export const getGPOStageLabel = (stageNumber) => {
  const labels = {
    '-4': 'Who are you?',
    '-3': 'What is your problem?',
    '-2': 'Whose pain?',
    '-1': 'What future?',
    '0': 'How can GPS help?',
  };
  return labels[String(stageNumber)] || `Stage ${stageNumber}`;
};

/**
 * Check if GPO Call is complete
 * @param {number[]} completedStages
 * @returns {boolean}
 */
export const isGPOCallComplete = (completedStages = []) => {
  const required = [-4, -3, -2, -1, 0];
  return required.every(s => completedStages.includes(s));
};

/**
 * Build a showcase summary object from stage data
 * @param {object} stageData - Stage data keyed by stage number
 * @returns {object} Showcase summary
 */
export const buildShowcaseSummary = (stageData = {}) => {
  return {
    owner: {
      name: stageData[-4]?.fullName || '',
      location: stageData[-4]?.location || '',
      background: stageData[-4]?.background || '',
      community: stageData[-4]?.community || '',
      selfieVideo: stageData[-4]?.selfieVideo || null,
    },
    problem: {
      currentReality: stageData[-3]?.currentReality || '',
      desiredState: stageData[-3]?.desiredState || '',
      theGap: stageData[-3]?.theGap || '',
      evidence: stageData[-3]?.evidence || [],
      statistics: stageData[-3]?.statistics || [],
    },
    pain: {
      testimony: stageData[-2]?.testimony || '',
      dailyBurden: stageData[-2]?.dailyBurden || '',
      affectedPeople: stageData[-2]?.affectedPeople || '',
      testimonyVideo: stageData[-2]?.testimonyVideo || null,
      dailyLifeMedia: stageData[-2]?.dailyLifeMedia || [],
    },
    vision: {
      statement: stageData[-1]?.visionStatement || '',
      successMetrics: stageData[-1]?.successMetrics || '',
      timeframe: stageData[-1]?.timeframe || '',
      futureMedia: stageData[-1]?.futureMedia || [],
      beforeImages: stageData[-1]?.beforeImages || [],
      afterImages: stageData[-1]?.afterImages || [],
    },
    callToAction: {
      collaborationNeeds: stageData[0]?.collaborationNeeds || '',
      whatYouOffer: stageData[0]?.whatYouOffer || '',
      invitationVideo: stageData[0]?.invitationVideo || null,
      skillsNeeded: stageData[0]?.skillsNeeded || [],
    },
    createdAt: new Date().toISOString(),
    status: 'pending_review',
  };
};

/**
 * Count total media files across all stages
 * @param {object} stageData
 * @returns {number}
 */
export const countTotalMediaFiles = (stageData = {}) => {
  let count = 0;
  if (stageData[-4]?.selfieVideo) count++;
  if (stageData[-3]?.evidence?.length) count += stageData[-3].evidence.length;
  if (stageData[-2]?.testimonyVideo) count++;
  if (stageData[-2]?.dailyLifeMedia?.length) count += stageData[-2].dailyLifeMedia.length;
  if (stageData[-1]?.futureMedia?.length) count += stageData[-1].futureMedia.length;
  if (stageData[-1]?.beforeImages?.length) count += stageData[-1].beforeImages.length;
  if (stageData[-1]?.afterImages?.length) count += stageData[-1].afterImages.length;
  if (stageData[0]?.invitationVideo) count++;
  return count;
};

/**
 * Format file size for display
 * @param {number} bytes
 * @returns {string} Human-readable size
 */
export const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Generate a unique GPO project ID
 * @returns {string}
 */
export const generateGPOProjectId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `GPO-${timestamp}-${random}`;
};

/**
 * Truncate text for display
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength = 200) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Get stage completion status color
 * @param {string} status - 'completed' | 'current' | 'locked' | 'available'
 * @returns {string} CSS color value
 */
export const getStageStatusColor = (status) => {
  const colors = {
    completed: 'var(--success, #2a9d8f)',
    current: 'var(--gps-primary, #00d4ff)',
    available: 'var(--neutral-600, #8b949e)',
    locked: 'var(--neutral-300, #d0d7de)',
  };
  return colors[status] || colors.locked;
};

/**
 * Estimate showcase reading time in minutes
 * @param {object} showcaseData - Built showcase summary
 * @returns {number} Minutes
 */
export const estimateReadingTime = (showcaseData = {}) => {
  const allText = [
    showcaseData.owner?.background,
    showcaseData.owner?.community,
    showcaseData.problem?.currentReality,
    showcaseData.problem?.desiredState,
    showcaseData.problem?.theGap,
    showcaseData.pain?.testimony,
    showcaseData.pain?.dailyBurden,
    showcaseData.vision?.statement,
    showcaseData.vision?.successMetrics,
    showcaseData.callToAction?.collaborationNeeds,
    showcaseData.callToAction?.whatYouOffer,
  ].filter(Boolean).join(' ');

  const wordCount = allText.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200)); // 200 words/min average
};

export default {
  calculateGPOProgress,
  getNextGPOStage,
  getGPOStageLabel,
  isGPOCallComplete,
  buildShowcaseSummary,
  countTotalMediaFiles,
  formatFileSize,
  generateGPOProjectId,
  truncateText,
  getStageStatusColor,
  estimateReadingTime,
};