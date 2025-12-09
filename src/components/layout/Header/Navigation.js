/**
 * GPS Lab Platform - Navigation Component
 * 
 * Main navigation menu with support for desktop and mobile variants.
 * 
 * @module components/layout/Header/Navigation
 * @version 1.0.0
 */

import React, { useState } from 'react';
import './Navigation.css';

// =============================================================================
// CONSTANTS
// =============================================================================

// Main navigation items
const NAV_ITEMS = [
  {
    id: 'training',
    label: 'Training',
    href: '/training',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
      </svg>
    ),
    children: [
      { id: 'missions', label: 'My Missions', href: '/training/missions' },
      { id: 'stages', label: 'Stage Map', href: '/training/stages' },
      { id: 'bites', label: 'Knowledge Bites', href: '/training/bites' },
      { id: 'practice', label: 'Practice Arena', href: '/training/practice' }
    ]
  },
  {
    id: 'projects',
    label: 'Projects',
    href: '/projects',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
      </svg>
    ),
    children: [
      { id: 'gpo', label: 'GPO Projects', href: '/projects/gpo' },
      { id: 'my-projects', label: 'My Projects', href: '/projects/mine' },
      { id: 'browse', label: 'Browse All', href: '/projects/browse' }
    ]
  },
  {
    id: 'community',
    label: 'Community',
    href: '/community',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
      </svg>
    ),
    children: [
      { id: 'parties', label: 'Study Parties', href: '/community/parties' },
      { id: 'mentors', label: 'Find Mentors', href: '/community/mentors' },
      { id: 'forums', label: 'Forums', href: '/community/forums' },
      { id: 'events', label: 'Events', href: '/community/events' }
    ]
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    href: '/marketplace',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
      </svg>
    )
  },
  {
    id: 'resources',
    label: 'Resources',
    href: '/resources',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
      </svg>
    )
  }
];

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Navigation component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='desktop'] - Navigation variant
 * @param {Function} [props.onNavigate] - Navigation handler
 * @param {string} [props.className] - Additional CSS classes
 */
const Navigation = ({
  variant = 'desktop',
  onNavigate,
  className = '',
  ...props
}) => {
  
  const [openDropdown, setOpenDropdown] = useState(null);
  const [expandedMobile, setExpandedMobile] = useState(null);
  
  // Handle dropdown toggle
  const handleDropdownToggle = (id) => {
    setOpenDropdown(prev => prev === id ? null : id);
  };
  
  // Handle mobile expand
  const handleMobileExpand = (id) => {
    setExpandedMobile(prev => prev === id ? null : id);
  };
  
  // Handle navigation click
  const handleNavClick = (href, e) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
    setOpenDropdown(null);
    setExpandedMobile(null);
  };
  
  const classNames = [
    'navigation',
    `navigation--${variant}`,
    className
  ].filter(Boolean).join(' ');
  
  // Desktop Navigation
  if (variant === 'desktop') {
    return (
      <nav className={classNames} {...props}>
        <ul className="navigation__list">
          {NAV_ITEMS.map(item => (
            <li 
              key={item.id}
              className="navigation__item"
              onMouseEnter={() => item.children && setOpenDropdown(item.id)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <a
                href={item.href}
                className={`navigation__link ${openDropdown === item.id ? 'navigation__link--active' : ''}`}
                onClick={(e) => handleNavClick(item.href, e)}
              >
                <span className="navigation__link-icon">{item.icon}</span>
                <span className="navigation__link-text">{item.label}</span>
                {item.children && (
                  <span className="navigation__link-arrow">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </span>
                )}
              </a>
              
              {/* Dropdown Menu */}
              {item.children && openDropdown === item.id && (
                <div className="navigation__dropdown">
                  <ul className="navigation__dropdown-list">
                    {item.children.map(child => (
                      <li key={child.id} className="navigation__dropdown-item">
                        <a
                          href={child.href}
                          className="navigation__dropdown-link"
                          onClick={(e) => handleNavClick(child.href, e)}
                        >
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    );
  }
  
  // Mobile Navigation
  return (
    <nav className={classNames} {...props}>
      <ul className="navigation__list">
        {NAV_ITEMS.map(item => (
          <li key={item.id} className="navigation__item">
            <div className="navigation__item-header">
              <a
                href={item.href}
                className="navigation__link"
                onClick={(e) => {
                  if (item.children) {
                    e.preventDefault();
                    handleMobileExpand(item.id);
                  } else {
                    handleNavClick(item.href, e);
                  }
                }}
              >
                <span className="navigation__link-icon">{item.icon}</span>
                <span className="navigation__link-text">{item.label}</span>
              </a>
              
              {item.children && (
                <button
                  type="button"
                  className={`navigation__expand-btn ${expandedMobile === item.id ? 'navigation__expand-btn--expanded' : ''}`}
                  onClick={() => handleMobileExpand(item.id)}
                  aria-expanded={expandedMobile === item.id}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              )}
            </div>
            
            {/* Mobile Submenu */}
            {item.children && expandedMobile === item.id && (
              <ul className="navigation__submenu">
                {item.children.map(child => (
                  <li key={child.id} className="navigation__submenu-item">
                    <a
                      href={child.href}
                      className="navigation__submenu-link"
                      onClick={(e) => handleNavClick(child.href, e)}
                    >
                      {child.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

// Export navigation items for reuse
export { NAV_ITEMS };

// =============================================================================
// EXPORTS
// =============================================================================

export default Navigation;