/**
 * GPS Lab Platform - Notification Service
 * 
 * Notification management service for in-app notifications,
 * push notifications, and notification preferences.
 * 
 * MOCK MODE: When REACT_APP_USE_MOCK_DATA=true or API is unreachable,
 * all methods return realistic mock data for frontend-only development.
 * 
 * @module services/api/notification.service
 * @version 1.1.0
 */

import apiClient from './client';
import { getCache, setCache, getItem, setItem, STORAGE_KEYS } from '../storage/localStorage.service';
import { logUserAction } from '../../utils/error/logger';
import { on as wsOn, WS_EVENTS } from '../websocket/websocket.service';

// =============================================================================
// MOCK MODE CONFIGURATION
// =============================================================================

const USE_MOCK = process.env.REACT_APP_USE_MOCK_DATA === 'true' ||
                 process.env.NODE_ENV === 'development';

const mockDelay = (ms = 300) => new Promise(r => setTimeout(r, ms));
const logMock = (method) => console.info(`[NotificationService:MOCK] ${method}`);

// =============================================================================
// MOCK DATA
// =============================================================================

let mockNotifications = [
  {
    id: 'notif_001', type: 'mission_completed', category: 'progress',
    title: 'Mission Completed!', message: 'You completed "Understanding Systems" — well done!',
    priority: 'normal', read: false, actionUrl: '/missions/S1M2',
    metadata: { missionId: 'S1M2', xpEarned: 120, barakaEarned: 175 },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'notif_002', type: 'badge_earned', category: 'achievement',
    title: 'Badge Earned: Explorer 🗺️', message: 'You completed Adventure 1: Foundation!',
    priority: 'high', read: false, actionUrl: '/profile/badges',
    metadata: { badgeId: 'badge_005' },
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'notif_003', type: 'streak_milestone', category: 'achievement',
    title: '7-Day Streak! 🔥', message: 'Amazing consistency — claim your 50 Baraka reward.',
    priority: 'high', read: false, actionUrl: '/study/streak',
    metadata: { streakDays: 7, reward: 50 },
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'notif_004', type: 'praise_received', category: 'social',
    title: 'Praise from SolverAlpha', message: '"Great analysis on the systems mapping exercise!"',
    priority: 'normal', read: true, actionUrl: '/praise',
    metadata: { fromUserId: 'usr_002', fromUsername: 'SolverAlpha' },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'notif_005', type: 'baraka_earned', category: 'baraka',
    title: 'Baraka Earned', message: 'You earned 300 Baraka from mission completion.',
    priority: 'normal', read: true, actionUrl: '/wallet/baraka',
    metadata: { amount: 300, source: 'mission_complete' },
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'notif_006', type: 'party_invite', category: 'social',
    title: 'Party Invitation', message: 'BuilderGamma invited you to join "Impact Makers".',
    priority: 'normal', read: true, actionUrl: '/parties/invitations',
    metadata: { partyId: 'party_002', fromUserId: 'usr_004' },
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'notif_007', type: 'streak_reminder', category: 'reminder',
    title: 'Keep Your Streak Alive!', message: "You haven't studied today yet. 5 minutes is all it takes!",
    priority: 'high', read: true, actionUrl: '/study',
    metadata: {},
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'notif_008', type: 'system_announcement', category: 'system',
    title: 'New Feature: Praise System', message: 'Give and receive praise from your fellow GPS solvers!',
    priority: 'low', read: true, actionUrl: '/praise',
    metadata: {},
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const MOCK_PREFERENCES = {
  enabled: true,
  email: true,
  push: false,
  sound: true,
  categories: {
    achievement: true,
    progress: true,
    social: true,
    baraka: true,
    system: true,
    reminder: true
  }
};

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
  BADGE_EARNED: 'badge_earned',
  LEVEL_UP: 'level_up',
  MILESTONE_REACHED: 'milestone_reached',
  STREAK_MILESTONE: 'streak_milestone',
  MISSION_COMPLETED: 'mission_completed',
  CHECKPOINT_PASSED: 'checkpoint_passed',
  BITE_APPROVED: 'bite_approved',
  STAGE_COMPLETED: 'stage_completed',
  PRAISE_RECEIVED: 'praise_received',
  HONOR_RECEIVED: 'honor_received',
  PARTY_INVITE: 'party_invite',
  PARTY_MESSAGE: 'party_message',
  REVIEW_REQUEST: 'review_request',
  BARAKA_EARNED: 'baraka_earned',
  BARAKA_RECEIVED: 'baraka_received',
  COVENANT_RETURN: 'covenant_return',
  SYSTEM_ANNOUNCEMENT: 'system_announcement',
  MAINTENANCE: 'maintenance',
  FEATURE_UPDATE: 'feature_update',
  STREAK_REMINDER: 'streak_reminder',
  STUDY_REMINDER: 'study_reminder',
  DEADLINE_REMINDER: 'deadline_reminder'
};

export const NOTIFICATION_PRIORITY = { LOW: 'low', NORMAL: 'normal', HIGH: 'high', URGENT: 'urgent' };

export const NOTIFICATION_CATEGORIES = {
  ACHIEVEMENT: 'achievement', PROGRESS: 'progress', SOCIAL: 'social',
  BARAKA: 'baraka', SYSTEM: 'system', REMINDER: 'reminder'
};

// =============================================================================
// NOTIFICATION OPERATIONS
// =============================================================================

export const getNotifications = async ({ page = 1, limit = 20, category, unreadOnly = false } = {}) => {
  if (USE_MOCK) {
    logMock('getNotifications');
    await mockDelay(300);

    let filtered = [...mockNotifications];
    if (category) filtered = filtered.filter(n => n.category === category);
    if (unreadOnly) filtered = filtered.filter(n => !n.read);

    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);

    return {
      notifications: paged,
      pagination: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) }
    };
  }

  const params = { page, limit };
  if (category) params.category = category;
  if (unreadOnly) params.unread = true;
  const response = await apiClient.get(ENDPOINTS.notifications, { params });
  return response.data;
};

export const getUnreadCount = async () => {
  if (USE_MOCK) {
    logMock('getUnreadCount');
    await mockDelay(150);
    const count = mockNotifications.filter(n => !n.read).length;
    return { count, byCategory: { achievement: 1, progress: 1, social: 0, baraka: 0, system: 0, reminder: 1 } };
  }
  const response = await apiClient.get(ENDPOINTS.unread);
  return response.data;
};

export const getNotification = async (notificationId) => {
  if (USE_MOCK) {
    logMock(`getNotification: ${notificationId}`);
    await mockDelay(200);
    const n = mockNotifications.find(n => n.id === notificationId);
    if (!n) throw new Error(`Notification ${notificationId} not found`);
    return { ...n };
  }
  const response = await apiClient.get(`${ENDPOINTS.notifications}/${notificationId}`);
  return response.data;
};

export const markAsRead = async (notificationId) => {
  if (USE_MOCK) {
    logMock(`markAsRead: ${notificationId}`);
    await mockDelay(150);
    const n = mockNotifications.find(n => n.id === notificationId);
    if (n) n.read = true;
    return;
  }
  await apiClient.post(`${ENDPOINTS.markRead}/${notificationId}`);
};

export const markMultipleAsRead = async (notificationIds) => {
  if (USE_MOCK) {
    logMock(`markMultipleAsRead: ${notificationIds.length} items`);
    await mockDelay(200);
    notificationIds.forEach(id => {
      const n = mockNotifications.find(n => n.id === id);
      if (n) n.read = true;
    });
    return;
  }
  await apiClient.post(ENDPOINTS.markRead, { ids: notificationIds });
};

export const markAllAsRead = async (category) => {
  if (USE_MOCK) {
    logMock('markAllAsRead');
    await mockDelay(200);
    mockNotifications.forEach(n => {
      if (!category || n.category === category) n.read = true;
    });
    logUserAction('notifications_all_marked_read', { category });
    return;
  }
  const params = {};
  if (category) params.category = category;
  await apiClient.post(ENDPOINTS.markAllRead, null, { params });
  logUserAction('notifications_all_marked_read', { category });
};

export const deleteNotification = async (notificationId) => {
  if (USE_MOCK) {
    logMock(`deleteNotification: ${notificationId}`);
    await mockDelay(200);
    mockNotifications = mockNotifications.filter(n => n.id !== notificationId);
    return;
  }
  await apiClient.delete(`${ENDPOINTS.notifications}/${notificationId}`);
};

export const clearAll = async (category) => {
  if (USE_MOCK) {
    logMock('clearAll');
    await mockDelay(300);
    if (category) {
      mockNotifications = mockNotifications.filter(n => n.category !== category);
    } else {
      mockNotifications = [];
    }
    logUserAction('notifications_cleared', { category });
    return;
  }
  const params = {};
  if (category) params.category = category;
  await apiClient.delete(ENDPOINTS.notifications, { params });
  logUserAction('notifications_cleared', { category });
};

// =============================================================================
// PREFERENCES
// =============================================================================

export const getPreferences = async () => {
  if (USE_MOCK) {
    logMock('getPreferences');
    await mockDelay(200);
    return { ...MOCK_PREFERENCES };
  }
  const response = await apiClient.get(ENDPOINTS.preferences);
  return response.data;
};

export const updatePreferences = async (preferences) => {
  if (USE_MOCK) {
    logMock('updatePreferences');
    await mockDelay(300);
    Object.assign(MOCK_PREFERENCES, preferences);
    setItem(STORAGE_KEYS.notificationsEnabled, preferences.enabled !== false);
    logUserAction('notification_preferences_updated');
    return { ...MOCK_PREFERENCES };
  }

  const response = await apiClient.patch(ENDPOINTS.preferences, preferences);
  setItem(STORAGE_KEYS.notificationsEnabled, preferences.enabled !== false);
  logUserAction('notification_preferences_updated');
  return response.data;
};

export const setCategoryEnabled = async (category, enabled) => {
  if (USE_MOCK) {
    logMock(`setCategoryEnabled: ${category} = ${enabled}`);
    await mockDelay(200);
    MOCK_PREFERENCES.categories[category] = enabled;
    return { ...MOCK_PREFERENCES };
  }
  const response = await apiClient.patch(ENDPOINTS.preferences, { categories: { [category]: enabled } });
  return response.data;
};

// =============================================================================
// PUSH NOTIFICATIONS
// =============================================================================

export const subscribeToPush = async (subscription) => {
  if (USE_MOCK) {
    logMock('subscribeToPush');
    await mockDelay(400);
    logUserAction('push_notifications_subscribed');
    return { subscribed: true };
  }
  const response = await apiClient.post(ENDPOINTS.pushSubscribe, subscription);
  logUserAction('push_notifications_subscribed');
  return response.data;
};

export const unsubscribeFromPush = async () => {
  if (USE_MOCK) {
    logMock('unsubscribeFromPush');
    await mockDelay(300);
    logUserAction('push_notifications_unsubscribed');
    return;
  }
  await apiClient.post(ENDPOINTS.pushUnsubscribe);
  logUserAction('push_notifications_unsubscribed');
};

export const requestPushPermission = async () => {
  if (!('Notification' in window)) return 'unsupported';

  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
      });
      await subscribeToPush(subscription.toJSON());
    } catch (err) {
      console.warn('Push subscription failed:', err);
    }
  }

  return permission;
};

// =============================================================================
// REAL-TIME NOTIFICATIONS
// =============================================================================

export const onNotification = (callback) => {
  if (USE_MOCK) {
    // In mock mode, simulate receiving a notification after 30 seconds
    const timer = setTimeout(() => {
      const mockNew = {
        id: 'notif_live_' + Date.now(),
        type: 'study_reminder', category: 'reminder',
        title: 'Time to Study!', message: 'Your daily study session awaits.',
        priority: 'normal', read: false, actionUrl: '/study',
        createdAt: new Date().toISOString()
      };
      mockNotifications.unshift(mockNew);
      callback(mockNew);
    }, 30000);
    return () => clearTimeout(timer);
  }

  return wsOn(WS_EVENTS.NOTIFICATION, (data) => {
    if (getItem(STORAGE_KEYS.notificationsEnabled) !== false) {
      showBrowserNotification(data);
    }
    callback(data);
  });
};

const showBrowserNotification = (notification) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const { title, body, icon, data } = formatBrowserNotification(notification);
  const browserNotification = new Notification(title, {
    body, icon: icon || '/icons/notification-icon.png',
    badge: '/icons/badge-icon.png', tag: notification.id, data
  });

  browserNotification.onclick = () => {
    window.focus();
    if (data?.url) window.location.href = data.url;
    browserNotification.close();
  };
};

// =============================================================================
// TOAST NOTIFICATIONS (unchanged — no API calls)
// =============================================================================

export const showToast = ({ type = 'info', title, message, duration = 5000, action }) => {
  const toast = { id: Date.now().toString(), type, title, message, action, createdAt: new Date() };
  window.dispatchEvent(new CustomEvent('notification:toast', { detail: toast }));
  if (duration > 0) setTimeout(() => dismissToast(toast.id), duration);
  return toast;
};

export const dismissToast = (toastId) => {
  window.dispatchEvent(new CustomEvent('notification:toast:dismiss', { detail: { id: toastId } }));
};

export const success = (message, options = {}) => showToast({ type: 'success', message, ...options });
export const error = (message, options = {}) => showToast({ type: 'error', message, ...options });
export const warning = (message, options = {}) => showToast({ type: 'warning', message, ...options });
export const info = (message, options = {}) => showToast({ type: 'info', message, ...options });

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export const getTypeInfo = (type) => {
  const types = {
    [NOTIFICATION_TYPES.BADGE_EARNED]: { icon: '🏅', color: 'yellow', category: NOTIFICATION_CATEGORIES.ACHIEVEMENT },
    [NOTIFICATION_TYPES.LEVEL_UP]: { icon: '⬆️', color: 'purple', category: NOTIFICATION_CATEGORIES.ACHIEVEMENT },
    [NOTIFICATION_TYPES.MISSION_COMPLETED]: { icon: '✅', color: 'green', category: NOTIFICATION_CATEGORIES.PROGRESS },
    [NOTIFICATION_TYPES.CHECKPOINT_PASSED]: { icon: '🏁', color: 'green', category: NOTIFICATION_CATEGORIES.PROGRESS },
    [NOTIFICATION_TYPES.PRAISE_RECEIVED]: { icon: '👍', color: 'blue', category: NOTIFICATION_CATEGORIES.SOCIAL },
    [NOTIFICATION_TYPES.HONOR_RECEIVED]: { icon: '🙏', color: 'blue', category: NOTIFICATION_CATEGORIES.SOCIAL },
    [NOTIFICATION_TYPES.PARTY_INVITE]: { icon: '🎉', color: 'blue', category: NOTIFICATION_CATEGORIES.SOCIAL },
    [NOTIFICATION_TYPES.BARAKA_EARNED]: { icon: '💰', color: 'baraka', category: NOTIFICATION_CATEGORIES.BARAKA },
    [NOTIFICATION_TYPES.COVENANT_RETURN]: { icon: '🤝', color: 'baraka', category: NOTIFICATION_CATEGORIES.BARAKA },
    [NOTIFICATION_TYPES.STREAK_REMINDER]: { icon: '🔥', color: 'orange', category: NOTIFICATION_CATEGORIES.REMINDER },
    [NOTIFICATION_TYPES.STUDY_REMINDER]: { icon: '📚', color: 'blue', category: NOTIFICATION_CATEGORIES.REMINDER },
    [NOTIFICATION_TYPES.SYSTEM_ANNOUNCEMENT]: { icon: '📢', color: 'gray', category: NOTIFICATION_CATEGORIES.SYSTEM },
    [NOTIFICATION_TYPES.STREAK_MILESTONE]: { icon: '🔥', color: 'orange', category: NOTIFICATION_CATEGORIES.ACHIEVEMENT }
  };
  return types[type] || { icon: '🔔', color: 'gray', category: NOTIFICATION_CATEGORIES.SYSTEM };
};

const formatBrowserNotification = (notification) => {
  const typeInfo = getTypeInfo(notification.type);
  return {
    title: notification.title || 'GPS Lab',
    body: notification.message,
    icon: typeInfo.icon,
    data: { url: notification.actionUrl, notificationId: notification.id }
  };
};

export const groupByDate = (notifications) => {
  const groups = { today: [], yesterday: [], thisWeek: [], older: [] };
  const today = new Date();
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7);

  notifications.forEach(notification => {
    const date = new Date(notification.createdAt);
    if (date.toDateString() === today.toDateString()) groups.today.push(notification);
    else if (date.toDateString() === yesterday.toDateString()) groups.yesterday.push(notification);
    else if (date > weekAgo) groups.thisWeek.push(notification);
    else groups.older.push(notification);
  });
  return groups;
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  getNotifications, getUnreadCount, getNotification,
  markAsRead, markMultipleAsRead, markAllAsRead,
  deleteNotification, clearAll,
  getPreferences, updatePreferences, setCategoryEnabled,
  subscribeToPush, unsubscribeFromPush, requestPushPermission,
  onNotification,
  showToast, dismissToast, success, error, warning, info,
  getTypeInfo, groupByDate,
  NOTIFICATION_TYPES, NOTIFICATION_PRIORITY, NOTIFICATION_CATEGORIES
};