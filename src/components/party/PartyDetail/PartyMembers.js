/**
 * GPS Lab Platform - PartyMembers Component
 * 
 * Displays party members with their roles, status, and contributions.
 * Allows party leaders to manage member roles.
 * 
 * @module components/party/PartyDetail/PartyMembers
 */

import React, { useState, useCallback } from 'react';
import './PartyMembers.css';

/**
 * Role definitions
 */
const ROLES = {
  leader: { label: 'Leader', icon: '👑', color: 'var(--warning, #f1c40f)' },
  co_leader: { label: 'Co-Leader', icon: '⭐', color: 'var(--beacon-orange, #f39c12)' },
  member: { label: 'Member', icon: '👤', color: 'var(--gps-primary, #00d4ff)' },
  recruit: { label: 'Recruit', icon: '🌱', color: 'var(--success, #2a9d8f)' }
};

/**
 * PartyMembers Component
 */
const PartyMembers = ({
  members = [],
  currentUserId,
  isLeader = false,
  onRoleChange,
  onRemoveMember,
  onPromote,
  onKick,
  onViewProfile,
  maxMembers = 5,
  className = '',
  ...props
}) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [showRoleMenu, setShowRoleMenu] = useState(null);
  
  const handleMemberClick = useCallback((member) => {
    if (onViewProfile) {
      onViewProfile(member.id);
    }
  }, [onViewProfile]);
  
  const handleRoleChange = useCallback((memberId, newRole) => {
    if (onRoleChange) {
      onRoleChange(memberId, newRole);
    }
    setShowRoleMenu(null);
  }, [onRoleChange]);
  
  const handleKick = useCallback((memberId) => {
    if (onKick && window.confirm('Are you sure you want to remove this member?')) {
      onKick(memberId);
    }
    setShowRoleMenu(null);
  }, [onKick]);
  
  const sortedMembers = [...members].sort((a, b) => {
    const roleOrder = { leader: 0, co_leader: 1, member: 2, recruit: 3 };
    return (roleOrder[a.role] || 4) - (roleOrder[b.role] || 4);
  });
  
  const classNames = [
    'party-members',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="party-members__header">
        <h3 className="party-members__title">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
          </svg>
          Party Members
        </h3>
        <span className="party-members__count">
          {members.length}/{maxMembers}
        </span>
      </div>
      
      {/* Members List */}
      <div className="party-members__list">
        {sortedMembers.map(member => {
          const role = ROLES[member.role] || ROLES.member;
          const isCurrentUser = member.id === currentUserId;
          const canManage = isLeader && !isCurrentUser && member.role !== 'leader';
          
          return (
            <div
              key={member.id}
              className={`party-members__member ${member.isOnline ? 'party-members__member--online' : ''} ${isCurrentUser ? 'party-members__member--current' : ''}`}
            >
              {/* Avatar */}
              <div className="party-members__avatar-wrap">
                <div
                  className="party-members__avatar"
                  style={{
                    backgroundImage: member.avatar ? `url(${member.avatar})` : 'none'
                  }}
                  onClick={() => handleMemberClick(member)}
                >
                  {!member.avatar && member.name?.charAt(0).toUpperCase()}
                </div>
                {member.isOnline && (
                  <span className="party-members__online-dot" />
                )}
              </div>
              
              {/* Info */}
              <div className="party-members__info" onClick={() => handleMemberClick(member)}>
                <span className="party-members__name">
                  {member.name}
                  {isCurrentUser && <span className="party-members__you">(You)</span>}
                </span>
                <div className="party-members__meta">
                  <span 
                    className="party-members__role"
                    style={{ color: role.color }}
                  >
                    {role.icon} {role.label}
                  </span>
                  {member.contribution && (
                    <span className="party-members__contribution">
                      🔥 {member.contribution} XP
                    </span>
                  )}
                </div>
              </div>
              
              {/* Stage Badge */}
              <div className="party-members__stage">
                Stage {member.stage || 1}
              </div>
              
              {/* Actions */}
              {canManage && (
                <div className="party-members__actions">
                  <button
                    type="button"
                    className="party-members__action-btn"
                    onClick={() => setShowRoleMenu(showRoleMenu === member.id ? null : member.id)}
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                    </svg>
                  </button>
                  
                  {showRoleMenu === member.id && (
                    <div className="party-members__dropdown">
                      <div className="party-members__dropdown-section">
                        <span className="party-members__dropdown-label">Change Role</span>
                        {Object.entries(ROLES).filter(([key]) => key !== 'leader').map(([key, roleInfo]) => (
                          <button
                            key={key}
                            type="button"
                            className={`party-members__dropdown-item ${member.role === key ? 'party-members__dropdown-item--active' : ''}`}
                            onClick={() => handleRoleChange(member.id, key)}
                          >
                            <span>{roleInfo.icon}</span>
                            {roleInfo.label}
                          </button>
                        ))}
                      </div>
                      <div className="party-members__dropdown-divider" />
                      <button
                        type="button"
                        className="party-members__dropdown-item party-members__dropdown-item--danger"
                        onClick={() => handleKick(member.id)}
                      >
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9z" clipRule="evenodd"/>
                        </svg>
                        Remove from Party
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Empty Slots */}
      {members.length < maxMembers && (
        <div className="party-members__empty-slots">
          {[...Array(maxMembers - members.length)].map((_, i) => (
            <div key={i} className="party-members__empty-slot">
              <div className="party-members__empty-avatar">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </svg>
              </div>
              <span className="party-members__empty-text">Open Slot</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PartyMembers;