/**
 * GPS Lab Platform - RecentActivity Component
 * 
 * Displays recent activity timeline with filtering options.
 * 
 * UPDATED: GPS 101 Integration - Added GPS 101 activity types
 * 
 * @module components/dashboard/RecentActivity
 */

import React, { useState, useMemo, useCallback } from 'react';
import './RecentActivity.css';

/**
 * Activity type configurations
 */
const ACTIVITY_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'gps101', label: 'GPS 101' },
  { id: 'missions', label: 'Missions' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'baraka', label: 'Baraka' },
  { id: 'social', label: 'Social' }
];

/**
 * Activity type icons and colors
 */
const ACTIVITY_CONFIG = {
  mission_started: {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd"/>
      </svg>
    ),
    color: 'primary',
    category: 'missions'
  },
  mission_complete: {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
      </svg>
    ),
    color: 'success',
    category: 'missions'
  },
  baraka_earned: {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a8 8 0 100 16 8 8 0 000-16z"/>
      </svg>
    ),
    color: 'baraka',
    category: 'baraka'
  },
  baraka_spent: {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd"/>
      </svg>
    ),
    color: 'warning',
    category: 'baraka'
  },
  achievement_unlocked: {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    ),
    color: 'warning',
    category: 'achievements'
  },
  stage_complete: {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
      </svg>
    ),
    color: 'accent',
    category: 'achievements'
  },
  party_joined: {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
      </svg>
    ),
    color: 'secondary',
    category: 'social'
  },
  mentor_session: {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
      </svg>
    ),
    color: 'info',
    category: 'social'
  },
  // GPS 101 ACTIVITY TYPES
  gps101_enrolled: {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2L2.5 17.29l.71.71L10 15l6.79 3 .71-.71L10 2z"/>
      </svg>
    ),
    color: 'gps101',
    category: 'gps101'
  },
  gps101_stage_complete: {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
      </svg>
    ),
    color: 'gps101',
    category: 'gps101'
  },
  gps101_checkpoint_passed: {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
      </svg>
    ),
    color: 'success',
    category: 'gps101'
  },
  gps101_checkpoint_failed: {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
      </svg>
    ),
    color: 'secondary',
    category: 'gps101'
  },
  gps101_deliverable_saved: {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z"/>
      </svg>
    ),
    color: 'info',
    category: 'gps101'
  },
  orange_beacon_unlocked: {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    ),
    color: 'baraka',
    category: 'gps101'
  },
  gps101_mission_complete: {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
      </svg>
    ),
    color: 'gps101',
    category: 'gps101'
  }
};

/**
 * Format relative time
 */
const formatTime = (timestamp) => {
  const now = new Date();
  const then = new Date(timestamp);
  const diff = Math.floor((now - then) / 1000);
  
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * ActivityTimelineItem Component
 */
const ActivityTimelineItem = ({ activity, isLast }) => {
  const config = ACTIVITY_CONFIG[activity.type] || ACTIVITY_CONFIG.mission_complete;
  
  return (
    <div className={`recent-activity__item recent-activity__item--${config.color}`}>
      {/* Timeline Connector */}
      <div className="recent-activity__timeline">
        <div className="recent-activity__dot" />
        {!isLast && <div className="recent-activity__line" />}
      </div>
      
      {/* Content */}
      <div className="recent-activity__content">
        <div className="recent-activity__icon">
          {config.icon}
        </div>
        
        <div className="recent-activity__details">
          <p className="recent-activity__title">
            {config.category === 'gps101' && (
              <span className="recent-activity__gps101-badge">GPS 101</span>
            )}
            {activity.title}
          </p>
          {activity.description && (
            <p className="recent-activity__desc">{activity.description}</p>
          )}
          <span className="recent-activity__time">{formatTime(activity.timestamp)}</span>
        </div>
        
        {activity.reward && (
          <div className="recent-activity__reward">
            <span className={`recent-activity__reward-value recent-activity__reward-value--${activity.rewardType || 'xp'}`}>
              +{activity.reward}
            </span>
            <span className="recent-activity__reward-type">
              {activity.rewardType === 'baraka' ? 'ƀ' : 'XP'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * RecentActivity Component
 */
const RecentActivity = ({
  activities = [],
  title = 'Recent Activity',
  maxItems = 10,
  showFilters = true,
  showViewAll = true,
  onViewAll,
  onActivityClick,
  emptyMessage = 'No activity yet',
  isLoading = false,
  className = '',
  ...props
}) => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  /**
   * Filtered activities
   */
  const filteredActivities = useMemo(() => {
    if (activeFilter === 'all') return activities;
    
    return activities.filter(activity => {
      const config = ACTIVITY_CONFIG[activity.type];
      return config?.category === activeFilter;
    });
  }, [activities, activeFilter]);
  
  /**
   * Display activities (limited by maxItems)
   */
  const displayActivities = useMemo(() => {
    return filteredActivities.slice(0, maxItems);
  }, [filteredActivities, maxItems]);
  
  const classNames = ['recent-activity', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="recent-activity__header">
        <h3 className="recent-activity__heading">{title}</h3>
        
        {showViewAll && filteredActivities.length > maxItems && (
          <button
            type="button"
            onClick={onViewAll}
            className="recent-activity__view-all"
          >
            View All
          </button>
        )}
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="recent-activity__filters">
          {ACTIVITY_FILTERS.map(filter => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={`recent-activity__filter ${activeFilter === filter.id ? 'recent-activity__filter--active' : ''}`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}
      
      {/* Timeline */}
      <div className="recent-activity__list">
        {isLoading ? (
          <div className="recent-activity__loading">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="recent-activity__skeleton">
                <div className="recent-activity__skeleton-dot" />
                <div className="recent-activity__skeleton-content">
                  <div className="recent-activity__skeleton-title" />
                  <div className="recent-activity__skeleton-time" />
                </div>
              </div>
            ))}
          </div>
        ) : displayActivities.length > 0 ? (
          displayActivities.map((activity, index) => (
            <ActivityTimelineItem
              key={activity.id || index}
              activity={activity}
              isLast={index === displayActivities.length - 1}
            />
          ))
        ) : (
          <div className="recent-activity__empty">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
            </svg>
            <p>{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export { ACTIVITY_FILTERS, ACTIVITY_CONFIG, ActivityTimelineItem };
export default RecentActivity;