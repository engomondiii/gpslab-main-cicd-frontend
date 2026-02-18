/**
 * GPS Lab Platform - GPO Formatter Utilities
 *
 * Functions to format GPO data for display and API submission.
 *
 * @module utils/formatters/gpo.formatter
 */

/**
 * Format stage number for display
 * @param {number} stageNumber
 * @returns {string} e.g. "Stage -4" or "Stage 0"
 */
export const formatStageNumber = (stageNumber) => {
  if (stageNumber === 0) return 'Stage 0 (Final)';
  return `Stage ${stageNumber}`;
};

/**
 * Format skills list for display
 * @param {string[]} skillIds - Array of skill IDs
 * @param {object[]} allSkills - Full skills array with id/label
 * @returns {string} Comma-separated skill labels
 */
export const formatSkillsList = (skillIds = [], allSkills = []) => {
  return skillIds
    .map(id => allSkills.find(s => s.id === id)?.label || id)
    .join(', ');
};

/**
 * Format date for display
 * @param {string|Date} date
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format video duration for display
 * @param {number} seconds
 * @returns {string} e.g. "1:45"
 */
export const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
};

/**
 * Format media count display
 * @param {number} count
 * @param {'image'|'video'|'file'} type
 * @returns {string}
 */
export const formatMediaCount = (count, type = 'file') => {
  if (count === 0) return `No ${type}s`;
  if (count === 1) return `1 ${type}`;
  return `${count} ${type}s`;
};

/**
 * Format showcase status for display
 * @param {string} status
 * @returns {{ label: string, color: string }}
 */
export const formatShowcaseStatus = (status) => {
  const statuses = {
    draft: { label: 'Draft', color: 'var(--neutral-500, #8b949e)' },
    pending_review: { label: 'Pending Review', color: 'var(--warning, #f39c12)' },
    approved: { label: 'Live', color: 'var(--success, #2a9d8f)' },
    revision_needed: { label: 'Revision Needed', color: 'var(--error, #e74c3c)' },
    archived: { label: 'Archived', color: 'var(--neutral-400, #a8dadc)' },
  };
  return statuses[status] || { label: status, color: 'var(--neutral-500, #8b949e)' };
};

/**
 * Format number of affected people
 * @param {string} affectedPeople - Raw text describing affected people
 * @returns {string} Display-ready string
 */
export const formatAffectedCount = (affectedPeople = '') => {
  if (!affectedPeople) return 'Community members';
  // Try to extract a number from the text
  const match = affectedPeople.match(/(\d[\d,]*)/);
  if (match) return `${match[1].replace(',', ',')} people`;
  return 'Community members';
};

/**
 * Truncate text with ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateForCard = (text = '', maxLength = 120) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '...';
};

/**
 * Format showcase data for API submission
 * Strips blob URLs and prepares for multipart form data
 * @param {object} showcaseData - Built showcase summary
 * @returns {object} API-ready object (blobs stay as blobs)
 */
export const formatForAPISubmission = (showcaseData = {}) => {
  return {
    owner_name: showcaseData.owner?.name,
    owner_location: showcaseData.owner?.location,
    owner_background: showcaseData.owner?.background,
    owner_community: showcaseData.owner?.community,
    problem_current_reality: showcaseData.problem?.currentReality,
    problem_desired_state: showcaseData.problem?.desiredState,
    problem_the_gap: showcaseData.problem?.theGap,
    problem_statistics: JSON.stringify(showcaseData.problem?.statistics || []),
    pain_testimony: showcaseData.pain?.testimony,
    pain_daily_burden: showcaseData.pain?.dailyBurden,
    pain_affected_people: showcaseData.pain?.affectedPeople,
    vision_statement: showcaseData.vision?.statement,
    vision_success_metrics: showcaseData.vision?.successMetrics,
    vision_timeframe: showcaseData.vision?.timeframe,
    cta_collaboration_needs: showcaseData.callToAction?.collaborationNeeds,
    cta_what_you_offer: showcaseData.callToAction?.whatYouOffer,
    cta_skills_needed: JSON.stringify(showcaseData.callToAction?.skillsNeeded || []),
    created_at: showcaseData.createdAt,
    status: showcaseData.status,
  };
};

/**
 * Format XP reward string
 * @param {number} xp
 * @returns {string}
 */
export const formatXPReward = (xp) => `+${xp} XP`;

/**
 * Format Baraka reward string
 * @param {number} baraka
 * @returns {string}
 */
export const formatBarakaReward = (baraka) => `+${baraka} ⚡ Baraka`;

/**
 * Format stage completion message
 * @param {number} stageNumber
 * @returns {string}
 */
export const formatStageCompletionMessage = (stageNumber) => {
  const messages = {
    '-4': '🎉 Stage -4 Complete! Your community now knows who you are.',
    '-3': '🎯 Stage -3 Complete! Your problem is now clearly defined.',
    '-2': '💔 Stage -2 Complete! The world can now see the real pain.',
    '-1': '🌟 Stage -1 Complete! Your vision is now painted for GPS.',
    '0': '🚀 GPO Call Complete! Your Problem Showcase is ready to go live!',
  };
  return messages[String(stageNumber)] || `Stage ${stageNumber} complete!`;
};

export default {
  formatStageNumber,
  formatSkillsList,
  formatDate,
  formatDuration,
  formatMediaCount,
  formatShowcaseStatus,
  formatAffectedCount,
  truncateForCard,
  formatForAPISubmission,
  formatXPReward,
  formatBarakaReward,
  formatStageCompletionMessage,
};