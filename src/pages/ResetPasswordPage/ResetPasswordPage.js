/**
 * GPS Lab Platform - ResetPasswordPage
 * 
 * Page wrapper for password reset form.
 * Handles token from URL and password reset submission.
 * 
 * @module pages/ResetPasswordPage
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm/ResetPasswordForm';
import './ResetPasswordPage.css';

/**
 * ResetPasswordPage Component
 */
const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  
  // Get token from URL
  const token = searchParams.get('token') || '';
  
  /**
   * Validate token on mount
   */
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError('Invalid or missing reset token. Please request a new password reset link.');
    }
    // TODO: Optionally validate token with API
  }, [token]);
  
  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async ({ password }) => {
    if (!token) {
      setError('Invalid reset token');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // TODO: Call API to reset password
      // await authService.resetPassword(token, password);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
    } catch (err) {
      if (err.status === 400 || err.status === 401) {
        setError('This reset link has expired. Please request a new one.');
      } else {
        setError(err.message || 'Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);
  
  /**
   * Handle back to login
   */
  const handleBackToLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);
  
  /**
   * Handle request new link
   */
  const handleRequestNewLink = useCallback(() => {
    navigate('/forgot-password');
  }, [navigate]);
  
  return (
    <div className="reset-password-page">
      <div className="reset-password-page__container">
        {/* Logo */}
        <div className="reset-password-page__logo">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2"/>
            <path d="M20 8L20 20L28 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="20" cy="20" r="3" fill="currentColor"/>
          </svg>
          <span>GPS Lab</span>
        </div>
        
        {/* Header */}
        <div className="reset-password-page__header">
          <h1 className="reset-password-page__title">
            {success ? 'Password Reset!' : 'Create New Password'}
          </h1>
          {!success && !error && tokenValid && (
            <p className="reset-password-page__subtitle">
              Your new password must be different from previously used passwords.
            </p>
          )}
        </div>
        
        {/* Invalid Token State */}
        {!tokenValid && !success && (
          <div className="reset-password-page__invalid">
            <div className="reset-password-page__invalid-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            </div>
            <h3 className="reset-password-page__invalid-title">Invalid Reset Link</h3>
            <p className="reset-password-page__invalid-text">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <button
              type="button"
              onClick={handleRequestNewLink}
              className="reset-password-page__invalid-btn"
            >
              Request New Link
            </button>
            <button
              type="button"
              onClick={handleBackToLogin}
              className="reset-password-page__invalid-link"
            >
              Back to Login
            </button>
          </div>
        )}
        
        {/* Form */}
        {tokenValid && (
          <ResetPasswordForm
            onSubmit={handleSubmit}
            onBackToLogin={handleBackToLogin}
            isLoading={isLoading}
            error={error}
            success={success}
            token={token}
          />
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;