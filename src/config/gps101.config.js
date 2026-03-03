/**
 * GPS 101 Basic Course Configuration
 * 
 * This file contains all configuration constants and settings specific to GPS 101 Basic course.
 * Based on the official GPS 101 curriculum structure.
 */

export const GPS_101_CONFIG = {
  // Course Metadata
  COURSE_CODE: 'GPS_101_BASIC',
  COURSE_NAME: 'GPS 101 – Global Problem Solving: Discover Your Life Purpose',
  COURSE_DESCRIPTION: 'Transformative journey to discover God-given life purpose and build purpose-driven project rooted in empathy, moral clarity, personal calling',
  
  // Course Structure
  TOTAL_STAGES: 5,
  MISSIONS_PER_STAGE: 6,
  TOTAL_MISSIONS: 30,
  CHECKPOINTS_PER_MISSION: 5,
  TOTAL_CHECKPOINTS: 150,
  
  // Duration
  DURATION_WEEKS: 15,
  WEEKS_PER_STAGE: 3,
  
  // Mode
  MODE: 'SOLO', // Individual journey, not team-based
  
  // Rewards
  TOTAL_BARAKA: 5000,
  BARAKA_PER_CHECKPOINT: 25, // Approximate
  BARAKA_PER_MISSION: 150, // Base + bonus
  BARAKA_PER_STAGE: 1000,
  
  // XP System
  XP_PER_CHECKPOINT: 5,
  XP_PER_MISSION: 25, // Bonus XP
  XP_PER_STAGE: 150,
  TOTAL_XP: 1500,
  
  // Badges
  COMPLETION_BADGE: 'purpose-pathfinder',
  ORANGE_BEACON_BADGE: 'orange-beacon',
  STAGE_BADGE_PREFIX: 'gps-101-stage-',
  
  // Study System (R2R/pR2R)
  R2R_INITIAL: 3, // Retry Rights per mission
  PR2R_THRESHOLD: 2, // Provisional Retry Rights threshold
  STUDY_MISSION_DURATION_MINUTES: 30,
  
  // Deliverables
  DELIVERABLES: [
    {
      id: 'identity-statement',
      stage: 1,
      name: 'Identity Declaration',
      description: 'I am an agent sent by God',
      type: 'text',
      minLength: 100,
      maxLength: 500
    },
    {
      id: 'problem-candidate',
      stage: 2,
      name: 'Life Problem Candidate',
      description: '5-20 Global Problem Candidates identified',
      type: 'list',
      minItems: 5,
      maxItems: 20
    },
    {
      id: 'problem-owner-story',
      stage: 3,
      name: 'Problem Owner Story',
      description: 'A compelling story of a real Problem Owner',
      type: 'narrative',
      minLength: 500,
      maxLength: 2000
    },
    {
      id: 'life-purpose-statement',
      stage: 4,
      name: 'Life Purpose Statement',
      description: 'A concise and actionable Life Purpose Statement',
      type: 'text',
      minLength: 50,
      maxLength: 200
    },
    {
      id: 'purpose-driven-project',
      stage: 5,
      name: 'Purpose-Driven Project',
      description: 'A concrete, purpose-aligned project idea',
      type: 'project',
      requiredFields: ['title', 'description', 'problem', 'solution', 'impact']
    }
  ],
  
  // Stage Configuration
  STAGES: [
    {
      stageNumber: 1,
      stageName: 'Stage 1: Who are you?',
      question: 'Who are you?',
      expectedOutcome: 'I am an agent sent by God',
      description: 'Solo journey of self-discovery through structured personal reflection and storytelling',
      missions: 6,
      duration: '3 weeks',
      deliverable: 'identity-statement'
    },
    {
      stageNumber: 2,
      stageName: 'Stage 2: What is the meaning of your life?',
      question: 'What is the meaning of your life?',
      expectedOutcome: 'My Life Problem Candidate',
      description: 'Identify 5-20 Global Problem Candidates through reflection and analysis',
      missions: 6,
      duration: '3 weeks',
      deliverable: 'problem-candidate'
    },
    {
      stageNumber: 3,
      stageName: 'Stage 3: Tell a story of problem owners',
      question: 'Tell a story of problem owners',
      expectedOutcome: 'Story Telling',
      description: 'A compelling story of a real Problem Owner with empathy and systemic analysis',
      missions: 6,
      duration: '3 weeks',
      deliverable: 'problem-owner-story'
    },
    {
      stageNumber: 4,
      stageName: 'Stage 4: What is your life purpose?',
      question: 'What is your life purpose?',
      expectedOutcome: 'My Life Purpose Statement',
      description: 'A concise and actionable Life Purpose Statement',
      missions: 6,
      duration: '3 weeks',
      deliverable: 'life-purpose-statement'
    },
    {
      stageNumber: 5,
      stageName: 'Stage 5: What is your Purpose-driven Major?',
      question: 'What is your Purpose-driven Major for a purpose-driven life?',
      expectedOutcome: 'My Purpose-driven Project',
      description: 'A concrete, purpose-aligned project idea',
      missions: 6,
      duration: '3 weeks',
      deliverable: 'purpose-driven-project'
    }
  ],
  
  // Learning Objectives
  LEARNING_OBJECTIVES: [
    'Understand themselves through structured personal reflection and storytelling',
    'Identify and empathize with people/problems they feel called to serve',
    'Analyze global/local issues through moral and emotional lens',
    'Develop and declare clear, personal Life Purpose Statement',
    'Design purpose-aligned project to begin living out mission',
    'Practice public speaking, storytelling, vision-sharing',
    'Grow in confidence, empathy, love-based problem-solving skills'
  ],
  
  // Prerequisites
  PREREQUISITES: [
    'Open to any student ready to reflect and take action',
    'No prior knowledge required',
    'AI tools introduced/guided',
    'Willingness to explore spiritual/personal/global dimensions'
  ],
  
  // Course Format
  FORMAT: {
    type: 'Hybrid',
    components: [
      'Live lectures',
      'Self-paced AI-assisted sub-missions',
      'Peer reviews'
    ],
    tools: ['ChatGPT', 'Google Docs', 'Miro', 'Zoom', 'Canva']
  },
  
  // Navigator AI Integration
  NAVIGATOR_AI: {
    enabled: true,
    contextAware: true,
    stageSpecificGuidance: true,
    chatGPTPrompts: true,
    checkpointAssistance: true
  },
  
  // Validation Rules
  VALIDATION: {
    checkpoint: {
      minCharacters: 100,
      maxCharacters: 5000,
      requiredFields: ['answer', 'reflection']
    },
    mission: {
      requiredCheckpoints: 5,
      passingScore: 70 // Percentage
    },
    stage: {
      requiredMissions: 6,
      deliverableRequired: true
    }
  },
  
  // Gamification
  GAMIFICATION: {
    badges: {
      stage1: 'gps-101-stage-1',
      stage2: 'gps-101-stage-2',
      stage3: 'gps-101-stage-3',
      stage4: 'gps-101-stage-4',
      stage5: 'gps-101-stage-5',
      completion: 'purpose-pathfinder',
      orangeBeacon: 'orange-beacon'
    },
    celebrations: {
      checkpointPass: true,
      missionComplete: true,
      stageComplete: true,
      courseComplete: true
    }
  },
  
  // Korean Language Support
  KOREAN_SUPPORT: {
    enabled: true,
    checkpointQuestions: true,
    missions: true,
    uiElements: true
  }
};

// Export individual constants for convenience
export const {
  COURSE_CODE,
  COURSE_NAME,
  TOTAL_STAGES,
  MISSIONS_PER_STAGE,
  TOTAL_MISSIONS,
  CHECKPOINTS_PER_MISSION,
  TOTAL_CHECKPOINTS,
  DURATION_WEEKS,
  MODE,
  TOTAL_BARAKA,
  XP_PER_CHECKPOINT,
  XP_PER_MISSION,
  STAGES,
  DELIVERABLES
} = GPS_101_CONFIG;

export default GPS_101_CONFIG;