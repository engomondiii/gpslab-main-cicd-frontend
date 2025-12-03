/**
 * GPS Lab Platform - Bite Service
 * 
 * Bite management service for creating, updating, submitting,
 * and reviewing bites within missions.
 * 
 * @module services/api/bite.service
 * @version 1.0.0
 */

import apiClient from './client';
import { getCache, setCache, getDraftBite, setDraftBite, clearDraftBite } from '../storage/localStorage.service';
import { saveBiteWorkspace, getBiteWorkspace } from '../storage/sessionStorage.service';
import { logUserAction } from '../../utils/error/error.logger';

// =============================================================================
// API ENDPOINTS
// =============================================================================

const ENDPOINTS = {
  bites: '/bites',
  bite: (id) => `/bites/${id}`,
  missionBites: (missionId) => `/missions/${missionId}/bites`,
  submit: (id) => `/bites/${id}/submit`,
  startWork: (id) => `/bites/${id}/start`,
  pause: (id) => `/bites/${id}/pause`,
  resume: (id) => `/bites/${id}/resume`,
  complete: (id) => `/bites/${id}/complete`,
  reviews: (id) => `/bites/${id}/reviews`,
  deliverables: (id) => `/bites/${id}/deliverables`,
  notes: (id) => `/bites/${id}/notes`,
  resources: (id) => `/bites/${id}/resources`,
  feedback: (id) => `/bites/${id}/feedback`
};

// =============================================================================
// CACHE CONFIGURATION
// =============================================================================

const CACHE_TTL = {
  biteDetail: 2 * 60 * 1000,  // 2 minutes
  biteList: 1 * 60 * 1000     // 1 minute
};

// =============================================================================
// BITE LISTING
// =============================================================================

/**
 * Gets bites for a mission
 * @param {string} missionId - Mission ID
 * @param {Object} options - Options
 * @returns {Promise<Object>} Bites list
 */
export const getBitesByMission = async (missionId, { useCache = true } = {}) => {
  const cacheKey = `bites_mission_${missionId}`;
  
  if (useCache) {
    const cached = getCache(cacheKey, CACHE_TTL.biteList);
    if (cached) {
      return cached;
    }
  }
  
  const response = await apiClient.get(ENDPOINTS.missionBites(missionId));
  
  setCache(cacheKey, response.data);
  
  return response.data;
};

/**
 * Gets all user's bites with filtering
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Bites list
 */
export const getBites = async ({
  page = 1,
  limit = 20,
  status,
  missionId,
  sortBy = 'createdAt',
  sortOrder = 'desc'
} = {}) => {
  const params = { page, limit, sortBy, sortOrder };
  if (status) params.status = status;
  if (missionId) params.missionId = missionId;
  
  const response = await apiClient.get(ENDPOINTS.bites, { params });
  
  return response.data;
};

// =============================================================================
// BITE DETAILS
// =============================================================================

/**
 * Gets bite by ID
 * @param {string} biteId - Bite ID
 * @param {Object} options - Options
 * @returns {Promise<Object>} Bite details
 */
export const getBite = async (biteId, { useCache = true } = {}) => {
  const cacheKey = `bite_${biteId}`;
  
  if (useCache) {
    const cached = getCache(cacheKey, CACHE_TTL.biteDetail);
    if (cached) {
      return cached;
    }
  }
  
  const response = await apiClient.get(ENDPOINTS.bite(biteId));
  
  setCache(cacheKey, response.data);
  
  return response.data;
};

/**
 * Gets bite acceptance criteria
 * @param {string} biteId - Bite ID
 * @returns {Promise<Object>} Acceptance criteria
 */
export const getBiteAcceptanceCriteria = async (biteId) => {
  const response = await apiClient.get(`${ENDPOINTS.bite(biteId)}/criteria`);
  return response.data;
};

/**
 * Gets bite dependencies
 * @param {string} biteId - Bite ID
 * @returns {Promise<Object>} Dependencies
 */
export const getBiteDependencies = async (biteId) => {
  const response = await apiClient.get(`${ENDPOINTS.bite(biteId)}/dependencies`);
  return response.data;
};

// =============================================================================
// BITE WORKFLOW
// =============================================================================

/**
 * Starts work on a bite
 * @param {string} biteId - Bite ID
 * @returns {Promise<Object>} Updated bite
 */
export const startBite = async (biteId) => {
  const response = await apiClient.post(ENDPOINTS.startWork(biteId));
  
  logUserAction('bite_started', { biteId });
  
  // Clear any cached version
  invalidateBiteCache(biteId);
  
  window.dispatchEvent(new CustomEvent('bite:started', { detail: response.data }));
  
  return response.data;
};

/**
 * Pauses work on a bite
 * @param {string} biteId - Bite ID
 * @returns {Promise<Object>} Updated bite
 */
export const pauseBite = async (biteId) => {
  // Save current workspace state
  const workspace = getBiteWorkspace(biteId);
  if (workspace) {
    setDraftBite(biteId, workspace);
  }
  
  const response = await apiClient.post(ENDPOINTS.pause(biteId));
  
  logUserAction('bite_paused', { biteId });
  invalidateBiteCache(biteId);
  
  return response.data;
};

/**
 * Resumes work on a bite
 * @param {string} biteId - Bite ID
 * @returns {Promise<Object>} Updated bite
 */
export const resumeBite = async (biteId) => {
  const response = await apiClient.post(ENDPOINTS.resume(biteId));
  
  // Restore workspace from draft if available
  const draft = getDraftBite(biteId);
  if (draft) {
    saveBiteWorkspace(biteId, draft);
  }
  
  logUserAction('bite_resumed', { biteId });
  invalidateBiteCache(biteId);
  
  return response.data;
};

/**
 * Updates bite progress
 * @param {string} biteId - Bite ID
 * @param {Object} data - Progress data
 * @returns {Promise<Object>} Updated bite
 */
export const updateBite = async (biteId, data) => {
  const response = await apiClient.patch(ENDPOINTS.bite(biteId), data);
  
  invalidateBiteCache(biteId);
  
  return response.data;
};

// =============================================================================
// BITE SUBMISSION
// =============================================================================

/**
 * Submits a bite for review
 * @param {string} biteId - Bite ID
 * @param {Object} submission - Submission data
 * @returns {Promise<Object>} Submission result
 */
export const submitBite = async (biteId, submission) => {
  const response = await apiClient.post(ENDPOINTS.submit(biteId), submission);
  
  // Clear draft after successful submission
  clearDraftBite(biteId);
  
  logUserAction('bite_submitted', { biteId });
  invalidateBiteCache(biteId);
  
  window.dispatchEvent(new CustomEvent('bite:submitted', { detail: response.data }));
  
  return response.data;
};

/**
 * Completes a bite (after approval)
 * @param {string} biteId - Bite ID
 * @returns {Promise<Object>} Completion result
 */
export const completeBite = async (biteId) => {
  const response = await apiClient.post(ENDPOINTS.complete(biteId));
  
  logUserAction('bite_completed', { biteId });
  invalidateBiteCache(biteId);
  
  window.dispatchEvent(new CustomEvent('bite:completed', { detail: response.data }));
  
  return response.data;
};

// =============================================================================
// DELIVERABLES
// =============================================================================

/**
 * Gets bite deliverables
 * @param {string} biteId - Bite ID
 * @returns {Promise<Object>} Deliverables list
 */
export const getDeliverables = async (biteId) => {
  const response = await apiClient.get(ENDPOINTS.deliverables(biteId));
  return response.data;
};

/**
 * Uploads deliverable
 * @param {string} biteId - Bite ID
 * @param {File} file - File to upload
 * @param {Object} metadata - File metadata
 * @returns {Promise<Object>} Uploaded deliverable
 */
export const uploadDeliverable = async (biteId, file, metadata = {}) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('metadata', JSON.stringify(metadata));
  
  const response = await apiClient.upload(ENDPOINTS.deliverables(biteId), formData);
  
  logUserAction('deliverable_uploaded', { biteId, fileName: file.name });
  
  return response.data;
};

/**
 * Deletes deliverable
 * @param {string} biteId - Bite ID
 * @param {string} deliverableId - Deliverable ID
 * @returns {Promise<void>}
 */
export const deleteDeliverable = async (biteId, deliverableId) => {
  await apiClient.delete(`${ENDPOINTS.deliverables(biteId)}/${deliverableId}`);
  
  logUserAction('deliverable_deleted', { biteId, deliverableId });
};

// =============================================================================
// NOTES
// =============================================================================

/**
 * Gets bite notes
 * @param {string} biteId - Bite ID
 * @returns {Promise<Object>} Notes list
 */
export const getNotes = async (biteId) => {
  const response = await apiClient.get(ENDPOINTS.notes(biteId));
  return response.data;
};

/**
 * Creates note
 * @param {string} biteId - Bite ID
 * @param {Object} note - Note data
 * @returns {Promise<Object>} Created note
 */
export const createNote = async (biteId, note) => {
  const response = await apiClient.post(ENDPOINTS.notes(biteId), note);
  return response.data;
};

/**
 * Updates note
 * @param {string} biteId - Bite ID
 * @param {string} noteId - Note ID
 * @param {Object} note - Note data
 * @returns {Promise<Object>} Updated note
 */
export const updateNote = async (biteId, noteId, note) => {
  const response = await apiClient.patch(`${ENDPOINTS.notes(biteId)}/${noteId}`, note);
  return response.data;
};

/**
 * Deletes note
 * @param {string} biteId - Bite ID
 * @param {string} noteId - Note ID
 * @returns {Promise<void>}
 */
export const deleteNote = async (biteId, noteId) => {
  await apiClient.delete(`${ENDPOINTS.notes(biteId)}/${noteId}`);
};

// =============================================================================
// RESOURCES
// =============================================================================

/**
 * Gets bite resources
 * @param {string} biteId - Bite ID
 * @returns {Promise<Object>} Resources list
 */
export const getResources = async (biteId) => {
  const response = await apiClient.get(ENDPOINTS.resources(biteId));
  return response.data;
};

/**
 * Adds resource to bite
 * @param {string} biteId - Bite ID
 * @param {Object} resource - Resource data
 * @returns {Promise<Object>} Added resource
 */
export const addResource = async (biteId, resource) => {
  const response = await apiClient.post(ENDPOINTS.resources(biteId), resource);
  return response.data;
};

// =============================================================================
// REVIEWS
// =============================================================================

/**
 * Gets bite reviews
 * @param {string} biteId - Bite ID
 * @returns {Promise<Object>} Reviews list
 */
export const getReviews = async (biteId) => {
  const response = await apiClient.get(ENDPOINTS.reviews(biteId));
  return response.data;
};

/**
 * Gets AI review for bite
 * @param {string} biteId - Bite ID
 * @returns {Promise<Object>} AI review
 */
export const getAIReview = async (biteId) => {
  const response = await apiClient.get(`${ENDPOINTS.reviews(biteId)}/ai`);
  return response.data;
};

/**
 * Requests peer review
 * @param {string} biteId - Bite ID
 * @param {Object} options - Review options
 * @returns {Promise<Object>} Review request
 */
export const requestPeerReview = async (biteId, { reviewerIds } = {}) => {
  const response = await apiClient.post(`${ENDPOINTS.reviews(biteId)}/peer`, {
    reviewerIds
  });
  
  logUserAction('peer_review_requested', { biteId });
  
  return response.data;
};

/**
 * Submits peer review
 * @param {string} biteId - Bite ID
 * @param {Object} review - Review data
 * @returns {Promise<Object>} Submitted review
 */
export const submitPeerReview = async (biteId, review) => {
  const response = await apiClient.post(`${ENDPOINTS.reviews(biteId)}/submit`, review);
  
  logUserAction('peer_review_submitted', { biteId });
  
  return response.data;
};

// =============================================================================
// FEEDBACK
// =============================================================================

/**
 * Gets bite feedback
 * @param {string} biteId - Bite ID
 * @returns {Promise<Object>} Feedback data
 */
export const getFeedback = async (biteId) => {
  const response = await apiClient.get(ENDPOINTS.feedback(biteId));
  return response.data;
};

// =============================================================================
// DRAFT MANAGEMENT
// =============================================================================

/**
 * Saves bite draft locally
 * @param {string} biteId - Bite ID
 * @param {Object} data - Draft data
 */
export const saveDraft = (biteId, data) => {
  setDraftBite(biteId, data);
  saveBiteWorkspace(biteId, data);
};

/**
 * Gets bite draft
 * @param {string} biteId - Bite ID
 * @returns {Object|null} Draft data
 */
export const getDraft = (biteId) => {
  return getDraftBite(biteId) || getBiteWorkspace(biteId);
};

/**
 * Clears bite draft
 * @param {string} biteId - Bite ID
 */
export const clearDraft = (biteId) => {
  clearDraftBite(biteId);
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Invalidates bite cache
 * @param {string} biteId - Bite ID
 */
const invalidateBiteCache = (biteId) => {
  const { removeItem } = require('../storage/localStorage.service');
  removeItem(`cache_bite_${biteId}`);
};

/**
 * Gets bite status label
 * @param {string} status - Status code
 * @returns {Object} Status info
 */
export const getBiteStatusInfo = (status) => {
  const statuses = {
    locked: { label: 'Locked', color: 'gray' },
    open: { label: 'Open', color: 'blue' },
    in_progress: { label: 'In Progress', color: 'yellow' },
    submitted: { label: 'Submitted', color: 'purple' },
    in_review: { label: 'In Review', color: 'indigo' },
    approved: { label: 'Approved', color: 'green' },
    rejected: { label: 'Needs Revision', color: 'red' },
    completed: { label: 'Completed', color: 'green' }
  };
  
  return statuses[status] || { label: status, color: 'gray' };
};

/**
 * Calculates time spent on bite
 * @param {Object} bite - Bite data
 * @returns {number} Time in minutes
 */
export const calculateTimeSpent = (bite) => {
  if (!bite.workSessions || bite.workSessions.length === 0) {
    return 0;
  }
  
  return bite.workSessions.reduce((total, session) => {
    const start = new Date(session.startedAt);
    const end = session.endedAt ? new Date(session.endedAt) : new Date();
    return total + Math.round((end - start) / 60000);
  }, 0);
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Listing
  getBitesByMission,
  getBites,
  
  // Details
  getBite,
  getBiteAcceptanceCriteria,
  getBiteDependencies,
  
  // Workflow
  startBite,
  pauseBite,
  resumeBite,
  updateBite,
  
  // Submission
  submitBite,
  completeBite,
  
  // Deliverables
  getDeliverables,
  uploadDeliverable,
  deleteDeliverable,
  
  // Notes
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  
  // Resources
  getResources,
  addResource,
  
  // Reviews
  getReviews,
  getAIReview,
  requestPeerReview,
  submitPeerReview,
  
  // Feedback
  getFeedback,
  
  // Drafts
  saveDraft,
  getDraft,
  clearDraft,
  
  // Helpers
  getBiteStatusInfo,
  calculateTimeSpent
};