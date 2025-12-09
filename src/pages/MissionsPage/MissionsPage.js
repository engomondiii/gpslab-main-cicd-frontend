/**
 * GPS Lab Platform - MissionsPage Component
 * 
 * Main missions listing page with filters and stage grouping.
 * 
 * @module pages/MissionsPage
 */

import React, { useState, useCallback } from 'react';
import MissionList from '../../components/mission/MissionList/MissionList';
import MissionAcceptModal from '../../components/mission/MissionAccept/MissionAcceptModal';
import './MissionsPage.css';

// Mock missions data
const MOCK_MISSIONS = [
  {
    id: 'mission-1-1',
    title: 'Introduction to Problem Solving',
    description: 'Learn the fundamentals of structured problem-solving and develop your analytical thinking skills.',
    type: 'standard',
    status: 'completed',
    difficulty: 'easy',
    stageNumber: 1,
    missionNumber: 1,
    estimatedTime: 30,
    xpReward: 100,
    barakaReward: 25,
    objectives: [{ text: 'Watch intro video', completed: true }, { text: 'Complete quiz', completed: true }],
    tags: ['foundations', 'thinking']
  },
  {
    id: 'mission-1-2',
    title: 'Defining the Problem',
    description: 'Master the art of clearly defining problems before attempting to solve them.',
    type: 'standard',
    status: 'completed',
    difficulty: 'easy',
    stageNumber: 1,
    missionNumber: 2,
    estimatedTime: 25,
    xpReward: 100,
    barakaReward: 25,
    objectives: [{ text: 'Read lesson', completed: true }, { text: 'Practice exercise', completed: true }],
    tags: ['foundations', 'clarity']
  },
  {
    id: 'mission-1-3',
    title: 'Root Cause Analysis',
    description: 'Dive deep into problems to find their true underlying causes using proven techniques.',
    type: 'standard',
    status: 'in_progress',
    difficulty: 'medium',
    stageNumber: 1,
    missionNumber: 3,
    estimatedTime: 45,
    progress: 60,
    xpReward: 150,
    barakaReward: 35,
    objectives: [
      { text: 'Learn 5 Whys technique', completed: true },
      { text: 'Practice fishbone diagram', completed: true },
      { text: 'Complete case study', completed: false }
    ],
    tags: ['analysis', 'techniques']
  },
  {
    id: 'mission-1-4',
    title: 'Stage 1 Boss: The Complexity Challenge',
    description: 'Apply everything you learned to solve a complex multi-layered problem.',
    type: 'boss',
    status: 'available',
    difficulty: 'hard',
    stageNumber: 1,
    missionNumber: 4,
    estimatedTime: 60,
    xpReward: 300,
    barakaReward: 75,
    objectives: [
      { text: 'Analyze the scenario', completed: false },
      { text: 'Identify root causes', completed: false },
      { text: 'Propose solutions', completed: false },
      { text: 'Present findings', completed: false }
    ],
    tags: ['boss', 'challenge']
  },
  {
    id: 'mission-2-1',
    title: 'Creative Thinking Fundamentals',
    description: 'Unlock your creative potential with proven ideation techniques.',
    type: 'standard',
    status: 'locked',
    difficulty: 'medium',
    stageNumber: 2,
    missionNumber: 1,
    estimatedTime: 40,
    xpReward: 150,
    barakaReward: 35,
    objectives: [],
    tags: ['creativity', 'ideation']
  },
  {
    id: 'mission-party-1',
    title: 'Team Problem Solving Sprint',
    description: 'Join a party of learners to tackle a real-world problem together.',
    type: 'party',
    status: 'available',
    difficulty: 'medium',
    stageNumber: 1,
    missionNumber: 5,
    estimatedTime: 90,
    xpReward: 250,
    barakaReward: 100,
    isPartyMission: true,
    partySize: '3-5',
    objectives: [],
    tags: ['teamwork', 'collaboration']
  }
];

const STAGE_FILTERS = [
  { value: 'all', label: 'All Stages' },
  { value: '1', label: 'Stage 1: Foundation' },
  { value: '2', label: 'Stage 2: Discovery' },
  { value: '3', label: 'Stage 3: Growth' }
];

const MissionsPage = ({
  user,
  currentStage = 1,
  onNavigate,
  className = '',
  ...props
}) => {
  const [missions] = useState(MOCK_MISSIONS);
  const [selectedStage, setSelectedStage] = useState('all');
  const [selectedMission, setSelectedMission] = useState(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  
  const filteredMissions = selectedStage === 'all' 
    ? missions 
    : missions.filter(m => m.stageNumber === parseInt(selectedStage));
  
  const stats = {
    total: missions.length,
    completed: missions.filter(m => m.status === 'completed').length,
    inProgress: missions.filter(m => m.status === 'in_progress').length,
    available: missions.filter(m => m.status === 'available').length
  };
  
  const handleMissionClick = useCallback((missionId) => {
    onNavigate?.(`/missions/${missionId}`);
  }, [onNavigate]);
  
  const handleMissionAccept = useCallback((missionId) => {
    const mission = missions.find(m => m.id === missionId);
    setSelectedMission(mission);
    setShowAcceptModal(true);
  }, [missions]);
  
  const handleAcceptConfirm = useCallback(async (missionId) => {
    setIsAccepting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsAccepting(false);
  }, []);
  
  const handleCloseModal = useCallback(() => {
    setShowAcceptModal(false);
    setSelectedMission(null);
  }, []);
  
  const classNames = ['missions-page', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="missions-page__header">
        <div className="missions-page__header-content">
          <h1 className="missions-page__title">Missions</h1>
          <p className="missions-page__subtitle">Complete missions to earn XP, Baraka, and unlock new stages</p>
        </div>
        
        {/* Quick Stats */}
        <div className="missions-page__quick-stats">
          <div className="missions-page__quick-stat">
            <span className="missions-page__quick-stat-value">{stats.completed}</span>
            <span className="missions-page__quick-stat-label">Completed</span>
          </div>
          <div className="missions-page__quick-stat">
            <span className="missions-page__quick-stat-value missions-page__quick-stat-value--progress">{stats.inProgress}</span>
            <span className="missions-page__quick-stat-label">In Progress</span>
          </div>
          <div className="missions-page__quick-stat">
            <span className="missions-page__quick-stat-value missions-page__quick-stat-value--available">{stats.available}</span>
            <span className="missions-page__quick-stat-label">Available</span>
          </div>
        </div>
      </div>
      
      {/* Stage Filter Tabs */}
      <div className="missions-page__stage-tabs">
        {STAGE_FILTERS.map(stage => (
          <button
            key={stage.value}
            type="button"
            onClick={() => setSelectedStage(stage.value)}
            className={`missions-page__stage-tab ${selectedStage === stage.value ? 'missions-page__stage-tab--active' : ''}`}
          >
            {stage.label}
          </button>
        ))}
      </div>
      
      {/* Missions List */}
      <div className="missions-page__content">
        <MissionList
          missions={filteredMissions}
          title={selectedStage === 'all' ? 'All Missions' : `Stage ${selectedStage} Missions`}
          onMissionClick={handleMissionClick}
          onMissionAccept={handleMissionAccept}
          showFilters={true}
          showSearch={true}
          showSort={true}
        />
      </div>
      
      {/* Accept Modal */}
      <MissionAcceptModal
        isOpen={showAcceptModal}
        mission={selectedMission}
        onAccept={handleAcceptConfirm}
        onClose={handleCloseModal}
        isLoading={isAccepting}
      />
    </div>
  );
};

export default MissionsPage;