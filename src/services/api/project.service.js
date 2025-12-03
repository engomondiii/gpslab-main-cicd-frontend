/**
 * GPS Lab Platform - Project Service
 * 
 * GPO (Global Problem Owner) project management service for
 * creating, managing, and collaborating on real-world projects.
 * 
 * @module services/api/project.service
 * @version 1.0.0
 */

import apiClient from './client';
import { getCache, setCache } from '../storage/localStorage.service';
import { logUserAction } from '../../utils/error/logger';

// =============================================================================
// API ENDPOINTS
// =============================================================================

const ENDPOINTS = {
  projects: '/projects',
  project: (id) => `/projects/${id}`,
  create: '/projects/create',
  myProjects: '/projects/my',
  discover: '/projects/discover',
  featured: '/projects/featured',
  milestones: (id) => `/projects/${id}/milestones`,
  team: (id) => `/projects/${id}/team`,
  updates: (id) => `/projects/${id}/updates`,
  impact: (id) => `/projects/${id}/impact`,
  funding: (id) => `/projects/${id}/funding`,
  resources: (id) => `/projects/${id}/resources`,
  gallery: (id) => `/projects/${id}/gallery`
};

// =============================================================================
// CACHE CONFIGURATION
// =============================================================================

const CACHE_TTL = {
  project: 5 * 60 * 1000,     // 5 minutes
  featured: 15 * 60 * 1000,   // 15 minutes
  discover: 5 * 60 * 1000     // 5 minutes
};

// =============================================================================
// PROJECT CONSTANTS
// =============================================================================

export const PROJECT_STATUS = {
  DRAFT: 'draft',
  PLANNING: 'planning',
  ACTIVE: 'active',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  ARCHIVED: 'archived'
};

export const PROJECT_VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  TEAM_ONLY: 'team_only'
};

export const PROJECT_CATEGORIES = {
  EDUCATION: 'education',
  ENVIRONMENT: 'environment',
  HEALTH: 'health',
  TECHNOLOGY: 'technology',
  COMMUNITY: 'community',
  ECONOMIC: 'economic',
  GOVERNANCE: 'governance'
};

export const MILESTONE_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  DELAYED: 'delayed'
};

export const TEAM_ROLES = {
  OWNER: 'owner',
  LEAD: 'lead',
  CONTRIBUTOR: 'contributor',
  ADVISOR: 'advisor',
  STAKEHOLDER: 'stakeholder'
};

// =============================================================================
// PROJECT CRUD OPERATIONS
// =============================================================================

/**
 * Creates a new project
 * @param {Object} data - Project data
 * @returns {Promise<Object>} Created project
 */
export const createProject = async ({
  title,
  description,
  summary,
  category,
  problemStatement,
  proposedSolution,
  targetBeneficiaries,
  location,
  timeline,
  budget,
  visibility = PROJECT_VISIBILITY.PUBLIC,
  tags = []
}) => {
  const response = await apiClient.post(ENDPOINTS.create, {
    title,
    description,
    summary,
    category,
    problemStatement,
    proposedSolution,
    targetBeneficiaries,
    location,
    timeline,
    budget,
    visibility,
    tags
  });
  
  logUserAction('project_created', { 
    projectId: response.data.id, 
    category 
  });
  
  // Dispatch event
  window.dispatchEvent(new CustomEvent('project:created', { 
    detail: response.data 
  }));
  
  return response.data;
};

/**
 * Gets project by ID
 * @param {string} projectId - Project ID
 * @param {Object} options - Options
 * @returns {Promise<Object>} Project data
 */
export const getProject = async (projectId, { useCache = true } = {}) => {
  const cacheKey = `project_${projectId}`;
  
  if (useCache) {
    const cached = getCache(cacheKey, CACHE_TTL.project);
    if (cached) {
      return cached;
    }
  }
  
  const response = await apiClient.get(ENDPOINTS.project(projectId));
  
  setCache(cacheKey, response.data);
  
  return response.data;
};

/**
 * Updates project
 * @param {string} projectId - Project ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated project
 */
export const updateProject = async (projectId, data) => {
  const response = await apiClient.patch(ENDPOINTS.project(projectId), data);
  
  // Invalidate cache
  invalidateProjectCache(projectId);
  
  logUserAction('project_updated', { projectId });
  
  return response.data;
};

/**
 * Deletes project
 * @param {string} projectId - Project ID
 * @returns {Promise<void>}
 */
export const deleteProject = async (projectId) => {
  await apiClient.delete(ENDPOINTS.project(projectId));
  
  // Invalidate cache
  invalidateProjectCache(projectId);
  
  logUserAction('project_deleted', { projectId });
};

/**
 * Changes project status
 * @param {string} projectId - Project ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated project
 */
export const changeStatus = async (projectId, status) => {
  const response = await apiClient.patch(`${ENDPOINTS.project(projectId)}/status`, {
    status
  });
  
  // Invalidate cache
  invalidateProjectCache(projectId);
  
  logUserAction('project_status_changed', { projectId, status });
  
  return response.data;
};

// =============================================================================
// PROJECT LISTING
// =============================================================================

/**
 * Gets user's projects
 * @param {Object} params - Query params
 * @returns {Promise<Object>} Projects list
 */
export const getMyProjects = async ({ 
  page = 1, 
  limit = 20, 
  status,
  role
} = {}) => {
  const params = { page, limit };
  if (status) params.status = status;
  if (role) params.role = role;
  
  const response = await apiClient.get(ENDPOINTS.myProjects, { params });
  return response.data;
};

/**
 * Discovers public projects
 * @param {Object} params - Query params
 * @returns {Promise<Object>} Projects list
 */
export const discoverProjects = async ({
  page = 1,
  limit = 20,
  category,
  search,
  sortBy = 'recent',
  location
} = {}) => {
  const params = { page, limit, sortBy };
  if (category) params.category = category;
  if (search) params.search = search;
  if (location) params.location = location;
  
  const response = await apiClient.get(ENDPOINTS.discover, { params });
  return response.data;
};

/**
 * Gets featured projects
 * @returns {Promise<Object>} Featured projects
 */
export const getFeaturedProjects = async () => {
  const cached = getCache('projects_featured', CACHE_TTL.featured);
  if (cached) {
    return cached;
  }
  
  const response = await apiClient.get(ENDPOINTS.featured);
  
  setCache('projects_featured', response.data);
  
  return response.data;
};

// =============================================================================
// MILESTONE OPERATIONS
// =============================================================================

/**
 * Gets project milestones
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Milestones list
 */
export const getMilestones = async (projectId) => {
  const response = await apiClient.get(ENDPOINTS.milestones(projectId));
  return response.data;
};

/**
 * Creates milestone
 * @param {string} projectId - Project ID
 * @param {Object} milestone - Milestone data
 * @returns {Promise<Object>} Created milestone
 */
export const createMilestone = async (projectId, milestone) => {
  const response = await apiClient.post(ENDPOINTS.milestones(projectId), milestone);
  
  logUserAction('milestone_created', { projectId, milestoneId: response.data.id });
  
  return response.data;
};

/**
 * Updates milestone
 * @param {string} projectId - Project ID
 * @param {string} milestoneId - Milestone ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated milestone
 */
export const updateMilestone = async (projectId, milestoneId, data) => {
  const response = await apiClient.patch(
    `${ENDPOINTS.milestones(projectId)}/${milestoneId}`,
    data
  );
  return response.data;
};

/**
 * Completes milestone
 * @param {string} projectId - Project ID
 * @param {string} milestoneId - Milestone ID
 * @param {Object} completionData - Completion details
 * @returns {Promise<Object>} Completed milestone
 */
export const completeMilestone = async (projectId, milestoneId, completionData = {}) => {
  const response = await apiClient.post(
    `${ENDPOINTS.milestones(projectId)}/${milestoneId}/complete`,
    completionData
  );
  
  logUserAction('milestone_completed', { projectId, milestoneId });
  
  return response.data;
};

// =============================================================================
// TEAM OPERATIONS
// =============================================================================

/**
 * Gets project team
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Team members
 */
export const getTeam = async (projectId) => {
  const response = await apiClient.get(ENDPOINTS.team(projectId));
  return response.data;
};

/**
 * Adds team member
 * @param {string} projectId - Project ID
 * @param {Object} data - Member data
 * @returns {Promise<Object>} Added member
 */
export const addTeamMember = async (projectId, { userId, role, responsibilities }) => {
  const response = await apiClient.post(ENDPOINTS.team(projectId), {
    userId,
    role,
    responsibilities
  });
  
  logUserAction('team_member_added', { projectId, userId, role });
  
  return response.data;
};

/**
 * Updates team member
 * @param {string} projectId - Project ID
 * @param {string} userId - User ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated member
 */
export const updateTeamMember = async (projectId, userId, data) => {
  const response = await apiClient.patch(
    `${ENDPOINTS.team(projectId)}/${userId}`,
    data
  );
  return response.data;
};

/**
 * Removes team member
 * @param {string} projectId - Project ID
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const removeTeamMember = async (projectId, userId) => {
  await apiClient.delete(`${ENDPOINTS.team(projectId)}/${userId}`);
  
  logUserAction('team_member_removed', { projectId, userId });
};

// =============================================================================
// UPDATES & PROGRESS
// =============================================================================

/**
 * Gets project updates
 * @param {string} projectId - Project ID
 * @param {Object} params - Query params
 * @returns {Promise<Object>} Updates list
 */
export const getUpdates = async (projectId, { page = 1, limit = 20 } = {}) => {
  const response = await apiClient.get(ENDPOINTS.updates(projectId), {
    params: { page, limit }
  });
  return response.data;
};

/**
 * Posts project update
 * @param {string} projectId - Project ID
 * @param {Object} update - Update data
 * @returns {Promise<Object>} Posted update
 */
export const postUpdate = async (projectId, { title, content, type = 'progress', attachments = [] }) => {
  const response = await apiClient.post(ENDPOINTS.updates(projectId), {
    title,
    content,
    type,
    attachments
  });
  
  logUserAction('project_update_posted', { projectId, type });
  
  return response.data;
};

// =============================================================================
// IMPACT TRACKING
// =============================================================================

/**
 * Gets project impact metrics
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Impact data
 */
export const getImpact = async (projectId) => {
  const response = await apiClient.get(ENDPOINTS.impact(projectId));
  return response.data;
};

/**
 * Records impact metric
 * @param {string} projectId - Project ID
 * @param {Object} metric - Metric data
 * @returns {Promise<Object>} Recorded metric
 */
export const recordImpact = async (projectId, { metricType, value, date, evidence }) => {
  const response = await apiClient.post(ENDPOINTS.impact(projectId), {
    metricType,
    value,
    date,
    evidence
  });
  
  logUserAction('impact_recorded', { projectId, metricType });
  
  return response.data;
};

// =============================================================================
// FUNDING & RESOURCES
// =============================================================================

/**
 * Gets project funding info
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Funding data
 */
export const getFunding = async (projectId) => {
  const response = await apiClient.get(ENDPOINTS.funding(projectId));
  return response.data;
};

/**
 * Contributes Baraka to project
 * @param {string} projectId - Project ID
 * @param {number} amount - Baraka amount
 * @returns {Promise<Object>} Contribution result
 */
export const contributeBaraka = async (projectId, amount) => {
  const response = await apiClient.post(`${ENDPOINTS.funding(projectId)}/contribute`, {
    amount
  });
  
  logUserAction('project_contribution', { projectId, amount });
  
  return response.data;
};

/**
 * Gets project resources
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Resources list
 */
export const getResources = async (projectId) => {
  const response = await apiClient.get(ENDPOINTS.resources(projectId));
  return response.data;
};

/**
 * Adds project resource
 * @param {string} projectId - Project ID
 * @param {Object} resource - Resource data
 * @returns {Promise<Object>} Added resource
 */
export const addResource = async (projectId, resource) => {
  const response = await apiClient.post(ENDPOINTS.resources(projectId), resource);
  return response.data;
};

// =============================================================================
// GALLERY
// =============================================================================

/**
 * Gets project gallery
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Gallery items
 */
export const getGallery = async (projectId) => {
  const response = await apiClient.get(ENDPOINTS.gallery(projectId));
  return response.data;
};

/**
 * Uploads gallery item
 * @param {string} projectId - Project ID
 * @param {File} file - File to upload
 * @param {Object} metadata - Item metadata
 * @returns {Promise<Object>} Uploaded item
 */
export const uploadGalleryItem = async (projectId, file, metadata = {}) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('metadata', JSON.stringify(metadata));
  
  const response = await apiClient.upload(ENDPOINTS.gallery(projectId), formData);
  
  logUserAction('gallery_item_uploaded', { projectId });
  
  return response.data;
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Invalidates project cache
 * @param {string} projectId - Project ID
 */
const invalidateProjectCache = (projectId) => {
  const { removeItem } = require('../storage/localStorage.service');
  removeItem(`cache_project_${projectId}`);
};

/**
 * Gets project status info
 * @param {string} status - Status code
 * @returns {Object} Status info
 */
export const getStatusInfo = (status) => {
  const statuses = {
    [PROJECT_STATUS.DRAFT]: { label: 'Draft', color: 'gray', icon: '📝' },
    [PROJECT_STATUS.PLANNING]: { label: 'Planning', color: 'blue', icon: '📋' },
    [PROJECT_STATUS.ACTIVE]: { label: 'Active', color: 'green', icon: '🚀' },
    [PROJECT_STATUS.ON_HOLD]: { label: 'On Hold', color: 'yellow', icon: '⏸️' },
    [PROJECT_STATUS.COMPLETED]: { label: 'Completed', color: 'purple', icon: '✅' },
    [PROJECT_STATUS.ARCHIVED]: { label: 'Archived', color: 'gray', icon: '📦' }
  };
  
  return statuses[status] || { label: status, color: 'gray', icon: '❓' };
};

/**
 * Gets category info
 * @param {string} category - Category code
 * @returns {Object} Category info
 */
export const getCategoryInfo = (category) => {
  const categories = {
    [PROJECT_CATEGORIES.EDUCATION]: { label: 'Education', icon: '📚', color: 'indigo' },
    [PROJECT_CATEGORIES.ENVIRONMENT]: { label: 'Environment', icon: '🌍', color: 'green' },
    [PROJECT_CATEGORIES.HEALTH]: { label: 'Health', icon: '🏥', color: 'red' },
    [PROJECT_CATEGORIES.TECHNOLOGY]: { label: 'Technology', icon: '💻', color: 'blue' },
    [PROJECT_CATEGORIES.COMMUNITY]: { label: 'Community', icon: '👥', color: 'purple' },
    [PROJECT_CATEGORIES.ECONOMIC]: { label: 'Economic', icon: '💰', color: 'yellow' },
    [PROJECT_CATEGORIES.GOVERNANCE]: { label: 'Governance', icon: '🏛️', color: 'gray' }
  };
  
  return categories[category] || { label: category, icon: '❓', color: 'gray' };
};

/**
 * Calculates project completion percentage
 * @param {Object} project - Project data
 * @returns {number} Completion percentage
 */
export const calculateCompletion = (project) => {
  if (!project?.milestones || project.milestones.length === 0) {
    return 0;
  }
  
  const completed = project.milestones.filter(
    m => m.status === MILESTONE_STATUS.COMPLETED
  ).length;
  
  return Math.round((completed / project.milestones.length) * 100);
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // CRUD
  createProject,
  getProject,
  updateProject,
  deleteProject,
  changeStatus,
  
  // Listing
  getMyProjects,
  discoverProjects,
  getFeaturedProjects,
  
  // Milestones
  getMilestones,
  createMilestone,
  updateMilestone,
  completeMilestone,
  
  // Team
  getTeam,
  addTeamMember,
  updateTeamMember,
  removeTeamMember,
  
  // Updates
  getUpdates,
  postUpdate,
  
  // Impact
  getImpact,
  recordImpact,
  
  // Funding
  getFunding,
  contributeBaraka,
  getResources,
  addResource,
  
  // Gallery
  getGallery,
  uploadGalleryItem,
  
  // Helpers
  getStatusInfo,
  getCategoryInfo,
  calculateCompletion,
  
  // Constants
  PROJECT_STATUS,
  PROJECT_VISIBILITY,
  PROJECT_CATEGORIES,
  MILESTONE_STATUS,
  TEAM_ROLES
};