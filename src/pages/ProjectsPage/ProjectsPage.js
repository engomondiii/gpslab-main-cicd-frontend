/**
 * GPS Lab Platform - ProjectsPage
 * 
 * Main page for browsing, searching, and managing projects.
 * Integrates ProjectList and CreateProjectForm components.
 * 
 * @module pages/ProjectsPage
 */

import React, { useState, useCallback } from 'react';
import { ProjectList } from '../../components/project/ProjectList';
import { CreateProjectForm } from '../../components/project/ProjectCreation';
import './ProjectsPage.css';

/**
 * Mock data for projects
 */
const MOCK_PROJECTS = [
  {
    id: 'project-1',
    name: 'Agri-Chain Connect',
    description: 'Blockchain-based agricultural marketplace transforming smallholder farmers\' future harvests into tradeable digital assets.',
    stage: 5,
    status: 'active',
    progress: 72,
    category: 'Agriculture',
    tags: ['blockchain', 'agriculture', 'fintech'],
    team: [
      { id: 'user-1', name: 'John Doe', role: 'owner', avatar: null },
      { id: 'user-2', name: 'Jane Smith', role: 'member', avatar: null },
      { id: 'user-3', name: 'Mike Johnson', role: 'member', avatar: null }
    ],
    impact: {
      customers: 12000,
      revenue: 450000,
      users: 85000
    },
    problemStatement: 'Smallholder farmers receive only 10-20% of agricultural value while middlemen capture 80-90%.',
    targetAudience: 'Smallholder farmers in East Africa',
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2025-01-05T14:30:00Z',
    isFeatured: true
  },
  {
    id: 'project-2',
    name: 'EduBridge Kenya',
    description: 'Mobile learning platform providing quality education content to underserved communities.',
    stage: 4,
    status: 'active',
    progress: 58,
    category: 'Education',
    tags: ['education', 'mobile', 'accessibility'],
    team: [
      { id: 'user-4', name: 'Sarah Williams', role: 'owner', avatar: null },
      { id: 'user-5', name: 'David Brown', role: 'member', avatar: null }
    ],
    impact: {
      customers: 5500,
      users: 42000
    },
    createdAt: '2024-08-20T09:00:00Z',
    updatedAt: '2025-01-04T16:45:00Z',
    isFeatured: false
  },
  {
    id: 'project-3',
    name: 'CleanWater Solutions',
    description: 'IoT-enabled water purification systems for rural communities with real-time monitoring.',
    stage: 3,
    status: 'active',
    progress: 35,
    category: 'Environment',
    tags: ['water', 'iot', 'sustainability'],
    team: [
      { id: 'user-6', name: 'Emily Chen', role: 'owner', avatar: null }
    ],
    impact: {
      users: 15000
    },
    createdAt: '2024-10-01T11:30:00Z',
    updatedAt: '2025-01-03T10:15:00Z',
    isFeatured: false
  },
  {
    id: 'project-4',
    name: 'HealthConnect',
    description: 'Telemedicine platform connecting rural patients with urban healthcare professionals.',
    stage: 6,
    status: 'completed',
    progress: 100,
    category: 'Healthcare',
    tags: ['healthcare', 'telemedicine', 'rural'],
    team: [
      { id: 'user-7', name: 'Dr. Robert Lee', role: 'owner', avatar: null },
      { id: 'user-8', name: 'Nurse Alice', role: 'member', avatar: null },
      { id: 'user-9', name: 'Tech Lead Tom', role: 'member', avatar: null },
      { id: 'user-10', name: 'Product Maria', role: 'member', avatar: null }
    ],
    impact: {
      customers: 28000,
      revenue: 1200000,
      users: 150000
    },
    createdAt: '2023-09-15T08:00:00Z',
    updatedAt: '2024-12-20T12:00:00Z',
    isFeatured: true
  },
  {
    id: 'project-5',
    name: 'SolarPay Africa',
    description: 'Pay-as-you-go solar energy solutions with mobile money integration.',
    stage: 5,
    status: 'active',
    progress: 67,
    category: 'Energy',
    tags: ['solar', 'fintech', 'energy'],
    team: [
      { id: 'user-11', name: 'Frank Solar', role: 'owner', avatar: null },
      { id: 'user-12', name: 'Grace Power', role: 'member', avatar: null }
    ],
    impact: {
      customers: 8500,
      revenue: 320000,
      users: 35000
    },
    createdAt: '2024-03-10T14:00:00Z',
    updatedAt: '2025-01-02T09:30:00Z',
    isFeatured: false
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
 * ProjectsPage Component
 */
const ProjectsPage = ({ className = '', ...props }) => {
  const [view, setView] = useState('list'); // list, create
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get user's projects
  const myProjects = projects.filter(p => 
    p.team.some(m => m.id === CURRENT_USER.id)
  );
  
  const handleProjectSelect = useCallback((projectId) => {
    // Navigate to project detail
    window.location.href = `/projects/${projectId}`;
  }, []);
  
  const handleProjectEdit = useCallback((projectId) => {
    console.log('Edit project:', projectId);
    // Would open edit modal or navigate to edit page
  }, []);
  
  const handleCreateProject = useCallback(() => {
    setView('create');
  }, []);
  
  const handleCancelCreate = useCallback(() => {
    setView('list');
  }, []);
  
  const handleSubmitProject = useCallback(async (formData) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newProject = {
      id: `project-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      stage: formData.stage,
      status: 'active',
      progress: 0,
      category: formData.category,
      tags: formData.tags,
      team: [{ id: CURRENT_USER.id, name: CURRENT_USER.name, role: 'owner', avatar: null }],
      impact: {},
      problemStatement: formData.problemStatement,
      targetAudience: formData.targetAudience,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFeatured: false
    };
    
    setProjects(prev => [newProject, ...prev]);
    setIsLoading(false);
    setView('list');
    
    // Navigate to new project
    window.location.href = `/projects/${newProject.id}`;
  }, []);
  
  const classNames = [
    'projects-page',
    `projects-page--${view}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {view === 'list' && (
        <ProjectList
          projects={projects}
          myProjects={myProjects}
          currentUserId={CURRENT_USER.id}
          onProjectSelect={handleProjectSelect}
          onProjectEdit={handleProjectEdit}
          onCreateProject={handleCreateProject}
          isLoading={isLoading}
        />
      )}
      
      {view === 'create' && (
        <div className="projects-page__create">
          <button
            type="button"
            onClick={handleCancelCreate}
            className="projects-page__back-btn"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
            Back to Projects
          </button>
          
          <CreateProjectForm
            onSubmit={handleSubmitProject}
            onCancel={handleCancelCreate}
            isLoading={isLoading}
            userStage={CURRENT_USER.stage}
          />
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;