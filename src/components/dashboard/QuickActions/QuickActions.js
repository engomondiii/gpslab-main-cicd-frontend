/**
 * GPS Lab Platform - QuickActions Component
 * 
 * Quick action buttons for common dashboard tasks.
 * 
 * @module components/dashboard/QuickActions
 */

import React from 'react';
import './QuickActions.css';

/**
 * Default quick actions
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
  },
  {
    id: 'leaderboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.5 21H2V9h5.5v12zm7.25-18h-5.5v18h5.5V3zM22 11h-5.5v10H22V11z"/>
      </svg>
    ),
    label: 'Leaderboard',
    description: 'See rankings',
    color: 'warning',
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
  actions = DEFAULT_ACTIONS,
  title = 'Quick Actions',
  onAction,
  columns = 2,
  showTitle = true,
  className = '',
  ...props
}) => {
  const classNames = [
    'quick-actions',
    `quick-actions--cols-${columns}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {showTitle && (
        <h3 className="quick-actions__title">{title}</h3>
      )}
      
      <div className="quick-actions__grid">
        {actions.map(action => (
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

export { DEFAULT_ACTIONS, QuickActionButton };
export default QuickActions;