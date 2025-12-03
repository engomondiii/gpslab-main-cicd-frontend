/**
 * GPS Lab Platform - Analytics Service
 * 
 * Analytics and tracking service for user behavior,
 * engagement metrics, and learning analytics.
 * 
 * @module services/analytics/analytics.service
 * @version 1.0.0
 */

import apiClient from '../api/client';
import { getItem, STORAGE_KEYS } from '../storage/localStorage.service';

// =============================================================================
// CONFIGURATION
// =============================================================================

const ANALYTICS_CONFIG = {
  endpoint: '/analytics',
  batchSize: 10,
  flushInterval: 30000,  // 30 seconds
  sessionTimeout: 30 * 60 * 1000  // 30 minutes
};

// =============================================================================
// EVENT CONSTANTS
// =============================================================================

export const ANALYTICS_EVENTS = {
  // Page Events
  PAGE_VIEW: 'page_view',
  PAGE_LEAVE: 'page_leave',
  
  // Session Events
  SESSION_START: 'session_start',
  SESSION_END: 'session_end',
  
  // Navigation Events
  NAVIGATION: 'navigation',
  EXTERNAL_LINK: 'external_link',
  
  // Mission Events
  MISSION_VIEW: 'mission_view',
  MISSION_START: 'mission_start',
  MISSION_COMPLETE: 'mission_complete',
  MISSION_ABANDON: 'mission_abandon',
  
  // Bite Events
  BITE_START: 'bite_start',
  BITE_COMPLETE: 'bite_complete',
  BITE_SUBMIT: 'bite_submit',
  
  // Checkpoint Events
  CHECKPOINT_START: 'checkpoint_start',
  CHECKPOINT_SUBMIT: 'checkpoint_submit',
  CHECKPOINT_PASS: 'checkpoint_pass',
  CHECKPOINT_FAIL: 'checkpoint_fail',
  
  // Study Events
  STUDY_SESSION_START: 'study_session_start',
  STUDY_SESSION_END: 'study_session_end',
  
  // Engagement Events
  CLICK: 'click',
  SCROLL: 'scroll',
  FOCUS: 'focus',
  BLUR: 'blur',
  
  // Feature Events
  FEATURE_USE: 'feature_use',
  SEARCH: 'search',
  FILTER: 'filter',
  SORT: 'sort',
  
  // Social Events
  PRAISE_SEND: 'praise_send',
  PRAISE_RECEIVE: 'praise_receive',
  PARTY_JOIN: 'party_join',
  PARTY_MESSAGE: 'party_message',
  
  // Baraka Events
  BARAKA_EARN: 'baraka_earn',
  BARAKA_SPEND: 'baraka_spend',
  
  // Error Events
  ERROR: 'error',
  API_ERROR: 'api_error'
};

export const EVENT_CATEGORIES = {
  PAGE: 'page',
  SESSION: 'session',
  NAVIGATION: 'navigation',
  MISSION: 'mission',
  BITE: 'bite',
  CHECKPOINT: 'checkpoint',
  STUDY: 'study',
  ENGAGEMENT: 'engagement',
  FEATURE: 'feature',
  SOCIAL: 'social',
  BARAKA: 'baraka',
  ERROR: 'error'
};

// =============================================================================
// ANALYTICS SERVICE CLASS
// =============================================================================

class AnalyticsService {
  constructor() {
    this.eventQueue = [];
    this.sessionId = null;
    this.sessionStartTime = null;
    this.lastActivityTime = null;
    this.pageStartTime = null;
    this.currentPage = null;
    this.flushTimer = null;
    this.initialized = false;
    this.enabled = true;
  }
  
  // ===========================================================================
  // INITIALIZATION
  // ===========================================================================
  
  /**
   * Initializes analytics service
   */
  initialize() {
    if (this.initialized) return;
    
    // Start session
    this.startSession();
    
    // Set up flush interval
    this.flushTimer = setInterval(() => {
      this.flush();
    }, ANALYTICS_CONFIG.flushInterval);
    
    // Set up page visibility listener
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // Set up beforeunload listener
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    
    // Set up error listener
    window.addEventListener('error', this.handleError.bind(this));
    
    this.initialized = true;
  }
  
  /**
   * Starts a new session
   */
  startSession() {
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = new Date();
    this.lastActivityTime = new Date();
    
    this.track(ANALYTICS_EVENTS.SESSION_START, {
      sessionId: this.sessionId,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
  }
  
  /**
   * Ends current session
   */
  endSession() {
    if (!this.sessionId) return;
    
    const duration = new Date() - this.sessionStartTime;
    
    this.track(ANALYTICS_EVENTS.SESSION_END, {
      sessionId: this.sessionId,
      duration
    });
    
    this.flush();
    
    this.sessionId = null;
    this.sessionStartTime = null;
  }
  
  /**
   * Generates session ID
   * @returns {string} Session ID
   */
  generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // ===========================================================================
  // EVENT TRACKING
  // ===========================================================================
  
  /**
   * Tracks an event
   * @param {string} event - Event name
   * @param {Object} properties - Event properties
   */
  track(event, properties = {}) {
    if (!this.enabled) return;
    
    // Check for session timeout
    this.checkSession();
    
    const eventData = {
      event,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId,
        page: window.location.pathname,
        url: window.location.href
      },
      context: this.getContext()
    };
    
    this.eventQueue.push(eventData);
    this.lastActivityTime = new Date();
    
    // Flush if batch size reached
    if (this.eventQueue.length >= ANALYTICS_CONFIG.batchSize) {
      this.flush();
    }
  }
  
  /**
   * Tracks page view
   * @param {string} page - Page path
   * @param {Object} properties - Additional properties
   */
  trackPageView(page, properties = {}) {
    // Track page leave for previous page
    if (this.currentPage) {
      this.trackPageLeave();
    }
    
    this.currentPage = page;
    this.pageStartTime = new Date();
    
    this.track(ANALYTICS_EVENTS.PAGE_VIEW, {
      page,
      title: document.title,
      ...properties
    });
  }
  
  /**
   * Tracks page leave
   */
  trackPageLeave() {
    if (!this.currentPage || !this.pageStartTime) return;
    
    const timeOnPage = new Date() - this.pageStartTime;
    
    this.track(ANALYTICS_EVENTS.PAGE_LEAVE, {
      page: this.currentPage,
      timeOnPage
    });
  }
  
  /**
   * Tracks click event
   * @param {string} elementId - Element identifier
   * @param {Object} properties - Additional properties
   */
  trackClick(elementId, properties = {}) {
    this.track(ANALYTICS_EVENTS.CLICK, {
      elementId,
      ...properties
    });
  }
  
  /**
   * Tracks feature usage
   * @param {string} feature - Feature name
   * @param {Object} properties - Additional properties
   */
  trackFeature(feature, properties = {}) {
    this.track(ANALYTICS_EVENTS.FEATURE_USE, {
      feature,
      ...properties
    });
  }
  
  /**
   * Tracks search
   * @param {string} query - Search query
   * @param {Object} results - Search results info
   */
  trackSearch(query, results = {}) {
    this.track(ANALYTICS_EVENTS.SEARCH, {
      query,
      resultCount: results.count,
      ...results
    });
  }
  
  /**
   * Tracks error
   * @param {Error} error - Error object
   * @param {Object} context - Error context
   */
  trackError(error, context = {}) {
    this.track(ANALYTICS_EVENTS.ERROR, {
      message: error.message,
      stack: error.stack,
      ...context
    });
  }
  
  // ===========================================================================
  // MISSION/LEARNING ANALYTICS
  // ===========================================================================
  
  /**
   * Tracks mission event
   * @param {string} event - Event type
   * @param {Object} mission - Mission data
   */
  trackMission(event, mission) {
    this.track(event, {
      missionId: mission.id,
      stageNumber: mission.stageNumber,
      missionNumber: mission.missionNumber,
      adventureNumber: mission.adventureNumber
    });
  }
  
  /**
   * Tracks bite event
   * @param {string} event - Event type
   * @param {Object} bite - Bite data
   */
  trackBite(event, bite) {
    this.track(event, {
      biteId: bite.id,
      missionId: bite.missionId,
      biteNumber: bite.biteNumber
    });
  }
  
  /**
   * Tracks checkpoint event
   * @param {string} event - Event type
   * @param {Object} checkpoint - Checkpoint data
   */
  trackCheckpoint(event, checkpoint) {
    this.track(event, {
      checkpointId: checkpoint.id,
      missionId: checkpoint.missionId,
      score: checkpoint.score,
      passed: checkpoint.passed,
      attemptNumber: checkpoint.attemptNumber
    });
  }
  
  /**
   * Tracks study session
   * @param {string} event - Event type
   * @param {Object} session - Session data
   */
  trackStudySession(event, session) {
    this.track(event, {
      studySessionId: session.id,
      duration: session.duration,
      missionId: session.missionId,
      biteId: session.biteId
    });
  }
  
  // ===========================================================================
  // CONTEXT
  // ===========================================================================
  
  /**
   * Gets current context
   * @returns {Object} Context
   */
  getContext() {
    const user = getItem(STORAGE_KEYS.user);
    
    return {
      userId: user?.id,
      subscriptionTier: user?.subscription?.tier,
      currentStage: user?.progress?.currentStage,
      locale: getItem(STORAGE_KEYS.locale) || 'en',
      theme: getItem(STORAGE_KEYS.theme) || 'light',
      deviceType: this.getDeviceType(),
      browser: this.getBrowser()
    };
  }
  
  /**
   * Gets device type
   * @returns {string} Device type
   */
  getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }
  
  /**
   * Gets browser info
   * @returns {string} Browser name
   */
  getBrowser() {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Other';
  }
  
  // ===========================================================================
  // SESSION MANAGEMENT
  // ===========================================================================
  
  /**
   * Checks session validity
   */
  checkSession() {
    if (!this.sessionId) {
      this.startSession();
      return;
    }
    
    const now = new Date();
    const timeSinceLastActivity = now - this.lastActivityTime;
    
    if (timeSinceLastActivity > ANALYTICS_CONFIG.sessionTimeout) {
      // Session timed out, start new one
      this.endSession();
      this.startSession();
    }
  }
  
  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  
  /**
   * Handles visibility change
   */
  handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      this.track(ANALYTICS_EVENTS.BLUR);
      this.flush();
    } else {
      this.track(ANALYTICS_EVENTS.FOCUS);
      this.checkSession();
    }
  }
  
  /**
   * Handles before unload
   */
  handleBeforeUnload() {
    this.trackPageLeave();
    this.endSession();
  }
  
  /**
   * Handles global errors
   * @param {ErrorEvent} event - Error event
   */
  handleError(event) {
    this.trackError(event.error || new Error(event.message), {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  }
  
  // ===========================================================================
  // FLUSH
  // ===========================================================================
  
  /**
   * Flushes event queue to server
   */
  async flush() {
    if (this.eventQueue.length === 0) return;
    
    const events = [...this.eventQueue];
    this.eventQueue = [];
    
    try {
      await apiClient.post(`${ANALYTICS_CONFIG.endpoint}/events`, { events });
    } catch (error) {
      // Re-add events to queue on failure
      this.eventQueue = [...events, ...this.eventQueue];
      console.error('Failed to flush analytics:', error);
    }
  }
  
  // ===========================================================================
  // CONTROL
  // ===========================================================================
  
  /**
   * Enables analytics
   */
  enable() {
    this.enabled = true;
  }
  
  /**
   * Disables analytics
   */
  disable() {
    this.enabled = false;
    this.eventQueue = [];
  }
  
  /**
   * Checks if analytics is enabled
   * @returns {boolean} Enabled state
   */
  isEnabled() {
    return this.enabled;
  }
  
  /**
   * Cleans up analytics service
   */
  cleanup() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    window.removeEventListener('error', this.handleError);
    
    this.flush();
    this.initialized = false;
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

const analyticsService = new AnalyticsService();

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

export const initialize = () => analyticsService.initialize();
export const track = (event, properties) => analyticsService.track(event, properties);
export const trackPageView = (page, properties) => analyticsService.trackPageView(page, properties);
export const trackClick = (elementId, properties) => analyticsService.trackClick(elementId, properties);
export const trackFeature = (feature, properties) => analyticsService.trackFeature(feature, properties);
export const trackSearch = (query, results) => analyticsService.trackSearch(query, results);
export const trackError = (error, context) => analyticsService.trackError(error, context);
export const trackMission = (event, mission) => analyticsService.trackMission(event, mission);
export const trackBite = (event, bite) => analyticsService.trackBite(event, bite);
export const trackCheckpoint = (event, checkpoint) => analyticsService.trackCheckpoint(event, checkpoint);
export const trackStudySession = (event, session) => analyticsService.trackStudySession(event, session);
export const flush = () => analyticsService.flush();
export const enable = () => analyticsService.enable();
export const disable = () => analyticsService.disable();
export const isEnabled = () => analyticsService.isEnabled();
export const cleanup = () => analyticsService.cleanup();

// =============================================================================
// EXPORTS
// =============================================================================

export { analyticsService as default, ANALYTICS_EVENTS, EVENT_CATEGORIES };