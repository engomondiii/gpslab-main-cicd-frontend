/**
 * GPS Lab Platform - PartyRoles Component
 * 
 * Displays party role assignments and permissions.
 * Allows role customization for party leaders.
 * 
 * @module components/party/PartyDetail/PartyRoles
 */

import React, { useState, useCallback } from 'react';
import './PartyRoles.css';

/**
 * Default role configurations
 */
const DEFAULT_ROLES = {
  leader: {
    name: 'Leader',
    icon: '👑',
    color: '#f1c40f',
    permissions: ['manage_party', 'manage_roles', 'manage_members', 'manage_tasks', 'manage_files', 'chat'],
    description: 'Full control over the party'
  },
  co_leader: {
    name: 'Co-Leader',
    icon: '⭐',
    color: '#f39c12',
    permissions: ['manage_members', 'manage_tasks', 'manage_files', 'chat'],
    description: 'Help manage the party'
  },
  member: {
    name: 'Member',
    icon: '👤',
    color: '#00d4ff',
    permissions: ['manage_tasks', 'manage_files', 'chat'],
    description: 'Active party participant'
  },
  recruit: {
    name: 'Recruit',
    icon: '🌱',
    color: '#2a9d8f',
    permissions: ['chat'],
    description: 'New party member'
  }
};

/**
 * Permission labels
 */
const PERMISSION_LABELS = {
  manage_party: 'Manage Party Settings',
  manage_roles: 'Manage Roles',
  manage_members: 'Manage Members',
  manage_tasks: 'Manage Tasks',
  manage_files: 'Upload & Delete Files',
  chat: 'Send Messages'
};

/**
 * PartyRoles Component
 */
const PartyRoles = ({
  roles = DEFAULT_ROLES,
  membersByRole = {},
  isLeader = false,
  onRoleEdit,
  className = '',
  ...props
}) => {
  const [expandedRole, setExpandedRole] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  
  const handleRoleClick = useCallback((roleKey) => {
    setExpandedRole(expandedRole === roleKey ? null : roleKey);
  }, [expandedRole]);
  
  const handleEditRole = useCallback((roleKey) => {
    if (isLeader && roleKey !== 'leader') {
      setEditingRole(roleKey);
    }
  }, [isLeader]);
  
  const classNames = [
    'party-roles',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="party-roles__header">
        <h3 className="party-roles__title">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          Party Roles
        </h3>
      </div>
      
      {/* Roles List */}
      <div className="party-roles__list">
        {Object.entries(roles).map(([roleKey, role]) => {
          const membersInRole = membersByRole[roleKey] || [];
          const isExpanded = expandedRole === roleKey;
          
          return (
            <div
              key={roleKey}
              className={`party-roles__role ${isExpanded ? 'party-roles__role--expanded' : ''}`}
              style={{ '--role-color': role.color }}
            >
              {/* Role Header */}
              <button
                type="button"
                className="party-roles__role-header"
                onClick={() => handleRoleClick(roleKey)}
              >
                <span className="party-roles__role-icon">{role.icon}</span>
                <div className="party-roles__role-info">
                  <span className="party-roles__role-name">{role.name}</span>
                  <span className="party-roles__role-count">
                    {membersInRole.length} {membersInRole.length === 1 ? 'member' : 'members'}
                  </span>
                </div>
                <svg 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                  className="party-roles__role-chevron"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
              
              {/* Role Details */}
              {isExpanded && (
                <div className="party-roles__role-details">
                  <p className="party-roles__role-description">{role.description}</p>
                  
                  {/* Permissions */}
                  <div className="party-roles__permissions">
                    <h4 className="party-roles__permissions-title">Permissions</h4>
                    <ul className="party-roles__permissions-list">
                      {Object.entries(PERMISSION_LABELS).map(([permKey, permLabel]) => {
                        const hasPermission = role.permissions?.includes(permKey);
                        return (
                          <li 
                            key={permKey}
                            className={`party-roles__permission ${hasPermission ? 'party-roles__permission--granted' : ''}`}
                          >
                            <svg viewBox="0 0 20 20" fill="currentColor">
                              {hasPermission ? (
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                              ) : (
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                              )}
                            </svg>
                            {permLabel}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  
                  {/* Members in Role */}
                  {membersInRole.length > 0 && (
                    <div className="party-roles__role-members">
                      <h4 className="party-roles__members-title">Members</h4>
                      <div className="party-roles__members-list">
                        {membersInRole.map(member => (
                          <div key={member.id} className="party-roles__member-chip">
                            <div 
                              className="party-roles__member-avatar"
                              style={{
                                backgroundImage: member.avatar ? `url(${member.avatar})` : 'none'
                              }}
                            >
                              {!member.avatar && member.name?.charAt(0)}
                            </div>
                            <span className="party-roles__member-name">{member.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Edit Button */}
                  {isLeader && roleKey !== 'leader' && (
                    <button
                      type="button"
                      className="party-roles__edit-btn"
                      onClick={() => handleEditRole(roleKey)}
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                      </svg>
                      Edit Permissions
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PartyRoles;