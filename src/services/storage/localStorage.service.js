/**
 * GPS Lab Platform - LocalStorage Service
 * 
 * Wrapper for localStorage with JSON serialization, expiration support,
 * and cross-tab synchronization.
 * 
 * @module services/storage/localStorage.service
 * @version 1.0.0
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Storage configuration
 */
const STORAGE_CONFIG = {
  prefix: 'gps_',
  version: '1.0.0',
  expiryKey: '_expiry',
  versionKey: 'storage_version'
};

/**
 * Storage keys for GPS Lab
 */
export const STORAGE_KEYS = {
  // Auth
  accessToken: 'access_token',
  refreshToken: 'refresh_token',
  tokenExpiry: 'token_expiry',
  user: 'user',
  
  // Preferences
  theme: 'theme',
  locale: 'locale',
  soundEnabled: 'sound_enabled',
  notificationsEnabled: 'notifications_enabled',
  
  // Game state
  currentMission: 'current_mission',
  currentStage: 'current_stage',
  missionProgress: 'mission_progress',
  studyProgress: 'study_progress',
  
  // Cache
  userProfile: 'user_profile',
  missions: 'missions',
  stages: 'stages',
  badges: 'badges',
  
  // UI state
  sidebarCollapsed: 'sidebar_collapsed',
  lastVisitedPage: 'last_visited_page',
  tourCompleted: 'tour_completed',
  
  // Temporary
  draftBite: 'draft_bite',
  draftProject: 'draft_project',
  unsavedChanges: 'unsaved_changes'
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Gets prefixed key
 * @param {string} key - Storage key
 * @returns {string} Prefixed key
 */
const getPrefixedKey = (key) => {
  return `${STORAGE_CONFIG.prefix}${key}`;
};

/**
 * Gets expiry key
 * @param {string} key - Storage key
 * @returns {string} Expiry key
 */
const getExpiryKey = (key) => {
  return `${getPrefixedKey(key)}${STORAGE_CONFIG.expiryKey}`;
};

/**
 * Checks if localStorage is available
 * @returns {boolean} True if available
 */
const isStorageAvailable = () => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Serializes value to JSON
 * @param {*} value - Value to serialize
 * @returns {string} JSON string
 */
const serialize = (value) => {
  try {
    return JSON.stringify(value);
  } catch (e) {
    console.error('Failed to serialize value:', e);
    return String(value);
  }
};

/**
 * Deserializes JSON string
 * @param {string} value - JSON string
 * @returns {*} Parsed value
 */
const deserialize = (value) => {
  if (value === null || value === undefined) {
    return null;
  }
  
  try {
    return JSON.parse(value);
  } catch (e) {
    // Return as-is if not valid JSON
    return value;
  }
};

// =============================================================================
// CORE FUNCTIONS
// =============================================================================

/**
 * Gets item from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Stored value or default
 */
export const getItem = (key, defaultValue = null) => {
  if (!isStorageAvailable()) {
    return defaultValue;
  }
  
  const prefixedKey = getPrefixedKey(key);
  
  try {
    // Check expiry
    const expiryKey = getExpiryKey(key);
    const expiry = localStorage.getItem(expiryKey);
    
    if (expiry && new Date(expiry) < new Date()) {
      // Item has expired, remove it
      localStorage.removeItem(prefixedKey);
      localStorage.removeItem(expiryKey);
      return defaultValue;
    }
    
    const value = localStorage.getItem(prefixedKey);
    
    if (value === null) {
      return defaultValue;
    }
    
    return deserialize(value);
  } catch (e) {
    console.error(`Failed to get item '${key}':`, e);
    return defaultValue;
  }
};

/**
 * Sets item in localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @param {Object} options - Options
 * @returns {boolean} Success status
 */
export const setItem = (key, value, options = {}) => {
  if (!isStorageAvailable()) {
    return false;
  }
  
  const { expiresIn, expiresAt } = options;
  const prefixedKey = getPrefixedKey(key);
  
  try {
    const serialized = serialize(value);
    localStorage.setItem(prefixedKey, serialized);
    
    // Set expiry if provided
    if (expiresIn || expiresAt) {
      const expiryKey = getExpiryKey(key);
      const expiryDate = expiresAt || new Date(Date.now() + expiresIn);
      localStorage.setItem(expiryKey, expiryDate.toISOString());
    }
    
    // Dispatch storage event for cross-tab sync
    window.dispatchEvent(new StorageEvent('storage', {
      key: prefixedKey,
      newValue: serialized,
      storageArea: localStorage
    }));
    
    return true;
  } catch (e) {
    console.error(`Failed to set item '${key}':`, e);
    
    // Handle quota exceeded
    if (e.name === 'QuotaExceededError') {
      handleQuotaExceeded();
    }
    
    return false;
  }
};

/**
 * Removes item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export const removeItem = (key) => {
  if (!isStorageAvailable()) {
    return false;
  }
  
  const prefixedKey = getPrefixedKey(key);
  const expiryKey = getExpiryKey(key);
  
  try {
    localStorage.removeItem(prefixedKey);
    localStorage.removeItem(expiryKey);
    
    // Dispatch storage event
    window.dispatchEvent(new StorageEvent('storage', {
      key: prefixedKey,
      newValue: null,
      storageArea: localStorage
    }));
    
    return true;
  } catch (e) {
    console.error(`Failed to remove item '${key}':`, e);
    return false;
  }
};

/**
 * Checks if key exists in localStorage
 * @param {string} key - Storage key
 * @returns {boolean} True if exists
 */
export const hasItem = (key) => {
  if (!isStorageAvailable()) {
    return false;
  }
  
  const prefixedKey = getPrefixedKey(key);
  
  try {
    // Check expiry
    const expiryKey = getExpiryKey(key);
    const expiry = localStorage.getItem(expiryKey);
    
    if (expiry && new Date(expiry) < new Date()) {
      return false;
    }
    
    return localStorage.getItem(prefixedKey) !== null;
  } catch (e) {
    return false;
  }
};

/**
 * Clears all GPS Lab items from localStorage
 * @returns {boolean} Success status
 */
export const clear = () => {
  if (!isStorageAvailable()) {
    return false;
  }
  
  try {
    const keysToRemove = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_CONFIG.prefix)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    return true;
  } catch (e) {
    console.error('Failed to clear storage:', e);
    return false;
  }
};

/**
 * Gets all GPS Lab items from localStorage
 * @returns {Object} All stored items
 */
export const getAll = () => {
  if (!isStorageAvailable()) {
    return {};
  }
  
  const items = {};
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key && key.startsWith(STORAGE_CONFIG.prefix) && 
          !key.endsWith(STORAGE_CONFIG.expiryKey)) {
        const cleanKey = key.replace(STORAGE_CONFIG.prefix, '');
        items[cleanKey] = getItem(cleanKey);
      }
    }
  } catch (e) {
    console.error('Failed to get all items:', e);
  }
  
  return items;
};

/**
 * Gets storage size in bytes
 * @returns {number} Size in bytes
 */
export const getSize = () => {
  if (!isStorageAvailable()) {
    return 0;
  }
  
  let size = 0;
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_CONFIG.prefix)) {
        const value = localStorage.getItem(key);
        size += key.length + (value?.length || 0);
      }
    }
  } catch (e) {
    console.error('Failed to calculate storage size:', e);
  }
  
  return size * 2; // UTF-16
};

// =============================================================================
// SPECIALIZED FUNCTIONS
// =============================================================================

/**
 * Gets user data
 * @returns {Object|null} User data
 */
export const getUser = () => {
  return getItem(STORAGE_KEYS.user);
};

/**
 * Sets user data
 * @param {Object} user - User data
 */
export const setUser = (user) => {
  setItem(STORAGE_KEYS.user, user);
};

/**
 * Gets theme preference
 * @returns {string} Theme name
 */
export const getTheme = () => {
  return getItem(STORAGE_KEYS.theme, 'light');
};

/**
 * Sets theme preference
 * @param {string} theme - Theme name
 */
export const setTheme = (theme) => {
  setItem(STORAGE_KEYS.theme, theme);
};

/**
 * Gets locale preference
 * @returns {string} Locale code
 */
export const getLocale = () => {
  return getItem(STORAGE_KEYS.locale, 'en');
};

/**
 * Sets locale preference
 * @param {string} locale - Locale code
 */
export const setLocale = (locale) => {
  setItem(STORAGE_KEYS.locale, locale);
};

/**
 * Gets current mission
 * @returns {Object|null} Current mission
 */
export const getCurrentMission = () => {
  return getItem(STORAGE_KEYS.currentMission);
};

/**
 * Sets current mission
 * @param {Object} mission - Mission data
 */
export const setCurrentMission = (mission) => {
  setItem(STORAGE_KEYS.currentMission, mission);
};

/**
 * Gets draft bite
 * @param {string} biteId - Bite ID
 * @returns {Object|null} Draft data
 */
export const getDraftBite = (biteId) => {
  const drafts = getItem(STORAGE_KEYS.draftBite, {});
  return drafts[biteId] || null;
};

/**
 * Sets draft bite
 * @param {string} biteId - Bite ID
 * @param {Object} data - Draft data
 */
export const setDraftBite = (biteId, data) => {
  const drafts = getItem(STORAGE_KEYS.draftBite, {});
  drafts[biteId] = { ...data, savedAt: new Date().toISOString() };
  setItem(STORAGE_KEYS.draftBite, drafts);
};

/**
 * Clears draft bite
 * @param {string} biteId - Bite ID
 */
export const clearDraftBite = (biteId) => {
  const drafts = getItem(STORAGE_KEYS.draftBite, {});
  delete drafts[biteId];
  setItem(STORAGE_KEYS.draftBite, drafts);
};

// =============================================================================
// CACHE FUNCTIONS
// =============================================================================

/**
 * Gets cached data with TTL check
 * @param {string} key - Cache key
 * @param {number} maxAge - Max age in ms
 * @returns {Object|null} Cached data
 */
export const getCache = (key, maxAge = 5 * 60 * 1000) => {
  const cached = getItem(`cache_${key}`);
  
  if (!cached) {
    return null;
  }
  
  const { data, timestamp } = cached;
  
  if (Date.now() - timestamp > maxAge) {
    removeItem(`cache_${key}`);
    return null;
  }
  
  return data;
};

/**
 * Sets cached data
 * @param {string} key - Cache key
 * @param {*} data - Data to cache
 */
export const setCache = (key, data) => {
  setItem(`cache_${key}`, {
    data,
    timestamp: Date.now()
  });
};

/**
 * Clears all cached data
 */
export const clearCache = () => {
  const all = getAll();
  
  Object.keys(all).forEach(key => {
    if (key.startsWith('cache_')) {
      removeItem(key);
    }
  });
};

// =============================================================================
// QUOTA MANAGEMENT
// =============================================================================

/**
 * Handles quota exceeded error
 */
const handleQuotaExceeded = () => {
  console.warn('Storage quota exceeded, clearing cache...');
  
  // Clear cache first
  clearCache();
  
  // Remove expired items
  cleanupExpired();
  
  // Dispatch event
  window.dispatchEvent(new CustomEvent('storage:quota_exceeded'));
};

/**
 * Cleans up expired items
 */
export const cleanupExpired = () => {
  if (!isStorageAvailable()) {
    return;
  }
  
  const keysToRemove = [];
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key && key.endsWith(STORAGE_CONFIG.expiryKey)) {
        const expiry = localStorage.getItem(key);
        
        if (expiry && new Date(expiry) < new Date()) {
          keysToRemove.push(key);
          keysToRemove.push(key.replace(STORAGE_CONFIG.expiryKey, ''));
        }
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (e) {
    console.error('Failed to cleanup expired items:', e);
  }
};

// =============================================================================
// CROSS-TAB SYNCHRONIZATION
// =============================================================================

/**
 * Subscribes to storage changes
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export const subscribe = (callback) => {
  const handler = (event) => {
    if (event.key && event.key.startsWith(STORAGE_CONFIG.prefix)) {
      const cleanKey = event.key.replace(STORAGE_CONFIG.prefix, '');
      callback({
        key: cleanKey,
        oldValue: deserialize(event.oldValue),
        newValue: deserialize(event.newValue)
      });
    }
  };
  
  window.addEventListener('storage', handler);
  
  return () => {
    window.removeEventListener('storage', handler);
  };
};

/**
 * Subscribes to specific key changes
 * @param {string} key - Storage key
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export const subscribeToKey = (key, callback) => {
  return subscribe((event) => {
    if (event.key === key) {
      callback(event.newValue, event.oldValue);
    }
  });
};

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initializes storage service
 */
export const initialize = () => {
  if (!isStorageAvailable()) {
    console.warn('LocalStorage is not available');
    return;
  }
  
  // Check storage version
  const storedVersion = getItem(STORAGE_CONFIG.versionKey);
  
  if (storedVersion !== STORAGE_CONFIG.version) {
    // Version mismatch - could migrate or clear
    console.info('Storage version updated:', storedVersion, '->', STORAGE_CONFIG.version);
    setItem(STORAGE_CONFIG.versionKey, STORAGE_CONFIG.version);
  }
  
  // Cleanup expired items
  cleanupExpired();
};

// Auto-initialize
if (typeof window !== 'undefined') {
  initialize();
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  STORAGE_KEYS,
  
  // Core
  getItem,
  setItem,
  removeItem,
  hasItem,
  clear,
  getAll,
  getSize,
  
  // Specialized
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
  
  // Cache
  getCache,
  setCache,
  clearCache,
  
  // Cleanup
  cleanupExpired,
  
  // Sync
  subscribe,
  subscribeToKey,
  
  // Init
  initialize
};