/**
 * GPS Lab Platform - PSB Service
 * 
 * Problem-Solution-Benefit framework service for managing
 * the core GPS methodology and PSB analysis.
 * 
 * @module services/api/psb.service
 * @version 1.0.0
 */

import apiClient from './client';
import { getCache, setCache } from '../storage/localStorage.service';
import { logUserAction } from '../../utils/error/logger';

// =============================================================================
// API ENDPOINTS
// =============================================================================

const ENDPOINTS = {
  psb: '/psb',
  analysis: '/psb/analysis',
  problems: '/psb/problems',
  solutions: '/psb/solutions',
  benefits: '/psb/benefits',
  templates: '/psb/templates',
  examples: '/psb/examples',
  validate: '/psb/validate',
  feedback: '/psb/feedback'
};

// =============================================================================
// CACHE CONFIGURATION
// =============================================================================

const CACHE_TTL = {
  templates: 30 * 60 * 1000,   // 30 minutes
  examples: 30 * 60 * 1000     // 30 minutes
};

// =============================================================================
// PSB CONSTANTS
// =============================================================================

export const PSB_COMPONENTS = {
  PROBLEM: 'problem',
  SOLUTION: 'solution',
  BENEFIT: 'benefit'
};

export const PSB_QUALITY_LEVELS = {
  DRAFT: 'draft',
  DEVELOPING: 'developing',
  PROFICIENT: 'proficient',
  EXEMPLARY: 'exemplary'
};

export const PROBLEM_CATEGORIES = {
  SOCIAL: 'social',
  ENVIRONMENTAL: 'environmental',
  ECONOMIC: 'economic',
  TECHNOLOGICAL: 'technological',
  EDUCATIONAL: 'educational',
  HEALTH: 'health',
  GOVERNANCE: 'governance'
};

// =============================================================================
// PSB ANALYSIS OPERATIONS
// =============================================================================

/**
 * Creates new PSB analysis
 * @param {Object} data - Analysis data
 * @returns {Promise<Object>} Created analysis
 */
export const createAnalysis = async (data) => {
  const response = await apiClient.post(ENDPOINTS.analysis, {
    ...data,
    createdAt: new Date().toISOString()
  });
  
  logUserAction('psb_analysis_created', { 
    missionId: data.missionId,
    category: data.category 
  });
  
  return response.data;
};

/**
 * Gets PSB analysis by ID
 * @param {string} analysisId - Analysis ID
 * @returns {Promise<Object>} Analysis data
 */
export const getAnalysis = async (analysisId) => {
  const response = await apiClient.get(`${ENDPOINTS.analysis}/${analysisId}`);
  return response.data;
};

/**
 * Gets PSB analysis for a mission
 * @param {string} missionId - Mission ID
 * @returns {Promise<Object>} Analysis data
 */
export const getAnalysisByMission = async (missionId) => {
  const response = await apiClient.get(`${ENDPOINTS.analysis}/mission/${missionId}`);
  return response.data;
};

/**
 * Updates PSB analysis
 * @param {string} analysisId - Analysis ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated analysis
 */
export const updateAnalysis = async (analysisId, data) => {
  const response = await apiClient.patch(`${ENDPOINTS.analysis}/${analysisId}`, {
    ...data,
    updatedAt: new Date().toISOString()
  });
  
  logUserAction('psb_analysis_updated', { analysisId });
  
  return response.data;
};

/**
 * Deletes PSB analysis
 * @param {string} analysisId - Analysis ID
 * @returns {Promise<void>}
 */
export const deleteAnalysis = async (analysisId) => {
  await apiClient.delete(`${ENDPOINTS.analysis}/${analysisId}`);
  
  logUserAction('psb_analysis_deleted', { analysisId });
};

/**
 * Gets all user's PSB analyses
 * @param {Object} params - Query params
 * @returns {Promise<Object>} Analyses list
 */
export const getAnalyses = async ({ 
  page = 1, 
  limit = 20,
  status,
  category 
} = {}) => {
  const params = { page, limit };
  if (status) params.status = status;
  if (category) params.category = category;
  
  const response = await apiClient.get(ENDPOINTS.analysis, { params });
  return response.data;
};

// =============================================================================
// PROBLEM OPERATIONS
// =============================================================================

/**
 * Adds problem statement to analysis
 * @param {string} analysisId - Analysis ID
 * @param {Object} problem - Problem data
 * @returns {Promise<Object>} Updated analysis
 */
export const addProblem = async (analysisId, problem) => {
  const response = await apiClient.post(`${ENDPOINTS.analysis}/${analysisId}/problems`, problem);
  return response.data;
};

/**
 * Updates problem statement
 * @param {string} analysisId - Analysis ID
 * @param {string} problemId - Problem ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated problem
 */
export const updateProblem = async (analysisId, problemId, data) => {
  const response = await apiClient.patch(
    `${ENDPOINTS.analysis}/${analysisId}/problems/${problemId}`,
    data
  );
  return response.data;
};

/**
 * Gets problem examples by category
 * @param {string} category - Problem category
 * @returns {Promise<Object>} Examples
 */
export const getProblemExamples = async (category) => {
  const cacheKey = `psb_problem_examples_${category}`;
  
  const cached = getCache(cacheKey, CACHE_TTL.examples);
  if (cached) {
    return cached;
  }
  
  const response = await apiClient.get(`${ENDPOINTS.problems}/examples`, {
    params: { category }
  });
  
  setCache(cacheKey, response.data);
  
  return response.data;
};

// =============================================================================
// SOLUTION OPERATIONS
// =============================================================================

/**
 * Adds solution to analysis
 * @param {string} analysisId - Analysis ID
 * @param {Object} solution - Solution data
 * @returns {Promise<Object>} Updated analysis
 */
export const addSolution = async (analysisId, solution) => {
  const response = await apiClient.post(`${ENDPOINTS.analysis}/${analysisId}/solutions`, solution);
  return response.data;
};

/**
 * Updates solution
 * @param {string} analysisId - Analysis ID
 * @param {string} solutionId - Solution ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated solution
 */
export const updateSolution = async (analysisId, solutionId, data) => {
  const response = await apiClient.patch(
    `${ENDPOINTS.analysis}/${analysisId}/solutions/${solutionId}`,
    data
  );
  return response.data;
};

/**
 * Gets solution frameworks
 * @returns {Promise<Object>} Frameworks
 */
export const getSolutionFrameworks = async () => {
  const cached = getCache('psb_solution_frameworks', CACHE_TTL.templates);
  if (cached) {
    return cached;
  }
  
  const response = await apiClient.get(`${ENDPOINTS.solutions}/frameworks`);
  
  setCache('psb_solution_frameworks', response.data);
  
  return response.data;
};

// =============================================================================
// BENEFIT OPERATIONS
// =============================================================================

/**
 * Adds benefit to analysis
 * @param {string} analysisId - Analysis ID
 * @param {Object} benefit - Benefit data
 * @returns {Promise<Object>} Updated analysis
 */
export const addBenefit = async (analysisId, benefit) => {
  const response = await apiClient.post(`${ENDPOINTS.analysis}/${analysisId}/benefits`, benefit);
  return response.data;
};

/**
 * Updates benefit
 * @param {string} analysisId - Analysis ID
 * @param {string} benefitId - Benefit ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated benefit
 */
export const updateBenefit = async (analysisId, benefitId, data) => {
  const response = await apiClient.patch(
    `${ENDPOINTS.analysis}/${analysisId}/benefits/${benefitId}`,
    data
  );
  return response.data;
};

/**
 * Gets benefit metrics templates
 * @returns {Promise<Object>} Templates
 */
export const getBenefitMetrics = async () => {
  const cached = getCache('psb_benefit_metrics', CACHE_TTL.templates);
  if (cached) {
    return cached;
  }
  
  const response = await apiClient.get(`${ENDPOINTS.benefits}/metrics`);
  
  setCache('psb_benefit_metrics', response.data);
  
  return response.data;
};

// =============================================================================
// TEMPLATES & EXAMPLES
// =============================================================================

/**
 * Gets PSB templates
 * @param {Object} params - Query params
 * @returns {Promise<Object>} Templates
 */
export const getTemplates = async ({ category, stage } = {}) => {
  const cacheKey = `psb_templates_${category || 'all'}_${stage || 'all'}`;
  
  const cached = getCache(cacheKey, CACHE_TTL.templates);
  if (cached) {
    return cached;
  }
  
  const params = {};
  if (category) params.category = category;
  if (stage) params.stage = stage;
  
  const response = await apiClient.get(ENDPOINTS.templates, { params });
  
  setCache(cacheKey, response.data);
  
  return response.data;
};

/**
 * Gets exemplary PSB examples
 * @param {Object} params - Query params
 * @returns {Promise<Object>} Examples
 */
export const getExamples = async ({ category, quality = 'exemplary' } = {}) => {
  const cacheKey = `psb_examples_${category || 'all'}_${quality}`;
  
  const cached = getCache(cacheKey, CACHE_TTL.examples);
  if (cached) {
    return cached;
  }
  
  const params = { quality };
  if (category) params.category = category;
  
  const response = await apiClient.get(ENDPOINTS.examples, { params });
  
  setCache(cacheKey, response.data);
  
  return response.data;
};

// =============================================================================
// VALIDATION & FEEDBACK
// =============================================================================

/**
 * Validates PSB analysis
 * @param {string} analysisId - Analysis ID
 * @returns {Promise<Object>} Validation result
 */
export const validateAnalysis = async (analysisId) => {
  const response = await apiClient.post(`${ENDPOINTS.validate}/${analysisId}`);
  
  logUserAction('psb_analysis_validated', { analysisId });
  
  return response.data;
};

/**
 * Gets AI feedback on PSB analysis
 * @param {string} analysisId - Analysis ID
 * @param {Object} options - Feedback options
 * @returns {Promise<Object>} AI feedback
 */
export const getAIFeedback = async (analysisId, { component } = {}) => {
  const params = {};
  if (component) params.component = component;
  
  const response = await apiClient.post(`${ENDPOINTS.feedback}/${analysisId}/ai`, null, { params });
  
  logUserAction('psb_ai_feedback_requested', { analysisId, component });
  
  return response.data;
};

/**
 * Submits analysis for peer review
 * @param {string} analysisId - Analysis ID
 * @returns {Promise<Object>} Review request
 */
export const requestPeerReview = async (analysisId) => {
  const response = await apiClient.post(`${ENDPOINTS.feedback}/${analysisId}/peer`);
  
  logUserAction('psb_peer_review_requested', { analysisId });
  
  return response.data;
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Calculates PSB completeness score
 * @param {Object} analysis - Analysis data
 * @returns {Object} Completeness scores
 */
export const calculateCompleteness = (analysis) => {
  if (!analysis) {
    return { problem: 0, solution: 0, benefit: 0, overall: 0 };
  }
  
  const problemScore = calculateComponentScore(analysis.problems);
  const solutionScore = calculateComponentScore(analysis.solutions);
  const benefitScore = calculateComponentScore(analysis.benefits);
  
  const overall = Math.round((problemScore + solutionScore + benefitScore) / 3);
  
  return {
    problem: problemScore,
    solution: solutionScore,
    benefit: benefitScore,
    overall
  };
};

/**
 * Calculates component score
 * @param {Array} components - Component array
 * @returns {number} Score (0-100)
 */
const calculateComponentScore = (components) => {
  if (!components || components.length === 0) return 0;
  
  const fields = ['title', 'description', 'evidence', 'impact'];
  let totalScore = 0;
  
  components.forEach(comp => {
    let compScore = 0;
    fields.forEach(field => {
      if (comp[field] && comp[field].length > 10) {
        compScore += 25;
      }
    });
    totalScore += compScore;
  });
  
  return Math.min(100, Math.round(totalScore / components.length));
};

/**
 * Gets quality level based on score
 * @param {number} score - Completeness score
 * @returns {string} Quality level
 */
export const getQualityLevel = (score) => {
  if (score >= 90) return PSB_QUALITY_LEVELS.EXEMPLARY;
  if (score >= 70) return PSB_QUALITY_LEVELS.PROFICIENT;
  if (score >= 40) return PSB_QUALITY_LEVELS.DEVELOPING;
  return PSB_QUALITY_LEVELS.DRAFT;
};

/**
 * Gets quality level info
 * @param {string} level - Quality level
 * @returns {Object} Level info
 */
export const getQualityLevelInfo = (level) => {
  const levels = {
    [PSB_QUALITY_LEVELS.DRAFT]: { 
      label: 'Draft', 
      color: 'gray', 
      description: 'Initial work, needs development'
    },
    [PSB_QUALITY_LEVELS.DEVELOPING]: { 
      label: 'Developing', 
      color: 'yellow', 
      description: 'Making progress, continue refining'
    },
    [PSB_QUALITY_LEVELS.PROFICIENT]: { 
      label: 'Proficient', 
      color: 'blue', 
      description: 'Solid work, minor improvements needed'
    },
    [PSB_QUALITY_LEVELS.EXEMPLARY]: { 
      label: 'Exemplary', 
      color: 'green', 
      description: 'Excellent work, ready for submission'
    }
  };
  
  return levels[level] || levels[PSB_QUALITY_LEVELS.DRAFT];
};

/**
 * Formats problem category
 * @param {string} category - Category code
 * @returns {Object} Category info
 */
export const getCategoryInfo = (category) => {
  const categories = {
    [PROBLEM_CATEGORIES.SOCIAL]: { label: 'Social', icon: '👥', color: 'purple' },
    [PROBLEM_CATEGORIES.ENVIRONMENTAL]: { label: 'Environmental', icon: '🌍', color: 'green' },
    [PROBLEM_CATEGORIES.ECONOMIC]: { label: 'Economic', icon: '💰', color: 'yellow' },
    [PROBLEM_CATEGORIES.TECHNOLOGICAL]: { label: 'Technological', icon: '💻', color: 'blue' },
    [PROBLEM_CATEGORIES.EDUCATIONAL]: { label: 'Educational', icon: '📚', color: 'indigo' },
    [PROBLEM_CATEGORIES.HEALTH]: { label: 'Health', icon: '🏥', color: 'red' },
    [PROBLEM_CATEGORIES.GOVERNANCE]: { label: 'Governance', icon: '🏛️', color: 'gray' }
  };
  
  return categories[category] || { label: category, icon: '❓', color: 'gray' };
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Analysis CRUD
  createAnalysis,
  getAnalysis,
  getAnalysisByMission,
  updateAnalysis,
  deleteAnalysis,
  getAnalyses,
  
  // Problems
  addProblem,
  updateProblem,
  getProblemExamples,
  
  // Solutions
  addSolution,
  updateSolution,
  getSolutionFrameworks,
  
  // Benefits
  addBenefit,
  updateBenefit,
  getBenefitMetrics,
  
  // Templates & Examples
  getTemplates,
  getExamples,
  
  // Validation & Feedback
  validateAnalysis,
  getAIFeedback,
  requestPeerReview,
  
  // Helpers
  calculateCompleteness,
  getQualityLevel,
  getQualityLevelInfo,
  getCategoryInfo,
  
  // Constants
  PSB_COMPONENTS,
  PSB_QUALITY_LEVELS,
  PROBLEM_CATEGORIES
};