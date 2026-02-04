/* ============================================
   GPS LAB - Stages Constants
   -4 to 35 stages configuration with GPO Call
   ============================================ */

/**
 * Beacon phases (8 phases including GPO Call)
 */
export const BeaconPhases = {
  GPO_CALL: 'GPO Call',
  GPS_101: 'GPS 101',
  GPS_PREP: 'GPS Prep',
  GPS_SIMULATION: 'GPS Simulation',
  GPS_CAPSTONE_1: 'GPS Capstone 1',
  GPS_CAPSTONE_2: 'GPS Capstone 2',
  VENTURE_ACCELERATION: 'Venture Acceleration',
  VENTURE_CAPITALIZATION: 'Venture Capitalization',
};

/**
 * Beacon colors (GPO Call has NO beacon color - it's pre-training)
 */
export const BeaconColors = {
  [BeaconPhases.GPO_CALL]: null,  // No beacon - pre-training phase
  [BeaconPhases.GPS_101]: '#FF6B6B',              // Red
  [BeaconPhases.GPS_PREP]: '#FF8C42',             // Orange
  [BeaconPhases.GPS_SIMULATION]: '#F1C40F',       // Yellow
  [BeaconPhases.GPS_CAPSTONE_1]: '#2A9D8F',       // Green
  [BeaconPhases.GPS_CAPSTONE_2]: '#00D4FF',       // Blue
  [BeaconPhases.VENTURE_ACCELERATION]: '#9B59B6', // Indigo
  [BeaconPhases.VENTURE_CAPITALIZATION]: '#8E44AD', // Purple
};

/**
 * Stages per beacon phase
 */
export const STAGES_PER_PHASE = 5;

/**
 * Missions per stage
 */
export const MISSIONS_PER_STAGE = 5;

/**
 * Total number of stages (including GPO Call)
 */
export const TOTAL_STAGES = 40; // -4 to 0 (5) + 1 to 35 (35) = 40

/**
 * All Stages configuration (-4 to 35)
 */
export const Stages = {
  // GPO CALL (No Beacon) - Stages -4 to 0
  '-4': {
    number: -4,
    name: 'Who are you?',
    beacon: BeaconPhases.GPO_CALL,
    color: null,
    description: 'Introduce yourself and your community',
    missions: 1,
    isGPO: true
  },
  '-3': {
    number: -3,
    name: 'What is your problem?',
    beacon: BeaconPhases.GPO_CALL,
    color: null,
    description: 'Define the problem clearly',
    missions: 1,
    isGPO: true
  },
  '-2': {
    number: -2,
    name: 'Whose pain?',
    beacon: BeaconPhases.GPO_CALL,
    color: null,
    description: 'Show who is affected by this problem',
    missions: 1,
    isGPO: true
  },
  '-1': {
    number: -1,
    name: 'What future?',
    beacon: BeaconPhases.GPO_CALL,
    color: null,
    description: 'Paint a picture of the solution',
    missions: 1,
    isGPO: true
  },
  '0': {
    number: 0,
    name: 'How can GPS help?',
    beacon: BeaconPhases.GPO_CALL,
    color: null,
    description: 'Invite Global Problem Solvers to collaborate',
    missions: 1,
    isGPO: true
  },

  // GPS 101 (Red Beacon) - Stages 1-5
  1: {
    number: 1,
    name: 'Foundation Builder',
    beacon: BeaconPhases.GPS_101,
    color: BeaconColors[BeaconPhases.GPS_101],
    description: 'Learn the fundamentals of problem-solving',
    missions: 5,
    isGPO: false
  },
  2: {
    number: 2,
    name: 'Problem Identifier',
    beacon: BeaconPhases.GPS_101,
    color: BeaconColors[BeaconPhases.GPS_101],
    description: 'Develop skills to identify real problems',
    missions: 5,
    isGPO: false
  },
  3: {
    number: 3,
    name: 'Solution Seeker',
    beacon: BeaconPhases.GPS_101,
    color: BeaconColors[BeaconPhases.GPS_101],
    description: 'Explore various solution approaches',
    missions: 5,
    isGPO: false
  },
  4: {
    number: 4,
    name: 'Implementer',
    beacon: BeaconPhases.GPS_101,
    color: BeaconColors[BeaconPhases.GPS_101],
    description: 'Execute solutions effectively',
    missions: 5,
    isGPO: false
  },
  5: {
    number: 5,
    name: 'Evaluator',
    beacon: BeaconPhases.GPS_101,
    color: BeaconColors[BeaconPhases.GPS_101],
    description: 'Assess solution effectiveness',
    missions: 5,
    isGPO: false
  },

  // GPS Prep (Orange Beacon) - Stages 6-10
  6: {
    number: 6,
    name: 'Market Researcher',
    beacon: BeaconPhases.GPS_PREP,
    color: BeaconColors[BeaconPhases.GPS_PREP],
    description: 'Understand market needs and opportunities',
    missions: 5,
    isGPO: false
  },
  7: {
    number: 7,
    name: 'Customer Advocate',
    beacon: BeaconPhases.GPS_PREP,
    color: BeaconColors[BeaconPhases.GPS_PREP],
    description: 'Champion customer perspectives',
    missions: 5,
    isGPO: false
  },
  8: {
    number: 8,
    name: 'Prototype Builder',
    beacon: BeaconPhases.GPS_PREP,
    color: BeaconColors[BeaconPhases.GPS_PREP],
    description: 'Create minimum viable solutions',
    missions: 5,
    isGPO: false
  },
  9: {
    number: 9,
    name: 'Tester',
    beacon: BeaconPhases.GPS_PREP,
    color: BeaconColors[BeaconPhases.GPS_PREP],
    description: 'Validate solutions with real users',
    missions: 5,
    isGPO: false
  },
  10: {
    number: 10,
    name: 'Iterative Improver',
    beacon: BeaconPhases.GPS_PREP,
    color: BeaconColors[BeaconPhases.GPS_PREP],
    description: 'Refine based on feedback',
    missions: 5,
    isGPO: false
  },

  // (Continue with stages 11-35 as before...)
  // GPS Simulation (Yellow Beacon) - Stages 11-15
  11: {
    number: 11,
    name: 'Business Modeler',
    beacon: BeaconPhases.GPS_SIMULATION,
    color: BeaconColors[BeaconPhases.GPS_SIMULATION],
    description: 'Design sustainable business models',
    missions: 5,
    isGPO: false
  },
  12: {
    number: 12,
    name: 'Financial Planner',
    beacon: BeaconPhases.GPS_SIMULATION,
    color: BeaconColors[BeaconPhases.GPS_SIMULATION],
    description: 'Plan and manage finances',
    missions: 5,
    isGPO: false
  },
  13: {
    number: 13,
    name: 'Team Builder',
    beacon: BeaconPhases.GPS_SIMULATION,
    color: BeaconColors[BeaconPhases.GPS_SIMULATION],
    description: 'Assemble and lead teams',
    missions: 5,
    isGPO: false
  },
  14: {
    number: 14,
    name: 'Marketer',
    beacon: BeaconPhases.GPS_SIMULATION,
    color: BeaconColors[BeaconPhases.GPS_SIMULATION],
    description: 'Promote solutions effectively',
    missions: 5,
    isGPO: false
  },
  15: {
    number: 15,
    name: 'Growth Hacker',
    beacon: BeaconPhases.GPS_SIMULATION,
    color: BeaconColors[BeaconPhases.GPS_SIMULATION],
    description: 'Drive rapid growth',
    missions: 5,
    isGPO: false
  },

  // GPS Capstone 1 (Green Beacon) - Stages 16-20
  16: {
    number: 16,
    name: 'Project Manager',
    beacon: BeaconPhases.GPS_CAPSTONE_1,
    color: BeaconColors[BeaconPhases.GPS_CAPSTONE_1],
    description: 'Manage complex projects',
    missions: 5,
    isGPO: false
  },
  17: {
    number: 17,
    name: 'Problem Solver',
    beacon: BeaconPhases.GPS_CAPSTONE_1,
    color: BeaconColors[BeaconPhases.GPS_CAPSTONE_1],
    description: 'Solve real-world problems',
    missions: 5,
    isGPO: false
  },
  18: {
    number: 18,
    name: 'Impact Measurer',
    beacon: BeaconPhases.GPS_CAPSTONE_1,
    color: BeaconColors[BeaconPhases.GPS_CAPSTONE_1],
    description: 'Quantify solution impact',
    missions: 5,
    isGPO: false
  },
  19: {
    number: 19,
    name: 'Sustainability Champion',
    beacon: BeaconPhases.GPS_CAPSTONE_1,
    color: BeaconColors[BeaconPhases.GPS_CAPSTONE_1],
    description: 'Ensure long-term viability',
    missions: 5,
    isGPO: false
  },
  20: {
    number: 20,
    name: 'Community Builder',
    beacon: BeaconPhases.GPS_CAPSTONE_1,
    color: BeaconColors[BeaconPhases.GPS_CAPSTONE_1],
    description: 'Build engaged communities',
    missions: 5,
    isGPO: false
  },

  // GPS Capstone 2 (Blue Beacon) - Stages 21-25
  21: {
    number: 21,
    name: 'Strategic Thinker',
    beacon: BeaconPhases.GPS_CAPSTONE_2,
    color: BeaconColors[BeaconPhases.GPS_CAPSTONE_2],
    description: 'Develop long-term strategies',
    missions: 5,
    isGPO: false
  },
  22: {
    number: 22,
    name: 'Systems Designer',
    beacon: BeaconPhases.GPS_CAPSTONE_2,
    color: BeaconColors[BeaconPhases.GPS_CAPSTONE_2],
    description: 'Create comprehensive systems',
    missions: 5,
    isGPO: false
  },
  23: {
    number: 23,
    name: 'Change Agent',
    beacon: BeaconPhases.GPS_CAPSTONE_2,
    color: BeaconColors[BeaconPhases.GPS_CAPSTONE_2],
    description: 'Drive organizational change',
    missions: 5,
    isGPO: false
  },
  24: {
    number: 24,
    name: 'Innovator',
    beacon: BeaconPhases.GPS_CAPSTONE_2,
    color: BeaconColors[BeaconPhases.GPS_CAPSTONE_2],
    description: 'Pioneer new approaches',
    missions: 5,
    isGPO: false
  },
  25: {
    number: 25,
    name: 'Capstone Graduate',
    beacon: BeaconPhases.GPS_CAPSTONE_2,
    color: BeaconColors[BeaconPhases.GPS_CAPSTONE_2],
    description: 'Complete major capstone project',
    missions: 5,
    isGPO: false
  },

  // Venture Acceleration (Indigo Beacon) - Stages 26-30
  26: {
    number: 26,
    name: 'Entrepreneur',
    beacon: BeaconPhases.VENTURE_ACCELERATION,
    color: BeaconColors[BeaconPhases.VENTURE_ACCELERATION],
    description: 'Launch your venture',
    missions: 5,
    isGPO: false
  },
  27: {
    number: 27,
    name: 'Customer Acquirer',
    beacon: BeaconPhases.VENTURE_ACCELERATION,
    color: BeaconColors[BeaconPhases.VENTURE_ACCELERATION],
    description: 'Build customer base',
    missions: 5,
    isGPO: false
  },
  28: {
    number: 28,
    name: 'Revenue Generator',
    beacon: BeaconPhases.VENTURE_ACCELERATION,
    color: BeaconColors[BeaconPhases.VENTURE_ACCELERATION],
    description: 'Generate sustainable revenue',
    missions: 5,
    isGPO: false
  },
  29: {
    number: 29,
    name: 'Scaler',
    beacon: BeaconPhases.VENTURE_ACCELERATION,
    color: BeaconColors[BeaconPhases.VENTURE_ACCELERATION],
    description: 'Scale operations efficiently',
    missions: 5,
    isGPO: false
  },
  30: {
    number: 30,
    name: 'Market Leader',
    beacon: BeaconPhases.VENTURE_ACCELERATION,
    color: BeaconColors[BeaconPhases.VENTURE_ACCELERATION],
    description: 'Dominate your market segment',
    missions: 5,
    isGPO: false
  },

  // Venture Capitalization (Purple Beacon) - Stages 31-35
  31: {
    number: 31,
    name: 'Fundraiser',
    beacon: BeaconPhases.VENTURE_CAPITALIZATION,
    color: BeaconColors[BeaconPhases.VENTURE_CAPITALIZATION],
    description: 'Secure investment capital',
    missions: 5,
    isGPO: false
  },
  32: {
    number: 32,
    name: 'Organization Builder',
    beacon: BeaconPhases.VENTURE_CAPITALIZATION,
    color: BeaconColors[BeaconPhases.VENTURE_CAPITALIZATION],
    description: 'Build organizational infrastructure',
    missions: 5,
    isGPO: false
  },
  33: {
    number: 33,
    name: 'Market Expander',
    beacon: BeaconPhases.VENTURE_CAPITALIZATION,
    color: BeaconColors[BeaconPhases.VENTURE_CAPITALIZATION],
    description: 'Expand to new markets',
    missions: 5,
    isGPO: false
  },
  34: {
    number: 34,
    name: 'Impact Multiplier',
    beacon: BeaconPhases.VENTURE_CAPITALIZATION,
    color: BeaconColors[BeaconPhases.VENTURE_CAPITALIZATION],
    description: 'Multiply social impact',
    missions: 5,
    isGPO: false
  },
  35: {
    number: 35,
    name: 'GPS Master',
    beacon: BeaconPhases.VENTURE_CAPITALIZATION,
    color: BeaconColors[BeaconPhases.VENTURE_CAPITALIZATION],
    description: 'Achieve GPS mastery',
    missions: 5,
    isGPO: false
  },
};

/**
 * Get stage by number (including GPO stages)
 */
export const getStage = (stageNumber) => {
  return Stages[stageNumber.toString()] || null;
};

/**
 * Check if stage is GPO Call stage
 */
export const isGPOStage = (stageNumber) => {
  return stageNumber >= -4 && stageNumber <= 0;
};

/**
 * Get GPO stages only
 */
export const getGPOStages = () => {
  return Object.values(Stages).filter(stage => stage.isGPO);
};

/**
 * Get GPS training stages only (1-35)
 */
export const getGPSStages = () => {
  return Object.values(Stages).filter(stage => !stage.isGPO);
};

/**
 * Get beacon color for stage (GPO stages return null)
 */
export const getBeaconColor = (stageNumber) => {
  const stage = getStage(stageNumber);
  return stage ? stage.color : '#8B949E';
};

/**
 * Calculate stage progress percentage (including GPO)
 */
export const calculateStagePercentage = (currentStage) => {
  // Adjust for GPO stages: -4 to 0 is 0-12.5%, 1-35 is 12.5-100%
  if (currentStage < 1) {
    // GPO stages: -4 to 0
    const gpoProgress = ((currentStage + 4) / 5) * 12.5; // 0-12.5%
    return gpoProgress;
  }
  // GPS stages: 1 to 35
  const gpsProgress = 12.5 + ((currentStage / 35) * 87.5); // 12.5-100%
  return gpsProgress;
};

export default {
  BeaconPhases,
  BeaconColors,
  STAGES_PER_PHASE,
  MISSIONS_PER_STAGE,
  TOTAL_STAGES,
  Stages,
  getStage,
  isGPOStage,
  getGPOStages,
  getGPSStages,
  getBeaconColor,
  calculateStagePercentage,
};