/**
 * GPS Lab Platform - DashboardPage Component
 * * Main dashboard page composing all dashboard components.
 * * UPDATED: GPS 101 Integration - Full GPS 101 support
 * * @module pages/DashboardPage
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
 * Mock GPS 101 activities
 */
const MOCK_GPS101_ACTIVITIES = [
  {
    id: 'gps101-1',
    type: 'gps101_enrolled',
    title: 'Enrolled in GPS 101 Basic',
    description: 'Started your purpose discovery journey',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    reward: 100,
    rewardType: 'baraka'
  },
  {
    id: 'gps101-2',
    type: 'gps101_checkpoint_passed',
    title: 'Checkpoint 1-1 Passed',
    description: 'Identity Exploration checkpoint completed',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    reward: 50,
    rewardType: 'xp'
  },
  {
    id: 'gps101-3',
    type: 'gps101_deliverable_saved',
    title: 'Stage 1 Deliverable Saved',
    description: 'Identity Map saved to portfolio',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    reward: 200,
    rewardType: 'baraka'
  }
];

/**
 * Mock regular activities
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
  // GPS 101 Props
  gps101Enrolled = false, 
  gps101CurrentStage = 1,
  gps101Progress = 0,
  gps101Stats = {},
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
   * GPS 101 Stats with defaults
   */
  const mergedGPS101Stats = useMemo(() => ({
    currentStage: gps101CurrentStage,
    stageTrend: 1,
    checkpointsPassed: 3,
    checkpointsTrend: 2,
    deliverablesCompleted: 1,
    orangeBeaconProgress: 15, // 15% toward 5,000 Baraka
    beaconTrend: 5,
    ...gps101Stats
  }), [gps101CurrentStage, gps101Stats]);
  
  /**
   * Combined activities (GPS 101 + Regular)
   */
  const allActivities = useMemo(() => {
    if (gps101Enrolled) {
      return [...MOCK_GPS101_ACTIVITIES, ...MOCK_ACTIVITIES]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    return MOCK_ACTIVITIES;
  }, [gps101Enrolled]);
  
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
   * Navigator message based on GPS 101 or regular
   */
  const navigatorMessage = useMemo(() => {
    if (gps101Enrolled) {
      const gps101Messages = {
        1: "Great start! Discovering who you are is the first step to finding your purpose.",
        2: "You're exploring deep questions. The problem that breaks your heart is waiting to be found.",
        3: "Understanding those affected by your problem will shape your purpose.",
        4: "You're close! Your purpose is emerging from your identity and problem.",
        5: "Final stage! Design a project that embodies your life purpose."
      };
      return gps101Messages[gps101CurrentStage] || "Keep going on your GPS 101 journey!";
    }
    
    return "Are you ready to discover your life purpose? Enroll in GPS 101 today.";
  }, [gps101Enrolled, gps101CurrentStage]);
  
  /**
   * Handle quick action click
   */
  const handleQuickAction = useCallback((actionId) => {
    const routes = {
      // GPS 101 Actions
      'continue-gps101': '/gps101',
      'submit-checkpoint': '/gps101/checkpoint',
      'save-deliverable': '/gps101/deliverable',
      'view-gps101-progress': '/gps101/dashboard',
      // Regular Actions
      'continue-mission': '/missions',
      'start-study': '/study',
      'join-party': '/parties',
      'view-wallet': '/wallet',
      'find-mentor': '/mentors',
      'leaderboard': '/leaderboard',
      'create-problem-showcase': '/gpo-call'
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
      level: '/profile',
      // GPS 101 Stats
      'gps101-stage': '/gps101',
      'gps101-checkpoints': '/gps101/checkpoints',
      'gps101-deliverables': '/gps101/deliverables',
      'orange-beacon': '/gps101/orange-beacon',
      'enroll-gps101': '/gps101' // Routes to landing page for unenrolled
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
   * Handle GPS 101 click
   */
  const handleGPS101Click = useCallback(() => {
    onNavigate?.('/gps101');
  }, [onNavigate]);
  
  /**
   * Handle GPS 101 enrollment
   */
  const handleStartGPS101 = useCallback(() => {
    onNavigate?.('/gps101/enroll');
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
          {/* Stats and Activity with GPS 101 */}
          <DashboardOverview
            user={user}
            stats={mergedStats}
            activities={allActivities}
            gps101Enrolled={gps101Enrolled}
            gps101Stats={mergedGPS101Stats}
            onStatClick={handleStatClick}
          />
          
          {/* Two Column Layout */}
          <div className="dashboard-page__grid">
            {/* Quick Actions with GPS 101 */}
            <QuickActions
              onAction={handleQuickAction}
              columns={2}
              gps101Enrolled={gps101Enrolled}
              showGPS101Actions={true} // ALWAYS show GPS actions to tease it
            />
            
            {/* Recent Activity */}
            <RecentActivity
              activities={allActivities}
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
            gps101Enrolled={gps101Enrolled}
            gps101CurrentStage={gps101CurrentStage}
            showGPS101Track={true}
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
            // GPS 101 Props
            gps101Enrolled={gps101Enrolled}
            gps101CurrentStage={gps101CurrentStage}
            gps101Progress={gps101Progress}
            gps101NextCheckpoint="Complete Checkpoint 2-1: Problem Research"
            gps101OrangeBeaconProgress={mergedGPS101Stats.orangeBeaconProgress}
            onStartMission={handleStartMission}
            onMissionClick={(node) => onNavigate?.(`/missions/${node.id}`)}
            onViewObjectives={() => onNavigate?.('/objectives')}
            onGPS101Click={handleGPS101Click}
            onStartGPS101={handleStartGPS101}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;