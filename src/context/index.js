/**
 * GPS Lab Platform - Contexts Index
 * 
 * Central export for all context providers and hooks.
 * 
 * @module contexts
 */

// Theme Context
export { 
  ThemeProvider, 
  useTheme, 
  THEMES,
  default as ThemeContext 
} from './ThemeContext';

// I18n Context
export { 
  I18nProvider, 
  useI18n, 
  useTranslation,
  LANGUAGES,
  LANGUAGE_NAMES,
  default as I18nContext 
} from './I18nContext';

// Auth Context
export { 
  AuthProvider, 
  useAuth,
  default as AuthContext 
} from './AuthContext';

// Notification Context
export { 
  NotificationProvider, 
  useNotifications,
  NOTIFICATION_TYPES,
  default as NotificationContext 
} from './NotificationContext';

// WebSocket Context
export { 
  WebSocketProvider, 
  useWebSocket,
  WS_STATUS,
  default as WebSocketContext 
} from './WebSocketContext';