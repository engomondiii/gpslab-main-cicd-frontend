/**
 * GPS 101 Basic - Constants
 * 
 * CORRECT STRUCTURE:
 * - 5 Missions (1 per stage)
 * - 6 Sub-missions per Mission (30 total)
 * - 5 Checkpoints per Sub-mission (150 total)
 * 
 * All content extracted from official GPS 101 curriculum spreadsheet
 */

import { GPS_101_CONFIG } from '../../config/gps101.config';

// ==================== MISSION STATUS ====================
export const MISSION_STATUS = {
  LOCKED: 'locked',
  UNLOCKED: 'unlocked',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

// ==================== CHECKPOINT STATUS ====================
export const CHECKPOINT_STATUS = {
  LOCKED: 'locked',
  UNLOCKED: 'unlocked',
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  PASSED: 'passed',
  FAILED: 'failed'
};

// ==================== STAGE 1: WHO ARE YOU? ====================
/**
 * Mission 1: Identity Discovery
 * Duration: 3 weeks
 * Expected Outcome: "I am an agent sent by God"
 * Deliverable: Identity Statement
 */
export const GPS101_MISSION_1 = {
  missionId: 'GPS101_M1',
  stageNumber: 1,
  stageName: 'Who are you?',
  stageNameKo: '당신은 누구입니까?',
  
  missionNumber: 1,
  missionTitle: 'Identity Discovery',
  missionTitleKo: '정체성 발견',
  
  description: 'Students explore their identity by reflecting on their past, failures, values, and future aspirations through timeline creation, failure reflection, and future self interview.',
  descriptionKo: '학생들은 타임라인 작성, 실패 성찰, 미래 자아 인터뷰를 통해 과거, 실패, 가치, 미래의 포부를 성찰하며 자신의 정체성을 탐구합니다.',
  
  expectedOutcome: 'I am an agent sent by God',
  expectedOutcomeKo: '나는 하나님이 보내신 대리인입니다',
  
  deliverable: 'Identity Statement',
  deliverableKo: '정체성 선언문',
  
  duration: '3 weeks',
  courseCode: 'GPS_101_BASIC',
  
  // 6 SUB-MISSIONS
  subMissions: [
    {
      subMissionId: 'GPS101_M1_SM1',
      subMissionNumber: 1,
      title: 'Orientation / Stage 1 Opening Lecture (Who Am I)',
      titleKo: '오리엔테이션 / 스테이지 1 오프닝 강의 (나는 누구인가)',
      
      objectives: [
        'Attended Orientation Lecture',
        'Understood the GPS 101 purpose',
        'Completed self-reflection pre-survey',
        'Joined learning community space',
        'Set 1–2 personal goals for this stage'
      ],
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M1_SM1_CP1',
          order: 1,
          question: 'Attended Orientation Lecture',
          questionKo: '오리엔테이션 강의에 참석했습니다',
          type: 'attendance',
          expectedAnswer: 'Familiarity with GPS learning goals',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M1_SM1_CP2',
          order: 2,
          question: 'Understood the GPS 101 purpose',
          questionKo: 'GPS 101의 목적을 이해했습니다',
          type: 'reflection',
          expectedAnswer: 'Awareness of personal starting point',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M1_SM1_CP3',
          order: 3,
          question: 'Completed self-reflection pre-survey',
          questionKo: '자기 성찰 사전 설문조사를 완료했습니다',
          type: 'survey',
          expectedAnswer: 'Motivation anchored in self-interest',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M1_SM1_CP4',
          order: 4,
          question: 'Joined learning community space',
          questionKo: '학습 커뮤니티 공간에 참여했습니다',
          type: 'action',
          expectedAnswer: 'Initial connection to community',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M1_SM1_CP5',
          order: 5,
          question: 'Set 1–2 personal goals for this stage',
          questionKo: '이 단계를 위한 1-2개의 개인 목표를 설정했습니다',
          type: 'goal_setting',
          expectedAnswer: 'Clear intention to discover identity',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    },
    {
      subMissionId: 'GPS101_M1_SM2',
      subMissionNumber: 2,
      title: 'Summarize the five stages of GPS 101',
      titleKo: 'GPS 101의 5단계 요약하기',
      
      objectives: [
        'Clearly organize the goals and content of Stage 1–5'
      ],
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M1_SM2_CP1',
          order: 1,
          question: 'Summarize the five stages of GPS 101',
          questionKo: 'GPS 101의 5단계를 요약하세요',
          type: 'short_answer',
          expectedAnswer: 'Clearly organize the goals and content of Stage 1–5',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M1_SM2_CP2',
          order: 2,
          question: 'Identify GPS 101 evaluation criteria and plan a high-score strategy',
          questionKo: 'GPS 101 평가 기준을 확인하고 고득점 전략을 계획하세요',
          type: 'short_answer',
          expectedAnswer: 'Outline evaluation elements, weight percentages, and strategies for high performance',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M1_SM2_CP3',
          order: 3,
          question: 'Complete the MLQ test to measure meaning in life',
          questionKo: '삶의 의미를 측정하기 위해 MLQ 테스트를 완료하세요',
          type: 'survey',
          expectedAnswer: 'Record MLQ score and write an analysis of 100+ words',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M1_SM2_CP4',
          order: 4,
          question: 'Write a pre-journey self-reflection survey',
          questionKo: '여정 전 자기 성찰 설문조사를 작성하세요',
          type: 'long_answer',
          expectedAnswer: 'State personal goals and motivations for GPS 101 in 100+ words',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M1_SM2_CP5',
          order: 5,
          question: 'Complete all orientation activities',
          questionKo: '모든 오리엔테이션 활동을 완료하세요',
          type: 'completion',
          expectedAnswer: 'Successful completion of orientation phase',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    },
    {
      subMissionId: 'GPS101_M1_SM3',
      subMissionNumber: 3,
      title: 'Your Timeline of 10 Defining Moments & Reflection on Failure',
      titleKo: '인생의 10가지 결정적 순간 타임라인 & 실패에 대한 성찰',
      
      objectives: [
        'List 10 important events including at least two experiences of failure',
        'Visualize the 10 experiences',
        'Reflect on emotions and lessons from each event',
        'Reinterpret failure experiences as turning points for growth',
        'Share outcomes with team members'
      ],
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M1_SM3_CP1',
          order: 1,
          question: 'List 10 important events (experiences) in your life. Include at least two experiences of failure.',
          questionKo: '인생에서 중요한 10가지 사건(경험)을 나열하세요. 최소 2개의 실패 경험을 포함하세요.',
          type: 'list',
          expectedAnswer: 'Recognize life events comprehensively and include 2 failure experiences',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M1_SM3_CP2',
          order: 2,
          question: 'Visualize the 10 listed experiences.',
          questionKo: '나열한 10가지 경험을 시각화하세요.',
          type: 'visual',
          expectedAnswer: 'Create a Life Timeline using Canva, capture it, and insert as a cell image',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M1_SM3_CP3',
          order: 3,
          question: 'Reflect on emotions and lessons from each event in writing.',
          questionKo: '각 사건에서의 감정과 교훈을 글로 성찰하세요.',
          type: 'long_answer',
          expectedAnswer: 'Honestly express feelings, reflections, and lessons learned from each experience',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M1_SM3_CP4',
          order: 4,
          question: 'Reinterpret failure experiences as turning points for growth.',
          questionKo: '실패 경험을 성장의 전환점으로 재해석하세요.',
          type: 'reflection',
          expectedAnswer: 'Honestly express feelings, reflections, and lessons learned from each experience',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M1_SM3_CP5',
          order: 5,
          question: 'Share the outcomes of your activity with your team members.',
          questionKo: '활동 결과를 팀원들과 공유하세요.',
          type: 'sharing',
          expectedAnswer: 'Share Life Timeline and failure experiences, summarizing how God trained each teammate',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    },
    {
      subMissionId: 'GPS101_M1_SM4',
      subMissionNumber: 4,
      title: 'Interview with Future Self (via GPT)',
      titleKo: '미래의 자신과의 인터뷰 (GPT 사용)',
      
      objectives: [
        'Define the time, place, and context for interviewing your future self',
        'Conduct Phase 1 and 2 of the interview',
        'Conduct Phase 3 and 4 of the interview',
        'Record at least three key insights',
        'Share the most impressive aspect discovered'
      ],
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M1_SM4_CP1',
          order: 1,
          question: 'Define the time, place, and context for interviewing your future self using ChatGPT',
          questionKo: 'ChatGPT를 사용하여 미래의 자신을 인터뷰할 시간, 장소, 맥락을 정의하세요',
          type: 'short_answer',
          expectedAnswer: 'A vivid scenario description of your future self interview setting',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M1_SM4_CP2',
          order: 2,
          question: 'Conduct Phase 1 and 2 of the interview with AI and briefly record the results.',
          questionKo: 'AI와 인터뷰의 1, 2단계를 진행하고 결과를 간략히 기록하세요.',
          type: 'interview',
          expectedAnswer: 'A concise summary of your Phase 1 and 2 interview findings',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M1_SM4_CP3',
          order: 3,
          question: 'Conduct Phase 3 and 4 of the interview with AI and briefly record the results.',
          questionKo: 'AI와 인터뷰의 3, 4단계를 진행하고 결과를 간략히 기록하세요.',
          type: 'interview',
          expectedAnswer: 'A concise summary of your Phase 3 and 4 interview findings',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M1_SM4_CP4',
          order: 4,
          question: 'Record at least three key insights gained from the interview',
          questionKo: '인터뷰에서 얻은 최소 3가지 핵심 통찰을 기록하세요',
          type: 'reflection',
          expectedAnswer: 'Organized presentation of 3 important insights from report and interview',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M1_SM4_CP5',
          order: 5,
          question: 'Share the most impressive aspect of yourself discovered through the interview with your peers.',
          questionKo: '인터뷰를 통해 발견한 자신의 가장 인상적인 측면을 동료들과 공유하세요.',
          type: 'sharing',
          expectedAnswer: 'Write your reflections and insights gained from the process of sharing with your peers',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    },
    {
      subMissionId: 'GPS101_M1_SM5',
      subMissionNumber: 5,
      title: 'Identity Manifesto Draft',
      titleKo: '정체성 선언문 초안',
      
      objectives: [
        'Summarize the identity discovered through Stage 1',
        'My Identity Found in the Bible – One and Only',
        'My Identity Found in the Bible – Agent Sent by God',
        'Read Contemporary Poem and revise identity',
        'Write Identity Statement'
      ],
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M1_SM5_CP1',
          order: 1,
          question: 'Summarize the identity you discovered through Stage 1.',
          questionKo: '스테이지 1을 통해 발견한 정체성을 요약하세요.',
          type: 'long_answer',
          expectedAnswer: 'Describe your identity discovered through Stage 1 activities (at least 300 characters including spaces)',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M1_SM5_CP2',
          order: 2,
          question: 'My Identity Found in the Bible – One and Only: Psalm 139:13–14, John 15:16, Ephesians 1:4, Jeremiah 1:5',
          questionKo: '성경에서 찾은 나의 정체성 – 유일무이한 존재: 시편 139:13-14, 요한복음 15:16, 에베소서 1:4, 예레미야 1:5',
          type: 'biblical_reflection',
          expectedAnswer: 'Describe the truths found in the verses (at least 300 characters)',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M1_SM5_CP3',
          order: 3,
          question: 'My Identity Found in the Bible – Agent Sent by God: 2 Corinthians 5:19–20, Ephesians 2:10, Philippians 2:13, Romans 12:4–6',
          questionKo: '성경에서 찾은 나의 정체성 – 하나님이 보내신 대리인: 고린도후서 5:19-20, 에베소서 2:10, 빌립보서 2:13, 로마서 12:4-6',
          type: 'biblical_reflection',
          expectedAnswer: 'Describe the truths found in the verses (at least 300 characters)',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M1_SM5_CP4',
          order: 4,
          question: 'Read "A Contemporary Poem (Inspired by Isaiah 43)" together and revise the identity you discovered through Stage 1.',
          questionKo: '"현대 시 (이사야 43에서 영감을 받음)"을 함께 읽고 스테이지 1을 통해 발견한 정체성을 수정하세요.',
          type: 'reflection',
          expectedAnswer: 'Describe how your identity has changed and summarize your final understanding (at least 300 characters)',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M1_SM5_CP5',
          order: 5,
          question: 'Based on the identity you have discovered so far, write your Identity Statement.',
          questionKo: '지금까지 발견한 정체성을 바탕으로 정체성 선언문을 작성하세요.',
          type: 'statement',
          expectedAnswer: 'Write your personal identity statement based on the identity discovered in Stage 1',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    },
    {
      subMissionId: 'GPS101_M1_SM6',
      subMissionNumber: 6,
      title: 'Speech Practice 1:1: "Who am I?"',
      titleKo: '1:1 스피치 연습: "나는 누구인가?"',
      
      objectives: [
        'Write About Myself section for GPS Journal',
        'Write Life Events and Lessons Learned section',
        'Write Dialogue with My Future Self section',
        'Decoding Game - Decode encrypted message',
        'Declare identity discovered through Stage 1'
      ],
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M1_SM6_CP1',
          order: 1,
          question: 'Write the <About Myself> section for your GPS Journal.',
          questionKo: 'GPS 저널의 <나에 대하여> 섹션을 작성하세요.',
          type: 'journal',
          expectedAnswer: 'Write the About Myself section (at least 1,000 characters including spaces)',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M1_SM6_CP2',
          order: 2,
          question: 'Write the <Life Events and Lessons Learned> section for your GPS Journal.',
          questionKo: 'GPS 저널의 <인생 사건과 배운 교훈> 섹션을 작성하세요.',
          type: 'journal',
          expectedAnswer: 'Write the Life Events and Lessons Learned section (at least 1,400 characters including spaces)',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M1_SM6_CP3',
          order: 3,
          question: 'Write the <Dialogue with My Future Self> section for your GPS Journal.',
          questionKo: 'GPS 저널의 <미래의 나와의 대화> 섹션을 작성하세요.',
          type: 'journal',
          expectedAnswer: 'Write the Dialogue with My Future Self section (at least 1,000 characters including spaces)',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M1_SM6_CP4',
          order: 4,
          question: 'Decoding Game - Decode the encrypted message to confirm your final command as a GPS Trainee agent.',
          questionKo: '암호 해독 게임 - 암호화된 메시지를 해독하여 GPS 훈련생 에이전트로서의 최종 명령을 확인하세요.',
          type: 'game',
          expectedAnswer: 'Use the given prompt to obtain the cipher key and decode the encrypted message',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M1_SM6_CP5',
          order: 5,
          question: 'Declare your identity discovered through Stage 1.',
          questionKo: '스테이지 1을 통해 발견한 정체성을 선언하세요.',
          type: 'ceremony',
          expectedAnswer: 'Participate in the Identity Declaration Ceremony',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    }
  ]
};

// ==================== STAGE 2: WHAT IS THE MEANING OF YOUR LIFE? ====================
/**
 * Mission 2: Problem Discovery
 * Duration: 3 weeks
 * Expected Outcome: "My Life Problem Candidate"
 * Deliverable: Problem Candidate
 */
export const GPS101_MISSION_2 = {
  missionId: 'GPS101_M2',
  stageNumber: 2,
  stageName: 'What is the meaning of your life?',
  stageNameKo: '당신의 삶의 의미는 무엇입니까?',
  
  missionNumber: 2,
  missionTitle: 'Problem Discovery',
  missionTitleKo: '문제 발견',
  
  description: 'Students begin identifying meaningful problems they feel called to solve by analyzing global challenges and emotional resonance.',
  descriptionKo: '학생들은 세계적 도전과 감정적 공명을 분석하여 해결하도록 부름받았다고 느끼는 의미 있는 문제를 식별하기 시작합니다.',
  
  expectedOutcome: 'My Life Problem Candidate',
  expectedOutcomeKo: '나의 인생 문제 후보',
  
  deliverable: 'Problem Candidate',
  deliverableKo: '문제 후보',
  
  duration: '3 weeks',
  courseCode: 'GPS_101_BASIC',
  
  subMissions: [
    {
      subMissionId: 'GPS101_M2_SM1',
      subMissionNumber: 1,
      title: 'Opening Lecture: Meaning of Life & Problemology',
      titleKo: '오프닝 강의: 삶의 의미와 문제학',
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M2_SM1_CP1',
          order: 1,
          question: 'Watch "The Untold Truth About Money" and answer comprehension questions',
          questionKo: '"돈에 대한 숨겨진 진실"을 시청하고 이해도 질문에 답하세요',
          type: 'video',
          expectedAnswer: 'Understanding of alternative financial principles',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M2_SM1_CP2',
          order: 2,
          question: 'Summarize the "Meaning of Life" lecture',
          questionKo: '"삶의 의미" 강의를 요약하세요',
          type: 'short_answer',
          expectedAnswer: 'Comprehension of the lecture\'s core concepts',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M2_SM1_CP3',
          order: 3,
          question: 'Identify the relationship between life meaning and global issues',
          questionKo: '삶의 의미와 세계적 문제 사이의 관계를 확인하세요',
          type: 'reflection',
          expectedAnswer: 'Insight into the interplay between personal purpose and systemic challenge',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M2_SM1_CP4',
          order: 4,
          question: 'Define the "GPS Way" in one\'s own terms',
          questionKo: '"GPS 방식"을 자신만의 용어로 정의하세요',
          type: 'short_answer',
          expectedAnswer: 'Internalization of the course\'s core methodology',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M2_SM1_CP5',
          order: 5,
          question: 'Write a personal reflection on the "Meaning of Life" lecture',
          questionKo: '"삶의 의미" 강의에 대한 개인적인 성찰을 작성하세요',
          type: 'reflection',
          expectedAnswer: 'Personal connection to course material and clear intention for the next stage',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    },
    {
      subMissionId: 'GPS101_M2_SM2',
      subMissionNumber: 2,
      title: 'Global Problems Tournament',
      titleKo: '세계 문제 토너먼트',
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M2_SM2_CP1',
          order: 1,
          question: 'Research an assigned global problem using the encyclopedia',
          questionKo: '백과사전을 사용하여 할당된 세계 문제를 조사하세요',
          type: 'research',
          expectedAnswer: 'Structured understanding of a problem\'s core dimensions',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M2_SM2_CP2',
          order: 2,
          question: 'Prepare a 2-minute persuasive pitch about the problem',
          questionKo: '문제에 대한 2분 설득력 있는 피치를 준비하세요',
          type: 'presentation',
          expectedAnswer: 'A compelling narrative for why the problem matters',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M2_SM2_CP3',
          order: 3,
          question: 'Create visual aids to support the presentation',
          questionKo: '발표를 지원하는 시각 자료를 만드세요',
          type: 'visual',
          expectedAnswer: 'Visual materials that enhance the presentation\'s message',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M2_SM2_CP4',
          order: 4,
          question: 'Provide constructive feedback on peers\' presentations',
          questionKo: '동료의 발표에 건설적인 피드백을 제공하세요',
          type: 'peer_feedback',
          expectedAnswer: 'Active engagement with and acknowledgment of peers\' work',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M2_SM2_CP5',
          order: 5,
          question: 'Reflect on the most impactful problems from the tournament',
          questionKo: '토너먼트에서 가장 영향력 있는 문제에 대해 성찰하세요',
          type: 'reflection',
          expectedAnswer: 'Broadened perspective and personal connection to new global issues',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    },
    {
      subMissionId: 'GPS101_M2_SM3',
      subMissionNumber: 3,
      title: 'Bridging Problems Game',
      titleKo: '문제 연결 게임',
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M2_SM3_CP1',
          order: 1,
          question: 'Understand the game through Round 1 as a practice round',
          questionKo: '1라운드를 연습 라운드로 게임을 이해하세요',
          type: 'game',
          expectedAnswer: 'A visualized pathway demonstrating systemic connections',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M2_SM3_CP2',
          order: 2,
          question: 'Initiate and play Round 2 of the game',
          questionKo: '게임의 2라운드를 시작하고 플레이하세요',
          type: 'game',
          expectedAnswer: 'A visualized pathway demonstrating systemic connections',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M2_SM3_CP3',
          order: 3,
          question: 'Initiate and play Round 3 of the game',
          questionKo: '게임의 3라운드를 시작하고 플레이하세요',
          type: 'game',
          expectedAnswer: 'A visualized pathway demonstrating systemic connections',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M2_SM3_CP4',
          order: 4,
          question: 'Review your Bridging Problems Game activity! What was your team\'s unique strategy?',
          questionKo: '문제 연결 게임 활동을 검토하세요! 팀의 독특한 전략은 무엇이었나요?',
          type: 'reflection',
          expectedAnswer: 'Describe your team\'s plan and strategy, collaboration method, and key factors',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M2_SM3_CP5',
          order: 5,
          question: 'Write down what you learned from the Bridging Problems Game',
          questionKo: '문제 연결 게임에서 배운 것을 적으세요',
          type: 'reflection',
          expectedAnswer: 'Identify the most memorable problem and write personal reflection including the reason',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    },
    {
      subMissionId: 'GPS101_M2_SM4',
      subMissionNumber: 4,
      title: 'Inner Reflection and Dialogue',
      titleKo: '내면 성찰과 대화',
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M2_SM4_CP1',
          order: 1,
          question: 'List the problems that triggered your Anger, Empathy, or Burden',
          questionKo: '당신의 분노, 공감, 또는 부담을 유발한 문제들을 나열하세요',
          type: 'list',
          expectedAnswer: 'Write the titles and short descriptions of at least 15 problems',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M2_SM4_CP2',
          order: 2,
          question: 'Explore and add at least 20 more problems that evoke your emotions',
          questionKo: '감정을 불러일으키는 최소 20개의 추가 문제를 탐색하고 추가하세요',
          type: 'research',
          expectedAnswer: 'List at least 20 additional problems (5 Anger, 5 Empathy, 5 Burden, 5 others)',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M2_SM4_CP3',
          order: 3,
          question: 'Review all problems and record thoughts using "stream of consciousness" method',
          questionKo: '모든 문제를 검토하고 "의식의 흐름" 방법을 사용하여 생각을 기록하세요',
          type: 'reflection',
          expectedAnswer: 'Write a spontaneous 3-minute journal showing your thoughts',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M2_SM4_CP4',
          order: 4,
          question: 'Select problems through the "Problem Ideal Type World Cup"',
          questionKo: '"문제 이상형 월드컵"을 통해 문제를 선택하세요',
          type: 'game',
          expectedAnswer: 'List your top 20 results and write a reflection on the outcome',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M2_SM4_CP5',
          order: 5,
          question: 'Choose 5–20 problems that currently move your heart the most',
          questionKo: '현재 당신의 마음을 가장 움직이는 5-20개의 문제를 선택하세요',
          type: 'selection',
          expectedAnswer: 'Select problems that evoke strongest Empathy, Anger, or Burden and analyze reasons',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    },
    {
      subMissionId: 'GPS101_M2_SM5',
      subMissionNumber: 5,
      title: 'Mind Mapping (Simplified)',
      titleKo: '마인드 맵핑 (간소화)',
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M2_SM5_CP1',
          order: 1,
          question: 'Choose one problem and define it in one sentence',
          questionKo: '하나의 문제를 선택하고 한 문장으로 정의하세요',
          type: 'short_answer',
          expectedAnswer: 'Clearly and specifically define the selected problem in one sentence',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M2_SM5_CP2',
          order: 2,
          question: 'Analyze the causes of the problem up to the third level',
          questionKo: '문제의 원인을 3단계까지 분석하세요',
          type: 'analysis',
          expectedAnswer: 'Identify 2 primary causes, 4 secondary causes, and 8 tertiary causes',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M2_SM5_CP3',
          order: 3,
          question: 'Derive three root causes of the problem',
          questionKo: '문제의 3가지 근본 원인을 도출하세요',
          type: 'analysis',
          expectedAnswer: 'Highlight critical tertiary causes and identify three key root causes',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M2_SM5_CP4',
          order: 4,
          question: 'Analyze the symptoms of the problem up to the third level',
          questionKo: '문제의 증상을 3단계까지 분석하세요',
          type: 'analysis',
          expectedAnswer: 'Identify 2 primary symptoms, 4 secondary symptoms, and 8 tertiary symptoms',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M2_SM5_CP5',
          order: 5,
          question: 'Derive two final symptoms of the problem',
          questionKo: '문제의 최종 2가지 증상을 도출하세요',
          type: 'analysis',
          expectedAnswer: 'Highlight critical tertiary symptoms and identify two final symptoms',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    },
    {
      subMissionId: 'GPS101_M2_SM6',
      subMissionNumber: 6,
      title: 'Report Draft 2',
      titleKo: '보고서 초안 2',
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M2_SM6_CP1',
          order: 1,
          question: 'Explain the causal relationships among the problems discovered',
          questionKo: '발견된 문제들 사이의 인과 관계를 설명하세요',
          type: 'long_answer',
          expectedAnswer: 'Logically explain how specific problems are connected and influence one another',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M2_SM6_CP2',
          order: 2,
          question: 'Describe how you discovered your empathy triggers in story form',
          questionKo: '공감 트리거를 발견한 방법을 이야기 형식으로 설명하세요',
          type: 'narrative',
          expectedAnswer: 'Write how personal values and emotional motivations connected to specific global issues',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M2_SM6_CP3',
          order: 3,
          question: 'Summarize the Root Causes and Core Symptoms in report format',
          questionKo: '근본 원인과 핵심 증상을 보고서 형식으로 요약하세요',
          type: 'report',
          expectedAnswer: 'Systematically and clearly describe the key causes and symptoms',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M2_SM6_CP4',
          order: 4,
          question: 'Reflect on how your perspective on global issues has changed',
          questionKo: '세계 문제에 대한 당신의 관점이 어떻게 변했는지 성찰하세요',
          type: 'reflection',
          expectedAnswer: 'Compare thoughts before and after Stage 2 and describe deepened understanding',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M2_SM6_CP5',
          order: 5,
          question: 'Finalize your Global Problem Candidates',
          questionKo: '세계 문제 후보를 최종 결정하세요',
          type: 'selection',
          expectedAnswer: 'Select at least 5 and up to 20 problems that evoke Empathy, Anger, or Burden',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    }
  ]
};

// ==================== STAGE 3: WHOSE PAIN ARE YOU CALLED TO SOLVE? ====================
/**
 * Mission 3: Problem Ownership
 * Duration: 3 weeks
 * Expected Outcome: "Story Telling"
 * Deliverable: Problem Owner Story
 */
export const GPS101_MISSION_3 = {
  missionId: 'GPS101_M3',
  stageNumber: 3,
  stageName: 'Whose pain are you called to solve?',
  stageNameKo: '누구의 고통을 해결하도록 부름받았습니까?',
  
  missionNumber: 3,
  missionTitle: 'Problem Ownership',
  missionTitleKo: '문제 소유권',
  
  description: 'This mission centers on Problem Ownership. Students humanize their selected problem by engaging with real or simulated stories of suffering, building deep empathy and moral responsibility.',
  descriptionKo: '이 미션은 문제 소유권에 중점을 둡니다. 학생들은 고통의 실제 또는 시뮬레이션된 이야기에 참여하여 선택한 문제를 인간화하고, 깊은 공감과 도덕적 책임을 구축합니다.',
  
  expectedOutcome: 'Story Telling',
  expectedOutcomeKo: '스토리텔링',
  
  deliverable: 'Problem Owner Story',
  deliverableKo: '문제 소유자 이야기',
  
  duration: '3 weeks',
  courseCode: 'GPS_101_BASIC',
  
  subMissions: [
    {
      subMissionId: 'GPS101_M3_SM1',
      subMissionNumber: 1,
      title: 'Opening Lecture: Problem Ownership and Empathy',
      titleKo: '오프닝 강의: 문제 소유권과 공감',
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M3_SM1_CP1',
          order: 1,
          question: 'Watch lecture on the concept of "Problem Owner"',
          questionKo: '"문제 소유자" 개념에 대한 강의를 시청하세요',
          type: 'video',
          expectedAnswer: 'Clarity on who the "Problem Owner" is',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M3_SM1_CP2',
          order: 2,
          question: 'Understand the role of empathy in purpose-driven life',
          questionKo: '목적 중심 삶에서 공감의 역할을 이해하세요',
          type: 'reflection',
          expectedAnswer: 'Emotional connection to a real group/person',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M3_SM1_CP3',
          order: 3,
          question: 'Review biblical or moral narratives of helping the oppressed',
          questionKo: '억압받는 자를 돕는 성경적 또는 도덕적 이야기를 검토하세요',
          type: 'reading',
          expectedAnswer: 'Empathetic lens toward your problem',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M3_SM1_CP4',
          order: 4,
          question: 'Write a short response on who the marginalized are in your problem',
          questionKo: '당신의 문제에서 소외된 사람이 누구인지 짧은 답변을 작성하세요',
          type: 'short_answer',
          expectedAnswer: 'Identification of underserved/marginalized population',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M3_SM1_CP5',
          order: 5,
          question: 'Submit reflection on what breaks your heart',
          questionKo: '당신의 마음을 아프게 하는 것에 대한 성찰을 제출하세요',
          type: 'reflection',
          expectedAnswer: 'Desire to solve the problem because of love',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    },
    {
      subMissionId: 'GPS101_M3_SM2',
      subMissionNumber: 2,
      title: 'Watch a documentary of a Problem Owner',
      titleKo: '문제 소유자의 다큐멘터리 시청',
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M3_SM2_CP1',
          order: 1,
          question: 'Watch the documentary and understand its content',
          questionKo: '다큐멘터리를 시청하고 내용을 이해하세요',
          type: 'video',
          expectedAnswer: 'Write a summary of the documentary (300+ words)',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M3_SM2_CP2',
          order: 2,
          question: 'Define the "Problem Owner" and the "Problem"',
          questionKo: '"문제 소유자"와 "문제"를 정의하세요',
          type: 'definition',
          expectedAnswer: 'A clear definition of who the Problem Owner is and the core problem they are facing',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M3_SM2_CP3',
          order: 3,
          question: 'Identify the moment that moved you',
          questionKo: '당신을 감동시킨 순간을 확인하세요',
          type: 'reflection',
          expectedAnswer: 'Describe a specific scene or quote that made you feel anger, empathy, or a sense of burden',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M3_SM2_CP4',
          order: 4,
          question: 'Share the most memorable scene or quote with your group',
          questionKo: '가장 기억에 남는 장면이나 인용문을 그룹과 공유하세요',
          type: 'sharing',
          expectedAnswer: 'Document the key points from your group\'s discussion',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M3_SM2_CP5',
          order: 5,
          question: 'Ask yourself, "What if it were me?"',
          questionKo: '"만약 그것이 나였다면?"이라고 자문하세요',
          type: 'reflection',
          expectedAnswer: 'Write a short scenario describing the role you would play',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    },
    {
      subMissionId: 'GPS101_M3_SM3',
      subMissionNumber: 3,
      title: 'Investigate More Of The Problem Owner',
      titleKo: '문제 소유자에 대한 더 많은 조사',
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M3_SM3_CP1',
          order: 1,
          question: 'Collect three real-life experiences of people in similar situations',
          questionKo: '유사한 상황에 있는 사람들의 실제 경험 3가지를 수집하세요',
          type: 'research',
          expectedAnswer: 'Compilation of real voices and faces',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M3_SM3_CP2',
          order: 2,
          question: 'Identify recurring pains or injustices that appear in the collected stories',
          questionKo: '수집한 이야기에 나타나는 반복되는 고통이나 불의를 확인하세요',
          type: 'analysis',
          expectedAnswer: 'Common threads in pain or injustice',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M3_SM3_CP3',
          order: 3,
          question: 'Create a Pain Map—visualize the problem owner\'s pain by dividing it into emotional, social, economic, and cultural dimensions',
          questionKo: '고통 지도 만들기—문제 소유자의 고통을 감정적, 사회적, 경제적, 문화적 차원으로 나누어 시각화하세요',
          type: 'visual',
          expectedAnswer: 'Awareness of problem scope and diversity',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M3_SM3_CP4',
          order: 4,
          question: 'Select one voice (case) that best represents the whole story and explain why',
          questionKo: '전체 이야기를 가장 잘 대표하는 하나의 목소리(사례)를 선택하고 그 이유를 설명하세요',
          type: 'selection',
          expectedAnswer: 'One anchor voice to build your story around',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M3_SM3_CP5',
          order: 5,
          question: 'Describe the moral responsibility, empathy, and humility you felt through this process',
          questionKo: '이 과정을 통해 느낀 도덕적 책임, 공감, 겸손을 설명하세요',
          type: 'reflection',
          expectedAnswer: 'Emotional and spiritual humility before the problem',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    },
    {
      subMissionId: 'GPS101_M3_SM4',
      subMissionNumber: 4,
      title: 'Analyze the Systemic Injustice in the Story',
      titleKo: '이야기 속 체계적 불의 분석',
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M3_SM4_CP1',
          order: 1,
          question: 'Ask ChatGPT to help identify root causes in the Problem Owner\'s suffering',
          questionKo: 'ChatGPT에게 문제 소유자의 고통에서 근본 원인을 식별하도록 도움을 요청하세요',
          type: 'ai_interaction',
          expectedAnswer: 'Identify at least two root causes',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M3_SM4_CP2',
          order: 2,
          question: 'Map the chain of systemic or cultural injustices behind their pain',
          questionKo: '그들의 고통 뒤에 있는 체계적 또는 문화적 불의의 사슬을 매핑하세요',
          type: 'visual',
          expectedAnswer: 'Visualize the findings in a diagram',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M3_SM4_CP3',
          order: 3,
          question: 'Investigate who benefits from the current inequality/injustice',
          questionKo: '현재의 불평등/불의로 인해 누가 이익을 얻는지 조사하세요',
          type: 'analysis',
          expectedAnswer: 'Specify at least two beneficiary groups',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M3_SM4_CP4',
          order: 4,
          question: 'Reflect on how this affects your moral obligation to act',
          questionKo: '이것이 행동해야 할 도덕적 의무에 어떤 영향을 미치는지 성찰하세요',
          type: 'reflection',
          expectedAnswer: 'Write answers of at least 150 characters each',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M3_SM4_CP5',
          order: 5,
          question: 'Write a paragraph on the injustice you can\'t ignore',
          questionKo: '무시할 수 없는 불의에 대한 단락을 작성하세요',
          type: 'long_answer',
          expectedAnswer: 'Select the one injustice that moves you most deeply and analyze it (at least 500 characters)',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    },
    {
      subMissionId: 'GPS101_M3_SM5',
      subMissionNumber: 5,
      title: 'Create a Mock Fundraiser for the Problem Owner',
      titleKo: '문제 소유자를 위한 모의 모금 행사 만들기',
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M3_SM5_CP1',
          order: 1,
          question: 'Set a campaign theme and write a storytelling message',
          questionKo: '캠페인 테마를 설정하고 스토리텔링 메시지를 작성하세요',
          type: 'creative',
          expectedAnswer: 'Summarize the problem owner\'s story in 150–200 characters',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M3_SM5_CP2',
          order: 2,
          question: 'Create a catchy slogan (promotional phrase) for the campaign',
          questionKo: '캠페인을 위한 매력적인 슬로건(홍보 문구)을 만드세요',
          type: 'creative',
          expectedAnswer: 'Develop a creative catchphrase that grabs people\'s attention',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M3_SM5_CP3',
          order: 3,
          question: 'Set a fundraising goal and create a plan for how the donations will be used',
          questionKo: '모금 목표를 설정하고 기부금 사용 계획을 만드세요',
          type: 'planning',
          expectedAnswer: 'Present at least three areas of use with specific allocation',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M3_SM5_CP4',
          order: 4,
          question: 'Design promotional strategies for the campaign',
          questionKo: '캠페인을 위한 홍보 전략을 설계하세요',
          type: 'strategy',
          expectedAnswer: 'Present at least one online and one offline promotional idea',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M3_SM5_CP5',
          order: 5,
          question: 'Create a campaign website by integrating the above content',
          questionKo: '위의 내용을 통합하여 캠페인 웹사이트를 만드세요',
          type: 'project',
          expectedAnswer: 'Ensure readability, ability to evoke empathy, and accurate information delivery',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    },
    {
      subMissionId: 'GPS101_M3_SM6',
      subMissionNumber: 6,
      title: 'Fundraising Tournament + Journal Draft 3',
      titleKo: '모금 토너먼트 + 저널 초안 3',
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M3_SM6_CP1',
          order: 1,
          question: 'Present your fundraising website within your small group',
          questionKo: '소그룹 내에서 모금 웹사이트를 발표하세요',
          type: 'presentation',
          expectedAnswer: 'Deliver effectively within 3 minutes per person',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M3_SM6_CP2',
          order: 2,
          question: 'Provide comments/feedback on each other\'s presentations and select a team representative',
          questionKo: '서로의 발표에 대한 의견/피드백을 제공하고 팀 대표를 선택하세요',
          type: 'peer_feedback',
          expectedAnswer: 'Participate in voting and write at least three comments',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M3_SM6_CP3',
          order: 3,
          question: 'Take part in the full-group presentations and leave comments on others\' fundraising websites',
          questionKo: '전체 그룹 발표에 참여하고 다른 사람의 모금 웹사이트에 댓글을 남기세요',
          type: 'peer_feedback',
          expectedAnswer: 'Write a comment for every presenter',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M3_SM6_CP4',
          order: 4,
          question: 'Select the two most helpful points from feedback and propose improvement ideas',
          questionKo: '피드백에서 가장 도움이 되는 두 가지를 선택하고 개선 아이디어를 제안하세요',
          type: 'reflection',
          expectedAnswer: 'Summarize at least two comments and generate at least two improvement ideas',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M3_SM6_CP5',
          order: 5,
          question: 'Conclude Stage 3 by writing Journal Draft 3',
          questionKo: '저널 초안 3을 작성하여 스테이지 3을 마무리하세요',
          type: 'journal',
          expectedAnswer: 'Complete a journal of 500–1500 characters including what you learned',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    }
  ]
};

// ==================== STAGE 4: WHAT IS YOUR LIFE PURPOSE? ====================
/**
 * Mission 4: Purpose Articulation
 * Duration: 3 weeks
 * Expected Outcome: "My Life Purpose Statement"
 * Deliverable: Life Purpose Statement
 */
export const GPS101_MISSION_4 = {
  missionId: 'GPS101_M4',
  stageNumber: 4,
  stageName: 'What is your life purpose?',
  stageNameKo: '당신의 인생 목적은 무엇입니까?',
  
  missionNumber: 4,
  missionTitle: 'Purpose Articulation',
  missionTitleKo: '목적 명료화',
  
  description: 'Students articulate a one-sentence Life Purpose Statement and a Problem Statement that connects their identity, values, and problem ownership.',
  descriptionKo: '학생들은 자신의 정체성, 가치, 문제 소유권을 연결하는 한 문장의 인생 목적 선언문과 문제 선언문을 작성합니다.',
  
  expectedOutcome: 'My Life Purpose Statement',
  expectedOutcomeKo: '나의 인생 목적 선언문',
  
  deliverable: 'Life Purpose Statement',
  deliverableKo: '인생 목적 선언문',
  
  duration: '3 weeks',
  courseCode: 'GPS_101_BASIC',
  
  subMissions: [
    {
      subMissionId: 'GPS101_M4_SM1',
      subMissionNumber: 1,
      title: 'Opening Lecture: Understanding Life Purpose',
      titleKo: '오프닝 강의: 인생 목적 이해하기',
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M4_SM1_CP1',
          order: 1,
          question: 'Watch the lecture on defining life purpose',
          questionKo: '인생 목적 정의에 대한 강의를 시청하세요',
          type: 'video',
          expectedAnswer: 'Clear understanding of life purpose concept',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M4_SM1_CP2',
          order: 2,
          question: 'Take notes on examples of purpose-driven lives',
          questionKo: '목적 중심 삶의 예시에 대한 메모를 작성하세요',
          type: 'notes',
          expectedAnswer: 'Awareness of real-world examples',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M4_SM1_CP3',
          order: 3,
          question: 'Reflect on the connection between your life problem and purpose',
          questionKo: '당신의 인생 문제와 목적 사이의 연결에 대해 성찰하세요',
          type: 'reflection',
          expectedAnswer: 'First link between personal problem and purpose',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M4_SM1_CP4',
          order: 4,
          question: 'Share one insight in a learning journal',
          questionKo: '학습 저널에 하나의 통찰을 공유하세요',
          type: 'journal',
          expectedAnswer: 'Identified insight from lecture',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M4_SM1_CP5',
          order: 5,
          question: 'Submit a short quiz or reflection form',
          questionKo: '짧은 퀴즈 또는 성찰 양식을 제출하세요',
          type: 'quiz',
          expectedAnswer: 'Engaged reflection on purpose awareness',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    },
    {
      subMissionId: 'GPS101_M4_SM2',
      subMissionNumber: 2,
      title: 'Draft a Problem Statement and Purpose Statement',
      titleKo: '문제 선언문과 목적 선언문 초안 작성',
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M4_SM2_CP1',
          order: 1,
          question: 'Listen carefully to the explanation of the Problem Statement',
          questionKo: '문제 선언문 설명을 주의 깊게 들으세요',
          type: 'listening',
          expectedAnswer: 'Understand the Problem Statement, which is the core of GPS',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M4_SM2_CP2',
          order: 2,
          question: 'Write My Problem Statement',
          questionKo: '나의 문제 선언문을 작성하세요',
          type: 'statement',
          expectedAnswer: 'Write one sentence that includes the stakeholders, causes, and symptoms',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M4_SM2_CP3',
          order: 3,
          question: 'Listen carefully to the explanation of the Purpose Statement',
          questionKo: '목적 선언문 설명을 주의 깊게 들으세요',
          type: 'listening',
          expectedAnswer: 'Understand the Purpose Statement, which provides future direction',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M4_SM2_CP4',
          order: 4,
          question: 'Write your Life Purpose Statement',
          questionKo: '인생 목적 선언문을 작성하세요',
          type: 'statement',
          expectedAnswer: 'Write one sentence that connects Life Purpose with solving the problem',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M4_SM2_CP5',
          order: 5,
          question: 'Share with your teammates',
          questionKo: '팀원들과 공유하세요',
          type: 'sharing',
          expectedAnswer: 'Share the two sentences and revise by reflecting on feedback',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    },
    {
      subMissionId: 'GPS101_M4_SM3',
      subMissionNumber: 3,
      title: 'Pressure Test Your Purpose',
      titleKo: '목적에 대한 압박 테스트',
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M4_SM3_CP1',
          order: 1,
          question: 'Ask GPT to critique your purpose from a practical lens',
          questionKo: 'GPT에게 실용적 관점에서 당신의 목적을 비판하도록 요청하세요',
          type: 'ai_interaction',
          expectedAnswer: 'Purpose tested for clarity and uniqueness',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M4_SM3_CP2',
          order: 2,
          question: 'Simulate a skeptical reader asking "Why you?"',
          questionKo: '"왜 당신인가?"라고 묻는 회의적인 독자를 시뮬레이션하세요',
          type: 'reflection',
          expectedAnswer: 'Confidence in your chosen direction',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M4_SM3_CP3',
          order: 3,
          question: 'Explore how your strengths match your purpose',
          questionKo: '당신의 강점이 목적과 어떻게 일치하는지 탐색하세요',
          type: 'analysis',
          expectedAnswer: 'Evidence of personal alignment',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M4_SM3_CP4',
          order: 4,
          question: 'Try replacing yourself with someone else: Does it still work?',
          questionKo: '자신을 다른 사람으로 바꿔보세요: 여전히 작동합니까?',
          type: 'analysis',
          expectedAnswer: 'Discernment on authenticity and uniqueness',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M4_SM3_CP5',
          order: 5,
          question: 'Write a short reflection: "Does my statement feel true?"',
          questionKo: '짧은 성찰을 작성하세요: "나의 선언문이 진실되게 느껴지는가?"',
          type: 'reflection',
          expectedAnswer: 'Statement validated through critical thinking',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    },
    {
      subMissionId: 'GPS101_M4_SM4',
      subMissionNumber: 4,
      title: 'Vision Capturing',
      titleKo: '비전 포착',
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M4_SM4_CP1',
          order: 1,
          question: 'Envision a world where the problem is solved (your Vision)',
          questionKo: '문제가 해결된 세상을 상상하세요 (당신의 비전)',
          type: 'visioning',
          expectedAnswer: 'Imagine a worldview beyond yourself and design an inspiring vision',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M4_SM4_CP2',
          order: 2,
          question: 'Create a visual representation of your Vision using ChatGPT',
          questionKo: 'ChatGPT를 사용하여 비전의 시각적 표현을 만드세요',
          type: 'visual',
          expectedAnswer: 'Submit an image that reflects your Problem and Purpose Statements',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M4_SM4_CP3',
          order: 3,
          question: 'Describe your future through storytelling',
          questionKo: '스토리텔링을 통해 당신의 미래를 설명하세요',
          type: 'narrative',
          expectedAnswer: 'Write a Vision Capturing narrative (300+ characters)',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M4_SM4_CP4',
          order: 4,
          question: 'Conduct a Backcasting exercise',
          questionKo: '백캐스팅 연습을 수행하세요',
          type: 'planning',
          expectedAnswer: 'Submit the worksheet fully completed, ensuring truthfulness and concreteness',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M4_SM4_CP5',
          order: 5,
          question: 'Define three concrete Milestones',
          questionKo: '3가지 구체적인 이정표를 정의하세요',
          type: 'planning',
          expectedAnswer: 'Submit the worksheet with logical and specific details',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    },
    {
      subMissionId: 'GPS101_M4_SM5',
      subMissionNumber: 5,
      title: 'Gap Analysis',
      titleKo: '격차 분석',
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M4_SM5_CP1',
          order: 1,
          question: 'Understand the Basic Concepts of Vocation and LQ',
          questionKo: '소명과 LQ의 기본 개념을 이해하세요',
          type: 'learning',
          expectedAnswer: 'Better understanding of Vocation and motivation to become like Christ',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M4_SM5_CP2',
          order: 2,
          question: 'Define the needed skills for one\'s vocation via The Captured Vision and Purpose Statement',
          questionKo: '포착된 비전과 목적 선언문을 통해 소명에 필요한 기술을 정의하세요',
          type: 'analysis',
          expectedAnswer: 'A list of skills usable for GAP analysis',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M4_SM5_CP3',
          order: 3,
          question: 'Take the LQ Test',
          questionKo: 'LQ 테스트를 받으세요',
          type: 'assessment',
          expectedAnswer: 'LQ Score that can be used to analyze one\'s road in becoming more like Jesus',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M4_SM5_CP4',
          order: 4,
          question: 'Write Two Paragraphs analyzing the GAP in terms of Skillset and LQ',
          questionKo: '기술 세트와 LQ 측면에서 격차를 분석하는 두 단락을 작성하세요',
          type: 'analysis',
          expectedAnswer: 'An analysis in one\'s as-is and to-be',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M4_SM5_CP5',
          order: 5,
          question: 'Choose and Create Enhancing Exercises and Organize into a Roadmap',
          questionKo: '향상 연습을 선택하고 만들어 로드맵으로 구성하세요',
          type: 'planning',
          expectedAnswer: 'An in-depth roadmap that is helpful in one\'s problem solving journey',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    },
    {
      subMissionId: 'GPS101_M4_SM6',
      subMissionNumber: 6,
      title: 'Journal Draft 4',
      titleKo: '저널 초안 4',
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M4_SM6_CP1',
          order: 1,
          question: 'Summarize key insights from the Purpose lecture and Problem–Purpose statement',
          questionKo: '목적 강의와 문제-목적 선언문의 핵심 통찰을 요약하세요',
          type: 'summary',
          expectedAnswer: 'Clearly describe the link between personal problems and life purpose (150+ characters)',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M4_SM6_CP2',
          order: 2,
          question: 'Record self-doubt and confidence shifts from the Pressure Test',
          questionKo: '압박 테스트에서의 자기 의심과 자신감 변화를 기록하세요',
          type: 'reflection',
          expectedAnswer: 'Honestly describe uniqueness discovered through GPT dialogue (150+ characters)',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M4_SM6_CP3',
          order: 3,
          question: 'Write Vision Capturing narrative including emotional impact',
          questionKo: '감정적 영향을 포함한 비전 포착 내러티브를 작성하세요',
          type: 'narrative',
          expectedAnswer: 'Write a narrative including emotional impact, year, context, and stakeholders (150+ characters)',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M4_SM6_CP4',
          order: 4,
          question: 'Conduct a Gap Analysis between current capabilities and those needed for your calling',
          questionKo: '현재 역량과 소명에 필요한 역량 사이의 격차 분석을 수행하세요',
          type: 'analysis',
          expectedAnswer: 'Provide detailed gap analysis (50+ characters) and growth roadmap (80+ characters)',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M4_SM6_CP5',
          order: 5,
          question: 'Reflect on the entire GPS Stage 4 process',
          questionKo: 'GPS 스테이지 4 전체 과정에 대해 성찰하세요',
          type: 'reflection',
          expectedAnswer: 'Write a reflection on how perspectives on purpose and problem-solving have changed (100+ characters)',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    }
  ]
};

// ==================== STAGE 5: WHAT IS YOUR PURPOSE-DRIVEN PROJECT? ====================
/**
 * Mission 5: Project Design
 * Duration: 3 weeks
 * Expected Outcome: "My Purpose-driven Project"
 * Deliverable: Purpose-driven Project
 */
export const GPS101_MISSION_5 = {
  missionId: 'GPS101_M5',
  stageNumber: 5,
  stageName: 'What is your Purpose-driven Project?',
  stageNameKo: '목적 중심의 프로젝트는 무엇입니까?',
  
  missionNumber: 5,
  missionTitle: 'Project Design',
  missionTitleKo: '프로젝트 설계',
  
  description: 'Students translate their life purpose into a practical, purpose-aligned project. They brainstorm, design, test, and pitch a concrete initiative.',
  descriptionKo: '학생들은 자신의 인생 목적을 실용적이고 목적에 부합하는 프로젝트로 번역합니다. 그들은 구체적인 이니셔티브를 브레인스토밍하고, 설계하고, 테스트하고, 발표합니다.',
  
  expectedOutcome: 'My Purpose-driven Project',
  expectedOutcomeKo: '나의 목적 중심 프로젝트',
  
  deliverable: 'Purpose-driven Project',
  deliverableKo: '목적 중심 프로젝트',
  
  duration: '3 weeks',
  courseCode: 'GPS_101_BASIC',
  
  subMissions: [
    {
      subMissionId: 'GPS101_M5_SM1',
      subMissionNumber: 1,
      title: 'Opening Lecture: From Purpose to Project',
      titleKo: '오프닝 강의: 목적에서 프로젝트로',
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M5_SM1_CP1',
          order: 1,
          question: 'Understand the concept and features of a Purpose-driven Project',
          questionKo: '목적 중심 프로젝트의 개념과 특징을 이해하세요',
          type: 'learning',
          expectedAnswer: 'Clarify the key elements and differences from general projects',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M5_SM1_CP2',
          order: 2,
          question: 'Note real success cases of Purpose-driven Projects and analyze their impact methods',
          questionKo: '목적 중심 프로젝트의 실제 성공 사례를 기록하고 영향 방법을 분석하세요',
          type: 'research',
          expectedAnswer: 'Understanding of how successful projects create impact',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M5_SM1_CP3',
          order: 3,
          question: 'Reflect on how your life purpose can be realized through a concrete project',
          questionKo: '구체적인 프로젝트를 통해 인생 목적이 실현될 수 있는 방법을 성찰하세요',
          type: 'reflection',
          expectedAnswer: 'Write a 100+ character reflection connecting purpose with project idea',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M5_SM1_CP4',
          order: 4,
          question: 'Record questions and insights about project design and execution',
          questionKo: '프로젝트 설계와 실행에 대한 질문과 통찰을 기록하세요',
          type: 'notes',
          expectedAnswer: 'List at least one question and extract specific execution insights (30+ characters)',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M5_SM1_CP5',
          order: 5,
          question: 'Summarize learning content and take the quiz',
          questionKo: '학습 내용을 요약하고 퀴즈를 풀어보세요',
          type: 'quiz',
          expectedAnswer: 'Pass by answering at least the required number of correct questions',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    },
    {
      subMissionId: 'GPS101_M5_SM2',
      subMissionNumber: 2,
      title: 'Brainstorm Project Ideas with Zettelkasten Method',
      titleKo: 'Zettelkasten 방법으로 프로젝트 아이디어 브레인스토밍',
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M5_SM2_CP1',
          order: 1,
          question: 'Converse with an LLM in finding the root causes and effects of your problem statement',
          questionKo: 'LLM과 대화하여 문제 선언문의 근본 원인과 효과를 찾으세요',
          type: 'ai_interaction',
          expectedAnswer: 'An in-depth reflection on one\'s capabilities and possibilities',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M5_SM2_CP2',
          order: 2,
          question: 'Brainstorm 3-5+ secrets from the generated root causes and effects',
          questionKo: '생성된 근본 원인과 효과로부터 3-5개 이상의 비밀을 브레인스토밍하세요',
          type: 'brainstorming',
          expectedAnswer: 'Comprehensive mindmap of the Root Causes and Effects',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M5_SM2_CP3',
          order: 3,
          question: 'Generate Initial Idea Pool Based on the generated secrets',
          questionKo: '생성된 비밀을 기반으로 초기 아이디어 풀을 생성하세요',
          type: 'ideation',
          expectedAnswer: 'Multiple idea candidates generated',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M5_SM2_CP4',
          order: 4,
          question: 'Explore Cross-Domain Ideas',
          questionKo: '교차 도메인 아이디어를 탐색하세요',
          type: 'exploration',
          expectedAnswer: 'Incorporated interdisciplinary solutions worth developing',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M5_SM2_CP5',
          order: 5,
          question: 'Build on and Connect Ideas',
          questionKo: '아이디어를 구축하고 연결하세요',
          type: 'synthesis',
          expectedAnswer: 'A Zettelkasten Mindmap connecting, comparing, analyzing, and merging ideas',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    },
    {
      subMissionId: 'GPS101_M5_SM3',
      subMissionNumber: 3,
      title: 'Draft a Problem–Solution Canvas',
      titleKo: '문제-해결책 캔버스 초안 작성',
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M5_SM3_CP1',
          order: 1,
          question: 'Develop Secret Solutions from one of five Project Ideas',
          questionKo: '5가지 프로젝트 아이디어 중 하나에서 비밀 솔루션을 개발하세요',
          type: 'development',
          expectedAnswer: 'Self-oriented secret solutions that are distinct, unique, and creative',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M5_SM3_CP2',
          order: 2,
          question: 'Document and Refine Problem and Purpose Statements',
          questionKo: '문제 및 목적 선언문을 문서화하고 정제하세요',
          type: 'documentation',
          expectedAnswer: 'A review of one\'s purpose and vocation',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M5_SM3_CP3',
          order: 3,
          question: 'Choose a Secret Solution and Validate Problem-Solution Fit',
          questionKo: '비밀 솔루션을 선택하고 문제-해결책 적합성을 검증하세요',
          type: 'validation',
          expectedAnswer: 'Pressure test the secret solution in its relation to the problem statement',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M5_SM3_CP4',
          order: 4,
          question: 'Create Comprehensive Canvas Documentation',
          questionKo: '포괄적인 캔버스 문서를 만드세요',
          type: 'documentation',
          expectedAnswer: 'A canvas filled in with the assistance of LLM and TAs',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M5_SM3_CP5',
          order: 5,
          question: 'Draft a 1-paragraph pitch using the Canvas',
          questionKo: '캔버스를 사용하여 1단락 피치 초안을 작성하세요',
          type: 'pitch',
          expectedAnswer: 'A pitch written in its original unedited form',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    },
    {
      subMissionId: 'GPS101_M5_SM4',
      subMissionNumber: 4,
      title: 'Pitch Your Purpose-driven Project',
      titleKo: '목적 중심 프로젝트 피치',
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M5_SM4_CP1',
          order: 1,
          question: 'Receive Feedback from TA and GPT and Iterate the Pitch',
          questionKo: 'TA와 GPT로부터 피드백을 받고 피치를 반복하세요',
          type: 'iteration',
          expectedAnswer: 'The pitch revised and rewritten',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M5_SM4_CP2',
          order: 2,
          question: 'Generate Relevant Slides for the Pitch with LLM AI',
          questionKo: 'LLM AI를 사용하여 피치를 위한 관련 슬라이드를 생성하세요',
          type: 'presentation',
          expectedAnswer: 'Slides generated for presentation',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M5_SM4_CP3',
          order: 3,
          question: 'Receive Final Feedback from GPT and Revise the Final Iteration',
          questionKo: 'GPT로부터 최종 피드백을 받고 최종 반복을 수정하세요',
          type: 'iteration',
          expectedAnswer: 'Final iteration of Pitch script and slides',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M5_SM4_CP4',
          order: 4,
          question: 'Present in Small Groups',
          questionKo: '소그룹에서 발표하세요',
          type: 'presentation',
          expectedAnswer: 'Comprehension of one\'s progress compared to fellow students',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M5_SM4_CP5',
          order: 5,
          question: 'Write Feedback for Peers in Said Small Groups',
          questionKo: '소그룹의 동료들에게 피드백을 작성하세요',
          type: 'peer_feedback',
          expectedAnswer: 'Scoreset to write into the grades of the students',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    },
    {
      subMissionId: 'GPS101_M5_SM5',
      subMissionNumber: 5,
      title: '"End of The Road" Party (optional)',
      titleKo: '"길의 끝" 파티 (선택사항)',
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M5_SM5_CP1',
          order: 1,
          question: 'Prepare Name Tag from a Template that States your Name, Age, and the Vocation you fulfilled',
          questionKo: '이름, 나이, 달성한 소명을 나타내는 템플릿에서 명찰을 준비하세요',
          type: 'preparation',
          expectedAnswer: 'Name Tag from a Template with Props',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M5_SM5_CP2',
          order: 2,
          question: 'Begin Roleplaying as if you are at the "End of the Road", having fulfilled your Vocation',
          questionKo: '소명을 달성하고 "길의 끝"에 있는 것처럼 롤플레잉을 시작하세요',
          type: 'roleplay',
          expectedAnswer: 'Discovering what others want to fulfill + strengthening "self-fulfilling prophecy"',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M5_SM5_CP3',
          order: 3,
          question: 'Showcase the Props you prepared for the Role',
          questionKo: '역할을 위해 준비한 소품을 전시하세요',
          type: 'showcase',
          expectedAnswer: 'Showcase of one\'s creativity + strengthening the bonds of the class',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M5_SM5_CP4',
          order: 4,
          question: 'Enjoy the Party and Befriend people!',
          questionKo: '파티를 즐기고 사람들과 친구가 되세요!',
          type: 'social',
          expectedAnswer: 'Networking and new strong connections',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M5_SM5_CP5',
          order: 5,
          question: 'Wrap up and go home~',
          questionKo: '마무리하고 집에 가세요~',
          type: 'completion',
          expectedAnswer: 'A good memory and stronger self esteem',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    },
    {
      subMissionId: 'GPS101_M5_SM6',
      subMissionNumber: 6,
      title: 'Feedback & Refinement',
      titleKo: '피드백 및 개선',
      
      checkpoints: [
        {
          checkpointId: 'GPS101_M5_SM6_CP1',
          order: 1,
          question: 'Collect feedback from peers and mentors on your project pitch',
          questionKo: '프로젝트 피치에 대한 동료 및 멘토의 피드백을 수집하세요',
          type: 'feedback_collection',
          expectedAnswer: 'Comprehensive feedback from multiple sources',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M5_SM6_CP2',
          order: 2,
          question: 'Identify the top 3 improvement areas based on feedback',
          questionKo: '피드백을 기반으로 상위 3개 개선 영역을 식별하세요',
          type: 'analysis',
          expectedAnswer: 'Clear prioritization of improvement areas',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M5_SM6_CP3',
          order: 3,
          question: 'Refine your Purpose-driven Project based on feedback',
          questionKo: '피드백을 기반으로 목적 중심 프로젝트를 정제하세요',
          type: 'refinement',
          expectedAnswer: 'Updated and improved project documentation',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M5_SM6_CP4',
          order: 4,
          question: 'Prepare final GPS 101 portfolio with all deliverables',
          questionKo: '모든 결과물이 포함된 최종 GPS 101 포트폴리오를 준비하세요',
          type: 'portfolio',
          expectedAnswer: 'Complete portfolio with all 5 stage deliverables',
          barakaReward: 5,
          xpReward: 5
        },
        {
          checkpointId: 'GPS101_M5_SM6_CP5',
          order: 5,
          question: 'Submit final Purpose-driven Project and celebrate GPS 101 completion',
          questionKo: '최종 목적 중심 프로젝트를 제출하고 GPS 101 완료를 축하하세요',
          type: 'submission',
          expectedAnswer: 'Final project submitted and Orange Beacon earned',
          barakaReward: 5,
          xpReward: 5
        }
      ]
    }
  ]
};

// ==================== ALL GPS 101 MISSIONS ====================
export const GPS_101_ALL_MISSIONS = [
  GPS101_MISSION_1,
  GPS101_MISSION_2,
  GPS101_MISSION_3,
  GPS101_MISSION_4,
  GPS101_MISSION_5
];

// Helper function to get total checkpoint count
export const getTotalCheckpointCount = () => {
  let total = 0;
  GPS_101_ALL_MISSIONS.forEach(mission => {
    mission.subMissions.forEach(subMission => {
      total += subMission.checkpoints.length;
    });
  });
  return total;
};

// Helper function to get mission by ID
export const getMissionById = (missionId) => {
  return GPS_101_ALL_MISSIONS.find(m => m.missionId === missionId);
};

// Helper function to get sub-mission by ID
export const getSubMissionById = (subMissionId) => {
  for (const mission of GPS_101_ALL_MISSIONS) {
    const subMission = mission.subMissions.find(sm => sm.subMissionId === subMissionId);
    if (subMission) return subMission;
  }
  return null;
};

// Helper function to get checkpoint by ID
export const getCheckpointById = (checkpointId) => {
  for (const mission of GPS_101_ALL_MISSIONS) {
    for (const subMission of mission.subMissions) {
      const checkpoint = subMission.checkpoints.find(cp => cp.checkpointId === checkpointId);
      if (checkpoint) return checkpoint;
    }
  }
  return null;
};

export default {
  GPS_101_CONFIG,
  GPS101_MISSION_1,
  GPS101_MISSION_2,
  GPS_101_ALL_MISSIONS,
  MISSION_STATUS,
  CHECKPOINT_STATUS,
  getTotalCheckpointCount,
  getMissionById,
  getSubMissionById,
  getCheckpointById
};