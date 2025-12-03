/**
 * GPS Lab Platform - Notification Service
 * 
 * Notification management service for in-app notifications,
 * push notifications, and notification preferences.
 * 
 * @module services/api/notification.service
 * @version 1.0.0
 */

import apiClient from './client';
import { getCache, setCache, getItem, setItem, STORAGE_KEYS } from '../storage/localStorage.service';
import { logUserAction } from '../../utils/error/logger';
import { on as wsOn, WS_EVENTS } from '../websocket/websocket.service';

// =============================================================================
// API ENDPOINTS
// =============================================================================

const ENDPOINTS = {
  notifications: '/notifications',
  unread: '/notifications/unread',
  markRead: '/notifications/mark-read',
  markAllRead: '/notifications/mark-all-read',
  preferences: '/notifications/preferences',
  pushSubscribe: '/notifications/push/subscribe',
  pushUnsubscribe: '/notifications/push/unsubscribe'
};

// =============================================================================
// NOTIFICATION CONSTANTS
// =============================================================================

export const NOTIFICATION_TYPES = {
  // Achievement
  BADGE_EARNED: 'badge_earned',
  LEVEL_UP: 'level_up',
  MILESTONE_REACHED: 'milestone_reached',
  STREAK_MILESTONE: 'streak_milestone',
  
  // Progress
  MISSION_COMPLETED: 'mission_completed',
  CHECKPOINT_PASSED: 'checkpoint_passed',
  BITE_APPROVED: 'bite_approved',
  STAGE_COMPLETED: 'stage_completed',
  
  // Social
  PRAISE_RECEIVED: 'praise_received',
  HONOR_RECEIVED: 'honor_received',
  PARTY_INVITE: 'party_invite',
  PARTY_MESSAGE: 'party_message',
  REVIEW_REQUEST: 'review_request',
  
  // Baraka
  BARAKA_EARNED: 'baraka_earned',
  BARAKA_RECEIVED: 'baraka_received',
  COVENANT_RETURN: 'covenant_return',
  
  // System
  SYSTEM_ANNOUNCEMENT: 'system_announcement',
  MAINTENANCE: 'maintenance',
  FEATURE_UPDATE: 'feature_update',
  
  // Reminder
  STREAK_REMINDER: 'streak_reminder',
  STUDY_REMINDER: 'study_reminder',
  DEADLINE_REMINDER: 'deadline_reminder'
};

export const NOTIFICATION_PRIORITY = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
};

export const NOTIFICATION_CATEGORIES = {
  ACHIEVEMENT: 'achievement',
  PROGRESS: 'progress',
  SOCIAL: 'social',
  BARAKA: 'baraka',
  SYSTEM: 'system',
  REMINDER: 'reminder'
};

// =============================================================================
// NOTIFICATION OPERATIONS
// =============================================================================

/**
 * Gets notifications
 * @param {Object} params - Query params
 * @returns {Promise<Object>} Notifications list
 */
export const getNotifications = async ({
  page = 1,
  limit = 20,
  category,
  unreadOnly = false
} = {}) => {
  const params = { page, limit };
  if (category) params.category = category;
  if (unreadOnly) params.unread = true;
  
  const response = await apiClient.get(ENDPOINTS.notifications, { params });
  return response.data;
};

/**
 * Gets unread notifications count
 * @returns {Promise<Object>} Unread count
 */
export const getUnreadCount = async () => {
  const response = await apiClient.get(ENDPOINTS.unread);
  return response.data;
};

/**
 * Gets notification by ID
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>} Notification
 */
export const getNotification = async (notificationId) => {
  const response = await apiClient.get(`${ENDPOINTS.notifications}/${notificationId}`);
  return response.data;
};

/**
 * Marks notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise<void>}
 */
export const markAsRead = async (notificationId) => {
  await apiClient.post(`${ENDPOINTS.markRead}/${notificationId}`);
};

/**
 * Marks multiple notifications as read
 * @param {Array<string>} notificationIds - Notification IDs
 * @returns {Promise<void>}
 */
export const markMultipleAsRead = async (notificationIds) => {
  await apiClient.post(ENDPOINTS.markRead, { ids: notificationIds });
};

/**
 * Marks all notifications as read
 * @param {string} category - Optional category filter
 * @returns {Promise<void>}
 */
export const markAllAsRead = async (category) => {
  const params = {};
  if (category) params.category = category;
  
  await apiClient.post(ENDPOINTS.markAllRead, null, { params });
  
  logUserAction('notifications_all_marked_read', { category });
};

/**
 * Deletes notification
 * @param {string} notificationId - Notification ID
 * @returns {Promise<void>}
 */
export const deleteNotification = async (notificationId) => {
  await apiClient.delete(`${ENDPOINTS.notifications}/${notificationId}`);
};

/**
 * Clears all notifications
 * @param {string} category - Optional category filter
 * @returns {Promise<void>}
 */
export const clearAll = async (category) => {
  const params = {};
  if (category) params.category = category;
  
  await apiClient.delete(ENDPOINTS.notifications, { params });
  
  logUserAction('notifications_cleared', { category });
};

// =============================================================================
// PREFERENCES
// =============================================================================

/**
 * Gets notification preferences
 * @returns {Promise<Object>} Preferences
 */
export const getPreferences = async () => {
  const response = await apiClient.get(ENDPOINTS.preferences);
  return response.data;
};

/**
 * Updates notification preferences
 * @param {Object} preferences - Preferences to update
 * @returns {Promise<Object>} Updated preferences
 */
export const updatePreferences = async (preferences) => {
  const response = await apiClient.patch(ENDPOINTS.preferences, preferences);
  
  // Update local storage
  setItem(STORAGE_KEYS.notificationsEnabled, preferences.enabled !== false);
  
  logUserAction('notification_preferences_updated');
  
  return response.data;
};

/**
 * Enables/disables notification category
 * @param {string} category - Category
 * @param {boolean} enabled - Enable state
 * @returns {Promise<Object>} Updated preferences
 */
export const setCategoryEnabled = async (category, enabled) => {
  const response = await apiClient.patch(ENDPOINTS.preferences, {
    categories: { [category]: enabled }
  });
  return response.data;
};

// =============================================================================
// PUSH NOTIFICATIONS
// =============================================================================

/**
 * Subscribes to push notifications
 * @param {Object} subscription - Push subscription
 * @returns {Promise<Object>} Subscription result
 */
export const subscribeToPush = async (subscription) => {
  const response = await apiClient.post(ENDPOINTS.pushSubscribe, subscription);
  
  logUserAction('push_notifications_subscribed');
  
  return response.data;
};

/**
 * Unsubscribes from push notifications
 * @returns {Promise<void>}
 */
export const unsubscribeFromPush = async () => {
  await apiClient.post(ENDPOINTS.pushUnsubscribe);
  
  logUserAction('push_notifications_unsubscribed');
};

/**
 * Requests push notification permission
 * @returns {Promise<string>} Permission status
 */
export const requestPushPermission = async () => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  
  const permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    // Subscribe to push
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
    });
    
    await subscribeToPush(subscription.toJSON());
  }
  
  return permission;
};

// =============================================================================
// REAL-TIME NOTIFICATIONS
// =============================================================================

/**
 * Sets up real-time notification listener
 * @param {Function} callback - Callback for new notifications
 * @returns {Function} Unsubscribe function
 */
export const onNotification = (callback) => {
  return wsOn(WS_EVENTS.NOTIFICATION, (data) => {
    // Dispatch browser notification if enabled
    if (getItem(STORAGE_KEYS.notificationsEnabled) !== false) {
      showBrowserNotification(data);
    }
    
    callback(data);
  });
};

/**
 * Shows browser notification
 * @param {Object} notification - Notification data
 */
const showBrowserNotification = (notification) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }
  
  const { title, body, icon, data } = formatBrowserNotification(notification);
  
  const browserNotification = new Notification(title, {
    body,
    icon: icon || '/icons/notification-icon.png',
    badge: '/icons/badge-icon.png',
    tag: notification.id,
    data
  });
  
  browserNotification.onclick = () => {
    window.focus();
    if (data?.url) {
      window.location.href = data.url;
    }
    browserNotification.close();
  };
};

// =============================================================================
// TOAST NOTIFICATIONS
// =============================================================================

let toastContainer = null;

/**
 * Shows toast notification
 * @param {Object} options - Toast options
 * @returns {Object} Toast instance
 */
export const showToast = ({ 
  type = 'info', 
  title, 
  message, 
  duration = 5000,
  action
}) => {
  const toast = {
    id: Date.now().toString(),
    type,
    title,
    message,
    action,
    createdAt: new Date()
  };
  
  // Dispatch event for toast component to handle
  window.dispatchEvent(new CustomEvent('notification:toast', { detail: toast }));
  
  // Auto dismiss
  if (duration > 0) {
    setTimeout(() => {
      dismissToast(toast.id);
    }, duration);
  }
  
  return toast;
};

/**
 * Dismisses toast
 * @param {string} toastId - Toast ID
 */
export const dismissToast = (toastId) => {
  window.dispatchEvent(new CustomEvent('notification:toast:dismiss', { 
    detail: { id: toastId } 
  }));
};

/**
 * Shows success toast
 * @param {string} message - Message
 * @param {Object} options - Options
 */
export const success = (message, options = {}) => {
  return showToast({ type: 'success', message, ...options });
};

/**
 * Shows error toast
 * @param {string} message - Message
 * @param {Object} options - Options
 */
export const error = (message, options = {}) => {
  return showToast({ type: 'error', message, ...options });
};

/**
 * Shows warning toast
 * @param {string} message - Message
 * @param {Object} options - Options
 */
export const warning = (message, options = {}) => {
  return showToast({ type: 'warning', message, ...options });
};

/**
 * Shows info toast
 * @param {string} message - Message
 * @param {Object} options - Options
 */
export const info = (message, options = {}) => {
  return showToast({ type: 'info', message, ...options });
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Gets notification type info
 * @param {string} type - Notification type
 * @returns {Object} Type info
 */
export const getTypeInfo = (type) => {
  const types = {
    [NOTIFICATION_TYPES.BADGE_EARNED]: { 
      icon: '🏅', 
      color: 'yellow', 
      category: NOTIFICATION_CATEGORIES.ACHIEVEMENT 
    },
    [NOTIFICATION_TYPES.LEVEL_UP]: { 
      icon: '⬆️', 
      color: 'purple', 
      category: NOTIFICATION_CATEGORIES.ACHIEVEMENT 
    },
    [NOTIFICATION_TYPES.MISSION_COMPLETED]: { 
      icon: '✅', 
      color: 'green', 
      category: NOTIFICATION_CATEGORIES.PROGRESS 
    },
    [NOTIFICATION_TYPES.PRAISE_RECEIVED]: { 
      icon: '👏', 
      color: 'blue', 
      category: NOTIFICATION_CATEGORIES.SOCIAL 
    },
    [NOTIFICATION_TYPES.BARAKA_EARNED]: { 
      icon: '💰', 
      color: 'baraka', 
      category: NOTIFICATION_CATEGORIES.BARAKA 
    },
    [NOTIFICATION_TYPES.STREAK_REMINDER]: { 
      icon: '🔥', 
      color: 'orange', 
      category: NOTIFICATION_CATEGORIES.REMINDER 
    },
    [NOTIFICATION_TYPES.SYSTEM_ANNOUNCEMENT]: { 
      icon: '📢', 
      color: 'gray', 
      category: NOTIFICATION_CATEGORIES.SYSTEM 
    }
  };
  
  return types[type] || { icon: '🔔', color: 'gray', category: NOTIFICATION_CATEGORIES.SYSTEM };
};

/**
 * Formats notification for browser display
 * @param {Object} notification - Notification data
 * @returns {Object} Browser notification format
 */
const formatBrowserNotification = (notification) => {
  const typeInfo = getTypeInfo(notification.type);
  
  return {
    title: notification.title || 'GPS Lab',
    body: notification.message,
    icon: typeInfo.icon,
    data: {
      url: notification.actionUrl,
      notificationId: notification.id
    }
  };
};

/**
 * Groups notifications by date
 * @param {Array} notifications - Notifications array
 * @returns {Object} Grouped notifications
 */
export const groupByDate = (notifications) => {
  const groups = {
    today: [],
    yesterday: [],
    thisWeek: [],
    older: []
  };
  
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  notifications.forEach(notification => {
    const date = new Date(notification.createdAt);
    
    if (date.toDateString() === today.toDateString()) {
      groups.today.push(notification);
    } else if (date.toDateString() === yesterday.toDateString()) {
      groups.yesterday.push(notification);
    } else if (date > weekAgo) {
      groups.thisWeek.push(notification);
    } else {
      groups.older.push(notification);
    }
  });
  
  return groups;
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Core operations
  getNotifications,
  getUnreadCount,
  getNotification,
  markAsRead,
  markMultipleAsRead,
  markAllAsRead,
  deleteNotification,
  clearAll,
  
  // Preferences
  getPreferences,
  updatePreferences,
  setCategoryEnabled,
  
  // Push
  subscribeToPush,
  unsubscribeFromPush,
  requestPushPermission,
  
  // Real-time
  onNotification,
  
  // Toast
  showToast,
  dismissToast,
  success,
  error,
  warning,
  info,
  
  // Helpers
  getTypeInfo,
  groupByDate,
  
  // Constants
  NOTIFICATION_TYPES,
  NOTIFICATION_PRIORITY,
  NOTIFICATION_CATEGORIES
};