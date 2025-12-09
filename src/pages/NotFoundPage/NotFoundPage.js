/**
 * GPS Lab Platform - NotFoundPage Component
 * 
 * 404 error page with navigation options.
 * 
 * @module pages/NotFoundPage/NotFoundPage
 */

import React from 'react';
import './NotFoundPage.css';

/**
 * NotFoundPage Component
 */
const NotFoundPage = ({
  onGoHome,
  onGoBack,
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist or has been moved.",
  className = '',
  ...props
}) => {
  
  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/';
    }
  };
  
  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      window.history.back();
    }
  };
  
  const classNames = ['not-found-page', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      <div className="not-found-page__content">
        {/* Animated 404 */}
        <div className="not-found-page__code">
          <span className="not-found-page__digit">4</span>
          <span className="not-found-page__compass">
            <svg viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="4"/>
              <path 
                d="M50 15L50 50L75 75" 
                stroke="currentColor" 
                strokeWidth="4" 
                strokeLinecap="round"
                className="not-found-page__compass-needle"
              />
              <circle cx="50" cy="50" r="6" fill="currentColor"/>
              <text x="50" y="12" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="bold">N</text>
              <text x="50" y="95" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="bold">S</text>
              <text x="8" y="54" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="bold">W</text>
              <text x="92" y="54" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="bold">E</text>
            </svg>
          </span>
          <span className="not-found-page__digit">4</span>
        </div>
        
        {/* Message */}
        <h1 className="not-found-page__title">{title}</h1>
        <p className="not-found-page__message">{message}</p>
        
        {/* Navigation Tips */}
        <div className="not-found-page__tips">
          <p>Here are some helpful links:</p>
          <ul>
            <li><a href="/dashboard">Go to Dashboard</a></li>
            <li><a href="/missions">Browse Missions</a></li>
            <li><a href="/help">Visit Help Center</a></li>
          </ul>
        </div>
        
        {/* Actions */}
        <div className="not-found-page__actions">
          <button
            type="button"
            onClick={handleGoBack}
            className="not-found-page__btn not-found-page__btn--secondary"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
            Go Back
          </button>
          <button
            type="button"
            onClick={handleGoHome}
            className="not-found-page__btn not-found-page__btn--primary"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
            Go Home
          </button>
        </div>
        
        {/* Navigator Character */}
        <div className="not-found-page__navigator">
          <div className="not-found-page__navigator-avatar">
            <svg viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2"/>
              <path d="M20 8L20 20L28 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="20" cy="20" r="3" fill="currentColor"/>
            </svg>
          </div>
          <div className="not-found-page__navigator-bubble">
            <p>Looks like you've wandered off the path! Let me help you find your way back to your GPS journey.</p>
          </div>
        </div>
      </div>
      
      {/* Background Decoration */}
      <div className="not-found-page__bg">
        <div className="not-found-page__star not-found-page__star--1" />
        <div className="not-found-page__star not-found-page__star--2" />
        <div className="not-found-page__star not-found-page__star--3" />
        <div className="not-found-page__star not-found-page__star--4" />
        <div className="not-found-page__star not-found-page__star--5" />
      </div>
    </div>
  );
};

export default NotFoundPage;