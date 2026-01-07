/**
 * GPS Lab Platform - StudyForgePage
 * 
 * Main page for the Study Forge learning hub.
 * Integrates all study components for a complete learning experience.
 * 
 * @module pages/StudyForgePage/StudyForgePage
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import StudyForge from '../../components/study/StudyForge/StudyForge';
import StudyMissionDetail from '../../components/study/StudyMission/StudyMissionDetail';
import StudyModuleContent from '../../components/study/StudyModules/StudyModuleContent';
import StudyProgressTracker from '../../components/study/StudyProgress/StudyProgressTracker';
import RecursiveStudyFlow from '../../components/study/RecursiveStudy/RecursiveStudyFlow';
import R2RPanel from '../../components/study/RetryRights/R2RPanel';
import pR2RPanel from '../../components/study/RetryRights/pR2RPanel';
import './StudyForgePage.css';

/**
 * Mock study missions data
 */
const MOCK_STUDY_MISSIONS = [
  {
    id: 'sm-1-1',
    title: 'Problem Identification Fundamentals',
    description: 'Learn to identify and articulate real-world problems worth solving.',
    stage: 1,
    status: 'completed',
    progress: 100,
    moduleCount: 4,
    completedModules: 4,
    duration: '30 min',
    difficulty: 'Easy',
    r2rReward: 1,
    xpReward: 50,
    tags: ['fundamentals', 'problem-solving'],
  },
  {
    id: 'sm-1-2',
    title: 'Customer Discovery Techniques',
    description: 'Master the art of understanding your target customers through research and interviews.',
    stage: 1,
    status: 'in_progress',
    progress: 60,
    moduleCount: 5,
    completedModules: 3,
    duration: '45 min',
    difficulty: 'Medium',
    r2rReward: 1,
    xpReward: 75,
    tags: ['customer', 'research'],
    isRecommended: true,
  },
  {
    id: 'sm-1-3',
    title: 'Root Cause Analysis',
    description: 'Dig deeper to find the underlying causes of problems, not just symptoms.',
    stage: 1,
    status: 'not_started',
    progress: 0,
    moduleCount: 3,
    completedModules: 0,
    duration: '25 min',
    difficulty: 'Medium',
    r2rReward: 1,
    xpReward: 60,
    tags: ['analysis', 'problem-solving'],
    isNew: true,
  },
  {
    id: 'sm-2-1',
    title: 'Solution Ideation Workshop',
    description: 'Generate and evaluate potential solutions using proven creative frameworks.',
    stage: 2,
    status: 'not_started',
    progress: 0,
    moduleCount: 4,
    completedModules: 0,
    duration: '40 min',
    difficulty: 'Medium',
    r2rReward: 1,
    xpReward: 80,
    tags: ['ideation', 'creativity'],
  },
  {
    id: 'sm-2-2',
    title: 'Prototyping Basics',
    description: 'Create quick, testable prototypes to validate your ideas.',
    stage: 2,
    status: 'not_started',
    progress: 0,
    moduleCount: 5,
    completedModules: 0,
    duration: '50 min',
    difficulty: 'Hard',
    r2rReward: 2,
    xpReward: 100,
    tags: ['prototyping', 'validation'],
    isRequired: true,
  },
];

/**
 * Mock modules data
 */
const MOCK_MODULES = [
  { id: 'mod-1', title: 'Introduction to Problem Identification', contentType: 'video', duration: '8 min', status: 'completed' },
  { id: 'mod-2', title: 'The Problem Statement Framework', contentType: 'reading', duration: '10 min', status: 'completed' },
  { id: 'mod-3', title: 'Practice: Writing Problem Statements', contentType: 'exercise', duration: '15 min', status: 'in_progress' },
  { id: 'mod-4', title: 'Quiz: Problem Identification', contentType: 'quiz', duration: '5 min', status: 'not_started', isLocked: true },
];

/**
 * StudyForgePage Component
 */
const StudyForgePage = () => {
  const navigate = useNavigate();
  const { missionId, moduleId } = useParams();
  const [searchParams] = useSearchParams();
  
  // State
  const [studyMissions, setStudyMissions] = useState(MOCK_STUDY_MISSIONS);
  const [selectedMission, setSelectedMission] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState('forge'); // forge, mission, module, progress, r2r
  
  // User study stats
  const [userStats, setUserStats] = useState({
    modulesCompleted: 7,
    totalModules: 25,
    studyStreak: 5,
    xpEarned: 450,
    r2rAvailable: 3,
    pr2rAvailable: 1,
    barakaBalance: 1250,
    weeklyCompleted: 3,
    weeklyGoal: 5
  });
  
  // Compute derived stats
  const computedStats = useMemo(() => {
    const missionsCompleted = studyMissions.filter(m => m.status === 'completed').length;
    const totalMissions = studyMissions.length;
    const overallProgress = totalMissions > 0 
      ? Math.round((missionsCompleted / totalMissions) * 100)
      : 0;
    
    // Group by stage
    const stageProgress = [1, 2, 3, 4, 5, 6, 7].map(stage => {
      const stageMissions = studyMissions.filter(m => m.stage === stage);
      const completed = stageMissions.filter(m => m.status === 'completed').length;
      return {
        number: stage,
        completed,
        total: stageMissions.length,
        progress: stageMissions.length > 0 ? Math.round((completed / stageMissions.length) * 100) : 0,
        isActive: stage === 1,
        isComplete: stageMissions.length > 0 && completed === stageMissions.length
      };
    }).filter(s => s.total > 0);
    
    return {
      ...userStats,
      missionsCompleted,
      totalMissions,
      overallProgress,
      stageProgress
    };
  }, [studyMissions, userStats]);
  
  // Recommended missions
  const recommendedMissions = useMemo(() => {
    return studyMissions.filter(m => m.isRecommended || m.status === 'in_progress');
  }, [studyMissions]);
  
  // Recently accessed
  const recentlyAccessed = useMemo(() => {
    return studyMissions
      .filter(m => m.status === 'in_progress' || m.status === 'completed')
      .slice(0, 5);
  }, [studyMissions]);
  
  // Load mission modules
  useEffect(() => {
    if (selectedMission) {
      setModules(MOCK_MODULES);
    }
  }, [selectedMission]);
  
  // Handle URL params
  useEffect(() => {
    const viewParam = searchParams.get('view');
    if (viewParam) {
      setView(viewParam);
    }
    
    if (missionId) {
      const mission = studyMissions.find(m => m.id === missionId);
      if (mission) {
        setSelectedMission(mission);
        setView('mission');
      }
    }
  }, [missionId, searchParams, studyMissions]);
  
  // Navigation handlers
  const handleBack = useCallback(() => {
    if (view === 'module') {
      setView('mission');
      setSelectedModule(null);
    } else if (view === 'mission') {
      setView('forge');
      setSelectedMission(null);
    } else {
      navigate('/dashboard');
    }
  }, [view, navigate]);
  
  const handleMissionSelect = useCallback((mission) => {
    setSelectedMission(mission);
    setView('mission');
  }, []);
  
  const handleModuleSelect = useCallback((moduleId) => {
    const module = modules.find(m => m.id === moduleId);
    if (module && !module.isLocked) {
      setSelectedModule(module);
      setView('module');
    }
  }, [modules]);
  
  const handleStartMission = useCallback((missionId) => {
    const mission = studyMissions.find(m => m.id === missionId);
    if (mission) {
      setSelectedMission(mission);
      // Start first uncompleted module
      const firstModule = modules.find(m => m.status !== 'completed');
      if (firstModule) {
        setSelectedModule(firstModule);
        setView('module');
      } else {
        setView('mission');
      }
    }
  }, [studyMissions, modules]);
  
  const handleModuleComplete = useCallback((moduleId) => {
    setModules(prev => prev.map(m => 
      m.id === moduleId ? { ...m, status: 'completed' } : m
    ));
    
    // Update mission progress
    if (selectedMission) {
      setStudyMissions(prev => prev.map(m => {
        if (m.id === selectedMission.id) {
          const completedCount = modules.filter(mod => mod.status === 'completed').length + 1;
          const newProgress = Math.round((completedCount / m.moduleCount) * 100);
          return {
            ...m,
            progress: newProgress,
            completedModules: completedCount,
            status: newProgress >= 100 ? 'completed' : 'in_progress'
          };
        }
        return m;
      }));
    }
  }, [selectedMission, modules]);
  
  const handleNextModule = useCallback(() => {
    if (!selectedModule || !modules.length) return;
    
    const currentIndex = modules.findIndex(m => m.id === selectedModule.id);
    if (currentIndex < modules.length - 1) {
      const nextModule = modules[currentIndex + 1];
      if (!nextModule.isLocked) {
        setSelectedModule(nextModule);
      }
    }
  }, [selectedModule, modules]);
  
  const handlePreviousModule = useCallback(() => {
    if (!selectedModule || !modules.length) return;
    
    const currentIndex = modules.findIndex(m => m.id === selectedModule.id);
    if (currentIndex > 0) {
      setSelectedModule(modules[currentIndex - 1]);
    }
  }, [selectedModule, modules]);
  
  const handleUseR2R = useCallback(async (type) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUserStats(prev => ({
      ...prev,
      [type === 'r2r' ? 'r2rAvailable' : 'pr2rAvailable']: 
        prev[type === 'r2r' ? 'r2rAvailable' : 'pr2rAvailable'] - 1
    }));
    
    console.log(`Used ${type.toUpperCase()}`);
  }, []);
  
  const handlePurchasePR2R = useCallback(async (quantity) => {
    const cost = quantity * 100;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUserStats(prev => ({
      ...prev,
      pr2rAvailable: prev.pr2rAvailable + quantity,
      barakaBalance: prev.barakaBalance - cost
    }));
  }, []);
  
  // Render based on view
  const renderContent = () => {
    switch (view) {
      case 'module':
        return (
          <div className="study-forge-page__module-view">
            <StudyModuleContent
              module={selectedModule}
              onBack={() => setView('mission')}
              onComplete={handleModuleComplete}
              onNext={handleNextModule}
              onPrevious={handlePreviousModule}
              hasNext={modules.findIndex(m => m.id === selectedModule?.id) < modules.length - 1}
              hasPrevious={modules.findIndex(m => m.id === selectedModule?.id) > 0}
            />
          </div>
        );
      
      case 'mission':
        return (
          <div className="study-forge-page__mission-view">
            <div className="study-forge-page__mission-main">
              <StudyMissionDetail
                mission={selectedMission}
                modules={modules}
                currentModuleId={selectedModule?.id}
                onBack={handleBack}
                onStartMission={handleStartMission}
                onContinueMission={handleStartMission}
                onModuleSelect={handleModuleSelect}
              />
            </div>
            <aside className="study-forge-page__mission-sidebar">
              <StudyProgressTracker
                variant="compact"
                {...computedStats}
              />
            </aside>
          </div>
        );
      
      case 'progress':
        return (
          <div className="study-forge-page__progress-view">
            <button
              type="button"
              onClick={() => setView('forge')}
              className="study-forge-page__back-btn"
            >
              ← Back to Study Forge
            </button>
            <StudyProgressTracker
              variant="detailed"
              {...computedStats}
              onStageClick={(stage) => console.log('Stage clicked:', stage)}
            />
          </div>
        );
      
      case 'r2r':
        return (
          <div className="study-forge-page__r2r-view">
            <button
              type="button"
              onClick={() => setView('forge')}
              className="study-forge-page__back-btn"
            >
              ← Back to Study Forge
            </button>
            <div className="study-forge-page__r2r-panels">
              <R2RPanel
                available={userStats.r2rAvailable}
                totalEarned={10}
                totalUsed={7}
                onUseRetry={handleUseR2R}
                onEarnMore={() => setView('forge')}
              />
              <pR2RPanel
                available={userStats.pr2rAvailable}
                barakaBalance={userStats.barakaBalance}
                onPurchase={handlePurchasePR2R}
                onUseRetry={handleUseR2R}
              />
            </div>
          </div>
        );
      
      default:
        return (
          <StudyForge
            stats={computedStats}
            studyMissions={studyMissions}
            recommendedMissions={recommendedMissions}
            recentlyAccessed={recentlyAccessed}
            onBack={handleBack}
            onMissionSelect={handleMissionSelect}
            onStartStudy={() => {
              const inProgress = studyMissions.find(m => m.status === 'in_progress');
              if (inProgress) {
                handleMissionSelect(inProgress);
              }
            }}
          />
        );
    }
  };
  
  return (
    <div className="study-forge-page">
      {renderContent()}
    </div>
  );
};

export default StudyForgePage;