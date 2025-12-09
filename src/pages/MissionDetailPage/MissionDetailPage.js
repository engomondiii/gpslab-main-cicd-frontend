/**
 * GPS Lab Platform - MissionDetailPage Component
 * 
 * Full mission detail page with briefing, progress, and completion.
 * 
 * @module pages/MissionDetailPage
 */

import React, { useState, useCallback } from 'react';
import MissionDetail from '../../components/mission/MissionDetail/MissionDetail';
import MissionBriefing from '../../components/mission/MissionBriefing/MissionBriefing';
import MissionProgressTracker from '../../components/mission/MissionProgress/MissionProgressTracker';
import MissionCompletionScreen from '../../components/mission/MissionCompletion/MissionCompletionScreen';
import './MissionDetailPage.css';

// Mock mission data
const MOCK_MISSION = {
  id: 'mission-1-3',
  title: 'Root Cause Analysis',
  description: 'Dive deep into problems to find their true underlying causes using proven techniques like the 5 Whys and Fishbone diagrams.',
  briefingText: 'Every problem has a root cause. Your mission is to master the art of finding it. You will learn two powerful techniques: the 5 Whys method and Fishbone (Ishikawa) diagrams. By the end of this mission, you\'ll be able to analyze any problem systematically.',
  type: 'standard',
  status: 'in_progress',
  difficulty: 'medium',
  stageNumber: 1,
  missionNumber: 3,
  estimatedTime: 45,
  xpReward: 150,
  barakaReward: 35,
  progress: 60,
  objectives: [
    { id: 'obj-1', text: 'Watch the introduction video', type: 'video', completed: true, xpReward: 25 },
    { id: 'obj-2', text: 'Learn the 5 Whys technique', type: 'reading', completed: true, xpReward: 25 },
    { id: 'obj-3', text: 'Practice with 5 Whys exercise', type: 'task', completed: true, xpReward: 25 },
    { id: 'obj-4', text: 'Learn Fishbone diagram method', type: 'reading', completed: false, xpReward: 25 },
    { id: 'obj-5', text: 'Complete the case study', type: 'submission', completed: false, xpReward: 50, required: true },
    { id: 'obj-6', text: 'Score 80%+ on the quiz', type: 'quiz', completed: false, xpReward: 25, required: false }
  ],
  tips: [
    'Take your time with each "Why" - don\'t rush to conclusions',
    'Consider multiple branches in your fishbone diagram',
    'Real-world problems often have multiple root causes'
  ],
  badges: [{ name: 'Root Cause Detective', icon: null }],
  achievements: [{ name: 'First Analysis Complete', description: 'Completed your first root cause analysis' }],
  unlocks: ['Advanced Analysis Techniques', 'Case Study Library Access'],
  author: 'GPS Lab Team',
  createdAt: '2024-01-15'
};

const MOCK_STEPS = [
  { id: 'step-1', title: 'Introduction', type: 'briefing', duration: 5, completed: true },
  { id: 'step-2', title: '5 Whys Technique', type: 'reading', duration: 10, completed: true },
  { id: 'step-3', title: 'Practice Exercise', type: 'task', duration: 10, completed: true },
  { id: 'step-4', title: 'Fishbone Diagrams', type: 'reading', duration: 10, completed: false },
  { id: 'step-5', title: 'Case Study', type: 'submission', duration: 15, completed: false },
  { id: 'step-6', title: 'Knowledge Check', type: 'quiz', duration: 5, completed: false }
];

const MissionDetailPage = ({
  missionId,
  user,
  onNavigate,
  onBack,
  className = '',
  ...props
}) => {
  const [mission] = useState(MOCK_MISSION);
  const [steps] = useState(MOCK_STEPS);
  const [view, setView] = useState('detail'); // 'detail', 'briefing', 'progress', 'completion'
  const [currentStepIndex, setCurrentStepIndex] = useState(3);
  const [timeSpent, setTimeSpent] = useState(1245); // seconds
  const [isPaused, setIsPaused] = useState(false);
  
  const handleBack = useCallback(() => {
    if (view !== 'detail') {
      setView('detail');
    } else {
      onBack?.() || onNavigate?.('/missions');
    }
  }, [view, onBack, onNavigate]);
  
  const handleAcceptMission = useCallback(async (id) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setView('briefing');
  }, []);
  
  const handleStartMission = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setView('progress');
  }, []);
  
  const handleContinueMission = useCallback(() => {
    setView('progress');
  }, []);
  
  const handleCompleteMission = useCallback(() => {
    setView('completion');
  }, []);
  
  const handleReturnToDashboard = useCallback(() => {
    onNavigate?.('/dashboard');
  }, [onNavigate]);
  
  const handleNextMission = useCallback(() => {
    onNavigate?.('/missions/mission-1-4');
  }, [onNavigate]);
  
  const classNames = ['mission-detail-page', className].filter(Boolean).join(' ');
  
  // Render based on view
  if (view === 'briefing') {
    return (
      <MissionBriefing
        mission={mission}
        onStart={handleStartMission}
        onSkip={handleStartMission}
        onClose={handleBack}
        className={classNames}
      />
    );
  }
  
  if (view === 'completion') {
    return (
      <MissionCompletionScreen
        mission={mission}
        timeSpent={timeSpent}
        objectivesCompleted={4}
        objectivesTotal={6}
        bonusObjectives={1}
        xpEarned={mission.xpReward}
        barakaEarned={mission.barakaReward}
        badgesEarned={mission.badges}
        nextMission={{ id: 'mission-1-4', title: 'Stage 1 Boss' }}
        onContinue={handleNextMission}
        onReturnToDashboard={handleReturnToDashboard}
        className={classNames}
      />
    );
  }
  
  return (
    <div className={classNames} {...props}>
      {/* Main Content */}
      <div className="mission-detail-page__main">
        <MissionDetail
          mission={mission}
          onBack={handleBack}
          onAccept={handleAcceptMission}
          onContinue={handleContinueMission}
        />
      </div>
      
      {/* Sidebar (Progress Tracker when in progress) */}
      {view === 'progress' && (
        <div className="mission-detail-page__sidebar">
          <MissionProgressTracker
            mission={mission}
            steps={steps}
            currentStepIndex={currentStepIndex}
            timeSpent={timeSpent}
            isPaused={isPaused}
            onPause={() => setIsPaused(true)}
            onResume={() => setIsPaused(false)}
            onStepClick={(step, index) => setCurrentStepIndex(index)}
          />
          
          {/* Quick Actions */}
          <div className="mission-detail-page__quick-actions">
            <button
              type="button"
              onClick={handleCompleteMission}
              className="mission-detail-page__complete-btn"
            >
              Complete Mission (Demo)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionDetailPage;