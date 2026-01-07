/**
 * GPS Lab Platform - NavigatorNotifications Component
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
  social: { icon: '👥', color: 'var(--beacon-blue)', label: 'Social' }
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
  maxVisible = 10,
  showHeader = true,
  className = '',
  ...props
}) => {
  const [filter, setFilter] = useState('all'); // all, unread
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;
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
      </div>
      
      {/* Notifications List */}
      <div className="navigator-notifications__list">
        {visibleNotifications.length > 0 ? (
          visibleNotifications.map((notification, index) => {
            const typeConfig = NOTIFICATION_TYPES[notification.type] || NOTIFICATION_TYPES.tip;
            
            return (
              <div
                key={notification.id || index}
                className={`navigator-notifications__item ${!notification.isRead ? 'navigator-notifications__item--unread' : ''}`}
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
                    <span className="navigator-notifications__type">{typeConfig.label}</span>
                    <span className="navigator-notifications__time">
                      {formatRelativeTime(notification.timestamp)}
                    </span>
                  </div>
                  <p className="navigator-notifications__message">{notification.message}</p>
                  
                  {/* Action */}
                  {notification.action && (
                    <button
                      type="button"
                      className="navigator-notifications__item-action"
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
            <span className="navigator-notifications__empty-icon">🧭</span>
            <p className="navigator-notifications__empty-text">
              {filter === 'unread' 
                ? "You're all caught up!"
                : "No notifications yet"}
            </p>
            <span className="navigator-notifications__empty-hint">
              Navigator will notify you of important updates
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