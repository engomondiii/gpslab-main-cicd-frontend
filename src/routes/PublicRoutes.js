/**
 * GPS Lab Platform - PublicRoutes Component
 * 
 * Defines routes accessible without authentication.
 * Includes login, register, password reset, and public pages.
 * 
 * @module routes/PublicRoutes
 */

import React, { Suspense, lazy } from 'react';
import './PublicRoutes.css';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('../pages/HomePage/HomePage'));
const LoginPage = lazy(() => import('../pages/LoginPage/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage/ResetPasswordPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage/NotFoundPage'));

// Placeholder components for pages not yet created
const PlaceholderPage = ({ title }) => (
  <div className="placeholder-page">
    <h1>{title}</h1>
    <p>This page is coming soon.</p>
  </div>
);

/**
 * Loading fallback component
 */
const RouteLoadingFallback = () => (
  <div className="route-loading">
    <div className="route-loading__spinner">
      <div className="route-loading__spinner-ring" />
      <div className="route-loading__spinner-ring" />
      <div className="route-loading__spinner-ring" />
    </div>
    <p className="route-loading__text">Loading...</p>
  </div>
);

/**
 * Public route configuration
 */
export const PUBLIC_ROUTES = [
  {
    path: '/',
    element: 'HomePage',
    title: 'Welcome to GPS Lab',
    description: 'Start your problem-solving journey'
  },
  {
    path: '/login',
    element: 'LoginPage',
    title: 'Sign In',
    description: 'Sign in to your GPS Lab account'
  },
  {
    path: '/register',
    element: 'RegisterPage',
    title: 'Create Account',
    description: 'Join GPS Lab and start learning'
  },
  {
    path: '/forgot-password',
    element: 'ForgotPasswordPage',
    title: 'Reset Password',
    description: 'Reset your GPS Lab password'
  },
  {
    path: '/reset-password',
    element: 'ResetPasswordPage',
    title: 'Set New Password',
    description: 'Create a new password for your account'
  },
  {
    path: '/reset-password/:token',
    element: 'ResetPasswordPage',
    title: 'Set New Password',
    description: 'Create a new password for your account'
  },
  {
    path: '/about',
    element: 'AboutPage',
    title: 'About GPS Lab',
    description: 'Learn about our mission'
  },
  {
    path: '/features',
    element: 'FeaturesPage',
    title: 'Features',
    description: 'Explore GPS Lab features'
  },
  {
    path: '/pricing',
    element: 'PricingPage',
    title: 'Pricing',
    description: 'GPS Lab subscription plans'
  },
  {
    path: '/contact',
    element: 'ContactPage',
    title: 'Contact Us',
    description: 'Get in touch with GPS Lab'
  },
  {
    path: '/terms',
    element: 'TermsPage',
    title: 'Terms of Service',
    description: 'GPS Lab terms and conditions'
  },
  {
    path: '/privacy',
    element: 'PrivacyPage',
    title: 'Privacy Policy',
    description: 'GPS Lab privacy policy'
  },
  {
    path: '/help',
    element: 'HelpPage',
    title: 'Help Center',
    description: 'Get help with GPS Lab'
  }
];

/**
 * Get component for route element
 */
const getRouteComponent = (elementName) => {
  const components = {
    HomePage: HomePage,
    LoginPage: LoginPage,
    RegisterPage: RegisterPage,
    ForgotPasswordPage: ForgotPasswordPage,
    ResetPasswordPage: ResetPasswordPage,
    NotFoundPage: NotFoundPage,
    // Placeholder for pages not yet implemented
    AboutPage: () => <PlaceholderPage title="About GPS Lab" />,
    FeaturesPage: () => <PlaceholderPage title="Features" />,
    PricingPage: () => <PlaceholderPage title="Pricing" />,
    ContactPage: () => <PlaceholderPage title="Contact Us" />,
    TermsPage: () => <PlaceholderPage title="Terms of Service" />,
    PrivacyPage: () => <PlaceholderPage title="Privacy Policy" />,
    HelpPage: () => <PlaceholderPage title="Help Center" />
  };
  
  return components[elementName] || NotFoundPage;
};

/**
 * PublicRoutes Component
 * 
 * Renders public routes with suspense fallback.
 * Used by AppRouter to define public route group.
 */
const PublicRoutes = ({ 
  onLogin, 
  onRegister, 
  onOAuthLogin,
  isAuthenticated = false,
  redirectIfAuthenticated = '/dashboard'
}) => {
  
  // Build route elements with proper props
  const buildRouteElements = () => {
    return PUBLIC_ROUTES.map(route => {
      const Component = getRouteComponent(route.element);
      
      // Pass handlers to auth pages
      let props = {};
      if (route.element === 'LoginPage') {
        props = { onLogin, onOAuthLogin };
      } else if (route.element === 'RegisterPage') {
        props = { onRegister, onOAuthLogin };
      }
      
      return {
        ...route,
        component: (
          <Suspense fallback={<RouteLoadingFallback />}>
            <Component {...props} />
          </Suspense>
        )
      };
    });
  };
  
  return {
    routes: buildRouteElements(),
    isAuthenticated,
    redirectIfAuthenticated
  };
};

export { RouteLoadingFallback, getRouteComponent, PlaceholderPage };
export default PublicRoutes;