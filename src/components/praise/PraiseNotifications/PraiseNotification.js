/**
 * GPS Lab Platform - PraiseNotification Component
 * 
 * Toast/notification component for real-time praise
 * alerts with celebration animations.
 * 
 * @module components/praise/PraiseNotifications/PraiseNotification
 */

import React, { useState, useEffect, useCallback } from 'react';
import './PraiseNotification.css';

/**
 * Get beacon color for stage
 */
const getBeaconColor = (stage) => {
  const colors = {
    1: 'var(--beacon-red, #e74c3c)',
    2: 'var(--beacon-orange, #f39c12)',
    3: 'var(--beacon-yellow, #f1c40f)',
    4: 'var(--beacon-green, #2ecc71)',
    5: 'var(--beacon-blue, #3498db)',
    6: 'var(--beacon-indigo, #9b59b6)',
    7: 'var(--beacon-purple, #8e44ad)'
  };
  return colors[stage] || 'var(--gps-primary, #00d4ff)';
};

/**
 * PraiseNotification Component
 */
const PraiseNotification = ({
  notification,
  position = 'top-right', // top-right, top-left, bottom-right, bottom-left, top-center
  duration = 5000,
  onClose,
  onView,
  showProgress = true,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  
  if (!notification) return null;
  
  const {
    id,
    type = 'received', // received, sent, badge
    sender = {},
    recipient = {},
    message,
    emoji = '🎉',
    badge = null,
    barakaEarned = 0
  } = notification;
  
  const senderBeaconColor = getBeaconColor(sender.stage);
  
  // Auto-dismiss timer
  useEffect(() => {
    if (!duration) return;
    
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      
      if (remaining === 0) {
        handleClose();
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [duration]);
  
  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose(id);
      }
    }, 300);
  }, [id, onClose]);
  
  const handleView = useCallback(() => {
    if (onView) {
      onView(notification);
    }
    handleClose();
  }, [notification, onView, handleClose]);
  
  if (!isVisible) return null;
  
  const classNames = [
    'praise-notification',
    `praise-notification--${position}`,
    `praise-notification--${type}`,
    isExiting && 'praise-notification--exiting',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Celebration Particles */}
      <div className="praise-notification__particles">
        <span className="praise-notification__particle">✨</span>
        <span className="praise-notification__particle">⭐</span>
        <span className="praise-notification__particle">🌟</span>
        <span className="praise-notification__particle">💫</span>
      </div>
      
      {/* Content */}
      <div className="praise-notification__content">
        {/* Icon */}
        <div className="praise-notification__icon">
          <span className="praise-notification__emoji">{emoji}</span>
        </div>
        
        {/* Message */}
        <div className="praise-notification__message">
          {type === 'received' && (
            <>
              <span className="praise-notification__title">
                You received praise!
              </span>
              <p className="praise-notification__text">
                <button
                  type="button"
                  className="praise-notification__user"
                  style={{ color: senderBeaconColor }}
                >
                  {sender.name || 'Someone'}
                </button>
                {' '}praised you
                {badge && (
                  <span className="praise-notification__badge-info">
                    {' '}with {badge.emoji} {badge.label}
                  </span>
                )}
              </p>
            </>
          )}
          
          {type === 'sent' && (
            <>
              <span className="praise-notification__title">
                Praise sent!
              </span>
              <p className="praise-notification__text">
                Your praise to {recipient.name || 'them'} was delivered
              </p>
            </>
          )}
          
          {type === 'badge' && (
            <>
              <span className="praise-notification__title">
                Badge awarded!
              </span>
              <p className="praise-notification__text">
                {sender.name} awarded you the {badge?.emoji} {badge?.label} badge
              </p>
            </>
          )}
          
          {/* Baraka Earned */}
          {barakaEarned > 0 && (
            <span className="praise-notification__baraka">
              +{barakaEarned} 🪙 Baraka
            </span>
          )}
        </div>
        
        {/* Actions */}
        <div className="praise-notification__actions">
          <button
            type="button"
            className="praise-notification__view-btn"
            onClick={handleView}
          >
            View
          </button>
          <button
            type="button"
            className="praise-notification__close-btn"
            onClick={handleClose}
          >
            ✕
          </button>
        </div>
      </div>
      
      {/* Progress Bar */}
      {showProgress && duration > 0 && (
        <div className="praise-notification__progress">
          <div 
            className="praise-notification__progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

/**
 * PraiseNotificationContainer - manages multiple notifications
 */
export const PraiseNotificationContainer = ({
  notifications = [],
  position = 'top-right',
  onClose,
  onView,
  maxVisible = 3
}) => {
  const visibleNotifications = notifications.slice(0, maxVisible);
  
  return (
    <div className={`praise-notification-container praise-notification-container--${position}`}>
      {visibleNotifications.map((notification, index) => (
        <PraiseNotification
          key={notification.id || index}
          notification={notification}
          position={position}
          onClose={onClose}
          onView={onView}
        />
      ))}
    </div>
  );
};

export default PraiseNotification;