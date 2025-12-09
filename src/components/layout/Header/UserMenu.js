/**
 * GPS Lab Platform - UserMenu Component
 * 
 * User dropdown menu with profile, settings, and logout options.
 * 
 * @module components/layout/Header/UserMenu
 * @version 1.0.0
 */

import React, { useState, useRef, useEffect } from 'react';
import './UserMenu.css';

// =============================================================================
// CONSTANTS
// =============================================================================

// Menu items
const MENU_ITEMS = [
  {
    id: 'profile',
    label: 'My Profile',
    href: '/profile',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
      </svg>
    )
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
      </svg>
    )
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
      </svg>
    )
  },
  { id: 'divider', type: 'divider' },
  {
    id: 'help',
    label: 'Help & Support',
    href: '/help',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
      </svg>
    )
  }
];

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Generate initials from name
 */
const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * UserMenu component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.user - User data
 * @param {string} [props.user.name] - User's display name
 * @param {string} [props.user.email] - User's email
 * @param {string} [props.user.avatar] - User's avatar URL
 * @param {number} [props.user.level] - User's level
 * @param {Function} [props.onLogout] - Logout handler
 * @param {string} [props.className] - Additional CSS classes
 */
const UserMenu = ({
  user,
  onLogout,
  className = '',
  ...props
}) => {
  
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  
  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  
  // Close menu on Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);
  
  const toggleMenu = () => setIsOpen(prev => !prev);
  
  const handleMenuClick = (item) => {
    setIsOpen(false);
    // Navigation would be handled here
  };
  
  const handleLogout = () => {
    setIsOpen(false);
    onLogout?.();
  };
  
  const initials = getInitials(user?.name);
  
  const classNames = [
    'user-menu',
    isOpen && 'user-menu--open',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} ref={menuRef} {...props}>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        className="user-menu__trigger"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="user-menu__avatar">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="user-menu__avatar-img" />
          ) : (
            <span className="user-menu__avatar-initials">{initials}</span>
          )}
          {user?.level && (
            <span className="user-menu__level">{user.level}</span>
          )}
        </div>
        <div className="user-menu__info">
          <span className="user-menu__name">{user?.name || 'User'}</span>
          <span className="user-menu__email">{user?.email}</span>
        </div>
        <span className="user-menu__arrow">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        </span>
      </button>
      
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="user-menu__dropdown">
          {/* User Info Header */}
          <div className="user-menu__header">
            <div className="user-menu__header-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className="user-menu__header-info">
              <span className="user-menu__header-name">{user?.name}</span>
              <span className="user-menu__header-email">{user?.email}</span>
            </div>
          </div>
          
          {/* Menu Items */}
          <div className="user-menu__items">
            {MENU_ITEMS.map(item => {
              if (item.type === 'divider') {
                return <div key={item.id} className="user-menu__divider" />;
              }
              
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className="user-menu__item"
                  onClick={() => handleMenuClick(item)}
                >
                  <span className="user-menu__item-icon">{item.icon}</span>
                  <span className="user-menu__item-label">{item.label}</span>
                </a>
              );
            })}
          </div>
          
          {/* Logout */}
          <div className="user-menu__footer">
            <button
              type="button"
              className="user-menu__logout"
              onClick={handleLogout}
            >
              <span className="user-menu__logout-icon">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4.414l-4.293 4.293a1 1 0 01-1.414-1.414L11.586 7H6a1 1 0 110-2h5.586L8.293 1.707a1 1 0 011.414-1.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" transform="rotate(180 10 10)"/>
                </svg>
              </span>
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default UserMenu;