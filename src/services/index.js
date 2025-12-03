/**
 * GPS Lab Platform - Services Index
 * 
 * Central export for all services.
 * 
 * @module services
 * @version 1.0.0
 */

// =============================================================================
// API SERVICES
// =============================================================================

export { default as apiClient, setTokens, clearTokens, getAccessToken, getRefreshToken } from './api/client';
export { default as authService } from './api/auth.service';
export { default as userService } from './api/user.service';
export { default as missionService } from './api/mission.service';
export { default as biteService } from './api/bite.service';
export { default as barakaService } from './api/baraka.service';
export { default as checkpointService } from './api/checkpoint.service';
export { default as studyService } from './api/study.service';
export { default as psbService } from './api/psb.service';
export { default as praiseService } from './api/praise.service';
export { default as partyService } from './api/party.service';
export { default as projectService } from './api/project.service';
export { default as navigatorService } from './api/navigator.service';
export { default as notificationService } from './api/notification.service';

// =============================================================================
// STORAGE SERVICES
// =============================================================================

export {
  // Local Storage
  getItem,
  setItem,
  removeItem,
  hasItem,
  clear,
  getAll,
  getSize,
  getUser,
  setUser,
  getTheme,
  setTheme,
  getLocale,
  setLocale,
  getCurrentMission,
  setCurrentMission,
  getDraftBite,
  setDraftBite,
  clearDraftBite,
  getCache,
  setCache,
  clearCache,
  cleanupExpired,
  subscribe,
  subscribeToKey,
  STORAGE_KEYS
} from './storage/localStorage.service';

export {
  // Session Storage
  getReturnUrl,
  setReturnUrl,
  clearReturnUrl,
  pushNavigation,
  popNavigation,
  saveFormData,
  getFormData,
  clearFormData,
  getWizardStep,
  setWizardStep,
  saveScrollPosition,
  getScrollPosition,
  saveFilterState,
  getFilterState,
  saveSortState,
  getSortState,
  saveSelectedTab,
  getSelectedTab,
  markBriefingViewed,
  isBriefingViewed,
  saveCheckpointAttempt,
  getCheckpointAttempt,
  saveBiteWorkspace,
  getBiteWorkspace,
  saveOAuthState,
  validateOAuthState,
  savePendingAction,
  getPendingAction,
  SESSION_KEYS
} from './storage/sessionStorage.service';

// =============================================================================
// WEBSOCKET SERVICE
// =============================================================================

export {
  default as websocketService,
  connect as wsConnect,
  disconnect as wsDisconnect,
  send as wsSend,
  on as wsOn,
  off as wsOff,
  onMessage as wsOnMessage,
  subscribe as wsSubscribe,
  unsubscribe as wsUnsubscribe,
  getState as wsGetState,
  isConnected as wsIsConnected,
  WS_EVENTS,
  CONNECTION_STATES
} from './websocket/websocket.service';

// =============================================================================
// AUDIO SERVICE
// =============================================================================

export {
  default as audioService,
  initialize as audioInitialize,
  play as audioPlay,
  playClick,
  playSuccess,
  playError,
  playNotification,
  playMusic,
  stopMusic,
  setVolume as setAudioVolume,
  enable as enableAudio,
  disable as disableAudio,
  SOUNDS,
  MUSIC
} from './audio/audio.service';

// =============================================================================
// ANALYTICS SERVICE
// =============================================================================

export {
  default as analyticsService,
  initialize as analyticsInitialize,
  track,
  trackPageView,
  trackClick,
  trackFeature,
  trackSearch,
  trackError,
  trackMission,
  trackBite,
  trackCheckpoint,
  trackStudySession,
  ANALYTICS_EVENTS,
  EVENT_CATEGORIES
} from './analytics/analytics.service';

// =============================================================================
// I18N SERVICE
// =============================================================================

export {
  default as i18nService,
  initialize as i18nInitialize,
  t,
  plural,
  changeLocale,
  getLocale as getCurrentLocale,
  getSupportedLocales,
  loadNamespace,
  formatNumber,
  formatCurrency,
  formatDate,
  formatRelativeTime,
  onLocaleChange,
  LOCALES,
  LOCALE_INFO,
  NAMESPACES
} from './i18n/i18n.service';

// =============================================================================
// SERVICE INITIALIZATION
// =============================================================================

import { cleanupExpired, clearCache, clearTokens } from './storage/localStorage.service';
import { wsDisconnect } from './websocket/websocket.service';
import { audioInitialize } from './audio/audio.service';
import { analyticsInitialize, cleanup as analyticsCleanup } from './analytics/analytics.service';
import { i18nInitialize } from './i18n/i18n.service';

/**
 * Initializes all services
 * @returns {Promise<void>}
 */
export const initializeServices = async () => {
  // Clean up expired cache items
  cleanupExpired();
  
  // Initialize i18n
  await i18nInitialize();
  
  // Initialize audio
  audioInitialize();
  
  // Initialize analytics
  analyticsInitialize();
  
  console.log('[Services] Initialized');
};

/**
 * Cleans up services on logout
 */
export const cleanupServices = () => {
  // Clear tokens
  clearTokens();
  
  // Clear user-specific cache
  clearCache();
  
  // Disconnect WebSocket
  wsDisconnect();
  
  // Cleanup analytics
  analyticsCleanup();
  
  console.log('[Services] Cleaned up');
};