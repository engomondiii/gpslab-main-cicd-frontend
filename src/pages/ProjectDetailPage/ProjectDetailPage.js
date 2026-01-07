/**
 * GPS Lab Platform - ProjectDetailPage
 * 
 * Page for viewing and managing a single project with
 * overview, metrics, impact, and missions.
 * 
 * @module pages/ProjectDetailPage
 */

import React, { useState, useCallback, useEffect } from 'react';
import { ProjectDetail } from '../../components/project/ProjectDetail';
import './ProjectDetailPage.css';

/**
 * Mock project data
 */
const MOCK_PROJECT = {
  id: 'project-1',
  name: 'Agri-Chain Connect',
  description: 'Blockchain-based agricultural marketplace transforming smallholder farmers\' future harvests into tradeable digital assets. Our platform eliminates exploitative middlemen who capture 80-90% of agricultural value while farmers receive only 10-20%.',
  stage: 5,
  status: 'active',
  progress: 72,
  category: 'Agriculture',
  tags: ['blockchain', 'agriculture', 'fintech', 'east-africa', 'social-impact'],
  team: [
    { id: 'user-1', name: 'John Doe', role: 'owner', avatar: null },
    { id: 'user-2', name: 'Jane Smith', role: 'co-founder', avatar: null },
    { id: 'user-3', name: 'Mike Johnson', role: 'developer', avatar: null },
    { id: 'user-4', name: 'Sarah Williams', role: 'marketing', avatar: null }
  ],
  problemStatement: 'Smallholder farmers in East Africa receive only 10-20% of the final value of their agricultural products. Exploitative middlemen and lack of access to fair markets trap farmers in cycles of poverty despite producing valuable crops.',
  targetAudience: 'Smallholder farmers across Kenya, Tanzania, Uganda, Rwanda, and Ethiopia, primarily those with 1-5 hectares of land growing cash crops like coffee, tea, and vegetables.',
  createdAt: '2024-06-15T10:00:00Z',
  updatedAt: '2025-01-05T14:30:00Z',
  isFeatured: true,
  metrics: {
    customers: 12000,
    customersChange: 15.3,
    revenue: 450000,
    revenueChange: 22.8,
    users: 85000,
    usersChange: 18.5,
    retention: 78,
    retentionChange: 3.2,
    missionsCompleted: 24,
    bitesSubmitted: 156,
    checkpointsPassed: 8,
    studyHours: 245,
    barakaEarned: 15600,
    xpEarned: 48500,
    weeklyData: [45, 62, 58, 75, 82, 90, 88],
    milestones: [
      { name: 'Problem Validation', completed: true, date: 'Jul 2024' },
      { name: 'MVP Launch', completed: true, date: 'Sep 2024' },
      { name: 'First 1000 Users', completed: true, date: 'Oct 2024' },
      { name: 'Partnership Secured', completed: true, date: 'Nov 2024' },
      { name: '10,000 Users', completed: true, date: 'Dec 2024' },
      { name: 'Series A', completed: false }
    ]
  },
  impact: {
    livesImpacted: 85000,
    communitiesServed: 156,
    problemsSolved: 12000,
    sustainableValue: 2400000,
    sdgGoals: [1, 2, 8, 9, 10],
    impactStories: [
      {
        title: 'Maria\'s Coffee Revolution',
        description: 'Maria, a coffee farmer in Nyeri, increased her income by 127% after joining Agri-Chain Connect. She now sells directly to roasters in Europe.',
        image: null,
        date: 'December 2024'
      },
      {
        title: 'Cooperative Success Story',
        description: 'The Muranga Farmers Cooperative saw their collective income rise from $50,000 to $180,000 annually through our platform.',
        image: null,
        date: 'November 2024'
      }
    ],
    evidence: [
      { title: 'Q4 2024 Impact Report', type: 'report', url: '#' },
      { title: 'Farmer Income Analysis', type: 'data', url: '#' },
      { title: 'Community Testimonials', type: 'video', url: '#' }
    ],
    testimonials: [
      {
        quote: 'Agri-Chain Connect changed my life. I now earn what my crops are truly worth.',
        name: 'Maria Wanjiku',
        role: 'Coffee Farmer, Nyeri',
        avatar: null
      },
      {
        quote: 'This platform has transformed how our cooperative does business. We\'re now connected to global markets.',
        name: 'Peter Ochieng',
        role: 'Cooperative Chairman',
        avatar: null
      }
    ]
  }
};

/**
 * Mock missions data
 */
const MOCK_MISSIONS = [
  {
    id: 'mission-1',
    name: 'Problem Validation',
    stage: 1,
    status: 'completed',
    progress: 100
  },
  {
    id: 'mission-2',
    name: 'Customer Discovery',
    stage: 2,
    status: 'completed',
    progress: 100
  },
  {
    id: 'mission-3',
    name: 'Solution Design',
    stage: 3,
    status: 'completed',
    progress: 100
  },
  {
    id: 'mission-4',
    name: 'MVP Development',
    stage: 4,
    status: 'completed',
    progress: 100
  },
  {
    id: 'mission-5',
    name: 'Beta Testing',
    stage: 5,
    status: 'in_progress',
    progress: 65
  },
  {
    id: 'mission-6',
    name: 'Market Launch',
    stage: 6,
    status: 'pending',
    progress: 0
  }
];

/**
 * Current user mock data
 */
const CURRENT_USER = {
  id: 'user-1',
  name: 'John Doe',
  stage: 5
};

/**
 * ProjectDetailPage Component
 */
const ProjectDetailPage = ({ projectId, className = '', ...props }) => {
  const [project, setProject] = useState(null);
  const [missions, setMissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Simulate loading project data
  useEffect(() => {
    const loadProject = async () => {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In real app, fetch by projectId
      setProject(MOCK_PROJECT);
      setMissions(MOCK_MISSIONS);
      setIsLoading(false);
    };
    
    loadProject();
  }, [projectId]);
  
  const handleBack = useCallback(() => {
    window.location.href = '/projects';
  }, []);
  
  const handleEditProject = useCallback(() => {
    console.log('Edit project:', project?.id);
    // Would open edit modal
  }, [project]);
  
  const handleInviteTeam = useCallback(() => {
    console.log('Invite team to project:', project?.id);
    // Would open invite modal
  }, [project]);
  
  const handleDeleteProject = useCallback((projectId) => {
    console.log('Delete project:', projectId);
    // Would delete and redirect
    window.location.href = '/projects';
  }, []);
  
  const handleStartMission = useCallback(() => {
    console.log('Start new mission for project:', project?.id);
    // Would navigate to mission selection
  }, [project]);
  
  const handleViewMission = useCallback((missionId) => {
    console.log('View mission:', missionId);
    // Would navigate to mission detail
    window.location.href = `/missions/${missionId}`;
  }, []);
  
  const classNames = [
    'project-detail-page',
    isLoading && 'project-detail-page--loading',
    className
  ].filter(Boolean).join(' ');
  
  if (isLoading) {
    return (
      <div className={classNames}>
        <div className="project-detail-page__loading">
          <div className="project-detail-page__spinner" />
          <p>Loading project...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={classNames}>
        <div className="project-detail-page__error">
          <span className="project-detail-page__error-icon">⚠️</span>
          <h3>Error Loading Project</h3>
          <p>{error}</p>
          <button
            type="button"
            onClick={handleBack}
            className="project-detail-page__back-btn"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className={classNames}>
        <div className="project-detail-page__not-found">
          <span className="project-detail-page__not-found-icon">🔍</span>
          <h3>Project Not Found</h3>
          <p>The project you're looking for doesn't exist or has been deleted.</p>
          <button
            type="button"
            onClick={handleBack}
            className="project-detail-page__back-btn"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={classNames} {...props}>
      <ProjectDetail
        project={project}
        missions={missions}
        currentUserId={CURRENT_USER.id}
        onBack={handleBack}
        onEditProject={handleEditProject}
        onInviteTeam={handleInviteTeam}
        onDeleteProject={handleDeleteProject}
        onStartMission={handleStartMission}
        onViewMission={handleViewMission}
      />
    </div>
  );
};

export default ProjectDetailPage;