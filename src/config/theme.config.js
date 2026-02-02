/* ============================================
   GPS LAB - Theme Configuration
   LIGHT MODE ONLY - Dark theme disabled
   ============================================ */

/**
 * Theme Configuration for GPS Lab Platform
 * 
 * GPS Lab uses LIGHT MODE ONLY for optimal readability
 * and professional appearance across all features.
 * 
 * High contrast mode is available for accessibility.
 */

export const THEME_CONFIG = {
  // Default theme - always light
  defaultTheme: 'light',
  
  // Available themes - dark mode removed
  availableThemes: ['light', 'high-contrast'],
  
  // Theme persistence disabled - always use light
  persistTheme: false,
  
  // Theme switching disabled
  allowThemeToggle: false,
  
  // System preference detection disabled
  respectSystemPreference: false,
  
  // Storage key (not used, but kept for compatibility)
  storageKey: 'gps-lab-theme',
  
  // Theme metadata
  themes: {
    light: {
      id: 'light',
      name: 'Light Mode',
      description: 'Default GPS Lab appearance',
      icon: '☀️',
      dataAttribute: 'light',
      enabled: true,
      default: true,
    },
    'high-contrast': {
      id: 'high-contrast',
      name: 'High Contrast',
      description: 'Accessibility mode with enhanced contrast (WCAG AAA)',
      icon: '◐',
      dataAttribute: 'high-contrast',
      enabled: true,
      default: false,
    },
  },
};

/**
 * Get the current theme
 * Always returns 'light' unless high-contrast is explicitly enabled
 */
export const getCurrentTheme = () => {
  // Check if user has enabled high-contrast mode for accessibility
  const isHighContrast = document.documentElement.getAttribute('data-theme') === 'high-contrast';
  return isHighContrast ? 'high-contrast' : 'light';
};

/**
 * Set theme
 * Only accepts 'light' or 'high-contrast'
 * @param {string} theme - Theme name ('light' or 'high-contrast')
 */
export const setTheme = (theme) => {
  // Only allow light or high-contrast
  const validTheme = theme === 'high-contrast' ? 'high-contrast' : 'light';
  
  document.documentElement.setAttribute('data-theme', validTheme);
  
  // Dispatch custom event for theme change
  window.dispatchEvent(
    new CustomEvent('themechange', {
      detail: { theme: validTheme },
    })
  );
  
  return validTheme;
};

/**
 * Initialize theme system
 * Sets light mode as default
 */
export const initializeTheme = () => {
  // Always start with light theme
  setTheme('light');
  
  console.log('GPS Lab Theme: Light mode initialized');
  console.log('High contrast mode available for accessibility');
};

/**
 * Toggle high contrast mode (accessibility feature)
 */
export const toggleHighContrast = () => {
  const current = getCurrentTheme();
  const newTheme = current === 'high-contrast' ? 'light' : 'high-contrast';
  return setTheme(newTheme);
};

/**
 * Check if high contrast mode is active
 */
export const isHighContrastMode = () => {
  return getCurrentTheme() === 'high-contrast';
};

/**
 * Theme utility functions
 */
export const themeUtils = {
  getCurrentTheme,
  setTheme,
  initializeTheme,
  toggleHighContrast,
  isHighContrastMode,
  
  // Helper to get theme colors
  getThemeColors: () => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    return {
      primary: computedStyle.getPropertyValue('--gps-primary').trim(),
      secondary: computedStyle.getPropertyValue('--gps-secondary').trim(),
      accent: computedStyle.getPropertyValue('--gps-accent').trim(),
      background: computedStyle.getPropertyValue('--neutral-100').trim(),
      text: computedStyle.getPropertyValue('--neutral-900').trim(),
    };
  },
  
  // Check if theme switching is allowed (always false)
  canSwitchTheme: () => false,
  
  // Get available themes
  getAvailableThemes: () => THEME_CONFIG.availableThemes,
};

export default THEME_CONFIG;