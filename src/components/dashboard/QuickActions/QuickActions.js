/**
 * GPS Lab Platform - QuickActions Component
 * 
 * Quick action buttons for common dashboard tasks.
 * 
 * UPDATED: GPS 101 Integration - Added GPS 101 quick actions
 * 
 * @module components/dashboard/QuickActions
 */

import React from 'react';
import './QuickActions.css';

/**
 * GPS 101 Actions (shown when enrolled)
 */
const GPS_101_ACTIONS = [
  {
    id: 'continue-gps101',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/>
      </svg>
    ),
    label: 'Continue GPS 101',
    description: 'Resume your purpose journey',
    color: 'gps101',
    badge: null
  },
  {
    id: 'submit-checkpoint',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
      </svg>
    ),
    label: 'Submit Checkpoint',
    description: 'Complete current checkpoint',
    color: 'gps101',
    badge: null
  },
  {
    id: 'save-deliverable',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
      </svg>
    ),
    label: 'Save Deliverable',
    description: 'Submit stage deliverable',
    color: 'accent',
    badge: null
  },
  {
    id: 'view-gps101-progress',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
      </svg>
    ),
    label: 'GPS 101 Dashboard',
    description: 'View your progress',
    color: 'info',
    badge: null
  }
];

/**
 * Default quick actions (regular missions)
 */
const DEFAULT_ACTIONS = [
  {
    id: 'create-problem-showcase',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    ),
    label: 'Create Problem Showcase',
    description: 'Share your problem with GPS',
    color: 'secondary',
    badge: null
  },
  {
    id: 'continue-mission',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
      </svg>
    ),
    label: 'Continue Mission',
    description: 'Resume where you left off',
    color: 'primary',
    badge: null
  },
  {
    id: 'start-study',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
      </svg>
    ),
    label: 'Study Forge',
    description: 'Practice and learn',
    color: 'accent',
    badge: null
  },
  {
    id: 'join-party',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    ),
    label: 'Study Parties',
    description: 'Learn with others',
    color: 'secondary',
    badge: '3'
  },
  {
    id: 'view-wallet',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
      </svg>
    ),
    label: 'Baraka Wallet',
    description: 'Check your balance',
    color: 'baraka',
    badge: null
  },
  {
    id: 'find-mentor',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        <circle cx="18" cy="6" r="3"/>
      </svg>
    ),
    label: 'Find Mentor',
    description: 'Get guidance',
    color: 'info',
    badge: null
  }
];

/**
 * QuickActionButton Component
 */
const QuickActionButton = ({ action, onClick }) => {
  return (
    <button
      type="button"
      onClick={() => onClick?.(action.id)}
      className={`quick-actions__btn quick-actions__btn--${action.color}`}
    >
      <div className="quick-actions__btn-icon">
        {action.icon}
        {action.badge && (
          <span className="quick-actions__btn-badge">{action.badge}</span>
        )}
      </div>
      <div className="quick-actions__btn-text">
        <span className="quick-actions__btn-label">{action.label}</span>
        <span className="quick-actions__btn-desc">{action.description}</span>
      </div>
      <svg className="quick-actions__btn-arrow" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
      </svg>
    </button>
  );
};

/**
 * QuickActions Component
 */
const QuickActions = ({
  actions,
  title = 'Quick Actions',
  onAction,
  columns = 2,
  showTitle = true,
  // GPS 101 Props
  gps101Enrolled = false,
  showGPS101Actions = true,
  className = '',
  ...props
}) => {
  
  // Determine which actions to show
  const displayActions = actions || (gps101Enrolled && showGPS101Actions ? GPS_101_ACTIONS : DEFAULT_ACTIONS);
  
  const classNames = [
    'quick-actions',
    `quick-actions--cols-${columns}`,
    gps101Enrolled && 'quick-actions--gps101',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {showTitle && (
        <h3 className="quick-actions__title">{title}</h3>
      )}
      
      <div className="quick-actions__grid">
        {displayActions.map(action => (
          <QuickActionButton
            key={action.id}
            action={action}
            onClick={onAction}
          />
        ))}
      </div>
    </div>
  );
};

export { DEFAULT_ACTIONS, GPS_101_ACTIONS, QuickActionButton };
export default QuickActions;