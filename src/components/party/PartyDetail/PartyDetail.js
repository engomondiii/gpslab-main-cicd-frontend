/**
 * GPS Lab Platform - PartyDetail Component
 * 
 * Main party detail view showing party info, members, and actions.
 * Container for party members, roles, and collaboration tools.
 * 
 * @module components/party/PartyDetail/PartyDetail
 */

import React, { useState, useCallback } from 'react';
import PartyMembers from './PartyMembers';
import PartyRoles from './PartyRoles';
import './PartyDetail.css';

/**
 * Get beacon color for stage
 */
const getBeaconColor = (stage) => {
  const colors = {
    1: 'var(--beacon-red, #e74c3c)',
    2: 'var(--beacon-orange, #f39c12)',
    3: 'var(--beacon-yellow, #f1c40f)',
    4: 'var(--beacon-green, #2ecc71)',
    5: 'var(--beacon-blue, #3498db)',
    6: 'var(--beacon-indigo, #9b59b6)',
    7: 'var(--beacon-purple, #8e44ad)'
  };
  return colors[stage] || 'var(--gps-primary, #00d4ff)';
};

/**
 * PartyDetail Component
 */
const PartyDetail = ({
  party,
  currentUserId,
  onBack,
  onOpenChat,
  onOpenTasks,
  onOpenFiles,
  onInvite,
  onLeave,
  onSettings,
  onRoleChange,
  onKickMember,
  className = '',
  ...props
}) => {
  const [activeTab, setActiveTab] = useState('members');
  
  if (!party) {
    return (
      <div className="party-detail party-detail--empty">
        <p>Party not found</p>
      </div>
    );
  }
  
  const {
    id,
    name,
    description,
    stage = 1,
    members = [],
    maxMembers = 5,
    isPublic = true,
    currentQuest,
    tags = [],
    createdAt,
    stats = {}
  } = party;
  
  const beaconColor = getBeaconColor(stage);
  const currentMember = members.find(m => m.id === currentUserId);
  const isLeader = currentMember?.role === 'leader';
  const isCoLeader = currentMember?.role === 'co_leader';
  const canManage = isLeader || isCoLeader;
  
  // Group members by role
  const membersByRole = members.reduce((acc, member) => {
    const role = member.role || 'member';
    if (!acc[role]) acc[role] = [];
    acc[role].push(member);
    return acc;
  }, {});
  
  const handleLeave = useCallback(() => {
    if (window.confirm('Are you sure you want to leave this party?')) {
      if (onLeave) {
        onLeave(id);
      }
    }
  }, [id, onLeave]);
  
  const classNames = [
    'party-detail',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} style={{ '--beacon-color': beaconColor }} {...props}>
      {/* Header */}
      <header className="party-detail__header">
        {onBack && (
          <button type="button" onClick={onBack} className="party-detail__back-btn">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
            Back
          </button>
        )}
        
        <div className="party-detail__title-section">
          <div className="party-detail__beacon-wrap">
            <span className="party-detail__beacon" />
            <span className="party-detail__stage">Stage {stage}</span>
          </div>
          <h1 className="party-detail__title">{name}</h1>
          
          <div className="party-detail__badges">
            {!isPublic && (
              <span className="party-detail__badge party-detail__badge--private">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                Private
              </span>
            )}
            {currentMember && (
              <span className="party-detail__badge party-detail__badge--role">
                {currentMember.role === 'leader' ? '👑' : currentMember.role === 'co_leader' ? '⭐' : '👤'}
                {currentMember.role}
              </span>
            )}
          </div>
        </div>
        
        {/* Header Actions */}
        <div className="party-detail__header-actions">
          {canManage && onInvite && (
            <button type="button" onClick={onInvite} className="party-detail__action-btn party-detail__action-btn--primary">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/>
              </svg>
              Invite
            </button>
          )}
          {isLeader && onSettings && (
            <button type="button" onClick={onSettings} className="party-detail__action-btn">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
              </svg>
            </button>
          )}
        </div>
      </header>
      
      {/* Description */}
      {description && (
        <div className="party-detail__description">
          <p>{description}</p>
        </div>
      )}
      
      {/* Current Quest */}
      {currentQuest && (
        <div className="party-detail__quest">
          <span className="party-detail__quest-label">Current Quest</span>
          <div className="party-detail__quest-content">
            <span className="party-detail__quest-icon">🎯</span>
            <span className="party-detail__quest-name">{currentQuest.name}</span>
            {currentQuest.progress !== undefined && (
              <div className="party-detail__quest-progress">
                <div className="party-detail__quest-bar">
                  <div 
                    className="party-detail__quest-fill"
                    style={{ width: `${currentQuest.progress}%` }}
                  />
                </div>
                <span className="party-detail__quest-percent">{currentQuest.progress}%</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Quick Actions */}
      <div className="party-detail__quick-actions">
        <button type="button" className="party-detail__quick-action" onClick={onOpenChat}>
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
          </svg>
          Chat
        </button>
        <button type="button" className="party-detail__quick-action" onClick={onOpenTasks}>
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
          </svg>
          Tasks
        </button>
        <button type="button" className="party-detail__quick-action" onClick={onOpenFiles}>
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"/>
          </svg>
          Files
        </button>
      </div>
      
      {/* Stats */}
      <div className="party-detail__stats">
        <div className="party-detail__stat">
          <span className="party-detail__stat-value">{stats.questsCompleted || 0}</span>
          <span className="party-detail__stat-label">Quests</span>
        </div>
        <div className="party-detail__stat">
          <span className="party-detail__stat-value">{stats.xpEarned || 0}</span>
          <span className="party-detail__stat-label">XP Earned</span>
        </div>
        <div className="party-detail__stat">
          <span className="party-detail__stat-value">{stats.daysActive || 0}</span>
          <span className="party-detail__stat-label">Days Active</span>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="party-detail__tabs">
        <button
          type="button"
          className={`party-detail__tab ${activeTab === 'members' ? 'party-detail__tab--active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          Members ({members.length})
        </button>
        <button
          type="button"
          className={`party-detail__tab ${activeTab === 'roles' ? 'party-detail__tab--active' : ''}`}
          onClick={() => setActiveTab('roles')}
        >
          Roles
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="party-detail__tab-content">
        {activeTab === 'members' && (
          <PartyMembers
            members={members}
            currentUserId={currentUserId}
            isLeader={isLeader}
            maxMembers={maxMembers}
            onRoleChange={onRoleChange}
            onKick={onKickMember}
          />
        )}
        {activeTab === 'roles' && (
          <PartyRoles
            membersByRole={membersByRole}
            isLeader={isLeader}
          />
        )}
      </div>
      
      {/* Tags */}
      {tags.length > 0 && (
        <div className="party-detail__tags">
          {tags.map(tag => (
            <span key={tag} className="party-detail__tag">#{tag}</span>
          ))}
        </div>
      )}
      
      {/* Footer Actions */}
      <div className="party-detail__footer">
        {currentMember && !isLeader && (
          <button type="button" className="party-detail__leave-btn" onClick={handleLeave}>
            Leave Party
          </button>
        )}
      </div>
    </div>
  );
};

export default PartyDetail;