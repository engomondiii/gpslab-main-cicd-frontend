/**
 * GPS Lab Platform - BiteBoardPage Component
 * 
 * Page component for the Kanban-style bite/task board.
 * 
 * @module pages/BiteBoardPage
 */

import React, { useState, useCallback } from 'react';
import BiteBoard from '../components/bite/BiteBoard/BiteBoard';
import './BiteBoardPage.css';

/**
 * Mock data for development
 */
const MOCK_BITES = [
  {
    id: 'bite-001',
    title: 'Set up React project structure',
    description: 'Initialize the project with proper folder organization and configuration',
    type: 'coding',
    status: 'completed',
    priority: 'high',
    estimatedTime: 60,
    actualTime: 45,
    progress: 100,
    xpReward: 150,
    barakaReward: 25,
    missionId: 'mission-001',
    missionTitle: 'Foundation Setup',
    stageNumber: 1,
    tags: ['react', 'setup'],
    assignee: { name: 'Explorer', avatar: null }
  },
  {
    id: 'bite-002',
    title: 'Implement user authentication flow',
    description: 'Create login, register, and password reset functionality',
    type: 'coding',
    status: 'in_progress',
    priority: 'critical',
    estimatedTime: 180,
    progress: 60,
    xpReward: 300,
    barakaReward: 50,
    missionId: 'mission-001',
    missionTitle: 'Foundation Setup',
    stageNumber: 2,
    tags: ['auth', 'security'],
    assignee: { name: 'Explorer', avatar: null }
  },
  {
    id: 'bite-003',
    title: 'Design dashboard wireframes',
    description: 'Create low-fidelity wireframes for the main dashboard',
    type: 'design',
    status: 'review',
    priority: 'medium',
    estimatedTime: 120,
    progress: 100,
    xpReward: 200,
    barakaReward: 35,
    missionId: 'mission-002',
    missionTitle: 'Dashboard Design',
    stageNumber: 1,
    tags: ['design', 'ux'],
    dueDate: '2024-02-15',
    assignee: { name: 'Explorer', avatar: null }
  },
  {
    id: 'bite-004',
    title: 'Research state management options',
    description: 'Compare Redux, Zustand, and Context API for our use case',
    type: 'research',
    status: 'planned',
    priority: 'low',
    estimatedTime: 90,
    xpReward: 100,
    barakaReward: 15,
    missionId: 'mission-001',
    missionTitle: 'Foundation Setup',
    stageNumber: 3,
    tags: ['research', 'architecture']
  },
  {
    id: 'bite-005',
    title: 'Write API documentation',
    description: 'Document all API endpoints with examples and schemas',
    type: 'writing',
    status: 'backlog',
    priority: 'medium',
    estimatedTime: 150,
    xpReward: 175,
    barakaReward: 30,
    missionId: 'mission-003',
    missionTitle: 'Documentation',
    stageNumber: 1,
    tags: ['docs', 'api']
  },
  {
    id: 'bite-006',
    title: 'Complete React fundamentals quiz',
    description: 'Test your knowledge of React hooks and component lifecycle',
    type: 'quiz',
    status: 'backlog',
    priority: 'low',
    estimatedTime: 30,
    xpReward: 75,
    barakaReward: 10,
    missionId: 'mission-001',
    missionTitle: 'Foundation Setup',
    stageNumber: 4,
    tags: ['quiz', 'react']
  },
  {
    id: 'bite-007',
    title: 'Fix navigation bug on mobile',
    description: 'Menu doesn\'t close after selecting an item on mobile devices',
    type: 'task',
    status: 'blocked',
    priority: 'high',
    estimatedTime: 45,
    xpReward: 100,
    barakaReward: 20,
    missionId: 'mission-002',
    missionTitle: 'Dashboard Design',
    stageNumber: 2,
    tags: ['bug', 'mobile'],
    blockedBy: ['bite-002'],
    dependencyCount: 1
  },
  {
    id: 'bite-008',
    title: 'Implement dark mode toggle',
    description: 'Add theme switching functionality with persistence',
    type: 'coding',
    status: 'planned',
    priority: 'medium',
    estimatedTime: 60,
    xpReward: 125,
    barakaReward: 20,
    missionId: 'mission-002',
    missionTitle: 'Dashboard Design',
    stageNumber: 3,
    tags: ['feature', 'theme'],
    dueDate: '2024-02-20'
  }
];

/**
 * BiteBoardPage Component
 */
const BiteBoardPage = () => {
  const [bites, setBites] = useState(MOCK_BITES);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleBiteClick = useCallback((biteId) => {
    console.log('Navigate to bite detail:', biteId);
    // TODO: Navigate to bite detail page
  }, []);
  
  const handleBiteStatusChange = useCallback((biteId, newStatus) => {
    setBites(prev => prev.map(bite =>
      bite.id === biteId ? { ...bite, status: newStatus } : bite
    ));
  }, []);
  
  const handleAddBite = useCallback((status) => {
    console.log('Add new bite with status:', status);
    // TODO: Open bite creation modal
  }, []);
  
  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  
  return (
    <div className="bite-board-page">
      {/* Page Header */}
      <div className="bite-board-page__header">
        <div className="bite-board-page__header-content">
          <h1 className="bite-board-page__title">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
            Task Board
          </h1>
          <p className="bite-board-page__subtitle">
            Manage your learning tasks and track progress
          </p>
        </div>
        
        <div className="bite-board-page__header-actions">
          <button type="button" className="bite-board-page__view-btn bite-board-page__view-btn--active">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
            Board
          </button>
          <button type="button" className="bite-board-page__view-btn">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
            </svg>
            List
          </button>
        </div>
      </div>
      
      {/* Board */}
      <div className="bite-board-page__content">
        <BiteBoard
          bites={bites}
          title="All Tasks"
          subtitle="Drag and drop to change status"
          onBiteClick={handleBiteClick}
          onBiteStatusChange={handleBiteStatusChange}
          onAddBite={handleAddBite}
          onRefresh={handleRefresh}
          showBlockedColumn={true}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default BiteBoardPage;