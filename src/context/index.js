/**
 * GPS Lab Platform - Context Index
 * 
 * Central export for all context providers and hooks.
 * 
 * @module context
 * @version 1.0.0
 */

// =============================================================================
// AUTH CONTEXT
// =============================================================================

export { 
  AuthProvider, 
  useAuthContext,
  default as AuthContext 
} from './AuthContext';

// =============================================================================
// THEME CONTEXT
// =============================================================================

export { 
  ThemeProvider, 
  useTheme,
  THEMES,
  THEME_COLORS,
  default as ThemeContext 
} from './ThemeContext';

// =============================================================================
// BARAKA CONTEXT
// =============================================================================

export { 
  BarakaProvider, 
  useBaraka,
  default as BarakaContext 
} from './BarakaContext';

// =============================================================================
// COMBINED PROVIDER
// =============================================================================

import React from 'react';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { BarakaProvider } from './BarakaContext';

/**
 * Combined provider that wraps all context providers
 * @param {Object} props - Component props
 * @returns {JSX.Element} Provider tree
 */
export const AppProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BarakaProvider>
          {children}
        </BarakaProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default AppProviders;