/**
 * GPS Lab Platform - Object Helper Utilities
 * 
 * Comprehensive object manipulation utilities for the GPS Lab MMORPG educational platform.
 * Handles deep operations, merging, picking, and object transformations.
 * 
 * @module utils/helpers/object.helper
 * @version 1.0.0
 */

// =============================================================================
// TYPE CHECKING
// =============================================================================

/**
 * Checks if value is a plain object
 * @param {*} value - Value to check
 * @returns {boolean} True if plain object
 */
export const isObject = (value) => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

/**
 * Checks if value is a plain object (strict)
 * @param {*} value - Value to check
 * @returns {boolean} True if plain object with Object prototype
 */
export const isPlainObject = (value) => {
  if (!isObject(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
};

/**
 * Checks if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} True if empty
 */
export const isEmpty = (obj) => {
  if (!isObject(obj)) return true;
  return Object.keys(obj).length === 0;
};

/**
 * Checks if object is not empty
 * @param {Object} obj - Object to check
 * @returns {boolean} True if not empty
 */
export const isNotEmpty = (obj) => {
  return isObject(obj) && Object.keys(obj).length > 0;
};

/**
 * Checks if object has a property
 * @param {Object} obj - Object to check
 * @param {string} key - Property key
 * @returns {boolean} True if has own property
 */
export const hasKey = (obj, key) => {
  return isObject(obj) && Object.prototype.hasOwnProperty.call(obj, key);
};

/**
 * Checks if object has all specified keys
 * @param {Object} obj - Object to check
 * @param {string[]} keys - Keys to check
 * @returns {boolean} True if has all keys
 */
export const hasKeys = (obj, keys) => {
  if (!isObject(obj) || !Array.isArray(keys)) return false;
  return keys.every(key => hasKey(obj, key));
};

// =============================================================================
// DEEP OPERATIONS
// =============================================================================

/**
 * Deep clones an object
 * @param {*} value - Value to clone
 * @returns {*} Deep cloned value
 */
export const deepClone = (value) => {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  
  if (value instanceof Date) {
    return new Date(value.getTime());
  }
  
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }
  
  if (Array.isArray(value)) {
    return value.map(item => deepClone(item));
  }
  
  if (value instanceof Map) {
    const clone = new Map();
    value.forEach((v, k) => clone.set(deepClone(k), deepClone(v)));
    return clone;
  }
  
  if (value instanceof Set) {
    const clone = new Set();
    value.forEach(v => clone.add(deepClone(v)));
    return clone;
  }
  
  const clone = {};
  Object.keys(value).forEach(key => {
    clone[key] = deepClone(value[key]);
  });
  return clone;
};

/**
 * Deep merges objects (immutable)
 * @param {Object} target - Target object
 * @param {...Object} sources - Source objects
 * @returns {Object} Merged object
 */
export const deepMerge = (target, ...sources) => {
  if (!sources.length) return target;
  
  const result = deepClone(target);
  
  for (const source of sources) {
    if (!isObject(source)) continue;
    
    Object.keys(source).forEach(key => {
      const targetValue = result[key];
      const sourceValue = source[key];
      
      if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
        result[key] = deepMerge(targetValue, sourceValue);
      } else if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
        result[key] = [...targetValue, ...sourceValue];
      } else {
        result[key] = deepClone(sourceValue);
      }
    });
  }
  
  return result;
};

/**
 * Shallow merges objects
 * @param {Object} target - Target object
 * @param {...Object} sources - Source objects
 * @returns {Object} Merged object
 */
export const merge = (target, ...sources) => {
  return Object.assign({}, target, ...sources);
};

/**
 * Deep compares two values for equality
 * @param {*} a - First value
 * @param {*} b - Second value
 * @returns {boolean} True if deeply equal
 */
export const deepEqual = (a, b) => {
  if (a === b) return true;
  
  if (typeof a !== typeof b) return false;
  
  if (a === null || b === null) return a === b;
  
  if (typeof a !== 'object') return a === b;
  
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  return keysA.every(key => deepEqual(a[key], b[key]));
};

/**
 * Deep freezes an object
 * @param {Object} obj - Object to freeze
 * @returns {Object} Frozen object
 */
export const deepFreeze = (obj) => {
  if (!isObject(obj)) return obj;
  
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (isObject(value) || Array.isArray(value)) {
      deepFreeze(value);
    }
  });
  
  return Object.freeze(obj);
};

// =============================================================================
// NESTED ACCESS
// =============================================================================

/**
 * Gets nested value by path
 * @param {Object} obj - Source object
 * @param {string|string[]} path - Property path
 * @param {*} defaultValue - Default if not found
 * @returns {*} Value at path or default
 */
export const get = (obj, path, defaultValue = undefined) => {
  if (!obj) return defaultValue;
  
  const keys = Array.isArray(path) ? path : path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result === undefined ? defaultValue : result;
};

/**
 * Sets nested value by path (immutable)
 * @param {Object} obj - Source object
 * @param {string|string[]} path - Property path
 * @param {*} value - Value to set
 * @returns {Object} New object with value set
 */
export const set = (obj, path, value) => {
  const keys = Array.isArray(path) ? path : path.split('.');
  
  if (keys.length === 0) return obj;
  
  const result = deepClone(obj || {});
  let current = result;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!isObject(current[key]) && !Array.isArray(current[key])) {
      current[key] = {};
    } else {
      current[key] = deepClone(current[key]);
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
  return result;
};

/**
 * Checks if nested path exists
 * @param {Object} obj - Source object
 * @param {string|string[]} path - Property path
 * @returns {boolean} True if path exists
 */
export const has = (obj, path) => {
  if (!obj) return false;
  
  const keys = Array.isArray(path) ? path : path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (!isObject(current) && !Array.isArray(current)) {
      return false;
    }
    if (!(key in current)) {
      return false;
    }
    current = current[key];
  }
  
  return true;
};

/**
 * Deletes nested value by path (immutable)
 * @param {Object} obj - Source object
 * @param {string|string[]} path - Property path
 * @returns {Object} New object with value deleted
 */
export const unset = (obj, path) => {
  const keys = Array.isArray(path) ? path : path.split('.');
  
  if (keys.length === 0 || !has(obj, path)) return obj;
  
  const result = deepClone(obj);
  let current = result;
  
  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]];
  }
  
  delete current[keys[keys.length - 1]];
  return result;
};

// =============================================================================
// PICKING AND OMITTING
// =============================================================================

/**
 * Picks specified keys from object
 * @param {Object} obj - Source object
 * @param {string[]} keys - Keys to pick
 * @returns {Object} Object with picked keys
 */
export const pick = (obj, keys) => {
  if (!isObject(obj) || !Array.isArray(keys)) return {};
  
  return keys.reduce((result, key) => {
    if (hasKey(obj, key)) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

/**
 * Picks keys by predicate
 * @param {Object} obj - Source object
 * @param {Function} predicate - Filter function (value, key) => boolean
 * @returns {Object} Filtered object
 */
export const pickBy = (obj, predicate) => {
  if (!isObject(obj)) return {};
  
  return Object.entries(obj).reduce((result, [key, value]) => {
    if (predicate(value, key)) {
      result[key] = value;
    }
    return result;
  }, {});
};

/**
 * Omits specified keys from object
 * @param {Object} obj - Source object
 * @param {string[]} keys - Keys to omit
 * @returns {Object} Object without omitted keys
 */
export const omit = (obj, keys) => {
  if (!isObject(obj)) return {};
  if (!Array.isArray(keys)) return { ...obj };
  
  const keysSet = new Set(keys);
  return Object.entries(obj).reduce((result, [key, value]) => {
    if (!keysSet.has(key)) {
      result[key] = value;
    }
    return result;
  }, {});
};

/**
 * Omits keys by predicate
 * @param {Object} obj - Source object
 * @param {Function} predicate - Filter function (value, key) => boolean
 * @returns {Object} Filtered object
 */
export const omitBy = (obj, predicate) => {
  return pickBy(obj, (value, key) => !predicate(value, key));
};

/**
 * Omits null and undefined values
 * @param {Object} obj - Source object
 * @returns {Object} Object without null/undefined
 */
export const omitNulls = (obj) => {
  return omitBy(obj, value => value === null || value === undefined);
};

/**
 * Omits falsy values
 * @param {Object} obj - Source object
 * @returns {Object} Object without falsy values
 */
export const omitFalsy = (obj) => {
  return pickBy(obj, Boolean);
};

// =============================================================================
// TRANSFORMATION
// =============================================================================

/**
 * Maps object values
 * @param {Object} obj - Source object
 * @param {Function} fn - Map function (value, key) => newValue
 * @returns {Object} Mapped object
 */
export const mapValues = (obj, fn) => {
  if (!isObject(obj)) return {};
  
  return Object.entries(obj).reduce((result, [key, value]) => {
    result[key] = fn(value, key);
    return result;
  }, {});
};

/**
 * Maps object keys
 * @param {Object} obj - Source object
 * @param {Function} fn - Map function (key, value) => newKey
 * @returns {Object} Object with mapped keys
 */
export const mapKeys = (obj, fn) => {
  if (!isObject(obj)) return {};
  
  return Object.entries(obj).reduce((result, [key, value]) => {
    result[fn(key, value)] = value;
    return result;
  }, {});
};

/**
 * Inverts object keys and values
 * @param {Object} obj - Source object
 * @returns {Object} Inverted object
 */
export const invert = (obj) => {
  if (!isObject(obj)) return {};
  
  return Object.entries(obj).reduce((result, [key, value]) => {
    result[String(value)] = key;
    return result;
  }, {});
};

/**
 * Renames object keys
 * @param {Object} obj - Source object
 * @param {Object} keyMap - Old key to new key mapping
 * @returns {Object} Object with renamed keys
 */
export const renameKeys = (obj, keyMap) => {
  if (!isObject(obj)) return {};
  
  return Object.entries(obj).reduce((result, [key, value]) => {
    const newKey = keyMap[key] || key;
    result[newKey] = value;
    return result;
  }, {});
};

/**
 * Converts object to array of entries
 * @param {Object} obj - Source object
 * @param {Function} fn - Transform function (key, value) => item
 * @returns {Array} Array of transformed entries
 */
export const toArray = (obj, fn = (key, value) => ({ key, value })) => {
  if (!isObject(obj)) return [];
  return Object.entries(obj).map(([key, value]) => fn(key, value));
};

/**
 * Creates object from entries array
 * @param {Array} entries - Array of [key, value] pairs
 * @returns {Object} Object from entries
 */
export const fromEntries = (entries) => {
  if (!Array.isArray(entries)) return {};
  return Object.fromEntries(entries);
};

// =============================================================================
// DEFAULTS AND VALIDATION
// =============================================================================

/**
 * Sets default values for missing keys
 * @param {Object} obj - Source object
 * @param {Object} defaults - Default values
 * @returns {Object} Object with defaults applied
 */
export const defaults = (obj, defaultValues) => {
  if (!isObject(defaultValues)) return obj || {};
  
  const result = { ...obj };
  
  Object.keys(defaultValues).forEach(key => {
    if (result[key] === undefined) {
      result[key] = defaultValues[key];
    }
  });
  
  return result;
};

/**
 * Deep sets default values
 * @param {Object} obj - Source object
 * @param {Object} defaultValues - Default values
 * @returns {Object} Object with deep defaults applied
 */
export const defaultsDeep = (obj, defaultValues) => {
  if (!isObject(obj) && !isObject(defaultValues)) return {};
  if (!isObject(defaultValues)) return deepClone(obj);
  if (!isObject(obj)) return deepClone(defaultValues);
  
  const result = deepClone(obj);
  
  Object.keys(defaultValues).forEach(key => {
    if (result[key] === undefined) {
      result[key] = deepClone(defaultValues[key]);
    } else if (isPlainObject(result[key]) && isPlainObject(defaultValues[key])) {
      result[key] = defaultsDeep(result[key], defaultValues[key]);
    }
  });
  
  return result;
};

// =============================================================================
// GPS LAB SPECIFIC HELPERS
// =============================================================================

/**
 * Creates a user profile object with defaults
 * @param {Object} data - User data
 * @returns {Object} User profile with defaults
 */
export const createUserProfile = (data = {}) => {
  return defaultsDeep(data, {
    id: null,
    email: '',
    displayName: 'Anonymous GPS',
    firstName: '',
    lastName: '',
    avatar: null,
    barakaBalance: 0,
    xpTotal: 0,
    currentStage: 1,
    currentMission: 1,
    subscriptionTier: 'FREE',
    locale: 'en-US',
    preferences: {
      theme: 'light',
      notifications: true,
      praiseStyle: 'motivational'
    },
    stats: {
      missionsCompleted: 0,
      checkpointsCompleted: 0,
      streakDays: 0,
      totalStudyTime: 0
    },
    createdAt: null,
    updatedAt: null
  });
};

/**
 * Creates a mission progress object
 * @param {Object} data - Progress data
 * @returns {Object} Mission progress with defaults
 */
export const createMissionProgress = (data = {}) => {
  return defaultsDeep(data, {
    missionId: null,
    userId: null,
    stageNumber: 1,
    missionNumber: 1,
    status: 'not_started',
    checkpointsCompleted: 0,
    checkpointsTotal: 5,
    xpEarned: 0,
    barakaEarned: 0,
    startedAt: null,
    completedAt: null,
    lastActivityAt: null,
    retryCount: 0,
    hasPR2R: false
  });
};

/**
 * Extracts display-safe user data
 * @param {Object} user - Full user object
 * @returns {Object} Safe user data for display
 */
export const toPublicUser = (user) => {
  return pick(user, [
    'id',
    'displayName',
    'firstName',
    'avatar',
    'barakaBalance',
    'xpTotal',
    'currentStage',
    'subscriptionTier',
    'stats'
  ]);
};

/**
 * Extracts form-editable user data
 * @param {Object} user - Full user object
 * @returns {Object} Editable user data
 */
export const toEditableUser = (user) => {
  return pick(user, [
    'firstName',
    'lastName',
    'displayName',
    'email',
    'avatar',
    'locale',
    'preferences'
  ]);
};

/**
 * Flattens nested preferences for form binding
 * @param {Object} preferences - Nested preferences object
 * @param {string} prefix - Key prefix
 * @returns {Object} Flattened preferences
 */
export const flattenPreferences = (preferences, prefix = '') => {
  if (!isObject(preferences)) return {};
  
  return Object.entries(preferences).reduce((result, [key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (isPlainObject(value)) {
      Object.assign(result, flattenPreferences(value, fullKey));
    } else {
      result[fullKey] = value;
    }
    
    return result;
  }, {});
};

/**
 * Unflattens dotted keys back to nested object
 * @param {Object} obj - Flattened object
 * @returns {Object} Nested object
 */
export const unflattenPreferences = (obj) => {
  if (!isObject(obj)) return {};
  
  const result = {};
  
  Object.entries(obj).forEach(([key, value]) => {
    const keys = key.split('.');
    let current = result;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
  });
  
  return result;
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Type checking
  isObject,
  isPlainObject,
  isEmpty,
  isNotEmpty,
  hasKey,
  hasKeys,
  
  // Deep operations
  deepClone,
  deepMerge,
  merge,
  deepEqual,
  deepFreeze,
  
  // Nested access
  get,
  set,
  has,
  unset,
  
  // Picking and omitting
  pick,
  pickBy,
  omit,
  omitBy,
  omitNulls,
  omitFalsy,
  
  // Transformation
  mapValues,
  mapKeys,
  invert,
  renameKeys,
  toArray,
  fromEntries,
  
  // Defaults
  defaults,
  defaultsDeep,
  
  // GPS Lab specific
  createUserProfile,
  createMissionProgress,
  toPublicUser,
  toEditableUser,
  flattenPreferences,
  unflattenPreferences
};