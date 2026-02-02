/**
 * GPS Lab Platform - GPO Service
 * 
 * GPS Problem Opportunities (GPO) project management service.
 * Handles CRUD, submission, review, and categorisation of GPO projects.
 * 
 * @module services/api/gpo.service
 * @version 1.1.0
 */

import apiClient from './client';
import { getCache, setCache } from '../storage/localStorage.service';
import { logUserAction } from '../../utils/error/logger';

const USE_MOCK = process.env.REACT_APP_USE_MOCK_DATA === 'true' ||
                 process.env.NODE_ENV === 'development';
const mockDelay = (ms = 300) => new Promise(r => setTimeout(r, ms));
const logMock = (method) => console.info(`[GPOService:MOCK] ${method}`);

// =============================================================================
// MOCK DATA
// =============================================================================

let mockProjects = [
  {
    id: 'gpo_001', title: 'Clean Water Access Mapping',
    description: 'Map and analyze clean water access points in rural Kiambu County.',
    category: 'environment', status: 'in_progress', stage: 2,
    owner: { id: 'usr_mock_001', username: 'GPSExplorer' },
    team: [], tags: ['water', 'mapping', 'rural', 'kenya'],
    progress: 45, submittedAt: null,
    createdAt: '2025-11-01T10:00:00Z', updatedAt: new Date().toISOString()
  },
  {
    id: 'gpo_002', title: 'Digital Literacy for Farmers',
    description: 'Design a mobile-first curriculum for smallholder farmer digital skills.',
    category: 'education', status: 'draft', stage: 1,
    owner: { id: 'usr_mock_001', username: 'GPSExplorer' },
    team: [], tags: ['education', 'agriculture', 'mobile'],
    progress: 15, submittedAt: null,
    createdAt: '2025-12-05T08:30:00Z', updatedAt: new Date().toISOString()
  }
];

const MOCK_CATEGORIES = [
  { id: 'environment', name: 'Environment & Sustainability', icon: '🌍', projectCount: 24 },
  { id: 'education', name: 'Education & Skills', icon: '📚', projectCount: 31 },
  { id: 'health', name: 'Health & Wellbeing', icon: '🏥', projectCount: 18 },
  { id: 'agriculture', name: 'Agriculture & Food', icon: '🌾', projectCount: 22 },
  { id: 'technology', name: 'Technology & Innovation', icon: '💡', projectCount: 15 },
  { id: 'community', name: 'Community Development', icon: '🏘️', projectCount: 20 }
];

// =============================================================================
// ENDPOINTS
// =============================================================================

const ENDPOINTS = {
  list: '/gpo/projects',
  detail: (id) => `/gpo/projects/${id}`,
  create: '/gpo/projects',
  update: (id) => `/gpo/projects/${id}`,
  submit: (id) => `/gpo/projects/${id}/submit`,
  review: (id) => `/gpo/projects/${id}/review`,
  categories: '/gpo/categories'
};

const CACHE_TTL = { categories: 30 * 60 * 1000 };

// =============================================================================
// OPERATIONS
// =============================================================================

export const getProjects = async ({ page = 1, limit = 20, status, category, search } = {}) => {
  if (USE_MOCK) {
    logMock('getProjects');
    await mockDelay(300);
    let filtered = [...mockProjects];
    if (status) filtered = filtered.filter(p => p.status === status);
    if (category) filtered = filtered.filter(p => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(q));
    }
    const start = (page - 1) * limit;
    return {
      projects: filtered.slice(start, start + limit),
      pagination: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) }
    };
  }
  const params = { page, limit };
  if (status) params.status = status;
  if (category) params.category = category;
  if (search) params.search = search;
  const response = await apiClient.get(ENDPOINTS.list, { params });
  return response.data;
};

export const getProject = async (projectId) => {
  if (USE_MOCK) {
    logMock(`getProject: ${projectId}`);
    await mockDelay(250);
    const p = mockProjects.find(p => p.id === projectId);
    if (!p) throw new Error(`GPO project ${projectId} not found`);
    return { ...p };
  }
  const response = await apiClient.get(ENDPOINTS.detail(projectId));
  return response.data;
};

export const createProject = async (data) => {
  if (USE_MOCK) {
    logMock('createProject');
    await mockDelay(500);
    const project = {
      id: 'gpo_' + Date.now(), ...data,
      status: 'draft', progress: 0, stage: 1,
      owner: { id: 'usr_mock_001', username: 'GPSExplorer' },
      team: [], submittedAt: null,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    mockProjects.push(project);
    logUserAction('gpo_project_created', { projectId: project.id });
    return { ...project };
  }
  const response = await apiClient.post(ENDPOINTS.create, data);
  logUserAction('gpo_project_created', { projectId: response.data.id });
  return response.data;
};

export const updateProject = async (projectId, data) => {
  if (USE_MOCK) {
    logMock(`updateProject: ${projectId}`);
    await mockDelay(400);
    const p = mockProjects.find(p => p.id === projectId);
    if (!p) throw new Error(`GPO project ${projectId} not found`);
    Object.assign(p, data, { updatedAt: new Date().toISOString() });
    logUserAction('gpo_project_updated', { projectId });
    return { ...p };
  }
  const response = await apiClient.patch(ENDPOINTS.update(projectId), data);
  logUserAction('gpo_project_updated', { projectId });
  return response.data;
};

export const submitProject = async (projectId) => {
  if (USE_MOCK) {
    logMock(`submitProject: ${projectId}`);
    await mockDelay(600);
    const p = mockProjects.find(p => p.id === projectId);
    if (!p) throw new Error(`GPO project ${projectId} not found`);
    p.status = 'submitted';
    p.submittedAt = new Date().toISOString();
    logUserAction('gpo_project_submitted', { projectId });
    return { ...p, message: 'Project submitted for review' };
  }
  const response = await apiClient.post(ENDPOINTS.submit(projectId));
  logUserAction('gpo_project_submitted', { projectId });
  return response.data;
};

export const getProjectReview = async (projectId) => {
  if (USE_MOCK) {
    logMock(`getProjectReview: ${projectId}`);
    await mockDelay(300);
    return {
      projectId, status: 'pending',
      feedback: null, reviewedAt: null, reviewer: null
    };
  }
  const response = await apiClient.get(ENDPOINTS.review(projectId));
  return response.data;
};

export const getCategories = async ({ useCache = true } = {}) => {
  if (USE_MOCK) {
    logMock('getCategories');
    await mockDelay(200);
    return { categories: [...MOCK_CATEGORIES] };
  }
  if (useCache) {
    const cached = getCache('gpo_categories', CACHE_TTL.categories);
    if (cached) return cached;
  }
  const response = await apiClient.get(ENDPOINTS.categories);
  setCache('gpo_categories', response.data);
  return response.data;
};

export const deleteProject = async (projectId) => {
  if (USE_MOCK) {
    logMock(`deleteProject: ${projectId}`);
    await mockDelay(400);
    mockProjects = mockProjects.filter(p => p.id !== projectId);
    logUserAction('gpo_project_deleted', { projectId });
    return { deleted: true };
  }
  const response = await apiClient.delete(ENDPOINTS.detail(projectId));
  logUserAction('gpo_project_deleted', { projectId });
  return response.data;
};

export default {
  getProjects, getProject, createProject, updateProject,
  submitProject, getProjectReview, getCategories, deleteProject
};