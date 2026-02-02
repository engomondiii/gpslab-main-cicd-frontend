/**
 * GPS Lab Platform - Portfolio Service
 * 
 * User portfolio management for showcasing projects, certificates,
 * achievements, and generating shareable profiles.
 * 
 * @module services/api/portfolio.service
 * @version 1.1.0
 */

import apiClient from './client';
import { getCache, setCache } from '../storage/localStorage.service';
import { logUserAction } from '../../utils/error/logger';

const USE_MOCK = process.env.REACT_APP_USE_MOCK_DATA === 'true' ||
                 process.env.NODE_ENV === 'development';
const mockDelay = (ms = 300) => new Promise(r => setTimeout(r, ms));
const logMock = (method) => console.info(`[PortfolioService:MOCK] ${method}`);

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_PORTFOLIO = {
  userId: 'usr_mock_001', username: 'GPSExplorer', displayName: 'GPS Explorer',
  headline: 'GPS Problem Solver | Sustainable Development Advocate',
  summary: 'Passionate about leveraging technology and systems thinking to address agricultural and community challenges in East Africa.',
  stats: {
    missionsCompleted: 8, checkpointsPassed: 2, adventuresCompleted: 0,
    totalXP: 6250, totalBaraka: 2450, rank: 142, badgeCount: 5
  },
  featured: ['proj_001'],
  visibility: 'public',
  lastUpdated: new Date().toISOString()
};

const MOCK_PROJECTS = [
  {
    id: 'proj_001', title: 'Clean Water Access Mapping',
    description: 'Mapped and analyzed clean water access points across 5 communities in Kiambu County.',
    category: 'environment', status: 'completed',
    skills: ['GIS mapping', 'community research', 'data analysis'],
    images: [], links: [], featured: true,
    completedAt: '2025-12-15T00:00:00Z'
  },
  {
    id: 'proj_002', title: 'Digital Literacy Curriculum Draft',
    description: 'Initial framework for a mobile-first digital literacy program for smallholder farmers.',
    category: 'education', status: 'in_progress',
    skills: ['curriculum design', 'UX research', 'mobile-first design'],
    images: [], links: [], featured: false,
    completedAt: null
  }
];

const MOCK_CERTIFICATES = [
  {
    id: 'cert_001', title: 'Adventure 1: Foundation — Complete',
    issueDate: '2025-12-18T00:00:00Z', type: 'adventure',
    verificationCode: 'GPS-CERT-A1-2025-001',
    pdfUrl: null, skills: ['GPS thinking', 'systems thinking', 'empathy mapping']
  }
];

// =============================================================================
// ENDPOINTS
// =============================================================================

const ENDPOINTS = {
  portfolio: '/portfolio',
  projects: '/portfolio/projects',
  project: (id) => `/portfolio/projects/${id}`,
  certificates: '/portfolio/certificates',
  achievements: '/portfolio/achievements',
  share: '/portfolio/share',
  export: '/portfolio/export',
  public: (username) => `/portfolio/${username}`
};

const CACHE_TTL = { portfolio: 5 * 60 * 1000 };

// =============================================================================
// OPERATIONS
// =============================================================================

export const getPortfolio = async ({ useCache = true } = {}) => {
  if (USE_MOCK) {
    logMock('getPortfolio');
    await mockDelay(300);
    return { ...MOCK_PORTFOLIO, projects: [...MOCK_PROJECTS], certificates: [...MOCK_CERTIFICATES] };
  }
  if (useCache) { const cached = getCache('portfolio', CACHE_TTL.portfolio); if (cached) return cached; }
  const response = await apiClient.get(ENDPOINTS.portfolio);
  setCache('portfolio', response.data);
  return response.data;
};

export const updatePortfolio = async (data) => {
  if (USE_MOCK) {
    logMock('updatePortfolio');
    await mockDelay(400);
    Object.assign(MOCK_PORTFOLIO, data, { lastUpdated: new Date().toISOString() });
    logUserAction('portfolio_updated', { fields: Object.keys(data) });
    return { ...MOCK_PORTFOLIO };
  }
  const response = await apiClient.patch(ENDPOINTS.portfolio, data);
  logUserAction('portfolio_updated', { fields: Object.keys(data) });
  return response.data;
};

export const getUserPortfolio = async (username) => {
  if (USE_MOCK) {
    logMock(`getUserPortfolio: ${username}`);
    await mockDelay(300);
    return { ...MOCK_PORTFOLIO, username, projects: MOCK_PROJECTS.filter(p => p.status === 'completed') };
  }
  const response = await apiClient.get(ENDPOINTS.public(username));
  return response.data;
};

export const getProjects = async () => {
  if (USE_MOCK) { logMock('getProjects'); await mockDelay(250); return { projects: [...MOCK_PROJECTS] }; }
  const response = await apiClient.get(ENDPOINTS.projects);
  return response.data;
};

export const addProject = async (data) => {
  if (USE_MOCK) {
    logMock('addProject');
    await mockDelay(500);
    const project = { id: 'proj_' + Date.now(), ...data, featured: false, createdAt: new Date().toISOString() };
    MOCK_PROJECTS.push(project);
    logUserAction('portfolio_project_added', { projectId: project.id });
    return { ...project };
  }
  const response = await apiClient.post(ENDPOINTS.projects, data);
  logUserAction('portfolio_project_added', { projectId: response.data.id });
  return response.data;
};

export const updateProject = async (projectId, data) => {
  if (USE_MOCK) {
    logMock(`updateProject: ${projectId}`);
    await mockDelay(400);
    const p = MOCK_PROJECTS.find(p => p.id === projectId);
    if (p) Object.assign(p, data);
    return p ? { ...p } : null;
  }
  const response = await apiClient.patch(ENDPOINTS.project(projectId), data);
  return response.data;
};

export const removeProject = async (projectId) => {
  if (USE_MOCK) {
    logMock(`removeProject: ${projectId}`);
    await mockDelay(300);
    const idx = MOCK_PROJECTS.findIndex(p => p.id === projectId);
    if (idx >= 0) MOCK_PROJECTS.splice(idx, 1);
    logUserAction('portfolio_project_removed', { projectId });
    return { removed: true };
  }
  const response = await apiClient.delete(ENDPOINTS.project(projectId));
  logUserAction('portfolio_project_removed', { projectId });
  return response.data;
};

export const getCertificates = async () => {
  if (USE_MOCK) { logMock('getCertificates'); await mockDelay(250); return { certificates: [...MOCK_CERTIFICATES] }; }
  const response = await apiClient.get(ENDPOINTS.certificates);
  return response.data;
};

export const generateShareLink = async () => {
  if (USE_MOCK) {
    logMock('generateShareLink');
    await mockDelay(300);
    return { url: `${window.location.origin}/portfolio/GPSExplorer`, expiresAt: null };
  }
  const response = await apiClient.post(ENDPOINTS.share);
  return response.data;
};

export const exportPortfolio = async ({ format = 'pdf' } = {}) => {
  if (USE_MOCK) {
    logMock(`exportPortfolio: ${format}`);
    await mockDelay(800);
    logUserAction('portfolio_exported', { format });
    return { requestId: 'exp_' + Date.now(), format, status: 'processing' };
  }
  const response = await apiClient.post(ENDPOINTS.export, { format });
  logUserAction('portfolio_exported', { format });
  return response.data;
};

export default {
  getPortfolio, updatePortfolio, getUserPortfolio,
  getProjects, addProject, updateProject, removeProject,
  getCertificates, generateShareLink, exportPortfolio
};