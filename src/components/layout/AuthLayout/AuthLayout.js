/**
 * GPS Lab Platform - AuthLayout Component
 * 
 * Layout for authentication pages (login, register, forgot password, etc.)
 * Features split design with branding and form.
 * 
 * @module components/layout/AuthLayout/AuthLayout
 * @version 1.1.0
 * 
 * FIXED: Converted all <a href> to React Router <Link> components
 */

import React from 'react';
import { Link } from 'react-router-dom';
import './AuthLayout.css';

const AuthLayout = ({
  children,
  title,
  subtitle,
  showBranding = true,
  brandingContent,
  className = '',
  ...props
}) => {
  
  const classNames = ['auth-layout', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Branding Side */}
      {showBranding && (
        <div className="auth-layout__branding">
          <div className="auth-layout__branding-content">
            {/* Logo - FIXED: Using Link instead of <a> */}
            <Link to="/" className="auth-layout__logo">
              <div className="auth-layout__logo-icon">
                <svg viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2"/>
                  <path d="M20 8L20 20L28 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="20" cy="20" r="3" fill="currentColor"/>
                </svg>
              </div>
              <span className="auth-layout__logo-text">
                <span className="auth-layout__logo-gps">GPS</span>
                <span className="auth-layout__logo-lab">Lab</span>
              </span>
            </Link>
            
            {/* Custom Branding Content or Default */}
            {brandingContent || (
              <div className="auth-layout__branding-default">
                <h1 className="auth-layout__branding-title">
                  Start Your Journey to Becoming a Problem Solver
                </h1>
                <p className="auth-layout__branding-text">
                  Join thousands of learners mastering real-world problem solving through gamified stages, hands-on projects, and a supportive community.
                </p>
                
                {/* Features */}
                <div className="auth-layout__features">
                  <div className="auth-layout__feature">
                    <div className="auth-layout__feature-icon">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                      </svg>
                    </div>
                    <div className="auth-layout__feature-text">
                      <strong>35 Progressive Stages</strong>
                      <span>From fundamentals to venture creation</span>
                    </div>
                  </div>
                  <div className="auth-layout__feature">
                    <div className="auth-layout__feature-icon">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    </div>
                    <div className="auth-layout__feature-text">
                      <strong>Earn Baraka Currency</strong>
                      <span>Redeem for real rewards</span>
                    </div>
                  </div>
                  <div className="auth-layout__feature">
                    <div className="auth-layout__feature-icon">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                      </svg>
                    </div>
                    <div className="auth-layout__feature-text">
                      <strong>Join Study Parties</strong>
                      <span>Learn together, grow faster</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Background Decoration */}
          <div className="auth-layout__branding-bg">
            <div className="auth-layout__branding-circle auth-layout__branding-circle--1" />
            <div className="auth-layout__branding-circle auth-layout__branding-circle--2" />
            <div className="auth-layout__branding-circle auth-layout__branding-circle--3" />
          </div>
        </div>
      )}
      
      {/* Form Side */}
      <div className="auth-layout__form-side">
        <div className="auth-layout__form-container">
          {/* Mobile Logo - FIXED: Using Link instead of <a> */}
          <Link to="/" className="auth-layout__mobile-logo">
            <div className="auth-layout__mobile-logo-icon">
              <svg viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2"/>
                <path d="M20 8L20 20L28 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="20" cy="20" r="3" fill="currentColor"/>
              </svg>
            </div>
            <span className="auth-layout__mobile-logo-text">GPS Lab</span>
          </Link>
          
          {/* Title */}
          {title && (
            <div className="auth-layout__header">
              <h2 className="auth-layout__title">{title}</h2>
              {subtitle && <p className="auth-layout__subtitle">{subtitle}</p>}
            </div>
          )}
          
          {/* Form Content */}
          <div className="auth-layout__form-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;