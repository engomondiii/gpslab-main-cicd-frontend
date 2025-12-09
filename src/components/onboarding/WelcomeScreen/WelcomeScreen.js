/**
 * GPS Lab Platform - WelcomeScreen Component
 * 
 * First screen of the onboarding flow.
 * Displays welcome message and GPS Lab branding.
 * 
 * @module components/onboarding/WelcomeScreen
 */

import React, { useEffect, useState } from 'react';
import './WelcomeScreen.css';

/**
 * WelcomeScreen Component
 */
const WelcomeScreen = ({
  userName = '',
  onContinue,
  isLoading = false,
  className = '',
  ...props
}) => {
  const [isAnimated, setIsAnimated] = useState(false);
  
  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  const displayName = userName || 'Explorer';
  
  const classNames = [
    'welcome-screen',
    isAnimated && 'welcome-screen--animated',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Background Elements */}
      <div className="welcome-screen__bg">
        <div className="welcome-screen__stars">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="welcome-screen__star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        <div className="welcome-screen__orbit welcome-screen__orbit--1" />
        <div className="welcome-screen__orbit welcome-screen__orbit--2" />
        <div className="welcome-screen__orbit welcome-screen__orbit--3" />
      </div>
      
      {/* Content */}
      <div className="welcome-screen__content">
        {/* Compass Logo */}
        <div className="welcome-screen__logo">
          <svg viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="3"/>
            <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
            <path 
              d="M50 10L50 50L80 80" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round"
              className="welcome-screen__needle"
            />
            <circle cx="50" cy="50" r="6" fill="currentColor"/>
            {/* Cardinal Points */}
            <text x="50" y="8" textAnchor="middle" fill="currentColor" fontSize="6" fontWeight="bold">N</text>
            <text x="50" y="97" textAnchor="middle" fill="currentColor" fontSize="6" fontWeight="bold">S</text>
            <text x="5" y="52" textAnchor="middle" fill="currentColor" fontSize="6" fontWeight="bold">W</text>
            <text x="95" y="52" textAnchor="middle" fill="currentColor" fontSize="6" fontWeight="bold">E</text>
          </svg>
        </div>
        
        {/* Title */}
        <h1 className="welcome-screen__title">
          <span className="welcome-screen__title-line">Welcome to</span>
          <span className="welcome-screen__title-brand">GPS Lab</span>
        </h1>
        
        {/* Greeting */}
        <p className="welcome-screen__greeting">
          Hello, <span className="welcome-screen__name">{displayName}</span>!
        </p>
        
        {/* Description */}
        <p className="welcome-screen__description">
          You're about to embark on an extraordinary journey of discovery and growth. 
          GPS Lab will guide you through 35 progressive stages, transforming you from 
          a curious learner into a confident problem solver.
        </p>
        
        {/* Features Preview */}
        <div className="welcome-screen__features">
          <div className="welcome-screen__feature">
            <div className="welcome-screen__feature-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="welcome-screen__feature-text">
              <span className="welcome-screen__feature-title">35 Stages</span>
              <span className="welcome-screen__feature-desc">Progressive learning journey</span>
            </div>
          </div>
          
          <div className="welcome-screen__feature">
            <div className="welcome-screen__feature-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div className="welcome-screen__feature-text">
              <span className="welcome-screen__feature-title">875 Tasks</span>
              <span className="welcome-screen__feature-desc">Hands-on challenges</span>
            </div>
          </div>
          
          <div className="welcome-screen__feature">
            <div className="welcome-screen__feature-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
              </svg>
            </div>
            <div className="welcome-screen__feature-text">
              <span className="welcome-screen__feature-title">Earn Baraka</span>
              <span className="welcome-screen__feature-desc">Real rewards currency</span>
            </div>
          </div>
        </div>
        
        {/* Continue Button */}
        <button
          type="button"
          onClick={onContinue}
          disabled={isLoading}
          className="welcome-screen__continue"
        >
          {isLoading ? (
            <>
              <span className="welcome-screen__continue-spinner" />
              <span>Setting up...</span>
            </>
          ) : (
            <>
              <span>Begin Your Journey</span>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;