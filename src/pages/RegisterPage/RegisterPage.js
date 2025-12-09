/**
 * GPS Lab Platform - RegisterPage Component
 * 
 * Registration page composing RegisterForm inside AuthLayout.
 * 
 * @module pages/RegisterPage/RegisterPage
 */

import React, { useState, useCallback } from 'react';
import AuthLayout from '../../components/layout/AuthLayout/AuthLayout';
import RegisterForm from '../../components/auth/RegisterForm/RegisterForm';
import OAuthButtons from '../../components/auth/OAuthButtons/OAuthButtons';
import './RegisterPage.css';

/**
 * RegisterPage Component
 */
const RegisterPage = ({
  onRegister,
  onOAuthLogin,
  onLogin,
  isLoading = false,
  error = '',
  className = '',
  ...props
}) => {
  
  // OAuth loading state
  const [oauthLoading, setOAuthLoading] = useState(false);
  const [oauthProvider, setOAuthProvider] = useState(null);
  
  /**
   * Handle registration form submission
   */
  const handleRegister = useCallback((data) => {
    if (onRegister) {
      onRegister(data);
    }
  }, [onRegister]);
  
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
   * Handle login navigation
   */
  const handleLogin = useCallback(() => {
    if (onLogin) {
      onLogin();
    } else {
      // Default behavior: navigate to login page
      window.location.href = '/login';
    }
  }, [onLogin]);
  
  const classNames = ['register-page', className].filter(Boolean).join(' ');
  
  // Custom branding content for register page
  const brandingContent = (
    <div className="register-page__branding">
      <h1 className="register-page__branding-title">
        Begin Your Problem-Solving Journey Today
      </h1>
      <p className="register-page__branding-text">
        Join GPS Lab and transform from learner to problem solver through our unique 35-stage journey.
      </p>
      
      {/* Stats */}
      <div className="register-page__stats">
        <div className="register-page__stat">
          <span className="register-page__stat-value">35</span>
          <span className="register-page__stat-label">Progressive Stages</span>
        </div>
        <div className="register-page__stat">
          <span className="register-page__stat-value">875</span>
          <span className="register-page__stat-label">Learning Tasks</span>
        </div>
        <div className="register-page__stat">
          <span className="register-page__stat-value">7</span>
          <span className="register-page__stat-label">Adventures</span>
        </div>
      </div>
      
      {/* Benefits */}
      <div className="register-page__benefits">
        <div className="register-page__benefit">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
          </svg>
          <span>AI-powered Navigator guidance</span>
        </div>
        <div className="register-page__benefit">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
          </svg>
          <span>Earn Baraka currency for real rewards</span>
        </div>
        <div className="register-page__benefit">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
          </svg>
          <span>Learn with Study Parties</span>
        </div>
        <div className="register-page__benefit">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
          </svg>
          <span>Create real-world impact</span>
        </div>
      </div>
    </div>
  );
  
  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Start your GPS journey in minutes"
      brandingContent={brandingContent}
      className={classNames}
      {...props}
    >
      <div className="register-page__content">
        {/* OAuth Buttons */}
        <OAuthButtons
          onOAuthLogin={handleOAuthLogin}
          isLoading={oauthLoading}
          loadingProvider={oauthProvider}
          dividerText="or register with email"
        />
        
        {/* Register Form */}
        <RegisterForm
          onSubmit={handleRegister}
          isLoading={isLoading}
          error={error}
        />
        
        {/* Login Link */}
        <div className="register-page__login">
          <span>Already have an account?</span>
          <button
            type="button"
            onClick={handleLogin}
            className="register-page__login-link"
          >
            Sign in
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;