/**
 * GPS Lab Platform - Hooks Index
 * 
 * Central export for all custom hooks.
 * 
 * @module hooks
 * @version 1.0.0
 */

// =============================================================================
// AUTH HOOKS
// =============================================================================

export { useAuth, default as useAuthDefault } from './useAuth';

// =============================================================================
// STORAGE HOOKS
// =============================================================================

export { 
  useLocalStorage, 
  useLocalStorageBoolean,
  useLocalStorageArray,
  useLocalStorageObject,
  useLocalStorageNumber,
  default as useLocalStorageDefault 
} from './useLocalStorage';

// =============================================================================
// CONTEXT HOOKS (Re-exports from context)
// =============================================================================

export { useAuthContext } from '../context/AuthContext';
export { useTheme } from '../context/ThemeContext';
export { useBaraka } from '../context/BarakaContext';