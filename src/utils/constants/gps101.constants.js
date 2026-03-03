/**
 * GPS 101 Basic - Detailed Constants
 * 
 * Contains all detailed mission structures, checkpoint questions,
 * and GPS 101-specific constant data.
 */

// ==================== STAGE 1 MISSIONS ====================

export const GPS_101_STAGE_1_MISSIONS = [
  {
    missionId: 'GPS101_S1_M1',
    stageNumber: 1,
    missionNumber: 1,
    title: 'Orientation / Stage 1 Opening Lecture',
    titleKo: '오리엔테이션 / 1단계 오프닝 강의',
    description: 'Attend Orientation, understand GPS 101 purpose, complete self-reflection pre-survey, join learning community, set 1-2 personal goals',
    objectives: [
      'Attended Orientation',
      'Understood GPS 101 purpose',
      'Completed self-reflection pre-survey',
      'Joined learning community',
      'Set 1-2 personal goals'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S1_M1_CP1',
        order: 1,
        question: 'Familiarity with GPS learning goals',
        questionKo: 'GPS 학습 목표에 대한 이해도',
        type: 'reflection',
        minLength: 100,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S1_M1_CP2',
        order: 2,
        question: 'Awareness of personal starting point',
        questionKo: '개인 출발점에 대한 인식',
        type: 'reflection',
        minLength: 100,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S1_M1_CP3',
        order: 3,
        question: 'Motivation anchored in self-interest',
        questionKo: '자기 이익에 기반한 동기부여',
        type: 'reflection',
        minLength: 100,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S1_M1_CP4',
        order: 4,
        question: 'Initial connection to community',
        questionKo: '커뮤니티와의 초기 연결',
        type: 'reflection',
        minLength: 100,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S1_M1_CP5',
        order: 5,
        question: 'Clear intention to discover identity',
        questionKo: '정체성 발견에 대한 명확한 의도',
        type: 'reflection',
        minLength: 100,
        maxLength: 500
      }
    ],
    expectedOutcome: 'Clear understanding of GPS 101 journey and personal goals',
    barakaReward: 150,
    xpReward: 30
  },
  {
    missionId: 'GPS101_S1_M2',
    stageNumber: 1,
    missionNumber: 2,
    title: 'TA Orientation',
    titleKo: 'TA 오리엔테이션',
    description: 'Understand GPS 101 tool (Google Sheet), summarize 5 stages, identify evaluation criteria, complete MLQ test, write pre-journey self-reflection',
    objectives: [
      'Understand GPS 101 tool (Google Sheet)',
      'Summarize 5 stages',
      'Identify evaluation criteria',
      'Complete MLQ test',
      'Write pre-journey self-reflection'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S1_M2_CP1',
        order: 1,
        question: 'Fill out My Dashboard',
        questionKo: '나의 대시보드 작성',
        type: 'task',
        minLength: 50,
        maxLength: 300
      },
      {
        checkpointId: 'GPS101_S1_M2_CP2',
        order: 2,
        question: 'Clearly organize Stage 1-5 goals/content',
        questionKo: '1-5단계 목표/내용 명확하게 정리',
        type: 'organization',
        minLength: 200,
        maxLength: 1000
      },
      {
        checkpointId: 'GPS101_S1_M2_CP3',
        order: 3,
        question: 'Outline evaluation elements/strategies',
        questionKo: '평가 요소/전략 개요 작성',
        type: 'planning',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S1_M2_CP4',
        order: 4,
        question: 'Record MLQ score with 100+ word analysis',
        questionKo: 'MLQ 점수 기록 및 100단어 이상 분석',
        type: 'analysis',
        minLength: 100,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S1_M2_CP5',
        order: 5,
        question: 'State personal goals/motivations (100+ words)',
        questionKo: '개인 목표/동기 진술 (100단어 이상)',
        type: 'reflection',
        minLength: 100,
        maxLength: 500
      }
    ],
    expectedOutcome: 'Complete dashboard setup and self-awareness baseline',
    barakaReward: 150,
    xpReward: 30
  },
  {
    missionId: 'GPS101_S1_M3',
    stageNumber: 1,
    missionNumber: 3,
    title: 'Your Timeline of 10 Defining Moments & Reflection on Failure',
    titleKo: '10가지 결정적 순간의 타임라인 & 실패에 대한 성찰',
    description: 'List 10 life events (include 2 failures), visualize timeline, reflect on emotions/lessons, reinterpret failures as growth, share with team',
    objectives: [
      'List 10 life events (include 2 failures)',
      'Visualize timeline',
      'Reflect on emotions/lessons',
      'Reinterpret failures as growth',
      'Share with team'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S1_M3_CP1',
        order: 1,
        question: 'Recognize life events comprehensively',
        questionKo: '인생 사건을 포괄적으로 인식',
        type: 'list',
        minLength: 200,
        maxLength: 1000
      },
      {
        checkpointId: 'GPS101_S1_M3_CP2',
        order: 2,
        question: 'Create Life Timeline using Canva',
        questionKo: 'Canva를 사용하여 인생 타임라인 생성',
        type: 'visual',
        requiresUpload: true
      },
      {
        checkpointId: 'GPS101_S1_M3_CP3',
        order: 3,
        question: 'Honestly express feelings/reflections/lessons',
        questionKo: '감정/성찰/교훈을 솔직하게 표현',
        type: 'reflection',
        minLength: 300,
        maxLength: 1000
      },
      {
        checkpointId: 'GPS101_S1_M3_CP4',
        order: 4,
        question: 'Share timeline and failure experiences',
        questionKo: '타임라인 및 실패 경험 공유',
        type: 'sharing',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S1_M3_CP5',
        order: 5,
        question: 'Growth insights from failures',
        questionKo: '실패로부터의 성장 통찰',
        type: 'reflection',
        minLength: 150,
        maxLength: 500
      }
    ],
    expectedOutcome: 'Life Timeline created with failure reframed as growth',
    barakaReward: 150,
    xpReward: 30
  },
  {
    missionId: 'GPS101_S1_M4',
    stageNumber: 1,
    missionNumber: 4,
    title: 'Interview with Future Self (via GPT)',
    titleKo: '미래의 나와의 인터뷰 (GPT 사용)',
    description: 'Define interview setting, execute interview with AI, save PDF record, emphasize 3 major insights, consider influence on today\'s actions',
    objectives: [
      'Define interview setting',
      'Execute interview with AI',
      'Save PDF record',
      'Emphasize 3 major insights',
      'Consider influence on today\'s actions'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S1_M4_CP1',
        order: 1,
        question: 'Vivid scenario description',
        questionKo: '생동감 있는 시나리오 설명',
        type: 'creative',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S1_M4_CP2',
        order: 2,
        question: 'Analysis/summary of 3 impressive themes',
        questionKo: '인상적인 3가지 주제 분석/요약',
        type: 'analysis',
        minLength: 300,
        maxLength: 1000
      },
      {
        checkpointId: 'GPS101_S1_M4_CP3',
        order: 3,
        question: '3+ line summary of important content',
        questionKo: '중요 내용의 3줄 이상 요약',
        type: 'summary',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S1_M4_CP4',
        order: 4,
        question: 'Organized presentation of 3 insights',
        questionKo: '3가지 통찰의 체계적 제시',
        type: 'presentation',
        minLength: 300,
        maxLength: 1000
      },
      {
        checkpointId: 'GPS101_S1_M4_CP5',
        order: 5,
        question: 'At least 3 specific commitments',
        questionKo: '최소 3가지 구체적 다짐',
        type: 'commitment',
        minLength: 150,
        maxLength: 500
      }
    ],
    expectedOutcome: 'Future self interview with 3 major insights and commitments',
    barakaReward: 150,
    xpReward: 30
  },
  {
    missionId: 'GPS101_S1_M5',
    stageNumber: 1,
    missionNumber: 5,
    title: 'Identity Manifesto Draft',
    titleKo: '정체성 선언문 초안',
    description: 'Write 3-5 identity statements, submit to ChatGPT for feedback, link to 3+ core values, write personal experience, present to peers',
    objectives: [
      'Write 3-5 identity statements',
      'Submit to ChatGPT for feedback',
      'Link to 3+ core values',
      'Write personal experience',
      'Present to peers'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S1_M5_CP1',
        order: 1,
        question: 'Stronger self-awareness through clear identity statements',
        questionKo: '명확한 정체성 진술을 통한 강화된 자기 인식',
        type: 'reflection',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S1_M5_CP2',
        order: 2,
        question: 'Refined statements incorporating ChatGPT feedback',
        questionKo: 'ChatGPT 피드백을 반영한 정제된 진술',
        type: 'revision',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S1_M5_CP3',
        order: 3,
        question: 'Clear connections between identity/values',
        questionKo: '정체성/가치관 간 명확한 연결',
        type: 'analysis',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S1_M5_CP4',
        order: 4,
        question: 'One meaningful personal experience narrative',
        questionKo: '의미 있는 개인 경험 이야기 1개',
        type: 'narrative',
        minLength: 300,
        maxLength: 1000
      },
      {
        checkpointId: 'GPS101_S1_M5_CP5',
        order: 5,
        question: 'Revised statements based on peer feedback',
        questionKo: '동료 피드백 기반 수정된 진술',
        type: 'revision',
        minLength: 200,
        maxLength: 800
      }
    ],
    expectedOutcome: 'Identity manifesto with 3-5 statements linked to core values',
    barakaReward: 150,
    xpReward: 30
  },
  {
    missionId: 'GPS101_S1_M6',
    stageNumber: 1,
    missionNumber: 6,
    title: 'Speech Practice 1:1 "Who am I?"',
    titleKo: '1:1 스피치 연습 "나는 누구인가?"',
    description: 'Write 1-minute speech, practice aloud with GPT feedback, record and review delivery, peer-review for authenticity, publicly declare "I am an agent sent by God"',
    objectives: [
      'Write 1-minute speech',
      'Practice aloud with GPT feedback',
      'Record and review delivery',
      'Peer-review for authenticity',
      'Publicly declare "I am an agent sent by God"'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S1_M6_CP1',
        order: 1,
        question: 'Clarity in expression',
        questionKo: '표현의 명확성',
        type: 'evaluation',
        minLength: 100,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S1_M6_CP2',
        order: 2,
        question: 'Confidence in identity',
        questionKo: '정체성에 대한 자신감',
        type: 'reflection',
        minLength: 100,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S1_M6_CP3',
        order: 3,
        question: 'Emotional connection to story',
        questionKo: '이야기에 대한 감정적 연결',
        type: 'reflection',
        minLength: 100,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S1_M6_CP4',
        order: 4,
        question: 'Integration of reflections',
        questionKo: '성찰의 통합',
        type: 'synthesis',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S1_M6_CP5',
        order: 5,
        question: 'Final declaration',
        questionKo: '최종 선언',
        type: 'declaration',
        minLength: 50,
        maxLength: 200,
        requiresVideo: true
      }
    ],
    expectedOutcome: 'Public declaration: "I am an agent sent by God"',
    barakaReward: 150,
    xpReward: 30,
    isStageCompleter: true
  }
];

// ==================== STAGE 2 MISSIONS ====================

export const GPS_101_STAGE_2_MISSIONS = [
  {
    missionId: 'GPS101_S2_M1',
    stageNumber: 2,
    missionNumber: 1,
    title: 'Opening Lecture: Meaning of Life & Problemology',
    titleKo: '오프닝 강의: 삶의 의미 & 문제론',
    description: 'Understand the meaning of life through the lens of problem-solving and problemology',
    objectives: [
      'Understand problemology framework',
      'Connect life meaning to problems',
      'Identify personal problem interests'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S2_M1_CP1',
        order: 1,
        question: 'Understanding of problemology',
        questionKo: '문제론에 대한 이해',
        type: 'reflection',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S2_M1_CP2',
        order: 2,
        question: 'Connection between meaning and problems',
        questionKo: '의미와 문제 간의 연결',
        type: 'reflection',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S2_M1_CP3',
        order: 3,
        question: 'Personal problem interests',
        questionKo: '개인적 문제 관심사',
        type: 'exploration',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S2_M1_CP4',
        order: 4,
        question: 'Reflection on life purpose direction',
        questionKo: '인생 목적 방향에 대한 성찰',
        type: 'reflection',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S2_M1_CP5',
        order: 5,
        question: 'Initial problem brainstorm',
        questionKo: '초기 문제 브레인스토밍',
        type: 'brainstorm',
        minLength: 200,
        maxLength: 800
      }
    ],
    expectedOutcome: 'Understanding of problemology and initial problem interests',
    barakaReward: 150,
    xpReward: 30
  },
  {
    missionId: 'GPS101_S2_M2',
    stageNumber: 2,
    missionNumber: 2,
    title: 'Global Problems Tournament',
    titleKo: '글로벌 문제 토너먼트',
    description: 'Explore and evaluate various global problems through a tournament-style comparison',
    objectives: [
      'Research global problems',
      'Compare problem significance',
      'Identify personal resonance'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S2_M2_CP1',
        order: 1,
        question: 'Global problems researched',
        questionKo: '연구한 글로벌 문제들',
        type: 'research',
        minLength: 200,
        maxLength: 1000
      },
      {
        checkpointId: 'GPS101_S2_M2_CP2',
        order: 2,
        question: 'Tournament bracket results',
        questionKo: '토너먼트 브래킷 결과',
        type: 'evaluation',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S2_M2_CP3',
        order: 3,
        question: 'Top 10 problems identified',
        questionKo: '상위 10개 문제 식별',
        type: 'list',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S2_M2_CP4',
        order: 4,
        question: 'Personal resonance analysis',
        questionKo: '개인적 공명 분석',
        type: 'reflection',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S2_M2_CP5',
        order: 5,
        question: 'Emotional response to problems',
        questionKo: '문제에 대한 감정적 반응',
        type: 'reflection',
        minLength: 150,
        maxLength: 500
      }
    ],
    expectedOutcome: 'Top 10 global problems with personal resonance',
    barakaReward: 150,
    xpReward: 30
  },
  {
    missionId: 'GPS101_S2_M3',
    stageNumber: 2,
    missionNumber: 3,
    title: 'Bridging Problems Game',
    titleKo: '문제 연결 게임',
    description: 'Connect personal experiences to global problems',
    objectives: [
      'Identify bridging opportunities',
      'Connect personal to global',
      'Discover calling patterns'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S2_M3_CP1',
        order: 1,
        question: 'Personal experiences identified',
        questionKo: '개인 경험 식별',
        type: 'reflection',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S2_M3_CP2',
        order: 2,
        question: 'Bridges to global problems',
        questionKo: '글로벌 문제로의 연결',
        type: 'analysis',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S2_M3_CP3',
        order: 3,
        question: 'Pattern recognition',
        questionKo: '패턴 인식',
        type: 'analysis',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S2_M3_CP4',
        order: 4,
        question: 'Calling indicators',
        questionKo: '소명 지표',
        type: 'reflection',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S2_M3_CP5',
        order: 5,
        question: 'Problem-experience synthesis',
        questionKo: '문제-경험 종합',
        type: 'synthesis',
        minLength: 200,
        maxLength: 800
      }
    ],
    expectedOutcome: 'Clear bridges between personal experiences and global problems',
    barakaReward: 150,
    xpReward: 30
  },
  {
    missionId: 'GPS101_S2_M4',
    stageNumber: 2,
    missionNumber: 4,
    title: 'Inner Reflection and Dialogue',
    titleKo: '내면 성찰 및 대화',
    description: 'Deep inner dialogue to discover authentic problem calling',
    objectives: [
      'Practice deep reflection',
      'Identify authentic interests',
      'Distinguish calling from obligation'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S2_M4_CP1',
        order: 1,
        question: 'Deep reflection practice',
        questionKo: '깊은 성찰 연습',
        type: 'reflection',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S2_M4_CP2',
        order: 2,
        question: 'Authentic vs. obligatory interests',
        questionKo: '진정한 관심사 vs. 의무적 관심사',
        type: 'analysis',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S2_M4_CP3',
        order: 3,
        question: 'Calling indicators discovered',
        questionKo: '발견된 소명 지표',
        type: 'discovery',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S2_M4_CP4',
        order: 4,
        question: 'Inner dialogue insights',
        questionKo: '내면 대화 통찰',
        type: 'reflection',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S2_M4_CP5',
        order: 5,
        question: 'Refined problem focus',
        questionKo: '정제된 문제 초점',
        type: 'synthesis',
        minLength: 150,
        maxLength: 500
      }
    ],
    expectedOutcome: 'Authentic problem interests distinguished from obligations',
    barakaReward: 150,
    xpReward: 30
  },
  {
    missionId: 'GPS101_S2_M5',
    stageNumber: 2,
    missionNumber: 5,
    title: 'Mind Mapping (Simplified)',
    titleKo: '마인드 맵 (단순화)',
    description: 'Create visual mind map of problem candidates and connections',
    objectives: [
      'Create mind map',
      'Visualize connections',
      'Identify central themes'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S2_M5_CP1',
        order: 1,
        question: 'Mind map created',
        questionKo: '마인드 맵 생성',
        type: 'visual',
        requiresUpload: true
      },
      {
        checkpointId: 'GPS101_S2_M5_CP2',
        order: 2,
        question: 'Problem connections identified',
        questionKo: '문제 연결 식별',
        type: 'analysis',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S2_M5_CP3',
        order: 3,
        question: 'Central themes discovered',
        questionKo: '중심 주제 발견',
        type: 'synthesis',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S2_M5_CP4',
        order: 4,
        question: 'Problem clustering',
        questionKo: '문제 클러스터링',
        type: 'organization',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S2_M5_CP5',
        order: 5,
        question: 'Insights from visualization',
        questionKo: '시각화로부터의 통찰',
        type: 'reflection',
        minLength: 150,
        maxLength: 500
      }
    ],
    expectedOutcome: 'Visual mind map showing problem candidates and connections',
    barakaReward: 150,
    xpReward: 30
  },
  {
    missionId: 'GPS101_S2_M6',
    stageNumber: 2,
    missionNumber: 6,
    title: 'Report Draft 2',
    titleKo: '보고서 초안 2',
    description: 'Document 5-20 Life Problem Candidates with rationale',
    objectives: [
      'List 5-20 problem candidates',
      'Provide rationale for each',
      'Rank by personal calling'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S2_M6_CP1',
        order: 1,
        question: '5-20 problems documented',
        questionKo: '5-20개 문제 문서화',
        type: 'list',
        minLength: 300,
        maxLength: 2000
      },
      {
        checkpointId: 'GPS101_S2_M6_CP2',
        order: 2,
        question: 'Rationale for each problem',
        questionKo: '각 문제에 대한 근거',
        type: 'analysis',
        minLength: 300,
        maxLength: 1500
      },
      {
        checkpointId: 'GPS101_S2_M6_CP3',
        order: 3,
        question: 'Ranking by calling strength',
        questionKo: '소명 강도에 따른 순위',
        type: 'evaluation',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S2_M6_CP4',
        order: 4,
        question: 'Connection to personal journey',
        questionKo: '개인 여정과의 연결',
        type: 'reflection',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S2_M6_CP5',
        order: 5,
        question: 'Top 3 problem candidates finalized',
        questionKo: '최종 상위 3개 문제 후보',
        type: 'synthesis',
        minLength: 200,
        maxLength: 800
      }
    ],
    expectedOutcome: '5-20 Life Problem Candidates documented and ranked',
    barakaReward: 150,
    xpReward: 30,
    isStageCompleter: true
  }
];

// ==================== STAGE 3 MISSIONS ====================

export const GPS_101_STAGE_3_MISSIONS = [
  {
    missionId: 'GPS101_S3_M1',
    stageNumber: 3,
    missionNumber: 1,
    title: 'Opening Lecture: Problem Ownership and Empathy',
    titleKo: '오프닝 강의: 문제 소유권과 공감',
    description: 'Understand problem ownership and develop empathy for problem owners',
    objectives: [
      'Understand problem ownership',
      'Develop empathy mindset',
      'Identify problem owners'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S3_M1_CP1',
        order: 1,
        question: 'Problem ownership understanding',
        questionKo: '문제 소유권 이해',
        type: 'reflection',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S3_M1_CP2',
        order: 2,
        question: 'Empathy framework',
        questionKo: '공감 프레임워크',
        type: 'learning',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S3_M1_CP3',
        order: 3,
        question: 'Problem owner identification',
        questionKo: '문제 소유자 식별',
        type: 'exploration',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S3_M1_CP4',
        order: 4,
        question: 'Empathy vs. sympathy distinction',
        questionKo: '공감과 동정의 구분',
        type: 'analysis',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S3_M1_CP5',
        order: 5,
        question: 'Personal empathy commitment',
        questionKo: '개인적 공감 다짐',
        type: 'commitment',
        minLength: 100,
        maxLength: 500
      }
    ],
    expectedOutcome: 'Understanding of problem ownership and empathy framework',
    barakaReward: 150,
    xpReward: 30
  },
  {
    missionId: 'GPS101_S3_M2',
    stageNumber: 3,
    missionNumber: 2,
    title: 'Watch a documentary of a Problem Owner',
    titleKo: '문제 소유자에 대한 다큐멘터리 시청',
    description: 'Watch and analyze documentary about real problem owner',
    objectives: [
      'Watch documentary',
      'Take detailed notes',
      'Identify key themes'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S3_M2_CP1',
        order: 1,
        question: 'Documentary summary',
        questionKo: '다큐멘터리 요약',
        type: 'summary',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S3_M2_CP2',
        order: 2,
        question: 'Key themes identified',
        questionKo: '주요 주제 식별',
        type: 'analysis',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S3_M2_CP3',
        order: 3,
        question: 'Problem owner\'s pain points',
        questionKo: '문제 소유자의 고통 지점',
        type: 'empathy',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S3_M2_CP4',
        order: 4,
        question: 'Emotional response',
        questionKo: '감정적 반응',
        type: 'reflection',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S3_M2_CP5',
        order: 5,
        question: 'Lessons learned',
        questionKo: '배운 교훈',
        type: 'reflection',
        minLength: 150,
        maxLength: 500
      }
    ],
    expectedOutcome: 'Deep understanding of problem owner through documentary',
    barakaReward: 150,
    xpReward: 30
  },
  {
    missionId: 'GPS101_S3_M3',
    stageNumber: 3,
    missionNumber: 3,
    title: 'Investigate More Of The Problem Owner',
    titleKo: '문제 소유자에 대한 추가 조사',
    description: 'Conduct deeper research into problem owner\'s situation',
    objectives: [
      'Research problem owner',
      'Interview if possible',
      'Document findings'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S3_M3_CP1',
        order: 1,
        question: 'Research conducted',
        questionKo: '수행된 연구',
        type: 'research',
        minLength: 200,
        maxLength: 1000
      },
      {
        checkpointId: 'GPS101_S3_M3_CP2',
        order: 2,
        question: 'Problem owner profile',
        questionKo: '문제 소유자 프로필',
        type: 'documentation',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S3_M3_CP3',
        order: 3,
        question: 'Daily life challenges',
        questionKo: '일상 생활 도전',
        type: 'analysis',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S3_M3_CP4',
        order: 4,
        question: 'Support systems and gaps',
        questionKo: '지원 시스템 및 공백',
        type: 'analysis',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S3_M3_CP5',
        order: 5,
        question: 'Insights and surprises',
        questionKo: '통찰과 놀라움',
        type: 'reflection',
        minLength: 150,
        maxLength: 500
      }
    ],
    expectedOutcome: 'Comprehensive problem owner profile',
    barakaReward: 150,
    xpReward: 30
  },
  {
    missionId: 'GPS101_S3_M4',
    stageNumber: 3,
    missionNumber: 4,
    title: 'Analyze the Systemic Injustice in the Story',
    titleKo: '이야기 속 구조적 불의 분석',
    description: 'Identify and analyze systemic factors contributing to problem',
    objectives: [
      'Identify systemic factors',
      'Analyze root causes',
      'Map injustice patterns'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S3_M4_CP1',
        order: 1,
        question: 'Systemic factors identified',
        questionKo: '구조적 요인 식별',
        type: 'analysis',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S3_M4_CP2',
        order: 2,
        question: 'Root cause analysis',
        questionKo: '근본 원인 분석',
        type: 'analysis',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S3_M4_CP3',
        order: 3,
        question: 'Injustice patterns mapped',
        questionKo: '불의 패턴 매핑',
        type: 'mapping',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S3_M4_CP4',
        order: 4,
        question: 'Power dynamics analysis',
        questionKo: '권력 역학 분석',
        type: 'analysis',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S3_M4_CP5',
        order: 5,
        question: 'Change leverage points',
        questionKo: '변화 레버리지 포인트',
        type: 'strategy',
        minLength: 150,
        maxLength: 500
      }
    ],
    expectedOutcome: 'Systemic analysis of injustice in problem owner story',
    barakaReward: 150,
    xpReward: 30
  },
  {
    missionId: 'GPS101_S3_M5',
    stageNumber: 3,
    missionNumber: 5,
    title: 'Create a Mock Fundraiser for the Problem Owner',
    titleKo: '문제 소유자를 위한 모의 모금 행사 만들기',
    description: 'Design fundraising campaign for problem owner',
    objectives: [
      'Create fundraiser concept',
      'Define campaign goals',
      'Design pitch materials'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S3_M5_CP1',
        order: 1,
        question: 'Fundraiser concept',
        questionKo: '모금 행사 개념',
        type: 'creative',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S3_M5_CP2',
        order: 2,
        question: 'Campaign goals and metrics',
        questionKo: '캠페인 목표 및 지표',
        type: 'planning',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S3_M5_CP3',
        order: 3,
        question: 'Pitch materials created',
        questionKo: '피치 자료 생성',
        type: 'creative',
        requiresUpload: true
      },
      {
        checkpointId: 'GPS101_S3_M5_CP4',
        order: 4,
        question: 'Story impact analysis',
        questionKo: '스토리 영향 분석',
        type: 'reflection',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S3_M5_CP5',
        order: 5,
        question: 'Empathy demonstration',
        questionKo: '공감 시연',
        type: 'reflection',
        minLength: 150,
        maxLength: 500
      }
    ],
    expectedOutcome: 'Mock fundraiser campaign for problem owner',
    barakaReward: 150,
    xpReward: 30
  },
  {
    missionId: 'GPS101_S3_M6',
    stageNumber: 3,
    missionNumber: 6,
    title: 'Fundraising Tournament + Journal Draft 3',
    titleKo: '모금 토너먼트 + 저널 초안 3',
    description: 'Complete problem owner story and deliver compelling narrative',
    objectives: [
      'Write complete story',
      'Include systemic analysis',
      'Demonstrate empathy'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S3_M6_CP1',
        order: 1,
        question: 'Complete problem owner story',
        questionKo: '완전한 문제 소유자 이야기',
        type: 'narrative',
        minLength: 500,
        maxLength: 2000
      },
      {
        checkpointId: 'GPS101_S3_M6_CP2',
        order: 2,
        question: 'Systemic analysis integration',
        questionKo: '구조적 분석 통합',
        type: 'synthesis',
        minLength: 300,
        maxLength: 1000
      },
      {
        checkpointId: 'GPS101_S3_M6_CP3',
        order: 3,
        question: 'Empathy demonstration',
        questionKo: '공감 시연',
        type: 'reflection',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S3_M6_CP4',
        order: 4,
        question: 'Call to action',
        questionKo: '행동 촉구',
        type: 'persuasion',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S3_M6_CP5',
        order: 5,
        question: 'Story impact reflection',
        questionKo: '스토리 영향 성찰',
        type: 'reflection',
        minLength: 150,
        maxLength: 500
      }
    ],
    expectedOutcome: 'Compelling problem owner story with systemic analysis',
    barakaReward: 150,
    xpReward: 30,
    isStageCompleter: true
  }
];

// ==================== STAGE 4 MISSIONS ====================

export const GPS_101_STAGE_4_MISSIONS = [
  {
    missionId: 'GPS101_S4_M1',
    stageNumber: 4,
    missionNumber: 1,
    title: 'Opening Lecture: Understanding Life Purpose',
    titleKo: '오프닝 강의: 삶의 목적 이해',
    description: 'Understand the concept and importance of life purpose',
    objectives: [
      'Define life purpose',
      'Understand purpose framework',
      'Connect to personal journey'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S4_M1_CP1',
        order: 1,
        question: 'Life purpose definition',
        questionKo: '삶의 목적 정의',
        type: 'reflection',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S4_M1_CP2',
        order: 2,
        question: 'Purpose framework understanding',
        questionKo: '목적 프레임워크 이해',
        type: 'learning',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S4_M1_CP3',
        order: 3,
        question: 'Connection to journey so far',
        questionKo: '지금까지의 여정과의 연결',
        type: 'reflection',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S4_M1_CP4',
        order: 4,
        question: 'Purpose vs. goals distinction',
        questionKo: '목적과 목표의 구분',
        type: 'analysis',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S4_M1_CP5',
        order: 5,
        question: 'Initial purpose thoughts',
        questionKo: '초기 목적 생각',
        type: 'exploration',
        minLength: 150,
        maxLength: 500
      }
    ],
    expectedOutcome: 'Understanding of life purpose framework',
    barakaReward: 150,
    xpReward: 30
  },
  {
    missionId: 'GPS101_S4_M2',
    stageNumber: 4,
    missionNumber: 2,
    title: 'Draft a Problem Statement and Purpose Statement',
    titleKo: '문제 진술 및 목적 진술 초안',
    description: 'Create draft problem and purpose statements',
    objectives: [
      'Draft problem statement',
      'Draft purpose statement',
      'Connect the two'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S4_M2_CP1',
        order: 1,
        question: 'Problem statement draft',
        questionKo: '문제 진술 초안',
        type: 'statement',
        minLength: 100,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S4_M2_CP2',
        order: 2,
        question: 'Purpose statement draft',
        questionKo: '목적 진술 초안',
        type: 'statement',
        minLength: 50,
        maxLength: 200
      },
      {
        checkpointId: 'GPS101_S4_M2_CP3',
        order: 3,
        question: 'Connection between problem and purpose',
        questionKo: '문제와 목적 간의 연결',
        type: 'analysis',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S4_M2_CP4',
        order: 4,
        question: 'Clarity and specificity',
        questionKo: '명확성과 구체성',
        type: 'refinement',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S4_M2_CP5',
        order: 5,
        question: 'Personal authenticity check',
        questionKo: '개인적 진정성 확인',
        type: 'reflection',
        minLength: 150,
        maxLength: 500
      }
    ],
    expectedOutcome: 'Draft problem and purpose statements',
    barakaReward: 150,
    xpReward: 30
  },
  {
    missionId: 'GPS101_S4_M3',
    stageNumber: 4,
    missionNumber: 3,
    title: 'Pressure Test Your Purpose',
    titleKo: '목적 압력 테스트',
    description: 'Test purpose statement against various scenarios and challenges',
    objectives: [
      'Test against scenarios',
      'Seek feedback',
      'Refine statement'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S4_M3_CP1',
        order: 1,
        question: 'Scenario testing results',
        questionKo: '시나리오 테스트 결과',
        type: 'evaluation',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S4_M3_CP2',
        order: 2,
        question: 'Feedback received and analyzed',
        questionKo: '받고 분석한 피드백',
        type: 'analysis',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S4_M3_CP3',
        order: 3,
        question: 'Refinements made',
        questionKo: '수행된 개선',
        type: 'refinement',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S4_M3_CP4',
        order: 4,
        question: 'Strength and weakness analysis',
        questionKo: '강점 및 약점 분석',
        type: 'analysis',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S4_M3_CP5',
        order: 5,
        question: 'Confidence level',
        questionKo: '자신감 수준',
        type: 'reflection',
        minLength: 100,
        maxLength: 500
      }
    ],
    expectedOutcome: 'Tested and refined purpose statement',
    barakaReward: 150,
    xpReward: 30
  },
  {
    missionId: 'GPS101_S4_M4',
    stageNumber: 4,
    missionNumber: 4,
    title: 'Vision Capturing',
    titleKo: '비전 포착',
    description: 'Create vivid vision of purpose in action',
    objectives: [
      'Visualize future impact',
      'Create vision board',
      'Write vision narrative'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S4_M4_CP1',
        order: 1,
        question: 'Future vision described',
        questionKo: '미래 비전 설명',
        type: 'creative',
        minLength: 200,
        maxLength: 1000
      },
      {
        checkpointId: 'GPS101_S4_M4_CP2',
        order: 2,
        question: 'Vision board created',
        questionKo: '비전 보드 생성',
        type: 'visual',
        requiresUpload: true
      },
      {
        checkpointId: 'GPS101_S4_M4_CP3',
        order: 3,
        question: 'Vision narrative',
        questionKo: '비전 이야기',
        type: 'narrative',
        minLength: 300,
        maxLength: 1000
      },
      {
        checkpointId: 'GPS101_S4_M4_CP4',
        order: 4,
        question: 'Impact measurement ideas',
        questionKo: '영향 측정 아이디어',
        type: 'planning',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S4_M4_CP5',
        order: 5,
        question: 'Emotional connection to vision',
        questionKo: '비전에 대한 감정적 연결',
        type: 'reflection',
        minLength: 150,
        maxLength: 500
      }
    ],
    expectedOutcome: 'Vivid vision of purpose in action',
    barakaReward: 150,
    xpReward: 30
  },
  {
    missionId: 'GPS101_S4_M5',
    stageNumber: 4,
    missionNumber: 5,
    title: 'Gap Analysis',
    titleKo: '갭 분석',
    description: 'Analyze gap between current reality and vision',
    objectives: [
      'Assess current state',
      'Identify gaps',
      'Plan bridge strategies'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S4_M5_CP1',
        order: 1,
        question: 'Current state assessment',
        questionKo: '현재 상태 평가',
        type: 'assessment',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S4_M5_CP2',
        order: 2,
        question: 'Gaps identified',
        questionKo: '식별된 갭',
        type: 'analysis',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S4_M5_CP3',
        order: 3,
        question: 'Bridge strategies',
        questionKo: '브릿지 전략',
        type: 'strategy',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S4_M5_CP4',
        order: 4,
        question: 'Resource needs',
        questionKo: '필요 자원',
        type: 'planning',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S4_M5_CP5',
        order: 5,
        question: 'First steps identified',
        questionKo: '첫 단계 식별',
        type: 'action',
        minLength: 150,
        maxLength: 500
      }
    ],
    expectedOutcome: 'Gap analysis with bridge strategies',
    barakaReward: 150,
    xpReward: 30
  },
  {
    missionId: 'GPS101_S4_M6',
    stageNumber: 4,
    missionNumber: 6,
    title: 'Journal Draft 4',
    titleKo: '저널 초안 4',
    description: 'Finalize life purpose statement',
    objectives: [
      'Finalize purpose statement',
      'Articulate clearly',
      'Commit publicly'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S4_M6_CP1',
        order: 1,
        question: 'Final purpose statement',
        questionKo: '최종 목적 진술',
        type: 'statement',
        minLength: 50,
        maxLength: 200
      },
      {
        checkpointId: 'GPS101_S4_M6_CP2',
        order: 2,
        question: 'Clarity and conciseness',
        questionKo: '명확성과 간결성',
        type: 'refinement',
        minLength: 100,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S4_M6_CP3',
        order: 3,
        question: 'Actionability assessment',
        questionKo: '실행 가능성 평가',
        type: 'evaluation',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S4_M6_CP4',
        order: 4,
        question: 'Public declaration preparation',
        questionKo: '공개 선언 준비',
        type: 'preparation',
        minLength: 100,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S4_M6_CP5',
        order: 5,
        question: 'Commitment affirmation',
        questionKo: '헌신 확인',
        type: 'commitment',
        minLength: 100,
        maxLength: 500
      }
    ],
    expectedOutcome: 'Finalized Life Purpose Statement',
    barakaReward: 150,
    xpReward: 30,
    isStageCompleter: true
  }
];

// ==================== STAGE 5 MISSIONS ====================

export const GPS_101_STAGE_5_MISSIONS = [
  {
    missionId: 'GPS101_S5_M1',
    stageNumber: 5,
    missionNumber: 1,
    title: 'Opening Lecture: From Purpose to Project',
    titleKo: '오프닝 강의: 목적에서 프로젝트로',
    description: 'Learn how to translate purpose into concrete project',
    objectives: [
      'Understand project design',
      'Connect purpose to action',
      'Explore project possibilities'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S5_M1_CP1',
        order: 1,
        question: 'Project design understanding',
        questionKo: '프로젝트 디자인 이해',
        type: 'learning',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S5_M1_CP2',
        order: 2,
        question: 'Purpose-project connection',
        questionKo: '목적-프로젝트 연결',
        type: 'reflection',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S5_M1_CP3',
        order: 3,
        question: 'Project possibilities brainstorm',
        questionKo: '프로젝트 가능성 브레인스토밍',
        type: 'brainstorm',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S5_M1_CP4',
        order: 4,
        question: 'Feasibility considerations',
        questionKo: '실현 가능성 고려사항',
        type: 'analysis',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S5_M1_CP5',
        order: 5,
        question: 'Initial project direction',
        questionKo: '초기 프로젝트 방향',
        type: 'planning',
        minLength: 150,
        maxLength: 500
      }
    ],
    expectedOutcome: 'Understanding of purpose-to-project translation',
    barakaReward: 150,
    xpReward: 30
  },
  {
    missionId: 'GPS101_S5_M2',
    stageNumber: 5,
    missionNumber: 2,
    title: 'Brainstorm Project Ideas with Zettelkasten Method',
    titleKo: 'Zettelkasten 방법으로 프로젝트 아이디어 브레인스토밍',
    description: 'Use Zettelkasten method to generate and organize project ideas',
    objectives: [
      'Learn Zettelkasten method',
      'Generate project ideas',
      'Organize and connect ideas'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S5_M2_CP1',
        order: 1,
        question: 'Zettelkasten method applied',
        questionKo: 'Zettelkasten 방법 적용',
        type: 'method',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S5_M2_CP2',
        order: 2,
        question: 'Project ideas generated (10+)',
        questionKo: '생성된 프로젝트 아이디어 (10개 이상)',
        type: 'brainstorm',
        minLength: 300,
        maxLength: 1500
      },
      {
        checkpointId: 'GPS101_S5_M2_CP3',
        order: 3,
        question: 'Ideas organized and connected',
        questionKo: '아이디어 정리 및 연결',
        type: 'organization',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S5_M2_CP4',
        order: 4,
        question: 'Top 3 project ideas',
        questionKo: '상위 3개 프로젝트 아이디어',
        type: 'selection',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S5_M2_CP5',
        order: 5,
        question: 'Selection rationale',
        questionKo: '선택 근거',
        type: 'justification',
        minLength: 150,
        maxLength: 500
      }
    ],
    expectedOutcome: 'Organized project ideas using Zettelkasten',
    barakaReward: 150,
    xpReward: 30
  },
  {
    missionId: 'GPS101_S5_M3',
    stageNumber: 5,
    missionNumber: 3,
    title: 'Draft a Problem–Solution Canvas',
    titleKo: '문제-솔루션 캔버스 초안',
    description: 'Create problem-solution canvas for chosen project',
    objectives: [
      'Define problem clearly',
      'Design solution',
      'Map canvas elements'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S5_M3_CP1',
        order: 1,
        question: 'Problem clearly defined',
        questionKo: '명확하게 정의된 문제',
        type: 'definition',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S5_M3_CP2',
        order: 2,
        question: 'Solution designed',
        questionKo: '디자인된 솔루션',
        type: 'design',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S5_M3_CP3',
        order: 3,
        question: 'Canvas elements mapped',
        questionKo: '캔버스 요소 매핑',
        type: 'mapping',
        minLength: 300,
        maxLength: 1000
      },
      {
        checkpointId: 'GPS101_S5_M3_CP4',
        order: 4,
        question: 'Value proposition',
        questionKo: '가치 제안',
        type: 'proposition',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S5_M3_CP5',
        order: 5,
        question: 'Impact potential',
        questionKo: '영향 잠재력',
        type: 'analysis',
        minLength: 150,
        maxLength: 500
      }
    ],
    expectedOutcome: 'Problem-Solution Canvas completed',
    barakaReward: 150,
    xpReward: 30
  },
  {
    missionId: 'GPS101_S5_M4',
    stageNumber: 5,
    missionNumber: 4,
    title: 'Pitch Your Purpose-driven Project',
    titleKo: '목적 중심 프로젝트 피치',
    description: 'Create and deliver pitch for purpose-driven project',
    objectives: [
      'Create pitch deck',
      'Practice delivery',
      'Receive feedback'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S5_M4_CP1',
        order: 1,
        question: 'Pitch deck created',
        questionKo: '피치 덱 생성',
        type: 'creative',
        requiresUpload: true
      },
      {
        checkpointId: 'GPS101_S5_M4_CP2',
        order: 2,
        question: 'Pitch practiced and refined',
        questionKo: '피치 연습 및 개선',
        type: 'practice',
        minLength: 150,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S5_M4_CP3',
        order: 3,
        question: 'Pitch delivered',
        questionKo: '피치 전달',
        type: 'presentation',
        requiresVideo: true
      },
      {
        checkpointId: 'GPS101_S5_M4_CP4',
        order: 4,
        question: 'Feedback received and analyzed',
        questionKo: '받고 분석한 피드백',
        type: 'analysis',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S5_M4_CP5',
        order: 5,
        question: 'Refinements planned',
        questionKo: '계획된 개선사항',
        type: 'planning',
        minLength: 150,
        maxLength: 500
      }
    ],
    expectedOutcome: 'Polished project pitch with feedback',
    barakaReward: 150,
    xpReward: 30
  },
  {
    missionId: 'GPS101_S5_M5',
    stageNumber: 5,
    missionNumber: 5,
    title: '"End of The Road" Party (optional)',
    titleKo: '"여정의 끝" 파티 (선택사항)',
    description: 'Celebrate GPS 101 journey with community',
    objectives: [
      'Celebrate achievements',
      'Share learnings',
      'Build community bonds'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S5_M5_CP1',
        order: 1,
        question: 'Participation and celebration',
        questionKo: '참여 및 축하',
        type: 'participation',
        minLength: 100,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S5_M5_CP2',
        order: 2,
        question: 'Journey reflection shared',
        questionKo: '공유된 여정 성찰',
        type: 'reflection',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S5_M5_CP3',
        order: 3,
        question: 'Key learnings articulated',
        questionKo: '명시된 주요 학습',
        type: 'synthesis',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S5_M5_CP4',
        order: 4,
        question: 'Gratitude expressed',
        questionKo: '표현된 감사',
        type: 'reflection',
        minLength: 100,
        maxLength: 500
      },
      {
        checkpointId: 'GPS101_S5_M5_CP5',
        order: 5,
        question: 'Community connections made',
        questionKo: '형성된 커뮤니티 연결',
        type: 'community',
        minLength: 100,
        maxLength: 500
      }
    ],
    expectedOutcome: 'GPS 101 journey celebrated with community',
    barakaReward: 150,
    xpReward: 30
  },
  {
    missionId: 'GPS101_S5_M6',
    stageNumber: 5,
    missionNumber: 6,
    title: 'Feedback & Refinement',
    titleKo: '피드백 및 개선',
    description: 'Finalize purpose-driven project with community feedback',
    objectives: [
      'Gather comprehensive feedback',
      'Refine project plan',
      'Finalize deliverable'
    ],
    checkpoints: [
      {
        checkpointId: 'GPS101_S5_M6_CP1',
        order: 1,
        question: 'Comprehensive feedback gathered',
        questionKo: '수집된 포괄적 피드백',
        type: 'feedback',
        minLength: 200,
        maxLength: 1000
      },
      {
        checkpointId: 'GPS101_S5_M6_CP2',
        order: 2,
        question: 'Project plan refined',
        questionKo: '개선된 프로젝트 계획',
        type: 'refinement',
        minLength: 300,
        maxLength: 1500
      },
      {
        checkpointId: 'GPS101_S5_M6_CP3',
        order: 3,
        question: 'Final project documentation',
        questionKo: '최종 프로젝트 문서',
        type: 'documentation',
        minLength: 500,
        maxLength: 2000
      },
      {
        checkpointId: 'GPS101_S5_M6_CP4',
        order: 4,
        question: 'Next steps planned',
        questionKo: '계획된 다음 단계',
        type: 'action',
        minLength: 200,
        maxLength: 800
      },
      {
        checkpointId: 'GPS101_S5_M6_CP5',
        order: 5,
        question: 'GPS 101 completion reflection',
        questionKo: 'GPS 101 완료 성찰',
        type: 'reflection',
        minLength: 300,
        maxLength: 1000
      }
    ],
    expectedOutcome: 'Finalized Purpose-Driven Project ready for execution',
    barakaReward: 150,
    xpReward: 30,
    isStageCompleter: true
  }
];

// ==================== AGGREGATED MISSIONS ====================

export const GPS_101_ALL_MISSIONS = [
  ...GPS_101_STAGE_1_MISSIONS,
  ...GPS_101_STAGE_2_MISSIONS,
  ...GPS_101_STAGE_3_MISSIONS,
  ...GPS_101_STAGE_4_MISSIONS,
  ...GPS_101_STAGE_5_MISSIONS
];

// ==================== VALIDATION CONSTANTS ====================

export const GPS_101_VALIDATION = {
  CHECKPOINT: {
    MIN_CHARACTERS: 100,
    MAX_CHARACTERS: 5000,
    MIN_WORDS: 20,
    PASSING_SCORE: 70
  },
  MISSION: {
    REQUIRED_CHECKPOINTS: 5,
    PASSING_PERCENTAGE: 80
  },
  STAGE: {
    REQUIRED_MISSIONS: 6,
    DELIVERABLE_REQUIRED: true
  }
};

// ==================== BARAKA & XP CONSTANTS ====================

export const GPS_101_REWARDS = {
  CHECKPOINT_PASS: 25,
  MISSION_COMPLETE: 150,
  STAGE_COMPLETE: 1000,
  COURSE_COMPLETE: 5000,
  XP_PER_CHECKPOINT: 5,
  XP_PER_MISSION: 30,
  XP_PER_STAGE: 180
};

// ==================== BADGE CONSTANTS ====================

export const GPS_101_BADGES = {
  STAGE_1: {
    id: 'gps-101-stage-1',
    name: 'Identity Seeker',
    description: 'Completed Stage 1: Who are you?',
    icon: 'gps-101-stage-1.svg'
  },
  STAGE_2: {
    id: 'gps-101-stage-2',
    name: 'Problem Explorer',
    description: 'Completed Stage 2: What is the meaning of your life?',
    icon: 'gps-101-stage-2.svg'
  },
  STAGE_3: {
    id: 'gps-101-stage-3',
    name: 'Story Weaver',
    description: 'Completed Stage 3: Tell a story of problem owners',
    icon: 'gps-101-stage-3.svg'
  },
  STAGE_4: {
    id: 'gps-101-stage-4',
    name: 'Purpose Definer',
    description: 'Completed Stage 4: What is your life purpose?',
    icon: 'gps-101-stage-4.svg'
  },
  STAGE_5: {
    id: 'gps-101-stage-5',
    name: 'Project Builder',
    description: 'Completed Stage 5: What is your Purpose-driven Major?',
    icon: 'gps-101-stage-5.svg'
  },
  COMPLETION: {
    id: 'purpose-pathfinder',
    name: 'Purpose Pathfinder',
    description: 'Completed GPS 101 Basic: Discovered Life Purpose',
    icon: 'purpose-pathfinder.svg'
  },
  ORANGE_BEACON: {
    id: 'orange-beacon',
    name: 'Orange Beacon',
    description: 'Earned 5,000 Baraka in GPS 101',
    icon: 'orange-beacon.svg'
  }
};

// Export everything
export default {
  STAGE_1_MISSIONS: GPS_101_STAGE_1_MISSIONS,
  STAGE_2_MISSIONS: GPS_101_STAGE_2_MISSIONS,
  STAGE_3_MISSIONS: GPS_101_STAGE_3_MISSIONS,
  STAGE_4_MISSIONS: GPS_101_STAGE_4_MISSIONS,
  STAGE_5_MISSIONS: GPS_101_STAGE_5_MISSIONS,
  ALL_MISSIONS: GPS_101_ALL_MISSIONS,
  VALIDATION: GPS_101_VALIDATION,
  REWARDS: GPS_101_REWARDS,
  BADGES: GPS_101_BADGES
};