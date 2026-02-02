/**
 * GPS Lab Platform - University Service
 * 
 * University integration for enrollment, program browsing,
 * course management, and credential verification.
 * 
 * @module services/api/university.service
 * @version 1.1.0
 */

import apiClient from './client';
import { getCache, setCache } from '../storage/localStorage.service';
import { logUserAction } from '../../utils/error/logger';

const USE_MOCK = process.env.REACT_APP_USE_MOCK_DATA === 'true' ||
                 process.env.NODE_ENV === 'development';
const mockDelay = (ms = 300) => new Promise(r => setTimeout(r, ms));
const logMock = (method) => console.info(`[UniversityService:MOCK] ${method}`);

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_UNIVERSITIES = [
  {
    id: 'uni_001', code: 'HGU', name: 'Handong Global University',
    country: 'South Korea', city: 'Pohang', logo: null,
    programs: 3, students: 245, isPartner: true,
    website: 'https://www.handong.edu'
  },
  {
    id: 'uni_002', code: 'UON', name: 'University of Nairobi',
    country: 'Kenya', city: 'Nairobi', logo: null,
    programs: 2, students: 180, isPartner: true,
    website: 'https://www.uonbi.ac.ke'
  },
  {
    id: 'uni_003', code: 'MAK', name: 'Makerere University',
    country: 'Uganda', city: 'Kampala', logo: null,
    programs: 2, students: 120, isPartner: true,
    website: 'https://www.mak.ac.ug'
  },
  {
    id: 'uni_004', code: 'UDSM', name: 'University of Dar es Salaam',
    country: 'Tanzania', city: 'Dar es Salaam', logo: null,
    programs: 1, students: 85, isPartner: false,
    website: 'https://www.udsm.ac.tz'
  }
];

const MOCK_PROGRAMS = [
  {
    id: 'prog_001', universityId: 'uni_001', name: 'GPS Lab Certificate Program',
    type: 'certificate', duration: '12 months', credits: 18,
    description: 'Complete the full GPS Lab curriculum integrated with university credits.',
    stages: { start: 1, end: 35 }, tuition: 0, enrolledCount: 145
  },
  {
    id: 'prog_002', universityId: 'uni_001', name: 'Social Innovation Minor',
    type: 'minor', duration: '24 months', credits: 36,
    description: 'GPS Lab curriculum as part of a Social Innovation academic minor.',
    stages: { start: 1, end: 35 }, tuition: 2400, enrolledCount: 68
  },
  {
    id: 'prog_003', universityId: 'uni_001', name: 'GPS Foundations Module',
    type: 'module', duration: '3 months', credits: 6,
    description: 'Adventures 1-2 as a standalone academic module.',
    stages: { start: 1, end: 10 }, tuition: 0, enrolledCount: 85
  }
];

const MOCK_MY_ENROLLMENT = {
  id: 'enr_001', universityId: 'uni_001', programId: 'prog_001',
  universityName: 'Handong Global University', programName: 'GPS Lab Certificate Program',
  status: 'active', enrolledAt: '2025-09-01T00:00:00Z',
  progress: { completedCredits: 3, totalCredits: 18, percentage: 17 },
  expectedCompletion: '2026-08-31T00:00:00Z'
};

// =============================================================================
// ENDPOINTS
// =============================================================================

const ENDPOINTS = {
  universities: '/universities',
  university: (id) => `/universities/${id}`,
  programs: (uniId) => `/universities/${uniId}/programs`,
  program: (uniId, progId) => `/universities/${uniId}/programs/${progId}`,
  enroll: '/universities/enroll',
  myEnrollments: '/universities/my-enrollments',
  search: '/universities/search',
  verify: '/universities/verify'
};

const CACHE_TTL = { universities: 30 * 60 * 1000, programs: 15 * 60 * 1000 };

// =============================================================================
// OPERATIONS
// =============================================================================

export const getUniversities = async ({ page = 1, limit = 20, country } = {}) => {
  if (USE_MOCK) {
    logMock('getUniversities');
    await mockDelay(300);
    let filtered = [...MOCK_UNIVERSITIES];
    if (country) filtered = filtered.filter(u => u.country.toLowerCase().includes(country.toLowerCase()));
    return { universities: filtered, pagination: { page, limit, total: filtered.length, totalPages: 1 } };
  }
  const params = { page, limit };
  if (country) params.country = country;
  const response = await apiClient.get(ENDPOINTS.universities, { params });
  return response.data;
};

export const getUniversity = async (universityId) => {
  if (USE_MOCK) {
    logMock(`getUniversity: ${universityId}`);
    await mockDelay(250);
    const u = MOCK_UNIVERSITIES.find(u => u.id === universityId);
    if (!u) throw new Error(`University ${universityId} not found`);
    return { ...u };
  }
  const response = await apiClient.get(ENDPOINTS.university(universityId));
  return response.data;
};

export const getPrograms = async (universityId) => {
  if (USE_MOCK) {
    logMock(`getPrograms: ${universityId}`);
    await mockDelay(250);
    const progs = MOCK_PROGRAMS.filter(p => p.universityId === universityId);
    return { programs: progs, total: progs.length };
  }
  const cached = getCache(`uni_programs_${universityId}`, CACHE_TTL.programs);
  if (cached) return cached;
  const response = await apiClient.get(ENDPOINTS.programs(universityId));
  setCache(`uni_programs_${universityId}`, response.data);
  return response.data;
};

export const getProgram = async (universityId, programId) => {
  if (USE_MOCK) {
    logMock(`getProgram: ${programId}`);
    await mockDelay(200);
    const p = MOCK_PROGRAMS.find(p => p.id === programId);
    if (!p) throw new Error(`Program ${programId} not found`);
    return { ...p };
  }
  const response = await apiClient.get(ENDPOINTS.program(universityId, programId));
  return response.data;
};

export const enroll = async ({ universityId, programId, studentId }) => {
  if (USE_MOCK) {
    logMock(`enroll: ${programId}`);
    await mockDelay(600);
    logUserAction('university_enrolled', { universityId, programId });
    return {
      enrollmentId: 'enr_' + Date.now(), universityId, programId,
      status: 'active', enrolledAt: new Date().toISOString()
    };
  }
  const response = await apiClient.post(ENDPOINTS.enroll, { universityId, programId, studentId });
  logUserAction('university_enrolled', { universityId, programId });
  return response.data;
};

export const getMyEnrollments = async () => {
  if (USE_MOCK) {
    logMock('getMyEnrollments');
    await mockDelay(250);
    return { enrollments: [{ ...MOCK_MY_ENROLLMENT }], total: 1 };
  }
  const response = await apiClient.get(ENDPOINTS.myEnrollments);
  return response.data;
};

export const searchUniversities = async (query) => {
  if (USE_MOCK) {
    logMock(`searchUniversities: ${query}`);
    await mockDelay(350);
    const q = query.toLowerCase();
    const results = MOCK_UNIVERSITIES.filter(u =>
      u.name.toLowerCase().includes(q) || u.code.toLowerCase().includes(q) || u.country.toLowerCase().includes(q)
    );
    return { universities: results, total: results.length };
  }
  const response = await apiClient.get(ENDPOINTS.search, { params: { q: query } });
  return response.data;
};

export const verifyEnrollment = async (verificationCode) => {
  if (USE_MOCK) {
    logMock(`verifyEnrollment: ${verificationCode}`);
    await mockDelay(400);
    return {
      valid: true, enrollmentId: MOCK_MY_ENROLLMENT.id,
      university: 'Handong Global University', program: 'GPS Lab Certificate Program',
      student: 'GPS Explorer', status: 'active'
    };
  }
  const response = await apiClient.post(ENDPOINTS.verify, { code: verificationCode });
  return response.data;
};

export const withdrawEnrollment = async (enrollmentId, { reason } = {}) => {
  if (USE_MOCK) {
    logMock(`withdrawEnrollment: ${enrollmentId}`);
    await mockDelay(500);
    logUserAction('university_withdrawn', { enrollmentId });
    return { enrollmentId, status: 'withdrawn', effectiveDate: new Date().toISOString() };
  }
  const response = await apiClient.post(`${ENDPOINTS.myEnrollments}/${enrollmentId}/withdraw`, { reason });
  logUserAction('university_withdrawn', { enrollmentId });
  return response.data;
};

export default {
  getUniversities, getUniversity, getPrograms, getProgram,
  enroll, getMyEnrollments, searchUniversities,
  verifyEnrollment, withdrawEnrollment
};