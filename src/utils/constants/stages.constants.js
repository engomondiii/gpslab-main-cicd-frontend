/* ============================================
   GPS LAB - Stages Constants
   35 stages configuration with beacon phases
   ============================================ */

/**
 * Beacon phases (7 phases)
 */
export const BeaconPhases = {
  GPS_101: 'GPS 101',
  GPS_PREP: 'GPS Prep',
  GPS_SIMULATION: 'GPS Simulation',
  GPS_CAPSTONE_1: 'GPS Capstone 1',
  GPS_CAPSTONE_2: 'GPS Capstone 2',
  VENTURE_ACCELERATION: 'Venture Acceleration',
  VENTURE_CAPITALIZATION: 'Venture Capitalization',
};

/**
 * Beacon colors
 */
export const BeaconColors = {
  [BeaconPhases.GPS_101]: '#FF6B6B',              // Red
  [BeaconPhases.GPS_PREP]: '#FF8C42',             // Orange
  [BeaconPhases.GPS_SIMULATION]: '#F1C40F',       // Yellow
  [BeaconPhases.GPS_CAPSTONE_1]: '#2A9D8F',       // Green
  [BeaconPhases.GPS_CAPSTONE_2]: '#00D4FF',       // Blue
  [BeaconPhases.VENTURE_ACCELERATION]: '#9B59B6', // Indigo
  [BeaconPhases.VENTURE_CAPITALIZATION]: '#8E44AD', // Purple
};

/**
 * Beacon CSS variables
 */
export const BeaconCSSVars = {
  [BeaconPhases.GPS_101]: '--beacon-red',
  [BeaconPhases.GPS_PREP]: '--beacon-orange',
  [BeaconPhases.GPS_SIMULATION]: '--beacon-yellow',
  [BeaconPhases.GPS_CAPSTONE_1]: '--beacon-green',
  [BeaconPhases.GPS_CAPSTONE_2]: '--beacon-blue',
  [BeaconPhases.VENTURE_ACCELERATION]: '--beacon-indigo',
  [BeaconPhases.VENTURE_CAPITALIZATION]: '--beacon-purple',
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
 * Total number of stages
 */
export const TOTAL_STAGES = 35;

/**
 * 35 Stages configuration
 */
export const Stages = {
  // GPS 101 (Red Beacon) - Stages 1-5
  1: {
    number: 1,
    name: 'Foundation Builder',
    beacon: BeaconPhases.GPS_101,
    color: BeaconColors[BeaconPhases.GPS_101],
    description: 'Learn the fundamentals of problem-solving',
    missions: 5,
  },
  2: {
    number: 2,
    name: 'Problem Identifier',
    beacon: BeaconPhases.GPS_101,
    color: BeaconColors[BeaconPhases.GPS_101],
    description: 'Develop skills to identify real problems',
    missions: 5,
  },
  3: {
    number: 3,
    name: 'Solution Seeker',
    beacon: BeaconPhases.GPS_101,
    color: BeaconColors[BeaconPhases.GPS_101],
    description: 'Explore various solution approaches',
    missions: 5,
  },
  4: {
    number: 4,
    name: 'Implementer',
    beacon: BeaconPhases.GPS_101,
    color: BeaconColors[BeaconPhases.GPS_101],
    description: 'Execute solutions effectively',
    missions: 5,
  },
  5: {
    number: 5,
    name: 'Evaluator',
    beacon: BeaconPhases.GPS_101,
    color: BeaconColors[BeaconPhases.GPS_101],
    description: 'Assess solution effectiveness',
    missions: 5,
  },

  // GPS Prep (Orange Beacon) - Stages 6-10
  6: {
    number: 6,
    name: 'Market Researcher',
    beacon: BeaconPhases.GPS_PREP,
    color: BeaconColors[BeaconPhases.GPS_PREP],
    description: 'Understand market needs and opportunities',
    missions: 5,
  },
  7: {
    number: 7,
    name: 'Customer Advocate',
    beacon: BeaconPhases.GPS_PREP,
    color: BeaconColors[BeaconPhases.GPS_PREP],
    description: 'Champion customer perspectives',
    missions: 5,
  },
  8: {
    number: 8,
    name: 'Prototype Builder',
    beacon: BeaconPhases.GPS_PREP,
    color: BeaconColors[BeaconPhases.GPS_PREP],
    description: 'Create minimum viable solutions',
    missions: 5,
  },
  9: {
    number: 9,
    name: 'Tester',
    beacon: BeaconPhases.GPS_PREP,
    color: BeaconColors[BeaconPhases.GPS_PREP],
    description: 'Validate solutions with real users',
    missions: 5,
  },
  10: {
    number: 10,
    name: 'Iterative Improver',
    beacon: BeaconPhases.GPS_PREP,
    color: BeaconColors[BeaconPhases.GPS_PREP],
    description: 'Refine based on feedback',
    missions: 5,
  },

  // GPS Simulation (Yellow Beacon) - Stages 11-15
  11: {
    number: 11,
    name: 'Business Modeler',
    beacon: BeaconPhases.GPS_SIMULATION,
    color: BeaconColors[BeaconPhases.GPS_SIMULATION],
    description: 'Design sustainable business models',
    missions: 5,
  },
  12: {
    number: 12,
    name: 'Financial Planner',
    beacon: BeaconPhases.GPS_SIMULATION,
    color: BeaconColors[BeaconPhases.GPS_SIMULATION],
    description: 'Plan and manage finances',
    missions: 5,
  },
  13: {
    number: 13,
    name: 'Team Builder',
    beacon: BeaconPhases.GPS_SIMULATION,
    color: BeaconColors[BeaconPhases.GPS_SIMULATION],
    description: 'Assemble and lead teams',
    missions: 5,
  },
  14: {
    number: 14,
    name: 'Marketer',
    beacon: BeaconPhases.GPS_SIMULATION,
    color: BeaconColors[BeaconPhases.GPS_SIMULATION],
    description: 'Promote solutions effectively',
    missions: 5,
  },
  15: {
    number: 15,
    name: 'Growth Hacker',
    beacon: BeaconPhases.GPS_SIMULATION,
    color: BeaconColors[BeaconPhases.GPS_SIMULATION],
    description: 'Drive rapid growth',
    missions: 5,
  },

  // GPS Capstone 1 (Green Beacon) - Stages 16-20
  16: {
    number: 16,
    name: 'Project Manager',
    beacon: BeaconPhases.GPS_CAPSTONE_1,
    color: BeaconColors[BeaconPhases.GPS_CAPSTONE_1],
    description: 'Manage complex projects',
    missions: 5,
  },
  17: {
    number: 17,
    name: 'Problem Solver',
    beacon: BeaconPhases.GPS_CAPSTONE_1,
    color: BeaconColors[BeaconPhases.GPS_CAPSTONE_1],
    description: 'Solve real-world problems',
    missions: 5,
  },
  18: {
    number: 18,
    name: 'Impact Measurer',
    beacon: BeaconPhases.GPS_CAPSTONE_1,
    color: BeaconColors[BeaconPhases.GPS_CAPSTONE_1],
    description: 'Quantify solution impact',
    missions: 5,
  },
  19: {
    number: 19,
    name: 'Sustainability Champion',
    beacon: BeaconPhases.GPS_CAPSTONE_1,
    color: BeaconColors[BeaconPhases.GPS_CAPSTONE_1],
    description: 'Ensure long-term viability',
    missions: 5,
  },
  20: {
    number: 20,
    name: 'Community Builder',
    beacon: BeaconPhases.GPS_CAPSTONE_1,
    color: BeaconColors[BeaconPhases.GPS_CAPSTONE_1],
    description: 'Build engaged communities',
    missions: 5,
  },

  // GPS Capstone 2 (Blue Beacon) - Stages 21-25
  21: {
    number: 21,
    name: 'Strategic Thinker',
    beacon: BeaconPhases.GPS_CAPSTONE_2,
    color: BeaconColors[BeaconPhases.GPS_CAPSTONE_2],
    description: 'Develop long-term strategies',
    missions: 5,
  },
  22: {
    number: 22,
    name: 'Systems Designer',
    beacon: BeaconPhases.GPS_CAPSTONE_2,
    color: BeaconColors[BeaconPhases.GPS_CAPSTONE_2],
    description: 'Create comprehensive systems',
    missions: 5,
  },
  23: {
    number: 23,
    name: 'Change Agent',
    beacon: BeaconPhases.GPS_CAPSTONE_2,
    color: BeaconColors[BeaconPhases.GPS_CAPSTONE_2],
    description: 'Drive organizational change',
    missions: 5,
  },
  24: {
    number: 24,
    name: 'Innovator',
    beacon: BeaconPhases.GPS_CAPSTONE_2,
    color: BeaconColors[BeaconPhases.GPS_CAPSTONE_2],
    description: 'Pioneer new approaches',
    missions: 5,
  },
  25: {
    number: 25,
    name: 'Capstone Graduate',
    beacon: BeaconPhases.GPS_CAPSTONE_2,
    color: BeaconColors[BeaconPhases.GPS_CAPSTONE_2],
    description: 'Complete major capstone project',
    missions: 5,
  },

  // Venture Acceleration (Indigo Beacon) - Stages 26-30
  26: {
    number: 26,
    name: 'Entrepreneur',
    beacon: BeaconPhases.VENTURE_ACCELERATION,
    color: BeaconColors[BeaconPhases.VENTURE_ACCELERATION],
    description: 'Launch your venture',
    missions: 5,
  },
  27: {
    number: 27,
    name: 'Customer Acquirer',
    beacon: BeaconPhases.VENTURE_ACCELERATION,
    color: BeaconColors[BeaconPhases.VENTURE_ACCELERATION],
    description: 'Build customer base',
    missions: 5,
  },
  28: {
    number: 28,
    name: 'Revenue Generator',
    beacon: BeaconPhases.VENTURE_ACCELERATION,
    color: BeaconColors[BeaconPhases.VENTURE_ACCELERATION],
    description: 'Generate sustainable revenue',
    missions: 5,
  },
  29: {
    number: 29,
    name: 'Scaler',
    beacon: BeaconPhases.VENTURE_ACCELERATION,
    color: BeaconColors[BeaconPhases.VENTURE_ACCELERATION],
    description: 'Scale operations efficiently',
    missions: 5,
  },
  30: {
    number: 30,
    name: 'Market Leader',
    beacon: BeaconPhases.VENTURE_ACCELERATION,
    color: BeaconColors[BeaconPhases.VENTURE_ACCELERATION],
    description: 'Dominate your market segment',
    missions: 5,
  },

  // Venture Capitalization (Purple Beacon) - Stages 31-35
  31: {
    number: 31,
    name: 'Fundraiser',
    beacon: BeaconPhases.VENTURE_CAPITALIZATION,
    color: BeaconColors[BeaconPhases.VENTURE_CAPITALIZATION],
    description: 'Secure investment capital',
    missions: 5,
  },
  32: {
    number: 32,
    name: 'Organization Builder',
    beacon: BeaconPhases.VENTURE_CAPITALIZATION,
    color: BeaconColors[BeaconPhases.VENTURE_CAPITALIZATION],
    description: 'Build organizational infrastructure',
    missions: 5,
  },
  33: {
    number: 33,
    name: 'Market Expander',
    beacon: BeaconPhases.VENTURE_CAPITALIZATION,
    color: BeaconColors[BeaconPhases.VENTURE_CAPITALIZATION],
    description: 'Expand to new markets',
    missions: 5,
  },
  34: {
    number: 34,
    name: 'Impact Multiplier',
    beacon: BeaconPhases.VENTURE_CAPITALIZATION,
    color: BeaconColors[BeaconPhases.VENTURE_CAPITALIZATION],
    description: 'Multiply social impact',
    missions: 5,
  },
  35: {
    number: 35,
    name: 'GPS Master',
    beacon: BeaconPhases.VENTURE_CAPITALIZATION,
    color: BeaconColors[BeaconPhases.VENTURE_CAPITALIZATION],
    description: 'Achieve GPS mastery',
    missions: 5,
  },
};

/**
 * Get stage by number
 * @param {number} stageNumber - Stage number (1-35)
 * @returns {Object|null} Stage configuration
 */
export const getStage = (stageNumber) => {
  return Stages[stageNumber] || null;
};

/**
 * Get stages by beacon phase
 * @param {string} beaconPhase - Beacon phase name
 * @returns {Array} Array of stages
 */
export const getStagesByBeacon = (beaconPhase) => {
  return Object.values(Stages).filter(stage => stage.beacon === beaconPhase);
};

/**
 * Get beacon phase for stage number
 * @param {number} stageNumber - Stage number
 * @returns {string} Beacon phase name
 */
export const getBeaconPhase = (stageNumber) => {
  const stage = getStage(stageNumber);
  return stage ? stage.beacon : null;
};

/**
 * Get beacon color for stage number
 * @param {number} stageNumber - Stage number
 * @returns {string} Beacon color hex code
 */
export const getBeaconColor = (stageNumber) => {
  const stage = getStage(stageNumber);
  return stage ? stage.color : '#8B949E';
};

/**
 * Check if stage is in beacon phase
 * @param {number} stageNumber - Stage number
 * @param {string} beaconPhase - Beacon phase name
 * @returns {boolean}
 */
export const isStageInBeacon = (stageNumber, beaconPhase) => {
  const stage = getStage(stageNumber);
  return stage ? stage.beacon === beaconPhase : false;
};

/**
 * Get next stage
 * @param {number} currentStage - Current stage number
 * @returns {Object|null} Next stage or null if at end
 */
export const getNextStage = (currentStage) => {
  if (currentStage >= TOTAL_STAGES) return null;
  return getStage(currentStage + 1);
};

/**
 * Get previous stage
 * @param {number} currentStage - Current stage number
 * @returns {Object|null} Previous stage or null if at start
 */
export const getPreviousStage = (currentStage) => {
  if (currentStage <= 1) return null;
  return getStage(currentStage - 1);
};

/**
 * Get all stages as array
 * @returns {Array} Array of all stages
 */
export const getAllStages = () => {
  return Object.values(Stages).sort((a, b) => a.number - b.number);
};

/**
 * Calculate stage progress percentage
 * @param {number} currentStage - Current stage number
 * @returns {number} Progress percentage (0-100)
 */
export const calculateStagePercentage = (currentStage) => {
  return (currentStage / TOTAL_STAGES) * 100;
};

export default {
  BeaconPhases,
  BeaconColors,
  BeaconCSSVars,
  STAGES_PER_PHASE,
  MISSIONS_PER_STAGE,
  TOTAL_STAGES,
  Stages,
  getStage,
  getStagesByBeacon,
  getBeaconPhase,
  getBeaconColor,
  isStageInBeacon,
  getNextStage,
  getPreviousStage,
  getAllStages,
  calculateStagePercentage,
};