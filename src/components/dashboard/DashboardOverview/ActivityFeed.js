/**
 * GPS Lab Platform - ActivityFeed Component
 * 
 * Displays a feed of recent user activities.
 * Used in dashboard overview section.
 * 
 * @module components/dashboard/DashboardOverview/ActivityFeed
 */

import React, { useMemo } from 'react';
import './ActivityFeed.css';

/**
 * Activity type configurations
 */
const ACTIVITY_TYPES = {
  mission_complete: {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
      </svg>
    ),
    color: 'success',
    label: 'Mission Complete'
  },
  baraka_earned: {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <circle cx="10" cy="10" r="8"/>
      </svg>
    ),
    color: 'baraka',
    label: 'Baraka Earned'
  },
  stage_unlocked: {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
      </svg>
    ),
    color: 'primary',
    label: 'Stage Unlocked'
  },
  achievement: {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    ),
    color: 'warning',
    label: 'Achievement'
  },
  party_joined: {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
      </svg>
    ),
    color: 'accent',
    label: 'Party Joined'
  },
  level_up: {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/>
      </svg>
    ),
    color: 'secondary',
    label: 'Level Up'
  },
  streak: {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
      </svg>
    ),
    color: 'secondary',
    label: 'Streak'
  }
};

/**
 * Format relative time
 */
const formatRelativeTime = (date) => {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now - then) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * ActivityItem Component
 */
const ActivityItem = ({ activity, onClick }) => {
  const config = ACTIVITY_TYPES[activity.type] || ACTIVITY_TYPES.mission_complete;
  
  return (
    <div 
      className={`activity-feed__item activity-feed__item--${config.color}`}
      onClick={() => onClick?.(activity)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="activity-feed__item-icon">
        {config.icon}
      </div>
      
      <div className="activity-feed__item-content">
        <p className="activity-feed__item-text">
          {activity.title}
        </p>
        {activity.description && (
          <p className="activity-feed__item-desc">{activity.description}</p>
        )}
        <span className="activity-feed__item-time">
          {formatRelativeTime(activity.timestamp)}
        </span>
      </div>
      
      {activity.reward && (
        <div className="activity-feed__item-reward">
          <span className="activity-feed__item-reward-value">
            +{activity.reward}
          </span>
          <span className="activity-feed__item-reward-label">
            {activity.rewardType || 'XP'}
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * ActivityFeed Component
 */
const ActivityFeed = ({
  activities = [],
  title = 'Recent Activity',
  maxItems = 10,
  showViewAll = true,
  onViewAll,
  onActivityClick,
  emptyMessage = 'No recent activity',
  isLoading = false,
  className = '',
  ...props
}) => {
  
  const displayedActivities = useMemo(() => {
    return activities.slice(0, maxItems);
  }, [activities, maxItems]);
  
  const classNames = ['activity-feed', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="activity-feed__header">
        <h3 className="activity-feed__title">{title}</h3>
        {showViewAll && activities.length > maxItems && (
          <button
            type="button"
            onClick={onViewAll}
            className="activity-feed__view-all"
          >
            View All
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
            </svg>
          </button>
        )}
      </div>
      
      {/* Content */}
      <div className="activity-feed__content">
        {isLoading ? (
          <div className="activity-feed__loading">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="activity-feed__skeleton">
                <div className="activity-feed__skeleton-icon" />
                <div className="activity-feed__skeleton-content">
                  <div className="activity-feed__skeleton-title" />
                  <div className="activity-feed__skeleton-time" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedActivities.length > 0 ? (
          <div className="activity-feed__list">
            {displayedActivities.map((activity, index) => (
              <ActivityItem
                key={activity.id || index}
                activity={activity}
                onClick={onActivityClick}
              />
            ))}
          </div>
        ) : (
          <div className="activity-feed__empty">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            <p>{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export { ACTIVITY_TYPES, ActivityItem, formatRelativeTime };
export default ActivityFeed;