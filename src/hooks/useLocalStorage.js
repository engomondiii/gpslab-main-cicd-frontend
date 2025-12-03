/**
 * GPS Lab Platform - useLocalStorage Hook
 * 
 * Custom hook for using localStorage with React state,
 * including cross-tab synchronization.
 * 
 * @module hooks/useLocalStorage
 * @version 1.0.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  getItem, 
  setItem, 
  removeItem, 
  subscribeToKey 
} from '../services/storage/localStorage.service';

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

/**
 * Hook for localStorage with state synchronization
 * @param {string} key - Storage key
 * @param {*} initialValue - Initial value
 * @param {Object} options - Hook options
 * @returns {Array} [value, setValue, removeValue]
 */
export const useLocalStorage = (key, initialValue, options = {}) => {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    syncTabs = true,
    expiresIn = null
  } = options;
  
  // Track if we're the one making the update
  const isUpdating = useRef(false);
  
  // ==========================================================================
  // STATE INITIALIZATION
  // ==========================================================================
  
  /**
   * Initialize state from storage or initial value
   */
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = getItem(key);
      
      if (item !== null) {
        return item;
      }
      
      // If initialValue is a function, call it
      const value = initialValue instanceof Function ? initialValue() : initialValue;
      
      // Store initial value
      if (value !== undefined) {
        setItem(key, value, { expiresIn });
      }
      
      return value;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue instanceof Function ? initialValue() : initialValue;
    }
  });
  
  // ==========================================================================
  // VALUE SETTER
  // ==========================================================================
  
  /**
   * Sets value in state and storage
   * @param {*} value - New value or updater function
   */
  const setValue = useCallback((value) => {
    try {
      isUpdating.current = true;
      
      // Allow value to be a function (like useState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (valueToStore === undefined) {
        removeItem(key);
      } else {
        setItem(key, valueToStore, { expiresIn });
      }
      
      // Reset flag after a tick
      setTimeout(() => {
        isUpdating.current = false;
      }, 0);
      
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      isUpdating.current = false;
    }
  }, [key, storedValue, expiresIn]);
  
  /**
   * Removes value from storage
   */
  const remove = useCallback(() => {
    try {
      isUpdating.current = true;
      setStoredValue(undefined);
      removeItem(key);
      
      setTimeout(() => {
        isUpdating.current = false;
      }, 0);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      isUpdating.current = false;
    }
  }, [key]);
  
  // ==========================================================================
  // CROSS-TAB SYNC
  // ==========================================================================
  
  /**
   * Sync state across tabs
   */
  useEffect(() => {
    if (!syncTabs) return;
    
    const unsubscribe = subscribeToKey(key, (newValue) => {
      // Ignore updates we initiated
      if (isUpdating.current) return;
      
      setStoredValue(newValue);
    });
    
    return unsubscribe;
  }, [key, syncTabs]);
  
  // ==========================================================================
  // RETURN
  // ==========================================================================
  
  return [storedValue, setValue, remove];
};

// =============================================================================
// SPECIALIZED HOOKS
// =============================================================================

/**
 * Hook for boolean localStorage value
 * @param {string} key - Storage key
 * @param {boolean} initialValue - Initial value
 * @returns {Array} [value, toggle, setValue]
 */
export const useLocalStorageBoolean = (key, initialValue = false) => {
  const [value, setValue, remove] = useLocalStorage(key, initialValue);
  
  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, [setValue]);
  
  return [value, toggle, setValue, remove];
};

/**
 * Hook for array localStorage value
 * @param {string} key - Storage key
 * @param {Array} initialValue - Initial value
 * @returns {Object} Array operations
 */
export const useLocalStorageArray = (key, initialValue = []) => {
  const [value, setValue, remove] = useLocalStorage(key, initialValue);
  
  const push = useCallback((item) => {
    setValue(prev => [...(prev || []), item]);
  }, [setValue]);
  
  const pop = useCallback(() => {
    let popped;
    setValue(prev => {
      const arr = [...(prev || [])];
      popped = arr.pop();
      return arr;
    });
    return popped;
  }, [setValue]);
  
  const removeAt = useCallback((index) => {
    setValue(prev => {
      const arr = [...(prev || [])];
      arr.splice(index, 1);
      return arr;
    });
  }, [setValue]);
  
  const removeItem = useCallback((item) => {
    setValue(prev => (prev || []).filter(i => i !== item));
  }, [setValue]);
  
  const clear = useCallback(() => {
    setValue([]);
  }, [setValue]);
  
  const includes = useCallback((item) => {
    return (value || []).includes(item);
  }, [value]);
  
  return {
    value: value || [],
    setValue,
    push,
    pop,
    removeAt,
    removeItem,
    clear,
    includes,
    length: (value || []).length,
    remove
  };
};

/**
 * Hook for object localStorage value
 * @param {string} key - Storage key
 * @param {Object} initialValue - Initial value
 * @returns {Object} Object operations
 */
export const useLocalStorageObject = (key, initialValue = {}) => {
  const [value, setValue, remove] = useLocalStorage(key, initialValue);
  
  const setProperty = useCallback((prop, propValue) => {
    setValue(prev => ({
      ...(prev || {}),
      [prop]: propValue
    }));
  }, [setValue]);
  
  const removeProperty = useCallback((prop) => {
    setValue(prev => {
      const newObj = { ...(prev || {}) };
      delete newObj[prop];
      return newObj;
    });
  }, [setValue]);
  
  const merge = useCallback((obj) => {
    setValue(prev => ({
      ...(prev || {}),
      ...obj
    }));
  }, [setValue]);
  
  const reset = useCallback(() => {
    setValue(initialValue);
  }, [setValue, initialValue]);
  
  return {
    value: value || {},
    setValue,
    setProperty,
    removeProperty,
    merge,
    reset,
    remove
  };
};

/**
 * Hook for number localStorage value with increment/decrement
 * @param {string} key - Storage key
 * @param {number} initialValue - Initial value
 * @returns {Object} Number operations
 */
export const useLocalStorageNumber = (key, initialValue = 0) => {
  const [value, setValue, remove] = useLocalStorage(key, initialValue);
  
  const increment = useCallback((amount = 1) => {
    setValue(prev => (prev || 0) + amount);
  }, [setValue]);
  
  const decrement = useCallback((amount = 1) => {
    setValue(prev => (prev || 0) - amount);
  }, [setValue]);
  
  const reset = useCallback(() => {
    setValue(initialValue);
  }, [setValue, initialValue]);
  
  return {
    value: value || 0,
    setValue,
    increment,
    decrement,
    reset,
    remove
  };
};

// =============================================================================
// EXPORTS
// =============================================================================

export default useLocalStorage;