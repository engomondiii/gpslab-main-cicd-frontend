/**
 * GPS Lab Platform - LoginPage Component
 * 
 * Login page composing LoginForm inside AuthLayout.
 * 
 * @module pages/LoginPage/LoginPage
 */

import React, { useState, useCallback } from 'react';
import AuthLayout from '../../components/layout/AuthLayout/AuthLayout';
import LoginForm from '../../components/auth/LoginForm/LoginForm';
import OAuthButtons from '../../components/auth/OAuthButtons/OAuthButtons';
import './LoginPage.css';

/**
 * LoginPage Component
 */
const LoginPage = ({
  onLogin,
  onOAuthLogin,
  onForgotPassword,
  onRegister,
  isLoading = false,
  error = '',
  className = '',
  ...props
}) => {
  
  // OAuth loading state
  const [oauthLoading, setOAuthLoading] = useState(false);
  const [oauthProvider, setOAuthProvider] = useState(null);
  
  /**
   * Handle login form submission
   */
  const handleLogin = useCallback((credentials) => {
    if (onLogin) {
      onLogin(credentials);
    }
  }, [onLogin]);
  
  /**
   * Handle OAuth login
   */
  const handleOAuthLogin = useCallback((provider) => {
    setOAuthLoading(true);
    setOAuthProvider(provider);
    
    if (onOAuthLogin) {
      onOAuthLogin(provider);
    }
  }, [onOAuthLogin]);
  
  /**
   * Handle forgot password
   */
  const handleForgotPassword = useCallback(() => {
    if (onForgotPassword) {
      onForgotPassword();
    } else {
      // Default behavior: navigate to forgot password page
      window.location.href = '/forgot-password';
    }
  }, [onForgotPassword]);
  
  /**
   * Handle register navigation
   */
  const handleRegister = useCallback(() => {
    if (onRegister) {
      onRegister();
    } else {
      // Default behavior: navigate to register page
      window.location.href = '/register';
    }
  }, [onRegister]);
  
  const classNames = ['login-page', className].filter(Boolean).join(' ');
  
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue your GPS journey"
      className={classNames}
      {...props}
    >
      <div className="login-page__content">
        {/* OAuth Buttons */}
        <OAuthButtons
          onOAuthLogin={handleOAuthLogin}
          isLoading={oauthLoading}
          loadingProvider={oauthProvider}
        />
        
        {/* Login Form */}
        <LoginForm
          onSubmit={handleLogin}
          onForgotPassword={handleForgotPassword}
          isLoading={isLoading}
          error={error}
        />
        
        {/* Register Link */}
        <div className="login-page__register">
          <span>Don't have an account?</span>
          <button
            type="button"
            onClick={handleRegister}
            className="login-page__register-link"
          >
            Sign up for free
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;