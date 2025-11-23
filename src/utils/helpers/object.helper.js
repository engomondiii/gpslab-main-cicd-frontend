/* ============================================
   GPS LAB - Object Helper
   Object manipulation utilities
   ============================================ */

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

/**
 * Shallow clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const shallowClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  return { ...obj };
};

/**
 * Merge objects deeply
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object} Merged object
 */
export const deepMerge = (target, source) => {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
};

/**
 * Check if value is object
 * @param {*} item - Value to check
 * @returns {boolean} True if object
 */
export const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} True if empty
 */
export const isEmpty = (obj) => {
  if (!obj) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

/**
 * Get nested property value
 * @param {Object} obj - Object to search
 * @param {string} path - Property path (e.g., 'user.address.city')
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Property value
 */
export const getNestedValue = (obj, path, defaultValue = null) => {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result !== undefined ? result : defaultValue;
};

/**
 * Set nested property value
 * @param {Object} obj - Object to modify
 * @param {string} path - Property path
 * @param {*} value - Value to set
 * @returns {Object} Modified object
 */
export const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  let current = obj;
  
  for (const key of keys) {
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[lastKey] = value;
  return obj;
};

/**
 * Pick specific properties from object
 * @param {Object} obj - Source object
 * @param {Array} keys - Keys to pick
 * @returns {Object} New object with picked properties
 */
export const pick = (obj, keys) => {
  if (!obj || !Array.isArray(keys)) return {};
  return keys.reduce((result, key) => {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

/**
 * Omit specific properties from object
 * @param {Object} obj - Source object
 * @param {Array} keys - Keys to omit
 * @returns {Object} New object without omitted properties
 */
export const omit = (obj, keys) => {
  if (!obj) return {};
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

/**
 * Flatten nested object
 * @param {Object} obj - Object to flatten
 * @param {string} prefix - Key prefix
 * @returns {Object} Flattened object
 */
export const flatten = (obj, prefix = '') => {
  const flattened = {};
  
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (isObject(value)) {
      Object.assign(flattened, flatten(value, newKey));
    } else {
      flattened[newKey] = value;
    }
  });
  
  return flattened;
};

/**
 * Unflatten object
 * @param {Object} obj - Flattened object
 * @returns {Object} Nested object
 */
export const unflatten = (obj) => {
  const result = {};
  
  Object.keys(obj).forEach(key => {
    setNestedValue(result, key, obj[key]);
  });
  
  return result;
};

/**
 * Compare two objects for equality
 * @param {Object} obj1 - First object
 * @param {Object} obj2 - Second object
 * @returns {boolean} True if equal
 */
export const isEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;
  if (obj1 == null || obj2 == null) return false;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return obj1 === obj2;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!isEqual(obj1[key], obj2[key])) return false;
  }
  
  return true;
};

/**
 * Get object keys
 * @param {Object} obj - Object
 * @returns {Array} Array of keys
 */
export const keys = (obj) => {
  if (!obj || typeof obj !== 'object') return [];
  return Object.keys(obj);
};

/**
 * Get object values
 * @param {Object} obj - Object
 * @returns {Array} Array of values
 */
export const values = (obj) => {
  if (!obj || typeof obj !== 'object') return [];
  return Object.values(obj);
};

/**
 * Get object entries
 * @param {Object} obj - Object
 * @returns {Array} Array of [key, value] pairs
 */
export const entries = (obj) => {
  if (!obj || typeof obj !== 'object') return [];
  return Object.entries(obj);
};

/**
 * Invert object (swap keys and values)
 * @param {Object} obj - Object to invert
 * @returns {Object} Inverted object
 */
export const invert = (obj) => {
  if (!obj || typeof obj !== 'object') return {};
  return Object.entries(obj).reduce((result, [key, value]) => {
    result[value] = key;
    return result;
  }, {});
};

/**
 * Map object values
 * @param {Object} obj - Object to map
 * @param {Function} fn - Mapping function
 * @returns {Object} Mapped object
 */
export const mapValues = (obj, fn) => {
  if (!obj || typeof obj !== 'object') return {};
  return Object.entries(obj).reduce((result, [key, value]) => {
    result[key] = fn(value, key, obj);
    return result;
  }, {});
};

/**
 * Filter object by predicate
 * @param {Object} obj - Object to filter
 * @param {Function} fn - Filter function
 * @returns {Object} Filtered object
 */
export const filter = (obj, fn) => {
  if (!obj || typeof obj !== 'object') return {};
  return Object.entries(obj).reduce((result, [key, value]) => {
    if (fn(value, key, obj)) {
      result[key] = value;
    }
    return result;
  }, {});
};

/**
 * Remove null and undefined values
 * @param {Object} obj - Object to clean
 * @returns {Object} Cleaned object
 */
export const compact = (obj) => {
  if (!obj || typeof obj !== 'object') return {};
  return filter(obj, value => value != null);
};

export default {
  deepClone,
  shallowClone,
  deepMerge,
  isObject,
  isEmpty,
  getNestedValue,
  setNestedValue,
  pick,
  omit,
  flatten,
  unflatten,
  isEqual,
  keys,
  values,
  entries,
  invert,
  mapValues,
  filter,
  compact,
};