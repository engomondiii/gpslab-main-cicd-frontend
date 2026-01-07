/**
 * GPS Lab Platform - PartyPage
 * 
 * Main page for the Party System (Collaboration).
 * Integrates all party components for team formation and collaboration.
 * 
 * @module pages/PartyPage/PartyPage
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import PartyList from '../../components/party/PartyList/PartyList';
import PartyDetail from '../../components/party/PartyDetail/PartyDetail';
import CreatePartyForm from '../../components/party/PartyCreation/CreatePartyForm';
import PartyInviteForm from '../../components/party/PartyCreation/PartyInviteForm';
import PartyChat from '../../components/party/PartyChat/PartyChat';
import PartyTaskBoard from '../../components/party/PartyCollaboration/PartyTaskBoard';
import PartyFiles from '../../components/party/PartyCollaboration/PartyFiles';
import './PartyPage.css';

/**
 * Mock current user
 */
const CURRENT_USER = {
  id: 'user-1',
  name: 'Explorer One',
  avatar: null,
  stage: 3
};

/**
 * Mock party data
 */
const MOCK_PARTIES = [
  {
    id: 'party-1',
    name: 'Problem Solvers United',
    description: 'A team dedicated to identifying and solving global challenges together. We focus on healthcare and education problems.',
    stage: 1,
    memberCount: 4,
    maxMembers: 5,
    isPublic: true,
    isActive: true,
    currentQuest: { name: 'Healthcare Access Initiative', progress: 65 },
    lastActivity: new Date().toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['healthcare', 'education', 'social-impact'],
    userRole: 'leader',
    members: [
      { id: 'user-1', name: 'Explorer One', role: 'leader', stage: 3, isOnline: true, contribution: 450 },
      { id: 'user-2', name: 'Sarah Chen', role: 'co_leader', stage: 2, isOnline: true, contribution: 380 },
      { id: 'user-3', name: 'Mike Johnson', role: 'member', stage: 1, isOnline: false, contribution: 220 },
      { id: 'user-4', name: 'Elena Rodriguez', role: 'recruit', stage: 1, isOnline: true, contribution: 150 }
    ],
    stats: { questsCompleted: 3, xpEarned: 1200, daysActive: 14 }
  },
  {
    id: 'party-2',
    name: 'Innovation Lab',
    description: 'Building and testing innovative prototypes. Currently working on sustainable tech solutions.',
    stage: 4,
    memberCount: 3,
    maxMembers: 5,
    isPublic: true,
    isActive: false,
    currentQuest: null,
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['innovation', 'prototyping', 'sustainability'],
    userRole: 'member',
    members: [
      { id: 'user-5', name: 'Alex Thompson', role: 'leader', stage: 5, isOnline: false, contribution: 820 },
      { id: 'user-6', name: 'Jordan Lee', role: 'member', stage: 4, isOnline: true, contribution: 540 },
      { id: 'user-1', name: 'Explorer One', role: 'member', stage: 3, isOnline: true, contribution: 320 }
    ],
    stats: { questsCompleted: 7, xpEarned: 2400, daysActive: 28 }
  },
  {
    id: 'party-3',
    name: 'Design Thinkers',
    description: 'Applying design thinking methodologies to create user-centered solutions.',
    stage: 3,
    memberCount: 5,
    maxMembers: 5,
    isPublic: false,
    isActive: true,
    currentQuest: { name: 'UX Research Sprint', progress: 40 },
    lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['design', 'ux', 'research'],
    members: [
      { id: 'user-7', name: 'Kim Park', role: 'leader', stage: 4, isOnline: true, contribution: 670 },
      { id: 'user-8', name: 'David Wilson', role: 'co_leader', stage: 3, isOnline: true, contribution: 520 },
      { id: 'user-9', name: 'Lisa Zhang', role: 'member', stage: 3, isOnline: false, contribution: 410 },
      { id: 'user-10', name: 'Tom Brown', role: 'member', stage: 2, isOnline: false, contribution: 350 },
      { id: 'user-11', name: 'Anna Miller', role: 'recruit', stage: 2, isOnline: true, contribution: 180 }
    ],
    stats: { questsCompleted: 5, xpEarned: 1800, daysActive: 21 }
  },
  {
    id: 'party-4',
    name: 'Impact Makers',
    description: 'Focused on creating measurable social impact through technology and collaboration.',
    stage: 2,
    memberCount: 2,
    maxMembers: 5,
    isPublic: true,
    isActive: true,
    currentQuest: { name: 'Community Mapping', progress: 20 },
    lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['social-impact', 'community', 'technology'],
    members: [
      { id: 'user-12', name: 'Rachel Green', role: 'leader', stage: 3, isOnline: true, contribution: 280 },
      { id: 'user-13', name: 'James White', role: 'member', stage: 2, isOnline: false, contribution: 120 }
    ],
    stats: { questsCompleted: 1, xpEarned: 400, daysActive: 3 }
  }
];

/**
 * Mock tasks data
 */
const MOCK_TASKS = [
  { id: 't1', title: 'Research local healthcare providers', status: 'done', priority: 'high', assignee: { id: 'user-2', name: 'Sarah Chen' }, dueDate: '2025-01-03' },
  { id: 't2', title: 'Create user interview questions', status: 'in_progress', priority: 'high', assignee: { id: 'user-1', name: 'Explorer One' }, dueDate: '2025-01-08' },
  { id: 't3', title: 'Analyze survey results', status: 'in_progress', priority: 'medium', assignee: { id: 'user-3', name: 'Mike Johnson' }, dueDate: '2025-01-10' },
  { id: 't4', title: 'Draft problem statement', status: 'todo', priority: 'high', assignee: null, dueDate: '2025-01-12' },
  { id: 't5', title: 'Schedule stakeholder meeting', status: 'todo', priority: 'low', assignee: { id: 'user-4', name: 'Elena Rodriguez' }, dueDate: '2025-01-15' },
  { id: 't6', title: 'Compile research findings', status: 'done', priority: 'medium', assignee: { id: 'user-1', name: 'Explorer One' }, dueDate: '2025-01-05' }
];

/**
 * Mock files data
 */
const MOCK_FILES = [
  { id: 'f1', name: 'Research_Summary.pdf', size: 2456000, uploadedAt: '2025-01-05T10:30:00Z', uploadedBy: { name: 'Sarah Chen' } },
  { id: 'f2', name: 'Interview_Questions.docx', size: 45000, uploadedAt: '2025-01-04T14:15:00Z', uploadedBy: { name: 'Explorer One' } },
  { id: 'f3', name: 'Survey_Data.xlsx', size: 180000, uploadedAt: '2025-01-03T09:45:00Z', uploadedBy: { name: 'Mike Johnson' } },
  { id: 'f4', name: 'Meeting_Notes.md', size: 12000, uploadedAt: '2025-01-02T16:20:00Z', uploadedBy: { name: 'Elena Rodriguez' } }
];

/**
 * Mock messages data
 */
const MOCK_MESSAGES = [
  { id: 'm1', content: 'Hey team! Just finished the initial research.', sender: { id: 'user-2', name: 'Sarah Chen', role: 'co_leader' }, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), type: 'text' },
  { id: 'm2', content: 'Great work Sarah! I\'ll review it tonight.', sender: { id: 'user-1', name: 'Explorer One', role: 'leader' }, timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(), type: 'text' },
  { id: 'm3', content: 'Elena Rodriguez joined the party', sender: { id: 'user-4', name: 'Elena Rodriguez' }, timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), type: 'join' },
  { id: 'm4', content: 'Welcome Elena! Excited to have you on the team.', sender: { id: 'user-1', name: 'Explorer One', role: 'leader' }, timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), type: 'text' },
  { id: 'm5', content: 'Thanks! Happy to be here. Ready to contribute!', sender: { id: 'user-4', name: 'Elena Rodriguez', role: 'recruit' }, timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), type: 'text' }
];

/**
 * PartyPage Component
 */
const PartyPage = () => {
  const navigate = useNavigate();
  const { partyId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State
  const [parties, setParties] = useState(MOCK_PARTIES);
  const [selectedParty, setSelectedParty] = useState(null);
  const [view, setView] = useState('list'); // list, detail, create, chat, tasks, files
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [files, setFiles] = useState(MOCK_FILES);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  
  // User's party IDs
  const myPartyIds = useMemo(() => {
    return parties.filter(p => p.userRole).map(p => p.id);
  }, [parties]);
  
  // Load party from URL
  useEffect(() => {
    if (partyId) {
      const party = parties.find(p => p.id === partyId);
      if (party) {
        setSelectedParty(party);
        setView('detail');
      }
    }
    
    const viewParam = searchParams.get('view');
    if (viewParam && ['chat', 'tasks', 'files'].includes(viewParam)) {
      setView(viewParam);
    }
  }, [partyId, searchParams, parties]);
  
  // Navigation handlers
  const handleBack = useCallback(() => {
    if (view === 'chat' || view === 'tasks' || view === 'files') {
      setView('detail');
      setSearchParams({});
    } else if (view === 'detail' || view === 'create') {
      setView('list');
      setSelectedParty(null);
      navigate('/party');
    } else {
      navigate('/dashboard');
    }
  }, [view, navigate, setSearchParams]);
  
  const handlePartySelect = useCallback((partyId) => {
    const party = parties.find(p => p.id === partyId);
    if (party) {
      setSelectedParty(party);
      setView('detail');
      navigate(`/party/${partyId}`);
    }
  }, [parties, navigate]);
  
  const handlePartyJoin = useCallback(async (partyId) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setParties(prev => prev.map(p => {
      if (p.id === partyId) {
        return {
          ...p,
          memberCount: p.memberCount + 1,
          userRole: 'recruit',
          members: [...p.members, { ...CURRENT_USER, role: 'recruit', isOnline: true, contribution: 0 }]
        };
      }
      return p;
    }));
    
    setIsLoading(false);
    handlePartySelect(partyId);
  }, [handlePartySelect]);
  
  const handleCreateParty = useCallback(async (formData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newParty = {
      id: `party-${Date.now()}`,
      ...formData,
      memberCount: 1,
      isActive: true,
      currentQuest: null,
      lastActivity: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      userRole: 'leader',
      members: [{ ...CURRENT_USER, role: 'leader', isOnline: true, contribution: 0 }],
      stats: { questsCompleted: 0, xpEarned: 0, daysActive: 0 }
    };
    
    setParties(prev => [newParty, ...prev]);
    setSelectedParty(newParty);
    setView('detail');
    setIsLoading(false);
    navigate(`/party/${newParty.id}`);
  }, [navigate]);
  
  const handleLeaveParty = useCallback(async (partyId) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setParties(prev => prev.map(p => {
      if (p.id === partyId) {
        return {
          ...p,
          memberCount: p.memberCount - 1,
          userRole: undefined,
          members: p.members.filter(m => m.id !== CURRENT_USER.id)
        };
      }
      return p;
    }));
    
    setSelectedParty(null);
    setView('list');
    setIsLoading(false);
    navigate('/party');
  }, [navigate]);
  
  const handleInvite = useCallback(async (inviteData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowInviteModal(false);
  }, []);
  
  const handleSendMessage = useCallback((content) => {
    const newMessage = {
      id: `m${Date.now()}`,
      content,
      sender: { ...CURRENT_USER, role: selectedParty?.members.find(m => m.id === CURRENT_USER.id)?.role },
      timestamp: new Date().toISOString(),
      type: 'text'
    };
    setMessages(prev => [...prev, newMessage]);
  }, [selectedParty]);
  
  const handleAddTask = useCallback((taskData) => {
    const newTask = {
      id: `t${Date.now()}`,
      ...taskData,
      status: 'todo'
    };
    setTasks(prev => [...prev, newTask]);
  }, []);
  
  const handleTaskStatusChange = useCallback((taskId, newStatus) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    ));
  }, []);
  
  const handleUploadFile = useCallback(async (file) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newFile = {
      id: `f${Date.now()}`,
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      uploadedBy: { name: CURRENT_USER.name }
    };
    setFiles(prev => [newFile, ...prev]);
  }, []);
  
  const handleDeleteFile = useCallback((fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);
  
  // Render based on view
  const renderContent = () => {
    switch (view) {
      case 'create':
        return (
          <div className="party-page__create">
            <CreatePartyForm
              onSubmit={handleCreateParty}
              onCancel={handleBack}
              isLoading={isLoading}
              userStage={CURRENT_USER.stage}
            />
          </div>
        );
      
      case 'chat':
        return (
          <div className="party-page__chat">
            <button type="button" onClick={handleBack} className="party-page__back-btn">
              ← Back to Party
            </button>
            <PartyChat
              partyId={selectedParty?.id}
              partyName={selectedParty?.name}
              messages={messages}
              currentUserId={CURRENT_USER.id}
              onSendMessage={handleSendMessage}
            />
          </div>
        );
      
      case 'tasks':
        return (
          <div className="party-page__tasks">
            <button type="button" onClick={handleBack} className="party-page__back-btn">
              ← Back to Party
            </button>
            <PartyTaskBoard
              tasks={tasks}
              onAddTask={handleAddTask}
              onTaskStatusChange={handleTaskStatusChange}
              canManage={selectedParty?.userRole === 'leader' || selectedParty?.userRole === 'co_leader'}
            />
          </div>
        );
      
      case 'files':
        return (
          <div className="party-page__files">
            <button type="button" onClick={handleBack} className="party-page__back-btn">
              ← Back to Party
            </button>
            <PartyFiles
              files={files}
              onUpload={handleUploadFile}
              onDelete={handleDeleteFile}
              onDownload={(file) => console.log('Download:', file)}
              onPreview={(file) => console.log('Preview:', file)}
              canUpload={!!selectedParty?.userRole}
              canDelete={selectedParty?.userRole === 'leader' || selectedParty?.userRole === 'co_leader'}
            />
          </div>
        );
      
      case 'detail':
        return (
          <div className="party-page__detail">
            <PartyDetail
              party={selectedParty}
              currentUserId={CURRENT_USER.id}
              onBack={handleBack}
              onOpenChat={() => {
                setView('chat');
                setSearchParams({ view: 'chat' });
              }}
              onOpenTasks={() => {
                setView('tasks');
                setSearchParams({ view: 'tasks' });
              }}
              onOpenFiles={() => {
                setView('files');
                setSearchParams({ view: 'files' });
              }}
              onInvite={() => setShowInviteModal(true)}
              onLeave={handleLeaveParty}
              onSettings={() => console.log('Settings')}
              onRoleChange={(memberId, newRole) => console.log('Role change:', memberId, newRole)}
              onKickMember={(memberId) => console.log('Kick:', memberId)}
            />
            
            {/* Invite Modal */}
            {showInviteModal && (
              <div className="party-page__modal-overlay" onClick={() => setShowInviteModal(false)}>
                <div className="party-page__modal" onClick={e => e.stopPropagation()}>
                  <PartyInviteForm
                    partyId={selectedParty?.id}
                    partyName={selectedParty?.name}
                    inviteLink={`https://gpslab.app/join/${selectedParty?.id}`}
                    onInvite={handleInvite}
                    onClose={() => setShowInviteModal(false)}
                    maxInvites={selectedParty?.maxMembers - selectedParty?.memberCount}
                  />
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return (
          <PartyList
            parties={parties}
            myPartyIds={myPartyIds}
            onPartySelect={handlePartySelect}
            onPartyJoin={handlePartyJoin}
            onCreateParty={() => setView('create')}
            isLoading={isLoading}
          />
        );
    }
  };
  
  return (
    <div className="party-page">
      {renderContent()}
    </div>
  );
};

export default PartyPage;