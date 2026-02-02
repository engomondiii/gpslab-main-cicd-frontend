/**
 * GPS Lab Platform - Mentor Service
 * 
 * Mentor matching, session management, and mentorship tracking.
 * 
 * @module services/api/mentor.service
 * @version 1.1.0
 */

import apiClient from './client';
import { getCache, setCache } from '../storage/localStorage.service';
import { logUserAction } from '../../utils/error/logger';

const USE_MOCK = process.env.REACT_APP_USE_MOCK_DATA === 'true' ||
                 process.env.NODE_ENV === 'development';
const mockDelay = (ms = 300) => new Promise(r => setTimeout(r, ms));
const logMock = (method) => console.info(`[MentorService:MOCK] ${method}`);

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_MENTORS = [
  {
    id: 'mnt_001', username: 'DrAmara', displayName: 'Dr. Amara Chen',
    avatarUrl: null, title: 'Senior GPS Mentor', bio: 'PhD in Sustainable Development, 10+ years guiding global problem solvers.',
    expertise: ['systems thinking', 'sustainability', 'research methods'],
    rating: 4.9, reviewCount: 47, sessionsCompleted: 120, availability: 'available',
    stageRange: { min: 1, max: 35 }, languages: ['en', 'sw'],
    nextAvailable: new Date(Date.now() + 2 * 86400000).toISOString()
  },
  {
    id: 'mnt_002', username: 'ProfNdege', displayName: 'Prof. Ndege Okafor',
    avatarUrl: null, title: 'Agriculture & Tech Mentor', bio: 'Agri-tech entrepreneur helping GPS solvers bridge technology and farming.',
    expertise: ['agriculture', 'technology', 'entrepreneurship'],
    rating: 4.7, reviewCount: 32, sessionsCompleted: 85, availability: 'busy',
    stageRange: { min: 11, max: 35 }, languages: ['en'],
    nextAvailable: new Date(Date.now() + 5 * 86400000).toISOString()
  },
  {
    id: 'mnt_003', username: 'CoachLisa', displayName: 'Lisa Wanjiku',
    avatarUrl: null, title: 'Community Development Coach', bio: 'Passionate about grassroots impact and youth empowerment.',
    expertise: ['community development', 'leadership', 'impact measurement'],
    rating: 4.8, reviewCount: 28, sessionsCompleted: 65, availability: 'available',
    stageRange: { min: 1, max: 21 }, languages: ['en', 'sw', 'fr'],
    nextAvailable: new Date(Date.now() + 86400000).toISOString()
  }
];

let mockMySessions = [
  {
    id: 'sess_001', mentorId: 'mnt_001', mentorName: 'Dr. Amara Chen',
    topic: 'Research Methods for Stage 2', status: 'completed',
    scheduledAt: '2025-12-15T14:00:00Z', duration: 45,
    notes: 'Discussed interview techniques and stakeholder mapping.', rating: 5
  }
];

// =============================================================================
// ENDPOINTS
// =============================================================================

const ENDPOINTS = {
  list: '/mentors',
  detail: (id) => `/mentors/${id}`,
  search: '/mentors/search',
  request: '/mentors/request',
  sessions: '/mentors/sessions',
  session: (id) => `/mentors/sessions/${id}`,
  schedule: '/mentors/sessions/schedule',
  myMentors: '/mentors/my-mentors',
  review: (sessionId) => `/mentors/sessions/${sessionId}/review`
};

const CACHE_TTL = { mentors: 10 * 60 * 1000 };

// =============================================================================
// OPERATIONS
// =============================================================================

export const getMentors = async ({ page = 1, limit = 20, expertise, availability } = {}) => {
  if (USE_MOCK) {
    logMock('getMentors');
    await mockDelay(300);
    let filtered = [...MOCK_MENTORS];
    if (expertise) filtered = filtered.filter(m => m.expertise.some(e => e.includes(expertise)));
    if (availability) filtered = filtered.filter(m => m.availability === availability);
    return {
      mentors: filtered,
      pagination: { page, limit, total: filtered.length, totalPages: 1 }
    };
  }
  const params = { page, limit };
  if (expertise) params.expertise = expertise;
  if (availability) params.availability = availability;
  const response = await apiClient.get(ENDPOINTS.list, { params });
  return response.data;
};

export const getMentor = async (mentorId) => {
  if (USE_MOCK) {
    logMock(`getMentor: ${mentorId}`);
    await mockDelay(250);
    const m = MOCK_MENTORS.find(m => m.id === mentorId);
    if (!m) throw new Error(`Mentor ${mentorId} not found`);
    return { ...m };
  }
  const response = await apiClient.get(ENDPOINTS.detail(mentorId));
  return response.data;
};

export const searchMentors = async (query) => {
  if (USE_MOCK) {
    logMock(`searchMentors: ${query}`);
    await mockDelay(350);
    const q = query.toLowerCase();
    const results = MOCK_MENTORS.filter(m =>
      m.displayName.toLowerCase().includes(q) ||
      m.expertise.some(e => e.includes(q)) ||
      m.bio.toLowerCase().includes(q)
    );
    return { mentors: results, total: results.length };
  }
  const response = await apiClient.get(ENDPOINTS.search, { params: { q: query } });
  return response.data;
};

export const requestMentorship = async ({ mentorId, message, topic }) => {
  if (USE_MOCK) {
    logMock(`requestMentorship: ${mentorId}`);
    await mockDelay(500);
    logUserAction('mentorship_requested', { mentorId });
    return { requestId: 'req_' + Date.now(), mentorId, status: 'pending', message, topic };
  }
  const response = await apiClient.post(ENDPOINTS.request, { mentorId, message, topic });
  logUserAction('mentorship_requested', { mentorId });
  return response.data;
};

export const getSessions = async ({ page = 1, limit = 20, status } = {}) => {
  if (USE_MOCK) {
    logMock('getSessions');
    await mockDelay(250);
    let sessions = [...mockMySessions];
    if (status) sessions = sessions.filter(s => s.status === status);
    return {
      sessions,
      pagination: { page, limit, total: sessions.length, totalPages: 1 }
    };
  }
  const params = { page, limit };
  if (status) params.status = status;
  const response = await apiClient.get(ENDPOINTS.sessions, { params });
  return response.data;
};

export const scheduleSession = async ({ mentorId, topic, preferredDate, duration = 45 }) => {
  if (USE_MOCK) {
    logMock(`scheduleSession: ${mentorId}`);
    await mockDelay(500);
    const session = {
      id: 'sess_' + Date.now(), mentorId,
      mentorName: MOCK_MENTORS.find(m => m.id === mentorId)?.displayName || 'Mentor',
      topic, status: 'scheduled',
      scheduledAt: preferredDate || new Date(Date.now() + 3 * 86400000).toISOString(),
      duration, notes: null, rating: null
    };
    mockMySessions.push(session);
    logUserAction('mentor_session_scheduled', { mentorId });
    return { ...session };
  }
  const response = await apiClient.post(ENDPOINTS.schedule, { mentorId, topic, preferredDate, duration });
  logUserAction('mentor_session_scheduled', { mentorId });
  return response.data;
};

export const cancelSession = async (sessionId) => {
  if (USE_MOCK) {
    logMock(`cancelSession: ${sessionId}`);
    await mockDelay(300);
    const s = mockMySessions.find(s => s.id === sessionId);
    if (s) s.status = 'cancelled';
    logUserAction('mentor_session_cancelled', { sessionId });
    return { sessionId, status: 'cancelled' };
  }
  const response = await apiClient.post(`${ENDPOINTS.session(sessionId)}/cancel`);
  logUserAction('mentor_session_cancelled', { sessionId });
  return response.data;
};

export const reviewSession = async (sessionId, { rating, comment }) => {
  if (USE_MOCK) {
    logMock(`reviewSession: ${sessionId}`);
    await mockDelay(400);
    const s = mockMySessions.find(s => s.id === sessionId);
    if (s) s.rating = rating;
    logUserAction('mentor_session_reviewed', { sessionId, rating });
    return { sessionId, rating, comment };
  }
  const response = await apiClient.post(ENDPOINTS.review(sessionId), { rating, comment });
  logUserAction('mentor_session_reviewed', { sessionId, rating });
  return response.data;
};

export const getMyMentors = async () => {
  if (USE_MOCK) {
    logMock('getMyMentors');
    await mockDelay(250);
    return { mentors: [MOCK_MENTORS[0]], total: 1 };
  }
  const response = await apiClient.get(ENDPOINTS.myMentors);
  return response.data;
};

export default {
  getMentors, getMentor, searchMentors, requestMentorship,
  getSessions, scheduleSession, cancelSession, reviewSession,
  getMyMentors
};