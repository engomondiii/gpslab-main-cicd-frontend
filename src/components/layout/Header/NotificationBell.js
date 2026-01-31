/**
 * GPS Lab Platform - NotificationBell Component
 * 
 * Notification bell with dropdown for recent notifications.
 * 
 * @module components/layout/Header/NotificationBell
 * @version 1.1.0
 * 
 * FIXED: Converted footer <a href> to React Router <Link> component
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NotificationBell.css';

// =============================================================================
// CONSTANTS
// =============================================================================

const NOTIFICATION_TYPES = {
  ACHIEVEMENT: 'achievement',
  MISSION: 'mission',
  COMMUNITY: 'community',
  BARAKA: 'baraka',
  SYSTEM: 'system'
};

// Type icons
const TYPE_ICONS = {
  [NOTIFICATION_TYPES.ACHIEVEMENT]: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
    </svg>
  ),
  [NOTIFICATION_TYPES.MISSION]: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
    </svg>
  ),
  [NOTIFICATION_TYPES.COMMUNITY]: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
    </svg>
  ),
  [NOTIFICATION_TYPES.BARAKA]: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
    </svg>
  ),
  [NOTIFICATION_TYPES.SYSTEM]: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
    </svg>
  )
};

// Format time ago
const formatTimeAgo = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * NotificationBell component
 * 
 * @param {Object} props - Component props
 * @param {Array} [props.notifications=[]] - Notifications array
 * @param {number} [props.unreadCount=0] - Unread notifications count
 * @param {Function} [props.onClick] - Click handler for notifications
 * @param {Function} [props.onMarkAllRead] - Mark all as read handler
 * @param {string} [props.className] - Additional CSS classes
 */
const NotificationBell = ({
  notifications = [],
  unreadCount = 0,
  onClick,
  onMarkAllRead,
  className = '',
  ...props
}) => {
  
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef(null);
  
  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  
  const handleNotificationClick = (notification) => {
    onClick?.(notification);
    setIsOpen(false);
  };
  
  // FIXED: Close dropdown when clicking view all
  const handleViewAllClick = () => {
    setIsOpen(false);
  };
  
  const classNames = [
    'notification-bell',
    isOpen && 'notification-bell--open',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} ref={bellRef} {...props}>
      {/* Bell Button */}
      <button
        type="button"
        className="notification-bell__trigger"
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        
        {unreadCount > 0 && (
          <span className="notification-bell__badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      
      {/* Dropdown */}
      {isOpen && (
        <div className="notification-bell__dropdown">
          {/* Header */}
          <div className="notification-bell__header">
            <h3 className="notification-bell__title">Notifications</h3>
            {unreadCount > 0 && (
              <button
                type="button"
                className="notification-bell__mark-read"
                onClick={onMarkAllRead}
              >
                Mark all read
              </button>
            )}
          </div>
          
          {/* Notifications List */}
          <div className="notification-bell__list">
            {notifications.length === 0 ? (
              <div className="notification-bell__empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 01-3.46 0"/>
                </svg>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.slice(0, 5).map(notification => (
                <button
                  key={notification.id}
                  type="button"
                  className={`notification-bell__item ${!notification.read ? 'notification-bell__item--unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <span className={`notification-bell__item-icon notification-bell__item-icon--${notification.type}`}>
                    {TYPE_ICONS[notification.type] || TYPE_ICONS[NOTIFICATION_TYPES.SYSTEM]}
                  </span>
                  <div className="notification-bell__item-content">
                    <p className="notification-bell__item-text">{notification.message}</p>
                    <span className="notification-bell__item-time">
                      {formatTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                  {!notification.read && (
                    <span className="notification-bell__item-dot" />
                  )}
                </button>
              ))
            )}
          </div>
          
          {/* Footer - FIXED: Using Link instead of <a> */}
          {notifications.length > 0 && (
            <div className="notification-bell__footer">
              <Link 
                to="/notifications" 
                className="notification-bell__view-all"
                onClick={handleViewAllClick}
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Export constants
export { NOTIFICATION_TYPES };

// =============================================================================
// EXPORTS
// =============================================================================

export default NotificationBell;