/**
 * GPS 101 Formatters
 * * Functions to format GPS 101 data for display.
 */

import { GPS_101_CONFIG } from '../../config/gps101.config';

/**
 * Format stage title
 */
export const formatStageTitle = (stageNumber) => {
  const stage = GPS_101_CONFIG.STAGES.find(s => s.stageNumber === stageNumber);
  return stage ? stage.stageName : `Stage ${stageNumber}`;
};

/**
 * Format stage question
 */
export const formatStageQuestion = (stageNumber) => {
  const stage = GPS_101_CONFIG.STAGES.find(s => s.stageNumber === stageNumber);
  return stage ? stage.question : '';
};

/**
 * Format stage expected outcome
 */
export const formatStageOutcome = (stageNumber) => {
  const stage = GPS_101_CONFIG.STAGES.find(s => s.stageNumber === stageNumber);
  return stage ? stage.expectedOutcome : '';
};

/**
 * Format mission title
 */
export const formatMissionTitle = (mission, language = 'en') => {
  if (language === 'ko' && mission.titleKo) {
    return mission.titleKo;
  }
  return mission.title;
};

/**
 * Format progress percentage
 */
export const formatProgressPercentage = (current, total) => {
  if (!total || total === 0) return '0%';
  const percentage = Math.round(((current || 0) / total) * 100);
  return `${percentage}%`;
};

/**
 * Format Baraka amount (FIXED: Added safety fallback for undefined)
 */
export const formatBaraka = (amount) => {
  const safeAmount = Number(amount) || 0;
  if (safeAmount >= 1000000) {
    return `${(safeAmount / 1000000).toFixed(1)}M`;
  } else if (safeAmount >= 1000) {
    return `${(safeAmount / 1000).toFixed(1)}K`;
  }
  return safeAmount.toLocaleString();
};

/**
 * Format XP amount (FIXED: Added safety fallback for undefined)
 */
export const formatXP = (amount) => {
  const safeAmount = Number(amount) || 0;
  return safeAmount.toLocaleString();
};

/**
 * Format duration in weeks
 */
export const formatWeeks = (weeks) => {
  const safeWeeks = Number(weeks) || 0;
  if (safeWeeks === 1) return '1 week';
  return `${safeWeeks} weeks`;
};

/**
 * Format duration in days
 */
export const formatDays = (days) => {
  const safeDays = Number(days) || 0;
  if (safeDays === 1) return '1 day';
  return `${safeDays} days`;
};

/**
 * Format checkpoint count
 */
export const formatCheckpointCount = (passed, total) => {
  return `${passed || 0}/${total || 0}`;
};

/**
 * Format mission count
 */
export const formatMissionCount = (completed, total) => {
  return `${completed || 0}/${total || 0}`;
};

/**
 * Format stage count
 */
export const formatStageCount = (completed, total) => {
  return `${completed || 0}/${total || 0}`;
};

/**
 * Format deliverable name
 */
export const formatDeliverableName = (deliverableId) => {
  const deliverable = GPS_101_CONFIG.DELIVERABLES.find(d => d.id === deliverableId);
  return deliverable ? deliverable.name : deliverableId;
};

/**
 * Format checkpoint type
 */
export const formatCheckpointType = (type) => {
  const typeLabels = {
    reflection: 'Reflection',
    task: 'Task',
    organization: 'Organization',
    planning: 'Planning',
    analysis: 'Analysis',
    creative: 'Creative Writing',
    visual: 'Visual Creation',
    sharing: 'Sharing',
    commitment: 'Commitment',
    evaluation: 'Self-Evaluation',
    summary: 'Summary',
    presentation: 'Presentation',
    revision: 'Revision',
    narrative: 'Narrative',
    synthesis: 'Synthesis',
    declaration: 'Declaration',
    exploration: 'Exploration',
    brainstorm: 'Brainstorming',
    research: 'Research',
    documentation: 'Documentation',
    discovery: 'Discovery',
    method: 'Method Application',
    selection: 'Selection',
    justification: 'Justification',
    definition: 'Definition',
    design: 'Design',
    mapping: 'Mapping',
    proposition: 'Value Proposition',
    practice: 'Practice',
    feedback: 'Feedback Integration',
    action: 'Action Planning',
    participation: 'Participation',
    community: 'Community Building',
    empathy: 'Empathy Exercise',
    learning: 'Learning',
    strategy: 'Strategy',
    persuasion: 'Persuasion',
    assessment: 'Assessment',
    refinement: 'Refinement',
    statement: 'Statement Writing'
  };
  
  return typeLabels[type] || type;
};

/**
 * Format badge name
 */
export const formatBadgeName = (badgeId) => {
  const badgeNames = {
    'gps-101-stage-1': 'Identity Seeker',
    'gps-101-stage-2': 'Problem Explorer',
    'gps-101-stage-3': 'Story Weaver',
    'gps-101-stage-4': 'Purpose Definer',
    'gps-101-stage-5': 'Project Builder',
    'purpose-pathfinder': 'Purpose Pathfinder',
    'orange-beacon': 'Orange Beacon'
  };
  
  return badgeNames[badgeId] || badgeId;
};

/**
 * Format time remaining
 */
export const formatTimeRemaining = (weeks) => {
  const safeWeeks = Number(weeks) || 0;
  if (safeWeeks === 0) return 'Complete';
  if (safeWeeks === 1) return '1 week remaining';
  return `${safeWeeks} weeks remaining`;
};

/**
 * Format date range
 */
export const formatDateRange = (startDate, endDate) => {
  if (!startDate) return '';
  
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  const startStr = start.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  const endStr = end.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  return `${startStr} - ${endStr}`;
};

/**
 * Format completion status
 */
export const formatCompletionStatus = (completed, total) => {
  if (!total || total === 0) return 'Not Started';
  const percentage = Math.round((completed / total) * 100);
  
  if (percentage === 100) return 'Completed';
  if (percentage === 0) return 'Not Started';
  return 'In Progress';
};

/**
 * Format deliverable status
 */
export const formatDeliverableStatus = (deliverable) => {
  if (!deliverable) return 'Not Started';
  if (deliverable.submitted) return 'Submitted';
  if (deliverable.draft) return 'Draft';
  return 'In Progress';
};

/**
 * Format word count
 */
export const formatWordCount = (text) => {
  if (!text) return '0 words';
  const words = text.trim().split(/\s+/).length;
  return `${words} word${words !== 1 ? 's' : ''}`;
};

/**
 * Format character count
 */
export const formatCharacterCount = (text) => {
  if (!text) return '0 characters';
  const chars = text.length;
  return `${chars} character${chars !== 1 ? 's' : ''}`;
};

/**
 * Format checkpoint requirements
 */
export const formatCheckpointRequirements = (checkpoint) => {
  if (!checkpoint) return '';
  const requirements = [];
  
  if (checkpoint.minLength) {
    requirements.push(`Minimum ${checkpoint.minLength} characters`);
  }
  
  if (checkpoint.maxLength) {
    requirements.push(`Maximum ${checkpoint.maxLength} characters`);
  }
  
  if (checkpoint.requiresUpload) {
    requirements.push('File upload required');
  }
  
  if (checkpoint.requiresVideo) {
    requirements.push('Video submission required');
  }
  
  return requirements.join(' • ');
};

/**
 * Format stage duration
 */
export const formatStageDuration = (stageNumber) => {
  const stage = GPS_101_CONFIG.STAGES.find(s => s.stageNumber === stageNumber);
  return stage ? stage.duration : '3 weeks';
};

/**
 * Format overall progress
 */
export const formatOverallProgress = (progress) => {
  if (!progress) return { stages: '0/5', missions: '0/30', checkpoints: '0/150', percentage: '0%', baraka: '0', xp: '0' };
  return {
    stages: formatStageCount(progress.completedStages, GPS_101_CONFIG.TOTAL_STAGES),
    missions: formatMissionCount(progress.completedMissions, GPS_101_CONFIG.TOTAL_MISSIONS),
    checkpoints: formatCheckpointCount(progress.completedCheckpoints, GPS_101_CONFIG.TOTAL_CHECKPOINTS),
    percentage: formatProgressPercentage(progress.completedMissions, GPS_101_CONFIG.TOTAL_MISSIONS),
    baraka: formatBaraka(progress.totalBarakaEarned),
    xp: formatXP(progress.totalXPEarned)
  };
};

/**
 * Format list with proper grammar
 */
export const formatList = (items, conjunction = 'and') => {
  if (!items || items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  
  const allButLast = items.slice(0, -1).join(', ');
  const last = items[items.length - 1];
  
  return `${allButLast}, ${conjunction} ${last}`;
};

/**
 * Format mission sequence
 */
export const formatMissionSequence = (stageNumber, missionNumber) => {
  return `Stage ${stageNumber || 1}, Mission ${missionNumber || 1}`;
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 100, ellipsis = '...') => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength - ellipsis.length) + ellipsis;
};

/**
 * Format Orange Beacon progress
 */
export const formatOrangeBeaconProgress = (current, target) => {
  const safeCurrent = Number(current) || 0;
  const safeTarget = Number(target) || 5000;
  const percentage = Math.round((safeCurrent / safeTarget) * 100);
  return {
    current: formatBaraka(safeCurrent),
    target: formatBaraka(safeTarget),
    remaining: formatBaraka(Math.max(0, safeTarget - safeCurrent)),
    percentage: `${percentage}%`
  };
};

/**
 * Export all formatter functions
 */
export default {
  formatStageTitle,
  formatStageQuestion,
  formatStageOutcome,
  formatMissionTitle,
  formatProgressPercentage,
  formatBaraka,
  formatXP,
  formatWeeks,
  formatDays,
  formatCheckpointCount,
  formatMissionCount,
  formatStageCount,
  formatDeliverableName,
  formatCheckpointType,
  formatBadgeName,
  formatTimeRemaining,
  formatDateRange,
  formatCompletionStatus,
  formatDeliverableStatus,
  formatWordCount,
  formatCharacterCount,
  formatCheckpointRequirements,
  formatStageDuration,
  formatOverallProgress,
  formatList,
  formatMissionSequence,
  truncateText,
  formatOrangeBeaconProgress
};