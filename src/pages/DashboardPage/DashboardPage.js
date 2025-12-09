/**
 * GPS Lab Platform - DashboardPage Component
 * 
 * Main dashboard page composing all dashboard components.
 * 
 * @module pages/DashboardPage
 */

import React, { useState, useCallback, useMemo } from 'react';

// Dashboard Components
import DashboardOverview from '../../components/dashboard/DashboardOverview/DashboardOverview';
import StageProgressMap from '../../components/dashboard/StageProgress/StageProgressMap';
import QuickActions from '../../components/dashboard/QuickActions/QuickActions';
import RecentActivity from '../../components/dashboard/RecentActivity/RecentActivity';
import CommandCenter from '../../components/dashboard/CommandCenter/CommandCenter';

import './DashboardPage.css';

/**
 * Mock data for dashboard
 */
const MOCK_ACTIVITIES = [
  {
    id: '1',
    type: 'mission_complete',
    title: 'Completed "Understanding Variables"',
    description: 'Mission 3 of Stage 1',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    reward: 50,
    rewardType: 'xp'
  },
  {
    id: '2',
    type: 'baraka_earned',
    title: 'Earned 25 Baraka',
    description: 'Daily streak bonus',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    reward: 25,
    rewardType: 'baraka'
  },
  {
    id: '3',
    type: 'achievement_unlocked',
    title: 'Achievement: Quick Learner',
    description: 'Completed 5 missions in one day',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    reward: 100,
    rewardType: 'xp'
  },
  {
    id: '4',
    type: 'party_joined',
    title: 'Joined "Code Warriors" party',
    description: '5 members',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    type: 'stage_complete',
    title: 'Completed Stage 1: Foundation',
    description: 'Adventure 1 progress: 20%',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    reward: 200,
    rewardType: 'xp'
  }
];

const MOCK_OBJECTIVES = [
  { id: '1', text: 'Complete "Data Types" mission', completed: true, reward: 30 },
  { id: '2', text: 'Practice in Study Forge for 30 minutes', completed: false, reward: 20 },
  { id: '3', text: 'Join a study party', completed: false, reward: 25 },
  { id: '4', text: 'Complete 3 bite-sized challenges', completed: false, reward: 15 },
  { id: '5', text: 'Review feedback on last submission', completed: true, reward: 10 }
];

/**
 * DashboardPage Component
 */
const DashboardPage = ({
  user = {},
  stats = {},
  wallets = {},
  onNavigate,
  className = '',
  ...props
}) => {
  const [viewMode, setViewMode] = useState('overview'); // overview, map, command
  
  /**
   * Merged stats with defaults
   */
  const mergedStats = useMemo(() => ({
    currentStage: 2,
    currentXP: 750,
    requiredXP: 1000,
    level: 3,
    missionsCompleted: 12,
    currentStreak: 5,
    barakaBalance: 320,
    xpTrend: 15,
    missionsTrend: 8,
    streakTrend: 2,
    barakaTrend: 12,
    ...stats
  }), [stats]);
  
  /**
   * Current mission mock
   */
  const currentMission = useMemo(() => ({
    id: 'm1',
    type: 'mission',
    title: 'Understanding Functions',
    description: 'Learn how to create and use functions to organize your code.',
    progress: 45,
    stageNumber: 2
  }), []);
  
  /**
   * Navigator message
   */
  const navigatorMessage = useMemo(() => {
    const messages = [
      "You're making great progress! Keep up the momentum.",
      "Your 5-day streak is impressive. Let's keep it going!",
      "Functions are fundamental - mastering them will unlock many possibilities.",
      "Remember, every problem solved makes you a stronger thinker."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }, []);
  
  /**
   * Handle quick action click
   */
  const handleQuickAction = useCallback((actionId) => {
    const routes = {
      'continue-mission': '/missions',
      'start-study': '/study',
      'join-party': '/parties',
      'view-wallet': '/wallet',
      'find-mentor': '/mentors',
      'leaderboard': '/leaderboard'
    };
    
    if (routes[actionId]) {
      onNavigate?.(routes[actionId]);
    }
  }, [onNavigate]);
  
  /**
   * Handle stat click
   */
  const handleStatClick = useCallback((statId) => {
    const routes = {
      stage: '/stages',
      xp: '/profile',
      missions: '/missions',
      streak: '/profile',
      baraka: '/wallet/baraka',
      level: '/profile'
    };
    
    if (routes[statId]) {
      onNavigate?.(routes[statId]);
    }
  }, [onNavigate]);
  
  /**
   * Handle mission start
   */
  const handleStartMission = useCallback((mission) => {
    onNavigate?.(`/missions/${mission.id}`);
  }, [onNavigate]);
  
  /**
   * Handle stage click
   */
  const handleStageClick = useCallback((stageNumber) => {
    onNavigate?.(`/stages/${stageNumber}`);
  }, [onNavigate]);
  
  const classNames = ['dashboard-page', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* View Toggle */}
      <div className="dashboard-page__view-toggle">
        <button
          type="button"
          onClick={() => setViewMode('overview')}
          className={`dashboard-page__view-btn ${viewMode === 'overview' ? 'dashboard-page__view-btn--active' : ''}`}
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
          </svg>
          Overview
        </button>
        <button
          type="button"
          onClick={() => setViewMode('map')}
          className={`dashboard-page__view-btn ${viewMode === 'map' ? 'dashboard-page__view-btn--active' : ''}`}
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd"/>
          </svg>
          Journey Map
        </button>
        <button
          type="button"
          onClick={() => setViewMode('command')}
          className={`dashboard-page__view-btn ${viewMode === 'command' ? 'dashboard-page__view-btn--active' : ''}`}
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM6.5 9.5l2.5 2.5 5-5"/>
          </svg>
          Command Center
        </button>
      </div>
      
      {/* Overview View */}
      {viewMode === 'overview' && (
        <div className="dashboard-page__overview">
          {/* Stats and Activity */}
          <DashboardOverview
            user={user}
            stats={mergedStats}
            activities={MOCK_ACTIVITIES}
            onStatClick={handleStatClick}
          />
          
          {/* Two Column Layout */}
          <div className="dashboard-page__grid">
            {/* Quick Actions */}
            <QuickActions
              onAction={handleQuickAction}
              columns={2}
            />
            
            {/* Recent Activity */}
            <RecentActivity
              activities={MOCK_ACTIVITIES}
              maxItems={5}
              onViewAll={() => onNavigate?.('/activity')}
            />
          </div>
        </div>
      )}
      
      {/* Map View */}
      {viewMode === 'map' && (
        <div className="dashboard-page__map">
          <StageProgressMap
            currentStage={mergedStats.currentStage}
            onStageClick={handleStageClick}
            expandedView={true}
          />
        </div>
      )}
      
      {/* Command Center View */}
      {viewMode === 'command' && (
        <div className="dashboard-page__command">
          <CommandCenter
            user={user}
            currentStage={mergedStats.currentStage}
            currentMission={currentMission}
            objectives={MOCK_OBJECTIVES}
            navigatorMessage={navigatorMessage}
            onStartMission={handleStartMission}
            onMissionClick={(node) => onNavigate?.(`/missions/${node.id}`)}
            onViewObjectives={() => onNavigate?.('/objectives')}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;