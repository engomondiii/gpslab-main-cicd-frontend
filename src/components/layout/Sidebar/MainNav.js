/**
 * GPS Lab Platform - MainNav Component
 * 
 * Main sidebar navigation with collapsible sections.
 * 
 * @module components/layout/Sidebar/MainNav
 * @version 1.1.0
 * 
 * FIXED:
 * - Converted all <a href> to React Router <NavLink> components
 * - Aligned route paths with PrivateRoutes.js definitions
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import './MainNav.css';

// =============================================================================
// CONSTANTS — PATHS ALIGNED WITH PrivateRoutes.js
// =============================================================================

const NAV_SECTIONS = [
  {
    id: 'main',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/dashboard',
        icon: (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
          </svg>
        )
      }
    ]
  },
  {
    id: 'training',
    label: 'Training',
    items: [
      {
        id: 'missions',
        label: 'My Missions',
        href: '/missions',          // FIXED: was /training/missions
        icon: (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
          </svg>
        ),
        badge: { count: 3, variant: 'primary' }
      },
      {
        id: 'stages',
        label: 'Stage Map',
        href: '/checkpoints',       // FIXED: was /training/stages
        icon: (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd"/>
          </svg>
        )
      },
      {
        id: 'bites',
        label: 'Knowledge Bites',
        href: '/study',              // FIXED: was /training/bites
        icon: (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
          </svg>
        )
      },
      {
        id: 'practice',
        label: 'Practice Arena',
        href: '/practice',           // Keep as-is (placeholder route)
        icon: (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
          </svg>
        )
      }
    ]
  },
  {
    id: 'projects',
    label: 'Projects',
    items: [
      {
        id: 'gpo',
        label: 'GPO Projects',
        href: '/projects/gpo',
        icon: (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
          </svg>
        )
      },
      {
        id: 'my-projects',
        label: 'My Projects',
        href: '/projects',           // FIXED: was /projects/mine
        icon: (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
          </svg>
        )
      }
    ]
  },
  {
    id: 'community',
    label: 'Community',
    items: [
      {
        id: 'parties',
        label: 'Study Parties',
        href: '/parties',            // FIXED: was /community/parties
        icon: (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
          </svg>
        ),
        badge: { count: 2, variant: 'success' }
      },
      {
        id: 'mentors',
        label: 'Find Mentors',
        href: '/mentors',            // FIXED: was /community/mentors
        icon: (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
          </svg>
        )
      }
    ]
  },
  {
    id: 'marketplace',
    items: [
      {
        id: 'marketplace',
        label: 'Marketplace',
        href: '/marketplace',
        icon: (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
          </svg>
        )
      }
    ]
  }
];

// =============================================================================
// COMPONENT
// =============================================================================

const MainNav = ({
  currentPath = '/',
  isCollapsed = false,
  expandedSection,
  onSectionToggle,
  className = '',
  ...props
}) => {
  
  const classNames = [
    'main-nav',
    isCollapsed && 'main-nav--collapsed',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <nav className={classNames} {...props}>
      {NAV_SECTIONS.map(section => (
        <div key={section.id} className="main-nav__section">
          {section.label && !isCollapsed && (
            <div className="main-nav__section-label">
              {section.label}
            </div>
          )}
          
          <ul className="main-nav__list">
            {section.items.map(item => (
              <li key={item.id} className="main-nav__item">
                {/* FIXED: Using NavLink instead of <a> */}
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `main-nav__link ${isActive ? 'main-nav__link--active' : ''}`
                  }
                  title={isCollapsed ? item.label : undefined}
                  end={item.href === '/dashboard'}
                >
                  <span className="main-nav__icon">{item.icon}</span>
                  {!isCollapsed && (
                    <>
                      <span className="main-nav__label">{item.label}</span>
                      {item.badge && (
                        <span className={`main-nav__badge main-nav__badge--${item.badge.variant}`}>
                          {item.badge.count}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
};

export { NAV_SECTIONS };
export default MainNav;