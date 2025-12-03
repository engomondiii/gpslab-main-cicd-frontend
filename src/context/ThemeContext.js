/**
 * GPS Lab Platform - ThemeContext
 * 
 * Global theme context provider for managing light/dark mode
 * and theme preferences across the application.
 * 
 * @module context/ThemeContext
 * @version 1.0.0
 */

import React, { createContext, useContext, useEffect, useMemo, useCallback, useState } from 'react';
import { 
  getTheme, 
  setTheme as saveTheme, 
  subscribeToKey 
} from '../services/storage/localStorage.service';

// =============================================================================
// THEME CONSTANTS
// =============================================================================

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  HIGH_CONTRAST: 'high-contrast',
  SYSTEM: 'system'
};

export const THEME_COLORS = {
  light: {
    primary: '#2563eb',
    secondary: '#8b5cf6',
    accent: '#f97316',
    baraka: '#f59e0b',
    background: '#ffffff',
    surface: '#f9fafb',
    text: '#111827',
    textSecondary: '#4b5563'
  },
  dark: {
    primary: '#3b82f6',
    secondary: '#a78bfa',
    accent: '#fb923c',
    baraka: '#fbbf24',
    background: '#111827',
    surface: '#1f2937',
    text: '#f9fafb',
    textSecondary: '#9ca3af'
  },
  'high-contrast': {
    primary: '#1d4ed8',
    secondary: '#7c3aed',
    accent: '#ea580c',
    baraka: '#d97706',
    background: '#000000',
    surface: '#171717',
    text: '#ffffff',
    textSecondary: '#d4d4d8'
  }
};

// =============================================================================
// CONTEXT
// =============================================================================

const ThemeContext = createContext(null);

// =============================================================================
// PROVIDER
// =============================================================================

export const ThemeProvider = ({ children, defaultTheme = THEMES.SYSTEM }) => {
  // ===========================================================================
  // STATE
  // ===========================================================================
  
  const [themePreference, setThemePreference] = useState(() => {
    return getTheme() || defaultTheme;
  });
  
  const [systemTheme, setSystemTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? THEMES.DARK 
        : THEMES.LIGHT;
    }
    return THEMES.LIGHT;
  });
  
  // Resolved theme (accounting for system preference)
  const resolvedTheme = useMemo(() => {
    if (themePreference === THEMES.SYSTEM) {
      return systemTheme;
    }
    return themePreference;
  }, [themePreference, systemTheme]);
  
  // ===========================================================================
  // EFFECTS
  // ===========================================================================
  
  /**
   * Apply theme to document
   */
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark', 'high-contrast');
    body.classList.remove('light', 'dark', 'high-contrast');
    
    // Add current theme class
    root.classList.add(resolvedTheme);
    body.classList.add(resolvedTheme);
    
    // Set data attribute for CSS selectors
    root.setAttribute('data-theme', resolvedTheme);
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', THEME_COLORS[resolvedTheme].background);
    }
  }, [resolvedTheme]);
  
  /**
   * Listen for system theme changes
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      setSystemTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  /**
   * Sync theme across tabs
   */
  useEffect(() => {
    const unsubscribe = subscribeToKey('gps_theme', (newTheme) => {
      if (newTheme) {
        setThemePreference(newTheme);
      }
    });
    
    return unsubscribe;
  }, []);
  
  // ===========================================================================
  // METHODS
  // ===========================================================================
  
  /**
   * Sets theme preference
   * @param {string} theme - Theme to set
   */
  const setTheme = useCallback((theme) => {
    if (!Object.values(THEMES).includes(theme)) {
      console.warn(`Invalid theme: ${theme}`);
      return;
    }
    
    setThemePreference(theme);
    saveTheme(theme);
  }, []);
  
  /**
   * Toggles between light and dark
   */
  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    setTheme(newTheme);
  }, [resolvedTheme, setTheme]);
  
  /**
   * Sets theme to system preference
   */
  const useSystemTheme = useCallback(() => {
    setTheme(THEMES.SYSTEM);
  }, [setTheme]);
  
  /**
   * Gets CSS variable value for current theme
   * @param {string} variable - CSS variable name
   * @returns {string} Variable value
   */
  const getCSSVariable = useCallback((variable) => {
    const root = document.documentElement;
    return getComputedStyle(root).getPropertyValue(variable).trim();
  }, []);
  
  /**
   * Sets CSS variable
   * @param {string} variable - CSS variable name
   * @param {string} value - Value to set
   */
  const setCSSVariable = useCallback((variable, value) => {
    document.documentElement.style.setProperty(variable, value);
  }, []);
  
  // ===========================================================================
  // COMPUTED
  // ===========================================================================
  
  const isDark = resolvedTheme === THEMES.DARK;
  const isLight = resolvedTheme === THEMES.LIGHT;
  const isHighContrast = resolvedTheme === THEMES.HIGH_CONTRAST;
  const isSystemPreference = themePreference === THEMES.SYSTEM;
  const colors = THEME_COLORS[resolvedTheme];
  
  // ===========================================================================
  // CONTEXT VALUE
  // ===========================================================================
  
  const contextValue = useMemo(() => ({
    // Current state
    theme: resolvedTheme,
    themePreference,
    systemTheme,
    colors,
    
    // Computed
    isDark,
    isLight,
    isHighContrast,
    isSystemPreference,
    
    // Methods
    setTheme,
    toggleTheme,
    useSystemTheme,
    getCSSVariable,
    setCSSVariable,
    
    // Constants
    THEMES,
    THEME_COLORS
  }), [
    resolvedTheme,
    themePreference,
    systemTheme,
    colors,
    isDark,
    isLight,
    isHighContrast,
    isSystemPreference,
    setTheme,
    toggleTheme,
    useSystemTheme,
    getCSSVariable,
    setCSSVariable
  ]);
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// =============================================================================
// HOOK
// =============================================================================

/**
 * Hook to use theme context
 * @returns {Object} Theme context value
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

// =============================================================================
// EXPORTS
// =============================================================================

export default ThemeContext;