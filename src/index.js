/**
 * GPS Lab Platform - Application Entry Point
 * 
 * Renders the main App component and imports global styles.
 * 
 * @module index
 */

import React from 'react';
import ReactDOM from 'react-dom/client';

// App component
import App from './App';

// Global styles
import './index.css';

// Performance monitoring (optional)
import reportWebVitals from './reportWebVitals';

/**
 * Strict Mode Wrapper
 * 
 * React.StrictMode helps identify potential problems in the application.
 * It activates additional checks and warnings in development mode.
 */
const StrictModeWrapper = ({ children }) => {
  if (process.env.NODE_ENV === 'development') {
    return <React.StrictMode>{children}</React.StrictMode>;
  }
  return children;
};

/**
 * Root Element
 * 
 * Find the root element in the DOM and create a React root.
 */
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Failed to find the root element. Make sure there is a <div id="root"></div> in your HTML.'
  );
}

const root = ReactDOM.createRoot(rootElement);

/**
 * Render Application
 * 
 * Renders the App component wrapped in StrictMode (in development).
 */
root.render(
  <StrictModeWrapper>
    <App />
  </StrictModeWrapper>
);

/**
 * Web Vitals Reporting
 * 
 * Measures and reports performance metrics.
 * Learn more: https://bit.ly/CRA-vitals
 * 
 * You can send results to an analytics endpoint:
 * reportWebVitals(console.log)
 * reportWebVitals(sendToAnalytics)
 */
reportWebVitals();

/**
 * Service Worker Registration (Optional)
 * 
 * Uncomment to enable PWA features:
 * 
 * import * as serviceWorkerRegistration from './serviceWorkerRegistration';
 * serviceWorkerRegistration.register();
 */

/**
 * Hot Module Replacement (Development)
 * 
 * Enables hot reloading in development without losing state.
 */
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./App', () => {
    root.render(
      <StrictModeWrapper>
        <App />
      </StrictModeWrapper>
    );
  });
}