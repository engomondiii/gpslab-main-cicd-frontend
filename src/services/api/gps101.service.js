/**
 * GPS 101 API Service
 * 
 * Handles all API calls related to GPS 101 Basic course.
 */

import apiClient from './client';

const GPS101_API_BASE = '/api/gps101';

/**
 * GPS 101 Service
 */
const gps101Service = {
  // ==================== ENROLLMENT ====================

  /**
   * Enroll user in GPS 101
   */
  enrollInGPS101: async () => {
    try {
      const response = await apiClient.post(`${GPS101_API_BASE}/enroll`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get GPS 101 enrollment status
   */
  getEnrollmentStatus: async () => {
    try {
      const response = await apiClient.get(`${GPS101_API_BASE}/enrollment`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== STAGES ====================

  /**
   * Get all GPS 101 stages
   */
  getAllStages: async () => {
    try {
      const response = await apiClient.get(`${GPS101_API_BASE}/stages`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get specific stage by number
   */
  getStage: async (stageNumber) => {
    try {
      const response = await apiClient.get(`${GPS101_API_BASE}/stages/${stageNumber}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get stage progress
   */
  getStageProgress: async (stageNumber) => {
    try {
      const response = await apiClient.get(`${GPS101_API_BASE}/stages/${stageNumber}/progress`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Complete stage
   */
  completeStage: async (stageNumber, deliverableData) => {
    try {
      const response = await apiClient.post(`${GPS101_API_BASE}/stages/${stageNumber}/complete`, {
        deliverable: deliverableData
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== MISSIONS ====================

  /**
   * Get all GPS 101 missions
   */
  getAllMissions: async () => {
    try {
      const response = await apiClient.get(`${GPS101_API_BASE}/missions`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get missions for specific stage
   */
  getStageMissions: async (stageNumber) => {
    try {
      const response = await apiClient.get(`${GPS101_API_BASE}/stages/${stageNumber}/missions`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get mission by ID
   */
  getMission: async (missionId) => {
    try {
      const response = await apiClient.get(`${GPS101_API_BASE}/missions/${missionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Start mission
   */
  startMission: async (missionId) => {
    try {
      const response = await apiClient.post(`${GPS101_API_BASE}/missions/${missionId}/start`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Complete mission
   */
  completeMission: async (missionId) => {
    try {
      const response = await apiClient.post(`${GPS101_API_BASE}/missions/${missionId}/complete`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get mission progress
   */
  getMissionProgress: async (missionId) => {
    try {
      const response = await apiClient.get(`${GPS101_API_BASE}/missions/${missionId}/progress`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== CHECKPOINTS ====================

  /**
   * Get checkpoint by ID
   */
  getCheckpoint: async (checkpointId) => {
    try {
      const response = await apiClient.get(`${GPS101_API_BASE}/checkpoints/${checkpointId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Submit checkpoint
   */
  submitCheckpoint: async (checkpointId, submissionData) => {
    try {
      const response = await apiClient.post(
        `${GPS101_API_BASE}/checkpoints/${checkpointId}/submit`,
        submissionData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get checkpoint evaluation
   */
  getCheckpointEvaluation: async (checkpointId) => {
    try {
      const response = await apiClient.get(`${GPS101_API_BASE}/checkpoints/${checkpointId}/evaluation`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Retry checkpoint (using R2R or pR2R)
   */
  retryCheckpoint: async (checkpointId, retryType = 'R2R') => {
    try {
      const response = await apiClient.post(`${GPS101_API_BASE}/checkpoints/${checkpointId}/retry`, {
        retryType
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== DELIVERABLES ====================

  /**
   * Save deliverable
   */
  saveDeliverable: async (deliverableId, data) => {
    try {
      const response = await apiClient.post(`${GPS101_API_BASE}/deliverables/${deliverableId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get deliverable
   */
  getDeliverable: async (deliverableId) => {
    try {
      const response = await apiClient.get(`${GPS101_API_BASE}/deliverables/${deliverableId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all deliverables
   */
  getAllDeliverables: async () => {
    try {
      const response = await apiClient.get(`${GPS101_API_BASE}/deliverables`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update deliverable
   */
  updateDeliverable: async (deliverableId, data) => {
    try {
      const response = await apiClient.put(`${GPS101_API_BASE}/deliverables/${deliverableId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete deliverable
   */
  deleteDeliverable: async (deliverableId) => {
    try {
      const response = await apiClient.delete(`${GPS101_API_BASE}/deliverables/${deliverableId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== PROGRESS ====================

  /**
   * Get overall GPS 101 progress
   */
  getOverallProgress: async () => {
    try {
      const response = await apiClient.get(`${GPS101_API_BASE}/progress`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get progress summary
   */
  getProgressSummary: async () => {
    try {
      const response = await apiClient.get(`${GPS101_API_BASE}/progress/summary`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== STUDY MISSIONS (R2R/pR2R) ====================

  /**
   * Get study mission for failed checkpoint
   */
  getStudyMission: async (checkpointId) => {
    try {
      const response = await apiClient.get(`${GPS101_API_BASE}/study/${checkpointId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Complete study mission
   */
  completeStudyMission: async (checkpointId, studyData) => {
    try {
      const response = await apiClient.post(`${GPS101_API_BASE}/study/${checkpointId}/complete`, studyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get R2R balance
   */
  getR2RBalance: async () => {
    try {
      const response = await apiClient.get(`${GPS101_API_BASE}/r2r/balance`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get pR2R balance
   */
  getPR2RBalance: async () => {
    try {
      const response = await apiClient.get(`${GPS101_API_BASE}/pr2r/balance`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== BARAKA & XP ====================

  /**
   * Get GPS 101 Baraka earned
   */
  getBarakaEarned: async () => {
    try {
      const response = await apiClient.get(`${GPS101_API_BASE}/baraka`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get GPS 101 XP earned
   */
  getXPEarned: async () => {
    try {
      const response = await apiClient.get(`${GPS101_API_BASE}/xp`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== BADGES ====================

  /**
   * Get earned badges
   */
  getEarnedBadges: async () => {
    try {
      const response = await apiClient.get(`${GPS101_API_BASE}/badges`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check Orange Beacon status
   */
  checkOrangeBeacon: async () => {
    try {
      const response = await apiClient.get(`${GPS101_API_BASE}/badges/orange-beacon`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== NAVIGATOR AI ====================

  /**
   * Get Navigator guidance for stage
   */
  getStageGuidance: async (stageNumber) => {
    try {
      const response = await apiClient.get(`${GPS101_API_BASE}/navigator/stage/${stageNumber}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get Navigator guidance for mission
   */
  getMissionGuidance: async (missionId) => {
    try {
      const response = await apiClient.get(`${GPS101_API_BASE}/navigator/mission/${missionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get Navigator guidance for checkpoint
   */
  getCheckpointGuidance: async (checkpointId) => {
    try {
      const response = await apiClient.get(`${GPS101_API_BASE}/navigator/checkpoint/${checkpointId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get ChatGPT prompt suggestions
   */
  getChatGPTPrompts: async (checkpointId) => {
    try {
      const response = await apiClient.get(`${GPS101_API_BASE}/navigator/prompts/${checkpointId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== PORTFOLIO ====================

  /**
   * Export GPS 101 portfolio
   */
  exportPortfolio: async (format = 'pdf') => {
    try {
      const response = await apiClient.get(`${GPS101_API_BASE}/portfolio/export`, {
        params: { format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get portfolio summary
   */
  getPortfolioSummary: async () => {
    try {
      const response = await apiClient.get(`${GPS101_API_BASE}/portfolio/summary`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default gps101Service;