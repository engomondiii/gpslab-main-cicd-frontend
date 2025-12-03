/**
 * GPS Lab Platform - UI Constants
 * 
 * UI-related constants including colors, themes, breakpoints,
 * animations, and accessibility settings.
 * 
 * @module utils/constants/ui.constants
 * @version 1.0.0
 */

// =============================================================================
// COLOR PALETTE
// =============================================================================

/**
 * Primary brand colors
 */
export const BRAND_COLORS = {
  primary: '#2563eb',       // Blue
  primaryLight: '#3b82f6',
  primaryDark: '#1d4ed8',
  primaryBg: '#dbeafe',
  
  secondary: '#8b5cf6',     // Purple
  secondaryLight: '#a78bfa',
  secondaryDark: '#7c3aed',
  secondaryBg: '#f3e8ff',
  
  accent: '#f97316',        // Orange
  accentLight: '#fb923c',
  accentDark: '#ea580c',
  accentBg: '#fff7ed'
};

/**
 * Semantic colors
 */
export const SEMANTIC_COLORS = {
  success: '#059669',
  successLight: '#10b981',
  successDark: '#047857',
  successBg: '#dcfce7',
  
  warning: '#d97706',
  warningLight: '#f59e0b',
  warningDark: '#b45309',
  warningBg: '#fef3c7',
  
  danger: '#dc2626',
  dangerLight: '#ef4444',
  dangerDark: '#b91c1c',
  dangerBg: '#fee2e2',
  
  info: '#0284c7',
  infoLight: '#0ea5e9',
  infoDark: '#0369a1',
  infoBg: '#e0f2fe'
};

/**
 * Neutral/gray colors
 */
export const NEUTRAL_COLORS = {
  white: '#ffffff',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  black: '#000000'
};

/**
 * Beacon/Adventure colors
 */
export const BEACON_COLORS = {
  adventure0: '#ef4444',  // Red
  adventure1: '#f97316',  // Orange
  adventure2: '#eab308',  // Yellow
  adventure3: '#22c55e',  // Green
  adventure4: '#3b82f6',  // Blue
  adventure5: '#6366f1',  // Indigo
  adventure6: '#8b5cf6',  // Purple
  adventure7: '#f8fafc'   // Light/Rainbow
};

/**
 * Baraka tier colors
 */
export const BARAKA_TIER_COLORS = {
  starter: '#9ca3af',
  beginner: '#f97316',
  intermediate: '#eab308',
  advanced: '#22c55e',
  expert: '#3b82f6',
  master: '#8b5cf6',
  legendary: '#f59e0b'
};

/**
 * Badge rarity colors
 */
export const BADGE_RARITY_COLORS = {
  common: '#9ca3af',
  uncommon: '#eab308',
  rare: '#22c55e',
  epic: '#3b82f6',
  legendary: '#8b5cf6',
  mythic: '#f59e0b'
};

// =============================================================================
// THEMES
// =============================================================================

/**
 * Light theme colors
 */
export const LIGHT_THEME = {
  name: 'light',
  
  // Backgrounds
  bgPrimary: '#ffffff',
  bgSecondary: '#f9fafb',
  bgTertiary: '#f3f4f6',
  bgElevated: '#ffffff',
  
  // Text
  textPrimary: '#111827',
  textSecondary: '#4b5563',
  textMuted: '#9ca3af',
  textInverse: '#ffffff',
  
  // Borders
  borderLight: '#e5e7eb',
  borderMedium: '#d1d5db',
  borderDark: '#9ca3af',
  
  // Shadows
  shadowColor: 'rgba(0, 0, 0, 0.1)',
  shadowColorHover: 'rgba(0, 0, 0, 0.15)',
  
  // Overlays
  overlayLight: 'rgba(255, 255, 255, 0.5)',
  overlayDark: 'rgba(0, 0, 0, 0.5)'
};

/**
 * Dark theme colors
 */
export const DARK_THEME = {
  name: 'dark',
  
  // Backgrounds
  bgPrimary: '#111827',
  bgSecondary: '#1f2937',
  bgTertiary: '#374151',
  bgElevated: '#1f2937',
  
  // Text
  textPrimary: '#f9fafb',
  textSecondary: '#d1d5db',
  textMuted: '#9ca3af',
  textInverse: '#111827',
  
  // Borders
  borderLight: '#374151',
  borderMedium: '#4b5563',
  borderDark: '#6b7280',
  
  // Shadows
  shadowColor: 'rgba(0, 0, 0, 0.3)',
  shadowColorHover: 'rgba(0, 0, 0, 0.4)',
  
  // Overlays
  overlayLight: 'rgba(255, 255, 255, 0.1)',
  overlayDark: 'rgba(0, 0, 0, 0.7)'
};

/**
 * High contrast theme
 */
export const HIGH_CONTRAST_THEME = {
  name: 'high-contrast',
  
  // Backgrounds
  bgPrimary: '#000000',
  bgSecondary: '#1a1a1a',
  bgTertiary: '#2a2a2a',
  bgElevated: '#1a1a1a',
  
  // Text
  textPrimary: '#ffffff',
  textSecondary: '#e0e0e0',
  textMuted: '#b0b0b0',
  textInverse: '#000000',
  
  // Borders
  borderLight: '#ffffff',
  borderMedium: '#ffffff',
  borderDark: '#ffffff',
  
  // Shadows
  shadowColor: 'rgba(255, 255, 255, 0.1)',
  shadowColorHover: 'rgba(255, 255, 255, 0.2)',
  
  // Overlays
  overlayLight: 'rgba(255, 255, 255, 0.2)',
  overlayDark: 'rgba(0, 0, 0, 0.9)'
};

// =============================================================================
// TYPOGRAPHY
// =============================================================================

/**
 * Font families
 */
export const FONT_FAMILIES = {
  primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  secondary: "'Poppins', sans-serif",
  mono: "'Roboto Mono', 'Consolas', 'Monaco', monospace",
  korean: "'Noto Sans KR', sans-serif",
  arabic: "'Noto Sans Arabic', sans-serif"
};

/**
 * Font sizes (rem)
 */
export const FONT_SIZES = {
  xs: '0.75rem',     // 12px
  sm: '0.875rem',    // 14px
  base: '1rem',      // 16px
  lg: '1.125rem',    // 18px
  xl: '1.25rem',     // 20px
  '2xl': '1.5rem',   // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
  '5xl': '3rem',     // 48px
  '6xl': '3.75rem'   // 60px
};

/**
 * Font weights
 */
export const FONT_WEIGHTS = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700
};

/**
 * Line heights
 */
export const LINE_HEIGHTS = {
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2
};

// =============================================================================
// SPACING
// =============================================================================

/**
 * Spacing scale (rem)
 */
export const SPACING = {
  '0': '0',
  px: '1px',
  '0.5': '0.125rem',  // 2px
  '1': '0.25rem',     // 4px
  '1.5': '0.375rem',  // 6px
  '2': '0.5rem',      // 8px
  '2.5': '0.625rem',  // 10px
  '3': '0.75rem',     // 12px
  '3.5': '0.875rem',  // 14px
  '4': '1rem',        // 16px
  '5': '1.25rem',     // 20px
  '6': '1.5rem',      // 24px
  '7': '1.75rem',     // 28px
  '8': '2rem',        // 32px
  '9': '2.25rem',     // 36px
  '10': '2.5rem',     // 40px
  '12': '3rem',       // 48px
  '14': '3.5rem',     // 56px
  '16': '4rem',       // 64px
  '20': '5rem',       // 80px
  '24': '6rem',       // 96px
  '32': '8rem',       // 128px
  '40': '10rem',      // 160px
  '48': '12rem'       // 192px
};

// =============================================================================
// RESPONSIVE BREAKPOINTS
// =============================================================================

/**
 * Breakpoint values (pixels)
 */
export const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

/**
 * Media query strings
 */
export const MEDIA_QUERIES = {
  xs: `(min-width: ${BREAKPOINTS.xs}px)`,
  sm: `(min-width: ${BREAKPOINTS.sm}px)`,
  md: `(min-width: ${BREAKPOINTS.md}px)`,
  lg: `(min-width: ${BREAKPOINTS.lg}px)`,
  xl: `(min-width: ${BREAKPOINTS.xl}px)`,
  '2xl': `(min-width: ${BREAKPOINTS['2xl']}px)`,
  
  // Max-width queries
  xsMax: `(max-width: ${BREAKPOINTS.sm - 1}px)`,
  smMax: `(max-width: ${BREAKPOINTS.md - 1}px)`,
  mdMax: `(max-width: ${BREAKPOINTS.lg - 1}px)`,
  lgMax: `(max-width: ${BREAKPOINTS.xl - 1}px)`,
  
  // Device queries
  mobile: `(max-width: ${BREAKPOINTS.md - 1}px)`,
  tablet: `(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`,
  desktop: `(min-width: ${BREAKPOINTS.lg}px)`,
  
  // Preference queries
  prefersReducedMotion: '(prefers-reduced-motion: reduce)',
  prefersDark: '(prefers-color-scheme: dark)',
  prefersLight: '(prefers-color-scheme: light)'
};

// =============================================================================
// ANIMATIONS
// =============================================================================

/**
 * Animation durations (ms)
 */
export const ANIMATION_DURATIONS = {
  fastest: 50,
  fast: 100,
  normal: 200,
  slow: 300,
  slower: 500,
  slowest: 1000
};

/**
 * Transition timing functions
 */
export const EASINGS = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  
  // Custom easings
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)'
};

/**
 * Common animation presets
 */
export const ANIMATION_PRESETS = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: ANIMATION_DURATIONS.normal,
    easing: EASINGS.easeOut
  },
  
  slideUp: {
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    duration: ANIMATION_DURATIONS.normal,
    easing: EASINGS.easeOut
  },
  
  scaleIn: {
    from: { opacity: 0, transform: 'scale(0.95)' },
    to: { opacity: 1, transform: 'scale(1)' },
    duration: ANIMATION_DURATIONS.fast,
    easing: EASINGS.spring
  },
  
  pulse: {
    keyframes: '0%, 100% { opacity: 1 } 50% { opacity: 0.5 }',
    duration: ANIMATION_DURATIONS.slowest,
    easing: EASINGS.easeInOut,
    iteration: 'infinite'
  },
  
  spin: {
    keyframes: '0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) }',
    duration: ANIMATION_DURATIONS.slowest,
    easing: EASINGS.linear,
    iteration: 'infinite'
  }
};

// =============================================================================
// SHADOWS
// =============================================================================

/**
 * Box shadow presets
 */
export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  
  // Colored shadows
  primary: '0 4px 14px 0 rgba(37, 99, 235, 0.25)',
  success: '0 4px 14px 0 rgba(5, 150, 105, 0.25)',
  warning: '0 4px 14px 0 rgba(217, 119, 6, 0.25)',
  danger: '0 4px 14px 0 rgba(220, 38, 38, 0.25)'
};

// =============================================================================
// BORDER RADIUS
// =============================================================================

/**
 * Border radius presets
 */
export const BORDER_RADIUS = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px'
};

// =============================================================================
// Z-INDEX
// =============================================================================

/**
 * Z-index scale
 */
export const Z_INDEX = {
  hide: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  toast: 80,
  loading: 90,
  max: 9999
};

// =============================================================================
// ACCESSIBILITY
// =============================================================================

/**
 * Focus styles
 */
export const FOCUS_STYLES = {
  default: {
    outline: '2px solid #2563eb',
    outlineOffset: '2px'
  },
  inset: {
    outline: '2px solid #2563eb',
    outlineOffset: '-2px'
  },
  ring: {
    boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.5)'
  }
};

/**
 * Reduced motion styles
 */
export const REDUCED_MOTION = {
  transition: 'none',
  animation: 'none',
  transform: 'none'
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Colors
  BRAND_COLORS,
  SEMANTIC_COLORS,
  NEUTRAL_COLORS,
  BEACON_COLORS,
  BARAKA_TIER_COLORS,
  BADGE_RARITY_COLORS,
  
  // Themes
  LIGHT_THEME,
  DARK_THEME,
  HIGH_CONTRAST_THEME,
  
  // Typography
  FONT_FAMILIES,
  FONT_SIZES,
  FONT_WEIGHTS,
  LINE_HEIGHTS,
  
  // Layout
  SPACING,
  BREAKPOINTS,
  MEDIA_QUERIES,
  BORDER_RADIUS,
  Z_INDEX,
  
  // Effects
  SHADOWS,
  ANIMATION_DURATIONS,
  EASINGS,
  ANIMATION_PRESETS,
  
  // Accessibility
  FOCUS_STYLES,
  REDUCED_MOTION
};