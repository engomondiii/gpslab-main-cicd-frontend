/**
 * GPS Lab Platform - NavigatorNotifications Component
 * GPS 101 INTEGRATION: GPS 101 milestone notifications, stage completion alerts
 * 
 * Notification panel for Navigator-generated alerts,
 * tips, reminders, and guidance messages.
 * 
 * @module components/navigator/NavigatorNotifications/NavigatorNotifications
 */

import React, { useState, useCallback } from 'react';
import './NavigatorNotifications.css';

/**
 * Notification type configurations
 */
const NOTIFICATION_TYPES = {
  tip: { icon: '💡', color: 'var(--warning)', label: 'Tip' },
  reminder: { icon: '⏰', color: 'var(--beacon-orange)', label: 'Reminder' },
  achievement: { icon: '🏆', color: 'var(--success)', label: 'Achievement' },
  suggestion: { icon: '🎯', color: 'var(--gps-primary)', label: 'Suggestion' },
  alert: { icon: '⚠️', color: 'var(--error)', label: 'Alert' },
  celebration: { icon: '🎉', color: 'var(--beacon-purple)', label: 'Celebration' },
  progress: { icon: '📈', color: 'var(--beacon-green)', label: 'Progress' },
  social: { icon: '👥', color: 'var(--beacon-blue)', label: 'Social' },
  // NEW: GPS 101 notification types
  gps101_stage_complete: { icon: '🎓', color: '#667eea', label: 'GPS 101 Stage Complete' },
  gps101_checkpoint_complete: { icon: '🏁', color: '#667eea', label: 'GPS 101 Checkpoint' },
  gps101_deliverable_submitted: { icon: '📝', color: '#667eea', label: 'GPS 101 Deliverable' },
  gps101_orange_beacon: { icon: '🟠', color: '#f39c12', label: 'Orange Beacon' },
  gps101_reminder: { icon: '🎓', color: '#667eea', label: 'GPS 101 Reminder' },
  gps101_tip: { icon: '💡', color: '#667eea', label: 'GPS 101 Tip' }
};

/**
 * Format relative time
 */
const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

/**
 * NavigatorNotifications Component
 */
const NavigatorNotifications = ({
  notifications = [],
  onNotificationClick,
  onNotificationDismiss,
  onMarkAllRead,
  onClearAll,
  // NEW: GPS 101 props
  showGPS101Filter = true,
  maxVisible = 10,
  showHeader = true,
  className = '',
  ...props
}) => {
  const [filter, setFilter] = useState('all'); // all, unread, gps101
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  // NEW: GPS 101 notifications count
  const gps101Count = notifications.filter(n => 
    n.type?.startsWith('gps101_') || n.isGPS101
  ).length;
  
  // Filter notifications
  const filteredNotifications = React.useMemo(() => {
    let result = notifications;
    
    if (filter === 'unread') {
      result = result.filter(n => !n.isRead);
    } else if (filter === 'gps101') {
      result = result.filter(n => n.type?.startsWith('gps101_') || n.isGPS101);
    }
    
    return result;
  }, [notifications, filter]);
  
  const visibleNotifications = filteredNotifications.slice(0, maxVisible);
  
  const handleClick = useCallback((notification) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  }, [onNotificationClick]);
  
  const handleDismiss = useCallback((e, notificationId) => {
    e.stopPropagation();
    if (onNotificationDismiss) {
      onNotificationDismiss(notificationId);
    }
  }, [onNotificationDismiss]);
  
  const classNames = [
    'navigator-notifications',
    showGPS101Filter && 'navigator-notifications--with-gps101-filter',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      {showHeader && (
        <header className="navigator-notifications__header">
          <div className="navigator-notifications__header-left">
            <h3 className="navigator-notifications__title">
              <span className="navigator-notifications__title-icon">🔔</span>
              Navigator Updates
            </h3>
            {unreadCount > 0 && (
              <span className="navigator-notifications__badge">{unreadCount}</span>
            )}
          </div>
          
          <div className="navigator-notifications__header-actions">
            {unreadCount > 0 && onMarkAllRead && (
              <button
                type="button"
                className="navigator-notifications__action-btn"
                onClick={onMarkAllRead}
              >
                Mark all read
              </button>
            )}
            {notifications.length > 0 && onClearAll && (
              <button
                type="button"
                className="navigator-notifications__action-btn navigator-notifications__action-btn--danger"
                onClick={onClearAll}
              >
                Clear all
              </button>
            )}
          </div>
        </header>
      )}
      
      {/* Filter Tabs */}
      <div className="navigator-notifications__filters">
        <button
          type="button"
          className={`navigator-notifications__filter ${filter === 'all' ? 'navigator-notifications__filter--active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          className={`navigator-notifications__filter ${filter === 'unread' ? 'navigator-notifications__filter--active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
        {/* NEW: GPS 101 Filter */}
        {showGPS101Filter && gps101Count > 0 && (
          <button
            type="button"
            className={`navigator-notifications__filter navigator-notifications__filter--gps101 ${filter === 'gps101' ? 'navigator-notifications__filter--active' : ''}`}
            onClick={() => setFilter('gps101')}
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
            </svg>
            GPS 101 ({gps101Count})
          </button>
        )}
      </div>
      
      {/* Notifications List */}
      <div className="navigator-notifications__list">
        {visibleNotifications.length > 0 ? (
          visibleNotifications.map((notification, index) => {
            const typeConfig = NOTIFICATION_TYPES[notification.type] || NOTIFICATION_TYPES.tip;
            const isGPS101 = notification.type?.startsWith('gps101_') || notification.isGPS101;
            
            return (
              <div
                key={notification.id || index}
                className={`navigator-notifications__item ${!notification.isRead ? 'navigator-notifications__item--unread' : ''} ${isGPS101 ? 'navigator-notifications__item--gps101' : ''}`}
                onClick={() => handleClick(notification)}
                style={{ '--type-color': typeConfig.color }}
              >
                {/* Unread Indicator */}
                {!notification.isRead && (
                  <span className="navigator-notifications__unread-dot" />
                )}
                
                {/* Icon */}
                <div className="navigator-notifications__icon">
                  {typeConfig.icon}
                </div>
                
                {/* Content */}
                <div className="navigator-notifications__content">
                  <div className="navigator-notifications__content-header">
                    <span className="navigator-notifications__type">
                      {typeConfig.label}
                      {/* NEW: GPS 101 Stage Badge */}
                      {isGPS101 && notification.gps101Stage && (
                        <span className="navigator-notifications__gps101-stage">
                          Stage {notification.gps101Stage}
                        </span>
                      )}
                    </span>
                    <span className="navigator-notifications__time">
                      {formatRelativeTime(notification.timestamp)}
                    </span>
                  </div>
                  <p className="navigator-notifications__message">{notification.message}</p>
                  
                  {/* NEW: GPS 101 Specific Info */}
                  {isGPS101 && notification.gps101Info && (
                    <div className="navigator-notifications__gps101-info">
                      {notification.gps101Info.deliverable && (
                        <span className="navigator-notifications__gps101-deliverable">
                          <svg viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6z" clipRule="evenodd"/>
                          </svg>
                          {notification.gps101Info.deliverable}
                        </span>
                      )}
                      {notification.gps101Info.barakaEarned && (
                        <span className="navigator-notifications__gps101-baraka">
                          +{notification.gps101Info.barakaEarned} 🪙
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Action */}
                  {notification.action && (
                    <button
                      type="button"
                      className={`navigator-notifications__item-action ${isGPS101 ? 'navigator-notifications__item-action--gps101' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (notification.action.handler) {
                          notification.action.handler();
                        }
                      }}
                    >
                      {notification.action.label}
                    </button>
                  )}
                </div>
                
                {/* Dismiss */}
                {onNotificationDismiss && (
                  <button
                    type="button"
                    className="navigator-notifications__dismiss"
                    onClick={(e) => handleDismiss(e, notification.id)}
                    title="Dismiss"
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <div className="navigator-notifications__empty">
            <span className="navigator-notifications__empty-icon">
              {filter === 'gps101' ? '🎓' : '🧭'}
            </span>
            <p className="navigator-notifications__empty-text">
              {filter === 'unread' 
                ? "You're all caught up!"
                : filter === 'gps101'
                  ? "No GPS 101 notifications yet"
                  : "No notifications yet"}
            </p>
            <span className="navigator-notifications__empty-hint">
              Navigator will notify you of important updates
              {filter === 'gps101' && ' about your GPS 101 journey'}
            </span>
          </div>
        )}
      </div>
      
      {/* Show More */}
      {filteredNotifications.length > maxVisible && (
        <div className="navigator-notifications__more">
          <span className="navigator-notifications__more-text">
            +{filteredNotifications.length - maxVisible} more notifications
          </span>
        </div>
      )}
    </div>
  );
};

export default NavigatorNotifications;