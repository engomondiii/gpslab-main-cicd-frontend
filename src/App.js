/**
 * GPS Lab Platform - App Component
 * 
 * Main application entry point.
 * Wraps the app with all necessary providers and includes core components.
 * 
 * @module App
 */

import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';

// Providers
import { ThemeProvider } from './context/ThemeContext';
import { I18nProvider } from './context/I18nContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { WebSocketProvider } from './context/WebSocketContext';

// Router
import AppRouter from './routes/AppRouter';
import { RouteLoadingFallback } from './routes/PublicRoutes';

// Components
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary';
import Toast from './components/common/Toast/Toast';

// Styles
import './App.css';

/**
 * Toast Container Component
 * Manages toast notifications display
 */
const ToastContainer = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;
  
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onDismiss={() => onDismiss(toast.id)}
          position={toast.position || 'top-right'}
        />
      ))}
    </div>
  );
};

/**
 * App Loading Screen
 * Shown during initial app load
 */
const AppLoadingScreen = () => (
  <div className="app-loading">
    <div className="app-loading__content">
      <div className="app-loading__logo">
        <svg viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="4"/>
          <path 
            d="M50 15L50 50L75 75" 
            stroke="currentColor" 
            strokeWidth="4" 
            strokeLinecap="round"
            className="app-loading__needle"
          />
          <circle cx="50" cy="50" r="6" fill="currentColor"/>
        </svg>
      </div>
      <h1 className="app-loading__title">GPS Lab</h1>
      <p className="app-loading__subtitle">Preparing your journey...</p>
      <div className="app-loading__spinner">
        <div className="app-loading__spinner-ring" />
        <div className="app-loading__spinner-ring" />
        <div className="app-loading__spinner-ring" />
      </div>
    </div>
  </div>
);

/**
 * App Error Fallback
 * Shown when the app encounters a critical error
 */
const AppErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="app-error">
    <div className="app-error__content">
      <div className="app-error__icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      </div>
      <h1 className="app-error__title">Something Went Wrong</h1>
      <p className="app-error__message">
        We encountered an unexpected error. Please try refreshing the page.
      </p>
      {process.env.NODE_ENV === 'development' && error && (
        <details className="app-error__details">
          <summary>Error Details</summary>
          <pre>{error.message}</pre>
          <pre>{error.stack}</pre>
        </details>
      )}
      <div className="app-error__actions">
        <button
          onClick={() => window.location.reload()}
          className="app-error__btn app-error__btn--primary"
        >
          Refresh Page
        </button>
        <button
          onClick={resetErrorBoundary}
          className="app-error__btn app-error__btn--secondary"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
);

/**
 * Main App Component
 */
const App = () => {
  // App state
  const [isInitialized, setIsInitialized] = useState(false);
  const [toasts, setToasts] = useState([]);
  
  // Auth state (would typically come from AuthContext)
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  // User data
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    level: 1,
    currentXP: 0,
    requiredXP: 100,
    currentStage: 1,
    missionsCompleted: 0,
    currentStreak: 0
  });
  const [wallets, setWallets] = useState({
    baraka: { balance: 0, pending: 0, tier: 'yellow' },
    psb: { balance: 0, invested: 0, returns: 0 }
  });
  
  // App settings
  const [currentLanguage, setCurrentLanguage] = useState('en');
  
  /**
   * Initialize app
   */
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Simulate checking auth status
        const storedUser = localStorage.getItem('gps_user');
        const storedToken = localStorage.getItem('gps_token');
        
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
          
          // TODO: Fetch fresh user data from API
          // const userData = await fetchUserData(storedToken);
          // setUser(userData);
        }
        
        // Load language preference
        const storedLang = localStorage.getItem('gps_language');
        if (storedLang) {
          setCurrentLanguage(storedLang);
        }
        
      } catch (error) {
        console.error('App initialization error:', error);
        addToast({
          type: 'error',
          title: 'Initialization Error',
          message: 'Failed to load app settings. Some features may not work correctly.'
        });
      } finally {
        setIsAuthLoading(false);
        setIsInitialized(true);
      }
    };
    
    initializeApp();
  }, []);
  
  /**
   * Add toast notification
   */
  const addToast = useCallback((toast) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { ...toast, id }]);
    
    // Auto-dismiss after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        dismissToast(id);
      }, toast.duration || 5000);
    }
  }, []);
  
  /**
   * Dismiss toast notification
   */
  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);
  
  /**
   * Handle login
   */
  const handleLogin = useCallback(async (credentials) => {
    try {
      setIsAuthLoading(true);
      
      // TODO: Replace with actual API call
      // const response = await authService.login(credentials);
      
      // Simulate login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: '1',
        email: credentials.email,
        firstName: 'GPS',
        lastName: 'User',
        role: 'user',
        avatar: null
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('gps_user', JSON.stringify(mockUser));
      localStorage.setItem('gps_token', 'mock_token');
      
      addToast({
        type: 'success',
        title: 'Welcome Back!',
        message: 'You have successfully signed in.'
      });
      
      return { success: true, user: mockUser };
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Login Failed',
        message: error.message || 'Invalid email or password.'
      });
      return { success: false, error: error.message };
    } finally {
      setIsAuthLoading(false);
    }
  }, [addToast]);
  
  /**
   * Handle registration
   */
  const handleRegister = useCallback(async (data) => {
    try {
      setIsAuthLoading(true);
      
      // TODO: Replace with actual API call
      // const response = await authService.register(data);
      
      // Simulate registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: '1',
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'user',
        avatar: null
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('gps_user', JSON.stringify(mockUser));
      localStorage.setItem('gps_token', 'mock_token');
      
      addToast({
        type: 'success',
        title: 'Welcome to GPS Lab!',
        message: 'Your account has been created successfully.'
      });
      
      return { success: true, user: mockUser };
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Registration Failed',
        message: error.message || 'Could not create account.'
      });
      return { success: false, error: error.message };
    } finally {
      setIsAuthLoading(false);
    }
  }, [addToast]);
  
  /**
   * Handle OAuth login
   */
  const handleOAuthLogin = useCallback(async (provider) => {
    try {
      // TODO: Implement OAuth flow
      addToast({
        type: 'info',
        title: 'OAuth Login',
        message: `${provider} login coming soon!`
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'OAuth Failed',
        message: error.message
      });
    }
  }, [addToast]);
  
  /**
   * Handle logout
   */
  const handleLogout = useCallback(async () => {
    try {
      // TODO: Call logout API
      // await authService.logout();
      
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('gps_user');
      localStorage.removeItem('gps_token');
      
      addToast({
        type: 'info',
        title: 'Signed Out',
        message: 'You have been signed out successfully.'
      });
      
      // Redirect to home
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [addToast]);
  
  /**
   * Handle language change
   */
  const handleLanguageChange = useCallback((lang) => {
    setCurrentLanguage(lang);
    localStorage.setItem('gps_language', lang);
    
    addToast({
      type: 'success',
      title: 'Language Changed',
      message: `Language set to ${lang.toUpperCase()}`
    });
  }, [addToast]);
  
  /**
   * Handle notification click
   */
  const handleNotificationClick = useCallback((notification) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(n =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );
    
    // Navigate to notification link if present
    if (notification.link) {
      window.location.href = notification.link;
    }
  }, []);
  
  // Memoized router props
  const routerProps = useMemo(() => ({
    user,
    isAuthenticated,
    isLoading: isAuthLoading,
    onLogin: handleLogin,
    onRegister: handleRegister,
    onOAuthLogin: handleOAuthLogin,
    onLogout: handleLogout,
    notifications,
    stats,
    wallets,
    currentLanguage,
    onLanguageChange: handleLanguageChange,
    onNotificationClick: handleNotificationClick
  }), [
    user,
    isAuthenticated,
    isAuthLoading,
    handleLogin,
    handleRegister,
    handleOAuthLogin,
    handleLogout,
    notifications,
    stats,
    wallets,
    currentLanguage,
    handleLanguageChange,
    handleNotificationClick
  ]);
  
  // Show loading screen while initializing
  if (!isInitialized) {
    return <AppLoadingScreen />;
  }
  
  return (
    <ErrorBoundary
      fallback={AppErrorFallback}
      onError={(error, errorInfo) => {
        console.error('App Error:', error, errorInfo);
        // TODO: Send to error reporting service
      }}
    >
      <ThemeProvider>
        <I18nProvider language={currentLanguage}>
          <AuthProvider user={user} isAuthenticated={isAuthenticated}>
            <NotificationProvider>
              <WebSocketProvider>
                <div className="app" data-testid="app">
                  {/* Skip to content for accessibility */}
                  <a href="#main-content" className="skip-link">
                    Skip to main content
                  </a>
                  
                  {/* Main Router */}
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <main id="main-content">
                      <AppRouter {...routerProps} />
                    </main>
                  </Suspense>
                  
                  {/* Toast Notifications */}
                  <ToastContainer
                    toasts={toasts}
                    onDismiss={dismissToast}
                  />
                </div>
              </WebSocketProvider>
            </NotificationProvider>
          </AuthProvider>
        </I18nProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;