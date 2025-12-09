/**
 * GPS Lab Platform - Notification Context
 * 
 * Provides notification management across the application.
 * 
 * @module contexts/NotificationContext
 */

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const NotificationContext = createContext(null);

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  MISSION: 'mission',
  ACHIEVEMENT: 'achievement',
  BARAKA: 'baraka',
  PARTY: 'party'
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    return newNotification.id;
  }, []);
  
  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id && !n.read
          ? { ...n, read: true }
          : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);
  
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
    setUnreadCount(0);
  }, []);
  
  const removeNotification = useCallback((id) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      if (notification && !notification.read) {
        setUnreadCount(c => Math.max(0, c - 1));
      }
      return prev.filter(n => n.id !== id);
    });
  }, []);
  
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);
  
  const value = useMemo(() => ({
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  }), [notifications, unreadCount, addNotification, markAsRead, markAllAsRead, removeNotification, clearAll]);
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;