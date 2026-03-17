/**
 * GPS 101 Basic - Configuration
 * 
 * CORRECT STRUCTURE (from official GPS curriculum):
 * - 5 Stages (Who are you? → Purpose-driven Project)
 * - 1 Mission per Stage (5 total missions)
 * - 6 Sub-missions per Mission (30 total sub-missions)
 * - 5 Checkpoints per Sub-mission (150 total checkpoints)
 * 
 * Orange Beacon: 5,000 Baraka total
 * Duration: 15 weeks, Solo mode
 */

export const GPS_101_CONFIG = {
  // ==================== COURSE IDENTITY ====================
  courseId: 'GPS_101_BASIC',
  courseCode: 'GPS101',
  courseName: 'GPS 101 Basic',
  courseNameKo: 'GPS 101 베이직',
  courseNameSw: 'GPS 101 Msingi',
  
  tagline: 'Find your life purpose and design your Project for it',
  taglineKo: '인생의 목적을 찾고 프로젝트를 설계하라',
  taglineSw: 'Gundua kusudi lako la maisha na uunda Mradi wako',
  
  description: 'A 15-week solo journey of self-discovery where students identify their calling, the problem they are meant to solve, and create a purpose-driven project.',
  descriptionKo: '학생들이 자신의 소명과 해결해야 할 문제를 발견하고, 목적 중심의 프로젝트를 만드는 15주간의 개인 여정입니다.',
  descriptionSw: 'Safari ya wiki 15 ya kujigundua ambapo wanafunzi wanagundua wito wao, tatizo wanalotakiwa kutatua, na kuunda mradi unaozingatia kusudi.',
  
  // ==================== STRUCTURE ====================
  TOTAL_STAGES: 5,
  TOTAL_MISSIONS: 5,        // 1 mission per stage
  TOTAL_SUB_MISSIONS: 30,   // 6 sub-missions per mission
  TOTAL_CHECKPOINTS: 150,   // 5 checkpoints per sub-mission
  
  structure: {
    stages: 5,
    missionsPerStage: 1,
    subMissionsPerMission: 6,
    checkpointsPerSubMission: 5
  },
  
  // ==================== DURATION & MODE ====================
  DURATION_WEEKS: 15,
  mode: 'solo',
  estimatedHoursPerWeek: 8,
  totalEstimatedHours: 120,
  
  // ==================== BEACON & REWARDS ====================
  TOTAL_BARAKA: 5000,
  TOTAL_XP: 750,
  
  beacon: {
    type: 'orange',
    name: 'Orange Beacon',
    nameKo: '오렌지 비콘',
    nameSw: 'Taa ya Machungwa',
    totalBaraka: 5000,
    icon: '🟠',
    description: 'Earned by completing GPS 101 Basic',
    descriptionKo: 'GPS 101 베이직을 완료하면 획득',
    descriptionSw: 'Inapatikana kwa kukamilisha GPS 101 Msingi'
  },
  
  rewards: {
    checkpoint: {
      baraka: 5,
      xp: 5
    },
    subMission: {
      baraka: 25,
      xp: 0
    },
    mission: {
      baraka: 250,
      xp: 0
    },
    stage: {
      baraka: 500,
      xp: 0
    }
  },
  
  // Calculation breakdown:
  // Checkpoints: 150 × 5 Baraka = 750
  // Sub-missions: 30 × 25 Baraka = 750
  // Missions: 5 × 250 Baraka = 1,250
  // Stages: 5 × 500 Baraka = 2,500
  // TOTAL: 750 + 750 + 1,250 + 2,500 = 5,000 Baraka ✓
  
  // ==================== RETRY RIGHTS ====================
  R2R_INITIAL: 3,           // Start with 3 R2R
  PR2R_PER_STUDY: 1,        // Earn 1 pR2R per study mission
  CHECKPOINT_PASS_THRESHOLD: 70,
  
  // ==================== STAGES ====================
  STAGES: [
    {
      stageId: 'GPS101_S1',
      stageNumber: 1,
      stageName: 'Stage 1',
      stageNameKo: '스테이지 1',
      stageNameSw: 'Hatua ya 1',
      
      question: 'Who are you?',
      questionKo: '당신은 누구입니까?',
      questionSw: 'Wewe ni nani?',
      
      expectedOutcome: 'I am an agent sent by God',
      expectedOutcomeKo: '나는 하나님이 보내신 대리인입니다',
      expectedOutcomeSw: 'Mimi ni wakala aliyetumwa na Mungu',
      
      description: 'Students explore their identity by reflecting on their past, failures, values, and future aspirations. The goal is to declare with clarity: "I am an agent sent by God."',
      descriptionKo: '학생들은 과거, 실패, 가치, 미래의 포부를 성찰하며 자신의 정체성을 탐구합니다. 목표는 "나는 하나님이 보내신 대리인입니다"라고 명확히 선언하는 것입니다.',
      descriptionSw: 'Wanafunzi wanachunguza utambulisho wao kwa kutafakari kuhusu nyakati zao za nyuma, kushindwa, maadili, na matarajio ya baadaye. Lengo ni kutangaza kwa uwazi: "Mimi ni wakala aliyetumwa na Mungu."',
      
      missions: 1,
      duration: '3 weeks',
      deliverable: 'Identity Statement',
      deliverableKo: '정체성 선언문',
      deliverableSw: 'Kauli ya Utambulisho',
      
      order: 1
    },
    {
      stageId: 'GPS101_S2',
      stageNumber: 2,
      stageName: 'Stage 2',
      stageNameKo: '스테이지 2',
      stageNameSw: 'Hatua ya 2',
      
      question: 'What is the meaning of your life?',
      questionKo: '당신의 삶의 의미는 무엇입니까?',
      questionSw: 'Maana ya maisha yako ni nini?',
      
      expectedOutcome: 'My Life Problem Candidate',
      expectedOutcomeKo: '나의 인생 문제 후보',
      expectedOutcomeSw: 'Mgombea wa Tatizo la Maisha Yangu',
      
      description: 'Students begin identifying meaningful problems they feel called to solve by analyzing global challenges and emotional resonance. By narrowing down a Life Problem Candidate, they connect their inner convictions to real-world issues.',
      descriptionKo: '학생들은 세계적 도전과 감정적 공명을 분석하여 해결하도록 부름받았다고 느끼는 의미 있는 문제를 식별하기 시작합니다. 인생 문제 후보를 좁혀가며 내면의 신념을 현실 세계의 문제와 연결합니다.',
      descriptionSw: 'Wanafunzi wanaanza kutambua matatizo yenye maana ambayo wanahisi wameamriwa kuyatatua kwa kuchambua changamoto za kimataifa na mwangwi wa kihisia. Kwa kupunguza Mgombea wa Tatizo la Maisha, wanaunganisha imani zao za ndani na masuala ya ulimwengu halisi.',
      
      missions: 1,
      duration: '3 weeks',
      deliverable: 'Problem Candidate',
      deliverableKo: '문제 후보',
      deliverableSw: 'Mgombea wa Tatizo',
      
      order: 2
    },
    {
      stageId: 'GPS101_S3',
      stageNumber: 3,
      stageName: 'Stage 3',
      stageNameKo: '스테이지 3',
      stageNameSw: 'Hatua ya 3',
      
      question: 'Whose pain are you called to solve?',
      questionKo: '누구의 고통을 해결하도록 부름받았습니까?',
      questionSw: 'Maumivu ya nani umeamriwa kuyatatua?',
      
      expectedOutcome: 'Story Telling',
      expectedOutcomeKo: '스토리텔링',
      expectedOutcomeSw: 'Kusimulia Hadithi',
      
      description: 'This mission centers on Problem Ownership. Students humanize their selected problem by engaging with real or simulated stories of suffering, building deep empathy and moral responsibility. They identify a specific group or individual they are called to serve.',
      descriptionKo: '이 미션은 문제 소유권에 중점을 둡니다. 학생들은 고통의 실제 또는 시뮬레이션된 이야기에 참여하여 선택한 문제를 인간화하고, 깊은 공감과 도덕적 책임을 구축합니다. 그들이 섬기도록 부름받은 특정 그룹이나 개인을 식별합니다.',
      descriptionSw: 'Jukumu hili linazingatia Umiliki wa Tatizo. Wanafunzi wanahuisha tatizo lao lililochaguliwa kwa kushiriki katika hadithi za kweli au za kusimulisha za mateso, kujenga huruma kuu na wajibu wa kimaadili. Wanagundua kundi maalum au mtu mmoja ambaye wameamriwa kumtumikia.',
      
      missions: 1,
      duration: '3 weeks',
      deliverable: 'Problem Owner Story',
      deliverableKo: '문제 소유자 이야기',
      deliverableSw: 'Hadithi ya Mmiliki wa Tatizo',
      
      order: 3
    },
    {
      stageId: 'GPS101_S4',
      stageNumber: 4,
      stageName: 'Stage 4',
      stageNameKo: '스테이지 4',
      stageNameSw: 'Hatua ya 4',
      
      question: 'What is your life purpose?',
      questionKo: '당신의 인생 목적은 무엇입니까?',
      questionSw: 'Kusudi lako la maisha ni nini?',
      
      expectedOutcome: 'My Life Purpose Statement',
      expectedOutcomeKo: '나의 인생 목적 선언문',
      expectedOutcomeSw: 'Kauli Yangu ya Kusudi la Maisha',
      
      description: 'Students articulate a one-sentence Life Purpose Statement and a Problem Statement that connects their identity, values, and problem ownership. This mission aligns personal mission with systemic needs, providing a clear direction for future decisions.',
      descriptionKo: '학생들은 자신의 정체성, 가치, 문제 소유권을 연결하는 한 문장의 인생 목적 선언문과 문제 선언문을 작성합니다. 이 미션은 개인적 사명을 체계적 필요와 일치시켜 미래 결정을 위한 명확한 방향을 제공합니다.',
      descriptionSw: 'Wanafunzi wanaeleza Kauli ya Kusudi la Maisha ya sentensi moja na Kauli ya Tatizo ambayo inaunganisha utambulisho wao, maadili, na umiliki wa tatizo. Jukumu hili linaratibisha ujumbe wa kibinafsi na mahitaji ya mfumo, ikitoa mwelekeo wazi kwa maamuzi ya baadaye.',
      
      missions: 1,
      duration: '3 weeks',
      deliverable: 'Life Purpose Statement',
      deliverableKo: '인생 목적 선언문',
      deliverableSw: 'Kauli ya Kusudi la Maisha',
      
      order: 4
    },
    {
      stageId: 'GPS101_S5',
      stageNumber: 5,
      stageName: 'Stage 5',
      stageNameKo: '스테이지 5',
      stageNameSw: 'Hatua ya 5',
      
      question: 'What is your Purpose-driven Project?',
      questionKo: '목적 중심의 프로젝트는 무엇입니까?',
      questionSw: 'Mradi wako unaozingatia Kusudi ni nini?',
      
      expectedOutcome: 'My Purpose-driven Project',
      expectedOutcomeKo: '나의 목적 중심 프로젝트',
      expectedOutcomeSw: 'Mradi Wangu Unaozingatia Kusudi',
      
      description: 'Students translate their life purpose into a practical, purpose-aligned project. They brainstorm, design, test, and pitch a concrete initiative aimed at addressing their Life Problem. This mission prepares them for real-world execution with clarity and confidence.',
      descriptionKo: '학생들은 자신의 인생 목적을 실용적이고 목적에 부합하는 프로젝트로 번역합니다. 그들은 인생 문제를 해결하기 위한 구체적인 이니셔티브를 브레인스토밍하고, 설계하고, 테스트하고, 발표합니다. 이 미션은 그들이 명확하고 자신감 있게 현실 세계에서 실행할 수 있도록 준비시킵니다.',
      descriptionSw: 'Wanafunzi wanatafsiri kusudi lao la maisha kuwa mradi wa vitendo, unaozingatia kusudi. Wanafikiria, kuunda, kujaribu, na kutoa wazo la kimkakati linalolenga kushughulikia Tatizo lao la Maisha. Jukumu hili linawaandaa kwa utekelezaji wa ulimwengu halisi kwa uwazi na ujasiri.',
      
      missions: 1,
      duration: '3 weeks',
      deliverable: 'Purpose-driven Project',
      deliverableKo: '목적 중심 프로젝트',
      deliverableSw: 'Mradi Unaozingatia Kusudi',
      
      order: 5
    }
  ],
  
  // ==================== DELIVERABLES ====================
  DELIVERABLES: [
    {
      id: 'identity_statement',
      name: 'Identity Statement',
      nameKo: '정체성 선언문',
      nameSw: 'Kauli ya Utambulisho',
      stageNumber: 1,
      description: 'A personal declaration of identity grounded in biblical truth',
      descriptionKo: '성경적 진리에 근거한 개인 정체성 선언',
      descriptionSw: 'Tangazo la kibinafsi la utambulisho kulingana na ukweli wa Biblia',
      required: true
    },
    {
      id: 'problem_candidate',
      name: 'Problem Candidate',
      nameKo: '문제 후보',
      nameSw: 'Mgombea wa Tatizo',
      stageNumber: 2,
      description: 'A clearly defined problem that resonates with your calling',
      descriptionKo: '당신의 소명과 공명하는 명확하게 정의된 문제',
      descriptionSw: 'Tatizo lililofafanuliwa wazi linaloambatana na wito wako',
      required: true
    },
    {
      id: 'problem_owner_story',
      name: 'Problem Owner Story',
      nameKo: '문제 소유자 이야기',
      nameSw: 'Hadithi ya Mmiliki wa Tatizo',
      stageNumber: 3,
      description: 'A humanized story of those affected by the problem',
      descriptionKo: '문제의 영향을 받는 사람들의 인간화된 이야기',
      descriptionSw: 'Hadithi ya kibinadamu ya wale walioathiriwa na tatizo',
      required: true
    },
    {
      id: 'life_purpose_statement',
      name: 'Life Purpose Statement',
      nameKo: '인생 목적 선언문',
      nameSw: 'Kauli ya Kusudi la Maisha',
      stageNumber: 4,
      description: 'A one-sentence statement connecting identity, problem, and purpose',
      descriptionKo: '정체성, 문제, 목적을 연결하는 한 문장의 선언문',
      descriptionSw: 'Kauli ya sentensi moja inayounganisha utambulisho, tatizo, na kusudi',
      required: true
    },
    {
      id: 'purpose_driven_project',
      name: 'Purpose-driven Project',
      nameKo: '목적 중심 프로젝트',
      nameSw: 'Mradi Unaozingatia Kusudi',
      stageNumber: 5,
      description: 'A concrete project design aligned with your life purpose',
      descriptionKo: '인생 목적과 일치하는 구체적인 프로젝트 설계',
      descriptionSw: 'Muundo wa mradi wa dhahiri unaozingatia kusudi lako la maisha',
      required: true
    }
  ],
  
  // ==================== BADGES ====================
  BADGES: [
    {
      id: 'GPS101_STAGE_1',
      name: 'Identity Seeker',
      nameKo: '정체성 탐구자',
      nameSw: 'Mtafiti wa Utambulisho',
      description: 'Completed Stage 1: Who are you?',
      descriptionKo: '스테이지 1 완료: 당신은 누구입니까?',
      descriptionSw: 'Imekamilisha Hatua ya 1: Wewe ni nani?',
      icon: '🔍',
      stageNumber: 1
    },
    {
      id: 'GPS101_STAGE_2',
      name: 'Problem Explorer',
      nameKo: '문제 탐험가',
      nameSw: 'Mchunguzi wa Matatizo',
      description: 'Completed Stage 2: What is the meaning of your life?',
      descriptionKo: '스테이지 2 완료: 당신의 삶의 의미는 무엇입니까?',
      descriptionSw: 'Imekamilisha Hatua ya 2: Maana ya maisha yako ni nini?',
      icon: '🗺️',
      stageNumber: 2
    },
    {
      id: 'GPS101_STAGE_3',
      name: 'Empathy Builder',
      nameKo: '공감 구축자',
      nameSw: 'Mjenzi wa Huruma',
      description: 'Completed Stage 3: Whose pain are you called to solve?',
      descriptionKo: '스테이지 3 완료: 누구의 고통을 해결하도록 부름받았습니까?',
      descriptionSw: 'Imekamilisha Hatua ya 3: Maumivu ya nani umeamriwa kuyatatua?',
      icon: '❤️',
      stageNumber: 3
    },
    {
      id: 'GPS101_STAGE_4',
      name: 'Purpose Declarer',
      nameKo: '목적 선언자',
      nameSw: 'Mtangaji wa Kusudi',
      description: 'Completed Stage 4: What is your life purpose?',
      descriptionKo: '스테이지 4 완료: 당신의 인생 목적은 무엇입니까?',
      descriptionSw: 'Imekamilisha Hatua ya 4: Kusudi lako la maisha ni nini?',
      icon: '🎯',
      stageNumber: 4
    },
    {
      id: 'GPS101_STAGE_5',
      name: 'Project Designer',
      nameKo: '프로젝트 설계자',
      nameSw: 'Mbunifu wa Mradi',
      description: 'Completed Stage 5: What is your Purpose-driven Project?',
      descriptionKo: '스테이지 5 완료: 목적 중심의 프로젝트는 무엇입니까?',
      descriptionSw: 'Imekamilisha Hatua ya 5: Mradi wako unaozingatia Kusudi ni nini?',
      icon: '🚀',
      stageNumber: 5
    },
    {
      id: 'GPS101_COMPLETE',
      name: 'Purpose Pathfinder',
      nameKo: '목적 경로 탐색자',
      nameSw: 'Kiongozi wa Njia ya Kusudi',
      description: 'Completed all of GPS 101 Basic and earned the Orange Beacon',
      descriptionKo: 'GPS 101 베이직을 모두 완료하고 오렌지 비콘을 획득했습니다',
      descriptionSw: 'Imekamilisha GPS 101 Msingi yote na kupata Taa ya Machungwa',
      icon: '🏆',
      special: true
    }
  ],
  
  // ==================== FEATURES ====================
  features: {
    aiCompanion: true,          // GPS Navigator
    studyForge: true,           // Study materials for failed checkpoints
    biteBoard: true,            // Checkpoint management
    portfolio: true,            // GPS Journal
    barakaWallet: true,         // Baraka tracking
    psbWallet: false,           // No PSB in GPS 101
    communityFeed: true,        // Community activity
    peerReview: false,          // No peer review in GPS 101
    teamMode: false             // Solo only
  },
  
  // ==================== PREREQUISITES ====================
  prerequisites: {
    requiredCourses: [],
    recommendedCourses: ['GPO_CALL'],
    minimumLevel: 1,
    gpoCallRequired: false
  },
  
  // ==================== NEXT COURSE ====================
  nextCourse: {
    courseId: 'GPS_PREP',
    courseName: 'GPS Prep',
    description: 'Create a GPS White Paper with Video Pitch to Attract Partners',
    descriptionKo: '파트너를 유치하기 위한 GPS 백서와 비디오 피치 작성',
    descriptionSw: 'Tengeneza GPS White Paper na Video Pitch ili kuvutia Washirika'
  }
};

