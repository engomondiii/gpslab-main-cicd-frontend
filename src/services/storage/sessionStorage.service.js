/**
 * GPS Lab Platform - SessionStorage Service
 * 
 * Wrapper for sessionStorage with JSON serialization for session-based data.
 * Data persists only for the browser session.
 * 
 * @module services/storage/sessionStorage.service
 * @version 1.0.0
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Storage configuration
 */
const STORAGE_CONFIG = {
  prefix: 'gps_session_'
};

/**
 * Session storage keys for GPS Lab
 */
export const SESSION_KEYS = {
  // Navigation
  returnUrl: 'return_url',
  previousPage: 'previous_page',
  navigationStack: 'navigation_stack',
  
  // Temporary state
  formData: 'form_data',
  wizardStep: 'wizard_step',
  filterState: 'filter_state',
  sortState: 'sort_state',
  searchQuery: 'search_query',
  
  // UI state
  scrollPositions: 'scroll_positions',
  expandedSections: 'expanded_sections',
  selectedTab: 'selected_tab',
  modalState: 'modal_state',
  
  // Auth flow
  oauthState: 'oauth_state',
  pendingAction: 'pending_action',
  
  // Mission flow
  missionBriefingViewed: 'mission_briefing_viewed',
  checkpointAttempt: 'checkpoint_attempt',
  biteWorkspace: 'bite_workspace',
  
  // Temporary data
  clipboard: 'clipboard',
  undoStack: 'undo_stack',
  redoStack: 'redo_stack'
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
 * Checks if sessionStorage is available
 * @returns {boolean} True if available
 */
const isStorageAvailable = () => {
  try {
    const testKey = '__session_test__';
    sessionStorage.setItem(testKey, testKey);
    sessionStorage.removeItem(testKey);
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
    return value;
  }
};

// =============================================================================
// CORE FUNCTIONS
// =============================================================================

/**
 * Gets item from sessionStorage
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
    const value = sessionStorage.getItem(prefixedKey);
    
    if (value === null) {
      return defaultValue;
    }
    
    return deserialize(value);
  } catch (e) {
    console.error(`Failed to get session item '${key}':`, e);
    return defaultValue;
  }
};

/**
 * Sets item in sessionStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
export const setItem = (key, value) => {
  if (!isStorageAvailable()) {
    return false;
  }
  
  const prefixedKey = getPrefixedKey(key);
  
  try {
    const serialized = serialize(value);
    sessionStorage.setItem(prefixedKey, serialized);
    return true;
  } catch (e) {
    console.error(`Failed to set session item '${key}':`, e);
    return false;
  }
};

/**
 * Removes item from sessionStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export const removeItem = (key) => {
  if (!isStorageAvailable()) {
    return false;
  }
  
  const prefixedKey = getPrefixedKey(key);
  
  try {
    sessionStorage.removeItem(prefixedKey);
    return true;
  } catch (e) {
    console.error(`Failed to remove session item '${key}':`, e);
    return false;
  }
};

/**
 * Checks if key exists in sessionStorage
 * @param {string} key - Storage key
 * @returns {boolean} True if exists
 */
export const hasItem = (key) => {
  if (!isStorageAvailable()) {
    return false;
  }
  
  const prefixedKey = getPrefixedKey(key);
  
  try {
    return sessionStorage.getItem(prefixedKey) !== null;
  } catch (e) {
    return false;
  }
};

/**
 * Clears all GPS Lab session items
 * @returns {boolean} Success status
 */
export const clear = () => {
  if (!isStorageAvailable()) {
    return false;
  }
  
  try {
    const keysToRemove = [];
    
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(STORAGE_CONFIG.prefix)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => sessionStorage.removeItem(key));
    
    return true;
  } catch (e) {
    console.error('Failed to clear session storage:', e);
    return false;
  }
};

/**
 * Gets all GPS Lab session items
 * @returns {Object} All stored items
 */
export const getAll = () => {
  if (!isStorageAvailable()) {
    return {};
  }
  
  const items = {};
  
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      
      if (key && key.startsWith(STORAGE_CONFIG.prefix)) {
        const cleanKey = key.replace(STORAGE_CONFIG.prefix, '');
        items[cleanKey] = getItem(cleanKey);
      }
    }
  } catch (e) {
    console.error('Failed to get all session items:', e);
  }
  
  return items;
};

// =============================================================================
// NAVIGATION FUNCTIONS
// =============================================================================

/**
 * Gets return URL
 * @returns {string|null} Return URL
 */
export const getReturnUrl = () => {
  return getItem(SESSION_KEYS.returnUrl);
};

/**
 * Sets return URL
 * @param {string} url - Return URL
 */
export const setReturnUrl = (url) => {
  setItem(SESSION_KEYS.returnUrl, url);
};

/**
 * Clears return URL
 */
export const clearReturnUrl = () => {
  removeItem(SESSION_KEYS.returnUrl);
};

/**
 * Pushes to navigation stack
 * @param {string} path - Path to push
 */
export const pushNavigation = (path) => {
  const stack = getItem(SESSION_KEYS.navigationStack, []);
  stack.push(path);
  
  // Limit stack size
  if (stack.length > 20) {
    stack.shift();
  }
  
  setItem(SESSION_KEYS.navigationStack, stack);
};

/**
 * Pops from navigation stack
 * @returns {string|null} Previous path
 */
export const popNavigation = () => {
  const stack = getItem(SESSION_KEYS.navigationStack, []);
  const path = stack.pop();
  setItem(SESSION_KEYS.navigationStack, stack);
  return path || null;
};

// =============================================================================
// FORM FUNCTIONS
// =============================================================================

/**
 * Saves form data
 * @param {string} formId - Form identifier
 * @param {Object} data - Form data
 */
export const saveFormData = (formId, data) => {
  const forms = getItem(SESSION_KEYS.formData, {});
  forms[formId] = {
    data,
    savedAt: new Date().toISOString()
  };
  setItem(SESSION_KEYS.formData, forms);
};

/**
 * Gets form data
 * @param {string} formId - Form identifier
 * @returns {Object|null} Form data
 */
export const getFormData = (formId) => {
  const forms = getItem(SESSION_KEYS.formData, {});
  return forms[formId]?.data || null;
};

/**
 * Clears form data
 * @param {string} formId - Form identifier
 */
export const clearFormData = (formId) => {
  const forms = getItem(SESSION_KEYS.formData, {});
  delete forms[formId];
  setItem(SESSION_KEYS.formData, forms);
};

/**
 * Gets wizard step
 * @param {string} wizardId - Wizard identifier
 * @returns {number} Current step
 */
export const getWizardStep = (wizardId) => {
  const steps = getItem(SESSION_KEYS.wizardStep, {});
  return steps[wizardId] || 0;
};

/**
 * Sets wizard step
 * @param {string} wizardId - Wizard identifier
 * @param {number} step - Step number
 */
export const setWizardStep = (wizardId, step) => {
  const steps = getItem(SESSION_KEYS.wizardStep, {});
  steps[wizardId] = step;
  setItem(SESSION_KEYS.wizardStep, steps);
};

// =============================================================================
// UI STATE FUNCTIONS
// =============================================================================

/**
 * Saves scroll position
 * @param {string} pageId - Page identifier
 * @param {number} position - Scroll position
 */
export const saveScrollPosition = (pageId, position) => {
  const positions = getItem(SESSION_KEYS.scrollPositions, {});
  positions[pageId] = position;
  setItem(SESSION_KEYS.scrollPositions, positions);
};

/**
 * Gets scroll position
 * @param {string} pageId - Page identifier
 * @returns {number} Scroll position
 */
export const getScrollPosition = (pageId) => {
  const positions = getItem(SESSION_KEYS.scrollPositions, {});
  return positions[pageId] || 0;
};

/**
 * Saves filter state
 * @param {string} listId - List identifier
 * @param {Object} filters - Filter values
 */
export const saveFilterState = (listId, filters) => {
  const filterStates = getItem(SESSION_KEYS.filterState, {});
  filterStates[listId] = filters;
  setItem(SESSION_KEYS.filterState, filterStates);
};

/**
 * Gets filter state
 * @param {string} listId - List identifier
 * @returns {Object|null} Filter values
 */
export const getFilterState = (listId) => {
  const filterStates = getItem(SESSION_KEYS.filterState, {});
  return filterStates[listId] || null;
};

/**
 * Saves sort state
 * @param {string} listId - List identifier
 * @param {Object} sort - Sort configuration
 */
export const saveSortState = (listId, sort) => {
  const sortStates = getItem(SESSION_KEYS.sortState, {});
  sortStates[listId] = sort;
  setItem(SESSION_KEYS.sortState, sortStates);
};

/**
 * Gets sort state
 * @param {string} listId - List identifier
 * @returns {Object|null} Sort configuration
 */
export const getSortState = (listId) => {
  const sortStates = getItem(SESSION_KEYS.sortState, {});
  return sortStates[listId] || null;
};

/**
 * Saves selected tab
 * @param {string} tabGroupId - Tab group identifier
 * @param {string} tabId - Selected tab ID
 */
export const saveSelectedTab = (tabGroupId, tabId) => {
  const tabs = getItem(SESSION_KEYS.selectedTab, {});
  tabs[tabGroupId] = tabId;
  setItem(SESSION_KEYS.selectedTab, tabs);
};

/**
 * Gets selected tab
 * @param {string} tabGroupId - Tab group identifier
 * @returns {string|null} Selected tab ID
 */
export const getSelectedTab = (tabGroupId) => {
  const tabs = getItem(SESSION_KEYS.selectedTab, {});
  return tabs[tabGroupId] || null;
};

// =============================================================================
// MISSION FLOW FUNCTIONS
// =============================================================================

/**
 * Marks mission briefing as viewed
 * @param {string} missionId - Mission ID
 */
export const markBriefingViewed = (missionId) => {
  const viewed = getItem(SESSION_KEYS.missionBriefingViewed, []);
  if (!viewed.includes(missionId)) {
    viewed.push(missionId);
    setItem(SESSION_KEYS.missionBriefingViewed, viewed);
  }
};

/**
 * Checks if briefing was viewed
 * @param {string} missionId - Mission ID
 * @returns {boolean} True if viewed
 */
export const isBriefingViewed = (missionId) => {
  const viewed = getItem(SESSION_KEYS.missionBriefingViewed, []);
  return viewed.includes(missionId);
};

/**
 * Saves checkpoint attempt
 * @param {string} checkpointId - Checkpoint ID
 * @param {Object} attemptData - Attempt data
 */
export const saveCheckpointAttempt = (checkpointId, attemptData) => {
  const attempts = getItem(SESSION_KEYS.checkpointAttempt, {});
  attempts[checkpointId] = {
    ...attemptData,
    savedAt: new Date().toISOString()
  };
  setItem(SESSION_KEYS.checkpointAttempt, attempts);
};

/**
 * Gets checkpoint attempt
 * @param {string} checkpointId - Checkpoint ID
 * @returns {Object|null} Attempt data
 */
export const getCheckpointAttempt = (checkpointId) => {
  const attempts = getItem(SESSION_KEYS.checkpointAttempt, {});
  return attempts[checkpointId] || null;
};

/**
 * Clears checkpoint attempt
 * @param {string} checkpointId - Checkpoint ID
 */
export const clearCheckpointAttempt = (checkpointId) => {
  const attempts = getItem(SESSION_KEYS.checkpointAttempt, {});
  delete attempts[checkpointId];
  setItem(SESSION_KEYS.checkpointAttempt, attempts);
};

/**
 * Saves bite workspace state
 * @param {string} biteId - Bite ID
 * @param {Object} workspaceData - Workspace data
 */
export const saveBiteWorkspace = (biteId, workspaceData) => {
  const workspaces = getItem(SESSION_KEYS.biteWorkspace, {});
  workspaces[biteId] = workspaceData;
  setItem(SESSION_KEYS.biteWorkspace, workspaces);
};

/**
 * Gets bite workspace state
 * @param {string} biteId - Bite ID
 * @returns {Object|null} Workspace data
 */
export const getBiteWorkspace = (biteId) => {
  const workspaces = getItem(SESSION_KEYS.biteWorkspace, {});
  return workspaces[biteId] || null;
};

/**
 * Clears bite workspace state
 * @param {string} biteId - Bite ID
 */
export const clearBiteWorkspace = (biteId) => {
  const workspaces = getItem(SESSION_KEYS.biteWorkspace, {});
  delete workspaces[biteId];
  setItem(SESSION_KEYS.biteWorkspace, workspaces);
};

// =============================================================================
// AUTH FLOW FUNCTIONS
// =============================================================================

/**
 * Saves OAuth state
 * @param {string} state - OAuth state token
 * @param {Object} data - Additional data
 */
export const saveOAuthState = (state, data = {}) => {
  setItem(SESSION_KEYS.oauthState, {
    state,
    data,
    createdAt: new Date().toISOString()
  });
};

/**
 * Gets and validates OAuth state
 * @param {string} state - State to validate
 * @returns {Object|null} OAuth data if valid
 */
export const validateOAuthState = (state) => {
  const saved = getItem(SESSION_KEYS.oauthState);
  
  if (!saved || saved.state !== state) {
    return null;
  }
  
  // Clear after validation
  removeItem(SESSION_KEYS.oauthState);
  
  // Check expiry (5 minutes)
  const createdAt = new Date(saved.createdAt);
  if (Date.now() - createdAt.getTime() > 5 * 60 * 1000) {
    return null;
  }
  
  return saved.data;
};

/**
 * Clears OAuth state
 */
export const clearOAuthState = () => {
  removeItem(SESSION_KEYS.oauthState);
};

/**
 * Saves pending action for after auth
 * @param {Object} action - Pending action
 */
export const savePendingAction = (action) => {
  setItem(SESSION_KEYS.pendingAction, action);
};

/**
 * Gets and clears pending action
 * @returns {Object|null} Pending action
 */
export const getPendingAction = () => {
  const action = getItem(SESSION_KEYS.pendingAction);
  removeItem(SESSION_KEYS.pendingAction);
  return action;
};

/**
 * Clears pending action without returning it
 * @returns {boolean} Success status
 */
export const clearPendingAction = () => {
  return removeItem(SESSION_KEYS.pendingAction);
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  SESSION_KEYS,
  
  // Core
  getItem,
  setItem,
  removeItem,
  hasItem,
  clear,
  getAll,
  
  // Navigation
  getReturnUrl,
  setReturnUrl,
  clearReturnUrl,
  pushNavigation,
  popNavigation,
  
  // Form
  saveFormData,
  getFormData,
  clearFormData,
  getWizardStep,
  setWizardStep,
  
  // UI State
  saveScrollPosition,
  getScrollPosition,
  saveFilterState,
  getFilterState,
  saveSortState,
  getSortState,
  saveSelectedTab,
  getSelectedTab,
  
  // Mission Flow
  markBriefingViewed,
  isBriefingViewed,
  saveCheckpointAttempt,
  getCheckpointAttempt,
  clearCheckpointAttempt,
  saveBiteWorkspace,
  getBiteWorkspace,
  clearBiteWorkspace,
  
  // Auth Flow
  saveOAuthState,
  validateOAuthState,
  clearOAuthState,
  savePendingAction,
  getPendingAction,
  clearPendingAction
};