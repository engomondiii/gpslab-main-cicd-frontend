/**
 * Stages Constants
 * 
 * Stage definitions for all GPS courses.
 * GPS 101 CORRECTED: 5 stages, 1 mission per stage
 */

import { GPS_101_CONFIG } from '../../config/gps101.config';

// ==================== GPO CALL STAGES (Stages -4 to 0) ====================

export const GPO_CALL_STAGES = [
  {
    stageId: 'stage_-4',
    stageNumber: -4,
    stageName: 'Stage -4: Identify Your Problem',
    description: 'Define the problem you want to solve',
    missions: 5,
    order: 1
  },
  {
    stageId: 'stage_-3',
    stageNumber: -3,
    stageName: 'Stage -3: Understand Your Problem Owners',
    description: 'Research and empathize with those affected by your problem',
    missions: 5,
    order: 2
  },
  {
    stageId: 'stage_-2',
    stageNumber: -2,
    stageName: 'Stage -2: Develop Your Solution',
    description: 'Design your innovative solution',
    missions: 5,
    order: 3
  },
  {
    stageId: 'stage_-1',
    stageNumber: -1,
    stageName: 'Stage -1: Build Your Showcase',
    description: 'Create your Problem Owner Showcase',
    missions: 5,
    order: 4
  },
  {
    stageId: 'stage_0',
    stageNumber: 0,
    stageName: 'Stage 0: Present Your Showcase',
    description: 'Share your showcase with the community',
    missions: 5,
    order: 5
  }
];

// ==================== GPS 101 BASIC STAGES (Stages 1-5) ====================

/**
 * GPS 101 Basic - 5 Stages (CORRECTED)
 * 
 * CORRECT STRUCTURE:
 * - 5 Stages
 * - 1 Mission per Stage (NOT 6 missions)
 * - Each mission has 6 sub-missions
 * - Each sub-mission has 5 checkpoints
 */
export const GPS_101_BASIC_STAGES = GPS_101_CONFIG.STAGES.map((stage, index) => ({
  stageId: stage.stageId,
  stageNumber: stage.stageNumber,
  stageName: stage.stageName,
  stageNameKo: stage.stageNameKo,
  stageNameSw: stage.stageNameSw,
  question: stage.question,
  questionKo: stage.questionKo,
  questionSw: stage.questionSw,
  expectedOutcome: stage.expectedOutcome,
  expectedOutcomeKo: stage.expectedOutcomeKo,
  expectedOutcomeSw: stage.expectedOutcomeSw,
  description: stage.description,
  descriptionKo: stage.descriptionKo,
  descriptionSw: stage.descriptionSw,
  missions: stage.missions, // 1 mission per stage
  duration: stage.duration,
  deliverable: stage.deliverable,
  deliverableKo: stage.deliverableKo,
  deliverableSw: stage.deliverableSw,
  order: stage.order,
  courseCode: 'GPS_101_BASIC'
}));

// ==================== GPS PREP STAGES (Stages 6-10) ====================

export const GPS_PREP_STAGES = [
  {
    stageId: 'gps_prep_stage_6',
    stageNumber: 6,
    stageName: 'Stage 6: Problem Definition',
    description: 'Define your problem with precision',
    missions: 6,
    duration: '3 weeks',
    order: 1,
    courseCode: 'GPS_PREP'
  },
  {
    stageId: 'gps_prep_stage_7',
    stageNumber: 7,
    stageName: 'Stage 7: Research & Root Cause Analysis',
    description: 'Deep dive into problem research',
    missions: 6,
    duration: '3 weeks',
    order: 2,
    courseCode: 'GPS_PREP'
  },
  {
    stageId: 'gps_prep_stage_8',
    stageNumber: 8,
    stageName: 'Stage 8: User Personas & Solution Design',
    description: 'Develop user personas and design solutions',
    missions: 6,
    duration: '3 weeks',
    order: 3,
    courseCode: 'GPS_PREP'
  },
  {
    stageId: 'gps_prep_stage_9',
    stageNumber: 9,
    stageName: 'Stage 9: Business Model & White Paper',
    description: 'Build business model and write white paper',
    missions: 6,
    duration: '3 weeks',
    order: 4,
    courseCode: 'GPS_PREP'
  },
  {
    stageId: 'gps_prep_stage_10',
    stageNumber: 10,
    stageName: 'Stage 10: Video Pitch',
    description: 'Create and deliver your 3-minute pitch',
    missions: 6,
    duration: '3 weeks',
    order: 5,
    courseCode: 'GPS_PREP'
  }
];

// ==================== GPS SIMULATION STAGES (Stages 11-15) ====================

export const GPS_SIMULATION_STAGES = [
  {
    stageId: 'gps_sim_stage_11',
    stageNumber: 11,
    stageName: 'Stage 11: Team Formation',
    description: 'Build your purpose-driven team',
    missions: 6,
    duration: '3 weeks',
    order: 1,
    courseCode: 'GPS_SIMULATION'
  },
  {
    stageId: 'gps_sim_stage_12',
    stageNumber: 12,
    stageName: 'Stage 12: Vision-Aligned Business Core',
    description: 'Align business with purpose and global challenges',
    missions: 6,
    duration: '3 weeks',
    order: 2,
    courseCode: 'GPS_SIMULATION'
  },
  {
    stageId: 'gps_sim_stage_13',
    stageNumber: 13,
    stageName: 'Stage 13: 4D Project Model Canvas',
    description: 'Construct mission-aligned canvas',
    missions: 6,
    duration: '3 weeks',
    order: 3,
    courseCode: 'GPS_SIMULATION'
  },
  {
    stageId: 'gps_sim_stage_14',
    stageNumber: 14,
    stageName: 'Stage 14: Revenue Strategies',
    description: 'Create sustainable revenue model',
    missions: 6,
    duration: '3 weeks',
    order: 4,
    courseCode: 'GPS_SIMULATION'
  },
  {
    stageId: 'gps_sim_stage_15',
    stageNumber: 15,
    stageName: 'Stage 15: Financial Simulation',
    description: 'Simulate financial planning and operations',
    missions: 6,
    duration: '3 weeks',
    order: 5,
    courseCode: 'GPS_SIMULATION'
  }
];

// ==================== GPS CAPSTONE 1 STAGES (Stages 16-20) ====================

export const GPS_CAPSTONE_1_STAGES = [
  {
    stageId: 'gps_cap1_stage_16',
    stageNumber: 16,
    stageName: 'Stage 16: Define Your MVP',
    description: 'Scope and define mission-aligned MVP',
    missions: 6,
    duration: '3 weeks',
    order: 1,
    courseCode: 'GPS_CAPSTONE_1'
  },
  {
    stageId: 'gps_cap1_stage_17',
    stageNumber: 17,
    stageName: 'Stage 17: Product Development Plan',
    description: 'Build comprehensive development roadmap',
    missions: 6,
    duration: '3 weeks',
    order: 2,
    courseCode: 'GPS_CAPSTONE_1'
  },
  {
    stageId: 'gps_cap1_stage_18',
    stageNumber: 18,
    stageName: 'Stage 18: Build MVP 1',
    description: 'Create low-fidelity prototype with testing',
    missions: 6,
    duration: '3 weeks',
    order: 3,
    courseCode: 'GPS_CAPSTONE_1'
  },
  {
    stageId: 'gps_cap1_stage_19',
    stageNumber: 19,
    stageName: 'Stage 19: Problem Owner Feedback',
    description: 'Gather and analyze community feedback',
    missions: 6,
    duration: '3 weeks',
    order: 4,
    courseCode: 'GPS_CAPSTONE_1'
  },
  {
    stageId: 'gps_cap1_stage_20',
    stageNumber: 20,
    stageName: 'Stage 20: Build MVP 2',
    description: 'Refine and launch community-validated MVP',
    missions: 6,
    duration: '3 weeks',
    order: 5,
    courseCode: 'GPS_CAPSTONE_1'
  }
];

// ==================== GPS CAPSTONE 2 STAGES (Stages 21-25) ====================

export const GPS_CAPSTONE_2_STAGES = [
  {
    stageId: 'gps_cap2_stage_21',
    stageNumber: 21,
    stageName: 'Stage 21: Revenue Model',
    description: 'Develop purpose-driven revenue model',
    missions: 6,
    duration: '3 weeks',
    order: 1,
    courseCode: 'GPS_CAPSTONE_2'
  },
  {
    stageId: 'gps_cap2_stage_22',
    stageNumber: 22,
    stageName: 'Stage 22: Financial Model',
    description: 'Build comprehensive financial projections',
    missions: 6,
    duration: '3 weeks',
    order: 2,
    courseCode: 'GPS_CAPSTONE_2'
  },
  {
    stageId: 'gps_cap2_stage_23',
    stageNumber: 23,
    stageName: 'Stage 23: 4D Business Model Evaluation',
    description: 'Evaluate through 4D analysis framework',
    missions: 6,
    duration: '3 weeks',
    order: 3,
    courseCode: 'GPS_CAPSTONE_2'
  },
  {
    stageId: 'gps_cap2_stage_24',
    stageNumber: 24,
    stageName: 'Stage 24: Investor Pitch Deck',
    description: 'Create Level 3 pitch with investment memo',
    missions: 6,
    duration: '3 weeks',
    order: 4,
    courseCode: 'GPS_CAPSTONE_2'
  },
  {
    stageId: 'gps_cap2_stage_25',
    stageNumber: 25,
    stageName: 'Stage 25: Incorporate Company',
    description: 'Legally incorporate purpose-driven business',
    missions: 6,
    duration: '3 weeks',
    order: 5,
    courseCode: 'GPS_CAPSTONE_2'
  }
];

// ==================== GENERAL GPS STAGES (Stages 26-35) ====================

export const GENERAL_GPS_STAGES = [
  {
    stageId: 'gps_stage_26',
    stageNumber: 26,
    stageName: 'Stage 26: Market Entry',
    description: 'Launch and enter the market',
    missions: 5,
    order: 1,
    courseCode: 'VENTURE_ACCELERATION'
  },
  {
    stageId: 'gps_stage_27',
    stageNumber: 27,
    stageName: 'Stage 27: Customer Acquisition',
    description: 'Build customer base',
    missions: 5,
    order: 2,
    courseCode: 'VENTURE_ACCELERATION'
  },
  {
    stageId: 'gps_stage_28',
    stageNumber: 28,
    stageName: 'Stage 28: Growth Hacking',
    description: 'Scale customer acquisition',
    missions: 5,
    order: 3,
    courseCode: 'VENTURE_ACCELERATION'
  },
  {
    stageId: 'gps_stage_29',
    stageNumber: 29,
    stageName: 'Stage 29: Operations Optimization',
    description: 'Optimize business operations',
    missions: 5,
    order: 4,
    courseCode: 'VENTURE_ACCELERATION'
  },
  {
    stageId: 'gps_stage_30',
    stageNumber: 30,
    stageName: 'Stage 30: Team Building',
    description: 'Build high-performing team',
    missions: 5,
    order: 5,
    courseCode: 'VENTURE_ACCELERATION'
  },
  {
    stageId: 'gps_stage_31',
    stageNumber: 31,
    stageName: 'Stage 31: Fundraising Preparation',
    description: 'Prepare for investment rounds',
    missions: 5,
    order: 6,
    courseCode: 'VENTURE_CAPITALIZATION'
  },
  {
    stageId: 'gps_stage_32',
    stageNumber: 32,
    stageName: 'Stage 32: Investor Relations',
    description: 'Build investor relationships',
    missions: 5,
    order: 7,
    courseCode: 'VENTURE_CAPITALIZATION'
  },
  {
    stageId: 'gps_stage_33',
    stageNumber: 33,
    stageName: 'Stage 33: Due Diligence',
    description: 'Navigate due diligence process',
    missions: 5,
    order: 8,
    courseCode: 'VENTURE_CAPITALIZATION'
  },
  {
    stageId: 'gps_stage_34',
    stageNumber: 34,
    stageName: 'Stage 34: Scaling Strategy',
    description: 'Develop scaling roadmap',
    missions: 5,
    order: 9,
    courseCode: 'VENTURE_CAPITALIZATION'
  },
  {
    stageId: 'gps_stage_35',
    stageNumber: 35,
    stageName: 'Stage 35: Impact Measurement',
    description: 'Measure and report impact',
    missions: 5,
    order: 10,
    courseCode: 'VENTURE_CAPITALIZATION'
  }
];

// ==================== ALL STAGES COMBINED ====================

export const ALL_STAGES = [
  ...GPO_CALL_STAGES,
  ...GPS_101_BASIC_STAGES,
  ...GPS_PREP_STAGES,
  ...GPS_SIMULATION_STAGES,
  ...GPS_CAPSTONE_1_STAGES,
  ...GPS_CAPSTONE_2_STAGES,
  ...GENERAL_GPS_STAGES
];

// ==================== HELPER FUNCTIONS ====================

/**
 * Get stage by number
 */
export const getStageByNumber = (stageNumber) => {
  return ALL_STAGES.find(stage => stage.stageNumber === stageNumber);
};

/**
 * Get stages by course code
 */
export const getStagesByCourse = (courseCode) => {
  return ALL_STAGES.filter(stage => stage.courseCode === courseCode);
};

/**
 * Get GPS 101 stages
 */
export const getGPS101Stages = () => {
  return GPS_101_BASIC_STAGES;
};

/**
 * Check if stage is GPS 101
 */
export const isGPS101Stage = (stageNumber) => {
  return stageNumber >= 1 && stageNumber <= 5;
};

/**
 * Check if stage is GPO Call
 */
export const isGPOCallStage = (stageNumber) => {
  return stageNumber >= -4 && stageNumber <= 0;
};

/**
 * Get course by stage number
 */
export const getCourseByStage = (stageNumber) => {
  if (isGPOCallStage(stageNumber)) return 'GPO_CALL';
  if (stageNumber >= 1 && stageNumber <= 5) return 'GPS_101_BASIC';
  if (stageNumber >= 6 && stageNumber <= 10) return 'GPS_PREP';
  if (stageNumber >= 11 && stageNumber <= 15) return 'GPS_SIMULATION';
  if (stageNumber >= 16 && stageNumber <= 20) return 'GPS_CAPSTONE_1';
  if (stageNumber >= 21 && stageNumber <= 25) return 'GPS_CAPSTONE_2';
  if (stageNumber >= 26 && stageNumber <= 30) return 'VENTURE_ACCELERATION';
  if (stageNumber >= 31 && stageNumber <= 35) return 'VENTURE_CAPITALIZATION';
  return null;
};

export default {
  GPO_CALL_STAGES,
  GPS_101_BASIC_STAGES,
  GPS_PREP_STAGES,
  GPS_SIMULATION_STAGES,
  GPS_CAPSTONE_1_STAGES,
  GPS_CAPSTONE_2_STAGES,
  GENERAL_GPS_STAGES,
  ALL_STAGES,
  getStageByNumber,
  getStagesByCourse,
  getGPS101Stages,
  isGPS101Stage,
  isGPOCallStage,
  getCourseByStage
};