/**
 * GPS Lab Platform - ForgotPasswordPage
 * 
 * Page wrapper for password reset request form.
 * 
 * @module pages/ForgotPasswordPage
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm/ForgotPasswordForm';
import './ForgotPasswordPage.css';

/**
 * ForgotPasswordPage Component
 */
const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async ({ email, resend }) => {
    setIsLoading(true);
    setError('');
    
    try {
      // TODO: Call API to send password reset email
      // await authService.forgotPassword(email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!resend) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Handle back to login
   */
  const handleBackToLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);
  
  return (
    <div className="forgot-password-page">
      <div className="forgot-password-page__container">
        {/* Logo */}
        <div className="forgot-password-page__logo">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2"/>
            <path d="M20 8L20 20L28 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="20" cy="20" r="3" fill="currentColor"/>
          </svg>
          <span>GPS Lab</span>
        </div>
        
        {/* Header */}
        <div className="forgot-password-page__header">
          <h1 className="forgot-password-page__title">
            {success ? 'Check Your Email' : 'Forgot Password?'}
          </h1>
          {!success && (
            <p className="forgot-password-page__subtitle">
              No worries, we'll send you reset instructions.
            </p>
          )}
        </div>
        
        {/* Form */}
        <ForgotPasswordForm
          onSubmit={handleSubmit}
          onBackToLogin={handleBackToLogin}
          isLoading={isLoading}
          error={error}
          success={success}
        />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;